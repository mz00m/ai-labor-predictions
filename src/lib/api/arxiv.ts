export interface ArxivPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  published: string;
  updated: string;
  pdfUrl: string;
  categories: string[];
}

const ARXIV_BASE = "https://export.arxiv.org/api/query";

const ARXIV_QUERIES = [
  'all:"artificial intelligence" AND all:"labor market"',
  'all:"AI automation" AND all:"employment"',
  'all:"large language model" AND all:"jobs"',
  'all:"generative AI" AND all:"workforce"',
];

/**
 * Parse arXiv Atom XML response into structured papers.
 * arXiv API returns Atom XML, so we parse it manually (no DOM parser in Node).
 */
function parseArxivXml(xml: string): ArxivPaper[] {
  const papers: ArxivPaper[] = [];
  const entries = xml.split("<entry>").slice(1);

  for (const entry of entries) {
    const getTag = (tag: string): string => {
      const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return match ? match[1].trim() : "";
    };

    const id = getTag("id");
    const title = getTag("title").replace(/\s+/g, " ");
    const abstract = getTag("summary").replace(/\s+/g, " ");
    const published = getTag("published");
    const updated = getTag("updated");

    // Extract authors
    const authorMatches = entry.matchAll(/<author>\s*<name>([^<]+)<\/name>/g);
    const authors = Array.from(authorMatches, (m) => m[1].trim());

    // Extract PDF link
    const pdfMatch = entry.match(
      /href="([^"]*)"[^>]*title="pdf"/
    );
    const pdfUrl = pdfMatch ? pdfMatch[1] : id.replace("abs", "pdf");

    // Extract categories
    const catMatches = entry.matchAll(/category[^>]*term="([^"]+)"/g);
    const categories = Array.from(catMatches, (m) => m[1]);

    if (id && title) {
      papers.push({
        id,
        title,
        abstract,
        authors,
        published,
        updated,
        pdfUrl,
        categories,
      });
    }
  }

  return papers;
}

export async function searchArxiv(
  query: string,
  maxResults = 15
): Promise<ArxivPaper[]> {
  const params = new URLSearchParams({
    search_query: query,
    start: "0",
    max_results: String(maxResults),
    sortBy: "submittedDate",
    sortOrder: "descending",
  });

  const res = await fetch(`${ARXIV_BASE}?${params}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`arXiv API error: ${res.status}`);
  }

  const xml = await res.text();
  return parseArxivXml(xml);
}

export async function discoverArxivPapers(
  maxPerQuery = 10
): Promise<ArxivPaper[]> {
  const allPapers: ArxivPaper[] = [];
  const seenIds = new Set<string>();

  for (const query of ARXIV_QUERIES) {
    try {
      const papers = await searchArxiv(query, maxPerQuery);
      for (const paper of papers) {
        if (!seenIds.has(paper.id)) {
          seenIds.add(paper.id);
          allPapers.push(paper);
        }
      }
      // arXiv rate limit: 1 request per 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3100));
    } catch (err) {
      console.error(`arXiv search failed for query:`, err);
    }
  }

  // Sort by date (most recent first)
  return allPapers.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );
}
