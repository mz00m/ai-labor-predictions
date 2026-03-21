import { NextResponse } from "next/server";
import { getLastUpdated } from "@/lib/data-loader";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    return NextResponse.json(
      {
        name: "jobsdata.ai Public API",
        version: "v1",
        description:
          "Free, open access to AI labor market prediction data. All data is sourced from peer-reviewed research, government statistics, and institutional analysis.",
        lastUpdated: getLastUpdated(),
        endpoints: {
          listPredictions: {
            method: "GET",
            url: "https://jobsdata.ai/api/v1/predictions",
            description: "List all predictions with aggregated values",
            parameters: {
              category: "Filter by category: displacement, wages, adoption, signals, exposure",
              fields: "Comma-separated list of fields to include (e.g., slug,title,aggregate)",
            },
          },
          getPrediction: {
            method: "GET",
            url: "https://jobsdata.ai/api/v1/predictions/{slug}",
            description:
              "Get full prediction data including history, overlays, and sources",
            example: "https://jobsdata.ai/api/v1/predictions/overall-us-displacement",
          },
        },
        categories: [
          { id: "displacement", label: "Job Displacement", count: 9 },
          { id: "wages", label: "Wage Impact", count: 4 },
          { id: "adoption", label: "AI Adoption", count: 2 },
          { id: "signals", label: "Corporate Signals", count: 1 },
          { id: "exposure", label: "Workforce Exposure", count: 1 },
        ],
        evidenceTiers: [
          { tier: 1, label: "Verified Data & Research", weight: "4x" },
          { tier: 2, label: "Institutional Analysis", weight: "2x" },
          { tier: 3, label: "Journalism & Commentary", weight: "1x" },
          { tier: 4, label: "Informal & Social", weight: "0.5x" },
        ],
        attribution:
          "Data from jobsdata.ai. Free to use with attribution. Link back to jobsdata.ai/predictions/{slug} when citing specific predictions.",
        website: "https://jobsdata.ai",
      },
      { headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
