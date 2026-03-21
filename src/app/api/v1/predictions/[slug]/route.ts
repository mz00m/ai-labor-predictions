import { NextRequest, NextResponse } from "next/server";
import { getPredictionBySlug } from "@/lib/data-loader";
import { computeAggregate } from "@/lib/prediction-stats";
import { EvidenceTier } from "@/lib/types";

export const revalidate = 3600;

const ALL_TIERS: EvidenceTier[] = [1, 2, 3, 4];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const prediction = getPredictionBySlug(params.slug);

    if (!prediction) {
      return NextResponse.json(
        {
          error: "Prediction not found",
          availableSlugs: "See https://jobsdata.ai/api/v1/predictions for all available slugs",
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const agg = computeAggregate(prediction, ALL_TIERS);

    const result = {
      slug: prediction.slug,
      title: prediction.title,
      description: prediction.description,
      category: prediction.category,
      unit: prediction.unit,
      timeHorizon: prediction.timeHorizon,
      aggregationMethod: prediction.aggregationMethod || "weighted",
      aggregate: {
        mean: agg.mean,
        min: agg.min,
        max: agg.max,
        trend: agg.trend,
        trendIsBad: agg.trendIsBad,
      },
      history: prediction.history.map((h) => ({
        date: h.date,
        value: h.value,
        confidenceLow: h.confidenceLow ?? null,
        confidenceHigh: h.confidenceHigh ?? null,
        evidenceTier: h.evidenceTier,
        metricType: h.metricType ?? null,
        dataType: h.dataType ?? null,
        isProxy: h.isProxy ?? false,
        sampleSize: h.sampleSize ?? null,
      })),
      overlays: (prediction.overlays ?? []).map((o) => ({
        date: o.date,
        direction: o.direction,
        label: o.label,
        evidenceTier: o.evidenceTier,
      })),
      sources: prediction.sources.map((s) => ({
        id: s.id,
        title: s.title,
        publisher: s.publisher,
        url: s.url,
        evidenceTier: s.evidenceTier,
        datePublished: s.datePublished,
      })),
      sourceCount: prediction.sources.length,
      url: `https://jobsdata.ai/predictions/${prediction.slug}`,
      _links: {
        self: `https://jobsdata.ai/api/v1/predictions/${prediction.slug}`,
        collection: "https://jobsdata.ai/api/v1/predictions",
      },
    };

    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
