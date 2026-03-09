import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import type { SourceContent } from "./types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DEFAULT_CDP_URL = "http://127.0.0.1:9222";
const NAVIGATION_TIMEOUT = 30_000;
const SCROLL_PAUSE = 800;
const MAX_SCROLLS = 5;

interface BrowserFetchOptions {
  /** Chrome DevTools Protocol endpoint (default: http://127.0.0.1:9222) */
  cdpUrl?: string;
  /** Wait this many ms after page load for dynamic content */
  extraWait?: number;
  /** Whether to scroll the page to trigger lazy-loaded content */
  autoScroll?: boolean;
  /** Path to a local PDF file instead of a URL */
  pdfPath?: string;
  /** If true, attempt headless Chromium launch as fallback */
  allowHeadlessLaunch?: boolean;
}

// ---------------------------------------------------------------------------
// PDF Extraction
// ---------------------------------------------------------------------------

async function extractPdf(source: string): Promise<SourceContent> {
  // Dynamic import to avoid loading unless needed
  const pdfParse = (await import("pdf-parse")).default;
  let buffer: Buffer;

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const res = await fetch(source, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`PDF download failed: ${res.status} ${res.statusText}`);
    }
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    if (!fs.existsSync(source)) {
      throw new Error(`PDF file not found: ${source}`);
    }
    buffer = fs.readFileSync(source);
  }

  const data = await pdfParse(buffer);
  const title = data.info?.Title || path.basename(source, ".pdf");
  return {
    text: cleanPdfText(data.text),
    url: source.startsWith("http") ? source : undefined,
    title: typeof title === "string" ? title : undefined,
  };
}

