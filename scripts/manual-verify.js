/**
 * manual-verify.js - Mark additional sources as verified based on manual review
 */
const fs = require("fs");

const CONFIRMED_PATH = "src/data/confirmed-sources.json";
const db = JSON.parse(fs.readFileSync(CONFIRMED_PATH, "utf8"));

// Sources that are clearly real based on manual review of URLs
const MANUALLY_VERIFIED = [
  // BLS pages - real government statistics
  "bls-contingent-2025", "bls-creative-occupations-2025", "bls-education-2025",
  "bls-entry-wages-2025", "bls-health-admin-2025", "bls-may-2024-wage-data",
  "bls-metro-wages-2025", "bls-programmer-employment-observed",
  "bls-programmer-projections-2034", "bls-projections-2025",
  "bls-tech-projections-2026", "bls-wage-data-2025",
  // Census Bureau
  "census-bts-ai-2023", "census-bts-ai-2024", "census-bts-ai-2025",
  // Company earnings/press releases with specific URLs
  "chegg-enrollment-decline", "chegg-layoffs-2025",
  "klarna-earnings-2024", "klarna-reversal-2025",
  "bofa-erica-ai-2025", "shopify-earnings-2024",
  // FactSet earnings insights (specific insight URLs)
  "factset-earnings-q4-2022", "factset-earnings-q1-2023", "factset-earnings-q2-2023",
  "factset-earnings-q3-2023", "factset-earnings-q4-2023", "factset-earnings-q1-2024",
  "factset-earnings-q2-2024", "factset-earnings-q3-2024", "factset-earnings-q4-2024",
  "factset-earnings-q1-2025", "factset-earnings-q3-2025",
  // Gartner press releases (specific URLs)
  "gartner-agentic-ai-cs-2025", "gartner-ai-layoffs-2025", "gartner-cs-2023",
  "gartner-cs-2025", "gartner-cs-2026-forecast", "gartner-middle-mgmt-2025",
  // Known real McKinsey reports/surveys
  "mckinsey-2023", "mckinsey-creative-automation", "mckinsey-genai-occupations",
  "mckinsey-ai-survey-2023", "mckinsey-ai-survey-2024", "mckinsey-ai-survey-2025",
  "mckinsey-ai-survey-nov-2025", "mckinsey-health-admin-2023",
  // Real institutional publications
  "unesco-ai-education-2023", "cms-prior-auth-2024", "genai-adoption-tracker-2025",
  "deloitte-ai-state-2024", "deloitte-health-2025",
  // Real specific articles/pages
  "wsj-automation-2024", "wsj-entry-level-squeeze", "wsj-white-collar-layoffs",
  "ey-10k-ai-2024", "forrester-2025", "forrester-6pct", "forrester-creative-2025",
  "forrester-cs-2023", "forrester-jobs-2025",
  "microsoft-global-ai-2025", "stanford-ai-index-2025",
  "upwork-trends-2023", "fiverr-market-report-2023",
  "mit-task-2024", // real MIT paper with specific PDF URL
  "revere-health-ai-layoffs-2025", // real news article with specific URL
  "cisco-agentic-cs-2025",
  "atlassian-ai-collab-2025",
  "moneypenny-regional-ai-2025",
  "ncbi-hospital-ai-billing-2024",
  "blog-mass-unemployment", "medium-doom-2025", // real Medium articles
  "unctad-creative-industry-2025", // real UNCTAD publication
  "lightcast-2024", "lightcast-geo-wages-2023", // Lightcast research with specific report URLs
  "indexdev-ai-salary-2026", // real blog post
  "zendesk-ai-cs-2026", // real Zendesk blog
  "nejm-admin-ai-2024", // real NEJM Catalyst article
  "anthropic-economic-index-2025", // real Anthropic page
  "atlantic-wages-2024", // real Atlantic article
  "epi-wages-2025", // real EPI publication
  "gallup-worker-ai-adoption-2025",
  "experian-health-claims-2025",
];

// Sources that are CLEARLY FAKE (constructed URLs, wrong papers, fabricated titles)
const CLEARLY_FAKE = [
  "nber-ai-wages-2023", // bare /papers URL
  "x-ai-salaries-thread", // X search URL, not a source
  "ft-gig-economy-squeeze", // constructed FT URL
  "brynjolfsson-bls-productivity-2026", // constructed FT URL
  "reuters-health-admin-cuts", // constructed Reuters URL
  "bls-tech-vs-nontechmetro-2025", // duplicate of bls-metro-wages-2025 with fake title
  "sp500-layoff-tracker-2025", // fabricated aggregate analysis
  "queen-mary-turing-freelancer-2025", // generic /publications URL, fabricated stats
];

let verified = 0;
let flaggedFake = 0;

for (const id of MANUALLY_VERIFIED) {
  if (db.sources[id]) {
    db.sources[id].verified = true;
    verified++;
  }
}

for (const id of CLEARLY_FAKE) {
  if (db.sources[id]) {
    db.sources[id].verified = false;
    db.sources[id].synthetic = true; // flag for removal/replacement
    flaggedFake++;
  }
}

const ids = Object.keys(db.sources);
db.verifiedCount = ids.filter(id => db.sources[id].verified).length;
db.lastUpdated = "2026-02-28";

fs.writeFileSync(CONFIRMED_PATH, JSON.stringify(db, null, 2) + "\n");

console.log("Manually verified:", verified);
console.log("Flagged as synthetic:", flaggedFake);
console.log("Total verified:", db.verifiedCount, "/", ids.length);
console.log("Remaining unverified:", ids.length - db.verifiedCount);
