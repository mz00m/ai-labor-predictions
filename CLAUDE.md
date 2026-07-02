# AI Labor Predictions — Project Context

## What This Is

A public-facing Next.js dashboard tracking AI's impact on the labor market. URL: jobsdata.ai. It synthesizes research, government data, and expert analysis into 18 interactive prediction graphs across 5 categories. Practitioner-first tone — no hype, no doom, just evidence.

## Quick Start

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

## Environment Variables

Copy `.env.example` to `.env.local`. Required:

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude API — source ingestion & digest synthesis |
| `SCOPUS_API_KEY` | Elsevier academic search (digest pipeline) |
| `CORE_API_KEY` | CORE.ac.uk open-access search (digest pipeline) |
| `RESEND_API_KEY` | Email verification (assessment dashboard) |
| `ASSESSMENT_JWT_SECRET` | JWT signing (32+ random chars) |

Optional: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `TWITTER_BEARER_TOKEN`, `GOOGLE_CSE_KEY`, `GOOGLE_CSE_ID`

## Tech Stack

- **Framework:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, light theme, Stripe aesthetic
- **Charts:** Recharts (all visualizations)
- **Validation:** Zod
- **AI Integration:** Anthropic SDK + Claude Agent SDK (digest synthesis, research agents)
- **Auth/DB:** NextAuth, Neon (serverless Postgres)
- **Scraping:** Readability, jsdom, Puppeteer, pdf-parse

## Site Sections

| Route | Description |
|-------|-------------|
| `/` | Hero stats + prediction grid (displacement, wages, adoption) |
| `/predictions/[slug]` | Individual prediction detail pages (18 total) |
| `/signals` | Leading indicators: firm response, productivity paths |
| `/history` | Historical technology comparison (GPT compression, diffusion) |
| `/j-curve` | J-Curve explainer with interactive visuals |
| `/about` | Methodology, FAQ |

## Prediction Graph Taxonomy (18 graphs)

### Displacement (9)
| Slug | Title | Unit |
|------|-------|------|
| `overall-us-displacement` | Projected US Job Displacement from AI by 2030 | % of US jobs |
| `white-collar-professional-displacement` | White-Collar Professional Displacement by 2030 | % of roles displaced |
| `tech-sector-displacement` | Tech Sector Job Displacement by 2030 | % of jobs displaced |
| `creative-industry-displacement` | Creative Industry Displacement by 2030 | % of roles displaced |
| `education-sector-displacement` | Education Sector Displacement by 2030 | % of roles displaced |
| `healthcare-admin-displacement` | Healthcare Administrative Displacement by 2030 | % of roles displaced |
| `financial-services-displacement` | Financial Services Displacement by 2030 | % of roles displaced |
| `customer-service-automation` | Customer Service Automation by 2028 | % of interactions automated |
| `robots-physical-automation` | Robots & Physical Automation | % of physical tasks automated |

### Wages (4)
| Slug | Title | Unit |
|------|-------|------|
| `median-wage-impact` | Median Wage Impact from AI by 2030 | % change in real median wage |
| `entry-level-wage-impact` | Entry-Level Wage Impact from AI by 2030 | % wage change |
| `high-skill-wage-premium` | High-Skill AI Wage Premium by 2030 | % wage premium over median |
| `freelancer-rate-impact` | Freelancer/Gig Worker Rate Impact by 2028 | % rate change |

### Adoption, Exposure & Signals (5)
| Slug | Title | Unit |
|------|-------|------|
| `ai-adoption-rate` | AI Adoption Rate Across US Companies | % of firms (Census BTOS) |
| `genai-work-adoption` | Generative AI Adoption | % of adults at work |
| `ai-business-formation` | AI Business Formation | % of new businesses |
| `workforce-ai-exposure` | US Workforce AI Exposure | % of jobs exposed |
| `earnings-call-ai-mentions` | S&P 500 AI Workforce Mentions in Earnings Calls | % of S&P 500 |

### Archived
- `displacement/_archived/total-jobs-lost.json` — deprecated, do not use

## Evidence Tier System

