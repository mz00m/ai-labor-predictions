# jobsdata.ai Weekly Changelog
**Review window:** 2026-03-29 to 2026-04-05
**Generated:** 2026-04-05

---

## Metrics

```
COMMIT ACTIVITY
  Total commits this week:         100
  Non-merge commits:               75
  
DATA ADDITIONS
  New research sources added:      9
    Tier 1 (peer-reviewed):        4
    Tier 2 (think tank/intl org):  3
    Tier 3 (major press):          2
    Tier 4 (blog/opinion):         0
  New data points added:           1
  New overlay signals added:       42+
  Prediction graphs updated:       12+

SITE CHANGES
  New pages or features:           5
  Script/pipeline changes:         3
```

---

## A. New Research Sources Added

### 1. Kim, Kim & Koning (2026) -- "Mapping AI into Production"
- **Publisher:** INSEAD / Harvard Business School
- **Tier:** 1 (peer-reviewed RCT)
- **Published:** 2026
- **Graphs:** overall-us-displacement
- **Key finding:** Randomized field experiment with 515 startups. Firms that received help mapping AI to their specific tasks saw 1.9x revenue growth, discovered 44% more AI use cases, and were 18% more likely to acquire customers -- with ~40% less funding needed. This is the foundational research behind the new assessment tool.

### 2. MIT/CCI Work Activities Ontology (Cai et al. 2026)
- **Publisher:** MIT Center for Collective Intelligence (arXiv)
- **Tier:** 1 (peer-reviewed)
- **Published:** 2026
- **Key finding:** Deep ontology of 18,000+ work activities mapped to AI capabilities, providing granular task-level automation estimates.

### 3. OECD AI SME Adoption G7 Discussion Paper (Dec 2025)
- **Publisher:** OECD
- **Tier:** 2 (international organization)
- **Graphs:** ai-adoption-rate + 3 others
- **Key finding:** 5 overlays across 4 graphs documenting AI adoption patterns among small and medium enterprises across G7 nations.

### 4. MIT FutureTech "Rising Tides" (Mertens, Thompson et al.)
- **Publisher:** MIT FutureTech
- **Tier:** 1 (peer-reviewed)
- **Graphs:** 6 prediction graphs
- **Key finding:** Study of 17,205 expert evaluations of LLM performance on 3,000+ O*NET tasks. Added 8 overlays across 6 graphs.

### 5. NYT -- "Economists Once Dismissed the A.I. Job Threat, but Not Anymore" (Casselman)
- **Publisher:** New York Times
- **Tier:** 3 (major press)
- **Published:** 2026-04-03
- **Graphs:** 5 prediction graphs
- **Key finding:** Major mainstream shift: leading economists who previously dismissed AI displacement risk are now revising their positions upward. Added to Featured Reads.

### 6. Stanford DEL Enterprise AI Playbook (Pereira, Graylin, Brynjolfsson 2026)
- **Publisher:** Stanford Digital Economy Lab
- **Tier:** 2 (institutional)
- **Graphs:** 4 prediction graphs
- **Key finding:** "The Enterprise AI Playbook: Lessons from 51 Successful Deployments" -- 5 overlays covering deployment models (copilot, escalation, full automation, agentic). Directly integrated into assessment pipeline.

### 7. FRI -- "Forecasting the Economic Effects of AI" (Karger, Kuusela et al.)
- **Publisher:** Forecasting Research Institute / Federal Reserve
- **Tier:** 1 (peer-reviewed)
- **Graphs:** 10 prediction graphs
- **Key finding:** 1 data point + 9 overlays. Expert forecasting survey on AI economic effects, the most broadly distributed single source this week.

### 8. Brookings Career Pathways Report
- **Publisher:** Brookings Metro / Opportunity@Work
- **Tier:** 2 (think tank)
- **Published:** 2026-04-02
- **Graphs:** workforce-ai-exposure + others
- **Key finding:** "How AI may reshape career pathways to better jobs" -- 6 overlays. Added to Featured Reads.

### 9. Hosseini/Lichtinger (Apr 2026) Updated Occupational Entry Barriers Paper
- **Publisher:** Academic (updated revision)
- **Tier:** 1 (peer-reviewed)
- **Key finding:** Updated quantitative findings on how AI affects occupational entry barriers.

### 10. BLS/FRED March 2026 Data (W14 Digest)
- **Publisher:** Bureau of Labor Statistics / Federal Reserve (FRED)
- **Tier:** 1 (government data)
- **Key finding:** +571K nonfarm payrolls, professional services -45.3K, information sector flat at 2,772K, unemployment 4.3%, JOLTS 6,882K. 8 overlays across 4 graphs. Also includes Korinek & Stiglitz "Steering Technological Progress" overlay.

