# Labor Economist Site Review — 2026-10-02

**Target:** jobsdata.ai full site at `main` 4db7a03 (deployed 2026-10-02): 20 prediction charts, homepage hero, funnel strip, productivity section, adoption ladder.
**Evidence vintage:** data files through 2026-09-22; economist frameworks re-verified against their published work in October 2026 (skill `labor-economist-review`, voices sourced in its `references/`).
**Method:** eight-lens review (Acemoglu, Brynjolfsson, Gimbel, Bessen, Kolko, Imas, Kinder, Rock) run as three read-only passes — displacement, wages, adoption/exposure/signals + homepage — with source spot-checks of the heaviest points. Quotes are verbatim from sourced material; synthesis is labelled inference. Full per-chart assessments are in the appendices.

## Executive summary

The September corrections (#738, #739, #745) worked where they were aimed. The hero triad (~21% time saved per task, ~1% projected net loss, 0% measured) now sits close to where all eight economists stand in autumn 2026: micro gains are real, the aggregate has not moved, credible net-loss forecasts are low single digits, and the one live signal — early-career employment in exposed jobs — is real but contested. Every chart's stored value matches its computed aggregate, and the early-career chart is a model of how to show a contested result with its authors' own caveats.

What still overstates is no longer the big data errors but two things the September pass did not reach. First, **a second tier of unsupported legacy points** that carry real weight: healthcare's NEJM 27.5 (the DOI is an AI-scribes paper), education's BLS 3 (BLS shows ~0%), creative's Forrester 20 (the source says 7.5% of ad-agency jobs), robots' McKinsey 7 (site-derived), median wage's Goldman +1, BLS ECI −1 and IMF −1 (51% of that headline's weight, no supporting figure), and freelancer's Ramp −28 and Upwork 2023 −5. Overall still plots a 14%-probability scenario (FRI 6), a model equilibrium (NBER 11.5) and a TFP bound (Acemoglu 0.5) as job loss. Second, **surfaces that were not rebuilt when the data were**: page summaries, "best estimate" lines and trend arrows still mix in proxies; context paragraphs on overall and four adoption/signal pages describe pre-correction constructs; the funnel strip shows gross and global figures under net US labels; the adoption ladder shows 10% under a 23.8% chart; and two exposure charts headline averages their own disclaimers reject. A reader who clicks the hero's "~1%" lands on a page saying 1.4%, "projection median ~4%" and "cluster around 5–12%."

The economists would converge on the same diagnosis (Gimbel's and Kolko's point that a careful reader finds the site disagreeing with itself one click down) and the same remedy: fewer, cleaner points; summaries computed on like-for-like evidence; and one methodology paragraph explaining why sector charts are not additive. None of it needs new chart dimensions.

## Top priorities

