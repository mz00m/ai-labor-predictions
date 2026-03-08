/**
 * Step 1: Fetch Sources
 *
 * Queries all configured source adapters in parallel, deduplicates by
 * DOI > URL > title similarity, scores each item, and writes raw + scored
 * candidates to the output path.
 *
 * Usage:
 *   npx tsx scripts/fetch-sources.ts
 *   npx tsx scripts/fetch-sources.ts --days 14
 *   npx tsx scripts/fetch-sources.ts --output .digest-cache/latest.json
 *   npx tsx scripts/fetch-sources.ts --query "AI labor market impact"
 */

import fs from "fs";
import path from "path";

// Load .env
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx);
        const value = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}

import {
  ADAPTERS,
  scoreItem,
  type RawItem,
  type SourceName,
} from "./sources.config";

// ─── Argument Parsing ─────────────────────────────────────────────────

const args = process.argv.slice(2);

function getFlag(name: string, defaultValue: string): string {
  const eqArg = args.find((a) => a.startsWith(`--${name}=`));
  if (eqArg) return eqArg.split("=").slice(1).join("=");
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const days = parseInt(getFlag("days", "14"));
const outputPath = getFlag("output", ".digest-cache/latest.json");
const query = getFlag(
  "query",
  "AI labor market impact workforce automation jobs displacement wages"
);
const topN = parseInt(getFlag("top", "60"));

// ─── Deduplication ────────────────────────────────────────────────────

function levenshteinRatio(a: string, b: string): number {
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  if (al === bl) return 1;

  const matrix: number[][] = [];
  for (let i = 0; i <= al.length; i++) {
    matrix[i] = [i];
    for (let j = 1; j <= bl.length; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else {
        const cost = al[i - 1] === bl[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
  }

  const maxLen = Math.max(al.length, bl.length);
  return maxLen === 0 ? 1 : 1 - matrix[al.length][bl.length] / maxLen;
}

function deduplicate(items: RawItem[]): RawItem[] {
  const seen = new Map<string, RawItem>();
  const result: RawItem[] = [];

  for (const item of items) {
    // 1. Exact DOI match
    if (item.doi) {
      if (seen.has(`doi:${item.doi}`)) continue;
      seen.set(`doi:${item.doi}`, item);
    }

    // 2. Exact URL match
    if (seen.has(`url:${item.url}`)) continue;
    seen.set(`url:${item.url}`, item);

    // 3. Title fuzzy similarity >= 0.85
    let isDupe = false;
    for (const existing of result) {
      if (levenshteinRatio(item.title, existing.title) >= 0.85) {
        isDupe = true;
        break;
      }
    }

    if (!isDupe) {
      result.push(item);
    }
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────

interface SourceHealth {
  name: SourceName;
  status: "ok" | "error";
  items: number;
  durationMs: number;
  error?: string;
}

async function main() {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const now = new Date();

  console.log(`Fetching sources for the past ${days} days (since ${since.toISOString().split("T")[0]})...`);
  console.log(`Query: "${query}"`);
  console.log(`Adapters: ${ADAPTERS.map((a) => a.name).join(", ")}\n`);

  // Run all adapters in parallel
  const adapterResults = await Promise.allSettled(
    ADAPTERS.map(async (adapter): Promise<{ adapter: typeof adapter; items: RawItem[]; durationMs: number }> => {
      const start = Date.now();
      const items = await adapter.fetch(query, since);
      return { adapter, items, durationMs: Date.now() - start };
    })
  );

  // Collect results and health metadata
  const allItems: RawItem[] = [];
  const sourceHealth: SourceHealth[] = [];
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < adapterResults.length; i++) {
    const result = adapterResults[i];
    const adapter = ADAPTERS[i];

    if (result.status === "fulfilled") {
      allItems.push(...result.value.items);
      succeeded.push(adapter.name);
      sourceHealth.push({
        name: adapter.name,
        status: "ok",
        items: result.value.items.length,
        durationMs: result.value.durationMs,
      });
      console.log(
        `  [ok] ${adapter.name}: ${result.value.items.length} items (${result.value.durationMs}ms)`
      );
    } else {
      failed.push(adapter.name);
      sourceHealth.push({
        name: adapter.name,
        status: "error",
        items: 0,
        durationMs: 0,
        error: String(result.reason),
      });
      console.warn(
        `  [error] ${adapter.name}: ${result.reason}`
      );
    }
  }

  console.log(`\nTotal candidates: ${allItems.length}`);

  // Deduplicate
  const deduped = deduplicate(allItems);
  console.log(`After dedup: ${deduped.length}`);

  // Score and sort
  const scored = deduped
    .map((item) => ({
      ...item,
      publishedAt: item.publishedAt.toISOString(),
      score: scoreItem(item, query, now),
    }))
    .sort((a, b) => b.score - a.score);

  // Take top N
  const topItems = scored.slice(0, topN);
  console.log(`Top ${topN} items selected for synthesis\n`);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  const output = {
    fetchedAt: now.toISOString(),
    query,
    lookbackDays: days,
    sources: {
      succeeded,
      failed,
      totalCandidates: allItems.length,
      afterDedup: deduped.length,
    },
    sourceHealth,
    items: topItems,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${topItems.length} scored items to ${outputPath}`);

  // Print top 5
  console.log("\nTop 5:");
  for (const item of topItems.slice(0, 5)) {
    console.log(
      `  [${item.score.toFixed(3)}] ${item.title.slice(0, 80)} (${item.source})`
    );
  }
}

main().catch((err) => {
  console.error("Fetch failed:", err);
  process.exit(1);
});
