/**
 * Per-occupation displacement risk scoring at the *detailed* level.
 *
 * Mirrors the pattern in `composite-risk.ts` (which scores the 22 BLS SOC
 * major groups) but operates on the 342 detailed occupations in
 * `enriched-occupations.json`. Each occupation produces:
 *
 *   - The five risk dimensions (0-10) from the shared framework
 *     (Eloundou exposure, institutional adoption speed, worker adaptability,
 *     demand elasticity, AI complementarity).
 *   - A composite netRisk via `computeNetRisk` (also expressed as 0-100 for
 *     UI display).
 *   - A per-task riskScore (0-100) and bucket (low/medium/high), plus an
 *     importance-weighted rollup of how much of the worker's day falls in
 *     each bucket — the "show risk of jobs by percent of high-risk tasks"
 *     view Matt wants on /map.
 *
 * Methodology notes
 * -----------------
 *
 * Task-level riskScore (0-100):
 *   base            = occupation.exposure * 10
 *   adoptionFactor  = 1 - (CATEGORY_ADOPTION_LAG[cat] - 1.5) / 3
 *                     (1.5y lag -> 1.0; 4.5y lag -> 0.0;
 *                      info-processing tasks score higher than physical-manual)
 *   declineFactor   = 1 + CATEGORY_DECLINE_RATES[cat]
 *                     (faster-declining inference costs raise task risk)
 *   importanceFactor = task.importance / 5
 *                     (O*NET importance is 1-5; 5 = "extremely important")
 *   risk = clamp(base * adoptionFactor * declineFactor * importanceFactor, 0, 100)
 *
 * Bucketing: <33 = low, 33-66 = medium, >66 = high.
 *
 * Occupation-level dimensions (0-10):
 *   technicalExposure   = occupation.exposure (already 0-10 from Karpathy/GPT)
 *   adoptionSpeed       = derived from a taskComposition-weighted average of
 *                         CATEGORY_ADOPTION_LAG. Mapping: 1.5y -> 10, 4.5y -> 0
 *                         (i.e. 10 - (lag - 1.5) / 0.3, clamped). Info-processing-
 *                         heavy occupations land ~8; physical-manual-heavy ~3.
 *   adaptability        = clamp((payPct * 0.5 + eduTier * 0.5) * 10, 0, 10)
 *                         where payPct is the occupation's percentile within
 *                         the 342-occupation pay distribution and eduTier is
 *                         the cumulative-education ladder defined below.
 *   demandElasticity    = rule-based defaults by BLS major category. 7 (high)
 *                         for sales, arts/media, food prep/serving, personal
 *                         care. 3 (low) for healthcare practitioners,
 *                         healthcare support, protective service, education,
 *                         community/social, legal. 5 elsewhere.
 *   complementarity     = estimateComplementarityFromTasks(taskComposition) +
 *                         dimensionalityAdjustment(effectiveDims, false), clamped.
 *
 * Composite net risk is via the shared `computeNetRisk` (pressure vs
 * absorption, normalized independently so defensive factors can fully
 * counterbalance exposure + speed).
 */

import {
  estimateComplementarityFromTasks,
  getEffectiveDimensions,
  dimensionalityAdjustment,
  clamp010,
  computeNetRisk,
} from "./scoring-shared";
import {
  CATEGORY_ADOPTION_LAG,
  CATEGORY_DECLINE_RATES,
  type TaskCategory,
} from "../data/task-categories";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Raw shape of one record in src/data/enriched-occupations.json. */
export interface EnrichedOccupationTask {
  name: string;
  category: TaskCategory;
  importance: number; // O*NET 1-5 scale
}

export interface EnrichedOccupation {
  slug: string;
  title: string;
  onetCode: string;
  category: string; // BLS major group, e.g. "business-and-financial"
  pay: number | null;
  jobs: number | null;
  education: string;
  exposure: number; // 0-10, GPT-scored per Karpathy methodology
  taskComposition: Record<string, number>; // 8 categories summing ~ 1.0
  tasks: EnrichedOccupationTask[];
}

export type RiskBucket = "low" | "medium" | "high";

export interface TaskRiskBreakdown {
  taskName: string;
  category: TaskCategory;
  importance: number;
  riskScore: number; // 0-100
  riskBucket: RiskBucket;
}

export interface DetailedOccupationRisk {
  slug: string;
  title: string;
  onetCode: string;
  category: string;
  jobs: number;
  pay: number;
  exposure: number;

  // 5-dimension scores (0-10, same convention as composite-risk.ts)
  technicalExposure: number;
  adoptionSpeed: number;
  adaptability: number;
  demandElasticity: number;
  complementarity: number;

  // Composite
  netRisk: number; // 0-10
  netRisk100: number; // 0-100, rounded for display

