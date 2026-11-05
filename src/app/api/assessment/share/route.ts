import { NextRequest, NextResponse } from "next/server";
import { getOrCreateShareToken, revokeShareToken } from "@/lib/assessment/db";
import { requireAssessmentOwner } from "@/lib/assessment/authz";

/** Resolve the caller to an owned assessment, or return the error response. */
async function requireOwnedAssessment(req: NextRequest, id: string | null) {
  if (!id) {
    return { error: NextResponse.json({ error: "Missing assessment ID" }, { status: 400 }) };
  }

  const authz = await requireAssessmentOwner(req, id);
  if (!authz.ok) {
    return { error: NextResponse.json({ error: authz.error }, { status: authz.status }) };
  }

  return { assessment: authz.assessment };
}

/** Mint (or return) the public share token for an assessment the caller owns. */
export async function POST(req: NextRequest) {
  const { id } = await req.json().catch(() => ({ id: null }));
  const result = await requireOwnedAssessment(req, id);
  if (result.error) return result.error;

  const token = await getOrCreateShareToken(id);
  if (!token) {
    return NextResponse.json({ error: "Could not create share link" }, { status: 500 });
  }

  return NextResponse.json({ token, path: `/assessment/s/${token}` });
}

/** Revoke the share link. The report itself is untouched. */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const result = await requireOwnedAssessment(req, id);
  if (result.error) return result.error;

  await revokeShareToken(id!);
  return NextResponse.json({ revoked: true });
}
