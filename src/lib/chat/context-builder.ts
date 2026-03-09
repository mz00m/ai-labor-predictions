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
  "job loss": ["overall-us-displacement", "total-us-jobs-lost"],
  displacement: ["overall-us-displacement", "total-us-jobs-lost"],
  "job market": ["overall-us-displacement", "total-us-jobs-lost"],
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
  geographic: ["geographic-wage-divergence"],
  "tech hub": ["geographic-wage-divergence"],
  "san francisco": ["geographic-wage-divergence"],
  remote: ["geographic-wage-divergence"],
  freelance: ["freelancer-rate-impact"],
  gig: ["freelancer-rate-impact"],
  contractor: ["freelancer-rate-impact"],

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
      const excerpt = s.excerpt ? ` — "${s.excerpt}"` : "";
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
  sections.push(`You are the research assistant for jobsdata.ai, a dashboard tracking AI's impact on the labor market.
The site synthesizes 300+ sources from peer-reviewed research, government data, corporate filings, and journalism into 17 interactive prediction graphs across 5 categories: displacement, wages, adoption, signals, and exposure.
Data last updated: ${lastUpdated}.

Evidence tier system:
- Tier 1: Verified Data & Research (peer-reviewed journals, government stats, RCTs) — weight 4x
- Tier 2: Institutional Analysis (think tanks, intl orgs, industry research) — weight 2x
- Tier 3: Journalism & Commentary (major publications) — weight 1x
- Tier 4: Informal & Social (blogs, social media) — weight 0.5x

Your role:
- Answer questions about AI's impact on jobs, wages, and adoption using ONLY the data provided below
- Always cite specific sources by name and tier when making claims
- Distinguish clearly between observed data and projections
- If the data doesn't cover a topic, say so — do not speculate
- Be concise and practitioner-focused — no hype, no doom
- Use precise numbers from the data points when available
- When discussing ranges, mention confidence intervals if available
- You can answer questions about the site's methodology, the J-curve framework, historical technology parallels, and leading indicators
- When users ask about the site itself, use the site content sections below`);

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