  // Task-level rollup
  tasks: TaskRiskBreakdown[];
  pctHighRiskTime: number; // % of importance-weighted task time in HIGH bucket
  pctMediumRiskTime: number;
  pctLowRiskTime: number;
  effectiveDimensions: number;
}

// ---------------------------------------------------------------------------
// Education ladder (per spec)
// ---------------------------------------------------------------------------

/**
 * Cumulative education levels (0 = none, 1 = doctoral/professional).
 *
 * Spec uses "No formal education credential"; the enriched dataset actually
 * carries "No formal educational credential". Both are accepted. Some
 * occupations have `""` or `"See How to Become One"` (BLS catch-all for
 * jobs where formal credentials don't apply); treat those as ~entry level
 * but slightly above none-required, since they often imply apprenticeship
 * or on-the-job training.
 */
const EDUCATION_TIER: Record<string, number> = {
  "No formal education credential": 0,
  "No formal educational credential": 0,
  "High school diploma or equivalent": 0.2,
  "Some college, no degree": 0.4,
  "Postsecondary nondegree award": 0.5,
  "Associate's degree": 0.55,
  "Bachelor's degree": 0.7,
  "Master's degree": 0.85,
  "Doctoral or professional degree": 1.0,
};

function educationTier(education: string): number {
  if (EDUCATION_TIER[education] !== undefined) return EDUCATION_TIER[education];
  // Fallbacks: "" or "See How to Become One" -> treat as HS-equivalent baseline.
  return 0.2;
}

// ---------------------------------------------------------------------------
// Demand elasticity defaults by BLS major category
// ---------------------------------------------------------------------------

/**
 * Maps the enriched-data `category` strings to elasticity scores (0-10).
 * Spec aliases are honored where the raw data uses slightly different slugs
 * (e.g. spec "food-prep-and-serving" -> data "food-preparation-and-serving").
 */
const HIGH_ELASTICITY_CATEGORIES = new Set([
  // spec slugs
  "sales-and-related",
  "arts-design-entertainment-sports-and-media",
  "food-prep-and-serving",
  "personal-care-and-service",
  // enriched-occupations.json slugs
  "sales",
  "arts-and-design",
  "media-and-communication",
  "entertainment-and-sports",
  "food-preparation-and-serving",
]);

const LOW_ELASTICITY_CATEGORIES = new Set([
  // spec slugs
  "healthcare-practitioners-and-technical",
  "healthcare-support",
  "protective-service",
  "education-instruction-and-library",
  "community-and-social-service",
  "legal",
  // enriched-occupations.json slugs
  "healthcare",
  "education-training-and-library",
  "community-and-social-service",
  "protective-service",
  "military",
]);

function categoryElasticityScore(category: string): number {
  if (HIGH_ELASTICITY_CATEGORIES.has(category)) return 7;
  if (LOW_ELASTICITY_CATEGORIES.has(category)) return 3;
  return 5;
}

// ---------------------------------------------------------------------------
// Adoption speed from task composition
// ---------------------------------------------------------------------------

/**
 * Weighted adoption-lag in years for the occupation. Each task category
 * contributes its share of the workday * its institutional adoption lag.
 *
 * Range floor: 1.5y (pure information-processing).
 * Range ceiling: 4.5y (pure interpersonal).
 */
function weightedAdoptionLag(taskComposition: Record<string, number>): number {
  let totalShare = 0;
  let weightedLag = 0;
  for (const [category, share] of Object.entries(taskComposition)) {
    const lag = CATEGORY_ADOPTION_LAG[category as TaskCategory];
    if (lag === undefined) continue;
    weightedLag += share * lag;
    totalShare += share;
  }
  if (totalShare <= 0) return 3.0; // safe midpoint fallback
  return weightedLag / totalShare;
}

/**
 * Convert weighted lag (years) to a 0-10 adoption-speed score.
 * 1.5y -> 10 (fastest); 4.5y -> 0 (slowest).
 * Designed to land info-processing-heavy occupations near ~8 and
 * physical-manual-heavy ones near ~3 in practice.
 */
function adoptionSpeedFromLag(lagYears: number): number {
  return clamp010(10 - (lagYears - 1.5) / 0.3);
}

// ---------------------------------------------------------------------------
// Task-level risk
// ---------------------------------------------------------------------------

function taskRiskScore(
  exposure: number,
  task: EnrichedOccupationTask
): number {
  const base = exposure * 10; // 0-100 scale
  const lag = CATEGORY_ADOPTION_LAG[task.category];
  const decline = CATEGORY_DECLINE_RATES[task.category];
  // Defensive: if task category is unknown to the taxonomy, fall back to
  // mid-range factors rather than NaN-ing the row.
  const adoptionFactor =
    lag !== undefined ? 1 - (lag - 1.5) / 3 : 0.5;
  const declineFactor = decline !== undefined ? 1 + decline : 1.0;
  const importanceFactor = Math.max(0, Math.min(1, task.importance / 5));
  const raw = base * adoptionFactor * declineFactor * importanceFactor;
  return Math.max(0, Math.min(100, raw));
}

