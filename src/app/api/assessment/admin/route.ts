import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { initAssessmentTables } from "@/lib/assessment/db";

type Row = Record<string, unknown>;

function checkAuth(req: NextRequest): boolean {
  const token = req.nextUrl.searchParams.get("token");
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return token === secret;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  await initAssessmentTables();

  // All assessments with user email
  const assessments = await sql`
    SELECT
      a.id,
      u.email,
      a.status,
      a.current_step,
      a.created_at,
      a.completed_at,
      a.paid,
      a.intake_json->>'companyName' as company_name,
      a.intake_json->>'industry' as industry,
      a.intake_json->>'companySize' as company_size,
      a.intake_json->>'jobTitle' as job_title,
      a.step_feedback,
      CASE WHEN a.report_json IS NOT NULL THEN true ELSE false END as has_report,
      a.report_json->>'readinessScore' as readiness_score
    FROM assessments a
    JOIN assessment_users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  ` as Row[];

  // All feedback
  const feedback = await sql`
    SELECT
      f.id,
      f.assessment_id,
      f.rating,
      f.comment,
      f.created_at,
      u.email
    FROM assessment_feedback f
    JOIN assessments a ON f.assessment_id = a.id
    JOIN assessment_users u ON a.user_id = u.id
    ORDER BY f.created_at DESC
  ` as Row[];

  // Summary stats
  const total = assessments.length;
  const complete = assessments.filter((a) => a.status === "complete").length;
  const analyzing = assessments.filter((a) => a.status === "analyzing").length;
  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + (f.rating as number), 0) / feedback.length).toFixed(1)
      : null;

  return NextResponse.json({
    stats: { total, complete, analyzing, feedbackCount: feedback.length, avgRating },
    assessments,
    feedback,
  });
}
