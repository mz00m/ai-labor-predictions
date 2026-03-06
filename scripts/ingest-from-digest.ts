/**
 * Phase 3: Ingest from Digest
 *
 * Re-fetches each digest highlight, asks Claude to extract quantitative
 * stats, and writes a staging JSON file for human review before applying.
 *
 * Usage:
 *   npx tsx scripts/ingest-from-digest.ts src/data/digests/2026-W10.json
 */

import fs from "fs";
import path from "path";

// Load .env
const envFilePath = path.join(process.cwd(), ".env");
if (fs.existsSync(envFilePath)) {
  const envContent = fs.readFileSync(envFilePath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx);
        const value = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { fetchWithRetry } from "./utils/retry";
import { DigestSchema, type Highlight } from "./synthesize-digest";

// ─── Types ────────────────────────────────────────────────────────────

const SOURCE_TIER_MAP: Record<string, number> = {
  scopus: 1,
  semanticScholar: 1,
  arxiv: 1,
  core: 1,
  pubmed: 1,
  openAlex: 1,
  ssrn: 2,
  nber: 1,
  bls: 1,
  fred: 1,
  googleCse: 3,
  twitter: 4,
  reddit: 4,
  hnAlgolia: 4,
  substack: 4,
};

interface ExtractedStat {
  graphSlug: string;
  type: "data_point" | "overlay";
  value?: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  direction?: "up" | "down" | "neutral";
  overlayLabel?: string;
  quote: string;
}

interface IngestionCandidate {
  highlight: Highlight;
  sourceId: string;
  evidenceTier: number;
  extractedStats: ExtractedStat[];
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  const digestPath = process.argv[2];
  if (!digestPath || !fs.existsSync(digestPath)) {
    console.error(
      "Usage: npx tsx scripts/ingest-from-digest.ts <digest.json>"
    );
    process.exit(1);
  }

  // 1. Load digest — handle both synthesized format (week/highlights)
  //    and raw fetch-sources format (weekId/papers)
  const raw = JSON.parse(fs.readFileSync(digestPath, "utf-8"));

  let highlights: Highlight[];
  let weekId: string;

  const synthResult = DigestSchema.safeParse(raw);
  if (synthResult.success) {
    highlights = synthResult.data.highlights;
    weekId = synthResult.data.week;
  } else if (raw.papers && raw.weekId) {
    // Raw fetch-sources format
    weekId = raw.weekId;
    highlights = raw.papers.map((p: any) => ({
      title: p.title ?? "",
      summary: p.abstract?.slice(0, 500) ?? "",
      source: p.url ?? "",
      authors: p.authors,
      publishedAt: p.publishedDate,
      doi: p.doi ?? undefined,
      score: Math.min((p.compositeScore ?? 0) / 100, 1),
      sourceAdapter: p.source ?? "unknown",
      graphSlug: p.linkedPredictions?.[0] ?? undefined,
    }));
  } else {
    console.error("Digest file does not match any known format.");
    process.exit(1);
  }

  console.log(
    `\nProcessing ${highlights.length} items from digest ${weekId}\n`
  );

  const client = new Anthropic();
  const candidates: IngestionCandidate[] = [];

  // 2. For each highlight, re-fetch and extract ingestion stats
  for (const highlight of highlights) {
    console.log(`  -> Fetching: ${highlight.title.slice(0, 70)}`);

    const tier = SOURCE_TIER_MAP[highlight.sourceAdapter] ?? 3;

    // Generate source ID
    const publisher = new URL(highlight.source).hostname
      .replace("www.", "")
      .split(".")[0];
    const year = highlight.publishedAt
      ? new Date(highlight.publishedAt).getFullYear()
      : new Date().getFullYear();
    const keywords = highlight.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .slice(0, 3)
      .join("-");
    const sourceId = `${publisher}-${keywords}-${year}`;

    // Fetch full source text (best-effort)
    let fullText: string;
    try {
      const res = await fetchWithRetry(
        () => fetch(highlight.source).then((r) => r.text()),
        { label: `ingest-fetch-${publisher}`, retries: 2, baseDelayMs: 1000 }
      );
      fullText = res
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 8000);
    } catch {
      console.warn(
        `    ! Could not fetch full text for ${highlight.source} — using summary only`
      );
      fullText = highlight.summary;
    }

    // 3. Ask Claude to extract ingestion stats
    const extractionPrompt = `You are extracting quantitative statistics from a research source for ingestion into
the jobsdata.ai AI Labor Predictions tracker.

SOURCE METADATA:
- Title: ${highlight.title}
- URL: ${highlight.source}
- Pre-identified graph: ${highlight.graphSlug ?? "unknown"}
- Evidence tier: ${tier}

SOURCE TEXT (may be truncated):
${fullText}

TASK:
Extract every quantitative statistic about AI's impact on labor, jobs, wages, or workforce.
For each statistic:
1. Identify the best-fit graph slug from the 17 jobsdata.ai graphs (listed below)
2. Classify as data_point (unit directly matches graph unit) or overlay (adjacent evidence)
3. For data_points: extract numeric value, and confidence range if stated
4. For overlays: determine direction (up/down/neutral) and write an 80-char label
5. Include the VERBATIM quote from the source — never paraphrase

GRAPHS (slug -> unit):
Displacement: overall-us-displacement (% of US jobs), total-us-jobs-lost (% of labor force),
  white-collar-professional-displacement (% roles), tech-sector-displacement (% jobs),
  creative-industry-displacement (% roles), education-sector-displacement (% roles),
  healthcare-admin-displacement (% roles), customer-service-automation (% interactions)
Wages: median-wage-impact (% change real median wage), geographic-wage-divergence (% wage premium),
  entry-level-wage-impact (% wage change), high-skill-wage-premium (% premium over median),
  freelancer-rate-impact (% rate change)
Adoption: ai-adoption-rate (% of firms), genai-work-adoption (% adults at work),
  workforce-ai-exposure (% jobs exposed), earnings-call-ai-mentions (% of S&P 500)

RULES:
- Never invent data. Only extract explicitly stated statistics.
- Default to overlay when unit compatibility is uncertain.
- Negative values for wage declines / job losses.
- Ranges -> midpoint as value, low/high as confidenceLow/confidenceHigh.

Return ONLY valid JSON array of objects. No preamble.
Schema: [{ "graphSlug": string, "type": "data_point"|"overlay", "value"?: number, "confidenceLow"?: number, "confidenceHigh"?: number, "direction"?: "up"|"down"|"neutral", "overlayLabel"?: string, "quote": string }]
If no stats found, return [].`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: extractionPrompt }],
    });

    let extractedStats: ExtractedStat[] = [];
    try {
      const text = response.content
        .map((b) => ("text" in b ? b.text : ""))
        .join("");
      const clean = text.replace(/```json|```/g, "").trim();
      extractedStats = JSON.parse(clean);
    } catch {
      console.warn(
        `    ! Could not parse extraction response for ${highlight.title.slice(0, 50)} — skipping`
      );
    }

    console.log(`    Extracted ${extractedStats.length} stats`);

    candidates.push({
      highlight,
      sourceId,
      evidenceTier: tier,
      extractedStats,
    });
  }

  // 4. Write the ingestion staging file
  const stagingPath = path.join(
    path.dirname(digestPath),
    `${weekId}.ingest-staging.json`
  );

  fs.writeFileSync(
    stagingPath,
    JSON.stringify(
      {
        week: weekId,
        generatedAt: new Date().toISOString(),
        candidates,
      },
      null,
      2
    )
  );

  console.log(`\nStaging file written to: ${stagingPath}`);
  console.log(
    `Review and approve with: npx tsx scripts/apply-ingestion.ts ${stagingPath}\n`
  );

  // 5. Print approval report
  printApprovalReport(candidates);
}

