import { NextRequest, NextResponse } from "next/server";
import { verifyToken, makeSessionCookie } from "@/lib/assessment/auth";
import { getAdminPasswordHash } from "@/lib/assessment/db";

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkAdminAuth(token: string | null): Promise<boolean> {
  if (!token) return false;
  const dbHash = await getAdminPasswordHash();
  if (dbHash) {
    const tokenHash = await hashToken(token);
    return tokenHash === dbHash;
  }
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return token === secret;
}

/**
 * GET /api/assessment/test-auth?jwt=<jwt>&id=<assessmentId>&adminToken=<token>
 *
 * Sets the session cookie for a test-run JWT and redirects to the progress page.
 * Requires a valid admin token to prevent abuse.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const jwt = searchParams.get("jwt");
  const id = searchParams.get("id");
  const adminToken = searchParams.get("adminToken");

  if (!jwt || !id) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  if (!(await checkAdminAuth(adminToken))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate the JWT itself before setting it
  const verified = await verifyToken(jwt);
  if (!verified) {
    return NextResponse.json({ error: "Invalid JWT" }, { status: 401 });
  }

  const response = NextResponse.redirect(
    new URL(`/assessment/progress?id=${id}`, req.url)
  );
  const cookie = makeSessionCookie(jwt);
  response.cookies.set(cookie);

  return response;
}
