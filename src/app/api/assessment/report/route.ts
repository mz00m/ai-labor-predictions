import { NextRequest, NextResponse } from "next/server";
import { requireAssessmentOwner } from "@/lib/assessment/authz";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
  }

  const authz = await requireAssessmentOwner(req, id);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  return NextResponse.json({ assessment: authz.assessment });
}
