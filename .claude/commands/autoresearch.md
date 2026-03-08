# AutoResearch — Autonomous Source Discovery & Ingestion

You are an autonomous research agent for jobsdata.ai. Your job is to discover new research sources, evaluate them, and ingest the best ones into the site's prediction data files — following the autoresearch loop pattern (try, evaluate, keep/discard, repeat).

## Input

Optional focus directive from the user:

$ARGUMENTS

If no arguments provided, follow the default priority order from `research-program.md`.

## Step 0: Read the Research Program

Read `research-program.md` in the project root. This is your operating manual — it defines:
- The scoring metric for source quality
- Which graphs are "hungry" for data (fewest data points)
- Search strategies organized by evidence tier
- Keep/discard thresholds

Also read `scripts/autoresearch/candidates.tsv` to see what has already been attempted (avoid re-searching the same URLs).

## Step 1: Pick a Search Target

Based on the graph priority list in `research-program.md`, pick the graph with the fewest data points that you haven't recently searched for. If the user provided a focus directive (e.g., "healthcare" or "wages"), prioritize graphs in that category.

Load the target graph's JSON file from `src/data/predictions/` to understand:
- What sources already exist (avoid duplicates)
- What the current data range and weighted average look like
- What date ranges have gaps

## Step 2: Search for Sources

Use `WebSearch` to find recent research. Run 2-3 searches per iteration, rotating through query patterns from `research-program.md`. Prioritize:

1. **Tier 1 first**: NBER, BLS, peer-reviewed journals, government data
2. **Tier 2 second**: Brookings, McKinsey, IMF, Gartner
3. **Tier 3 if needed**: Major outlets with original data/surveys

For each search, look for sources that:
- Contain specific quantitative statistics (percentages, dollar amounts, counts)
- Were published within the last 12 months (prefer last 6 months)
- Are not already in `src/data/confirmed-sources.json`

## Step 3: Score Each Candidate

For each candidate source found, compute the quality score:

```
score = tier_score + freshness_score + coverage_score + novelty_score

tier_score:      T1=40, T2=25, T3=10, T4=5
freshness_score: published within 90 days=20, 180 days=15, 1 year=10, older=5
coverage_score:  targets graph with <5 points=20, <8 points=15, <12 points=10, 12+=5
novelty_score:   new publisher=15, existing publisher new topic=5
```

## Step 4: Evaluate & Decide

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
6. If approved: apply changes to prediction JSONs, update `confirmed-sources.json`, update `last-updated.json`
7. Validate JSON after each change
8. Git commit the changes with message: `autoresearch: ingest [source-id] into [graph-slug]`

### Score 40-59: LOG FOR REVIEW
1. Log to `scripts/autoresearch/candidates.tsv` with status "review"
2. Include enough context for a human to quickly decide (title, publisher, why it scored borderline)

### Score < 40: LOG AND SKIP
1. Log to `scripts/autoresearch/candidates.tsv` with status "skip"
2. Include the reason (too old, wrong topic, low tier, etc.)

## Step 5: Log to candidates.tsv

After every candidate evaluation (regardless of outcome), append a row to `scripts/autoresearch/candidates.tsv`:

```
{ISO timestamp}\t{url}\t{publisher}\t{title}\t{tier}\t{score}\t{status}\t{target_graphs}\t{reason}
```

## Step 6: Repeat or Report

After processing the current batch of search results:

- If running autonomously (user said "run" or "go"): pick the next priority graph and loop back to Step 1
- If running interactively: present a summary of what was found and ask if the user wants to continue

### Summary Format

```
=== AUTORESEARCH SESSION SUMMARY ===

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
- **NEVER modify code files.** Only data files (prediction JSONs, confirmed-sources.json, last-updated.json, candidates.tsv).
- **ALWAYS check for duplicates** before ingesting (match on URL and source ID).
- **ALWAYS validate JSON** after writing to prediction files.
- **ONE source per commit.** Atomic changes for clean rollback.
- **Respect the scoring system.** Don't override thresholds without human approval.
