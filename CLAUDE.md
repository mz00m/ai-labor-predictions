# AI Labor Predictions — Project Context

## What This Is

A public-facing Next.js dashboard tracking AI's impact on the labor market. URL: jobsdata.ai. It synthesizes research, government data, and expert analysis into 17 interactive prediction graphs across 5 categories. Practitioner-first tone — no hype, no doom, just evidence.

## Tech Stack

- **Framework:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, dark theme primary
- **Charts:** Recharts (all visualizations)
- **Validation:** Zod
- **AI Integration:** Anthropic SDK (digest synthesis)

## Site Sections

| Route | Description |
|-------|-------------|
| `/` | Hero stats + prediction grid (displacement, wages, adoption) |
| `/predictions/[slug]` | Individual prediction detail pages (17 total) |
| `/signals` | Leading indicators: firm response, productivity paths |
| `/history` | Historical technology comparison (GPT compression, diffusion) |
| `/j-curve` | J-Curve explainer with interactive visuals |
| `/about` | Methodology, FAQ |

## Prediction Graph Taxonomy (17 graphs)

### Displacement (8)
| Slug | Title | Unit |
|------|-------|------|
| `overall-us-displacement` | Overall US Job Displacement by 2030 | % of US jobs |
| `total-us-jobs-lost` | Total US Jobs Lost to AI as % of Labor Force | % of US labor force |
| `white-collar-professional-displacement` | White-Collar Professional Displacement by 2030 | % of roles displaced |
| `tech-sector-displacement` | Tech Sector Job Displacement by 2030 | % of jobs displaced |
| `creative-industry-displacement` | Creative Industry Displacement by 2030 | % of roles displaced |
| `education-sector-displacement` | Education Sector Displacement by 2030 | % of roles displaced |
| `healthcare-admin-displacement` | Healthcare Administrative Displacement by 2030 | % of roles displaced |
| `customer-service-automation` | Customer Service Automation by 2028 | % of interactions automated |

### Wages (5)
| Slug | Title | Unit |
|------|-------|------|
| `median-wage-impact` | Median Wage Impact from AI by 2030 | % change in real median wage |
| `entry-level-wage-impact` | Entry-Level Wage Impact from AI by 2030 | % wage change |
| `high-skill-wage-premium` | High-Skill AI Wage Premium by 2030 | % wage premium over median |
| `geographic-wage-divergence` | AI Hub vs. Non-Hub Wage Divergence by 2030 | % wage premium |
| `freelancer-rate-impact` | Freelancer/Gig Worker Rate Impact by 2028 | % rate change |

### Adoption, Exposure & Signals (4)
| Slug | Title | Unit |
|------|-------|------|
| `ai-adoption-rate` | AI Adoption Rate Across US Companies | % of firms (Census BTOS) |
| `genai-work-adoption` | Generative AI Adoption | % of adults at work |
| `workforce-ai-exposure` | US Workforce AI Exposure | % of jobs exposed |
| `earnings-call-ai-mentions` | S&P 500 AI Workforce Mentions in Earnings Calls | % of S&P 500 |

## Evidence Tier System

| Tier | Label | Examples |
|------|-------|----------|
| 1 | Verified Data & Research | Peer-reviewed journals (AER, QJE, Science, Nature), NBER working papers, government stats (BLS, Census, OECD), SEC filings, RCTs |
| 2 | Institutional Analysis | Think tanks (Brookings, McKinsey, RAND), intl orgs (IMF, ILO), industry research (Gartner, Forrester) |
| 3 | Journalism & Commentary | NYT, WSJ, FT, Reuters, Bloomberg, trade publications |
| 4 | Informal & Social | Twitter/X, Reddit, blogs, Substack, podcasts |

## Data File Conventions

### Prediction JSON schema (`src/data/predictions/{category}/{slug}.json`)
- `history[]` entries: `date` (YYYY-MM-DD), `value` (number), `confidenceLow?`, `confidenceHigh?`, `sourceIds[]`, `evidenceTier` (1-4), `metricType?`, `sampleSize?`
- `overlays[]` entries: `date`, `direction` (up/down/neutral), `sourceIds[]`, `evidenceTier`, `label` (≤80 chars, format: "Publisher: finding")
- `sources[]` entries: `id`, `title`, `url`, `publisher`, `evidenceTier`, `datePublished`, `excerpt`
- `aggregationMethod`: `"weighted"` (default, tier×recency×sampleSize weighting) or `"latest"` (use most recent data point)

### Source IDs
Format: `{publisher-slug}-{topic-keywords}-{year}` (e.g., `brynjolfsson-2024`, `bls-2026-q1`, `gartner-cs-agents-replaced-2025`)

### Confirmed sources registry (`src/data/confirmed-sources.json`)
- Every ingested source must appear here with `usedIn[]` array listing all graph slugs
- `verified: true`, `synthetic: false` for real sources
- Update `totalSources` and `verifiedCount` counts on every ingestion

### last-updated.json
Must be updated with today's date on every ingestion. Hero reads this to display "Updated [date]".

## Data Rules

- **Negative values** for job losses, wage declines, rate drops (e.g., -10 for "10% decline")
- **Ranges → midpoints**: "20-30%" → value: 25, confidenceLow: 20, confidenceHigh: 30
- **Exact quotes only**: every data point must trace to verbatim source text
- **data_point vs overlay**: if stat's unit matches graph's unit → data_point; otherwise → overlay. When unsure, default to overlay
- **Arrays sorted by date** ascending
- **One source entry per file** even if multiple stats from same source

## Hero Stats (src/app/page.tsx)

Three hardcoded stats that must stay in sync with prediction data:
1. **~21% Productivity boost** — "Median of 18 studies"
2. **~3% Projected job loss** — "Weighted avg of 14 estimates" (from `overall-us-displacement`, all tiers weighted)
3. **~0% Measured job loss** — "Yale, Goldman, Dallas Fed" (observed data only)

These are manually set — after ingesting data that affects displacement graphs, recompute the weighted average and update if drift > 1pp.

## Weighted Average Computation

Defined in `src/lib/prediction-stats.ts`:
- Tier weights: T1=4×, T2=2×, T3=1×, T4=0.5×
- Recency weights: linear 1.0× (oldest) → 1.5× (newest)
- Sample size boost: log-scaled 1.0× (n≤100) → 2.0× (n≥100K)
- For `aggregationMethod: "latest"`: uses most recent data point value directly

## Key File Paths

| Path | Purpose |
|------|---------|
| `src/data/predictions/` | All 17 prediction JSON files |
| `src/data/confirmed-sources.json` | Master source registry (300+ sources) |
| `src/data/last-updated.json` | Site-wide "last updated" date |
| `src/app/page.tsx` | Hero section with hardcoded stats |
| `src/lib/types.ts` | TypeScript interfaces (Prediction, Source, etc.) |
| `src/lib/prediction-stats.ts` | Weighted average computation |
| `src/lib/data-loader.ts` | Loads all 17 predictions |
| `scripts/` | Digest pipeline, ingestion, signal fetching |
| `.claude/commands/` | Claude skills (ingest, weekly-changelog) |
| `changelog/` | Weekly changelogs and LinkedIn posts |

## Existing Claude Skills

- `/ingest [url or text]` — Full source ingestion workflow (extract → map → approve → apply)
- `/weekly-changelog` — Generate weekly changelog + LinkedIn post from git history

## Style Preferences

- Dark theme, professional/clean aesthetic
- No emojis in data or UI content
- Practitioner-first tone: concise, evidence-based, no speculation
- All charts use Recharts with consistent color palette
