/**
 * NBER Working Papers — TSV metadata adapter
 *
 * Replaces the defunct RSS feed. NBER publishes working-paper metadata
 * as a tab-separated file. This adapter fetches the catalog, filters by
 * date and query relevance, and returns matching papers as RawItems.
 */

import { fetchWithRetry } from "../utils/retry";
import type { RawItem } from "../types";

// NBER working-paper catalog (tab-separated metadata)
const NBER_CATALOG_URL =
  "https://data.nber.org/papers/papers.tsv";

export async function fetchNBER(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const tsv = await fetchWithRetry(
    () =>
      fetch(NBER_CATALOG_URL, {
        headers: { "User-Agent": "jobsdata-digest/1.0" },
      }).then((r) => {
        if (!r.ok) throw new Error(`NBER TSV returned ${r.status}`);
        return r.text();
      }),
    { label: "nber-tsv", retries: 3, baseDelayMs: 2000 }
  );

  const lines = tsv.split("\n");
  if (lines.length < 2) return [];

  // Parse header row to find column indices dynamically
  const headers = lines[0].split("\t").map((h) => h.trim().toLowerCase());
  const idx = (name: string, ...alts: string[]) => {
    for (const n of [name, ...alts]) {
      const i = headers.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };

  const titleCol = idx("title");
  const dateCol = idx("date", "published_date", "public_date");
  const abstractCol = idx("abstract");
  const authorsCol = idx("authors", "author");
  const numberCol = idx("number", "paper_number", "paper");
  const urlCol = idx("url", "paper_url");

  if (titleCol < 0 || dateCol < 0) {
    console.warn("[nber] Could not identify title/date columns in TSV header");
    return [];
  }

  const queryWords = query.toLowerCase().split(/\s+/);
  const results: RawItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = lines[i].split("\t");
    if (fields.length <= Math.max(titleCol, dateCol)) continue;

    const title = fields[titleCol]?.trim() ?? "";
    const pubDateStr = fields[dateCol]?.trim();
    if (!title || !pubDateStr) continue;

    const pubDate = new Date(pubDateStr);
    if (isNaN(pubDate.getTime()) || pubDate < since) continue;

    const abstract =
      abstractCol >= 0 ? fields[abstractCol]?.trim() : undefined;
    const authors =
      authorsCol >= 0
        ? fields[authorsCol]
            ?.split(/;\s*/)
            .map((a) => a.trim())
            .filter(Boolean)
        : undefined;

    // Build URL from paper number or use url column
    const paperNum = numberCol >= 0 ? fields[numberCol]?.trim() : "";
    const paperUrl =
      urlCol >= 0 && fields[urlCol]?.trim()
        ? fields[urlCol].trim()
        : paperNum
          ? `https://www.nber.org/papers/w${paperNum}`
          : "https://www.nber.org/papers";

    // Relevance filter: 30% keyword match
    const text = `${title} ${abstract ?? ""}`.toLowerCase();
    const matchCount = queryWords.filter((w) => text.includes(w)).length;
    if (matchCount < Math.min(2, Math.ceil(queryWords.length * 0.3)))
      continue;

    results.push({
      title,
      url: paperUrl,
      abstract: abstract?.replace(/<[^>]+>/g, "").slice(0, 500),
      authors,
      publishedAt: pubDate,
      source: "nber",
    });
  }

  return results;
}
