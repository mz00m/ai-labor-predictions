#!/usr/bin/env npx tsx
/**
 * O*NET Occupation Enrichment Script
 *
 * Enriches the 342 Karpathy occupations with O*NET task data:
 * 1. Matches Karpathy titles to O*NET SOC codes (fuzzy title matching)
 * 2. Pulls Generalized Work Activity importance scores per occupation
 * 3. Maps Work Activities to our 8 internal task categories
 * 4. Pulls Task Statements per occupation
 * 5. Outputs enriched-occupations.json
 *
 * Prerequisites:
 *   Download O*NET 30.2 database from https://www.onetcenter.org/database.html
 *   Extract these files to db/onet/:
 *     - Occupation Data.txt
 *     - Task Statements.txt
 *     - Work Activities.txt
 *
 * Usage:
 *   npx tsx scripts/enrich-occupations.ts
 *   npx tsx scripts/enrich-occupations.ts --dry-run    # Preview matches, don't write
 *   npx tsx scripts/enrich-occupations.ts --verbose     # Show detailed match info
 */

import * as fs from "fs";
import * as path from "path";
import {
  WORK_ACTIVITY_TO_CATEGORY,
  ALL_TASK_CATEGORIES,
  computeTaskComposition,
} from "./onet/work-activity-mapping";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KarpathyJob {
  title: string;
  slug: string;
  category: string;
  pay: number | null;
  jobs: number | null;
  outlook: number | null;
  outlook_desc: string;
  education: string;
  exposure: number;
  exposure_rationale: string;
  url: string;
}

interface OnetOccupation {
  code: string; // e.g., "13-2011.00"
  title: string;
  description: string;
}

interface OnetWorkActivity {
  code: string; // O*NET-SOC code
  elementId: string; // e.g., "4.A.1.a.1"
  elementName: string;
  scaleId: string; // "IM" = importance, "LV" = level
  dataValue: number;
}

interface OnetTask {
  code: string;
  taskId: string;
  task: string;
  taskType: string;
}

interface EnrichedOccupation {
  slug: string;
  title: string;
  onetCode: string | null;
  onetTitle: string | null;
  matchConfidence: number; // 0-1 similarity score
  category: string; // Karpathy category
  pay: number | null;
  jobs: number | null;
  education: string;
  exposure: number;
  exposure_rationale: string;
  blsUrl: string;
  taskComposition: Record<string, number>; // 8 categories summing to 1.0
  tasks: Array<{
    name: string;
    category: string; // TaskCategory
    importance: number; // 1-5 from O*NET
  }>;
  onetTasks: string[]; // Raw O*NET task statements
  workActivities: Array<{
    elementId: string;
    name: string;
    importance: number;
    category: string;
  }>;
}

// ---------------------------------------------------------------------------
// CSV Parsing (tab-delimited, O*NET format)
// ---------------------------------------------------------------------------

function parseTsv(content: string): Record<string, string>[] {
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split("\t");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] || "").trim();
    });
    return row;
  });
}

