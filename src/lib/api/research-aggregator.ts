import { EvidenceTier } from "../types";
import {
  discoverRecentPapers,
  SemanticScholarPaper,
} from "./semantic-scholar";
import {
  discoverOpenAlexPapers,
  OpenAlexWork,
  reconstructAbstract,
} from "./openalex";
import { discoverArxivPapers, ArxivPaper } from "./arxiv";
import { discoverEarningsFilings, SECFiling } from "./sec-earnings";
import { discoverJobPostings, JobPostingSnapshot } from "./job-postings";
import { classifyPapers, ClassifiedPaper } from "./paper-classifier";

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string | null;
  authors: string[];
  publishedDate: string | null;
  year: number | null;
  venue: string | null;
  url: string;
  pdfUrl: string | null;
  citationCount: number;
  evidenceTier: EvidenceTier;
  source: "semantic_scholar" | "openalex" | "arxiv" | "sec_edgar" | "job_postings";
  relevanceScore: number;
}

/**
 * Terms that indicate a paper belongs to an unrelated domain (medical,
 * biological, physical sciences, etc.) and should be excluded from the
 * AI-labor research feed.  A paper is excluded when it matches 2+ of
 * these terms AND does not contain any of the strong labor-market signals.
 */
const OFF_TOPIC_TERMS = [
  // Medical / clinical
  "cancer", "tumor", "tumour", "oncolog", "carcinoma", "melanoma",
  "leukemia", "lymphoma", "metastasis", "chemotherapy", "radiotherapy",
  "patient", "clinical trial", "diagnosis", "pathology", "biomarker",
  "surgery", "surgical", "cardiac", "cardiovascular", "heart failure",
  "stroke", "diabetes", "insulin", "hypertension",
  "anxiety disorder", "psychiatric", "schizophreni",
  "genomic", "genome", "proteomic", "protein folding",
  "cell line", "in vitro", "in vivo", "mouse model", "rat model",
  "drug discovery", "pharmaceutical", "pharmacolog", "toxicolog",
  "radiology", "mri ", "ct scan", "imaging modality",
  "mortality", "morbidity", "epidemiolog", "prevalence",
  // Biological / environmental
  "species", "ecosystem", "biodiversity", "phylogenet",
  "crop yield", "soil", "pollinator",
  // Physical sciences / engineering (non-labor)
  "fluid dynamics", "quantum", "semiconductor", "photovoltaic",
  "battery", "alloy", "molecular", "nanomaterial",
];

const STRONG_LABOR_SIGNALS = [
  "labor market", "job displacement", "wage", "workforce",
  "unemployment", "layoff", "headcount", "hiring",
  "job loss", "occupation", "worker",
];

function isOffTopicDomain(title: string, abstract: string | null, venue: string | null): boolean {
  const text = `${title} ${abstract || ""} ${venue || ""}`.toLowerCase();

  // If the paper contains a strong labor-market signal, keep it regardless
  if (STRONG_LABOR_SIGNALS.some((term) => text.includes(term))) {
    return false;
  }

  // Count how many off-topic terms appear
  let offTopicHits = 0;
  for (const term of OFF_TOPIC_TERMS) {
    if (text.includes(term)) {
      offTopicHits++;
      if (offTopicHits >= 2) return true;
    }
  }

  return false;
}

/**
 * Score relevance to AI + labor market topic.
 */
function scoreRelevance(title: string, abstract: string | null): number {
  const text = `${title} ${abstract || ""}`.toLowerCase();
  let score = 0;

  const highRelevance = [
    "labor market",
    "job displacement",
    "wage",
    "employment",
    "automation",
    "workforce",
    "occupation",
    "unemployment",
    "headcount",
    "layoff",
    "restructuring",
    "job postings",
  ];
  const medRelevance = [
    "artificial intelligence",
    "ai",
    "machine learning",
    "generative ai",
    "large language model",
    "chatgpt",
    "gpt",
    "earnings",
    "10-k",
    "hiring",
  ];

  for (const term of highRelevance) {
    if (text.includes(term)) score += 3;
  }
  for (const term of medRelevance) {
    if (text.includes(term)) score += 1;
  }

  return score;
}

function fromSemanticScholar(paper: SemanticScholarPaper): ResearchPaper {
  return {
    id: `s2-${paper.paperId}`,
    title: paper.title,
    abstract: paper.tldr?.text || paper.abstract,
    authors: paper.authors.map((a) => a.name),
    publishedDate: paper.publicationDate,
    year: paper.year,
    venue: paper.venue,
    url: paper.url,
    pdfUrl: paper.openAccessPdf?.url || null,
    citationCount: paper.citationCount,
    evidenceTier: 2,
    source: "semantic_scholar",
    relevanceScore: scoreRelevance(paper.title, paper.abstract),
  };
}

