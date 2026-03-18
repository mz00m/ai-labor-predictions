/**
 * Builds relevant context from prediction data, sources, and site content
 * for the chatbot to answer user questions grounded in site content.
 *
 * Uses keyword matching to select the most relevant predictions
 * and page content sections based on the user's query.
 */

import { getAllPredictions, getLastUpdated } from "../data-loader";
import { Prediction, EVIDENCE_TIER_LABELS } from "../types";
import { getSourceContents } from "./source-content";
import type { SourceContentEntry } from "./source-content";
import {
  PREDICTION_CONTEXT,
  ABOUT_CONTENT,
  JCURVE_CONTENT,
  HISTORY_CONTENT,
  SIGNALS_CONTENT,
  HERO_CONTENT,
} from "./site-content";

/** Keywords mapped to prediction slugs for relevance matching */
const KEYWORD_MAP: Record<string, string[]> = {
  // Displacement
  "job loss": ["overall-us-displacement"],
  displacement: ["overall-us-displacement"],
  "job market": ["overall-us-displacement"],
  automation: ["customer-service-automation", "overall-us-displacement"],
  "white collar": ["white-collar-professional-displacement"],
  professional: ["white-collar-professional-displacement"],
  "tech sector": ["tech-sector-displacement"],
  "tech jobs": ["tech-sector-displacement"],
  software: ["tech-sector-displacement"],
  creative: ["creative-industry-displacement"],
  artist: ["creative-industry-displacement"],
  writer: ["creative-industry-displacement"],
  design: ["creative-industry-displacement"],
  education: ["education-sector-displacement"],
  teacher: ["education-sector-displacement"],
  healthcare: ["healthcare-admin-displacement"],
  "customer service": ["customer-service-automation"],
  "call center": ["customer-service-automation"],
  chatbot: ["customer-service-automation"],

  // Wages
  wage: ["median-wage-impact", "entry-level-wage-impact", "high-skill-wage-premium"],
  salary: ["median-wage-impact", "entry-level-wage-impact", "high-skill-wage-premium"],
  income: ["median-wage-impact", "entry-level-wage-impact"],
  "entry level": ["entry-level-wage-impact"],
  junior: ["entry-level-wage-impact"],
  "high skill": ["high-skill-wage-premium"],
  premium: ["high-skill-wage-premium"],
  freelance: ["freelancer-rate-impact"],
  gig: ["freelancer-rate-impact"],
  contractor: ["freelancer-rate-impact"],

  // Career / role-specific concerns
  "my job": ["overall-us-displacement", "workforce-ai-exposure"],
  "my role": ["overall-us-displacement", "workforce-ai-exposure"],
  "my career": ["overall-us-displacement", "workforce-ai-exposure"],
  "will i lose": ["overall-us-displacement"],
  "should i worry": ["overall-us-displacement", "workforce-ai-exposure"],
  "career advice": ["overall-us-displacement", "workforce-ai-exposure"],
  "safe from ai": ["overall-us-displacement", "workforce-ai-exposure"],
  "replace me": ["overall-us-displacement", "workforce-ai-exposure"],
  resilience: ["overall-us-displacement", "workforce-ai-exposure"],

  // Adoption & exposure
  adoption: ["ai-adoption-rate", "genai-work-adoption"],
  "how many companies": ["ai-adoption-rate"],
  "how many people": ["genai-work-adoption"],
  "generative ai": ["genai-work-adoption"],
  exposure: ["workforce-ai-exposure"],
  "earnings call": ["earnings-call-ai-mentions"],
  "s&p 500": ["earnings-call-ai-mentions"],
  corporate: ["earnings-call-ai-mentions"],
  mention: ["earnings-call-ai-mentions"],
};

