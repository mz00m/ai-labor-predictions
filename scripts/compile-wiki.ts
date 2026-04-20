#!/usr/bin/env tsx
/**
 * Wiki Compiler for jobsdata.ai Knowledge Base
 *
 * Reads confirmed sources, prediction JSONs, and compiled KBs,
 * then generates a structured markdown wiki with cross-links and indexes.
 *
 * Output: wiki/ directory with interlinked .md files
 * Zero impact on public site — wiki/ is gitignored and read-only to the app.
 *
 * Usage: npx tsx scripts/compile-wiki.ts
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const WIKI = path.join(ROOT, "wiki");
const DATA = path.join(ROOT, "src/data");

// ── Helpers ──────────────────────────────────────────────────

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function tierLabel(tier: number): string {
  const labels: Record<number, string> = {
    1: "Tier 1 — Verified Data & Research",
    2: "Tier 2 — Institutional Analysis",
    3: "Tier 3 — Journalism & Commentary",
    4: "Tier 4 — Informal & Social",
  };
  return labels[tier] || `Tier ${tier}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Unknown";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Load Data ────────────────────────────────────────────────

console.log("Loading data...");

const sourcesData = readJSON(path.join(DATA, "confirmed-sources.json"));
const sources: Record<string, any> = sourcesData.sources;
const sourceIds = Object.keys(sources);

const predictionFiles = fs
  .readdirSync(path.join(DATA, "predictions"), { recursive: true })
  .filter((f) => String(f).endsWith(".json") && !String(f).includes("_archived"))
  .map((f) => String(f));

const predictions: any[] = predictionFiles.map((f) =>
  readJSON(path.join(DATA, "predictions", f))
);

console.log(
  `Loaded ${sourceIds.length} sources, ${predictions.length} predictions`
);

// ── Build reverse index: source → predictions ────────────────

const sourceToPredictons: Record<string, string[]> = {};
for (const pred of predictions) {
  for (const dp of pred.history || []) {
    for (const sid of dp.sourceIds || []) {
      if (!sourceToPredictons[sid]) sourceToPredictons[sid] = [];
      if (!sourceToPredictons[sid].includes(pred.slug))
        sourceToPredictons[sid].push(pred.slug);
    }
  }
  for (const ov of pred.overlays || []) {
    for (const sid of ov.sourceIds || []) {
      if (!sourceToPredictons[sid]) sourceToPredictons[sid] = [];
      if (!sourceToPredictons[sid].includes(pred.slug))
        sourceToPredictons[sid].push(pred.slug);
    }
  }
}

// ── Build publisher index ────────────────────────────────────

const publisherSources: Record<string, string[]> = {};
for (const [id, src] of Object.entries(sources) as [string, any][]) {
  const pub = src.publisher || "Unknown";
  if (!publisherSources[pub]) publisherSources[pub] = [];
  publisherSources[pub].push(id);
}

// ── Build tier index ─────────────────────────────────────────

const tierSources: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [] };
for (const [id, src] of Object.entries(sources) as [string, any][]) {
  const tier = src.evidenceTier || 4;
  tierSources[tier].push(id);
}

// ── Generate: Master Index ───────────────────────────────────

console.log("Generating wiki...");

let indexContent = `# jobsdata.ai Knowledge Base

> Auto-compiled wiki of ${sourceIds.length} sources across ${predictions.length} predictions.
> Last compiled: ${new Date().toISOString().split("T")[0]}

## How to Use This Wiki

This wiki is designed for LLM-assisted research. Start here, then drill into any file.
Every file has a 2-3 line summary at the top so an LLM can scan the index and decide
which files to read in full.

## Predictions (${predictions.length})

| Prediction | Category | Current Value | Sources | Link |
|-----------|----------|---------------|---------|------|
`;

for (const pred of predictions.sort((a, b) => a.category.localeCompare(b.category))) {
  const srcCount =
    (pred.history?.length || 0) + (pred.overlays?.length || 0);
  indexContent += `| ${pred.title} | ${pred.category} | ${pred.currentValue}${pred.unit ? " " + pred.unit : ""} | ${srcCount} data points | [→](predictions/${pred.slug}.md) |\n`;
}

indexContent += `
## Sources by Evidence Tier

| Tier | Count | Link |
|------|-------|------|
| Tier 1 — Verified Data & Research | ${tierSources[1].length} | [→](indexes/tier-1.md) |
| Tier 2 — Institutional Analysis | ${tierSources[2].length} | [→](indexes/tier-2.md) |
| Tier 3 — Journalism & Commentary | ${tierSources[3].length} | [→](indexes/tier-3.md) |
| Tier 4 — Informal & Social | ${tierSources[4].length} | [→](indexes/tier-4.md) |

## Sources by Publisher (${Object.keys(publisherSources).length} publishers)

[→ Full publisher index](indexes/publishers.md)

Top publishers:
`;

const topPubs = Object.entries(publisherSources)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 15);

for (const [pub, ids] of topPubs) {
  indexContent += `- **${pub}** — ${ids.length} sources\n`;
}

indexContent += `
## Category Overviews

- [Displacement](categories/displacement.md) — ${predictions.filter((p) => p.category === "displacement").length} predictions
- [Wages](categories/wages.md) — ${predictions.filter((p) => p.category === "wages").length} predictions
- [Adoption](categories/adoption.md) — ${predictions.filter((p) => p.category === "adoption").length} predictions
- [Exposure](categories/exposure.md) — ${predictions.filter((p) => p.category === "exposure").length} predictions
- [Signals](categories/signals.md) — ${predictions.filter((p) => p.category === "signals").length} predictions

## Quick Stats

- **Total sources:** ${sourceIds.length} (${sourcesData.verifiedCount} verified)
- **Evidence quality:** ${tierSources[1].length} Tier 1, ${tierSources[2].length} Tier 2, ${tierSources[3].length} Tier 3, ${tierSources[4].length} Tier 4
- **Data last updated:** ${sourcesData.lastUpdated}
`;

writeFile(path.join(WIKI, "index.md"), indexContent);

// ── Generate: Prediction Pages ───────────────────────────────

for (const pred of predictions) {
  let content = `# ${pred.title}

> **Category:** ${pred.category} | **Unit:** ${pred.unit} | **Current value:** ${pred.currentValue} | **Method:** ${pred.aggregationMethod}
> ${pred.description}

## Data Points (${pred.history?.length || 0})

| Date | Value | Range | Source | Tier | Type | Proxy |
|------|-------|-------|--------|------|------|-------|
`;

  for (const dp of (pred.history || []).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )) {
    const range =
      dp.confidenceLow != null
        ? `${dp.confidenceLow}–${dp.confidenceHigh}`
        : "—";
    const srcLinks = (dp.sourceIds || [])
      .map((id: string) => {
        const src = sources[id];
        return src ? `[${src.publisher}](../sources/${id}.md)` : id;
      })
      .join(", ");
    content += `| ${formatDate(dp.date)} | **${dp.value}** | ${range} | ${srcLinks} | ${dp.evidenceTier} | ${dp.dataType || "—"} | ${dp.isProxy ? "Yes" : "No"} |\n`;
  }

  if (pred.overlays?.length) {
    content += `\n## Directional Signals (${pred.overlays.length})\n\n`;
    for (const ov of pred.overlays.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )) {
      const dir = ov.direction === "up" ? "↑" : ov.direction === "down" ? "↓" : "→";
      const srcLinks = (ov.sourceIds || [])
        .map((id: string) => `[source](../sources/${id}.md)`)
        .join(", ");
      content += `- ${dir} **${formatDate(ov.date)}** (Tier ${ov.evidenceTier}) — ${ov.label} ${srcLinks}\n`;
    }
  }

  // Key findings synthesis
  const observedPoints = (pred.history || []).filter(
    (dp: any) => dp.dataType === "observed"
  );
  const projectedPoints = (pred.history || []).filter(
    (dp: any) => dp.dataType === "projected"
  );
  const proxyPoints = (pred.history || []).filter((dp: any) => dp.isProxy);

  content += `\n## Summary\n\n`;
  content += `- **${pred.history?.length || 0} data points** from ${new Set((pred.history || []).flatMap((dp: any) => dp.sourceIds || [])).size} unique sources\n`;
  content += `- **Observed data:** ${observedPoints.length} points\n`;
  content += `- **Projected data:** ${projectedPoints.length} points\n`;
  content += `- **Proxy measurements:** ${proxyPoints.length} points (weighted at 0.5x)\n`;

  if (observedPoints.length > 0 && projectedPoints.length > 0) {
    const avgObserved =
      observedPoints.reduce((s: number, dp: any) => s + dp.value, 0) /
      observedPoints.length;
    const avgProjected =
      projectedPoints.reduce((s: number, dp: any) => s + dp.value, 0) /
      projectedPoints.length;
    content += `- **Observed avg:** ${avgObserved.toFixed(1)} vs **Projected avg:** ${avgProjected.toFixed(1)} — ${Math.abs(avgProjected - avgObserved).toFixed(1)}pp gap\n`;
  }

  content += `\n## All Sources\n\n`;
  const allSourceIds = new Set<string>();
  for (const dp of pred.history || [])
    for (const id of dp.sourceIds || []) allSourceIds.add(id);
  for (const ov of pred.overlays || [])
    for (const id of ov.sourceIds || []) allSourceIds.add(id);

  for (const id of allSourceIds) {
    const src = sources[id];
    if (src) {
      content += `- [${src.title}](../sources/${id}.md) — ${src.publisher}, ${formatDate(src.datePublished)}, Tier ${src.evidenceTier}\n`;
    }
  }

  writeFile(path.join(WIKI, "predictions", `${pred.slug}.md`), content);
}

// ── Generate: Source Pages ───────────────────────────────────

for (const [id, src] of Object.entries(sources) as [string, any][]) {
  const usedInPredictions = sourceToPredictons[id] || src.usedIn || [];

  let content = `# ${src.title}

> **Publisher:** ${src.publisher} | **Tier:** ${tierLabel(src.evidenceTier)} | **Published:** ${formatDate(src.datePublished)}
> **ID:** ${id} | **Verified:** ${src.verified ? "Yes" : "No"}

## Key Findings

${src.excerpt || "No excerpt available."}

## Used In

`;

  for (const slug of usedInPredictions) {
    const pred = predictions.find((p) => p.slug === slug);
    if (pred) {
      content += `- [${pred.title}](../predictions/${slug}.md)\n`;
    } else {
      content += `- ${slug}\n`;
    }
  }

  if (src.url) {
    content += `\n## Original Source\n\n[${src.url}](${src.url})\n`;
  }

  writeFile(path.join(WIKI, "sources", `${id}.md`), content);
}

// ── Generate: Tier Index Pages ───────────────────────────────

for (const [tier, ids] of Object.entries(tierSources)) {
  const tierNum = Number(tier);
  let content = `# ${tierLabel(tierNum)}

> ${ids.length} sources at this evidence tier.

| Source | Publisher | Date | Predictions |
|--------|-----------|------|-------------|
`;

  const sorted = ids
    .map((id) => sources[id])
    .filter(Boolean)
    .sort(
      (a: any, b: any) =>
        new Date(b.datePublished).getTime() -
        new Date(a.datePublished).getTime()
    );

  for (const src of sorted) {
    const predLinks = (sourceToPredictons[src.id] || src.usedIn || [])
      .map((slug: string) => slug)
      .join(", ");
    content += `| [${src.title}](../sources/${src.id}.md) | ${src.publisher} | ${formatDate(src.datePublished)} | ${predLinks || "—"} |\n`;
  }

  writeFile(path.join(WIKI, "indexes", `tier-${tier}.md`), content);
}

// ── Generate: Publisher Index ────────────────────────────────

let pubContent = `# Sources by Publisher

> ${Object.keys(publisherSources).length} publishers, ${sourceIds.length} total sources.

`;

const sortedPubs = Object.entries(publisherSources).sort(
  (a, b) => b[1].length - a[1].length
);

for (const [pub, ids] of sortedPubs) {
  pubContent += `## ${pub} (${ids.length})\n\n`;
  for (const id of ids) {
    const src = sources[id];
    if (src) {
      pubContent += `- [${src.title}](../sources/${id}.md) — ${formatDate(src.datePublished)}, Tier ${src.evidenceTier}\n`;
    }
  }
  pubContent += "\n";
}

writeFile(path.join(WIKI, "indexes", "publishers.md"), pubContent);

// ── Generate: Category Overview Pages ────────────────────────

const categories = [...new Set(predictions.map((p) => p.category))];

for (const cat of categories) {
  const catPreds = predictions.filter((p) => p.category === cat);
  let content = `# ${cat.charAt(0).toUpperCase() + cat.slice(1)} Predictions

> ${catPreds.length} predictions tracking ${cat}-related metrics.

`;

  for (const pred of catPreds) {
    content += `## [${pred.title}](../predictions/${pred.slug}.md)\n\n`;
    content += `**Current value:** ${pred.currentValue} ${pred.unit} | **Method:** ${pred.aggregationMethod}\n\n`;
    content += `${pred.description}\n\n`;

    // Quick stats
    const observed = (pred.history || []).filter(
      (dp: any) => dp.dataType === "observed"
    );
    const projected = (pred.history || []).filter(
      (dp: any) => dp.dataType === "projected"
    );
    content += `- ${pred.history?.length || 0} data points (${observed.length} observed, ${projected.length} projected)\n`;
    content += `- ${pred.overlays?.length || 0} directional signals\n\n`;
  }

  // Cross-cutting analysis
  content += `## Cross-Cutting Summary\n\n`;
  const allValues = catPreds
    .filter((p) => p.currentValue != null)
    .map((p) => ({ title: p.title, value: p.currentValue, unit: p.unit }));
  content += `| Prediction | Current Value |\n|-----------|---------------|\n`;
  for (const v of allValues) {
    content += `| ${v.title} | ${v.value} ${v.unit} |\n`;
  }

  writeFile(path.join(WIKI, "categories", `${cat}.md`), content);
}

// ── Generate: Source Briefs Index (for LLM scanning) ─────────

let briefsContent = `# Source Briefs Index

> One-line summary of every source. An LLM should read this file first to find relevant sources, then drill into individual source pages.

`;

const sortedSources = Object.values(sources)
  .sort(
    (a: any, b: any) =>
      new Date(b.datePublished).getTime() -
      new Date(a.datePublished).getTime()
  ) as any[];

for (const src of sortedSources) {
  const excerpt = src.excerpt
    ? src.excerpt.substring(0, 150).replace(/\n/g, " ")
    : "No excerpt";
  briefsContent += `- **${src.id}** (T${src.evidenceTier}, ${formatDate(src.datePublished)}) — ${excerpt}${src.excerpt && src.excerpt.length > 150 ? "..." : ""}\n`;
}

writeFile(path.join(WIKI, "indexes", "source-briefs.md"), briefsContent);

// ── Stats ────────────────────────────────────────────────────

const fileCount =
  1 + // index
  predictions.length + // prediction pages
  sourceIds.length + // source pages
  4 + // tier indexes
  1 + // publisher index
  categories.length + // category overviews
  1; // source briefs

console.log(`\nWiki compiled successfully!`);
console.log(`  ${fileCount} files written to wiki/`);
console.log(`  ${predictions.length} prediction pages`);
console.log(`  ${sourceIds.length} source pages`);
console.log(`  ${categories.length} category overviews`);
console.log(`  5 index files`);
console.log(`\nStart here: wiki/index.md`);
