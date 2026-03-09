#!/usr/bin/env tsx
/**
 * Backfill source content store for chatbot grounding.
 *
 * Fetches all tier source URLs, sends text to Claude for
 * rich content extraction (abstract, key findings, methodology,
 * qualifiers), and writes per-source JSON files.
 *
 * Usage:
 *   npx tsx scripts/backfill-source-content.ts [--tier 1,2] [--limit 10] [--dry-run] [--skip-existing]
 */

import fs from "fs";
import path from "path";

// Load .env manually (same pattern as ingest-source.ts)
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
import { fetchSource } from "./lib/ingest/fetcher";
import {
  extractSourceContent,
  writeSourceContentEntry,
  hasSourceContent,
} from "./lib/ingest/content-extractor";

interface SourceEntry {
  id: string;
  title: string;
  url: string;
  publisher: string;
  evidenceTier: number;
  datePublished: string;
  excerpt?: string;
  usedIn: string[];
  verified: boolean;
  synthetic: boolean;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let tiers = [1, 2, 3, 4];
  let limit = Infinity;
  let dryRun = false;
  let skipExisting = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--tier" && args[i + 1]) {
      tiers = args[i + 1].split(",").map(Number);
      i++;
    } else if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--skip-existing") {
      skipExisting = true;
    }
  }

  return { tiers, limit, dryRun, skipExisting };
}

async function main() {
  const { tiers, limit, dryRun, skipExisting } = parseArgs();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is required. Set it in .env");
    process.exit(1);
  }

  // Load confirmed sources
  const csPath = path.join(process.cwd(), "src/data/confirmed-sources.json");
  const cs = JSON.parse(fs.readFileSync(csPath, "utf-8"));
  const allSources: SourceEntry[] = Object.values(cs.sources);

  // Filter to target tiers
  let targets = allSources.filter(
    (s) =>
      tiers.includes(s.evidenceTier) &&
      s.verified &&
      s.synthetic === false &&
      s.url &&
      s.url.startsWith("http")
  );

  // Skip already-processed sources
  if (skipExisting) {
    targets = targets.filter((s) => !hasSourceContent(s.id));
  }

  // Apply limit
  targets = targets.slice(0, limit);

  console.log(
    `Backfilling source content: ${targets.length} sources (tiers: ${tiers.join(",")})${dryRun ? " [DRY RUN]" : ""}`
  );

  if (targets.length === 0) {
    console.log("No sources to process.");
    return;
  }

  if (dryRun) {
    for (const s of targets) {
      console.log(`  Would process: [T${s.evidenceTier}] ${s.id} — ${s.title}`);
    }
    return;
  }

  let processed = 0;
  let failed = 0;

  for (const source of targets) {
    const idx = processed + failed + 1;
    const prefix = `[${idx}/${targets.length}]`;

    try {
      // Fetch source content
      console.log(`${prefix} Fetching: ${source.id} (${source.url.slice(0, 80)}...)`);
      const content = await fetchSource(source.url, "url");

      if (!content.text || content.text.trim().length < 100) {
        console.log(`${prefix} SKIP: Content too short (${content.text?.length || 0} chars)`);
        failed++;
        continue;
      }

      // Extract rich content using shared extractor
      console.log(`${prefix} Extracting content (${content.text.length} chars)...`);
      const entry = await extractSourceContent(source.id, content.text, {
        title: source.title,
        publisher: source.publisher,
        datePublished: source.datePublished,
        evidenceTier: source.evidenceTier,
        url: source.url,
        excerpt: source.excerpt,
      });

      writeSourceContentEntry(entry);
      console.log(
        `${prefix} OK: ${entry.keyFindings.length} findings, ${entry.abstract.length} char abstract`
      );
      processed++;

      // Rate limit: ~1 request per second
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${prefix} FAIL: ${source.id} — ${msg}`);
      failed++;
    }
  }

  console.log(`\nDone: ${processed} processed, ${failed} failed`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
