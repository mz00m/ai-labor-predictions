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
  "white-collar-professional-displacement": {
    primary: [
      "white collar",
      "professional",
      "legal",
      "accounting",
      "finance",
      "paralegal",
      "auditor",
      "management consulting",
      "analyst",
      "knowledge worker",
    ],
    secondary: [
      "displacement",
      "automation",
      "AI replace",
      "office work",
      "cognitive task",
    ],
  },
  "creative-industry-displacement": {
    primary: [
      "creative",
      "design",
      "graphic",
      "illustration",
      "writing",
      "copywriting",
      "content creation",
      "marketing",
      "advertising",
      "animation",
      "photography",
    ],
    secondary: [
      "generative AI",
      "midjourney",
      "stable diffusion",
      "dall-e",
      "freelance",
      "gig",
      "displacement",
    ],
  },
  "education-sector-displacement": {
    primary: [
      "education",
      "teaching",
      "tutor",
      "instructor",
      "grading",
      "curriculum",
      "edtech",
      "chegg",
      "coursework",
    ],
    secondary: [
      "AI tools",
      "chatbot",
      "student",
      "learning",
      "academic integrity",
      "displacement",
    ],
  },
  "healthcare-admin-displacement": {
    primary: [
      "healthcare admin",
      "medical coding",
      "billing",
      "claims processing",
      "prior authorization",
      "scheduling",
      "ehr",
      "health information",
    ],
    secondary: [
      "automation",
      "AI",
      "workforce",
      "administrative",
      "hospital",
      "displacement",
    ],
  },
  "geographic-wage-divergence": {
    primary: [
      "geographic",
      "regional",
      "city",
      "metro",
      "hub",
      "remote work",
      "spatial",
      "location premium",
      "tech hub",
    ],
    secondary: [
      "wage gap",
      "divergence",
      "inequality",
      "migration",
      "clustering",
      "AI adoption",
    ],
  },
  "entry-level-wage-impact": {
    primary: [
      "entry level",
      "junior",
      "early career",
      "new graduate",
      "intern",
      "first job",
      "starting salary",
      "young worker",
    ],
    secondary: [
      "wage",
      "compensation",
      "income",
      "AI impact",
      "hiring",
      "displacement",
    ],
  },
  "freelancer-rate-impact": {
    primary: [
      "freelancer",
      "freelance",
      "gig economy",
      "upwork",
      "fiverr",
      "contractor",
      "independent worker",
      "platform work",
    ],
    secondary: [
      "rate",
      "earnings",
      "income",
      "AI competition",
      "pricing",
      "displacement",
    ],
  },
  "ai-adoption-rate": {
    primary: [
      "AI adoption",
      "deploy AI",
      "production AI",
      "enterprise AI",
      "business AI",
      "company adoption",
      "census bureau",
      "business trends",
    ],
    secondary: [
      "implementation",
      "rollout",
      "integration",
      "workforce",
      "productivity",
      "diffusion",
    ],
  },
  "earnings-call-ai-mentions": {
    primary: [
      "earnings call",
      "quarterly earnings",
      "ceo",
      "cfo",
      "investor",
      "10-k",
      "10-q",
      "annual report",
      "guidance",
    ],
    secondary: [
      "AI",
      "artificial intelligence",
      "automation",
      "workforce",
      "efficiency",
      "headcount",
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
    "iza",
    "discussion paper",
    "international center for law",
    "icle",
    "dallas fed",
    "federal reserve",
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
  if (
    paper.source === "semantic_scholar" ||
    paper.source === "openalex" ||
    paper.source === "scopus" ||
    paper.source === "core"
  ) {
    return 2;
  }

  // NBER is always Tier 1
  if (paper.source === "nber") return 1;

  // Think tank / institutional sources = Tier 2
  if (
    paper.source === "brookings" ||
    paper.source === "imf" ||
    paper.source === "iza"
  ) {
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
const SOURCE_PUBLISHER_LABELS: Record<string, string> = {
  semantic_scholar: "Semantic Scholar",
  openalex: "OpenAlex",
  sec_edgar: "SEC EDGAR",
  job_postings: "Job Market Data",
  arxiv: "arXiv",
  scopus: "Scopus",
  nber: "NBER",
  brookings: "Brookings Institution",
  imf: "IMF",
  iza: "IZA",
  core: "CORE",
};

export function paperToSource(paper: ClassifiedPaper): Source {
  return {
    id: paper.id,
    title: paper.title,
    url: paper.url,
    publisher: paper.venue || SOURCE_PUBLISHER_LABELS[paper.source] || paper.source,
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
