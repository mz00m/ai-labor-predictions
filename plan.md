# O-Ring Theory Integration Plan

Incorporating insights from Imas & Shukla "Ghosts of Electricity" (Mar 2026),
which applies Gans & Goldfarb's "O-Ring Automation" model to AI labor predictions.

---

## Core Theoretical Gaps Identified

The blog post identifies three variables that determine whether AI exposure
leads to augmentation or displacement:

1. **Task complementarity** — tasks are multiplicative (O-Ring), not additive
2. **Job dimensionality** — fewer task clusters = higher displacement risk + stronger firm incentive to automate
3. **Demand elasticity** — already present in our beyond-exposure page

---

## A. Beyond Exposure Page (`/occupation-exposure`)

### A1. Add Job Dimensionality as 6th Scoring Dimension
- In `composite-risk.ts`, add `jobDimensionality` (0-10) to `DimensionScores`
- Compute from existing `taskComposition` in `economy-occupations.ts`:
  count task categories with >=10% share, invert to risk scale
  (fewer effective dimensions = higher score = more pressure)
- This is a "pressure" dimension (like exposure and speed)
- Rebalance weights: Exposure 25%, Speed 15%, Dimensionality 15%,
  Adaptability 15%, Elasticity 15%, Complementarity 15%

### A2. Add Dimensionality to Treemap + DimensionPanel
- Add as 7th viewable layer in `DimensionPanel.tsx` and `KarpathyTreemap.tsx`
- Add metadata to `DIMENSION_META` with label, description, source citation
- Source: "Gans & Goldfarb (2024); Kremer (1993)"

### A3. Update Essay to "Six Variables"
- Add dimensionality section to `FiveVariablesEssay.tsx`
- Use the trucking vs. management consultant example from the blog post
- Explain the firm incentive channel: closer to full automation = higher ROI

### A4. Update MethodologySection
- Add Gans & Goldfarb and Kremer citations
- Add dimensionality computation explanation
- Note limitation: SOC-level aggregation blurs within-group variation

### A5. Enhance ComparisonTable Narrative
- Add callout explaining WHY some moderate-exposure jobs (trucking, warehousing)
  rank higher in net risk than high-exposure jobs (consulting, medicine)

---

## B. Task Visualizer (`/task-visualizer`)

### B1. Display Job Dimensionality Score
- Compute `effectiveDimensions` for each of 58 job profiles (task categories >= 10% share)
- Show prominently: "Task Complexity: X of 8 core dimensions"
- Color-code: 1-2 red (displacement-vulnerable), 3-4 amber, 5+ green

### B2. Displacement Phase Transition Warning
- When >50% of a job's effective dimensions cross cost parity, show qualitative shift:
  - Below threshold: "AI augments this role — partial automation raises productivity"
  - Above threshold: "Approaching full-task automation — firm incentive shifts toward replacement"
- The blog post's key insight: firm incentive is nonlinear as automated-to-remaining ratio grows

### B3. Focus Effect Indicator
- When tasks are automated, show remaining tasks gaining value
- "If [task] is handled by AI, ~X hrs/week reallocate to [remaining tasks]"
- Visual: remaining task bars grow (quality multiplier, not just time reallocation)
- Add small "Focus Effect" card below the AutomationTimeline

### B4. Methodology Section Update
- Add O-Ring framework explanation to `MethodologySection.tsx`
- Cite Gans & Goldfarb (2024) and Kremer (1993)
- Honest caveat: our cost-crossover model is still additive — dimensionality
  score and phase transition warning are corrections, not a full rewrite

---

## C. What This Does NOT Do (Intentional Scope Limits)

- Does NOT rewrite cost-crossover to multiplicative production function
  (would require full model rewrite; not warranted without more validation)
- Does NOT add firm-level investment data (we lack it; dimensionality is the proxy)
- Does NOT change existing scores — only adds a new dimension and UI indicators

---

## Suggested Priority Order

| Pri | Item | Effort | Impact | Rationale |
|-----|------|--------|--------|-----------|
| 1 | A1 | Medium | High | Biggest theoretical gap; uses existing data |
| 2 | B1 | Small | Medium | Same computation, surfaces it on task viz |
| 3 | B2 | Small | High | Blog post's most novel insight; high user value |
| 4 | A3 | Medium | High | Intellectual framing that makes the new dimension legible |
| 5 | A2 | Medium | Medium | UI to expose the new score on treemap |
| 6 | B3 | Medium | Medium | Valuable but needs more UX design thought |
| 7 | A4+A5+B4 | Small | Low | Methodology/narrative polish |
