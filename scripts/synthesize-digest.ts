/**
 * Step 2: Synthesize Digest
 *
 * Reads scored items from fetch-sources output, sends to Claude for
 * synthesis, validates against DigestSchema, and writes the structured
 * digest JSON.
 *
 * Usage:
 *   npx tsx scripts/synthesize-digest.ts
 *   npx tsx scripts/synthesize-digest.ts --input .digest-cache/latest.json
 *   npx tsx scripts/synthesize-digest.ts --output src/data/digests
 *   npx tsx scripts/synthesize-digest.ts --dry-run
 */

import fs from "fs";
import path from "path";
import { z } from "zod";
import { loadEnv } from "./lib/load-env";

loadEnv();

import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_SONNET } from "../src/lib/claude-models";

// ─── Digest Schema ────────────────────────────────────────────────────

const HighlightSchema = z.object({
  title: z.string(),
  summary: z.string(),
  source: z.string().url(),
  authors: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
  doi: z.string().optional(),
  score: z.number().min(0).max(1),
  sourceAdapter: z.string(),
  graphSlug: z.string().optional(),
});

export const DigestSchema = z.object({
  week: z.string().regex(/^\d{4}-W\d{2}$/),
  generatedAt: z.string(),
  lookbackDays: z.number().int().positive(),
  highlights: z.array(HighlightSchema),
  themes: z.array(z.string()),
  watching: z.array(
    z.object({
      title: z.string(),
      source: z.string().url(),
      reason: z.string(),
    })
  ).default([]),
  sources: z.object({
    succeeded: z.array(z.string()),
    failed: z.array(z.string()),
    skipped: z.array(z.string()).optional(),
    totalCandidates: z.number().int(),
    afterDedup: z.number().int(),
  }),
});

export type Digest = z.infer<typeof DigestSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;

// ─── Argument Parsing ─────────────────────────────────────────────────

const args = process.argv.slice(2);

