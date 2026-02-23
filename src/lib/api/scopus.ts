export interface ScopusEntry {
  "dc:identifier": string;
  "dc:title": string;
  "dc:creator"?: string;
  "prism:doi"?: string;
  "prism:publicationName"?: string;
  "citedby-count": string;
  "prism:coverDate"?: string;
  link: Array<{ "@ref": string; "@href": string }>;
  "prism:aggregationType"?: string;
}

interface ScopusResponse {
  "search-results": {
    "opensearch:totalResults": string;
    entry: ScopusEntry[];
  };
}

export interface ScopusPaper {
  scopusId: string;
  title: string;
  doi: string | null;
  creator: string;
  publicationName: string | null;
  citedByCount: number;
  coverDate: string | null;
  url: string;
}

const SCOPUS_BASE = "https://api.elsevier.com/content/search/scopus";

const SCOPUS_QUERIES = [
  'TITLE-ABS-KEY("artificial intelligence" AND "labor market") AND PUBYEAR > 2023',
  'TITLE-ABS-KEY("generative AI" AND ("employment" OR "jobs" OR "workforce")) AND PUBYEAR > 2023',
  'TITLE-ABS-KEY("large language model" AND ("job displacement" OR "automation" OR "wages")) AND PUBYEAR > 2023',
  'TITLE-ABS-KEY("AI" AND "labor economics") AND PUBYEAR > 2023',
  'TITLE-ABS-KEY("machine learning" AND ("wage" OR "labor" OR "occupation")) AND PUBYEAR > 2024',
];

function parseScopusEntry(entry: ScopusEntry): ScopusPaper {
  const scopusLink = entry.link?.find((l) => l["@ref"] === "scopus");
  return {
    scopusId: entry["dc:identifier"] || "",
    title: entry["dc:title"] || "",
    doi: entry["prism:doi"] || null,
    creator: entry["dc:creator"] || "Unknown",
    publicationName: entry["prism:publicationName"] || null,
    citedByCount: parseInt(entry["citedby-count"] || "0", 10),
    coverDate: entry["prism:coverDate"] || null,
    url: scopusLink?.["@href"] || `https://www.scopus.com/record/display.uri?eid=${entry["dc:identifier"]}`,
  };
}

async function searchScopus(
  query: string,
  count = 15
): Promise<ScopusPaper[]> {
  const apiKey = process.env.SCOPUS_API_KEY;
  if (!apiKey) {
    console.warn("SCOPUS_API_KEY not set, skipping Scopus search");
    return [];
  }

  const params = new URLSearchParams({
    query,
    count: String(count),
    sort: "-citedby-count",
    field: "dc:identifier,dc:title,dc:creator,prism:doi,prism:publicationName,citedby-count,prism:coverDate,link",
  });

  const res = await fetch(`${SCOPUS_BASE}?${params}`, {
    headers: {
      "X-ELS-APIKey": apiKey,
      Accept: "application/json",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Scopus API error: ${res.status}`);
  }

  const data: ScopusResponse = await res.json();
  const entries = data["search-results"]?.entry || [];

  // Scopus returns an error entry when no results found
  if (entries.length === 1 && "error" in entries[0]) {
    return [];
  }

  return entries.map(parseScopusEntry);
}

export async function discoverScopusPapers(
  maxPerQuery = 10
): Promise<ScopusPaper[]> {
  const allPapers: ScopusPaper[] = [];
  const seenIds = new Set<string>();

  for (const query of SCOPUS_QUERIES) {
    try {
      const papers = await searchScopus(query, maxPerQuery);
      for (const paper of papers) {
        if (!seenIds.has(paper.scopusId)) {
          seenIds.add(paper.scopusId);
          allPapers.push(paper);
        }
      }
      // Rate limit: 600ms between requests
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (err) {
      console.error("Scopus search failed for query:", err);
    }
  }

  return allPapers.sort((a, b) => b.citedByCount - a.citedByCount);
}
