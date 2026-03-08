/**
 * Step 2: Synthesize Digest
 *
 * Reads scored items from fetch-sources output, sends to Claude for
 * synthesis, validates against DigestSchema, and writes the structured
 * digest JSON.
 *
 * Usage:
 *   npx tsx scripts/synthesize-digest.ts
 *   npx tsx scripts/synthesize-digest.ts --input .digest-cache/latest.json
 *   npx tsx scripts/synthesize-digest.ts --output src/data/digests
 *   npx tsx scripts/synthesize-digest.ts --dry-run
 */

import fs from "fs";
import path from "path";
import { z } from "zod";

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

import Anthropic from "@anthropic-ai/sdk";

// ─── Digest Schema ────────────────────────────────────────────────────

const HighlightSchema = z.object({
  title: z.string(),
  summary: z.string(),
  source: z.string().url(),
  authors: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
  doi: z.string().optional(),
  score: z.number().min(0).max(1),
  sourceAdapter: z.string(),
  graphSlug: z.string().optional(),
});

export const DigestSchema = z.object({
  week: z.string().regex(/^\d{4}-W\d{2}$/),
  generatedAt: z.string(),
  lookbackDays: z.number().int().positive(),
  highlights: z.array(HighlightSchema).max(5),
  themes: z.array(z.string()).max(5),
  watching: z.array(
    z.object({
      title: z.string(),
      source: z.string().url(),
      reason: z.string(),
    })
  ),
  sources: z.object({
    succeeded: z.array(z.string()),
    failed: z.array(z.string()),
    totalCandidates: z.number().int(),
    afterDedup: z.number().int(),
  }),
});

export type Digest = z.infer<typeof DigestSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;

// ─── Argument Parsing ─────────────────────────────────────────────────

const args = process.argv.slice(2);

