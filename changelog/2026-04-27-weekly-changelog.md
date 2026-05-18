# jobsdata.ai Weekly Changelog
**Review window:** 2026-04-20 → 2026-04-27
**Run timestamp:** 2026-04-27
**Site milestone:** 30,000 cumulative views reached

---

## Metrics

```
COMMIT ACTIVITY
  Total commits this week:         45
  Total files changed:             143
  Lines added:                     6,001
  Lines removed:                   1,385

DATA ADDITIONS
  New research sources added:      9 (registry 527 → 536; verified 517 → 526)
    Tier 1 (peer-reviewed/RCT):    3  (Tucker/Census-QWI, Barth/NBER, Liu et al./arXiv)
    Tier 2 (think tank/intl org):  4  (ESP/Chao, Metaculus Labor Hub, Carlyle Compass, Centre for British Progress)
    Tier 3 (major press/trade):    1  (Levanon/Burning Glass)
    Tier 4 (blog/opinion):         1  (Yglesias/Slow Boring)
  New history data points:         ~18 (Metaculus 14, Tucker 2, plus a 2030/2035 wage points)
  New overlay signals:             ~17 (across 12 prediction graphs)
  Prediction graphs updated:       12 of 18

SITE CHANGES
  Major UI redesign:               SignalStrip pixel timeline (replaces overlay bars)
  New pages or features:           4 (private /kb page, signals deep links, observed/projected split, KB cookie auth)
  Script/pipeline changes:         5 (wiki compiler, KB compile, signals refresh, SDK modernization, GitHub-token autoload)
```

---

## A. New Research Sources Added (9)

