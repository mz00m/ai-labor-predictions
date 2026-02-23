import { isAfter, subDays } from "date-fns";

export interface TickerHeadline {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string; // ISO string
  sentiment: "displacement" | "advancement" | "neutral";
}

interface RawHeadline {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

// ---------------------------------------------------------------------------
// Sentiment classification
// ---------------------------------------------------------------------------

const DISPLACEMENT_KEYWORDS = [
  "layoff", "lay off", "laid off", "laying off",
  "job loss", "jobs lost", "job cuts", "job cut",
  "cutting jobs", "cut jobs", "cuts jobs",
  "eliminate jobs", "eliminating jobs", "eliminated jobs",
  "eliminate roles", "eliminating roles",
  "downsizing", "downsize",
  "restructuring", "workforce reduction",
  "headcount reduction", "headcount cut",
  "replaced by ai", "replace workers", "replacing workers",
  "replacing humans", "replace humans",
  "obsolete", "redundancies",
  "displacement", "displaced",
  "fewer jobs", "fewer workers",
  "hiring freeze", "freezes hiring",
  "mass layoff",
  "job loss",
  "unemployment",
  "decline in jobs",
  "slash", "slashing",
  "automate away",
  "wipe out",
  "at risk",
  "threatens",
];

const ADVANCEMENT_KEYWORDS = [
  "productivity", "productivity gain", "productivity boost",
  "augment", "augmenting", "augmentation",
  "new jobs", "job creation", "job growth", "creating jobs",
  "new roles", "new positions",
  "hiring for ai", "hiring ai",
  "upskilling", "reskilling", "upskill", "reskill",
  "wage premium", "salary increase", "higher wages", "wage growth",
  "opportunity", "opportunities",
  "complement", "complementing",
  "empower", "empowering",
  "efficiency", "efficient",
  "boost", "boosting",
  "investment in ai", "investing in ai",
  "expansion", "expanding",
  "economic growth",
  "ship faster",
  "ai adoption", "adopting ai",
  "breakthrough",
  "transform",
];

export function classifySentiment(
  title: string
): "displacement" | "advancement" | "neutral" {
  const lower = title.toLowerCase();

  let displacementScore = 0;
  let advancementScore = 0;

  for (const kw of DISPLACEMENT_KEYWORDS) {
    if (lower.includes(kw)) displacementScore += 2;
  }
  for (const kw of ADVANCEMENT_KEYWORDS) {
    if (lower.includes(kw)) advancementScore += 2;
  }

  if (displacementScore > advancementScore && displacementScore >= 2)
    return "displacement";
  if (advancementScore > displacementScore && advancementScore >= 2)
    return "advancement";
  return "neutral";
}

// ---------------------------------------------------------------------------
// RSS XML parsing
// ---------------------------------------------------------------------------

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataRegex = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return decodeHtmlEntities(cdataMatch[1].trim());

  // Handle regular text
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? decodeHtmlEntities(match[1].trim()) : "";
}

export function parseGoogleNewsRss(xml: string): RawHeadline[] {
  const headlines: RawHeadline[] = [];

  // Split on <item> tags
  const items = xml.split(/<item>/i).slice(1);

  for (const item of items) {
    const rawTitle = extractTag(item, "title");
    const link = extractTag(item, "link");
    const pubDate = extractTag(item, "pubDate");
    const source = extractTag(item, "source");

    if (!rawTitle || !link) continue;

    // Google News titles often end with " - SourceName", strip if we have <source>
    let title = rawTitle;
    if (source) {
      const suffix = ` - ${source}`;
      if (title.endsWith(suffix)) {
        title = title.slice(0, -suffix.length);
      }
    }

    headlines.push({
      title,
      link,
      source: source || "News",
      pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }

  return headlines;
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

export function deduplicateHeadlines(headlines: RawHeadline[]): RawHeadline[] {
  const seen = new Map<string, RawHeadline>();
  for (const h of headlines) {
    const normalized = h.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 80);
    if (!seen.has(normalized)) {
      seen.set(normalized, h);
    }
  }
  return Array.from(seen.values());
}

// ---------------------------------------------------------------------------
// Date filtering
// ---------------------------------------------------------------------------

export function isWithinDays(dateStr: string, days: number): boolean {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    return isAfter(date, subDays(new Date(), days));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Stable ID generation
// ---------------------------------------------------------------------------

export function generateId(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `ticker-${Math.abs(hash).toString(36)}`;
}
