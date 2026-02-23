export type EvidenceTier = 1 | 2 | 3 | 4;

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
  excerpt?: string;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  sourceIds: string[];
  evidenceTier: EvidenceTier;
}

export interface Prediction {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "displacement" | "wages" | "adoption" | "signals";
  unit: string;
  currentValue: number;
  timeHorizon: string;
  history: HistoricalDataPoint[];
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
