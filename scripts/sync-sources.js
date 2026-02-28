/**
 * sync-sources.js
 *
 * Synchronizes sources between confirmed-sources.json and prediction files.
 *
 * Usage:
 *   node scripts/sync-sources.js              # Preview changes (dry run)
 *   node scripts/sync-sources.js --write      # Apply changes to prediction files
 *   node scripts/sync-sources.js --extract    # Re-extract from prediction files into confirmed-sources.json
 */

const fs = require("fs");
const path = require("path");

const CONFIRMED_PATH = "src/data/confirmed-sources.json";
const PREDICTION_DIRS = [
  "src/data/predictions/displacement",
  "src/data/predictions/wages",
  "src/data/predictions/adoption",
  "src/data/predictions/signals",
  "src/data/predictions/exposure",
];

const args = process.argv.slice(2);
const doWrite = args.includes("--write");
const doExtract = args.includes("--extract");

function loadPredictionFiles() {
  const files = [];
  for (const dir of PREDICTION_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const filePath = path.join(dir, file);
      files.push({ path: filePath, data: JSON.parse(fs.readFileSync(filePath, "utf8")) });
    }
  }
  return files;
}

if (doExtract) {
  // Re-extract sources from prediction files into confirmed-sources.json
  const predFiles = loadPredictionFiles();
  const confirmed = fs.existsSync(CONFIRMED_PATH)
    ? JSON.parse(fs.readFileSync(CONFIRMED_PATH, "utf8"))
    : { sources: {} };

  let added = 0;
  let updated = 0;

  for (const { path: fp, data } of predFiles) {
    if (!data.sources) continue;
    const predSlug = data.slug || data.id;
    for (const src of data.sources) {
      const existing = confirmed.sources[src.id];
      if (!existing) {
        confirmed.sources[src.id] = {
          ...src,
          usedIn: [predSlug],
          verified: false,
        };
        added++;
      } else {
        // Update usedIn if this prediction isn't listed
        if (!existing.usedIn.includes(predSlug)) {
          existing.usedIn.push(predSlug);
        }
        // Update fields from prediction file if they differ (prediction file is fresher)
        if (src.url !== existing.url || src.title !== existing.title) {
          Object.assign(existing, { ...src, usedIn: existing.usedIn, verified: existing.verified });
          updated++;
        }
      }
    }
  }

  const ids = Object.keys(confirmed.sources).sort();
  const sortedSources = {};
  for (const id of ids) sortedSources[id] = confirmed.sources[id];

  confirmed.sources = sortedSources;
  confirmed.totalSources = ids.length;
  confirmed.verifiedCount = ids.filter((id) => confirmed.sources[id].verified).length;
  confirmed.lastUpdated = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(CONFIRMED_PATH, JSON.stringify(confirmed, null, 2) + "\n");
  console.log(`Extracted: ${added} new, ${updated} updated, ${ids.length} total`);
} else {
  // Sync FROM confirmed-sources.json TO prediction files
  if (!fs.existsSync(CONFIRMED_PATH)) {
    console.error("No confirmed-sources.json found. Run with --extract first.");
    process.exit(1);
  }

  const confirmed = JSON.parse(fs.readFileSync(CONFIRMED_PATH, "utf8"));
  const predFiles = loadPredictionFiles();
  let totalChanges = 0;

  for (const { path: fp, data } of predFiles) {
    if (!data.sources) continue;
    let fileChanges = 0;

    const updatedSources = data.sources.map((src) => {
      const central = confirmed.sources[src.id];
      if (!central) return src; // not in central DB, keep as-is

      // Build the source object from central (excluding internal fields)
      const { usedIn, verified, ...centralSource } = central;
      const changed =
        centralSource.url !== src.url ||
        centralSource.title !== src.title ||
        centralSource.publisher !== src.publisher ||
        centralSource.excerpt !== src.excerpt;

      if (changed) {
        fileChanges++;
        return centralSource;
      }
      return src;
    });

    if (fileChanges > 0) {
      totalChanges += fileChanges;
      console.log(`${fp}: ${fileChanges} source(s) to update`);

      if (doWrite) {
        data.sources = updatedSources;
        fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
        console.log(`  -> Written`);
      }
    }
  }

  if (totalChanges === 0) {
    console.log("All prediction files are in sync with confirmed-sources.json");
  } else if (!doWrite) {
    console.log(`\n${totalChanges} change(s) pending. Run with --write to apply.`);
  } else {
    console.log(`\n${totalChanges} change(s) applied.`);
  }
}
