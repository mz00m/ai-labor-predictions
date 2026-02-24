export interface OpenAlexWork {
  id: string;
  doi: string | null;
  title: string;
  publication_date: string | null;
  publication_year: number | null;
  cited_by_count: number;
  primary_location: {
    source?: {
      display_name: string;
    } | null;
    landing_page_url?: string | null;
    pdf_url?: string | null;
  } | null;
  authorships: Array<{
    author: {
      display_name: string;
    };
  }>;
  abstract_inverted_index: Record<string, number[]> | null;
  concepts: Array<{
    display_name: string;
    score: number;
  }>;
  type: string;
}

interface OpenAlexResponse {
  meta: { count: number };
  results: OpenAlexWork[];
}

const OPENALEX_BASE = "https://api.openalex.org";

// OpenAlex filter: require AI + labor terms, exclude medical/bio results
const SEARCH_FILTER =
  'default.search:"artificial intelligence" AND ("labor market" OR "employment" OR "wages" OR "automation" OR "job displacement") NOT ("cancer" OR "clinical trial" OR "patient" OR "diagnosis" OR "cardiac")';

/**
 * Reconstruct abstract from OpenAlex inverted index format
 */
export function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null
): string | null {
  if (!invertedIndex) return null;

  const words: Array<[number, string]> = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words.push([pos, word]);
    }
  }
  words.sort((a, b) => a[0] - b[0]);
  return words.map(([, w]) => w).join(" ");
}

export async function searchOpenAlex(
  limit = 50
): Promise<OpenAlexWork[]> {
  const params = new URLSearchParams({
    filter: `from_publication_date:2023-01-01,${SEARCH_FILTER}`,
    sort: "cited_by_count:desc",
    per_page: String(limit),
    mailto: "dashboard@example.com", // polite pool
  });

  const res = await fetch(`${OPENALEX_BASE}/works?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`OpenAlex API error: ${res.status}`);
  }

  const data: OpenAlexResponse = await res.json();
  return data.results;
}

export async function discoverOpenAlexPapers(
  limit = 50
): Promise<OpenAlexWork[]> {
  try {
    return await searchOpenAlex(limit);
  } catch (err) {
    console.error("OpenAlex search failed:", err);
    return [];
  }
}
