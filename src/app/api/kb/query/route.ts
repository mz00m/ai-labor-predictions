import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { checkAdminToken } from "@/lib/admin-auth";
import { CLAUDE_SONNET } from "@/lib/claude-models";
import { PREDICTION_COUNT, SOURCE_COUNT_DISPLAY } from "@/lib/constants";

export const dynamic = "force-dynamic";

const WIKI_ROOT = path.join(process.cwd(), "wiki");

function readWikiFile(relPath: string): string | null {
  try {
    return fs.readFileSync(path.join(WIKI_ROOT, relPath), "utf-8");
  } catch {
    return null;
  }
}

function scanDir(dir: string, prefix: string, words: string[], minWordLen: number, max: number): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    if (words.some((w) => w.length > minWordLen && f.includes(w))) {
      out.push(`${prefix}/${f}`);
      if (out.length >= max) break;
    }
  }
  return out;
}

function findRelevantFiles(query: string): string[] {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);
  const files: string[] = [];

  // Predictions
  files.push(...scanDir(path.join(WIKI_ROOT, "predictions"), "predictions", words, 3, 5));

  // Task visualizer top-level pages (always cheap to include for industry/economy questions)
  const tvRoot = path.join(WIKI_ROOT, "task-visualizer");
  if (fs.existsSync(tvRoot)) {
    for (const f of fs.readdirSync(tvRoot)) {
      if (!f.endsWith(".md")) continue;
      // Always include forecasts.md and the index for prediction-style questions
      if (
        f === "forecasts.md" ||
        f === "index.md" ||
        f === "task-categories.md" ||
        f === "industry-speeds.md" ||
        f === "methodology.md" ||
        words.some((w) => w.length > 3 && f.includes(w))
      ) {
        files.push(`task-visualizer/${f}`);
      }
    }
  }

  // Per-job task visualizer pages
  files.push(
    ...scanDir(path.join(WIKI_ROOT, "task-visualizer/jobs"), "task-visualizer/jobs", words, 3, 5),
  );

  // Per-occupation-group task visualizer pages
  files.push(
    ...scanDir(
      path.join(WIKI_ROOT, "task-visualizer/occupation-groups"),
      "task-visualizer/occupation-groups",
      words,
      3,
      5,
    ),
  );

  // Sources (kept last so they don't crowd out structured data)
  if (files.length < 8) {
    files.push(...scanDir(path.join(WIKI_ROOT, "sources"), "sources", words, 4, 5));
  }

  // Dedupe and cap so we don't blow the context window
  return Array.from(new Set(files)).slice(0, 12);
}

export async function POST(req: NextRequest) {
  const token =
    req.cookies.get("kb_session")?.value ||
    req.nextUrl.searchParams.get("token") ||
    req.headers.get("x-admin-token");
  if (!(await checkAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query } = await req.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "query required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  // Build context from wiki
  const index = readWikiFile("index.md") ?? "";
  const relevantFiles = findRelevantFiles(query);
  const fileContents = relevantFiles
    .map((f) => {
      const content = readWikiFile(f);
      return content ? `\n\n---\n### ${f}\n\n${content}` : "";
    })
    .filter(Boolean)
    .join("");

  const context = `# jobsdata.ai Knowledge Base\n\n## Index\n\n${index}${fileContents}`;

  const client = new Anthropic({ apiKey });

  // Open the stream inside a try/catch so a 404/429/auth error from Anthropic
  // surfaces as a useful JSON error instead of the framework's silent 500.
  // This is what burned us on the claude-mythos-0417 model typo — the
  // error just manifested as "500" with no hint of the 404 under the hood.
  let stream: Awaited<ReturnType<typeof client.messages.create>>;
  try {
    stream = await client.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 2048,
      stream: true,
      system: `You are a research assistant for jobsdata.ai, a labor market signals dashboard tracking AI's impact on employment. You have access to the project's knowledge base — ${PREDICTION_COUNT} prediction graphs, ${SOURCE_COUNT_DISPLAY} verified sources, and methodology documentation.

Answer questions directly and precisely. Cite specific sources, prediction slugs, and data points when relevant. Be honest about uncertainty. Don't pad.

FORMATTING: Write in plain prose. Do NOT use Markdown — no headers (#, ##, ###), no bold (**text**), no italics (*text*), no bullet or numbered lists (- item, 1. item), no code fences, no tables. The client renders responses as plain text, so Markdown symbols appear as literal characters to the reader. Use normal paragraphs separated by blank lines. When citing a source or prediction, mention it inline (e.g., "per the Yale Budget Lab 2025 occupation-exposure study" or "on the workforce-ai-exposure graph"). When you'd normally write a list, use a sentence with commas or semicolons, or write each item as its own sentence in a short paragraph.`,
      messages: [
        {
          role: "user",
          content: `Knowledge base:\n\n${context}\n\n---\n\nQuestion: ${query}`,
        },
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const status = (err as { status?: number })?.status;
    console.error(`[kb-query] Anthropic call failed (status=${status}): ${message}`);
    return NextResponse.json(
      { error: `AI service error: ${message}`, status: status ?? null },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      // Stream errors happen after headers are already sent, so we can't
      // switch to a JSON error response. Best we can do is log and close
      // the stream with an error signal the client can detect.
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[kb-query] stream failure: ${message}`);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
