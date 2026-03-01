import { Source } from "./types";
import { getAllPredictions } from "./data-loader";

export interface SourceWithContext extends Source {
  predictionTitle: string;
  predictionSlug: string;
  predictionCategory: string;
}

/**
 * Aggregates sources from all predictions, enriches each with its parent
 * prediction context, deduplicates by source id, and returns the most
 * recent ones sorted by datePublished descending.
 *
 * Auto-updates: because this reads from the same prediction JSON data
 * that powers the rest of the site, any new source added to any
 * prediction appears here after the next build.
 */
export function getRecentSources(limit = 20): SourceWithContext[] {
  const predictions = getAllPredictions();
  const seen = new Set<string>();
  const allSources: SourceWithContext[] = [];

  for (const prediction of predictions) {
    for (const source of prediction.sources) {
      if (seen.has(source.id)) continue;
      seen.add(source.id);
      allSources.push({
        ...source,
        predictionTitle: prediction.title,
        predictionSlug: prediction.slug,
        predictionCategory: prediction.category,
      });
    }
  }

  allSources.sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );

  return allSources.slice(0, limit);
}
