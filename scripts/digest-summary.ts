/**
 * Generates a human-readable Markdown PR body from a digest JSON file.
 * Designed to work with the DigestSchema output from synthesize-digest.ts.
 *
 * Usage:
 *   npx tsx scripts/digest-summary.ts <digest.json> [meta.json]
 *
 * Accepts an optional second argument for the .meta.json source health file.
 * Output is capped at ~3000 chars to avoid GitHub PR body truncation.
 */

import fs from "fs";
import path from "path";

const digestPath = process.argv[2];
const metaPath = process.argv[3];

if (!digestPath || !fs.existsSync(digestPath)) {
  console.error("Usage: npx tsx scripts/digest-summary.ts <digest.json> [meta.json]");
  process.exit(1);
}

const digest = JSON.parse(fs.readFileSync(digestPath, "utf-8"));

// Try to load previous week's digest for diffing
let prevDigest: any = null;
try {
  const weekMatch = digest.week.match(/^(\d{4})-W(\d{2})$/);
  if (weekMatch) {
    const year = parseInt(weekMatch[1]);
    const week = parseInt(weekMatch[2]);
    const prevWeek = week > 1 ? week - 1 : 52;
    const prevYear = week > 1 ? year : year - 1;
    const prevWeekId = `${prevYear}-W${String(prevWeek).padStart(2, "0")}`;
    const prevPath = path.join(path.dirname(digestPath), `${prevWeekId}.json`);
    if (fs.existsSync(prevPath)) {
      prevDigest = JSON.parse(fs.readFileSync(prevPath, "utf-8"));
    }
  }
} catch {
  // Diffing is best-effort
}

const lines: string[] = [];

// Header
lines.push(`## Weekly Research Digest: ${digest.week}`);
lines.push("");
lines.push(
  `**${digest.lookbackDays}-day lookback** | ` +
    `${digest.sources.totalCandidates} candidates discovered | ` +
    `${digest.sources.afterDedup} after dedup | ` +
    `${digest.highlights.length} highlights selected`
);
lines.push("");

// Highlights
lines.push("### Highlights");
lines.push("");

for (const h of digest.highlights) {
  const graph = h.graphSlug ? ` \u2192 \`${h.graphSlug}\`` : "";
  const score = h.score != null ? ` (score: ${h.score.toFixed(2)})` : "";
  lines.push(`**${h.title}**${graph}${score}`);
  lines.push(`> ${h.summary}`);
  lines.push(`> \u2014 [${h.sourceAdapter}](${h.source})`);
  lines.push("");
}

// Themes
if (digest.themes?.length > 0) {
  lines.push("### Emerging Themes");
  lines.push("");
  for (const theme of digest.themes) {
    lines.push(`- ${theme}`);
  }
  lines.push("");

  // Diff vs last week
  if (prevDigest?.themes) {
    const prevThemes = new Set(prevDigest.themes.map((t: string) => t.toLowerCase()));
    const newThemes = digest.themes.filter(
      (t: string) => !prevThemes.has(t.toLowerCase())
    );
    const droppedThemes = prevDigest.themes.filter(
      (t: string) => !new Set(digest.themes.map((x: string) => x.toLowerCase())).has(t.toLowerCase())
    );
    if (newThemes.length > 0 || droppedThemes.length > 0) {
      lines.push("**Changes from last week:**");
      for (const t of newThemes) lines.push(`- + ${t}`);
      for (const t of droppedThemes) lines.push(`- - ${t}`);
      lines.push("");
    }
  }
}

// Watching
if (digest.watching?.length > 0) {
  lines.push("### Worth Watching");
  lines.push("");
  for (const w of digest.watching) {
    lines.push(`- **[${w.title}](${w.source})**: ${w.reason}`);
  }
  lines.push("");
}

// Ingestion candidates (if staging file exists alongside digest)
const stagingPath = path.join(
  path.dirname(digestPath),
  `${digest.week}.ingest-staging.json`
);
if (fs.existsSync(stagingPath)) {
  try {
    const staging = JSON.parse(fs.readFileSync(stagingPath, "utf-8"));
    const candidates = staging.candidates?.filter(
      (c: any) => c.extractedStats?.length > 0
    );
    if (candidates?.length > 0) {
      lines.push("### Ingestion Candidates");
      lines.push("");
      lines.push("| Source | Graph | Type | Value | Tier |");
      lines.push("|:-------|:------|:-----|------:|:----:|");
      for (const c of candidates) {
        for (const stat of c.extractedStats) {
          const val =
            stat.type === "data_point"
              ? `${stat.value}`
              : stat.direction === "up"
                ? "\u2191"
                : stat.direction === "down"
                  ? "\u2193"
                  : "\u2194";
          lines.push(
            `| ${c.highlight.title.slice(0, 45)} | ${stat.graphSlug} | ${stat.type} | ${val} | ${c.evidenceTier} |`
          );
        }
      }
      lines.push("");
      lines.push(
        `To apply: \`npx tsx scripts/apply-ingestion.ts ${stagingPath}\``
      );
      lines.push("");
    }
  } catch {
    // Best-effort staging display
  }
}

// Source health
lines.push("### Sources");
lines.push("");
const ok = digest.sources.succeeded ?? [];
const fail = digest.sources.failed ?? [];
lines.push(`**OK** (${ok.length}): ${ok.join(", ") || "none"}`);
if (fail.length > 0) {
  lines.push(`**Failed** (${fail.length}): ${fail.join(", ")}`);
}

// Meta file source health details
if (metaPath && fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (meta.sources) {
      lines.push("");
      lines.push("| Source | Status | Items | Duration |");
      lines.push("|:-------|:------:|------:|---------:|");
      for (const [name, info] of Object.entries(meta.sources) as any) {
        const status = info.status === "ok" ? "\u2705" : "\u274c";
        lines.push(
          `| ${name} | ${status} | ${info.items ?? 0} | ${info.durationMs ?? "-"}ms |`
        );
      }
    }
  } catch {
    // Best-effort meta display
  }
}

lines.push("");
lines.push("---");
lines.push(
  "Merge to accept this digest, or close to discard. _Generated by GitHub Actions._"
);

// Cap output at ~3000 chars
const output = lines.join("\n");
if (output.length > 3000) {
  console.log(output.slice(0, 2950) + "\n\n_[truncated]_");
} else {
  console.log(output);
}
