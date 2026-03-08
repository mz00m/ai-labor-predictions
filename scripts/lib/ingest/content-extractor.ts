/**
 * Extract rich content (abstract, key findings, methodology, qualifiers)
 * from source text for the chatbot content store.
 *
 * Used by both:
 *   - scripts/backfill-source-content.ts (batch backfill)
 *   - scripts/ingest-source.ts (auto-populate on new ingestion)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

export interface SourceContentEntry {
  id: string;
  abstract: string;
  keyFindings: string[];
  methodology: string;
  qualifiers: string;
  fetchedAt: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src/data/source-content");

const EXTRACTION_PROMPT = `You are a research analyst extracting structured content from a source document about AI's impact on the labor market. Extract the following fields from the source text.

Return a JSON object with exactly these fields:

{
  "abstract": "A 2-4 sentence summary of the source's main argument and findings. If the source has an explicit abstract, use it. Otherwise, synthesize one from the key points. 500-2000 characters.",
  "keyFindings": ["Finding 1", "Finding 2", ...],
  "methodology": "Description of the study design, data sources, sample size, time period, and analytical approach. If the source is not a study, describe the evidence basis (e.g., 'Analysis of BLS JOLTS data from 2020-2025'). If unclear, say 'Not specified'.",
  "qualifiers": "Any caveats, limitations, uncertainty language, or scope restrictions mentioned by the authors. Include phrases like 'preliminary', 'limited sample', 'US only', etc. If none found, say 'None stated'."
}

Rules:
- keyFindings should have 3-5 items, each a single sentence with specific numbers when available
- Use the authors' own language where possible — do not editorialize
- If the source is paywalled or content is minimal, extract what you can and note limitations
- Return ONLY the JSON object, no markdown code blocks or other text`;

/**
 * Extract rich content from source text using Claude Haiku.
 * Returns a SourceContentEntry ready to write to disk.
 */
export async function extractSourceContent(
  sourceId: string,
  sourceText: string,
  meta: { title: string; publisher: string; datePublished: string; evidenceTier: number; url: string; excerpt?: string }
): Promise<SourceContentEntry> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required");
  }

  const client = new Anthropic({ apiKey });

  const maxChars = 60000;
  const truncated =
    sourceText.length > maxChars
      ? sourceText.slice(0, maxChars) + "\n\n[... content truncated ...]"
      : sourceText;

  const userMessage = `Source: "${meta.title}" by ${meta.publisher} (${meta.datePublished}, Tier ${meta.evidenceTier})
URL: ${meta.url}
Existing excerpt: "${meta.excerpt || "none"}"

--- SOURCE TEXT ---

${truncated}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: EXTRACTION_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text in Claude response");
  }

  let jsonStr = textBlock.text.trim();
  if (jsonStr.includes("```")) {
    const match = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (match) jsonStr = match[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  return {
    id: sourceId,
    abstract: parsed.abstract || "",
    keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
    methodology: parsed.methodology || "Not specified",
    qualifiers: parsed.qualifiers || "None stated",
    fetchedAt: new Date().toISOString().split("T")[0],
  };
}

/**
 * Write a source content entry to the content store.
 */
export function writeSourceContentEntry(entry: SourceContentEntry): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  const filePath = path.join(CONTENT_DIR, `${entry.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2) + "\n");
}

/**
 * Check if a source already has content stored.
 */
export function hasSourceContent(sourceId: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${sourceId}.json`));
}
