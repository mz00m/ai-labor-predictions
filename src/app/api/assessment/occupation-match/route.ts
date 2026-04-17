import { NextRequest, NextResponse } from "next/server";
import enrichedData from "@/data/enriched-occupations.json";

// ---------------------------------------------------------------------------
// Lightweight occupation search for the assessment form.
// Returns top 5 matches with score data so the form can show an instant
// AI score preview after the user types their job title.
// ---------------------------------------------------------------------------

interface OccupationHit {
  slug: string;
  title: string;
  category: string;
  exposure: number;
  taskBreakdown: {
    aiCanDoNow: number;
    aiCanAssist: number;
    humanDomain: number;
  };
  timeSavingsHoursPerWeek: number;
}

// Pre-build search index at module level (server-only, cached across requests)
const occupations = enrichedData.occupations.map((o) => ({
  slug: o.slug,
  title: o.title,
  titleLower: o.title.toLowerCase(),
  category: o.category,
  exposure: o.exposure,
  taskComposition: o.taskComposition,
}));

function computeTaskBreakdown(tc: Record<string, number>) {
  const aiCanDoNow =
    (tc["information-processing"] ?? 0) + (tc["technical-specialized"] ?? 0);
  const aiCanAssist =
    (tc["analysis-decision"] ?? 0) +
    (tc["creative-generative"] ?? 0) +
    (tc["communication"] ?? 0);
  const humanDomain = Math.max(0, 1 - aiCanDoNow - aiCanAssist);
  return { aiCanDoNow, aiCanAssist, humanDomain };
}

function estimateTimeSavings(exposure: number): number {
  return Math.round(40 * (exposure / 10) * 0.3 * 10) / 10;
}

/**
 * Simple relevance scoring: exact prefix match > word start match > substring.
 * Returns -1 if no match.
 */
function scoreMatch(titleLower: string, queryLower: string): number {
  if (titleLower === queryLower) return 100;
  if (titleLower.startsWith(queryLower)) return 80;

  // Check if any word in the title starts with the query
  const words = titleLower.split(/[\s,&-]+/);
  for (const w of words) {
    if (w.startsWith(queryLower)) return 60;
  }

  // Multi-word query: all tokens must appear
  const tokens = queryLower.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const allMatch = tokens.every((t) => titleLower.includes(t));
    if (allMatch) return 40;
  }

  // Substring match
  if (titleLower.includes(queryLower)) return 20;

  return -1;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const queryLower = q.toLowerCase();

  const scored = occupations
    .map((o) => ({ occ: o, score: scoreMatch(o.titleLower, queryLower) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.occ.exposure - a.occ.exposure)
    .slice(0, 5);

  const results: OccupationHit[] = scored.map(({ occ }) => ({
    slug: occ.slug,
    title: occ.title,
    category: occ.category,
    exposure: occ.exposure,
    taskBreakdown: computeTaskBreakdown(occ.taskComposition),
    timeSavingsHoursPerWeek: estimateTimeSavings(occ.exposure),
  }));

  return NextResponse.json({ results });
}
