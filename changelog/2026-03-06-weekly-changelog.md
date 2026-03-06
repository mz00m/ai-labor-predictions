# jobsdata.ai Weekly Changelog — Founding Week
## Review Window: 2026-02-23 → 2026-03-06 (full founding period)
**Generated:** 2026-03-06
**Edition:** Founding Week (inaugural run — covers site creation through first full week)

---

## Metrics

```
COMMIT ACTIVITY
  Total commits:                   355
  Total files changed:             878
  Lines added:                     66,435
  Lines removed:                   12,874

DATA ADDITIONS
  Research sources added:          316
    Tier 1 (peer-reviewed):        172
    Tier 2 (think tank/intl org):  113
    Tier 3 (major press):          23
    Tier 4 (blog/opinion):         8
  Sources verified:                306 of 316 (97%)
  Data points (current):           142 across 17 graphs
  Overlay signals added:           303
  Prediction graphs populated:     17 of 17

CONSENSUS VALUES (current)
  ai-adoption-rate currentValue:   17.5% (Census BTOS biweekly)
  genai-work-adoption currentValue: 43%

SITE
  Pages built:                     6 (/, /predictions/[slug], /about, /signals, /history, /api/*)
  Components created:              37
  Scripts created:                 41
  Prediction data files:           17
```

---

## A. Research Sources Added (316 total)

### Overview

The entire evidence base was built from scratch during the founding period. 316 sources were ingested across 17 prediction graphs, with 97% verified against original publications.

### Tier Breakdown

| Tier | Count | Examples |
|------|-------|----------|
| T1 — Peer-reviewed | 172 | BLS (12), NBER (10+), Anthropic (6), OECD (7), CEPR, Lancet, Stanford GSB |
| T2 — Think tank / intl org | 113 | Indeed Hiring Lab (9), Gartner (7), Goldman Sachs (12), Brookings (6), McKinsey (10), WEF (5), Lightcast, Workday, Challenger |
| T3 — Major press | 23 | Fortune (6), CIO.com, Citadel Securities, Furman/BLS |
| T4 — Blog / opinion | 8 | CausalInf Substack, Creator Economy, Preston Cooper, Clara Shih |

### Week 1 (Feb 23–28): Initial 293 Sources

The initial data load populated all 17 prediction graphs with source-backed data. Key ingestion batches:
- 14 new research sources across 12 prediction files (e25bccc)
- 7 new sources with author tracking and research pipeline (e054cac)
- 12 think tank sources, 21 key studies, and 4 tracked researchers (7acfc5e)
- Goldman Sachs Feb 2026 research note on AI labor impact (ae72134)
- Cognizant New Work New World 2026 report across 6 predictions (31c99f6)
- NBER w34836 (Bloom et al.) data across displacement, adoption, productivity (ba6b4bf)
- Lightcast "Beyond the Buzz" report on AI wage premium (80a0c37)
- World Bank "Labor Demand in the Age of Generative AI" (d7ee607)

### Week 2 (Mar 1–6): 46 New Sources

Detailed in the per-source table below.

#### Tier 1 — Peer-Reviewed (25 new)

