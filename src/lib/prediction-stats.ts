import { EvidenceTier, HistoricalDataPoint, Prediction } from "./types";

export interface AggregateStats {
  /** Weighted mean of all filtered data-point values, rounded to 1 decimal */
  mean: number;
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
 * oldest point to 2.0 for the newest. If all points share the same
 * date the weight is 1.0 for all.
 */
function recencyWeight(dateMs: number, minMs: number, maxMs: number): number {
  if (maxMs === minMs) return 1;
  const t = (dateMs - minMs) / (maxMs - minMs); // 0 → 1
  return 1 + t; // 1.0 → 2.0
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
    return { mean: prediction.currentValue, trend: "flat", trendIsBad: false };
  }

  const timestamps = points.map((p) => new Date(p.date).getTime());
  const minMs = timestamps[0];
  const maxMs = timestamps[timestamps.length - 1];

  let weightedSum = 0;
  let totalWeight = 0;
  for (let i = 0; i < points.length; i++) {
    const w =
      TIER_WEIGHT[points[i].evidenceTier] *
      recencyWeight(timestamps[i], minMs, maxMs);
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

  return { mean, trend, trendIsBad };
}
