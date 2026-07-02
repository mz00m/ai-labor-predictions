import { NextRequest, NextResponse } from "next/server";
import { AssessmentIntake, AssessmentStep, ASSESSMENT_STEPS } from "@/lib/assessment/types";
import { AssessmentIntakeSchema } from "@/lib/assessment/schemas";
import {
  generateStep1Profile,
  generateStep2Tasks,
  generateStep3Tools,
  generateStep3Roadmap,
  generateStep3Roi,
  generateStep4Risks,
} from "@/lib/assessment/analyze";
import {
  getOrCreateUser,
  getUserById,
  createAssessment,
  getAssessment,
  updateAssessmentStatus,
  updateCurrentStep,
  saveStepContext,
  saveStepFeedback,
  mergePartialReport,
  isDbAvailable,
} from "@/lib/assessment/db";
import { sendReportReadyEmail } from "@/lib/assessment/send-report-email";
import { signToken, makeSessionCookie } from "@/lib/assessment/auth";
import { requireAssessmentOwner } from "@/lib/assessment/authz";
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

    // Continuation calls (any step on an existing assessment) only need
    // assessmentId + step. The canonical intake lives on the row already,
    // so we load it from the DB instead of re-validating the client copy.
    //
    // Initial calls (from /assessment/start, no assessmentId yet) need
    // intake + email — that's how we mint a new row.
    //
    // Previously this excluded step === "profile" from the continuation
    // path, which broke the report page's "Change my AI maturity →
    // Regenerate report" flow (re-runs the profile step on an existing
    // row without re-passing intake). Now any step with an assessmentId
    // is a continuation.
    const isContinuation = !!assessmentIdParam && !!step;

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

    // Any request that targets an existing assessment (continuation OR step-1
    // rerun) must prove ownership via the session cookie. New submissions skip
    // this — the `email` field in the form is the declared identity and the
    // session cookie is minted on first submit.
    if (assessmentIdParam) {
      const authz = await requireAssessmentOwner(req, assessmentIdParam);
      if (!authz.ok) {
        return NextResponse.json({ error: authz.error }, { status: authz.status });
      }
    }

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
        // Build a human-readable message naming the offending fields.
        // The schema's tightest caps (teamDescription 3000, specificProblem
        // 5000, additionalContext 5000, etc.) are easy for users to blow
        // through when pasting a job description or org chart. Returning
        // "Invalid intake data" with no field names leaves them stuck.
        const FIELD_LABELS: Record<string, string> = {
          organizationName: "Organization name",
          industry: "Industry",
          companySize: "Company size",
          assessmentScope: "Scope",
          jobTitle: "Job title",
          departmentName: "Department",
          teamDescription: "What you do day-to-day",
          primaryFunctions: "Primary functions",
          keyRoles: "Key roles",
          currentTools: "Current tools",
          currentAiUsage: "AI maturity",
          biggestChallenges: "Biggest challenges",
          goals: "Goals",
          specificProblem: "Specific problem to solve",
          additionalContext: "Additional context",
          websiteUrl: "Website URL",
          industryDetail: "Industry detail",
        };
        const fieldErrors = errors.fieldErrors as Record<string, string[] | undefined>;
        const issues: string[] = [];
        for (const [field, msgs] of Object.entries(fieldErrors)) {
          if (!msgs || msgs.length === 0) continue;
          const label = FIELD_LABELS[field] || field;
          // zod's default messages aren't end-user friendly; translate the common ones.
          const raw = msgs[0];
          let friendly = raw;
          const tooBigMatch = /at most (\d+) character/i.exec(raw);
          if (tooBigMatch) friendly = `is too long (max ${tooBigMatch[1]} characters) — please shorten it`;
          else if (/Required/i.test(raw)) friendly = "is required";
          else if (/Invalid url/i.test(raw)) friendly = "must be a valid URL (e.g. https://example.com)";
          else if (/at least (\d+)/i.test(raw)) friendly = raw.toLowerCase();
          else if (/Invalid enum/i.test(raw)) friendly = "needs to be selected";
          issues.push(`${label} ${friendly}`);
        }
        const formError = errors.formErrors?.[0];
        if (formError) issues.unshift(formError);
        const message = issues.length > 0
          ? `Please fix the following: ${issues.slice(0, 3).join("; ")}${issues.length > 3 ? "; and more" : ""}.`
          : "Some of your intake answers didn't validate — please review and try again.";
        return NextResponse.json(
          { error: message, details: errors.fieldErrors },
          { status: 400 }
        );
      }
      intake = parseResult.data;

      // Process uploaded files IN MEMORY ONLY
      const fileEntries = formData.getAll("files");
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — keep aligned with FileUploader.maxSizeMb
      const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB combined — protects Lambda memory
      let runningTotal = 0;
      const skipped: { name: string; reason: string }[] = [];
      for (const entry of fileEntries) {
        if (entry instanceof File) {
          if (entry.size > MAX_FILE_SIZE) {
            const reason = `${(entry.size / 1024 / 1024).toFixed(1)}MB exceeds 10MB per-file limit`;
            console.warn(`Skipping ${entry.name}: ${reason}`);
            skipped.push({ name: entry.name, reason });
            continue;
          }
          if (runningTotal + entry.size > MAX_TOTAL_SIZE) {
            const reason = "combined upload size would exceed 30MB cap";
            console.warn(`Skipping ${entry.name}: ${reason}`);
            skipped.push({ name: entry.name, reason });
            continue;
          }
          try {
            const text = await extractFileText(entry);
            if (!text || text.trim().length < 20) {
              skipped.push({ name: entry.name, reason: "no extractable text (scanned PDF, image-only, or empty)" });
              console.warn(`Skipped ${entry.name}: extracted text was empty or too short`);
              continue;
            }
            runningTotal += entry.size;
            const fileMeta = intake.uploadedFiles.find((f) => f.name === entry.name);
            fileContents.push({
              name: entry.name,
              category: fileMeta?.category || "other",
              text,
            });
          } catch (e) {
            const reason = `extraction failed (${e instanceof Error ? e.message.slice(0, 80) : "unknown error"})`;
            console.error(`Failed to extract text from ${entry.name}:`, e);
            skipped.push({ name: entry.name, reason });
          }
        }
      }
      // Surface skipped files in the response so the client can warn the user
      // that they may want to retry with smaller / different files.
      if (skipped.length > 0) {
        console.warn(`[assessment] ${skipped.length} file(s) skipped:`, skipped);
      }
      // Note: `skipped` is logged for observability; we don't propagate it to
      // the client mid-pipeline because step 1's response shape is already
      // load-bearing for the progress page. A future enhancement could
      // surface this as a "documents skipped" panel in the report.

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

      // Create user and assessment record (only for initial calls without existing ID).
      // Infrastructure failures here must NOT fall through to the multi-step
      // "Assessment ID required" 400 below — that misreports a server problem
      // as a user error.
      if (!assessmentIdParam) {
        if (!isDbAvailable()) {
          console.error("Analyze: database unavailable, cannot create assessment");
          return NextResponse.json(
            { error: "We're having trouble on our end — please try again in a few minutes." },
            { status: 503 }
          );
        }
        const user = await getOrCreateUser(email);
        if (!user) {
          return NextResponse.json({ error: "Valid email required" }, { status: 400 });
        }
        assessmentId = await createAssessment(user.id, intake);
        if (!assessmentId) {
          console.error("Analyze: createAssessment failed with database available");
          return NextResponse.json(
            { error: "We couldn't start your assessment — please try again." },
            { status: 500 }
          );
        }
        await updateAssessmentStatus(assessmentId, "analyzing");
        // Mark that we need to set the session cookie so the progress/report
        // pages can authenticate without requiring a separate login step
        sessionEmail = email.toLowerCase().trim();
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

      // Observability guard: log when a step writes empty critical fields.
      // After the brittle-fallback fix, the steps throw rather than write
      // empty defaults — but if .catch() handlers ever salvage to the empty
      // string, this is the canary that catches it in Vercel logs.
      const flagHollow = (label: string, report: Record<string, any>) => {
        const issues: string[] = [];
        if ("executiveSummary" in report && (!report.executiveSummary || String(report.executiveSummary).trim().length === 0)) {
          issues.push("executiveSummary is empty");
        }
        if ("taskAnalysis" in report && Array.isArray(report.taskAnalysis) && report.taskAnalysis.length === 0) {
          issues.push("taskAnalysis is empty");
        }
        if ("toolRecommendations" in report && Array.isArray(report.toolRecommendations) && report.toolRecommendations.length === 0) {
          issues.push("toolRecommendations is empty");
        }
        if ("riskAssessment" in report && (!report.riskAssessment?.displacementRisk || String(report.riskAssessment.displacementRisk).trim().length === 0)) {
          issues.push("riskAssessment.displacementRisk is empty");
        }
        if (issues.length > 0) {
          console.error(`[assessment/analyze:${label}] Hollow report detected for ${targetId}: ${issues.join("; ")}`);
        }
      };

      switch (step) {
        case "profile": {
          const { report: profileReport, stepContext: extractedContext } = await generateStep1Profile(
            intake, fileContents, websiteContent
          );
          flagHollow("profile", profileReport as Record<string, any>);
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
          flagHollow("tasks", taskReport as Record<string, any>);
          await mergePartialReport(targetId, taskReport);
          stepResult = { report: taskReport };
          break;
        }
        case "tools": {
          const toolReport = await generateStep3Tools(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          flagHollow("tools", toolReport as Record<string, any>);
          await mergePartialReport(targetId, toolReport);
          // Tools is the last AUTO step — once it lands, the user has the
          // most practical, decision-ready output. Mark the assessment
          // complete so the report page renders. Roadmap, ROI, and risks
          // are now opt-in additions on top of a complete report.
          await updateAssessmentStatus(targetId, "complete");
          // Fire the "your report is ready" email. We do this once on the
          // status transition from analyzing -> complete so a user who
          // closes the tab still gets a link back. Fire-and-forget — the
          // send-report module swallows its own failures.
          //
          // Look up the user's email from the assessment owner record.
          // The session cookie has it too, but the cookie may not be
          // attached to every continuation call, and the assessment
          // record is the source of truth.
          if (!existing || existing.status !== "complete") {
            const ownerId = existing?.userId ?? "";
            try {
              const owner = ownerId ? await getUserById(ownerId) : null;
              if (owner?.email) {
                await sendReportReadyEmail({
                  email: owner.email,
                  assessmentId: targetId,
                  organizationName: intake.organizationName,
                });
              } else {
                console.warn(
                  `[email/report-ready] no email — assessment=${targetId.slice(0, 8)} owner_id=${ownerId.slice(0, 8) || "—"}`,
                );
              }
            } catch (e) {
              console.error(
                `[email/report-ready] threw  assessment=${targetId.slice(0, 8)}: ${e instanceof Error ? e.message : e}`,
              );
            }
          }
          stepResult = { report: toolReport };
          break;
        }
        case "roadmap": {
          const roadmapReport = await generateStep3Roadmap(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          await mergePartialReport(targetId, roadmapReport);
          stepResult = { report: roadmapReport };
          break;
        }
        case "roi": {
          const roiReport = await generateStep3Roi(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          await mergePartialReport(targetId, roiReport);
          stepResult = { report: roiReport };
          break;
        }
        case "risks": {
          const riskReport = await generateStep4Risks(
            intake, previousReport as any, stepContext || undefined, feedback ? [feedback] : undefined
          );
          flagHollow("risks", riskReport as Record<string, any>);
          await mergePartialReport(targetId, riskReport);
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
