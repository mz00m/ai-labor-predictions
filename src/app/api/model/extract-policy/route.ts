import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_SONNET } from "@/lib/claude-models";
import {
  buildExtractionPrompt,
  ExtractedPolicySchema,
  sanitizeExtractedPolicy,
  stripFences,
} from "@/lib/policy-extractor";
import { safeFetchText, UnsafeUrlError } from "@/lib/security/safe-fetch";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export const maxDuration = 300;

interface RequestBody {
  text?: string;
  url?: string;
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit({
      namespace: "policy-extract",
      identifier: getClientIp(req),
      limit: 5,
      globalLimit: 50,
      windowSeconds: 3_600,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.unavailable ? "Service temporarily unavailable." : "Too many extraction requests." },
        { status: rateLimit.unavailable ? 503 : 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = (await req.json()) as RequestBody;
    let policyText = body.text?.trim() ?? "";

    // Optional URL fetch — keep it simple, no Readability parsing for v0.1
    if (!policyText && body.url) {
      try {
        const res = await safeFetchText(body.url, {
          timeoutMs: 10_000,
          maxBytes: 500_000,
          maxRedirects: 3,
          allowedContentTypes: ["text/html", "application/xhtml+xml", "text/plain"],
          headers: { "User-Agent": "jobsdata.ai-policy-extractor/0.1" },
        });
        if (res.ok) {
          const raw = res.body;
          // Strip HTML tags very roughly — good enough for ~most plain docs
          policyText = raw
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        }
      } catch (error) {
        if (error instanceof UnsafeUrlError) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
    }

    if (!policyText || policyText.length < 60) {
      return NextResponse.json(
        { error: "Policy text must be at least 60 characters." },
        { status: 400 }
      );
    }
    if (policyText.length > 40_000) {
      return NextResponse.json(
        { error: "Policy text must be 40,000 characters or fewer." },
        { status: 413 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Server is missing ANTHROPIC_API_KEY. The extraction endpoint can't run without it.",
        },
        { status: 503 }
      );
    }

    const client = new Anthropic();
    const message = await client.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 2048,
      messages: [{ role: "user", content: buildExtractionPrompt(policyText) }],
    });

    const block = message.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      return NextResponse.json(
        { error: "Claude returned no text content." },
        { status: 502 }
      );
    }

    const raw = stripFences(block.text);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return NextResponse.json(
        {
          error: "Failed to parse JSON from extraction.",
          rawSnippet: raw.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const result = ExtractedPolicySchema.safeParse(parsed);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Extracted policy failed schema validation.",
          issues: result.error.flatten(),
          rawSnippet: raw.slice(0, 500),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ policy: sanitizeExtractedPolicy(result.data) });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Extraction failed.", detail: err },
      { status: 500 }
    );
  }
}
