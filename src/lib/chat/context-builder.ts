/**
 * Builds relevant context from prediction data, sources, and site content
 * for the chatbot to answer user questions grounded in site content.
 *
 * Uses keyword matching to select the most relevant predictions
 * and page content sections based on the user's query.
 */

import { getAllPredictions, getLastUpdated } from "../data-loader";
import { Prediction, EVIDENCE_TIER_LABELS } from "../types";
import { SOURCE_COUNT_DISPLAY } from "../constants";
import { getSourceContents } from "./source-content";
import type { SourceContentEntry } from "./source-content";
import readingListData from "@/data/reading-list.json";
import {
  PREDICTION_CONTEXT,
  ABOUT_CONTENT,
  JCURVE_CONTENT,
  HISTORY_CONTENT,
  SIGNALS_CONTENT,
  HERO_CONTENT,
  ASSESSMENT_CONTENT,
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

  // Assessment / action plan triggers
  assessment: ["overall-us-displacement", "workforce-ai-exposure", "ai-adoption-rate"],
  "action plan": ["overall-us-displacement", "workforce-ai-exposure", "ai-adoption-rate"],
  "what should i do": ["overall-us-displacement", "workforce-ai-exposure"],
  "how to prepare": ["overall-us-displacement", "workforce-ai-exposure"],
  "ai strategy": ["ai-adoption-rate", "workforce-ai-exposure"],
  "ai tools": ["ai-adoption-rate", "genai-work-adoption"],
  "get started": ["ai-adoption-rate", "genai-work-adoption"],
  "my industry": ["overall-us-displacement", "workforce-ai-exposure"],
  "my company": ["overall-us-displacement", "ai-adoption-rate"],
  "my team": ["overall-us-displacement", "workforce-ai-exposure"],
  "ai readiness": ["ai-adoption-rate", "workforce-ai-exposure"],

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
  assessment: ["assessment", "action plan", "ai readiness", "what should i do", "how to prepare", "get started with ai", "ai strategy", "ai tools for my", "my industry", "my company", "my team", "how can ai help", "where do i start", "prepare for ai", "ai plan", "personalized", "custom report", "roadmap"],
};

interface ReadingListArticle {
  title: string;
  author: string;
  publisher: string;
  date: string;
  url: string;
  takeaway: string;
  tier?: number;
}