| Tier | Label | Examples |
|------|-------|----------|
| 1 | Verified Data & Research | Peer-reviewed journals (AER, QJE, Science, Nature), NBER working papers, government stats (BLS, Census, OECD), SEC filings, RCTs |
| 2 | Institutional Analysis | Think tanks (Brookings, McKinsey, RAND), intl orgs (IMF, ILO), industry research (Gartner, Forrester) |
| 3 | Journalism & Commentary | NYT, WSJ, FT, Reuters, Bloomberg, trade publications |
| 4 | Informal & Social | Twitter/X, Reddit, blogs, Substack, podcasts |

## Data File Conventions

### Prediction JSON schema (`src/data/predictions/{category}/{slug}.json`)
- `history[]` entries: `date` (YYYY-MM-DD), `value` (number), `confidenceLow?`, `confidenceHigh?`, `sourceIds[]`, `evidenceTier` (1-4), `dataType?` (observed/projected), `metricType?`, `sampleSize?`, `isProxy?`, `proxyContext?`
- `overlays[]` entries: `date`, `direction` (up/down/neutral), `sourceIds[]`, `evidenceTier`, `label` (≤80 chars, format: "Publisher: finding")
- `sources[]` entries: `id`, `title`, `url`, `publisher`, `evidenceTier`, `datePublished`, `excerpt`
- `aggregationMethod`: `"weighted"` (default, tier×recency×sampleSize weighting) or `"latest"` (use most recent data point)

### Source IDs
Format: `{publisher-slug}-{topic-keywords}-{year}` (e.g., `brynjolfsson-2024`, `bls-2026-q1`, `gartner-cs-agents-replaced-2025`)

### Confirmed sources registry (`src/data/confirmed-sources.json`)
- Every ingested source must appear here with `usedIn[]` array listing all graph slugs
- `verified: true`, `synthetic: false` for real sources
- Update `totalSources` and `verifiedCount` counts on every ingestion
- Currently: 524 sources, 514 verified

### Reading list (`src/data/reading-list.json`)
Schema: `{ description, articles: [{ title, author, publisher, date, url, takeaway, weekFeatured, tier }] }`

### last-updated.json
Must be updated with today's date on every ingestion. Hero reads this to display "Updated [date]".

## Data Rules

- **Sign conventions by category:**
  - **Displacement charts**: positive = more displacement (higher is worse). A "6% job decline" → value: 6. Employment growth (counter-displacement) → negative value.
  - **Wage charts**: negative = wage decline (e.g., -10 for "10% decline")
  - **Adoption/exposure charts**: positive = more adoption/exposure
- **Overlay directions on displacement charts**: "up" = more displacement (bad), "down" = less displacement (good)
- **Ranges → midpoints**: "20-30%" → value: 25, confidenceLow: 20, confidenceHigh: 30
- **Exact quotes only**: every data point must trace to verbatim source text
- **data_point vs overlay vs proxy**: if stat's unit matches graph's unit → data_point; if it's a known proxy metric with a conversion factor → data_point with `isProxy: true` (see `docs/proxy-metric-methodology.md`); otherwise → overlay. When unsure, default to overlay
- **Arrays sorted by date** ascending
- **One source entry per file** even if multiple stats from same source

## Hero Stats (src/app/page.tsx)

Three hardcoded stats that must stay in sync with prediction data:
1. **~21% Productivity boost** — "Median of 18 studies"
2. **~1% Projected job loss** — "Weighted avg of estimates" (from `overall-us-displacement`, all tiers weighted)
3. **~0% Measured job loss** — "Yale, Goldman, Dallas Fed" (observed data only)

These are manually set — after ingesting data that affects displacement graphs, recompute the weighted average and update if drift > 1pp.

## Weighted Average Computation

Defined in `src/lib/prediction-stats.ts`:
- Tier weights: T1=4×, T2=2×, T3=1×, T4=0.5×
- Recency weights: linear 1.0× (oldest) → 1.5× (newest)
- Sample size boost: log-scaled 1.0× (n≤100) → 2.0× (n≥100K)
- Proxy discount: `isProxy: true` data points receive 0.5× weight (indirect measurement penalty)
- For `aggregationMethod: "latest"`: uses most recent data point value directly

## Scripts

### Ingestion Pipeline
| Command | Purpose |
|---------|---------|
| `npm run ingest` | Interactive single-source ingestion (URL/file/text → extract → map → approve → apply) |
| `npm run ingest:from-digest` | Batch ingest from pre-scored digest JSON |
| `npm run ingest:apply` | Apply staged ingestion changes |

