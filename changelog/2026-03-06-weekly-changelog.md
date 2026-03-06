# jobsdata.ai Weekly Changelog — Founding Week
## Review Window: 2026-03-01 → 2026-03-06
**Generated:** 2026-03-06
**Edition:** Founding Week (inaugural run)

---

## Metrics

```
COMMIT ACTIVITY
  Total commits this week:         149
  Total files changed:             476
  Lines added:                     47,464
  Lines removed:                   8,854

DATA ADDITIONS
  New research sources added:      46
    Tier 1 (peer-reviewed):        25
    Tier 2 (think tank/intl org):  14
    Tier 3 (major press):          3
    Tier 4 (blog/opinion):         4
  New data points added:           23
  New overlay signals added:       206
  Prediction graphs updated:       16 of 17

CONSENSUS SHIFTS
  ai-adoption-rate currentValue:   10% → 17.5% (Census BTOS biweekly data)
  genai-work-adoption currentValue: 40.7% → 43%

SITE CHANGES
  New pages added:                 3 (/signals, /history, search bar)
  New components created:          20
  Script/pipeline changes:         25 new scripts
```

---

## A. New Research Sources Added (46)

### Tier 1 — Peer-Reviewed / Government Data (25 sources)

| Source | Publisher | Prediction Graphs |
|--------|-----------|-------------------|
| Althoff & Reichardt (2026) — Task-Specific Technical Change | CESifo | median-wage, entry-level, high-skill, white-collar |
| Massenkoff & McCrory — Labor market impacts of AI | Anthropic | overall, total-jobs, exposure, customer-service, tech, white-collar |
| AI Skills Improve Job Prospects (hiring experiment) | arXiv | overall, genai-adoption |
| Agent Development vs. Real-World Work (Wang et al.) | CMU/Stanford | exposure, tech, white-collar |
| What do professional software developers need to know | arXiv | overall, genai-adoption, ai-adoption |
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
| Wang et al. — Agent Development vs Real-World Work | Carnegie Mellon / Stanford | exposure, tech, white-collar |
| Yotzov et al. — Firm Data on AI | NBER | total-jobs-lost |
| Yeverechyahu et al. — LLM Impact on Open-source Innovation | arXiv | tech-sector |

### Tier 2 — Think Tank / International Organization (14 sources)

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

### Tier 3 — Major Press (3 sources)

- **CIO.com** — State of IT jobs: AI sparks market shift → ai-adoption, tech, white-collar
- **Citadel Securities (Shah)** — AI capex ~$650B/2026 → ai-adoption
- **Furman/BLS** — Productivity 2.2% above CBO forecast → median-wage

### Tier 4 — Blog / Opinion (4 sources)

- **CausalInf Substack (Cunningham)** — Research publishing transformed by AI → white-collar, creative
- **Preston Cooper** — Should you still major in CS? → tech, high-skill
- **Creator Economy (Peter Yang)** — AI-native company operations → tech, genai-adoption
- **Clara Shih (Salesforce AI)** — New grad hiring -50%, underemployment 42.5% → entry-level

---

## B. New Data Points & Overlay Signals

### Data Points Added (23 new)

| Graph | New Points | Notable |
|-------|-----------|---------|
| tech-sector | +7 | BLS trajectory (0% to -9% by 2030), Indeed time series, annualized rates |
| ai-adoption-rate | +3 | Census BTOS: 17.3% (Nov 2025) → 17.5% (Feb 2026) |
| customer-service | +2 | BLS projections: CS rep employment -5.0% |
| healthcare-admin | +2 | BLS: medical transcriptionists -4.7%, Lancet MASAI trial |
| white-collar | +2 | BLS MLR: paralegals +1.2%, Eisfeldt 23% task exposure |
| workforce-exposure | +2 | Jones & Tonetti: 50-85% sector task automation |
| genai-work-adoption | +1 | Workday survey data |
| education-sector | +1 | Cruces et al.: AI closes 75% education productivity gap |
| creative-industry | +1 | Ju & Aral: human-AI teams 73% more productive |
| overall | +1 | NBER firm data: 0.7% employment reduction expected |

