/**
 * remove-unsupported-history-batch2.js
 *
 * Removes history entries where the replacement source no longer supports
 * the plotted value. This handles the batch3 replacements.
 */
const fs = require("fs");
const path = require("path");

// Sources whose replacement content does NOT support the original data point value.
// Each entry explains why the value is no longer supported.
const UNSUPPORTED_HISTORY_SOURCES = [
  // geographic-divergence.json:
  "glassdoor-ai-salaries-2025",   // value=40 "hub premium" but replacement says 25% AI premium (not geo premium)
  "techcrunch-ai-salary-gap",     // value=45 "hub premium" but replacement is about 28% AI skills premium (not geo)
  "linkedin-econ-graph-2023",     // value=28 "hub premium" but replacement is about 55% of jobs impacted (not geo wages)
  "lightcast-geo-wages-2023",     // value=30 "hub premium" but replacement only says SF=$177K (no comparison figure)

  // high-skill-premium.json:
  "mit-ai-premium-2025",   // value=25 but replacement says 11% premium (not 25%)
  "ft-ai-salaries-2024",   // value=24 but replacement is about hiring costs (not wage premium metric)
  "msft-earnings-2024",    // value=22 but replacement is about Azure AI revenue (not wage premium)

  // white-collar-professional.json:
  "deloitte-professional-services-2025", // value=18 "% roles displaced" but replacement is about workforce evolution/upskilling

  // creative-industry.json:
  "fiverr-10k-2024",  // value=22 but replacement says revenue declined 1.3% (not a displacement figure)
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
      console.log(filePath + ": removed " + removed + " unsupported history entries");
    }
  }
}

console.log("\nTotal unsupported history entries removed:", totalRemoved);
