#!/usr/bin/env npx tsx
/**
 * fetch-article — Extract article/PDF content using your browser or direct download.
 *
 * Usage:
 *   npx tsx scripts/fetch-article.ts <url>                    # Fetch via browser CDP
 *   npx tsx scripts/fetch-article.ts <url> --headless         # Launch headless Chrome
 *   npx tsx scripts/fetch-article.ts --pdf <path-or-url>      # Extract PDF directly
 *   npx tsx scripts/fetch-article.ts <url> --save <file>      # Save output to file
 *   npx tsx scripts/fetch-article.ts <url> --ingest           # Pipe into ingest pipeline
 *   npx tsx scripts/fetch-article.ts <url> --cdp <endpoint>   # Custom CDP endpoint
 *
 * To use with your browser (recommended — gives access to your logins):
 *   1. Start Chrome:  google-chrome --remote-debugging-port=9222
 *   2. Run:           npx tsx scripts/fetch-article.ts https://example.com/article
 *
 * The fetcher tries multiple strategies in order:
 *   1. Direct PDF extraction (if URL ends in .pdf or --pdf flag)
 *   2. Browser + Mozilla Readability (best for articles)
 *   3. Browser + DOM-based extraction (fallback for SPAs)
 *   4. Plain HTTP fetch + HTML stripping (last resort, no browser needed)
 */

import { browserFetch, isBrowserAvailable } from "./lib/ingest/browser-fetcher";
import { fetchSource } from "./lib/ingest/fetcher";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  url: string;
  pdf?: string;
  save?: string;
  cdp: string;
  headless: boolean;
  ingest: boolean;
  quiet: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    url: "",
    cdp: "http://127.0.0.1:9222",
    headless: false,
    ingest: false,
    quiet: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--pdf":
        result.pdf = args[++i];
        break;
      case "--save":
        result.save = args[++i];
        break;
      case "--cdp":
        result.cdp = args[++i];
        break;
      case "--headless":
        result.headless = true;
        break;
      case "--ingest":
        result.ingest = true;
        break;
      case "--quiet":
      case "-q":
        result.quiet = true;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      default:
        if (!arg.startsWith("-") && !result.url) {
          result.url = arg;
        }
    }
  }

  if (!result.url && !result.pdf) {
    printUsage();
    process.exit(1);
  }

  return result;
}

function printUsage(): void {
  console.log(`
fetch-article — Extract article/PDF content using your real browser

Usage:
  npx tsx scripts/fetch-article.ts <url>                    Fetch via browser (CDP)
  npx tsx scripts/fetch-article.ts <url> --headless         Launch headless Chrome
  npx tsx scripts/fetch-article.ts --pdf <path-or-url>      Extract PDF text
  npx tsx scripts/fetch-article.ts <url> --save out.txt     Save to file
  npx tsx scripts/fetch-article.ts <url> --ingest           Save to tmp, print path (for piping)

Options:
  --cdp <url>     Chrome DevTools Protocol endpoint (default: http://127.0.0.1:9222)
  --headless      Launch headless Chrome instead of connecting to existing browser
  --pdf <path>    Extract text from a local or remote PDF
  --save <file>   Write extracted text to a file
  --ingest        Save to tmp file and print path (for piping to ingest script)
  -q, --quiet     Suppress progress messages
  -h, --help      Show this help

Start Chrome with remote debugging:
  macOS:   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222
  Linux:   google-chrome --remote-debugging-port=9222
  Windows: chrome.exe --remote-debugging-port=9222
`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs();
  const log = args.quiet ? () => {} : console.log;

  const url = args.url || args.pdf || "";
  const isPdf = !!args.pdf || url.match(/\.pdf(\?|$)/i);

  log(`\nfetch-article`);
  log(`${"─".repeat(60)}`);
  log(`  Target: ${url}`);

  let result;

  if (isPdf) {
    // Direct PDF extraction — no browser needed
    log(`  Mode: PDF extraction`);
    const { browserFetch: bf } = await import("./lib/ingest/browser-fetcher");
    result = await bf(url, { pdfPath: args.pdf });
  } else {
    // Try browser-based fetch first
    const browserReady = await isBrowserAvailable(args.cdp);

    if (browserReady || args.headless) {
      log(
        `  Mode: ${browserReady ? "Browser (CDP)" : "Headless Chrome"}`
      );
      try {
        result = await browserFetch(url, {
          cdpUrl: args.cdp,
          allowHeadlessLaunch: args.headless,
        });
      } catch (err) {
        log(
          `  Browser fetch failed: ${err instanceof Error ? err.message : err}`
        );
        log(`  Falling back to HTTP fetch...`);
        result = await fetchSource(url, "url");
      }
    } else {
      log(`  Mode: HTTP fetch (no browser detected)`);
      log(
        `  Tip: Start Chrome with --remote-debugging-port=9222 for better extraction`
      );
      result = await fetchSource(url, "url");
    }
  }

  // Output results
  log(`${"─".repeat(60)}`);
  log(`  Title: ${result.title || "(none)"}`);
  log(`  Length: ${result.text.length} chars`);
  log(`  URL: ${result.url || url}`);
  log(`${"─".repeat(60)}`);

  if (args.save) {
    const outPath = path.resolve(args.save);
    fs.writeFileSync(outPath, result.text, "utf-8");
    log(`  Saved to: ${outPath}`);
  } else if (args.ingest) {
    // Write to tmp file for piping to ingest script
    const tmpDir = path.join(process.cwd(), ".fetch-cache");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const slug = url
      .replace(/https?:\/\//, "")
      .replace(/[^a-z0-9]/gi, "-")
      .slice(0, 60);
    const tmpPath = path.join(tmpDir, `${slug}.txt`);
    fs.writeFileSync(tmpPath, result.text, "utf-8");
    // Print just the path for piping
    console.log(tmpPath);
  } else {
    // Print the extracted text
    console.log("\n" + result.text);
  }
}

main().catch((err) => {
  console.error(`\nError: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
