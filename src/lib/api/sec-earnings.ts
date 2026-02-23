/**
 * SEC EDGAR Full-Text Search API client.
 * Searches 10-K, 10-Q, and 8-K filings for AI/automation workforce disclosures.
 * Free, no API key required. Rate limit: 10 req/sec.
 *
 * Docs: https://efts.sec.gov/LATEST/search-index?q=...
 */

export interface SECFiling {
  id: string;
  title: string;
  companyName: string;
  ticker: string | null;
  formType: string; // "10-K", "10-Q", "8-K"
  filedAt: string;
  url: string;
  excerpt: string | null;
}

interface EFTSResult {
  hits: {
    hits: Array<{
      _id: string;
      _source: {
        display_names?: string[];
        entity_name?: string;
        file_date?: string;
        form_type?: string;
        display_date_filed?: string;
        file_num?: string;
        tickers?: string[];
      };
      _highlight?: {
        text?: string[];
      };
    }>;
    total: { value: number };
  };
}

const EFTS_BASE = "https://efts.sec.gov/LATEST/search-index";

const AI_WORKFORCE_QUERIES = [
  '"artificial intelligence" AND ("workforce reduction" OR "headcount" OR "job elimination")',
  '"AI" AND ("automation" OR "restructuring") AND ("employees" OR "workforce")',
  '"generative AI" AND ("productivity" OR "efficiency" OR "cost savings") AND "employees"',
];

/**
 * Search SEC EDGAR full-text search for filings mentioning AI + workforce topics.
 */
export async function searchSECFilings(
  maxResults = 20
): Promise<SECFiling[]> {
  const allFilings: SECFiling[] = [];

  for (const query of AI_WORKFORCE_QUERIES) {
    try {
      const params = new URLSearchParams({
        q: query,
        dateRange: "custom",
        startdt: "2023-01-01",
        enddt: new Date().toISOString().split("T")[0],
        forms: "10-K,10-Q,8-K",
      });

      const res = await fetch(`${EFTS_BASE}?${params}`, {
        headers: {
          "User-Agent": "AILaborPredictions/1.0 (research@example.com)",
          Accept: "application/json",
        },
      });

      if (!res.ok) continue;

      const data = (await res.json()) as EFTSResult;

      for (const hit of data.hits?.hits || []) {
        const src = hit._source;
        const companyName =
          src.display_names?.[0] || src.entity_name || "Unknown";
        const ticker = src.tickers?.[0] || null;
        const formType = src.form_type || "Filing";
        const filedAt = src.display_date_filed || src.file_date || "";
        const excerpt = hit._highlight?.text?.[0]
          ? hit._highlight.text[0].replace(/<\/?[^>]+>/g, "").slice(0, 250)
          : null;

        allFilings.push({
          id: `sec-${hit._id}`,
          title: `${companyName} ${formType} — AI/Workforce Disclosures`,
          companyName,
          ticker,
          formType,
          filedAt,
          url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&filenum=${src.file_num || ""}&type=${formType}&dateb=&owner=include&count=1`,
          excerpt,
        });
      }

      // Rate limit: 100ms between requests
      await new Promise((r) => setTimeout(r, 100));
    } catch {
      // Skip failed queries silently
    }
  }

  // Deduplicate by company + form type
  const seen = new Set<string>();
  return allFilings
    .filter((f) => {
      const key = `${f.companyName}-${f.formType}-${f.filedAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxResults);
}

/**
 * Discover recent earnings-related filings from major tech and services companies
 * that discuss AI impact on workforce.
 */
export async function discoverEarningsFilings(
  maxResults = 15
): Promise<SECFiling[]> {
  return searchSECFilings(maxResults);
}
