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
  /** True when selected tiers had no data and we fell back to all tiers */
  tierFallback?: boolean;
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
 * Proxy metric discount: data points measuring a proxy (e.g., job posting
 * declines used as evidence for displacement) receive 0.5× weight since the
 * measurement is indirect. The value has already been converted via the
 * conversionFactor, but we still want direct measurements to dominate the
 * weighted average.
 *
 * Returns 0.5 for proxy points, 1.0 for direct measurements.
 */
function proxyWeight(point: HistoricalDataPoint): number {
  return point.isProxy ? 0.5 : 1;
}

/**
 * Compute the headline aggregate and trend from filtered history points.
 *
 * Weighting: each data point's weight = tierWeight × recencyWeight.
 * Tier 1 research counts 4×, tier 4 social counts 0.5×.
 * The newest point gets 2× the recency weight of the oldest.
 * Trend compares first and last points chronologically.
 */
/** Parse date string to ms timestamp (cached to avoid repeated parsing). */
function dateToMs(dateStr: string): number {
  return new Date(dateStr).getTime();
}

/** Sort + attach timestamps to avoid repeated Date parsing. */
function filterAndSort(
  history: HistoricalDataPoint[],
  tiers: EvidenceTier[]
): { points: HistoricalDataPoint[]; timestamps: number[] } {
  const filtered = history.filter((d) => tiers.includes(d.evidenceTier));
  const withTs = filtered.map((p) => ({ p, ts: dateToMs(p.date) }));
  withTs.sort((a, b) => a.ts - b.ts);
  return {
    points: withTs.map((x) => x.p),
    timestamps: withTs.map((x) => x.ts),
  };
}

export function computeAggregate(
  prediction: Prediction,
  selectedTiers: EvidenceTier[]
): AggregateStats {
  let { points, timestamps } = filterAndSort(prediction.history, selectedTiers);

  if (points.length === 0) {
    // No points matched selected tiers - try ALL tiers before falling back to 0
    const allTiers: EvidenceTier[] = [1, 2, 3, 4];
    const all = filterAndSort(prediction.history, allTiers);

    if (all.points.length === 0) {
      const v = prediction.currentValue ?? 0;
      return { mean: v, min: v, max: v, trend: "flat", trendIsBad: false };
    }

    points = all.points;
    timestamps = all.timestamps;
    // Compute with fallback data and flag it
    const result = computeFromSorted(prediction, points, timestamps);
    return { ...result, tierFallback: true };
  }

  return computeFromSorted(prediction, points, timestamps);
}

function computeFromSorted(
  prediction: Prediction,
  points: HistoricalDataPoint[],
  timestamps: number[]
): AggregateStats {
  const values = points.map((p) => p.value);
  const min = Math.round(Math.min(...values) * 10) / 10;
  const max = Math.round(Math.max(...values) * 10) / 10;

  // For time-series observed data (e.g. adoption rates), use the latest value
  // instead of averaging all historical measurements together.
  const useLatest = prediction.aggregationMethod === "latest";

  let mean: number;

  if (useLatest) {
    const latest = points[points.length - 1];
    mean = Math.round(latest.value * 10) / 10;
  } else {
    const minMs = timestamps[0];
    const maxMs = timestamps[timestamps.length - 1];

    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < points.length; i++) {
      const w =
        TIER_WEIGHT[points[i].evidenceTier] *
        recencyWeight(timestamps[i], minMs, maxMs) *
        sampleSizeWeight(points[i]) *
        proxyWeight(points[i]);
      weightedSum += points[i].value * w;
      totalWeight += w;
    }

    mean = Math.round((weightedSum / totalWeight) * 10) / 10;
  }

  // Trend: for "latest" aggregation (time-series), compare first/last directly.
  // For "weighted" aggregation, use only observed data points so the trend
  // reflects real-world change, not source accretion from new projections.
  let trend: "up" | "down" | "flat" = "flat";
  if (useLatest) {
    if (points.length >= 2) {
      const first = points[0].value;
      const last = points[points.length - 1].value;
      if (last > first) trend = "up";
      else if (last < first) trend = "down";
    }
  } else {
    const observed = points.filter((p) => p.dataType === "observed");
    if (observed.length >= 2) {
      const first = observed[0].value;
      const last = observed[observed.length - 1].value;
      if (last > first) trend = "up";
      else if (last < first) trend = "down";
    }
    // If no observed data, trend stays "flat" - projections don't imply trajectory
  }

  const trendIsBad =
    (prediction.category === "displacement" && trend === "up") ||
    (prediction.category === "wages" && trend === "down");

  return { mean, min, max, trend, trendIsBad };
}
