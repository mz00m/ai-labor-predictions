/**
 * NBER Working Papers — RSS feed adapter
 *
 * Fetches the ~26 most recent working papers from NBER's RSS feed.
 * The old TSV catalog at data.nber.org/papers/papers.tsv is dead (404).
 * The RSS feed at nber.org/rss/new.xml is lightweight and includes abstracts.
 */

import { fetchWithRetry } from "../utils/retry";
import type { RawItem } from "../types";

const NBER_RSS_URL = "https://www.nber.org/rss/new.xml";

export async function fetchNBER(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const xml = await fetchWithRetry(
    () =>
      fetch(NBER_RSS_URL, {
        headers: { "User-Agent": "jobsdata-digest/1.0" },
      }).then((r) => {
        if (!r.ok) throw new Error(`NBER RSS returned ${r.status}`);
        return r.text();
      }),
    { label: "nber-rss", retries: 3, baseDelayMs: 2000 }
  );

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  if (items.length === 0) return [];

  const queryWords = query.toLowerCase().split(/\s+/);
  const results: RawItem[] = [];

  for (const match of items) {
    const entry = match[1];

    // Extract fields from RSS XML
    const rawTitle =
      entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ??
      entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ??
      "";
    const link =
      entry.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ?? "";
    const description =
      entry.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]?.trim() ??
      entry.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ??
      "";
    const pubDateStr =
      entry.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim();

    if (!rawTitle) continue;

    // Parse date — skip if before our lookback window
    const pubDate = pubDateStr ? new Date(pubDateStr) : null;
    if (pubDate && !isNaN(pubDate.getTime()) && pubDate < since) continue;

    // The RSS title often includes authors: "Title, Author1, Author2"
    // Split on the last occurrence of a pattern like ", FirstName LastName"
    // but keep it simple — just use the full title
    const title = rawTitle.replace(/<[^>]+>/g, "").trim();

    // Strip HTML from description for the abstract
    const abstract = description
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .slice(0, 500);

    // Clean the link (remove #fromrss suffix)
    const url = link.replace(/#fromrss$/, "") || "https://www.nber.org/papers";

    // Relevance filter: at least 2 query words or 30% match
    const text = `${title} ${abstract}`.toLowerCase();
    const matchCount = queryWords.filter((w) => text.includes(w)).length;
    if (matchCount < Math.min(2, Math.ceil(queryWords.length * 0.3))) continue;

    results.push({
      title,
      url,
      abstract: abstract || undefined,
      publishedAt: pubDate && !isNaN(pubDate.getTime()) ? pubDate : new Date(),
      source: "nber",
    });
  }

  return results;
}
