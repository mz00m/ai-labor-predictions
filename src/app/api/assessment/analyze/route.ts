import { NextRequest, NextResponse } from "next/server";
import { AssessmentIntake } from "@/lib/assessment/types";
import { generateAssessmentReport } from "@/lib/assessment/analyze";
import { getOrCreateUser, createAssessment, saveAssessmentReport, updateAssessmentStatus } from "@/lib/assessment/db";
import Stripe from "stripe";

// In-memory rate limiting
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // 3 assessments per IP per hour
const RATE_WINDOW = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const limiter = rateLimiter.get(ip);
  if (limiter && limiter.resetAt > now && limiter.count >= RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
  }
  if (!limiter || limiter.resetAt <= now) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  } else {
    limiter.count++;
  }

  try {
    const formData = await req.formData();
    const intakeRaw = formData.get("intake") as string;
    const email = formData.get("email") as string;
    const mode = (formData.get("mode") as string) || "preview";

    if (!intakeRaw || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const intake: AssessmentIntake = JSON.parse(intakeRaw);

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

    // Generate the report — file contents are used here and then discarded
    const report = await generateAssessmentReport(intake, fileContents, websiteContent, mode as "preview" | "full");

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
    return NextResponse.json(
      { error: "Failed to process assessment. Please try again." },
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
