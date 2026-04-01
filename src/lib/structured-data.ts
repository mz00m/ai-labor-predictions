import { Prediction, EvidenceTier } from "./types";
import { computeAggregate } from "./prediction-stats";

const ALL_TIERS: EvidenceTier[] = [1, 2, 3, 4];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  displacement: ["AI job displacement", "automation", "job loss", "workforce disruption", "artificial intelligence employment"],
  wages: ["AI wage impact", "salary effects", "wage premium", "income inequality", "AI labor economics"],
  adoption: ["AI adoption rate", "enterprise AI", "generative AI usage", "technology adoption"],
  signals: ["corporate AI signals", "earnings calls", "AI workforce mentions", "corporate strategy"],
  exposure: ["AI exposure", "job automation risk", "task automation", "workforce vulnerability"],
};

/**
 * Build a Google Dataset JSON-LD for a prediction page.
 * https://developers.google.com/search/docs/appearance/structured-data/dataset
 */
export function buildDatasetLd(prediction: Prediction, lastUpdated: string) {
  const agg = computeAggregate(prediction, ALL_TIERS);
  const url = `https://jobsdata.ai/predictions/${prediction.slug}`;
  const apiUrl = `https://jobsdata.ai/api/v1/predictions/${prediction.slug}`;

  const sortedHistory = [...prediction.history].sort((a, b) => a.date.localeCompare(b.date));
  const earliestDate = sortedHistory[0]?.date ?? lastUpdated;
  const latestDate = sortedHistory[sortedHistory.length - 1]?.date ?? lastUpdated;

  const keywords = [
    ...(CATEGORY_KEYWORDS[prediction.category] ?? []),
    "labor market",
    "AI impact",
    prediction.title,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: prediction.title,
    description: prediction.description,
    url,
    identifier: prediction.slug,
    keywords: keywords.join(", "),
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "jobsdata.ai",
      url: "https://jobsdata.ai",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: apiUrl,
      },
    ],
    temporalCoverage: `${earliestDate}/${latestDate}`,
    dateModified: lastUpdated,
    datePublished: earliestDate,
    spatialCoverage: {
      "@type": "Place",
      name: "United States",
    },
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: prediction.title,
        unitText: prediction.unit,
        value: agg.mean,
        minValue: agg.min,
        maxValue: agg.max,
        description: `Weighted estimate across ${prediction.sources.length} sources. ${prediction.timeHorizon}.`,
        measurementMethod: prediction.aggregationMethod === "latest"
          ? "Most recent data point from time-series observations"
          : "Tier-weighted average (Tier 1: 4x, Tier 2: 2x, Tier 3: 1x, Tier 4: 0.5x) with recency and sample-size adjustments",
      },
    ],
    measurementTechnique:
      "Meta-analysis of peer-reviewed research, government statistics, and institutional reports with evidence-tier weighting",
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "jobsdata.ai AI Labor Market Predictions",
      url: "https://jobsdata.ai",
    },
  };
}

/**
 * Build individual Observation JSON-LD entries for each data point.
 * Uses schema.org/Observation (recognized by Google for statistical data).
 */
export function buildObservationLd(prediction: Prediction) {
  const sortedHistory = [...prediction.history].sort((a, b) => a.date.localeCompare(b.date));

  return sortedHistory.map((point) => {
    const source = prediction.sources.find((s) => point.sourceIds.includes(s.id));

    const obs: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Observation",
      observationDate: point.date,
      measuredValue: {
        "@type": "QuantitativeValue",
        value: point.value,
        unitText: prediction.unit,
        ...(point.confidenceLow != null && { minValue: point.confidenceLow }),
        ...(point.confidenceHigh != null && { maxValue: point.confidenceHigh }),
      },
      observationAbout: {
        "@type": "StatisticalPopulation",
        populationType: "https://schema.org/Person",
        name: "US Workforce",
        location: {
          "@type": "Place",
          name: "United States",
        },
      },
      measurementMethod: point.isProxy
        ? "Proxy metric with conversion factor"
        : "Direct measurement or estimate",
    };

    if (source) {
      obs.marginOfError = point.confidenceHigh != null && point.confidenceLow != null
        ? {
            "@type": "QuantitativeValue",
            value: ((point.confidenceHigh - point.confidenceLow) / 2).toFixed(1),
            unitText: prediction.unit,
          }
        : undefined;
    }

    return obs;
  });
}

/**
 * Build a complete array of JSON-LD objects for a prediction page.
 * Includes: BreadcrumbList (handled separately), Dataset, and top-level Observations.
 * We keep observations as a summary (not individual items) to avoid bloating the page.
 */
export function buildPredictionStructuredData(
  prediction: Prediction,
  lastUpdated: string
) {
  const dataset = buildDatasetLd(prediction, lastUpdated);

  // Add a summary statistical observation for the aggregate
  const agg = computeAggregate(prediction, ALL_TIERS);
  const sortedHistory = [...prediction.history].sort((a, b) => a.date.localeCompare(b.date));
  const latestDate = sortedHistory[sortedHistory.length - 1]?.date ?? lastUpdated;

  const summaryObservation = {
    "@context": "https://schema.org",
    "@type": "Observation",
    name: `${prediction.title} | Current Estimate`,
    observationDate: latestDate,
    measuredValue: {
      "@type": "QuantitativeValue",
      value: agg.mean,
      unitText: prediction.unit,
      minValue: agg.min,
      maxValue: agg.max,
    },
    observationAbout: {
      "@type": "StatisticalPopulation",
      populationType: "https://schema.org/Person",
      name: "US Workforce",
      numConstraints: prediction.history.length,
      location: {
        "@type": "Place",
        name: "United States",
      },
    },
    measurementMethod:
      `Weighted estimate across ${prediction.sources.length} sources. Evidence tiers: Tier 1 (verified research, 4x weight), Tier 2 (institutional, 2x), Tier 3 (journalism, 1x), Tier 4 (informal, 0.5x).`,
  };

  return [dataset, summaryObservation];
}
