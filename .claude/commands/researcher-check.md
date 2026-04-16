---
name: researcher-check
description: >
  Scan the researcher watchlist for new publications and flag sources worth
  ingesting. Use when the user says "check researchers", "researcher check",
  "new papers", "what have the economists published", or "scan for new research".
---

# Researcher Watchlist Check

Scan the researcher watchlist at `src/data/researcher-watchlist.json` for new publications since each researcher's `lastChecked` date. Score findings using the standard RRS methodology and flag anything worth ingesting.

## Input

Optional: $ARGUMENTS can specify a single researcher name (e.g., "Acemoglu") or a topic filter (e.g., "displacement"). If blank, scan all researchers.

## Workflow

### Step 1: Load the Watchlist

Read `src/data/researcher-watchlist.json`. For each researcher (or the filtered subset):
- Note their `lastChecked` date
- Note their `topics` and `graphRelevance` arrays
- Note their `profileUrls` for search targeting

### Step 2: Search for New Publications

For each researcher, run at least 2 search strategies:

**Strategy A — Name + topic search:**
```
"[researcher name]" [primary topic] 2026 working paper
```

**Strategy B — NBER/SSRN/arXiv search:**
```
"[researcher name]" site:nber.org OR site:ssrn.com OR site:arxiv.org [year]
```

**Strategy C — Google Scholar (if profile URL available):**
Fetch their Google Scholar profile page and check for papers published after `lastChecked`.

**Strategy D — Citation chasing:**
If a new paper is found, check its references and co-authors for additional new work.

Skip researchers whose `lastChecked` is within the last 7 days unless the user specifically requests a full scan.

### Step 3: Score Each Finding

Apply the standard RRS scoring from CLAUDE.md:

```
RRS = base_quality + recency_bonus + quant_bonus + graph_relevance

base_quality (0-4): Tier 1=4, Tier 2=3, Tier 3=2, Tier 4=1
recency_bonus (0-2): <6mo=2, <12mo=1, older=0
quant_bonus (0-2): 3+ quant claims=2, 1-2=1, none=0
graph_relevance (0-2): direct data_point=2, overlay=1, general=0
```

### Step 4: Produce the Scan Report

```
═══════════════════════════════════════════════════════
  RESEARCHER WATCHLIST SCAN
  Date: [today]
  Researchers scanned: [N]
  New papers found: [N]
  Papers worth ingesting (RRS >= 6): [N]
═══════════════════════════════════════════════════════

## New Publications by Researcher

### [Researcher Name] — [Affiliation]
Last checked: [date] → Updated to: [today]

  [1] [Paper Title] — [Venue], [Date]
      URL: [url]
      RRS: [score]
      Stats: [quantitative findings]
      Maps to: [graph slugs]
      Action: [INGEST / OVERLAY ONLY / SKIP]

### [Next Researcher] ...

═══════════════════════════════════════════════════════
  NOTHING NEW
═══════════════════════════════════════════════════════

[List researchers with no new publications since last check]

═══════════════════════════════════════════════════════
  RECOMMENDED INGESTIONS
═══════════════════════════════════════════════════════

[Ordered by RRS, with graph mappings and extracted stats ready for /ingest]
```

### Step 5: Update lastChecked Dates

After the scan, update `lastChecked` for each scanned researcher to today's date in `src/data/researcher-watchlist.json`.

### Step 6: Hand Off to Ingestion

For any papers the user approves, provide the URL and pre-extracted stats to the `/ingest` workflow.

## Integration with Weekly Digest

When called from `/weekly-research-digest`, this skill runs as Strategy 5 (researcher-specific search) and contributes findings to the digest brief. In that context, skip the interactive report and return structured results directly.

## Notes

- Prefer NBER working papers and published journal articles over blog posts or media appearances
- If a researcher has a Substack (e.g., Imas), check it but classify as Tier 4
- Co-authored papers should be attributed to all watchlisted co-authors to avoid duplicate scanning
- When a researcher moves institutions, update their affiliation in the watchlist
