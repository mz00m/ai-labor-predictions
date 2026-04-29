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
import {
  JOB_PROFILES,
  CATEGORY_TOKEN_PROFILES,
  MODEL_PRICING,
  DEPLOYMENT_OVERHEAD,
  calculateCrossoverYear,
  calculateAdoptionYear,
  calculateJobExposure,
  getTaskTokenCost,
  type JobProfile,
  type JobTask,
} from "../src/data/job-tasks";
import {
  TASK_CATEGORY_META,
  CATEGORY_DECLINE_RATES,
  CATEGORY_ADOPTION_LAG,
  type TaskCategory,
} from "../src/data/task-categories";
import {
  INDUSTRY_ADOPTION_SPEED,
  SOC_INDUSTRY_SPEED,
} from "../src/data/industry-adoption-speed";
import {
  OCCUPATION_GROUPS,
  TOTAL_EMPLOYMENT,
  CATEGORY_COMPUTE_COSTS,
  INCOME_TIER_META,
  EXPOSURE_UNCERTAINTY,
  SOC_EXPOSURE_SCORES,
  CFO_SURVEY_NEI,
  DEMAND_ELASTICITY,
  DEMAND_ELASTICITY_META,
  SOC_TO_JOB_IDS,
  DECLINE_RATE_SCENARIOS,
  getAutomationPercentAtYear,
  generateEconomyTimeline,
} from "../src/data/economy-occupations";
import {
  FORECAST_PREDICTIONS,
  ECONOMY_RADAR,
  ECONOMIST_VIEWS,
} from "../src/data/forecast";

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

## Task Visualizer Model (jobsdata.ai economic model)

Quantitative bottom-up model for industry impact predictions. Each job is decomposed into tasks; each task is scored on AI capability, current compute cost, and annual cost decline rate. Crossover years are derived from the year compute cost (with 5x deployment overhead) drops below the human wage rate.

- [Task Visualizer Index](task-visualizer/index.md) — start here
- [Job Profiles (${JOB_PROFILES.length})](task-visualizer/jobs.md) — per-occupation task breakdowns with exposure scores
- [Occupation Groups (${OCCUPATION_GROUPS.length})](task-visualizer/occupation-groups.md) — SOC major-group economy view
- [Task Categories (${Object.keys(TASK_CATEGORY_META).length})](task-visualizer/task-categories.md) — the 8 work categories with decline rates and adoption lag
- [Industry Adoption Speeds](task-visualizer/industry-speeds.md) — multipliers for institutional friction
- [Forecast Predictions (${FORECAST_PREDICTIONS.length})](task-visualizer/forecasts.md) — point predictions with confidence intervals + economist commentary
- [Methodology](task-visualizer/methodology.md) — token economics, crossover formula, exposure score

## Quick Stats

- **Total sources:** ${sourceIds.length} (${sourcesData.verifiedCount} verified)
- **Evidence quality:** ${tierSources[1].length} Tier 1, ${tierSources[2].length} Tier 2, ${tierSources[3].length} Tier 3, ${tierSources[4].length} Tier 4
- **Data last updated:** ${sourcesData.lastUpdated}
- **Task visualizer:** ${JOB_PROFILES.length} jobs, ${OCCUPATION_GROUPS.length} SOC groups (${TOTAL_EMPLOYMENT.toLocaleString()}K workers), ${FORECAST_PREDICTIONS.length} forecasts
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

// ── Generate: Task Visualizer Pages ──────────────────────────
// Bottom-up economic model. Each job decomposes into tasks; each task has
// AI capability, current compute cost, and annual cost decline. Crossover
// year = year compute cost (with 5x deployment overhead) drops below human
// wage rate. Used as primary input for industry impact predictions.

const TV = "task-visualizer";