### 1. Tucker — "You're (not) hired" (Census Bureau working paper, Apr 2026) [Tier 1]
- **ID:** `tucker-qwi-early-career-hires-2026`
- **Why it matters:** Replicates and extends the Brynjolfsson-Chandar-Chen "Canaries" finding using Census QWI near-universe administrative data. Shows a **12.4% regression-adjusted decline in early-career employment** in most-AI-exposed industries, driven by a **9% immediate drop in hires at ChatGPT's release**. **Information sector: −30% early-career employment.** Includes a monetary-policy robustness check that rules out interest rates as the primary driver.
- **Maps to:** white-collar-professional-displacement (data point), tech-sector-displacement (data point), overall-us-displacement (overlay), entry-level-wage-impact (overlay), ai-adoption-rate (overlay), workforce-ai-exposure (overlay)
- **Commit:** `3d9af0ee` (#597)

### 2. Metaculus Labor Automation Forecasting Hub [Tier 2]
- **ID:** `metaculus-labor-hub-2026`
- **Why it matters:** New forecasting hub launched 2026-04-20 by Metaculus with Renaissance Philanthropy and the Schultz Family Foundation. **93 forecasting questions** on AI's labor market impact, with both 2030 and 2035 horizons. Headline forecasts: **1.9% overall US displacement by 2030 / 3.4% by 2035**, **17.2% white-collar displacement by 2035** in most-vulnerable AI-exposed occupations, **22.3% software developer decline by 2035**, **52.5% / 70.9% GenAI work adoption by 2030 / 2035**.
- **Maps to:** 9 graphs (overall, white-collar, tech, financial, creative, education, customer-service, median-wage, genai-adoption, entry-level)
- **Commits:** `c65d9c58`, `1cdad4e1`, `85a670a8`

### 3. Liu, Christian et al. — AI deskilling RCT, N=1,222 (arXiv:2604.04721, Apr 2026) [Tier 1]
- **ID:** `liu-christian-ai-persistence-2026`
- **Authors:** CMU / Oxford / MIT / UCLA team
- **Why it matters:** First large-scale **causal** evidence of AI-induced **performance decline and persistence loss** after just 10–15 minutes of AI use. Replicated across **3 separate experiments**. KB/reading-list only — no graph mapping yet, but a bedrock methodological reference.
- **Commit:** `3c3955fa` (#603)

### 4. Levanon (Burning Glass Institute) — "A Technology-Driven Productivity Regime Shift" (LinkedIn, Apr 21 2026) [Tier 3]
- **ID:** `levanon-productivity-regime-shift-2026`
- **Why it matters:** Documents a structural break in the productivity-hours relationship: aggregate productivity growth **1.3% → 2.2%** while hours growth slowed **1.9% → 0.7%**; early 2026 job growth flat outside healthcare/social services. **FIIPB within-industry contribution doubled (0.78 → 1.50 pp/yr).** **Information sector hours −6% from 2022 peak while GDP +8.4%/yr.** Headline article on Featured Reads.
- **Maps to:** overall-us-displacement, white-collar-professional-displacement, tech-sector-displacement, entry-level-wage-impact (overlays)
- **Commit:** `ecb7eeed` (#598)

### 5. Centre for British Progress — "AI and the UK Labour Market: The Evidence So Far" (Dr Pedro Serôdio, Apr 2026) [Tier 2]
- **ID:** `british-progress-uk-labour-market-2026`
- **Why it matters:** Comprehensive UK empirical survey covering **412 occupations / 24.8M workers** post-ChatGPT. Finds **no detectable aggregate displacement**; software sector H2 2025 decline is the strongest early signal; expert exposure models **systematically overstate revealed adoption**. KB/reading-list only — UK-specific.
- **Commit:** `ea37b9c3` (#608)

### 6. Barth, Hoen, Kerr, Kerr — "Declining Occupations in Norway" (NBER w35096) [Tier 1]
- **ID:** `barth-hoen-kerr-declining-occupations-nber-2026`
- **Why it matters:** Norway workers in occupations declining 25%+ show **0.4 fewer future years of work** and **4.7% cumulative earnings loss** (2007–2024). The first long-horizon administrative-data evidence on what happens to workers in shrinking occupations.
- **Maps to:** white-collar-professional-displacement, median-wage-impact (overlays)
- **Commit:** `9441be78` (#592)

### 7. Carlyle — "Compass" AI-SaaS Survey (Jason Thomas, Apr 2026) [Tier 2]
- **ID:** `carlyle-compass-ai-saas-2026`
- **Why it matters:** Proprietary survey of management teams. **26% of teams offset AI spend via internal headcount reduction** (the largest single offset category). **22% offset by cutting IT services/consultants. 11% plan to use AI to replace SaaS subscriptions.** A clean signal that AI cost is being underwritten by displacement, not absorbed.
- **Maps to:** ai-adoption-rate, overall-us-displacement, white-collar-professional-displacement (overlays)
- **Commit:** `382f5a31` (#599)

### 8. Economic Security Project — "Ideas for Shared Economic Prosperity in the AI Transition" (Becky Chao, Apr 2026) [Tier 2]
- **ID:** `esp-chao-shared-prosperity-2026`
- **Why it matters:** Policy brief citing Azar et al.'s **4.5% wage decline at AI-substitutable firms** across 138M U.S. worker-firm matches. Featured on the homepage Featured Reads (replacing the WSJ "Jobs Aren't Growing" entry).
- **Maps to:** median-wage-impact (overlay)
- **Commit:** `1bf153be` (#593)

### 9. Yglesias / Slow Boring — "It's not 'bad marketing' from A.I. companies" (Apr 2026) [Tier 4]
- **ID:** `yglesias-slowboring-ai-messaging-2026`
- **Why it matters:** Argues that AI executives' large-scale-disemployment predictions are **sincere belief, not strategic messaging** — captured as a directional Tier-4 signal on overall-us-displacement.
- **Commit:** `f6f1835a` (#590)

---

## B. New Data Points & Overlay Signals

**New history data points added** (chart trend lines):

| Graph | Value | Source | Horizon |
|---|---|---|---|
| overall-us-displacement | 1.9 | Metaculus | 2030 |
| overall-us-displacement | 3.4 | Metaculus | 2035 |
| white-collar-professional-displacement | 12.4 | Tucker/Census | 2026 (post-ChatGPT) |
| white-collar-professional-displacement | 5.4 | Metaculus | 2030 (lawyers) |
| white-collar-professional-displacement | 9.6 | Metaculus | 2035 (lawyers) |
| white-collar-professional-displacement | 11.4 | Metaculus | 2030 (most-vulnerable composite) |
| white-collar-professional-displacement | 17.2 | Metaculus | 2035 (most-vulnerable composite) |
| tech-sector-displacement | 15.1 | Metaculus | 2030 (software dev) |
| tech-sector-displacement | 22.3 | Metaculus | 2035 (software dev) |
| tech-sector-displacement | 30 | Tucker/Census | 2026 (Information sector) |
| financial-services-displacement | 8.1 | Metaculus | 2030 |
| financial-services-displacement | 15.3 | Metaculus | 2035 |
| creative-industry-displacement | 4 | Metaculus | 2030 |
| creative-industry-displacement | 8.4 | Metaculus | 2035 |
| education-sector-displacement | -1.3 | Metaculus | 2030 (K-12 growth) |
| education-sector-displacement | 1.3 | Metaculus | 2035 |
| median-wage-impact | -0.6 | Metaculus | 2030 |
| median-wage-impact | 1.4 | Metaculus | 2035 |

Plus **7 tech-sector overlays promoted to history points** (commit `7f635864`):
- BLS OOH 9.6% programmer decline (2023–2033, proxy)
- BLS 6% programmer decline (2024–2034, proxy)
- ESB/Rabobank 11% Dutch ICT youth drop (proxy)
- Dallas Fed 5% computer-systems-design decline
- Lodefalk 5.5% Sweden young-dev decline (proxy)
- Fed Crane/Soto 9% coder employment gap (CI 6–12%, proxy)
- Stanford HAI 20% dev decline ages 22–25 (proxy)

**New overlay signals** (~17, across 12 graphs) — direction/source detail in section A above.

---

## C. Prediction Graph Structural Changes

Commit `0f660363` rebased `currentValue` across 7 predictions to match the weighted-average methodology after the Metaculus ingestion shifted distributions. Tech-sector also corrected from a manual override to the full weighted average.

| Graph | Old | New |
|---|---|---|
| tech-sector | 1.6 | 12.1 |
| creative-industry | 27.2 | 23.8 |
| education-sector | 11.2 | 7.8 |
| financial-services | 5.2 | 6.3 |
| white-collar-professional | 5.8 | 6.4 |
| freelancer-rate-impact | -19.5 | -18.9 |
| median-wage-impact | -1.9 | -1.6 |

Additional fixes:
- `b6aa7118` — Removed Metaculus 2035 projection from tech-sector (graph tracks 2030)
- `c2b2db3a` — Moved Metaculus 52.5% / 70.9% projections to overlays in genai-work-adoption (graph uses `aggregationMethod: "latest"` on observed time-series; otherwise headline would have jumped 43% → 70.9%)

---

## D. Site Pages & Features

**SignalStrip pixel timeline (commits `f3266d62`, `496c1ec5`, `50d7dbcd`, `84b8379e`, `b7fee480`, `1abaa53b`):**
The biggest visual change of the week. The overlapping ReferenceLine "overlay bars" on every prediction chart have been replaced with a SignalStrip — a pixel-block timeline that net-cancels opposing signals, splits at the observed/projected boundary, and shows a hover tooltip per month. Iterated over 6 commits to land block sizing (8→12→18px), gap spacing, and adjacent-month merging. Includes a section header, tagline explaining the cancellation logic, and dashed dividers for the observed/projected split.

**Private /kb page with cookie auth (commits `fc9c7065`, `0f25506c`, `5b0ebcf8`, `295ad15b`, `2340a3e7`):**
New password-gated `/kb` page with httpOnly cookie auth (no token in URL), streaming Claude endpoint that loads compiled wiki context, plus `src/lib/admin-auth.ts` shared utility. `ingest:apply` now auto-runs `compile-wiki + compile-kb`; build pipeline compiles before each Vercel deploy. Hardening pass centralized model IDs into `src/lib/claude-models.ts` (one constant for 12 callsites) and switched query model to `claude-mythos-0417`.

**Wiki compiler (commit `f4b70da0`):**
New compiler that turns 526 sources + 18 predictions into an interlinked markdown wiki for private LLM-assisted research. Auto-runs on ingest.

**Shareable deep links for /signals sector cards (commit `92c07716`):**
Expanding a sector now sets `?sector=legal` in the URL. Visiting `/signals?sector=legal` opens the card pre-expanded and scrolls to it. Share button copies the link with a 2s "Copied" confirmation.

**Tooltip readability (commit `f8aebed6`):**
Replaced near-invisible border/shadow with a strong drop shadow; restructured source display (publisher bold + title on separate line); bumped font floor 10px → 11px; raised overlay bar opacity 0.18 → 0.24.

**Touch targets and heading balance (commit `1a557bcb`):**
`text-wrap: balance` on h1/h2; nav link 30px → 44px; logo link 19px SVG → 44px touch target.

**Featured Reads rotation (commits `ecb7eeed`, `1bf153be`, `52da68a7`, `8ec6dd73`, `5c27a008`):**
- Slot 1: Levanon's "Technology-Driven Productivity Regime Shift" (replaces NY Fed)
- Added: ESP/Chao "Ideas for Shared Economic Prosperity in the AI Transition" (replaces WSJ "Jobs Aren't Growing")
- Removed: "AI Doesn't Reduce Work" and "AI Assistance Reduces" (mistakenly deleted entry restored)
- Reading-list takeaways shortened to 1–2 sentences across all 5 articles

**Style: rainbow card accents → consistent slate divider (commit `6604618f`).**

**Overlay default expanded (commit `dcf4a184`):**
`OVERLAY_VISIBLE_COUNT` 10 → 25 and `COLLAPSE_THRESHOLD` 20 → 25. Dense charts now show 25 most recent overlays before the expand toggle. Claude-cost cumulative updated to $1,048.60.

---

## E. Data Pipeline & Scripts

**Anthropic SDK modernization (commit `42ecb81b`, #595):**
- Bumped `analyze.ts` and `extractor.ts` from Sonnet 4.0 (`claude-sonnet-4-20250514`) to `claude-sonnet-4-6` for 1M context.
- Replaced string-matching error checks with typed SDK exceptions (`APIConnectionTimeoutError`, `APIConnectionError`, `RateLimitError`, `InternalServerError`, `APIError`).
- Added ephemeral prompt caching on the system prompt in the assessment policy/prompt generator, the 4-step pipeline helper, and the digest analyzer (cuts repeat-call input cost ~90% on the cached prefix).

**Signals taxonomy expansion (commit `c50cabf6`, #600):**
Added three legal-adjacent PyPI packages: `eyecite` (legal — Free Law Project citation extraction), `presidio-analyzer` (legal/finance/healthcare — Microsoft PII detection), `pymupdf` (legal/finance — high-performance PDF extraction). Refreshed `monthly_downloads.json` (52 PyPI packages), `bls_employment.json` (through 2026-03), and `github_activity.json`. **Legal & Compliance now: +27.2% 3-mo tool growth, 9 tools, 3 surging.**

**GitHub token autoload (commit `d2b805e9`, #601):**
`fetch_github.py` now auto-loads `GITHUB_TOKEN` from `.env`.

**Assessment dashboard hardening (5 commits — `5859975f`, `4b96557a`, `edd7448e`, `f6b5b54`, `37a26c0e`):**
- Parallelized step-2 task generation to stop 300s timeouts (#604)
- Made step-3 resilient to slow/hung Claude calls with proper timeout + retry (#605)
- Raised client timeout + recover completed work on abort (#606)
- Refactored to cut redundant report sections + tighten step 2 (#607)
- Enforced ownership on analyze/feedback/addon routes (#602)

**Weekly research digest (commits `404da6d7`, `fb8a05bb`):**
Automated weekly digest 2026-W17 (#591) and the 2026-04-20 scan (#594) ran successfully.

---

## F. Configuration & Infrastructure

- `next.config.js` updated to include wiki files in output tracing for `/api/kb/query`.
- `kb_session` cookie path set to `/` so it reaches `/api/kb/query` (commit `0f25506c`).

---

## Raw Commit List

```
b7fee480 2026-04-23 style(viz): larger signal blocks (12→18px) and larger chart dots
84b8379e 2026-04-22 fix(viz): larger signal blocks (8→12px) and merge overlapping columns
50d7dbcd 2026-04-22 fix(viz): add section header and description above signal strip
1abaa53b 2026-04-22 fix(viz): remove stale overlay-bar references from prediction detail page
496c1ec5 2026-04-22 feat(viz): split signal strip at observed/projected boundary + add tagline
2340a3e7 2026-04-22 fix(kb): tell Claude to answer in plain prose, not Markdown (#611)
5b0ebcf8 2026-04-22 fix(api): harden KB route + centralize Claude model IDs (#610)
f3266d62 2026-04-22 feat(viz): replace overlay bars with SignalStrip pixel timeline
f8aebed6 2026-04-22 fix(viz): improve tooltip readability across prediction charts
ea37b9c3 2026-04-22 ingest: Centre for British Progress UK labour market report (#608)
6604618f 2026-04-22 style: replace rainbow card accents with consistent slate divider
1a557bcb 2026-04-22 fix(a11y): improve touch targets and heading balance
295ad15b 2026-04-22 chore: switch kb query model to claude-mythos-0417
5c27a008 2026-04-22 chore: shorten reading list takeaways to 1-2 sentences
52da68a7 2026-04-22 chore: remove "AI Assistance Reduces" + restore mistakenly deleted article
8ec6dd73 2026-04-22 chore: remove "AI Doesn't Reduce Work" from reading list
37a26c0e 2026-04-22 refactor(assessment): cut redundant report sections + tighten step 2 (#607)
edd7448e 2026-04-22 fix(assessment): raise client timeout + recover completed work on abort (#606)
4b96557a 2026-04-22 fix(assessment): make step 3 resilient to slow/hung Claude calls (#605)
5859975f 2026-04-22 fix(assessment): parallelize step 2 task generation (#604)
3c3955fa 2026-04-22 ingest: Liu et al. 2026 — AI deskilling RCT (N=1,222) (#603)
0f25506c 2026-04-22 fix: set kb_session cookie path to /
f6b5b54  2026-04-22 fix(assessment): enforce ownership on analyze/feedback/addon (#602)
fc9c7065 2026-04-22 feat: add private /kb page with cookie auth and auto-compile on ingest
d2b805e9 2026-04-22 chore(signals): auto-load GITHUB_TOKEN from .env (#601)
c50cabf6 2026-04-22 feat(signals): add eyecite/presidio/pymupdf to legal tracking (#600)
382f5a31 2026-04-21 ingest: Carlyle Compass AI-SaaS survey (#599)
92c07716 2026-04-21 feat: shareable deep links for sector cards on signals page
dcf4a184 2026-04-21 fix: update Claude costs to $1,048.60; default overlays to expanded
ecb7eeed 2026-04-21 ingest: Burning Glass / Levanon productivity regime shift (#598)
3d9af0ee 2026-04-20 ingest: Tucker "You're (not) hired" QWI early-career (#597)
b6aa7118 2026-04-20 fix: remove Metaculus 2035 projection from tech-sector
7f635864 2026-04-20 feat: promote 7 tech sector overlays to history data points
c2b2db3a 2026-04-20 fix: move Metaculus projections to overlays in genai-work-adoption
f4b70da0 2026-04-20 feat: add wiki compiler for LLM knowledge base
0f660363 2026-04-20 fix: rebase currentValue across 7 predictions to match weighted methodology
85a670a8 2026-04-20 ingest: full Metaculus Labor Hub 2030 + 2035 horizon data
1cdad4e1 2026-04-20 ingest: Metaculus Labor Hub occupation-level forecasts
c65d9c58 2026-04-20 ingest: Metaculus Labor Automation Forecasting Hub (launch data)
fb8a05bb 2026-04-20 research: weekly AI labor digest 2026-04-20 (#594)
42ecb81b 2026-04-20 chore: modernize Anthropic SDK usage (#595)
1bf153be 2026-04-20 ingest: ESP "Ideas for Shared Economic Prosperity" (Chao) (#593)
9441be78 2026-04-20 ingest: Barth et al. 'Declining Occupations in Norway' (NBER) (#592)
404da6d7 2026-04-20 chore: weekly research digest 2026-W17 [automated] (#591)
f6f1835a 2026-04-20 ingest: Yglesias Slow Boring 'not bad marketing' (#590)
```

---

## LinkedIn Post Draft

(See `2026-04-27-linkedin-post.txt` for the publishable plain-text version.)
