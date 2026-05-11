#!/usr/bin/env npx tsx
/**
 * Builds the precomputed task -> occupation risk dataset that powers /map.
 *
 *   Reads:   src/data/enriched-occupations.json
 *   Writes:  src/data/risk/occupation-risk.json   (per-occupation)
 *            src/data/risk/sector-risk.json       (BLS-category rollup)
 *
 * Invoke via `npm run build:risk`.
 */

import * as fs from "fs";
import * as path from "path";

import {
  scoreAllOccupations,
  type EnrichedOccupation,
  type DetailedOccupationRisk,
} from "../src/lib/occupation-risk";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, "..");
const INPUT_PATH = path.join(
  REPO_ROOT,
  "src",
  "data",
  "enriched-occupations.json"
);
const OUTPUT_DIR = path.join(REPO_ROOT, "src", "data", "risk");
const OUTPUT_OCC = path.join(OUTPUT_DIR, "occupation-risk.json");
const OUTPUT_SECTOR = path.join(OUTPUT_DIR, "sector-risk.json");

const METHODOLOGY = [
  "Per-occupation risk uses the 5-dimension framework from src/lib/scoring-shared.ts.",
  "technicalExposure: Karpathy/GPT exposure score carried through.",
  "adoptionSpeed: taskComposition-weighted CATEGORY_ADOPTION_LAG mapped to 0-10.",
  "adaptability: pay percentile (within 342) + education tier, equal-weighted.",
  "demandElasticity: rule-based defaults by BLS major category (3/5/7).",
  "complementarity: estimateComplementarityFromTasks + dimensionality adjustment.",
  "Task riskScore = clamp(exposure*10 * adoptionFactor * declineFactor * importanceFactor, 0, 100).",
  "Bucket thresholds: low < 33, medium 33-66, high > 66. Time-share rollup is O*NET-importance-weighted.",
].join(" ");

// ---------------------------------------------------------------------------
// Sector aggregation
// ---------------------------------------------------------------------------

interface SectorRiskRow {
  category: string;
  totalJobs: number;
  occupationCount: number;
  weightedNetRisk: number; // employment-weighted, 0-10
  weightedNetRisk100: number;
  meanNetRisk: number; // unweighted, 0-10 (for sanity)
  topRisk: Array<{ slug: string; title: string; netRisk: number; jobs: number }>;
}

function buildSectorRollup(
  risks: DetailedOccupationRisk[]
): SectorRiskRow[] {
  const byCat = new Map<string, DetailedOccupationRisk[]>();
  for (const r of risks) {
    const arr = byCat.get(r.category) ?? [];
    arr.push(r);
    byCat.set(r.category, arr);
  }

  const rows: SectorRiskRow[] = [];
  for (const [category, occs] of byCat) {
    const totalJobs = occs.reduce((s, o) => s + o.jobs, 0);
    const weightedNetRisk =
      totalJobs > 0
        ? occs.reduce((s, o) => s + o.netRisk * o.jobs, 0) / totalJobs
        : occs.reduce((s, o) => s + o.netRisk, 0) / Math.max(1, occs.length);
    const meanNetRisk =
      occs.reduce((s, o) => s + o.netRisk, 0) / Math.max(1, occs.length);
    const topRisk = [...occs]
      .sort((a, b) => b.netRisk - a.netRisk)
      .slice(0, 3)
      .map((o) => ({
        slug: o.slug,
        title: o.title,
        netRisk: o.netRisk,
        jobs: o.jobs,
      }));
    rows.push({
      category,
      totalJobs,
      occupationCount: occs.length,
      weightedNetRisk,
      weightedNetRisk100: Math.round(weightedNetRisk * 10),
      meanNetRisk,
      topRisk,
    });
  }
  rows.sort((a, b) => b.weightedNetRisk - a.weightedNetRisk);
  return rows;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("[build:risk] Reading", INPUT_PATH);
  const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));
  const occupations: EnrichedOccupation[] = raw.occupations;
  console.log(
    `[build:risk] Loaded ${occupations.length} occupations (matched: ${raw.matchedOccupations}/${raw.totalOccupations}).`
  );

  const risks = scoreAllOccupations(occupations);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const generatedAt = new Date().toISOString();

  const occPayload = {
    generatedAt,
    methodology: METHODOLOGY,
    count: risks.length,
    occupations: risks,
  };
  fs.writeFileSync(OUTPUT_OCC, JSON.stringify(occPayload, null, 2));
  console.log(
    `[build:risk] Wrote ${OUTPUT_OCC} (${risks.length} occupations, ${(
      fs.statSync(OUTPUT_OCC).size / 1024
    ).toFixed(1)} KB).`
  );

  const sectorRows = buildSectorRollup(risks);
  const sectorPayload = {
    generatedAt,
    methodology:
      "Employment-weighted aggregation of per-occupation netRisk by BLS major category. topRisk lists the 3 highest-netRisk occupations within each category.",
    count: sectorRows.length,
    sectors: sectorRows,
  };
  fs.writeFileSync(OUTPUT_SECTOR, JSON.stringify(sectorPayload, null, 2));
  console.log(
    `[build:risk] Wrote ${OUTPUT_SECTOR} (${sectorRows.length} sectors).`
  );

  // -------------------------------------------------------------------------
  // Sanity-check output
  // -------------------------------------------------------------------------

  const sorted = [...risks].sort((a, b) => b.netRisk - a.netRisk);
  const top = sorted.slice(0, 10);
  const bottom = sorted.slice(-10).reverse();

  const fmt = (r: DetailedOccupationRisk) =>
    `  netRisk=${r.netRisk.toFixed(2)}  exp=${r.exposure.toFixed(
      1
    )}  speed=${r.adoptionSpeed.toFixed(1)}  adapt=${r.adaptability.toFixed(
      1
    )}  elast=${r.demandElasticity.toFixed(1)}  comp=${r.complementarity.toFixed(
      1
    )}  high%=${r.pctHighRiskTime.toFixed(0)}  jobs=${r.jobs.toLocaleString()}  ${r.title}`;

  console.log("\n=== TOP 10 highest net risk ===");
  for (const r of top) console.log(fmt(r));

  console.log("\n=== BOTTOM 10 lowest net risk ===");
  for (const r of bottom) console.log(fmt(r));

  // Spot-check the three Matt called out
  const SPOT = ["accountants-and-auditors", "registered-nurses", "software-developers"];
  console.log("\n=== Spot checks ===");
  for (const slug of SPOT) {
    const r = risks.find((x) => x.slug === slug);
    if (!r) {
      console.log(`  ${slug}: NOT FOUND`);
      continue;
    }
    console.log(fmt(r));
  }
}

main();
