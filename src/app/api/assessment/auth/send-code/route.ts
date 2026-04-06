import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateCode } from "@/lib/assessment/auth";
import { createVerificationCode } from "@/lib/assessment/db";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const code = generateCode();
    const created = await createVerificationCode(email.toLowerCase().trim(), code);

    if (!created) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429 }
      );
    }

    await getResend().emails.send({
      from: "jobsdata.ai <noreply@jobsdata.ai>",
      to: email.toLowerCase().trim(),
      subject: `Your verification code: ${code}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px;">
            Enter this code to access your AI action plans on jobsdata.ai:
          </p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111827; text-align: center; padding: 24px; background: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #9ca3af;">
            This code expires in 10 minutes. If you didn't request this, you can ignore this email.
          </p>
        </div>
      `,
    });

    // Never confirm whether the email exists in our system
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
