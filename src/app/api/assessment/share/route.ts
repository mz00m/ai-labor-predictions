import { NextRequest, NextResponse } from "next/server";
import {
  getAssessment,
  getUserByEmail,
  getOrCreateShareToken,
  revokeShareToken,
} from "@/lib/assessment/db";
import { getVerifiedEmail } from "@/lib/assessment/auth";

/** Resolve the caller to an owned assessment, or return the error response. */
async function requireOwnedAssessment(req: NextRequest, id: string | null) {
  if (!id) {
    return { error: NextResponse.json({ error: "Missing assessment ID" }, { status: 400 }) };
  }

  const email = await getVerifiedEmail(req);
  if (!email) {
    return { error: NextResponse.json({ error: "Verification required" }, { status: 401 }) };
  }

  const assessment = await getAssessment(id);
  if (!assessment) {
    return { error: NextResponse.json({ error: "Assessment not found" }, { status: 404 }) };
  }

  const user = await getUserByEmail(email);
  if (!user || user.id !== assessment.userId) {
    return { error: NextResponse.json({ error: "Access denied" }, { status: 403 }) };
  }

  return { assessment };
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
