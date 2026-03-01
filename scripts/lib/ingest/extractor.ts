import Anthropic from "@anthropic-ai/sdk";
import type {
  SourceContent,
  SourceOverrides,
  ExtractionResult,
  ExtractedStat,
  SourceMetadata,
  GraphInfo,
} from "./types";
import type { EvidenceTier } from "../../../src/lib/types";

const SYSTEM_PROMPT = `You are a precision research data extraction assistant for an AI labor market prediction tracker. Your job is to extract ALL quantitative statistics from a source that relate to AI's impact on the labor market, and map each to the correct prediction graph.

## RULES — follow these exactly

1. **EXACT QUOTES ONLY**: Every statistic MUST include the exact verbatim text from the source. Copy the relevant sentence(s) character-for-character. Never paraphrase, summarize, or synthesize.

2. **RANGES → MIDPOINTS**: When the source states a range (e.g., "20-30%"):
   - value = the midpoint (e.g., 25)
   - is_range = true
   - range_low = lower bound (e.g., 20)
   - range_high = upper bound (e.g., 30)

3. **SINGLE VALUES**: When the source gives a single number (e.g., "25% of jobs"):
   - value = that number (25)
   - is_range = false

4. **DATA POINTS vs OVERLAYS**:
   - **data_point**: The statistic can be plotted numerically — its unit aligns with the graph's unit (e.g., "25% of CS interactions" on a graph measuring "% of interactions automated")
   - **overlay**: The statistic provides directional evidence but uses a different metric or is qualitative (e.g., "$80B cost savings" on a "% of interactions" graph)
   - When units don't clearly align, default to overlay
   - Only use data_point when the units clearly match

5. **GRAPH MATCHING**: Map each statistic to the single most appropriate graph based on:
   - Unit compatibility (highest priority)
   - Topic alignment (secondary)
   - If a statistic truly doesn't fit any graph, use the closest match and explain in plottability_reason

6. **NEVER INVENT DATA**: Only extract statistics explicitly stated in the text. Never calculate, derive, or infer values not present in the source.

7. **DEDUPLICATION**: If the same statistic appears multiple times (e.g., abstract and body), extract it only once.

8. **NEGATIVE VALUES**: For wage declines or losses, use negative values (e.g., -10 for "10% wage decline"). Match the sign convention of the graph's current data.

9. **DIRECTION (for overlays)**: Indicate whether the evidence suggests the tracked metric will go:
   - "up" = the metric value will increase
   - "down" = the metric value will decrease
   - "neutral" = ambiguous or no clear direction

10. **CONTEXT LABELS**: For overlays, write a short label in the format "Publisher: key finding" (e.g., "Gartner: 25% of CS agents replaced by 2026"). Max ~80 characters.

## EVIDENCE TIER CLASSIFICATION

Classify the overall source (not individual stats) into one tier:

- **Tier 1 (Verified Data & Research)**: Peer-reviewed journals (AER, QJE, Science, Nature), NBER/CEPR working papers, government statistics (BLS, Census, OECD data tables), SEC filings (10-K/10-Q), earnings transcripts with disclosed data, randomized controlled trials

- **Tier 2 (Institutional Analysis)**: Think tanks (Brookings, McKinsey, RAND), international organizations (IMF, World Bank, ILO), industry research firms (Gartner, Forrester, Deloitte, Cognizant), prediction markets, corporate research reports

- **Tier 3 (Journalism & Commentary)**: Major news outlets (NYT, WSJ, FT, Reuters, Bloomberg), trade publications (TechCrunch, The Information, CNBC), expert op-eds, Fortune, long-form investigative journalism

- **Tier 4 (Informal & Social)**: Twitter/X, Reddit, blogs, Substack newsletters, podcasts, YouTube commentary

Be precise and conservative. Prefer higher-quality classification — only Tier 1 if it's truly peer-reviewed or government data.`;

