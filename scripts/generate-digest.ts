/**
 * Weekly Research Digest Generator
 *
 * Fetches papers from all sources for the past N days,
 * deduplicates, classifies, scores, and outputs a digest JSON.
 *
 * Usage: npx tsx scripts/generate-digest.ts --days 14
 */

import fs from "fs";
import path from "path";

// Load environment variables from .env if present
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx);
        const value = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  }
}

import { getResearchFeed, ResearchPaper } from "../src/lib/api/research-aggregator";
import { ClassifiedPaper } from "../src/lib/api/paper-classifier";
import { computeCompositeScore } from "../src/lib/api/digest-scorer";
import { DigestPaper, WeeklyDigest } from "../src/lib/types/digest";

// Parse --days argument
const daysArg = process.argv.find((a) => a.startsWith("--days="));
const daysFlag = process.argv.indexOf("--days");
const days = daysArg
  ? parseInt(daysArg.split("=")[1])
  : daysFlag >= 0 && process.argv[daysFlag + 1]
    ? parseInt(process.argv[daysFlag + 1])
    : 14;

/**
 * Get ISO week ID: YYYY-WXX
 */
function getWeekId(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(
    ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Map a ClassifiedPaper to a DigestPaper with composite score.
 */
function toDigestPaper(paper: ClassifiedPaper): DigestPaper {
  return {
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors,
    publishedDate: paper.publishedDate,
    url: paper.url,
    pdfUrl: paper.pdfUrl,
    doi: paper.doi,
    citationCount: paper.citationCount,
    classifiedTier: paper.classifiedTier,
    source: paper.source,
    relevanceScore: paper.relevanceScore,
    linkedPredictions: paper.linkedPredictions,
    isTrackedAuthor: paper.isTrackedAuthor,
    trackedAuthorName: paper.trackedAuthorName,
    compositeScore: computeCompositeScore(paper),
  };
}

const DISPLACEMENT_SLUGS = new Set([
  "overall-us-displacement",
  "total-us-jobs-lost",
  "white-collar-professional-displacement",
  "tech-sector-displacement",
  "creative-industry-displacement",
  "education-sector-displacement",
  "healthcare-admin-displacement",
  "customer-service-automation",
]);

const WAGES_SLUGS = new Set([
  "median-wage-impact",
  "geographic-wage-divergence",
  "entry-level-wage-impact",
  "high-skill-wage-premium",
  "freelancer-rate-impact",
]);

const ADOPTION_SLUGS = new Set(["ai-adoption-rate"]);
const SIGNALS_SLUGS = new Set(["earnings-call-ai-mentions"]);

function categorize(paper: DigestPaper) {
  const slugs = paper.linkedPredictions.map((lp) => lp.slug);
  if (slugs.some((s) => DISPLACEMENT_SLUGS.has(s))) return "displacement";
  if (slugs.some((s) => WAGES_SLUGS.has(s))) return "wages";
  if (slugs.some((s) => ADOPTION_SLUGS.has(s))) return "adoption";
  if (slugs.some((s) => SIGNALS_SLUGS.has(s))) return "signals";
  return "unlinked";
}

async function main() {
  console.log(`Generating digest for the past ${days} days...`);
  console.log("Fetching from all sources...");

  // Fetch papers with a low relevance threshold so we get more candidates
  const papers = await getResearchFeed({
    minRelevanceScore: 2,
    maxResults: 200,
    tiers: undefined,
  });

  console.log(`Found ${papers.length} papers after dedup + classification`);

  // Convert to digest papers with composite scores
  const digestPapers = papers
    .map(toDigestPaper)
    .sort((a, b) => b.compositeScore - a.compositeScore);

  // Take top papers
  const topPapers = digestPapers.slice(0, 50);

  // Categorize
  const byCategory: WeeklyDigest["byCategory"] = {
    displacement: [],
    wages: [],
    adoption: [],
    signals: [],
    unlinked: [],
  };

  for (const paper of topPapers) {
    const cat = categorize(paper);
    byCategory[cat].push(paper);
  }

  // Stats
  const bySource: Record<string, number> = {};
  const byTier: Record<string, number> = {};
  let trackedAuthorCount = 0;

  for (const paper of topPapers) {
    bySource[paper.source] = (bySource[paper.source] || 0) + 1;
    byTier[String(paper.classifiedTier)] = (byTier[String(paper.classifiedTier)] || 0) + 1;
    if (paper.isTrackedAuthor) trackedAuthorCount++;
  }

  const now = new Date();
  const weekId = getWeekId(now);
  const from = new Date(now);
  from.setDate(from.getDate() - days);

  const digest: WeeklyDigest = {
    weekId,
    generatedAt: now.toISOString(),
    dateRange: {
      from: from.toISOString().split("T")[0],
      to: now.toISOString().split("T")[0],
    },
    totalPapersDiscovered: papers.length,
    totalAfterDedup: papers.length,
    papers: topPapers,
    byCategory,
    stats: {
      bySource,
      byTier,
      trackedAuthorCount,
    },
  };

  // Write digest
  const digestsDir = path.join(process.cwd(), "src/data/digests");
  if (!fs.existsSync(digestsDir)) {
    fs.mkdirSync(digestsDir, { recursive: true });
  }

  const digestPath = path.join(digestsDir, `${weekId}.json`);
  fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));
  console.log(`Wrote digest to ${digestPath}`);

  // Write latest pointer
  const latestPath = path.join(digestsDir, "latest.json");
  fs.writeFileSync(
    latestPath,
    JSON.stringify(
      { currentWeek: weekId, generatedAt: now.toISOString() },
      null,
      2
    )
  );
  console.log(`Updated latest pointer to ${weekId}`);

  // Summary
  console.log("\n--- Digest Summary ---");
  console.log(`Week: ${weekId}`);
  console.log(`Total papers: ${topPapers.length}`);
  console.log(`By category: displacement=${byCategory.displacement.length}, wages=${byCategory.wages.length}, adoption=${byCategory.adoption.length}, signals=${byCategory.signals.length}, unlinked=${byCategory.unlinked.length}`);
  console.log(`By source: ${Object.entries(bySource).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  console.log(`Tracked authors: ${trackedAuthorCount}`);
  console.log(`Top 5 papers:`);
  for (const p of topPapers.slice(0, 5)) {
    console.log(`  [${p.compositeScore}pts] ${p.title.slice(0, 80)}`);
  }
}

main().catch((err) => {
  console.error("Digest generation failed:", err);
  process.exit(1);
});
