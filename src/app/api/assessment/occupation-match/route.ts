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

// ---------------------------------------------------------------------------
// Synonym / alias map: common job terms → O*NET occupation slugs.
// When direct title matching fails, we check if the query matches an alias
// and return the mapped occupations with a lower relevance score.
// ---------------------------------------------------------------------------

const ALIASES: Record<string, string[]> = {
  // Business ownership / leadership
  owner: [
    "general-and-operations-managers",
    "food-service-managers",
    "property-real-estate-and-community-association-managers",
    "sales-managers",
    "construction-managers",
  ],
  founder: ["general-and-operations-managers", "chief-executives"],
  ceo: ["chief-executives"],
  entrepreneur: ["general-and-operations-managers", "chief-executives"],
  "small business": ["general-and-operations-managers", "food-service-managers"],
  freelancer: ["graphic-designers", "web-developers", "writers-and-authors", "editors"],
  freelance: ["graphic-designers", "web-developers", "writers-and-authors", "editors"],
  contractor: ["construction-managers", "general-and-operations-managers"],
  consultant: ["management-analysts", "general-and-operations-managers"],
  solopreneur: ["general-and-operations-managers"],

  // Food / hospitality
  bakery: ["bakers", "food-service-managers"],
  restaurant: ["food-service-managers", "cooks-restaurant", "waiters-and-waitresses"],
  chef: ["chefs-and-head-cooks", "cooks-restaurant"],
  barista: ["food-and-beverage-serving-workers"],
  bartender: ["bartenders"],
  waiter: ["waiters-and-waitresses"],
  waitress: ["waiters-and-waitresses"],

  // Tech
  developer: ["software-developers", "web-developers"],
  programmer: ["software-developers", "computer-programmers"],
  coder: ["software-developers", "web-developers"],
  "software engineer": ["software-developers"],
  "web developer": ["web-developers"],
  devops: ["software-developers", "computer-and-information-systems-managers"],
  "data scientist": ["data-scientists"],
  "data analyst": ["data-scientists", "management-analysts"],
  "it manager": ["computer-and-information-systems-managers"],
  sysadmin: ["network-and-computer-systems-administrators"],

  // Creative
  designer: ["graphic-designers", "web-developers"],
  writer: ["writers-and-authors", "editors"],
  photographer: ["photographers"],
  videographer: ["film-and-video-editors-and-camera-operators"],
  artist: ["fine-artists-including-painters-sculptors-and-illustrators"],
  illustrator: ["fine-artists-including-painters-sculptors-and-illustrators"],
  musician: ["musicians-and-singers"],
  journalist: ["reporters-and-correspondents", "editors"],
  blogger: ["writers-and-authors"],
  copywriter: ["writers-and-authors", "advertising-and-promotions-managers"],

  // Healthcare
  doctor: ["physicians-and-surgeons"],
  physician: ["physicians-and-surgeons"],
  nurse: ["registered-nurses"],
  dentist: ["dentists-general"],
  therapist: ["mental-health-counselors", "physical-therapists"],
  pharmacist: ["pharmacists"],
  vet: ["veterinarians"],
  veterinarian: ["veterinarians"],

  // Education
  teacher: ["elementary-school-teachers-except-special-education", "secondary-school-teachers-except-special-and-career-technical-education"],
  professor: ["postsecondary-teachers"],
  tutor: ["elementary-school-teachers-except-special-education"],
  instructor: ["postsecondary-teachers"],

  // Legal
  lawyer: ["lawyers"],
  attorney: ["lawyers"],
  paralegal: ["paralegals-and-legal-assistants"],
  "legal assistant": ["paralegals-and-legal-assistants"],

  // Finance
  accountant: ["accountants-and-auditors"],
  bookkeeper: ["bookkeeping-accounting-and-auditing-clerks"],
  "financial advisor": ["personal-financial-advisors"],
  banker: ["loan-officers", "personal-financial-advisors"],
  cpa: ["accountants-and-auditors"],
  auditor: ["accountants-and-auditors"],

  // Sales / marketing
  salesperson: ["sales-representatives-wholesale-and-manufacturing"],
  "sales rep": ["sales-representatives-wholesale-and-manufacturing"],
  marketer: ["marketing-managers", "market-research-analysts-and-marketing-specialists"],
  realtor: ["real-estate-brokers-and-sales-agents"],
  "real estate agent": ["real-estate-brokers-and-sales-agents"],
  recruiter: ["human-resources-specialists"],

  // Admin / office
  receptionist: ["receptionists-and-information-clerks"],
  secretary: ["secretaries-and-administrative-assistants-except-legal-medical-and-executive"],
  "office manager": ["administrative-services-managers"],
  assistant: ["secretaries-and-administrative-assistants-except-legal-medical-and-executive"],
  "executive assistant": ["secretaries-and-administrative-assistants-except-legal-medical-and-executive"],

  // Trades / labor
  plumber: ["plumbers-pipefitters-and-steamfitters"],
  electrician: ["electricians"],
  mechanic: ["automotive-service-technicians-and-mechanics"],
  carpenter: ["carpenters"],
  welder: ["welders-cutters-solderers-and-brazers"],
  trucker: ["heavy-and-tractor-trailer-truck-drivers"],
  "truck driver": ["heavy-and-tractor-trailer-truck-drivers"],
  driver: ["heavy-and-tractor-trailer-truck-drivers", "taxi-drivers-and-chauffeurs"],

  // Other common terms
  engineer: ["industrial-engineers", "civil-engineers", "mechanical-engineers"],
  scientist: ["data-scientists", "biological-scientists"],
  researcher: ["data-scientists", "survey-researchers"],
  hr: ["human-resources-specialists", "human-resources-managers"],
  "project manager": ["management-analysts", "general-and-operations-managers"],
  "product manager": ["management-analysts", "general-and-operations-managers"],
  analyst: ["management-analysts", "financial-analysts", "market-research-analysts-and-marketing-specialists"],
};

