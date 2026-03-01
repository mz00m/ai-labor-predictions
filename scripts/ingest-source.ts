/**
 * Source Ingestion Script
 *
 * Fetches a research source (URL, file, or pasted text), uses Claude to
 * extract all quantitative statistics with exact quotes, maps each to the
 * appropriate prediction graph, and optionally writes the changes.
 *
 * Usage:
 *   npx tsx scripts/ingest-source.ts <url>
 *   npx tsx scripts/ingest-source.ts --file <path>
 *   npx tsx scripts/ingest-source.ts --text "paste text here"
 *
 * Options:
 *   --apply              Write changes to prediction JSON files (default: dry run)
 *   --publisher <name>   Override auto-detected publisher
 *   --date <YYYY-MM-DD>  Override auto-detected publication date
 *   --title <title>      Override auto-detected title
 *   --tier <1-4>         Override auto-detected evidence tier
 *   --source-id <id>     Override auto-generated source ID
 *   --model <model>      Claude model to use (default: claude-sonnet-4-20250514)
 *   --verbose / -v        Show debug output
 *
 * Examples:
 *   npx tsx scripts/ingest-source.ts https://www.gartner.com/en/newsroom/press-releases/...
 *   npx tsx scripts/ingest-source.ts --text "Gartner projects 20-30% of CS agents replaced by 2026" --publisher Gartner --date 2025-10-15
 *   npx tsx scripts/ingest-source.ts https://example.com/report.html --apply
 */

import fs from "fs";
import path from "path";

// Load .env (same pattern as generate-digest.ts)
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx);
        const value = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}

import { fetchSource } from "./lib/ingest/fetcher";
import { extractStatistics } from "./lib/ingest/extractor";
import { generateSourceId, applyChanges } from "./lib/ingest/writer";
import type {
  GraphInfo,
  ProposedChange,
  SourceOverrides,
  ExtractedStat,
  SourceMetadata,
} from "./lib/ingest/types";
import type { EvidenceTier } from "../src/lib/types";

// ─── Argument Parsing ────────────────────────────────────────────────

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--apply") {
      flags.apply = true;
    } else if (arg === "--verbose" || arg === "-v") {
      flags.verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      flags.help = true;
    } else if (arg.startsWith("--") && i + 1 < args.length) {
      flags[arg.slice(2)] = args[++i];
    } else if (!arg.startsWith("--")) {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

// ─── Graph Registry ──────────────────────────────────────────────────

function loadGraphs(): GraphInfo[] {
  const baseDir = path.join(process.cwd(), "src/data/predictions");
  const graphs: GraphInfo[] = [];

  const categories = fs.readdirSync(baseDir);
  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      graphs.push({
        slug: data.slug,
        title: data.title,
        description: data.description,
        unit: data.unit,
        category: data.category,
        currentValue: data.currentValue,
        timeHorizon: data.timeHorizon,
        existingSourceIds: (data.sources || []).map(
          (s: { id: string }) => s.id
        ),
        filePath,
      });
    }
  }

  return graphs;
}

// ─── Display ─────────────────────────────────────────────────────────

const TIER_LABELS: Record<number, string> = {
  1: "Verified Data & Research",
  2: "Institutional Analysis",
  3: "Journalism & Commentary",
  4: "Informal & Social",
};

