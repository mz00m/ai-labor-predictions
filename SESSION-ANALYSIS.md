# MY CLAUDE USAGE ANALYSIS
*Feb 23 – Mar 8, 2026 (Founding Period) | 61 commits across ~30+ sessions analyzed*

> **Method:** Analysis based on git commit history (61 commits), PR history (98 PRs),
> project structure, existing skills/commands, CI/CD workflows, and Claude Code
> transcript data. Since this is a new project (2 weeks old), patterns are inferred
> from commit clustering, PR cadence, and the tooling you've already built.

---

## BY THE NUMBERS

- **Total commits analyzed:** 61 (main + feature branches)
- **Total PRs:** 98 (high-velocity, branch-per-task workflow)
- **Unique task clusters:** 8
- **Active development days:** 5 (Mar 4–8), with founding period Feb 23–Mar 6
- **Commits per active day:** ~15 average
- **Time likely spent re-establishing context:** ~2–4hr total (estimated across sessions requiring re-explanation of evidence tiers, graph slugs, ingestion format, and data conventions)
- **Highest-leverage automation opportunity:** Fully autonomous source ingestion — you ingest sources in ~40% of sessions, each requiring 5–10 turns of context setup, stat extraction, graph mapping, and JSON editing

---

## TASK CLUSTERS

| # | Cluster | Commits | Frequency | Repeatable? | Context Reset? | External Tools? |
|---|---------|---------|-----------|-------------|----------------|-----------------|
| 1 | **Source Ingestion** | 16 | 5–8×/week | Yes (highly) | Yes — slug taxonomy, evidence tiers, JSON format | WebFetch, sometimes manual paste |
| 2 | **Viz/UX Design Iteration** | 23 | 5–7×/week | Partially | Sometimes — design preferences | No |
| 3 | **Page/Feature Building** | 19 | 2–3×/week | No | Sometimes | No |
| 4 | **Data Quality / Stat Fixes** | 4 | 1–2×/week | Partially | Yes — weighted avg methodology | No |
| 5 | **Weekly Digest Pipeline** | 5 | 1×/week | Yes (fully) | No (CI handles it) | GitHub Actions, Claude API, research APIs |
| 6 | **Weekly Changelog** | 2 | 1×/week | Yes (fully) | No (skill exists) | GitHub API |
| 7 | **Signals Data Refresh** | 8 | 1–2×/week | Yes | Sometimes — BLS/signal schema | Python scripts, BLS API, GitHub API |
| 8 | **Navigation / OG / SEO** | 6 | 1×/week | No | No | No |

---

## SKILLS TO BUILD (highest ROI prompt patterns)

### **viz-review** · Frequency: 5–7×/week · Effort to build: Medium
> **What it does:** Reviews a Recharts visualization component for data accuracy, visual clarity, accessibility, and design consistency with the jobsdata.ai style system.
> **Why now:** 23 commits (38% of all work) involve viz/UX iteration. Commits like "Viz review: fix weighting, source ranges, adoption ladder, sparkline clarity" (f45ebd5, e60b791) show this is a repeated review-then-fix cycle.
> **Starter prompt:** "Read the specified React component. Check: (1) data accuracy — do displayed values match source JSON? (2) chart readability — axis labels, legends, color contrast (3) responsive layout — mobile breakpoints (4) consistency with existing components in src/components/. Output a prioritized fix list with MUST FIX / SHOULD FIX / NICE TO HAVE tiers."

### **data-quality-audit** · Frequency: 1–2×/week · Effort to build: Low
> **What it does:** Audits prediction JSON files for internal consistency — checks that hero stats match weighted averages, currentValue fields are up to date, source IDs are valid, and no duplicate entries exist.
> **Why now:** Commits like "Fix hero displacement stat to match weighted estimate (9→3%)" (c2d5c9c) and "Fix stale hero stats: productivity 20→21%" (ebad3a2) show manual stat drift detection. The full audit commit (ffb9be4) identified "8 MUST FIX + 13 SHOULD FIX items."
> **Starter prompt:** "Read all prediction JSON files in src/data/predictions/. For each: (1) recompute weighted average from history[] entries (2) compare to any currentValue or hero stat references in src/app/page.tsx (3) check all sourceId references exist in confirmed-sources.json (4) flag duplicate history entries by date+source. Output a report with discrepancies."