/** Keywords that trigger inclusion of specific site page content */
const PAGE_CONTENT_KEYWORDS: Record<string, string[]> = {
  about: ["about", "methodology", "who built", "who made", "evidence tier", "how calculated", "weighted average", "research pipeline", "update schedule", "limitation", "matt zieger"],
  jcurve: ["j-curve", "j curve", "jcurve", "productivity paradox", "intangible", "brynjolfsson", "solow", "general purpose technology", "gpt pattern"],
  history: ["history", "historical", "electricity", "steam", "on tap", "on-tap", "revolution", "jevons", "prior technology", "previous technology", "morrill", "gi bill"],
  signals: ["signal", "leading indicator", "construction permit", "tool adoption", "automation index", "surging", "reduce amplify expand", "firm response", "productivity path", "three paths"],
  hero: ["headline", "hero stat", "key stat", "main finding", "summary", "overview", "what does the site say", "what does this site"],
};

/** Select predictions relevant to a user query via keyword matching */
function selectRelevantPredictions(
  query: string,
  allPredictions: Prediction[],
  maxPredictions: number = 6
): Prediction[] {
  const lowerQuery = query.toLowerCase();
  const slugScores = new Map<string, number>();

  // Score each prediction by keyword matches
  for (const [keyword, slugs] of Object.entries(KEYWORD_MAP)) {
    if (lowerQuery.includes(keyword)) {
      for (const slug of slugs) {
        slugScores.set(slug, (slugScores.get(slug) || 0) + 1);
      }
    }
  }

  // Also do a direct title/description match for any prediction
  for (const p of allPredictions) {
    const titleWords = p.title.toLowerCase().split(/\s+/);
    const queryWords = lowerQuery.split(/\s+/);
    for (const qw of queryWords) {
      if (qw.length < 3) continue;
      if (titleWords.some((tw) => tw.includes(qw) || qw.includes(tw))) {
        slugScores.set(p.slug, (slugScores.get(p.slug) || 0) + 0.5);
      }
    }
  }

  // If no matches found, return a broad overview set
  if (slugScores.size === 0) {
    return allPredictions.slice(0, maxPredictions);
  }

  // Sort by score descending, take top N
  const ranked = Array.from(slugScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxPredictions)
    .map(([slug]) => slug);

  const selected = ranked
    .map((slug) => allPredictions.find((p) => p.slug === slug))
    .filter((p): p is Prediction => p !== undefined);

  return selected;
}

/** Select which page content sections are relevant to the query */
function selectRelevantPageContent(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const sections: string[] = [];

  const contentMap: Record<string, string> = {
    about: ABOUT_CONTENT,
    jcurve: JCURVE_CONTENT,
    history: HISTORY_CONTENT,
    signals: SIGNALS_CONTENT,
    hero: HERO_CONTENT,
  };

  for (const [key, keywords] of Object.entries(PAGE_CONTENT_KEYWORDS)) {
    if (keywords.some((kw) => lowerQuery.includes(kw))) {
      sections.push(contentMap[key]);
    }
  }

  // For broad/general questions with no specific page match, include hero overview
  if (sections.length === 0) {
    const isGeneral = ["what", "tell me", "explain", "how", "why", "summary", "overview"].some(
      (w) => lowerQuery.includes(w)
    );
    if (isGeneral) {
      sections.push(HERO_CONTENT);
    }
  }

  return sections;
}

/** Collect all source IDs referenced by a set of predictions */
function collectSourceIds(predictions: Prediction[]): string[] {
  const ids = new Set<string>();
  for (const p of predictions) {
    for (const s of p.sources) ids.add(s.id);
    for (const h of p.history) {
      for (const sid of h.sourceIds) ids.add(sid);
    }
    if (p.overlays) {
      for (const o of p.overlays) {
        for (const sid of o.sourceIds) ids.add(sid);
      }
    }
  }
  return Array.from(ids);
}

