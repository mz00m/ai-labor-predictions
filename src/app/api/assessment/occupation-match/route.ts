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
    "top-executives",
    "food-service-managers",
    "property-real-estate-and-community-association-managers",
    "sales-managers",
    "construction-managers",
  ],
  founder: ["top-executives"],
  ceo: ["top-executives"],
  entrepreneur: ["top-executives"],
  "small business": ["top-executives", "food-service-managers"],
  freelancer: ["graphic-designers", "web-developers", "writers-and-authors", "editors"],
  freelance: ["graphic-designers", "web-developers", "writers-and-authors", "editors"],
  contractor: ["construction-managers", "top-executives"],
  consultant: ["management-analysts", "top-executives"],
  solopreneur: ["top-executives"],
  "executive director": ["top-executives", "social-and-community-service-managers"],
  director: ["top-executives"],
  vp: ["top-executives"],
  "vice president": ["top-executives"],
  cfo: ["financial-managers", "top-executives"],
  cto: ["computer-and-information-systems-managers", "top-executives"],
  coo: ["top-executives"],
  "chief officer": ["top-executives"],
  "program officer": ["top-executives", "social-and-community-service-managers"],
  "program manager": ["top-executives", "social-and-community-service-managers"],
  "program director": ["top-executives", "social-and-community-service-managers"],
  administrator: ["administrative-services-managers", "top-executives"],
  coordinator: ["social-and-community-service-managers", "top-executives"],
  superintendent: ["elementary-middle-and-high-school-principals"],
  principal: ["elementary-middle-and-high-school-principals"],
  dean: ["postsecondary-education-administrators"],

  // Food / hospitality
  bakery: ["bakers", "food-service-managers"],
  restaurant: ["food-service-managers", "cooks", "waiters-and-waitresses"],
  chef: ["chefs-and-head-cooks", "cooks"],
  barista: ["food-and-beverage-serving-and-related-workers"],
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
  artist: ["craft-and-fine-artists"],
  illustrator: ["craft-and-fine-artists"],
  musician: ["musicians-and-singers"],
  journalist: ["reporters-correspondents-and-broadcast-news-analysts", "editors"],
  blogger: ["writers-and-authors"],
  copywriter: ["writers-and-authors", "advertising-promotions-and-marketing-managers"],

  // Healthcare
  doctor: ["physicians-and-surgeons"],
  physician: ["physicians-and-surgeons"],
  nurse: ["registered-nurses"],
  dentist: ["dentists"],
  therapist: ["substance-abuse-behavioral-disorder-and-mental-health-counselors", "physical-therapists"],
  pharmacist: ["pharmacists"],
  vet: ["veterinarians"],
  veterinarian: ["veterinarians"],

  // Education
  teacher: ["kindergarten-and-elementary-school-teachers", "high-school-teachers"],
  professor: ["postsecondary-teachers"],
  tutor: ["kindergarten-and-elementary-school-teachers"],
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
  salesperson: ["wholesale-and-manufacturing-sales-representatives"],
  "sales rep": ["wholesale-and-manufacturing-sales-representatives"],
  marketer: ["advertising-promotions-and-marketing-managers", "market-research-analysts"],
  realtor: ["real-estate-brokers-and-sales-agents"],
  "real estate agent": ["real-estate-brokers-and-sales-agents"],
  recruiter: ["human-resources-specialists"],

  // Admin / office
  receptionist: ["receptionists"],
  secretary: ["secretaries-and-administrative-assistants"],
  "office manager": ["administrative-services-managers"],
  assistant: ["secretaries-and-administrative-assistants"],
  "executive assistant": ["secretaries-and-administrative-assistants"],

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
  scientist: ["data-scientists", "natural-sciences-managers"],
  researcher: ["data-scientists", "survey-researchers"],
  hr: ["human-resources-specialists", "human-resources-managers"],
  "project manager": ["management-analysts", "top-executives"],
  "product manager": ["management-analysts", "top-executives"],
  analyst: ["management-analysts", "financial-analysts", "market-research-analysts"],
};

// Build a slug→occupation lookup for fast alias resolution
const occupationBySlug = new Map(occupations.map((o) => [o.slug, o]));

// ---------------------------------------------------------------------------
// Industry → occupation-category map. The intake form collects `industry`
// as an IndustryCategory enum; we use it to bias matching toward the
// occupation categories that actually exist in that sector.
// ---------------------------------------------------------------------------

