/**
 * sync-and-clean.js
 *
 * 1. Syncs source metadata from confirmed-sources.json → prediction files
 * 2. Removes history/overlay entries that reference sources marked for removal
 * 3. Removes the source entries themselves from prediction files
 */
const fs = require("fs");
const path = require("path");

const CONFIRMED_PATH = "src/data/confirmed-sources.json";
const db = JSON.parse(fs.readFileSync(CONFIRMED_PATH, "utf8"));

const PREDICTION_DIRS = [
  "src/data/predictions/displacement",
  "src/data/predictions/wages",
  "src/data/predictions/adoption",
  "src/data/predictions/signals",
  "src/data/predictions/exposure",
];

// Get list of source IDs marked for removal
const removeIds = new Set(
  Object.entries(db.sources)
    .filter(([, s]) => s._action === "REMOVE")
    .map(([id]) => id)
);

console.log("Sources to remove:", [...removeIds].join(", "));

let totalSourceUpdates = 0;
let totalHistoryRemoved = 0;
let totalOverlayRemoved = 0;
let totalSourcesRemoved = 0;

for (const dir of PREDICTION_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!data.sources) continue;

    let fileChanged = false;

    // 1. Remove history entries referencing removed sources
    if (data.history) {
      const before = data.history.length;
      data.history = data.history.filter((h) => {
        const hasRemovedSource = h.sourceIds.some((id) => removeIds.has(id));
        return !hasRemovedSource;
      });
      const removed = before - data.history.length;
      if (removed > 0) {
        totalHistoryRemoved += removed;
        fileChanged = true;
        console.log(`${filePath}: removed ${removed} history entries`);
      }
    }

    // 2. Remove overlay entries referencing removed sources
    if (data.overlays) {
      const before = data.overlays.length;
      data.overlays = data.overlays.filter((o) => {
        const hasRemovedSource = o.sourceIds.some((id) => removeIds.has(id));
        return !hasRemovedSource;
      });
      const removed = before - data.overlays.length;
      if (removed > 0) {
        totalOverlayRemoved += removed;
        fileChanged = true;
        console.log(`${filePath}: removed ${removed} overlay entries`);
      }
    }

    // 3. Remove source entries marked for removal
    const beforeSources = data.sources.length;
    data.sources = data.sources.filter((s) => !removeIds.has(s.id));
    const removedSources = beforeSources - data.sources.length;
    if (removedSources > 0) {
      totalSourcesRemoved += removedSources;
      fileChanged = true;
      console.log(`${filePath}: removed ${removedSources} source entries`);
    }

    // 4. Update source metadata from confirmed-sources.json for replaced sources
    data.sources = data.sources.map((src) => {
      const central = db.sources[src.id];
      if (!central || central._action === "REMOVE") return src;

      const { usedIn, verified, synthetic, _action, ...centralSource } = central;
      const changed =
        centralSource.url !== src.url ||
        centralSource.title !== src.title ||
        centralSource.publisher !== src.publisher ||
        centralSource.excerpt !== src.excerpt ||
        centralSource.datePublished !== src.datePublished;

      if (changed) {
        totalSourceUpdates++;
        fileChanged = true;
        return centralSource;
      }
      return src;
    });

    if (fileChanged) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    }
  }
}

console.log("\n=== Summary ===");
console.log("History entries removed:", totalHistoryRemoved);
console.log("Overlay entries removed:", totalOverlayRemoved);
console.log("Source entries removed:", totalSourcesRemoved);
console.log("Source metadata updated:", totalSourceUpdates);