// Task Visualizer master index
let tvIndex = `# Task Visualizer Model

> Bottom-up economic model of AI's task-level impact across ${JOB_PROFILES.length} jobs and ${OCCUPATION_GROUPS.length} SOC major occupation groups.

## How to use this section for industry impact predictions

For an industry-level prediction, combine three layers:

1. **Task composition** — what fraction of the work is information-processing, analysis, interpersonal, etc. Pulled from O*NET work activities. See [Task Categories](task-categories.md).
2. **Cost dynamics** — current compute cost, annual decline rate, and human wage. Crossover year = when compute < human wage at 5x deployment overhead. See [Methodology](methodology.md).
3. **Institutional drag** — adoption lag (years beyond crossover) for each task category, scaled by industry-specific friction (regulatory, union, capital intensity). See [Industry Speeds](industry-speeds.md).

The economy view ([Occupation Groups](occupation-groups.md)) precomputes automation pressure year-by-year per SOC group; the job view ([Jobs](jobs.md)) shows the same dynamics at the individual occupation level. The [Forecasts](forecasts.md) page overlays these mechanical estimates with point predictions, confidence intervals, and economist commentary.

## Sub-pages

- [Job Profiles (${JOB_PROFILES.length})](jobs.md)
- [Occupation Groups (${OCCUPATION_GROUPS.length})](occupation-groups.md)
- [Task Categories (${Object.keys(TASK_CATEGORY_META).length})](task-categories.md)
- [Industry Adoption Speeds](industry-speeds.md)
- [Forecast Predictions (${FORECAST_PREDICTIONS.length})](forecasts.md)
- [Methodology](methodology.md)

## Coverage

- ${JOB_PROFILES.length} job profiles spanning ${new Set(JOB_PROFILES.map((j) => j.category)).size} broad occupation categories
- ${OCCUPATION_GROUPS.length} SOC major groups covering ${TOTAL_EMPLOYMENT.toLocaleString()}K workers (BLS OEWS May 2024)
- ${JOB_PROFILES.reduce((s, j) => s + j.tasks.length, 0)} individual tasks scored across the job profiles
- ${FORECAST_PREDICTIONS.length} point forecasts with confidence intervals
- ${ECONOMIST_VIEWS.length} economist views (${ECONOMIST_VIEWS.map((e) => e.name).join(", ")})
`;
writeFile(path.join(WIKI, TV, "index.md"), tvIndex);

// Task Categories page
let tcContent = `# Task Categories

> The 8 work categories every task is mapped to. Cost decline rates extrapolated from observed 2020-2026 AI inference cost trends; adoption lag values draw on Griliches (1957), Comin & Hobijn (2010), and Rogers (2003) technology diffusion research.

| Category | Decline rate (annual) | Adoption lag (yrs) | Compute cost ($/hr) | Default model tier |
|----------|----------------------|---------------------|---------------------|---------------------|
`;
for (const [cat, meta] of Object.entries(TASK_CATEGORY_META)) {
  const tc = cat as TaskCategory;
  const profile = CATEGORY_TOKEN_PROFILES[tc];
  tcContent += `| **${meta.label}** | ${(CATEGORY_DECLINE_RATES[tc] * 100).toFixed(0)}% | ${CATEGORY_ADOPTION_LAG[tc]} | $${CATEGORY_COMPUTE_COSTS[tc]} | ${profile.modelTier} |\n`;
}
tcContent += `\n## Per-category detail\n\n`;
for (const [cat, meta] of Object.entries(TASK_CATEGORY_META)) {
  const tc = cat as TaskCategory;
  const profile = CATEGORY_TOKEN_PROFILES[tc];
  const pricing = MODEL_PRICING[profile.modelTier];
  tcContent += `### ${meta.label} (\`${cat}\`)

${meta.description}

- **Annual cost decline:** ${(CATEGORY_DECLINE_RATES[tc] * 100).toFixed(0)}%
- **Institutional adoption lag:** ${CATEGORY_ADOPTION_LAG[tc]} years beyond economic crossover
- **Base compute cost:** $${CATEGORY_COMPUTE_COSTS[tc]}/hr
- **Default model tier:** ${profile.modelTier} — ${pricing.label} (${pricing.examples})
- **Default token profile:** ${profile.inputTokensPerCall.toLocaleString()} in / ${profile.outputTokensPerCall.toLocaleString()} out per call, ${profile.callsPerHumanHour} calls/hr, ${profile.overheadMultiplier}x overhead

`;
}
writeFile(path.join(WIKI, TV, "task-categories.md"), tcContent);

