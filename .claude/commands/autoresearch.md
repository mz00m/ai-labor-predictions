# AutoResearch — Autonomous Source Discovery & Ingestion

You are an autonomous research agent for jobsdata.ai. Your job is to discover new research sources, evaluate them, and ingest the best ones into the site's prediction data files — following the autoresearch loop pattern (try, evaluate, keep/discard, repeat).

## Input

Optional focus directive from the user:

$ARGUMENTS

If no arguments provided, follow the default priority order from `research-program.md`.

## Step 0: Read the Program

Read `program.md` in the project root. This is the research org code — it defines:
- The scoring metric for source quality
- Which graphs are "hungry" for data (fewest data points)
- Search strategies organized by evidence tier
- Keep/discard thresholds
- The full experiment loop and constraints

Also read:
- `scripts/autoresearch/candidates.tsv` — what has already been attempted (avoid re-searching the same URLs)
- `src/data/recurring-sources.json` — the recurring release registry used in Step 1

## Step 1: Recurring Release Sweep (run FIRST, before gap-driven discovery)

Many of the site's most important sources are recurring series — Stanford AI Index, Stanford DEL Canaries dashboard, Anthropic Economic Index, FactSet Earnings Insight, Census BTOS, Challenger Report, Yale Budget Lab tracker, BLS releases, PwC AI Jobs Barometer, etc. New editions of these are near-guaranteed high-value ingestions, so check them before hunting for novel sources.

1. Read `src/data/recurring-sources.json`. A series is **due** when today >= `nextExpected`, or when `nextExpected` is null.
2. Sort due series by `priority` (high first), then by how overdue they are.
3. For each due series:
   a. Run `WebSearch` using the series' `searchQuery` (fill in `{year}`/`{month}`/`{quarter}` placeholders with current values), and/or `WebFetch` the `checkUrls`.
   b. Compare what you find against `lastIngested.edition` and `lastIngested.date`. A **new edition** is any release of the series dated after `lastIngested.date`.
   c. If a new edition exists: score it (Step 3) and route it through Step 4 like any candidate. New editions of tracked series get `novelty_score = 15` — do NOT apply the existing-publisher penalty.
   d. If a series is multiple editions behind (e.g., three missed monthly reports), ingest the most recent edition first, then backfill earlier ones only if they add distinct data points.
   e. Update the registry entry regardless of outcome: set `lastChecked` to today; if ingested, set `lastIngested` and advance `nextExpected` by one cadence interval from the new edition's release date; if no new edition found, push `nextExpected` forward by a short recheck window (7 days for monthly/biweekly series, 14 days for quarterly, 30 days for annual).
4. Set the registry's top-level `lastSweep` to today and commit the registry update (may ride along with the related ingestion commit).
5. In interactive mode, sweep only due series then report. In autonomous mode, clear ALL due series before moving to Step 2.

If the user's focus directive names a specific series or publisher (e.g., "check Stanford"), sweep those entries regardless of `nextExpected`.

**Registry maintenance:** whenever you ingest a source (from the sweep OR from discovery) that belongs to a tracked series, update that series' `lastIngested`. If you ingest a source that is clearly a recurring release (title contains a quarter/year/edition marker, publisher republishes on a schedule) but has no registry entry, ADD one with your best cadence estimate and a note.

## Step 2: Pick a Search Target

Based on the graph priority list in `program.md`, pick the graph with the fewest data points that you haven't recently searched for. If the user provided a focus directive (e.g., "healthcare" or "wages"), prioritize graphs in that category.

Load the target graph's JSON file from `src/data/predictions/` to understand:
- What sources already exist (avoid duplicates)
- What the current data range and weighted average look like
- What date ranges have gaps

## Step 3: Search for Sources

Use `WebSearch` to find recent research. Run 2-3 searches per iteration, rotating through query patterns from `program.md`. Prioritize:

1. **Tier 1 first**: NBER, BLS, peer-reviewed journals, government data
2. **Tier 2 second**: Brookings, McKinsey, IMF, Gartner
3. **Tier 3 if needed**: Major outlets with original data/surveys

For each search, look for sources that:
- Contain specific quantitative statistics (percentages, dollar amounts, counts)
- Were published within the last 12 months (prefer last 6 months)
- Are not already in `src/data/confirmed-sources.json`

## Step 4: Score Each Candidate

For each candidate source found, compute the quality score:

```
score = tier_score + freshness_score + coverage_score + novelty_score

tier_score:      T1=40, T2=25, T3=10, T4=5
freshness_score: published within 90 days=20, 180 days=15, 1 year=10, older=5
coverage_score:  targets graph with <5 points=20, <8 points=15, <12 points=10, 12+=5
novelty_score:   new publisher=15, NEW EDITION of a series tracked in
                 recurring-sources.json=15, existing publisher new topic=5,
                 existing publisher same topic (not a tracked series)=0
```