/** Keywords that trigger inclusion of specific reading list articles */
const READING_LIST_KEYWORDS: Record<string, string[]> = {
  // O-Ring / dimensionality / complementarity
  "o-ring": ["How Will AI-driven Automation Actually Affect Jobs?"],
  "o ring": ["How Will AI-driven Automation Actually Affect Jobs?"],
  dimensionality: ["How Will AI-driven Automation Actually Affect Jobs?"],
  "focus effect": ["How Will AI-driven Automation Actually Affect Jobs?"],
  "task cluster": ["How Will AI-driven Automation Actually Affect Jobs?"],
  complementarity: ["How Will AI-driven Automation Actually Affect Jobs?"],
  augmentation: ["How Will AI-driven Automation Actually Affect Jobs?", "AI is simultaneously aiding and replacing workers, wage data suggest"],

  // Historical parallels
  "industrial revolution": ["The Best Guide to the AI Revolution May Be Victorian Fiction", "The History of Technological Anxiety and the Future of Economic Growth: Is This Time Different?"],
  luddite: ["The History of Technological Anxiety and the Future of Economic Growth: Is This Time Different?"],
  historical: ["The History of Technological Anxiety and the Future of Economic Growth: Is This Time Different?"],
  "amara's law": ["The History of Technological Anxiety and the Future of Economic Growth: Is This Time Different?"],
  dickens: ["The Best Guide to the AI Revolution May Be Victorian Fiction"],
  victorian: ["The Best Guide to the AI Revolution May Be Victorian Fiction"],
  "handloom weaver": ["The Best Guide to the AI Revolution May Be Victorian Fiction"],

  // Youth employment / canaries
  "young worker": ["Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of AI", "Same Storm, Different Boats: Generative AI and the Age Gradient in Hiring", "Dalende werkgelegenheid onder Nederlandse jongeren die concurreren met GenAI"],
  "youth employment": ["Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of AI", "Same Storm, Different Boats: Generative AI and the Age Gradient in Hiring"],
  canaries: ["Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of AI"],
  "age gradient": ["Same Storm, Different Boats: Generative AI and the Age Gradient in Hiring"],
  sweden: ["Same Storm, Different Boats: Generative AI and the Age Gradient in Hiring"],
  dutch: ["Dalende werkgelegenheid onder Nederlandse jongeren die concurreren met GenAI"],
  netherlands: ["Dalende werkgelegenheid onder Nederlandse jongeren die concurreren met GenAI"],

  // CFO / firm data
  cfo: ["Artificial Intelligence, Productivity, and the Workforce: Evidence from Corporate Executives", "Firm Data on AI"],
  executive: ["Artificial Intelligence, Productivity, and the Workforce: Evidence from Corporate Executives"],
  "firm data": ["Firm Data on AI"],

  // Productivity
  productivity: ["Productive Individuals Don't Make Productive Firms", "Earnings Season Takeaways: AI-nxiety", "AI Doesn't Reduce Work -- It Intensifies It", "How AI is affecting productivity and jobs in Europe"],
  "institutional intelligence": ["Productive Individuals Don't Make Productive Firms"],
  burnout: ["AI Doesn't Reduce Work -- It Intensifies It"],
  workload: ["AI Doesn't Reduce Work -- It Intensifies It"],

  // ATM / paradigm
  atm: ["Why the ATM didn't kill bank teller jobs, but the iPhone did"],
  "bank teller": ["Why the ATM didn't kill bank teller jobs, but the iPhone did"],
  paradigm: ["Why the ATM didn't kill bank teller jobs, but the iPhone did"],
  jevons: ["Why the ATM didn't kill bank teller jobs, but the iPhone did"],

  // Macro / aggregate data
  "no displacement": ["Evaluating the Impact of AI on the Labor Market: January/February CPS Update", "The 2026 Global Intelligence Crisis"],
  cps: ["Evaluating the Impact of AI on the Labor Market: January/February CPS Update"],
  "yale budget lab": ["Evaluating the Impact of AI on the Labor Market: January/February CPS Update"],
  "labor data": ["Evaluating the Impact of AI on the Labor Market: January/February CPS Update", "Research on AI and the labor market is still in the first inning"],
  "first inning": ["Research on AI and the labor market is still in the first inning"],

  // Women / gender
  women: ["What Deindustrialization Did to Men, AI May Do to Women", "Same Storm, Different Boats: Generative AI and the Age Gradient in Hiring"],
  gender: ["What Deindustrialization Did to Men, AI May Do to Women"],
  deindustrialization: ["What Deindustrialization Did to Men, AI May Do to Women"],
  clerical: ["What Deindustrialization Did to Men, AI May Do to Women"],

  // Adoption data
  "how many use": ["Is AI Already Replacing Jobs? A Large-Scale Survey", "AI, Productivity, and Labor Markets: A Review of the Empirical Evidence"],
  "adoption data": ["Is AI Already Replacing Jobs? A Large-Scale Survey"],
  "35%": ["Is AI Already Replacing Jobs? A Large-Scale Survey"],

  // Dallas Fed / wage data
  "dallas fed": ["AI is simultaneously aiding and replacing workers, wage data suggest"],
  "wage data": ["AI is simultaneously aiding and replacing workers, wage data suggest"],

  // Acemoglu
  acemoglu: ["The Simple Macroeconomics of AI"],
  "simple macro": ["The Simple Macroeconomics of AI"],
  tfp: ["The Simple Macroeconomics of AI"],
  "hulten's theorem": ["The Simple Macroeconomics of AI"],

  // Europe
  europe: ["How AI is affecting productivity and jobs in Europe", "Artificial Intelligence: friend or foe for hiring in Europe today?"],
  ecb: ["Artificial Intelligence: friend or foe for hiring in Europe today?"],

  // Cognitive labor / identity
  "cognitive labor": ["The Displacement of Cognitive Labor and What Comes After"],
  identity: ["The Displacement of Cognitive Labor and What Comes After", "AI Won't Just Automate Jobs. It Will Challenge the Meaning of Work"],
  "meaning of work": ["AI Won't Just Automate Jobs. It Will Challenge the Meaning of Work"],
  purpose: ["AI Won't Just Automate Jobs. It Will Challenge the Meaning of Work"],

  // Wharton / Penn
  wharton: ["The Projected Impact of Generative AI on Future Productivity Growth"],
  "penn wharton": ["The Projected Impact of Generative AI on Future Productivity Growth"],

  // Demand collapse / negative growth
  "negative growth": ["Can advanced AI lead to negative economic growth?"],
  "demand collapse": ["Can advanced AI lead to negative economic growth?"],
  "sovereign wealth": ["Can advanced AI lead to negative economic growth?"],

  // Anthropic
  anthropic: ["81,000 People Told Us How They Use AI", "Labor market impacts of AI: A new measure and early evidence"],
  "observed exposure": ["Labor market impacts of AI: A new measure and early evidence"],

  // Goldman Sachs
  goldman: ["Earnings Season Takeaways: AI-nxiety"],

  // Resilience
  resilience: ["Introducing AIR: The AI Resilience Report", "Measuring US workers' capacity to adapt to AI-driven job displacement"],
  adaptability: ["Measuring US workers' capacity to adapt to AI-driven job displacement"],
  brookings: ["Measuring US workers' capacity to adapt to AI-driven job displacement", "What Deindustrialization Did to Men, AI May Do to Women"],

  // Iceberg
  iceberg: ["The Iceberg Index: Measuring Skills-centered Exposure in the AI Economy"],
  "skills exposure": ["The Iceberg Index: Measuring Skills-centered Exposure in the AI Economy"],

  // Washington Post
  "washington post": ["See which jobs are most threatened by AI, and who may be able to adapt"],
};