### Overlay Signals Added (206 new)

Top graphs by new overlays:
- **overall-us-displacement:** +36 overlays (Goldman neutral, NBER minimum wage, Brynjolfsson, Challenger layoffs, Dallas Fed, ECB)
- **white-collar-professional:** +30 overlays (FRI expert survey, EIG entry-level, Lightcast 70%+ exposure, CIO 40% plan cuts)
- **tech-sector:** +30 overlays (BLS programmer -9.6%, Indeed posting declines, Challenger +51% YoY, Citadel +11% SW postings)
- **ai-adoption-rate:** +20 overlays (Lightcast 50% YoY AI posting growth, CIO 80% workers save 1hr/day, AI literacy +70%)
- **total-jobs-lost:** +14 overlays
- **creative-industry:** +11 overlays (Amazon book titles tripled, CausalInf 10-20x output)
- **entry-level-impact:** +11 overlays (Shih -50% new grad hiring, EIG -23% entry-level)
- **median-wage-impact:** +10 overlays (Autor paradox, Furman/BLS productivity, Dallas Fed wage premium)
- **high-skill-premium:** +9 overlays
- **customer-service:** +8 overlays
- **genai-work-adoption:** +6 overlays
- **healthcare-admin:** +6 overlays
- **workforce-exposure:** +5 overlays
- **geographic-divergence:** +4 overlays
- **education-sector:** +4 overlays
- **freelancer-rate-impact:** +2 overlays

---

## C. Prediction Graph Structural Changes

- **ai-adoption-rate:** `currentValue` updated from 10% → 17.5% based on Census Bureau BTOS biweekly data
- **genai-work-adoption:** `currentValue` updated from 40.7% → 43%
- **MetricType system added:** All 142 data points across 17 prediction files tagged with metricType (employment/postings/survey/projection/corporate) with distinct dot shapes and colors on charts
- **Confidence bands:** Semi-transparent confidence intervals rendered as stacked Area on charts
- **Source deduplication:** 319 → 296 references (Goldman 12→2, Hartley 6→1, Acemoglu 3→1, del Rio-Chanona 4→1, Ramp 4→1)
- **Tech-sector chart split:** Observed data (solid line) vs projected data (dashed line) with BLS SW dev growth trajectory
- **Data quality audit:** 8 MUST FIX + 13 SHOULD FIX items resolved — removed contradictory Goldman dual entries, fixed BLS excerpts, corrected sign inversions, downgraded mistiered sources

---

## D. Site Pages & Features

### New Pages

1. **`/signals` — AI Tool Adoption Signals Dashboard** (f6342c1, 2b9ac51, 2d7e64d)
   - Entirely new page tracking PyPI/npm package download trends as leading indicators of AI labor disruption
   - 10 industries with BLS employment data overlay (20 series)
   - 64 tracked packages (49 PyPI, 15 npm) with GitHub enrichment and HuggingFace model downloads
   - Click-to-expand industry cards with sparkline charts
   - Now/Next/Later timeline grouping based on tool growth and employment thresholds
   - "How AI Automation Works" interactive flow diagram (Tools → Tasks → Productivity → Jobs)
   - "What Happens When Workers Get More Productive?" — Reduce/Amplify/Expand 3-path framework with research cards
   - Collapsible PackageTable with industry-group aggregate headers
   - Fixed seasonal distortion in BLS data using 3-month rolling averages

