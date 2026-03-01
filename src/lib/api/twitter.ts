/**
 * Twitter/X fetcher for AI + labor market discussions.
 * Uses API v2 recent search (requires TWITTER_BEARER_TOKEN).
 * Fully optional — returns [] if no token is configured.
 */

import { extractUrls, rateLimit, SOCIAL_SEARCH_QUERIES } from "./social-utils";

export interface TwitterPost {
  id: string;
  text: string;
  authorId: string;
  authorUsername: string;
  authorName: string;
  createdAt: string;
  url: string;
  metrics: {
    likeCount: number;
    retweetCount: number;
    replyCount: number;
    impressionCount: number;
  };
  linkedUrls: string[];
}

const TWITTER_BEARER = process.env.TWITTER_BEARER_TOKEN || "";
const TWITTER_SEARCH_BASE = "https://api.twitter.com/2/tweets/search/recent";

const SEARCH_QUERIES = SOCIAL_SEARCH_QUERIES.map((q) => `${q} -is:retweet`);

const RATE_LIMIT_MS = 1100;
const MIN_ENGAGEMENT = 10;

function parseTwitterResponse(
  json: unknown
): TwitterPost[] {
  const data = json as {
    data?: Array<Record<string, unknown>>;
    includes?: { users?: Array<Record<string, string>> };
  };
  if (!data?.data) return [];

  const userMap = new Map<string, { username: string; name: string }>();
  if (data.includes?.users) {
    for (const user of data.includes.users) {
      userMap.set(user.id, {
        username: user.username || "",
        name: user.name || "",
      });
    }
  }

  return data.data.map((tweet) => {
    const id = (tweet.id as string) || "";
    const text = (tweet.text as string) || "";
    const authorId = (tweet.author_id as string) || "";
    const createdAt = (tweet.created_at as string) || "";
    const metrics = (tweet.public_metrics as Record<string, number>) || {};
    const entities = tweet.entities as { urls?: Array<{ expanded_url: string }> } | undefined;
    const user = userMap.get(authorId);

    // Extract URLs from entities (more reliable than regex)
    const entityUrls = entities?.urls?.map((u) => u.expanded_url) || [];
    // Also extract from text as fallback
    const textUrls = extractUrls(text);
    const allUrls = Array.from(new Set([...entityUrls, ...textUrls]));

    return {
      id,
      text,
      authorId,
      authorUsername: user?.username || "",
      authorName: user?.name || "",
      createdAt,
      url: user?.username
        ? `https://x.com/${user.username}/status/${id}`
        : `https://x.com/i/status/${id}`,
      metrics: {
        likeCount: metrics.like_count || 0,
        retweetCount: metrics.retweet_count || 0,
        replyCount: metrics.reply_count || 0,
        impressionCount: metrics.impression_count || 0,
      },
      linkedUrls: allUrls,
    };
  });
}

export async function discoverTwitterPosts(
  maxResults = 50
): Promise<TwitterPost[]> {
  if (!TWITTER_BEARER) return [];

  const seen = new Set<string>();
  const allPosts: TwitterPost[] = [];

  for (let i = 0; i < SEARCH_QUERIES.length; i++) {
    if (i > 0) await rateLimit(RATE_LIMIT_MS);

    const query = encodeURIComponent(SEARCH_QUERIES[i]);
    const url = `${TWITTER_SEARCH_BASE}?query=${query}&max_results=25&tweet.fields=created_at,public_metrics,entities,author_id&expansions=author_id&user.fields=username,name`;

    try {
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${TWITTER_BEARER}` },
      });
      if (!resp.ok) {
        console.error(`Twitter search failed (${resp.status}): ${SEARCH_QUERIES[i]}`);
        continue;
      }
      const json = await resp.json();
      const posts = parseTwitterResponse(json);

      for (const post of posts) {
        const engagement = post.metrics.likeCount + post.metrics.retweetCount;
        if (!seen.has(post.id) && engagement >= MIN_ENGAGEMENT) {
          seen.add(post.id);
          allPosts.push(post);
        }
      }
    } catch (err) {
      console.error(`Twitter fetch error: ${SEARCH_QUERIES[i]}`, err);
    }
  }

  // Sort by engagement descending
  allPosts.sort(
    (a, b) =>
      b.metrics.likeCount + b.metrics.retweetCount -
      (a.metrics.likeCount + a.metrics.retweetCount)
  );
  return allPosts.slice(0, maxResults);
}
