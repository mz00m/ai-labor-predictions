import { NextRequest, NextResponse } from "next/server";
import { AssessmentIntake, AssessmentStep, ASSESSMENT_STEPS } from "@/lib/assessment/types";
import { AssessmentIntakeSchema } from "@/lib/assessment/schemas";
import {
  generateStep1Profile,
  generateStep2Tasks,
  generateStep3Tools,
  generateStep4Risks,
} from "@/lib/assessment/analyze";
import {
  getOrCreateUser,
  createAssessment,
  getAssessment,
  updateAssessmentStatus,
  updateCurrentStep,
  saveStepContext,
  saveStepFeedback,
  mergePartialReport,
} from "@/lib/assessment/db";
import { signToken, makeSessionCookie } from "@/lib/assessment/auth";
// Allow up to 300 seconds for Claude API call + processing
// Vercel Pro plan supports up to 300s
export const maxDuration = 300;

export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    const intakeRaw = formData.get("intake") as string | null;
    const email = formData.get("email") as string;
    const mode = (formData.get("mode") as string) || "preview";
    const assessmentIdParam = formData.get("assessmentId") as string | null;
    const step = formData.get("step") as AssessmentStep | null;
    const feedbackRaw = formData.get("feedback") as string | null;

    // Continuation calls (steps 2-4) only need assessmentId + step.
    // Initial calls need intake + email (or assessmentId for step 1 re-runs).
    const isContinuation = assessmentIdParam && step && step !== "profile";

    if (!isContinuation && !intakeRaw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isContinuation && !email && !assessmentIdParam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For continuation calls, load intake from DB instead of re-parsing from client
    let intake: AssessmentIntake;
    let fileContents: { name: string; category: string; text: string }[] = [];
    let websiteContent: string | null = null;
    let assessmentId: string | null = assessmentIdParam;
    let sessionEmail: string | null = null; // Set when we need to issue a session cookie

    if (isContinuation) {
      // Steps 2-4: load intake from existing assessment, skip file/website processing
      const existing = await getAssessment(assessmentIdParam);
      if (!existing) {
        return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
      }
      intake = existing.intake;
    } else {
      // Initial call or step 1: parse intake and process files/website
      const intakeParsed = JSON.parse(intakeRaw!);

      // Normalize all array fields — FormData can deliver these as comma-separated strings
      const arrayFields = ["keyRoles", "primaryFunctions", "biggestChallenges", "goals", "currentTools"] as const;
      for (const field of arrayFields) {
        if (typeof intakeParsed[field] === "string") {
          intakeParsed[field] = intakeParsed[field].split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      }

      // Normalize websiteUrl — auto-prepend https:// and trim
      if (typeof intakeParsed.websiteUrl === "string") {
        const url = intakeParsed.websiteUrl.trim();
        if (!url) {
          intakeParsed.websiteUrl = "";
        } else if (!/^https?:\/\//i.test(url)) {
          intakeParsed.websiteUrl = `https://${url}`;
        } else {
          intakeParsed.websiteUrl = url;
        }
      }

      // Validate intake against schema
      const parseResult = AssessmentIntakeSchema.safeParse(intakeParsed);
      if (!parseResult.success) {
        const errors = parseResult.error.flatten();
        return NextResponse.json(
          { error: "Invalid intake data", details: errors.fieldErrors },
          { status: 400 }
        );
      }
      intake = parseResult.data;

      // Process uploaded files IN MEMORY ONLY
      const fileEntries = formData.getAll("files");
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      for (const entry of fileEntries) {
        if (entry instanceof File) {
          if (entry.size > MAX_FILE_SIZE) {
            console.warn(`Skipping ${entry.name}: ${(entry.size / 1024 / 1024).toFixed(1)}MB exceeds 10MB limit`);
            continue;
          }
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
      if (intake.websiteUrl) {
        try {
          const { scrapeWebsite, formatScrapedContent } = await import("@/lib/assessment/scrape-website");
          const scraped = await scrapeWebsite(intake.websiteUrl);
          if (scraped.success) {
            websiteContent = formatScrapedContent(scraped);
          }
        } catch (e) {
          console.error("Failed to fetch website:", e);
          try { websiteContent = await fetchWebsiteText(intake.websiteUrl); } catch { /* ignore */ }
        }
      }

      // Create user and assessment record (only for initial calls without existing ID)
      if (!assessmentIdParam) {
        const user = await getOrCreateUser(email);
        if (user) {
          assessmentId = await createAssessment(user.id, intake);
          if (assessmentId) {
            await updateAssessmentStatus(assessmentId, "analyzing");
          }
          // Mark that we need to set the session cookie so the progress/report
          // pages can authenticate without requiring a separate login step
          sessionEmail = email.toLowerCase().trim();
        }
      }
    }

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

      const response = NextResponse.json({
        assessmentId: targetId,
        step,
        ...stepResult,
      });

      // Set session cookie on initial submission so progress/report pages work
      if (sessionEmail) {
        const token = await signToken(sessionEmail);
        response.cookies.set(makeSessionCookie(token));
      }

      return response;
    }

    // No step parameter — reject. The 4-step pipeline is the only supported path.
    return NextResponse.json(
      { error: "Missing required 'step' parameter. Use the multi-step pipeline." },
      { status: 400 }
    );
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
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "(Could not extract text from this document format)";
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
