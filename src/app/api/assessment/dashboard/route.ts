import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { initAssessmentTables } from "@/lib/assessment/db";
import type { Assessment } from "@/lib/assessment/types";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ assessments: [] });
  }

  await initAssessmentTables();

  type Row = Record<string, any>; // DB rows have dynamic columns

  // Find user
  const users = await sql`
    SELECT id FROM assessment_users WHERE email = ${email}
  ` as Row[];

  if (users.length === 0) {
    return NextResponse.json({ assessments: [] });
  }

  const userId = users[0].id as string;

  // Get assessments
  const rows = await sql`
    SELECT * FROM assessments WHERE user_id = ${userId} ORDER BY created_at DESC
  ` as Row[];

  const assessments: Assessment[] = rows.map((row: Row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    status: row.status as Assessment["status"],
    createdAt: (row.created_at as Date).toISOString(),
    completedAt: row.completed_at ? (row.completed_at as Date).toISOString() : undefined,
    intake: row.intake_json as Assessment["intake"],
    report: row.report_json as Assessment["report"],
    addOns: {
      policyAndPrompts: row.add_on_policy as boolean,
    },
    stripePaymentId: row.stripe_payment_id as string | undefined,
    paid: row.paid as boolean,
    previewGenerated: row.preview_generated as boolean,
  }));

  return NextResponse.json({ assessments });
}
