# AutoResearch Program — jobsdata.ai

Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). This document programs the AI agent's autonomous research behavior. The human edits this file; the agent edits the data files.

## Objective

Continuously discover, evaluate, and ingest new research sources into the 17 prediction graphs on jobsdata.ai. Maximize data coverage and quality while maintaining strict evidence standards.

## Evaluation Metric: Source Quality Score

Each candidate source is scored before ingestion. The composite score determines keep/discard:

```
score = tier_score + freshness_score + coverage_score + novelty_score

tier_score:     T1=40, T2=25, T3=10, T4=5
freshness_score: published within 90 days=20, 180 days=15, 1 year=10, older=5
coverage_score:  targets graph with <5 data points=20, <8=15, <12=10, 12+=5
novelty_score:   new publisher not yet in confirmed-sources=15, new from existing publisher=5
```

**Thresholds:**
- score >= 60: Auto-ingest (high confidence)
- score 40-59: Add to candidates.tsv as "review" for human approval
- score < 40: Add to candidates.tsv as "skip" with reason

## Graph Priority List

Graphs ranked by data hunger (fewest data points first). The agent should prioritize finding sources for these:

| Priority | Graph Slug | Current Points | Target |
|----------|-----------|---------------|--------|
| 1 | `education-sector-displacement` | 4 | 8+ |
| 2 | `healthcare-admin-displacement` | 4 | 8+ |
| 3 | `creative-industry-displacement` | 6 | 10+ |
| 4 | `customer-service-automation` | 6 | 10+ |
| 5 | `geographic-wage-divergence` | 6 | 10+ |
| 6 | `freelancer-rate-impact` | 7 | 10+ |
| 7 | `high-skill-wage-premium` | 7 | 10+ |
| 8 | `white-collar-professional-displacement` | 7 | 10+ |

## Search Strategy

### Tier 1 Sources (highest priority)
- **NBER working papers**: Search `site:nber.org` for recent papers on AI labor, automation, displacement
- **Government data**: BLS employment statistics, Census BTOS updates, OECD AI Policy Observatory
- **Peer-reviewed journals**: AER, QJE, Science, Nature — search Google Scholar for 2025-2026 publications
- **RCTs and field experiments**: Search for randomized controlled trials on AI tool adoption and productivity

### Tier 2 Sources
- **Think tanks**: Brookings AI, McKinsey Global Institute, RAND Corporation, Pew Research
- **International orgs**: IMF World Economic Outlook chapters on AI, ILO reports, World Bank
- **Industry research**: Gartner, Forrester, Deloitte AI Institute

### Tier 3 Sources
- **Major outlets**: NYT, WSJ, FT, Reuters, Bloomberg — look for original data/surveys in articles
- **Trade publications**: MIT Technology Review, Wired, The Information

### Search Queries (rotate through these)

**Displacement:**
- `AI job displacement 2025 2026 study`
- `automation job loss percentage workforce`
- `AI replace jobs education healthcare creative`
- `customer service chatbot automation rate`
- `white collar AI displacement research`

**Wages:**
- `AI impact wages median income study`
- `AI wage premium high skill workers`
- `entry level salary AI effect`
- `freelancer gig economy AI rates`
- `tech hub wage gap AI`

**Adoption & Exposure:**
- `AI adoption rate companies 2025 2026 survey`
- `generative AI workplace adoption percentage`
- `AI exposure workforce occupation`
- `earnings call AI mentions S&P 500`

## The Loop

```
LOOP:
  1. Pick a search query (rotate, prioritize hungry graphs)
  2. Web search for recent sources (last 12 months preferred)
  3. For each result:
     a. Check if URL or publisher+topic already in confirmed-sources.json
     b. If new, fetch and extract statistics
     c. Score the source using the quality metric above
     d. If score >= 60: run full /ingest pipeline, commit
     e. If score 40-59: log to candidates.tsv as "review"
     f. If score < 40: log to candidates.tsv as "skip"
  4. After each successful ingestion, validate JSON files
  5. If JSON validation fails, git reset and log as "error"
  6. Continue to next query
```

## Constraints

- **NEVER fabricate data.** Every statistic must trace to verbatim source text.
- **NEVER modify prediction-stats.ts, types.ts, or UI code.** Only data files change.
- **ONE source per loop iteration.** Don't batch — commit after each successful ingestion.
- **Respect rate limits.** Wait between web fetches to avoid being blocked.
- **Log everything.** Every attempt goes to candidates.tsv regardless of outcome.

## Rollback Protocol

If any of these occur, `git reset --hard` to the last good commit:
- JSON validation fails (malformed prediction file)
- Build fails (`npm run build`)
- Duplicate source ID detected post-commit
- Source excerpt cannot be verified against original text

## candidates.tsv Format

```
timestamp	url	publisher	title	tier	score	status	target_graphs	reason
```

Status values: `ingested`, `review`, `skip`, `error`

## Human Responsibilities

The human iterates on THIS file to steer the agent's research:
- Adjust graph priority list as data gaps fill
- Add/remove search queries to explore new angles
- Tune quality score thresholds
- Review `candidates.tsv` "review" entries and approve/reject
- Update constraints as the site evolves
