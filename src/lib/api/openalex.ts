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
      id?: string;
    } | null;
    landing_page_url?: string | null;
    pdf_url?: string | null;
  } | null;
  authorships: Array<{
    author: {
      id: string;
      display_name: string;
    };
  }>;
  abstract_inverted_index: Record<string, number[]> | null;
  concepts: Array<{
    id: string;
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
const MAILTO = "dashboard@example.com"; // polite pool

// OpenAlex concept IDs for relevant fields
const SEARCH_FILTER =
  'default.search:"artificial intelligence" AND ("labor market" OR "employment" OR "wages" OR "automation" OR "job displacement")';

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

/**
 * Core fetch function for OpenAlex works endpoint.
 */
async function fetchOpenAlexWorks(
  filter: string,
  limit = 50,
  sort = "cited_by_count:desc"
): Promise<OpenAlexWork[]> {
  const params = new URLSearchParams({
    filter,
    sort,
    per_page: String(limit),
    mailto: MAILTO,
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

/**
 * Original keyword-based search (existing behavior).
 */
export async function searchOpenAlex(
  limit = 50
): Promise<OpenAlexWork[]> {
  return fetchOpenAlexWorks(
    `from_publication_date:2023-01-01,${SEARCH_FILTER}`,
    limit
  );
}

/**
 * Concept-based search using OpenAlex concept IDs.
 * Labor economics: C118084267, Artificial intelligence: C154945302
 */
export async function searchOpenAlexByConcepts(
  limit = 25
): Promise<OpenAlexWork[]> {
  return fetchOpenAlexWorks(
    "from_publication_date:2023-01-01,concepts.id:C118084267|C154945302",
    limit,
    "publication_date:desc"
  );
}

/**
 * Search for works by a specific institution + keywords.
 * Used by IMF and IZA wrappers.
 */
export async function searchOpenAlexByInstitution(
  institutionId: string,
  keywords: string,
  limit = 25
): Promise<OpenAlexWork[]> {
  return fetchOpenAlexWorks(
    `from_publication_date:2023-01-01,institutions.id:${institutionId},default.search:${keywords}`,
    limit,
    "publication_date:desc"
  );
}

/**
 * Search for works by a specific source (journal/series).
 * Used by IZA wrapper.
 */
export async function searchOpenAlexBySource(
  sourceId: string,
  keywords: string,
  limit = 25
): Promise<OpenAlexWork[]> {
  return fetchOpenAlexWorks(
    `from_publication_date:2023-01-01,primary_location.source.id:${sourceId},default.search:${keywords}`,
    limit,
    "publication_date:desc"
  );
}

/**
 * Fetch recent works by a specific author.
 * Used by the author tracking system.
 */
export async function fetchAuthorWorks(
  authorId: string,
  sinceDate: string,
  limit = 25
): Promise<OpenAlexWork[]> {
  return fetchOpenAlexWorks(
    `author.id:${authorId},from_publication_date:${sinceDate}`,
    limit,
    "publication_date:desc"
  );
}

/**
 * Resolve an author name to an OpenAlex author ID.
 */
export async function resolveAuthorId(
  name: string
): Promise<string | null> {
  const params = new URLSearchParams({
    search: name,
    per_page: "1",
    mailto: MAILTO,
  });

  try {
    const res = await fetch(`${OPENALEX_BASE}/authors?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 * 7 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].id;
    }
  } catch {
    console.error(`Failed to resolve author: ${name}`);
  }

  return null;
}

/**
 * Main discovery function — combines keyword search + concept search.
 */
export async function discoverOpenAlexPapers(
  limit = 50
): Promise<OpenAlexWork[]> {
  try {
    const [keywordResults, conceptResults] = await Promise.all([
      searchOpenAlex(limit),
      searchOpenAlexByConcepts(25).catch(() => [] as OpenAlexWork[]),
    ]);

    // Deduplicate by ID
    const seen = new Set<string>();
    const combined: OpenAlexWork[] = [];

    for (const work of [...keywordResults, ...conceptResults]) {
      if (!seen.has(work.id)) {
        seen.add(work.id);
        combined.push(work);
      }
    }

    return combined;
  } catch (err) {
    console.error("OpenAlex search failed:", err);
    return [];
  }
}
