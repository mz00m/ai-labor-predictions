export type EvidenceTier = 1 | 2 | 3 | 4;

export type MetricType = "employment" | "postings" | "survey" | "projection" | "corporate";

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
