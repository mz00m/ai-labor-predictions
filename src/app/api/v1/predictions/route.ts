import { NextRequest, NextResponse } from "next/server";
import { getAllPredictions } from "@/lib/data-loader";
import { getLastUpdated } from "@/lib/data-loader";
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const fields = searchParams.get("fields")?.split(",").filter(Boolean);

  let predictions = getAllPredictions();

  // Filter by category
  if (category) {
    predictions = predictions.filter((p) => p.category === category);
  }

  const result = predictions.map((p) => {
    const agg = computeAggregate(p, ALL_TIERS);

    const full = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      unit: p.unit,
      timeHorizon: p.timeHorizon,
      aggregate: {
        mean: agg.mean,
        min: agg.min,
        max: agg.max,
        trend: agg.trend,
      },
      sourceCount: p.sources.length,
      dataPointCount: p.history.length,
      latestDataPoint: p.history.length > 0
        ? {
            date: p.history[p.history.length - 1].date,
            value: p.history[p.history.length - 1].value,
            evidenceTier: p.history[p.history.length - 1].evidenceTier,
          }
        : null,
      url: `https://jobsdata.ai/predictions/${p.slug}`,
      apiUrl: `https://jobsdata.ai/api/v1/predictions/${p.slug}`,
    };

    // Field filtering
    if (fields && fields.length > 0) {
      const filtered: Record<string, unknown> = { slug: full.slug };
      for (const f of fields) {
        if (f in full) {
          filtered[f] = (full as Record<string, unknown>)[f];
        }
      }
      return filtered;
    }

    return full;
  });

  return NextResponse.json(
    {
      predictions: result,
      count: result.length,
      lastUpdated: getLastUpdated(),
      _links: {
        self: "https://jobsdata.ai/api/v1/predictions",
        docs: "https://jobsdata.ai/api/v1",
      },
    },
    { headers: CORS_HEADERS }
  );
}
