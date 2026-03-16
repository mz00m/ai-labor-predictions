# Task Visualizer Integration Plan: Manning/Aguirre Adaptive Capacity Index

**Source:** Manning & Aguirre, "How Adaptable Are American Workers to AI-Induced Job Displacement?" NBER w34705, January 2026.

**Goal:** Integrate occupation-level adaptive capacity (AC) scores into the task visualizer to show not just *which* workers face automation pressure, but *who can adapt* — and who cannot.

---

## Overview of Changes

| # | Change | Scope | Files |
|---|--------|-------|-------|
| 1 | Add AC data to `OccupationGroup` | Data model | `economy-occupations.ts` |
| 2 | Add AC data to `JobProfile` | Data model | `job-tasks.ts` |
| 3 | New "Adaptability" economy tab | New component | `AdaptiveCapacity.tsx`, `EconomyVisualizerClient.tsx` |
| 4 | Enhance GenderImpact with vulnerability stat | Component update | `GenderImpact.tsx` |
| 5 | Add AC context to FocusRecommendations | Component update | `FocusRecommendations.tsx` |
| 6 | Update methodology section | Component update | `MethodologySection.tsx` |

---

## Change 1: Add Adaptive Capacity to `OccupationGroup`

**File:** `src/data/economy-occupations.ts`

### Data Model Changes

Add three fields to the `OccupationGroup` interface:

```typescript
export interface OccupationGroup {
  // ... existing fields ...

  /** Adaptive capacity index (0-1) from Manning/Aguirre NBER w34705 */
  adaptiveCapacity: number;
  /** AC subcomponents (0-1 each, employment-weighted Z-score normalized) */
  adaptiveCapacityComponents: {
    netLiquidWealth: number;    // SIPP 2022-2024
    skillTransferability: number; // O*NET + BLS projections
    geographicDensity: number;  // Lightcast CBSA density
    ageFraction55Plus: number;  // ACS (inverted: lower = better)
  };
  /** AI exposure score from Eloundou et al. E1+0.5E2 (0-1) */
  aiExposure: number;
}
```

### Data Mapping: SOC Major Groups → Manning/Aguirre Table 5

The paper reports AC by "major occupation category" which maps to SOC major groups. Mapping from Manning/Aguirre Table 5 to our 22 SOC groups:

| Our SOC Group | Paper Category | AC Score | AI Exposure | Employment (paper) |
|---|---|---|---|---|
| management (11) | Professional, Managerial, and Technical | 0.734 | 0.400 | 56.9M (shared) |
| business-financial (13) | Professional, Managerial, and Technical | 0.734 | 0.400 | (shared) |
| computer-math (15) | Professional, Managerial, and Technical | 0.734 | 0.400 | (shared) |
| architecture-engineering (17) | Professional, Managerial, and Technical | 0.734 | 0.400 | (shared) |
| life-physical-social-science (19) | Professional, Managerial, and Technical | 0.734 | 0.400 | (shared) |
| legal (23) | Professional, Managerial, and Technical | 0.734 | 0.400 | (shared) |
| community-social (21) | Service Occupations | 0.454 | 0.161 | 27.0M (shared) |
| education (25) | Education, Training, and Library* | 0.600† | 0.350† | ~9M |
| arts-media (27) | Professional, Managerial, and Technical | 0.734 | 0.400 | (shared) |
| healthcare-practitioners (29) | Healthcare Practitioners | 0.550† | 0.200† | (inferred) |
| healthcare-support (31) | Service Occupations | 0.454 | 0.161 | (shared) |
| protective-service (33) | Service Occupations | 0.454 | 0.161 | (shared) |
| food-serving (35) | Service Occupations | 0.454 | 0.161 | (shared) |
| building-grounds (37) | Service Occupations | 0.454 | 0.161 | (shared) |
| personal-care (39) | Service Occupations | 0.454 | 0.161 | (shared) |
| sales (41) | Sales and Related | 0.487 | 0.348 | 14.3M |
| office-admin (43) | Administrative Support | 0.360 | 0.525 | 17.8M |
| farming-fishing (45) | Natural Resources, Construction, Maintenance | 0.449 | 0.041 | 14.2M (shared) |
| construction (47) | Natural Resources, Construction, Maintenance | 0.449 | 0.041 | (shared) |
| installation-repair (49) | Natural Resources, Construction, Maintenance | 0.449 | 0.041 | (shared) |
| production (51) | Production, Transportation, Material Moving | 0.401 | 0.131 | 19.6M (shared) |
| transportation (53) | Production, Transportation, Material Moving | 0.401 | 0.131 | (shared) |

