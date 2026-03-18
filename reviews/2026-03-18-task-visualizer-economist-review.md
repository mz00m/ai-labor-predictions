# LABOR ECONOMIST REVIEW: Task Visualizer

**Date:** 2026-03-18
**Scope:** Task Visualizer (individual job view at `/task-visualizer` + economy-wide view at `/task-visualizer/economy`)
**Components reviewed:** JobTaskVisualizer, WorkforceOverview, YearSliderExplorer, IncomeStrataImpact, GenderImpact, AdaptiveCapacity
**Data files reviewed:** job-tasks.ts (58 job profiles), economy-occupations.ts (22 SOC groups), task-categories.ts, industry-adoption-speed.ts

---

## EXECUTIVE SUMMARY

The task visualizer is the most intellectually ambitious feature on jobsdata.ai. It attempts something rare in the AI-labor discourse: a **first-principles economic model** of automation pressure grounded in compute costs, task decomposition, and wage rates rather than survey-based sentiment or exposure indices. This is genuinely valuable. The task-based framework is the right one (Acemoglu and Restrepo would approve of the unit of analysis), the O*NET-informed task decomposition is methodologically sound, and the inclusion of adoption lags, deployment overhead, and industry speed modifiers shows awareness of the gap between technical capability and real-world deployment.

That said, the visualizer has a fundamental framing problem that all six economists would flag: **it models economic incentive to automate and presents it with language that implies displacement.** The sigmoid cost-crossover model tells you when AI becomes cheaper than a human for a task. It does not tell you whether that task will be automated, whether the job will be restructured, whether the worker will be displaced, or what happens to demand. Every step from "cost crossover" to "job loss" involves a separate economic mechanism with its own elasticity, and the visualizer collapses them into a single "automation pressure" metric that reads — to most users — as a prediction of job destruction.

The economy-wide sections compound this by presenting precise-looking 2028/2032/2036 projections across 22 occupation groups. The methodology is transparent and the caveats are present, but they are footnotes to a visual experience that screams specificity. A reader walks away thinking "Office & Admin workers face 67% automation by 2032" when the honest statement is closer to "our cost model suggests 67% of Office & Admin task-hours could theoretically be performed more cheaply by AI by 2032, assuming our cost decline rates hold, ignoring adoption frictions, demand effects, reinstatement, and institutional responses."

The gender and adaptability sections are the strongest parts — they surface distributional dimensions that most AI-labor tools ignore entirely. But they inherit the precision problem from the underlying model.

---

## THE SIX LENSES

### Acemoglu: The Structural Skeptic

**Overall assessment: The task decomposition is right; the implied model is incomplete.**

The task visualizer correctly adopts the task-based framework that Acemoglu and Restrepo (2019) formalized. Breaking jobs into component tasks and analyzing automation at the task level — rather than treating jobs as atomic units — is the methodologically correct approach. The 8-category task taxonomy (information-processing, communication, analysis-decision, creative-generative, coordination-management, physical-manual, interpersonal, technical-specialized) maps reasonably well to the kinds of task distinctions that matter for automation analysis.

**But the model only captures the displacement effect.** The cost-crossover sigmoid tells you when capital (AI compute) can substitute for labor in a task. It says nothing about:
- **Reinstatement:** What new tasks emerge when old ones are automated? The task lists are static — a 2026 snapshot of what these jobs look like today. But the whole point of the task-based model is that automation changes the task composition of jobs, creating new tasks where labor has comparative advantage.
- **Complementarity:** When AI handles information-processing, does the remaining interpersonal work become *more* valuable? O-ring effects suggest the answer is often yes, which would *increase* wages for the remaining tasks even as overall task composition shifts.
- **General equilibrium:** The model is pure partial equilibrium. It asks "can AI do this task cheaper?" for each task independently. But economy-wide automation of information-processing tasks would change relative wages, relative prices, and labor supply across all occupations simultaneously.

Acemoglu would call the 2028/2032/2036 projections "partial equilibrium results being presented as general equilibrium conclusions." The Year Slider Explorer — letting users drag to 2040 and watch bars grow — is particularly concerning because it implies a deterministic trajectory that the model cannot support.

**The "so-so automation" question is invisible.** Are these AI applications actually generating productivity gains, or are they "so-so" — just good enough to displace but not good enough to transform? The model assumes all cost-effective automation is equivalent. A $3/hr information-processing AI that replaces a $20/hr clerical task and a $3/hr AI that makes a $100/hr analyst 40% more productive are treated identically. The distinction matters enormously for whether the outcome is displacement-without-growth or productivity-led transformation.

