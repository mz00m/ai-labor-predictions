/**
 * Bluesky fetcher for AI + labor market discussions.
 * Uses the public AT Protocol search API (no authentication needed).
 */

import {
  extractUrls,
  rateLimit,
  SOCIAL_SEARCH_QUERIES,
} from "./social-utils";

export interface BlueskyPost {
  uri: string;
  cid: string;
  authorHandle: string;
  authorDisplayName: string;
  text: string;
  createdAt: string;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  url: string;
  linkedUrls: string[];
}

const BSKY_SEARCH_BASE =
  "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts";

const SEARCH_QUERIES = [
  ...SOCIAL_SEARCH_QUERIES,
  "LLM employment impact",
];

const RATE_LIMIT_MS = 2000;
const MIN_ENGAGEMENT = 5;

function rkeyFromUri(uri: string): string {
  // at://did:plc:xxx/app.bsky.feed.post/rkey → rkey
  const parts = uri.split("/");
  return parts[parts.length - 1] || "";
}

function parseBskyResponse(json: unknown): BlueskyPost[] {
  const data = json as { posts?: Array<Record<string, unknown>> };
  if (!data?.posts) return [];

  return data.posts.map((post) => {
    const author = post.author as Record<string, string> | undefined;
    const handle = author?.handle || "";
    const displayName = author?.displayName || handle;
    const record = post.record as Record<string, unknown> | undefined;
    const text = (record?.text as string) || "";
    const createdAt = (record?.createdAt as string) || "";
    const uri = (post.uri as string) || "";
    const cid = (post.cid as string) || "";
    const rkey = rkeyFromUri(uri);

    return {
      uri,
      cid,
      authorHandle: handle,
      authorDisplayName: displayName,
      text,
      createdAt,
      likeCount: (post.likeCount as number) || 0,
      repostCount: (post.repostCount as number) || 0,
      replyCount: (post.replyCount as number) || 0,
      url: handle && rkey
        ? `https://bsky.app/profile/${handle}/post/${rkey}`
        : "",
      linkedUrls: extractUrls(text),
    };
  });
}

export async function discoverBlueskyPosts(
  maxResults = 50
): Promise<BlueskyPost[]> {
  const seen = new Set<string>();
  const allPosts: BlueskyPost[] = [];

  for (let i = 0; i < SEARCH_QUERIES.length; i++) {
    if (i > 0) await rateLimit(RATE_LIMIT_MS);

    const query = encodeURIComponent(SEARCH_QUERIES[i]);
    const url = `${BSKY_SEARCH_BASE}?q=${query}&limit=25&sort=latest`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.error(`Bluesky search failed (${resp.status}): ${SEARCH_QUERIES[i]}`);
        continue;
      }
      const json = await resp.json();
      const posts = parseBskyResponse(json);

      for (const post of posts) {
        const engagement = post.likeCount + post.repostCount;
        if (!seen.has(post.uri) && engagement >= MIN_ENGAGEMENT) {
          seen.add(post.uri);
          allPosts.push(post);
        }
      }
    } catch (err) {
      console.error(`Bluesky fetch error: ${SEARCH_QUERIES[i]}`, err);
    }
  }

  // Sort by engagement descending
  allPosts.sort(
    (a, b) =>
      b.likeCount + b.repostCount - (a.likeCount + a.repostCount)
  );
  return allPosts.slice(0, maxResults);
}