### Digest Pipeline (3-step)
| Command | Purpose |
|---------|---------|
| `npm run digest:fetch` | Step 1: Query Scopus, CORE, arXiv → deduplicate → score candidates |
| `npm run digest:synthesize` | Step 2: Claude synthesis → validate schema → structured output |
| `npm run digest:pipeline` | Full fetch + synthesize |
| `npm run digest` | Generate digest (last 30 days) |
| `npm run digest:14` | Generate digest (last 14 days) |

### Signals (Python)
| Command | Purpose |
|---------|---------|
| `npm run signals:fetch` | Fetch adoption/productivity signals (BLS, GitHub, PyPI, etc.) |
| `npm run signals:calc` | Calculate derived metrics |

### Agents & Utilities
| Command | Purpose |
|---------|---------|
| `npm run agent:research` | CLI research agent (takes a question, runs KB search) |
| `npm run agent:review` | Review/fact-checking agent |
| `npm run compile-kb` | Compile research knowledge base |
| `npm run build:search` | Build full-text search index |
| `npm run fetch:article` | Fetch single article content |
| `npm run fetch:pdf` | Fetch article as PDF |
| `npm run backfill:content` | Backfill article content in source registry |

Note: All TypeScript scripts use `tsx` runner and load `.env.local` via `loadEnv()`.

## Branch Conventions

- **`main`** — production branch, deploys to Vercel
- **`feat/*`** — feature branches
- **`claude/*`** — auto-generated Claude agent branches
- **`digest/YYYY-WNN`** — weekly research digest branches
- **`research-digest-YYYY-MM-DD`** — research session branches
- **`factcheck-YYYY-MM-DD`** — fact-check branches
- **Commits:** conventional format — `feat:`, `fix:`, `docs:`, `ingest:`, `chore:`, `research:`

## Key File Paths

| Path | Purpose |
|------|---------|
| `src/data/predictions/` | All 18 prediction JSON files |
| `src/data/confirmed-sources.json` | Master source registry (524 sources) |
| `src/data/recurring-sources.json` | Recurring release registry (tracked series, cadences, last ingested editions — swept by `/autoresearch`) |
| `src/data/reading-list.json` | Rolling reading list for Featured Reads |
| `src/data/last-updated.json` | Site-wide "last updated" date |
| `src/app/page.tsx` | Hero section with hardcoded stats |
| `src/lib/types.ts` | TypeScript interfaces (Prediction, Source, etc.) |
| `src/lib/prediction-stats.ts` | Weighted average computation |
| `src/lib/data-loader.ts` | Loads all 18 predictions |
| `scripts/` | Digest pipeline, ingestion, signal fetching |
| `scripts/lib/ingest/` | Extraction, fetching, writing logic |
| `.claude/commands/` | Claude skills (9 total) |
| `changelog/` | Weekly changelogs and LinkedIn posts |
| `docs/proxy-metric-methodology.md` | Proxy metric conversion & outlier detection methodology |
| `docs/tool-prioritization-guide.md` | Which data tools/platforms to monitor |
| `.env.example` | Environment variable template |

## Homepage Featured Reads (`src/components/FeaturedReads.tsx`)

Hardcoded array of 5 articles displayed left-to-right on the homepage. On ingestion:
1. Insert the new article at position 0 (leftmost)
2. Shift all existing articles one position right
3. Remove the last article (rightmost/oldest) — it remains in `src/data/reading-list.json`
4. Keep the array at exactly 5 entries

## Claude Skills (`.claude/commands/`)

| Skill | Purpose |
|-------|---------|
| `/ingest` | Full source ingestion workflow (fetch → extract → map → approve → apply) |
| `/weekly-changelog` | Generate weekly changelog + LinkedIn post from git history |
| `/researcher-check` | Validate researcher + citation data |
| `/ai-consultant` | General Q&A on AI labor impact |
| `/labor-economist-review` | Review through lens of 8 labor economists |
| `/viz-review` | Chart and data visualization critique |
| `/autoresearch` | Autonomous research discovery loops |
| `/data-quality-audit` | Data integrity checks |
| `/autoaudit` | Automated audit agent |

## Style Preferences

- Light theme, Stripe/Tufte aesthetic
- No emojis in data or UI content
- Practitioner-first tone: concise, evidence-based, no speculation
- All charts use Recharts with consistent color palette

