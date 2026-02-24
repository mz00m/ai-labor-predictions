import { EvidenceTier, HistoricalDataPoint, Prediction } from "./types";

export interface AggregateStats {
  /** Mean of all filtered data-point values, rounded to 1 decimal */
  mean: number;
  /** Trend direction based on last vs first data point */
  trend: "up" | "down" | "flat";
  /** Whether the trend is "bad" given the prediction category */
  trendIsBad: boolean;
}

/**
 * Compute the headline aggregate and trend from filtered history points.
 * Mean gives equal weight to every source-stated value in the series.
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

  const sum = points.reduce((acc, p) => acc + p.value, 0);
  const mean = Math.round((sum / points.length) * 10) / 10;

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