2. **`/history` — "On Tap Intelligence"** (065db4b, a96e996, 180105c, 0292135)
   - Seven-section editorial page synthesizing lessons from four industrial revolutions
   - Interactive GPT phase timeline with pulsing AI position indicator
   - Tabbed revolution comparison cards (steam, combustion, electricity, computers)
   - "From Scarce to On-Tap" comparison matrix (electricity ↔ AI)
   - Three-column near/medium/long-term forecast grounded in historical patterns
   - Occupational vulnerability table with five risk categories
   - Compressed timelines reflecting AI's 2-5x faster adoption vs prior GPTs

3. **Global Source Search** (db3fc9b, 958a33b, 78b83cd, 1cce893)
   - Search bar in Navbar searching all 316 sources by title, publisher, excerpt
   - Tier-colored results with prediction pills, keyboard accessible
   - Links to external source URLs with external-link icon

### Major Component Changes

- **Hero section:** Oversized watermark numbers (130px) with hover-reveal, data triad reordered to productivity→projected→measured, dynamic source count, updated tagline
- **FunnelStrip:** Rebuilt 6 times — final version uses median of 18 productivity studies (20%) instead of single Noy & Zhang outlier (37%); split "Bottom line" into Projected vs Measured; coordinated indigo→blue→amber→salmon→red color palette
- **Prediction tiles:** Source min-max range displayed, misleading YoY trend indicators removed, tier-colored borders, soft blue sparkline watermarks, metricType badges
- **Tier filter:** Replaced pill buttons with underline-indicator tabs
- **Overlay bars:** Halved widths, sorted by direction (red/grey/green grouping), tooltips via mouse events
- **Charts:** Y-axis standardized (0-50%), zero baseline line, direction zones for displacement, observed/projected line split
- **Featured reads:** Rotated to include AIR Report, Kinder/Brookings deindustrialization, @brexton "AI Is for the Rich"
- **About page:** Methodology simplified to compact 2x2 grid, Recent Sources auto-scrolling sidebar

---

## E. Data Pipeline & Scripts

### New Scripts (25 files)

- **Source ingestion pipeline** (`scripts/ingest-source.ts`, `scripts/apply-ingestion.ts`): Extract statistics from research, map to prediction graphs, write structured entries
- **Digest pipeline** (`scripts/fetch-sources.ts`, `scripts/synthesize-digest.ts`, `scripts/generate-digest.ts`): Automated weekly research digest generation
- **Batch ingest** (`scripts/ingest-from-digest.ts`): Ingest multiple sources from weekly digest output
- **NBER adapter** (`scripts/adapters/nber.ts`): TSV metadata parsing, replacing dead RSS feeds
- **OpenAlex adapter** (`scripts/adapters/open-alex.ts`): Free academic API, replacing Brookings/EPI/Urban RSS
- **Signal data pipeline:** 10 Python scripts for fetching PyPI, npm, BLS, GitHub, HuggingFace, and Stack Overflow data
- **Social media scanning** (`c004706`): Agents for scanning X/Reddit for AI labor data points with LLM extraction

### Pipeline Changes

- Weekly digest switched to draft PR workflow with GitHub Actions notifications
- Off-topic filtering tightened for research relevance
- Auto-update of "Updated ..." date in Hero when ingest runs
- `/ingest` Claude Code skill created for structured source ingestion

---

## F. Configuration & Infrastructure

- **Vercel deployment fixes:** Resolved static generation conflicts in API routes (ISR vs dynamic rendering), added `outputFileTracingIncludes` for serverless bundling
- **Next.js config:** Excluded `scripts/` from build to fix type errors
- **ES5 compatibility:** Fixed Map/Set iteration build errors
- **New dependencies:** PyPI stats, GitHub API, HuggingFace Hub, npm registry integrations

---

## Raw Commit List (149 commits)

