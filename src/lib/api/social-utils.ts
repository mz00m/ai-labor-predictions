/**
 * Shared utilities for social media fetchers.
 * Provides URL extraction, research-domain detection, rate limiting,
 * and common search queries used across Reddit, Bluesky, Twitter, and web search.
 */

export interface SocialPost {
  id: string;
  platform: "reddit" | "bluesky" | "twitter" | "web_search";
  author: string;
  text: string;
  url: string;
  publishedAt: string;
  engagementScore: number;
  linkedUrls: string[];
  subreddit?: string;
}

const URL_REGEX = /https?:\/\/[^\s)<>"\]]+/g;

export function extractUrls(text: string): string[] {
  if (!text) return [];
  const matches = text.match(URL_REGEX);
  if (!matches) return [];
  // Clean trailing punctuation that might be captured
  return Array.from(new Set(matches.map((u) => u.replace(/[.,;:!?)]+$/, ""))));
}

const RESEARCH_DOMAINS = [
  "arxiv.org",
  "nber.org",
  "ssrn.com",
  "doi.org",
  "brookings.edu",
  "imf.org",
  "ilo.org",
  "mckinsey.com",
  "weforum.org",
  "oecd.org",
  "rand.org",
  "worldbank.org",
  "bls.gov",
  "census.gov",
  "whitehouse.gov",
  "nature.com",
  "science.org",
  "sciencedirect.com",
  "springer.com",
  "wiley.com",
  "jstor.org",
  "pnas.org",
  "aeaweb.org",
];

export function isResearchUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  // Check known research domains
  if (RESEARCH_DOMAINS.some((d) => lower.includes(d))) return true;
  // Check .edu and .gov TLDs
  if (/https?:\/\/[^/]*\.edu(\/|$)/.test(lower)) return true;
  if (/https?:\/\/[^/]*\.gov(\/|$)/.test(lower)) return true;
  return false;
}

export function rateLimit(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncateText(text: string, maxLength = 500): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3) + "...";
}

export const SOCIAL_SEARCH_QUERIES = [
  "AI labor market",
  "AI job displacement",
  "AI automation employment",
  "generative AI workforce",
];