function displayReport(
  metadata: SourceMetadata,
  statistics: ExtractedStat[],
  changes: ProposedChange[],
  graphs: GraphInfo[]
) {
  console.log("\n" + "=".repeat(70));
  console.log("  SOURCE INGESTION REPORT");
  console.log("=".repeat(70));

  console.log(`\n  Title:     ${metadata.title}`);
  console.log(`  Publisher: ${metadata.publisher}`);
  console.log(`  Date:      ${metadata.datePublished}`);
  console.log(
    `  Tier:      ${metadata.evidenceTier} (${TIER_LABELS[metadata.evidenceTier]})`
  );
  if (metadata.url) console.log(`  URL:       ${metadata.url}`);

  if (statistics.length === 0) {
    console.log(
      "\n  No quantitative statistics found in this source.\n"
    );
    return;
  }

  console.log(
    `\n${"─".repeat(70)}\n  EXTRACTED STATISTICS (${statistics.length} found)\n${"─".repeat(70)}`
  );

  for (let i = 0; i < statistics.length; i++) {
    const s = statistics[i];
    const graph = graphs.find((g) => g.slug === s.targetGraphSlug);
    const graphTitle = graph?.title || s.targetGraphSlug;

    console.log(`\n  [${i + 1}] ${graphTitle}`);
    console.log(`      Slug:  ${s.targetGraphSlug}`);
    console.log(
      `      Type:  ${s.dataType === "data_point" ? "DATA POINT (plotted on chart)" : "OVERLAY (directional signal)"}`
    );

    if (s.isRange) {
      console.log(
        `      Value: ${s.value} (midpoint of ${s.rangeLow}–${s.rangeHigh})`
      );
    } else {
      console.log(`      Value: ${s.value}`);
    }

    console.log(`      Unit:  ${s.unit}`);
    if (s.timeHorizon) console.log(`      When:  ${s.timeHorizon}`);
    if (s.direction) console.log(`      Dir:   ${s.direction}`);

    // Word-wrap the quote at ~65 chars
    const quote = s.exactQuote;
    const wrappedQuote = wordWrap(quote, 60);
    console.log(`      Quote: "${wrappedQuote[0]}"`);
    for (let j = 1; j < wrappedQuote.length; j++) {
      console.log(`              ${wrappedQuote[j]}`);
    }

    console.log(`      Why:   ${s.plottabilityReason}`);
  }

  console.log(
    `\n${"─".repeat(70)}\n  PROPOSED FILE CHANGES\n${"─".repeat(70)}\n`
  );

  // Group changes by file
  const byFile = new Map<string, ProposedChange[]>();
  for (const c of changes) {
    const existing = byFile.get(c.filePath) || [];
    existing.push(c);
    byFile.set(c.filePath, existing);
  }

  for (const [filePath, fileChanges] of byFile) {
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`  ${relPath}:`);

    for (const change of fileChanges) {
      if (change.historyEntry) {
        const h = change.historyEntry;
        const rangeStr =
          h.confidenceLow !== undefined
            ? `, range=[${h.confidenceLow}, ${h.confidenceHigh}]`
            : "";
        console.log(
          `    + history: date=${h.date}, value=${h.value}${rangeStr}, tier=${h.evidenceTier}`
        );
      }
      if (change.overlayEntry) {
        const o = change.overlayEntry;
        console.log(
          `    + overlay: "${o.label}", direction=${o.direction}, tier=${o.evidenceTier}`
        );
      }
      console.log(`    + source: ${change.sourceId}`);
    }
    console.log();
  }

  // Check for duplicates
  const duplicates = changes.filter((c) => {
    const graph = graphs.find((g) => g.slug === c.graphSlug);
    return graph?.existingSourceIds.includes(c.sourceId);
  });

  if (duplicates.length > 0) {
    console.log("  Warnings:");
    for (const d of duplicates) {
      console.log(
        `    - Source "${d.sourceId}" already exists in ${d.graphSlug}`
      );
    }
    console.log();
  }
}

function wordWrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 > width && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);

  return lines;
}

// ─── Build Changes ───────────────────────────────────────────────────

function buildChanges(
  statistics: ExtractedStat[],
  sourceMetadata: SourceMetadata,
  graphs: GraphInfo[],
  overrideSourceId?: string
): ProposedChange[] {
  const year = sourceMetadata.datePublished.slice(0, 4);
  const sourceId =
    overrideSourceId ||
    generateSourceId(sourceMetadata.publisher, sourceMetadata.title, year);

  return statistics
    .map((stat): ProposedChange | null => {
      const graph = graphs.find((g) => g.slug === stat.targetGraphSlug);
      if (!graph) {
        console.warn(
          `  Warning: No graph found for slug "${stat.targetGraphSlug}" — skipping.`
        );
        return null;
      }

      const change: ProposedChange = {
        graphSlug: stat.targetGraphSlug,
        graphTitle: graph.title,
        filePath: graph.filePath,
        stat,
        sourceId,
        sourceEntry: {
          id: sourceId,
          title: sourceMetadata.title,
          url: sourceMetadata.url,
          publisher: sourceMetadata.publisher,
          evidenceTier: sourceMetadata.evidenceTier,
          datePublished: sourceMetadata.datePublished,
          excerpt: stat.exactQuote,
        },
      };

      if (stat.dataType === "data_point") {
        change.historyEntry = {
          date: sourceMetadata.datePublished,
          value: stat.value,
          ...(stat.isRange
            ? { confidenceLow: stat.rangeLow, confidenceHigh: stat.rangeHigh }
            : {}),
          sourceIds: [sourceId],
          evidenceTier: sourceMetadata.evidenceTier,
        };
      } else {
        change.overlayEntry = {
          date: sourceMetadata.datePublished,
          direction: stat.direction || "neutral",
          sourceIds: [sourceId],
          evidenceTier: sourceMetadata.evidenceTier,
          label:
            stat.contextLabel ||
            `${sourceMetadata.publisher}: ${stat.exactQuote.slice(0, 80)}`,
        };
      }

      return change;
    })
    .filter((c): c is ProposedChange => c !== null);
}

// ─── Usage ───────────────────────────────────────────────────────────