function fromOpenAlex(work: OpenAlexWork): ResearchPaper {
  const abstract = reconstructAbstract(work.abstract_inverted_index);
  return {
    id: `oa-${work.id.split("/").pop()}`,
    title: work.title,
    abstract,
    authors: work.authorships.map((a) => a.author.display_name),
    publishedDate: work.publication_date,
    year: work.publication_year,
    venue: work.primary_location?.source?.display_name || null,
    url: work.primary_location?.landing_page_url || work.doi || work.id,
    pdfUrl: work.primary_location?.pdf_url || null,
    citationCount: work.cited_by_count,
    evidenceTier: 2,
    source: "openalex",
    relevanceScore: scoreRelevance(work.title, abstract),
  };
}

function fromArxiv(paper: ArxivPaper): ResearchPaper {
  return {
    id: `arxiv-${paper.id.split("/abs/").pop() || paper.id}`,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors,
    publishedDate: paper.published.split("T")[0],
    year: new Date(paper.published).getFullYear(),
    venue: "arXiv",
    url: paper.id,
    pdfUrl: paper.pdfUrl,
    citationCount: 0,
    evidenceTier: 2,
    source: "arxiv",
    relevanceScore: scoreRelevance(paper.title, paper.abstract),
  };
}

function fromSECFiling(filing: SECFiling): ResearchPaper {
  return {
    id: filing.id,
    title: filing.title,
    abstract: filing.excerpt,
    authors: [filing.companyName],
    publishedDate: filing.filedAt,
    year: filing.filedAt ? new Date(filing.filedAt).getFullYear() : null,
    venue: `SEC ${filing.formType}`,
    url: filing.url,
    pdfUrl: null,
    citationCount: 0, // SEC filings don't have citations
    evidenceTier: 1, // Corporate filings = Tier 1 (verified data)
    source: "sec_edgar",
    relevanceScore: scoreRelevance(filing.title, filing.excerpt),
  };
}

function fromJobPosting(snapshot: JobPostingSnapshot): ResearchPaper {
  return {
    id: snapshot.id,
    title: snapshot.title,
    abstract: snapshot.description,
    authors: [snapshot.source === "adzuna" ? "Adzuna" : snapshot.source === "lightcast" ? "Lightcast" : "Indeed Hiring Lab"],
    publishedDate: snapshot.dataDate,
    year: new Date(snapshot.dataDate).getFullYear(),
    venue: "Job Market Data",
    url: snapshot.url,
    pdfUrl: null,
    citationCount: 0,
    evidenceTier: 2, // Job posting data = Tier 2 (institutional analysis)
    source: "job_postings",
    relevanceScore: scoreRelevance(snapshot.title, snapshot.description),
  };
}

/**
 * Deduplicate papers by fuzzy title matching.
 */
function deduplicate(papers: ResearchPaper[]): ResearchPaper[] {
  const seen = new Map<string, ResearchPaper>();

  for (const paper of papers) {
    const normalizedTitle = paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 80);

    const existing = seen.get(normalizedTitle);
    if (!existing || paper.citationCount > existing.citationCount) {
      seen.set(normalizedTitle, paper);
    }
  }

  return Array.from(seen.values());
}

export interface ResearchFeedOptions {
  minRelevanceScore?: number;
  maxResults?: number;
  tiers?: EvidenceTier[];
}

export async function getResearchFeed(
  options: ResearchFeedOptions = {}
): Promise<ClassifiedPaper[]> {
  const {
    minRelevanceScore = 4,
    maxResults = 50,
    tiers,
  } = options;

  // Fetch from all sources in parallel
  const [s2Papers, oaPapers, arxivPapers, secFilings, jobData] = await Promise.all([
    discoverRecentPapers(10),
    discoverOpenAlexPapers(50),
    discoverArxivPapers(10),
    discoverEarningsFilings(15).catch(() => [] as SECFiling[]),
    discoverJobPostings().catch(() => [] as JobPostingSnapshot[]),
  ]);

  // Normalize to unified format
  const allPapers: ResearchPaper[] = [
    ...s2Papers.map(fromSemanticScholar),
    ...oaPapers.map(fromOpenAlex),
    ...arxivPapers.map(fromArxiv),
    ...secFilings.map(fromSECFiling),
    ...jobData.map(fromJobPosting),
  ];

  // Deduplicate
  let results = deduplicate(allPapers);

  // Exclude off-topic domains (medical, biological, physical sciences)
  results = results.filter((p) => !isOffTopicDomain(p.title, p.abstract, p.venue));

  // Filter by relevance
  results = results.filter((p) => p.relevanceScore >= minRelevanceScore);

  // Classify: assign proper tiers and link to predictions
  let classified = classifyPapers(results);

  // Filter by evidence tier if specified
  if (tiers && tiers.length > 0) {
    classified = classified.filter((p) =>
      tiers.includes(p.classifiedTier)
    );
  }

  // Sort by: evidence tier (ascending) then citation count (descending)
  classified.sort((a, b) => {
    if (a.classifiedTier !== b.classifiedTier)
      return a.classifiedTier - b.classifiedTier;
    return b.citationCount - a.citationCount;
  });

  return classified.slice(0, maxResults);
}
