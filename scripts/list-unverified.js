const db = JSON.parse(require("fs").readFileSync("src/data/confirmed-sources.json", "utf8"));
const unverified = Object.entries(db.sources).filter(([, s]) => !s.verified && !s._action);
console.log("Unverified sources:", unverified.length);
unverified.forEach(([id, s]) => console.log(id, "|", s.title, "|", s.url));
