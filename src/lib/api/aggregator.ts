import { Prediction, PredictionsResponse } from "../types";
import { getAllPredictions } from "../data-loader";
import { fetchMetaculusQuestion } from "./metaculus";

export async function getAggregatedPredictions(): Promise<PredictionsResponse> {
  const predictions = getAllPredictions();

  // Enrich with live market data where available
  const enriched = await Promise.all(
    predictions.map(async (prediction) => {
      const enrichedPrediction = { ...prediction };

      // Try Metaculus
      if (prediction.marketIds?.metaculus) {
        const metaculus = await fetchMetaculusQuestion(
          prediction.marketIds.metaculus
        );
        if (metaculus?.currentPrediction != null) {
          // We could merge live data into history here.
          // For now, just note it's available — the curated data is primary.
        }
      }

      return enrichedPrediction;
    })
  );

  return {
    predictions: enriched,
    lastUpdated: new Date().toISOString(),
  };
}

export async function getAggregatedPredictionBySlug(
  slug: string
): Promise<Prediction | null> {
  const { predictions } = await getAggregatedPredictions();
  return predictions.find((p) => p.slug === slug) ?? null;
}