| Source | Publisher | Prediction Graphs |
|--------|-----------|-------------------|
| Althoff & Reichardt (2026) — Task-Specific Technical Change | CESifo | median-wage, entry-level, high-skill, white-collar |
| Massenkoff & McCrory — Labor market impacts of AI | Anthropic | overall, total-jobs, exposure, customer-service, tech, white-collar |
| AI Skills Improve Job Prospects (hiring experiment) | arXiv | overall, genai-adoption |
| Agent Development vs. Real-World Work (Wang et al.) | CMU/Stanford | exposure, tech, white-collar |
| Software developers need to know to succeed | arXiv | overall, genai-adoption, ai-adoption |
| Autor & Kausik — Resolving the Automation Paradox | NBER | median-wage |
| BLS JOLTS December 2025 | U.S. Bureau of Labor Statistics | overall, white-collar, healthcare-admin |
| BLS MLR — AI impacts in employment projections | U.S. Bureau of Labor Statistics | tech, customer-service, healthcare, white-collar, overall |
| BLS OOH — Computer Programmers 2023-2033 | Bureau of Labor Statistics | tech-sector |
| Census BTOS biweekly AI adoption data | US Census Bureau | ai-adoption-rate |
| Aldasoro et al. — AI productivity and jobs in Europe | CEPR VoxEU / BIS | median-wage, overall, high-skill |
| Cruces et al. — GenAI Narrows Education Productivity Gaps | NBER | entry-level |
| Davis — AI aiding and replacing workers | Federal Reserve Bank of Dallas | tech, overall, entry-level, high-skill, creative, median-wage |
| ECB — AI friend or foe for hiring in Europe | European Central Bank | overall, ai-adoption |
| Eisfeldt et al. — Generative AI and Firm Values | SSRN | workforce-exposure |
| Gambacorta et al. — AI and Productivity: CodeFuse | BIS Working Paper | tech-sector |
| Gommers et al. — MASAI trial mammography AI | The Lancet | healthcare-admin |
| Jones & Tonetti — Weak Links Tame Growth Explosion | Stanford GSB / NBER | overall, median-wage, exposure |
| Ju & Aral — Collaborating with AI Agents | arXiv | creative-industry |
| Brynjolfsson et al. — Minimum Wages and Rise of the Robots | NBER | overall |
| Otis et al. — Uneven Impact on Entrepreneurial Performance | HBS Working Paper | median-wage |
| Paradis et al. — AI impact on development speed | Google | tech-sector |
| Reimers & Waldfogel — AI and Creative Products | NBER | creative-industry |
| Yotzov et al. — Firm Data on AI | NBER | total-jobs-lost |
| Yeverechyahu et al. — LLM Impact on Open-source Innovation | arXiv | tech-sector |

#### Tier 2 — Think Tank / International Organization (14 new)

| Source | Publisher | Prediction Graphs |
|--------|-----------|-------------------|
| Manning & Aguirre — Measuring adaptive capacity | Brookings Institution | total-jobs, overall, exposure, white-collar, customer-service |
| Challenger Report Feb 2026 — AI-cited layoffs rising | Challenger, Gray & Christmas | overall, tech-sector |
| Flight — The 2026 Global Intelligence Crisis | Citadel Securities | tech-sector, overall |
| EIG — Looking for the Ladder (entry-level AI) | Economic Innovation Group | white-collar, entry-level |
| FRI — AI and White-Collar Work Expert Survey | Forecasting Research Institute | white-collar |
| Goldman Sachs — AI-nxiety Earnings Season | Goldman Sachs Research | overall |
| Ifo Institute — AI Job Cuts in Germany | ifo Institute | overall |
| Indeed — January 2026 US Labor Market Update | Indeed Hiring Lab | genai-adoption, tech, ai-adoption, exposure, overall |
| Indeed — US Tech Hiring Freeze Continues | Indeed Hiring Lab | tech-sector |
| Indeed — Tech Jobs Below Pre-Pandemic Levels | Indeed Hiring Lab | tech-sector |
| Lightcast — Fault Lines report | Lightcast | ai-adoption, white-collar, exposure |
| Workday — Beyond Productivity: Measuring Real Value | Workday / Hanover Research | genai-adoption, white-collar, overall |
| Workday — Elevating Human Potential: AI Skills | Workday / Hanover Research | genai-adoption, overall, white-collar |
| Google — Enterprise AI dev speed randomized trial | Google | tech-sector |

#### Tier 3 — Major Press (3 new)

- **CIO.com** — State of IT jobs: AI sparks market shift → ai-adoption, tech, white-collar
- **Citadel Securities (Shah)** — AI capex ~$650B/2026 → ai-adoption
- **Furman/BLS** — Productivity 2.2% above CBO forecast → median-wage