| SHA | Date | Message |
|-----|------|---------|
| 2f45490 | 2026-03-05 21:57 | Ingest 3 sources from W10 digest: agent benchmarks, AI hiring signal, dev AI adoption |
| ffe04b5 | 2026-03-05 21:57 | Replace dead RSS adapters with NBER TSV + OpenAlex; fix ingest-from-digest format handling |
| f5e1065 | 2026-03-05 20:50 | Ingest Autor (NBER): automation paradox — falling labor share raises wages |
| 071800c | 2026-03-05 20:50 | Weekly digest W10: 48 papers from OpenAlex, arXiv, Reddit, job postings |
| b408842 | 2026-03-05 18:39 | Ingest Shih (X): new grad tech hiring -50%, underemployment 42.5% |
| e7477a5 | 2026-03-05 18:26 | Merge pull request #92 |
| 7460366 | 2026-03-05 23:19 | Ingest 10 new sources from Imas AI productivity review |
| 21b6b45 | 2026-03-05 16:46 | Ingest Anthropic labor market impacts: observed exposure, no unemployment rise |
| d13b9cf | 2026-03-05 11:13 | Merge pull request #91 |
| 22acf72 | 2026-03-05 16:09 | Add BLS productivity data as macro chart line in Research Evidence |
| 4eaeb5a | 2026-03-05 16:05 | Add Furman/BLS productivity data as overlay on median-wage-impact |
| 215be5b | 2026-03-05 08:46 | Ingest Jones & Tonetti (Stanford/NBER): weak links tame automation growth explosion |
| 006843d | 2026-03-05 08:14 | Ingest Challenger Feb 2026: AI-cited layoffs rising (5% to 8%), tech cuts +51% YoY |
| 67256fa | 2026-03-05 00:29 | Signals hero: use shared lastUpdated date |
| f33ae55 | 2026-03-05 00:21 | Ingest Census BTOS biweekly AI adoption data (17.3-17.5%) |
| f45ebd5 | 2026-03-04 23:54 | Viz review: fix weighting, source ranges, adoption ladder, sparkline clarity |
| 22ad676 | 2026-03-04 23:36 | Design cleanup: About headline, palette alignment, fix methodology links |
| 1695399 | 2026-03-04 23:10 | Hero tagline: update wording to reference near future vs present reality |
| 1dbae8a | 2026-03-04 23:07 | Hero triad: update productivity to 20% median of 18 studies |
| 5031467 | 2026-03-04 23:03 | FunnelStrip: replace Noy & Zhang with median of 18 studies |
| 7c3feea | 2026-03-04 22:55 | FunnelStrip: split bottom line into Projected vs Measured |
| 1aacf38 | 2026-03-04 22:42 | FunnelStrip: two-column flush layout, coordinated color palette |
| fe45403 | 2026-03-04 21:59 | FunnelStrip: stage markers, compressed layout; tiles: soft blue sparklines |
| 988402d | 2026-03-04 21:31 | Hero triad: reorder to productivity/projected/measured, full-width layout |
| 8520576 | 2026-03-04 21:24 | UX design pass: hero watermark numbers, minimal tier filter, tighter spacing |
| e60b791 | 2026-03-04 20:19 | Viz review: fix weighting, source ranges, adoption ladder |
| 322b225 | 2026-03-04 19:21 | Ingest Dallas Fed (Davis 2026): 1% employment decline in AI-exposed sectors |
| ffb9be4 | 2026-03-04 19:02 | Audit and fix data quality: 8 MUST FIX + 13 SHOULD FIX items |
| 15050dd | 2026-03-04 17:38 | Add metricType system, confidence bands, source dedup |
| a944344 | 2026-03-04 14:17 | Annualize tech-sector data: BLS 27.5% to 13.8%/yr, Indeed time series |
| f3d7f39 | 2026-03-04 13:53 | Ingest Citadel Securities "Global Intelligence Crisis" |
| 228fbf0 | 2026-03-04 13:29 | Remove colored background zones from displacement charts |
| e732896 | 2026-03-04 13:09 | Add direction zones and labels to displacement charts |
| 5c01aaf | 2026-03-04 12:30 | Split tech-sector chart into observed vs projected lines |
| 26bfd2a | 2026-03-04 12:05 | Adjust tech-sector chart Y-axis to [-20, 35] |
| 2bcf801 | 2026-03-04 11:59 | Ingest BLS JOLTS December 2025: job openings at 2017 lows |
| bf97e95 | 2026-03-04 11:51 | Ingest Workday Davos AI skills report + Preston Cooper CS majors |
| 6ae91e3 | 2026-03-04 11:27 | Ingest Workday "Beyond Productivity" AI rework survey |
| cae714b | 2026-03-04 11:19 | Ingest EIG "Looking for the Ladder" on entry-level AI displacement |
| 636c1b2 | 2026-03-04 10:01 | Add #productivity anchor for shareable section link |
| e4e55f4 | 2026-03-04 09:56 | Ingest Citadel Securities AI capex + Creator Economy AI-native ops |
| 58f65a3 | 2026-03-04 09:30 | Fix overlay direction colors on white-collar displacement chart |
| f357a3d | 2026-03-04 09:21 | Ingest ECB SAFE blog + Ifo Institute AI job survey |
| 5c385b1 | 2026-03-04 08:42 | Merge pull request #90 |
| 9617bdb | 2026-03-04 13:29 | Update AIR article summary with accurate description |
| 32e300c | 2026-03-04 13:27 | Add AIR: AI Resilience Report to must-read section |
| 3f747f2 | 2026-03-03 21:46 | Ingest BLS MLR article on AI impacts in employment projections |
| 9885029 | 2026-03-03 19:29 | Merge pull request #89 |
| 67caef1 | 2026-03-04 00:14 | Replace Citadel featured read with "AI Is for the Rich" thread |
| cbdfc4c | 2026-03-03 23:43 | Ingest CIO.com: State of IT jobs |
| b856cd8 | 2026-03-03 17:09 | Use shared getSourceCount() for hero |
| 1cce893 | 2026-03-03 17:06 | Deduplicate hero source count + update subheading to ~300 |
| 78b83cd | 2026-03-03 16:44 | Show dynamic source count in search placeholder |
| 958a33b | 2026-03-03 16:35 | Link search results to underlying source URLs |
| db3fc9b | 2026-03-03 16:22 | Add global source search bar + productivity paths jump links |
| 8eaf9ab | 2026-03-03 13:16 | Swap Amplify/Expand colors, minimal triangles |
| 47efd3c | 2026-03-03 12:04 | Refactor PackageTable: collapsible industry groups |
| cec6ced | 2026-03-03 11:53 | Ingest Wang et al. agent benchmarks paper |
| 5c196ba | 2026-03-03 11:27 | Add severe employment decline threshold to Now grouping |
| 48e248e | 2026-03-03 11:18 | Replace employment stat with Reduce/Amplify/Expand in flow diagram |
| 0b5b33c | 2026-03-03 11:08 | Group industry tiles into Now/Next/Later impact timeline |
| d46cf3f | 2026-03-03 10:52 | Add "What Happens When Workers Get More Productive?" section |
| 75a0d87 | 2026-03-03 10:16 | Add interactive "How AI Automation Works" explainer |
| b87330f | 2026-03-03 09:20 | Replace dual-axis chart with sparkline cards in signal tiles |
| a4704b7 | 2026-03-03 09:16 | Merge pull request #88 |
| ae874a6 | 2026-03-03 14:14 | Ingest CausalInf Substack: research publishing article |
| 81da7ea | 2026-03-03 09:03 | Ingest Goldman Sachs AI-nxiety earnings report |
| 2da610a | 2026-03-03 08:44 | Fetch download and employment data for all new packages/industries |
| 2d7e64d | 2026-03-03 08:38 | Add 4 new industries and 26 tools to signals page |
| 3dd95b6 | 2026-03-03 08:08 | Merge pull request #87 |
| 4e4c861 | 2026-03-03 13:05 | Color growth indicators green/red |
| c6ea193 | 2026-03-03 06:44 | Merge pull request #86 |
| 5d1e4e6 | 2026-03-03 11:42 | Fix employment percentage seasonal distortion, add BLS methodology |
| 4a2604e | 2026-03-02 22:28 | Add GitHub enrichment, HuggingFace models, playwright/puppeteer |
| d19549f | 2026-03-02 20:49 | Use dual Y axes for industry detail charts |
| 9b6e352 | 2026-03-02 20:42 | Fix BLS data, group tools by industry, add descriptions |
| 2b9ac51 | 2026-03-02 19:56 | Signals v2: 6 industries, npm + BLS data, click-to-expand |
| f6342c1 | 2026-03-02 19:21 | Add PyPI Labor Signal Index page at /signals |
| 4b731eb | 2026-03-02 17:39 | Reorder featured reads |
| aa083be | 2026-03-02 17:37 | Swap Citrini for Kinder/Brookings deindustrialization piece |
| e300af9 | 2026-03-02 13:44 | Ingest Lightcast Fault Lines report: 5 overlays |
| ae24669 | 2026-03-02 13:19 | Fix Recently Added to sort by ingestion date |
| 47c6b72 | 2026-03-02 12:12 | Ingest FRI white-collar expert survey |
| 750019a | 2026-03-02 11:35 | Replace Krugman featured read with history page link |
| f9bb76a | 2026-03-02 11:22 | Ingest NBER w34895 + refine overlay bar visuals |
| 729090d | 2026-03-02 06:35 | Merge pull request #85 |
| 9b8b65e | 2026-03-02 11:32 | Fix Vercel deployment: static generation conflicts |
| 63185ac | 2026-03-02 06:18 | Merge pull request #83 |
| 7ba5361 | 2026-03-02 08:43 | chore: weekly research digest 2026-W10 [automated] |
| 98c0146 | 2026-03-01 23:55 | Merge pull request #82 |
| 0292135 | 2026-03-02 04:54 | Compress all timelines to 10x adoption speed |
| 4378540 | 2026-03-01 23:51 | Merge pull request #81 |
| 180105c | 2026-03-02 04:46 | Refine acceleration claims with rigorous sourcing |
| ba0be65 | 2026-03-01 23:45 | Merge pull request #80 |
| a96e996 | 2026-03-02 04:44 | Compress timelines for AI's unprecedented adoption speed |
| b86c0b1 | 2026-03-01 23:32 | Merge pull request #79 |
| 065db4b | 2026-03-02 04:31 | Add /history page: "On Tap Intelligence" |
| b6a8379 | 2026-03-01 22:26 | Simplify methodology section for readability |
| 55563d7 | 2026-03-01 22:18 | Expand section header descriptions |
| 3a1964a | 2026-03-01 22:05 | Fix section break margins |
| e046e11 | 2026-03-01 22:02 | Add Predictions Over Time section header |
| f5860bd | 2026-03-01 22:01 | Add prominent section header with color bar |
| 582e86f | 2026-03-01 21:39 | Rewrite evidence filter intro |
| f3e8c61 | 2026-03-01 21:23 | Add custom overlay tooltip via mouse events |
| 32b8e1e | 2026-03-01 21:13 | Fix overlay bars NaN on duplicate-date data |
| a29ed1a | 2026-03-01 20:58 | Increase chart margins, tooltip escapes viewBox |
| e2f7f4e | 2026-03-01 20:50 | Add X-axis padding for edge overlay tooltips |
| 26fa047 | 2026-03-01 20:44 | Add yAxisMin; entry-level & freelancer Y-axis to -50% |
| 96876e6 | 2026-03-01 20:35 | Add overlay entries for all 102 previously unreferenced sources |
| 28df876 | 2026-03-01 20:19 | Add solid grey zero baseline line |
| b8c3be8 | 2026-03-01 20:16 | Add yAxisMax, exposure 0-100%, Y-axes start -5% |
| fddd1dc | 2026-03-01 20:10 | Standardize Y-axis to 0-50% |
| 5a0065d | 2026-03-01 20:07 | Add overlay bar tooltips, remove range midpoint markers |
| a9608bb | 2026-03-01 19:43 | Ingest Dallas Fed (Davis) Feb 2026 |
| c2ea870 | 2026-03-01 19:04 | Ingest Indeed Hiring Lab Jan 2026 |
| 551c55b | 2026-03-01 18:16 | Auto-scrolling Recent Sources feed |
| 0f2d329 | 2026-03-01 18:07 | Simplify Recent Sources into compact sidebar |
| 6d0c798 | 2026-03-01 18:01 | Add Recent Sources sidebar to About page |
| 44296c7 | 2026-03-01 14:49 | Merge pull request #76 |
| 49d80ce | 2026-03-01 14:48 | Add readable PR summary for weekly digests |
| 85f9413 | 2026-03-01 14:47 | Tighten off-topic filtering and relevance thresholds |
| ea43430 | 2026-03-01 14:40 | Remove test digest files |
| d149b52 | 2026-03-01 14:29 | Merge pull request #74 |
| 2e5f564 | 2026-03-01 19:20 | chore: weekly research digest 2026-W09 [automated] |
| bd58e7e | 2026-03-01 14:20 | Fix digest workflow: git identity, detect new files |
| d8cb67c | 2026-03-01 14:16 | Switch weekly digest to draft PR workflow |
| c004706 | 2026-03-01 14:09 | Add social media scanning agents and LLM extraction |
| b651d24 | 2026-03-01 18:59 | Ingest CEPR/BIS: AI productivity and jobs in Europe |
| 277cac3 | 2026-03-01 12:56 | Merge pull request #73 |
| 799b0b3 | 2026-03-01 17:55 | Ingest Althoff & Reichardt (2026) — Task-Specific Technical Change |
| 02c33a2 | 2026-03-01 12:39 | Merge pull request #72 |
| af28778 | 2026-03-01 17:37 | Auto-update "Updated ..." date in Hero on ingest |
| b732acb | 2026-03-01 12:28 | Merge pull request #71 |
| 47f3b85 | 2026-03-01 17:25 | Fix Map/Set iteration build errors for ES5 |
| 5ee3cde | 2026-03-01 12:22 | Merge pull request #70 |
| e8c8768 | 2026-03-01 17:20 | Update /ingest skill: per-stat approval, verified sources |
| 2b629b2 | 2026-03-01 17:17 | Ingest Brookings adaptive capacity study (Manning & Aguirre) |
| 5956176 | 2026-03-01 11:46 | Merge pull request #69 |
| d9fa15b | 2026-03-01 16:45 | Exclude scripts/ from Next.js build |
| b71ebea | 2026-03-01 11:37 | Merge pull request #68 |
| 850173b | 2026-03-01 16:28 | Ingest Remote Labor Index paper (CAIS/Scale AI) |
| ebd4c66 | 2026-03-01 11:18 | Merge pull request #67 |
| 0ae2744 | 2026-03-01 16:16 | Add /ingest Claude Code skill |
| a698d42 | 2026-03-01 16:11 | Add source ingestion script |
| 689bba4 | 2026-03-01 10:31 | Merge pull request #66 |
| f54ec16 | 2026-03-01 15:27 | Plot range midpoints for 5 text-only range sources |
| 82e3a34 | 2026-03-01 10:19 | Merge pull request #65 |
| 9951020 | 2026-03-01 13:42 | Plot range midpoint as X markers on prediction charts |
| da3daa5 | 2026-03-01 00:00 | Merge pull request #64 |

---

## LinkedIn Post Draft

See `changelog/2026-03-06-linkedin-post.txt`