const EXTRACTION_TOOL: Anthropic.Tool = {
  name: "report_extraction",
  description:
    "Report all extracted statistics and source metadata from the analyzed source text.",
  input_schema: {
    type: "object" as const,
    required: ["source_metadata", "statistics"],
    properties: {
      source_metadata: {
        type: "object",
        description:
          "Metadata about the source document. Auto-detect from the text, URL, and page title.",
        required: ["title", "publisher", "date_published", "evidence_tier"],
        properties: {
          title: {
            type: "string",
            description: "Full title of the source document",
          },
          publisher: {
            type: "string",
            description:
              "Publishing organization, journal, or outlet (e.g., 'Gartner', 'NBER', 'The Wall Street Journal')",
          },
          date_published: {
            type: "string",
            description:
              "Publication date in YYYY-MM-DD format. Use best estimate if exact date unknown (e.g., first of month).",
          },
          evidence_tier: {
            type: "number",
            enum: [1, 2, 3, 4],
            description: "Evidence quality tier (1 = highest, 4 = lowest)",
          },
        },
      },
      statistics: {
        type: "array",
        description:
          "All quantitative statistics extracted from the source, each mapped to a prediction graph.",
        items: {
          type: "object",
          required: [
            "exact_quote",
            "value",
            "is_range",
            "unit",
            "time_horizon",
            "target_graph_slug",
            "data_type",
            "plottability_reason",
          ],
          properties: {
            exact_quote: {
              type: "string",
              description:
                "Exact verbatim quote from the source containing this statistic. Must be copy-pasted from the text.",
            },
            value: {
              type: "number",
              description:
                "The numeric value to plot. For ranges, this is the midpoint.",
            },
            is_range: {
              type: "boolean",
              description: "True if the source states a range (e.g., 20-30%)",
            },
            range_low: {
              type: "number",
              description:
                "Lower bound of the range (only if is_range is true)",
            },
            range_high: {
              type: "number",
              description:
                "Upper bound of the range (only if is_range is true)",
            },
            unit: {
              type: "string",
              description:
                "The unit of this statistic (e.g., '% of jobs displaced', '% wage change')",
            },
            time_horizon: {
              type: "string",
              description:
                "When this applies (e.g., 'by 2026', 'current', 'Q3 2025')",
            },
            target_graph_slug: {
              type: "string",
              description:
                "The slug of the most appropriate prediction graph from the provided list",
            },
            data_type: {
              type: "string",
              enum: ["data_point", "overlay"],
              description:
                "Whether this should be plotted as a numeric data point or shown as a directional overlay",
            },
            direction: {
              type: "string",
              enum: ["up", "down", "neutral"],
              description:
                "For overlays: does this evidence suggest the metric goes up, down, or neutral?",
            },
            context_label: {
              type: "string",
              description:
                "For overlays: short label in format 'Publisher: key finding' (max ~80 chars)",
            },
            plottability_reason: {
              type: "string",
              description:
                "Brief explanation of why this is classified as data_point or overlay",
            },
          },
        },
      },
    },
  },
};

/**
 * Extract statistics from source content using the Claude API.
 *
 * Sends the source text + graph metadata to Claude, which returns
 * structured extraction results via tool use.
 */
