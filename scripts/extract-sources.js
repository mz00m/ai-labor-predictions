const fs = require("fs");
const path = require("path");

const dirs = [
  "src/data/predictions/displacement",
  "src/data/predictions/wages",
  "src/data/predictions/adoption",
  "src/data/predictions/signals",
  "src/data/predictions/exposure"
];

const allSources = {};
const sourceUsage = {};

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!data.sources) continue;
    const predSlug = data.slug || data.id;
    for (const src of data.sources) {
      if (!allSources[src.id]) {
        allSources[src.id] = { ...src };
        sourceUsage[src.id] = [];
      }
      sourceUsage[src.id].push(predSlug);
    }
  }
}

// Build the confirmed sources database
const confirmedSources = {};
const ids = Object.keys(allSources).sort();

for (const id of ids) {
  confirmedSources[id] = {
    ...allSources[id],
    usedIn: sourceUsage[id],
    verified: false // default to unverified; will be set to true after confirmation
  };
}

const output = {
  _comment: "Centralized source database. Each source is verified once and referenced by ID across prediction files.",
  lastUpdated: "2026-02-28",
  totalSources: ids.length,
  verifiedCount: 0,
  sources: confirmedSources
};

fs.writeFileSync(
  "src/data/confirmed-sources.json",
  JSON.stringify(output, null, 2) + "\n"
);

console.log("Total unique sources:", ids.length);
console.log("Shared across files:", ids.filter(id => sourceUsage[id].length > 1).length);
ids.filter(id => sourceUsage[id].length > 1).forEach(id => {
  console.log("  " + id + " -> " + sourceUsage[id].join(", "));
});
console.log("\nWrote src/data/confirmed-sources.json");
