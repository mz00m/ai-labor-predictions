/**
 * Shared scoring primitives for the 5-dimensional risk framework.
 *
 * Used by both:
 *   - composite-risk.ts (22 SOC major groups)
 *   - karpathy-scoring.ts (342 individual occupations)
 *   - /occupation-exposure/[slug] (per-occupation explorer pages)
 */

/** Weights for the composite score */
export const WEIGHTS = {
  technicalExposure: 0.30,
  adoptionSpeed: 0.20,
  adaptability: 0.15,
  demandElasticity: 0.15,
  complementarity: 0.20,
} as const;

/** Map demand elasticity labels to 0-10 scores */
export const ELASTICITY_SCORES: Record<string, number> = {
  high: 8,
  moderate: 5,
  low: 2,
};

/**
 * Convert SOC_INDUSTRY_SPEED multiplier to 0-10 speed score.
 * Lower multiplier = faster adoption = higher score.
 * Range: 0.6 (fastest, Technology) to 1.4 (slowest, Healthcare).
 */
export function adoptionSpeedScore(multiplier: number): number {
  return Math.max(0, Math.min(10, ((1.4 - multiplier) / 0.8) * 10));
}

/**
 * Convert CFO NEI to complementarity score.
 * NEI < 0.3 = strongly enhancement-dominant (score ~9)
 * NEI ~ 1.0 = balanced (score ~5)
 * NEI > 1.5 = replacement-dominant (score ~2)
 */
export function complementarityFromNEI(nei: number): number {
  return Math.max(0, Math.min(10, 10 - nei * 5));
}

/**
 * Estimate complementarity from task composition when no CFO survey data exists.
 * High physical/interpersonal = more complementary (AI assists, doesn't replace).
 * High information-processing = less complementary (AI directly substitutes).
 */
export function estimateComplementarityFromTasks(
  taskComposition: Record<string, number>
): number {
  const complementaryShare =
    taskComposition["interpersonal"] +
    taskComposition["physical-manual"] +
    taskComposition["coordination-management"] * 0.5 +
    taskComposition["analysis-decision"] * 0.3;
  const substitutionShare =
    taskComposition["information-processing"] +
    taskComposition["communication"] * 0.5;
  const taskRatio = complementaryShare / Math.max(0.1, substitutionShare);
  return Math.max(1, Math.min(9, taskRatio * 3));
}

/**
 * Count effective task dimensions (categories with >= 10% time share).
 * Captures the O-Ring insight from Gans & Goldfarb (2024): jobs with
 * more complementary task clusters see augmentation rather than replacement.
 */
export function getEffectiveDimensions(
  taskComposition: Record<string, number>
): number {
  return Object.values(taskComposition).filter((share) => share >= 0.10).length;
}

/**
 * Compute dimensionality adjustment for complementarity.
 * @param effectiveDims - number of task dimensions with >= 10% share
 * @param hasCfoData - whether this uses CFO survey data (milder adjustment) or heuristic
 * @param lowThreshold - dims at or below this get a penalty (default: 2 for groups, 3 for individual occupations)
 */
export function dimensionalityAdjustment(
  effectiveDims: number,
  hasCfoData: boolean,
  lowThreshold: number = 2
): number {
  if (hasCfoData) {
    // Mild adjustment for CFO-backed scores
    return effectiveDims <= lowThreshold ? -0.5 : effectiveDims >= 6 ? 0.5 : 0;
  }
  // Stronger adjustment for heuristic estimates
  return effectiveDims <= lowThreshold ? -1.5 : effectiveDims >= 5 ? 1.0 : 0;
}

/** Clamp a value to 0-10 */
export function clamp010(value: number): number {
  return Math.max(0, Math.min(10, value));
}

/**
 * Compute net displacement risk from the 5 dimension scores.
 * Pressure (exposure + speed) vs absorption (adaptability + elasticity + complementarity),
 * each normalized independently so defensive factors can fully counterbalance pressure.
 */
export function computeNetRisk(scores: {
  technicalExposure: number;
  adoptionSpeed: number;
  adaptability: number;
  demandElasticity: number;
  complementarity: number;
}): number {
  const pressureWeightSum = WEIGHTS.technicalExposure + WEIGHTS.adoptionSpeed;
  const absorptionWeightSum =
    WEIGHTS.adaptability + WEIGHTS.demandElasticity + WEIGHTS.complementarity;

  const pressureNorm =
    (WEIGHTS.technicalExposure * scores.technicalExposure +
      WEIGHTS.adoptionSpeed * scores.adoptionSpeed) /
    pressureWeightSum;
  const absorptionNorm =
    (WEIGHTS.adaptability * scores.adaptability +
      WEIGHTS.demandElasticity * scores.demandElasticity +
      WEIGHTS.complementarity * scores.complementarity) /
    absorptionWeightSum;

  return clamp010((pressureNorm - absorptionNorm + 10) / 2);
}
