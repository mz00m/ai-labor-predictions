import type { NextRequest } from "next/server";
import { createHash } from "crypto";
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
 * Short, PII-safe identifiers for log lines. Email becomes a hash + the
 * partial domain so we can correlate without storing the raw value in
 * Vercel logs. user_id is already opaque so we just truncate.
 */
function emailHash(email: string): string {
  const norm = email.trim().toLowerCase();
  const h = createHash("sha256").update(norm).digest("hex").slice(0, 10);
  const at = norm.indexOf("@");
  const domain = at >= 0 ? norm.slice(at + 1) : "(no-domain)";
  return `${h}@${domain}`;
}

function shortId(id: string | null | undefined): string {
  if (!id) return "—";
  return id.slice(0, 8);
}

/**
 * Verify that the caller's session owns the given assessment.
 *
 * Returns the loaded assessment on success so callers don't need to refetch.
 * On failure, returns a typed denial the route can pass straight to
 * NextResponse.json. Use this for any endpoint that mutates or returns
 * assessment data keyed on a client-supplied ID.
 *
 * Failure cases are logged with PII-safe identifiers (sha256-prefix of
 * the email + domain, 8-char prefixes of UUIDs) so support reports of
 * "got an access denied" can be matched to a specific denial reason in
 * Vercel logs without leaking the raw email.
 */
export async function requireAssessmentOwner(
  req: NextRequest,
  assessmentId: string,
): Promise<AuthzResult> {
  const aShort = shortId(assessmentId);

  const email = await getVerifiedEmail(req);
  if (!email) {
    console.warn(
      `[authz] 401 verification_required  assessment=${aShort}  reason=no-session-email`,
    );
    return { ok: false, status: 401, error: "Verification required" };
  }

  const eHash = emailHash(email);

  const assessment = await getAssessment(assessmentId);
  if (!assessment) {
    console.warn(
      `[authz] 404 assessment_not_found  assessment=${aShort}  session_email=${eHash}`,
    );
    return { ok: false, status: 404, error: "Assessment not found" };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    // Session email points at no user row. Almost certainly stale-cookie
    // territory (account deleted, email canonicalization mismatch on legacy
    // rows that don't show up in LOWER() lookup, etc.).
    console.warn(
      `[authz] 403 access_denied  reason=no-user-for-session-email` +
        `  assessment=${aShort}` +
        `  assessment_owner=${shortId(assessment.userId)}` +
        `  session_email=${eHash}`,
    );
    return { ok: false, status: 403, error: "Access denied" };
  }

  if (user.id !== assessment.userId) {
    // Session user exists but doesn't own the assessment. This is the
    // case-mismatch / wrong-email / cross-account scenario we want to
    // distinguish in Vercel logs.
    console.warn(
      `[authz] 403 access_denied  reason=owner-mismatch` +
        `  assessment=${aShort}` +
        `  session_user=${shortId(user.id)}  session_email=${eHash}` +
        `  assessment_owner=${shortId(assessment.userId)}`,
    );
    return { ok: false, status: 403, error: "Access denied" };
  }

  return { ok: true, assessment, userId: user.id };
}