function printUsage() {
  console.log(`
Source Ingestion Script — Extract statistics from research sources
=================================================================

Usage:
  npx tsx scripts/ingest-source.ts <url>
  npx tsx scripts/ingest-source.ts --file <path>
  npx tsx scripts/ingest-source.ts --text "paste text here"

Options:
  --apply              Write changes to prediction JSON files (default: dry run)
  --publisher <name>   Override auto-detected publisher
  --date <YYYY-MM-DD>  Override auto-detected publication date
  --title <title>      Override auto-detected title
  --tier <1-4>         Override auto-detected evidence tier
  --source-id <id>     Override auto-generated source ID
  --model <model>      Claude model (default: claude-sonnet-4-20250514)
  --verbose / -v       Show debug output
  --help / -h          Show this help

Examples:
  # Ingest from URL (dry run)
  npx tsx scripts/ingest-source.ts https://www.gartner.com/en/newsroom/press-releases/...

  # Ingest pasted text with metadata overrides
  npx tsx scripts/ingest-source.ts \\
    --text "Gartner projects 20-30% of CS agents will be replaced by GenAI by 2026." \\
    --publisher Gartner --date 2025-10-15 --tier 2

  # Ingest and apply changes to JSON files
  npx tsx scripts/ingest-source.ts https://example.com/report --apply

  # Ingest from a local file
  npx tsx scripts/ingest-source.ts --file ./downloads/report.txt --publisher "NBER"

Environment:
  ANTHROPIC_API_KEY    Required. Set in .env or export directly.
`);
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const { flags, positional } = parseArgs(process.argv);

  if (flags.help) {
    printUsage();
    process.exit(0);
  }

  const apply = !!flags.apply;
  const verbose = !!flags.verbose;
  const model = typeof flags.model === "string" ? flags.model : undefined;

  // Determine input mode and content
  let input: string;
  let mode: "url" | "file" | "text";

  if (typeof flags.file === "string") {
    input = flags.file;
    mode = "file";
  } else if (typeof flags.text === "string") {
    input = flags.text;
    mode = "text";
  } else if (positional.length > 0) {
    input = positional[0];
    mode = input.startsWith("http") ? "url" : "text";
  } else {
    console.error("Error: No input provided. Use --help for usage.\n");
    process.exit(1);
  }

  // Build overrides from flags
  const overrides: SourceOverrides = {};
  if (typeof flags.publisher === "string") overrides.publisher = flags.publisher;
  if (typeof flags.date === "string") overrides.datePublished = flags.date;
  if (typeof flags.title === "string") overrides.title = flags.title;
  if (typeof flags.tier === "string")
    overrides.evidenceTier = parseInt(flags.tier) as EvidenceTier;
  if (typeof flags["source-id"] === "string")
    overrides.sourceId = flags["source-id"];
  if (mode === "url") overrides.url = input;

  // ── Step 1: Load prediction graphs ──
  console.log("Loading prediction graphs...");
  const graphs = loadGraphs();
  const categories = new Set(graphs.map((g) => g.category));
  console.log(
    `  Found ${graphs.length} graphs across ${categories.size} categories`
  );

  // ── Step 2: Fetch source content ──
  console.log(`\nFetching source (${mode})...`);
  const content = await fetchSource(input, mode);
  console.log(`  Got ${content.text.length.toLocaleString()} characters`);
  if (content.title) console.log(`  Page title: ${content.title}`);

  if (content.text.length < 20) {
    console.error(
      "\nError: Source content too short. Check the URL or input.\n"
    );
    process.exit(1);
  }

  // ── Step 3: Extract statistics via Claude ──
  console.log("\nExtracting statistics via Claude API...");
  const { sourceMetadata, statistics } = await extractStatistics(
    content,
    graphs,
    overrides,
    model,
    verbose
  );
  console.log(`  Extracted ${statistics.length} statistics`);

  // ── Step 4: Build proposed changes ──
  const changes = buildChanges(
    statistics,
    sourceMetadata,
    graphs,
    typeof overrides.sourceId === "string" ? overrides.sourceId : undefined
  );

  // ── Step 5: Display report ──
  displayReport(sourceMetadata, statistics, changes, graphs);

  // ── Step 6: Apply or inform ──
  if (apply) {
    console.log("Applying changes...\n");
    const { written, skipped } = applyChanges(changes);
    for (const w of written) console.log(`  + ${w}`);
    for (const s of skipped) console.log(`  ~ ${s}`);
    console.log(
      `\nDone. ${written.length} entries written, ${skipped.length} skipped.\n`
    );
  } else {
    console.log(
      "This was a dry run — no files were modified.\nRe-run with --apply to write changes to the prediction files.\n"
    );
  }
}

main().catch((err) => {
  console.error("\nIngestion failed:", err.message || err);
  if (err.status === 401) {
    console.error("Check that ANTHROPIC_API_KEY is set correctly in .env");
  }
  process.exit(1);
});
