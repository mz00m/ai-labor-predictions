import { NextResponse } from "next/server";
import { getAggregatedPredictions } from "@/lib/api/aggregator";

export const revalidate = 3600; // revalidate every hour

export async function GET() {
  try {
    const data = await getAggregatedPredictions();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