// Industry Speeds page
let isContent = `# Industry Adoption Speeds

> A multiplier on per-category adoption lag that captures industry-level friction. Composite of regulatory burden (25%), digital maturity (25%), competitive pressure (20%), labor rigidity (15%), and organizational complexity (15%).
>
> 1.0 = baseline. < 1.0 = faster adopter. > 1.0 = slower adopter.

## Job-category multipliers

| Industry | Multiplier | Label | Rationale |
|----------|-----------|-------|-----------|
`;
const sortedIS = Object.entries(INDUSTRY_ADOPTION_SPEED).sort(
  (a, b) => a[1].multiplier - b[1].multiplier
);
for (const [industry, data] of sortedIS) {
  isContent += `| ${industry} | ${data.multiplier.toFixed(2)} | ${data.label} | ${data.rationale} |\n`;
}
isContent += `\n## SOC major-group multipliers

| SOC group | Multiplier |
|-----------|-----------|
`;
for (const [soc, mult] of Object.entries(SOC_INDUSTRY_SPEED).sort(
  (a, b) => a[1] - b[1]
)) {
  isContent += `| \`${soc}\` | ${mult.toFixed(2)} |\n`;
}
writeFile(path.join(WIKI, TV, "industry-speeds.md"), isContent);

// Job profiles index
let jobsIdx = `# Job Profiles

> ${JOB_PROFILES.length} occupations decomposed into tasks. Click through for per-job task breakdowns, exposure scores, and crossover years.

## All jobs (sorted by exposure score)

| Job | Category | Wage ($/hr) | Tasks | Exposure score |
|-----|----------|-------------|-------|----------------|
`;
const jobsWithExposure = JOB_PROFILES.map((j) => ({
  job: j,
  exposure: calculateJobExposure(j),
}));
jobsWithExposure.sort((a, b) => b.exposure - a.exposure);
for (const { job, exposure } of jobsWithExposure) {
  jobsIdx += `| [${job.title}](jobs/${job.id}.md) | ${job.category} | $${job.medianWagePerHr} | ${job.tasks.length} | ${exposure} |\n`;
}
writeFile(path.join(WIKI, TV, "jobs.md"), jobsIdx);

