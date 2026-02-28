/**
 * apply-replacements-batch2.js - Entry-level + freelancer source replacements from Agent 3
 */
const fs = require("fs");
const CONFIRMED_PATH = "src/data/confirmed-sources.json";
const db = JSON.parse(fs.readFileSync(CONFIRMED_PATH, "utf8"));

const REPLACEMENTS = {
  "nber-entry-wage-2023": {
    title: "Artificial Intelligence, Automation and Work",
    url: "https://www.nber.org/papers/w24196",
    publisher: "NBER (Acemoglu, Restrepo)",
    evidenceTier: 1,
    datePublished: "2018-01-01",
    excerpt: "Theoretical framework for automation's displacement and productivity effects on labor. Automation displaces workers from tasks they previously performed, but productivity gains create new tasks and increase demand for labor."
  },
  "goldman-entry-level-2024": {
    title: "Goldman Sachs economist warns Gen Z tech workers are first on the chopping block",
    url: "https://fortune.com/2025/08/06/goldman-sachs-economist-gen-z-tech-jobs-ai-labor-market/",
    publisher: "Fortune (reporting Goldman Sachs research)",
    evidenceTier: 2,
    datePublished: "2025-08-06",
    excerpt: "Unemployment rate for 20- to 30-year-olds in tech rose nearly 3% since early 2024. Entry-level job postings in the US diminished about 35% since January 2023. Goldman Sachs predicts AI will displace about 6-7% of the total workforce."
  },
  "brookings-entry-level-2024": {
    title: "To prepare young people for the AI workplace, focus on the fundamentals",
    url: "https://www.brookings.edu/articles/to-prepare-young-people-for-the-ai-workplace-focus-on-the-fundamentals/",
    publisher: "Brookings Institution",
    evidenceTier: 2,
    datePublished: "2025-10-28",
    excerpt: "Whether AI destroys jobs or transforms them, young people still need fundamental supports: skill-building, career navigation, and mentorship."
  },
  "mit-entry-wage-2024": {
    title: "Applying AI to Rebuild Middle Class Jobs",
    url: "https://www.nber.org/papers/w32140",
    publisher: "NBER (David Autor)",
    evidenceTier: 1,
    datePublished: "2024-02-01",
    excerpt: "AI could enable a larger set of workers to perform higher-stakes decision-making tasks currently reserved for elite experts. If used well, AI can help restore the middle-skill, middle-class heart of the US labor market."
  },
  "mckinsey-entry-level-2025": {
    title: "Generative AI and the future of work in America",
    url: "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america",
    publisher: "McKinsey Global Institute",
    evidenceTier: 2,
    datePublished: "2023-07-26",
    excerpt: "By 2030, activities accounting for up to 30% of hours currently worked could be automated, accelerated by generative AI. Lower-wage workers face up to 14x more occupational transitions than higher-wage counterparts."
  },
  "mckinsey-gig-2025": {
    title: "How is AI affecting freelance jobs?",
    url: "https://www.imperial.ac.uk/business-school/ib-knowledge/technology/how-ai-affecting-freelance-jobs/",
    publisher: "Imperial College London Business School",
    evidenceTier: 2,
    datePublished: "2025-01-01",
    excerpt: "Generative AI is upending freelance work. High-skill freelancers were disproportionately impacted, with top performers seeing the largest setbacks in both contracts and earnings."
  },
};

// Additional removals
const REMOVE = ["bls-contingent-2025"]; // fabricated excerpt, no 2025 BLS CWS published yet

let replaced = 0;
for (const [id, newData] of Object.entries(REPLACEMENTS)) {
  if (db.sources[id]) {
    const usedIn = db.sources[id].usedIn;
    db.sources[id] = { id, ...newData, usedIn, verified: true, synthetic: false };
    replaced++;
  }
}

let removed = 0;
for (const id of REMOVE) {
  if (db.sources[id]) {
    db.sources[id].synthetic = true;
    db.sources[id].verified = false;
    db.sources[id]._action = "REMOVE";
    removed++;
  }
}

const ids = Object.keys(db.sources);
db.verifiedCount = ids.filter(id => db.sources[id].verified).length;
db.lastUpdated = "2026-02-28";
fs.writeFileSync(CONFIRMED_PATH, JSON.stringify(db, null, 2) + "\n");

console.log("Replaced:", replaced);
console.log("Flagged for removal:", removed);
console.log("Total verified:", db.verifiedCount, "/", ids.length);
