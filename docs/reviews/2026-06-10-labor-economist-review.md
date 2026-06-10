# LABOR ECONOMIST SITE REVIEW

Date: 2026-06-10 | Predictions reviewed: 18

## EXECUTIVE SUMMARY

Seven economists sit down with this dashboard and the first thing they agree on is that the architecture is right: evidence tiers, observed-vs-projected tagging, proxy discounts, confidence intervals, and a hero triad that deliberately separates projected loss from measured loss. That triad — projections say ~3%, measurement says ~0-2% — is exactly the honest framing Gimbel and Kolko spend their careers asking for, and Bessen would note it matches every historical technology transition on record.

The second thing they agree on is that one chart is currently broken and several others are quietly mixing incommensurable evidence. The US Workforce AI Exposure chart's headline now reads **0.4% of jobs exposed** because its most recent data point is a *Canadian* study's mean LLM-exposure **index score** (0.386 on a 0–1 scale) ingested as a US percentage — on a chart whose `aggregationMethod: "latest"` makes the newest point the headline. Every one of the seven would flag this within thirty seconds; it violates the site's own unit, geography, and exposure-vs-displacement rules simultaneously. Beyond that single bug, the exposure chart's history (38% → 49% → 93% → 67% → 0.4%) is not a time series at all — it is five different exposure *definitions* plotted as if they were one quantity changing over time. Gimbel's February 2026 finding applies directly: exposure metrics broadly agree on direction and disagree wildly on magnitude, so a single line with "latest" aggregation fabricates precision the literature does not contain.

Third, the sector displacement charts overstate their evidence relative to the flagship. The overall-US chart is the best-evidenced file on the site (25 points, 138 sources, dense Tier-1 mix) and lands at ~3% projected. Meanwhile customer-service shows 41%, creative 24%, and tech 12% — driven by vendor self-reports, projections, and proxies respectively — with no visible reconciliation of how those sector numbers could coexist with a ~3% aggregate. Acemoglu would call this a partial-equilibrium result presented as a general-equilibrium conclusion; the site needs either an explicit reconciliation note or humbler sector presentations.

## TOP PRIORITIES

1. **[High / Data integrity] Remove or demote the `doi-llm-exposure-and-2026` data point on `workforce-ai-exposure`.** It is an index score (0.386), from Canada, about precarity-stratified occupations — three independent disqualifications from being a US "% of jobs exposed" data point. Because the chart uses `latest` aggregation, this single point currently sets the public headline at 0.4%. Reclassify as an overlay (publisher should also be corrected from "doi.org" to the journal, *Scandinavian Journal of Work, Environment & Health*), and missing `dataType` should be noted as the tell that this bypassed the normal pipeline. Consensus: all seven. This is the rare unanimous finding.

2. **[High / Data integrity] Stop treating the exposure chart as a single time series.** Eloundou-style task exposure (~80% "some exposure" / ~19% high exposure), Anthropic observed-usage exposure, Cognizant's 93% projection, and Jones-Tonetti model output measure different constructs. Flagged by: Gimbel (metrics disagree most where it matters), Kolko (results are measure-dependent — say so), Rock (exposure indices need vintage labels; a 2023-calibrated index understates 2026 capability). Recommendation: group by measurement family (task-overlap index / observed usage / projection) with visible methodology labels, or switch to a band showing the cross-measure range instead of a "latest" headline. Trade-off: more visual complexity, but the current chart's precision is false.

3. **[High / Framing] Customer Service Automation (41.2%) is built on vendor self-reports.** Klarna (66% of chats — later partially walked back by Klarna itself), Salesforce (50%), Zendesk (55%, Tier 3) are companies *selling* the automation they report. Gimbel: this is AI-washing's mirror image — AI-success-washing. Bessen: deflection rates measure chats handled, not interactions-demand, which is elastic (cheaper service → more contacts). Recommendation: cap vendor self-reports at overlay status or add a visible "vendor-reported" marker; the weighted 41.2% should not aggregate a Gartner forecast of 25% with Klarna marketing claims as if they estimate the same parameter.