**Specific concerns:**
1. The exposure score (0-100) is presented as a single number per job. This collapses a multi-dimensional uncertainty space into a point estimate that users will treat as authoritative. Where is the confidence interval?
2. The cost decline rates (44% annual for information-processing, 12% for physical-manual) are presented as fixed parameters. These are extrapolations from a 3-5 year trend in AI inference costs. Acemoglu would note that cost decline rates for new technologies are notoriously non-linear — they can plateau, accelerate, or reverse.
3. The 5x deployment overhead multiplier is a single number applied uniformly. Real deployment costs vary enormously by task, organization, and regulatory environment. A 5x multiplier for routine data entry is probably conservative; a 5x multiplier for legal analysis may be wildly optimistic.

### Brynjolfsson: The Augmentation Optimist (With Receipts)

**Overall assessment: Where is augmentation?**

Brynjolfsson would start by noting what is *missing* from the task visualizer: the augmentation channel. His foundational work (the Turing Trap, the SML rubric, the QJE customer-support study) establishes that AI's most productive use is often not replacing workers but *augmenting* them — making them faster, more accurate, or capable of higher-quality output. The task visualizer models only the automation question ("can AI do this task cheaper?") and not the augmentation question ("can AI make a human doing this task more productive?").

This matters empirically. In the landmark customer-support study (Brynjolfsson, Li, Raymond, QJE 2025), AI did not automate agents — it augmented them, producing 15% average productivity gains and 34% gains for the least experienced. The result was *more effective workers*, not fewer workers. The task visualizer's model would classify customer service as highly automatable (and it does — Customer Service Rep has high exposure). But the actual deployed use case was augmentation, not automation.

**The J-curve is relevant here.** We are in the early phase of AI deployment. Brynjolfsson's framework predicts that measured productivity effects will be small now (the dip) and large later (the rise), because complementary investments in organizational redesign, training, and process change are still being made. The task visualizer's cost-crossover model implicitly assumes that once AI is cheaper, adoption follows. But the J-curve says: the organizational investment required to actually capture the cost advantage takes years, and during that period, measured output may actually *decrease* as firms invest in intangibles.

**The "Canaries" finding is partially addressed.** Brynjolfsson, Chandar, and Chen (2025) found that the mechanism of AI displacement is *reduced hiring*, not *firing*. Entry-level positions quietly stop being backfilled. The task visualizer doesn't distinguish between these channels — a task reaching cost crossover could mean the company stops hiring for that task, restructures the role, or does nothing for years. These have very different labor market implications.

**What Brynjolfsson would endorse:**
- The task-level granularity is exactly right. His SML rubric applies to tasks, not jobs.
- The industry speed multipliers (0.6x for tech, 1.4x for healthcare) reflect real adoption heterogeneity.
- The adaptive capacity section (Manning & Aguirre) captures the distributional dimension he emphasizes.
- The "durable skills" section at the bottom of the individual job view is a nod toward the right framing.

**What he would push back on:**
- No augmentation pathway visible. Every task is modeled as a binary: human or AI. The reality is a spectrum of human-AI collaboration.
- The heterogeneity within occupations is masked. His key finding is that AI disproportionately helps *lower-skilled* workers within an occupation. The visualizer shows occupation-level averages.
- The Year Explorer implies smooth, deterministic progress. The J-curve says: expect non-linear, punctuated change.

### Gimbel: The Data Realist

**Overall assessment: Projections presented as data. Label them.**

Gimbel would deliver the sharpest critique: **nothing in the task visualizer is observed data.** The entire thing is a model — a cost model with assumed decline rates, assumed task compositions, assumed deployment overheads, and assumed adoption lags. There is not a single empirical data point measuring actual task-level automation in any of the 58 jobs or 22 occupation groups.

This is not inherently a problem — models are useful tools for thinking. But the presentation buries the model's speculative nature under a data-heavy aesthetic. The bars, percentages, year sliders, and precise-looking numbers (e.g., "Office & Admin: 67% task automation by 2032") create an impression of empirical authority that the methodology does not warrant.

**Specific Gimbel critiques:**

1. **"Task automation" is a loaded term.** The model measures "economic cost crossover" — when AI compute is cheaper than a human wage for a task. The label "task automation %" implies the task *is being* automated. Replace "task automation" with "economic automation incentive" or "cost-crossover percentage" throughout.

