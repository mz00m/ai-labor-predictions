import type { NextRequest } from "next/server";
import { getVerifiedEmail } from "./auth";
import { getAssessment, getUserByEmail } from "./db";
import type { Assessment } from "./types";

export type AuthzDenial =
  | { ok: false; status: 401; error: "Verification required" }
  | { ok: false; status: 404; error: "Assessment not found" }
  | { ok: false; status: 403; error: "Access denied" };

export type AuthzResult =
  | { ok: true; assessment: Assessment; userId: string }
  | AuthzDenial;

/**
 * Verify that the caller's session owns the given assessment.
 *
 * Returns the loaded assessment on success so callers don't need to refetch.
 * On failure, returns a typed denial the route can pass straight to
 * NextResponse.json. Use this for any endpoint that mutates or returns
 * assessment data keyed on a client-supplied ID.
 */
export async function requireAssessmentOwner(
  req: NextRequest,
  assessmentId: string,
): Promise<AuthzResult> {
  const email = await getVerifiedEmail(req);
  if (!email) {
    return { ok: false, status: 401, error: "Verification required" };
  }

  const assessment = await getAssessment(assessmentId);
  if (!assessment) {
    return { ok: false, status: 404, error: "Assessment not found" };
  }

  const user = await getUserByEmail(email);
  if (!user || user.id !== assessment.userId) {
    return { ok: false, status: 403, error: "Access denied" };
  }

  return { ok: true, assessment, userId: user.id };
}
