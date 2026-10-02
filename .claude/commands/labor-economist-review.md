<!-- Synced from the Cortex vault skill `labor-economist-review` (2026-10-02). The vault copy is the source of truth; its references/ folder holds the citations behind every voice. Edit there and re-sync. -->

Review target: $ARGUMENTS (default: full site).

# Labor Economist Review

Apply the documented analytical frameworks and empirical standards of eight leading researchers on technology and labor markets: **Daron Acemoglu**, **Erik Brynjolfsson**, **Martha Gimbel**, **James Bessen**, **Jed Kolko**, **Alex Imas**, **Molly Kinder**, and **Daniel Rock**. Do not impersonate them or invent what they would say. Attribute claims to published work and label any synthesis as this review's inference.

**Provenance.** The eight voice sections were re-verified against published sources in October 2026. Citations, verbatim-quote sources and audit notes are in `references/` (one file per pair of economists; `.SKILL.pre-2026-10.md` is the prior version). Quote only text that appears in those sources or in a source you fetch during the review. Never put words in quotation marks that you have not seen verbatim. Two of the eight now work at Google/DeepMind (Imas as Director of AGI Economics; Rock lists a Google affiliation), so note that when weighing usage data from Google products. Refresh the voices roughly every six months.

Review the smallest target that answers the request. Review the full site only when explicitly requested. At the start, identify the target, repository or artifact location, and evidence vintage; never rely on a remembered site state.

## The Eight Voices

You do not average these perspectives into mush. You maintain each voice as a distinct analytical lens, noting where they agree (which is rarer than people think) and where they would push back on each other. When reviewing any chart or claim, cycle through all eight lenses explicitly.

---

### Voice 1: Daron Acemoglu — The Structural Skeptic

**Core framework:** The task-based model of automation (Acemoglu & Restrepo, "Automation and New Tasks," *Journal of Economic Perspectives* 33(2), 2019; *Econometrica* 2022; extended in Acemoglu & Loebbing, "Automation and Polarization," *Journal of Political Economy* 134(3), 2026).
- Technology works through two opposing forces. The **displacement effect** is capital replacing labor in existing tasks. The **reinstatement effect** is the creation of new tasks where labor has comparative advantage.
- The net outcome is an empirical question.
- The presumption that productivity-raising technology always raises labor demand is wrong. Automation with sizable displacement and modest productivity gains can reduce it.
- Since 2026 he adds a sharper claim: the *direction* of AI is the policy variable. The pursuit of AGI is the wrong direction.

**Key intellectual commitments:**

- **Modest macro effects of AI.** "The Simple Macroeconomics of AI" (*Economic Policy* 40(121):13–58, January 2025; NBER WP 32487) bounds aggregate gains using Hulten's theorem.
  - Inputs: ~20% of US labor tasks are AI-exposed (Eloundou et al.). 23% of those can be profitably automated within 10 years (Svanberg et al.). Average labor-cost savings are ~27%.
  - Result: TFP gains of "no more than a 0.66%" over 10 years (≈0.064% a year). GDP rises ~0.93–1.16%, or up to ~1.56% with an investment response.
  - Early evidence comes from "easy-to-learn" tasks. Adjusting for "hard-to-learn" tasks lowers the TFP bound to "less than 0.53%."
  - He sets this against Goldman Sachs (1.5% a year added to US productivity growth) and McKinsey (1.5–3.4pp added to annual GDP growth).

- **A stated jobs ceiling (2026).**
  - On Goldman Sachs Exchanges (July 2, 2026) he expects "some net job losses, limited, but net job losses within the next five years… less than two to four percent." Losses could be bigger over 10–15 years "if things continue like this."
  - The binding constraint is deployment, not capability. There are no "easy to use applications based on the foundation models" yet, no "Microsoft Office version of AI."
  - The vulnerable pool is cognitive-routine work, roughly 8–9 million US workers in customer service and back-office roles. Coding is the exception.
  - Treat this as a spoken, net, five-year upper bound, not a modeled estimate.

- **So-so automation and the wrong direction.**
  - Source: "The Wrong Kind of AI?" (NBER WP 25682, 2019, with Restrepo; *Cambridge J. of Regions, Economy and Society* 13(1), 2020).
  - So-so technologies are just good enough to adopt but barely more productive than the labor they replace. Tax bias, corporate incentives, and ideology push toward them.

- **Pro-worker AI.**
  - Source: "Building Pro-Worker Artificial Intelligence" (Hamilton Project/Brookings and NBER WP 34854, February 2026, with Autor and Johnson).
  - Five categories: labor-augmenting, capital-augmenting, automating, expertise-leveling, new task-creating. Only new task-creating is "unambiguously pro-worker."
  - Market failures: misaligned firm and developer incentives, path dependence, "a pervasive pro-automation ideology."
  - Key statistic: labor's share of value-added in US manufacturing fell from 74% to 46% between 1981 and 2016. The national labor share fell from 58% to 52%.
  - Worked example: an LLM tool that supports electricians and field technicians with real-time recommendations, leveraging rather than replacing their expertise.
  - Nine policy directions: health care and education, government AI capacity, tax reform, antitrust, IP protection for worker expertise, and others.
  - *Nature* (August 2026) takes this to the general audience: stop the "single-minded pursuit of artificial general intelligence" and build tools that "amplify human expertise."

- **Institutions shape technology choice.**
  - Nobel Lecture, "Institutions, Technology, and Prosperity" (*AER* 115(6):1709–1748, 2025): belief in AGI "is tied to a specific interpretation of how digital technologies should be developed, whom they should replace and sideline, and whom they should favor."
  - The wrong regulatory and incentive environment moves society to a frontier "strongly biased against most workers."
  - *Power and Progress* (2023, with Johnson): shared prosperity requires deliberate choices.
  - "Automation and Repression" (2026 working paper) adds a political-economy link: in his model, more automation makes repression more attractive to capital owners.

- **AI can erode the knowledge pipeline (new, 2026).**
  - "AI, Human Cognition and Knowledge Collapse" (May 2026, with Kong and Ozdaglar): agentic AI that substitutes for human learning effort can tip society into "a knowledge-collapse steady state." Welfare is non-monotone in AI accuracy.
  - "How AI Aggregation Affects Knowledge" (March 2026): a single global aggregator retrained on its own outputs "worsens learning."
  - Empirical precursor: Wikipedia articles overlapping with ChatGPT saw editing and views fall (Lyu, Siderius, Li, Acemoglu et al., WWW 2025).

- **Automation can be a growth response, not only a shock.**
  - "Baby Busts and Growth Booms" (NBER WP 35401, 2026, with Autor, Beirne, Scott): lower birth rates go with higher GDP per working-age adult and higher wage growth, through "the endogenous, labor-saving response of technology to the scarcity of younger workers."
  - He warns against extrapolating this.

- **Empirical record on robots and AI.**
  - "Robots and Jobs" (*JPE* 128(6), 2020, with Restrepo): one more robot per thousand workers lowers the employment-to-population ratio by roughly 0.2pp and wages by roughly 0.4%.
  - "Artificial Intelligence and Jobs: Evidence from Online Vacancies" (*JOLE* 40(S1), 2022): AI-exposed establishments cut non-AI hiring, but there is "no discernible relationship between AI exposure and employment or wage growth" at the occupation and industry level (NBER abstract).

- **Regulation is necessary.**
  - "Regulating Transformative Technologies" (*AER: Insights* 6(3), 2024, with Lensman): optimal adoption is gradual, and faster growth can call for slower adoption.
  - He backs tax neutrality between capital and labor, antitrust, and redirecting AI.
  - He co-signed "We Must Act Now" (July 2026) on the grounds of the "urgent need to redirect AI."

- **Skepticism of adoption surveys and proxy metrics.** *Inference from the corpus:* he separates occasional chatbot use from production deployment at scale. He treats exposure → automatable → automated → job loss as a chain with a separate elasticity at each step.

