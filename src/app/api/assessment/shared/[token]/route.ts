import { NextRequest, NextResponse } from "next/server";
import { getAssessmentByShareToken } from "@/lib/assessment/db";
import { toPublicReport } from "@/lib/assessment/public-report";

export const dynamic = "force-dynamic";

/**
 * Public read-only report. Deliberately unauthenticated — holding the token
 * is the authorization. Serves the allowlisted projection only, never the
 * raw assessment row.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  if (!token || !/^[a-f0-9]{32}$/.test(token)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const assessment = await getAssessmentByShareToken(token);
  if (!assessment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const publicReport = toPublicReport(assessment);
  if (!publicReport) {
    return NextResponse.json({ error: "Report not ready" }, { status: 404 });
  }

  return NextResponse.json(
    { report: publicReport },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } }
  );
}
