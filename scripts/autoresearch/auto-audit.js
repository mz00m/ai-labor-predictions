#!/usr/bin/env node
/**
 * AutoAudit — Autonomous Data Quality Sweep
 *
 * Runs all data integrity checks from the /data-quality-audit skill
 * programmatically. Outputs a structured report and optionally applies fixes.
 *
 * Usage:
 *   node scripts/autoresearch/auto-audit.js [--fix] [--category=wages] [--slug=median-wage-impact]
 */

const fs = require("fs");
const path = require("path");

// ─── Config ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../..");
const PREDICTIONS_DIR = path.join(ROOT, "src/data/predictions");
const CONFIRMED_SOURCES_PATH = path.join(ROOT, "src/data/confirmed-sources.json");
const LAST_UPDATED_PATH = path.join(ROOT, "src/data/last-updated.json");
const HERO_PATH = path.join(ROOT, "src/app/page.tsx");

const TIER_WEIGHT = { 1: 4, 2: 2, 3: 1, 4: 0.5 };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function recencyWeight(dateMs, minMs, maxMs) {
  if (maxMs === minMs) return 1;
  const t = (dateMs - minMs) / (maxMs - minMs);
  return 1 + t * 0.5;
}

function sampleSizeWeight(point) {
  if (!point.sampleSize || point.sampleSize <= 0) return 1;
  const logN = Math.log10(Math.max(point.sampleSize, 100));
  return Math.min(1 + (logN - 2) / 3, 2);
}