function bucketFor(score: number): RiskBucket {
  if (score > 66) return "high";
  if (score >= 33) return "medium";
  return "low";
}

// ---------------------------------------------------------------------------
// Pay percentile helper
// ---------------------------------------------------------------------------

/**
 * Builds a pay-percentile function from the full set of occupations. Returns
 * a percentile in [0, 1] for any given pay (handles nulls as 0 = bottom).
 */
function buildPayPercentile(
  occupations: EnrichedOccupation[]
): (pay: number | null) => number {
  const pays = occupations
    .map((o) => o.pay)
    .filter((p): p is number => typeof p === "number" && Number.isFinite(p))
    .sort((a, b) => a - b);
  const n = pays.length;
  if (n === 0) return () => 0.5;

  return (pay: number | null) => {
    if (typeof pay !== "number" || !Number.isFinite(pay)) return 0;
    // Count entries strictly less than pay; ties get the lower-rank percentile.
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (pays[mid] < pay) lo = mid + 1;
      else hi = mid;
    }
    return lo / n;
  };
}

// ---------------------------------------------------------------------------
// Per-occupation scoring
// ---------------------------------------------------------------------------

export interface ScoreOptions {
  payPercentile: (pay: number | null) => number;
}

export function scoreOccupation(
  occ: EnrichedOccupation,
  opts: ScoreOptions
): DetailedOccupationRisk {
  // 1. Technical exposure: carry through (already 0-10).
  const technicalExposure = clamp010(occ.exposure);

  // 2. Adoption speed: derived from taskComposition * CATEGORY_ADOPTION_LAG.
  const lagYears = weightedAdoptionLag(occ.taskComposition);
  const adoptionSpeed = adoptionSpeedFromLag(lagYears);

  // 3. Adaptability: pay percentile + education tier, equally weighted.
  const payPct = opts.payPercentile(occ.pay);
  const eduTier = educationTier(occ.education);
  const adaptability = clamp010((payPct * 0.5 + eduTier * 0.5) * 10);

  // 4. Demand elasticity: rule-based by BLS major category.
  const demandElasticity = categoryElasticityScore(occ.category);

  // 5. Complementarity: task-composition estimate + dimensionality adjustment.
  const effectiveDims = getEffectiveDimensions(occ.taskComposition);
  const complementarityBase = estimateComplementarityFromTasks(
    occ.taskComposition
  );
  const dimAdj = dimensionalityAdjustment(effectiveDims, false);
  const complementarity = clamp010(complementarityBase + dimAdj);

  // Composite
  const netRisk = computeNetRisk({
    technicalExposure,
    adoptionSpeed,
    adaptability,
    demandElasticity,
    complementarity,
  });

  // Task-level breakdown + importance-weighted bucket rollup
  const tasks: TaskRiskBreakdown[] = (occ.tasks ?? []).map((t) => {
    const score = taskRiskScore(occ.exposure, t);
    return {
      taskName: t.name,
      category: t.category,
      importance: t.importance,
      riskScore: score,
      riskBucket: bucketFor(score),
    };
  });

  const totalImportance = tasks.reduce((s, t) => s + t.importance, 0);
  let high = 0;
  let med = 0;
  let low = 0;
  for (const t of tasks) {
    if (t.riskBucket === "high") high += t.importance;
    else if (t.riskBucket === "medium") med += t.importance;
    else low += t.importance;
  }
  const pctHighRiskTime = totalImportance > 0 ? (high / totalImportance) * 100 : 0;
  const pctMediumRiskTime = totalImportance > 0 ? (med / totalImportance) * 100 : 0;
  const pctLowRiskTime = totalImportance > 0 ? (low / totalImportance) * 100 : 0;

  return {
    slug: occ.slug,
    title: occ.title,
    onetCode: occ.onetCode,
    category: occ.category,
    jobs: typeof occ.jobs === "number" ? occ.jobs : 0,
    pay: typeof occ.pay === "number" ? occ.pay : 0,
    exposure: occ.exposure,

    technicalExposure,
    adoptionSpeed,
    adaptability,
    demandElasticity,
    complementarity,

    netRisk,
    netRisk100: Math.round(netRisk * 10),

    tasks,
    pctHighRiskTime,
    pctMediumRiskTime,
    pctLowRiskTime,
    effectiveDimensions: effectiveDims,
  };
}

/**
 * Score the full 342-occupation set in one call. Pre-builds the pay
 * percentile distribution so each occupation gets the same denominator.
 */
export function scoreAllOccupations(
  occupations: EnrichedOccupation[]
): DetailedOccupationRisk[] {
  const payPercentile = buildPayPercentile(occupations);
  return occupations.map((occ) => scoreOccupation(occ, { payPercentile }));
}