**Notes:**
- † = Inferred values where paper aggregates differently than our SOC groups. Education and healthcare practitioners are bundled into larger categories in the paper. Use interpolated estimates based on the paper's component data and mark with a flag.
- The paper's 7 major categories map imperfectly to our 22 SOC groups. For groups sharing a paper category, use the same AC score. This is a known limitation — note it in the methodology.
- AC subcomponents will use the paper's Table 5 breakdown where available, otherwise estimate from the occupation group characteristics.

### Implementation

Update `makeGroup()` to accept the new fields. Add AC data inline with each `makeGroup()` call:

```typescript
function makeGroup(
  // ... existing params ...
  womenPercent: number,
  adaptiveCapacity: number,
  adaptiveCapacityComponents: { ... },
  aiExposure: number
): OccupationGroup { ... }
```

---

## Change 2: Add Adaptive Capacity to `JobProfile`

**File:** `src/data/job-tasks.ts`

### Data Model Changes

Add an optional AC field to `JobProfile`:

```typescript
export interface JobProfile {
  // ... existing fields ...

  /** Adaptive capacity index (0-1), from Manning/Aguirre NBER w34705.
   *  Occupation-level score — reflects occupation characteristics, not individual workers. */
  adaptiveCapacity?: number;
  /** Vulnerability flag: high AI exposure + low adaptive capacity (bottom quartile) */
  highVulnerability?: boolean;
}
```

### Data Mapping: 40 Job Profiles → AC Scores

Map each of our 40 job profiles to Manning/Aguirre's 356-occupation dataset. The paper uses 6-digit SOC codes; our profiles have `onetCode` fields (some populated). Strategy:

1. For jobs with `onetCode`: look up the exact SOC match in Manning/Aguirre's data
2. For jobs without: inherit from their SOC major group AC score
3. For the ~15 highest-profile jobs (secretary, web designer, accountant, etc.): use the paper's specific occupation-level scores where mentioned

**Key specific mappings from the paper text:**
- Secretary: AC ≈ 0.30 (explicitly called out as high-vulnerability)
- Web Designer: AC ≈ 0.72 (explicitly called out as adaptable despite high exposure)
- Office Admin roles generally: AC = 0.360

### Implementation

Add `adaptiveCapacity` and `highVulnerability` to each `JobProfile` object. For the initial implementation, use SOC major group scores and override with specific values for occupations called out in the paper.

---

## Change 3: New "Adaptability" Economy View Tab

**File:** `src/components/task-visualizer/economy/AdaptiveCapacity.tsx` (new)
**File:** `src/app/task-visualizer/economy/EconomyVisualizerClient.tsx` (update)

### Tab Configuration

Add to `SECTIONS` array in `EconomyVisualizerClient.tsx`:

```typescript
{
  id: "adaptability",
  label: "Adaptability",
  question: "AI exposure and worker adaptability are positively correlated — but not for everyone",
  description: "Most workers in highly AI-exposed occupations have strong adaptive capacity (savings, transferable skills, urban location, younger age). But 6.1 million clerical/admin workers face both high exposure and low adaptability. Based on Manning & Aguirre (NBER, 2026).",
}
```

Position: Insert between "By Gender" and the end (or between "By Income" and "By Gender" — the gender section naturally follows since it connects to the 81.3% women finding).