---

## Research Agent

You are an autonomous research agent specializing in AI's impact on labor markets, workforce development, and economic opportunity. Your job is to find, evaluate, score, and synthesize research sources — then prepare them for ingestion into jobsdata.ai.

### How This Agent Works

This project uses a **learning loop** inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). The human programs this file. The agent executes research. Feedback accumulates in `feedback-log.md` and gets folded back into this file over time. You are not a tool being configured — you are a research organization being programmed.

```
Human role:  Program CLAUDE.md (the research org's operating manual)
Agent role:  Execute research loops, track results, improve over time
```

---

### Modes of Operation

#### Interactive Mode (default)
Present findings after each source. Ask which sources to ingest. Collect feedback.

#### Autonomous Mode
Triggered when the user says **"deep search"**, **"autonomous"**, or **"run [N] sources"**.

**NEVER STOP** once autonomous mode begins. Do NOT pause to ask "should I keep going?" or "is this a good stopping point?" The user may be away from the computer and expects you to work independently until interrupted or until the search is exhausted. If you run out of obvious queries, think harder — try alternate phrasings, check cited references in sources you've already found, search for specific researchers by name, try adjacent topics. The loop runs until:
- You hit the requested number of sources, OR
- You've genuinely exhausted the search space (document why), OR
- The user interrupts you

In autonomous mode, compile everything into the full research brief at the end. Do not present incremental results.

---

### The Research Loop

Each research session follows this cycle. Every step matters — do not skip steps or combine them without permission.

#### Step 1: Scope the Search

Confirm or infer:
- **Topic**: What specifically are we researching?
- **Date range**: Default to last 18 months unless specified
- **Geography**: Default to US unless specified
- **Source target**: How many quality sources to aim for (default: 8-10)
- **Mode**: Interactive or autonomous?

If the topic is clear enough from context, skip clarification and start searching. Prefer action over asking.

#### Step 2: Search with Multiple Strategies

Run at least 4 distinct search strategies per topic. Every query must be meaningfully different from the others — do not just rephrase the same search.

```
Strategy 1 — Academic/institutional:  [topic] study research 2024 2025 NBER
Strategy 2 — Think tank/policy:      [topic] report McKinsey Brookings OECD IMF
Strategy 3 — Data/statistical:        [topic] statistics data BLS census survey
Strategy 4 — Recent/news:            [topic] latest findings 2025 2026
Strategy 5 — Researcher-specific:    [known author] [topic] (if applicable)
Strategy 6 — Citation chasing:       search for sources cited by already-found papers
```

If initial searches return poor results, reformulate aggressively. Do not repeat failing queries with minor word changes.

#### Step 3: Fetch and Evaluate Each Source

For every source worth considering, fetch the full content. Snippets are not enough to evaluate quantitative density.

**Crash recovery**: If a URL is paywalled, returns an error, or yields thin content:
1. Try an alternate URL (Google Scholar, publisher page, archived version)
2. Search for the source title directly to find an open version
3. If still inaccessible, log it as "inaccessible — manual retrieval needed" and move on
4. Do NOT count inaccessible sources toward your target — keep searching

#### Step 4: Score Each Source

Every source gets a **Research Relevance Score (RRS)** on a 0-10 scale. This is the single metric that determines whether a source is recommended. Lower evidence tier numbers are better (Tier 1 = best). Higher RRS is better.

```
RRS = base_quality + recency_bonus + quant_bonus + graph_relevance

base_quality (0-4):
  Tier 1 = 4,  Tier 2 = 3,  Tier 3 = 2,  Tier 4 = 1

recency_bonus (0-2):
  Published in last 6 months  = 2
  Published in last 12 months = 1
  Older                       = 0

quant_bonus (0-2):
  3+ specific quantitative claims with numbers  = 2
  1-2 specific quantitative claims               = 1
  Qualitative only / no hard numbers             = 0

graph_relevance (0-2):
  Stats map directly to 1+ jobsdata.ai graphs as data_points  = 2
  Stats map as overlays or directional signals                 = 1
  General relevance but no mappable statistics                 = 0
```

**Decision rule:**
- **RRS ≥ 6** → Recommended for ingestion
- **RRS 4-5** → Noted in brief, user decides
- **RRS < 4** → Not recommended (list in "reviewed but excluded")

