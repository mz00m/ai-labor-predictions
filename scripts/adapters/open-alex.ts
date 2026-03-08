/**
 * OpenAlex adapter
 *
 * OpenAlex (openalex.org) is a free, open catalog of the global research
 * system. Replaces the dead Brookings / EPI / Urban Institute RSS feeds
 * with a single source covering >250M academic works including policy research.
 *
 * API docs: https://docs.openalex.org/
 * No API key required. Polite pool: include mailto in User-Agent.
 */

import { fetchWithRetry } from "../utils/retry";
import type { RawItem } from "../types";

const OPENALEX_BASE = "https://api.openalex.org/works";
const MAILTO = "digest@jobsdata.ai";

export async function fetchOpenAlex(
  query: string,
  since: Date
): Promise<RawItem[]> {
  const sinceStr = since.toISOString().split("T")[0];
  const url =
    `${OPENALEX_BASE}?` +
    `search=${encodeURIComponent(query)}&` +
    `filter=from_publication_date:${sinceStr}&` +
    `select=id,title,doi,publication_date,authorships,abstract_inverted_index,cited_by_count,primary_location&` +
    `sort=publication_date:desc&` +
    `per_page=50&` +
    `mailto=${MAILTO}`;

  const res = await fetchWithRetry(
    () =>
      fetch(url, {
        headers: { "User-Agent": `jobsdata-digest/1.0 (mailto:${MAILTO})` },
      }).then((r) => {
        if (!r.ok) throw new Error(`OpenAlex returned ${r.status}`);
        return r.json();
      }),
    { label: "openAlex", retries: 3, baseDelayMs: 1000 }
  );

  return (res.results ?? [])
    .filter((work: any) => work.title)
    .map(
      (work: any): RawItem => ({
        title: work.title,
        url:
          work.primary_location?.landing_page_url ??
          work.doi ??
          work.id ??
          "",
        doi: work.doi?.replace("https://doi.org/", ""),
        abstract: reconstructAbstract(work.abstract_inverted_index),
        authors: (work.authorships ?? [])
          .slice(0, 10)
          .map((a: any) => a.author?.display_name)
          .filter(Boolean),
        publishedAt: new Date(work.publication_date),
        citationCount: work.cited_by_count ?? 0,
        source: "openAlex",
      })
    );
}

/**
 * OpenAlex stores abstracts as inverted indexes: { word: [position, ...] }.
 * Reconstruct the plain text.
 */
function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null | undefined
): string | undefined {
  if (!invertedIndex) return undefined;

  const words: Array<[number, string]> = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words.push([pos, word]);
    }
  }

  words.sort((a, b) => a[0] - b[0]);
  return words.map(([, w]) => w).join(" ").slice(0, 500);
}