const INDUSTRY_TO_CATEGORIES: Record<string, string[]> = {
  "nonprofit": ["community-and-social-service", "management", "office-and-administrative-support"],
  "restaurant-hospitality": ["food-preparation-and-serving", "personal-care-and-service", "management"],
  "manufacturing": ["production", "installation-maintenance-and-repair", "architecture-and-engineering", "transportation-and-material-moving"],
  "healthcare": ["healthcare", "office-and-administrative-support", "community-and-social-service"],
  "retail": ["sales", "office-and-administrative-support", "management"],
  "professional-services": ["business-and-financial", "management", "office-and-administrative-support", "computer-and-information-technology"],
  "accounting-finance": ["business-and-financial", "office-and-administrative-support", "management"],
  "legal": ["legal", "office-and-administrative-support"],
  "education": ["education-training-and-library", "management", "community-and-social-service", "office-and-administrative-support"],
  "construction": ["construction-and-extraction", "architecture-and-engineering", "installation-maintenance-and-repair"],
  "real-estate": ["sales", "business-and-financial", "management"],
  "technology": ["computer-and-information-technology", "math", "management", "architecture-and-engineering"],
  "media-marketing": ["media-and-communication", "arts-and-design", "sales"],
  "logistics-transportation": ["transportation-and-material-moving", "management", "office-and-administrative-support"],
  "agriculture": ["farming-fishing-and-forestry", "production", "management"],
  "government": ["management", "community-and-social-service", "protective-service", "legal", "office-and-administrative-support"],
  "other": [],
};

function sectorCategorySet(sector: string | null): Set<string> | null {
  if (!sector) return null;
  const cats = INDUSTRY_TO_CATEGORIES[sector];
  if (!cats || cats.length === 0) return null;
  return new Set(cats);
}

// ---------------------------------------------------------------------------
// Category keyword map: informal sector/industry terms → enriched categories
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  nonprofit: ["community-and-social-service", "management"],
  "non-profit": ["community-and-social-service", "management"],
  charity: ["community-and-social-service"],
  foundation: ["community-and-social-service", "management"],
  ngo: ["community-and-social-service"],
  "social services": ["community-and-social-service"],
  tech: ["computer-and-information-technology"],
  technology: ["computer-and-information-technology"],
  software: ["computer-and-information-technology"],
  it: ["computer-and-information-technology"],
  healthcare: ["healthcare"],
  medical: ["healthcare"],
  hospital: ["healthcare"],
  clinical: ["healthcare"],
  finance: ["business-and-financial"],
  banking: ["business-and-financial"],
  accounting: ["business-and-financial"],
  insurance: ["business-and-financial"],
  education: ["education-training-and-library"],
  school: ["education-training-and-library"],
  university: ["education-training-and-library"],
  academic: ["education-training-and-library"],
  legal: ["legal"],
  law: ["legal"],
  media: ["media-and-communication"],
  journalism: ["media-and-communication"],
  publishing: ["media-and-communication"],
  marketing: ["sales", "media-and-communication"],
  advertising: ["sales", "media-and-communication"],
  retail: ["sales"],
  restaurant: ["food-preparation-and-serving"],
  hospitality: ["food-preparation-and-serving", "personal-care-and-service"],
  food: ["food-preparation-and-serving"],
  construction: ["construction-and-extraction"],
  manufacturing: ["production"],
  logistics: ["transportation-and-material-moving"],
  transportation: ["transportation-and-material-moving"],
  government: ["management", "community-and-social-service"],
  military: ["military"],
  "real estate": ["sales", "business-and-financial"],
  agriculture: ["farming-fishing-and-forestry"],
  farming: ["farming-fishing-and-forestry"],
  design: ["arts-and-design"],
  creative: ["arts-and-design", "media-and-communication"],
  science: ["life-physical-and-social-science"],
  research: ["life-physical-and-social-science"],
  engineering: ["architecture-and-engineering"],
  security: ["protective-service"],
  administration: ["office-and-administrative-support"],
  office: ["office-and-administrative-support"],
  clerical: ["office-and-administrative-support"],
  maintenance: ["installation-maintenance-and-repair"],
  entertainment: ["entertainment-and-sports"],
  sports: ["entertainment-and-sports"],
};