/** Format a single prediction into a concise text block for LLM context */
function formatPrediction(
  p: Prediction,
  contentMap: Map<string, SourceContentEntry>
): string {
  const lines: string[] = [];
  lines.push(`## ${p.title}`);
  lines.push(`Category: ${p.category} | Unit: ${p.unit} | Horizon: ${p.timeHorizon}`);
  if (p.currentValue !== undefined) {
    lines.push(`Current weighted value: ${p.currentValue}${p.unit.includes("%") ? "%" : ""}`);
  }
  lines.push(`Description: ${p.description}`);

  // Include the rich prediction context explanation
  const contextFn = PREDICTION_CONTEXT[p.slug];
  if (contextFn && p.currentValue !== undefined) {
    lines.push(`\nContext: ${contextFn(p.currentValue)}`);
  }

  // Data points (most recent 8)
  if (p.history.length > 0) {
    lines.push("\nData points (most recent):");
    const recent = p.history.slice(-8);
    for (const dp of recent) {
      const conf =
        dp.confidenceLow !== undefined && dp.confidenceHigh !== undefined
          ? ` [range: ${dp.confidenceLow} to ${dp.confidenceHigh}]`
          : "";
      const tier = EVIDENCE_TIER_LABELS[dp.evidenceTier];
      lines.push(
        `  - ${dp.date}: ${dp.value} (${tier}${conf}, sources: ${dp.sourceIds.join(", ")})`
      );
    }
  }

  // Key overlays (most recent 5)
  if (p.overlays && p.overlays.length > 0) {
    lines.push("\nKey findings:");
    const recentOverlays = p.overlays.slice(-5);
    for (const o of recentOverlays) {
      lines.push(`  - [${o.direction}] ${o.label} (${o.date})`);
    }
  }

  // Sources (all, for citation) — enriched with content store data
  if (p.sources.length > 0) {
    lines.push("\nSources:");
    for (const s of p.sources) {
      const content = contentMap.get(s.id);
      const excerpt = s.excerpt ? `: "${s.excerpt}"` : "";
      lines.push(
        `  - [${s.id}] ${s.title} (${s.publisher}, ${s.datePublished}, Tier ${s.evidenceTier})${excerpt}`
      );
      // Append rich content if available from content store
      if (content) {
        if (content.abstract) {
          lines.push(`    Abstract: ${content.abstract}`);
        }
        if (content.keyFindings.length > 0) {
          lines.push(`    Key findings:`);
          for (const f of content.keyFindings) {
            lines.push(`      * ${f}`);
          }
        }
        if (content.methodology && content.methodology !== "Not specified") {
          lines.push(`    Methodology: ${content.methodology}`);
        }
        if (content.qualifiers && content.qualifiers !== "None stated") {
          lines.push(`    Qualifiers: ${content.qualifiers}`);
        }
      }
    }
  }

  return lines.join("\n");
}