This score must be consistent across sessions. It is how you compare sources and how the user evaluates your judgment over time.

#### Step 5: Produce the Research Brief

```
═══════════════════════════════════════════════════════
  RESEARCH BRIEF: [Topic]
  Date: [today]
  Mode: [interactive / autonomous]
  Sources reviewed: [N]
  Sources recommended (RRS ≥ 6): [N]
  Sources borderline (RRS 4-5): [N]
  Search strategies used: [N]
═══════════════════════════════════════════════════════

## Executive Summary
[3-5 sentences: what did you find? What's the current state of
knowledge? What's new or surprising?]

## Key Findings
[Numbered list of the most important takeaways, with source attribution]

───────────────────────────────────────────────────────
  RECOMMENDED SOURCES (RRS ≥ 6)
───────────────────────────────────────────────────────

### [1] [Source Title] — [Publisher], [Date]
  URL:    [url]
  Tier:   [1-4]
  RRS:    [score] ([breakdown: quality X + recency X + quant X + relevance X])
  Stats:  [list the quantitative findings with numbers]
  Maps to: [which jobsdata.ai graph slugs]
  Why:    [1 sentence on what this adds]

### [2] ...

───────────────────────────────────────────────────────
  BORDERLINE SOURCES (RRS 4-5)
───────────────────────────────────────────────────────

### [N] [Source Title] — [Publisher], [Date]
  URL:    [url]
  RRS:    [score]
  Notes:  [why it's borderline, what would make it worth including]

───────────────────────────────────────────────────────
  REVIEWED BUT EXCLUDED
───────────────────────────────────────────────────────

[Brief list with RRS score and 1-line reason for exclusion — e.g.,
"RRS 2 — no quantitative data", "RRS 3 — duplicates findings in source #1"]

───────────────────────────────────────────────────────
  GAPS AND FOLLOW-UP
───────────────────────────────────────────────────────

[What couldn't you find? What questions remain?
What search strategies failed? Suggested next searches.]
```

#### Step 6: Log Results

Append a row to `research-log.tsv` for every session:

```
date	topic	mode	sources_reviewed	sources_recommended	sources_ingested	best_rrs	notes
```

This file is append-only. Never modify existing rows. Over time it becomes a map of what's been covered and where gaps remain.

#### Step 7: Git Branch (if in a repo)

1. Create a branch: `research/[topic-slug]-[date]` (e.g., `research/call-center-ai-20260308`)
2. Commit the research brief and any ingested sources to this branch
3. The user reviews and merges

This keeps research sessions isolated and reversible.

#### Step 8: Collect Feedback (interactive mode only)

After delivering the brief, ask:
- "Which sources should I ingest?"
- "Any scoring adjustments? (e.g., should I weigh recency more for this topic?)"
- "What did I miss?"

Record responses in `feedback-log.md`. When you see 3+ entries with a similar pattern, promote that pattern to the **Learned Preferences** section below.

#### Step 9: Hand Off to Ingestion

When the user approves sources for ingestion, hand off to the source-ingestion workflow. For each approved source, provide:
- URL
- Already-extracted statistics with graph mappings
- Evidence tier classification

The ingestion workflow handles the rest (file writes, validation, confirmation).

---

### Crash Recovery and Graceful Failure

Handle failures explicitly. Do not silently skip problems.

| Failure | Response |
|---------|----------|
| URL paywalled or 403 | Try alternate URL, Google Scholar, or archived version. If still blocked, log as "inaccessible" and keep searching. |
| Search returns irrelevant results | Reformulate query aggressively. Try different strategy. Do not re-run the same query. |
| Source is ambiguous in scope | Classify conservatively (higher tier number, overlay not data_point). Flag for user review. |
| Can't determine publication date | Use the most conservative date estimate. Flag it. |
| Source contradicts existing data | Include it. Note the contradiction in the brief. Let the user decide. |
| Agent running out of ideas in autonomous mode | Re-read existing sources for cited references. Try searching for specific authors. Try adjacent topics. Try non-English sources with English search terms. Only stop if genuinely exhausted — document why. |

---

### Learned Preferences
<!-- This section gets updated as the user gives feedback. -->
<!-- When feedback-log.md shows 3+ entries with a similar pattern, promote it here. -->

- [No preferences recorded yet — they'll accumulate here]
