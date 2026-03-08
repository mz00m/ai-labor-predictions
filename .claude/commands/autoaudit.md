# AutoAudit — Autonomous Data Quality Sweep

You are an autonomous audit agent for jobsdata.ai. Your job is to run comprehensive data quality checks, fix what can be auto-fixed, and flag what needs human attention — following the autoresearch loop pattern.

## Input

Optional scope:

$ARGUMENTS

- If blank or "all": audit all 17 prediction files
- If a category (e.g., "wages"): audit only that category
- If a slug (e.g., "median-wage-impact"): audit only that prediction

## Step 1: Run the Audit Script

Run the auto-audit script to get the baseline report:

```bash
node scripts/autoresearch/auto-audit.js
```

Or with scope:
```bash
node scripts/autoresearch/auto-audit.js --category=wages
node scripts/autoresearch/auto-audit.js --slug=median-wage-impact
```

Read the output carefully. It checks:
- Weighted average drift (currentValue vs recomputed)
- Source ID integrity (cross-references between prediction files and confirmed-sources.json)
- Duplicate detection (history entries, overlays, sources)
- Sort order (history[] and overlays[] by date ascending)
- Schema validation (dates, values, tiers, confidence bounds, label lengths)
- Required fields
- Hero stat drift
- Confirmed-sources.json counts (totalSources, verifiedCount)
- Orphan sources
- Last-updated consistency
- URL patterns

## Step 2: Triage the Results

Categorize each finding:

### Auto-fixable (apply immediately)
- Sort order violations → sort arrays by date
- currentValue drift > 1pp → update currentValue
- totalSources/verifiedCount mismatch → update counts
- lastUpdated inconsistency → sync dates

### Needs investigation
- Missing source IDs (referenced but not defined)
- Duplicate entries (which to keep?)
- Confidence bounds inverted
- Schema violations

### Informational only
- Orphan sources (in confirmed-sources but not referenced)
- Long overlay labels

## Step 3: Apply Auto-Fixes

Run the script with `--fix` flag:

```bash
node scripts/autoresearch/auto-audit.js --fix
```

This will apply all auto-fixable changes. Then re-run without `--fix` to verify:

```bash
node scripts/autoresearch/auto-audit.js
```

## Step 4: Investigate Remaining Issues

For each non-auto-fixable issue:

1. Read the affected prediction JSON file
2. Identify the root cause
3. Either fix it directly or present it to the user for decision

For **missing source IDs**: check if the source exists in confirmed-sources.json under a different ID, or if it was removed. Either add the source entry or remove the dangling reference.

For **duplicate entries**: present both to the user and ask which to keep.

For **confidence bounds**: check if low and high are swapped, or if the midpoint value is wrong.

## Step 5: Commit Fixes

After all fixes are applied:

1. Validate all modified JSON files: `python3 -c "import json; json.load(open('path'))"`
2. Git commit with message: `autoaudit: fix [N] data quality issues`
3. List all changes in the commit body

## Step 6: Report

Present the final report:

```
=== AUTOAUDIT SESSION SUMMARY ===

Issues found:     [total]
Auto-fixed:       [count]
Manually fixed:   [count]
Remaining:        [count] (with details)

Files modified:   [list]
```

## Loop Behavior

If running autonomously:
1. Run audit → fix → verify → commit
2. Then run audit again on the next category
3. Continue until all categories are clean

## Critical Rules

- **NEVER modify code files** (*.ts, *.tsx). Only data files.
- **ALWAYS validate JSON** after any fix.
- **ALWAYS re-run audit** after fixes to verify no regressions.
- **ASK before removing** any data (duplicates, orphan sources).
- **ONE commit per audit pass.** Group all fixes from one run together.
