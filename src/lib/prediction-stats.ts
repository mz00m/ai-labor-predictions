import { EvidenceTier, HistoricalDataPoint, Prediction } from "./types";

export interface AggregateStats {
  /** Weighted mean of all filtered data-point values, rounded to 1 decimal */
  mean: number;
  /** Minimum value across all filtered data points */
  min: number;
  /** Maximum value across all filtered data points */
  max: number;
  /** Trend direction based on last vs first data point */
  trend: "up" | "down" | "flat";
  /** Whether the trend is "bad" given the prediction category */
  trendIsBad: boolean;
}

/** Weight multiplier for evidence tier (higher = more trusted) */
const TIER_WEIGHT: Record<EvidenceTier, number> = {
  1: 4, // Verified research & data
  2: 2, // Institutional analysis
  3: 1, // Journalism & commentary
  4: 0.5, // Informal & social
};

/**
 * Compute a recency weight that increases linearly from 1.0 for the
 * oldest point to 1.5 for the newest. Reduced from the original 2.0×
 * to prevent a new Tier 2 source from fully offsetting an older Tier 1
 * paper (previously: Tier 2 × 2.0 = 4.0 equalled Tier 1 × 1.0 = 4.0).
 */
function recencyWeight(dateMs: number, minMs: number, maxMs: number): number {
  if (maxMs === minMs) return 1;
  const t = (dateMs - minMs) / (maxMs - minMs); // 0 → 1
  return 1 + t * 0.5; // 1.0 → 1.5
}

/**
 * Optional sample-size quality boost applied within a tier.
 * Data points with sampleSize metadata get a log-scaled boost
 * so that large-n studies (e.g., Census 10M records) meaningfully
 * outweigh small-n studies (e.g., 240 freelance tasks) within the
 * same tier, without completely drowning them out.
 *
 * Returns 1.0 when no sampleSize is set (neutral).
 * Range: ~1.0 (n≤100) to ~2.0 (n≥100K).
 */
function sampleSizeWeight(point: HistoricalDataPoint): number {
  if (!point.sampleSize || point.sampleSize <= 0) return 1;
  // log10(100)=2, log10(100000)=5 → map to 1.0–2.0
  const logN = Math.log10(Math.max(point.sampleSize, 100));
  return Math.min(1 + (logN - 2) / 3, 2);
}

/**
 * Compute the headline aggregate and trend from filtered history points.
 *
 * Weighting: each data point's weight = tierWeight × recencyWeight.
 * Tier 1 research counts 4×, tier 4 social counts 0.5×.
 * The newest point gets 2× the recency weight of the oldest.
 * Trend compares first and last points chronologically.
 */
export function computeAggregate(
  prediction: Prediction,
  selectedTiers: EvidenceTier[]
): AggregateStats {
  const points = prediction.history
    .filter((d) => selectedTiers.includes(d.evidenceTier))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (points.length === 0) {
    // No points matched selected tiers — re-run with ALL tiers before falling back to 0
    const allTiers: EvidenceTier[] = [1, 2, 3, 4];
    const allPoints = prediction.history
      .filter((d) => allTiers.includes(d.evidenceTier))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (allPoints.length === 0) {
      const v = prediction.currentValue ?? 0;
      return { mean: v, min: v, max: v, trend: "flat", trendIsBad: false };
    }

    // Recurse with all tiers
    return computeAggregate(prediction, allTiers);
  }

  const values = points.map((p) => p.value);
  const min = Math.round(Math.min(...values) * 10) / 10;
  const max = Math.round(Math.max(...values) * 10) / 10;

  const timestamps = points.map((p) => new Date(p.date).getTime());
  const minMs = timestamps[0];
  const maxMs = timestamps[timestamps.length - 1];

  let weightedSum = 0;
  let totalWeight = 0;
  for (let i = 0; i < points.length; i++) {
    const w =
      TIER_WEIGHT[points[i].evidenceTier] *
      recencyWeight(timestamps[i], minMs, maxMs) *
      sampleSizeWeight(points[i]);
    weightedSum += points[i].value * w;
    totalWeight += w;
  }

  const mean = Math.round((weightedSum / totalWeight) * 10) / 10;

  let trend: "up" | "down" | "flat" = "flat";
  if (points.length >= 2) {
    const first = points[0].value;
    const last = points[points.length - 1].value;
    if (last > first) trend = "up";
    else if (last < first) trend = "down";
  }

  const trendIsBad =
    (prediction.category === "displacement" && trend === "up") ||
    (prediction.category === "wages" && trend === "down");

  return { mean, min, max, trend, trendIsBad };
}
