import { NextRequest, NextResponse } from "next/server";
import { checkAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const COOKIE = "kb_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token")?.toString() ?? null;

  if (!(await checkAdminToken(token))) {
    return NextResponse.redirect(new URL("/kb?error=1", req.url));
  }

  const res = NextResponse.redirect(new URL("/kb", req.url));
  res.cookies.set(COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
