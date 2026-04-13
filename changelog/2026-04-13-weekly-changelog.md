# Weekly Changelog: April 6–13, 2026

**Commits:** 23 total (22 non-merge)
**New research sources:** 1 (OpenAI Industrial Policy paper)
**Data integrity fixes:** 7 critical issues resolved via automated fact-check
**URLs corrected:** 17

---

## Major Changes

### Automated Fact-Check: 7 Critical Data Fixes

An automated fact-check agent audited the full dataset and flagged 7 critical issues, all now resolved:

1. **BLS MLR misattribution** — Removed 6 erroneous data points from `tech-sector-displacement` that incorrectly projected tech job decline. The BLS source actually projects software developer employment to *increase* 17.9% through 2033.
2. **Acemoglu displacement value** — Corrected from 5% to 0.5%. The paper's thesis is that AI displacement effects are limited, not dramatic.
3. **Earnings call Q3 2025** — Value corrected (58→61%) and date corrected (July→November).
4. **FactSet URLs** — 15 truncated URLs fixed across `earnings-call-ai-mentions`.
5. **Klarna URL** — Fixed 404 for the 66% customer service automation data point.
6. **BLS programmer page URL** — Corrected to canonical OES page.
7. **6 stale currentValue fields synced** — Largest discrepancy: `white-collar-professional-displacement` was showing 0.9 instead of 5.8.

### White-Collar Chart Restructure

Complete semantic overhaul of the white-collar displacement chart:
- Renamed: "Employment in High-AI-Exposure Occupations" → **"White-Collar Professional Displacement by 2030"**
- Flipped sign convention: positive values now = displacement (higher is worse)
- 15 history values + 62 overlay directions corrected
- Eliminates the confusing negative-means-displacement convention

### Assessment Feedback Integration

Users can now provide guidance between assessment steps:
- Free-text feedback and priority adjustments between steps
- Context from documents and websites carries forward across all steps
- Stepper navigation fixed — users can move forward without completing earlier steps
- Chatbot assessment links now clickable

### Human Capabilities + Full Risk Dimensions in Report

- New "Skills That Grow With AI" section: 4-6 capabilities scored for AI appreciation with development advice
- PDF export now includes full risk dimensions (common pitfalls, pushback sources, data readiness, 5-dimension risk profile)

### Navigation: Dashboard → Action Plan

- Primary nav renamed from "Dashboard" to "Action Plan"
- New inline CTA in task visualizer nudging users from generic role analysis to personalized assessment

### Managed Research & Fact-Check Agents (New Infrastructure)

Two autonomous agents deployed via Claude Managed Agents API:
- **Research agent** — Runs weekly. Scans for new AI labor market research, extracts stats, maps to prediction graphs, opens PR for review.
- **Fact-check agent** — Runs monthly. Audits every URL, data point value, weighted average, and registry entry. Produces health report.
- Both run on GitHub Actions with manual trigger support.

---

## New Research

### OpenAI: "Industrial Policy for the Intelligence Age" (April 2026)
- **Tier:** 2 (corporate policy white paper)
- **3 overlays** added to `overall-us-displacement` and `median-wage-impact`
- Key signal: OpenAI explicitly warns "workers may gain productivity without seeing wage benefits"
- Proposes 32-hour workweek pilots, public wealth fund, portable benefits
- Featured as #1 read in reading list

---

## Data Summary

| Category | Count |
|----------|-------|
| Sources ingested | 1 |
| Data points removed (erroneous) | 6 |
| Data values corrected | 7 |
| URLs fixed | 17 |
| currentValue fields synced | 6 |
| Chart sign corrections | 77 (15 history + 62 overlays) |
| Total sources in registry | 513 (503 verified) |