### Component Design: `AdaptiveCapacity.tsx`

**Section A: Headline Stats (4 cards)**

| Card | Value | Label |
|---|---|---|
| 1 | r = 0.50 | Correlation: AI exposure ↔ adaptive capacity |
| 2 | 71% | Of highly-exposed workers have above-median adaptability |
| 3 | 6.1M | Workers with high exposure + low adaptability |
| 4 | 81% | Of high-vulnerability workers are women |

Colors: Card 2 green (reassuring), Card 3 red (warning), Card 4 rose (gender).

**Section B: Scatter Plot (main visualization)**

A Recharts `ScatterChart` plotting all 22 occupation groups:
- **X-axis:** AI Exposure (0–1) from Eloundou et al.
- **Y-axis:** Adaptive Capacity (0–1) from Manning/Aguirre
- **Dot size:** proportional to `employment` (thousands)
- **Dot color:** by `incomeTier` (amber/indigo/teal)
- **Labels:** `shortTitle` for each dot
- **Quadrant lines:** dashed lines at median exposure (≈0.25) and median AC (≈0.50), creating four quadrants
- **Quadrant labels:**
  - Top-right: "High exposure, high adaptability" (green text)
  - Bottom-right: "High exposure, LOW adaptability" (red text, highlighted)
  - Top-left: "Low exposure, high adaptability" (muted)
  - Bottom-left: "Low exposure, low adaptability" (amber)
- **Hover tooltip:** Show occupation title, employment, AC score, AI exposure, AC components breakdown
- **Click:** Navigate to job detail (same pattern as other economy views)
- **Trendline:** Dashed line showing r=0.502 positive correlation

This directly mirrors Figure 1 from the Manning/Aguirre paper, adapted for our 22 SOC groups.

**Section C: Vulnerability Table**

A focused table showing the bottom-right quadrant occupations (high exposure + low AC):

| Occupation | Workers (M) | AI Exposure | Adaptive Capacity | Women % | Top Vulnerable Task |
|---|---|---|---|---|---|
| Office & Admin | 18.2M | 0.525 | 0.360 | 42% | Information Processing |
| Sales | 13.4M | 0.348 | 0.487 | 49% | Communication |
| ... | ... | ... | ... | ... | ... |

Sorted by vulnerability (exposure × inverse-AC). Rows clickable.

**Section D: AC Components Breakdown**

Horizontal stacked bar chart showing the four AC components for each occupation group:
- Net Liquid Wealth (blue)
- Skill Transferability (green)
- Geographic Density (amber)
- Age (inverted, rose)

This shows *why* some groups are more adaptable — is it wealth, skills, location, or demographics?

**Section E: Source Attribution**

```
Based on Manning & Aguirre, "How Adaptable Are American Workers to AI-Induced Job Displacement?"
NBER Working Paper w34705, January 2026. Adaptive capacity index covers 356 occupations (95.9% of
US workforce). Index measures occupation-level characteristics, not individual workers.
```

### Props & Data Flow

```typescript
// No props needed — reads from OCCUPATION_GROUPS directly (same pattern as other economy views)
export default function AdaptiveCapacity() {
  // Reads OCCUPATION_GROUPS which now includes adaptiveCapacity fields
  // Computes quadrant assignments
  // Renders scatter + table + components chart
}
```

---

## Change 4: Enhance GenderImpact Component

**File:** `src/components/task-visualizer/economy/GenderImpact.tsx`

### Addition: Vulnerability Callout

Add a highlighted callout box at the top of the GenderImpact section (before the existing stat cards):

```tsx
<div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6">
  <p className="text-[14px] font-semibold text-rose-400 mb-1">
    Research highlight: Women are 81% of the most vulnerable workers
  </p>
  <p className="text-[12px] text-[var(--muted)]">
    Manning & Aguirre (NBER, 2026) find that women make up approximately 81.3% of
    workers in occupations with both high AI exposure and low adaptive capacity
    (ability to transition to other jobs). These are concentrated in clerical and
    administrative roles.
  </p>
</div>
```