2. **The base rate problem.** Before ChatGPT (late 2022), what fraction of these tasks were being automated? Many of these task categories — information-processing, communication — have been subject to software automation for decades. Email didn't automate all communication tasks. Excel didn't automate all information-processing tasks. What is the historical base rate for "tasks that reach cost crossover" actually being automated? The visualizer assumes 100% conversion (the sigmoid approaches 1.0 as cost ratio approaches 0), which is historically unprecedented.

3. **The CPS data contradicts the urgency.** Gimbel's ongoing Monthly CPS analysis finds essentially flat employment shares in high-AI-exposure occupations through early 2026. If the model's 2026 numbers are already showing significant automation pressure for multiple occupation groups, and the real-world data shows no employment change, either the model is running too hot or the gap between cost crossover and actual displacement is much larger than the model implies.

4. **The Yale Budget Lab exposure uncertainty data is used but not visually prominent.** The EXPOSURE_UNCERTAINTY variance data from Gimbel's own paper (2026) is included in the data file but does not appear to surface prominently in the visualizations. For computer-math (variance 0.739) and legal (variance 0.581), the six exposure metrics *disagree substantially*. This disagreement should be front-and-center, not tucked into a tooltip.

5. **"Women are 81% of the most vulnerable workers" is a model output, not an observation.** Manning & Aguirre's paper measures adaptive capacity — that is real data. But "vulnerability" as used here combines adaptive capacity with AI exposure, and AI exposure is measured differently by every metric. The headline should note that this finding is measure-dependent.

### Bessen: The Historical Institutionalist

**Overall assessment: The cost-crossover model ignores demand elasticity — the most important variable.**

Bessen would focus on what the model leaves out: **the demand side.** His foundational insight — from textile looms to ATMs to self-checkout — is that automation's employment effect depends on demand elasticity. When automation reduces the cost of a good or service, demand may expand enough to *increase* employment despite reduced labor per unit.

The task visualizer models only the *supply side*: when AI becomes cheaper than a human for a task. It says nothing about what happens to demand for the output of that task. Consider:

- **Customer service:** If AI makes customer support 5x cheaper, companies may offer 10x more support. Employment could *increase* if demand is elastic.
- **Legal research:** If AI reduces the cost of legal research by 80%, is there unmet demand for legal research that would expand? Probably yes — many small businesses cannot afford legal services today.
- **Creative work:** If AI makes graphic design nearly free, demand for design may explode. Every small business, every social media post, every internal memo could have custom graphics.

The inverted-U pattern Bessen identifies is critical: in the early phase of a technology, when demand is elastic, employment *grows* even as labor per unit falls. Only later, when markets saturate and demand becomes inelastic, does employment decline. The task visualizer implicitly assumes we are always on the declining side of the inverted-U. For many sectors, the opposite may be true.

**Historical comparison:**
- ATMs were supposed to eliminate bank teller jobs. They reduced the cost of operating a branch, banks opened more branches, and teller employment *increased* for 30 years.
- Spreadsheets automated 98% of the computation that bookkeepers performed manually. But demand for financial analysis exploded, and employment in accounting-related occupations grew.
- The task visualizer's information-processing category (44% annual cost decline) is essentially the spreadsheet story again. The historical precedent is not job destruction but demand expansion.

**The pace of change matters.** Bessen's Dutch micro-data (Review of Economics and Statistics, 2025) found that automation unfolds gradually — ~0.7% of tenured workers leave per year due to automation vs. 3.5-7.2% for mass layoffs. The Year Slider Explorer, by showing smooth annual progression, correctly captures the gradual nature. But the bars growing to 50-70% by 2035-2040 implies an endpoint of near-total task automation that history does not support.

**What Bessen would endorse:**
- The industry adoption speed modifiers are a good approximation of institutional friction.
- The deployment overhead multiplier (5x) is an acknowledgment that cost crossover != deployment.
- The adaptive capacity section captures adjustment cost heterogeneity.

**What he would add:**
- A demand elasticity indicator per sector. Is customer service demand elastic or inelastic? This determines whether automation leads to more jobs or fewer jobs.
- Historical precedent annotations: "Here is where a similar technology was at this stage of its cost curve. Here is what happened to employment."
- Geographic concentration data (his work with Hunt and Cockburn shows AI adoption is highly geographically concentrated).

### Kolko: The Measurement Methodologist

**Overall assessment: The model is a model, not research. Say so.**

Kolko would apply his "first inning" framework directly: we are in the first inning of understanding AI's labor market effects, and this tool — while thoughtfully constructed — presents a model with assumed parameters as though it were established research. Every key input to the model is uncertain:

**Parameter uncertainty audit:**

