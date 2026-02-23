import { NextRequest, NextResponse } from "next/server";
import { getLatestDigest } from "@/lib/digest-loader";
import { EvidenceTier } from "@/lib/types";

export const revalidate = 3600; // 1 hour ISR

export async function GET(request: NextRequest) {
  try {
    const digest = getLatestDigest();

    if (!digest) {
      return NextResponse.json(
        {
          digest: null,
          message: "No digest available yet. Run the digest generation script first.",
        },
        { status: 200 }
      );
    }

    // Optional tier filter
    const tiersParam = request.nextUrl.searchParams.get("tiers");
    const categoryParam = request.nextUrl.searchParams.get("category");

    let papers = digest.papers;

    if (tiersParam) {
      const tiers = tiersParam.split(",").map(Number) as EvidenceTier[];
      papers = papers.filter((p) => tiers.includes(p.classifiedTier));
    }

    if (categoryParam && categoryParam in digest.byCategory) {
      papers = digest.byCategory[categoryParam as keyof typeof digest.byCategory];
    }

    return NextResponse.json({
      weekId: digest.weekId,
      generatedAt: digest.generatedAt,
      dateRange: digest.dateRange,
      stats: digest.stats,
      papers,
      totalPapers: digest.papers.length,
    });
  } catch (err) {
    console.error("Digest API error:", err);
    return NextResponse.json(
      { digest: null, error: "Failed to load digest" },
      { status: 500 }
    );
  }
}
