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
import { discoverScopusPapers, ScopusPaper } from "./scopus";
import { discoverNBERPapers, NBERPaper } from "./nber";
import { discoverBrookingsPapers, BrookingsPaper } from "./brookings";
import { discoverCOREPapers, COREWork } from "./core-api";
import { discoverIMFPapers } from "./imf";
import { discoverIZAPapers } from "./iza";
import { fetchTrackedAuthorPapers } from "./author-tracker";

export type ResearchSource =
  | "semantic_scholar"
  | "openalex"
  | "arxiv"
  | "sec_edgar"
  | "job_postings"
  | "scopus"
  | "nber"
  | "brookings"
  | "imf"
  | "iza"
  | "core";

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
  source: ResearchSource;
  relevanceScore: number;
  doi: string | null;
  isTrackedAuthor: boolean;
  trackedAuthorName?: string;
}

/**
 * Check whether a word-boundary match exists for a short term.
 * For multi-word phrases or terms >= 4 chars, plain includes() is safe.
 * For short terms like "ai" we need word boundaries to avoid matching
 * substrings inside words like "cardiac", "anxiety", "brain", etc.
 */
function matchesTerm(text: string, term: string): boolean {
  if (term.length >= 4 || term.includes(" ")) {
    return text.includes(term);
  }
  // Word-boundary match for short terms (e.g. "ai", "gpt")
  const re = new RegExp(`\\b${term}\\b`);
  return re.test(text);
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
 *
 * Requires BOTH an AI-related keyword AND a labor-related keyword to score
 * above the threshold. This prevents medical/clinical papers that
 * tangentially mention "AI" or "employment" from leaking through.
 */
function scoreRelevance(title: string, abstract: string | null): number {
  const text = `${title} ${abstract || ""}`.toLowerCase();

  // --- AI-side keywords ---
  const aiKeywords = [
    "artificial intelligence",
    "machine learning",
    "generative ai",
    "large language model",
    "chatgpt",
    "gpt",
    "ai",
  ];
  // --- Labor-side keywords ---
  const laborKeywords = [
    "labor market",
    "labour market",
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
    "earnings",
    "10-k",
    "hiring",
  ];

  let aiScore = 0;
  let laborScore = 0;

  for (const term of aiKeywords) {
    if (matchesTerm(text, term)) aiScore += 1;
  }
  for (const term of laborKeywords) {
    if (matchesTerm(text, term)) laborScore += 1;
  }

  // Must have at least one keyword from EACH domain
  if (aiScore === 0 || laborScore === 0) return 0;

  // Now compute the weighted score for ranking purposes
  let score = 0;

  const highRelevance = [
    "labor market",
    "labour market",
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
    if (matchesTerm(text, term)) score += 3;
  }
  for (const term of medRelevance) {
    if (matchesTerm(text, term)) score += 1;
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
    doi: null,
    isTrackedAuthor: false,
  };
}

function fromOpenAlex(work: OpenAlexWork): ResearchPaper {
  const abstract = reconstructAbstract(work.abstract_inverted_index);
  const doi = work.doi
    ? work.doi.replace(/^https?:\/\/doi\.org\//, "")
    : null;
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
    doi,
    isTrackedAuthor: false,
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
    doi: null,
    isTrackedAuthor: false,
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
    citationCount: 0,
    evidenceTier: 1,
    source: "sec_edgar",
    relevanceScore: scoreRelevance(filing.title, filing.excerpt),
    doi: null,
    isTrackedAuthor: false,
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
    evidenceTier: 2,
    source: "job_postings",
    relevanceScore: scoreRelevance(snapshot.title, snapshot.description),
    doi: null,
    isTrackedAuthor: false,
  };
}

function fromScopus(paper: ScopusPaper): ResearchPaper {
  return {
    id: `scopus-${paper.scopusId.replace("SCOPUS_ID:", "")}`,
    title: paper.title,
    abstract: null, // Scopus search API doesn't return abstracts
    authors: paper.creator ? [paper.creator] : [],
    publishedDate: paper.coverDate,
    year: paper.coverDate ? new Date(paper.coverDate).getFullYear() : null,
    venue: paper.publicationName,
    url: paper.url,
    pdfUrl: null,
    citationCount: paper.citedByCount,
    evidenceTier: 2,
    source: "scopus",
    relevanceScore: scoreRelevance(paper.title, null),
    doi: paper.doi,
    isTrackedAuthor: false,
  };
}

function fromNBER(paper: NBERPaper): ResearchPaper {
  return {
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors,
    publishedDate: paper.publishedDate,
    year: paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : null,
    venue: "NBER Working Papers",
    url: paper.url,
    pdfUrl: null,
    citationCount: 0,
    evidenceTier: 1, // NBER = Tier 1
    source: "nber",
    relevanceScore: scoreRelevance(paper.title, paper.abstract),
    doi: null,
    isTrackedAuthor: false,
  };
}

function fromBrookings(paper: BrookingsPaper): ResearchPaper {
  return {
    id: paper.id,
    title: paper.title,
    abstract: paper.description,
    authors: paper.authors,
    publishedDate: paper.publishedDate,
    year: paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : null,
    venue: "Brookings Institution",
    url: paper.url,
    pdfUrl: null,
    citationCount: 0,
    evidenceTier: 2,
    source: "brookings",
    relevanceScore: scoreRelevance(paper.title, paper.description),
    doi: null,
    isTrackedAuthor: false,
  };
}

function fromCORE(paper: COREWork): ResearchPaper {
  return {
    id: `core-${paper.id}`,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors.map((a) => a.name),
    publishedDate: paper.publishedDate,
    year: paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : null,
    venue: null,
    url: paper.downloadUrl || paper.sourceFulltextUrls[0] || `https://core.ac.uk/works/${paper.id}`,
    pdfUrl: paper.downloadUrl,
    citationCount: paper.citationCount,
    evidenceTier: 2,
    source: "core",
    relevanceScore: scoreRelevance(paper.title, paper.abstract),
    doi: paper.doi,
    isTrackedAuthor: false,
  };
}

function fromOpenAlexIMF(work: OpenAlexWork): ResearchPaper {
  const paper = fromOpenAlex(work);
  return { ...paper, source: "imf", id: `imf-${work.id.split("/").pop()}` };
}

function fromOpenAlexIZA(work: OpenAlexWork): ResearchPaper {
  const paper = fromOpenAlex(work);
  return { ...paper, source: "iza", id: `iza-${work.id.split("/").pop()}` };
}

/**
 * Deduplicate papers by DOI first, then fuzzy title matching.
 */
function deduplicate(papers: ResearchPaper[]): ResearchPaper[] {
  const byDoi = new Map<string, ResearchPaper>();
  const byTitle = new Map<string, ResearchPaper>();

  for (const paper of papers) {
    // DOI-based deduplication (primary — deterministic)
    if (paper.doi) {
      const normalizedDoi = paper.doi.toLowerCase().replace(/^https?:\/\/doi\.org\//, "");
      const existing = byDoi.get(normalizedDoi);
      if (existing) {
        if (paper.citationCount > existing.citationCount) {
          byDoi.set(normalizedDoi, paper);
        }
        continue;
      }
      byDoi.set(normalizedDoi, paper);
    }

    // Title-based deduplication (fallback for papers without DOI)
    const normalizedTitle = paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 80);

    const existing = byTitle.get(normalizedTitle);
    if (!existing || paper.citationCount > existing.citationCount) {
      byTitle.set(normalizedTitle, paper);
    }
  }

  // Merge: DOI-deduped papers take precedence, then title-deduped
  const doiPapers = Array.from(byDoi.values());
  const doiTitles = new Set(
    doiPapers.map((p) =>
      p.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 80)
    )
  );
  const titleOnlyPapers = Array.from(byTitle.values()).filter(
    (p) =>
      !doiTitles.has(
        p.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 80)
      )
  );

  return [...doiPapers, ...titleOnlyPapers];
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

  // Fetch from all sources in parallel (each wrapped with .catch for fault tolerance)
  const [
    s2Papers,
    oaPapers,
    arxivPapers,
    secFilings,
    jobData,
    scopusPapers,
    nberPapers,
    brookingsPapers,
    corePapers,
    imfPapers,
    izaPapers,
    trackedAuthorPapers,
  ] = await Promise.all([
    discoverRecentPapers(10).catch(() => [] as SemanticScholarPaper[]),
    discoverOpenAlexPapers(50).catch(() => [] as OpenAlexWork[]),
    discoverArxivPapers(10).catch(() => [] as ArxivPaper[]),
    discoverEarningsFilings(15).catch(() => [] as SECFiling[]),
    discoverJobPostings().catch(() => [] as JobPostingSnapshot[]),
    discoverScopusPapers(10).catch(() => [] as ScopusPaper[]),
    discoverNBERPapers().catch(() => [] as NBERPaper[]),
    discoverBrookingsPapers().catch(() => [] as BrookingsPaper[]),
    discoverCOREPapers(10).catch(() => [] as COREWork[]),
    discoverIMFPapers(15).catch(() => [] as OpenAlexWork[]),
    discoverIZAPapers(15).catch(() => [] as OpenAlexWork[]),
    fetchTrackedAuthorPapers(90).catch(() => [] as ResearchPaper[]),
  ]);

  // Normalize to unified format
  const allPapers: ResearchPaper[] = [
    ...s2Papers.map(fromSemanticScholar),
    ...oaPapers.map(fromOpenAlex),
    ...arxivPapers.map(fromArxiv),
    ...secFilings.map(fromSECFiling),
    ...jobData.map(fromJobPosting),
    ...scopusPapers.map(fromScopus),
    ...nberPapers.map(fromNBER),
    ...brookingsPapers.map(fromBrookings),
    ...corePapers.map(fromCORE),
    ...imfPapers.map(fromOpenAlexIMF),
    ...izaPapers.map(fromOpenAlexIZA),
    ...trackedAuthorPapers, // Already in ResearchPaper format
  ];

  // Deduplicate
  let results = deduplicate(allPapers);

  // Exclude off-topic domains (medical, biological, physical sciences)
  results = results.filter((p) => !isOffTopicDomain(p.title, p.abstract, p.venue));

  // Filter by relevance (tracked author papers bypass minimum with their +10 bonus)
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
