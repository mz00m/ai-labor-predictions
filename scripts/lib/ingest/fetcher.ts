import fs from "fs";
import { parseTweetUrl, fetchTweetById } from "../../../src/lib/api/twitter";
import { browserFetch, isBrowserAvailable } from "./browser-fetcher";
import type { SourceContent } from "./types";

/** Check if a URL points to a Twitter/X post */
function isTwitterUrl(url: string): boolean {
  return /(?:twitter\.com|x\.com)\/\w+\/status(?:es)?\/\d+/.test(url);
}

/** Check if a URL points to a PDF */
function isPdfUrl(url: string): boolean {
  return /\.pdf(\?|#|$)/i.test(url);
}

/** Sites that typically need browser rendering for full content */
const BROWSER_PREFERRED_DOMAINS = [
  "nber.org",
  "sciencedirect.com",
  "springer.com",
  "wiley.com",
  "jstor.org",
  "nature.com",
  "science.org",
  "academic.oup.com",
  "tandfonline.com",
  "ssrn.com",
  "arxiv.org",
  "brookings.edu",
  "mckinsey.com",
  "imf.org",
  "worldbank.org",
  "oecd.org",
  "ft.com",
  "wsj.com",
  "bloomberg.com",
  "economist.com",
  "nytimes.com",
  "washingtonpost.com",
];

function shouldPreferBrowser(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return BROWSER_PREFERRED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    );
  } catch {
    return false;
  }
}

/**
 * Fetch source content from a URL, local file, or raw text string.
 *
 * Automatically selects the best strategy:
 *   - Twitter API v2 for Twitter/X posts
 *   - PDF parser for .pdf URLs/files
 *   - Browser (CDP) for academic journals, paywalled sites, JS-heavy pages
 *   - Plain HTTP fetch for everything else (with browser as fallback)
 *
 * Set FETCH_USE_BROWSER=1 env var to always prefer browser fetching.
 */
export async function fetchSource(
  input: string,
  mode: "url" | "file" | "text"
): Promise<SourceContent> {
  switch (mode) {
    case "file": {
      if (!fs.existsSync(input)) {
        throw new Error(`File not found: ${input}`);
      }
      // Handle PDF files directly
      if (input.toLowerCase().endsWith(".pdf")) {
        return browserFetch(input, { pdfPath: input });
      }
      const text = fs.readFileSync(input, "utf-8");
      return { text };
    }

    case "url": {
      // Use Twitter API for tweet URLs
      if (isTwitterUrl(input)) {
        return fetchTwitterSource(input);
      }

      // PDF URLs: extract directly without browser
      if (isPdfUrl(input)) {
        return browserFetch(input);
      }

      // Decide whether to use browser
      const forceBrowser = process.env.FETCH_USE_BROWSER === "1";
      const preferBrowser = shouldPreferBrowser(input);

      if (forceBrowser || preferBrowser) {
        const browserReady = await isBrowserAvailable();
        if (browserReady) {
          try {
            return await browserFetch(input);
          } catch (err) {
            console.log(
              `  Browser fetch failed, falling back to HTTP: ${err instanceof Error ? err.message : err}`
            );
          }
        } else if (preferBrowser) {
          console.log(
            `  Note: ${new URL(input).hostname} works best with browser fetching.`
          );
          console.log(
            `  Start Chrome with --remote-debugging-port=9222 for better results.`
          );
        }
      }

      // Standard HTTP fetch
      const result = await httpFetch(input);

      // If we got very little content, try browser as fallback
      if (result.text.length < 500) {
        const browserReady = await isBrowserAvailable();
        if (browserReady) {
          console.log(
            `  HTTP fetch returned only ${result.text.length} chars, trying browser...`
          );
          try {
            return await browserFetch(input);
          } catch {
            // Return the HTTP result if browser also fails
          }
        }
      }

      return result;
    }

    case "text":
    default:
      return { text: input };
  }
}

/** Standard HTTP fetch (the original fetch logic) */
async function httpFetch(input: string): Promise<SourceContent> {
  const res = await fetch(input, {
    headers: {
      "User-Agent":
        "AI-Labor-Predictions-Bot/1.0 (research-data-ingestion)",
      Accept: "text/html,application/xhtml+xml,text/plain",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} for ${input}`);
  }
  const contentType = res.headers.get("content-type") || "";
  const body = await res.text();

  if (
    contentType.includes("text/html") ||
    contentType.includes("xhtml")
  ) {
    return {
      text: stripHtml(body),
      url: input,
      title: extractTitle(body),
    };
  }
  // Plain text or other formats
  return { text: body, url: input };
}

/**
 * Fetch a Twitter/X post via the API v2 and format it as SourceContent.
 */
async function fetchTwitterSource(url: string): Promise<SourceContent> {
  const tweetId = parseTweetUrl(url);
  if (!tweetId) {
    throw new Error(`Could not parse tweet ID from URL: ${url}`);
  }

  const post = await fetchTweetById(tweetId);
  if (!post) {
    throw new Error(
      `Failed to fetch tweet ${tweetId}. Check that TWITTER_BEARER_TOKEN is set in .env`
    );
  }

  const title = `@${post.authorUsername}: ${post.text.slice(0, 80)}${post.text.length > 80 ? "…" : ""}`;

  return {
    text: post.text,
    url: post.url,
    title,
  };
}

/** Strip HTML to readable plain text */
function stripHtml(html: string): string {
  let text = html;

  // Remove script, style, nav, footer, header blocks
  text = text.replace(
    /<(script|style|nav|footer|header|aside|noscript)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Convert block elements to newlines
  text = text.replace(
    /<\/(p|div|h[1-6]|li|tr|blockquote|section|article|figcaption)>/gi,
    "\n"
  );
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");
  text = text.replace(/<\/?(ul|ol)>/gi, "\n");

  // Strip remaining tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&hellip;": "\u2026",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201c",
    "&rdquo;": "\u201d",
    "&bull;": "\u2022",
    "&middot;": "\u00b7",
    "&trade;": "\u2122",
    "&copy;": "\u00a9",
    "&reg;": "\u00ae",
    "&eacute;": "\u00e9",
  };
  for (const [entity, char] of Object.entries(entities)) {
    text = text.replaceAll(entity, char);
  }

  // Decode numeric entities
  text = text.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code))
  );
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  // Clean up whitespace
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n /g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/** Extract <title> from HTML */
function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return undefined;
  return match[1].replace(/\s+/g, " ").trim();
}
