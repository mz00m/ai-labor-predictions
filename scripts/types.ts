/**
 * Shared types for the digest pipeline.
 */

export type SourceName =
  | "scopus"
  | "core"
  | "semanticScholar"
  | "arxiv"
  | "ssrn"
  | "pubmed"
  | "nber"
  | "bls"
  | "fred"
  | "openAlex"
  | "trackedInstitutions"
  | "twitter"
  | "googleCse"
  | "reddit"
  | "hnAlgolia"
  | "recurringSeries"
  | "substack";

export interface RawItem {
  title: string;
  url: string;
  doi?: string;
  abstract?: string;
  authors?: string[];
  publishedAt: Date;
  citationCount?: number;
  source: SourceName;
  /**
   * Pre-computed score that bypasses relevance ranking. Set by adapters whose
   * items are work-queue entries rather than discovery candidates, where
   * recency decay is meaningless or inverted.
   */
  priorityScore?: number;
}

export interface SourceAdapter {
  name: SourceName;
  tier: "academic" | "policy" | "signal";
  fetch(query: string, since: Date): Promise<RawItem[]>;
}