A new edition of a tracked recurring series is never penalized for coming from a known publisher — updated data from an established series is exactly what keeps the graphs current.

## Step 5: Evaluate & Decide

For each scored candidate:

### Score >= 60: AUTO-INGEST
1. Use `WebFetch` to get the full source content
2. Extract ALL quantitative statistics following the `/ingest` skill rules:
   - Exact verbatim quotes only
   - Ranges to midpoints with confidence bounds
   - Negative values for losses/declines
   - Correct data_point vs overlay classification
3. Map each statistic to the appropriate prediction graph
4. Present the extraction report to the user (same format as `/ingest`)
5. Ask for per-statistic approval before applying
6. If approved: apply changes to prediction JSONs, update `confirmed-sources.json`, update `last-updated.json`, and if the source belongs to a series in `src/data/recurring-sources.json`, update that entry's `lastIngested` and `nextExpected`
7. **Populate chatbot content store**: Write a source content JSON file to `src/data/source-content/[source-id].json` with:
   ```json
   {
     "id": "[source-id]",
     "abstract": "[2-4 sentence summary, 500-2000 chars]",
     "keyFindings": ["Finding 1 with numbers and dates", "Finding 2", "Finding 3"],
     "methodology": "[Study design, data sources, sample size, time period]",
     "qualifiers": "[Caveats, limitations, uncertainty language]",
     "fetchedAt": "[today's date YYYY-MM-DD]"
   }
   ```
   This is REQUIRED for every ingested source regardless of evidence tier. Use the authors' own language. Include specific numbers and dates in key findings.
8. Validate JSON after each change
9. Git commit the changes (including the source-content file) with message: `autoresearch: ingest [source-id] into [graph-slug]`

### Score 40-59: LOG FOR REVIEW
1. Log to `scripts/autoresearch/candidates.tsv` with status "review"
2. Include enough context for a human to quickly decide (title, publisher, why it scored borderline)

### Score < 40: LOG AND SKIP
1. Log to `scripts/autoresearch/candidates.tsv` with status "skip"
2. Include the reason (too old, wrong topic, low tier, etc.)

## Step 6: Log to candidates.tsv

After every candidate evaluation (regardless of outcome), append a row to `scripts/autoresearch/candidates.tsv`:

```
{ISO timestamp}\t{url}\t{publisher}\t{title}\t{tier}\t{score}\t{status}\t{target_graphs}\t{reason}
```

## Step 7: Repeat or Report

After processing the current batch of search results:

- If running autonomously (user said "run" or "go"): pick the next priority graph and loop back to Step 2 (re-run the Step 1 sweep only if a new session starts or the user asks)
- If running interactively: present a summary of what was found and ask if the user wants to continue

### Summary Format

```
=== AUTORESEARCH SESSION SUMMARY ===

Recurring sweep: [N] series due, [N] new editions found, [N] ingested
  (list series: edition ingested or "no new release")

Searches run:    [count]
Sources found:   [count]
Ingested:        [count] (list slugs)
For review:      [count]
Skipped:         [count]

Graph coverage changes:
  [graph-slug]: [old count] -> [new count] data points

Next priority: [graph-slug] ([N] data points)
```

## Rollback Protocol

If any of these occur after a commit:
- JSON parsing fails on any prediction file
- A source ID collision is detected
- The source excerpt cannot be verified

Then: revert the commit with `git revert HEAD` and log the error to candidates.tsv with status "error".

## Critical Rules

- **NEVER fabricate statistics.** Every number must come from verbatim source text.
- **NEVER modify code files.** Only data files (prediction JSONs, confirmed-sources.json, last-updated.json, recurring-sources.json, candidates.tsv, source-content JSONs).
- **ALWAYS run the recurring release sweep first.** Stale editions of tracked series (Stanford, Anthropic, FactSet, Census BTOS, Challenger, Yale, BLS, PwC, etc.) outrank novel-source discovery.
- **ALWAYS keep recurring-sources.json current.** Update `lastChecked` on every sweep and `lastIngested`/`nextExpected` on every ingestion of a tracked series; add entries for newly discovered recurring series.
- **ALWAYS populate chatbot content store** (`src/data/source-content/[source-id].json`) for every ingested source. The chatbot cannot answer questions about sources without this file.
- **ALWAYS check for duplicates** before ingesting (match on URL and source ID).
- **ALWAYS validate JSON** after writing to prediction files.
- **ONE source per commit.** Atomic changes for clean rollback.
- **Respect the scoring system.** Don't override thresholds without human approval.
