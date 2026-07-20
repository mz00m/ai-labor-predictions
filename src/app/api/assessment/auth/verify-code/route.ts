import { NextRequest, NextResponse } from "next/server";
import { signToken, makeSessionCookie } from "@/lib/assessment/auth";
import { validateVerificationCode, isDbAvailable } from "@/lib/assessment/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    if (!isDbAvailable()) {
      console.error("Verify code: database unavailable");
      return NextResponse.json(
        { error: "We're having trouble on our end — please try again in a few minutes." },
        { status: 503 }
      );
    }

    const valid = await validateVerificationCode(email.toLowerCase().trim(), code.trim());

    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    const token = await signToken(email.toLowerCase().trim());
    const response = NextResponse.json({ success: true });
    response.cookies.set(makeSessionCookie(token));
    return response;
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