// ---------------------------------------------------------------------------
// Broad token fallback: match query words against occupation title words,
// optionally scoped to categories inferred from sector keywords.
// ---------------------------------------------------------------------------

// Common words to ignore when token-matching
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "of", "and", "for", "to", "at", "on", "by",
  "my", "i", "am", "is", "are", "with", "from", "or", "as", "sector",
  "industry", "field", "area", "work", "job", "role", "position",
]);

function broadTokenSearch(queryLower: string, sectorCats: Set<string> | null): typeof occupations {
  const tokens = queryLower.split(/\s+/).filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
  if (tokens.length === 0) return [];

  // Detect category hints from the query
  const categorySet = new Set<string>();
  for (const token of tokens) {
    const cats = CATEGORY_KEYWORDS[token];
    if (cats) for (const c of cats) categorySet.add(c);
  }
  // Also check multi-word category keywords
  for (const [kw, cats] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kw.includes(" ") && queryLower.includes(kw)) {
      for (const c of cats) categorySet.add(c);
    }
  }

  // Merge sector-derived categories so the user's selected industry
  // narrows the candidate pool even when the query has no sector keyword.
  if (sectorCats) {
    sectorCats.forEach((c) => categorySet.add(c));
  }

  const pool = categorySet.size > 0
    ? occupations.filter((o) => categorySet.has(o.category))
    : occupations;

  // Title-word tokens that aren't category/stop words
  const matchTokens = tokens.filter((t) => !CATEGORY_KEYWORDS[t]);
  if (matchTokens.length === 0 && categorySet.size > 0) {
    // Only sector keywords, no role words — return top occupations from matched categories
    return pool
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 5);
  }

  // Score each occupation by how many query tokens appear in its title words
  const scored = pool.map((o) => {
    const titleWords = o.titleLower.split(/[\s,&()-]+/).filter(Boolean);
    let hits = 0;
    for (const token of matchTokens) {
      if (titleWords.some((w) => w.startsWith(token) || token.startsWith(w))) {
        hits++;
      }
    }
    return { occ: o, hits };
  }).filter((x) => x.hits > 0);

  if (scored.length === 0 && categorySet.size > 0) {
    // No title matches but we have category context — return top category occupations
    return pool
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 5);
  }

  return scored
    .sort((a, b) => b.hits - a.hits || b.occ.exposure - a.occ.exposure)
    .slice(0, 5)
    .map((x) => x.occ);
}

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
  const sector = request.nextUrl.searchParams.get("sector")?.trim() || null;

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const queryLower = q.toLowerCase();
  const sectorCats = sectorCategorySet(sector);

  // Sector-aware boost: nudge in-sector occupations up when the user has
  // already told us their industry. Generic titles like "manager" or
  // "director" otherwise collapse to top-executives across every sector.
  const sectorBoost = (cat: string) => (sectorCats && sectorCats.has(cat) ? 15 : 0);

  // First: try direct title matching
  const scored = occupations
    .map((o) => {
      const base = scoreMatch(o.titleLower, queryLower);
      if (base <= 0) return { occ: o, score: -1 };
      return { occ: o, score: base + sectorBoost(o.category) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.occ.exposure - a.occ.exposure)
    .slice(0, 5);

  // Fallback 1: if no direct matches, try synonym/alias lookup
  let finalScored = scored;
  if (scored.length === 0) {
    const aliasHits = aliasSearch(queryLower);
    finalScored = aliasHits
      .map((occ) => ({ occ, score: 30 + sectorBoost(occ.category) }))
      .sort((a, b) => b.score - a.score || b.occ.exposure - a.occ.exposure)
      .slice(0, 5);
  }

  // Fallback 2: if still nothing, try broad token + category matching
  if (finalScored.length === 0) {
    const broadHits = broadTokenSearch(queryLower, sectorCats);
    finalScored = broadHits.map((occ) => ({ occ, score: 15 + sectorBoost(occ.category) }));
  }

  // Fallback 3: still nothing but we know the sector — return the top
  // occupations in that sector by exposure so the user can pick the
  // closest analogue rather than seeing an empty result.
  if (finalScored.length === 0 && sectorCats) {
    finalScored = occupations
      .filter((o) => sectorCats.has(o.category))
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 5)
      .map((occ) => ({ occ, score: 5 }));
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
