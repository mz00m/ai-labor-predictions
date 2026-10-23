/**
 * Regional lookup for the chatbot. When a question names a state, metro or
 * county (or asks about "my area"), pull that region's figures from the same
 * files that power /map and hand the model an exact deep link, so it answers
 * from the site's own regional data instead of saying the site has none.
 */

import stateRiskData from "@/data/risk/state-risk.json";
import countyRiskData from "@/data/risk/county-risk.json";
import msaSummaryData from "@/data/regional/msa-summary.json";

interface ArchetypeMix {
  "automation-risk"?: number;
  reorganize?: number;
  grow?: number;
  "less-change"?: number;
}

interface StateRow {
  fips: string;
  abbr: string;
  title: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  archetypeMix?: ArchetypeMix;
  topRiskOccupations?: { title: string; employment: number; netRisk100: number }[];
}

interface MetroRow {
  cbsa: string;
  title: string;
  primState: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  archetypeMix?: ArchetypeMix;
  sectors?: { category: string; share: number; weightedNetRisk100: number }[];
  topRiskOccupations?: { title: string; employment: number; netRisk100: number }[];
}

interface CountyRow {
  fips: string;
  name: string;
  stateFips: string;
  totalEmployment: number;
  weightedNetRisk100: number;
  archetypeMix?: ArchetypeMix;
  topGroups?: { slug: string; share: number; netRisk100: number }[];
}

const STATES = (stateRiskData as unknown as { states: StateRow[] }).states;
const METROS = (msaSummaryData as unknown as { areas: MetroRow[]; source: string }).areas;
const METRO_SOURCE = (msaSummaryData as unknown as { source: string }).source;
const COUNTY_FILE = countyRiskData as unknown as { counties: CountyRow[]; vintage: string };
const COUNTIES = COUNTY_FILE.counties;

const MAP_URL = "https://jobsdata.ai/map";
const MAX_MATCHES = 4;

const REGIONAL_INTENT = [
  "my region", "my regions", "my area", "my state", "my city", "my county", "my town", "where i live",
  "local", "region", "regions", "regional", "county", "counties", "metro", "city", "cities",
  "state-level", "by state", "map",
];

// Two-letter abbreviations that are also common words; only trust them after a comma ("Portland, OR").
const AMBIGUOUS_ABBRS = new Set(["IN", "OR", "ME", "OK", "HI", "OH", "AL", "PA", "MA", "DE", "CO", "LA"]);

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const METRO_MEDIAN = median(METROS.map((m) => m.weightedNetRisk100));
const COUNTY_MEDIAN = median(COUNTIES.map((c) => c.weightedNetRisk100));
const STATE_MEDIAN = median(STATES.map((s) => s.weightedNetRisk100));

function hasWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`).test(haystack);
}

function pct(x: number | undefined): string {
  return x == null ? "n/a" : `${Math.round(x * 100)}%`;
}

function prettySlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\band\b/g, "&");
}

/** States the query names, by full name or an unambiguous postal code. */
function matchStates(query: string, lower: string): StateRow[] {
  const found = new Map<string, StateRow>();
  for (const s of STATES) {
    if (hasWord(lower, s.title.toLowerCase())) found.set(s.fips, s);
  }
  // "Harrisonburg, Va" / "Portland, OR": any case after a comma; bare codes only in capitals.
  for (const m of Array.from(query.matchAll(/(,\s*)?\b([A-Za-z]{2})\b/g))) {
    const afterComma = Boolean(m[1]);
    const raw = m[2];
    if (!afterComma && raw !== raw.toUpperCase()) continue;
    const abbr = raw.toUpperCase();
    if (AMBIGUOUS_ABBRS.has(abbr)) {
      // "Portland, OR?" yes; "Hi, in my county" no.
      const rest = query.slice((m.index ?? 0) + m[0].length);
      if (!afterComma || !/^\s*($|[?.!,;)]|and\b|&)/i.test(rest)) continue;
    }
    const s = STATES.find((x) => x.abbr === abbr);
    if (s) found.set(s.fips, s);
  }
  return Array.from(found.values());
}

function matchMetros(lower: string, states: StateRow[]): MetroRow[] {
  const abbrs = new Set(states.map((s) => s.abbr));
  const hits = METROS.filter((m) => {
    const cities = m.title.split(",")[0].split("-").map((c) => c.trim().toLowerCase());
    if (!cities.some((c) => c.length >= 4 && hasWord(lower, c))) return false;
    if (abbrs.size === 0) return true;
    const metroStates = (m.title.split(",")[1] ?? m.primState).trim().split("-");
    return metroStates.some((a) => abbrs.has(a));
  });
  return hits.slice(0, MAX_MATCHES);
}

function matchCounties(lower: string, states: StateRow[]): CountyRow[] {
  const fipsSet = new Set(states.map((s) => s.fips));
  const hits = COUNTIES.filter((c) => {
    const local = c.name.split(",")[0].toLowerCase(); // "rockingham county", "harrisonburg city"
    const base = local.replace(/\s+(county|parish|borough|census area|municipality|city and borough|city)$/, "");
    if (base.length < 4) return false;
    const named =
      hasWord(lower, local) ||
      hasWord(lower, `${base} co`) ||
      hasWord(lower, `${base} co.`) ||
      // Independent cities ("Harrisonburg city") only when a state is named, to avoid noise.
      (local.endsWith(" city") && fipsSet.size > 0 && hasWord(lower, base));
    if (!named) return false;
    return fipsSet.size === 0 || fipsSet.has(c.stateFips);
  });
  return hits.slice(0, MAX_MATCHES);
}

function formatState(s: StateRow): string {
  const top = (s.topRiskOccupations ?? []).slice(0, 3).map((o) => `${o.title} (${o.netRisk100})`).join("; ");
  return `- State: ${s.title}: AI labor pressure ${s.weightedNetRisk100}/100 (state median ${STATE_MEDIAN}); ${pct(s.archetypeMix?.["automation-risk"])} of jobs in automation-risk occupations; ${s.totalEmployment.toLocaleString("en-US")} jobs. Highest-risk occupations: ${top || "n/a"}. Link: ${MAP_URL}?view=country&id=${s.fips}`;
}

function formatMetro(m: MetroRow): string {
  const sectors = [...(m.sectors ?? [])].sort((a, b) => b.share - a.share).slice(0, 2).map((x) => `${prettySlug(x.category)} ${Math.round(x.share)}% of jobs (risk ${x.weightedNetRisk100})`).join("; ");
  return `- Metro area: ${m.title}: AI labor pressure ${m.weightedNetRisk100}/100 (US metro median ${METRO_MEDIAN}); ${pct(m.archetypeMix?.["automation-risk"])} of jobs in automation-risk occupations, ${pct(m.archetypeMix?.["less-change"])} in less-change occupations; ${m.totalEmployment.toLocaleString("en-US")} jobs. Largest sectors: ${sectors || "n/a"}. Link: ${MAP_URL}?view=metro&id=${m.cbsa}`;
}

function formatCounty(c: CountyRow): string {
  const groups = [...(c.topGroups ?? [])].sort((a, b) => b.share - a.share).slice(0, 3).map((g) => `${prettySlug(g.slug)} ${Math.round(g.share)}%`).join("; ");
  return `- County: ${c.name}: AI labor pressure ${c.weightedNetRisk100}/100 (US county median ${COUNTY_MEDIAN}); ${pct(c.archetypeMix?.["automation-risk"])} of jobs in automation-risk occupations; ${c.totalEmployment.toLocaleString("en-US")} employed residents. Largest occupation groups: ${groups || "n/a"}. Link: ${MAP_URL}?view=county&id=${c.fips}`;
}

/**
 * Returns a context block for regional questions, or null when the query is
 * not about a place.
 */
export function buildRegionalContext(query: string): string | null {
  const lower = query.toLowerCase();
  const states = matchStates(query, lower);
  const intent = REGIONAL_INTENT.some((kw) => hasWord(lower, kw));
  // City and county names collide with ordinary words ("Mobile", "Orange"), so
  // only look for them when the question names a state or asks about a place.
  const placeQuestion = intent || states.length > 0;
  const metros = placeQuestion ? matchMetros(lower, states) : [];
  const counties = placeQuestion ? matchCounties(lower, states) : [];

  if (!intent && states.length === 0 && metros.length === 0 && counties.length === 0) return null;

  const lines: string[] = [
    "# Regional Data (the /map risk map)",
    `The site HAS regional data. Never tell a user it lacks a regional or local view. [Risk map](${MAP_URL}) shows AI labor pressure for all ${STATES.length} states plus DC, ${METROS.length} metro areas, and ${COUNTIES.length.toLocaleString("en-US")} counties. The score (0-100) is the employment-weighted average of each occupation's net AI risk; higher means more of the local workforce is in occupations where AI substitutes for core tasks. States and metros use ${METRO_SOURCE}. Counties use ${COUNTY_FILE.vintage} at the broad occupation-group level, so they are coarser than metros. When a metro and its counties are both listed, lead with the metro (finer occupational detail) and mention the county.`,
    "Answer with the region's score against the median, the share of jobs in automation-risk occupations, and the main sectors, then link the region's exact map URL given below. These are exposure-based scores, not measured job losses.",
  ];

  const matched = [
    ...metros.map(formatMetro),
    ...counties.map(formatCounty),
    // A state only adds information when no finer region matched.
    ...(metros.length === 0 && counties.length === 0 ? states.slice(0, MAX_MATCHES).map(formatState) : []),
  ];

  if (matched.length > 0) {
    lines.push("Regions named in this question:", ...matched);
  } else {
    lines.push(`No specific region was matched in the question. Point the user to the [Risk map](${MAP_URL}), where they can search for their state, metro or county.`);
  }

  return lines.join("\n");
}