| Parameter | Value Used | Uncertainty | Kolko's Assessment |
|-----------|-----------|-------------|-------------------|
| Cost decline rates | 12-44% annual | Based on 3-5 year trend in inference costs | Extrapolation assumes continuation of a trend that could plateau, accelerate, or reverse |
| Deployment overhead | 5x uniform | Single multiplier | Real overhead varies 2-50x depending on task, org, regulatory environment |
| Adoption lag | 1.5-4.5 years by category | Based on historical technology diffusion | Could be 2x longer or 2x shorter for AI specifically — no AI-specific data |
| Industry speed multipliers | 0.6-1.4x | Composite of 5 factors | Reasonable framework but the weights are assumed, not estimated |
| Task compositions | O*NET-derived | Major group level aggregation | Masks enormous within-group heterogeneity |
| Base compute costs (2026) | $3-$350/hr by category | Current estimates | These are moving targets; pricing structure may change entirely |

**Which exposure measure is being used?** The economy-wide view mixes multiple measures: Eloundou et al. E1+0.5E2 for the scatter plot, Yale Budget Lab GPT-scored 0-10 for the exposure scores, and the home-grown cost-crossover model for the automation percentages. These measure *different things*. Eloundou et al. measures task-level exposure to LLMs specifically. The cost model measures economic crossover across all AI modalities. The GPT scores are a synthetic index. Combining them without flagging the methodological differences is problematic.

**Confounders:**
- The automation percentages for 2028 and 2030 will be evaluated against a labor market also affected by interest rates, immigration policy changes, tariff regime shifts, and pandemic recovery dynamics. Any credit or blame attributed to AI will need to control for these.
- Several task categories (information-processing, communication) have been subject to pre-AI software automation for decades. The model does not distinguish between AI-driven automation and continuation of existing software trends.

**"Narrator's bias" applies here.** The task visualizer was built by knowledge workers analyzing knowledge work. The task decompositions are most detailed and most confident for white-collar occupations. Physical-manual tasks get coarse treatment ("hands-on tasks, equipment operation, physical presence"). This likely means the model is more reliable for office/admin and less reliable for construction/trades — but the visualization presents all 22 groups with equal visual authority.

### Imas: The Behavioral Micro-Macro Bridge

**Overall assessment: The model assumes rational adoption. Real adoption is behavioral.**

Imas would focus on the adoption model embedded in the visualizer. The sigmoid cost-crossover function assumes that once AI becomes cheaper than a human for a task, adoption follows a smooth, deterministic curve modulated only by industry speed and category lag. This ignores the behavioral reality of technology adoption.

**The micro-macro disconnect is the central puzzle.** Imas's survey of the literature identifies a core fact: controlled studies consistently show 15-40% task-level productivity gains from AI, yet over 80% of firms report no impact on employment or productivity. The task visualizer shows the micro story (task-level cost crossover) but does not explain — or even acknowledge — why these micro economics are not translating to macro outcomes.

The answer, per Imas, is multi-dimensional:

1. **Adoption heterogeneity.** Chen & Stratton (2026) found that 18 months after firm-level Copilot adoption, only ~50% of engineers had started using it. The 8.5% productivity gain for users did not translate to firm-level output changes. The task visualizer's "automation percentage" implicitly assumes 100% adoption once cost crossover is reached. Real adoption will be 30-60% of eligible workers, with the rest resistant for identity, skill, or organizational reasons.

2. **Identity and behavioral frictions.** Delfino et al. (2026) found that perceived "identity fit" dominates re-skilling decisions. If "AI-augmented office worker" does not fit a clerical worker's professional identity, they may resist adoption regardless of economic incentive. The task visualizer models rational economic agents; real workers are identity-driven social beings.

3. **Machine fluency as a new inequality axis.** Imas's experimental work (with Lee and Misra, 2026) shows that the ability to effectively direct AI systems varies systematically with demographics and personality. This means the *same* AI tool, deployed in the *same* occupation, will produce very different outcomes depending on *who* is using it. The occupation-level averages in the visualizer mask this within-occupation heterogeneity that Imas identifies as the most decision-relevant dimension.

4. **Demand-side constraints.** The model assumes someone buys the output. But if AI automates 60% of office-admin tasks, what happens to demand for office-admin output? Imas's "Can advanced AI lead to negative economic growth?" framework highlights that demand absorption is not guaranteed. If cost savings flow to capital owners who are already satiated, increased productive capacity may not translate to increased demand.

