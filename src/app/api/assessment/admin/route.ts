import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { initAssessmentTables, getAdminPasswordHash, setAdminPasswordHash } from "@/lib/assessment/db";

type Row = Record<string, unknown>;

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;

  // Check DB password first
  const dbHash = await getAdminPasswordHash();
  if (dbHash) {
    const tokenHash = await hashToken(token);
    return tokenHash === dbHash;
  }

  // Fall back to env var
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return token === secret;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  await initAssessmentTables();

  // All assessments with user email + duration
  const assessments = await sql`
    SELECT
      a.id,
      u.email,
      a.status,
      a.current_step,
      a.created_at,
      a.completed_at,
      a.paid,
      a.add_on_policy,
      a.preview_generated,
      a.intake_json->>'organizationName' as organization,
      a.intake_json->>'industry' as industry,
      a.intake_json->>'companySize' as company_size,
      a.intake_json->>'jobTitle' as job_title,
      a.intake_json->>'assessmentScope' as scope,
      a.intake_json->>'currentAiUsage' as ai_maturity,
      a.step_feedback,
      CASE WHEN a.report_json IS NOT NULL THEN true ELSE false END as has_report,
      a.report_json->>'readinessScore' as readiness_score,
      CASE
        WHEN a.completed_at IS NOT NULL
        THEN ROUND(EXTRACT(EPOCH FROM (a.completed_at - a.created_at)) / 60)
        ELSE NULL
      END as duration_minutes
    FROM assessments a
    JOIN assessment_users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  ` as Row[];

  // All feedback with assessment context
  const feedback = await sql`
    SELECT
      f.id,
      f.assessment_id,
      f.rating,
      f.comment,
      f.created_at,
      u.email,
      a.intake_json->>'organizationName' as organization,
      a.intake_json->>'industry' as industry
    FROM assessment_feedback f
    JOIN assessments a ON f.assessment_id = a.id
    JOIN assessment_users u ON a.user_id = u.id
    ORDER BY f.created_at DESC
  ` as Row[];

  // Daily throughput (last 30 days)
  const dailyCounts = await sql`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as started,
      COUNT(*) FILTER (WHERE status = 'complete') as completed,
      COUNT(*) FILTER (WHERE paid = TRUE) as paid
    FROM assessments
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
  ` as Row[];

  // Unique users
  const userCount = await sql`
    SELECT COUNT(DISTINCT user_id) as count FROM assessments
  ` as Row[];

  // Summary stats
  const total = assessments.length;
  const complete = assessments.filter((a) => a.status === "complete").length;
  const analyzing = assessments.filter((a) => a.status === "analyzing").length;
  const errored = assessments.filter((a) => a.status === "error").length;
  const intake = assessments.filter((a) => a.status === "intake").length;
  const paidCount = assessments.filter((a) => a.paid).length;
  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + (f.rating as number), 0) / feedback.length).toFixed(1)
      : null;

  const completedDurations = assessments
    .filter((a) => a.duration_minutes != null)
    .map((a) => a.duration_minutes as number);
  const avgDuration =
    completedDurations.length > 0
      ? (completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length).toFixed(1)
      : null;

  return NextResponse.json({
    stats: {
      total,
      complete,
      analyzing,
      errored,
      intake,
      paid: paidCount,
      uniqueUsers: Number(userCount[0]?.count ?? 0),
      feedbackCount: feedback.length,
      avgRating,
      avgDurationMinutes: avgDuration,
      completionRate: total > 0 ? ((complete / total) * 100).toFixed(0) : "0",
    },
    assessments,
    feedback,
    dailyCounts,
  });
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { newPassword } = body;

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 12) {
    return NextResponse.json({ error: "Password must be at least 12 characters" }, { status: 400 });
  }

  const hash = await hashToken(newPassword);
  await setAdminPasswordHash(hash);

  return NextResponse.json({ ok: true });
}
