# Data Quality Audit

Run a comprehensive audit of all prediction JSON files, hero stats, and source references. Identify inconsistencies, stale values, and data integrity issues.

## Scope

Audit target: $ARGUMENTS
- If blank or "all": audit everything
- If a category (e.g., "displacement"): audit only that category's prediction files
- If a slug (e.g., "overall-us-displacement"): audit only that prediction file

## Audit Process

### Step 0: Run the Automated Baseline

Run `node scripts/autoresearch/auto-audit.js` (optionally `--category=X` or `--slug=Y`) and read its report before doing anything manually. It already covers drift, source ID integrity, duplicates, sort order, schema, hero stats, registry counts, orphans, and URL patterns — do not redo those by hand; verify and extend.

**Known script limitations** (verify these manually, don't trust the script):
- Its hero-stat check compares against a hardcoded `heroValue = 3` and greps `src/app/page.tsx` for labels that have moved — see Step 3 for how hero stats actually work now.
- It does not check sign conventions, `dataType` sanity, the source-content store, or `recurring-sources.json` (Steps 2i-2k and 4c-4d below).

### Step 1: Load All Data

Read the following files:
- All 18 prediction JSON files in `src/data/predictions/` (17 predictions + 1 signal-only chart, `signals/earnings-call-mentions.json`; skip `displacement/_archived/`)
- `src/data/confirmed-sources.json`
- `src/data/recurring-sources.json` (recurring release registry)
- `src/data/last-updated.json`
- `src/lib/data-loader.ts` (`getHeroStats()` — computed hero stats)
- `src/components/HeroTriad.tsx` (hardcoded productivity stat)
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
- If `confidenceLow`/`confidenceHigh` exist: low ≤ value ≤ high (a midpoint may equal a bound for one-sided ranges)

For each `overlay` entry, verify:
- `direction` is one of: "up", "down", "neutral"
- `label` is ≤ 120 characters (hard limit; the authoring guideline is ≤ 80 — flag 81-120 as SHOULD FIX, > 120 as MUST FIX)
- `evidenceTier` is 1, 2, 3, or 4

#### 2f. Statistical Outlier Detection
For each prediction's `history[]` array:
1. Compute the mean and standard deviation of all `value` entries
2. Flag any data point where |value - mean| > 2 × stddev as a **statistical outlier**
3. For flagged outliers, check:
   - Does it have `metricType` different from the majority? (e.g., "postings" on a displacement chart) → likely a **proxy metric** that should have `isProxy: true` or be an overlay
   - Does it have `isProxy: true`? If yes, is the conversion factor reasonable? (converted value should be within 2 SD)
   - Is the outlier from a lower evidence tier? (Tier 3-4 outliers are more suspect than Tier 1)
4. Report format:
   ```
   OUTLIER: [slug] — [sourceId] value=[value] is [N]σ from mean=[mean]
     metricType: [type] | tier: [tier] | isProxy: [yes/no]
     Recommendation: [CONVERT TO PROXY | MOVE TO OVERLAY | KEEP WITH JUSTIFICATION]
   ```

#### 2g. Proxy Metric Validation
For each data point with `isProxy: true`:
- Verify `proxyContext` object exists and is complete
- Verify `value` ≈ rawValue × conversionFactor (within rounding tolerance)
- Verify `confidenceLow` and `confidenceHigh` reflect conversion range bounds
- Flag if converted value is still >2 SD from the non-proxy mean (conversion factor may be too generous)

#### 2h. Required Fields
- `id`, `slug`, `title`, `description`, `category`, `unit`, `timeHorizon` all present and non-empty

#### 2i. Sign Convention Checks
Per the category conventions in CLAUDE.md:
- **Displacement** charts: displacement is positive. A negative value must represent employment *growth* (counter-displacement) — spot-check the source excerpt to confirm it isn't a sign error.
- **Wage** charts: declines are negative. A positive value must represent a wage *gain* or *premium* — spot-check against the excerpt.
- **Adoption/exposure** charts: values should be positive percentages in [0, 100].
Flag any data point whose sign contradicts its source excerpt as MUST FIX.

#### 2j. dataType Sanity
- `dataType: "observed"` points must not be dated in the future
- Points describing forecasts ("by 2030", "will reach") must be `projected`, not `observed`
- Predictions with `aggregationMethod: "latest"` must have an unambiguous most-recent point (no date ties with conflicting values)

#### 2k. Source Content Store Coverage
Every source ingested via `/autoresearch` requires `src/data/source-content/[source-id].json` (the chatbot content store). For each source referenced in the prediction files, check whether the content file exists. Report missing files as SHOULD FIX (list them; they can be backfilled with `npm run backfill:content`).

### Step 3: Hero Stat Checks

Hero stats are no longer hardcoded in `page.tsx`. How they work now:

1. **Productivity boost (~21%)** — hardcoded in `src/components/HeroTriad.tsx` (`center={21} low={14} high={35}`). Flag if the median/range of productivity studies has drifted from these values.
2. **Projected job loss** — computed at build time by `getHeroStats()` in `src/lib/data-loader.ts` (weighted average of `overall-us-displacement`, all tiers, rounded absolute value). No drift is possible, but verify the *inputs*: the graph's history is clean (Steps 2a-2j) and the rounded value is still consistent with what CLAUDE.md/program.md claim.
3. **Measured job loss** — computed by `getHeroStats()` from the most recent `dataType: "observed"` point of `overall-us-displacement`. Verify observed points exist, are correctly dated, and the latest one is legitimate (not a proxy that should sort earlier).

Also flag if documentation (`CLAUDE.md` "Hero Stats" section, `program.md` "Hero Stats Sync") disagrees with the computed values — stale docs are a finding too.

### Step 4: Cross-File Consistency

#### 4a. Confirmed Sources Registry
- Every source ID referenced in any prediction file should exist in `confirmed-sources.json`
- Every source in `confirmed-sources.json` with `verified: true` should be referenced in at least one prediction file (warn on orphans)
- `totalSources` and `verifiedCount` fields should match actual counts

#### 4b. Last Updated
- `src/data/last-updated.json` should reflect the most recent `dateAdded` across all sources
- `confirmed-sources.json` `lastUpdated` should match

#### 4c. Recurring Sources Registry
For each series in `src/data/recurring-sources.json`:
- `lastIngested.date` should not be older than the newest matching source in `confirmed-sources.json` (if a newer edition was ingested without updating the registry, that's a SHOULD FIX)
- Flag series where today is past `nextExpected` by more than one cadence interval as **stale coverage** (the graphs this series feeds are falling behind — recommend an `/autoresearch` sweep)
- `targetGraphs` entries must be valid prediction slugs

#### 4d. Reading List / Featured Reads Sync
- Every article in the `FeaturedReads` component array (`src/components/FeaturedReads.tsx`) should also exist in `src/data/reading-list.json`
- The FeaturedReads array must have exactly 5 entries

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
