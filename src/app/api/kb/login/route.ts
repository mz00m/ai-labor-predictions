import { NextRequest, NextResponse } from "next/server";
import { checkAdminToken } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const COOKIE = "kb_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  const rateLimit = await checkRateLimit({
    namespace: "admin-login",
    identifier: getClientIp(req),
    limit: 5,
    globalLimit: 100,
    windowSeconds: 15 * 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.redirect(new URL("/kb?error=rate-limit", req.url), {
      status: 303,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const formData = await req.formData();
  const token = formData.get("token")?.toString() ?? null;

  if (!(await checkAdminToken(token))) {
    return NextResponse.redirect(new URL("/kb?error=1", req.url));
  }

  const res = NextResponse.redirect(new URL("/kb", req.url));
  res.cookies.set(COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