function getFlag(name: string, defaultValue: string): string {
  const eqArg = args.find((a) => a.startsWith(`--${name}=`));
  if (eqArg) return eqArg.split("=").slice(1).join("=");
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const inputPath = getFlag("input", ".digest-cache/latest.json");
const outputDir = getFlag("output", "src/data/digests");
const dryRun = args.includes("--dry-run");

// ─── ISO Week ─────────────────────────────────────────────────────────

function getWeekId(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  // Load fetched items
  if (!fs.existsSync(inputPath)) {
    console.error(
      `Input file not found: ${inputPath}\nRun fetch-sources.ts first.`
    );
    process.exit(1);
  }

  const fetchData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const items = fetchData.items ?? [];
  const lookbackDays = fetchData.lookbackDays ?? 14;
  const sourcesInfo = fetchData.sources ?? {
    succeeded: [],
    failed: [],
    totalCandidates: 0,
    afterDedup: 0,
  };

  console.log(`Loaded ${items.length} items from ${inputPath}`);

  if (items.length === 0) {
    console.error("No items to synthesize. Exiting.");
    process.exit(1);
  }

  // Build synthesis prompt
  const itemsText = items
    .map(
      (item: any, i: number) =>
        `[${i + 1}] Title: ${item.title}\n` +
        `    Source: ${item.source} | URL: ${item.url}\n` +
        `    Published: ${item.publishedAt}\n` +
        `    Score: ${item.score?.toFixed(3) ?? "N/A"}\n` +
        (item.doi ? `    DOI: ${item.doi}\n` : "") +
        (item.authors?.length ? `    Authors: ${item.authors.join(", ")}\n` : "") +
        (item.abstract
          ? `    Abstract: ${item.abstract.slice(0, 300)}\n`
          : "")
    )
    .join("\n");

  const synthesisPrompt = `You are a labor market research analyst specializing in AI's impact on employment,
wages, and workforce transformation.

Given the following ${items.length} research items from the past ${lookbackDays} days, produce a weekly
digest whose main output is a RANKED LIST OF INGEST CANDIDATES for jobsdata.ai: new
evidence the site should add, most useful first. Rank by (1) new quantitative evidence
that maps to a prediction graph below, (2) evidence quality (government data, peer-reviewed
or working papers, Fed and major institutional research first; blogs, forums and opinion
last or omitted), (3) recency. Omit items with no labor-market evidence. Items titled
"SERIES DUE" are overdue recurring releases: list them under "watching", not highlights.
For each highlight, identify which of the following jobsdata.ai prediction graphs it is
most relevant to (use the slug exactly):

DISPLACEMENT: overall-us-displacement,
  white-collar-professional-displacement, tech-sector-displacement,
  creative-industry-displacement, education-sector-displacement,
  healthcare-admin-displacement, financial-services-displacement,
  customer-service-automation, early-career-employment-decline,
  robots-physical-automation-displacement
WAGES: median-wage-impact, entry-level-wage-impact,
  high-skill-wage-premium, freelancer-rate-impact
ADOPTION: ai-adoption-rate, genai-work-adoption, ai-business-formation,
  workforce-ai-exposure, workforce-ai-use, earnings-call-ai-mentions

Return ONLY valid JSON. No preamble, no markdown fences.
Schema: {
  "week": "YYYY-WNN",
  "generatedAt": "ISO timestamp",
  "lookbackDays": number,
  "highlights": [up to 15 ranked ingest candidates, best first, each: {
    "title": string,
    "summary": "1-2 sentences stating the key number(s) and what they measure",
    "source": "URL",
    "authors": [optional],
    "publishedAt": "ISO date" (optional),
    "doi": string (optional),
    "score": 0-1,
    "sourceAdapter": "adapter name",
    "graphSlug": "best-matching slug from the list above"
  }],
  "themes": ["max 3 short themes"],
  "watching": [{
    "title": string,
    "source": "URL",
    "reason": "max 200 chars"
  }],
  "sources": {
    "succeeded": [adapter names],
    "failed": [adapter names],
    "totalCandidates": number,
    "afterDedup": number
  }
}

Week ID for this digest: ${getWeekId(new Date())}
Current timestamp: ${new Date().toISOString()}

ITEMS:
${itemsText}`;

  // Call Claude
  console.log("Synthesizing via Claude API...");
  const client = new Anthropic();
  const response = await client.messages.create({
    model: CLAUDE_SONNET,
    max_tokens: 8192,
    messages: [{ role: "user", content: synthesisPrompt }],
  });

  // Parse response
  let parsed: unknown;
  try {
    const raw = response.content
      .map((b) => ("text" in b ? b.text : ""))
      .join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  } catch {
    console.error("Claude returned non-JSON response. Check prompt and retry.");
    process.exit(1);
  }

  // Pre-process: fix common LLM response issues before validation
  const obj = parsed as any;
  if (Array.isArray(obj.highlights)) {
    obj.highlights = obj.highlights.slice(0, 15).map((h: any) => ({
      ...h,
      // Clamp score to 0-1 (Claude sometimes returns percentages like 85 instead of 0.85)
      score: typeof h.score === "number"
        ? Math.min(Math.max(h.score > 1.5 ? h.score / 100 : h.score, 0), 1)
        : 0,
      // Default sourceAdapter if missing
      sourceAdapter: h.sourceAdapter || "unknown",
    }));
  }
  if (Array.isArray(obj.themes)) {
    obj.themes = obj.themes.slice(0, 3);
  }
  if (Array.isArray(obj.watching)) {
    // Filter out watching items with invalid URLs
    obj.watching = obj.watching.filter((w: any) => {
      try { new URL(w.source); return true; } catch { return false; }
    });
  }

  // Inject source metadata from fetch phase
  obj.sources = sourcesInfo;
  obj.lookbackDays = lookbackDays;

  // Validate against schema
  const result = DigestSchema.safeParse(obj);
  if (!result.success) {
    console.error("Schema validation failed:");
    console.error(JSON.stringify(result.error.format(), null, 2));
    console.error("\nRaw response:");
    console.error(JSON.stringify(obj, null, 2));
    process.exit(1);
  }

  const digest = result.data;
  console.log(`Digest validated: ${digest.highlights.length} highlights, ${digest.themes.length} themes`);

  // Output
  if (dryRun) {
    console.log("\n--- DRY RUN: Digest JSON ---\n");
    console.log(JSON.stringify(digest, null, 2));
    return;
  }

  // Ensure output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write digest file
  const weekId = digest.week;
  const digestPath = path.join(outputDir, `${weekId}.json`);
  fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));
  console.log(`Wrote digest to ${digestPath}`);

  // Write latest pointer
  const latestPath = path.join(outputDir, "latest.json");
  fs.writeFileSync(
    latestPath,
    JSON.stringify(
      { currentWeek: weekId, generatedAt: digest.generatedAt },
      null,
      2
    )
  );
  console.log(`Updated latest pointer to ${weekId}`);

  // Keep the full scored candidate list next to the digest. Before this, only
  // the highlights survived a run, so there was no way to tell whether a missed
  // paper had been fetched and ranked out or never fetched at all.
  const candidatesPath = path.join(outputDir, `${weekId}.candidates.json`);
  fs.writeFileSync(
    candidatesPath,
    JSON.stringify(
      {
        week: weekId,
        fetchedAt: fetchData.fetchedAt,
        sources: sourcesInfo,
        sourceHealth: fetchData.sourceHealth ?? [],
        items: items.map((it: any) => ({
          title: it.title,
          url: it.url,
          source: it.source,
          publishedAt: it.publishedAt,
          score: it.score,
        })),
      },
      null,
      2
    ) + "\n"
  );
  console.log(`Wrote ${items.length} scored candidates to ${candidatesPath}`);

  // Summary
  console.log("\n--- Digest Summary ---");
  console.log(`Week: ${weekId}`);
  console.log(`Highlights: ${digest.highlights.length}`);
  for (const h of digest.highlights) {
    console.log(`  [${h.score.toFixed(2)}] ${h.title.slice(0, 70)} → ${h.graphSlug ?? "unmapped"}`);
  }
  console.log(`Themes: ${digest.themes.join("; ")}`);
  console.log(`Watching: ${digest.watching.length} items`);
  console.log(
    `Sources: ${sourcesInfo.succeeded.length} ok, ${sourcesInfo.failed.length} failed`
  );
}

// Only run when executed directly (not when imported for schema/types)
if (process.argv[1]?.includes("synthesize-digest")) {
  main().catch((err) => {
    console.error("Synthesis failed:", err);
    process.exit(1);
  });
}
