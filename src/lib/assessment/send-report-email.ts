import { Resend } from "resend";

/**
 * Fire-and-forget notification that the AI Action Plan is ready to view.
 *
 * Triggered from analyze/route.ts when the 4-step pipeline completes
 * (status flips to "complete"). Replaces the previous behavior where the
 * user had to keep the tab open OR remember the URL — neither of which
 * is workable for a 5-10 minute generation job.
 *
 * Failure is swallowed (logged only). The route should never 500
 * because email delivery hiccuped; the assessment is still complete in
 * the DB and the user can still reach it from the tab they left open.
 */
export async function sendReportReadyEmail(args: {
  email: string;
  assessmentId: string;
  organizationName?: string;
}): Promise<void> {
  const { email, assessmentId, organizationName } = args;

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      `[email/report-ready] RESEND_API_KEY missing — skipping send for assessment=${assessmentId.slice(0, 8)}`,
    );
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jobsdata.ai";
  const reportUrl = `${baseUrl}/assessment/report?id=${encodeURIComponent(assessmentId)}`;
  const dashboardUrl = `${baseUrl}/assessment/dashboard`;
  const subject = organizationName
    ? `Your AI Action Plan for ${organizationName} is ready`
    : `Your AI Action Plan is ready`;

  try {
    const r = new Resend(process.env.RESEND_API_KEY);
    await r.emails.send({
      from: "jobsdata.ai <noreply@jobsdata.ai>",
      to: email.trim().toLowerCase(),
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 540px; margin: 0 auto; padding: 40px 24px; color: #111827;">
          <p style="font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #5C61F6; margin: 0 0 12px;">
            jobsdata.ai &middot; assessment ready
          </p>
          <h1 style="font-size: 24px; line-height: 1.25; font-weight: 700; margin: 0 0 16px;">
            ${organizationName ? `${escapeHtml(organizationName)}: your AI Action Plan is ready.` : "Your AI Action Plan is ready."}
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 28px;">
            We finished generating the four-step report based on what you shared:
            organization profile, task-by-task analysis, tool recommendations,
            and risk &amp; capability planning.
          </p>
          <p style="margin: 0 0 24px;">
            <a href="${reportUrl}" style="display: inline-block; background: #5C61F6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px;">
              View the report
            </a>
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #6b7280; margin: 0 0 8px;">
            Coming back from a new browser? You may need to verify your email
            first — we&rsquo;ll send a six-digit code to <strong>${escapeHtml(email)}</strong>.
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #6b7280; margin: 0 0 28px;">
            All your past reports also live at
            <a href="${dashboardUrl}" style="color: #5C61F6;">jobsdata.ai/assessment/dashboard</a>.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;">
          <p style="font-size: 11px; line-height: 1.5; color: #9ca3af; margin: 0;">
            You received this because you requested an AI Action Plan from
            jobsdata.ai. If this wasn&rsquo;t you, you can safely ignore this
            email — no further messages will be sent.
          </p>
        </div>
      `,
    });
    console.log(`[email/report-ready] sent  assessment=${assessmentId.slice(0, 8)}`);
  } catch (err) {
    // Don't fail the route — the report is generated and accessible
    // from the URL the user already has open. We just couldn't email it.
    console.error(
      `[email/report-ready] send failed  assessment=${assessmentId.slice(0, 8)}: ${err instanceof Error ? err.message : err}`,
    );
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}
