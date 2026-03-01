/**
 * Reddit fetcher for AI + labor market discussions.
 * Uses unauthenticated JSON API (no API key needed).
 * Multi-subreddit search keeps requests to 4 total (~25s with rate limiting).
 */

import {
  extractUrls,
  rateLimit,
  SOCIAL_SEARCH_QUERIES,
} from "./social-utils";

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  numComments: number;
  permalink: string;
  linkedUrl: string | null;
  createdUtc: number;
  linkedUrls: string[];
}

const TARGET_SUBREDDITS = [
  "MachineLearning",
  "artificial",
  "economics",
  "datascience",
  "singularity",
  "Futurology",
];

const MULTI_SUB = TARGET_SUBREDDITS.join("+");

// 10 req/min for unauthenticated access → 6.1s between requests
const RATE_LIMIT_MS = 6100;
const MIN_SCORE = 10;

function parseRedditListing(json: unknown): RedditPost[] {
  const data = json as { data?: { children?: Array<{ data: Record<string, unknown> }> } };
  if (!data?.data?.children) return [];

  return data.data.children
    .filter((child) => child.data && child.data.title)
    .map((child) => {
      const d = child.data;
      const selftext = (d.selftext as string) || "";
      const linkedUrl =
        d.url && typeof d.url === "string" && !d.url.includes("reddit.com")
          ? d.url
          : null;
      const allText = `${selftext} ${linkedUrl || ""}`;

      return {
        id: d.id as string,
        title: d.title as string,
        selftext,
        author: (d.author as string) || "[deleted]",
        subreddit: (d.subreddit as string) || "",
        score: (d.score as number) || 0,
        numComments: (d.num_comments as number) || 0,
        permalink: (d.permalink as string) || "",
        linkedUrl,
        createdUtc: (d.created_utc as number) || 0,
        linkedUrls: extractUrls(allText),
      };
    });
}

export async function discoverRedditPosts(
  maxResults = 60
): Promise<RedditPost[]> {
  const seen = new Set<string>();
  const allPosts: RedditPost[] = [];

  for (let i = 0; i < SOCIAL_SEARCH_QUERIES.length; i++) {
    if (i > 0) await rateLimit(RATE_LIMIT_MS);

    const query = encodeURIComponent(SOCIAL_SEARCH_QUERIES[i]);
    const url = `https://www.reddit.com/r/${MULTI_SUB}/search.json?q=${query}&sort=new&t=month&limit=25&restrict_sr=1`;

    try {
      const resp = await fetch(url, {
        headers: { "User-Agent": "jobsdata.ai-research-bot/1.0" },
      });
      if (!resp.ok) {
        console.error(`Reddit search failed (${resp.status}): ${SOCIAL_SEARCH_QUERIES[i]}`);
        continue;
      }
      const json = await resp.json();
      const posts = parseRedditListing(json);

      for (const post of posts) {
        if (!seen.has(post.id) && post.score >= MIN_SCORE) {
          seen.add(post.id);
          allPosts.push(post);
        }
      }
    } catch (err) {
      console.error(`Reddit fetch error: ${SOCIAL_SEARCH_QUERIES[i]}`, err);
    }
  }

  // Sort by score descending, take top N
  allPosts.sort((a, b) => b.score - a.score);
  return allPosts.slice(0, maxResults);
}
