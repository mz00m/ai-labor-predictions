import { NextRequest, NextResponse } from "next/server";
import { getResearchFeed } from "@/lib/api/research-aggregator";
import { EvidenceTier } from "@/lib/types";

export const revalidate = 86400; // revalidate once per day

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tiersParam = searchParams.get("tiers");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const tiers = tiersParam
    ? (tiersParam.split(",").map(Number).filter((n) => n >= 1 && n <= 4) as EvidenceTier[])
    : undefined;

  try {
    const papers = await getResearchFeed({
      maxResults: Math.min(limit, 100),
      tiers,
    });

    return NextResponse.json({
      papers,
      count: papers.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Research feed error:", err);
    return NextResponse.json(
      { error: "Failed to fetch research feed", papers: [], count: 0 },
      { status: 500 }
    );
  }
}
