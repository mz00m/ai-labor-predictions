/**
 * LLM-powered data point extraction for weekly digests.
 * Analyzes digest papers using Claude Haiku to extract specific
 * quantitative claims and suggest structured data points.
 *
 * Fully optional — returns [] if ANTHROPIC_API_KEY is not set.
 */

import Anthropic from "@anthropic-ai/sdk";
import { Prediction } from "../types";
import { DigestPaper, SuggestedDataPoint } from "../types/digest";

// Read lazily so .env loading in generate-digest.ts has time to run
function getApiKey(): string {
  return process.env.ANTHROPIC_API_KEY || "";
}

function buildPredictionContext(predictions: Prediction[]): string {
  return predictions
    .map(
      (p) =>
        `- slug: "${p.slug}" | title: "${p.title}" | unit: "${p.unit}" | current: ${p.currentValue} | horizon: "${p.timeHorizon}"`
    )
    .join("\n");
}

function buildPapersContext(papers: DigestPaper[]): string {
  return papers
    .map(
      (p, i) =>
        `[${i + 1}] id="${p.id}" | source=${p.source} | tier=${p.classifiedTier} | url=${p.url}
Title: ${p.title}
Abstract: ${(p.abstract || "").slice(0, 400)}
Linked predictions: ${p.linkedPredictions.map((lp) => lp.slug).join(", ")}`
    )
    .join("\n\n");
}

const SYSTEM_PROMPT = `You are a research analyst extracting quantitative data points from research findings about AI's impact on the labor market.

Your task: Read each paper/post and extract SPECIFIC quantitative claims that can become data points for the tracked predictions.

Rules:
- Only extract claims with EXPLICIT numbers (percentages, dollar amounts, job counts, etc.)
- Do not infer, estimate, or calculate values not directly stated
- If a post discusses a topic qualitatively without numbers, skip it entirely
- Match each data point to the most relevant prediction slug
- Use the prediction's unit format (e.g., if unit is "% of US jobs", the value should be a percentage)
- The date should be when the finding was published or the date of the data
- Set confidence to "high" if the claim comes from a named institution/study with a clear number, "medium" if the number is from a less formal source or context is ambiguous, "low" if the number is approximate or the mapping to the prediction is uncertain
- Generate a kebab-case sourceId from the source name and year (e.g., "mckinsey-ai-workforce-2026")

Return a JSON array of objects. If no quantitative data points are found, return an empty array [].

Each object must have exactly these fields:
{
  "predictionSlug": string,
  "predictionTitle": string,
  "date": "YYYY-MM-DD",
  "value": number,
  "confidenceLow": number | null,
  "confidenceHigh": number | null,
  "unit": string,
  "sourceId": string,
  "sourceTitle": string,
  "sourceUrl": string,
  "evidenceTier": 1 | 2 | 3 | 4,
  "excerpt": string (the specific sentence/claim with the number),
  "digestPaperId": string,
  "confidence": "high" | "medium" | "low"
}`;

const FEW_SHOT_EXAMPLE = `Example input:
[1] id="reddit-abc123" | source=reddit | tier=4 | url=https://reddit.com/r/economics/...
Title: Goldman Sachs report says AI will displace 8% of financial services jobs by 2028
Abstract: New Goldman Sachs research note released today projects that AI automation will displace approximately 8% of financial services jobs by 2028, with a range of 5-12%...
Linked predictions: white-collar-professional-displacement

Example output:
[
  {
    "predictionSlug": "white-collar-professional-displacement",
    "predictionTitle": "White-Collar Professional Displacement",
    "date": "2026-03-01",
    "value": 8,
    "confidenceLow": 5,
    "confidenceHigh": 12,
    "unit": "% of sector jobs",
    "sourceId": "goldman-sachs-financial-ai-2026",
    "sourceTitle": "Goldman Sachs report says AI will displace 8% of financial services jobs by 2028",
    "sourceUrl": "https://reddit.com/r/economics/...",
    "evidenceTier": 4,
    "excerpt": "AI automation will displace approximately 8% of financial services jobs by 2028, with a range of 5-12%",
    "digestPaperId": "reddit-abc123",
    "confidence": "medium"
  }
]`;

export async function analyzeSuggestedDataPoints(
  papers: DigestPaper[],
  predictions: Prediction[]
): Promise<SuggestedDataPoint[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log("ANTHROPIC_API_KEY not set — skipping LLM analysis");
    return [];
  }

  // Only analyze papers that have linked predictions
  const linkedPapers = papers.filter((p) => p.linkedPredictions.length > 0);
  if (linkedPapers.length === 0) {
    console.log("No papers with linked predictions — skipping LLM analysis");
    return [];
  }

  console.log(`Analyzing ${linkedPapers.length} papers with LLM for data point extraction...`);

  const predictionContext = buildPredictionContext(predictions);
  const papersContext = buildPapersContext(linkedPapers);

  const userPrompt = `Here are the tracked predictions:

${predictionContext}

Here are the research papers/posts to analyze:

${papersContext}

${FEW_SHOT_EXAMPLE}

Now analyze all the papers above and extract any quantitative data points. Return ONLY a JSON array.`;

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [
        { role: "user", content: userPrompt },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract text from response
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      console.error("No text in LLM response");
      return [];
    }

    // Parse JSON from response — handle code blocks, preamble text, etc.
    let jsonStr = textBlock.text.trim();

    // Strip markdown code blocks
    if (jsonStr.includes("```")) {
      const match = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
      if (match) jsonStr = match[1].trim();
    }

    // If there's text before the array, extract just the JSON array
    const arrayStart = jsonStr.indexOf("[");
    const arrayEnd = jsonStr.lastIndexOf("]");
    if (arrayStart >= 0 && arrayEnd > arrayStart) {
      jsonStr = jsonStr.slice(arrayStart, arrayEnd + 1);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse LLM response as JSON");
      return [];
    }

    if (!Array.isArray(parsed)) {
      console.error("LLM response is not an array");
      return [];
    }

    // Validate and clean each data point
    const validSlugs = new Set(predictions.map((p) => p.slug));
    const validated: SuggestedDataPoint[] = [];

    for (const dp of parsed) {
      if (
        typeof dp.predictionSlug === "string" &&
        validSlugs.has(dp.predictionSlug) &&
        typeof dp.value === "number" &&
        typeof dp.date === "string" &&
        typeof dp.sourceUrl === "string"
      ) {
        validated.push({
          predictionSlug: dp.predictionSlug,
          predictionTitle: dp.predictionTitle || "",
          date: dp.date,
          value: dp.value,
          confidenceLow: typeof dp.confidenceLow === "number" ? dp.confidenceLow : undefined,
          confidenceHigh: typeof dp.confidenceHigh === "number" ? dp.confidenceHigh : undefined,
          unit: dp.unit || "",
          sourceId: dp.sourceId || "",
          sourceTitle: dp.sourceTitle || "",
          sourceUrl: dp.sourceUrl,
          evidenceTier: [1, 2, 3, 4].includes(dp.evidenceTier) ? dp.evidenceTier : 4,
          excerpt: dp.excerpt || "",
          digestPaperId: dp.digestPaperId || "",
          confidence: ["high", "medium", "low"].includes(dp.confidence) ? dp.confidence : "low",
        });
      }
    }

    console.log(`LLM extracted ${validated.length} suggested data points`);
    return validated;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`LLM analysis failed: ${msg}`);
    return [];
  }
}
