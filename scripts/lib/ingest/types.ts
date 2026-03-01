import type { EvidenceTier } from "../../../src/lib/types";

/** Raw content fetched from a source */
export interface SourceContent {
  text: string;
  url?: string;
  title?: string;
}

/** User-provided overrides for source metadata */
export interface SourceOverrides {
  title?: string;
  publisher?: string;
  datePublished?: string;
  evidenceTier?: EvidenceTier;
  url?: string;
  sourceId?: string;
}

/** Metadata about a source, extracted or provided */
export interface SourceMetadata {
  title: string;
  publisher: string;
  datePublished: string;
  evidenceTier: EvidenceTier;
  url: string;
}

/** A single statistic extracted from the source */
export interface ExtractedStat {
  exactQuote: string;
  value: number;
  isRange: boolean;
  rangeLow?: number;
  rangeHigh?: number;
  unit: string;
  timeHorizon: string;
  targetGraphSlug: string;
  dataType: "data_point" | "overlay";
  direction?: "up" | "down" | "neutral";
  contextLabel?: string;
  plottabilityReason: string;
}

/** Full result from the Claude extraction pipeline */
export interface ExtractionResult {
  sourceMetadata: SourceMetadata;
  statistics: ExtractedStat[];
}

/** Summary info about an existing prediction graph */
export interface GraphInfo {
  slug: string;
  title: string;
  description: string;
  unit: string;
  category: string;
  currentValue: number;
  timeHorizon: string;
  existingSourceIds: string[];
  filePath: string;
}

/** A proposed change to a prediction JSON file */
export interface ProposedChange {
  graphSlug: string;
  graphTitle: string;
  filePath: string;
  stat: ExtractedStat;
  sourceId: string;
  sourceEntry: {
    id: string;
    title: string;
    url: string;
    publisher: string;
    evidenceTier: EvidenceTier;
    datePublished: string;
    excerpt: string;
  };
  historyEntry?: {
    date: string;
    value: number;
    confidenceLow?: number;
    confidenceHigh?: number;
    sourceIds: string[];
    evidenceTier: EvidenceTier;
  };
  overlayEntry?: {
    date: string;
    direction: "up" | "down" | "neutral";
    sourceIds: string[];
    evidenceTier: EvidenceTier;
    label: string;
  };
}