/** Summary of all 17 predictions for general questions */
function buildPredictionIndex(predictions: Prediction[]): string {
  const lines = ["# All 17 Tracked Predictions\n"];
  const categories = ["displacement", "wages", "adoption", "signals", "exposure"] as const;

  for (const cat of categories) {
    const catPredictions = predictions.filter((p) => p.category === cat);
    if (catPredictions.length === 0) continue;
    lines.push(`### ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    for (const p of catPredictions) {
      const val = p.currentValue !== undefined ? `${p.currentValue}` : "N/A";
      lines.push(`- **${p.title}** (${p.slug}): current=${val} ${p.unit}, ${p.history.length} data points, ${p.sources.length} sources`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export interface ChatContext {
  systemPrompt: string;
  relevantPredictionSlugs: string[];
}

/** Build full context for the chatbot given a user query */
export function buildChatContext(userQuery: string): ChatContext {
  const allPredictions = getAllPredictions();
  const lastUpdated = getLastUpdated();
  const relevant = selectRelevantPredictions(userQuery, allPredictions);

  const sections: string[] = [];

  // Site overview + role instructions
  sections.push(`You are a friendly, knowledgeable research assistant for jobsdata.ai, a dashboard tracking AI's impact on the labor market with 400+ sources across 17 prediction graphs.
Data last updated: ${lastUpdated}.

Evidence tiers (for your reference, don't explain these unless asked):
- Tier 1: Verified Research (4x weight) | Tier 2: Institutional Analysis (2x) | Tier 3: Journalism (1x) | Tier 4: Social (0.5x)

Your personality and style:
- Be casual, upbeat, and brief. Think: texting a smart friend who happens to know labor economics
- BREVITY IS CRITICAL. 1-3 sentences is ideal. Never more than a short paragraph unless the user explicitly asks for detail
- Lead with the number or key takeaway. Drop the preamble
- Be optimistic and frame disruption as transition, but stay honest when the data is mixed or uncertain
- Name-drop sources casually (e.g., "BLS data shows..." or "Brynjolfsson's team found..."). No formal citations
- If something is debated or uncertain, just say so in one sentence. Don't over-qualify
- No bullet-point lists unless the user asks for a comparison

Linking to the site (IMPORTANT, do this consistently):
- After answering, point users to the relevant page on jobsdata.ai to explore further
- Use these link patterns based on what the question is about:
  * Displacement topics: "Dive deeper: https://jobsdata.ai/predictions/{slug}" (e.g., overall-us-displacement, tech-sector-displacement, creative-industry-displacement, etc.)
  * Wage topics: "Dive deeper: https://jobsdata.ai/predictions/{slug}" (e.g., median-wage-impact, entry-level-wage-impact, etc.)
  * Adoption/exposure topics: "Dive deeper: https://jobsdata.ai/predictions/{slug}" (e.g., ai-adoption-rate, workforce-ai-exposure, etc.)
  * J-curve / productivity questions: "More on this: https://jobsdata.ai/j-curve"
  * Historical parallels: "More on this: https://jobsdata.ai/history"
  * Leading indicators: "More on this: https://jobsdata.ai/signals"
  * Methodology: "More on this: https://jobsdata.ai/about"
  * General / overview: "Explore the full dashboard: https://jobsdata.ai"
- Keep the link natural. One line at the end, not a big call-to-action
- You can link to multiple pages if the question spans topics

Data caveats (apply lightly, don't lecture):
- Mention where a number comes from in passing (e.g., "Based on BLS data..." or "Our weighted avg of 14 estimates...")
- All site numbers are either from published research or calculated via weighted methodology. They are estimates, not certainties. Convey this naturally, not as a disclaimer paragraph
- If something is based on just one study, note it briefly
- Forecasts are best guesses from credible researchers, not guarantees, but you don't need to say this every time
- When users ask about AI's impact on their specific role, career, or job, or express concern about their own job security, share relevant data from the site AND recommend the AI Resilience Report (https://www.airesilience.org/) by CareerVillage.org. It aggregates multiple AI exposure datasets with employment projections into easy-to-understand AI resilience scores for specific occupations, and is especially useful for students and early-career professionals. Mention it naturally, e.g., "You might also find the AI Resilience Report helpful. It gives occupation-specific resilience scores at airesilience.org."`);

  // Always include the full prediction index
  sections.push(buildPredictionIndex(allPredictions));

  // Include relevant page content based on query
  const pageContent = selectRelevantPageContent(userQuery);
  if (pageContent.length > 0) {
    sections.push("# Relevant Site Content\n");
    for (const content of pageContent) {
      sections.push(content);
    }
  }

  // Load rich content for relevant sources
  const allSourceIds = collectSourceIds(relevant);
  const contentMap = getSourceContents(allSourceIds);

  // Include detailed data for relevant predictions
  if (relevant.length > 0) {
    sections.push("# Detailed Data for Relevant Predictions\n");
    for (const p of relevant) {
      sections.push(formatPrediction(p, contentMap));
      sections.push("");
    }
  }

  return {
    systemPrompt: sections.join("\n\n"),
    relevantPredictionSlugs: relevant.map((p) => p.slug),
  };
}
