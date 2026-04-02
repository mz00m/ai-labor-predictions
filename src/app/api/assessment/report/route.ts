import { NextRequest, NextResponse } from "next/server";
import { getAssessment } from "@/lib/assessment/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
  }

  const assessment = await getAssessment(id);

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json({ assessment });
}