// Per-job pages
function formatTaskRow(task: JobTask, humanWage: number): string {
  const crossover = calculateCrossoverYear(task, humanWage);
  const adoption = calculateAdoptionYear(task, humanWage);
  const tokenCost = getTaskTokenCost(task);
  return `| ${task.name} | ${TASK_CATEGORY_META[task.category].label} | ${(task.timeShare * 100).toFixed(0)}% | ${(task.aiCapability * 100).toFixed(0)}% | $${task.currentComputeCostPerHr.toFixed(2)} | ${(task.costDeclineRate * 100).toFixed(0)}% | ${crossover ?? "—"} | ${adoption ?? "—"} | $${tokenCost.costPerHour.toFixed(2)} |`;
}
for (const job of JOB_PROFILES) {
  const exposure = calculateJobExposure(job);
  const industrySpeed = INDUSTRY_ADOPTION_SPEED[job.category];
  let content = `# ${job.title}

> **Category:** ${job.category} | **Median wage:** $${job.medianWagePerHr}/hr | **Exposure score:** ${exposure}/100${job.adaptiveCapacity != null ? ` | **Adaptive capacity:** ${job.adaptiveCapacity.toFixed(2)}` : ""}${job.highVulnerability ? " | **High vulnerability flag**" : ""}

## Tasks

| Task | Category | Time share | AI capability | Compute $/hr | Decline rate | Crossover yr | Adoption yr | Token-based $/hr |
|------|----------|------------|---------------|--------------|--------------|--------------|-------------|------------------|
`;
  for (const t of job.tasks) {
    content += formatTaskRow(t, job.medianWagePerHr) + "\n";
  }
  content += `\n## Industry adoption speed\n\n`;
  if (industrySpeed) {
    content += `${job.category} multiplier **${industrySpeed.multiplier.toFixed(2)}** (${industrySpeed.label}). ${industrySpeed.rationale}\n`;
  } else {
    content += `No industry-specific multiplier; defaults to 1.0 (baseline).\n`;
  }
  content += `\n## Task descriptions\n\n`;
  for (const t of job.tasks) {
    content += `- **${t.name}** — ${t.description}\n`;
  }
  content += `\n## Interpretation

The exposure score (0-100) weights each task by time share, AI capability, and proximity to economic crossover. Crossover year is when compute (with 5x deployment overhead) drops below the $${job.medianWagePerHr}/hr human wage rate. Adoption year adds institutional lag and industry speed friction.

For industry impact predictions, this job contributes to its SOC major group's automation trajectory; see [Occupation Groups](../occupation-groups.md) for the aggregate view.
`;
  writeFile(path.join(WIKI, TV, "jobs", `${job.id}.md`), content);
}

// Occupation groups index
const occBenchmarkYears = [2026, 2028, 2030, 2032, 2035, 2040];
let ogIdx = `# Occupation Groups (SOC Major Groups)

> ${OCCUPATION_GROUPS.length} BLS SOC major groups covering ${TOTAL_EMPLOYMENT.toLocaleString()}K workers. Source: BLS OEWS May 2024 release.

## Overview

| SOC | Title | Employment (K) | Wage ($/hr) | Income tier | Women % | Adaptive capacity | AI exposure | Demand elasticity |
|-----|-------|----------------|-------------|-------------|---------|-------------------|-------------|-------------------|
`;
for (const g of OCCUPATION_GROUPS) {
  const elas = DEMAND_ELASTICITY[g.id]?.elasticity ?? "—";
  ogIdx += `| ${g.socCode} | [${g.title}](occupation-groups/${g.id}.md) | ${g.employment.toLocaleString()} | $${g.medianWageHr.toFixed(2)} | ${g.incomeTier} | ${g.womenPercent}% | ${g.adaptiveCapacity.toFixed(2)} | ${g.aiExposure.toFixed(2)} | ${elas} |\n`;
}
ogIdx += `\n## Automation pressure trajectory (baseline scenario, with industry adoption lag)

| SOC | ${occBenchmarkYears.map((y) => y.toString()).join(" | ")} |
|-----|${occBenchmarkYears.map(() => "---").join("|")}|
`;
for (const g of OCCUPATION_GROUPS) {
  const row = occBenchmarkYears
    .map((y) => `${getAutomationPercentAtYear(g, y, true, 1.0)}%`)
    .join(" | ");
  ogIdx += `| ${g.shortTitle} | ${row} |\n`;
}
ogIdx += `\nValues are weighted-average task automation pressure (sigmoid centered on cost-parity), evaluated with industry-specific adoption lag at baseline (1.0x) cost-decline rate.

## Economy-wide timeline

| Year | Low-income % | Middle-income % | High-income % | Workers > 50% automated (K) |
|------|--------------|------------------|----------------|------------------------------|
`;
const economyTimeline = generateEconomyTimeline(2026, 2040, true, 1.0);
for (const r of economyTimeline) {
  ogIdx += `| ${r.year} | ${r.lowAutomated}% | ${r.middleAutomated}% | ${r.highAutomated}% | ${r.totalWorkersSignificant.toLocaleString()} |\n`;
}
ogIdx += `\n## Decline-rate scenarios

`;
for (const [k, s] of Object.entries(DECLINE_RATE_SCENARIOS)) {
  ogIdx += `- **${s.label}** (${s.multiplier}x): ${s.description}\n`;
}
ogIdx += `\n## Income tiers\n\n`;
for (const [tier, meta] of Object.entries(INCOME_TIER_META)) {
  ogIdx += `- **${meta.label}** — ${meta.range}\n`;
}
ogIdx += `\n## Demand elasticity\n\n`;
for (const [k, meta] of Object.entries(DEMAND_ELASTICITY_META)) {
  ogIdx += `- **${meta.label}** — ${meta.description}\n`;
}
writeFile(path.join(WIKI, TV, "occupation-groups.md"), ogIdx);

