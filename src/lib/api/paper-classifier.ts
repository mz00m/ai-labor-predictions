import { EvidenceTier, Source } from "../types";
import { ResearchPaper } from "./research-aggregator";
import { getAllPredictions } from "../data-loader";

/**
 * Keywords that signal a paper is relevant to a specific prediction.
 * Each prediction slug maps to weighted keyword groups.
 */
const PREDICTION_KEYWORDS: Record<
  string,
  { primary: string[]; secondary: string[] }
> = {
  "tech-sector-displacement": {
    primary: [
      "software engineer",
      "tech sector",
      "tech jobs",
      "programmer",
      "developer",
      "IT worker",
      "coding",
      "software development",
      "computer science occupation",
    ],
    secondary: [
      "white collar",
      "knowledge worker",
      "automation",
      "displacement",
      "job loss",
      "AI replace",
    ],
  },
  "customer-service-automation": {
    primary: [
      "customer service",
      "chatbot",
      "contact center",
      "call center",
      "support agent",
      "conversational AI",
      "customer support",
      "helpdesk",
    ],
    secondary: [
      "automation",
      "natural language",
      "dialogue system",
      "service interaction",
    ],
  },
  "overall-us-displacement": {
    primary: [
      "labor market",
      "employment",
      "job displacement",
      "unemployment",
      "workforce",
      "occupational",
      "task automation",
      "jobs at risk",
    ],
    secondary: [
      "AI impact",
      "automation",
      "artificial intelligence",
      "machine learning",
      "economic growth",
    ],
  },
  "high-skill-wage-premium": {
    primary: [
      "wage premium",
      "salary",
      "compensation",
      "AI skills",
      "high skill",
      "skill premium",
      "returns to skill",
      "wage inequality",
    ],
    secondary: [
      "talent",
      "demand",
      "human capital",
      "earnings",
      "income",
    ],
  },
  "median-wage-impact": {
    primary: [
      "median wage",
      "wage",
      "earnings",
      "income inequality",
      "wage distribution",
      "wage growth",
      "real wage",
      "purchasing power",
    ],
    secondary: [
      "labor share",
      "inequality",
      "middle class",
      "economic impact",
    ],
  },
  "total-us-jobs-lost": {
    primary: [
      "job loss",
      "jobs lost",
      "net employment",
      "labor force",
      "total displacement",
      "aggregate employment",
      "mass unemployment",
      "workforce reduction",
    ],
    secondary: [
      "labor market",
      "automation",
      "AI impact",
      "employment decline",
      "occupational change",
      "job creation",
      "economic growth",
    ],
  },
};

/**
 * Score how relevant a paper is to a specific prediction.
 * Returns 0 if not relevant, higher = more relevant.
 */
function scorePaperForPrediction(
  paper: ResearchPaper,
  predictionSlug: string
): number {
  const keywords = PREDICTION_KEYWORDS[predictionSlug];
  if (!keywords) return 0;

  const text = `${paper.title} ${paper.abstract || ""}`.toLowerCase();
  let score = 0;

  for (const kw of keywords.primary) {
    if (text.includes(kw.toLowerCase())) score += 3;
  }
  for (const kw of keywords.secondary) {
    if (text.includes(kw.toLowerCase())) score += 1;
  }

  return score;
}

/**
 * Classify a paper's evidence tier based on venue and citation data.
 * Uses the new 4-tier system.
 */
function classifyTier(paper: ResearchPaper): EvidenceTier {
  const venue = (paper.venue || "").toLowerCase();

  // SEC filings are always Tier 1
  if (paper.source === "sec_edgar") return 1;

  // Tier 1: Peer-reviewed journals, government data, SEC filings
  const tier1 = [
    "american economic review",
    "quarterly journal of economics",
    "econometrica",
    "journal of political economy",
    "journal of labor economics",
    "review of economic studies",
    "review of financial studies",
    "journal of finance",
    "nature",
    "science",
    "pnas",
    "nber",
    "bureau of labor",
    "census",
    "sec 10-k",
    "sec 10-q",
    "sec 8-k",
  ];
  if (tier1.some((v) => venue.includes(v))) return 1;
  if (paper.citationCount >= 100) return 1;

  // Tier 2: Think tanks, working papers, prediction markets, industry research
  const tier2 = [
    "brookings",
    "rand",
    "mckinsey",
    "oecd",
    "imf",
    "world bank",
    "ilo",
    "gartner",
    "forrester",
    "deloitte",
    "arxiv",
    "ssrn",
    "working paper",
    "metaculus",
    "icml",
    "neurips",
    "aaai",
  ];
  if (tier2.some((v) => venue.includes(v))) return 2;
  if (paper.citationCount >= 20) return 2;

  // Tier 3: News, commentary
  const tier3 = [
    "new york times",
    "wall street journal",
    "financial times",
    "reuters",
    "economist",
    "harvard business review",
    "techcrunch",
    "wired",
  ];
  if (tier3.some((v) => venue.includes(v))) return 3;

  // Job posting data = Tier 2
  if (paper.source === "job_postings") return 2;

  // Default academic papers to Tier 2
  if (paper.source === "semantic_scholar" || paper.source === "openalex") {
    return 2;
  }

  return 3;
}

export interface ClassifiedPaper extends ResearchPaper {
  linkedPredictions: Array<{
    slug: string;
    title: string;
    relevanceScore: number;
  }>;
  classifiedTier: EvidenceTier;
}

/**
 * Convert a classified paper into a Source object for a prediction.
 */
export function paperToSource(paper: ClassifiedPaper): Source {
  return {
    id: paper.id,
    title: paper.title,
    url: paper.url,
    publisher:
      paper.venue ||
      (paper.source === "semantic_scholar"
        ? "Semantic Scholar"
        : paper.source === "openalex"
          ? "OpenAlex"
          : paper.source === "sec_edgar"
            ? "SEC EDGAR"
            : paper.source === "job_postings"
              ? "Job Market Data"
              : "arXiv"),
    evidenceTier: paper.classifiedTier,
    datePublished: paper.publishedDate || new Date().toISOString().split("T")[0],
    excerpt: paper.abstract
      ? paper.abstract.length > 200
        ? paper.abstract.slice(0, 200) + "..."
        : paper.abstract
      : undefined,
  };
}

/**
 * Classify papers: assign evidence tier and link to relevant predictions.
 * A paper must score >= threshold to be linked to a prediction.
 */
export function classifyPapers(
  papers: ResearchPaper[],
  threshold = 4
): ClassifiedPaper[] {
  const predictions = getAllPredictions();

  return papers.map((paper) => {
    const classifiedTier = classifyTier(paper);

    const linkedPredictions: ClassifiedPaper["linkedPredictions"] = [];

    for (const prediction of predictions) {
      const score = scorePaperForPrediction(paper, prediction.slug);
      if (score >= threshold) {
        linkedPredictions.push({
          slug: prediction.slug,
          title: prediction.title,
          relevanceScore: score,
        });
      }
    }

    // Sort by relevance
    linkedPredictions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      ...paper,
      evidenceTier: classifiedTier,
      classifiedTier,
      linkedPredictions,
    };
  });
}
