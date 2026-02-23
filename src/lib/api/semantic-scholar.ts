export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string | null;
  year: number | null;
  publicationDate: string | null;
  url: string;
  venue: string | null;
  citationCount: number;
  authors: Array<{ name: string }>;
  openAccessPdf?: { url: string } | null;
  tldr?: { text: string } | null;
}

interface S2SearchResponse {
  total: number;
  data: SemanticScholarPaper[];
}

const S2_BASE = "https://api.semanticscholar.org/graph/v1";

const AI_LABOR_QUERIES = [
  "artificial intelligence labor market displacement",
  "AI automation employment effects",
  "generative AI jobs wages",
  "machine learning workforce impact",
  "AI wage inequality automation",
];

const FIELDS = [
  "paperId",
  "title",
  "abstract",
  "year",
  "publicationDate",
  "url",
  "venue",
  "citationCount",
  "authors",
  "openAccessPdf",
  "tldr",
].join(",");

export async function searchPapers(
  query: string,
  limit = 20,
  offset = 0
): Promise<S2SearchResponse> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset),
    fields: FIELDS,
    year: "2023-",
  });

  const res = await fetch(`${S2_BASE}/paper/search?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) {
    throw new Error(`Semantic Scholar API error: ${res.status}`);
  }

  return res.json();
}

export async function discoverRecentPapers(
  maxPerQuery = 10
): Promise<SemanticScholarPaper[]> {
  const allPapers: SemanticScholarPaper[] = [];
  const seenIds = new Set<string>();

  for (const query of AI_LABOR_QUERIES) {
    try {
      const result = await searchPapers(query, maxPerQuery);
      for (const paper of result.data) {
        if (!seenIds.has(paper.paperId)) {
          seenIds.add(paper.paperId);
          allPapers.push(paper);
        }
      }
      // Rate limit: S2 allows 1 request per second without API key
      await new Promise((resolve) => setTimeout(resolve, 1100));
    } catch (err) {
      console.error(`S2 search failed for "${query}":`, err);
    }
  }

  // Sort by citation count (proxy for relevance/impact)
  return allPapers.sort((a, b) => b.citationCount - a.citationCount);
}