// Per occupation-group pages
for (const g of OCCUPATION_GROUPS) {
  const elas = DEMAND_ELASTICITY[g.id];
  const cfo = CFO_SURVEY_NEI[g.id];
  const exposureScore = SOC_EXPOSURE_SCORES[g.id];
  const uncertainty = EXPOSURE_UNCERTAINTY[g.id];
  const linkedJobs = SOC_TO_JOB_IDS[g.id] ?? [];
  let content = `# ${g.title}

> **SOC:** ${g.socCode} | **Employment:** ${g.employment.toLocaleString()}K | **Median wage:** $${g.medianWageHr.toFixed(2)}/hr ($${g.medianWageAnnual.toLocaleString()}/yr) | **Income tier:** ${INCOME_TIER_META[g.incomeTier].label}

## Task composition

| Task category | Share |
|---------------|-------|
`;
  for (const [cat, share] of Object.entries(g.taskComposition).sort(
    (a, b) => b[1] - a[1]
  )) {
    content += `| ${TASK_CATEGORY_META[cat as TaskCategory].label} | ${(share * 100).toFixed(0)}% |\n`;
  }
  content += `
- **Blended compute cost:** $${g.avgComputeCostPerHr.toFixed(2)}/hr
- **Blended decline rate:** ${(g.blendedCostDeclineRate * 100).toFixed(1)}%/yr

## AI exposure

- **Eloundou et al. (E1+0.5E2):** ${g.aiExposure.toFixed(3)}
`;
  if (exposureScore) {
    content += `- **Yale Budget Lab GPT score:** mean ${exposureScore.mean.toFixed(2)} (range ${exposureScore.min}-${exposureScore.max}, n=${exposureScore.count})\n`;
  }
  if (uncertainty) {
    content += `- **Cross-metric uncertainty:** variance ${uncertainty.variance.toFixed(3)}, PCA score ${uncertainty.pcaScore.toFixed(2)}\n`;
  }

  content += `\n## Adaptive capacity (Manning/Aguirre NBER w34705)

- **Composite:** ${g.adaptiveCapacity.toFixed(2)}
- Net liquid wealth: ${g.adaptiveCapacityComponents.netLiquidWealth.toFixed(2)}
- Skill transferability: ${g.adaptiveCapacityComponents.skillTransferability.toFixed(2)}
- Geographic density: ${g.adaptiveCapacityComponents.geographicDensity.toFixed(2)}
- Age fraction (55+, inverted): ${g.adaptiveCapacityComponents.ageFraction55Plus.toFixed(2)}
- **Women in workforce:** ${g.womenPercent}%
`;

  if (cfo) {
    content += `\n## CFO Survey signal (Atlanta Fed / Duke 2026)

- **NEI:** ${cfo.nei.toFixed(3)} — ${cfo.label}
- NEI > 1.0 = replacement-dominant, 0.7-1.0 = balanced, < 0.7 = enhancement-dominant.
`;
  }

  if (elas) {
    content += `\n## Demand elasticity

- **${DEMAND_ELASTICITY_META[elas.elasticity].label}** — ${elas.rationale}
- Implication: ${DEMAND_ELASTICITY_META[elas.elasticity].description}
`;
  }

  content += `\n## Automation trajectory (baseline scenario, with industry adoption lag)

| Year | Pressure |
|------|----------|
`;
  for (const y of occBenchmarkYears) {
    content += `| ${y} | ${getAutomationPercentAtYear(g, y, true, 1.0)}% |\n`;
  }

  if (linkedJobs.length > 0) {
    content += `\n## Representative jobs\n\n`;
    for (const jobId of linkedJobs) {
      const job = JOB_PROFILES.find((j) => j.id === jobId);
      if (job) {
        content += `- [${job.title}](../jobs/${jobId}.md) — $${job.medianWagePerHr}/hr, exposure ${calculateJobExposure(job)}/100\n`;
      }
    }
  }

  writeFile(path.join(WIKI, TV, "occupation-groups", `${g.id}.md`), content);
}

