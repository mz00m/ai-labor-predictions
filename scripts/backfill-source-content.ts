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
import { loadEnv } from "./lib/load-env";

loadEnv();
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

  // Filter to target tiers — include all sources (verified, synthetic, etc.)
  let targets = allSources.filter(
    (s) => tiers.includes(s.evidenceTier)
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
      let sourceText: string | null = null;
      const hasUrl = source.url && source.url.startsWith("http");

      if (hasUrl) {
        // Try fetching from URL with 15s timeout
        console.log(`${prefix} Fetching: ${source.id} (${source.url.slice(0, 80)}...)`);
        try {
          const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Fetch timeout")), 15000)
          );
          const content = await Promise.race([fetchSource(source.url, "url"), timeout]);
          if (content.text && content.text.trim().length >= 100) {
            sourceText = content.text;
          }
        } catch {
          // Fall through to excerpt-based extraction
        }
      }

      // Fall back to excerpt if URL fetch failed or no URL
      if (!sourceText) {
        if (source.excerpt && source.excerpt.length > 10) {
          console.log(`${prefix} Using excerpt for: ${source.id}`);
          sourceText = `Title: ${source.title}\nPublisher: ${source.publisher}\nDate: ${source.datePublished}\n\n${source.excerpt}`;
        } else {
          console.log(`${prefix} SKIP: No URL and no excerpt for ${source.id}`);
          failed++;
          continue;
        }
      }

      // Extract rich content using shared extractor
      console.log(`${prefix} Extracting content (${sourceText.length} chars)...`);
      const entry = await extractSourceContent(source.id, sourceText, {
        title: source.title,
        publisher: source.publisher,
        datePublished: source.datePublished,
        evidenceTier: source.evidenceTier,
        url: source.url || "",
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
