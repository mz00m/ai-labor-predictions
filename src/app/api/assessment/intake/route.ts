import { NextRequest, NextResponse } from "next/server";
import { getAssessment, getUserByEmail, updateIntakeMaturity } from "@/lib/assessment/db";
import { getVerifiedEmail } from "@/lib/assessment/auth";

const VALID_MATURITY = ["none", "exploring", "piloting", "some-adoption", "widespread"] as const;
type Maturity = (typeof VALID_MATURITY)[number];

/**
 * PATCH /api/assessment/intake
 *
 * Body: { assessmentId: string, currentAiUsage: Maturity }
 *
 * Updates the AI maturity level on an existing assessment so the user
 * can correct the initial guess and regenerate the affected steps with
 * better calibration. Only the owner of the assessment can update it.
 *
 * Scope intentionally narrow — does NOT support updating arbitrary
 * intake fields; that would re-open a larger validation surface. If we
 * later want to allow editing other fields (job title, role, etc.), add
 * them as separate endpoints with their own validation.
 */
export async function PATCH(req: NextRequest) {
  let body: { assessmentId?: string; currentAiUsage?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { assessmentId, currentAiUsage } = body;
  if (!assessmentId) {
    return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
  }
  if (!currentAiUsage || !VALID_MATURITY.includes(currentAiUsage as Maturity)) {
    return NextResponse.json(
      { error: `currentAiUsage must be one of: ${VALID_MATURITY.join(", ")}` },
      { status: 400 }
    );
  }

  const email = await getVerifiedEmail(req);
  if (!email) {
    return NextResponse.json({ error: "Verification required" }, { status: 401 });
  }

  const assessment = await getAssessment(assessmentId);
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  const user = await getUserByEmail(email);
  if (!user || user.id !== assessment.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const updated = await updateIntakeMaturity(assessmentId, currentAiUsage as Maturity);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, currentAiUsage });
}