// Forecasts page
let fcContent = `# Forecast Predictions

> ${FORECAST_PREDICTIONS.length} point predictions with confidence intervals, conviction levels, and key citations. Use these as the headline numbers for industry impact predictions; back them with the bottom-up task model.

## Economy radar (current state)

| Dimension | Score | Role | Description |
|-----------|-------|------|-------------|
`;
for (const r of ECONOMY_RADAR) {
  fcContent += `| ${r.label} | ${r.score} | ${r.role} | ${r.description} |\n`;
}
fcContent += `\n## Predictions\n\n`;
for (const p of FORECAST_PREDICTIONS) {
  fcContent += `### ${p.title}

- **Category:** ${p.category}
- **Horizon:** ${p.timeHorizon}
- **Prediction:** ${p.prediction}${p.unit} (range ${p.confidenceLow}–${p.confidenceHigh}${p.unit})
- **Currently observed:** ${p.currentObserved == null ? "n/a" : p.currentObserved + p.unit}
- **Conviction:** ${p.conviction}
- **Source count:** ${p.sourceCount}${p.relatedSlug ? ` | **Related graph:** \`${p.relatedSlug}\`` : ""}

${p.rationale}

**Key citations:**
${p.keyCitations.map((c) => `- ${c}`).join("\n")}

`;
}
fcContent += `## Economist views\n\n`;
for (const v of ECONOMIST_VIEWS) {
  fcContent += `### ${v.name} — ${v.affiliation} (${v.stanceLabel})

${v.summary}

> "${v.keyQuote}"

`;
}
writeFile(path.join(WIKI, TV, "forecasts.md"), fcContent);

// Methodology page
let methContent = `# Task Visualizer Methodology

> The task visualizer treats AI displacement as a function of three quantities per task: AI capability today, current compute cost, and the rate at which compute cost is declining. Crossover happens when compute (with deployment overhead) drops below the human wage rate. Adoption happens later, with institutional lag.

## Token economics

Cost per task is computed as:

\`\`\`
Cost_task = N × (T_in/1M × P_in + T_out/1M × P_out) × M
\`\`\`

Where:
- N = model calls per hour of equivalent human work
- T_in, T_out = input/output tokens per call
- P_in, P_out = price per 1M input/output tokens
- M = overhead multiplier (retries, RAG, tool calls; typically 2-6)

### Model tier pricing (mid-2026 blended rates)

| Tier | Input $/1M | Output $/1M | Examples |
|------|------------|-------------|----------|
`;
for (const [k, p] of Object.entries(MODEL_PRICING)) {
  methContent += `| ${k} | $${p.inputPer1M} | $${p.outputPer1M} | ${p.examples} |\n`;
}

