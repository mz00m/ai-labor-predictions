import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE = "kb_session";

/**
 * Clears the kb_session cookie and returns the user to /kb.
 *
 * Invoked in two cases:
 *  1. Explicit sign-out (GET via a link or button in the KB UI)
 *  2. Session recovery (the KB client detects a 401 on /api/kb/query and
 *     redirects here so the stale cookie gets wiped before the page
 *     re-renders the sign-in gate)
 */
function clearAndRedirect(req: NextRequest) {
  const url = new URL("/kb?error=expired", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}

export async function GET(req: NextRequest) {
  return clearAndRedirect(req);
}

export async function POST(req: NextRequest) {
  return clearAndRedirect(req);
}