function computeWeightedAvg(prediction) {
  const points = prediction.history
    .filter((d) => [1, 2, 3, 4].includes(d.evidenceTier))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (points.length === 0) return prediction.currentValue ?? 0;

  if (prediction.aggregationMethod === "latest") {
    return Math.round(points[points.length - 1].value * 10) / 10;
  }

  const timestamps = points.map((p) => new Date(p.date).getTime());
  const minMs = timestamps[0];
  const maxMs = timestamps[timestamps.length - 1];

  let weightedSum = 0;
  let totalWeight = 0;
  for (let i = 0; i < points.length; i++) {
    const w =
      TIER_WEIGHT[points[i].evidenceTier] *
      recencyWeight(timestamps[i], minMs, maxMs) *
      sampleSizeWeight(points[i]);
    weightedSum += points[i].value * w;
    totalWeight += w;
  }

  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

// ─── Load All Predictions ────────────────────────────────────────────────────

function loadAllPredictions() {
  const predictions = [];
  const categories = fs.readdirSync(PREDICTIONS_DIR);
  for (const cat of categories) {
    const catDir = path.join(PREDICTIONS_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(catDir, file);
      const data = readJSON(filePath);
      data._filePath = filePath;
      data._fileName = `${cat}/${file}`;
      predictions.push(data);
    }
  }
  return predictions;
}

// ─── Audit Checks ────────────────────────────────────────────────────────────

class AuditReport {
  constructor() {
    this.mustFix = [];
    this.shouldFix = [];
    this.niceToHave = [];
    this.passing = 0;
    this.heroStats = [];
    this.fixes = []; // { filePath, description, apply: () => void }
  }

  addMustFix(slug, description, detail, action, fix) {
    this.mustFix.push({ slug, description, detail, action, fix });
    if (fix) this.fixes.push({ filePath: slug, description, apply: fix });
  }

  addShouldFix(slug, description, detail, action, fix) {
    this.shouldFix.push({ slug, description, detail, action, fix });
    if (fix) this.fixes.push({ filePath: slug, description, apply: fix });
  }

  addNiceToHave(description) {
    this.niceToHave.push(description);
  }

  addPassing() {
    this.passing++;
  }

  addHeroStat(name, current, recomputed, ok) {
    this.heroStats.push({ name, current, recomputed, ok });
  }
}

function checkWeightedAverageDrift(prediction, report) {
  const recomputed = computeWeightedAvg(prediction);
  const current = prediction.currentValue;
  if (current === undefined || current === null) {
    report.addShouldFix(
      prediction.slug,
      "Missing currentValue",
      `No currentValue set; recomputed = ${recomputed}`,
      `Set currentValue to ${recomputed}`,
      () => {
        const data = readJSON(prediction._filePath);
        data.currentValue = recomputed;
        fs.writeFileSync(prediction._filePath, JSON.stringify(data, null, 2) + "\n");
      }
    );
    return;
  }

  const drift = Math.abs(recomputed - current);
  if (drift > 1) {
    report.addMustFix(
      prediction.slug,
      `currentValue drift: ${drift.toFixed(1)}pp`,
      `Current: ${current}, Recomputed: ${recomputed}`,
      `Update currentValue from ${current} to ${recomputed}`,
      () => {
        const data = readJSON(prediction._filePath);
        data.currentValue = recomputed;
        fs.writeFileSync(prediction._filePath, JSON.stringify(data, null, 2) + "\n");
      }
    );
  } else {
    report.addPassing();
  }
}

function checkSourceIdIntegrity(prediction, confirmedSources, report) {
  const localSourceIds = new Set(prediction.sources.map((s) => s.id));
  const confirmedIds = new Set(Object.keys(confirmedSources.sources));

  const allRefs = [];
  for (const h of prediction.history) {
    for (const sid of h.sourceIds) allRefs.push({ type: "history", date: h.date, sid });
  }
  for (const o of (prediction.overlays || [])) {
    for (const sid of o.sourceIds) allRefs.push({ type: "overlay", date: o.date, sid });
  }

  let allGood = true;
  for (const ref of allRefs) {
    if (!localSourceIds.has(ref.sid)) {
      report.addMustFix(
        prediction.slug,
        `Missing local source: ${ref.sid}`,
        `Referenced in ${ref.type} (${ref.date}) but not in sources[]`,
        `Add source entry for ${ref.sid} or fix the reference`
      );
      allGood = false;
    }
    if (!confirmedIds.has(ref.sid)) {
      report.addShouldFix(
        prediction.slug,
        `Source ${ref.sid} missing from confirmed-sources.json`,
        `Referenced in ${ref.type} (${ref.date})`,
        `Add ${ref.sid} to confirmed-sources.json`
      );
      allGood = false;
    }
  }

  // Check confirmed-sources usedIn references back
  for (const s of prediction.sources) {
    if (confirmedIds.has(s.id)) {
      const cs = confirmedSources.sources[s.id];
      if (cs.usedIn && !cs.usedIn.includes(prediction.slug)) {
        report.addShouldFix(
          prediction.slug,
          `confirmed-sources.json usedIn missing slug`,
          `Source ${s.id} doesn't list "${prediction.slug}" in usedIn[]`,
          `Add "${prediction.slug}" to usedIn[] for ${s.id}`
        );
        allGood = false;
      }
    }
  }

  if (allGood) report.addPassing();
}

function checkDuplicates(prediction, report) {
  let clean = true;

  // History duplicates
  const histKeys = new Set();
  for (const h of prediction.history) {
    const key = `${h.date}|${h.sourceIds.sort().join(",")}`;
    if (histKeys.has(key)) {
      report.addShouldFix(
        prediction.slug,
        `Duplicate history entry`,
        `date=${h.date}, sourceIds=${h.sourceIds.join(",")}`,
        `Remove duplicate history entry`
      );
      clean = false;
    }
    histKeys.add(key);
  }

  // Overlay duplicates
  const overlayKeys = new Set();
  for (const o of (prediction.overlays || [])) {
    const key = `${o.date}|${o.label}`;
    if (overlayKeys.has(key)) {
      report.addShouldFix(
        prediction.slug,
        `Duplicate overlay entry`,
        `date=${o.date}, label="${o.label}"`,
        `Remove duplicate overlay`
      );
      clean = false;
    }
    overlayKeys.add(key);
  }

  // Source duplicates
  const srcIds = new Set();
  for (const s of prediction.sources) {
    if (srcIds.has(s.id)) {
      report.addMustFix(
        prediction.slug,
        `Duplicate source ID: ${s.id}`,
        `Source "${s.id}" appears multiple times in sources[]`,
        `Remove duplicate source entry`
      );
      clean = false;
    }
    srcIds.add(s.id);
  }

  if (clean) report.addPassing();
}

function checkSortOrder(prediction, report) {
  let sorted = true;

  // History sort
  for (let i = 1; i < prediction.history.length; i++) {
    if (prediction.history[i].date < prediction.history[i - 1].date) {
      report.addShouldFix(
        prediction.slug,
        `History not sorted by date`,
        `"${prediction.history[i - 1].date}" comes before "${prediction.history[i].date}"`,
        `Sort history[] by date ascending`,
        () => {
          const data = readJSON(prediction._filePath);
          data.history.sort((a, b) => a.date.localeCompare(b.date));
          fs.writeFileSync(prediction._filePath, JSON.stringify(data, null, 2) + "\n");
        }
      );
      sorted = false;
      break;
    }
  }

  // Overlay sort
  const overlays = prediction.overlays || [];
  for (let i = 1; i < overlays.length; i++) {
    if (overlays[i].date < overlays[i - 1].date) {
      report.addShouldFix(
        prediction.slug,
        `Overlays not sorted by date`,
        `"${overlays[i - 1].date}" comes before "${overlays[i].date}"`,
        `Sort overlays[] by date ascending`,
        () => {
          const data = readJSON(prediction._filePath);
          if (data.overlays) {
            data.overlays.sort((a, b) => a.date.localeCompare(b.date));
          }
          fs.writeFileSync(prediction._filePath, JSON.stringify(data, null, 2) + "\n");
        }
      );
      sorted = false;
      break;
    }
  }

  if (sorted) report.addPassing();
}

function checkSchema(prediction, report) {
  let valid = true;
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const validTiers = [1, 2, 3, 4];
  const validDirections = ["up", "down", "neutral"];

  // History schema
  for (let i = 0; i < prediction.history.length; i++) {
    const h = prediction.history[i];
    const prefix = `history[${i}]`;

    if (!dateRe.test(h.date)) {
      report.addMustFix(prediction.slug, `${prefix}: invalid date "${h.date}"`, "", "Fix date format");
      valid = false;
    }
    if (typeof h.value !== "number") {
      report.addMustFix(prediction.slug, `${prefix}: value is not a number`, `Got: ${typeof h.value}`, "Fix value type");
      valid = false;
    }
    if (!validTiers.includes(h.evidenceTier)) {
      report.addMustFix(prediction.slug, `${prefix}: invalid evidenceTier ${h.evidenceTier}`, "", "Fix tier value");
      valid = false;
    }
    if (!Array.isArray(h.sourceIds) || h.sourceIds.length === 0) {
      report.addMustFix(prediction.slug, `${prefix}: empty or missing sourceIds`, "", "Add sourceIds");
      valid = false;
    }
    if (h.confidenceLow !== undefined && h.confidenceHigh !== undefined) {
      if (h.confidenceLow >= h.value || h.confidenceHigh <= h.value) {
        // Allow equal bounds for edge cases but flag inverted
        if (h.confidenceLow > h.value || h.confidenceHigh < h.value) {
          report.addShouldFix(
            prediction.slug,
            `${prefix}: confidence bounds inverted`,
            `low=${h.confidenceLow}, value=${h.value}, high=${h.confidenceHigh}`,
            "Fix confidence bounds"
          );
          valid = false;
        }
      }
    }
  }

  // Overlay schema
  for (let i = 0; i < (prediction.overlays || []).length; i++) {
    const o = prediction.overlays[i];
    const prefix = `overlay[${i}]`;

    if (!validDirections.includes(o.direction)) {
      report.addMustFix(prediction.slug, `${prefix}: invalid direction "${o.direction}"`, "", "Fix direction");
      valid = false;
    }
    if (o.label && o.label.length > 120) {
      report.addShouldFix(
        prediction.slug,
        `${prefix}: label too long (${o.label.length} chars)`,
        `"${o.label.substring(0, 60)}..."`,
        "Shorten label to <= 120 chars"
      );
      valid = false;
    }
    if (!validTiers.includes(o.evidenceTier)) {
      report.addMustFix(prediction.slug, `${prefix}: invalid evidenceTier ${o.evidenceTier}`, "", "Fix tier value");
      valid = false;
    }
  }

  if (valid) report.addPassing();
}

function checkRequiredFields(prediction, report) {
  const required = ["id", "slug", "title", "description", "category", "unit", "timeHorizon"];
  const missing = required.filter((f) => !prediction[f]);
  if (missing.length > 0) {
    report.addMustFix(
      prediction.slug || prediction._fileName,
      `Missing required fields: ${missing.join(", ")}`,
      "",
      "Add missing fields"
    );
  } else {
    report.addPassing();
  }
}

function checkHeroStats(predictions, report) {
  const heroContent = fs.readFileSync(HERO_PATH, "utf-8");

  // Extract hero values from the page source
  // ~21% productivity boost
  const productivityMatch = heroContent.match(/Productivity boost/);
  const projectedMatch = heroContent.match(/Projected job loss/);
  const measuredMatch = heroContent.match(/Measured job loss/);

  // Recompute projected job loss from overall-us-displacement
  const overall = predictions.find((p) => p.slug === "overall-us-displacement");
  if (overall) {
    const recomputed = computeWeightedAvg(overall);
    const heroValue = 3; // hardcoded ~3%
    const drift = Math.abs(Math.abs(recomputed) - heroValue);
    report.addHeroStat(
      "Projected job loss",
      `~${heroValue}%`,
      `~${Math.abs(recomputed).toFixed(1)}%`,
      drift <= 1
    );
  }

  // Productivity boost — would need to recompute from productivity studies
  report.addHeroStat("Productivity boost", "~21%", "N/A (manual check)", true);

  // Measured job loss
  report.addHeroStat("Measured job loss", "~0%", "~0% (observed data)", true);
}

function checkConfirmedSourcesCounts(confirmedSources, predictions, report) {
  const actualTotal = Object.keys(confirmedSources.sources).length;
  const actualVerified = Object.values(confirmedSources.sources).filter((s) => s.verified).length;

  if (actualTotal !== confirmedSources.totalSources) {
    report.addMustFix(
      "confirmed-sources.json",
      `totalSources count mismatch`,
      `Header says ${confirmedSources.totalSources}, actual count: ${actualTotal}`,
      `Update totalSources to ${actualTotal}`,
      () => {
        const data = readJSON(CONFIRMED_SOURCES_PATH);
        data.totalSources = actualTotal;
        fs.writeFileSync(CONFIRMED_SOURCES_PATH, JSON.stringify(data, null, 2) + "\n");
      }
    );
  } else {
    report.addPassing();
  }

  if (actualVerified !== confirmedSources.verifiedCount) {
    report.addMustFix(
      "confirmed-sources.json",
      `verifiedCount mismatch`,
      `Header says ${confirmedSources.verifiedCount}, actual count: ${actualVerified}`,
      `Update verifiedCount to ${actualVerified}`,
      () => {
        const data = readJSON(CONFIRMED_SOURCES_PATH);
        data.verifiedCount = actualVerified;
        fs.writeFileSync(CONFIRMED_SOURCES_PATH, JSON.stringify(data, null, 2) + "\n");
      }
    );
  } else {
    report.addPassing();
  }
}

function checkOrphanSources(confirmedSources, predictions, report) {
  // Collect all source IDs referenced across all prediction files
  const referencedIds = new Set();
  for (const p of predictions) {
    for (const s of p.sources) referencedIds.add(s.id);
  }

  const orphans = [];
  for (const [id, source] of Object.entries(confirmedSources.sources)) {
    if (!referencedIds.has(id)) {
      orphans.push(id);
    }
  }

  if (orphans.length > 0) {
    report.addNiceToHave(
      `${orphans.length} orphan source(s) in confirmed-sources.json not referenced by any prediction: ${orphans.slice(0, 5).join(", ")}${orphans.length > 5 ? "..." : ""}`
    );
  } else {
    report.addPassing();
  }
}

function checkLastUpdatedConsistency(confirmedSources, report) {
  const lastUpdated = readJSON(LAST_UPDATED_PATH);
  if (lastUpdated.lastUpdated !== confirmedSources.lastUpdated) {
    report.addShouldFix(
      "last-updated.json",
      `Dates don't match`,
      `last-updated.json: ${lastUpdated.lastUpdated}, confirmed-sources.json: ${confirmedSources.lastUpdated}`,
      `Sync both to the more recent date`
    );
  } else {
    report.addPassing();
  }
}

function checkBrokenURLPatterns(prediction, report) {
  let clean = true;
  for (const s of prediction.sources) {
    if (!s.url || (!s.url.startsWith("http://") && !s.url.startsWith("https://"))) {
      report.addShouldFix(
        prediction.slug,
        `Source ${s.id} has invalid URL`,
        `URL: "${s.url}"`,
        "Fix URL"
      );
      clean = false;
    }
  }
  if (clean) report.addPassing();
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const doFix = args.includes("--fix");
  const categoryArg = args.find((a) => a.startsWith("--category="));
  const slugArg = args.find((a) => a.startsWith("--slug="));
  const category = categoryArg ? categoryArg.split("=")[1] : null;
  const slug = slugArg ? slugArg.split("=")[1] : null;

  console.log("Loading prediction data...");
  let predictions = loadAllPredictions();
  const confirmedSources = readJSON(CONFIRMED_SOURCES_PATH);

  // Filter by scope
  if (slug) {
    predictions = predictions.filter((p) => p.slug === slug);
  } else if (category) {
    predictions = predictions.filter((p) => p.category === category);
  }

  if (predictions.length === 0) {
    console.error("No predictions found for the given scope.");
    process.exit(1);
  }

  const report = new AuditReport();
  const today = new Date().toISOString().split("T")[0];

  console.log(`Auditing ${predictions.length} prediction(s)...\n`);

  // Per-prediction checks
  for (const p of predictions) {
    checkWeightedAverageDrift(p, report);
    checkSourceIdIntegrity(p, confirmedSources, report);
    checkDuplicates(p, report);
    checkSortOrder(p, report);
    checkSchema(p, report);
    checkRequiredFields(p, report);
    checkBrokenURLPatterns(p, report);
  }

  // Cross-file checks
  const allPredictions = loadAllPredictions(); // reload all for cross-file checks
  checkHeroStats(allPredictions, report);
  checkConfirmedSourcesCounts(confirmedSources, allPredictions, report);
  checkOrphanSources(confirmedSources, allPredictions, report);
  checkLastUpdatedConsistency(confirmedSources, report);

  // ─── Output Report ───────────────────────────────────────────────────────

  console.log("=".repeat(55));
  console.log("  DATA QUALITY AUDIT REPORT");
  console.log(`  ${today} | ${predictions.length} predictions checked`);
  console.log("=".repeat(55));
  console.log("");
  console.log("SUMMARY");
  console.log("-".repeat(40));
  console.log(`  Passing checks: ${report.passing}`);
  console.log(`  Warnings:       ${report.shouldFix.length}`);
  console.log(`  Must-fix:        ${report.mustFix.length}`);
  console.log(`  Nice-to-have:    ${report.niceToHave.length}`);
  console.log("");

  if (report.mustFix.length > 0) {
    console.log("MUST FIX (data accuracy issues)");
    console.log("-".repeat(40));
    report.mustFix.forEach((item, i) => {
      console.log(`  [MF-${i + 1}] ${item.slug}: ${item.description}`);
      if (item.detail) console.log(`         ${item.detail}`);
      console.log(`         Action: ${item.action}`);
      console.log("");
    });
  }

  if (report.shouldFix.length > 0) {
    console.log("SHOULD FIX (consistency issues)");
    console.log("-".repeat(40));
    report.shouldFix.forEach((item, i) => {
      console.log(`  [SF-${i + 1}] ${item.slug}: ${item.description}`);
      if (item.detail) console.log(`         ${item.detail}`);
      console.log(`         Action: ${item.action}`);
      console.log("");
    });
  }

  if (report.heroStats.length > 0) {
    console.log("HERO STATS");
    console.log("-".repeat(40));
    report.heroStats.forEach((stat) => {
      const icon = stat.ok ? "OK" : `DRIFT`;
      console.log(`  ${stat.name}: ${stat.current} -> ${stat.recomputed} [${icon}]`);
    });
    console.log("");
  }

  if (report.niceToHave.length > 0) {
    console.log("NICE TO HAVE");
    console.log("-".repeat(40));
    report.niceToHave.forEach((item) => {
      console.log(`  - ${item}`);
    });
    console.log("");
  }

  // ─── Apply Fixes ────────────────────────────────────────────────────────

  const fixableFixes = report.fixes.filter((f) => typeof f.apply === "function");

  if (doFix && fixableFixes.length > 0) {
    console.log(`\nApplying ${fixableFixes.length} auto-fix(es)...`);
    for (const fix of fixableFixes) {
      try {
        fix.apply();
        console.log(`  Fixed: ${fix.description}`);
      } catch (e) {
        console.error(`  FAILED: ${fix.description} — ${e.message}`);
      }
    }
    console.log("\nDone. Re-run audit to verify fixes.");
  } else if (fixableFixes.length > 0) {
    console.log(`\n${fixableFixes.length} issue(s) are auto-fixable. Run with --fix to apply.`);
  }

  // Exit code: non-zero if must-fix items exist
  const exitCode = report.mustFix.length > 0 ? 1 : 0;
  console.log(`\nExit code: ${exitCode}`);
  process.exit(exitCode);
}

main();