### Addition: New Stat Card

Add a 5th stat card to the existing 4-card grid:

| Label | Value | Source |
|---|---|---|
| Women in high-vulnerability occupations | 81.3% | Manning/Aguirre 2026 |

---

## Change 5: Add AC Context to FocusRecommendations

**File:** `src/components/task-visualizer/FocusRecommendations.tsx`

### Changes

When a user views a job's focus recommendations, add an "Adaptability Context" section below the three task buckets:

```tsx
{selectedJob.adaptiveCapacity !== undefined && (
  <div className="mt-6 pt-4 border-t border-black/[0.06]">
    <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-2">
      Adaptability Context
    </h4>
    <div className="flex items-center gap-3 mb-2">
      <div className="text-[24px] font-bold" style={{ color: acColor }}>
        {(selectedJob.adaptiveCapacity * 100).toFixed(0)}
      </div>
      <div className="text-[12px] text-[var(--muted)]">
        <div>Adaptive Capacity Score (0-100)</div>
        <div>Manning & Aguirre, NBER 2026</div>
      </div>
    </div>
    <p className="text-[12px] text-[var(--muted)]">
      {getACInterpretation(selectedJob.adaptiveCapacity)}
    </p>
  </div>
)}
```

Where `getACInterpretation()` returns:
- AC ≥ 0.65: "Workers in this occupation have strong adaptive capacity — above-median savings, transferable skills, and urban job access. If AI transforms this role, most workers are well-positioned to transition."
- AC 0.45–0.65: "Workers in this occupation have moderate adaptive capacity. Some workers will transition smoothly, but others may face barriers related to savings, skills, or location."
- AC < 0.45: "Workers in this occupation face low adaptive capacity — below-median savings, fewer transferable skills, or geographic constraints. If AI displaces this role, many workers may struggle to find comparable employment."

Color: green (≥0.65), amber (0.45–0.65), red (<0.45) — consistent with the site's risk coloring.

### Props Change

`FocusRecommendations` currently receives `tasks`, `adjustedShares`, `humanWagePerHr`, and `industrySpeedMultiplier`. Add:

```typescript
interface FocusRecommendationsProps {
  // ... existing ...
  adaptiveCapacity?: number;
  highVulnerability?: boolean;
}
```

Pass these from the parent `JobTaskVisualizer.tsx` via the selected `JobProfile`.

---

## Change 6: Update Methodology Section

**File:** `src/components/task-visualizer/MethodologySection.tsx`

### Addition: New Subsection

Add a new collapsible section after the existing methodology content:

**Title:** "Adaptive Capacity Index"

**Content:**
- Explain the Manning/Aguirre index: 4 components, 356 occupations, employment-weighted Z-scores
- Note key finding: r=0.502 positive correlation means most high-exposure workers *can* adapt
- State limitation: occupation-level, not individual-level; within-occupation heterogeneity is masked
- Link to the NBER paper

---

## Implementation Order

1. **Data model first** (Changes 1 & 2) — add AC fields to `OccupationGroup` and `JobProfile`
2. **New tab** (Change 3) — build `AdaptiveCapacity.tsx` and wire into economy view
3. **Enhance existing** (Changes 4 & 5) — GenderImpact callout + FocusRecommendations context
4. **Documentation** (Change 6) — methodology section update

Each change can be committed independently. Total estimated scope: ~400-500 lines of new code, ~50 lines of modifications to existing files.

---

## Data Quality Notes

- The paper reports 7 major occupation categories; we have 22 SOC groups. Several of our groups share the same paper-level AC score. This is an inherent limitation of the mapping granularity.
- AC subcomponents are reported at the major category level in Table 5. Detailed occupation-level subcomponents would require access to the paper's supplementary data files.
- The AC index uses equal component weighting — the authors note this is for transparency, but components may contribute unequally to actual adaptability.
- Mark all AC-derived data with source attribution to Manning/Aguirre NBER w34705.