function printApprovalReport(candidates: IngestionCandidate[]): void {
  console.log("=".repeat(52));
  console.log("  DIGEST -> INGESTION REPORT");
  console.log("=".repeat(52));

  for (const candidate of candidates) {
    const { highlight, sourceId, evidenceTier, extractedStats } = candidate;
    console.log(`\n  Source: ${highlight.title.slice(0, 60)}`);
    console.log(`  URL:    ${highlight.source}`);
    console.log(`  ID:     ${sourceId}`);
    console.log(`  Tier:   ${evidenceTier}`);
    console.log(`  Stats:  ${extractedStats.length} extracted`);
    console.log("-".repeat(52));

    extractedStats.forEach((stat, i) => {
      const typeLabel =
        stat.type === "data_point"
          ? `DATA POINT -> value: ${stat.value}${stat.confidenceLow != null ? ` (${stat.confidenceLow}-${stat.confidenceHigh})` : ""}`
          : `OVERLAY (${stat.direction}) -> "${stat.overlayLabel}"`;
      console.log(`  [${i + 1}] ${stat.graphSlug}`);
      console.log(`       ${typeLabel}`);
      console.log(
        `       Quote: "${stat.quote.slice(0, 100)}${stat.quote.length > 100 ? "..." : ""}"`
      );
    });
  }

  console.log("\n" + "=".repeat(52));
  console.log(
    "  Run apply-ingestion.ts to write approved stats to prediction files."
  );
  console.log("=".repeat(52) + "\n");
}

main().catch((err) => {
  console.error("Ingestion staging failed:", err);
  process.exit(1);
});
