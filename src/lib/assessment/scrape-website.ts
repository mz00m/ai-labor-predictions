// Website content extraction using Puppeteer for JavaScript-rendered pages
// Falls back to basic fetch for simple HTML sites

import { stripPii } from "./pii-strip";

const MAX_CONTENT_LENGTH = 15000;
const FETCH_TIMEOUT = 15000;

interface ScrapeResult {
  title: string;
  description: string;
  bodyText: string;
  headings: string[];
  links: { text: string; href: string }[];
  success: boolean;
  method: "puppeteer" | "fetch" | "failed";
}

/**
 * Scrape a website using Puppeteer (headless Chrome) for rich content extraction.
 * Falls back to basic fetch if Puppeteer is unavailable.
 * All content is PII-stripped before returning.
 */
export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  // Validate URL
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return emptyResult("failed");
    }
  } catch {
    return emptyResult("failed");
  }

  // Try Puppeteer first for JS-rendered content
  try {
    const result = await scrapeWithPuppeteer(url);
    if (result.success) return result;
  } catch (e) {
    console.log("Puppeteer scrape failed, falling back to fetch:", e);
  }

  // Fallback to basic fetch
  try {
    return await scrapeWithFetch(url);
  } catch (e) {
    console.error("Fetch scrape also failed:", e);
    return emptyResult("failed");
  }
}

async function scrapeWithPuppeteer(url: string): Promise<ScrapeResult> {
  // Dynamic import to avoid issues in environments without Chrome
  const puppeteer = await import("puppeteer-core");

  // Try common Chrome/Chromium paths
  const executablePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean) as string[];

  let browser = null;

  for (const executablePath of executablePaths) {
    try {
      browser = await puppeteer.default.launch({
        executablePath,
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
      break;
    } catch {
      continue;
    }
  }

  if (!browser) {
    throw new Error("No Chrome/Chromium binary found");
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent("jobsdata.ai-assessment/1.0 (research bot)");
    await page.goto(url, { waitUntil: "networkidle0", timeout: FETCH_TIMEOUT });

    // Extract structured content from the page
    const data = await page.evaluate(() => {
      const title = document.title || "";
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

      // Get all visible text from meaningful elements
      const textElements = document.querySelectorAll("p, li, td, th, h1, h2, h3, h4, h5, h6, span, a, blockquote");
      const bodyParts: string[] = [];
      textElements.forEach((el) => {
        const text = (el as HTMLElement).innerText?.trim();
        if (text && text.length > 10 && !text.startsWith("http")) {
          bodyParts.push(text);
        }
      });

      // Get headings for structure
      const headings: string[] = [];
      document.querySelectorAll("h1, h2, h3").forEach((el) => {
        const text = (el as HTMLElement).innerText?.trim();
        if (text) headings.push(text);
      });

      // Get key links (about, team, services, etc.)
      const importantLinks: { text: string; href: string }[] = [];
      const linkKeywords = ["about", "team", "services", "what we do", "our work", "contact", "careers", "mission", "staff"];
      document.querySelectorAll("a[href]").forEach((el) => {
        const text = (el as HTMLElement).innerText?.trim().toLowerCase();
        const href = (el as HTMLAnchorElement).href;
        if (text && linkKeywords.some((kw) => text.includes(kw))) {
          importantLinks.push({ text, href });
        }
      });

      return {
        title,
        description: metaDesc,
        bodyText: Array.from(new Set(bodyParts)).join("\n"),
        headings,
        links: importantLinks.slice(0, 10),
      };
    });

    // PII-strip the content
    const { cleanedText } = stripPii(data.bodyText);

    return {
      title: data.title,
      description: data.description,
      bodyText: cleanedText.slice(0, MAX_CONTENT_LENGTH),
      headings: data.headings.slice(0, 20),
      links: data.links,
      success: true,
      method: "puppeteer",
    };
  } finally {
    await browser.close();
  }
}

async function scrapeWithFetch(url: string): Promise<ScrapeResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "jobsdata.ai-assessment/1.0 (research bot)" },
    });

    if (!res.ok) return emptyResult("failed");

    const html = await res.text();

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
  } finally {
    clearTimeout(timeout);
  }
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