**The gender section is valuable but incomplete.** The finding that women are 81% of high-vulnerability workers (Manning & Aguirre) is important. But Imas would add: Carvajal et al. (2024) found male students were 25% more likely to be high AI users, driven by perceptual differences — women were more likely to view AI use as "cheating." If women in clerical roles adopt AI tools at lower rates due to identity frictions, the actual deployment pattern may look very different from the cost-crossover model's predictions. The gender gap in vulnerability may be *larger* or *smaller* than the model suggests, depending on which behavioral channel dominates.

---

## CONSENSUS: Where All Six Agree

1. **The task-based framework is correct.** Analyzing AI's impact at the task level rather than the job level is the methodologically right approach. All six economists endorse this unit of analysis.

2. **The model measures cost crossover, not displacement.** Every economist would insist on a clear distinction between "AI is cheaper than a human for this task" and "this task will be automated" and "this job will be lost." The visualizer collapses these into a single metric.

3. **The caveat at the bottom is insufficient.** The "Critical caveat" text in the methodology footer — "Task automation does not equal job loss" — states the right thing. But visual hierarchy matters: the bars, percentages, and year-over-year progression create a stronger impression than the text disclaimer. The caveat needs to be embedded in the visual experience, not appended as a footnote.

4. **The precision exceeds the certainty.** Showing "67% task automation by 2032" for a specific occupation group implies a level of measurement accuracy that the model cannot deliver. The inputs (cost decline rates, deployment overhead, adoption lag) are all uncertain, and the uncertainties compound multiplicatively. Confidence ranges should be visually prominent.

5. **The distributional analysis (gender, income, adaptability) is a genuine contribution.** Most AI-labor tools show aggregate numbers. This visualizer surfaces who bears the costs — by gender, income tier, and adaptive capacity. All six economists would note this as the strongest feature.

6. **The adoption lags and industry speed modifiers are a good start** but likely understate real-world friction. Historical technology diffusion suggests adoption lags 2-5x longer than the 1.5-4.5 year range used here.

---

## TENSIONS: Where They Disagree

**Acemoglu vs. Brynjolfsson on what the model omits:**
- Acemoglu says the missing piece is *reinstatement* — new tasks created by AI that employ labor. The model only shows displacement.
- Brynjolfsson says the missing piece is *augmentation* — AI making humans more productive without replacing them. The model only shows replacement.
- Both are right, and the omissions compound. The model overstates displacement by ignoring both channels.

**Gimbel vs. Brynjolfsson on the role of projections:**
- Gimbel: "This is a projection, not data. Label it as a model output, not a finding."
- Brynjolfsson: "Projections are useful for planning. The J-curve framework means current data understates future impact. Models like this fill a real gap."
- The resolution: projections are fine if presented as projections with explicit uncertainty. The problem is not the model; it is the visual presentation.

**Bessen vs. the model on demand elasticity:**
- Bessen would argue the model's most critical omission is demand elasticity. For sectors with elastic demand, the model's "automation pressure" may actually predict *employment growth*, not decline. The model cannot distinguish between these outcomes.

**Kolko on confidence levels:**
- Kolko: "Every key input to this model is uncertain. The combined uncertainty means the 2036 projections could easily be off by a factor of 2-3x in either direction. Presenting them with apparent precision is misleading."

**Imas on adoption realism:**
- Imas: "The sigmoid adoption curve assumes rational, friction-free adoption. Real adoption involves identity frictions, organizational politics, and machine fluency gaps that this model does not capture. Actual deployment will be 30-60% of what the model predicts, distributed unevenly across demographics."

---

## ISSUES

### Data Integrity

**[High] Cost decline rates are extrapolations presented as parameters.** The 12-44% annual cost decline rates are derived from a 3-5 year trend in AI inference costs (Stanford HAI AI Index, Epoch AI, a16z LLMflation). These trends could plateau, accelerate, or reverse. The model treats them as fixed constants.
- *Flagged by:* Kolko, Acemoglu, Gimbel
- *Recommendation:* Add scenario analysis — show projections under "fast" (1.5x decline rates), "baseline," and "slow" (0.5x decline rates) scenarios. The Year Slider Explorer is the ideal place for this.

**[High] Task compositions are 2026 snapshots treated as static.** The O*NET-derived task compositions assume jobs look the same in 2036 as they do in 2026. But automation *changes* task composition — that is the whole point of the task-based model. As information-processing tasks are automated, the remaining tasks (interpersonal, analysis-decision) become a larger share of the job, changing the job's overall exposure profile.
- *Flagged by:* Acemoglu, Brynjolfsson
- *Recommendation:* At minimum, note this limitation prominently. Ideally, model dynamic task recomposition — as tasks are automated, remaining tasks' shares increase.