### **og-card-generator** · Frequency: 1×/week · Effort to build: Low
> **What it does:** Generates a Next.js `opengraph-image.tsx` file for a given route, following the established pattern from existing OG images.
> **Why now:** Commit 9201ee6 "Add route-specific OpenGraph images for all subpages" shows batch OG generation. As new pages are added (j-curve, firm-response), each needs an OG card following the same template.
> **Starter prompt:** "Read an existing opengraph-image.tsx (e.g., src/app/signals/opengraph-image.tsx) as a template. Generate a new one for the specified route, using the page's title, description, and key stats. Match the visual style exactly."

---

## MCP PLUGINS TO ADD (external service integrations)

### **BLS Data Fetcher** · Frequency: 1–2×/week · Already available: No
> **What I currently do manually:** Run Python scripts (`scripts/signals/fetch_bls.py`) to pull BLS employment data, then manually check if values have changed, then update signal JSON files.
> **What the plugin would enable:** Live BLS data lookup within Claude sessions — ask "what's the latest BLS nonfarm payroll?" and get structured data without leaving the conversation.
> **Setup note:** Requires BLS_API_KEY (already in .env.example). Could wrap the existing Python fetch scripts.

### **Research Paper Fetcher** · Frequency: 2–3×/week · Already available: Partially (via scripts)
> **What I currently do manually:** Run `npm run digest:fetch` separately, then paste URLs or paper titles into Claude for ingestion. Sometimes use WebFetch on individual papers.
> **What the plugin would enable:** Search OpenAlex/Semantic Scholar/arXiv directly from Claude — "find recent papers on AI labor displacement" → structured results with DOIs, abstracts, and relevance scores, ready for ingestion.
> **Setup note:** OpenAlex is free (no key). Semantic Scholar has optional API key. Could reuse existing adapters in `src/lib/api/`.

### **GitHub Commit Analyzer** · Frequency: 1×/week · Already available: No
> **What I currently do manually:** The weekly-changelog skill fetches commits via shell commands, but there's no way to query commit patterns, file change frequency, or contributor stats interactively.
> **What the plugin would enable:** "Show me which prediction files changed most this week" or "what sources were ingested since Monday" — structured git analytics without manual log parsing.
> **Setup note:** Could use `gh api` or local git commands. Low auth friction.

---

## AGENTS TO BUILD (autonomous multi-step workflows)

### **Weekly Research Digest Agent** · Current turns: ~8–12 · Schedulable: Yes
> **Current friction:** The pipeline exists (`digest:fetch` → `digest:synthesize` → `ingest:from-digest` → `ingest:apply`) but requires manual triggering and review at each stage. The GitHub Action handles fetch+synthesize but ingestion still needs human approval.
> **What autonomous looks like:** Agent runs weekly: fetches papers → synthesizes with Claude API → identifies high-confidence ingestion candidates (score ≥ 8/10, clear stat match to existing graph) → auto-ingests those → creates PR with remaining candidates flagged for human review. Only escalates ambiguous cases.
> **Prerequisite:** Confidence threshold tuning on the digest scorer. The `auto_ingest: true` flag in the GitHub Action already supports this but isn't enabled.

### **Source Ingestion Agent** · Current turns: ~5–10 per source · Schedulable: No (event-driven)
> **Current friction:** Each ingestion requires: (1) fetch the source (2) extract all stats (3) map to correct prediction graph by unit (4) classify as data_point vs overlay (5) get user approval per stat (6) update 2–3 JSON files. The ingest skill handles the prompting but the user still babysits every step.
> **What autonomous looks like:** User pastes a URL → agent fetches, extracts all stats, maps to graphs, and presents a single approval table ("here are 6 stats I found, mapped to these graphs — approve all / edit / reject"). One turn instead of ten.
> **Prerequisite:** The existing `ingest` skill is 90% there. Needs a batch-approval UI step and stronger auto-mapping confidence.

