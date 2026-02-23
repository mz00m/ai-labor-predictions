import { fetchAuthorWorks, OpenAlexWork, reconstructAbstract } from "./openalex";
import { ResearchPaper } from "./research-aggregator";
import trackedAuthorsData from "@/data/tracked-authors.json";

export interface TrackedAuthor {
  name: string;
  openAlexId: string;
  affiliation?: string;
  specialization?: string;
}

/**
 * Load tracked authors from the JSON data file.
 */
export function loadTrackedAuthors(): TrackedAuthor[] {
  return trackedAuthorsData as TrackedAuthor[];
}

/**
 * Score relevance for author-tracked papers.
 * These get a bonus since they're from key researchers.
 */
function scoreRelevance(title: string, abstract: string | null): number {
  const text = `${title} ${abstract || ""}`.toLowerCase();
  let score = 0;

  const highRelevance = [
    "labor market", "job displacement", "wage", "employment",
    "automation", "workforce", "occupation", "unemployment",
  ];
  const medRelevance = [
    "artificial intelligence", "ai", "machine learning",
    "generative ai", "large language model",
  ];

  for (const term of highRelevance) {
    if (text.includes(term)) score += 3;
  }
  for (const term of medRelevance) {
    if (text.includes(term)) score += 1;
  }

  return score;
}

/**
 * Convert an OpenAlex work from a tracked author into a ResearchPaper.
 */
function fromTrackedAuthorWork(
  work: OpenAlexWork,
  authorName: string
): ResearchPaper {
  const abstract = reconstructAbstract(work.abstract_inverted_index);
  const doi = work.doi
    ? work.doi.replace(/^https?:\/\/doi\.org\//, "")
    : null;

  return {
    id: `tracked-${work.id.split("/").pop()}`,
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
    relevanceScore: scoreRelevance(work.title, abstract) + 10, // +10 tracked author bonus
    doi,
    isTrackedAuthor: true,
    trackedAuthorName: authorName,
  };
}

/**
 * Fetch recent papers from all tracked authors.
 * Queries OpenAlex for each author's recent works.
 */
export async function fetchTrackedAuthorPapers(
  daysBack = 90
): Promise<ResearchPaper[]> {
  const authors = loadTrackedAuthors();
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - daysBack);
  const sinceDateStr = sinceDate.toISOString().split("T")[0];

  const papers: ResearchPaper[] = [];
  const seenIds = new Set<string>();

  // Process authors in batches to respect rate limits
  for (const author of authors) {
    if (!author.openAlexId) continue;

    try {
      const works = await fetchAuthorWorks(
        author.openAlexId,
        sinceDateStr,
        10
      );

      for (const work of works) {
        const paper = fromTrackedAuthorWork(work, author.name);
        if (!seenIds.has(paper.id)) {
          seenIds.add(paper.id);
          papers.push(paper);
        }
      }

      // Polite rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`Author tracking failed for ${author.name}:`, err);
    }
  }

  return papers;
}