#### Tier 4 — Blog / Opinion (4 new)

- **CausalInf Substack (Cunningham)** — Research publishing transformed by AI → white-collar, creative
- **Preston Cooper** — Should you still major in CS? → tech, high-skill
- **Creator Economy (Peter Yang)** — AI-native company operations → tech, genai-adoption
- **Clara Shih (Salesforce AI)** — New grad hiring -50%, underemployment 42.5% → entry-level

---

## B. Data Points & Overlay Signals

### Data Points (142 total across 17 graphs)

The initial commit included ~171 data points. A rigorous data quality audit (ffb9be4) removed fabricated and misattributed entries, while new source-backed data points were added, landing at 142 verified data points.

Key data quality work:
- **8 MUST FIX items:** Removed contradictory Goldman dual entries (7% and 0%), fixed BLS tech-sector excerpt, moved derived values to overlays, downgraded mistiered sources, removed confusing derived entries
- **13 SHOULD FIX items:** Fixed sign inversions (BLS white-collar -1.2 → +1.2), updated excerpts for methodology clarity, corrected metricTypes, added missing context to excerpts
- **Source deduplication:** 319 → 296 references (Goldman 12→2, Hartley 6→1, Acemoglu 3→1)
- **Annualization:** Tech-sector data re-expressed as annual rates (BLS 27.5% → 13.8%/yr, Indeed time series)

### Overlay Signals (303 total)

The entire overlay system was built from scratch. Overlays represent directional signals from sources that provide qualitative or indirect evidence rather than a plottable numeric value.

Top graphs by overlay count:
- **overall-us-displacement:** 42 overlays
- **tech-sector-displacement:** 40 overlays
- **white-collar-professional:** 37 overlays
- **ai-adoption-rate:** 27 overlays
- **customer-service:** 17 overlays
- **creative-industry:** 17 overlays
- **median-wage-impact:** 17 overlays
- **healthcare-admin:** 15 overlays
- **high-skill-premium:** 15 overlays
- **total-jobs-lost:** 14 overlays
- **entry-level-impact:** 18 overlays
- **education-sector:** 12 overlays
- **workforce-exposure:** 9 overlays
- **geographic-divergence:** 8 overlays
- **genai-work-adoption:** 6 overlays
- **freelancer-rate-impact:** 6 overlays
- **earnings-call-mentions:** 3 overlays

Notable: 102 previously unreferenced sources were surfaced as overlay entries in a single commit (96876e6), ensuring every ingested source appears on at least one chart.

---

## C. Prediction Graph System

### Graphs Built (17 total)

All 17 prediction graphs were created from scratch during the founding period:

**Displacement (8 graphs)**
- Overall US Job Displacement by 2030
- Total US Jobs Lost to AI as % of Labor Force (renamed from "Total US Jobs Lost" to "Estimated Net US Job Loss")
- White-Collar Professional Displacement
- Tech Sector Displacement
- Creative Industry Displacement
- Education Sector Displacement
- Healthcare Admin Displacement
- Customer Service Automation

**Wages (5 graphs)**
- Median Wage Impact from AI
- Entry-Level Wage Impact
- Geographic Wage Divergence (AI Hub vs. Non-Hub)
- High-Skill AI Wage Premium
- Freelancer/Gig Worker Rate Impact

**Adoption & Exposure (4 graphs)**
- AI Adoption Rate Across US Companies (currentValue: 17.5%)
- Generative AI Adoption at Work (currentValue: 43%)
- US Workforce AI Exposure
- S&P 500 AI Workforce Mentions in Earnings Calls

### Structural Features Added