// Build a slug→occupation lookup for fast alias resolution
const occupationBySlug = new Map(occupations.map((o) => [o.slug, o]));

function aliasSearch(queryLower: string): typeof occupations {
  // Check exact alias match first
  const directSlugs = ALIASES[queryLower];
  if (directSlugs) {
    return directSlugs
      .map((slug) => occupationBySlug.get(slug))
      .filter((o): o is NonNullable<typeof o> => o != null);
  }

  // Check if query contains an alias as a token
  const tokens = queryLower.split(/\s+/).filter(Boolean);
  const matched = new Set<string>();
  for (const token of tokens) {
    const slugs = ALIASES[token];
    if (slugs) {
      for (const s of slugs) matched.add(s);
    }
  }

  // Also check multi-word aliases
  for (const [alias, slugs] of Object.entries(ALIASES)) {
    if (alias.includes(" ") && queryLower.includes(alias)) {
      for (const s of slugs) matched.add(s);
    }
  }

  if (matched.size > 0) {
    return Array.from(matched)
      .map((slug) => occupationBySlug.get(slug))
      .filter((o): o is NonNullable<typeof o> => o != null);
  }

  return [];
}

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

  // First: try direct title matching
  const scored = occupations
    .map((o) => ({ occ: o, score: scoreMatch(o.titleLower, queryLower) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.occ.exposure - a.occ.exposure)
    .slice(0, 5);

  // Fallback: if no direct matches, try synonym/alias lookup
  let finalScored = scored;
  if (scored.length === 0) {
    const aliasHits = aliasSearch(queryLower);
    finalScored = aliasHits
      .map((occ) => ({ occ, score: 30 })) // alias match = moderate relevance
      .sort((a, b) => b.occ.exposure - a.occ.exposure)
      .slice(0, 5);
  }

  const results: OccupationHit[] = finalScored.map(({ occ }) => ({
    slug: occ.slug,
    title: occ.title,
    category: occ.category,
    exposure: occ.exposure,
    taskBreakdown: computeTaskBreakdown(occ.taskComposition),
    timeSavingsHoursPerWeek: estimateTimeSavings(occ.exposure),
  }));

  return NextResponse.json({ results });
}
