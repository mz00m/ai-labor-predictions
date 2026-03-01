import { EvidenceTier } from "../types";
import { ResearchSource } from "../api/research-aggregator";

export interface DigestPaper {
  id: string;
  title: string;
  abstract: string | null;
  authors: string[];
  publishedDate: string | null;
  url: string;
  pdfUrl: string | null;
  doi: string | null;
  citationCount: number;
  classifiedTier: EvidenceTier;
  source: ResearchSource;
  relevanceScore: number;
  linkedPredictions: Array<{
    slug: string;
    title: string;
    relevanceScore: number;
  }>;
  isTrackedAuthor: boolean;
  trackedAuthorName?: string;
  compositeScore: number;
}

export interface SuggestedDataPoint {
  predictionSlug: string;
  predictionTitle: string;
  date: string;
  value: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  unit: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  evidenceTier: EvidenceTier;
  excerpt: string;
  digestPaperId: string;
  confidence: "high" | "medium" | "low";
}

export interface WeeklyDigest {
  weekId: string; // "2026-W08"
  generatedAt: string; // ISO timestamp
  dateRange: {
    from: string;
    to: string;
  };
  totalPapersDiscovered: number;
  totalAfterDedup: number;
  papers: DigestPaper[];
  byCategory: {
    displacement: DigestPaper[];
    wages: DigestPaper[];
    adoption: DigestPaper[];
    signals: DigestPaper[];
    unlinked: DigestPaper[];
  };
  stats: {
    bySource: Record<string, number>;
    byTier: Record<string, number>;
    trackedAuthorCount: number;
  };
  suggestedDataPoints?: SuggestedDataPoint[];
}
