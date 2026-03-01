/**
 * Google Custom Search fetcher for AI + labor market content.
 * Captures LinkedIn Pulse articles, Medium posts, Substack, and blog content.
 * Fully optional — returns [] if GOOGLE_CSE_KEY and GOOGLE_CSE_ID are not set.
 */

import { rateLimit, SOCIAL_SEARCH_QUERIES } from "./social-utils";

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedDate: string | null;
}

const CSE_KEY = process.env.GOOGLE_CSE_KEY || "";
const CSE_ID = process.env.GOOGLE_CSE_ID || "";
const CSE_BASE = "https://www.googleapis.com/customsearch/v1";

const RATE_LIMIT_MS = 200;

function parseCSEResponse(json: unknown): WebSearchResult[] {
  const data = json as { items?: Array<Record<string, unknown>> };
  if (!data?.items) return [];

  return data.items.map((item) => {
    const url = (item.link as string) || "";
    let domain = "";
    try {
      domain = new URL(url).hostname.replace("www.", "");
    } catch {
      domain = "unknown";
    }

    // Try to extract published date from metatags
    const pagemap = item.pagemap as Record<string, Array<Record<string, string>>> | undefined;
    const metatags = pagemap?.metatags?.[0];
    const publishedDate =
      metatags?.["article:published_time"]?.split("T")[0] ||
      metatags?.["og:updated_time"]?.split("T")[0] ||
      metatags?.["date"]?.split("T")[0] ||
      null;

    return {
      title: (item.title as string) || "",
      url,
      snippet: (item.snippet as string) || "",
      source: domain,
      publishedDate,
    };
  });
}

export async function discoverWebSearchResults(
  maxResults = 40
): Promise<WebSearchResult[]> {
  if (!CSE_KEY || !CSE_ID) return [];

  const seen = new Set<string>();
  const allResults: WebSearchResult[] = [];

  for (let i = 0; i < SOCIAL_SEARCH_QUERIES.length; i++) {
    if (i > 0) await rateLimit(RATE_LIMIT_MS);

    const query = encodeURIComponent(SOCIAL_SEARCH_QUERIES[i]);
    const url = `${CSE_BASE}?key=${CSE_KEY}&cx=${CSE_ID}&q=${query}&dateRestrict=w1&num=10`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.error(`Google CSE failed (${resp.status}): ${SOCIAL_SEARCH_QUERIES[i]}`);
        continue;
      }
      const json = await resp.json();
      const results = parseCSEResponse(json);

      for (const result of results) {
        if (!seen.has(result.url)) {
          seen.add(result.url);
          allResults.push(result);
        }
      }
    } catch (err) {
      console.error(`Google CSE error: ${SOCIAL_SEARCH_QUERIES[i]}`, err);
    }
  }

  return allResults.slice(0, maxResults);
}
