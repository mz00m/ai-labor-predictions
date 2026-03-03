import confirmedSources from "@/data/confirmed-sources.json";
import { getAllPredictions } from "./data-loader";
import type { EvidenceTier } from "./types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RawSource {
  id: string;
  title: string;
  publisher: string;
  excerpt?: string;
  evidenceTier: number;
  usedIn: string[];
  datePublished: string;
  url?: string;
  verified?: boolean;
  synthetic?: boolean;
  _action?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  publisher: string;
  excerpt: string;
  evidenceTier: EvidenceTier;
  usedIn: string[];
  datePublished: string;
}

/* ------------------------------------------------------------------ */
/*  Pre-compute flat source array + slug→title map at module load      */
/* ------------------------------------------------------------------ */

const allSources: SearchResult[] = Object.values(
  (confirmedSources as { sources: Record<string, RawSource> }).sources
)
  .filter((s) => s._action !== "REMOVE")
  .map((s) => ({
    id: s.id,
    title: s.title,
    publisher: s.publisher,
    excerpt: s.excerpt ?? "",
    evidenceTier: s.evidenceTier as EvidenceTier,
    usedIn: s.usedIn,
    datePublished: s.datePublished,
  }));

const slugToTitle: Record<string, string> = {};
for (const p of getAllPredictions()) {
  slugToTitle[p.slug] = p.title;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Multi-token AND search across title, publisher, and excerpt.
 * Returns at most `limit` results.
 */
export function searchSources(query: string, limit = 8): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/);

  return allSources
    .filter((source) => {
      const haystack =
        `${source.title} ${source.publisher} ${source.excerpt}`.toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    })
    .slice(0, limit);
}

/**
 * Map a prediction slug to its human-readable title.
 */
export function getPredictionTitle(slug: string): string {
  return slugToTitle[slug] ?? slug;
}