/** Clean up common PDF extraction artifacts */
function cleanPdfText(text: string): string {
  let cleaned = text;
  // Remove page numbers on their own line
  cleaned = cleaned.replace(/^\s*\d+\s*$/gm, "");
  // Remove excessive whitespace but keep paragraph breaks
  cleaned = cleaned.replace(/[ \t]+/g, " ");
  cleaned = cleaned.replace(/\n /g, "\n");
  cleaned = cleaned.replace(/\n{4,}/g, "\n\n\n");
  // Remove common header/footer patterns
  cleaned = cleaned.replace(
    /^(Downloaded from|Electronic copy available at|SSRN|https?:\/\/\S+)\s*$/gim,
    ""
  );
  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// Browser Connection
// ---------------------------------------------------------------------------

async function connectToBrowser(
  cdpUrl: string,
  allowHeadlessLaunch: boolean
): Promise<Browser> {
  // Try connecting to existing browser first
  try {
    const browser = await puppeteer.connect({
      browserURL: cdpUrl,
      defaultViewport: null,
    });
    console.log(`  Connected to browser at ${cdpUrl}`);
    return browser;
  } catch {
    // Connection failed — try CDP WebSocket endpoint discovery
    try {
      const versionRes = await fetch(`${cdpUrl}/json/version`);
      const versionData = (await versionRes.json()) as {
        webSocketDebuggerUrl?: string;
      };
      if (versionData.webSocketDebuggerUrl) {
        const browser = await puppeteer.connect({
          browserWSEndpoint: versionData.webSocketDebuggerUrl,
          defaultViewport: null,
        });
        console.log(`  Connected via WebSocket`);
        return browser;
      }
    } catch {
      // Fall through
    }

    if (!allowHeadlessLaunch) {
      throw new Error(
        `Cannot connect to browser at ${cdpUrl}.\n\n` +
          `Start Chrome with remote debugging:\n` +
          `  macOS:  /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222\n` +
          `  Linux:  google-chrome --remote-debugging-port=9222\n` +
          `  Win:    chrome.exe --remote-debugging-port=9222\n\n` +
          `Or use --headless to launch a new browser (no login sessions).`
      );
    }

    // Last resort: try to launch headless
    const execPaths = [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ];
    const found = execPaths.find((p) => {
      try {
        fs.accessSync(p);
        return true;
      } catch {
        return false;
      }
    });
    if (!found) {
      throw new Error(
        "No Chrome/Chromium found. Install Chrome or start it with --remote-debugging-port=9222"
      );
    }
    const browser = await puppeteer.launch({
      executablePath: found,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log(`  Launched headless browser: ${found}`);
    return browser;
  }
}

// ---------------------------------------------------------------------------
// Page Content Extraction
// ---------------------------------------------------------------------------

/** Scroll down the page to trigger lazy loading */
async function autoScrollPage(page: Page): Promise<void> {
  for (let i = 0; i < MAX_SCROLLS; i++) {
    const atBottom = await page.evaluate(() => {
      const prev = window.scrollY;
      window.scrollBy(0, window.innerHeight);
      return window.scrollY === prev;
    });
    if (atBottom) break;
    await new Promise((r) => setTimeout(r, SCROLL_PAUSE));
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
}

/** Dismiss common cookie/paywall overlays */
async function dismissOverlays(page: Page): Promise<void> {
  const selectors = [
    // Cookie consent buttons
    'button[id*="accept"]',
    'button[class*="accept"]',
    'button[id*="cookie"]',
    'button[class*="consent"]',
    'a[id*="accept"]',
    '[data-testid="close-button"]',
    // Generic close/dismiss
    'button[aria-label="Close"]',
    'button[aria-label="Dismiss"]',
    ".modal-close",
    ".popup-close",
    // GDPR
    "#onetrust-accept-btn-handler",
    ".cc-btn.cc-dismiss",
  ];

  for (const sel of selectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch {
      // Ignore click failures
    }
  }
}

/** Use Mozilla Readability to extract the article content */
function extractWithReadability(
  html: string,
  url: string
): { title: string; text: string } | null {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.textContent || article.textContent.length < 200) {
    return null;
  }
  return {
    title: article.title,
    text: article.textContent,
  };
}

/** Fallback: extract visible text from the page via Puppeteer */
async function extractVisibleText(page: Page): Promise<string> {
  return page.evaluate(() => {
    // Remove noise elements
    const remove = [
      "script",
      "style",
      "nav",
      "footer",
      "header",
      "aside",
      "noscript",
      "[role='banner']",
      "[role='navigation']",
      "[role='complementary']",
      ".sidebar",
      ".ad",
      ".advertisement",
      ".social-share",
      ".comments",
    ];
    for (const sel of remove) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }

    // Try to find article body
    const articleEl =
      document.querySelector("article") ||
      document.querySelector('[role="main"]') ||
      document.querySelector("main") ||
      document.querySelector(".post-content") ||
      document.querySelector(".article-body") ||
      document.querySelector(".entry-content") ||
      document.body;

    return (articleEl?.textContent || "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  });
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

/**
 * Fetch article content using a real browser (via CDP) or PDF parser.
 *
 * This connects to your running Chrome instance so it has access to your
 * login sessions — meaning it can read paywalled journals, gated articles,
 * and anything your browser can see.
 *
 * For PDFs: extracts text directly without needing a browser.
 */
export async function browserFetch(
  url: string,
  options: BrowserFetchOptions = {}
): Promise<SourceContent> {
  const {
    cdpUrl = DEFAULT_CDP_URL,
    extraWait = 1500,
    autoScroll = true,
    pdfPath,
    allowHeadlessLaunch = false,
  } = options;

  // Handle PDFs directly (no browser needed)
  if (pdfPath) {
    console.log(`  Extracting PDF: ${pdfPath}`);
    return extractPdf(pdfPath);
  }
  if (url.match(/\.pdf(\?|$)/i)) {
    console.log(`  Detected PDF URL, extracting directly...`);
    return extractPdf(url);
  }

  // Connect to browser
  const browser = await connectToBrowser(cdpUrl, allowHeadlessLaunch);
  const isConnectedBrowser = browser.process() === null; // null means we connected, not launched
  let page: Page | undefined;

  try {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Navigate
    console.log(`  Navigating to: ${url}`);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: NAVIGATION_TIMEOUT,
    });

    // Wait for content to settle
    if (extraWait > 0) {
      await new Promise((r) => setTimeout(r, extraWait));
    }

    // Dismiss cookie banners and overlays
    await dismissOverlays(page);

    // Check if we got redirected to a PDF viewer
    const finalUrl = page.url();
    if (finalUrl.match(/\.pdf(\?|$)/i)) {
      console.log(`  Redirected to PDF, extracting directly...`);
      await page.close();
      return extractPdf(finalUrl);
    }

    // Scroll to load lazy content
    if (autoScroll) {
      await autoScrollPage(page);
    }

    // Get full HTML
    const html = await page.content();
    const pageTitle = await page.title();

    // Strategy 1: Mozilla Readability (best for articles)
    const readable = extractWithReadability(html, finalUrl);
    if (readable && readable.text.length > 300) {
      console.log(
        `  Extracted via Readability: ${readable.text.length} chars`
      );
      return {
        text: readable.text,
        url: finalUrl,
        title: readable.title || pageTitle,
      };
    }

    // Strategy 2: DOM-based visible text extraction
    console.log(`  Readability insufficient, using DOM extraction...`);
    const visibleText = await extractVisibleText(page);
    if (visibleText.length > 200) {
      console.log(`  Extracted via DOM: ${visibleText.length} chars`);
      return {
        text: visibleText,
        url: finalUrl,
        title: pageTitle,
      };
    }

    // Strategy 3: Raw page text (last resort)
    console.log(`  Using raw text fallback`);
    const rawText = await page.evaluate(() => document.body.innerText);
    return {
      text: rawText || html,
      url: finalUrl,
      title: pageTitle,
    };
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    // Only close the browser if we launched it ourselves
    if (!isConnectedBrowser) {
      await browser.close().catch(() => {});
    }
  }
}

/**
 * Check if a browser is available for connection.
 */
export async function isBrowserAvailable(
  cdpUrl: string = DEFAULT_CDP_URL
): Promise<boolean> {
  try {
    const res = await fetch(`${cdpUrl}/json/version`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
