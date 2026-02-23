import { NextResponse } from "next/server";
import { getAggregatedPredictions } from "@/lib/api/aggregator";

export const revalidate = 3600; // revalidate every hour

export async function GET() {
  const data = await getAggregatedPredictions();
  return NextResponse.json(data);
}