// ---------------------------------------------------------------------------
// Title Similarity (Levenshtein-based)
// ---------------------------------------------------------------------------

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function titleSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1.0;

  // Check if one contains the other
  if (na.includes(nb) || nb.includes(na)) {
    return 0.9;
  }

  // Token overlap score
  const tokensA = new Set(na.split(/\s+/));
  const tokensB = new Set(nb.split(/\s+/));
  const intersection = [...tokensA].filter((t) => tokensB.has(t));
  const tokenScore =
    (2 * intersection.length) / (tokensA.size + tokensB.size);

  // Levenshtein-based score
  const maxLen = Math.max(na.length, nb.length);
  const levScore = maxLen === 0 ? 1 : 1 - levenshtein(na, nb) / maxLen;

  // Weighted combination: token overlap matters more for multi-word titles
  return tokenScore * 0.6 + levScore * 0.4;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[,\-\/\\()&]/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/\bthe\b/g, " ")
    .replace(/\bof\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Known Manual Overrides
// ---------------------------------------------------------------------------

/**
 * Manual crosswalk for occupations where fuzzy matching is unreliable.
 * Maps Karpathy slug → O*NET SOC code.
 * Add entries here when the automatic matcher picks the wrong code.
 */
const MANUAL_CROSSWALK: Record<string, string> = {
  // Healthcare roles that often confuse the matcher
  "registered-nurses": "29-1141.00",
  "nurse-anesthetists-nurse-midwives-and-nurse-practitioners": "29-1171.00",
  "licensed-practical-and-licensed-vocational-nurses": "29-2061.00",
  "home-health-and-personal-care-aides": "31-1120.00",
  "medical-assistants": "31-9092.00",
  "nursing-assistants-and-orderlies": "31-1131.00",

  // IT roles with ambiguous titles
  "software-developers-quality-assurance-analysts-and-testers": "15-1256.00",
  "computer-and-information-systems-managers": "11-3021.00",
  "computer-and-information-research-scientists": "15-1221.00",
  "web-developers-and-digital-designers": "15-1257.00",

  // Management roles
  "top-executives": "11-1011.00",
  "advertising-promotions-and-marketing-managers": "11-2011.00",
  "administrative-services-managers": "11-3012.00",

  // Misc ambiguous
  "veterinary-technologists-and-technicians": "29-2056.00",
  "taxi-drivers-ride-hailing-drivers-and-chauffeurs": "53-3054.00",
  "material-moving-machine-operators": "53-7063.00",

  // Unmatched by fuzzy matching (resolved manually)
  "adult-literacy-and-ged-teachers": "25-3011.00",       // Adult Basic Education Instructors
  "agricultural-and-food-scientists": "19-1012.00",      // Food Scientists and Technologists
  "announcers": "27-3011.00",                            // Broadcast Announcers and Radio Disc Jockeys
  "elementary-middle-and-high-school-principals": "11-9032.00", // Education Administrators, Kindergarten through Secondary
  "funeral-service-occupations": "39-4031.00",           // Morticians, Undertakers, and Funeral Arrangers
  "high-school-teachers": "25-2031.00",                  // Secondary School Teachers
  "structural-iron-and-steel-workers": "47-2221.00",     // Structural Iron and Steel Workers
  "janitors-and-building-cleaners": "37-2011.00",        // Janitors and Cleaners
  "material-recording-clerks": "43-5071.00",             // Shipping, Receiving, and Inventory Clerks
  "military-careers": "55-1011.00",                      // Air Crew Officers
  "oil-and-gas-workers": "47-5013.00",                   // Service Unit Operators, Oil and Gas
  "preschool-and-childcare-center-directors": "11-9031.00", // Education and Childcare Administrators, Preschool and Daycare
  "appraisers-and-assessors-of-real-estate": "13-2023.00", // Appraisers and Assessors of Real Estate
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const verbose = args.includes("--verbose");

  const onetDir = path.join(process.cwd(), "db", "onet");
  const karpathyPath = path.join(
    process.cwd(),
    "src",
    "data",
    "karpathy-jobs.json"
  );
  const outputPath = path.join(
    process.cwd(),
    "src",
    "data",
    "enriched-occupations.json"
  );

  // 1. Check prerequisites
  console.log("=== O*NET Enrichment Script ===\n");

  if (!fs.existsSync(karpathyPath)) {
    console.error("ERROR: karpathy-jobs.json not found at", karpathyPath);
    process.exit(1);
  }

  const requiredFiles = [
    "Occupation Data.txt",
    "Task Statements.txt",
    "Work Activities.txt",
  ];
  const missingFiles = requiredFiles.filter(
    (f) => !fs.existsSync(path.join(onetDir, f))
  );

  if (missingFiles.length > 0) {
    console.error("ERROR: Missing O*NET database files in db/onet/:");
    missingFiles.forEach((f) => console.error("  -", f));
    console.error("\nDownload from: https://www.onetcenter.org/database.html");
    console.error("Extract the above files to db/onet/");
    process.exit(1);
  }

  // 2. Load data
  console.log("Loading data...");
  const karpathyJobs: KarpathyJob[] = JSON.parse(
    fs.readFileSync(karpathyPath, "utf8")
  );
  console.log(`  Karpathy occupations: ${karpathyJobs.length}`);

  const occupationData = parseTsv(
    fs.readFileSync(path.join(onetDir, "Occupation Data.txt"), "utf8")
  );
  const onetOccupations: OnetOccupation[] = occupationData.map((row) => ({
    code: row["O*NET-SOC Code"],
    title: row["Title"],
    description: row["Description"] || "",
  }));
  console.log(`  O*NET occupations: ${onetOccupations.length}`);

  const workActivityData = parseTsv(
    fs.readFileSync(path.join(onetDir, "Work Activities.txt"), "utf8")
  );
  // Filter to Importance scale only
  const workActivities: OnetWorkActivity[] = workActivityData
    .filter((row) => row["Scale ID"] === "IM")
    .map((row) => ({
      code: row["O*NET-SOC Code"],
      elementId: row["Element ID"],
      elementName: row["Element Name"],
      scaleId: row["Scale ID"],
      dataValue: parseFloat(row["Data Value"]),
    }));
  console.log(`  Work activity records (importance): ${workActivities.length}`);

  const taskData = parseTsv(
    fs.readFileSync(path.join(onetDir, "Task Statements.txt"), "utf8")
  );
  const tasks: OnetTask[] = taskData.map((row) => ({
    code: row["O*NET-SOC Code"],
    taskId: row["Task ID"],
    task: row["Task"],
    taskType: row["Task Type"] || "Core",
  }));
  console.log(`  Task statements: ${tasks.length}`);

  // 3. Build lookup indices
  console.log("\nBuilding indices...");

  // Group work activities by SOC code
  const activitiesByCode = new Map<string, OnetWorkActivity[]>();
  for (const wa of workActivities) {
    const existing = activitiesByCode.get(wa.code) || [];
    existing.push(wa);
    activitiesByCode.set(wa.code, existing);
  }

  // Group tasks by SOC code
  const tasksByCode = new Map<string, OnetTask[]>();
  for (const t of tasks) {
    const existing = tasksByCode.get(t.code) || [];
    existing.push(t);
    tasksByCode.set(t.code, existing);
  }

  // Build O*NET SOC code → occupation map
  const onetByCode = new Map<string, OnetOccupation>();
  for (const occ of onetOccupations) {
    onetByCode.set(occ.code, occ);
  }

  // 4. Match Karpathy occupations to O*NET SOC codes
  console.log("\nMatching occupations...\n");

  let matchCount = 0;
  let manualCount = 0;
  let lowConfidenceCount = 0;
  const enriched: EnrichedOccupation[] = [];
  const unmatched: Array<{ slug: string; title: string; bestMatch: string; score: number }> = [];

  for (const job of karpathyJobs) {
    let onetCode: string | null = null;
    let onetTitle: string | null = null;
    let confidence = 0;

    // Check manual crosswalk first
    if (MANUAL_CROSSWALK[job.slug]) {
      onetCode = MANUAL_CROSSWALK[job.slug];
      const occ = onetByCode.get(onetCode);
      onetTitle = occ?.title || null;
      confidence = 1.0;
      manualCount++;
    } else {
      // Fuzzy match against O*NET titles
      let bestScore = 0;
      let bestOcc: OnetOccupation | null = null;

      for (const occ of onetOccupations) {
        const score = titleSimilarity(job.title, occ.title);
        if (score > bestScore) {
          bestScore = score;
          bestOcc = occ;
        }
      }

      if (bestOcc && bestScore >= 0.5) {
        onetCode = bestOcc.code;
        onetTitle = bestOcc.title;
        confidence = bestScore;
        matchCount++;

        if (bestScore < 0.7) {
          lowConfidenceCount++;
          if (verbose) {
            console.log(
              `  LOW CONFIDENCE: "${job.title}" → "${bestOcc.title}" (${bestScore.toFixed(2)})`
            );
          }
        }
      } else {
        unmatched.push({
          slug: job.slug,
          title: job.title,
          bestMatch: bestOcc?.title || "none",
          score: bestScore,
        });
      }
    }

    // Get work activities for matched occupation
    let taskComposition: Record<string, number> = {};
    let matchedActivities: EnrichedOccupation["workActivities"] = [];
    let matchedTasks: string[] = [];

    if (onetCode) {
      // Try exact code first, then try the major group (XX-XXXX.00)
      let activities = activitiesByCode.get(onetCode);
      if (!activities) {
        // Try without the .XX suffix
        const baseCode = onetCode.replace(/\.\d{2}$/, ".00");
        activities = activitiesByCode.get(baseCode);
      }

      if (activities) {
        taskComposition = computeTaskComposition(
          activities.map((a) => ({
            elementId: a.elementId,
            importance: a.dataValue,
          }))
        );

        matchedActivities = activities.map((a) => ({
          elementId: a.elementId,
          name: a.elementName,
          importance: Math.round(a.dataValue * 100) / 100,
          category: WORK_ACTIVITY_TO_CATEGORY[a.elementId] || "information-processing",
        }));
      } else {
        // Fallback: use parent SOC group task composition
        taskComposition = {};
        for (const cat of ALL_TASK_CATEGORIES) {
          taskComposition[cat] = 1 / ALL_TASK_CATEGORIES.length;
        }
      }

      // Get task statements
      let onetTasks = tasksByCode.get(onetCode);
      if (!onetTasks) {
        const baseCode = onetCode.replace(/\.\d{2}$/, ".00");
        onetTasks = tasksByCode.get(baseCode);
      }
      matchedTasks = (onetTasks || [])
        .filter((t) => t.taskType !== "Supplemental")
        .map((t) => t.task);
    } else {
      // No match: equal distribution
      for (const cat of ALL_TASK_CATEGORIES) {
        taskComposition[cat] = 1 / ALL_TASK_CATEGORIES.length;
      }
    }

    // Build enriched tasks from work activities (top activities per category)
    const enrichedTasks: EnrichedOccupation["tasks"] = matchedActivities
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 15) // Top 15 most important activities
      .map((a) => ({
        name: a.name,
        category: a.category,
        importance: a.importance,
      }));

    enriched.push({
      slug: job.slug,
      title: job.title,
      onetCode,
      onetTitle,
      matchConfidence: Math.round(confidence * 100) / 100,
      category: job.category,
      pay: job.pay,
      jobs: job.jobs,
      education: job.education,
      exposure: job.exposure,
      exposure_rationale: job.exposure_rationale,
      blsUrl: job.url,
      taskComposition,
      tasks: enrichedTasks,
      onetTasks: matchedTasks,
      workActivities: matchedActivities,
    });

    if (verbose && onetCode) {
      console.log(
        `  ✓ "${job.title}" → ${onetCode} "${onetTitle}" (${confidence.toFixed(2)})`
      );
    }
  }

  // 5. Report
  console.log("─".repeat(60));
  console.log("RESULTS:");
  console.log(`  Total occupations:     ${karpathyJobs.length}`);
  console.log(`  Matched (auto):        ${matchCount}`);
  console.log(`  Matched (manual):      ${manualCount}`);
  console.log(`  Low confidence (<0.7): ${lowConfidenceCount}`);
  console.log(`  Unmatched:             ${unmatched.length}`);

  if (unmatched.length > 0) {
    console.log("\nUNMATCHED OCCUPATIONS (add to MANUAL_CROSSWALK):");
    for (const u of unmatched) {
      console.log(
        `  "${u.title}" → best: "${u.bestMatch}" (${u.score.toFixed(2)})`
      );
      console.log(`    // "${u.slug}": "XX-XXXX.00",`);
    }
  }

  // Task composition stats
  const withActivities = enriched.filter((e) => e.workActivities.length > 0);
  const withTasks = enriched.filter((e) => e.onetTasks.length > 0);
  const sparseTasks = enriched.filter(
    (e) => e.onetCode && e.onetTasks.length < 3 && e.onetTasks.length > 0
  );

  console.log(`\n  With work activities:  ${withActivities.length}`);
  console.log(`  With task statements:  ${withTasks.length}`);
  console.log(`  Sparse (<3 tasks):     ${sparseTasks.length}`);

  // 6. Write output
  if (!dryRun) {
    const output = {
      generatedAt: new Date().toISOString(),
      onetVersion: "30.2",
      totalOccupations: enriched.length,
      matchedOccupations: enriched.filter((e) => e.onetCode).length,
      unmatchedOccupations: enriched.filter((e) => !e.onetCode).length,
      occupations: enriched,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\nWritten to: ${outputPath}`);
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(0)}KB`);
  } else {
    console.log("\n[DRY RUN] No files written.");
  }

  // 7. Write match report for manual review
  const reportPath = path.join(process.cwd(), "db", "onet", "match-report.tsv");
  const reportLines = [
    "slug\tkarpathy_title\tonet_code\tonet_title\tconfidence\tnum_activities\tnum_tasks",
  ];
  for (const e of enriched) {
    reportLines.push(
      [
        e.slug,
        e.title,
        e.onetCode || "UNMATCHED",
        e.onetTitle || "",
        e.matchConfidence.toFixed(2),
        e.workActivities.length,
        e.onetTasks.length,
      ].join("\t")
    );
  }
  if (!dryRun) {
    fs.writeFileSync(reportPath, reportLines.join("\n"));
    console.log(`Match report: ${reportPath}`);
  }

  // Exit with error if too many unmatched
  if (unmatched.length > 20) {
    console.error(
      `\nWARNING: ${unmatched.length} unmatched occupations. Review and add to MANUAL_CROSSWALK.`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
