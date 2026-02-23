export interface COREWork {
  id: string;
  title: string;
  abstract: string | null;
  authors: Array<{ name: string }>;
  publishedDate: string | null;
  doi: string | null;
  downloadUrl: string | null;
  citationCount: number;
  sourceFulltextUrls: string[];
}

interface CORESearchResponse {
  totalHits: number;
  results: Array<{
    id: number;
    title: string;
    abstract?: string;
    authors?: Array<{ name: string }>;
    datePublished?: string;
    doi?: string;
    downloadUrl?: string;
    citationCount?: number;
    sourceFulltextUrls?: string[];
  }>;
}

const CORE_BASE = "https://api.core.ac.uk/v3";

const CORE_QUERIES = [
  '"artificial intelligence" AND "labor market"',
  '"generative AI" AND ("employment" OR "jobs")',
  '"large language model" AND ("workforce" OR "wages")',
  '"AI automation" AND ("job displacement" OR "labor")',
];

async function searchCORE(
  query: string,
  limit = 15
): Promise<COREWork[]> {
  const apiKey = process.env.CORE_API_KEY;
  if (!apiKey) {
    console.warn("CORE_API_KEY not set, skipping CORE search");
    return [];
  }

  const res = await fetch(`${CORE_BASE}/search/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      q: query,
      limit,
      offset: 0,
    }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`CORE API error: ${res.status}`);
  }

  const data: CORESearchResponse = await res.json();
  return (data.results || []).map((r) => ({
    id: String(r.id),
    title: r.title || "",
    abstract: r.abstract || null,
    authors: r.authors || [],
    publishedDate: r.datePublished || null,
    doi: r.doi || null,
    downloadUrl: r.downloadUrl || null,
    citationCount: r.citationCount || 0,
    sourceFulltextUrls: r.sourceFulltextUrls || [],
  }));
}

export async function discoverCOREPapers(
  maxPerQuery = 10
): Promise<COREWork[]> {
  const allPapers: COREWork[] = [];
  const seenIds = new Set<string>();

  for (const query of CORE_QUERIES) {
    try {
      const papers = await searchCORE(query, maxPerQuery);
      for (const paper of papers) {
        if (!seenIds.has(paper.id)) {
          seenIds.add(paper.id);
          allPapers.push(paper);
        }
      }
      // Rate limit: 100ms between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      console.error("CORE search failed for query:", err);
    }
  }

  return allPapers;
}
