/**
 * Refresh AI Capability defaults for the Composite Model (/model page) from
 * the Artificial Analysis API.
 *
 * Pulls all tracked frontier models, then derives:
 *   - capabilityDoublingMonths      (fit to Intelligence Index time series)
 *   - computeCostDeclineRate        (fit to median frontier $/Mtok decline)
 *
 * Outputs to: src/data/capability-anchor.json
 *
 * Usage:
 *   npx tsx scripts/fetch-capability.ts
 *
 * Requires ARTIFICIAL_ANALYSIS_API_KEY in .env.local.
 * API reference: https://artificialanalysis.ai/documentation
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { loadEnv } from "./lib/load-env";

loadEnv(join(process.cwd(), ".env.local"));
loadEnv(); // fall through to .env if .env.local missing the key

const API_BASE = "https://artificialanalysis.ai/api/v2";
const API_KEY = process.env.ARTIFICIAL_ANALYSIS_API_KEY;

if (!API_KEY) {
  console.error("Missing ARTIFICIAL_ANALYSIS_API_KEY in .env.local");
  process.exit(1);
}

interface AAModel {
  id: string;
  name: string;
  slug: string;
  release_date: string | null;
  model_creator: { name: string; slug: string };
  evaluations: {
    artificial_analysis_intelligence_index?: number | null;
    artificial_analysis_coding_index?: number | null;
    artificial_analysis_math_index?: number | null;
    mmlu_pro?: number | null;
    gpqa?: number | null;
  };
  pricing: {
    price_1m_blended_3_to_1?: number | null;
    price_1m_input_tokens?: number | null;
    price_1m_output_tokens?: number | null;
  };
  median_output_tokens_per_second?: number | null;
  median_time_to_first_token_seconds?: number | null;
}

async function fetchModels(): Promise<AAModel[]> {
  const res = await fetch(`${API_BASE}/data/llms/models`, {
    headers: { "x-api-key": API_KEY! },
  });
  if (!res.ok) throw new Error(`AA API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { status: string; data: AAModel[] };
  return json.data;
}

interface FrontierPoint {
  date: number; // months since epoch (Jan 2023)
  intelligence: number;
  blendedPrice: number;
  modelName: string;
}

/** Build the frontier — running-max intelligence over time. */
function buildFrontier(models: AAModel[]): FrontierPoint[] {
  const dated = models
    .filter(
      (m) =>
        m.release_date &&
        m.evaluations.artificial_analysis_intelligence_index != null &&
        m.pricing.price_1m_blended_3_to_1 != null
    )
    .map((m) => ({
      m,
      t: new Date(m.release_date!).getTime(),
      ii: m.evaluations.artificial_analysis_intelligence_index!,
      price: m.pricing.price_1m_blended_3_to_1!,
    }))
    .sort((a, b) => a.t - b.t);

  const frontier: FrontierPoint[] = [];
  let maxII = 0;
  const t0 = new Date("2023-01-01").getTime();
  for (const d of dated) {
    if (d.ii > maxII) {
      maxII = d.ii;
      frontier.push({
        date: (d.t - t0) / (1000 * 60 * 60 * 24 * 30.44),
        intelligence: d.ii,
        blendedPrice: d.price,
        modelName: d.m.name,
      });
    }
  }
  return frontier;
}

/** Fit log2(intelligence) = a + b*months. Doubling = 1/b months. */
function fitDoublingMonths(frontier: FrontierPoint[]): number {
  const pts = frontier
    .filter((p) => p.intelligence > 0)
    .map((p) => ({ x: p.date, y: Math.log2(p.intelligence) }));
  if (pts.length < 3) return 7;
  const n = pts.length;
  const sumX = pts.reduce((s, p) => s + p.x, 0);
  const sumY = pts.reduce((s, p) => s + p.y, 0);
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  if (slope <= 0) return 7;
  return Math.max(2, Math.min(24, 1 / slope));
}

/**
 * Annualized decline in $/intelligence-point at the frontier.
 * For each new frontier model, compute its price-per-intelligence-point;
 * fit log-linear over the last 18 months.
 */
function fitCostDecline(frontier: FrontierPoint[]): number {
  const cutoff = frontier[frontier.length - 1].date - 18; // last 18 months
  const recent = frontier.filter((p) => p.date >= cutoff);
  if (recent.length < 3) return 0.15;
  const pts = recent
    .filter((p) => p.intelligence > 0 && p.blendedPrice > 0)
    .map((p) => ({
      x: p.date,
      y: Math.log(p.blendedPrice / p.intelligence),
    }));
  if (pts.length < 3) return 0.15;
  const n = pts.length;
  const sumX = pts.reduce((s, p) => s + p.x, 0);
  const sumY = pts.reduce((s, p) => s + p.y, 0);
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  if (slope >= 0) return 0.08;
  // slope is per-month log decline; annual decline = 1 - exp(slope*12)
  const annual = 1 - Math.exp(slope * 12);
  return Math.max(0.03, Math.min(0.60, annual));
}

(async () => {
  console.log("Fetching frontier model snapshots from Artificial Analysis…");
  const models = await fetchModels();
  console.log(`  → ${models.length} models in API`);

  const frontier = buildFrontier(models);
  console.log(`  → ${frontier.length} frontier-defining releases`);

  const doublingMonths = fitDoublingMonths(frontier);
  const costDecline = fitCostDecline(frontier);

  // Current frontier model (highest II)
  const top = [...models]
    .filter((m) => m.evaluations.artificial_analysis_intelligence_index != null)
    .sort(
      (a, b) =>
        (b.evaluations.artificial_analysis_intelligence_index ?? 0) -
        (a.evaluations.artificial_analysis_intelligence_index ?? 0)
    )
    .slice(0, 10);

  const out = {
    fetchedAt: new Date().toISOString(),
    source: "https://artificialanalysis.ai/",
    apiBase: API_BASE,
    modelCount: models.length,
    frontierReleases: frontier.length,
    derived: {
      capabilityDoublingMonths: Number(doublingMonths.toFixed(1)),
      computeCostDeclineRate: Number(costDecline.toFixed(3)),
    },
    currentFrontier: top.map((m) => ({
      name: m.name,
      vendor: m.model_creator.name,
      released: m.release_date,
      intelligenceIndex: m.evaluations.artificial_analysis_intelligence_index,
      codingIndex: m.evaluations.artificial_analysis_coding_index,
      mathIndex: m.evaluations.artificial_analysis_math_index,
      blendedPricePerMtok: m.pricing.price_1m_blended_3_to_1,
      outputTokPerSec: m.median_output_tokens_per_second,
      timeToFirstTokenSec: m.median_time_to_first_token_seconds,
    })),
    frontierPath: frontier.map((p) => ({
      modelName: p.modelName,
      monthsSince2023: Number(p.date.toFixed(1)),
      intelligenceIndex: p.intelligence,
      blendedPricePerMtok: p.blendedPrice,
    })),
  };

  const outPath = join(process.cwd(), "src/data/capability-anchor.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outPath}`);
  console.log(`  capabilityDoublingMonths = ${out.derived.capabilityDoublingMonths}`);
  console.log(`  computeCostDeclineRate   = ${out.derived.computeCostDeclineRate}`);
  console.log(`\nCurrent frontier: ${top[0]?.name} (II ${top[0]?.evaluations.artificial_analysis_intelligence_index})`);
})();
