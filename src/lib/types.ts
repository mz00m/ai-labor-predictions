export type EvidenceTier = 1 | 2 | 3 | 4;

export type MetricType = "employment" | "postings" | "survey" | "projection" | "corporate";

/**
 * Known proxy-to-target conversion factors.
 * Used when a study measures a related but different metric than the graph's unit.
 * E.g., job posting declines are a proxy for displacement but overstate the effect.
 */
export interface ProxyContext {
  /** What the study actually measures (e.g., "relative job posting decline") */
  actualUnit: string;
  /** Conversion factor applied: convertedValue = rawValue × conversionFactor */
  conversionFactor: number;
  /** Lower bound of reasonable conversion range */
  conversionLow: number;
  /** Upper bound of reasonable conversion range */
  conversionHigh: number;
  /** Brief rationale for the conversion (e.g., "posting declines overstate displacement ~2-3x per Cajner et al.") */
  rationale: string;
}

export const EVIDENCE_TIER_LABELS: Record<EvidenceTier, string> = {
  1: "Verified Data & Research",
  2: "Institutional Analysis",
  3: "Journalism & Commentary",
  4: "Informal & Social",
};

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  evidenceTier: EvidenceTier;
  datePublished: string;
  dateAdded?: string;
  excerpt?: string;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  sourceIds: string[];
  evidenceTier: EvidenceTier;
  dataType?: "observed" | "projected";
  metricType?: MetricType;
  /** Approximate sample size for within-tier quality weighting (optional) */
  sampleSize?: number;
  /**
   * Marks this data point as a proxy measurement — the study measures something
   * correlated with but not identical to the graph's unit.
   *
   * When true:
   * - `value` should already be the CONVERTED value (rawValue × conversionFactor)
   * - `confidenceLow`/`confidenceHigh` should reflect conversion uncertainty
   * - The point receives a 0.5× weight discount in weighted averages
   * - The chart tooltip shows the proxy label for transparency
   *
   * When false/undefined: standard direct measurement.
   */
  isProxy?: boolean;
  /** Conversion metadata — required when isProxy is true */
  proxyContext?: ProxyContext;
}

/** A qualitative/directional study shown as a horizontal band rather than a point */
export interface DirectionalOverlay {
  date: string;
  direction: "up" | "down" | "neutral";
  sourceIds: string[];
  evidenceTier: EvidenceTier;
  label: string;
}

export interface Prediction {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "displacement" | "wages" | "adoption" | "signals" | "exposure";
  unit: string;
  currentValue?: number;
  currentValueSource?: string;
  currentValueMethodology?: string;
  /** "weighted" (default) averages competing estimates; "latest" uses the most recent data point (for time-series observed data like adoption rates) */
  aggregationMethod?: "weighted" | "latest";
  timeHorizon: string;
  history: HistoricalDataPoint[];
  overlays?: DirectionalOverlay[];
  sources: Source[];
  marketIds?: {
    polymarket?: string;
    metaculus?: number;
    kalshi?: string;
  };
}

export interface PredictionsResponse {
  predictions: Prediction[];
  lastUpdated: string;
}
