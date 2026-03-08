# program.md — jobsdata.ai Research Org Code

Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). This document is the operating manual for the autonomous research agent. The human edits this file to steer the agent's behavior. The agent edits the data files.

## Setup

Before any autonomous session, read these files for full context:

1. `CLAUDE.md` — project architecture, data conventions, evidence tiers, file paths
2. `src/data/confirmed-sources.json` — master source registry (what's already ingested)
3. `scripts/autoresearch/candidates.tsv` — what's already been attempted (avoid re-searching)
4. `src/data/last-updated.json` — current freshness date

Then verify the state:
- Run `node scripts/autoresearch/auto-audit.js` to check data health
- If any must-fix issues exist, resolve them before starting new research

## What You CAN Do

- **Modify data files**: prediction JSONs in `src/data/predictions/`, `confirmed-sources.json`, `last-updated.json`
- **Write to logs**: `scripts/autoresearch/candidates.tsv`
- **Run audit scripts**: `node scripts/autoresearch/auto-audit.js [--fix]`
- **Search the web**: discover and evaluate new research sources
- **Git commit**: one source per commit, one audit pass per commit

## What You CANNOT Do

- **Modify code files**: never touch `*.ts`, `*.tsx`, `*.js` (except auto-audit.js via human instruction), `*.css`, or any source under `src/app/`, `src/lib/`, `src/components/`
- **Fabricate data**: every statistic must trace to verbatim source text
- **Override thresholds**: the scoring system and keep/discard boundaries are set by the human in this file
- **Skip logging**: every source attempt goes to `candidates.tsv` regardless of outcome
- **Batch commits**: one source per commit for clean atomic rollback

## The Evaluation Metric: Source Quality Score

Each candidate source is scored before ingestion:

```
score = tier_score + freshness_score + coverage_score + novelty_score

tier_score:      T1=40  T2=25  T3=10  T4=5
freshness_score: ≤90 days=20  ≤180 days=15  ≤1 year=10  older=5
coverage_score:  graph has <5 pts=20  <8 pts=15  <12 pts=10  12+=5
novelty_score:   new publisher=15  existing publisher new topic=5
```

**Keep/discard thresholds:**
| Score | Action |
|-------|--------|
| >= 60 | Auto-ingest: extract stats, apply to prediction JSONs, commit |
| 40-59 | Log to candidates.tsv as "review" for human decision |
| < 40  | Log to candidates.tsv as "skip" with reason |

## Graph Priority List

Graphs ranked by data hunger. The agent prioritizes graphs with the fewest data points:

| Priority | Graph Slug | Category | Current Points | Target |
|----------|-----------|----------|---------------|--------|
| 1 | `education-sector-displacement` | displacement | 4 | 8+ |
| 2 | `healthcare-admin-displacement` | displacement | 4 | 8+ |
| 3 | `creative-industry-displacement` | displacement | 6 | 10+ |
| 4 | `customer-service-automation` | displacement | 6 | 10+ |
| 5 | `geographic-wage-divergence` | wages | 6 | 10+ |
| 6 | `freelancer-rate-impact` | wages | 7 | 10+ |
| 7 | `high-skill-wage-premium` | wages | 7 | 10+ |
| 8 | `white-collar-professional-displacement` | displacement | 7 | 10+ |

**Human**: update this table after each research session. Run the audit to recount.

## Search Strategies

Rotate through these by evidence tier. Within each tier, rotate queries to avoid repetitive searching.

### Tier 1 — Verified Data & Research (weight 4x)
- `site:nber.org AI labor automation displacement [year]`
- `site:bls.gov employment projections artificial intelligence`
- `"American Economic Review" OR "Quarterly Journal of Economics" AI jobs [year]`
- `site:census.gov business technology survey AI adoption`
- `AI randomized controlled trial productivity workers [year]`

### Tier 2 — Institutional Analysis (weight 2x)
- `site:brookings.edu AI workforce displacement wages [year]`
- `site:mckinsey.com AI labor market impact [year]`
- `site:imf.org artificial intelligence employment [year]`
- `site:ilo.org AI future of work [year]`
- `Gartner OR Forrester AI job displacement forecast [year]`

### Tier 3 — Journalism with Original Data (weight 1x)
- `AI job losses survey data percentage [year]` site:nytimes.com OR site:wsj.com OR site:ft.com
- `AI wages impact study workers [year]` site:reuters.com OR site:bloomberg.com

### Category-Specific Queries

**Displacement**: `AI replace jobs [sector] percentage`, `automation [sector] workforce study`
**Wages**: `AI wage premium high skill`, `entry level salary AI effect`, `freelancer gig economy AI rates`, `AI tech hub wage gap`
**Adoption**: `AI adoption rate companies survey [year]`, `generative AI workplace percentage`
**Exposure**: `AI exposure occupation workforce percentage`, `AI workforce risk assessment`
**Signals**: `earnings call AI mentions S&P 500`, `AI hiring trends layoffs data`

## The Experiment Loop

There are three autonomous loops. Each can run independently.

---

### Loop 1: Source Discovery (autoresearch)

Skill: `/autoresearch [category]`

```
LOOP:
  1. Pick the highest-priority graph from the priority list above
     (or use the human's focus directive if provided)
  2. Load the graph's JSON to understand existing sources and gaps
  3. Run 2-3 web searches, rotating through query strategies
  4. For each candidate:
     a. Check if URL or source ID already exists (skip if duplicate)
     b. Score using the quality metric
     c. If score >= 60: fetch content, extract statistics, present for approval, ingest, commit
     d. If score 40-59: log as "review"
     e. If score < 40: log as "skip"
  5. Log every candidate to candidates.tsv
  6. Validate all modified JSON files
  7. If validation fails: git revert HEAD, log as "error"
  8. Move to next graph or next query
  REPEAT
```

**Ingestion rules** (from `/ingest` skill):
- Exact verbatim quotes only — never paraphrase statistics
- Ranges become midpoints with confidence bounds (e.g., "20-30%" -> value: 25, low: 20, high: 30)
- Negative values for losses/declines (e.g., "10% decline" -> value: -10)
- data_point if unit matches graph unit; overlay if different unit or directional signal
- Source ID format: `{publisher-slug}-{topic-keywords}-{year}`
- Update `confirmed-sources.json` with every ingestion
- Update `last-updated.json` with today's date

---

### Loop 2: Data Quality Audit (autoaudit)

Skill: `/autoaudit [scope]`

```
LOOP (per category):
  1. Run: node scripts/autoresearch/auto-audit.js [--category=X]
  2. Read the report. It checks:
     - Weighted average drift (currentValue vs recomputed)
     - Source ID integrity (cross-references between files)
     - Duplicate detection (history entries, overlays, sources)
     - Sort order (arrays must be date-ascending)
     - Schema validation (dates, values, tiers, confidence bounds)
     - Hero stat drift (page.tsx vs computed values)
     - Confirmed-sources.json counts
     - Orphan sources
     - URL patterns
  3. Auto-fix what the script supports: run with --fix flag
  4. Re-run without --fix to verify fixes stuck
  5. Manually investigate remaining issues
  6. Commit: "autoaudit: fix [N] data quality issues"
  7. Move to next category
  REPEAT until all categories pass clean
```

**Auto-fixable**: sort order violations, currentValue drift > 1pp, totalSources/verifiedCount mismatch, lastUpdated inconsistency

**Needs investigation**: missing source IDs, duplicate entries, inverted confidence bounds, schema violations

---

### Loop 3: Signal Monitoring (future)

Not yet implemented. When built, this loop will:
- Monitor RSS feeds, BLS release calendar, NBER new papers
- Auto-trigger source discovery when relevant new publications appear
- Track leading indicators (earnings call mentions, job posting trends)

---

## Logging

### candidates.tsv

Every source attempt gets a row, regardless of outcome:

```
{ISO timestamp}\t{url}\t{publisher}\t{title}\t{tier}\t{score}\t{status}\t{target_graphs}\t{reason}
```

Status values: `ingested` | `review` | `skip` | `error`

### Git commits

- Source ingestion: `autoresearch: ingest [source-id] into [graph-slug]`
- Audit fixes: `autoaudit: fix [N] data quality issues`
- Never amend — always new commits for clean history

## Rollback Protocol

If any of these occur after a commit:
- JSON parsing fails on any prediction file
- `npm run build` fails
- Duplicate source ID detected post-commit
- Source excerpt cannot be verified against original text

Then: `git revert HEAD` and log the error to candidates.tsv with status "error".

Never use `git reset --hard` — always revert for audit trail.

## Constraints

1. **NEVER fabricate statistics.** Every number must trace to verbatim source text.
2. **NEVER modify code files.** Only data files change.
3. **ONE source per commit.** Atomic changes for clean rollback.
4. **Log everything.** Every attempt goes to candidates.tsv.
5. **Validate after every write.** Parse all modified JSON before committing.
6. **Respect the scoring system.** Don't override keep/discard thresholds without human approval.
7. **Respect rate limits.** Wait between web fetches to avoid being blocked.
8. **Ask before removing data.** Duplicates and orphan sources need human sign-off.

## Hero Stats Sync

Three hardcoded hero stats on the homepage must stay in sync with prediction data:

| Stat | Source Graph | Current Value |
|------|-------------|---------------|
| ~21% Productivity boost | Manual (median of 18 studies) | 21% |
| ~3% Projected job loss | `overall-us-displacement` (weighted avg, all tiers) | 3% |
| ~0% Measured job loss | `overall-us-displacement` (observed data only) | 0% |

After any ingestion that affects displacement graphs, the audit script checks for drift > 1pp. If detected, flag for human to update `src/app/page.tsx`.

## Human Responsibilities

The human iterates on THIS file to steer the agent:

- **Adjust graph priorities** as data gaps fill (update the table above)
- **Add/remove search queries** to explore new angles or avoid exhausted searches
- **Tune quality score weights** if too many false positives or false negatives
- **Review candidates.tsv** "review" entries and approve/reject
- **Update constraints** as the site evolves
- **Approve hero stat changes** when drift is detected

The agent runs the loops. The human steers the program.

## NEVER STOP

Once an autonomous session begins (user says "run", "go", or invokes a skill), do NOT pause to ask the human if you should continue. Do NOT ask "should I keep going?" or "is this a good stopping point?". The human may be away from the computer and expects the agent to continue working until manually stopped or until all graphs meet their coverage targets.

If you run out of search ideas for one graph, move to the next. If all graphs are at target, run a full audit. If the audit is clean, try deeper searches with different query patterns. The loop runs until the human interrupts.
