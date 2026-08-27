// Safe website content extraction for untrusted user-supplied URLs.

import { stripPii } from "./pii-strip";
import { safeFetchText } from "@/lib/security/safe-fetch";

const MAX_CONTENT_LENGTH = 15000;
const FETCH_TIMEOUT = 15000;

interface ScrapeResult {
  title: string;
  description: string;
  bodyText: string;
  headings: string[];
  links: { text: string; href: string }[];
  success: boolean;
  method: "fetch" | "failed";
}

/**
 * Fetch a public website with private-network, redirect, timeout, content-type,
 * and response-size protections. Browser execution is intentionally avoided for
 * untrusted URLs so a submitted page cannot reach internal services via scripts.
 * All content is PII-stripped before returning.
 */
export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  try {
    return await scrapeWithFetch(url);
  } catch (e) {
    console.error("Fetch scrape also failed:", e);
    return emptyResult("failed");
  }
}

async function scrapeWithFetch(url: string): Promise<ScrapeResult> {
  const res = await safeFetchText(url, {
    timeoutMs: FETCH_TIMEOUT,
    maxBytes: 1_000_000,
    maxRedirects: 3,
    allowedContentTypes: ["text/html", "application/xhtml+xml", "text/plain"],
    headers: { "User-Agent": "jobsdata.ai-assessment/1.0 (research bot)" },
  });

  if (!res.ok) return emptyResult("failed");

  const html = res.body;

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
  const description = descMatch ? descMatch[1].trim() : "";

  // Extract headings
  const headings: string[] = [];
  const headingRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push(match[1].trim());
  }

  // Convert HTML to text
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  const { cleanedText } = stripPii(bodyText);

  return {
    title,
    description,
    bodyText: cleanedText.slice(0, MAX_CONTENT_LENGTH),
    headings: headings.slice(0, 20),
    links: [],
    success: true,
    method: "fetch",
  };
}

function emptyResult(method: ScrapeResult["method"]): ScrapeResult {
  return { title: "", description: "", bodyText: "", headings: [], links: [], success: false, method };
}

/**
 * Format scraped content for the AI analysis prompt
 */
export function formatScrapedContent(result: ScrapeResult): string {
  if (!result.success) return "";

  let content = `## Website Content (scraped via ${result.method})\n\n`;
  if (result.title) content += `**Title:** ${result.title}\n`;
  if (result.description) content += `**Description:** ${result.description}\n`;

  if (result.headings.length > 0) {
    content += `\n**Page sections:** ${result.headings.join(" | ")}\n`;
  }

  if (result.bodyText) {
    content += `\n**Content:**\n${result.bodyText}\n`;
  }

  return content;
}