function getFlag(name: string, defaultValue: string): string {
  const eqArg = args.find((a) => a.startsWith(`--${name}=`));
  if (eqArg) return eqArg.split("=").slice(1).join("=");
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const inputPath = getFlag("input", ".digest-cache/latest.json");
const outputDir = getFlag("output", "src/data/digests");
const dryRun = args.includes("--dry-run");

// ─── ISO Week ─────────────────────────────────────────────────────────

function getWeekId(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  // Load fetched items
  if (!fs.existsSync(inputPath)) {
    console.error(
      `Input file not found: ${inputPath}\nRun fetch-sources.ts first.`
    );
    process.exit(1);
  }

  const fetchData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const items = fetchData.items ?? [];
  const lookbackDays = fetchData.lookbackDays ?? 14;
  const sourcesInfo = fetchData.sources ?? {
    succeeded: [],
    failed: [],
    totalCandidates: 0,
    afterDedup: 0,
  };

  console.log(`Loaded ${items.length} items from ${inputPath}`);

  if (items.length === 0) {
    console.error("No items to synthesize. Exiting.");
    process.exit(1);
  }

  // Build synthesis prompt
  const itemsText = items
    .map(
      (item: any, i: number) =>
        `[${i + 1}] Title: ${item.title}\n` +
        `    Source: ${item.source} | URL: ${item.url}\n` +
        `    Published: ${item.publishedAt}\n` +
        `    Score: ${item.score?.toFixed(3) ?? "N/A"}\n` +
        (item.doi ? `    DOI: ${item.doi}\n` : "") +
        (item.authors?.length ? `    Authors: ${item.authors.join(", ")}\n` : "") +
        (item.abstract
          ? `    Abstract: ${item.abstract.slice(0, 300)}\n`
          : "")
    )
    .join("\n");

  const synthesisPrompt = `You are a labor market research analyst specializing in AI's impact on employment,
wages, and workforce transformation.

Given the following ${items.length} research items from the past ${lookbackDays} days, produce a weekly
digest. For each highlight, identify which of the following jobsdata.ai prediction
graphs it is most relevant to (use the slug exactly):

DISPLACEMENT: overall-us-displacement, total-us-jobs-lost,
  white-collar-professional-displacement, tech-sector-displacement,
  creative-industry-displacement, education-sector-displacement,
  healthcare-admin-displacement, customer-service-automation
WAGES: median-wage-impact, geographic-wage-divergence, entry-level-wage-impact,
  high-skill-wage-premium, freelancer-rate-impact
ADOPTION: ai-adoption-rate, genai-work-adoption, workforce-ai-exposure,
  earnings-call-ai-mentions

Return ONLY valid JSON. No preamble, no markdown fences.
Schema: {
  "week": "YYYY-WNN",
  "generatedAt": "ISO timestamp",
  "lookbackDays": number,
  "highlights": [max 5, each: {
    "title": string,
    "summary": "2-3 sentences with source citation",
    "source": "URL",
    "authors": [optional],
    "publishedAt": "ISO date" (optional),
    "doi": string (optional),
    "score": 0-1,
    "sourceAdapter": "adapter name",
    "graphSlug": "best-matching slug from the list above"
  }],
  "themes": ["max 5 bulleted themes"],
  "watching": [{
    "title": string,
    "source": "URL",
    "reason": "max 200 chars"
  }],
  "sources": {
    "succeeded": [adapter names],
    "failed": [adapter names],
    "totalCandidates": number,
    "afterDedup": number
  }
}

Week ID for this digest: ${getWeekId(new Date())}
Current timestamp: ${new Date().toISOString()}

ITEMS:
${itemsText}`;

  // Call Claude
  console.log("Synthesizing via Claude API...");
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: synthesisPrompt }],
  });

  // Parse response
  let parsed: unknown;
  try {
    const raw = response.content
      .map((b) => ("text" in b ? b.text : ""))
      .join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  } catch {
    console.error("Claude returned non-JSON response. Check prompt and retry.");
    process.exit(1);
  }

  // Inject source metadata from fetch phase
  (parsed as any).sources = sourcesInfo;
  (parsed as any).lookbackDays = lookbackDays;

  // Validate against schema
  const result = DigestSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Schema validation failed:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    console.error("\nRaw response:");
    console.error(JSON.stringify(parsed, null, 2));
    process.exit(1);
  }

  const digest = result.data;
  console.log(`Digest validated: ${digest.highlights.length} highlights, ${digest.themes.length} themes`);

  // Output
  if (dryRun) {
    console.log("\n--- DRY RUN: Digest JSON ---\n");
    console.log(JSON.stringify(digest, null, 2));
    return;
  }

  // Ensure output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write digest file
  const weekId = digest.week;
  const digestPath = path.join(outputDir, `${weekId}.json`);
  fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));
  console.log(`Wrote digest to ${digestPath}`);

  // Write latest pointer
  const latestPath = path.join(outputDir, "latest.json");
  fs.writeFileSync(
    latestPath,
    JSON.stringify(
      { currentWeek: weekId, generatedAt: digest.generatedAt },
      null,
      2
    )
  );
  console.log(`Updated latest pointer to ${weekId}`);

  // Summary
  console.log("\n--- Digest Summary ---");
  console.log(`Week: ${weekId}`);
  console.log(`Highlights: ${digest.highlights.length}`);
  for (const h of digest.highlights) {
    console.log(`  [${h.score.toFixed(2)}] ${h.title.slice(0, 70)} → ${h.graphSlug ?? "unmapped"}`);
  }
  console.log(`Themes: ${digest.themes.join("; ")}`);
  console.log(`Watching: ${digest.watching.length} items`);
  console.log(
    `Sources: ${sourcesInfo.succeeded.length} ok, ${sourcesInfo.failed.length} failed`
  );
}

// Only run when executed directly (not when imported for schema/types)
if (process.argv[1]?.includes("synthesize-digest")) {
  main().catch((err) => {
    console.error("Synthesis failed:", err);
    process.exit(1);
  });
}
