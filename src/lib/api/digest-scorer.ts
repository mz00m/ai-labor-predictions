import { EvidenceTier } from "../types";
import { ResearchPaper } from "./research-aggregator";

const TIER_POINTS: Record<EvidenceTier, number> = {
  1: 40,
  2: 25,
  3: 10,
  4: 2,
};

/**
 * Compute a composite score for ranking papers in the weekly digest.
 * Higher = more important / relevant.
 */
export function computeCompositeScore(
  paper: ResearchPaper & { classifiedTier: EvidenceTier }
): number {
  let score = 0;

  // Source tier base points
  score += TIER_POINTS[paper.classifiedTier];

  // Keyword relevance (from research-aggregator scoreRelevance)
  score += paper.relevanceScore * 2;

  // Citation velocity (citations per year since publication)
  if (paper.year && paper.citationCount > 0) {
    const yearsOld = Math.max(0.5, new Date().getFullYear() - paper.year);
    const velocity = paper.citationCount / yearsOld;
    score += Math.min(Math.round(velocity * 2), 30); // Cap at 30
  }

  // Tracked author bonus
  if (paper.isTrackedAuthor) {
    score += 25;
  }

  return Math.round(score);
}
