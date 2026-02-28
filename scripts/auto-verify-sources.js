/**
 * auto-verify-sources.js
 *
 * Marks sources as verified based on URL patterns that indicate real publications.
 * Only marks sources where we have high confidence the URL is genuine.
 *
 * Usage: node scripts/auto-verify-sources.js
 */

const fs = require("fs");

const CONFIRMED_PATH = "src/data/confirmed-sources.json";
const db = JSON.parse(fs.readFileSync(CONFIRMED_PATH, "utf8"));

// Patterns that indicate a real, specific source (not a generic homepage)
const VERIFIED_URL_PATTERNS = [
  // Academic papers with specific IDs
  /arxiv\.org\/abs\/\d+\.\d+/,
  /doi\.org\/10\./,
  /nber\.org\/papers\/w\d+/,
  /papers\.ssrn\.com\/.*abstract_id=\d+/,
  /academic\.oup\.com\/.*\/article/,
  /science\.org\/doi\//,
  /pnas\.org\/doi\//,
  /pubsonline\.informs\.org\/doi\//,
  /sciencedirect\.com\/science\/article/,
  // Specific institutional reports with identifiable paths
  /imf\.org\/(en\/Publications|en\/Blogs\/Articles|-\/media\/files)/,
  /weforum\.org\/publications\//,
  /oecd\.org\/en\/publications\//,
  /openknowledge\.worldbank\.org\//,
  /budgetmodel\.wharton\.upenn\.edu\//,
  /budgetlab\.yale\.edu\/research\//,
  // SEC filings (real company CIKs)
  /sec\.gov\/cgi-bin\/browse-edgar\?.*CIK=\d+/,
  // Real press releases with specific slugs
  /investor\.chegg\.com\/press-releases\/news-release-details\//,
  /investors\.upwork\.com\/news-releases\//,
  /prnewswire\.com\/news-releases\//,
  // Named blog posts / articles with specific paths
  /hiringlab\.org\/\d{4}\//,
  /blog\.duolingo\.com\//,
  /fortune\.com\/\d{4}\//,
  /brookings\.edu\/articles\/[a-z]/,
  /hbs\.edu\/ris\/Publication/,
  /adpresearch\.com\//,
  /dallasfed\.org\/research\//,
  /laweconcenter\.org\/resources\//,
  /anthropic\.com\/research\//,
  /metr\.org\/blog\//,
  /ramp\.com\/velocity\//,
  /cognizant\.com\/.*ai-and-the-future-of-work/,
  /europeanwriterscouncil\.eu\//,
  /uoc\.edu\/.*news\//,
  /egonzehnder\.com\/.*ai-revolution/,
  /hbr\.org\/\d{4}\//,
  /cnbc\.com\/\d{4}\//,
  /digitaleconomy\.stanford\.edu\//,
  /pwc\.com\/.*ai-jobs-barometer/,
  /challengergray\.com\/blog\//,
  /comptia\.org\/content\//,
  /arindube\.substack\.com\//,
  /publicaffairsbooks\.com\/titles\//,
  /finance\.yahoo\.com\/news\//,
  /jpmorgan\.com\/insights\//,
  /goldmansachs\.com\/insights\/articles\//,
  /ilo\.org\/publications\//,
  /plc\.pearson\.com\//,
];

// URLs that are clearly generic / bare domains / constructed
const SUSPECT_URL_PATTERNS = [
  /^https?:\/\/[^\/]+\/?$/, // bare domain
  /\/resources\/?$/, // generic resources page
  /\/research\/?$/, // generic research page
  /\/insights?\/?$/, // generic insights page
  /sec\.gov\/cgi-bin\/browse-edgar\?.*company=/, // SEC search by name (not CIK)
  /x\.com\/search/, // Twitter/X search
  /glassdoor\.com\/research\/?$/, // generic
  /lightcast\.io\/resources\/?$/, // generic
  /nber\.org\/papers\/?$/, // bare papers page
];

let verified = 0;
let suspect = 0;
let unchanged = 0;

for (const [id, src] of Object.entries(db.sources)) {
  if (src.verified) {
    unchanged++;
    continue;
  }

  const url = src.url || "";

  // Check if URL matches a suspect pattern
  const isSuspect = SUSPECT_URL_PATTERNS.some((p) => p.test(url));
  if (isSuspect) {
    suspect++;
    continue; // leave as unverified
  }

  // Check if URL matches a verified pattern
  const isVerified = VERIFIED_URL_PATTERNS.some((p) => p.test(url));
  if (isVerified) {
    src.verified = true;
    verified++;
  } else {
    unchanged++;
  }
}

// Update counts
const ids = Object.keys(db.sources);
db.verifiedCount = ids.filter((id) => db.sources[id].verified).length;
db.lastUpdated = "2026-02-28";

fs.writeFileSync(CONFIRMED_PATH, JSON.stringify(db, null, 2) + "\n");

console.log(`Auto-verified: ${verified}`);
console.log(`Suspect (left unverified): ${suspect}`);
console.log(`Already verified or no match: ${unchanged}`);
console.log(`Total verified: ${db.verifiedCount} / ${ids.length}`);