- **MetricType system** (15050dd): All 142 data points tagged with type (employment/postings/survey/projection/corporate) with distinct dot shapes and colors
- **Confidence bands:** Semi-transparent intervals rendered as stacked Area on charts
- **Observed vs projected split** (5c01aaf): Tech-sector chart shows solid observed line and dashed projected line with BLS SW dev growth trajectory
- **Weighted averages:** Tile averages weighted by evidence tier and recency (56e6d13), with sampleSize secondary weight for within-tier differentiation
- **Y-axis standardization:** 0-50% default with zero baseline line, configurable min/max per graph
- **Direction zones:** Displacement charts show red (more displacement) and green (growth/recovery) reference areas
- **Range midpoints:** Sources providing text-only ranges (e.g., "14-30%") plotted as × markers

---

## D. Site Pages & Features

### Pages Built

1. **`/` — Main Dashboard** (initial commit + 100+ refinement commits)
   - Hero section with data triad (productivity → projected → measured), oversized watermark numbers (130px) with hover-reveal
   - FunnelStrip evidence visualization — rebuilt 6 times, final version uses median of 18 productivity studies (20%) instead of single Noy & Zhang outlier (37%); split "Bottom line" into Projected vs Measured; coordinated indigo→blue→amber→salmon→red palette
   - 17 prediction tiles organized by category (Displacement, Wages, Adoption & Exposure)
   - Evidence tier filter (underline-indicator tabs replacing pill buttons)
   - Bloomberg-style news ticker with live AI + labor headlines (980d7f5)
   - Essential/Featured Reading strip with rotating curated articles
   - Research Evidence section with 22 productivity studies as interactive bar chart
   - ChatGPT usage by age bracket research tile
   - Methodology section (simplified to compact 2x2 grid)

2. **`/predictions/[slug]` — Prediction Detail Pages** (17 dynamic routes)
   - Full-size Recharts chart with data points, trend line, confidence bands
   - Overlay bar tooltips via direct mouse events
   - Source list with tier badges, publication dates, excerpts
   - Click-to-source: clicking chart dots scrolls to and highlights corresponding source

3. **`/about` — About Page** (845fad0 + refinements)
   - Project description, bio, contact links
   - Recent Sources auto-scrolling sidebar
   - Simplified methodology section

4. **`/signals` — AI Tool Adoption Signals Dashboard** (f6342c1, 2b9ac51, 2d7e64d + 20 refinements)
   - 10 industries with BLS employment data overlay (20 series)
   - 64 tracked packages (49 PyPI, 15 npm) with GitHub enrichment and HuggingFace model downloads
   - Click-to-expand industry cards with sparkline charts (replaced unreadable dual-axis charts)
   - Now/Next/Later timeline grouping based on tool growth and employment thresholds
   - "How AI Automation Works" interactive flow diagram (Tools → Tasks → Productivity → Jobs)
   - "What Happens When Workers Get More Productive?" — Reduce/Amplify/Expand 3-path framework
   - Collapsible PackageTable with industry-group aggregate headers
   - Fixed seasonal distortion in BLS data using 3-month rolling averages

5. **`/history` — "On Tap Intelligence"** (065db4b + 3 refinement PRs)
   - Seven-section editorial page synthesizing lessons from four industrial revolutions
   - Interactive GPT phase timeline with pulsing AI position indicator
   - Tabbed revolution comparison cards (steam, combustion, electricity, computers)
   - "From Scarce to On-Tap" comparison matrix (electricity ↔ AI)
   - Three-column near/medium/long-term forecast
   - Compressed timelines reflecting AI's 2-5x faster adoption vs prior GPTs (sourced from NBER, Microsoft, St. Louis Fed)

6. **API Routes** — `/api/ticker`, `/api/research/digest`

### Major Component Inventory (37 new components)

**Core dashboard:** PredictionSummaryCard, PredictionChart, FunnelStrip, ResearchEvidence, ProductivityPredictions, EvidenceSummaryCard, AIAdoptionChart, AgeUsageTile, NewsTicker, FeaturedReads, Methodology, SearchCombobox, RecentSources, AdoptionLadder

