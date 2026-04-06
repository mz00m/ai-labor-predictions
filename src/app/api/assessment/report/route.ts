import { NextRequest, NextResponse } from "next/server";
import { getAssessment, getUserByEmail } from "@/lib/assessment/db";
import { getVerifiedEmail } from "@/lib/assessment/auth";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
  }

  const email = await getVerifiedEmail(req);
  if (!email) {
    return NextResponse.json({ error: "Verification required" }, { status: 401 });
  }

  const assessment = await getAssessment(id);
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  // Verify ownership: the authenticated email must own this assessment
  const user = await getUserByEmail(email);
  if (!user || user.id !== assessment.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ assessment });
}