---

## B. New Data Points & Overlay Signals

Major data additions this week:
- **FRI paper:** 1 data point + 9 overlays across 10 graphs (most broadly distributed single source)
- **MIT FutureTech:** 8 overlays across 6 graphs
- **BLS/FRED W14 digest:** 8 overlays across 4 graphs
- **Brookings:** 6 overlays
- **OECD:** 5 overlays across 4 graphs
- **Stanford DEL:** 5 overlays across 4 graphs
- **NYT Casselman:** 5 overlays across 5 graphs
- **Kim, Kim & Koning:** 3 overlays
- **Hosseini/Lichtinger:** Updated entries

**Total:** 1 new data point, 42+ new overlay signals across 12+ prediction graphs.

---

## C. Prediction Graph Structural Changes

No structural changes to graph metadata this week. All updates were data additions (history/overlay entries).

---

## D. Site Pages & Features

### AI Action Plan Assessment Tool (Major new feature -- from Phase 1 MVP to Sprint 2)

This was the dominant development effort of the week. The assessment went from initial concept to a near-complete product:

**Phase 1 (Apr 2):** Initial MVP with Stripe-gated paid assessment, dark theme, corporate/organizational framing.

**Phase 2 (Apr 2):** Complete reframe from corporate assessment to individual-focused "AI Action Plan." Shifted tone from organizational to empowering individual workers and small teams.

**Phase 3 (Apr 2):** Added O*NET Generalized Work Activities dataset (30+ tasks mapped to AI potential), Puppeteer website scraping, NextAuth adapter.

**Knowledge Base Build (Apr 3-4):**
- 45 office automation tools across 5 categories, expanded to 87+ tools across 11 categories (data/analytics, HR, compliance, sales, IT, inventory added)
- 62 human capabilities across 13 job functions with appreciation scores and automation resistance ratings
- Research context injection: evidence citations, industry-specific research, Stanford deployment models
- Tool prioritization framework integrated into Claude prompts

**Report Quality (Apr 3-4):**
- Redesigned report as structured business document with TOC, numbered sections, anchor links
- Added real products with URLs, pricing, step-by-step getting-started guides, ROI math
- Loading progress indicator for multi-step analysis
- Liability disclaimer
- PDF export with page breaks, cover page, data privacy section

**Sprint 1 fixes (Apr 5):**
- Fixed chatbot markdown rendering
- PDF page break fixes (text overlap)
- Schema resilience for AI output variations
- API timeouts bumped to 300s
- URL auto-prepend https:// on mobile

**Sprint 2 (Apr 5):**
- "At a Glance" one-page summary after cover page
- AI readiness score explanation
- "Skills That Grow With AI" section with 4-6 human capabilities per report
- Full 5-dimensional risk sub-sections in PDF (pitfalls, resistance, data readiness)
- Pre-filter tools KB using Step 2 task signals (~57% context reduction)
- "More detail = better report" messaging
- **Made reports free** (removed Stripe paywall for early feedback period)

**Landing page:**
- INSEAD study marketing copy integrated (1.9x revenue, 44% more AI uses, 18% customer acquisition, ~40% less funding)
- Light theme across all assessment pages

### /future Scenario Page
- New "From Here to There" explainer page presenting a mechanistic positive scenario for the AI transition

### Featured Reads Updates
- Added NYT Casselman piece
- Added Schubert/Update Brief AI growth debate
- Added Brookings career pathways report

### Site-wide
- Removed 340+ em dashes across 80+ source files
- Task visualizer page renamed to "How will AI impact your job?"
- Improved worker guidance for physical/entry-level jobs

---

## E. Data Pipeline & Scripts

- **NBER adapter fix:** Switched from dead TSV catalog (404) to RSS feed for W14 digest pipeline
- **Assessment test harness:** Added `test-assessments` script with Matt's GitLab Foundation default test profile and `--matt` shortcut
- **Assessment pipeline architecture:** 4-step Claude analysis (profile -> tasks -> tools -> risks) with Zod schema validation, PII stripping, retry logic with exponential backoff

---

## F. Configuration & Infrastructure

- Added jspdf, stripe, next-auth dependencies
- ASSESSMENT_DEV_MODE env var to bypass Stripe for testing
- Vercel maxDuration set to 300s for assessment API routes
- Fixed TypeScript Set iteration errors for Vercel compatibility

---

## LinkedIn Post

See `changelog/2026-04-05-linkedin-post.txt`