**How Acemoglu would review a chart** (questions are this review's inference from his published framework):
1. What exactly is measured: exposure, displacement, observed loss, or projected loss?
2. Does the implied model allow reinstatement and new tasks, or only displacement?
3. How do task-level gains aggregate? By Hulten's theorem, macro gains are bounded by task share × cost savings.
4. Is the evidence from easy-to-learn tasks being extrapolated to hard-to-learn ones?
5. Is the projected loss net, over what horizon, and does it exceed his stated ceiling (under 2–4% net within five years)? If so, what deployment layer does it assume exists?
6. What institutional and policy environment is assumed, and is the technology's direction treated as fixed?
7. Could the pattern reflect labor-scarcity-induced automation, or erosion of learning, rather than simple substitution?

**Characteristic phrases (verbatim, sourced):**
- "I don't think we should belittle 0.5 percent in 10 years. That's better than zero… But it's just disappointing relative to the promises that people in the industry and in tech journalism are making." (MIT News, Dec 6, 2024)
- "My argument is that we currently have the wrong direction for AI. We're using it too much for automation and not enough for providing expertise and information to workers." (MIT News, Dec 6, 2024)
- "I would say less than two to four percent." (Goldman Sachs Exchanges, July 2, 2026)
- "So like the Microsoft Office version of AI, so to speak." (Goldman Sachs Exchanges, July 2, 2026)
- "I have argued for more than 10 years now that the complementary path is actually quite productive. It's just that we haven't invested in it." (Goldman Sachs Exchanges, July 2, 2026)
- "Rather than racing to replace people, we should build AI tools that amplify human expertise and expand opportunity." (*Nature*, Aug 21, 2026, standfirst)
- Only new task-creating technology is "unambiguously pro-worker, generating demand for novel human expertise rather than commodifying it." (Acemoglu, Autor & Johnson, 2026)

---

### Voice 2: Erik Brynjolfsson — The Augmentation Optimist (With Receipts, and a Warning)

**Core framework:** AI is a General Purpose Technology whose effects arrive with a lag because of the **Productivity J-Curve** (Brynjolfsson, Rock & Syverson, *AEJ: Macroeconomics* 13(1), 2021).
- GPTs need large complementary intangible investments, such as process redesign, retraining, and new organization, that national accounts poorly measure.
- Measured productivity first understates, then overstates, true gains.
- The design choice between automation and augmentation is not technologically fixed (the "Turing Trap").
- In 2026 he adds two things: urgency (AI may be "bigger and 10 times faster" than the Industrial Revolution) and a measurement program meant to settle the question with data.

**Key intellectual commitments:**

- **The Turing Trap.** "The Turing Trap" (*Daedalus* 151(2), 2022): the fixation on human-like AI creates excess incentives to automate rather than augment, which shifts bargaining power away from workers. As co-organizer of "We Must Act Now" (July 2026) he says: "guide AI to complement humans rather than simply imitate them."

- **Generative AI at Work.** With Li and Raymond (*QJE* 140(2), 2025): 5,172 customer-support agents; productivity up 15% on average. Less experienced and lower-skilled workers gain in speed and quality (the working paper puts novice gains at 34%), while the most experienced see small quality declines. AI assistance also aids learning and improves the experience of work.

- **Canaries in the Coal Mine (revised August 2026).** With Chandar and Chen; ADP payroll data through June 2026.
  - The six facts:
    1. no economy-wide displacement
    2. 22–25-year-olds in AI-exposed occupations sit "19% below where it would be had it kept pace with that of their less-exposed peers," with no comparable gap for experienced workers
    3. the gap is widening (15% at the July 2025 vintage)
    4. it works through reduced hiring, not separations
    5. declines are concentrated where AI substitutes; complementary usage is flat or rising
    6. adjustment is through employment, not base pay
  - **The authors' own caveats:**
    - results attenuate with an education control: −0.18 → −0.09 for the top quintile
    - there are pre-ChatGPT divergences
    - the gap is weaker in the ACS (−0.02 vs −0.13 for 2022–24), though the two agree in professional and financial services
    - the top-quintile within-firm estimate is "no longer statistically significant"
    - with firm-time controls the decline "becomes significant only in 2024" (Feb 2026 note)
  - **Robustness.** The gap survives excluding tech, controlling for interest-rate exposure ("more AI-exposed jobs are actually less exposed to interest rates"), and controlling for remote work. Rerunning Lambert & Schindler's (2026) specification on ADP, the AI gradient survives joint entry with work-from-home. They attribute the opposite Revelio result to sample differences.
  - **Mechanism.** AI substitutes for codified knowledge and complements tacit knowledge.
  - **Stance.** These are "early, descriptive indicators… rather than causal estimates."

- **Exposure is not displacement.** The SML rubric (Brynjolfsson, Mitchell & Rock, *Science* 2017; *AEA P&P* 108, 2018) covers 18,156 tasks: "few occupations are fully automatable using ML," and realizing ML's value "usually requires redesign of job task content."

- **Adoption is gated by organizational readiness.** "The Adoption of Industrial AI in America" (McElheran, Yang, Kroff & Brynjolfsson, *AEA P&P* 116, 2026): only 22.8% of US manufacturing plants used any AI as of 2021, and intensity-weighted adoption is far lower. Cloud and predictive analytics predict adoption; prior productivity does not.

- **Policy shapes the automation margin.** "Minimum Wages and Rise of the Robots" (NBER WP 34895, 2026): a 10% minimum-wage increase raises robot adoption by roughly 8% relative to the mean.

- **GDP misses the value.** "What is Generative AI Worth?" (Brynjolfsson, Collis, Eggers, Kazinnik & Nguyen, 2026): US consumer surplus from chatbots rose from $116B to $172B (2025→2026), well above revenues.

- **Productivity: bullish, but his own tracker is neutral.**
  - He says his longbets wager with Robert Gordon is "backloaded because of my J-curve theory" and that he is "already ahead" (Fortune, June 2026).
  - His lab's Takeoff Tracker (June 2026) finds "no decisive evidence of takeoff" and "no evidence of a break from recent levels in TFP growth."
  - BLS nonfarm business productivity grew 3.0% in 2024 and 2.1% in 2025 (annual averages), against a 2007–2019 average of 1.5%.

- **Measurement infrastructure as argument.**
  - AI Economic Indicators: Canaries Dashboard (ADP; ~4.6M workers, 730+ occupations), Takeoff Tracker, Adoption Monitor.
  - Edited volume: *The Economics of Transformative AI* (Agrawal, Brynjolfsson & Korinek, eds., UChicago Press/NBER, 2026).

**How Brynjolfsson would review a chart** (questions are this review's inference from his published framework):
1. Productivity or employment? Exposure or observed outcome? These have different determinants.
2. Where on the J-curve? Does the chart allow for lagged gains, and does it check against takeoff indicators rather than assume one?
3. Is substitution separated from complementation, for example usage-based automation versus augmentation shares?
4. Does it cut by age or career stage? Averages hide the entry-level divergence, and the aggregate may show nothing.
5. Is it a descriptive gap or a causal estimate? What happens with firm-time controls, an education control, pre-trends, and a survey benchmark like the ACS or CPS?
6. What complementary investments or organizational readiness does the adoption figure assume?
7. Is unmeasured consumer surplus being treated as zero?

**Characteristic phrases (verbatim, sourced):**
- "We are flying blind into one of the most consequential periods in world history." (Canaries Dashboard launch, via Fortune, June 27, 2026)
- "If you take out the entire tech industry, or take out all tech-related occupations, or you slice it different ways, you still get this effect." (Fortune, June 27, 2026)
- "we do not believe that AI is always and everywhere the sole determinant of employment, and we do not encourage others to interpret our results in that way." (Brynjolfsson, Chandar & Chen, Feb 9, 2026)
- "We must act now to guide AI to complement humans rather than simply imitate them — and to generate prosperity for the many, not just the few." (DEL, July 13, 2026)
- "I'm kind of worried that we're not going to be ready for the tsunami that's coming." (Platformer, July 14, 2026)
- "And I always figured it was backloaded because of my J-curve theory." (Fortune, June 27, 2026)
- "Economics teaches us that when a resource becomes cheap and abundant, the value shifts to its complements." (TIME, Jan 2, 2026)

---

### Voice 3: Martha Gimbel — The Data Realist

**Core framework:** The data tells you what it tells you — not what you wish it told you. As Executive Director and co-founder of the Yale Budget Lab, Gimbel runs the most systematic public tracking of AI's labor-market footprint in CPS microdata: an interactive tracker (v1.0, July 2026; latest update September 15, 2026 with August CPS) built on three tests — occupational churn, AI exposure and usage among the unemployed, and a synthetic difference-in-differences (SDID) comparison of exposed and unexposed occupations. All three remain flat or null. Her stance is not "nothing will happen" but "pre-register where it should show up, then watch." Background: previously at the Council of Economic Advisers, Joint Economic Committee, Department of Labor, Indeed, and Schmidt Futures. Key co-authors: Kendall, Kulsakdinun, Nunn, Kinder, Lee.

**Key intellectual commitments:**
- **Pre-register, then monitor.** "Evaluating the Impact of AI on the Labor Market: Current State of Affairs" (Gimbel, Kinder, Kendall & Lee, Budget Lab, Oct 2025) finds the occupational mix changing only slightly faster than in the computer (1984) and internet (1996) eras, with the change predating ChatGPT. Verbatim: "Preregistering areas where we would expect to see the impact and continuing to monitor monthly impacts will help us distinguish rumor from fact." The September 2026 tracker update: churn, exposure among the unemployed, and usage data "all remain flat, lie within historical ranges, or continue along pre-AI trends."
- **No causal footprint yet — with honest caveats.** "What We Do and Don't Know About How AI is Affecting the Labor Market" (Gimbel, Kendall & Nunn, Budget Lab, May 2026) uses SDID to handle the fact that exposed occupations differ — more educated, more female, *less* cyclical, and correlated with remote work. Result: "no statistically or economically significant effects as of yet" on employment or wages; exposed-worker unemployment is up ~0.5pp (more for ages 16–34) but statistically insignificant. The paper flags its own limits: an exposure average can hide offsetting winners and losers, and CPS is underpowered for 22–27-year-old graduates.
- **Exposure metrics disagree where it matters most.** "Labor Market AI Exposure: What Do We Know?" (Gimbel, Kendall & Kulsakdinun, Budget Lab, Feb 2026) compares seven metrics: they agree on low-exposure jobs and disagree more as exposure rises — about *how much*, not *whether*. Verbatim: "The metrics appear to agree that plumbers face minimal AI exposure, but disagree on just how exposed computer programmers are." Exposure "is not indicative of a jobs AI will automate out of existence." The tracker therefore leads with exposure-agnostic churn.
- **Don't read productivity tea leaves.** "An AI Productivity Boom? Don't Count Your (Productivity Data) Chickens" (Gimbel, Budget Lab, Feb 2026): multi-quarter productivity growth (~2.2%) is "strong, but not unusually so"; GDP is unrevised; lower immigration can raise measured productivity through composition; and the capital-deepening boost reflects "people investing in AI not people becoming more productive by using AI." Better signals: real wage growth and occupational composition.
- **CEO statements are the worst evidence.** Selection in who announces, selection in what gets covered, and incentives to blame AI rather than past over-hiring. Verbatim (Hamilton/Budget Lab/PIIE event, Mar 10, 2026): "CEO statements are possibly the worst way to do it." Her *Nature* comment (Mar 2026) is titled "Why AI hasn't caused a job apocalypse — so far."
- **Usage data, not just exposure.** Verbatim (Oct 2025 report): "To accurately measure AI's impact on the labor force, the most important data needed is comprehensive usage data from all the leading AI companies at the individual and enterprise level, including APIs." Her stated dream dataset (Mar 2026): firm-level AI usage linked to employment headcount.
- **Disruption may come; prepare the boring safety net.** She grants "there legitimately has been an acceleration in what the technology can do" (NPR, Feb 2026) and invokes Industrial Revolution transition pain. Her policy answer is universal, not AI-specific: "We don't need Trade Adjustment Assistance for coders. We need a safety net that can respond to a range of scenarios" ("Don't get fancy with your labor market fixes for AI," *The Argument*, Dec 2025) — i.e., fix and modernize unemployment insurance rather than build UBI or target a guessed-at group.

**How Gimbel would review a chart:**
1. Is this observed data or a projection? (Label it clearly and do not mix them on the same axis.)
2. What is the sample size and the confidence interval? (If it spans zero, say so — her own SDID unemployment estimate is positive but insignificant, and she reports it that way.)
3. Is the trend real or an artifact of source additions or data revisions? (Adding sources changes a weighted average; unrevised GDP is not the same as revised payrolls.)
4. Was the comparison group built to match? (Exposed occupations are more educated, less cyclical, more remote-capable — a raw exposed-vs-unexposed gap is not an AI effect.)
5. Does the evidence rest on announcements? (CEO and Challenger-style attributions are selected and incentive-laden; prefer CPS microdata.)
6. Was the place to look specified in advance? (Pre-registered tests and exposure-agnostic churn beat post-hoc searches for the subgroup where the effect appears.)

**Characteristic phrases:** "Preregistering areas where we would expect to see the impact and continuing to monitor monthly impacts will help us distinguish rumor from fact." (Budget Lab, Oct 2025) "That there really isn't any, certainly at the macroeconomic level." (NPR, Feb 2026) "I do think if you were seeing like a tsunami that we would be able to pick it up." (Mar 10, 2026 event) "CEO statements are possibly the worst way to do it." (Mar 10, 2026 event) "We don't need Trade Adjustment Assistance for coders." (*The Argument*, Dec 2025) "People investing in AI not people becoming more productive by using AI." (Budget Lab, Feb 2026)
---

### Voice 4: James Bessen — The Historical Institutionalist

**Core framework:** Automation has rarely produced mass unemployment in the automating industry, because cheaper output can expand demand faster than labor per unit falls. Whether jobs grow or shrink depends on the price elasticity of demand, and that elasticity changes over a technology's life. In 19th-century cotton textiles, "labor productivity… increased nearly 30-fold" while "consumption of cotton cloth increased 100-fold" (NBER w24235). Employment rose for a century, until demand saturated. Bessen now applies this framework directly to generative AI: software developers are the bellwether occupation, and so far demand has been elastic. Bessen is Executive Director of the Technology & Policy Research Initiative (TPRI) at Boston University. Key co-authors: Goos, Salomons, van den Berge, Hunt, Cockburn, Ando, Wang, Meurer.

**Key intellectual commitments:**
- **The software-developer test case (TPRI Report, "Why AI hasn't killed software developer jobs," March 2026).** US software developer employment reached a record 2.5 million in February 2026, up more than 400,000 since ChatGPT. Output per developer grew 6.0%/yr in 2022–25, against 3.9%/yr in 2003–22 (he calls this "preliminary"). Real software output grew about 9.3%/yr, faster than productivity, so employment rose. His caveats: elastic demand "might change, possibly leading to job losses", and occupations "where demand for more output is not so elastic, might be at risk of substantial loss of jobs."
- **Demand elasticity produces an inverted U.** "AI and Jobs: The Role of Demand" (NBER WP 24235, January 2018) and "Automation and Jobs: When Technology Boosts Employment" (*Economic Policy* 34(100), 2019) model employment that rises while demand is elastic and falls once markets saturate. This fits textiles, steel and autos. For any AI-affected sector, the question is where it sits on the curve.
- **Automation is not a mass layoff ("Automatic Reaction," *REStat* 107(1), 2025, with Goos, Salomons, van den Berge).** Dutch firm-level automation spending, all private non-financial industries, 2000–2016. Incumbents lose "about 8% of one year's earnings" over five years, mostly through days not worked rather than lower wage rates. About 2% of incumbents leave in the event year and about 8.6% after five years (working-paper figures). The annual separation hazard is about 0.8%, against about 4% for mass layoffs. Losses fall more on older, longer-tenured and higher-wage-quartile workers. Benefits only partly offset them.
- **Market power: *The New Goliaths* (Yale, 2022) and "Industry Concentration and Information Technology" (*J. Law & Econ.*, 2020).** Proprietary software systems raise the productivity and margins of top firms and slow diffusion. Even when demand is elastic, concentration shapes who captures the gains.
- **Geographic concentration of AI adoption (Hunt, Cockburn & Bessen, NBER WP 33022, 2024).** Commuting zones 200 km farther from a pre-2007 AI hotspot show 17% lower growth in AI jobs' share of vacancies. State borders explain 20% of that effect. Adoption, and therefore effects, cluster spatially.
- **Rising returns to R&D (Ando, Bessen & Wang, 2025).** Using Census manufacturing micro-data from 1976–2018, they find that the marginal returns to R&D have risen sharply, alongside rising obsolescence and rivalry. Ideas are "not getting harder to find", but innovations are "more transient". This is a firm-dynamics channel, not an AI-labor claim.

**How Bessen would review a chart:**
1. What is the demand elasticity for this output, and where on the inverted U is the sector? (Software so far: elastic. Ask the same of customer service, legal and clerical work. Don't assume the software result carries over.)
2. Is output rising faster than productivity? (Employment change ≈ output growth minus productivity growth. A chart showing only productivity or only exposure cannot answer the jobs question.)
3. How fast is displacement happening? (Automation-driven separations look gradual, about 0.8%/yr, not like a plant closing. Which pattern does the data show?)
4. Is the occupation shrinking or being redefined? (He notes that the "computer programmer" title has declined for decades while "software developer" grew. Check for reclassification before reading a decline as job loss.)
5. Who bears the adjustment costs? (Older, longer-tenured incumbents lose earnings even when aggregate employment holds.)
6. What is the market structure and geography? (Concentrated markets and distance from AI hubs change who gains and where.)

**Characteristic phrases:** "Too many people have an impoverished view of what AI does." (TPRI Report, 2026) · "Automation doesn't simply substitute machines for humans, doing the same things in the same way; it also lowers costs and prices, it improves product quality, and it enables new and better products." (TPRI Report, 2026) · "So, improved software productivity has brought us lower prices, better quality, a flood of new products doing new things, and…more developers." (TPRI Report, 2026) · "But employment in these industries grew rapidly for many decades. Until it didn't." (TPRI Report, 2026) · "The effect of artificial intelligence on jobs will similarly depend critically on the nature of demand." (NBER w24235, 2018) · "Compared to findings from a literature on mass layoffs, the effects of automation are more gradual and automation displaces far fewer workers…" (*REStat* abstract, 2025)
---

### Voice 5: Jed Kolko — The Measurement Methodologist

**Core framework:** We are in the first inning of understanding AI's labor-market effects — but near-certain disruption justifies boring, no-regret policy now. In "Research on AI and the labor market is still in the first inning" (PIIE RealTime Economics and the Hamilton Project, March 10, 2026), Kolko finds the evidence on AI's current labor-market effect "inconclusive" and claims of harm to particular groups "premature." In 2026 talks he pairs that research skepticism with policy confidence: whatever the steady state, there will be a disruptive transition, and adaptability — of workers and of organizations — is what to study and support. Background: Senior Fellow at PIIE (since November 2025) and head of macro data strategy at Rokos Capital Management; previously Under Secretary for Economic Affairs at the US Commerce Department (overseeing Census and BEA), and Chief Economist at Indeed and Trulia. Harvard PhD.

**Key intellectual commitments:**
- **Three reasons the research is insufficient** ("first inning," Mar 2026): (1) labor-demand findings are "collectively inconclusive"; (2) any current findings are "necessarily weak signals about the future," because diffusion is recent and capabilities move fast; (3) labor demand is "only one corner" — productivity, labor supply, and transition dynamics are under-explored.
- **Identification before attribution.** Results "can be sensitive to which AI measure is chosen," and exposure is confounded with pandemic over-hiring, tariffs, immigrant reliance, and above all remote work: the correlation between AI exposure and ability to work from home "is something close to 0.9" (Hamilton/Budget Lab/PIIE event, Mar 10, 2026). He separates a "macroeconomist objection" (timing doesn't line up) from a "microeconomist objection" (omitted variables). Brynjolfsson, Chandar & Chen (2025, ADP) find young-worker declines in exposed jobs; Eckhardt & Goldschlag (2025, CPS) find unemployment rose *less* in exposed jobs, robust across measures; Iscenko & Millet (2026) and Frank et al. (2026) find exposed-job postings fell starting in 2022, before ChatGPT, better matching rate hikes.
- **Three biases in the evidence base.** *Narrator's bias:* "Today, when researchers, journalists, consultants, and content producers can easily see how their own jobs are exposed to AI, this 'narrator's bias' could color the interpretation and tone of research findings." *Over-attribution (AI-washing):* "A CEO can more proudly blame AI for a hiring freeze or layoff round than they can admit that they over-hired in the aftermath of the pandemic." *Streetlamp bias:* "Research topics well lit by available data and developing methods could point to different conclusions than research topics that sit in the dark" — a bias of coverage, not of a fixed direction.
- **Adoption is still narrow.** The Census Bureau's Business Trends and Outlook Survey "shows that fewer than one-fifth of firms are using AI in any capacity, and even fewer are using AI directly for producing goods and services" — so firm-level productivity studies describe early adopters.
- **Low-hire, low-fire is not about AI.** Labor measures "point in all directions" (PIIE, Jan 2026): employment and real earnings near highs, the hires rate at its lowest since 2012 outside the pandemic. "If artificial intelligence (AI) were the reason, the hiring slowdown would have accelerated in 2025, rather than plunging earlier." On NPR (Aug 2026): "low-fire, low-hire is not about AI."
- **Pace: not yet unprecedented.** Citing Budget Lab work, the occupational mix "has changed over the past three years at a similar pace to the years after the start of the commercial computer era (1984) and the commercial Internet era (1996) and has not accelerated since the release of ChatGPT" — though 2019–2024 moved faster than several prior decades, and slower than the 1910s and 1940s–50s.
- **Four principles for research:** think comprehensively (supply, productivity, transitions; distinguish AI from other forces); contribute to the collective data infrastructure; make results useful for decisionmakers; and state clear hypotheses about which historical experiences apply.
- **Protect the statistics.** "This summer marks the worst period for US statistical integrity since President Donald Trump fired the head of the Bureau of Labor Statistics last August" (PIIE, Sep 2026). Headline data were spared, but local and granular series (County Business Patterns, Quarterly Workforce Indicators) may lose detail; scrutinize methodological changes.

**How Kolko would review a chart:**
1. Which AI measure was used — exposure or usage — and is the result robust to alternatives?
2. Which employment source (ADP, CPS, JOLTS, postings), and does it agree with the others? (When measures "point in all directions," one series cannot carry the claim.)
3. Does the timing fit? (If the break predates ChatGPT, or the hiring decline began in 2022–23, AI is an unlikely driver.)
4. What else is exposure proxying for? (Remote work at ~0.9 correlation, pandemic over-hiring, tariffs, immigration, rates.)
5. Is this demand only? (What about labor supply, transition dynamics, and adaptability within occupations?)
6. Is there streetlamp, narrator's, or over-attribution bias? (Measured because it's measurable, framed by exposed narrators, or sourced from CEO announcements?)
7. Is the underlying official series still intact? (Check for methodology changes, suppression, or lost granularity.)

**Characteristic phrases:** "We are still really in the first inning." (Mar 10, 2026 event) "There are three reasons why the nascent research on AI's impact on the labor market has barely scratched the surface." (PIIE, Mar 2026) "This 'narrator's bias' could color the interpretation and tone of research findings." (PIIE, Mar 2026) "Low-fire, low-hire is not about AI." (NPR, Aug 2026) "There are unsexy solutions to some of the sexy problems that AI brings." (Mar 10, 2026 event) "We can be pretty confident that there will be a disruptive transition regardless of what the steady state looks like." (PIIE event, Apr 16, 2026) "History is a worse guide than usual." (PIIE, Jan 2026)
---

### Voice 6: Alex Imas — The Behavioral Micro-Macro Bridge

**Core framework:** AI's labor-market impact cannot be read off what the technology can do. It depends on how tasks inside a job fit together, on what consumers demand as prices fall, on what firms find worth automating, and on how people actually adopt and report using AI. Imas joins behavioral economics with task-based and structural-change macro to explain why large micro gains, broad but shallow adoption, and stable aggregates can all be true at once. He is Director of AGI Economics at Google DeepMind (2026), on leave from Chicago Booth, where he is Roger L. and Rachel M. Goetz Professor of Behavioral Science, Economics and Applied AI. He writes the "Ghosts of Electricity" Substack, often with co-authors (Shukla, Schaal, Moll). His published work spans AER, QJE, Review of Economic Studies, Management Science and JPE Micro. He co-wrote *The Winner's Curse* (2025, with Richard Thaler) and is a Sloan Research Fellow. Note: his 2026 empirical work on usage (ATLAS, AI in Science) uses Google data and comes from a frontier-lab vantage point.

**Key intellectual commitments:**
- **Exposure is not displacement — and can point the wrong way.** In "How Will AI-driven Automation Actually Affect Jobs?" (with Shukla, March 2026), Imas uses Gans and Goldfarb's O-ring model. When a job's tasks are complements, automating some of them frees time for the rest (a "focus effect") and can raise wages. Whether exposure turns into job loss depends on demand elasticity and on the job's *dimensionality*, meaning how many tasks it contains. Firms invest most in automating jobs with few remaining human tasks. So a highly exposed consultant may gain, while a moderately exposed truck driver or warehouse picker is at greater risk.
- **Now-cast: aggregate stability alongside early, contested stress at the junior margin.** "Has AI impacted the labor market yet?" (with Schaal, September 2026) reviews the US, UK, Swiss, Swedish and Nordic evidence:
  - Junior hiring declines in exposed white-collar roles replicate across countries.
  - Attribution to AI is contested: Canaries within-firm estimates attenuated, remote work confounds exposure designs, and Nordic administrative data show nulls.
  - Unemployment and layoffs show almost no AI effect. Only 1% of laid-off workers cite AI (Gallup).
- **Micro gains are real; the aggregate is starting to move, but within limits.** His living productivity review ("What is the impact of AI on productivity?", January 2026, updated March 2026) attributes the micro–macro gap to endogenous adoption, bottleneck tasks inside jobs, and J-curve investment. The March update reads revised aggregate data as "showing signs of AI productivity gains." With Ben Moll (September 2026) he argues double-digit growth in the next 10–15 years is "extremely unlikely." The reasons: slow diffusion, physical work, politics, Baumol effects, messy jobs, relational goods, and an unproven R&D feedback loop. A 4–5% baseline "would already be massive."
- **Adoption is shaped by people, peers and institutions, and is measured badly in both directions.** Several studies feed this point:
  - Adoption is uneven by gender and identity fit (Carvajal, Franco and Isaksson 2024; Delfino et al. 2026).
  - Without organizational scaffolding, adoption stalls ("Who Uses AI (and How)?", with Shukla, February 2026).
  - Firm license purchases overstate effective use. The current Chen and Stratton (2026) version shows roughly 40% engineer take-up of assistants at the median adopting firm, a code-review bottleneck, and no detectable employment effect.
  - Self-reports can also *understate* use where AI carries stigma. In Ling, Kale and Imas (CHI 2026), 60% of students report their own use but estimate 90% for their peers.
  - Peer pressure drives demand even when parents prefer restrictions (Bursztyn, Imas et al., PNAS 2026).
  - Google's ATLAS usage data, to which Imas contributed, finds adoption across occupations covering 88% of US employment but only shallow, mostly collaborative task penetration.
- **Structural change toward a relational sector.** In "What will be scarce?" (April 2026), Imas uses non-homothetic demand (Comin, Lashkari and Mestieri) plus his own experimental evidence on mimetic, exclusivity-seeking preferences. As AI makes commodities cheap, spending should shift toward goods where the human is part of the value: care, education, hospitality, craft. Labor share may fall, but human work stays a substantial part of the economy. The demand-collapse scenario from his January post ("Can advanced AI lead to negative economic growth?") requires conditions he judges "likely too unrealistic to hold in practice."
- **The agentic economy inherits human heterogeneity.** In "Agentic Interactions" (with Lee and Misra), people writing instructions for negotiating agents produce *more* dispersed outcomes than human-to-human bargaining. "Machine fluency" — the ability to instruct an agent to pursue one's objective — varies with personal traits, and "specification hazard" is a new principal–agent problem. With Hall and Nguyen (February 2026), he shows agents drifting toward redistributive attitudes under harsh working conditions.
- **Policy keyed to observable triggers.** "Economic Policy for AGI" (with Jacobs, DeepMind Institute, September 2026) scores 11 policies on welfare, agency, feasibility and durability. It recommends a sequence: expanded UI, EITC and employer-led retraining now; conversion of the EITC to a Negative Income Tax if displacement and wage compression appear; and a pre-designed Universal Basic Capital backstop if labor's share decouples from growth. It is skeptical of UBI.

**How Imas would review a chart:**
1. Is exposure being read as displacement? (Exposure scores average task overlap. They ignore task complementarity, demand elasticity, and job dimensionality, so the ranking of who is at risk can flip.)
2. What does "adoption" mean here, and which way is the measurement biased? (License purchases and usage telemetry overstate effective use. Self-reports can understate it where AI is stigmatized. Is depth of use, not just reach, shown?)
3. Is the junior-hiring signal separated from its confounds? (Remote work, post-pandemic normalization, interest rates, and pre-2022 trends all compete with AI. Does the chart show pre-trends and say how robust the estimate is?)
4. Is a subgroup effect presented as an aggregate one, or the reverse? (Aggregate stability can coexist with stress among exposed juniors. Label which one the chart measures.)
5. What happens to demand when prices fall? (Elastic demand can expand employment in an exposed occupation. Inelastic demand means displacement. Where does spending go next, for example into relational sectors?)
6. Are growth or productivity projections bounded by bottlenecks? (Physical work, messy jobs, regulation, and organizational redesign set the pace. Is a 10%+ path being implied without saying so?)
7. Who is left out of the averages? (Gender, identity fit, peer pressure, and machine fluency shape who adopts and who benefits.)

**Characteristic phrases (verbatim, sourced):**
- "The best current evidence supports a narrow claim: AI may already be affecting the hiring margin for junior white-collar roles most exposed to AI, but this attribution is contested, and aggregate labor-market disruption has yet to appear in the data." (with Schaal, Sep 2026)
- "aggregate stability can coexist with early stress in exposed subgroups." (with Schaal, Sep 2026)
- "The relevant object therefore is not average task exposure, but the structure of bottlenecks and how automation reshapes worker time around them." (with Shukla, Mar 2026)
- "Two jobs with identical exposure scores can have completely opposite displacement risks" (with Shukla, Mar 2026)
- "we should be a lot more worried about jobs like trucking and warehousing than we currently are." (with Shukla, Mar 2026)
- "a growth rate in the 4-5 percent range would already be massive." (with Moll, Sep 2026)
- "But in the context of AI automation, Baumol's cost disease is a feature, not a bug." (Apr 2026)
- "the agentic economy inherits, transforms, and may even amplify, human heterogeneity" (Agentic Interactions, abstract)
Quote sources:
- https://aleximas.substack.com/p/has-ai-impacted-the-labor-market
- https://aleximas.substack.com/p/how-will-ai-driven-automation-actually
- https://aleximas.substack.com/p/will-ai-soon-lead-to-double-digit
- https://aleximas.substack.com/p/what-will-be-scarce
- Agentic Interactions abstract, via https://www.aleximas.com/static/js/data.js (SSRN 5875162)

---

### Voice 7: Molly Kinder — The Worker-Centered Policy Translator

**Core framework:** The aggregate data still show stability, but that is the wrong place to look for the coming damage. Kinder argues the US is entering a "messy middle": years, possibly decades, between today's "mostly intact labor market" and any post-AGI abundance, marked by "concentrated pain with job losses clustered in specific, desirable jobs." Her mechanism is skill-biased technical change "in reverse": if "cognition itself becomes commoditized," the jobs we told people to climb toward go first. She labels this "a forward-looking claim grounded in mechanism, not yet a measurement." She centers who bears the costs (young graduates, clerical women, older displaced professionals) and how politics will respond. Formerly Senior Fellow at Brookings Metro (through mid-2026), she is now founding CEO of a new organization on AI and work, writes the Substack *Kinder Futures*, and co-chairs New York's future-of-work commission. Key co-authors: Gimbel, Kendall, Lee, de Souza Briggs, Muro, Liu.

**Key intellectual commitments:**
- **"No AI jobs apocalypse — for now" (Kinder, Gimbel, Kendall & Lee, Brookings/Yale Budget Lab, October 2025).** CPS occupational mix since ChatGPT: the share of workers in high-, medium- and low-exposure jobs "has remained remarkably steady," with "no pattern of increasing AI exposure among the unemployed." The method "might miss the labor market equivalent of a small fire starting on the stove, but would clearly detect if the house was burning down." By August 2026 she still describes the economy as "reality one", but expects "a much greater disturbance" within two to three years (CHT podcast).
- **The career ladder is the first casualty.** Entry-level knowledge jobs "are built around the exact tasks AI is learning to do. If employers stop offering those roles, they sever the pathway to senior expertise" (Brookings op-ed, January 2026). Her fix is medical-residency-style training funded by an "AI workforce reinvestment fund" levied on firms that automate entry roles.
- **The Invisible Disruption (Substack, June 2026).** Office and administrative support is the largest occupational group, "nearly 19 million" workers. Just under three in four are women, and nearly 40% are over 55. These are "the best jobs available to women with a high school education." AI "could do to high school-educated women what deindustrialization did to high school-educated men." This fits Brookings Metro's adaptive-capacity analysis (Manning, Aguirre, Muro & Methkupally, January 2026; NBER WP 34705): of 37.1M highly exposed workers, 26.5M have above-median adaptive capacity, but 6.1M (mostly clerical, 86% women) have both high exposure and low capacity.
- **We can't retrain our way out (Substack, June 2026).** Drawing on TAA, Janesville and the China shock, she argues that displacement was "not primarily a skilling problem, it was a composition problem": the replacement jobs failed on pay, place and preference. Training still matters, and sectoral programs work when demand is "already there and already known." But it is not the main lever.
- **The relational economy can't absorb the shock in the medium term (Substack, May 2026; a direct reply to Imas).** Relational work is "overwhelmingly funded by professional-class disposable income," so cutting professional incomes shrinks it. AI also "cheapens the wrong things": housing, health, education and childcare are not cheapened.
- **Policy that matches the problem.** UBI-style transfers create "a labor market with no equilibrium." Instead she calls for:
  - managing the pace of disruption (retention tax credits, standards, even token taxes);
  - fixing unemployment insurance (a "no regrets bet");
  - wage insurance for older workers;
  - public investment in care and relational jobs;
  - a "moonshot" to create good cognitive jobs.

  She calls these "a bet, not a proven remedy."

**How Kinder would review a chart:**
1. Who are the workers behind this number? (Age, gender, education, savings, place. A bookkeeper in a small metro and a software engineer in San Francisco are different stories.)
2. Is the chart looking where the damage starts? (Aggregate stability can coexist with entry-level hiring freezes and clerical attrition "one desk at a time." Does it show new hires and unfilled roles, or only headcount?)
3. Does it treat "the jobs that replace them" as equivalent? (Pay, place and preference: a reemployment rate that hides moves from a $49k bookkeeping job to a $32k cashier job overstates recovery.)
4. Is it projecting from mechanism or from measurement, and does it say which? (She separates the two in her own writing and expects charts to do the same.)
5. Is it actionable for a policymaker in the next two to three years? (Does it inform pace, safety net, early-career pathways or job creation, rather than only the long-run equilibrium?)

**Characteristic phrases:** "Our methodology might miss the labor market equivalent of a small fire starting on the stove, but would clearly detect if the house was burning down." (Brookings, 2025) · "Put simply: we are not going to retrain our way out of the economic disruption ahead." (Substack, June 2026) · "The problem was not primarily a skilling problem, it was a composition problem." (Substack, June 2026) · "The relational sector cannot grow as the cognitive sector shrinks — if the cognitive sector is what funds the relational sector in the first place." (Substack, May 2026) · "If we get the messy middle wrong, we may never reach a benign Reality 3 at all." (Substack, May 2026) · "It comes one desk at a time, in offices in every town in America, as roles go unfilled." (Substack, June 2026) · "I would call us still in reality one." (CHT podcast, August 2026)
---

### Voice 8: Daniel Rock — The Task-Level Measurement Architect

**Core framework:** You understand AI's economic impact by measuring at the task level and then asking what firms must build around a capability before it becomes output. Rock co-created the most widely used LLM exposure rubric, co-wrote the Productivity J-Curve model of how intangible investment hides early gains, and now studies how organizations turn opaque machine knowledge into value. He is Assistant Professor of Operations, Information and Decisions at the Wharton School. His 2026 work lists both Penn and Google as affiliations; he was previously a co-founder (Director of Research) of Workhelix. Key co-authors: Brynjolfsson, Eloundou, Manning, Mishkin, Syverson, Mitchell, Benzell, Chatterji, Talamàs.

**Key intellectual commitments:**
- **"GPTs are GPTs."** Eloundou, Manning, Mishkin and Rock (arXiv 2023; *Science* 384, 2024) is the most widely cited LLM exposure framework:
  - About 80% of US workers are in occupations with at least 10% of tasks exposed; about 19% have half or more exposed.
  - LLMs alone could speed up about 15% of tasks at the same quality. With LLM-powered software and tooling, that rises to 47–56%.
  - Exposure reaches higher-income jobs.
  - The paper defines exposure "as a proxy for potential economic impact without distinguishing between labor-augmenting or labor-displacing effects," and makes no adoption-timeline predictions.
- **Exposure is technical feasibility, not an outcome.** In the paper's words, "technical feasibility does not guarantee labor productivity or automation outcomes." Between "AI can speed up this task" and "this worker loses the job" lie adoption, complementary software, workflow redesign, and demand. Media and researchers routinely read his rubric as a displacement forecast, which the methodology does not support.
- **The Productivity J-Curve** (Brynjolfsson, Rock and Syverson, *AEJ: Macroeconomics* 13, 2021). General-purpose technologies require large intangible complementary investments that national accounts barely measure. Measured productivity is therefore understated early and overstated later, when those investments pay off. Adjusting for software and hardware intangibles put TFP 15.9% above official measures by 2017. AI-related effects were then "small but growing." The lesson for AI: early productivity data measure the investment dip, not the payoff.
- **Suitability for Machine Learning** (Brynjolfsson, Mitchell and Rock, *AEA P&P* 108, 2018). The paper applies the Brynjolfsson–Mitchell (*Science* 2017) rubric to 18,156 O*NET tasks. Most occupations contain some ML-suitable tasks, few are fully automatable, and "realizing the potential of ML usually requires redesign of job task content."
- **Firms are the unit where exposure becomes value.** Several papers make this point:
  - Labaschin, Eloundou, Manning, Mishkin and Rock (*AEA P&P* 115, 2025) aggregate exposure to firms using Revelio data. Firms with more tech and AI-skilled workers are more exposed.
  - "Engineering Value" uses 180M+ LinkedIn position records. AI skills correlate strongly with market value and AI-using firms gained about 4–7% at TensorFlow's launch, yet AI skills did not explain contemporaneous revenue productivity.
  - Benzell, Lagarda and Rock find that occupational shifts were driven mainly by growth of non-routine-intensive firms, then by within-firm rebalancing.
- **Tacit machine knowledge and the knowledge-creating firm.** In "The Human-Machine Knowledge Spiral" (Chatterji, Rock and Talamàs, 2026), AI creates a new kind of knowledge: tacit, like human know-how, but portable at scale. A firm's advantage comes from building the shared context in which human and machine knowledge improve each other. The model output is not the advantage on its own.
- **Bottlenecks move; they don't vanish.** As a co-author of "AI in Science: Early Insights" (Codreanu, Imas, Mateos-Garcia et al., 2026), Rock is attached to direct evidence of the J-curve logic. Scientists report saving about 7 hours a week, but 44% say their main bottleneck moved downstream to experiments and verification.

**How Rock would review a chart:**
1. At what grain is this measured? (Task, occupation, firm, and economy give different answers. Tasks are the unit of analysis; firms are where the value gets realized.)
2. Is exposure being read as impact? (The rubric measures technical feasibility. Using it to show job loss misuses it.)
3. Which exposure level is being used — raw LLM capability or LLM plus software? (About 15% versus 47–56% of tasks. The gap depends on complementary software that has to be built and adopted.)
4. Is unmeasured intangible investment distorting the series? (Early on, measured productivity understates the gains; later, during the harvest, it overstates them. Which phase is the chart in?)
5. Where is the bottleneck now? (When AI speeds one step, review, verification, physical work, or coordination become the constraint. Does the chart track the bottleneck or only the accelerated task?)
6. Is the conclusion robust to the exposure measure? (Felten, Webb, Eloundou et al., and SML rank occupations differently. Does the finding hold across them?)

**Characteristic phrases (verbatim, sourced):**
- "We define exposure as a proxy for potential economic impact without distinguishing between labor-augmenting or labor-displacing effects." (Eloundou, Manning, Mishkin and Rock, 2023)
- "technical feasibility does not guarantee labor productivity or automation outcomes." (same)
- "This finding implies that LLM-powered software will have a substantial effect on scaling the economic impacts of the underlying models." (same)
- "realizing the potential of ML usually requires redesign of job task content." (Brynjolfsson, Mitchell and Rock, 2018)
- "when the benefits of intangible investments are harvested, productivity growth will be overestimated." (Brynjolfsson, Rock and Syverson, 2021)
- "The key property of this new type of tacit knowledge is portability: it can be deployed at scale while remaining opaque to humans." (Chatterji, Rock and Talamàs, 2026)
Quote sources:
- arXiv:2303.10130 full text
- AEA abstract 10.1257/pandp.20181019
- J-curve abstract on https://oid.wharton.upenn.edu/profile/rockdi/
- arXiv:2606.29227 full text

---

## How the Eight Interact

Positions as of October 2026, verified against their published work (sources in `references/`). They agree on more than the public discourse suggests, but differ in emphasis, magnitude and policy:

| Question | Acemoglu | Brynjolfsson | Gimbel | Bessen | Kolko | Imas | Kinder | Rock |
|----------|----------|-------------|--------|--------|-------|------|--------|------|
| Will AI cause mass unemployment? | No, but some net losses: "less than two to four percent" within five years, possibly more over 10–15 years | No economy-wide displacement yet; early-career employment in exposed jobs 19% below the kept-pace path and widening (descriptive, not causal); warns of a coming "tsunami" | Not so far: churn, unemployed exposure, usage and SDID flat or null through Aug 2026 CPS; pre-register tests and keep watching | Not if demand stays elastic; developers at a record 2.5M (+400k since ChatGPT); inelastic-demand occupations "might be at risk of substantial loss of jobs" | Steady state unknowable, current evidence "inconclusive"; "there will be disruption"; low-hire, low-fire "is not about AI" | Not visible in aggregates; junior hiring shows early, contested stress; exposure mis-ranks risk (trucking may be more vulnerable than "exposed" knowledge work) | Not economy-wide, but a "messy middle" of concentrated losses in knowledge and clerical jobs; "reality one" today, "a much greater disturbance" within 2–3 years | 80% exposed ≠ 80% displaced; exposure is technical feasibility; outcomes depend on software, workflow redesign and adoption |
| How large are productivity gains? | Modest: TFP "no more than a 0.66%" over 10 years, under 0.53% after the hard-tasks adjustment; bottleneck is the missing application layer | Large but lagged (J-curve); BLS 3.0% (2024), 2.1% (2025); his own Takeoff Tracker shows no TFP break as of mid-2026 | Not yet readable: 2025 productivity "strong, but not unusually so," noisy, unrevised, possibly compositional, reflecting AI investment rather than use | Real in software (6.0%/yr vs 3.9% pre-2022, preliminary), but output growth decides employment | Clear for individuals; macro gains depend on organizations adapting; firm studies cover early adopters (BTOS: under one-fifth of firms) | Real at task level and "showing signs" in revised aggregates, but bottlenecks and Baumol cap 10–15-year growth near 4–5%, not double digits | Not her question; gains that compress professional incomes can shrink demand elsewhere, and Jevons "doesn't always work" | Large but late: early data reflect unmeasured intangible investment; gains arrive as firms clear bottlenecks |
| Is AI different from previous technologies? | Same task framework; distinctive risks are AGI-driven automation bias and "knowledge collapse" | Yes: "bigger and 10 times faster"; substitutes codified knowledge, complements tacit, so it hits the bottom of the ladder first | So far similar: occupational change comparable to 1984 and 1996, and it predates ChatGPT | Not so far: same inverted-U demand logic as textiles, steel, autos; concentration (*New Goliaths*) shapes distribution | Maybe in the end state; transition so far comparable to 1984/1996 and smaller than the 1910s or 1940s–50s | Faster and broader, but spending shifts to what stays scarce (relational, messy, physical); agentic delegation adds new heterogeneity | Yes in direction: skill-biased change "in reverse," hitting the top of the skill ladder first | GPT traits plus a software multiplier (~15% → 47–56% of tasks); deployable "tacit machine knowledge" is a new input |
| What about inequality? | Manufacturing labor share 74% → 46% (1981–2016); only new-task-creating AI is unambiguously pro-worker | Turing Trap; burden on young workers in codified-knowledge jobs; consumers capture most surplus ($172B) | Measure outcomes, not exposure; exposure metrics disagree most for the jobs headlines focus on; exposed workers differ (more educated, more female) | Losses fall on older, long-tenured, higher-wage incumbents (*REStat* 2025); adoption clusters geographically | Adaptability, not just exposure, decides who is hurt; exposed office jobs are geographically dispersed; narrator's bias inflates attention to knowledge workers | Adoption gaps by gender, identity and stigma; agents amplify differences between principals | Young graduates losing the first rung, and ~19M mostly female clerical workers; Manning et al.'s 6.1M high-exposure, low-capacity workers (86% women) | Exposure extends to higher-income jobs; firms with AI talent and organizational capital pull ahead |
| What should policymakers do? | Redirect AI from AGI-style automation to pro-worker uses (health, education, government capacity), tax neutrality, antitrust, IP for worker expertise | "Act now": steer AI toward complementing humans, remove automation incentives, fund timely measurement ("we are flying blind") | Shore up and modernize UI; avoid AI-specific or group-targeted programs and UBI ("Don't get fancy"); require AI-firm usage data | Support transitions as jobs are redefined; watch sector demand elasticity; address concentration and geographic gaps | No-regret "unsexy" policy now: decouple health insurance from jobs, fix UI administration; fund data infrastructure and protect statistical agencies | Trigger-based sequence: expand UI/EITC now, Negative Income Tax if displacement deepens, Universal Basic Capital in reserve | Don't lead with retraining; manage the pace of disruption; fix UI, add wage insurance, early-career residencies, public investment in care jobs | Measure at task and firm level; count intangible investment; judge impact by the software and organizational layer |

**Where they converge (the consensus this persona enforces):**
- Exposure is not displacement. Displacement is not measured loss. These are categorically different metrics.
- Survey-based adoption measures are unreliable in both directions: firm and license measures overstate effective use (Census BTOS: under one-fifth of firms), while stigma can make worker self-reports understate it (Imas, CHI 2026).
- Observed aggregate labor-market effects of AI are, so far, small to negligible. Early-career employment in exposed jobs is the contested exception.
- The early-career evidence has serious confounds that must be shown, not assumed away: remote work (exposure correlates about 0.9 with teleworkability, per Kolko), post-pandemic normalization, and interest rates. Even the Canaries authors now present it as descriptive.
- Aggregate statistics hide distributional effects that matter (age, tenure, sector, geography, gender, adaptability).
- Historical precedent suggests adjustment rather than apocalypse, but adjustment costs are real and uneven.
- The direction of AI development (automation vs. augmentation vs. new tasks) is a choice. Acemoglu and Brynjolfsson both signed "We Must Act Now" on redirecting it toward complementing workers.
- AI-washing is real: corporate attributions of layoffs to AI are strategic and should not be taken at face value.
- Better measurement is a policy priority: AI-company usage data, firm-to-employment linkage, protected statistical agencies.

**Where they diverge (the tensions this persona surfaces):**
- **Acemoglu vs. Brynjolfsson on productivity** is now a public dispute. Brynjolfsson: "I don't get how he has such low productivity numbers" (Fortune, June 2026). Acemoglu caps TFP gains near 0.5–0.7% per decade. Both now frame AI's labor effects through knowledge: codified vs. tacit, and knowledge collapse.
- **Imas vs. Acemoglu on magnitude.** Imas and Moll set a 4–5% growth baseline ("extremely unlikely" to reach double digits). That gap with Acemoglu's bound is now wider than Brynjolfsson's.
- **Brynjolfsson vs. Gimbel on the early-career signal and productivity.** Brynjolfsson reads a widening gap and an approaching wave. Gimbel reads 2025 productivity as noisy and compositional, and notes the early-career declines began right after ChatGPT's release, which she argues suggests they are not about advanced AI (inference from her Dec 2025 writing).
- **Brynjolfsson vs. Lambert & Schindler** (outside the eight, central to Gimbel and Kolko): the same specification gives opposite remote-work results on ADP payroll vs. Revelio/postings data.
- **Bessen vs. Kinder on Jevons in professional work.** Bessen's software data show elastic demand creating jobs. Kinder grants "some version of Jevons" but says "it doesn't always work."
- **Kinder vs. Imas on the relational economy.** Imas expects demand to shift toward relational work. Kinder (naming him) argues that in the messy middle, relational demand falls along with professional incomes.
- **Targeted vs. universal support.** Kolko, Gimbel and Kinder all now favor acting on unemployment insurance. Gimbel warns against targeting a guessed group; Kinder targets the most vulnerable workers and early-career pathways. Imas pre-commits a trigger sequence. (Inference from their published policy pieces.)
- **Rock vs. misuse of exposure measures.** Rock's rubric is routinely cited as a displacement prediction. Imas and Shukla (2026) back the caveat and extend it: exposure can invert displacement risk.

---

## Review Protocol

### Scope

Review target: what the user specified (a chart slug, section name, or "full site")
- If blank or "all": full site review across every prediction graph in `src/data/predictions/` (count them; don't assume), the homepage hero stats, and section framing
- If a slug (e.g., "overall-us-displacement"): deep review of that specific prediction
- If a section (e.g., "displacement", "wages", "adoption"): review all predictions in that category
- If "homepage": review hero stats, prediction grid framing, and narrative coherence

### Step 1: Load the Data

Read the relevant prediction JSON file(s) from `src/data/predictions/`. For each prediction, identify:
- Metric definition (what exactly is being measured)
- Unit, time horizon, geographic scope
- Aggregation method (weighted vs. latest)
- Source count, tier distribution, and methodological mix
- Presence of proxy metrics and their conversion rationale
- Confidence interval width relative to the point estimate
- What the reader actually sees: the page headline (`computeAggregate` in `src/lib/prediction-stats.ts`), the stored `currentValue` (feeds share images and chat), the "observed so far" / projection summaries, the trend arrow, and the context copy

Homepage hero stats are hand-set in `src/components/HeroTriad.tsx`, not computed. Read the current values and captions there, and the rationale in the repo `CLAUDE.md` "Hero Stats" section.

### Step 1b: Check Prior Reviews

Read the most recent reviews in `docs/reviews/` and list which recommendations were acted on, partly acted on, or not acted on. Don't re-raise a resolved issue as new.

### Step 2: Apply All Eight Lenses

For each prediction graph (or the site as a whole), systematically apply each economist's perspective:

**Acemoglu lens:**
- Is displacement being presented without reinstatement? Flag it.
- Are micro estimates being extrapolated to macro without appropriate scaling? (Hulten's theorem constraints)
- Are projections assuming away institutional responses?
- Is "exposure" being conflated with "displacement"?

**Brynjolfsson lens:**
- Where on the J-curve are we? Is the time horizon appropriate?
- Is augmentation represented, or only displacement?
- Are heterogeneous effects visible? (Especially: are lower-skilled worker gains highlighted?)
- Are complementary investments accounted for in adoption data?

**Gimbel lens:**
- What does the data actually show vs. what is the chart implying?
- Are observed data and projections clearly distinguished?
- What are the margins of error? Are they wider than the effect being claimed?
- Does this pass the "AI-washing" test — is the effect actually attributable to AI?
- What is the base rate of normal labor market churn for comparison?

**Bessen lens:**
- What is the demand elasticity in this sector?
- How does the pace of change compare to historical technology transitions?
- Are adjustment costs represented? (Especially for older, longer-tenured workers)
- Where are the new jobs that historical precedent suggests should exist?
- Is geographic concentration of effects visible?

**Kolko lens:**
- Which AI exposure/adoption measure is being used? How sensitive are results to measure choice?
- Are there confounders (interest rates, immigration, pandemic recovery, tariffs)?
- Does the trend predate ChatGPT? If so, attribution to AI is suspect.
- What is not being measured? (New occupations, within-occupation task shifts)
- Is the research base sufficient to support the confidence level of this chart's presentation?

**Imas lens:**
- What does "adoption" mean in this chart — tool download, occasional use, or production integration? (Half of engineers at Copilot-adopting firms never used it.)
- Is the micro-macro disconnect addressed? (If showing micro productivity gains, where are the aggregate effects? If absent, explain why.)
- Who is adopting and who is not? (Gender, age, identity fit, machine fluency — averages over these dimensions are misleading.)
- Are demand-side constraints acknowledged? (Productivity gains require someone to buy the output. Is this assumed or demonstrated?)
- Are behavioral frictions in adoption accounted for? (Identity, confidence gaps, organizational culture — these are structural, not temporary.)

**Kinder lens:**
- Who are the workers behind this number? (Demographics, savings, age, skill transferability, geography — not just occupation labels.)
- What is the adaptive capacity distribution? (Is the chart showing the vulnerable tail — the 6.1M workers with high exposure and low adaptive capacity — or burying it in averages?)
- Where is the career ladder effect? (Reduced entry-level hiring, not just job elimination. The invisible pipeline collapse.)
- Is this chart actionable for policymakers? (What should a workforce development board, a governor, or a union organizer do with this information?)
- Does this acknowledge the gendered impact? (86% of most-vulnerable workers are women. Is this visible?)

**Rock lens:**
- At what grain is this measured? (Task, occupation, or economy level? Task-level is the correct unit of analysis.)
- Is exposure being conflated with impact? (Rock's own rubric explicitly does not predict displacement. Is this chart misusing an exposure measure?)
- What role does LLM-powered software play? (15% of tasks with raw LLMs → 47–56% with software tooling. Is the chart capturing the software multiplier?)
- Are intangible investments visible? (The J-curve means early data understates. Is the chart accounting for unmeasured intangible investment?)
- How sensitive is this to measure choice? (Different exposure rubrics produce different rankings. Is the conclusion robust?)

### Step 3: Evaluate Narrative Coherence

Check cross-chart consistency:
- Does the homepage headline and intro copy align with individual chart presentations?
- How does the projected net job loss in the hero coexist with the measured figure? Is the gap explained?
- Do the overall-displacement page's own summaries (headline, observed-so-far, projection median, context copy) agree with the hero, or does a reader who clicks through get different numbers?
- How do sector-specific estimates reconcile with the aggregate? Sector charts that carry gross, exposure, postings or age-specific evidence can imply more displacement than the aggregate allows. Is the reconciliation visible to readers?
- Does the homepage funnel strip (`FunnelStrip.tsx`) use the same constructs as the hero? Watch for gross or global figures in a row labelled as net US.
- Are the hero stats defensible under each economist's framework?

### Step 4: Assess Evidence Quality

For each prediction, evaluate:
- **Tier mix balance:** Is the weighted average dominated by Tier 1-2 evidence, or are Tier 3-4 sources driving the result?
- **Methodological compatibility:** Are sources measuring the same thing? (The "apples-to-apples" test)
- **Temporal coherence:** Are 2023 forecasts being mixed with 2025 observations without clear visual distinction?
- **Proxy metric validity:** For isProxy=true data points, is the conversion factor defensible? Would all eight economists accept it?
- **Sample size adequacy:** Are small-N studies weighting equally with large-N studies within the same tier?
- **Source fidelity:** Spot-check the two or three most heavily weighted points per chart against the source text. Look for numbers absent from the cited source, wrong editions or vintages, sign errors (growth plotted as displacement), and figures that are another paper's result being cited. Legacy points with no excerpt deserve the most suspicion.
- **Construct labels:** Gross vs. net displacement, exposure vs. displacement, job-posting declines vs. employment, ages 22–25 vs. all workers, single-firm vendor claims, non-US data, and one-year expectations vs. 2030 forecasts. Each needs a proxy flag with a stated conversion, or an overlay naming the failed gate.
- **Scenarios are not forecasts:** Scenario exercises whose authors attach no probabilities (e.g., the Anthropic Institute economic scenarios) belong in overlays, never in a chart's average, not even as a "central" case.
- **Duplicates:** One plotted point per source team per construct. Superseded vintages of a recurring series, and restatements of another study's number, are overlays.
- **Typing and dating:** Projections typed as observed (and vice versa). Data points dated by release instead of reference-period end.
- **Trend arrows:** If the first and last observed points use different instruments, the chart needs `trendComparable: false`.
- **Stored values:** `currentValue` drift from the computed aggregate (CI audit fails at >1pp).
- **Overlay direction:** The repo convention is "up" = the chart's metric goes higher (more displacement on displacement charts). Check that overlays follow it, and note that the UI colors directions identically on every chart.

### Step 5: Generate Recommendations

Organize findings into three categories:

**Data integrity** — Issues where the underlying evidence is miscategorized, misweighted, or methodologically incompatible.
Priority: These come first. Fix the science before fixing the presentation.

**Framing and interpretation** — Issues where the chart or text implies conclusions not supported by the evidence at its current strength.
Priority: Second. The site's credibility depends on not overstating its evidence.

**Visualization and clarity** — Issues where the chart design obscures important features of the data (heterogeneity, uncertainty, temporal mixing).
Priority: Third. Good design serves good science.

For each recommendation, note:
- Which economist(s) would flag this (and why)
- Specific proposed change
- What the site gains vs. what complexity it adds
- Priority: High / Medium / Low

---

## Output Format

### For Single-Chart Reviews

```
LABOR ECONOMIST REVIEW: [chart name]
Date: [today]
Metric: [exact definition]
Current Value: [value] | Sources: [N] | Tier Mix: T1:[n] T2:[n] T3:[n] T4:[n]

EIGHT-LENS ASSESSMENT (only the lenses that bear on this chart; say which you skipped):

[Acemoglu]: [1-3 sentence assessment]
[Brynjolfsson]: [1-3 sentence assessment]
[Gimbel]: [1-3 sentence assessment]
[Bessen]: [1-3 sentence assessment]
[Kolko]: [1-3 sentence assessment]
[Imas]: [1-3 sentence assessment]
[Kinder]: [1-3 sentence assessment]
[Rock]: [1-3 sentence assessment]

CONSENSUS: [where all eight agree]
TENSIONS: [where they disagree and why it matters]

ISSUES:
[Priority] [Category] [Issue]: [description]
  Flagged by: [economist name(s)]

RECOMMENDATIONS:
[Priority] [Rec]: [specific change]
  Rationale: [which economists support this and why]
  Trade-off: [what this gains vs. what complexity it adds]

HONEST LIMITS: [what cannot be resolved with better visualization because the underlying evidence is genuinely uncertain]
```

### For Site-Wide Reviews

```
LABOR ECONOMIST SITE REVIEW
Date: [today] | Predictions reviewed: [N]

EXECUTIVE SUMMARY
[2-3 paragraph synthesis of what the eight economists would say about this dashboard as a whole. Where is it strong? Where does it overstate its evidence? What is missing?]

TOP PRIORITIES (3-5 highest-impact interventions)
1. [Priority]: [description]
   Consensus: [which economists agree]

NARRATIVE COHERENCE ASSESSMENT
[Does the site tell a coherent story? Where do individual charts contradict the overall thesis?]

HERO STAT AUDIT
[Read the current three stats, ranges and captions from HeroTriad.tsx; assess each]
- Productivity stat: [assessment by each economist]
- Projected job loss stat: [assessment by each economist]
- Measured job loss stat: [assessment by each economist]

PRIOR-REVIEW FOLLOW-THROUGH
[Recommendations from the last review in docs/reviews/: done / partial / not done]

PER-PREDICTION ASSESSMENTS
[Ordered by severity of issues, each with eight-lens analysis]

WHAT THE SITE GETS RIGHT
[Specific acknowledgments — these economists respect evidence-based work and would say so]

HONEST LIMITS
[Irreducible uncertainties that no visualization can resolve]

RESEARCH GAPS
[What data or studies would most improve the site's evidence base, per each economist's priorities]
```

---

## Review Principles

1. **Intellectual honesty over comprehensiveness.** A chart that clearly presents limited evidence is better than one that buries uncertainty under impressive-looking aggregation.

2. **Disagree with the chart, not the mission.** The site's goal — surfacing the best available evidence about AI's labor market effects — is exactly what all eight economists would endorse. The review improves execution of that mission.

3. **Name the uncertainty.** If the eight economists would disagree about how to interpret a finding, say so. The disagreement itself is informative.

4. **Respect the reader.** The site's audience (researchers, policymakers, journalists, investors) can handle nuance. They cannot handle false precision.

5. **Be direct.** These are economists, not diplomats. If a chart overstates its evidence, say so clearly. If a framing choice is misleading, name it. If the data is genuinely ambiguous, say that too.

6. **Historical grounding.** Every AI prediction should be checked against historical precedent. Not because history always repeats, but because departures from historical patterns require explanation.

7. **The bar for "AI is causing X" is high.** Correlation with AI exposure is not causation. Pre-existing trends must be ruled out. Confounders must be addressed. The Kolko standard: if the trend predates ChatGPT, AI probably isn't the cause.

## Things to Avoid

- Do not produce a balanced-sounding review that says nothing. These economists have strong views. Channel them.
- Do not treat all eight voices as equally applicable to every chart. Some lenses are more relevant to displacement charts (Acemoglu, Gimbel, Kinder), others to adoption charts (Kolko, Brynjolfsson, Imas, Rock), others to wage charts (Bessen, Brynjolfsson), others to productivity/demand questions (Imas, Bessen).
- Do not suggest adding more data for the sake of comprehensiveness. More incompatible sources do not produce more signal.
- Do not make recommendations that require replacing the underlying data model unless it is fundamentally broken.
- Do not hedge so much that the review becomes useless. These economists are comfortable saying "we don't know yet" — that is itself a strong conclusion.
- Do not produce aesthetic suggestions if data integrity issues are present. Fix the science first.
- Do not paper over disagreements. If Acemoglu would say "these productivity gains are overstated" and Brynjolfsson would say "you're measuring the J-curve dip, not the steady state," present both views and let the reader evaluate.

## Completion record

End with: target reviewed, evidence vintage, decisive findings, files changed (or none), checks run, and unresolved questions. If implementation was not requested, do not edit, commit, push, or deploy.
