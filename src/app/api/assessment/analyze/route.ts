import { NextRequest, NextResponse } from "next/server";
import { AssessmentIntake, AssessmentStep, ASSESSMENT_STEPS } from "@/lib/assessment/types";
import {
  generateAssessmentReport,
  generateStep1Profile,
  generateStep2Tasks,
  generateStep3Tools,
  generateStep4Risks,
} from "@/lib/assessment/analyze";
import {
  getOrCreateUser,
  createAssessment,
  getAssessment,
  saveAssessmentReport,
  updateAssessmentStatus,
  updateCurrentStep,
  saveStepContext,
  saveStepFeedback,
  mergePartialReport,
} from "@/lib/assessment/db";
import Stripe from "stripe";

// Allow up to 300 seconds for Claude API call + processing
// Vercel Pro plan supports up to 300s
export const maxDuration = 300;

export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    const intakeRaw = formData.get("intake") as string;
    const email = formData.get("email") as string;
    const mode = (formData.get("mode") as string) || "preview";

    // Email is required for initial calls; continuation calls (with assessmentId) don't need it
    const assessmentIdParam = formData.get("assessmentId") as string | null;
    if (!intakeRaw || (!email && !assessmentIdParam)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const intakeParsed = JSON.parse(intakeRaw);

    // Normalize all array fields — FormData can deliver these as comma-separated strings
    const arrayFields = ["keyRoles", "primaryFunctions", "biggestChallenges", "goals", "currentTools"] as const;
    for (const field of arrayFields) {
      if (typeof intakeParsed[field] === "string") {
        intakeParsed[field] = intakeParsed[field].split(",").map((s: string) => s.trim()).filter(Boolean);
      }
    }

    const intake: AssessmentIntake = intakeParsed;

    // Process uploaded files IN MEMORY ONLY
    const fileContents: { name: string; category: string; text: string }[] = [];
    const fileEntries = formData.getAll("files");

    for (const entry of fileEntries) {
      if (entry instanceof File) {
        try {
          const text = await extractFileText(entry);
          const fileMeta = intake.uploadedFiles.find((f) => f.name === entry.name);
          fileContents.push({
            name: entry.name,
            category: fileMeta?.category || "other",
            text,
          });
        } catch (e) {
          console.error(`Failed to extract text from ${entry.name}:`, e);
        }
      }
    }

    // Website content extraction (Puppeteer with fetch fallback)
    let websiteContent: string | null = null;
    if (intake.websiteUrl) {
      try {
        const { scrapeWebsite, formatScrapedContent } = await import("@/lib/assessment/scrape-website");
        const scraped = await scrapeWebsite(intake.websiteUrl);
        if (scraped.success) {
          websiteContent = formatScrapedContent(scraped);
        }
      } catch (e) {
        console.error("Failed to fetch website:", e);
        // Fallback to basic fetch
        try { websiteContent = await fetchWebsiteText(intake.websiteUrl); } catch { /* ignore */ }
      }
    }

    // Create user and assessment record
    const user = await getOrCreateUser(email);
    let assessmentId: string | null = null;

    if (user) {
      assessmentId = await createAssessment(user.id, intake);
      if (assessmentId) {
        await updateAssessmentStatus(assessmentId, "analyzing");
      }
    }

    // Multi-step pipeline: if `step` parameter is present, run that step only
    const step = formData.get("step") as AssessmentStep | null;
    const feedbackRaw = formData.get("feedback") as string | null;

    if (step && ASSESSMENT_STEPS.includes(step)) {
      // Multi-step mode — run a single step and return partial results
      const targetId = assessmentIdParam || assessmentId;
      if (!targetId) {
        return NextResponse.json({ error: "Assessment ID required for multi-step mode" }, { status: 400 });
      }

      // For steps 2-4, load existing assessment state from DB
      const existing = await getAssessment(targetId);
      const previousReport = existing?.report || {};
      const stepContext = existing?.stepContext;

      // Parse user feedback if provided
      const feedback = feedbackRaw ? JSON.parse(feedbackRaw) : undefined;
      if (feedback) {
        await saveStepFeedback(targetId, { ...feedback, step, submittedAt: new Date().toISOString() });
      }

      // Update current step
      await updateCurrentStep(targetId, step);
      await updateAssessmentStatus(targetId, "analyzing");

      let stepResult: Record<string, unknown>;

      switch (step) {
        case "profile": {
          const { report: profileReport, stepContext: extractedContext } = await generateStep1Profile(
            intake, fileContents, websiteContent
          );
          // Save extracted context for subsequent steps
          await saveStepContext(targetId, extractedContext);
          // Merge partial report
          await mergePartialReport(targetId, profileReport);
          stepResult = { report: profileReport, extractedContext };
          break;
        }
        case "tasks": {
          const taskReport = await generateStep2Tasks(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          await mergePartialReport(targetId, taskReport);
          stepResult = { report: taskReport };
          break;
        }
        case "tools": {
          const toolReport = await generateStep3Tools(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          await mergePartialReport(targetId, toolReport);
          stepResult = { report: toolReport };
          break;
        }
        case "risks": {
          const riskReport = await generateStep4Risks(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          await mergePartialReport(targetId, riskReport);
          // Final step — mark complete
          await updateAssessmentStatus(targetId, "complete");
          stepResult = { report: riskReport };
          break;
        }
        default:
          return NextResponse.json({ error: `Unknown step: ${step}` }, { status: 400 });
      }

      return NextResponse.json({
        assessmentId: targetId,
        step,
        ...stepResult,
      });
    }

    // Legacy single-call mode (no step parameter)
    // Always generate the FULL report — the frontend paywall controls what's visible.
    const report = await generateAssessmentReport(intake, fileContents, websiteContent, "full");

    // File contents are now garbage collected — never persisted

    // Save sanitized report output only
    if (assessmentId) {
      await saveAssessmentReport(assessmentId, report);
    }

    // For full mode, create Stripe checkout (or bypass in dev mode)
    let checkoutUrl: string | undefined;
    if (mode === "full" && assessmentId) {
      if (process.env.ASSESSMENT_DEV_MODE === "true") {
        // Dev mode: skip Stripe, auto-mark as paid
        const { markAssessmentPaid } = await import("@/lib/assessment/db");
        await markAssessmentPaid(assessmentId, "dev_mode_bypass");
        checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://jobsdata.ai"}/assessment/report?id=${assessmentId}&payment=success`;
      } else if (process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          customer_email: email,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Your AI Action Plan - Full Report",
                  description:
                    "Personalized AI action plan with task-by-task analysis, tool recommendations, and step-by-step roadmap",
                },
                unit_amount: 10000,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jobsdata.ai"}/assessment/report?id=${assessmentId}&payment=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jobsdata.ai"}/assessment/report?id=${assessmentId}&preview=true`,
          metadata: { assessmentId, type: "assessment" },
        });

        checkoutUrl = session.url || undefined;
      }
    }

    return NextResponse.json({
      assessmentId: assessmentId || `local_${Date.now()}`,
      report: mode === "preview" ? report : undefined, // Only return report inline for preview
      checkoutUrl,
    });
  } catch (error) {
    console.error("Assessment analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process assessment: ${message}` },
      { status: 500 }
    );
  }
}

/**
 * Extract text from uploaded file — runs in memory only
 */
async function extractFileText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    // Use pdf-parse for PDF extraction
    const pdfParse = require("pdf-parse"); // dynamic import for serverless
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (
    file.type === "text/plain" ||
    file.type === "text/csv" ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".csv")
  ) {
    return buffer.toString("utf-8");
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  ) {
    // Basic DOCX extraction — pull text from XML content
    // For production, consider using mammoth or docx libraries
    const text = buffer.toString("utf-8");
    // Extract text between XML tags (rough but functional)
    const stripped = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return stripped || "(Could not extract text from this document format)";
  }

  return "(Unsupported file format — text could not be extracted)";
}

/**
 * Fetch basic text content from a website URL
 */
async function fetchWebsiteText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "jobsdata.ai-assessment-bot/1.0" },
    });

    if (!res.ok) return "";

    const html = await res.text();

    // Basic HTML to text conversion
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    // Limit to reasonable size
    return text.slice(0, 10000);
  } finally {
    clearTimeout(timeout);
  }
}