**[Medium] Deployment overhead (5x) is a single uniform multiplier.** Real deployment costs vary enormously: 2x for simple information-processing (plug in an API), 20-50x for regulated analysis-decision tasks (clinical decision support requires FDA review, integration testing, change management).
- *Flagged by:* Kolko, Bessen
- *Recommendation:* Make deployment overhead per-category rather than uniform. The adoption lag already varies by category; overhead should too.

**[Medium] Manning & Aguirre adaptive capacity maps imperfectly to SOC groups.** The paper reports 7 major occupation categories; the visualizer uses 22 SOC groups. Groups sharing a paper category share the same AC score (e.g., all "Professional, Managerial, and Technical" groups get AC=0.734). This masks within-cluster variation — Tech & Computing likely has higher adaptive capacity than Legal, but both get 0.734.
- *Flagged by:* Kolko, Imas
- *Recommendation:* Note the coarse mapping in the visualization. Consider interpolating using subcomponent data where available.

### Framing and Interpretation

**[High] "Task automation" language implies displacement.** The term "automation" in labor economics carries a specific connotation: technology replacing human labor. The model measures something narrower — cost crossover — which is a necessary but not sufficient condition for automation. The language throughout ("automation pressure," "task automation by 2030," "automatable") invites the reader to interpret cost crossover as displacement.
- *Flagged by:* All six economists
- *Recommendation:* Replace "task automation %" with "cost-crossover %" or "economic automation incentive." Add a brief inline explanation: "This measures when AI compute becomes cheaper than the human wage rate for a task — not when the task will actually be automated."

