# Data Quality Audit

Run a comprehensive audit of all prediction JSON files, hero stats, and source references. Identify inconsistencies, stale values, and data integrity issues.

## Scope

Audit target: $ARGUMENTS
- If blank or "all": audit everything
- If a category (e.g., "displacement"): audit only that category's prediction files
- If a slug (e.g., "overall-us-displacement"): audit only that prediction file

## Audit Process

### Step 1: Load All Data

Read the following files:
- All 17 prediction JSON files in `src/data/predictions/`
- `src/data/confirmed-sources.json`
- `src/data/last-updated.json`
- `src/app/page.tsx` (hero stats)
- `src/lib/prediction-stats.ts` (weighting logic)

### Step 2: Per-Prediction Checks

For each prediction JSON file in scope, check:

#### 2a. Weighted Average Drift
Recompute the weighted average using all tiers with the project's weighting formula:
- Tier weights: T1=4×, T2=2×, T3=1×, T4=0.5×
- Recency: linear 1.0× (oldest) → 1.5× (newest)
- Sample size: log10-scaled 1.0× (n≤100) → 2.0× (n≥100K)
- For `aggregationMethod: "latest"`: use the most recent data point value

Compare to `currentValue`. Flag if drift > 1 percentage point.

#### 2b. Source ID Integrity
For every `sourceIds[]` reference in `history` and `overlays`:
- Check that the source ID exists in the file's own `sources[]` array
- Check that the source ID exists in `confirmed-sources.json`
- Check that `confirmed-sources.json` lists this prediction's slug in its `usedIn[]` array

#### 2c. Duplicate Detection
- Flag duplicate `history` entries with same `date` + same `sourceIds`
- Flag duplicate `overlays` with same `date` + same `label`
- Flag duplicate `sources` with same `id`

#### 2d. Sort Order
- Verify `history[]` is sorted by date ascending
- Verify `overlays[]` is sorted by date ascending (if present)

#### 2e. Schema Validation
For each `history` entry, verify:
- `date` is valid YYYY-MM-DD
- `value` is a number
- `evidenceTier` is 1, 2, 3, or 4
- `sourceIds` is a non-empty array
- If `confidenceLow`/`confidenceHigh` exist: low < value < high

For each `overlay` entry, verify:
- `direction` is one of: "up", "down", "neutral"
- `label` is ≤ 120 characters
- `evidenceTier` is 1, 2, 3, or 4

#### 2f. Required Fields
- `id`, `slug`, `title`, `description`, `category`, `unit`, `timeHorizon` all present and non-empty

### Step 3: Hero Stat Checks

Read `src/app/page.tsx` and extract the three hero stat values. Compare each to its data source:

1. **Productivity boost (~21%)** — flag if the median of productivity studies has changed
2. **Projected job loss (~3%)** — recompute weighted average of `overall-us-displacement` history with all tiers. Flag if differs by > 1pp from displayed value
3. **Measured job loss (~0%)** — check that observed-only displacement data still rounds to 0%

### Step 4: Cross-File Consistency

#### 4a. Confirmed Sources Registry
- Every source ID referenced in any prediction file should exist in `confirmed-sources.json`
- Every source in `confirmed-sources.json` with `verified: true` should be referenced in at least one prediction file (warn on orphans)
- `totalSources` and `verifiedCount` fields should match actual counts

#### 4b. Last Updated
- `src/data/last-updated.json` should reflect the most recent `dateAdded` across all sources
- `confirmed-sources.json` `lastUpdated` should match

### Step 5: Output Report

Format findings as:

```
═══════════════════════════════════════
  DATA QUALITY AUDIT REPORT
  [Date] | [N predictions checked]
═══════════════════════════════════════

SUMMARY
───────
✅ Passing checks: N
⚠️  Warnings:       N
❌ Must-fix:        N

MUST FIX (data accuracy issues)
───────────────────────────────
❌ [MF-1] [prediction slug]: [description]
   Current: [current value]
   Expected: [correct value]
   Action: [what to change]

❌ [MF-2] ...

SHOULD FIX (consistency issues)
───────────────────────────────
⚠️ [SF-1] [prediction slug]: [description]
   Detail: [what's wrong]
   Action: [what to change]

⚠️ [SF-2] ...

HERO STATS
──────────
[stat name]: [current] → [recomputed] [✅ OK / ❌ DRIFT of Xpp]

NICE TO HAVE
────────────
[Minor issues that don't affect accuracy]
```

### Step 6: Offer Fixes

After presenting the report, ask:
"Want me to auto-fix the MUST FIX items? I can also fix SHOULD FIX items if you'd like."

For auto-fixable items (sort order, count mismatches, stale hero stats), apply fixes directly. For ambiguous items (duplicate entries where it's unclear which to keep), ask before acting.
