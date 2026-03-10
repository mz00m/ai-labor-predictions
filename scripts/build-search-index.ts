#!/usr/bin/env npx tsx
/**
 * build-search-index — Generate a consolidated search index from
 * confirmed-sources.json + source-content/*.json + prediction overlays.
 *
 * Output: src/data/search-index.json
 *   Maps each sourceId to a single pre-built haystack string containing
 *   all searchable text (title, publisher, excerpt, abstract, key findings,
 *   methodology, qualifiers, overlay labels).
 *
 * Run after:
 *   - Ingesting new sources
 *   - Running backfill-source-content.ts
 *
 * Usage:
 *   npx tsx scripts/build-search-index.ts
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CS_PATH = path.join(ROOT, "src/data/confirmed-sources.json");
const CONTENT_DIR = path.join(ROOT, "src/data/source-content");
const PRED_DIR = path.join(ROOT, "src/data/predictions");
const OUTPUT_PATH = path.join(ROOT, "src/data/search-index.json");

interface ConfirmedSource {
  id: string;
  title: string;
  publisher: string;
  excerpt?: string;
  evidenceTier: number;
  usedIn: string[];
  datePublished: string;
  url?: string;
  _action?: string;
}

interface SourceContent {
  id: string;
  abstract: string;
  keyFindings: string[];
  methodology: string;
  qualifiers: string;
}

interface PredictionFile {
  slug: string;
  sources: Array<{ id: string; excerpt?: string }>;
  overlays?: Array<{ label: string; sourceIds: string[] }>;
}

function main() {
  // 1. Load confirmed sources
  const cs = JSON.parse(fs.readFileSync(CS_PATH, "utf-8"));
  const sources: Record<string, ConfirmedSource> = cs.sources;

  // 2. Load source-content files
  const contentMap: Record<string, SourceContent> = {};
  if (fs.existsSync(CONTENT_DIR)) {
    const contentFiles = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
    for (const file of contentFiles) {
      const data: SourceContent = JSON.parse(
        fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
      );
      contentMap[data.id] = data;
    }
  }

  // 3. Load prediction-level excerpts and overlay labels
  const predExtraText: Record<string, Set<string>> = {};
  const predFiles: string[] = [];
  for (const cat of fs.readdirSync(PRED_DIR)) {
    const catDir = path.join(PRED_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const f of fs.readdirSync(catDir)) {
      if (f.endsWith(".json")) predFiles.push(path.join(catDir, f));
    }
  }
  for (const pf of predFiles) {
    const pred: PredictionFile = JSON.parse(fs.readFileSync(pf, "utf-8"));
    for (const s of pred.sources) {
      if (s.excerpt) {
        (predExtraText[s.id] ??= new Set()).add(s.excerpt);
      }
    }
    for (const o of pred.overlays ?? []) {
      if (o.label) {
        for (const sid of o.sourceIds) {
          (predExtraText[sid] ??= new Set()).add(o.label);
        }
      }
    }
  }

  // 4. Build haystack per source
  const index: Record<string, string> = {};
  let withContent = 0;

  for (const [id, source] of Object.entries(sources)) {
    if (source._action === "REMOVE") continue;

    const parts: string[] = [
      source.title,
      source.publisher,
      source.excerpt ?? "",
    ];

    // Add prediction-level text
    const predExtra = predExtraText[id];
    if (predExtra) {
      parts.push(Array.from(predExtra).join(" "));
    }

    // Add rich source content (abstract, findings, methodology, qualifiers)
    const content = contentMap[id];
    if (content) {
      withContent++;
      parts.push(content.abstract);
      parts.push(content.keyFindings.join(" "));
      parts.push(content.methodology);
      parts.push(content.qualifiers);
    }

    index[id] = parts.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
  }

  // 5. Write output
  const output = JSON.stringify(index);
  fs.writeFileSync(OUTPUT_PATH, output + "\n");

  const sizeKB = (Buffer.byteLength(output) / 1024).toFixed(1);
  const totalSources = Object.keys(index).length;
  console.log(`Search index built: ${totalSources} sources, ${sizeKB} KB`);
  console.log(`  With rich content: ${withContent}/${totalSources}`);
  console.log(`  Output: ${OUTPUT_PATH}`);
}

main();