**[High] No augmentation channel visible.** The model presents every task as a binary: performed by a human or automated by AI. The augmentation pathway — AI assisting a human to do the task faster/better — is the dominant empirical finding (Brynjolfsson et al. QJE 2025, Noy & Zhang Science 2023, Dell'Acqua et al. HBS 2023) but is entirely absent from the model.
- *Flagged by:* Brynjolfsson, Imas
- *Recommendation:* Add an "augmentation" dimension to the task model. For each task, show not just "when does AI replace the human?" but "when does AI make the human 2x more productive?" This is arguably the more relevant question for most workers in the near term.

**[High] No demand-side representation.** The model shows supply-side cost crossover but says nothing about demand. For elastic-demand sectors (customer service, creative work, legal research for SMBs), cost reductions may expand markets and *increase* employment. For inelastic-demand sectors, cost reductions lead to layoffs. Without this dimension, the model systematically overstates displacement for elastic-demand sectors.
- *Flagged by:* Bessen, Imas
- *Recommendation:* Add a demand elasticity indicator per occupation group (even a qualitative high/medium/low). Annotate the automation bars with "high demand elasticity — cost reduction may expand employment" where applicable.

**[Medium] Year Slider Explorer implies deterministic trajectory.** Dragging a slider from 2026 to 2040 and watching bars grow smoothly creates an impression of inevitability. The actual path will be punctuated, nonlinear, and shaped by policy, institutional, and behavioral responses that are not modeled.
- *Flagged by:* Acemoglu, Kolko, Gimbel
- *Recommendation:* Add fan-chart uncertainty bands that widen with time. By 2036, the band should be very wide. Consider adding historical precedent markers: "In 1996, internet adoption was at this stage — here is what happened over the next decade."

**[Medium] "81% of the most vulnerable workers are women" — measure-dependent.** This headline finding combines Manning & Aguirre's adaptive capacity data (empirical, well-sourced) with AI exposure from Eloundou et al. (one of several competing measures). The Yale Budget Lab's own analysis shows that exposure metrics disagree most for exactly the occupations that drive this result (office-admin variance: 0.379, healthcare-support variance: 0.228). The headline number would change under different exposure measures.
- *Flagged by:* Kolko, Gimbel
- *Recommendation:* Add a sensitivity note: "This figure uses Eloundou et al. (2024) AI exposure estimates. Other exposure measures (Felten et al., Webb, Eisfeldt et al.) would produce different results — potentially significantly different for office and healthcare roles."

**[Low] Exposure score (0-100) lacks confidence interval.** The individual job exposure score is a point estimate. Given the uncertainty in cost decline rates, deployment overhead, and task composition, the true score could easily span a 20-30 point range. Showing "63" when the honest answer is "45-75" misleads.
- *Flagged by:* Gimbel, Kolko
- *Recommendation:* Show the exposure score as a range (e.g., "48-72") or add a visual uncertainty indicator.

### Visualization and Clarity

**[Medium] The critical caveat is in the wrong place.** "Task automation does not equal job loss" appears in the methodology footer at the bottom of the economy page. Most users will never scroll there. The most important caveat about the most common misinterpretation should be structurally integrated into the experience — at the top, inline with the first chart the user sees.
- *Flagged by:* Gimbel, Acemoglu
- *Recommendation:* Add a persistent callout above the first chart in each section: "These projections show when AI becomes cheaper than humans for specific tasks. They do not predict job loss — actual displacement depends on demand, institutions, and new task creation."

**[Medium] Income tier thresholds are arbitrary.** Low (<$35K), Middle ($35-75K), High (>$75K). These don't correspond to standard labor economics quintiles or deciles. The "High" tier includes both $76K/yr workers and $122K/yr management — these groups face very different circumstances.
- *Flagged by:* Bessen, Kolko
- *Recommendation:* Note the arbitrary cutoffs; consider whether a finer breakdown (quartiles) would be more informative for the higher tier.

**[Low] The CFO Survey NEI data (Baslandze et al.) is underutilized.** The Negative Exposure Index — replacement mentions vs. enhancement mentions by CFOs — is a valuable real-world signal that could validate or contradict the model's predictions. It appears only in scatter plot tooltips. Office & Admin has NEI 2.025 (strongly replacement-oriented), while Computer-Math has NEI 0.596 (more enhancement). This maps interestingly onto the automation/augmentation distinction that Brynjolfsson emphasizes.
- *Flagged by:* Brynjolfsson, Imas
- *Recommendation:* Surface the CFO NEI more prominently, perhaps as a "real-world signal" annotation on the automation bars. Where CFO replacement sentiment is high, the model's displacement interpretation is more defensible. Where CFO enhancement sentiment dominates, the augmentation pathway is more likely.

---

## RECOMMENDATIONS (Prioritized)

### Priority 1: Fix the Language

**Replace "task automation" with "cost crossover" or "economic automation incentive" throughout the visualizer.**
- *Rationale:* All six economists agree the model measures cost crossover, not displacement. The language should match the measurement.
- *Supporting economists:* Unanimous
- *Trade-off:* Less intuitive language. "Cost crossover" is more accurate but less immediately understandable. May need an inline definition.

### Priority 2: Add Uncertainty Bands

**Show confidence ranges on all projections, widening with time horizon.**
- *Rationale:* The model's inputs are uncertain, and uncertainties compound. By 2036, the honest range is very wide.
- *Supporting economists:* Gimbel, Kolko, Acemoglu
- *Trade-off:* Adds visual complexity. May reduce the "wow factor" of the visualizations. But accuracy should trump aesthetics.

### Priority 3: Embed the Caveat

**Move "Task automation does not equal job loss" from footer to persistent inline callout.**
- *Rationale:* The most important caveat should be the most visible element, not the least.
- *Supporting economists:* Gimbel, Acemoglu, Bessen
- *Trade-off:* Takes up visual real estate. But this is the single most common misinterpretation the tool invites.

### Priority 4: Add Demand Elasticity Dimension

**Add a qualitative demand elasticity indicator per occupation group.**
- *Rationale:* Without demand-side information, the model systematically overstates displacement for elastic-demand sectors. Even a simple high/medium/low indicator would significantly improve interpretation.
- *Supporting economists:* Bessen, Imas
- *Trade-off:* Demand elasticity estimates are themselves uncertain. But even approximate indicators are better than the implicit assumption of zero demand response.

### Priority 5: Surface the Augmentation Channel

**Add augmentation metrics alongside automation metrics — at minimum, the CFO NEI data.**
- *Rationale:* The empirical evidence favors augmentation over automation as the primary near-term channel. A tool that only models automation gives a systematically incomplete picture.
- *Supporting economists:* Brynjolfsson, Imas
- *Trade-off:* Requires extending the model. Start with the CFO NEI data (already in the codebase) as a proxy.

### Priority 6: Scenario Analysis for Cost Decline Rates

**Add slow/baseline/fast scenarios for the Year Slider Explorer.**
- *Rationale:* Cost decline rates are the most sensitive parameter. Showing three scenarios gives users a feel for the range of possibilities.
- *Supporting economists:* Kolko, Acemoglu
- *Trade-off:* Adds complexity to the UI. But a single-scenario slider implies false certainty.

---

## WHAT THE TASK VISUALIZER GETS RIGHT

These economists would not just critique — they would note genuine strengths:

1. **Task-level analysis is the correct framework.** The move from "will AI take your job?" to "which of your job's tasks face economic pressure from AI?" is exactly the right analytical move. All six economists use task-based models. This is the state of the art.

2. **Compute cost economics is a novel and valid lens.** Most AI-labor tools use exposure indices (how much of a job's tasks *could* be done by AI). This tool asks a sharper question: when does it become *cheaper* to use AI? That is the question that actually drives firm behavior.

3. **The adoption lags and industry speed modifiers reflect institutional awareness.** Recognizing that healthcare adopts 2.3x slower than tech, and that interpersonal tasks have 3x longer adoption lags than information-processing, shows awareness of the gap between technical capability and deployment that Acemoglu, Bessen, and Imas all emphasize.

4. **The distributional analysis is exceptional.** Gender (Manning & Aguirre), income tier (BLS OEWS), adaptive capacity (4-component decomposition), measurement uncertainty (Yale Budget Lab 6-metric variance) — this is more distributional detail than almost any public-facing AI-labor tool. Imas, Brynjolfsson, and Bessen would all note this as a model for the field.

5. **Source attribution is transparent.** BLS OEWS May 2024, CPS 2024, Manning & Aguirre NBER w34705, Eloundou et al. 2024, Yale Budget Lab 2026, Baslandze et al. 2026 — the sourcing is specific and verifiable. This is the standard Gimbel would require.

6. **The interactive task sliders allow users to stress-test assumptions.** Letting users adjust their own task mix and see how exposure changes is a genuine pedagogical innovation. It teaches the task-based framework by letting people experience it.

7. **The methodology sections are honest about limitations.** The bottom text acknowledges organizational inertia, regulatory barriers, O-ring complementarity, induced demand, and new task creation. The problem is placement and visual weight, not content.

---

## HONEST LIMITS: What Cannot Be Fixed With Better Visualization

1. **We do not know AI's cost trajectory beyond 2-3 years.** The 44% annual decline rate for information-processing costs is an extrapolation from a brief, extraordinary period. It could plateau (as many technology cost curves do after initial exponential decline), accelerate (if algorithmic improvements continue compounding), or collapse (if physical limits on compute density are hit). No visualization can resolve this uncertainty — it is irreducible.

2. **We do not know what new tasks AI will create.** The reinstatement effect — new tasks where humans have comparative advantage in an AI-enabled economy — is historically the dominant channel through which technology creates employment. But by definition, new tasks are unpredictable. No model can forecast what doesn't exist yet.

3. **We do not know how institutions will respond.** Regulation, education reform, union bargaining, corporate culture, and tax policy will all shape AI's labor market effects. These are political variables, not technological ones. The task visualizer correctly omits them — but users should understand that the single largest source of uncertainty is not the technology but the institutional response.

4. **The micro-macro disconnect remains unexplained.** Imas's central puzzle — why micro productivity gains are not showing up in macro statistics — does not have a consensus explanation. Until it does, any model that extrapolates task-level economics to economy-wide outcomes is making assumptions about a mechanism that is not yet understood.

5. **Individual worker outcomes are not occupation-level averages.** The visualizer shows occupation-group statistics. But individual workers' outcomes depend on their specific employer, their specific skills, their specific geography, their age, their identity, and their machine fluency. The occupation average may describe no one's actual experience. This is an inherent limitation of aggregate analysis.

---

## RESEARCH GAPS: What Would Most Improve the Evidence Base

| Economist | Priority Research Gap |
|-----------|----------------------|
| **Acemoglu** | Empirical measurement of the reinstatement effect: what new tasks are being created in AI-adopting firms? No one has systematically measured this. |
| **Brynjolfsson** | Longitudinal augmentation studies: follow the customer-support study model in 10+ industries. We need firm-level experiments, not surveys. |
| **Gimbel** | AI companies should release comprehensive usage data. How many workers are actually using AI tools daily? For what tasks? For how long? Survey data is unreliable. |
| **Bessen** | Sector-level demand elasticity estimates for AI-affected services. Will cheaper legal research expand the legal services market? This determines whether automation creates or destroys jobs. |
| **Kolko** | A standardized, validated AI exposure/usage measure that the field agrees on. Six competing measures producing different results means the field cannot accumulate knowledge. |
| **Imas** | Within-occupation adoption heterogeneity studies: among workers in the same role at the same firm, who adopts AI and who doesn't? What drives the gap? Identity? Demographics? Machine fluency? |
