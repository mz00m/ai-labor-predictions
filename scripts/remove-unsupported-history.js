/**
 * remove-unsupported-history.js
 *
 * Removes history entries where the replacement source no longer supports
 * the plotted value (i.e., the original data was fabricated).
 */
const fs = require("fs");
const path = require("path");

// Sources that were REPLACED (not removed) but whose history values
// are NOT supported by the replacement source's real content.
const UNSUPPORTED_HISTORY_SOURCES = [
  "stanford-codex-legal-ai",       // value=12 "decline" but real data shows hiring UP 13%
  "bls-tech-projections-2026",     // value=6 "decline" but BLS says 15% GROWTH
  "nber-entry-wage-2023",          // value=-4 but replacement is a 2018 theory paper
  "goldman-entry-level-2024",      // value=-6 "wage decline" but source is about postings
  "brookings-entry-level-2024",    // value=-8 but source is about youth preparation, no wage figure
  "mit-entry-wage-2024",           // value=-7 but Autor's paper is optimistic about AI
  "mckinsey-entry-level-2025",     // value=-10 but source says "30% of hours" not wage decline
  "mckinsey-gig-2025",            // value=-22 but Imperial article has no specific rate
  "himss-medical-coding-ai-2025", // value=35 "staff reduction" but HIMSS paper says $122B savings
];

const unsupportedSet = new Set(UNSUPPORTED_HISTORY_SOURCES);

const PREDICTION_DIRS = [
  "src/data/predictions/displacement",
  "src/data/predictions/wages",
  "src/data/predictions/adoption",
  "src/data/predictions/signals",
  "src/data/predictions/exposure",
];

let totalRemoved = 0;

for (const dir of PREDICTION_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!data.history) continue;

    const before = data.history.length;
    data.history = data.history.filter(h => {
      return !h.sourceIds.some(id => unsupportedSet.has(id));
    });
    const removed = before - data.history.length;

    if (removed > 0) {
      totalRemoved += removed;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
      console.log(`${filePath}: removed ${removed} unsupported history entries`);
    }
  }
}

console.log("\nTotal unsupported history entries removed:", totalRemoved);