### **Stat Drift Monitor Agent** · Current turns: N/A (doesn't exist yet) · Schedulable: Yes (daily/weekly)
> **Current friction:** Hero stats go stale when new data points are ingested but the hero section isn't updated. Discovered manually (commits c2d5c9c, ebad3a2).
> **What autonomous looks like:** After any ingestion, agent automatically recomputes weighted averages for affected graphs → compares to hero stats → if drift > 1pp, auto-updates hero or flags for review.
> **Prerequisite:** `data-quality-audit` skill (above).

---

## CLAUDE.md ADDITIONS (persistent context)

### **jobsdata.ai (ai-labor-predictions)** · Current re-explanation frequency: nearly every session
> **Should always know:**
> - Graph slug taxonomy: 17 graphs organized as `predictions/{category}/{slug}.json` — displacement (8), wages (5), adoption (4)
> - Evidence tier system: Tier 1 = peer-reviewed/govt stats, Tier 2 = think tanks/intl orgs, Tier 3 = major press, Tier 4 = social/blogs
> - Ingestion format: `history[]` entries need `date`, `value`, `confidenceInterval`, `sourceIds[]`, `evidenceTier`, `metricType`; `overlays[]` need `date`, `direction`, `sourceIds[]`, `label`
> - Hero stats are manually set in `src/app/page.tsx` and must match weighted averages from prediction files
> - Source IDs follow pattern: `author-year` or `org-year` (e.g., `brynjolfsson-2024`, `bls-2026-q1`)
> - Confirmed sources registry at `src/data/confirmed-sources.json` — every source must appear here with `usedIn[]` array
> - Design preferences: dark theme primary, Recharts for all viz, Tailwind CSS, no emojis in data, practitioner-first tone
> - `last-updated.json` must be updated on every ingestion
> - Negative values for job losses/wage declines, ranges → midpoints, exact quotes only
> - Current site sections: Home, Predictions (17 graphs), Signals, History, J-Curve, About
>
> **Current CLAUDE.md location:** doesn't exist yet (no CLAUDE.md in project root)

---

## PATTERNS TO LEAVE ALONE

| Cluster | Why it's fine as-is |
|---------|-------------------|
| **Page/Feature Building** (J-curve, history, firm-response) | Each page is architecturally unique. Too bespoke to templatize. |
| **Navigation Redesign** | Happens rarely (1 major redesign so far), highly context-dependent. |
| **One-off Data Corrections** | Fixing a specific typo or stat mismatch is faster to do ad-hoc than to build tooling around. |
| **OG Image Tweaks** | Once the pattern is set, these are quick copy-paste jobs. The og-card-generator skill above handles the creation; individual tweaks are one-off. |

---

## RECOMMENDED BUILD ORDER

1. **CLAUDE.md for jobsdata.ai** — Eliminates the #1 source of context re-establishment. Every session starts faster. Zero effort, highest ROI. (~15 min to write)

2. **`data-quality-audit` skill** — Catches stat drift automatically instead of discovering it via broken hero numbers. Prevents embarrassing public-facing errors. (~30 min to build)

3. **`viz-review` skill** — 38% of commits are viz iteration. A structured review checklist will catch issues in one pass instead of 2–3 rounds. (~45 min to build)

4. **Source Ingestion Agent (batch mode)** — Reduce 5–10 turns per ingestion to 1 approval turn. At 5–8 ingestions/week, this saves 30–60 min/week. (~2hr to build, extends existing ingest skill)

5. **BLS/Research Paper MCP plugin** — Eliminates context-switching to terminal for data fetches. Nice quality-of-life improvement once the higher-ROI items are done. (~2hr to build)

---

*Analysis generated March 8, 2026 from 61 commits, 98 PRs, and project structure review.*
