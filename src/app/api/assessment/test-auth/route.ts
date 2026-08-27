import { NextRequest, NextResponse } from "next/server";
import { verifyToken, makeSessionCookie } from "@/lib/assessment/auth";
import { checkAdminToken } from "@/lib/admin-auth";

/**
 * Sets the session cookie for a test-run JWT. Credentials are accepted only in
 * the POST body/header so they cannot leak through URL history or referrers.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { jwt, id } = body as { jwt?: string; id?: string };

  if (!jwt || !id) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  if (!(await checkAdminToken(req.headers.get("x-admin-token")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate the JWT itself before setting it
  const verified = await verifyToken(jwt);
  if (!verified) {
    return NextResponse.json({ error: "Invalid JWT" }, { status: 401 });
  }

  const response = NextResponse.json({ redirectUrl: `/assessment/progress?id=${encodeURIComponent(id)}` });
  const cookie = makeSessionCookie(jwt);
  response.cookies.set(cookie);

  return response;
}