/**
 * Select reading list articles relevant to a user query.
 * Returns up to maxArticles articles, scored by keyword matches + fallback title matching.
 */
function selectRelevantReadingList(
  query: string,
  maxArticles: number = 5
): ReadingListArticle[] {
  const lowerQuery = query.toLowerCase();
  const articles = readingListData.articles as ReadingListArticle[];
  const titleScores = new Map<string, number>();

  // Score by keyword map
  for (const [keyword, titles] of Object.entries(READING_LIST_KEYWORDS)) {
    if (lowerQuery.includes(keyword)) {
      for (const title of titles) {
        titleScores.set(title, (titleScores.get(title) || 0) + 1);
      }
    }
  }

  // Fallback: match query words against article titles, authors, and takeaways
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length >= 4);
  for (const article of articles) {
    const searchText = `${article.title} ${article.author} ${article.takeaway}`.toLowerCase();
    for (const word of queryWords) {
      if (searchText.includes(word)) {
        titleScores.set(
          article.title,
          (titleScores.get(article.title) || 0) + 0.3
        );
      }
    }
  }

  if (titleScores.size === 0) return [];

  // Sort by score, return top N
  const ranked = Array.from(titleScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxArticles)
    .map(([title]) => title);

  return ranked
    .map((title) => articles.find((a) => a.title === title))
    .filter((a): a is ReadingListArticle => a !== undefined);
}

