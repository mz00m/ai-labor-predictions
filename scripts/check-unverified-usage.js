const fs = require("fs");
const path = require("path");
const db = JSON.parse(fs.readFileSync("src/data/confirmed-sources.json", "utf8"));
const unverified = new Set(Object.entries(db.sources).filter(([, s]) => !s.verified && !s._action).map(([id]) => id));

const DIRS = [
  "src/data/predictions/displacement",
  "src/data/predictions/wages",
  "src/data/predictions/adoption",
  "src/data/predictions/signals",
  "src/data/predictions/exposure",
];

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    // Check history entries
    if (data.history) {
      for (const h of data.history) {
        const unvIds = h.sourceIds.filter(id => unverified.has(id));
        if (unvIds.length > 0) {
          console.log(`HISTORY | ${file} | date=${h.date} value=${h.value} | sources: ${unvIds.join(", ")}`);
        }
      }
    }
    
    // Check overlay entries
    if (data.overlays) {
      for (const o of data.overlays) {
        const unvIds = o.sourceIds.filter(id => unverified.has(id));
        if (unvIds.length > 0) {
          console.log(`OVERLAY | ${file} | date=${o.date} dir=${o.direction} | sources: ${unvIds.join(", ")}`);
        }
      }
    }
  }
}