export async function extractStatistics(
  content: SourceContent,
  graphs: GraphInfo[],
  overrides?: SourceOverrides,
  model?: string,
  verbose?: boolean
): Promise<ExtractionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is required. Set it in .env or export ANTHROPIC_API_KEY=sk-ant-..."
    );
  }

  const client = new Anthropic({ apiKey });

  // Build graph descriptions for the prompt
  const graphList = graphs
    .map(
      (g) =>
        `  - slug: "${g.slug}"\n    title: "${g.title}"\n    unit: "${g.unit}"\n    category: ${g.category}\n    current value: ${g.currentValue}\n    horizon: ${g.timeHorizon}\n    description: ${g.description}`
    )
    .join("\n\n");

  // Build override hints
  const overrideLines: string[] = [];
  if (overrides?.title) overrideLines.push(`  Title: ${overrides.title}`);
  if (overrides?.publisher)
    overrideLines.push(`  Publisher: ${overrides.publisher}`);
  if (overrides?.datePublished)
    overrideLines.push(`  Date: ${overrides.datePublished}`);
  if (overrides?.evidenceTier)
    overrideLines.push(`  Tier: ${overrides.evidenceTier}`);

  const overrideBlock =
    overrideLines.length > 0
      ? `\n\nUser-provided metadata (use these values — they take priority over auto-detection):\n${overrideLines.join("\n")}`
      : "";

  // Truncate source text to stay within context limits (~100K chars is safe for Sonnet)
  const maxChars = 80000;
  const sourceText =
    content.text.length > maxChars
      ? content.text.slice(0, maxChars) + "\n\n[... content truncated ...]"
      : content.text;

  const userMessage = [
    `## Available Prediction Graphs\n\n${graphList}`,
    overrideBlock,
    `\n\n## Source Content${content.url ? ` (URL: ${content.url})` : ""}${content.title ? `\nPage title: ${content.title}` : ""}\n\n---\n\n${sourceText}`,
  ].join("");

  if (verbose) {
    console.log(
      `  Sending ${userMessage.length} chars to Claude (model: ${model || "claude-sonnet-4-20250514"})...`
    );
  }

  const response = await client.messages.create({
    model: model || "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    tools: [EXTRACTION_TOOL],
    tool_choice: { type: "tool", name: "report_extraction" },
    messages: [{ role: "user", content: userMessage }],
  });

  // Extract the tool use result
  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error(
      "Claude did not return structured extraction results. The source may not contain extractable statistics."
    );
  }

  const result = toolUse.input as {
    source_metadata: {
      title: string;
      publisher: string;
      date_published: string;
      evidence_tier: number;
    };
    statistics: Array<{
      exact_quote: string;
      value: number;
      is_range: boolean;
      range_low?: number;
      range_high?: number;
      unit: string;
      time_horizon: string;
      target_graph_slug: string;
      data_type: "data_point" | "overlay";
      direction?: "up" | "down" | "neutral";
      context_label?: string;
      plottability_reason: string;
    }>;
  };

  if (verbose) {
    console.log(
      `  Claude extracted ${result.statistics.length} statistics, classified as tier ${result.source_metadata.evidence_tier}`
    );
    console.log(
      `  Token usage: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`
    );
  }

  // Apply overrides
  const metadata: SourceMetadata = {
    title: overrides?.title || result.source_metadata.title,
    publisher: overrides?.publisher || result.source_metadata.publisher,
    datePublished:
      overrides?.datePublished || result.source_metadata.date_published,
    evidenceTier: (overrides?.evidenceTier ||
      result.source_metadata.evidence_tier) as EvidenceTier,
    url: overrides?.url || content.url || "",
  };

  // Convert to internal types
  const statistics: ExtractedStat[] = (result.statistics || []).map((s) => ({
    exactQuote: s.exact_quote,
    value: s.value,
    isRange: s.is_range,
    rangeLow: s.range_low,
    rangeHigh: s.range_high,
    unit: s.unit,
    timeHorizon: s.time_horizon,
    targetGraphSlug: s.target_graph_slug,
    dataType: s.data_type,
    direction: s.direction,
    contextLabel: s.context_label,
    plottabilityReason: s.plottability_reason,
  }));

  // Validate: ensure all target slugs match known graphs
  const knownSlugs = new Set(graphs.map((g) => g.slug));
  for (const stat of statistics) {
    if (!knownSlugs.has(stat.targetGraphSlug)) {
      console.warn(
        `  Warning: statistic mapped to unknown graph "${stat.targetGraphSlug}". Closest matches:`
      );
      const close = graphs
        .map((g) => ({
          slug: g.slug,
          score: slugSimilarity(stat.targetGraphSlug, g.slug),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      for (const c of close) {
        console.warn(`    - ${c.slug} (similarity: ${c.score})`);
      }
    }
  }

  return { sourceMetadata: metadata, statistics };
}

/** Simple slug similarity for typo detection */
function slugSimilarity(a: string, b: string): number {
  const aSet = new Set(a.split("-"));
  const bSet = new Set(b.split("-"));
  let overlap = 0;
  for (const word of Array.from(aSet)) {
    if (bSet.has(word)) overlap++;
  }
  return overlap / Math.max(aSet.size, bSet.size);
}