methContent += `\n## Crossover formula

\`\`\`
crossoverYear = baseYear + min({y : computeCost × DEPLOYMENT_OVERHEAD × (1 - declineRate)^y ≤ humanWage})
\`\`\`

DEPLOYMENT_OVERHEAD = ${DEPLOYMENT_OVERHEAD} (Sequoia Capital 2025: production AI deployments cost 3-8x raw inference; we use 5x as a conservative midpoint).

## Adoption formula

\`\`\`
adoptionYear = crossoverYear + (CATEGORY_ADOPTION_LAG[task.category] × industrySpeedMultiplier)
\`\`\`

Per-task lag values come from technology-diffusion research (Griliches 1957; Comin & Hobijn 2010; Rogers 2003). Industry speed multipliers from a 5-factor composite (regulatory burden, digital maturity, competitive pressure, labor rigidity, organizational complexity).

## Job exposure score (0-100)

\`\`\`
exposure = 100 × Σ_tasks (timeShare × aiCapability × max(0, 1 - yearsUntilCrossover / 20))
\`\`\`

Tasks that cross over sooner and occupy more of the workday produce higher exposure. Capped between 0 and 100.

## Economy-wide automation pressure

For each SOC major group:

\`\`\`
pressure(year, group) = Σ_categories (categoryShare × sigmoid(k × (computeCost/wage - 1)))
\`\`\`

with k = 6 (50% pressure at cost parity, 5% at 2x cost, 95% at 0.5x cost). The sigmoid replaces a binary cutoff to better model the gradual diffusion observed in real adoption curves.

## Sources for the parameters

- Cost decline rates: Stanford HAI AI Index 2025 (~280x decline in 18 months), Epoch AI (algorithmic efficiency doubling annually), a16z LLMflation (1,000x cost decline for equivalent MMLU)
- Adoption lag: Griliches (1957), Comin & Hobijn (2010), Rogers (2003)
- Industry speeds: OECD Product Market Regulation, McKinsey "Digital America" (2015), BLS occupation share by industry, Acemoglu & Restrepo (2020), Brynjolfsson et al. (2021)
- Adaptive capacity: Manning & Aguirre, NBER w34705
- AI exposure: Eloundou et al. (E1+0.5E2), Yale Budget Lab (Gimbel et al. 2026)
- CFO replacement vs enhancement: Baslandze et al. (2026), Federal Reserve Bank of Atlanta / Duke
- Demand elasticity: Bessen (2019), Autor & Salomons (2018)
- BLS employment: OEWS May 2024 release, ${TOTAL_EMPLOYMENT.toLocaleString()}K covered workers across ${OCCUPATION_GROUPS.length} SOC major groups

## When the model is most reliable

- Mature, measurable task categories (information processing, communication) with stable cost trends
- Aggregate economy view, where idiosyncratic firm decisions wash out

## When to discount the model's output

- Physical-manual and interpersonal tasks: cost trajectories are noisier (robotics, ethics review, regulatory friction)
- Sub-2-year horizons: institutional adoption lag dominates and is bumpier than the linear assumption suggests
- Industries with regulatory shocks (healthcare, legal): industry-speed multiplier captures average friction, not specific policy events
`;
writeFile(path.join(WIKI, TV, "methodology.md"), methContent);

const taskVizFileCount =
  1 + // tv index
  1 + // jobs index
  JOB_PROFILES.length +
  1 + // occupation-groups index
  OCCUPATION_GROUPS.length +
  4; // task-categories, industry-speeds, forecasts, methodology

// ── Stats ────────────────────────────────────────────────────

const fileCount =
  1 + // index
  predictions.length + // prediction pages
  sourceIds.length + // source pages
  4 + // tier indexes
  1 + // publisher index
  categories.length + // category overviews
  1 + // source briefs
  taskVizFileCount;

console.log(`\nWiki compiled successfully!`);
console.log(`  ${fileCount} files written to wiki/`);
console.log(`  Task visualizer: ${taskVizFileCount} files (${JOB_PROFILES.length} jobs + ${OCCUPATION_GROUPS.length} SOC groups)`);
console.log(`  ${predictions.length} prediction pages`);
console.log(`  ${sourceIds.length} source pages`);
console.log(`  ${categories.length} category overviews`);
console.log(`  5 index files`);
console.log(`\nStart here: wiki/index.md`);
