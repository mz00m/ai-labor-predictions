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
  | "twitter"
  | "googleCse"
  | "reddit"
  | "hnAlgolia"
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
}

export interface SourceAdapter {
  name: SourceName;
  tier: "academic" | "policy" | "signal";
  fetch(query: string, since: Date): Promise<RawItem[]>;
}