4. **[Medium / Data integrity] Education sector has Tier-4 data points plotted on the line.** Chegg's enrollment decline (23%) and Pearson's 10-K (18%) are corporate product-substitution stories, not "% of education roles displaced" — students switching from Chegg to ChatGPT displaces Chegg revenue, not teachers. (Separately, an SEC 10-K is Tier 1 by the site's own rubric, so the tier label is also internally inconsistent.) Flagged by: Acemoglu (exposure/displacement conflation), Rock (wrong population), Gimbel. Recommendation: convert both to overlays; the chart's latest real observation (-1.3%, i.e., growth) then tells the honest story next to projected estimates.

5. **[Medium / Framing] Reconcile sector charts with the aggregate, and fix documentation drift.** Creative shows weighted 23.8% while its latest observation is 4%; financial services has 8 projections and 1 observation; robots has 1 observation in 7 points. None of this is fatal — but each sector page should state its observed-vs-projected split as plainly as the homepage triad does. Also: CLAUDE.md still describes hero stats as "hardcoded ~1%" while `getHeroStats()` computes them (~3% from current data), and the review/changelog skills cite 16/17 graphs against an actual 18. Internal docs disagreeing with the build is how bugs like priority #1 slip through.

## HERO STAT AUDIT

- **~21% productivity boost ("median of 18 studies")** — Brynjolfsson: consistent with the QJE customer-support result and his 2026 "take-off" position; he'd want the J-curve framing nearby. Acemoglu: these are easy-to-learn-task studies; extrapolating to all work overstates gains — label it "in studied tasks." Imas: the micro number is real; the honest companion stat is that most firms still report no firm-level effect. Verdict: defensible with a scope caveat.
- **Projected job loss (computed weighted avg, currently ~3%)** — Acemoglu: a low single-digit number is actually consistent with his Hulten-bounded skepticism; fine. Kolko: disclose measure sensitivity. Note: CLAUDE.md says ~1% — update the doc or explain the drift.
- **~0% measured job loss ("Yale, Goldman, Dallas Fed")** — Gimbel: correct, and correctly sourced; this is her own finding. Bessen: matches history. Kolko: add the caveat that 2026 CPS/payroll data carries shutdown-related quality asterisks. Verdict: the site's strongest stat.

## PER-PREDICTION NOTES (severity order)

- **workforce-ai-exposure** — see priorities 1–2. Broken headline; incommensurable series.
- **customer-service-automation** — see priority 3. Also spans 12%–66% with weighted 41.2%; dispersion this wide deserves a range presentation, not a point.
- **education-sector-displacement** — see priority 4.
- **creative-industry-displacement** — weighted 23.8 vs latest observed 4. Imas would add his own 44% human-provenance premium finding here as counter-evidence already on the site: relational/provenance demand buffers displacement. Make the observed-vs-projected gap visible.
- **financial-services-displacement / robots-physical-automation** — projection-heavy (8/9 and 6/7), thin observation base. Acceptable for forward-looking charts; label them as such. Robots has only 12 sources — thinnest file on the site.
- **tech-sector-displacement** — 11 of 17 points are proxies; the 0.5× discount is the right instinct (Rock would approve) and the "Uneven by Experience Level" framing correctly encodes the Canaries finding. Counterweight to include prominently: Bessen's April 2026 TPRI finding that developer employment kept growing despite tool adoption.
- **white-collar-professional-displacement** — healthy: 17 points, negative values present (reinstatement/growth represented — Acemoglu's checklist passes), good CI coverage.
- **wage charts (4)** — sign conventions consistent; median-wage is projection-heavy (11/14) but honestly bounded (-8.5 to +1, weighted -1.6 ≈ "we don't know, probably small" — a strong conclusion per Kolko). Freelancer chart's -18.9 weighted vs -5 latest deserves a recency note.
- **ai-adoption-rate** — the model chart. Census BTOS, Tier 1, observed, `latest` aggregation appropriate for a single consistent series. Kolko: this is the gold standard; 17.5% of firms is the number to trust over 78-88% private surveys.
- **genai-work-adoption / earnings-call-ai-mentions** — clean observed Tier-1 series. No issues.
- **ai-business-formation** — unit conflict: CLAUDE.md says "% of new businesses," the file says "% increase in firm formation." These are different quantities; pick one. Stale since mid-2025.

## WHAT THE SITE GETS RIGHT

The observed/projected distinction in the data model and hero triad; proxy discounting with documented methodology; tier-weighted aggregation that all seven would recognize as a reasonable evidence hierarchy; negative displacement values (growth) actually appearing on displacement charts, meaning reinstatement isn't censored; BTOS as the adoption anchor; and an overall thesis — "projections say some, measurement says approximately none, yet" — that is precisely the seven-economist consensus as of mid-2026.

## HONEST LIMITS

No visualization fixes these: exposure metrics genuinely disagree at the occupation level; sector "displacement by 2030" estimates are forecasts whose error bars include zero; vendor deflection rates may be the only customer-service data that exists; and 2026 federal data infrastructure (Kolko's "Requiem" warning) puts an asterisk on every CPS-derived observation this year. Saying "we don't know yet" remains a strong conclusion.

## RESEARCH GAPS

Per-economist asks: Gimbel — AI-company usage data (Anthropic Economic Index-style) for more sectors; Kolko — usage-based rather than exposure-based sector measures; Rock — versioned exposure indices (label each point with the capability vintage); Bessen — demand-side data for customer service (total interaction volume, not just deflection); Imas — adoption-intensity data (production integration vs. occasional use) for the adoption charts; Acemoglu — any data separating automation-type from augmentation-type deployments; Brynjolfsson — firm-level intangible-investment indicators to date the J-curve inflection.