1. **[High · Data integrity] Remove or overlay the remaining unsupported points.** Healthcare NEJM 27.5 (→ headline ≈ −0.7, so the healthcare framing needs a rethink); education BLS 3; creative Forrester 20 (correct value 7.5, dated 2023, and flag CVL as gross); robots McKinsey 7 and Acemoglu-Restrepo 3.3 to overlay (→ 2.9); median-wage Goldman +1, BLS ECI −1, IMF −1; freelancer Ramp −28 and Upwork 2023 −5 (and drop Upwork −13's unsupported `sampleSize`); overall FRI 6, NBER w33867 11.5 and Acemoglu 0.5 to overlays (→ overall 1.0, matching the hero); early-career St. Louis Fed 1.0 to overlay (→ 13.4). *Consensus: Gimbel, Kolko, Acemoglu, Rock.*
2. **[High · Framing] Make every page agree with its own evidence.** Compute "observed so far", projection median and "best estimate" from non-proxy points; set `trendComparable: false` on displacement and wage charts; rewrite stale context copy (overall "5–12%", earnings calls "workforce mentions", adoption "in production", business formation "+16% since ChatGPT", genAI adoption, tech's "+1.3% sector net" box and "+8.6%" sign, high-skill "gap is widening", freelancer "hourly rates dropped 13.7%"); fix the overall disclaimer that calls the Anthropic scenarios "plotted"; mirror the copy fixes in chat `site-content.ts`. *Consensus: all eight; Gimbel and Kolko lead.*
3. **[High · Framing] Rebuild the homepage surfaces.** Funnel strip: net forecasts (or label the row "gross"), US exposure figures, Stanford/ADP as employment not postings, Denmark/euro-area labelled or swapped, Anthropic bar 36→49. Adoption ladder: current BTOS value, drop the unsupported "Piloting" rung, Bick "used for work (any)" (weekly ≈23%), firm vs worker rungs labelled. Exposure charts: headline the range, not the mean. *Consensus: Rock, Kolko, Imas, Gimbel.*
4. **[Medium · Data integrity] Apply one proxy rule set everywhere.** Indeed 4.7 (median wage) and the entry-level gap points as relative-gap proxies; Tufts gross on healthcare and education; single-occupation forecasts (Metaculus software developers 15.1 on tech); the Atlanta Fed/Duke one-year expectation on overall; vendor claims (Salesforce 30); non-US (IMF 3.6); PWBM's 160M `sampleSize`. Use the August Metaculus vintage on sector charts. *Consensus: Kolko, Rock, Bessen.*
5. **[Medium · Viz] Fix overlay direction.** Normalize all overlays to the documented convention (up = metric higher) and color by chart polarity (`trendIsBad`) instead of fixed green/red. *Consensus: Gimbel.*
6. **[Medium · Framing] One methodology section.** Why sector headlines are not additive with the aggregate (gross, exposure, postings and age-specific evidence); the 2026 federal-statistics integrity caveat (Kolko); "time saved per task" for the productivity stat; Acemoglu's input described as a ≤2–4% ceiling. *Consensus: Acemoglu, Kolko, Kinder.*

## Prior-review follow-through

| Source of recommendations | Done | Partial | Not done |
|---|---|---|---|
| Sep 24 review — displacement items (1, 2, 3, 4, 5, 10, 11) | 5 | 5 | 5 |
| Sep 24 review — wage items, plus June wage recs | 4 | 6 | 6 |
| Sep 24 review — homepage/adoption items (6–9) | 2 | 0 | 2 |
| June 2026 review — homepage, adoption, exposure | 3 | 4 | 3 |
| **Total** | **14** | **15** | **16** |

Done includes every headline source error from September (healthcare BLS sign, OECD white-collar, UOC creative, robots WEF, Crane-Soto, IMF 8.5, Hui −5.2, Census −5), the earnings-call recomputation, the business-formation cleanup and the `currentValue` sync. The not-done set is concentrated in page summaries, trend arrows, overlay direction, the funnel strip, the adoption ladder and the hand checks — which this review now resolves: NEJM, BLS education, McKinsey robots, Ramp, Goldman +1, Upwork 2023 and BLS OES all fail verification; the Metaculus K-12 sign remains unresolved (source returns 403).

## NARRATIVE COHERENCE ASSESSMENT

1. **Hero vs. the overall-displacement page (High).**
   - The hero shows "~1% projected net job loss by 2030 · median of 4 forecasts (0.6–3%)" and links to `/predictions/overall-us-displacement`.
   - That page headlines 1.4 (weighted, including proxies) and computes "Projections range 0.4–11.5% (median ~4%)" across 13 projected points: gross Goldman 9, WEF 8, Forrester 6, Tufts 6, FRI 6, and others.
   - Its CONTEXT_MAP paragraph says projections "cluster around 5-12% by 2030."
   - The page disclaimer describes three Anthropic Institute scenario points as "plotted." They are overlays, which is the correct treatment, so the disclaimer is stale.
   - Net effect: the hero's careful net-vs-gross distinction is undone one click later. The fixes (non-proxy summaries, best estimate from non-proxy points, rewritten context, corrected disclaimer) are prior items 2 and 4, owned by the displacement reviewer. The coherence failure is the homepage's.
2. **Hero vs. funnel (High).** In the funnel's "Projected" row two of the three bars are gross, and its median is ~7. Readers see 1% and then 7–8% for "jobs lost by 2030" within one scroll.
3. **Intro copy vs. the evidence the page features (Medium).**
   - "One pattern. AI adoption is accelerating, productivity is climbing, entry-level and freelance work is compressing."
     - **Accelerating:** BTOS rose from 17.3 to 23.8 over ten months, after a Dec–May plateau of 17–20. Revelio reports the pace of new firm adoption "has slowed from its spring 2026 peak." "Rising" is defensible; "accelerating" is contested.
     - **Productivity is climbing:** true of BLS, but Gimbel: "strong, but not unusually so."
     - **Entry-level compressing:** this is the contested exception, and the first Featured Read says so.
   - Kolko would object to "one pattern" itself: his reading is that labor measures "point in all directions."
   - *Inference:* change "one pattern" to "a consistent picture," and change "entry-level… is compressing" to "entry-level hiring shows early, contested stress." Both edits use language from Imas & Schaal, which the page already features.
4. **Concept bars (Medium).**
   - "We've Seen This Before… AI is compressing that timeline." Kolko and Gimbel, citing Budget Lab, find the occupational mix "has changed over the past three years at a similar pace to" 1984 and 1996 "and has not accelerated since the release of ChatGPT." The site asserts the opposite without a source.
   - "What if AI Creates More Jobs… Every general-purpose technology eventually created more jobs than it displaced." Bessen's own caveat is "employment in these industries grew rapidly for many decades. Until it didn't." The claim holds economy-wide, not by sector.
   - Also: "+0.7pp Productivity growth" as a bare stat. The copy concedes "no one can yet show AI caused it," but the big number reads as an AI effect.
5. **Exposure figures across the site (Low).** "40% of jobs are AI-exposed" (funnel annotation, "Why Is Nothing Changing?" bar) is the IMF's *global* figure. The site's US exposure chart shows 41.7, a meaningless average, and the FunnelStrip Anthropic bar should read 49. Pick one sourced US figure. Eloundou's high-exposure share (~19% with half or more of tasks exposed) or the BLS exposure categories would match a US-labelled claim.
6. **Sector reconciliation.** Out of this scope. The skill requires it, and the displacement reviewer should check it.

### Sector vs. aggregate (displacement review)

At rough sector employment weights, the sector headlines sum to about twice the overall chart's implied ~2.3M jobs, with robots alone taking most of it. The cause is uneven proxy rules rather than evidence (see priority 4). A methodology line explaining non-additivity fixes the reader-facing problem without new chart dimensions.

## HERO STAT AUDIT (HeroTriad.tsx, all eight lenses)

**1. "~21% Productivity boost — median of 9 controlled studies; range 13–56%" (center 21, low 13, high 56).** Median verified in code. Robust to dropping METR or Peng.
- **Acemoglu:** a task-level figure from easy-to-learn, well-specified tasks. Under Hulten it says nothing about aggregate productivity until multiplied by the share of tasks affected (~20% exposed, 23% profitably automatable in his inputs). "Productivity boost" without "per task" invites the macro reading.
- **Brynjolfsson:** consistent with the QJE result (15% on average, larger for novices) and the field experiments. He would accept the number and want the J-curve caveat beside it.
- **Gimbel:** the number is fine. The label is not: "time saved per task in studies" is the measured thing, while "productivity boost" implies output. She would also point out that 9 studies give no confidence interval.
- **Bessen:** does not answer the jobs question. Employment depends on output growth relative to productivity growth. Neutral.
- **Kolko:** firm studies describe early adopters. Self-selected tasks and firms; the range 13–56 is honest.
- **Imas:** the micro number is real. The macro companion on the site is 2.3% of US work hours saved (Bick et al. 2026). Showing 21% alone makes the micro–macro gap invisible on the homepage, even though that gap is the "J-curve" page's whole argument.
- **Kinder:** gains concentrated among less-experienced workers (QJE) is a hopeful distributional fact the caption could carry. Not required.
- **Rock:** the grain is the task. The number belongs in a task-level frame. The tooling multiplier (15% → 47–56% of tasks with LLM-powered software) is the missing context.
- **Verdict:** keep 21. Change the label to "Time saved per task," or add "in studied tasks" to the caption, as the June review recommended (not done). Priority Medium.

**2. "~1% Projected net job loss by 2030 — median of 4 forecasts (0.6–3%)" (center 1, low 0.6, high 3).** Inputs: Goldman net 0.6, Bloom US 1.2, Metaculus 1.3, Acemoglu 3. Median 1.25 → 1. Arithmetic verified.
- **Acemoglu:** his number is "less than two to four percent," a spoken, net, five-year *upper bound*. It is plotted as a point of 3 with a 2–4 band. The hero's high end is therefore his ceiling, not his forecast. The median does not change if the value is treated as ≤3, because it stays 1.2. His view is consistent with ~1%.
- **Brynjolfsson:** he would say the aggregate understates the entry-level concentration. That is the measured-loss caption's job, and it is done there.
- **Gimbel:** four forecasts with different constructs and horizons:
  - Goldman: unemployment-rate rise over a *decade*
  - Bloom: firms' own 3-year expectation (to ~2029)
  - Metaculus: an employment shortfall by 2030 relative to 2025
  - Acemoglu: a 5-year ceiling (~2031)
  "By 2030" is approximate for two of the four. Acceptable for a hand-set median if the caption says "net forecasts, ~2030."
- **Bessen:** net is the right construct. Gross churn (WEF 92M displaced and 170M created) belongs elsewhere.
- **Kolko:** n=4 is thin. The range 0.6–3 is honest about it. He would add that forecasts made in the "first inning" are weak signals.
- **Imas:** his and Moll's bounded-growth view is consistent with a small net number. He would flag that the aggregate hides the junior margin.
- **Kinder:** ~1% is about 1.7M workers, concentrated in clerical and entry-level roles. She would want the caption or the linked page to name who.
- **Rock:** no comment on the number. Outcomes depend on the software layer.
- **Verdict:** defensible and the best-sourced projected figure on the site. Two fixes:
  1. Describe Acemoglu as "≤2–4%" in the CLAUDE.md rationale and the chart excerpt (the excerpt already says so).
  2. Make the linked page agree with the hero (coherence item 1). Priority High for the page, Low for the stat.

**3. "~0% Measured US job loss — early job impacts concentrated among workers 22–25" (center 0, low 0, high 0.2).** Deliberate; not relitigated.
- **Acemoglu:** consistent with his JOLE finding of "no discernible relationship between AI exposure and employment or wage growth" at the occupation and industry level.
- **Brynjolfsson:** Canaries fact 1, "no economy-wide displacement," agrees. Fact 2, the 19% early-career gap, is what the caption points to.
- **Gimbel:** this is her finding (SDID null; churn, unemployed exposure and usage "all remain flat"). She would add that it holds "as of yet."
- **Bessen:** matches history: automation separations are gradual (~0.8% a year), not mass layoffs.
- **Kolko:** agrees, with two notes:
  - the caption's "concentrated among workers 22–25" should carry "contested" (remote-work confound, pre-2022 trends)
  - 2026 statistical-integrity concerns ("the worst period for US statistical integrity since…") are a caveat the June review recommended. It has not been added; it belongs on the methodology page, not the hero.
- **Imas:** "aggregate stability can coexist with early stress in exposed subgroups." The caption expresses exactly this. He would add "contested."
- **Kinder:** "might miss… a small fire starting on the stove, but would clearly detect if the house was burning down." She endorses 0 as a statement about the house, not the kitchen.
- **Rock:** no objection.
- **Verdict:** the strongest stat on the site. Optional caption tweak: "Early, contested signs among workers 22–25." New corroboration exists in the Featured Reads: Census CES finds exposed-major graduates 5pp less likely to be employed. Priority Low.

## WHAT THE SITE GETS RIGHT

- **The hero triad's separation of measured and projected, now hand-set from an audit.** It no longer drifts with each ingest. It is the honest framing Gimbel's pre-register-and-watch stance and Kinder's "reality one" both describe.
- **The 21% median** is computed in code, excludes observational, survey and autonomous-agent studies with stated reasons, and harmonizes throughput to time saved. Brynjolfsson and Rock would respect the discipline. Dropping the most favorable study does not move it.
- **BTOS as the adoption anchor,** with values dated to reference-period end, standard errors in the excerpts, and the wording change disclosed in the disclaimer.
- **Disclaimers on the two exposure charts.** "Read the spread here as a disagreement about definitions, not about facts." This is Gimbel's February 2026 finding put in plain English. Only the headline needs to catch up.
- **`ai-business-formation` cut to the two difference-in-differences papers.** The pandemic BFS surge and the vendor projections were moved to overlays. That is Kolko's timing test applied.
- **The earnings-call chart retitled** to what FactSet measures, with counts recomputed from source.
- **currentValue synced** on all 20 charts.
- **Featured Reads** that put the contested reading of the junior-hiring evidence (Imas & Schaal) and the "diluted not displaced" firm-side finding (Chandar & Klein Teeselink) at the top of the homepage. A site that features the counter-evidence to its own most-cited signal earns trust.

## HONEST LIMITS

- **Adoption intensity is unmeasured in official US data.** BTOS is binary until its new AI questions report. Every reach-versus-depth argument on the site leans on Fed district surveys and vendor telemetry.
- **No exposure rubric has been validated against realized displacement,** and LLM raters disagree up to 3.6-fold. Any single exposure number is a modeling choice.
- **The early-career signal cannot yet be attributed.** ADP and postings data disagree on the remote-work control. The within-firm estimate attenuates. Nordic administrative data show nulls.
- **Forecasts of net loss are few, use different horizons, and include a spoken bound.** n=4 is the honest sample.
- **Self-reported AI use is biased in both directions:** stigma understates it, and license or "any use" framing overstates it. No administrative individual-level measure exists.
- **2026 federal statistics carry integrity and granularity risk** (Kolko, Sep 2026). That asterisk applies to every CPS-derived "0."

## RESEARCH GAPS (by economist priority)

- **Gimbel:** firm-level AI usage linked to headcount, which is her "dream dataset." In the meantime, the new BTOS AI-headcount question deserves a chart the moment it publishes.
- **Kolko:** usage-based rather than exposure-based measures by sector, plus a remote-work-controlled replication on payroll data, would settle the junior-hiring attribution.
- **Imas:** depth measures on the adoption pages: share of hours (RPS, now on FRED) and share of staff inside adopters (NY Fed). Also adoption gaps by gender and education, which are already in the overlays and should be surfaced.
- **Kinder:** a demographic cut of any displacement or attrition signal: clerical, women, over-55, non-degree. The Brookings and Manning adaptive-capacity data are on the exposure chart only as overlays.
- **Acemoglu:** evidence that separates automation-type from augmentation-type deployment (AEI automation and augmentation shares, Census "66% of AI users augment-only"), tracked over time.
- **Brynjolfsson and Rock:** an intangible-investment or takeoff indicator, such as the DEL Takeoff Tracker or BLS TFP, to place the site on the J-curve rather than imply a takeoff.
- **Bessen:** output and price data for exposed sectors, to judge demand elasticity. Formation and employment at new AI-era firms (the Bena et al. +7% employment result) is the nearest thing currently on the site.

## Completion record

- **Target reviewed:** 20 prediction charts, homepage hero, funnel strip, Featured Reads, productivity section, adoption ladder, at `main` 4db7a03.
- **Evidence vintage:** data through 2026-09-22; economist positions as of October 2026.
- **Decisive findings:** priorities 1–3 above.
- **Files changed:** none in `src/`; this report only.
- **Checks run:** `computeAggregate` recomputed for all charts (matches `currentValue` 20/20); counterfactual headlines computed with the site's weighting; source spot-checks against BLS OOH, Crossref, Forrester, Anthropic Economic Index, FactSet, Dallas Fed, Indeed, Ramp.
- **Unresolved:** Metaculus K-12 sign (403); Upwork, Goldman and PwC reports (403, checked via stored excerpts); Penn Wharton 40% denominator; Goldman 3.2pp headcount claim; Bick weekly-use figure.

---

# Appendix A — Displacement charts

### Labor economist review: displacement section (10 charts)

**Date:** 2026-10-02
**Target:** `src/data/predictions/displacement/*.json` at `origin/main` 4db7a03. I read the files from the local branch `chore/economist-review-sync`, where `git diff origin/main HEAD -- src/` is empty. I did not check out `main`, to avoid disturbing the working tree. Read-only: no repo files were changed.
**Evidence vintage:** newest plotted point is 2026-09-10 (Orr, Tucker & Warren, early-career). The newest overlay is 2026-09-22.
**Method:** `labor-economist-review` SKILL.md, single-chart format. Aggregates were recomputed with a Python port of `computeAggregate` (`src/lib/prediction-stats.ts`) and match the stored `currentValue` on all 10 charts. Page summaries ("Observed so far", "Projections … median", "Best estimate", trend arrow) were recomputed from `PredictionDetailClient.tsx` logic.
**Quotes:** economists are quoted only from text verbatim in SKILL.md. Anything marked *(inference)* is this review's synthesis.

##### Verification sources fetched during this review
- BLS OOH, Medical records specialists: "Employment of medical records specialists is projected to grow 8 percent from 2025 to 2035."
- BLS OOH, Teacher assistants: "Employment of teacher assistants is projected to show little or no change from 2025 to 2035." That is 1,463,000 to 1,458,000, about −0.3%.
- Crossref metadata for DOI 10.1056/CAT.23.0404: "Ambient Artificial Intelligence Scribes to Alleviate the Burden of Clinical Documentation", *NEJM Catalyst*, Feb 21 2024.
- Forrester press release (`forrester-agency-ai-workforce-2030`, June 15 2023): "by 2030, US advertising agencies and related services companies will lose 32,000 jobs to automation — 7.5% of the total agency workforce." The release does not contain "creative teams will shrink 15–25%" or "20% of marketing content … by 2028". It says the agency share of creative roles "will grow".
- Blocked (403): the Metaculus Labor Hub and the NEJM Catalyst page itself.

---

#### Summary table (as a reader sees each page today)

| Chart | Headline (all pts) | Non-proxy only | "Observed so far" shown / non-proxy | Projection median shown / non-proxy | "Best estimate" point | Trend arrow |
|---|---|---|---|---|---|---|
| Overall | 1.4 | 0.4 | 0.4 / 0.0 | **4** / 1.2 | Canaries Aug 2026, 0 (non-proxy) | ▼, from Eisfeldt postings proxy 2.4 to Canaries 0 |
| Early-career | 12.3 | 16.8 | (single type) | — | **Orr-Tucker-Warren 6.4 (proxy)** | ▲, from St. Louis Fed proxy 1.0 to OTW proxy 6.4 |
| Tech | 8.6 | 9.1 | 7.0 / 0.0 | 15.1 / 15.1 | Tucker QWI 9 (proxy) | ▲, from Brookings 0 to Indeed postings proxy 9.6 |
| White-collar | 2.1 | 1.3 | 1.5 / 0.2 | 2.5 / 7.0 | Tucker QWI 3.7 (proxy) | ▲, from Chicago Fed −4.05 to Tucker proxy 3.7 |
| Financial | 7.3 | 10.5 | — | 6.0 / 11.1 | Fed Atl/Duke 1.2 (proxy, one-year) | none |
| Healthcare admin | 6.0 | 6.0 | — | 4.2 | **BLS OOH −8 (employment growth)** | none |
| Education | 3.3 | 3.3 | — | 3 | BLS 3 | none |
| Creative | 12.0 | 14.3 | 10.7 / none | 9.8 / 20 | Pixiv uploads 14.3 (proxy) | ▲, from NBER postings proxy 6.3 to Pixiv proxy 14.3 |
| Customer service | 47.8 | 38.0 | 53.6 / 30 | 55 | Shopify 40 (vendor proxy) | ▲, from Klarna 66 to Stanford DEL single firm 82 |
| Robots | 3.6 | n/a (5/5 proxies) | 3.3 | 4.35 | BLS mining 1.6 (proxy) | none |

Seven of ten "Best estimate" lines name a proxy point. Six of ten pages show a trend arrow whose two endpoints come from different instruments. No displacement chart sets `trendComparable`.

---

#### Prior-review follow-through (2026-09-24 items that apply to displacement)

| # | Item | Status | Evidence in current files |
|---|---|---|---|
| 1a | Healthcare BLS +8% growth plotted as displacement | **Done** (sign) | Now −8, which matches BLS OOH (+8%, 2025–35, verified). Two loose ends: (i) `source-content/bls-health-admin-2025.json` keyFindings still say "projected to decline 8% through 2033", which contradicts the excerpt and BLS; (ii) the construct problem below (1b) remains. |
| 1b | Tech Canaries +1.3 sign | **Partial** | The point is gone from `history` and now sits as an overlay. But `AgeWeightedMethodology.tsx` still renders "Weighted sector net +1.3%" and "The sector-wide +1.3% average…" directly under an 8.6% displacement hero. The tech `CONTEXT_MAP` template prints "The sector-wide average of **+8.6%** obscures a K-shaped…", because the `v > 0 ? "+"` prefix was written when the value was a growth rate. It also restates superseded Canaries numbers (~20%, +9%). |
| 1c | OECD white-collar 21.5 | **Done** | Removed. The only 21.5 left is the Anthropic Institute extreme-scenario overlay. |
| 1d | UOC creative 30 | **Done** | Removed. |
| 1e | Robots WEF 5M plotted as 5% | **Done** | Now an overlay: "net 5M global job loss". |
| 1f | Acemoglu excerpts | **Partial** | Excerpts are now accurate. The Goldman Exchanges excerpt matches SKILL.md verbatim, and the robots Acemoglu point is removed. But `acemoglu-macro-2024` (a TFP bound of 0.5) is still plotted on overall as a jobs number, and its own rationale says "there is no documented TFP-to-displacement conversion". |
| 1g | Crane-Soto citing Canaries | **Done** | Overlay only, labelled "cites Brynjolfsson et al." |
| 2 | Summaries on non-proxy points; plot Goldman net 0.6 | **Partial** | Goldman net 0.6 is plotted on overall. `PredictionDetailClient.tsx` still computes `observedMean`, the projection median and min/max from all points, proxies included (lines 156–209). Overall shows "median ~4" against a non-proxy median of 1.2. |
| 3 | Dedupe by source team | **Partial, one inversion** | Overall plots three Yale Budget Lab points. Two of them (Oct 2025, Mar 2026) are vintages of the same CPS tracker, and the newest vintage (`yale-budgetlab-tracker-sep-2026`, Aug CPS) is an overlay. That is backwards: superseded vintages are plotted and the current one is not. NBER w33867 is registered twice (`nber-ai-productivity-unemployment-2025` plotted, `nber-wang-wong-tech-unemployment-2025` overlay, same URL). Acemoglu is plotted twice on overall (TFP proxy plus Exchanges). |
| 4 | `trendComparable: false`; "best estimate" from non-proxy | **Not done** | No displacement JSON sets `trendComparable`. Only `workforce-ai-use` and `high-skill-premium` do, site-wide. `bestEstimate` is still `findLast(tier === 1)` regardless of proxy status. PR #738 lists this as a follow-up. |
| 5 | One proxy rule set; dataType mislabels; tiers | **Partial** | Proxies are now widely applied, but inconsistently: see "Proxy rule inconsistencies" below. Tiers are unchanged: Pearson 10-K is T3 (a 10-K is T1 by the rubric); Chegg is T3 on one record and T2 on another; Klarna's PR Newswire release and Shopify's earnings remark are T1. The Benioff/Salesforce podcast remark is T3 (acceptable). HBR is T3 on overlays (acceptable). |
| 10 | Overlay direction inconsistency | **Not done** | CLAUDE.md:125 says displacement charts use "up = more displacement". `SignalStrip.tsx:46–47` colors `up` green and `down` red, and `SourceList.tsx` does the same, on every chart. Result: overlays that *follow* the convention render "more displacement" in green. Counts (up/down/neutral): healthcare 7/21/5, creative 10/18/3, financial 10/20/2 and education 7/12/8 are mostly legacy "down = bad". White-collar 82/19/14 and early-career 27/16/5 mostly follow the convention. Overall 56/95/71, tech 32/48/10, customer service 27/19/2 and robots 9/9/9 mix both within one chart. Examples on overall: "Goldman 300M … substitute one-fourth" is `down` while "Frey & Osborne 47%" is `up`; "MIT Iceberg 11.7% replaceable" is `down`; "Frank et al. unemployment risk rose" is `down`. On white-collar: "Revelio: most AI-exposed occupations down ~6%" is `down`. |
| 11 | Hand checks | **Not done (all three left as is)** | **Healthcare NEJM 27.5:** confirmed bad. The DOI resolves to the Feb 2024 AI-scribes paper, not "AI in Healthcare Administration: A Systematic Review", and "20–35% admin cost reduction" is not a jobs share in any case. Still the second-heaviest point (23.7%). **Education BLS 3:** current BLS OOH shows teacher assistants "little or no change" (−0.3%) for 2025–35, so "decline 3%" is unsupported by the cited page. **Metaculus K-12 sign:** unresolved. The chart excerpt says "+1.3% by 2030" but `source-content/metaculus-labor-hub-2026.json` says "−1.3% by 2030, +1.3% by 2035"; the hub returned 403. **Robots McKinsey 7 / Acemoglu-Restrepo 3.3:** still plotted. Their own rationales say "no 7% figure in the source … could not be reproduced" and "denominator is undocumented". Under PR #738's own rule ("removed only when the source doesn't contain the number"), McKinsey 7 should go. |

**Counts for items 1, 2, 3, 4, 5, 10, 11 (sub-items of 1 counted separately; 11 counted for its three displacement checks):**
- Done: 5 (1a, 1c, 1d, 1e, 1g)
- Partial: 5 (1b, 1f, 2, 3, 5)
- Not done: 5 (4, 10, and 11 healthcare, education and robots)

**New source errors found in this pass (not in the September list):**
- **Creative: Forrester 20 is unsupported.** The cited press release (verified) gives 7.5% of US ad-agency jobs by 2030. It is dated June 2023, not 2025-02-15, and it says creative-role share grows. This is the third-heaviest point.
- **Education: BLS 3** (above).
- **Tech: `bls-programmer-employment-observed`** cites the OES May 2023 table for a "27.5% drop in two years after ChatGPT". A May 2023 OES table cannot show a two-year post-ChatGPT change. The figure circulates from CPS-based press coverage. The registry record needs the real source.
- **Robots: BLS mining 1.6.** The excerpt says "driven by robotics and drones" while the proxy rationale says "BLS does not attribute the decline to robotics", and the KB notes the page returned 403. The point is unverified either way.
- **White-collar: PWBM 0.75** carries `sampleSize: 160000000`. That is the labor force, not a sample, so it takes the 2× size boost and becomes the heaviest point (19.3%).

---

#### Sector vs aggregate coherence

**1. The sector charts imply more displacement than the aggregate allows, and no page says so.**
Rough arithmetic *(inference; employment bases are approximate, and BLS Information is 2.77M per the site's own Mar 2026 overlay)*:
- Tech, 8.6% of roughly 2.8–5M Information plus computer-systems-design jobs: about 0.25–0.45M
- Financial, 7.3% of about 6.5–7M finance and insurance jobs: about 0.5M
- Education, 3.3% of about 13–14M: about 0.45M
- Healthcare admin, 6% of a few million admin jobs: about 0.1–0.4M
- Creative, 12% of about 2–2.5M: about 0.25–0.3M
- Robots, 3.6% of physical-task jobs: about 1.4M even on a conservative 40M base

Robots alone takes most of the overall chart's 1.4% (about 2.3M jobs), and together the sectors exceed it by roughly 2×. They overshoot the hero's ~1% (about 1.7M) by more. Some overlap exists (tech sits inside white-collar; early-career overlaps everything), but overlap makes the sum smaller, not the aggregate larger.

**2. The gap comes from constructs, not from different beliefs about AI.**
- The aggregate's non-proxy core is net and measured: Yale, Canaries, SIEPR and Dallas Fed at about 0; Goldman net 0.6; Bloom 1.2; Metaculus 1.3.
- Sector headlines are carried by other constructs:
  - Gross exposure (Tufts, on six sector charts)
  - Single-occupation projections: Metaculus software developers 15.1 is the heaviest tech point; Metaculus "most vulnerable AI-exposed occupations" 11.4 is plotted as white-collar
  - Total-employment projections with no AI attribution (BLS OOH health, BLS education)
  - Cost-reduction and upload-volume measures (NEJM, Pixiv)
  - Exec surveys reported at the top of their own CI (Goldman finance 14 in [5,14], Dallas Fed tech 5 in [0.5,5])
  - Vendor self-reports (customer service)
- The aggregate itself was cleaned of these in #738; the sector charts were cleaned less.

**3. Vintages diverge.** Overall uses the Metaculus **August** vintage (1.3). Every sector chart uses the **April** vintage (software −15.1, financial −8.1, designers −4, K-12 ±1.3).

**4. Horizons and units diverge.**
- Customer service is "% of interactions automated" by 2028, a usage share and not a jobs share, yet it sits in the displacement grid next to "% of roles displaced".
- Early-career is a current-period relative gap.
- Robots is "% of physical-task jobs" (CLAUDE.md's taxonomy table still calls it "% of physical tasks automated").

**5. The hero and the overall page disagree.**
- The hero says ~1%, "Median of 4 forecasts (0.6–3%)". Clicking through lands on a 1.4% headline and "Projections range 0.37–11.5% (median ~4%)".
- The context copy says projections "cluster around 5–12% by 2030". That is stale: the non-proxy projection median is 1.2.
- With three fixes below (FRI to its probability-weighted 0.8, NBER w33867 equilibrium to overlay, Acemoglu TFP to overlay), the computed overall headline becomes **1.0**, which matches the hero without hand-setting it.

**6. The hero's own inputs.** Acemoglu's "less than two to four percent" is an upper bound. Plotting it as a central 3 is overstated (the source's own qualifier says so). The hero median (Goldman 0.6, Bloom 1.2, Metaculus 1.3, Acemoglu 3, giving about 1.25) is robust to this because Acemoglu sits at the top either way. Worth a footnote, not a change.

**Recommendation (respects the owner's preference for acknowledgment over new dimensions):**
- Add one methodology paragraph and one line on each sector page: "Sector charts include gross, exposure and single-occupation estimates that the aggregate excludes or discounts; summed, they exceed the aggregate. Read sector pages as relative risk, not as shares of the national total."
- Then apply the proxy-rule fixes below so the sector headlines carry the same constructs as the aggregate.

---

#### Proxy rule inconsistencies (item 5 detail)

| Rule (from #738) | Applied | Not applied |
|---|---|---|
| Gross is a proxy | Tufts on overall, creative, tech, financial, white-collar | **Tufts on healthcare (3.6) and education (8.3)**. Also the healthcare Tufts figure is all of Health Care & Social Assistance, not admin. CVL creative 21.4 ("consolidated, replaced, or eliminated") is not flagged either. |
| One occupation standing in for a sector is a proxy | BLS credit analysts (fin), BLS paralegals (WC), BLS programmers (tech), BLS mining (robots) | **BLS MLR medical transcriptionists 4.7 and BLS OOH medical records −8 (healthcare); BLS education 3; Metaculus software developers 15.1 (tech), designers 4 (creative), financial specialists 8.1 (fin), "most vulnerable occupations" 11.4 (WC)** |
| A one-year expectation is a proxy in a "by 2030" chart | Fed Atl/Duke on financial and white-collar | **Fed Atl/Duke 0.37 on overall**, the heaviest point there (8.1%) |
| Non-US is a proxy | Pixiv (JP), Bloomberg Intelligence (global banks), Morgan Stanley (global) | **IMF 3.6 on white-collar** (multi-country, "regions with high AI-skill demand") |
| A vendor claim is a proxy | Klarna, Shopify, Salesforce podcast, Stanford DEL single firm | **Salesforce State of Service 30**, a vendor-published self-estimate and the heaviest CS point |
| No AI attribution needs a proxy and a central conversion | Dallas Fed tech (cf=1, range 0.1–1) | The value sits at the **top** of its own range. Chicago Fed −4.05 (WC; its qualifier says "not attributable to AI", 2019–24 COVID window) and PWBM 0.75 (2021–24 window, no counterfactual) are not proxies. |
| Scenarios are overlays | Anthropic Institute scenarios | **FRI 6 on overall**: the rapid scenario, which economists give 14% probability; the rationale computes 0.8 but plots 6. **NBER w33867 11.5**: one of three equilibria. |
| dataType | — | Tech `brookings-2024` is `observed` with `metricType: "projection"`. The early-career disclaimer says "every point … is a relative estimate … most-exposed versus least-exposed", but the St. Louis Fed point's rationale says it is "not an exposure contrast". |
| Dating | — | Points dated by release, not reference period: Orr-Tucker-Warren (2026-09-10; 2023–24 graduates), Tucker QWI (2026-04-17; through 2025q2), Canaries Aug (2026-08-12; through June 2026). Acemoglu-Restrepo is dated 2020 with 1990–2007 data in a "by 2030" chart. |

---

#### Per-chart reviews (by severity)

##### LABOR ECONOMIST REVIEW: Healthcare Administrative Displacement by 2030
Date: 2026-10-02
Metric: % of healthcare administrative roles displaced by AI by 2030
Current Value: 6.0 | Sources: 4 points (35 sources, 33 overlays) | Tier Mix: T1:3 T2:1 T3:0 T4:0 | Proxies: 0/4

EIGHT-LENS ASSESSMENT (Brynjolfsson and Imas skipped: no productivity or adoption claim is plotted):
- [Acemoglu]: None of the four points measures AI displacement of admin roles. One is a cost-reduction estimate, two are total-employment projections, one is gross sector-wide exposure. The chart is an exposure-to-displacement conflation from end to end.
- [Gimbel]: The heaviest point (BLS OOH, 30.6%) is the BLS baseline for medical records specialists, +8% growth (verified), not an AI estimate. The second-heaviest (NEJM 27.5) cites a DOI that resolves to an AI-scribes paper (verified via Crossref). The headline rests on one misattributed number: remove it and the chart reads −0.7.
- [Bessen]: Admin demand rises with an aging population. BLS's +8% says demand is still expanding *(inference)*, which is the elastic side of his inverted U. The chart has no slot for that.
- [Kolko]: Hospital revenue-cycle cuts (Trinity, Revere, UnityPoint) are overlays, correctly. They are announcement-sourced, which is exactly his over-attribution bias.
- [Kinder]: This is her "invisible disruption" population: medical secretaries, records specialists, and >90%-women roles in the NYT overlay. It deserves a measured series, not a borrowed cost figure.
- [Rock]: The Tufts 3.6 is gross sector-wide exposure (all of Health Care & Social Assistance) and is not flagged as a proxy here, though it is on five other charts.

CONSENSUS: No plotted point measures what the title says.
TENSIONS: Kinder would keep the chart because the population matters. Gimbel would rather show "no estimate" than a borrowed one.

ISSUES:
- High, Data integrity, **NEJM 27.5 misattributed.** The DOI is the AI-scribes paper; "20–35% admin cost reduction" is not a jobs share. Flagged by: Gimbel, Acemoglu.
- High, Data integrity, **BLS OOH −8 is a total-employment projection with no AI attribution,** non-proxy, and is the "Best estimate". Its KB file says "decline 8%", contradicting both the excerpt and BLS. Flagged by: Gimbel, Kolko.
- Medium, Data integrity, BLS MLR medical transcriptionists 4.7 (one occupation) and Tufts 3.6 (gross, whole sector) are not proxies.
- Medium, Framing, the context copy says "6% … on track to be automated" and "AI coding achieves 95% accuracy". The 95% comes from the misattributed NEJM record.
- Low, Viz, overlay directions are mostly legacy (21 `down`, mostly bad news), so they render red/green inverted relative to the convention.

RECOMMENDATIONS:
- High: Remove NEJM 27.5 (source does not contain the number) and fix the registry title. Make BLS OOH and BLS MLR proxies under the one-occupation and no-attribution rule; make Tufts a proxy. The headline lands near 1.2.
  - Rationale: Gimbel, Acemoglu, Rock.
  - Trade-off: the headline drops from 6 to about 1. That is honest and matches the observed overlays.
- Medium: Rewrite the context copy and drop the 95% claim. Correct the BLS KB keyFinding.

HONEST LIMITS: No study yet measures AI-attributed admin employment change. The hospital RCM layoffs are real but anecdotal.

##### LABOR ECONOMIST REVIEW: Projected US Job Displacement from AI by 2030
Date: 2026-10-02
Metric: % of US jobs displaced by AI by 2030 (net, US)
Current Value: 1.4 (non-proxy 0.4) | Sources: 25 points (191 sources, 222 overlays) | Tier Mix: T1:16 T2:9 | Proxies: 12/25

EIGHT-LENS ASSESSMENT (Bessen and Rock brief; all applied):
- [Acemoglu]: His own number is plotted as a central 3 [2,4]. He said "I would say less than two to four percent", a five-year spoken ceiling. Separately, his 0.5 TFP bound is plotted as a jobs share, which his framework (Hulten aggregation of task cost savings) does not license.
- [Brynjolfsson]: Using Canaries Fact 1 (no economy-wide displacement) as a 0 on the aggregate is the right reading. The July-dashboard proxy (0.2) from the same team is a second plotted point.
- [Gimbel]: Observed core is at 0. The page's "Projections … median ~4" is driven by gross WEF 8, Goldman gross 9, Forrester 6, Tufts 6, FRI 6 and NBER 11.5; the non-proxy median is 1.2. Her test is "observed vs projection, clearly labelled", and gross and net are not separated on the summary line.
- [Kolko]: Fed Atl/Duke 0.37 is a 2026 one-year CFO expectation and the heaviest point (8.1%). It is treated as a proxy on the finance chart but not here.
- [Imas]: The FRI rapid-scenario 6 is plotted unweighted although economists put 14% on that scenario. That is a scenario presented as a forecast, which the skill's rule sends to overlays. The rationale itself computes 0.8.
- [Kinder]: Kinder's "small fire on the stove" framing fits: the aggregate shows nothing, and the early-career chart carries the signal.
- [Bessen]: The Goldman net 0.6 is now plotted (done). Gross-versus-net is now flagged on every gross point.
- [Rock]: The NBER w33867 11.5 is one of three model equilibria. Its own KB lists "widespread AI … minimal employment effects" as another equilibrium.

CONSENSUS: Measured aggregate effect is about 0. Net forecasts cluster at 0.6–1.3.
TENSIONS: Acemoglu's ceiling (up to 2–4% in five years) versus Goldman, Bloom and Metaculus (about 1%). Plotting his ceiling as a midpoint inflates the tension.

ISSUES:
- High, Data integrity, FRI 6 (scenario) plotted. Flagged by: Imas, Gimbel.
- High, Data integrity, Acemoglu TFP 0.5 plotted as jobs, with no conversion (the rationale admits it). Flagged by: Acemoglu, Rock.
- High, Framing, the page summaries use all points: "median ~4" against a hero of ~1, and context copy "5–12%". Flagged by: Gimbel, Kolko.
- Medium, Data integrity, NBER w33867 equilibrium 11.5 should be an overlay. The paper is registered twice.
- Medium, Data integrity, Fed Atl/Duke 0.37 one-year expectation is not a proxy here.
- Medium, Data integrity, Yale dedupe inverted: superseded tracker vintages are plotted and the Aug-CPS vintage is an overlay.
- Medium, Viz, the "Trending ▼" arrow compares Eisfeldt postings (2023) with Canaries ADP (2026).
- Medium, Viz, overlay directions are mixed within the chart (95 down / 56 up). Legacy items such as Goldman 300M, IMF 40%, MIT Iceberg, Frank et al. and Lodefalk are `down` although they indicate more displacement.

RECOMMENDATIONS:
- High: FRI to 0.8 (probability-weighted per its own rationale) or to an overlay. NBER w33867 and Acemoglu TFP to overlays. Fed Atl/Duke to a proxy. Headline becomes **1.0**, consistent with the hero.
  - Rationale: Imas, Acemoglu, Gimbel.
  - Trade-off: none beyond fewer plotted points.
- High: Compute "Observed so far", the projection median and "Best estimate" on non-proxy points, and set `trendComparable: false`.
- Medium: Plot the latest Yale tracker vintage; move the Oct 2025 and Mar 2026 vintages to overlays. Merge the duplicate w33867 registry IDs.
- Medium: Update the context copy ("Forward-looking projections cluster around 5–12%") to the net/gross split.

HONEST LIMITS: Net forecasts to 2030 are few (four independent), and none is model-based with published error bands.

##### LABOR ECONOMIST REVIEW: Creative Industry Displacement by 2030
Date: 2026-10-02
Metric: % of creative roles displaced by 2030
Current Value: 12.0 (non-proxy 14.3) | Sources: 8 points | Tier Mix: T1:2 T2:6 | Proxies: 5/8

EIGHT-LENS ASSESSMENT (Kolko and Imas brief):
- [Gimbel]: The two heaviest non-proxy projections are unsound. Forrester 20 is not in the source; the source says 7.5% of ad-agency jobs by 2030 and that creative roles grow (verified). CVL 21.4 is a union-commissioned exec survey of "consolidated, replaced, or eliminated" film/TV/animation jobs by 2026, a gross construct, not flagged.
- [Acemoglu]: Pixiv upload decline (Japan, one platform, uploads not jobs) is the heaviest point at cf=1. Upload volume is not employment.
- [Bessen]: The overlays carry the demand story: book titles up 19×, Reimers-Waldfogel consumer surplus, and Gallup finding artists' earnings not sharply lower. The plotted points ignore it *(inference)*.
- [Kinder]: Freelancers and illustrators (SoA 26% lost work) are the exposed group; the chart should say freelance, not "roles".
- [Rock]: McKinsey "25–40% of creative task time" uses the task factor correctly.
- [Brynjolfsson]: Ju & Aral (+73% productivity) and Adobe sit as overlays; augmentation is visible only off-line.
- [Kolko], [Imas]: Imas's exclusivity-premium overlay is relevant to demand, but not to the plotted construct.

CONSENSUS: Freelance creative demand has fallen; salaried creative employment evidence is thin.
TENSIONS: Bessen's demand expansion (books, consumer surplus) versus Kinder's concentrated freelance losses.

ISSUES:
- High, Data integrity, Forrester 20 unsupported (correct figure 7.5, June 2023).
- Medium, Data integrity, CVL 21.4 gross and not a proxy.
- Medium, Data integrity, Pixiv cf=1 for uploads.
- Medium, Viz, the trend arrow ▲ runs from NBER postings to Pixiv uploads. Overlay directions are legacy (18 `down`).

RECOMMENDATIONS:
- High: Forrester to 7.5, dated 2023-06-15. CVL to a proxy. Headline about 9.2.
  - Trade-off: none.
- Medium: Give Pixiv a documented non-employment conversion (it is upload volume) or an overlay.

HONEST LIMITS: No US employment-based estimate of AI-attributed creative job loss exists yet.

##### LABOR ECONOMIST REVIEW: Education Sector Displacement by 2030
Date: 2026-10-02
Metric: % of education roles displaced by 2030
Current Value: 3.3 | Sources: 3 points | Tier Mix: T1:1 T2:2 | Proxies: 0/3

EIGHT-LENS ASSESSMENT (Brynjolfsson, Imas and Rock skipped: adoption-only overlays):
- [Gimbel]: All three points have problems:
  - BLS 3 (40% weight) is unsupported by the cited page; teacher assistants are about −0.3% for 2025–35 (verified), and the page is a total-employment projection, not AI.
  - Metaculus K-12 has an unresolved sign (excerpt +1.3, KB −1.3).
  - Tufts 8.3 is gross and not flagged as a proxy.
- [Acemoglu]: All three are projections; nothing observed. The description's own claim is that studies "consistently frame AI as augmenting educators".
- [Kinder]: Aides and support staff are the exposed group. The chart cannot see them.
- [Bessen]: Demand is set by enrollment and funding, not price. Higher-ed cuts in the overlays are funding-driven.
- [Kolko]: Chegg and Duolingo are product-substitution stories, correctly overlays (June review item done).

CONSENSUS: No AI displacement estimate exists for education.
TENSIONS: Little to argue over. The evidence is thin, not contested.

ISSUES:
- High, Data integrity, BLS 3 unsupported and unattributed.
- Medium, Data integrity, Tufts not a proxy; Metaculus sign unresolved.
- Low, Data integrity, tiers: Pearson 10-K is T3; Chegg is T2 and T3.

RECOMMENDATIONS:
- High: Correct BLS to the OOH figure and make it a proxy (or overlay). Make Tufts a proxy. Resolve the Metaculus sign from a saved copy of the hub. Headline about 1.1–2.0 depending on the sign.
- Medium: Add a visible "no direct estimates" note. The description already says so; surface it next to the number.

HONEST LIMITS: Three points cannot support a headline. Consider a "thin evidence" badge rather than adding sources.

##### LABOR ECONOMIST REVIEW: Robots & Physical Automation Displacement by 2030
Date: 2026-10-02
Metric: % of physical-task jobs displaced by 2030
Current Value: 3.6 | Sources: 5 points | Tier Mix: T1:2 T2:3 | Proxies: 5/5

EIGHT-LENS ASSESSMENT (Imas and Kinder brief):
- [Acemoglu]: His robots-and-jobs paper (≈0.2pp EPOP per robot per 1,000 workers, about 400K jobs over 1990–2007) is turned into "3.3% of physical-task jobs" with an undocumented denominator, then dated 2020 and typed observed in a "by 2030" chart.
- [Rock]: McKinsey's 57% of hours is technical feasibility. The plotted 7 "could not be reproduced from source text" (the site's own rationale).
- [Brynjolfsson]: Industrial AI at 22.8% of plants (2021) and the minimum-wage-to-robots elasticity are overlays. That is fine.
- [Gimbel]: Every point is a proxy. The heaviest is one industry (mining, −1.6%), with a contradiction over whether BLS attributes it to robotics.
- [Bessen]: Manufacturing employment followed the inverted U long before AI. The chart has no baseline for that.
- [Kolko]: The physical-task denominator is undefined, so the headline is unreadable.
- [Imas]: His O-ring work says low-dimensional physical jobs (trucking, warehousing) may be *more* at risk. That deserves a methodology line.
- [Kinder]: Brief only; no worker-population point is plotted.

CONSENSUS: No measured or forecast AI-era robot displacement share exists for the US.
TENSIONS: Imas (physical work under-rated) versus Goldman/MCC overlays (physical work insulated).

ISSUES:
- High, Data integrity, McKinsey 7 has no source number; remove it.
- High, Data integrity, Acemoglu-Restrepo 3.3 is site-derived with an undocumented denominator.
- Medium, BLS mining: excerpt and rationale contradict each other, and the source is unverified (403).

RECOMMENDATIONS:
- High: Remove McKinsey 7. Move A-R 3.3 to an overlay with its real units. Headline 2.9, carried by three proxies. Then consider labelling the chart "no direct estimate" rather than adding sources.

HONEST LIMITS: Physical automation by 2030 is genuinely unforecast in these units.

##### LABOR ECONOMIST REVIEW: Tech Sector Displacement by 2030
Date: 2026-10-02
Metric: % of tech jobs displaced by 2030
Current Value: 8.6 | Sources: 9 points | Tier Mix: T1:4 T2:5 | Proxies: 7/9

EIGHT-LENS ASSESSMENT (all relevant):
- [Bessen]: His bellwether test: developers at a record 2.5M (+400K since ChatGPT). The heaviest point (Metaculus software developers −15.1, April vintage, non-proxy) runs directly against that, and the page doesn't say so. His point that "programmer" has declined for decades applies to both BLS programmer points (correctly proxied).
- [Brynjolfsson]: Canaries says coding is where substitution is visible for 22–25s. The tech page box restates superseded numbers (−20%, +9%, "16% relative") and a site-computed +1.3% net.
- [Gimbel]: Dallas Fed 5 has "no AI attribution" yet sits at the top of its own 0.5–5 range at cf=1. The trend ▲ runs from Brookings 0 (typed observed, metricType projection) to Indeed postings 9.6.
- [Kolko]: The tech hiring bust and rates predate ChatGPT (Indeed vs Feb 2020, Lightcast). Postings factors are now applied.
- [Imas]: Chen & Stratton (about 40% engineer take-up, no employment effect) is an overlay. Fine.
- [Acemoglu]: Coding is his stated exception, so tech is the one sector where his framework expects early effects *(inference from SKILL.md)*.
- [Kinder]: The K-shape framing is right; the numbers in it are stale.
- [Rock]: Tufts 18.3 is Information-sector gross exposure, properly a proxy.

CONSENSUS: Entry-level coding hiring has weakened; total developer employment has not fallen.
TENSIONS: Bessen's record employment versus Metaculus −15.1. The chart should show that tension, not average it.

ISSUES:
- High, Framing, the AgeWeightedMethodology box and context copy contradict the hero ("+1.3% sector net", and "+8.6%" printed as if growth).
- Medium, Data integrity, Metaculus software developers non-proxy (one occupation); Dallas Fed at the CI maximum.
- Medium, Data integrity, the `bls-programmer-employment-observed` source is miscited (OES 2023 table).
- Medium, Viz, trend arrow across instruments; overlay directions mixed (48 down / 32 up).

RECOMMENDATIONS:
- High: Remove or rewrite the AgeWeightedMethodology box and the tech context template (drop the `+` prefix and the +1.3 language, update to the Canaries Aug 2026 kept-pace 19%).
- Medium: Metaculus to a proxy; Dallas Fed to a central conversion (about 0.5). Headline about 7.7.
- Medium: Re-source the 27.5% programmer figure or drop it.

HONEST LIMITS: Software employment is still rising in aggregate. The entry-level signal is real but confounded (rates, post-pandemic correction).

##### LABOR ECONOMIST REVIEW: Early-Career Employment Decline in AI-Exposed Occupations
Date: 2026-10-02
Metric: % employment gap, ages 22–25, most- vs least-exposed occupations (current)
Current Value: 12.3 (non-proxy 16.8) | Sources: 5 points | Tier Mix: T1:4 T2:1 | Proxies: 2/5

EIGHT-LENS ASSESSMENT:
- [Brynjolfsson]: Canaries Aug 2026 19 is correctly the kept-pace measure. The authors' caveats are present as overlays: education control −18 to −9, ACS −2.2 [−5.5, +1.1]. That is exemplary.
- [Gimbel]: The heaviest point (27.8%) is Orr-Tucker-Warren. Its own excerpt says it is "not directly comparable to the estimates plotted on this chart". It gets the 2× sample-size boost and is the "Best estimate".
- [Kolko]: The NY Fed remote-work overlay (64%) and his ~0.9 exposure–telework correlation are exactly the confound the page should foreground. Overlays carry it; the headline does not.
- [Imas]: "aggregate stability can coexist with early stress in exposed subgroups." This chart is that subgroup, and it is the right chart to exist.
- [Kinder]: This is her career-ladder chart. Women −4.5%/yr versus men −2.5% is an overlay.
- [Rock]: The St. Louis Fed point measures AI-*skill* postings (its own KB: "captures changing job content, not firms automating jobs"). It contradicts the chart's disclaimer that every point is an exposure contrast.
- [Acemoglu], [Bessen]: Brief. Hiring margin, not separations, which is consistent with Bessen's gradual-adjustment finding.

CONSENSUS: A relative gap for 22–25s exists in ADP, Revelio and QWI. Attribution is contested.
TENSIONS: Brynjolfsson (widening, AI substitution) versus Kolko and Gimbel (remote work, rates, pre-trends).

ISSUES:
- Medium, Data integrity, the St. Louis Fed point fails the construct (AI-skill demand, not exposure). Overlay it.
- Medium, Framing, "Best estimate" and trend ▲ (1.0 to 6.4) both come from proxies of different instruments.
- Low, OTW and Tucker QWI are dated by release.

RECOMMENDATIONS:
- Medium: Overlay the St. Louis Fed point (headline 13.4). Non-proxy best estimate (Canaries 19). `trendComparable: false`.
- Low: Date points to the reference-period end.

HONEST LIMITS: Within-firm and ACS checks attenuate the effect. The causal share is unknown.

##### LABOR ECONOMIST REVIEW: White-Collar Professional Displacement by 2030
Date: 2026-10-02
Metric: % of white-collar professional roles displaced by 2030
Current Value: 2.1 (non-proxy 1.3) | Sources: 15 points | Tier Mix: T1:9 T2:5 T3:1 | Proxies: 7/15

EIGHT-LENS ASSESSMENT (Imas and Rock brief):
- [Gimbel]: PWBM 0.75 is the heaviest point because of a 160M "sampleSize" (the labor force). It is raw 2021–24 change in "fully AI-replaceable" jobs (not white-collar per se), starting before ChatGPT. Chicago Fed −4.05 is raw 2019–24 change; its own qualifier says "not attributable to AI". Both are non-proxy.
- [Kolko]: Windows that start in 2019 or 2021 fail his timing test. The trend ▲ runs from Chicago Fed −4.05 (2024) to Tucker 3.7 (2026), two different instruments.
- [Acemoglu]: Metaculus 11.4 is "most vulnerable AI-exposed occupations", selected on vulnerability and plotted as white-collar, non-proxy. Goldman 2.5 is a task share. Gartner 1 is a share of layoffs.
- [Brynjolfsson]: The Canaries WC point is correctly a proxy (ages 22–25).
- [Kinder]: Clerical and admin is where her 6.1M high-exposure, low-capacity workers sit. Overlays show it (Economist: secretaries −15%); the plotted points don't separate it.
- [Bessen]: Brief. The Economist overlay (paralegals +11%) is the elastic-demand case.
- [Imas], [Rock]: Brief. Exposure sensitivity overlays (EIG Goldschlag) are present.

CONSENSUS: No measured white-collar-wide loss. Clerical is the exception to watch.
TENSIONS: Kinder (clerical women) versus Bessen (professional demand elastic).

ISSUES:
- Medium, Data integrity, PWBM sampleSize inflation; PWBM and Chicago Fed are no-attribution non-proxies.
- Medium, Data integrity, Metaculus 11.4, IMF 3.6 (non-US), Goldman 2.5 (task share) and Gartner 1 (layoff share) are construct mismatches.
- Low, Viz, the trend arrow.

RECOMMENDATIONS:
- Medium: Drop `sampleSize` on PWBM. Make PWBM, Chicago Fed, Metaculus and IMF proxies. The headline is about 2.4, roughly unchanged, but its composition becomes honest.

HONEST LIMITS: "White-collar" is not a BLS category. The chart's denominator is undefined.

##### LABOR ECONOMIST REVIEW: Financial Services Displacement by 2030
Date: 2026-10-02
Metric: % of financial-services roles displaced by 2030
Current Value: 7.3 (non-proxy 10.5) | Sources: 6 points | Tier Mix: T1:2 T2:4 | Proxies: 4/6

EIGHT-LENS ASSESSMENT (Brynjolfsson, Imas and Rock brief):
- [Gimbel]: Goldman 14 is a client survey reported via Fortune, plotted at the top of its own [5,14] band, over a three-year horizon, non-proxy. BLS MLR picks credit analysts (−3.9) from a paper that also projects financial advisors +17.1% and analysts +9.5%. That is selection on the dependent variable.
- [Kolko]: Bank headcount announcements (Citi, Morgan Stanley, JPMorgan) are overlays. That is correct, and also his over-attribution case: "CEO statements are possibly the worst way to do it" (Gimbel).
- [Acemoglu]: Rules-based finance tasks are his cognitive-routine pool. The 2–4% ceiling applies economy-wide, so a 7% sector figure is plausible only if concentrated *(inference)*.
- [Bessen]: Financial advisors +17.1% is the demand-elasticity counterexample.
- [Kinder]: Back-office ops and clerical work are the exposed group.

ISSUES:
- Medium, Data integrity, Goldman 14 is not a proxy (horizon, global client survey) and sits at its CI maximum.
- Medium, Data integrity, the BLS MLR choice of occupation is cherry-picked; use a sector composite or overlay.
- Low, the context copy is missing (the description is used); overlay directions are legacy.

RECOMMENDATIONS:
- Medium: Goldman to a proxy (headline 6.6). Replace the credit-analyst point with an MLR finance-occupation average, or overlay it.

HONEST LIMITS: Bank workforce plans are announcements. There is no measured AI-attributed series.

##### LABOR ECONOMIST REVIEW: Customer Service Automation by 2028
Date: 2026-10-02
Metric: % of customer-service interactions automated by 2028 (a usage share, not jobs)
Current Value: 47.8 (non-proxy 38.0) | Sources: 6 points | Tier Mix: T1:2 T2:2 T3:2 | Proxies: 4/6

EIGHT-LENS ASSESSMENT (Bessen, Gimbel and Imas central; the rest brief):
- [Gimbel]: Five of six points are company self-reports. The sixth, Salesforce's 30, is a vendor-published self-estimate and not flagged. The June review asked to cap vendor claims; proxy flags are a partial answer.
- [Imas]: The best independent adoption number (Census BTOS: 7.6% of firms use AI in customer service) is an overlay. The Alibaba RCT (35% of eligible chats, <10% of volume) shows how far deflection claims sit from volume.
- [Bessen]: The context copy asserts demand is "relatively inelastic". Plausible, but asserted rather than sourced.
- [Kinder]: CS reps are a Brookings low-adaptive-capacity group; the jobs consequence is off-chart.
- [Kolko]: The trend ▲ runs from Klarna's first month (later reversed) to one Stanford-selected firm.

ISSUES:
- Medium, Framing, the unit is not displacement but the chart sits in the displacement grid.
- Medium, Data integrity, Salesforce 30 is not a proxy. Making it one raises the headline to 51.7, which shows how vendor-driven it is.
- Medium, Viz, trend arrow; overlay directions mixed (27/19).

RECOMMENDATIONS:
- Medium: Flag Salesforce as a vendor claim. Add a methodology line: "share of interactions, not jobs; inputs are company-reported".

HONEST LIMITS: No independent sector-wide deflection measure exists.

---

#### What the section gets right
- PR #738 made real progress: unsupported OECD, UOC, WEF-as-% and Acemoglu-robots points are gone. Postings factors are applied. `currentValue` matches computed on all 10 charts.
- The early-career chart is the best on the site: one construct, the authors' own caveats (education control, ACS benchmark) shown beside the headline.
- Gross estimates on the aggregate now carry explicit proxy rationales. Scenario exercises (Anthropic Institute) are overlays.

#### Honest limits
- Sector-level AI displacement is not measured anywhere in US official data. Most sector charts are projections of projections.
- The early-career gap's causal share is unresolved between ADP and CPS/ACS designs.

#### Research gaps
- AI-attributed employment by industry from linked firm adoption and payroll records: Gimbel's "dream dataset"; Equitable Growth notes no federal source does this.
- An independent customer-service deflection measure (not vendor).
- An admin and clerical employment series by sector (Kinder's population).

#### Completion record
- **Reviewed:** 10 displacement charts at 4db7a03; evidence through 2026-09-22.
- **Decisive findings:** NEJM misattribution (confirmed); Forrester creative 20 unsupported (confirmed); BLS education 3 unsupported (confirmed); FRI scenario and Acemoglu TFP plotted on overall; summaries and arrows still computed on proxies; overlay colors inverted for convention-following overlays; tech page box still shows +1.3.
- **Files changed:** none in the repo. Scratch scripts are in `scratchpad/ler/disp/`.
- **Checks run:** Python port of `computeAggregate`, with counterfactuals per chart; WebFetch of BLS OOH (×2) and Forrester; Crossref DOI lookup.
- **Unresolved:** Metaculus K-12 sign (hub 403); BLS mining attribution (403); the true source of the 27.5% programmer figure.


---

# Appendix B — Wage charts

### Labor economist review: wages section

**Target:** `src/data/predictions/wages/` (4 charts) on jobsdata.ai `main` @ 4db7a03, deployed 2026-10-02. I read the working tree on branch `chore/economist-review-sync`. That branch's only extra commit (70f775c) touches the review command, and `git diff HEAD origin/main -- src/` is empty.
**Evidence vintage:** newest plotted points are Census CES 2026-09-10 (entry-level) and Azar et al. 2026-08-21 (median). Newest overlays are dated 2026-09-30 (Fed FEDS note).
**Method:** labor-economist-review SKILL.md (8 voices, Steps 1–5). All weights below come from re-implementing `computeAggregate` (tier × recency × sample size × proxy). Economist quotes are verbatim from SKILL.md. Source quotes are verbatim from pages fetched on 2026-10-02 (WebFetch). Anything marked *(inference)* is this review's synthesis.

**Reader-facing mechanics that matter for every chart below** (`PredictionDetailClient.tsx`):
- "Observed so far" is an unweighted mean of every `observed` point, proxies included.
- "Best estimate from …" is the last Tier-1 point, proxies included (`findLast(d => d.evidenceTier === 1)`).
- The trend arrow compares the first and last observed points unless `trendComparable: false` is set.
- The context copy (`CONTEXT_MAP`) is duplicated in `src/lib/chat/site-content.ts` and `PredictionSummaryCard.tsx`, so copy fixes need to be made in all three places.

---

#### Prior-review follow-through (wage items)

| Item | What was asked | Status | Evidence in current files |
|---|---|---|---|
| 1 | IMF skill premium 3 vs 8.5 | **Done** | High-skill IMF point = 8.5, which matches the excerpt ("8.5 percent in the United States" for 4+ new skills). Construct note remains (see high-skill chart). |
| 1 | Hui −15 vs −5.2 | **Done** | Freelancer Hui = −5.2 [−8.3, −2.1], matching the excerpt. |
| 1 | Unsupported median-wage points | **Partial** | ILO/Dube/EPI/Korinek-Trammell were removed (#738). Goldman 2023 +1, BLS ECI −1 and IMF −1 remain. They are 3 of the 5 non-proxy points and carry 51% of the headline weight. |
| 1 | (Entry) Census −13 → persistent −5 | **Done** | −5 [−13, −3.3], matching the excerpt (13% initial, ~5% after two years). |
| 2 | Page summaries on non-proxy points | **Not done** | `observedMean` and `bestEstimate` still include proxies. On median wage, "Observed so far" reads ~−1.7%. On non-proxy observed points it would be +1.9%: the sign flips. |
| 3 | Dedupe by source team | **Partial** | Plotted points are one per team per chart. The registry still holds duplicate records for the same URL: `dallas-fed-davis-ai-wages-2026` / `dallasfed-ai-aiding-replacing-2026` (median and entry overlays), and `dallas-fed-entry-level-2026` / `dallasfed-young-workers-ai-2026`. Goldman's ">3% real earnings loss" also appears twice on median wage, under two source IDs. |
| 4 | `trendComparable: false` on wage charts | **Partial** | Set on high-skill only. Median wage shows a red ▼ (Eisfeldt CPS gradient −0.6 → Azar OEWS gradient −4.9). Freelancer shows a red ▼ (Upwork 2023 postings −5 → Upwork 2026 per-contract −13). Entry-level is flat only because both endpoints happen to equal −5. |
| 4 | "Best estimate" from non-proxy points | **Not done** | Median: "Best estimate from Bureau of Labor Statistics", which is the unsupported ECI −1. Freelancer: "Journal of Economic Behavior & Organization", which is a postings-volume proxy (−25). High-skill: Oxford Internet Institute, a UK proxy. |
| 5 | One proxy rule set | **Partial** | Relative-gap rule applied on median wage (Eisfeldt, Apollo, Azar proxied). It was not applied to the same construct on entry-level (all 4 points are relative gaps, none proxied) or to Indeed 4.7 on median. Non-US rule: Oxford UK proxied, but PwC's 27-country pool is not. Vendor rule: the Upwork FWI point is not proxied. |
| 9 | Sync `currentValue` | **Done** | Median −0.4 (computed −0.44), entry −4.9 (−4.89), freelancer −13.7 (−13.68), high-skill 29.4 (29.38). |
| 10 | Overlay direction | **Not done** (code) | The UI still colors directions the same on every chart. Wage examples of questionable direction: high-skill "Microsoft: Cloud revenue $35.1B" (up), "Mercer: 63% would trade 10% raise" (up), "LinkedIn: AI engineering talent grew 130%" (up, though more supply would lower a premium); freelancer "Upwork: AI-applied freelance skills +109%" (down). |
| 11 | Hand check: freelancer Ramp −28 | **Checked → remove** | The fetched Ramp page has no figure near 28% or 31% and reports no rates. Its numbers are spend shares: "The share of total spend going to labor marketplaces fell from 0.66% in Q4 2021 to 0.14% in Q3 2025." The stored excerpt's "writer earnings dropped ~31%" is also not on the page. |
| 11 | Hand check: freelancer Upwork 2023 −5 | **Checked → remove or overlay** | The plotted −5 contradicts the source's own excerpt ("15% fewer job postings"). The excerpt measures postings, not rates. The KB file says methodology is "Not specified". The upwork.com page returns 403, so I could not verify it. |
| 11 | Hand check: median Goldman 2023 +1 | **Checked → remove** | Record `goldman-ai-workforce-2025` has no excerpt. Its KB file describes a 2025 note on young tech-worker unemployment and contains no wage figure. The goldmansachs.com page returns 403. No source on file supports +1% median wage. |
| 11 | Hand check: median BLS OES overlay | **Checked → remove or re-source** | The cited page (`oes_nat.htm`) is a table index. It now shows May 2025 data and contains no AI-exposure tagging and no "1.1% vs 3.8%" comparison. OEWS publishes levels, not an AI-exposed growth split. The label already says "not AI-attributed". The figure has no traceable origin. |
| June | Freelancer: recency note (−18.9 weighted vs −5 latest) | **Partial / superseded** | The gap has closed numerically (−13.7 vs −13 latest). But the latest point is now the Upwork vendor subset figure, so the closure is not reassuring. |
| June | Median "projection-heavy, honestly bounded" | **Changed** | Median now has 3 projections and 5 observed points. Four of the observed points are cross-occupation gaps, and the chart's honest "we don't know, probably small" reading now rests on one Metaculus forecast (see median-wage chart). |

**Counts (16 wage-relevant items):** done 4 · partial 6 · not done 6. The four hand checks are counted as not done: the findings are new here, and the repo still carries all four values.

---

#### LABOR ECONOMIST REVIEW: Median Wage Impact from AI by 2030

Date: 2026-10-02
Metric: % change in US real median wage attributable to AI, by 2030
Current value: −0.4 (computed −0.44) | Points: 8 | Tier mix: T1:3 T2:5 T3:0 T4:0 | Proxies: 3 | Overlays: 71

**Who drives the headline (share of weight):**
- BLS ECI −1: 22.8% (T1, observed, no excerpt)
- Goldman 2023 +1: 17.9% (T1, no excerpt)
- Indeed +4.7: 13.2% (T2, non-proxy)
- Metaculus −0.6: 13.0%
- IMF −1: 10.1%
- Eisfeldt −0.6: 9.6% (proxy)
- Apollo −6.7: 6.7% (proxy)
- Azar −4.9: 6.7% (proxy)

**Spot-check of the three heaviest points:**
1. **BLS ECI −1 [−5, 3]: unsupported.** The KB file says the ECI shows compensation +3.4% y/y (Dec 2025) and real wages and salaries +0.8% (June 2024–June 2025). The ECI makes no AI attribution, so "−1% from AI" cannot be read from it. The point is dated 2025-02-01, before the Q1 reference period closed. It is also the page's "Best estimate".
2. **Goldman 2023 +1 [−3, 5]: unsupported.** See the hand check above. The source ID's KB content is a different (2025) Goldman note.
3. **Indeed +4.7 [2.4, 5.7]: the number is real, but the construct is mislabelled.** The fetched page defines the figures as "the extra advertised pay growth in more-AI-exposed occupations after ChatGPT, over and above what less-exposed occupations and the wider market would predict". The page gives 5.7% with occupation fixed effects, 4.7% within job title, and 2.4% holding seniority mix constant.
   - This is a cross-occupation gap in *advertised* pay. That is the same construct the chart proxies for Apollo and Azar.
   - The bracket [2.4, 5.7] spans specifications. It is not a confidence interval.
   - The authors' own caveat: "Because we measure advertised pay in posted jobs, some of the rise reflects a shift toward fewer, more senior postings." On that reading, 2.4 is the cleanest specification.
4. IMF −1 [−5, 3] (10.1%): the excerpt and KB contain no number ("AI will likely worsen overall inequality"). It is global and qualitative. Unsupported.

Metaculus −0.6 matches its excerpt ("overall median wage −0.6%/+1.4%" for 2030/2035). **After the three unsupported points are removed, Metaculus is the only point on this chart that estimates the chart's metric.**

**EIGHT-LENS ASSESSMENT** (all eight apply; Bessen and Brynjolfsson are primary for wage charts):

- **[Acemoglu]:** The chart's description promises "productivity gains and displacement effects" combined. The surviving evidence is all displacement-side gradients (exposed vs less-exposed), which are silent on reinstatement and level effects. A median-wage effect is a general-equilibrium object, and no point here is general-equilibrium except the Metaculus forecast. *(inference)* His Hulten-bounded view of modest macro gains fits a small number. It does not fit summing cross-sectional gaps into one.
- **[Brynjolfsson]:** His own August 2026 Canaries vintage finds adjustment "through employment, not base pay" (SKILL.md, fact 6). That is a reason to expect small median-wage effects so far. Apollo, Azar and Indeed are descriptive gradients across occupations, not causal level estimates. The Canaries authors call their own work "early, descriptive indicators… rather than causal estimates".
- **[Gimbel]:** This is the chart where her SDID result matters most. The Budget Lab finds "no statistically or economically significant effects as of yet" on wages, and the site carries it only as an overlay. The page's "Observed so far ~−1.7%" mixes four different instruments, and one of them (Indeed, postings) points the opposite way from Azar's Revelio *posted* wages (−8.7%). When two postings datasets disagree on sign, the honest observed figure is "no consistent signal".
- **[Bessen]:** A median-wage effect depends on demand elasticity across sectors, and nothing here models that. "The effect of artificial intelligence on jobs will similarly depend critically on the nature of demand." Indeed's positive senior-heavy gap is consistent with elastic demand for complementary skills. Apollo's −24.3% in service occupations (n = 239) is not.
- **[Kolko]:** Measure sensitivity is the story. Usage-based exposure (Apollo, Anthropic AEI) gives −6.7. GenAI task exposure in OEWS (Azar) gives −4.9. Indeed's skill-transformation exposure in postings gives +4.7. Per his rule, one series cannot carry the claim when measures "point in all directions". He would also check timing: Apollo's break is "after 2023", while the Indeed index starts in 2021.
- **[Imas]:** "aggregate stability can coexist with early stress in exposed subgroups." Every observed point here measures exposed subgroups, and the headline then presents the result as an aggregate. That is exactly the subgroup-as-aggregate confusion his checklist flags (Q4).
- **[Kinder]:** The chart's overlays hide the distributional point. The Anthropic Institute's extreme scenario has the average wage up 9.7% while the cognitive wage falls 11.5%; Apollo's bottom quartile shows −10.7%. A median number hides who is moving. *(inference)* For a policymaker, the useful number is the spread, not the median.
- **[Rock]:** The gradients are measured at the occupation grain and use different exposure rubrics: AEI usage, Eloundou-style GenAI exposure, and Indeed's skill rubric. Results that are not robust across rubrics should not be averaged as if they measured one thing.

**CONSENSUS:** Nobody has measured an AI-attributable change in the US median wage. The observed evidence is cross-occupation gaps of mixed sign. The one real median forecast (Metaculus) is −0.6% by 2030 and +1.4% by 2035, which is "small, sign uncertain".
**TENSIONS:** Brynjolfsson's "adjustment through employment, not pay" and Gimbel's SDID null pull toward zero. Apollo/Azar (negative gradients) and Indeed (positive) pull in opposite directions. Which one is right depends on the exposure measure and on postings versus pay, which is Kolko's point.

**ISSUES:**
- **[High] [Data integrity] Three unsupported points carry 51% of the weight** (BLS ECI −1, Goldman +1, IMF −1). The BLS ECI point is the "Best estimate". *Flagged by:* Gimbel, Kolko.
- **[High] [Data integrity] Indeed 4.7 is not proxied, although it is the same construct as three proxied points.** It is a relative advertised-pay gap. Flagging it alone moves the headline from −0.4 to −0.8. Combined with removing the three unsupported points, the headline becomes −1.4, and every point except Metaculus is then a proxy. *Flagged by:* Kolko, Rock, Imas.
- **[High] [Framing] The context copy says "Real median wages are projected to fall by 0.4% by 2030 due to AI".** The number is a blend of three unsupported points, one forecast and four gradients. The summary card adds "as AI reshapes mid-skill work", which no plotted point measures.
- **[Medium] [Viz] The red ▼ trend compares two different gradient instruments.** "Observed so far" includes proxies and changes sign without them (−1.7 → +1.9).
- **[Medium] [Data integrity] The BLS OES overlay ("1.1% vs 3.8%") has no traceable source.** The Korinek-Jones substantial-scenario overlay label says "2.1% median wage change", but its own excerpt and the chart disclaimer say *average* wage.
- **[Low] [Data integrity] Duplicate Dallas Fed source records** (two IDs, same URL) and duplicated Goldman scarring overlays.

**RECOMMENDATIONS:**
- **[High] Remove** Goldman 2023 +1, BLS ECI −1 and IMF −1 (or move them to overlays if a real excerpt can be found). Set `isProxy: true` on Indeed with the same `actualUnit` text as Apollo and Azar, and store 2.4–5.7 as a specification range in `proxyContext`. Remove the BLS OES overlay. Change the substantial-scenario overlay label to "average wage +2.1%".
  *Rationale:* Gimbel and Kolko (source fidelity, one construct rule).
  *Trade-off:* no new UI. The headline moves to about −1.4 and its support becomes visibly thin.
- **[High] Rewrite the median-wage context copy in all three places to say what the chart holds.** Suggested text: "One forecast (Metaculus, −0.6% by 2030) estimates the median directly. The observed evidence compares exposed with less-exposed occupations; those gaps run from −6.7% to +4.7% depending on the exposure measure and on whether pay is posted or paid." Add one line to the methodology page explaining why gradients sit at half weight.
  *Rationale:* Imas (subgroup vs aggregate), Kolko, Acemoglu.
  *Trade-off:* copy only. This is the owner's preferred approach, with no new dimension.
- **[Medium] Set `trendComparable: false`. Compute "Observed so far" and "Best estimate" on non-proxy points** (prior item 2/4, code change in `PredictionDetailClient.tsx`).
  *Trade-off:* a small code change that fixes this pattern on every chart.

**HONEST LIMITS:** No dataset yet identifies an AI-attributable change in the economy-wide median wage. SDID on CPS (Budget Lab) is the closest, and it is null. Until a series like that moves, this chart is a forecast chart with observed context, and the copy should say so.

---

#### LABOR ECONOMIST REVIEW: Entry-Level Wage Impact

Date: 2026-10-02
Metric (as stored): "Projected change in real wages for junior positions across AI-exposed industries by 2030". Metric (as measured): the earnings gap of recent graduates or junior-rank workers in AI-exposed fields relative to less-exposed peers.
Current value: −4.9 (computed −4.89) | Points: 4 | Tier mix: T1:2 T2:2 | Proxies: 0 | Overlays: 64

**Weight shares:**
- Census CES (Orr, Tucker & Warren) −5: 55.6% (sampleSize 6.67M gives it a 2× boost)
- Dallas Fed −5: 18.5%
- Azar −7.5: 13.7%
- Goldman −1.3: 12.2%

**Spot-check:**
1. **Census CES −5 [−13, −3.3]: supported.** The fetched abstract says "Full-quarter initial earnings declined by thirteen percent" for the top-exposure decile. The KB file says this attenuates to about 5% after two years, and roughly half of it comes from moving into lower-wage sectors. The comparison group is the least-exposed majors. The PSEO institutions are mostly public research universities (29% of degrees). Dating issue: the point is dated at release (2026-09-10), but the LEHD data run through Q3 2025. Under the reference-period-end rule the date should be 2025-09-30.
2. **Dallas Fed −5 (newly ingested): supported, and correctly typed as observed.** Fetched text: "first-year earnings for more-exposed majors also fell by approximately 5 percent from 2021 to 2024 relative to less-exposed majors". Data are Texas public universities matched to Texas Workforce Commission wage records for jobs held in Texas. Exposure is measured from pre-ChatGPT Lightcast postings. The article reports stable pre-trends and does not formally separate AI from COVID or interest rates. The date 2025-06-30 roughly matches the end of the first year for May 2024 graduates, which is fine.
   - *(Inference)* Texas institutions participate in PSEO, so the Dallas Fed and Census samples may partly overlap. The two −5s are independent research teams but not fully independent data. They should not be read as two confirmations.
3. **Azar −7.5: supported.** The excerpt gives junior −7.5, mid −3.2 and senior −1.8 (senior not significant), P90 vs P10 exposure, measuring seniority by Revelio's rank scores 1–2. This is a cross-cell gap, and the identical construct is proxied on the median chart.
4. Goldman −1.3: the excerpt says the effect widens "the entry-level-to-experienced wage gap by 1.3%". That is a gap between entry-level and experienced workers, not an entry-level wage change. It is typed `metricType: survey`. A separate Goldman overlay gives 3.3pp per 1 SD; same team, different specification.

**Dallas Fed −5 through the eight lenses:**
- **[Acemoglu]:** Pre-ChatGPT exposure is a good design choice. But a relative fall for exposed majors is a displacement-side signal with no reinstatement margin. Graduates who moved into other sectors are counted as losses, which they are, but the chart's metric cannot say whether those losses are permanent.
- **[Brynjolfsson]:** It agrees with Canaries on the *margin* (entry). It disagrees on the *channel*: his August 2026 vintage finds "real starting pay shows no obvious relationship with AI exposure for young workers" (stored excerpt; site overlay). Graduate-level administrative records (Dallas Fed, Census) and payroll records (ADP) disagree on pay. That disagreement belongs on the page.
- **[Gimbel]:** Pre-trends are reported as stable, which passes her pre-registration test better than most entry-level evidence. The relative design does not rule out a 2022 rate shock hitting CS-heavy majors. She would also ask whether the effect survives a COVID-cohort control.
- **[Bessen]:** About half of the Census decline is reallocation into lower-wage sectors. *(inference)* That is adjustment, not necessarily permanent loss. The attenuation from 13% to 5% over two years matches his "gradual" pattern.
- **[Kolko]:** The timing (post-2022) also matches rate hikes and the tech-hiring correction. Exposed majors are mostly CS and IS, so exposure here partly stands in for the tech cycle. Texas-only data limit how far the result generalizes.
- **[Imas]:** This is the "narrow claim" he endorses: "AI may already be affecting the hiring margin for junior white-collar roles most exposed to AI, but this attribution is contested". The chart's title and copy ("by 2030") are broader than that.
- **[Kinder]:** This is the career-ladder evidence her framework predicts, measured at the point where the ladder starts. She would want the sector-shift half (graduates landing in restaurants and retail) made visible, because that is the "composition problem".
- **[Rock]:** Major-level exposure built from postings is two steps removed from tasks (task → occupation → major). Rubric choice differs from Census, which uses Eloundou GPT-4 scores.

**Indeed +5 entry-level gap (currently an overlay) through the lenses:** the fetched page reports "roughly 5 points at entry, 6 at mid, and 7 at senior" against a 2022 baseline, and a "modest 2-point gap" against 2021. It is the same kind of evidence as Azar's −7.5 (a relative pay gap by seniority among exposed vs less-exposed roles), and the sign is opposite.
- Under the owner's plot-by-default rule, no hard gate blocks it. Plotting Azar while overlaying Indeed is an asymmetry.
- With both plotted as proxies, the headline moves from −4.9 to about −4.3.
- Lens notes: Kolko (rubric and data sensitivity); Gimbel (advertised vs paid: Indeed is postings and the Census figure is realized earnings, so Census should lead); Imas (seniority composition: Indeed says senior-heavy posting mix inflates its own gap).

**CONSENSUS:** There is credible, replicated evidence (Census, Dallas Fed, Azar) that recent graduates and junior-rank workers in AI-exposed fields earn less *relative to* less-exposed peers since 2022. ADP payroll (Canaries) and Indeed postings disagree on pay, and the attribution to AI is contested.
**TENSIONS:** Brynjolfsson's "employment, not base pay" versus Census and Dallas Fed's earnings declines. Kolko's tech-cycle confound versus the Dallas Fed's stable pre-trends.

**ISSUES:**
- **[High] [Framing] The stored metric and copy misdescribe the evidence.** Every point is an *observed relative gap*, none is a projection, and none is "0–2 years experience" (they are graduates by major, or rank scores 1–2). The copy's "35% of junior-role tasks vs 18% for senior" is unsourced. The research annotation calls this "strong empirical support" and cites *employment* evidence (Canaries headcount, Dallas Fed young-worker share) for a *wage* chart. That evidence includes a study whose newest vintage finds no starting-pay effect. *Flagged by:* Gimbel, Rock, Brynjolfsson.
- **[Medium] [Data integrity] Proxy rule inconsistency.** The relative-gap construct is proxied on median wage and not here. Because every point here is a gap, proxying all of them would not move the mean. The fix is the unit label, not the weight.
- **[Medium] [Data integrity] The Indeed entry gap is an overlay while Azar is plotted** (asymmetry; see above).
- **[Low] [Data integrity] Goldman −1.3 is an entry-to-experienced gap typed `survey`.** It should be `employment` or regression evidence with a note. Census should be dated at its reference-period end.
- **[Low] [Data integrity] Possible Texas data overlap** between Dallas Fed and Census *(inference)*. Census carries 55.6% of the weight on one study through the sample-size boost.

**RECOMMENDATIONS:**
- **[High] Retitle and redescribe the chart.** Suggested description: "Earnings of recent graduates and junior workers in AI-exposed fields relative to less-exposed peers, observed since 2022". Change the unit to "% earnings gap vs less-exposed peers". Rewrite the context copy and annotation in all three places, and name Canaries' no-starting-pay finding as the counter-evidence.
  *Rationale:* Imas (narrow claim), Brynjolfsson, Gimbel.
  *Trade-off:* copy and metadata only.
- **[Medium] Plot Indeed +5 (entry, 2022 base) as a proxy alongside Azar.** Alternatively, document a single gate (realized pay only) and move Azar's Revelio figure to an overlay. Either way, apply one rule.
  *Trade-off:* the headline moves about 0.6pp.
- **[Low] Re-date Census to 2025-09-30, retype Goldman, and add a one-line methodology note about Texas overlap.**

**HONEST LIMITS:** Two years of post-ChatGPT cohorts cannot separate AI from the 2022–23 tech correction, and "by 2030" cannot be extrapolated from a gap that halves within two years.

---

#### LABOR ECONOMIST REVIEW: Freelancer Rate Impact

Date: 2026-10-02
Metric: % change in average freelancer hourly rates, AI-exposed categories, by 2028
Current value: −13.7 (computed −13.68) | Points: 6 | Tier mix: T1:4 T2:2 | Proxies: 4 | Overlays: 25

**Weight shares:**
- Upwork FWI −13: 30.8% (T2, non-proxy, sampleSize 100,000)
- Hui −5.2: 23.1%
- Teutloff −25: 14.6% (proxy, postings)
- Ramp −28: 14.1% (proxy, spend)
- Upwork 2023 −5: 10.3% (proxy)
- Galdin & Silbert −5: 7.1% (proxy, projected)

**Spot-check:**
1. **Upwork FWI −13: cherry-picked subset from a vendor.**
   - The excerpt and KB say per-contract earnings fell 13% in *GenAI/creative production* contracts only.
   - The same report says AI freelancers "earn 34% more per hour", that complex AI work rose 45%, and that AI-augmented professional services rose 22%.
   - The figure is per-contract earnings, not an hourly rate.
   - `sampleSize: 100000` is unsupported. The KB says the survey had "3,000+ professionals plus platform-wide contract data". That invented sample size doubles the point's weight.
   - The upwork.com page returns 403.
2. **Hui −5.2: supported, but it measures monthly *earnings*** (jobs × price): "decrease of 5.2% in monthly earnings". It is not a rate.
3. **Teutloff −25: supported as a postings DiD, which measures demand volume.** It is dated 2026-02-01, a year after publication (2025-01-29). The date should be the end of the data window.
4. **Ramp −28: not in source.** See the hand check.
5. **Upwork 2023 −5: value contradicts its own excerpt.** See the hand check.

**EIGHT-LENS ASSESSMENT** (Bessen, Imas and Gimbel are primary; Acemoglu's and Rock's points are brief):
- **[Acemoglu]:** Freelance marketplaces are where "so-so" substitution would show first. Ramp's "$1 in reduced freelance spend for $0.03 in AI spend" (fetched) is a cost-substitution signal, not a price signal.
- **[Brynjolfsson]:** Substitution and complementarity are visible in the overlays: Upwork's AI-work premium, and Yiu et al.'s finding that exposed freelancers "reorient bidding toward higher-value contracts". The plotted line shows only the substitution side.
- **[Gimbel]:** The chart claims rates, and no plotted point measures rates. Two points are vendor statements, and one of them (Upwork FWI) is a selected negative subset from a report whose headline is positive. Her "CEO statements" warning extends to platform marketing *(inference)*.
- **[Bessen]:** Volume fell (Teutloff, Ramp, Fiverr buyers −21.9%) while spend per buyer rose (Fiverr +15.6%) and GSV per client rose (Upwork +5%). That is consistent with low-complexity demand leaving and remaining work being priced higher. The net effect on *rates* is ambiguous, and nothing here measures it.
- **[Kolko]:** Platform data are streetlamp evidence. The freelancers who left the platforms are unobserved.
- **[Imas]:** Siddiq & Zhang (overlay) is the closest evidence on prices: "demand reallocated toward lower-priced workers by 3.2% (7.9% late)" and "price importance rose 1.1%". That is commoditization, measured as demand shares, not rates.
- **[Kinder]:** Freelancers have no UI buffer, so this chart is policy-relevant. A false precise number weakens that case.
- **[Rock]:** Measurement grain: per-contract, per-month, spend share and posting counts are four different quantities averaged into one "% rate change".

**CONSENSUS:** Demand for substitutable freelance work (writing, translation, short jobs) fell sharply after ChatGPT; the evidence is strong and comes from several sources. The effect on *rates* has not been measured. The available signals (spend per buyer up, demand shifting to lower-priced workers) point both ways.
**TENSIONS:** Upwork's premium for AI work versus Siddiq & Zhang's commoditization; Bessen (elastic demand for complex work) versus the volume collapse at the low end.

**ISSUES:**
- **[High] [Data integrity] Ramp −28 and Upwork 2023 −5 are unsupported. Upwork FWI −13 is a vendor subset with an invented n.** Together they carry 55% of the weight. *Flagged by:* Gimbel, Kolko.
- **[High] [Framing] The copy says "Average freelancer hourly rates… have dropped 13.7% since ChatGPT launched"** while no point measures hourly rates. The copy and the "12–18 months before salaried workers" lead-indicator claim are unsourced. The research annotation says "Confirmed" and cites spend share, which is volume.
- **[Medium] [Viz] The "Best estimate" is a postings-volume proxy (JEBO −25).** The red ▼ trend runs from Upwork postings (2023) to Upwork per-contract earnings (2026). "Observed so far ~−15.2%" includes volume proxies.

**RECOMMENDATIONS:**
- **[High] Remove Ramp −28 and Upwork 2023 −5.** Their real content (spend share, postings) is already on the creative chart and in overlays. Set Upwork FWI to `isProxy: true` with `actualUnit` "per-contract earnings, GenAI/creative production subset; vendor-reported", and delete `sampleSize`. Re-date Teutloff. The headline becomes about −12.1, with Hui (earnings) as the only non-proxy point.
- **[High] Rename the metric to what is measured** ("Earnings and demand for freelancers in AI-exposed categories"). Alternatively, keep "rates" and add one methodology line: "No study yet measures hourly rates directly; plotted points are earnings, contract value, and demand volume, discounted as proxies." Fix the copy in all three places.
  *Trade-off:* copy only. The owner's methodology-acknowledgment preference fits here.
- **[Medium] `trendComparable: false`.**

**HONEST LIMITS:** Platform data cannot see freelancers who left, and vendors publish selectively. A rate series needs a third party with transaction-level price data. Siddiq & Zhang is the nearest candidate, if they report prices.

---

#### LABOR ECONOMIST REVIEW: AI/ML Skills Wage Premium

Date: 2026-10-02
Metric: % pay advantage for workers or postings with AI/ML skills over comparable ones without them
Current value: 29.4 (computed 29.38) | Points: 8 | Tier mix: T1:1 T2:5 T3:2 | Proxies: 3 | `trendComparable: false` ✓ | Overlays: 54

**Weight shares:**
- PwC 62: 25.9% (global, sampleSize 1B)
- Oxford OII 23: 22.7% (UK, proxy)
- Azar 8.5: 13.2%
- IMF 8.5: 12.5%
- Lightcast 28: 11.9%
- KPMG 13: 6.3%
- Indeed 2023 15: 4.4%
- Index.dev 35: 3.1%

**Spot-check:**
1. **PwC 62: matches the excerpt and KB** ("AI-skills wage premium reached 62% on average (up from 57%)").
   - The data pool 27 countries.
   - The KB's own qualifier: "Cross-country pooling can obscure US-specific dynamics."
   - The figure is from postings.
   - Under the one-rule-set principle it should be proxied like Oxford UK.
   - The overlay label for the 2025 edition says 56%, while PwC's 2026 text says 57%.
   - pwc.com returns 403.
2. **Oxford 23: matches the excerpt.** It is a UK proxy, correctly flagged.
3. **Azar 8.5 [8, 9]: matches the excerpt** ("conditional starting-wage premium of approximately 8–9 percent"). The authors call it a "descriptive conditional association, not causal". This is the only *realized-pay*, worker-level point on the chart.
4. **IMF 8.5: matches the excerpt** for US vacancies with 4+ *new* skills. The base estimate is 3–3.4% for any new skill. "New skills" is broader than AI skills, and 4+ is the upper tail (see follow-through table).
5. **Indeed 2023 15 (T3): unsupported.** It has no excerpt, the URL is a web.archive wildcard, and the KB file contains no premium figure.

**EIGHT-LENS ASSESSMENT** (Brynjolfsson, Bessen, Rock and Imas are primary; the Acemoglu and Kinder notes are brief):
- **[Acemoglu]:** A large premium for scarce AI skills fits his concentration story: gains accrue to complements of automation. He would not read it as broad-based wage gains.
- **[Brynjolfsson]:** "when a resource becomes cheap and abundant, the value shifts to its complements". The premium is the expected sign. Whether it is persistent depends on the supply response, and the LinkedIn overlay (+130% talent) suggests supply is responding.
- **[Gimbel]:** The disclaimer already gets the measurement point right (postings measure the price of the job; worker-level data measure the return to the skill). The context copy and summary card then contradict it: "reflects both scarcity of talent and the outsized productivity gains", "A rising premium signals…", "and the gap is widening".
- **[Bessen]:** He would ask how much of the premium is occupation and firm composition: market structure, *New Goliaths*, and geography (the Indeed metro and CoworkingCafe overlays).
- **[Kolko]:** The spread of 3–62% is mostly a measurement effect, as the disclaimer says. Revelio's "eroded to roughly zero" for *exposure* (a different construct from skill) is a useful contrast, correctly kept as an overlay.
- **[Imas]:** Selection: Revelio's certification overlay says "selection into certifying, not a causal return". Azar says the same of its own premium.
- **[Kinder]:** The premium accrues to those who already have the skill. The equity question is who gets access to acquiring it, which the chart cannot show.
- **[Rock]:** Measurement grain varies: postings × occupation (PwC, Lightcast), within job (Azar), and across occupations (Index.dev). The disclaimer handles this well.

**CONSENSUS:** A real positive premium exists. Realized, worker-level estimates are high single digits (Azar 8–9%); posting-level estimates run 20–60% and include seniority and location.
**TENSIONS:** Brynjolfsson (value shifts to complements, so the premium could persist) versus the supply response and selection arguments (Imas, Revelio).

**ISSUES:**
- **[High] [Framing] The copy contradicts the disclaimer and `trendComparable: false`.** "The gap is widening" and "A rising premium signals…" assert a trend the chart deliberately does not draw. "Outsized productivity gains" asserts a causal channel that Azar and Revelio explicitly disclaim. *Flagged by:* Gimbel, Imas.
- **[Medium] [Data integrity] PwC (27-country pool) is unproxied while Oxford (UK) is proxied.** It also gets a 2× sample-size boost from global postings. Proxying it moves the headline from 29.4 to about 25.2.
- **[Low] [Data integrity] Indeed 2023 15 is unsupported.** Fix the 56% vs 57% PwC overlay label. Overlay directions for Microsoft, Mercer and LinkedIn are off-topic or questionable (item 10).

**RECOMMENDATIONS:**
- **[High] Fix the copy in all three places.** Suggested text: "Postings that ask for AI skills advertise about X% more; the one worker-level estimate finds ~8–9% higher starting pay. Neither is a causal return." Delete "widening".
  *Trade-off:* copy only.
- **[Medium] Proxy PwC (non-US rule) and remove Indeed 2023.** Optionally prune the off-topic overlays.

**HONEST LIMITS:** No study yet estimates a causal return to acquiring AI skills in the US. Every number here is a conditional association.

---

#### Completion record

- **Target reviewed:** 4 wage charts on `main` @ 4db7a03.
- **Evidence vintage:** through Census CES 2026-09-10 and Fed FEDS 2026-09-30.
- **Decisive findings:**
  - Median wage: 3 unsupported points (51% of weight) plus an unproxied Indeed gradient. The only true median estimate is Metaculus −0.6.
  - Freelancer: no point measures rates. Two points are unsupported, and the top-weighted point is a vendor subset with an invented n.
  - Entry-level: the evidence is real but is a relative gap, and the title, copy and annotation misdescribe it.
  - High-skill: the copy contradicts the chart's own disclaimer.
  - Page mechanics: proxies feed "Observed so far" and "Best estimate" on all four charts.
- **Files changed:** none in the repo. This review file only.
- **Checks run:**
  - Re-implemented `computeAggregate` to get weights and sensitivities.
  - Read stored excerpts and `source-content` KB files for all heavy points.
  - Fetched Indeed Hiring Lab (2026-09-17), Dallas Fed (2026-09-22), Census CES-WP-26-56, Ramp Velocity and BLS OEWS.
  - Got 403 on Upwork (×2), Goldman and PwC.
- **Unresolved:**
  - Upwork FWI and Freelance Forward 2023 figures could not be fetched (403).
  - Goldman 2023 +1 has no source text anywhere in the repo.
  - Texas overlap between the Dallas Fed and PSEO samples is unconfirmed (inference).
  - The web search budget for this session was exhausted, so there was no secondary verification.


---

# Appendix C — Adoption, exposure, signals and homepage

### Labor economist review: homepage, adoption, exposure and signals

Date: 2026-10-02
Target: jobsdata.ai, `~/jobsdata`. The `src/` tree is identical to `main` at 4db7a03; the checked-out branch `chore/economist-review-sync` differs only in `.claude/commands/`. I did not switch branches. The review is read-only and edits nothing.
Evidence vintage: data files as of 4db7a03 (newest point BTOS cycle 202619, ref. 2026-09-06).
Scope:
- 6 prediction files: adoption ×3, exposure ×2, signals ×1
- homepage: `page.tsx`, `HeroTriad.tsx`, `FunnelStrip.tsx`, `FeaturedReads.tsx`, intro copy
- `ResearchEvidence.tsx` (renders on /productivity, not the homepage)
- `AdoptionLadder.tsx` (renders only on /predictions/ai-adoption-rate)
- site-wide sections as assigned
- prior-review follow-through

Method: the labor-economist-review skill (re-verified Oct 2026). Quoted economist text comes only from SKILL.md or from sources I fetched. Anything marked *inference* is this review's synthesis.

Sources I fetched to check figures:
- Imas & Schaal, "Has AI impacted the labor market yet?" (Substack, Sep 29, 2026)
- Jacobs & Imas, "Economic Policy for AGI" (DeepMind Institute)
- Anthropic Economic Index, January 2026 report

---

#### TOP ISSUES IN THIS SCOPE (ranked)

1. **[High / Data integrity] The FunnelStrip still mixes constructs, and its Anthropic bar uses the wrong vintage.** This is prior item 6, and none of it has been fixed.
   - The "Projected · % of jobs lost by 2030" row plots WEF 8 (gross, global, all causes) and Goldman '25 7 (gross, "if widely adopted"). It sits a scroll below a hero that says "~1% projected *net* loss."
   - Stanford/ADP's 6% *employment* decline for 22–25-year-olds sits under "% fewer job postings."
   - Denmark (Humlum-Vestergaard, earnings and hours) and the ECB (euro-area hiring intentions) sit under "Measured," which the hero calls "Measured US job loss."
   - The "Exposure" row includes Hartley's 38% *usage* survey.
   - **New finding:** the Anthropic bar shows 36% and links to the January 2026 report. That report says "49% of jobs have seen AI usage for at least a quarter of their tasks," and that automation was 45%, not 49%. The 36% is the early-2025 vintage.
2. **[High / Framing] Two charts still headline averages their own disclaimers disown** (prior item 7).
   - `workforce-ai-use` headlines **35.2%**. Its disclaimer says "the average across them is not a meaningful estimate," yet the page context copy opens "An estimated 35.2% of US workers have AI observed doing some part of their actual work."
   - `workforce-ai-exposure` headlines **41.7%** across five different denominators: % of jobs, % of tasks, % of skills, % of occupations, and % of work.
3. **[High / Data integrity] The adoption ladder contradicts the chart above it** (prior item 7).
   - It shows "In production 10% (Census BTOS)." The BTOS series on the same page reads 23.8%, and BTOS no longer asks "in production."
   - "Piloting/testing 15% (Census BTOS)" matches no BTOS question.
   - "Workers using weekly 37%" is Bick et al.'s *any use at work* figure. Their weekly rate is ~23%, per the St. Louis Fed overlay on `genai-work-adoption`.
4. **[High / Narrative coherence] The hero's "~1%" link lands on a page that tells a different story.**
   - The hero says "Projected net job loss by 2030 ~1%, median of 4 forecasts (0.6–3%)."
   - The page it links to shows a 1.4% headline and a "Projections range 0.4–11.5% (median ~4%)" line.
   - The page's context copy says projections "cluster around 5-12% by 2030."
   - A reader who clicks through gets three numbers that disagree with the hero. (The fix belongs to the displacement reviewer; the coherence finding belongs here.)
5. **[Medium-High / Framing] Stale context copy contradicts corrected data on four of the six charts in scope.** This copy lives in `CONTEXT_MAP` in `PredictionDetailClient.tsx` and is duplicated in `src/lib/chat/site-content.ts`.
   - **earnings-call:** the copy still describes "mention AI in the context of workforce, efficiency, or restructuring." PR #738 retitled the chart to count *any* "AI" mention.
   - **ai-adoption-rate:** the copy says "use AI in production… up from 3.8%… information and finance lead at 20-30%." The current wording is "any business function." The first point is 3.7. The source gives Information 39.7% and Finance 33.9%.
   - **ai-business-formation:** a relative difference-in-differences gap is described as an absolute 16% rise "since ChatGPT."
   - **genai-work-adoption:** the copy cites a 25,000+ sample and 55.9% overall use. The description says 57.9%, and the May 2026 tracker pools ~40,000.

Prior-review follow-through (detail at the end): items 6–9 are 2 done (8, 9) and 2 not done (6, 7). June homepage, adoption and exposure recommendations: 3 done, 4 partial, 3 not done.

---

### PART A — PER-CHART REVIEWS

```
LABOR ECONOMIST REVIEW: AI Adoption Rate Across US Companies (ai-adoption-rate)
Date: 2026-10-02
Metric: Share of US firms answering "yes" to BTOS Q7. Through Sep 2025 the question asked about AI use "in producing goods or services"; from Nov 2025 it asks about use "in any of its business functions." Two-week reference period.
Current Value: 23.8 (latest; currentValue synced) | Sources: 12 points (8 source records) | Tier Mix: T1:12 T2:0 T3:0 T4:0 | Overlays: 95

EIGHT-LENS ASSESSMENT (Bessen and Kinder skipped: no sector-demand or distributional content on the line itself):

[Acemoglu]: A firm saying "yes, in any function, in the last two weeks" is the occasional-use end of his chain, not production deployment. The chart is honest that it measures reach. The problem is the context copy, which still calls this "use AI in production."
[Brynjolfsson]: Organizational readiness is the gate (McElheran et al.: 22.8% of manufacturing plants by 2021, intensity far lower). The chart has no intensity measure. The NY Fed overlay ("median adopter has just 17% of workers using AI") is the best depth signal on the page and is buried among 95 overlays.
[Gimbel]: This is observed, Tier 1, with standard errors around 0.3pp. The line is real.
  - The two Nov-2025 and Feb-2026 points carry a [16–22] band, while the source SEs are ~0.3. The band looks borrowed from "hovered between 17% and 20%" and should go.
  - Later points carry no band at all.
[Kolko]: He used BTOS in March 2026 ("fewer than one-fifth of firms"). That is now dated: the same series reads 23.8%. Measure sensitivity is the story. CES puts employment-weighted use at 32% against 18% of firms, so the gap to Bloom's 78% is partly *firm-size weighting*, not only definition.
[Imas]: Reach without depth. Census is adding three AI core questions (Sept 2026 FR notice), which may finally separate use from integration. The ladder below the chart (see Part B) undermines the reach/depth distinction the chart sets up.
[Rock]: The firm is the right grain for adoption. The binary measure cannot show the software layer that converts capability into use.

CONSENSUS: BTOS is the right anchor. Every lens accepts it over consultancy surveys.
TENSIONS: Is the Sep→Nov 2025 step (10.0 on the old wording → 17.3 on the new) growth or wording? The owner treats the reworded question as one continuous series ("rung 2"), and this review respects that. Kolko and Gimbel would still want the reader *told* where the wording changed, because the latest-method trend arrow (3.7 → 23.8, "Trending ▲") spans both wordings.

ISSUES:
[High] [Framing] The context copy still says "in production… up from 3.8%… information and finance lead at 20-30%… construction and agriculture under 5%." The data say any business function, 3.7%, Information 39.7% and Finance 33.9%. The construction/agriculture claim has no source on the chart.
  Flagged by: Gimbel, Kolko
[High] [Data integrity] The AdoptionLadder renders under this chart with "In production 10%" and "Piloting 15%" attributed to BTOS (see Part B).
  Flagged by: Kolko, Imas, Gimbel
[Medium] [Data integrity] The [16–22] confidence band on two points is not supported by the source SEs.
  Flagged by: Gimbel
[Low] [Visualization] 95 overlays, several of which are not adoption measures:
  - capex: Citadel, Dimon
  - productivity: arXiv "early productivity gains," HBR workslop
  - exposure: Penn Wharton "40% of exposed jobs replaceable"
  - restatements of BTOS itself: Anthropic 9.7%, the Fed 18%, the BTOS supplement, Kolko
  Restatements of the plotted series add nothing.
  Flagged by: Gimbel ("adding sources" noise)
[Low] [Data integrity] The Chen & Stratton overlay reads "~50% of engineers adopted." The skill cites the current version at ~40% at the median adopting firm. Check the vintage.

RECOMMENDATIONS:
[High] Rewrite the ai-adoption-rate context in both CONTEXT_MAP and chat site-content.ts. Use "any business function," 3.7%, and the sector figures from the cited source.
  Rationale: Gimbel and Kolko. A corrected series under uncorrected prose is the worst of both.
  Trade-off: copy only.
[Medium] Add one dated annotation at Nov 2025: "BTOS wording broadened; old wording last read 10.0%." This is a note, not a series break, and it is consistent with the owner's rung-2 rule.
  Rationale: Kolko (measure sensitivity), Imas (what "adoption" means).
  Trade-off: one annotation, no new dimension.
[Medium] Delete the [16–22] bands or replace them with ±2 SE.
[Low] Prune overlays that restate BTOS or are not adoption measures. Pin the NY Fed "17% of staff" depth overlay near the top.

HONEST LIMITS: No public US series measures adoption *intensity* at the firm level yet. Until the new BTOS questions report, reach is all anyone can chart.
```

```
LABOR ECONOMIST REVIEW: Generative AI Adoption (genai-work-adoption)
Date: 2026-10-02
Metric: % of employed US adults 18–64 who have used genAI for work.
Current Value: 45.2 (latest; synced) | Sources: 13 points | Tier Mix: T1:11 T2:2 T3:0 T4:0 | Overlays: 56

EIGHT-LENS ASSESSMENT (Acemoglu, Bessen and Rock skipped: worker-reach metric, no task, demand or macro claim):

[Brynjolfsson]: This is the right complement to firm-level BTOS. Workers lead firms, and the 45% vs 24% gap is itself informative.
[Gimbel]: The headline and the trend use one instrument: the RPS (Bick-Blandin-Deming) runs from 32.9 to 45.2. Four other instruments are interleaved on the same line:
  - Pew 2025: ChatGPT only, 28
  - SHED: prior month, 25
  - NY Fed SCE: last 12 months, 39
  - Pew 2026: chatbots, 38
  As a result the line zig-zags (37.4 → 25 → 40.7 → 39 → 43 → 38 → 45.2). The dips are instrument differences, not changes in behavior.
[Kolko]: Measure sensitivity is visible but unlabeled. Pew's 2025 figure counts ChatGPT only, so it is a lower bound on a narrower construct.
[Imas]: Reach vs depth again. The depth measures sit in the overlays:
  - work hours assisted: 5.2–6.3%
  - aggregate hours saved: 2.3%
  - the "widespread but shallow" task-level paper
  He also cautions that self-reports can *understate* use. Note his Google affiliation when weighing the ATLAS overlay ("only 14% of conversational AI use is work-related").
[Kinder]: The overlays carry the distributional story: 58.7% use among college graduates vs 22.9% among non-graduates, and 15.9% for under-$50K earners vs 66.3% over $200K. That is the most policy-relevant content on the page, and it is invisible unless hovered.

CONSENSUS: Reliable reach series; the 45% headline is defensible.
TENSIONS: Imas (self-reports understate where use is stigmatized) vs Acemoglu (occasional use ≠ deployment). The page needs both caveats.

ISSUES:
[Medium] [Visualization] Different instruments plotted on one connected line make wording differences look like reversals.
  Flagged by: Gimbel, Kolko
[Medium] [Framing] Stale context copy:
  - "25,000+ adults": the May 2026 tracker pools ~40,000.
  - "Overall adoption (55.9%)": the description says 57.9% (Q1 2026).
  - research-annotations says "Feb & May 2025 values estimated from tracker chart"; that is fine, but the Bick 2025 WP excerpt dates the 40.7% to Nov 2025, and this should be checked against the published series.
[Low] [Data integrity] `metricType: "employment"` on three survey points (both Pew points and the May 2026 tracker). They are surveys.

RECOMMENDATIONS:
[Medium] Keep all the points (owner rule), but render the non-RPS points unconnected. Alternatively, add one disclaimer line: "The connected line is the RPS; other surveys use narrower or broader definitions."
  Rationale: Gimbel. Trade-off: a disclaimer line is cheaper than a new series dimension and is the owner's preferred route.
[Medium] Fix the context numbers.
[Low] Promote "6.3% of work hours AI-assisted (Q2 2026)" into the context copy as the depth companion to the 45% reach figure.
  Rationale: Imas, Brynjolfsson.

HONEST LIMITS: Self-reported use has bias in both directions. No administrative measure of individual AI use exists.
```

```
LABOR ECONOMIST REVIEW: AI-Driven New Business Formation (ai-business-formation)
Date: 2026-10-02
Metric (actual): a difference-in-differences gap. It is the extra post-ChatGPT firm formation in AI-compatible or exposed industries *relative to less-exposed industries*. The unit field says "% increase in firm formation." CLAUDE.md says "% of new businesses."
Current Value: 16 (weighted; synced) | Sources: 2 | Tier Mix: T1:2 | Overlays: 35

EIGHT-LENS ASSESSMENT (Kinder and Rock skipped):

[Acemoglu]: This is the reinstatement side of his framework: new firms and new tasks. It is welcome on a site dominated by displacement. Both estimates, though, are relative gaps across industries, not aggregate gains.
[Brynjolfsson]: The mechanism (cheaper experimentation, higher-ability entrants) is consistent with his complementarity view. The HBS Kenya RCT overlay (no average effect; high performers +20%, low performers −10%) is the heterogeneity check.
[Gimbel]: Two points do not make a trend. A weighted "16" between 10 and 20 is a summary of two papers, not an estimate.
[Bessen]: Entry is the demand-expansion channel he would look for. The Bena-Bian-Giannetti overlay ("+7% new-firm employment") is closer to his jobs question than the formation count.
[Kolko]: Timing. The pandemic BFS surge (+24% vs 2019, now correctly an overlay) predates ChatGPT. A differential design across industries handles that better than raw BFS, so the remaining two points are the right ones to keep.
[Imas]: Who enters? Stripe and Carta show a solo-founder shift. Entry may substitute for employment (founders not hiring), which the a16z/BofA overlay hints at ("new businesses elevated but not hiring").

CONSENSUS: Keeping only the two difference-in-differences papers was correct.
TENSIONS: Is formation a labor-market good (Bessen, Acemoglu reinstatement) or a symptom of weak hiring (Imas, Kinder: graduates in exposed majors moved into self-employment, +0.48pp)?

ISSUES:
[Medium] [Framing] The context copy says "increased an estimated 16% since ChatGPT's release." It is a relative gap, not an absolute increase.
  Flagged by: Gimbel, Kolko
[Medium] [Data integrity] `timeHorizon: "by 2030"` on two observed, backward-looking estimates. `metricType: "employment"` on formation counts. The unit conflict with CLAUDE.md is still unresolved (a June finding).
[Low] Bao-Lou-Sun appears twice as overlays (2024-06-01 and 2025-03-01). Dedupe.
[Low] BFS monthly overlays (+0.7% MoM "up", −4.6% "down") are noise at monthly frequency and are not attributed to AI.

RECOMMENDATIONS:
[Medium] Set the unit to "% more firm formation in AI-exposed vs less-exposed industries" and the horizon to "Since late 2022." Align CLAUDE.md. Rewrite the context to say "relative to less-exposed industries."
[Low] Drop the BFS month-to-month overlays or roll them into one "BFS context" overlay.

HONEST LIMITS: No study yet links AI-era entry to net employment at scale. Two credible difference-in-differences designs are all the evidence there is.
```

```
LABOR ECONOMIST REVIEW: Observed AI Use at Work (workforce-ai-use)
Date: 2026-10-02
Metric: % of US workers with "observed" AI use. Three thresholds:
  - any task coverage in Anthropic traffic: 70
  - occupations with AEI observed-usage score ≥0.5 (Apollo): 3.7
  - self-reported LLM use (Hartley): 38.3
Current Value: 35.2 (weighted; synced) | Sources: 3 | Tier Mix: T1:1 T2:2 | trendComparable: false

EIGHT-LENS ASSESSMENT (Acemoglu, Bessen and Kinder skipped):

[Brynjolfsson]: The right question: substitution vs complementation in *use*. Not answered here.
[Gimbel]: The disclaimer is exemplary. It says the average is not meaningful. The headline then prints the average anyway.
[Kolko]: Measure sensitivity runs 3.7 → 70, a 19-fold spread. The chart *is* the sensitivity analysis. It should present itself that way.
[Imas]: Breadth vs depth is handled well in the disclaimer (ATLAS 88% reach vs 21% task depth). Note the Google affiliation on ATLAS.
[Rock]: The grain is mixed: task coverage (Anthropic), occupation threshold (Apollo), worker self-report (Hartley).
  - Apollo's 3.7% is built from the Anthropic Economic Index, so two of the three points come from one source team's data at different cutoffs (prior item 3, dedupe by source team).
  - "Workers in occupations whose AEI score ≥0.5" is an occupation-level intensity threshold, not "workers with observed AI use."

CONSENSUS: The three numbers answer three different questions. The disclaimer says so.
TENSIONS: None substantive. All eight would drop the average.

ISSUES:
[High] [Framing] The 35.2% headline, and context copy opening "An estimated 35.2% of US workers…", contradict the disclaimer. Prior item 7 is not done.
  Flagged by: Gimbel, Kolko, Rock
[Medium] [Data integrity] Apollo is derived from AEI, so it is not independent of the Anthropic point. Apollo is also an asset manager (T2), and its excerpt is fine.
[Low] Hartley 38.3% also appears under "Exposure" on the homepage FunnelStrip. It is a usage survey.

RECOMMENDATIONS:
[High] Suppress the weighted headline for this chart, using a per-chart flag such as `headline: "range"` and the existing min–max display. Show "3.7–70% depending on threshold." Rewrite the context to lead with the range.
  Rationale: all lenses. Trade-off: a one-field rendering branch. That is less complexity than the reader-facing contradiction it removes.
[Low] Note in the disclaimer that Apollo applies a stricter cutoff to Anthropic's data.

HONEST LIMITS: No cross-platform usage telemetry exists. Gimbel's "comprehensive usage data from all the leading AI companies" remains the missing dataset.
```

```
LABOR ECONOMIST REVIEW: US Workforce AI Exposure (workforce-ai-exposure)
Date: 2026-10-02
Metric (stated): % of US jobs exposed. Metric (actual) varies by point:
  - Goldman: % of work substitutable, 25
  - Pew: % of workers in most-exposed jobs, 19
  - Eloundou: % of workers with ≥10% of tasks exposed, 80
  - BIS: % of skills, 26.5
  - Eisfeldt: average % of tasks per occupation, 23
  - Burning Glass: % of workers in highly impacted occupations, ~31
  - PWBM: % of *exposed* employment with ≥50% of tasks replaceable, 40
  - Cognizant: % of *occupations* with ≥1 exposed task, 93
Current Value: 41.7 (weighted; synced) | Sources: 8 | Tier Mix: T1:6 T2:2 | dataType: 7 "projected", 1 "observed"

EIGHT-LENS ASSESSMENT (Bessen and Kinder skipped):

[Acemoglu]: Exposure is the first link in a four-step chain. His own input was ~20% of tasks exposed. A 41.7% "jobs exposed" headline cannot be compared with his 20% task share. The chart doesn't say which it is.
[Brynjolfsson]: SML found "few occupations are fully automatable." Shares of occupations (Cognizant 93%) and shares of tasks belong on different axes.
[Gimbel]: Her February 2026 comparison is the operating rule: the metrics agree on *who* is exposed and disagree on *how much*. The Yale Budget Lab overlay says exactly this, and the headline ignores it.
[Kolko]: Results "can be sensitive to which AI measure is chosen." The 19–93% range is the finding. Nearly all points are typed "projected," but exposure scores are current capability mappings, not forecasts.
[Imas]: Exposure can invert risk (O-ring). The Imas/Shukla overlay is tagged Tier 4 even though its argument rests on a peer-reviewed NBER model (Gans/Goldfarb). The tier is fine for a Substack, but the point deserves a place in the context copy.
[Rock]: This is his rubric's misuse case. Eloundou's 80% is the "≥10% of tasks" threshold, defined "as a proxy for potential economic impact without distinguishing between labor-augmenting or labor-displacing effects." Averaging it with a share of skills and a share of occupations produces a number with no unit.

CONSENSUS: Unanimous that a weighted average of these eight is not an estimate of anything.
TENSIONS: Whether to show any headline (Gimbel, Kolko: show the range) or a single best measure (Rock: pick one rubric and version it).

ISSUES:
[High] [Framing] The weighted 41.7% headline averages five denominators. The June P2 recommendation is partly done: the disclaimer now calls the average "a mathematical summary, not a consensus estimate," but the headline still prints it.
  Flagged by: all applicable lenses
[Medium] [Data integrity] Construct and denominator mislabels:
  - Goldman 25 is "substitute up to one-fourth of current work"; its *exposure* figure is "two-thirds of current jobs."
  - PWBM 40 is a share of *exposed* employment, not all jobs. Hand-check against the PWBM text.
  - Cognizant 93 is a share of occupations from a vendor that sells AI services.
  - BIS and Eisfeldt are shares of skills or tasks.
[Medium] [Data integrity] dataType "projected" on capability mappings. Eloundou is both plotted and repeated as an overlay ("80% of workers have ≥10% tasks affected").
[Low] [Framing] The context copy says exposure estimates "have risen from 25% to nearly 50%." That is a definitional drift presented as a trend.

RECOMMENDATIONS:
[High] Same flag as workforce-ai-use: show the range, not the weighted mean. Rewrite the context to state that measures agree on ranking and disagree on magnitude, citing the Budget Lab overlay already on the chart.
  Trade-off: no new dimension. This follows the owner's acknowledgment-over-complexity rule.
[Medium] Mark task-share, skill-share and occupation-share points as `isProxy` with a stated conversion. Alternatively, move Cognizant (vendor, occupation denominator) to an overlay under the item-5 vendor rule.
[Low] Retype the capability mappings as "observed" or a new "exposure" dataType. Remove the duplicate Eloundou overlay.

HONEST LIMITS: No exposure rubric is validated against realized displacement. The 3.6-fold divergence across LLM raters (NBER overlay) means even a single rubric carries wide uncertainty.
```

```
LABOR ECONOMIST REVIEW: S&P 500 earnings calls citing 'AI' (earnings-call-ai-mentions)
Date: 2026-10-02
Metric: % of S&P 500 earnings calls citing the term "AI" (FactSet full-season search). The denominator is 500 through Q3 2025 and calls actually held (485–498) from Q4 2025.
Current Value: 67 (latest; synced) | Sources: 13 | Tier Mix: T1:13 | Overlays: 5

EIGHT-LENS ASSESSMENT (Acemoglu, Bessen, Kinder and Rock skipped):

[Brynjolfsson]: Discussion intensity as a leading indicator (the ACM overlay) is a reasonable hypothesis. It is not evidence of deployment.
[Gimbel]: "CEO statements are possibly the worst way to do it." Mentions measure talk. The chart is now honestly titled, and the description states "not workforce-specific."
[Kolko]: This is narrator's and over-attribution bias in pure form. Useful as a gauge of salience only.
[Imas]: This is not adoption, yet the chart's `category: "adoption"` makes the page header read "AI Adoption." The a16z overlay (augmentation out-mentions substitution 8:1) is the more labor-relevant cut.

CONSENSUS: Fine as a salience signal; never as adoption or displacement evidence.
TENSIONS: None.

ISSUES:
[High] [Framing] The context copy (both copies) still says "mention AI in the context of workforce, efficiency, or restructuring… up from 8% before ChatGPT… headcount growth 3.2 percentage points lower." That contradicts the retitled chart, which counts any mention. The 3.2pp Goldman claim is presented as fact about *this* metric, but it comes from a different construct. I did not hand-check it in this pass.
  Flagged by: Gimbel, Kolko
[Low] [Data integrity] The denominator change at Q4 2025 (÷500 → ÷calls held) adds about +1–2pp. It is disclosed in the description; fine.
[Low] category "adoption" vs the methodology page's "signal, counted separately."

RECOMMENDATIONS:
[High] Rewrite the context: "X% of S&P 500 calls cited 'AI' (any context), up from ~22% in Q1 2023." Move the Goldman 3.2pp result to an overlay label only, which it already has.
[Low] Set the header category to "Signal."

HONEST LIMITS: Mention counts cannot separate hype from deployment.
```

---

### PART B — HOMEPAGE COMPONENTS

```
LABOR ECONOMIST REVIEW: Homepage evidence funnel (FunnelStrip.tsx)
Date: 2026-10-02
Metric: five rows, 16 bars:
  - "Exposure: % of jobs impacted by AI"
  - "Productivity: % faster AI makes us"
  - "Hiring: % fewer job postings"
  - "Projected: % of jobs lost by 2030"
  - "Measured: actual job loss so far"
Values are hand-set in the component.

EIGHT-LENS ASSESSMENT:

[Acemoglu]: The funnel is his chain made visual (exposure → automatable → automated → loss). That is the right idea. But the "Projected" row is gross (WEF, Goldman '25), so the funnel fails to narrow where his framework says it must, because reinstatement is missing.
[Brynjolfsson]: The productivity row double-counts. "Median (9 studies)" = 21 already contains Cui/Demirer (20.7 as time saved) and Brynjolfsson-Li-Raymond (13). Both are then plotted again as 26 and 15 on a different scale. "Demirer et al. '25" and "Cui, Demirer… 2025" are the same paper credited differently.
[Gimbel]: The measured row mixes outcomes:
  - Dallas Fed 0.1: contribution to the unemployment rate in pp
  - Yale 0: no relationship
  - Humlum-Vestergaard 0: Danish earnings and hours
  - ECB 0: euro-area hiring *intentions*. The ECB quote ("about 4% more likely to hire") is not a job-loss measure at all.
[Kolko]: Measure choice drives every row. The IMF 40% is global and its range [26, 60] spans country income groups, not uncertainty. Hartley's 38% is usage, not exposure. Anthropic's 36% is a superseded vintage: the cited January 2026 report states 49%.
[Imas]: The "Hiring" row puts the Canaries age-22–25 *employment* decline under "% fewer job postings." It also uses the July 2025 vintage (6%) while the current Canaries paper reports a 19% gap. These are different quantities (absolute decline vs a relative gap), so both cannot be shown without explanation.
[Kinder]: The funnel is the best place on the site to show who is behind the numbers, and it shows none of it. Acceptable for a summary strip. Not a priority.
[Rock]: Exposure row grain: the IMF counts jobs; Anthropic counts occupations with ≥25% of tasks.
[Bessen]: Skipped. No demand content.

CONSENSUS: The funnel concept is the site's best single idea. Its contents undercut it.
TENSIONS: Whether the projected row should be net only (Acemoglu, Gimbel) or show gross alongside net with a label (Bessen: gross churn is real and informative).

ISSUES:
[High] [Data integrity] The Projected row shows WEF 8 (gross, global, all causes) and Goldman '25 7 (gross, superseded; the site plots Goldman's 2026 net 0.6) under "% of jobs lost by 2030." Its median is 7, while the hero directly above says 1 (net). Prior item 6.
[High] [Data integrity] Anthropic 36% with a January 2026 link. The report says "49% of jobs have seen AI usage for at least a quarter of their tasks." The quote "augmentation (52%) has overtaken automation (49%)" misstates the automation share, which is 45%.
[High] [Data integrity] Stanford/ADP employment (22–25s) is labelled as postings, and the vintage is stale.
[Medium] [Data integrity] Denmark and euro-area points sit in a row the hero calls US. The ECB value 0 is not a measured job loss.
[Medium] [Data integrity] Hartley 38% (usage) is in the Exposure row.
[Medium] [Visualization] Two productivity studies are double-plotted outside the median on a different scale.
[Low] "16 studies" counts the median bar as one study.

RECOMMENDATIONS:
[High] Projected row: replace the three bars with the four net forecasts the hero already uses: Goldman net 0.6, Bloom (US) 1.2, Metaculus 1.3, Acemoglu "<2–4%" drawn as a bound. Put the gross figures in the hover text, or in a single "gross churn (WEF 8%)" bar visibly labelled *gross*.
  Rationale: Acemoglu, Gimbel. Trade-off: none; it removes an inconsistency.
[High] Update Anthropic to 49% (Jan 2026 vintage) and correct the quote. Move Hartley out of Exposure, or relabel the row "Exposure & use."
[High] Hiring row: either relabel the Canaries bar as "Employment, ages 22–25 (ADP)" or replace it with a postings study.
[Medium] Measured row: keep the US-only bars. Move Denmark and the ECB into hover text as "outside the US: also null."
[Medium] Drop the two duplicate productivity bars, or show them as members of the median on the time-saved scale (20.7, 13).
```

```
LABOR ECONOMIST REVIEW: Adoption ladder (AdoptionLadder.tsx, on /predictions/ai-adoption-rate)
Date: 2026-10-02
Metric: four hand-set rungs on one bar scale:
  - "In production 10% (Census BTOS)"
  - "Piloting/testing 15% (Census BTOS)"
  - "Workers using weekly 37% (NBER Bick et al.)"
  - "Any corporate use 78% (NBER Bloom et al.)"

ASSESSMENT (Kolko, Imas, Gimbel, Brynjolfsson; others skipped):

[Kolko]: The 10% is BTOS's last reading on the old "producing goods or services" wording (10.0%, Sep 2025). The chart directly above reads 23.8% on the current wording. The ladder's own premise, that the gap is "definitional, not contradictory," is now contradicted by the same agency's series on the same page.
[Gimbel]: "Piloting/testing 15% (Census BTOS)" has no BTOS question behind it. The nearest BTOS item is expected use in the next six months (27.6% in cycle 202619). It is an unsupported number with a Tier 1 label.
[Imas]: "Workers using weekly 37%" is Bick et al.'s any-use-at-work figure (37.4%, Aug 2025). The weekly figure in the same research program is ~23% (St. Louis Fed overlay on genai-work-adoption). The rung also changes the denominator from firms to workers mid-ladder, so the bars are not nested rungs.
[Brynjolfsson]: The real gap between BTOS 24% and Bloom 78% is partly *who is weighted*. Bloom surveys executives at larger firms across four countries. CES puts employment-weighted use at 32% against 18% of firms. The ladder copy attributes the whole gap to definition.

ISSUES:
[High] [Data integrity] Stale and unsupported BTOS rungs (prior item 7, not done).
[High] [Data integrity] The "weekly" label is wrong for 37%.
[Medium] [Framing] Mixed denominators (firms and workers) on one ladder. The gap is attributed solely to definitions.

RECOMMENDATIONS:
[High] Rebuild with sourced values, all firm-level:
  - BTOS any-function use 23.8%
  - BTOS six-month expected use 27.6%
  - CES employment-weighted 32%
  - Bloom executives (4 countries) 78%
  Drop the worker rung (it lives on genai-work-adoption). Change the caption to "definition *and* firm-size weighting."
  Better still, read the BTOS rungs from the JSON so they cannot drift again.
  Trade-off: small code change; removes a recurring staleness source.
```

```
LABOR ECONOMIST REVIEW: Productivity section (ResearchEvidence.tsx) and the 21% median
Date: 2026-10-02
Metric: median % time saved per task across 9 studies tagged `timeSavedPct`: 13, 16.4, 18, 20.7, 21, 25.1, 25.9, 40, 55.8. Median 21, range 13–56. Arithmetic verified.

EIGHT-LENS ASSESSMENT:

[Acemoglu]: These are easy-to-learn, well-specified tasks: a single coding task (55.8), short writing tasks (40), a court-review simulation with law students (25.9). By his Hulten logic, a 21% per-task saving multiplied by the share of tasks actually affected gives a small macro number. The page does not show that multiplication.
[Brynjolfsson]: The harmonization is careful. Throughput gains are converted to time saved (26% more PRs → 20.7%; 15% more resolutions → 13%). That is the right single scale. His QJE heterogeneity (novices gain most) is in the row text. Good.
[Gimbel]: The header says "early signs of macro gains are now appearing in BLS data," and the takeaway box is titled "Key gap narrowing." Her reading of the same productivity data is "strong, but not unusually so," possibly compositional, and reflecting "people investing in AI not people becoming more productive by using AI." The box's own last sentence concedes attribution is open. The title should not claim it.
[Kolko]: Robustness check (*inference*): swap METR's favorable subset (18) for its new-recruit estimate (4), or drop it. The median stays at 21. Replace Peng (55.8) with 0 and it is still 21. The median is robust. Good.
[Imas]: The micro–macro bridge exists on the site but not here. Bick et al. (2026) estimate AI saves US workers 2.3% of work hours in aggregate (overlay on genai-work-adoption). The macro tile still cites the 2024 working paper at ~1.4%. Update it. The 21% → ~2% contrast is the cleanest illustration of his endogenous-adoption point.
[Rock]: J-curve. Early aggregate data measure investment, not payoff. Worth one line.
[Bessen]: Output growth vs productivity growth decides employment. Not this section's job; skip.
[Kinder]: Skipped.

ISSUES:
[Medium] [Framing] "Early signs of macro gains are now appearing in BLS data" and "Key gap narrowing" assert attribution that Gimbel, Brynjolfsson's own Takeoff Tracker ("no evidence of a break from recent levels in TFP growth") and the box's own caveat do not support.
  Flagged by: Gimbel, Kolko, Acemoglu
[Medium] [Data integrity] The macro tile's Bick-Blandin-Deming entry uses the 2024 vintage (1.4%). The 2026 figure on the site is 2.3% of work hours.
[Low] [Visualization] The HBR workslop survey ("−2 hrs/incident") is plotted on the same % productivity axis and counted as one of the "negative" studies. Different unit.
[Low] [Framing] Homepage concept bar: "Workers using AI are 20-40% faster at individual tasks." The site's own median is 21% with 5 of 9 studies at or below 21. Use "a median of about 20%."

RECOMMENDATIONS:
[Medium] Rename the takeaway to "Micro gains, macro unclear." Change the header to "BLS productivity is above its 2007–19 pace; AI's share of that is not yet identified."
[Medium] Update Bick et al. to 2.3% (2026) and put it next to the 21% as "per task vs per economy."
[Low] Remove the workslop row from the % axis, or give it its own note.
```

**FeaturedReads.tsx.** The five summaries are careful and well calibrated. The Imas & Schaal summary is the clearest statement on the site of how contested the junior-hiring evidence is.
- **Verified against the fetched post:** the Norway figures (0.1% vs 0.3%), the education control halving the Canaries gap, Gallup's 1% of laid-off workers citing AI, the Danish nulls, and the Ramp entry-level +12%.
- **Date error:** the date shown for "Economic Policy for AGI" is "Jul 9." The DeepMind Institute page is dated September 16, 2026. If an earlier preprint was meant, link that instead.
- **Header:** "Important Reads This Week" is followed by `new Date()`, so the header always shows today's date while some items are three months old. *Inference:* say "Important reads" and drop the live date, or show the date the list was last edited.
- **Coherence:** the lead read says the evidence supports "a narrow claim" and that the attribution "is contested." The intro paragraph directly above it says "one pattern… entry-level and freelance work is compressing." See the coherence section below.

---

### PART C — SITE-WIDE SECTIONS

#### EXECUTIVE SUMMARY (draft)

The eight would recognize the site's architecture as their own consensus made public:
- exposure, adoption, productivity and loss are kept as separate constructs
- observed data are separated from projection
- a measured-loss figure of zero sits next to a small projected net figure, and neither is averaged into the other

The hand-set hero triad (~21% time saved per task, ~1% projected net loss, ~0% measured) is close to the position all eight hold as of autumn 2026. Micro gains are real. The aggregate has not moved. The serious forecasts of net loss are low single digits. Every hero number has an audit trail: the 21% median is recomputed in code and is robust to dropping its most favorable study, and the 1% is the median of four net forecasts. PRs #738, #739 and #745 closed most of the source-error list. Every `currentValue` now matches its computed aggregate.

Where the site still overstates, the cause is no longer bad data points. It is *surfaces that were not rebuilt when the data were*:
- the homepage funnel still shows gross, global and superseded figures under net US labels
- the adoption ladder still shows a 10% BTOS rung under a 23.8% BTOS chart
- two exposure charts headline averages their own disclaimers call meaningless
- hard-coded context paragraphs on four adoption and signal pages still describe pre-correction constructs: "in production," "workforce-related mentions," "16% since ChatGPT"
- the hero's "~1%" link lands on a page whose projection median reads ~4% and whose prose says "5–12%"

Gimbel and Kolko would flag each of these as the same failure. A careful reader who clicks one level down finds the site disagreeing with itself.

What is missing is mostly depth and distribution, not more sources:
- adoption intensity: the share of hours or staff using AI inside adopting firms
- who the affected workers are by gender, education and adaptive capacity (Kinder's clerical women, Manning et al.'s 6.1M)
- the reinstatement side: new tasks and new firms

That last item has a credible home in `ai-business-formation` but is framed as an absolute gain. None of this needs new chart dimensions. It needs the homepage, ladder and context copy brought into line with data that are now largely right.

#### NARRATIVE COHERENCE ASSESSMENT

1. **Hero vs. the overall-displacement page (High).**
   - The hero shows "~1% projected net job loss by 2030 · median of 4 forecasts (0.6–3%)" and links to `/predictions/overall-us-displacement`.
   - That page headlines 1.4 (weighted, including proxies) and computes "Projections range 0.4–11.5% (median ~4%)" across 13 projected points: gross Goldman 9, WEF 8, Forrester 6, Tufts 6, FRI 6, and others.
   - Its CONTEXT_MAP paragraph says projections "cluster around 5-12% by 2030."
   - The page disclaimer describes three Anthropic Institute scenario points as "plotted." They are overlays, which is the correct treatment, so the disclaimer is stale.
   - Net effect: the hero's careful net-vs-gross distinction is undone one click later. The fixes (non-proxy summaries, best estimate from non-proxy points, rewritten context, corrected disclaimer) are prior items 2 and 4, owned by the displacement reviewer. The coherence failure is the homepage's.
2. **Hero vs. funnel (High).** In the funnel's "Projected" row two of the three bars are gross, and its median is ~7. Readers see 1% and then 7–8% for "jobs lost by 2030" within one scroll.
3. **Intro copy vs. the evidence the page features (Medium).**
   - "One pattern. AI adoption is accelerating, productivity is climbing, entry-level and freelance work is compressing."
     - **Accelerating:** BTOS rose from 17.3 to 23.8 over ten months, after a Dec–May plateau of 17–20. Revelio reports the pace of new firm adoption "has slowed from its spring 2026 peak." "Rising" is defensible; "accelerating" is contested.
     - **Productivity is climbing:** true of BLS, but Gimbel: "strong, but not unusually so."
     - **Entry-level compressing:** this is the contested exception, and the first Featured Read says so.
   - Kolko would object to "one pattern" itself: his reading is that labor measures "point in all directions."
   - *Inference:* change "one pattern" to "a consistent picture," and change "entry-level… is compressing" to "entry-level hiring shows early, contested stress." Both edits use language from Imas & Schaal, which the page already features.
4. **Concept bars (Medium).**
   - "We've Seen This Before… AI is compressing that timeline." Kolko and Gimbel, citing Budget Lab, find the occupational mix "has changed over the past three years at a similar pace to" 1984 and 1996 "and has not accelerated since the release of ChatGPT." The site asserts the opposite without a source.
   - "What if AI Creates More Jobs… Every general-purpose technology eventually created more jobs than it displaced." Bessen's own caveat is "employment in these industries grew rapidly for many decades. Until it didn't." The claim holds economy-wide, not by sector.
   - Also: "+0.7pp Productivity growth" as a bare stat. The copy concedes "no one can yet show AI caused it," but the big number reads as an AI effect.
5. **Exposure figures across the site (Low).** "40% of jobs are AI-exposed" (funnel annotation, "Why Is Nothing Changing?" bar) is the IMF's *global* figure. The site's US exposure chart shows 41.7, a meaningless average, and the FunnelStrip Anthropic bar should read 49. Pick one sourced US figure. Eloundou's high-exposure share (~19% with half or more of tasks exposed) or the BLS exposure categories would match a US-labelled claim.
6. **Sector reconciliation.** Out of this scope. The skill requires it, and the displacement reviewer should check it.

#### HERO STAT AUDIT (HeroTriad.tsx, all eight lenses)

**1. "~21% Productivity boost — median of 9 controlled studies; range 13–56%" (center 21, low 13, high 56).** Median verified in code. Robust to dropping METR or Peng.
- **Acemoglu:** a task-level figure from easy-to-learn, well-specified tasks. Under Hulten it says nothing about aggregate productivity until multiplied by the share of tasks affected (~20% exposed, 23% profitably automatable in his inputs). "Productivity boost" without "per task" invites the macro reading.
- **Brynjolfsson:** consistent with the QJE result (15% on average, larger for novices) and the field experiments. He would accept the number and want the J-curve caveat beside it.
- **Gimbel:** the number is fine. The label is not: "time saved per task in studies" is the measured thing, while "productivity boost" implies output. She would also point out that 9 studies give no confidence interval.
- **Bessen:** does not answer the jobs question. Employment depends on output growth relative to productivity growth. Neutral.
- **Kolko:** firm studies describe early adopters. Self-selected tasks and firms; the range 13–56 is honest.
- **Imas:** the micro number is real. The macro companion on the site is 2.3% of US work hours saved (Bick et al. 2026). Showing 21% alone makes the micro–macro gap invisible on the homepage, even though that gap is the "J-curve" page's whole argument.
- **Kinder:** gains concentrated among less-experienced workers (QJE) is a hopeful distributional fact the caption could carry. Not required.
- **Rock:** the grain is the task. The number belongs in a task-level frame. The tooling multiplier (15% → 47–56% of tasks with LLM-powered software) is the missing context.
- **Verdict:** keep 21. Change the label to "Time saved per task," or add "in studied tasks" to the caption, as the June review recommended (not done). Priority Medium.

**2. "~1% Projected net job loss by 2030 — median of 4 forecasts (0.6–3%)" (center 1, low 0.6, high 3).** Inputs: Goldman net 0.6, Bloom US 1.2, Metaculus 1.3, Acemoglu 3. Median 1.25 → 1. Arithmetic verified.
- **Acemoglu:** his number is "less than two to four percent," a spoken, net, five-year *upper bound*. It is plotted as a point of 3 with a 2–4 band. The hero's high end is therefore his ceiling, not his forecast. The median does not change if the value is treated as ≤3, because it stays 1.2. His view is consistent with ~1%.
- **Brynjolfsson:** he would say the aggregate understates the entry-level concentration. That is the measured-loss caption's job, and it is done there.
- **Gimbel:** four forecasts with different constructs and horizons:
  - Goldman: unemployment-rate rise over a *decade*
  - Bloom: firms' own 3-year expectation (to ~2029)
  - Metaculus: an employment shortfall by 2030 relative to 2025
  - Acemoglu: a 5-year ceiling (~2031)
  "By 2030" is approximate for two of the four. Acceptable for a hand-set median if the caption says "net forecasts, ~2030."
- **Bessen:** net is the right construct. Gross churn (WEF 92M displaced and 170M created) belongs elsewhere.
- **Kolko:** n=4 is thin. The range 0.6–3 is honest about it. He would add that forecasts made in the "first inning" are weak signals.
- **Imas:** his and Moll's bounded-growth view is consistent with a small net number. He would flag that the aggregate hides the junior margin.
- **Kinder:** ~1% is about 1.7M workers, concentrated in clerical and entry-level roles. She would want the caption or the linked page to name who.
- **Rock:** no comment on the number. Outcomes depend on the software layer.
- **Verdict:** defensible and the best-sourced projected figure on the site. Two fixes:
  1. Describe Acemoglu as "≤2–4%" in the CLAUDE.md rationale and the chart excerpt (the excerpt already says so).
  2. Make the linked page agree with the hero (coherence item 1). Priority High for the page, Low for the stat.

**3. "~0% Measured US job loss — early job impacts concentrated among workers 22–25" (center 0, low 0, high 0.2).** Deliberate; not relitigated.
- **Acemoglu:** consistent with his JOLE finding of "no discernible relationship between AI exposure and employment or wage growth" at the occupation and industry level.
- **Brynjolfsson:** Canaries fact 1, "no economy-wide displacement," agrees. Fact 2, the 19% early-career gap, is what the caption points to.
- **Gimbel:** this is her finding (SDID null; churn, unemployed exposure and usage "all remain flat"). She would add that it holds "as of yet."
- **Bessen:** matches history: automation separations are gradual (~0.8% a year), not mass layoffs.
- **Kolko:** agrees, with two notes:
  - the caption's "concentrated among workers 22–25" should carry "contested" (remote-work confound, pre-2022 trends)
  - 2026 statistical-integrity concerns ("the worst period for US statistical integrity since…") are a caveat the June review recommended. It has not been added; it belongs on the methodology page, not the hero.
- **Imas:** "aggregate stability can coexist with early stress in exposed subgroups." The caption expresses exactly this. He would add "contested."
- **Kinder:** "might miss… a small fire starting on the stove, but would clearly detect if the house was burning down." She endorses 0 as a statement about the house, not the kitchen.
- **Rock:** no objection.
- **Verdict:** the strongest stat on the site. Optional caption tweak: "Early, contested signs among workers 22–25." New corroboration exists in the Featured Reads: Census CES finds exposed-major graduates 5pp less likely to be employed. Priority Low.

#### WHAT THE SITE GETS RIGHT

- **The hero triad's separation of measured and projected, now hand-set from an audit.** It no longer drifts with each ingest. It is the honest framing Gimbel's pre-register-and-watch stance and Kinder's "reality one" both describe.
- **The 21% median** is computed in code, excludes observational, survey and autonomous-agent studies with stated reasons, and harmonizes throughput to time saved. Brynjolfsson and Rock would respect the discipline. Dropping the most favorable study does not move it.
- **BTOS as the adoption anchor,** with values dated to reference-period end, standard errors in the excerpts, and the wording change disclosed in the disclaimer.
- **Disclaimers on the two exposure charts.** "Read the spread here as a disagreement about definitions, not about facts." This is Gimbel's February 2026 finding put in plain English. Only the headline needs to catch up.
- **`ai-business-formation` cut to the two difference-in-differences papers.** The pandemic BFS surge and the vendor projections were moved to overlays. That is Kolko's timing test applied.
- **The earnings-call chart retitled** to what FactSet measures, with counts recomputed from source.
- **currentValue synced** on all 20 charts.
- **Featured Reads** that put the contested reading of the junior-hiring evidence (Imas & Schaal) and the "diluted not displaced" firm-side finding (Chandar & Klein Teeselink) at the top of the homepage. A site that features the counter-evidence to its own most-cited signal earns trust.

#### HONEST LIMITS

- **Adoption intensity is unmeasured in official US data.** BTOS is binary until its new AI questions report. Every reach-versus-depth argument on the site leans on Fed district surveys and vendor telemetry.
- **No exposure rubric has been validated against realized displacement,** and LLM raters disagree up to 3.6-fold. Any single exposure number is a modeling choice.
- **The early-career signal cannot yet be attributed.** ADP and postings data disagree on the remote-work control. The within-firm estimate attenuates. Nordic administrative data show nulls.
- **Forecasts of net loss are few, use different horizons, and include a spoken bound.** n=4 is the honest sample.
- **Self-reported AI use is biased in both directions:** stigma understates it, and license or "any use" framing overstates it. No administrative individual-level measure exists.
- **2026 federal statistics carry integrity and granularity risk** (Kolko, Sep 2026). That asterisk applies to every CPS-derived "0."

#### RESEARCH GAPS (by economist priority)

- **Gimbel:** firm-level AI usage linked to headcount, which is her "dream dataset." In the meantime, the new BTOS AI-headcount question deserves a chart the moment it publishes.
- **Kolko:** usage-based rather than exposure-based measures by sector, plus a remote-work-controlled replication on payroll data, would settle the junior-hiring attribution.
- **Imas:** depth measures on the adoption pages: share of hours (RPS, now on FRED) and share of staff inside adopters (NY Fed). Also adoption gaps by gender and education, which are already in the overlays and should be surfaced.
- **Kinder:** a demographic cut of any displacement or attrition signal: clerical, women, over-55, non-degree. The Brookings and Manning adaptive-capacity data are on the exposure chart only as overlays.
- **Acemoglu:** evidence that separates automation-type from augmentation-type deployment (AEI automation and augmentation shares, Census "66% of AI users augment-only"), tracked over time.
- **Brynjolfsson and Rock:** an intangible-investment or takeoff indicator, such as the DEL Takeoff Tracker or BLS TFP, to place the site on the J-curve rather than imply a takeoff.
- **Bessen:** output and price data for exposed sectors, to judge demand elasticity. Formation and employment at new AI-era firms (the Bena et al. +7% employment result) is the nearest thing currently on the site.

---

### PART D — PRIOR-REVIEW FOLLOW-THROUGH

##### Sep 24 items assigned to this review

| # | Recommendation | Status | Evidence (current files) |
|---|---|---|---|
| 6 | Funnel strip constructs: gross WEF/Goldman under a net hero; global exposure; Stanford/ADP employment labelled as postings; Denmark/euro-area under US measured | **Not done** | `FunnelStrip.tsx` unchanged on all four sub-points. A new error was also found: the Anthropic bar shows 36 against a cited 49. |
| 7a | Adoption ladder showing stale BTOS | **Not done** | `AdoptionLadder.tsx` still shows 10% and 15% "Census BTOS" against a 23.8% series. The "weekly" label is also wrong. |
| 7b | workforce-ai-use headlining a 35% average its disclaimer disowns | **Not done** | Headline and context copy still print 35.2%. The disclaimer is unchanged and good. |
| 8 | Business formation unsupported points | **Done** | #738 removed BFS-as-proxy 24, 5.5, 10, the 12 and 15 projections, and the T3 IBTimes 24. Two difference-in-differences points remain. Residual issues: unit, horizon and context copy (see Part A). |
| 9 | Sync currentValue | **Done** | All 20 charts match their computed aggregates. |

Count: 2 done, 0 partial, 2 not done (item 7 counted once; both halves not done).

##### June 2026 review: homepage, adoption and exposure recommendations

| Recommendation | Status | Evidence |
|---|---|---|
| P1: demote the `doi-llm-exposure-and-2026` point; fix publisher | **Done** | Now four overlays. Publisher is *Scandinavian Journal of Work, Environment & Health*. |
| P2: stop treating exposure as one time series (range or measure families) | **Partial** | The disclaimer now explains the definitional spread and calls the average "a mathematical summary." The weighted 41.7 headline and the "risen from 25% to nearly 50%" context remain. |
| Hero productivity: label "in studied tasks" | **Not done** | Label still reads "Productivity boost." The caption is now "Median of 9 controlled studies" (was 18), so the base was improved but not the scope. |
| Hero projected: resolve CLAUDE.md drift | **Done** | Hero is hand-set; the CLAUDE.md "Hero Stats" section matches HeroTriad. |
| Hero measured: add the 2026 data-quality caveat | **Not done** | No caveat on the hero or (that I found) the methodology limits. Low priority. |
| ai-adoption-rate: keep BTOS as the anchor | **Done** | Series rebuilt from BTOS with reference-period dating. The context copy regressed relative to the data (Part A). |
| ai-business-formation: resolve the unit conflict; refresh the stale series | **Partial** | Refreshed with Bena et al. (2026). CLAUDE.md still says "% of new businesses" and the file says "% increase in firm formation." |
| genai-work-adoption and earnings-call: "no issues" | **Partial** | Earnings-call was correctly retitled in #738, but its context copy contradicts the new definition. Genai now interleaves five instruments on one line. |
| P5: fix documentation drift | **Partial** | CLAUDE.md hero section fixed. MethodologyPage still lists "displacement (9)… AI exposure (1)" (actual: 10 and 2) and says "the headline number is a weighted average across all sources," which is false for the `latest` charts. |
| Research gap: adoption-intensity data for the adoption charts (Imas) | **Partial** | Depth data were ingested (NY Fed 17% of staff, RPS hours, ATLAS 21% of tasks), but only as overlays and in the disclaimer. Not surfaced in a headline or context. |

Count: 3 done, 4 partial, 3 not done (adoption-rate counted as done on the data).

---

#### COMPLETION RECORD

- **Target reviewed:** six prediction files (ai-adoption-rate, genai-work-adoption, ai-business-formation, workforce-ai-use, workforce-ai-exposure, earnings-call-ai-mentions); homepage `page.tsx`, HeroTriad, FunnelStrip, FeaturedReads and intro copy; ResearchEvidence; AdoptionLadder; plus the overall-displacement summaries as they bear on hero coherence.
- **Evidence vintage:** `src/` at 4db7a03 (identical to the checked-out branch).
- **Decisive findings:** the five ranked at the top.
- **Files changed:** none in the repo. This report only.
- **Checks run:**
  - recomputed `computeAggregate` for all 20 charts (all match `currentValue`)
  - recomputed the 21% median and its robustness
  - recomputed the overall page's projected median (~4) and observed mean (~0.4)
  - fetched the Imas & Schaal post (five claims verified), the DeepMind essay (date Sept 16, 2026, not Jul 9) and the Anthropic January 2026 report (49%, 52/45)
- **Unresolved, for hand-checking:**
  - the PWBM "40% of employment in exposed occupations" denominator
  - Goldman's "3.2pp lower headcount growth" for AI-mentioners
  - Bick et al.'s weekly-use figure, to replace the ladder's 37%
  - whether Census itself publishes the reworded BTOS question as a continuous series (the disclaimer says so; I did not fetch the Census story)
  - the Chen & Stratton overlay vintage (~50% vs ~40%)

