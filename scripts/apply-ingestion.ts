/**
 * Phase 3b: Apply Ingestion
 *
 * Reads an approved staging file and writes extracted stats to prediction
 * JSON files and confirmed-sources.json.
 *
 * Usage:
 *   npx tsx scripts/apply-ingestion.ts <staging-file>
 *   npx tsx scripts/apply-ingestion.ts <staging-file> --approve-all
 */

import fs from "fs";
import path from "path";

// ─── Main ─────────────────────────────────────────────────────────────

async function applyIngestion(
  stagingPath: string,
  mode: "all" | "interactive"
): Promise<void> {
  const staging = JSON.parse(fs.readFileSync(stagingPath, "utf-8"));
  const predictionsDir = "src/data/predictions";
  const confirmedSourcesPath = "src/data/confirmed-sources.json";
  const lastUpdatedPath = "src/data/last-updated.json";

  const confirmedSources = JSON.parse(
    fs.readFileSync(confirmedSourcesPath, "utf-8")
  );
  let statsAdded = 0;
  let statsSkipped = 0;
  const modifiedFiles = new Set<string>();

  // Map graph slugs to their file paths (slug -> category/filename)
  const graphFileMap = buildGraphFileMap(predictionsDir);

  for (const candidate of staging.candidates) {
    const { highlight, sourceId, evidenceTier, extractedStats } = candidate;

    if (!extractedStats || extractedStats.length === 0) continue;

    for (const stat of extractedStats) {
      const filePath = graphFileMap.get(stat.graphSlug);

      if (!filePath) {
        console.warn(
          `  ! No prediction file found for slug "${stat.graphSlug}" — skipping`
        );
        statsSkipped++;
        continue;
      }

      let predictionFile: any;
      try {
        predictionFile = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {
        console.warn(`  ! Could not read ${filePath} — skipping stat`);
        statsSkipped++;
        continue;
      }

      // Check for duplicate sources
      const sourceAlreadyExists = predictionFile.sources?.some(
        (s: any) => s.id === sourceId || s.url === highlight.source
      );

      if (!sourceAlreadyExists) {
        predictionFile.sources = predictionFile.sources ?? [];
        predictionFile.sources.push({
          id: sourceId,
          title: highlight.title,
          url: highlight.source,
          publisher: new URL(highlight.source).hostname.replace("www.", ""),
          evidenceTier,
          datePublished:
            highlight.publishedAt ??
            new Date().toISOString().split("T")[0],
          excerpt: stat.quote,
        });
      }

      const dateStr = highlight.publishedAt
        ? new Date(highlight.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      if (stat.type === "data_point" && stat.value != null) {
        predictionFile.history = predictionFile.history ?? [];
        predictionFile.history.push({
          date: dateStr,
          value: stat.value,
          confidenceLow: stat.confidenceLow ?? null,
          confidenceHigh: stat.confidenceHigh ?? null,
          sourceIds: [sourceId],
          evidenceTier,
        });
        predictionFile.history.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      } else if (stat.type === "overlay") {
        predictionFile.overlays = predictionFile.overlays ?? [];
        predictionFile.overlays.push({
          date: dateStr,
          direction: stat.direction ?? "neutral",
          sourceIds: [sourceId],
          evidenceTier,
          label:
            stat.overlayLabel ??
            `${highlight.title.slice(0, 60)}`,
        });
        predictionFile.overlays.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      // Validate and write
      try {
        JSON.stringify(predictionFile);
        fs.writeFileSync(filePath, JSON.stringify(predictionFile, null, 2));
        modifiedFiles.add(stat.graphSlug);
        statsAdded++;
        console.log(
          `  + ${stat.graphSlug}: ${stat.type} ${stat.type === "data_point" ? `(${stat.value})` : `(${stat.direction})`}`
        );
      } catch {
        console.error(`  x JSON validation failed for ${filePath} — not writing`);
        statsSkipped++;
      }
    }

    // Update confirmed-sources.json
    if (!confirmedSources.sources?.[sourceId]) {
      confirmedSources.sources = confirmedSources.sources ?? {};
      confirmedSources.sources[sourceId] = {
        id: sourceId,
        title: highlight.title,
        url: highlight.source,
        publisher: new URL(highlight.source).hostname.replace("www.", ""),
        evidenceTier,
        datePublished:
          highlight.publishedAt ??
          new Date().toISOString().split("T")[0],
        excerpt:
          extractedStats[0]?.quote ?? highlight.summary,
        usedIn: [...modifiedFiles],
        verified: true,
        synthetic: false,
      };
      confirmedSources.totalSources =
        (confirmedSources.totalSources ?? 0) + 1;
      confirmedSources.verifiedCount =
        (confirmedSources.verifiedCount ?? 0) + 1;
    }
  }

  // Update timestamps
  const today = new Date().toISOString().split("T")[0];
  confirmedSources.lastUpdated = today;
  fs.writeFileSync(
    confirmedSourcesPath,
    JSON.stringify(confirmedSources, null, 2)
  );
  if (fs.existsSync(lastUpdatedPath)) {
    fs.writeFileSync(
      lastUpdatedPath,
      JSON.stringify({ lastUpdated: today }, null, 2)
    );
  }

  // Summary
  console.log(`\nIngestion complete`);
  console.log(`  Stats added:    ${statsAdded}`);
  console.log(`  Stats skipped:  ${statsSkipped}`);
  console.log(`  Files modified: ${[...modifiedFiles].join(", ")}`);
  console.log(`  Remember to commit and deploy.\n`);
}

/**
 * Scan the predictions directory and map graph slugs to file paths.
 * Prediction files are organized as: predictions/<category>/<file>.json
 * Each file has a "slug" field.
 */
function buildGraphFileMap(predictionsDir: string): Map<string, string> {
  const map = new Map<string, string>();

  if (!fs.existsSync(predictionsDir)) return map;

  const categories = fs.readdirSync(predictionsDir);
  for (const category of categories) {
    const categoryPath = path.join(predictionsDir, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (data.slug) {
          map.set(data.slug, filePath);
        }
      } catch {
        // skip malformed files
      }
    }
  }

  return map;
}

// ─── CLI ──────────────────────────────────────────────────────────────

const [, , stagingArg, flag] = process.argv;

if (!stagingArg || !fs.existsSync(stagingArg)) {
  console.error(
    "Usage: npx tsx scripts/apply-ingestion.ts <staging-file> [--approve-all]"
  );
  process.exit(1);
}

const mode = flag === "--approve-all" ? "all" : "interactive";
applyIngestion(stagingArg, mode).catch((err) => {
  console.error("Apply ingestion failed:", err);
  process.exit(1);
});