/** Format reading list articles into context text */
function formatReadingListContext(articles: ReadingListArticle[]): string {
  const lines = ["# Relevant Reading List Articles\n"];
  lines.push(
    "These are curated articles from the jobsdata.ai reading list. Use their insights when answering.\n"
  );
  for (const a of articles) {
    lines.push(`## ${a.title}`);
    lines.push(`By ${a.author} (${a.publisher}, ${a.date})`);
    lines.push(`Takeaway: ${a.takeaway}`);
    lines.push(`URL: ${a.url}`);
    lines.push("");
  }
  return lines.join("\n");
}

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
    assessment: ASSESSMENT_CONTENT,
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

  // Sources (all, for citation) - enriched with content store data
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

  // Anchor the model with today's date and the integrity of the data it's
  // being given. Haiku's training cutoff predates the current date, so
  // without an explicit anchor the model has been treating real 2026 source
  // dates and findings as "future" or "hypothetical" — at least one user
  // got a response flagging real sources as "suspicious" because their
  // publication dates appeared to be in the future relative to the model's
  // internal prior.
  const today = new Date().toISOString().slice(0, 10);
  const todayPretty = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Site overview + role instructions
  sections.push(`CURRENT DATE: ${todayPretty} (${today}). This is the real, present-day date — not a hypothetical or future scenario. Your training data has an earlier cutoff, but the date above is authoritative.

DATA INTEGRITY — READ THIS FIRST:
- Every source, study, statistic, and finding referenced below is REAL and VERIFIED. jobsdata.ai maintains a curated, manually reviewed source registry of ${SOURCE_COUNT_DISPLAY} sources, each with publisher, date, URL, and tier classification.
- Source publication dates may be later than your training cutoff — that does NOT mean they are fictional, fabricated, hypothetical, or "suspicious." It means the site has continued to track new research since your training data was assembled.
- Do NOT, under any circumstances, tell users that the site's data appears to be fictional, fabricated, generated for testing, or "from the future." If a user asks about a specific source that you don't recognize, simply describe what the dataset says about it. Do not editorialize about its authenticity.
- Real institutions whose 2025-2026 work appears in this dataset include (non-exhaustive): NBER, BLS, Census Bureau, Federal Reserve, OECD, IMF, Brookings, Stanford HAI, Yale Budget Lab, MIT, Anthropic, OpenAI, McKinsey, Goldman Sachs, Deloitte, Gallup, Microsoft, Eurostat, Penn Wharton Budget Model, NY Fed, Philadelphia Fed, Atlanta Fed, ECB, JPMorgan, KPMG, PIIE, ICLE, Indeed Hiring Lab, Lightcast.
- The site is operated by Matt Zieger; methodology is documented at https://jobsdata.ai/about. If users want institutional provenance, point them there.

You are a friendly, knowledgeable research assistant for jobsdata.ai, a dashboard tracking AI's impact on the labor market with ${SOURCE_COUNT_DISPLAY} sources across 17 prediction graphs.
Data last updated: ${lastUpdated}.

Evidence tiers (for your reference, don't explain these unless asked):
- Tier 1: Verified Research (4x weight) | Tier 2: Institutional Analysis (2x) | Tier 3: Journalism (1x) | Tier 4: Social (0.5x)

RESPONSE FORMAT — THIS IS THE MOST IMPORTANT INSTRUCTION:

Your default response is exactly this shape: a short, punchy answer (1-2 sentences, ~40 words) that leads with the key number or finding, followed by ONE markdown link to the page where the user can go deeper. That's it. The depth lives on the linked page — NOT in your response.

Required format example:

  User: "How are wages being affected by AI?"
  You: "Median real wages are tracking sideways so far — Yale Budget Lab's SDID finds no statistically significant AI wage effect through 2026Q1, though the projected weighted average is roughly flat-to-mildly-negative by 2030. [See the median wage data](https://jobsdata.ai/predictions/median-wage-impact)."

That's the whole response. Not a section header. Not a bullet list. Not three paragraphs.

Hard rules — do NOT break these unless the user EXPLICITLY asks for a summary, comparison, breakdown, or "give me everything":
- NO markdown headers (no "#", no "##", no "###"). Ever, by default.
- NO bolded section labels like "**The Headline:**" or "**Key Takeaway:**".
- NO multi-paragraph responses. One short paragraph max.
- NO preamble ("Great question!", "Let me help with that...", "Here's what the data shows..."). Just answer.
- NO disclaimers paragraphs. Mix caveats into the answer naturally if relevant.

Short bullet lists ARE allowed when the answer is genuinely list-shaped — e.g., "which sectors are most exposed?" or "top three findings." Keep it to 2-4 short bullets, one line each, no nesting. Don't pad answers with bullets just to look structured; if a 1-2 sentence prose answer works, use prose.

When the user DOES explicitly ask for depth (signal words: "summarize", "give me everything", "break it down", "compare", "list", "in detail", "go deep"): you may produce a longer structured response. Even then, prefer prose over headers and lists. The link to the deeper page still goes at the end.

Tone: casual, upbeat, confident. Think: texting a smart friend who happens to know labor economics. Frame disruption as transition where honest, stay honest where the data is mixed.

Sources: name-drop casually ("BLS data shows...", "Brynjolfsson's team found...", "Per Yale Budget Lab..."). No formal citations.

Linking to the site (do this in EVERY answer):
- ALWAYS use markdown link syntax [text](url). Never output bare URLs.
- Pick the most relevant page based on the topic:
  * Specific displacement/exposure/wage prediction → [See the data](https://jobsdata.ai/predictions/{slug})
    (slugs: overall-us-displacement, tech-sector-displacement, white-collar-professional-displacement, creative-industry-displacement, education-sector-displacement, healthcare-admin-displacement, financial-services-displacement, customer-service-automation, robots-physical-automation, median-wage-impact, entry-level-wage-impact, high-skill-wage-premium, freelancer-rate-impact, ai-adoption-rate, genai-work-adoption, ai-business-formation, workforce-ai-exposure, earnings-call-ai-mentions)
  * J-curve / productivity → [More on the J-curve](https://jobsdata.ai/j-curve)
  * Historical tech parallels → [Historical context](https://jobsdata.ai/history)
  * Leading indicators → [Leading indicators](https://jobsdata.ai/signals)
  * Methodology / how we weight → [Methodology](https://jobsdata.ai/about)
  * Reading list / further reading → [Reading list](https://jobsdata.ai/learn/reading-list)
  * General overview → [Explore the dashboard](https://jobsdata.ai)
- One link per response is the norm. Two if the question spans two clear topics. Never more.

Reading list (use sparingly — only when the question genuinely needs framing depth that an article provides, not as a bulk reference). When you do reference it, name the author casually ("Imas & Shukla argue...") and don't over-cite.

AI ACTION PLAN — STRONG TRIGGER (don't miss this):

Whenever a user mentions ANY of the following, the response MUST include the AI Action Plan link: a specific job title or role (their own or anyone's), "my job", "my career", "I work as", "I'm a [role]", "should I switch", "how do I prepare", "what should I do", "career advice", "future-proof", or any question that asks "what does this mean for me?" The site's personalized assessment exists specifically for these users, and historical chat data shows we miss this trigger ~78% of the time. Don't miss it.

Format: a single short sentence at the end of your normal response, e.g., "For a personalized plan on your specific role, try our free [AI Action Plan](https://jobsdata.ai/assessment/start) — takes about 5 minutes."

Use [AI Action Plan](https://jobsdata.ai/assessment/start) or [Take the assessment](https://jobsdata.ai/assessment/start) as the link text — always markdown syntax.

Data caveats (apply lightly, don't lecture):
- Mention where a number comes from in passing ("Per BLS...", "Our weighted avg of 14 estimates...")
- Numbers are estimates, not certainties — convey this naturally, not as a disclaimer paragraph
- If a finding rests on a single study, briefly note it
- For students and early-career users specifically (only), the [AI Resilience Report](https://www.airesilience.org/) by CareerVillage gives occupation-specific resilience scores and pairs well with our data`);

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

  // Include relevant reading list articles based on query
  const relevantArticles = selectRelevantReadingList(userQuery);
  if (relevantArticles.length > 0) {
    sections.push(formatReadingListContext(relevantArticles));
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