**Signals page:** SignalHero, IndustryGrid, IndustryCard, IndustryDetail, PackageTable, AutomationExplainer, ProductivityPaths, MethodologyNote

**History page:** HistoryPage, GPTTimeline, RevolutionCards, ComparisonMatrix, ForecastColumns, VulnerabilityTable

### Branding & Identity

- Domain switched from labor.mattzieger.com → jobsdata.org → **jobsdata.ai** (2fac4f6)
- Bar chart logo designed in Figma, added to favicon, apple icon, and navbar (25d0f5e)
- Accent color: logo coral (#F66B5C) with logo purple (#5C61F6) secondary
- Global source search bar searching all 316 sources by title, publisher, excerpt (db3fc9b)
- SEO: structured data, sitemap, robots.txt, OG images (600fb9f)
- Mobile hamburger menu (e71bfb3)

---

## E. Data Pipeline & Scripts (41 new files)

### Source Ingestion Pipeline
- `scripts/ingest-source.ts` + `scripts/apply-ingestion.ts` — Extract statistics from research, map to prediction graphs, write structured entries
- `.claude/commands/ingest.md` — Claude Code skill for structured source ingestion with per-stat approval
- `scripts/ingest-from-digest.ts` — Batch ingest multiple sources from weekly digest output

### Weekly Research Digest Pipeline
- `scripts/fetch-sources.ts` + `scripts/synthesize-digest.ts` + `scripts/generate-digest.ts` — Automated weekly research digest from OpenAlex, arXiv, Reddit, job postings
- `scripts/adapters/nber.ts` — NBER TSV metadata parser (replacing dead RSS)
- `scripts/adapters/open-alex.ts` — OpenAlex free academic API (replacing Brookings/EPI/Urban RSS)
- `.github/workflows/weekly-digest.yml` — GitHub Actions: draft PR workflow with notifications
- Social media scanning agents with LLM data point extraction (c004706)

### Signal Data Pipeline (10 Python scripts)
- `scripts/signals/fetch_all.py` — Orchestrator for all signal sources
- `scripts/signals/fetch_pypistats.py` — PyPI package download trends
- `scripts/signals/fetch_npm.py` — npm package download trends
- `scripts/signals/fetch_bls.py` — BLS CES employment data (20 series)
- `scripts/signals/fetch_github.py` — GitHub repo enrichment (forks, issues, commits)
- `scripts/signals/fetch_huggingface.py` — HuggingFace model downloads
- `scripts/signals/fetch_stackoverflow.py` — Stack Overflow trends
- `scripts/signals/calculate_metrics.py` — Compute derived metrics

### Data Quality Scripts
- `scripts/auto-verify-sources.js` — Automated source URL verification
- `scripts/sync-sources.js` + `scripts/sync-and-clean.js` — Source database synchronization
- `scripts/remove-unsupported-history.js` — Remove fabricated data points
- `scripts/extract-sources.js` — Extract and reconcile source references

---

## F. Configuration & Infrastructure

- **Next.js 14** app directory structure with TypeScript, Tailwind CSS
- **Vercel deployment:** Resolved static generation conflicts (ISR vs dynamic), added outputFileTracingIncludes for serverless bundling, excluded scripts/ from build
- **ES5 compatibility:** Fixed Map/Set iteration build errors
- **GitHub Actions:** Weekly digest workflow with draft PR creation
- **Dependencies:** Recharts, pypistats, GitHub API, HuggingFace Hub, npm registry, BLS API integrations

---

## Raw Commit List (355 commits)

### Mar 5–6 (34 commits)

| SHA | Date | Message |
|-----|------|---------|
| 2f45490 | 03-05 21:57 | Ingest 3 sources from W10 digest: agent benchmarks, AI hiring signal, dev AI adoption |
| ffe04b5 | 03-05 21:57 | Replace dead RSS adapters with NBER TSV + OpenAlex |
| f5e1065 | 03-05 20:50 | Ingest Autor (NBER): automation paradox — falling labor share raises wages |
| 071800c | 03-05 20:50 | Weekly digest W10: 48 papers from OpenAlex, arXiv, Reddit, job postings |
| b408842 | 03-05 18:39 | Ingest Shih (X): new grad tech hiring -50%, underemployment 42.5% |
| e7477a5 | 03-05 18:26 | Merge pull request #92 |
| 7460366 | 03-05 | Ingest 10 new sources from Imas AI productivity review |
| 21b6b45 | 03-05 16:46 | Ingest Anthropic labor market impacts |
| d13b9cf | 03-05 11:13 | Merge pull request #91 |
| 22acf72 | 03-05 | Add BLS productivity data as macro chart line |
| 4eaeb5a | 03-05 | Add Furman/BLS productivity overlay on median-wage |
| 215be5b | 03-05 08:46 | Ingest Jones & Tonetti (Stanford/NBER): weak links |
| 006843d | 03-05 08:14 | Ingest Challenger Feb 2026: AI-cited layoffs rising |
| 67256fa | 03-05 00:29 | Signals hero: use shared lastUpdated date |
| f33ae55 | 03-05 00:21 | Ingest Census BTOS biweekly AI adoption data |

### Mar 4 (32 commits)

| SHA | Date | Message |
|-----|------|---------|
| f45ebd5 | 03-04 23:54 | Viz review: fix weighting, source ranges, adoption ladder |
| 22ad676 | 03-04 23:36 | Design cleanup: About headline, palette, methodology links |
| 1695399 | 03-04 23:10 | Hero tagline: update wording |
| 1dbae8a | 03-04 23:07 | Hero triad: update productivity to 20% median of 18 studies |
| 5031467 | 03-04 23:03 | FunnelStrip: replace Noy & Zhang with median of 18 studies |
| 7c3feea | 03-04 22:55 | FunnelStrip: split bottom line into Projected vs Measured |
| 1aacf38 | 03-04 22:42 | FunnelStrip: two-column layout, coordinated color palette |
| fe45403 | 03-04 21:59 | FunnelStrip: stage markers, compressed layout |
| 988402d | 03-04 21:31 | Hero triad: reorder to productivity/projected/measured |
| 8520576 | 03-04 21:24 | UX design pass: hero watermark numbers, tier filter, spacing |
| e60b791 | 03-04 20:19 | Viz review: fix weighting, source ranges, adoption ladder |
| 322b225 | 03-04 19:21 | Ingest Dallas Fed (Davis 2026): 1% employment decline |
| ffb9be4 | 03-04 19:02 | Audit and fix data quality: 8 MUST FIX + 13 SHOULD FIX |
| 15050dd | 03-04 17:38 | Add metricType system, confidence bands, source dedup |
| a944344 | 03-04 14:17 | Annualize tech-sector data |
| f3d7f39 | 03-04 13:53 | Ingest Citadel Securities "Global Intelligence Crisis" |
| 228fbf0 | 03-04 13:29 | Remove colored background zones from displacement charts |
| e732896 | 03-04 13:09 | Add direction zones and labels to displacement charts |
| 5c01aaf | 03-04 12:30 | Split tech-sector chart into observed vs projected |
| 26bfd2a | 03-04 12:05 | Adjust tech-sector chart Y-axis |
| 2bcf801 | 03-04 11:59 | Ingest BLS JOLTS December 2025 |
| bf97e95 | 03-04 11:51 | Ingest Workday Davos + Preston Cooper CS majors |
| 6ae91e3 | 03-04 11:27 | Ingest Workday "Beyond Productivity" |
| cae714b | 03-04 11:19 | Ingest EIG "Looking for the Ladder" |
| 636c1b2 | 03-04 10:01 | Add #productivity anchor |
| e4e55f4 | 03-04 09:56 | Ingest Citadel Securities AI capex + Creator Economy |
| 58f65a3 | 03-04 09:30 | Fix overlay direction colors |
| f357a3d | 03-04 09:21 | Ingest ECB SAFE blog + Ifo Institute |
| 5c385b1 | 03-04 08:42 | Merge PR #90 |
| 9617bdb | 03-04 | Update AIR article summary |
| 32e300c | 03-04 | Add AIR: AI Resilience Report to must-read |
| 67caef1 | 03-04 | Replace Citadel featured read with "AI Is for the Rich" |

### Mar 3 (32 commits)

| SHA | Date | Message |
|-----|------|---------|
| 3f747f2 | 03-03 21:46 | Ingest BLS MLR article on AI employment projections |
| cbdfc4c | 03-03 | Ingest CIO.com: State of IT jobs |
| b856cd8 | 03-03 17:09 | Use shared getSourceCount() |
| 1cce893 | 03-03 17:06 | Deduplicate hero source count |
| 78b83cd | 03-03 16:44 | Show dynamic source count in search |
| 958a33b | 03-03 16:35 | Link search results to source URLs |
| db3fc9b | 03-03 16:22 | Add global source search bar |
| 8eaf9ab | 03-03 13:16 | Swap Amplify/Expand colors |
| 47efd3c | 03-03 12:04 | Refactor PackageTable: collapsible industry groups |
| cec6ced | 03-03 11:53 | Ingest Wang et al. agent benchmarks |
| 5c196ba | 03-03 11:27 | Add severe employment decline threshold to Now |
| 48e248e | 03-03 11:18 | Replace employment stat with Reduce/Amplify/Expand |
| 0b5b33c | 03-03 11:08 | Group industry tiles into Now/Next/Later |
| d46cf3f | 03-03 10:52 | Add "What Happens When Workers Get More Productive?" |
| 75a0d87 | 03-03 10:16 | Add interactive "How AI Automation Works" explainer |
| b87330f | 03-03 09:20 | Replace dual-axis chart with sparkline cards |
| ae874a6 | 03-03 | Ingest CausalInf Substack: research publishing |
| 81da7ea | 03-03 09:03 | Ingest Goldman Sachs AI-nxiety earnings report |
| 2da610a | 03-03 08:44 | Fetch download/employment data for all packages |
| 2d7e64d | 03-03 08:38 | Add 4 new industries and 26 tools |
| 4e4c861 | 03-03 | Color growth indicators green/red |
| 5d1e4e6 | 03-03 | Fix employment seasonal distortion, add BLS methodology |
| 4a2604e | 03-02 22:28 | Add GitHub enrichment, HuggingFace, playwright/puppeteer |
| d19549f | 03-02 20:49 | Use dual Y axes for industry detail charts |
| 9b6e352 | 03-02 20:42 | Fix BLS data, group tools by industry |
| 2b9ac51 | 03-02 19:56 | Signals v2: 6 industries, npm + BLS, click-to-expand |
| f6342c1 | 03-02 19:21 | Add PyPI Labor Signal Index page at /signals |

### Mar 1–2 (51 commits)

| SHA | Date | Message |
|-----|------|---------|
| e300af9 | 03-02 13:44 | Ingest Lightcast Fault Lines: 5 overlays |
| ae24669 | 03-02 13:19 | Fix Recently Added to sort by ingestion date |
| 47c6b72 | 03-02 12:12 | Ingest FRI white-collar expert survey |
| f9bb76a | 03-02 11:22 | Ingest NBER w34895, refine overlay bar visuals |
| 9b8b65e | 03-02 | Fix Vercel deployment: static generation conflicts |
| 7ba5361 | 03-02 | Weekly research digest 2026-W10 [automated] |
| 0292135 | 03-02 | Compress all timelines to 10x adoption speed |
| 180105c | 03-02 | Refine acceleration claims with rigorous sourcing |
| a96e996 | 03-02 | Compress timelines for AI adoption speed |
| 065db4b | 03-02 | Add /history page: "On Tap Intelligence" |
| b6a8379 | 03-01 22:26 | Simplify methodology section |
| 96876e6 | 03-01 20:35 | Add overlay entries for all 102 unreferenced sources |
| a9608bb | 03-01 19:43 | Ingest Dallas Fed (Davis) Feb 2026 |
| c2ea870 | 03-01 19:04 | Ingest Indeed Hiring Lab Jan 2026 |
| d8cb67c | 03-01 14:16 | Switch weekly digest to draft PR workflow |
| c004706 | 03-01 14:09 | Add social media scanning agents and LLM extraction |
| b651d24 | 03-01 | Ingest CEPR/BIS: AI productivity and jobs in Europe |
| 799b0b3 | 03-01 | Ingest Althoff & Reichardt (2026) |
| 0ae2744 | 03-01 | Add /ingest Claude Code skill |
| a698d42 | 03-01 | Add source ingestion script |
| 2b629b2 | 03-01 | Ingest Brookings adaptive capacity study |
| 850173b | 03-01 | Ingest Remote Labor Index paper |
| f54ec16 | 03-01 | Plot range midpoints for text-only ranges |
| 9951020 | 03-01 | Plot range midpoint as x markers |

### Feb 23–28 (206 commits — site foundation)

Key commits from the initial build period:

| SHA | Date | Message |
|-----|------|---------|
| 0fb4b1a | 02-22 | Initial commit: AI & Labor Market Predictions dashboard |
| 0f7eaf0 | 02-23 | Add click-to-source: clicking chart dots highlights source |
| 0dc6481 | 02-23 | Add research framing: banner, evidence card, annotations |
| 980d7f5 | 02-23 | Add Bloomberg-style news ticker |
| 262319c | 02-24 | Add evidence funnel strip visualization |
| 2670ffb | 02-24 | Add exposure category, directional overlays |
| 56e6d13 | 02-24 | Weight tile averages by evidence tier and recency |
| e8aa522 | 02-24 | Add overlays to 7 prediction tiles |
| 2e57e93 | 02-24 | Add linear trend line to detail pages |
| 3b369a5 | 02-24 | Add soft vertical overlay bars on charts |
| e25bccc | 02-25 | Add 14 new research sources across 12 files |
| e054cac | 02-25 | Research pipeline: 7 new sources, author tracking, weekly digest |
| 2c91774 | 02-25 | Add methodology & sources section |
| 9d48a2e | 02-25 | Add GitHub Actions workflow for weekly digest |
| 75036ba | 02-25 | Add Essential Reading section |
| 845fad0 | 02-26 | Add About page, move Methodology off dashboard |
| 600fb9f | 02-27 | Add SEO, structured data, AI discoverability |
| 25d0f5e | 02-27 | Add bar chart logo to favicon, apple icon, navbar |
| 2fac4f6 | 02-27 | Switch domain to jobsdata.ai |
| e71bfb3 | 02-27 | Add mobile hamburger menu |
| 7acfc5e | 02-27 | Add 12 think tank sources, 21 key studies, 4 tracked researchers |
| ba6b4bf | 02-27 | Add NBER w34836 (Bloom et al.) across displacement, adoption, productivity |
| 31c99f6 | 02-27 | Add Cognizant New Work New World 2026 across 6 predictions |
| a727dec | 02-28 | Replace 25 unverified sources with verified alternatives |
| 2153f59 | 02-28 | Add centralized source database, remove 24 synthetic sources |
| 8cc009b | 02-28 | Fix 57 placeholder source URLs across 14 prediction files |
| 7b273cb | 02-28 | Add ChatGPT usage by age bracket research tile |
| e103707 | 02-26 | Add research evidence section with 22 productivity studies |
| 17a359c | 02-26 | Add economist productivity predictions section |
| dff87e2 | 02-25 | Rebuild FunnelStrip with curated 2025-26 sources |

---

## LinkedIn Post Draft

See `changelog/2026-03-06-linkedin-post.txt`
