1	# AI Labor Research Digest — 2026-04-10
2	
3	## Summary
4	
5	This week's digest (April 3–10, 2026) surfaces four qualifying sources with quantitative AI labor market statistics. The strongest is a **Tier 1** Federal Reserve FEDS Note published April 3 by Board of Governors economist Jeffrey S. Allen, synthesizing three government/academic surveys and producing the most authoritative current snapshot of US AI adoption rates. Two separate Goldman Sachs research notes — one quantifying net monthly US job losses from AI (≈16,000/month) and one documenting "scarring" effects on displaced workers' long-run earnings — represent the week's most significant new empirical findings at the Tier 2 level. A Nikkei Asia/Tom's Hardware report on Q1 2026 tech layoffs adds directional sector-level evidence. No peer-reviewed journal articles (Tier 1) on displacement or wage outcomes were published within the window. The Census Bureau BTOS released new data products on April 9 but confirmed that AI-specific questions will not be published until Spring 2026.
6	
7	---
8	
9	## New Sources
10	
11	---
12	
13	### Monitoring AI Adoption in the US Economy
14	- **Publisher:** Board of Governors of the Federal Reserve System (FEDS Notes)
15	- **Date:** 2026-04-03
16	- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
17	- **Evidence Tier:** 1 (Government — Federal Reserve Board staff analysis; synthesizes Census BTOS, Real-Time Population Survey, and Atlanta Fed Survey of Business Uncertainty)
18	- **Source ID:** federalreserve-ai-adoption-2026
19	
20	**Statistics:**
21	
22	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
23	   **Type:** DATA_POINT
24	   **Value:** 18 % of US firms
25	   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
26	   **Notes:** This is the headline Census BTOS firm-weighted percentage (4-period moving average, legacy question series). Exactly matches the `ai-adoption-rate` graph's designated source (Census BTOS). Prior-year growth was 68% (3.9 pp) before decelerating in Q2 2025.
27	
28	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
29	   **Type:** DATA_POINT
30	   **Value:** 41 % of the workforce
31	   **Quote:** "work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025."
32	   **Notes:** Source is Real-Time Population Survey (Bick, Blandin, and Deming 2026), nationally representative. Year-on-year growth was 31.3% (9.7 percentage points).
33	
34	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
35	   **Type:** OVERLAY (up)
36	   **Value:** 78 % of labor force
37	   **Quote:** "The SBU estimates an employment-weighted firm AI adoption rate of around 78 percent and an LLM adoption rate of about 54 percent. In this context, employment weighting approximates the share of the labor force working at firms that have adopted AI."
38	   **Notes:** This is the Atlanta Fed Survey of Business Uncertainty (SBU) employment-weighted estimate — a methodologically distinct measure from the BTOS firm-count estimate. It represents a plausible upper bound on workforce access to AI tools. The SBU targets senior business executives. The gap between 18% (BTOS) and 78% (SBU) is explained by large firms being the heaviest AI adopters and the largest employers.
39	
40	4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
41	   **Type:** OVERLAY (up)
42	   **Value:** 63 % (financial sector); 62 % (professional services)
43	   **Quote:** "the right panel of figure 4 shows that work-related GenAI adoption reported in the RPS is highest in the financial (63 percent) and professional services (62 percent) sectors."
44	   **Notes:** These are sector-specific sub-estimates from the RPS; they represent an upper range above the 41% headline. Manufacturing sector GenAI adoption grew ~58% YoY (14.5 pp).
45	
46	5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
47	   **Type:** OVERLAY (up)
48	   **Value:** 20 % of firms (expected H1 2026)
49	   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
50	   **Notes:** This is forward-looking BTOS planned adoption, not a current reading. Adoption is expected to continue growing. Professional services and financial sectors lead at ~33% and ~30%, respectively (new BTOS question series).
51	
52	---
53	
54	### AI is Cutting 16,000 U.S. Jobs a Month — Goldman Sachs U.S. Daily Note
55	- **Publisher:** Goldman Sachs (via Fortune / Allwork.Space)
56	- **Date:** 2026-04-06 (Fortune original); coverage dated 2026-04-07
57	- **URL:** https://allwork.space/2026/04/ai-eliminating-16000-u-s-jobs-every-month-goldman-sachs-reports/
58	- **Evidence Tier:** 2 (Major investment bank research — Goldman Sachs U.S. Daily note by economist Elsie Peng; methodology combines AI exposure scores with IMF economists' complementarity index; estimates via regression analysis, not direct job counts)
59	- **Source ID:** goldmansachs-monthly-jobs-2026
60	
61	**Statistics:**
62	
63	1. **Graph:** Total US Jobs Lost to AI (`total-us-jobs-lost`)
64	   **Type:** OVERLAY (up)
65	   **Value:** −16,000 net jobs/month (US)
66	   **Quote:** "New research by Goldman Sachs economists finds that AI is already a measurable drag on the U.S. job market — erasing roughly 16,000 net jobs per month over the past year, with the pain falling hardest on Gen Z and entry-level workers."
67	   **Notes:** This is a net figure. Gross substitution effect is larger: "Goldman's breakdown shows AI substitution wiped out roughly 25,000 jobs per month in the past year, while augmentation added back about 9,000." Classified as OVERLAY (not DATA_POINT) because the graph unit is % of labor force, and 16,000/month is a count, not yet expressed as a share. Direction is clearly upward (evidence consistent with displacement occurring). GS cautions the figure "does not fully capture the offsetting hiring surge tied to AI infrastructure investments."
68	
69	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
70	   **Type:** OVERLAY (down)
71	   **Value:** −3.3 percentage points (wage gap widening per SD of AI substitution exposure)
72	   **Quote:** "Goldman's regression analysis estimating that a one standard-deviation increase in AI substitution exposure widens the entry-level-to-experienced wage gap by roughly 3.3 percentage points."
73	   **Notes:** This is a wage gap metric (entry-level vs. experienced workers), not a median wage level. Classified as OVERLAY because it measures relative wage compression at entry level due to AI exposure, directionally negative for entry-level workers.
74	
75	---
76	
77	### Losing Your Job to AI Doesn't Just Lead to Unemployment, It Leaves Lasting Scars
78	- **Publisher:** Goldman Sachs (via CNN Business)
79	- **Date:** 2026-04-07
80	- **URL:** https://edition.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects
81	- **Evidence Tier:** 2/3 (Goldman Sachs research note authored by economists Pierfrancesco Mei and Jessica Rindels, published Monday April 7; CNN coverage is Tier 3 but the underlying data is Tier 2. Methodology: identified technology-displaced workers historically since 1980 using National Longitudinal Surveys [BLS federal program]. Not yet peer-reviewed.)
82	- **Source ID:** goldmansachs-scarring-2026
83	
84	**Statistics:**
85	
86	1. **Graph:** Median Wage Impact (`median-wage-impact`)
87	   **Type:** OVERLAY (down)
88	   **Value:** −10 percentage points (real earnings, 10 years post-displacement)
89	   **Quote:** "10 years after a job loss, technology-displaced workers' real earnings were 10 percentage points below that of non-displaced workers."
90	   **Notes:** This is for *technology-displaced* workers specifically (not the full workforce), derived from National Longitudinal Surveys. Mapped as OVERLAY (not DATA_POINT) because it applies to a subpopulation of displaced workers rather than to median wages economy-wide. The direction is strongly downward. Goldman previously estimated 6–7% of US workers (~11 million) could be displaced by AI — if that share faces this earnings trajectory, the macro wage impact is significant.
91	
92	2. **Graph:** Median Wage Impact (`median-wage-impact`)
93	   **Type:** OVERLAY (down)
94	   **Value:** −3 % (real earnings, short-run, technology-displaced workers vs. negligible for others)
95	   **Quote:** "their inflation-adjusted earnings take bigger hits (more than 3%) versus other workers (negligible effect)."
96	   **Notes:** Short-run (months following displacement) effect on real earnings for technology-displaced workers. Reinforces downward wage pressure direction.
97	
98	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
99	   **Type:** OVERLAY (up)
100	   **Value:** 6.5 % (midpoint of 6–7% range; ~11 million US workers)
101	   **Quote:** "Goldman Sachs previously estimated that 6% to 7% of US workers (about 11 million people) could have their jobs displaced by AI."
102	   **Notes:** This is the prior Goldman Sachs baseline estimate, reaffirmed in the context of this new research. Not a new number, but it is being cited as context for the scarring analysis published this week. Direction is upward pressure on the displacement graph.
103	
104	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
105	   **Type:** OVERLAY (up)
106	   **Value:** +5 percentage points (additional likelihood of subsequent joblessness during a recession)
107	   **Quote:** "The effects of technology-related displacements are amplified (by three weeks of additional unemployment and a 5-percentage-point likelihood of subsequent joblessness)."
108	   **Notes:** This is a conditional risk multiplier (recession scenario), not a baseline displacement rate. Documents that AI-driven displacement interacts with macroeconomic cycles. The ongoing tariff-related economic uncertainty increases the relevance of this finding.
109	
110	---
111	
112	### Tech Industry Lays Off Nearly 80,000 Employees in Q1 2026 — Almost 50% Due to AI
113	- **Publisher:** Tom's Hardware (reporting Nikkei Asia original)
114	- **Date:** 2026-04-08
115	- **URL:** https://www.tomshardware.com/tech-industry/tech-industry-lays-off-nearly-80-000-employees-in-the-first-quarter-of-2026-almost-50-percent-of-affected-positions-cut-due-to-ai
116	- **Evidence Tier:** 3 (Trade publication covering Nikkei Asia reporting; primary data source is Nikkei Asia's compiled layoff tracking, January–April 2026. Attribution of cuts to AI is based on company-stated reasons; subject to "AI-washing" concern noted by OpenAI CEO Sam Altman and Cognizant Chief AI Officer Babak Hodjat.)
117	- **Source ID:** nikkeiasiatomshardware-tech-layoffs-q1-2026
118	
119	**Statistics:**
120	
121	1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
122	   **Type:** OVERLAY (up)
123	   **Value:** 47.9 % (share of Q1 2026 tech layoffs attributed to AI/workflow automation)
124	   **Quote:** "78,557 workers in the tech industry have reportedly been laid off from January 1 to April 2026, with more than 76% of the affected positions located in the U.S. Nikkei Asia reports that 37,638 of these cuts, or 47.9%, have been attributed to the reduced need for human workers because of AI and workflow automation."
125	   **Notes:** Important caveat: This is based on company-stated reasons for layoffs, which may overstate AI attribution (per "AI-washing" warnings from industry leaders). The absolute count — 78,557 total tech workers, 76%+ in the US — is the most reliable figure; the 47.9% AI attribution is self-reported and directional only. Classified as OVERLAY rather than DATA_POINT because the graph unit is % of tech jobs displaced by 2030 (structural), while this measure is % of layoffs in one quarter attributed to AI (cyclical/stated reason).
126	
127	---
128	
129	## Sources Checked but Not Relevant or Not Within 7-Day Window
130	
131	- **Census BTOS April 9, 2026** (https://www.census.gov/newsroom/press-releases/2026/btos-apr-9.html): Routine biweekly data release. Confirmed AI questions added November 17, 2025, will be published in Spring 2026. No new AI-specific quantitative statistics available in this release.
132	
133	- **Forbes / Challenger, Gray & Christmas — March Layoff Report** (https://www.forbes.com/sites/maryroeloffs/2026/04/02/ai-blamed-heavily-for-march-job-cuts-report-says/): Published April 2, 2026 — **one day before the 7-day window**. Key stat: 60,620 US job cuts in March; AI cited as leading reason in 25% of announcements; tech sector led with 18,720 cuts. Recommend ingesting in next digest or noting as immediate context.
134	
135	- **Brookings Institution / NBER — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement"** (https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/): Published January 21, 2026. Outside the 7-day window but contains the week's most policy-relevant US-specific figures (6.1 million workers with high AI exposure + low adaptive capacity; 86% are women). Already known to digest editors; recommend confirming ingestion status.
136	
137	- **NBER Working Paper 34859 — "Chaining Tasks, Redefining Work: A Theory of AI Automation"** (https://www.nber.org/papers/w34859): Issue Date February 2026. Theoretical framework paper; no new empirical statistics directly mappable to graphs.
138	
139	- **IMF Staff Discussion Note SDN/2026/001 — "New Jobs Creation in the AI Age"** (https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf): January 2026. Outside window. Key finding: employment in AI-vulnerable occupations is 3.6% lower after five years in high AI-skill-demand regions (relevant to `workforce-ai-exposure`). Previously published, recommend confirming ingestion.
140	
141	- **WEF — "Four Futures for Jobs in the New Economy: AI and Talent in 2030"** (https://reports.weforum.org/docs/WEF_Four_Futures_for_Jobs_in_the_New_Economy_AI_and_Talent_in_2030_2025.pdf): 2025 report. Outside window; scenario-based framework only, no new empirical data.
142	
143	- **theworlddata.com, almcorp.com, designrush.com, click-vision.com**: Tier 4 aggregators. No original data; all statistics traced back to previously known sources (Goldman Sachs, McKinsey, WEF). Not ingested.
144	
145	- **ScienceDirect — "Artificial intelligence, tasks, skills, and wages: Worker-level evidence from Germany"** (https://www.sciencedirect.com/science/article/pii/S0048733325001143): German labor market data; global stat → overlay-only; outside 7-day window; not US-specific.
146	
147	- **Business Insider — "Former Salesforce AI CEO Warns AI May Quietly Push Wages Down"** (https://www.businessinsider.com/ai-could-lower-wages-not-just-eliminate-jobs-3-2026): March 2026. Outside window. Contains interesting Brookings "intelligence saturation" tipping point thesis (37% automation triggers wage reversal; 14% already automated), but this is a model projection, not empirical measurement.
148	
149	- **Washington Post — "AI job losses: Look up which workers are most vulnerable"** (https://www.washingtonpost.com/technology/interactive/2026/jobs-most-affected-ai-automation/): Published 2026 (no specific date found); primarily qualitative interactive. No new quantitative stats.
150	
151	---
152	
153	## Priority Recommendations
154	
155	### Ingest Immediately
156	1. **Federal Reserve FEDS Note (April 3, 2026)** — Tier 1. The 18% BTOS firm adoption rate is a direct DATA_POINT for the `ai-adoption-rate` graph and the most authoritative US government measure available. The 41% GenAI work adoption figure from the RPS is a confirmed DATA_POINT for `genai-work-adoption`. Both should be updated in graphs immediately. The SBU's 78% employment-weighted figure should be added as an overlay context line.
157	
158	2. **Goldman Sachs "16,000 jobs/month" note (April 6–7, 2026)** — Tier 2. The net monthly job loss figure (−16,000/month) and the entry-level wage gap widening (−3.3 pp per SD of AI substitution) are among the most specific quantitative estimates of AI's *current* labor market impact published to date. Flag for `total-us-jobs-lost` and `entry-level-wage-impact` overlays.
159	
160	3. **Goldman Sachs "Scarring" note (April 7, 2026)** — Tier 2. The 10-year real earnings impact (−10 pp) for technology-displaced workers, derived from BLS National Longitudinal Surveys, is historically grounded and directionally important for `median-wage-impact`. The recession multiplier (+5 pp joblessness risk) is acutely timely given current tariff-related economic uncertainty.
161	
162	### Statistics That Diverge from Current Graph Consensus
163	- **AI firm adoption rate (18%)** is notably lower than some widely-cited industry surveys (e.g., McKinsey's ~72%, Deloitte's ~66%) — the Fed note explains this gap clearly (firm-level BTOS vs. employment-weighted measures). Graphs currently using higher adoption figures should include methodology caveats.
164	- **16,000 net jobs/month lost** is more granular and current than most prior estimates. If annualized (~192,000/year), this is modest relative to a 170M-person labor force, but the *entry-level concentration* makes it disproportionately visible in hiring freezes and youth unemployment.
165	- **Tech sector layoffs (47.9% AI-attributed in Q1 2026)** is a striking headline but requires caution given self-reported attribution. The Challenger data (outside window, April 2) showing 25% AI attribution across all sectors is a better-controlled measure.
166	
167	### Watch for Spring 2026
168	- **Census Bureau BTOS AI questions** — confirmed for Spring 2026 publication. This will provide the first official government data from the revised (November 2025) AI question wording covering firm AI use "in any business function." Will be a major DATA_POINT update for `ai-adoption-rate`.
169	- **NBER Volume on "Economics of Transformative AI"** — the Brookings/GovAI adaptive capacity paper (Manning & Aguirre) is a chapter in this forthcoming NBER volume. Full publication may trigger additional coverage and citation.
Here is the complete, verbatim contents of `digest.md`:

---

# AI Labor Research Digest — 2026-04-10

## Summary

This week's digest (April 3–10, 2026) surfaces four qualifying sources with quantitative AI labor market statistics. The strongest is a **Tier 1** Federal Reserve FEDS Note published April 3 by Board of Governors economist Jeffrey S. Allen, synthesizing three government/academic surveys and producing the most authoritative current snapshot of US AI adoption rates. Two separate Goldman Sachs research notes — one quantifying net monthly US job losses from AI (≈16,000/month) and one documenting "scarring" effects on displaced workers' long-run earnings — represent the week's most significant new empirical findings at the Tier 2 level. A Nikkei Asia/Tom's Hardware report on Q1 2026 tech layoffs adds directional sector-level evidence. No peer-reviewed journal articles (Tier 1) on displacement or wage outcomes were published within the window. The Census Bureau BTOS released new data products on April 9 but confirmed that AI-specific questions will not be published until Spring 2026.

---

## New Sources

---

### Monitoring AI Adoption in the US Economy
- **Publisher:** Board of Governors of the Federal Reserve System (FEDS Notes)
- **Date:** 2026-04-03
- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
- **Evidence Tier:** 1 (Government — Federal Reserve Board staff analysis; synthesizes Census BTOS, Real-Time Population Survey, and Atlanta Fed Survey of Business Uncertainty)
- **Source ID:** federalreserve-ai-adoption-2026

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % of US firms
   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025."
   **Notes:** This is the headline Census BTOS firm-weighted percentage (4-period moving average, legacy question series). Exactly matches the `ai-adoption-rate` graph's designated source (Census BTOS). Prior-year growth was 68% (3.9 pp) before decelerating in Q2 2025.

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41 % of the workforce
   **Quote:** "work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025."
   **Notes:** Source is Real-Time Population Survey (Bick, Blandin, and Deming 2026), nationally representative. Year-on-year growth was 31.3% (9.7 percentage points).

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 78 % of labor force
   **Quote:** "The SBU estimates an employment-weighted firm AI adoption rate of around 78 percent and an LLM adoption rate of about 54 percent. In this context, employment weighting approximates the share of the labor force working at firms that have adopted AI."
   **Notes:** This is the Atlanta Fed Survey of Business Uncertainty (SBU) employment-weighted estimate — a methodologically distinct measure from the BTOS firm-count estimate. It represents a plausible upper bound on workforce access to AI tools. The SBU targets senior business executives. The gap between 18% (BTOS) and 78% (SBU) is explained by large firms being the heaviest AI adopters and the largest employers.

4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 63 % (financial sector); 62 % (professional services)
   **Quote:** "the right panel of figure 4 shows that work-related GenAI adoption reported in the RPS is highest in the financial (63 percent) and professional services (62 percent) sectors."
   **Notes:** These are sector-specific sub-estimates from the RPS; they represent an upper range above the 41% headline. Manufacturing sector GenAI adoption grew ~58% YoY (14.5 pp).

5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 20 % of firms (expected H1 2026)
   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
   **Notes:** This is forward-looking BTOS planned adoption, not a current reading. Adoption is expected to continue growing. Professional services and financial sectors lead at ~33% and ~30%, respectively (new BTOS question series).

---

### AI is Cutting 16,000 U.S. Jobs a Month — Goldman Sachs U.S. Daily Note
- **Publisher:** Goldman Sachs (via Fortune / Allwork.Space)
- **Date:** 2026-04-06 (Fortune original); coverage dated 2026-04-07
- **URL:** https://allwork.space/2026/04/ai-eliminating-16000-u-s-jobs-every-month-goldman-sachs-reports/
- **Evidence Tier:** 2 (Major investment bank research — Goldman Sachs U.S. Daily note by economist Elsie Peng; methodology combines AI exposure scores with IMF economists' complementarity index; estimates via regression analysis, not direct job counts)
- **Source ID:** goldmansachs-monthly-jobs-2026

**Statistics:**

1. **Graph:** Total US Jobs Lost to AI (`total-us-jobs-lost`)
   **Type:** OVERLAY (up)
   **Value:** −16,000 net jobs/month (US)
   **Quote:** "New research by Goldman Sachs economists finds that AI is already a measurable drag on the U.S. job market — erasing roughly 16,000 net jobs per month over the past year, with the pain falling hardest on Gen Z and entry-level workers."
   **Notes:** This is a net figure. Gross substitution effect is larger: "Goldman's breakdown shows AI substitution wiped out roughly 25,000 jobs per month in the past year, while augmentation added back about 9,000." Classified as OVERLAY (not DATA_POINT) because the graph unit is % of labor force, and 16,000/month is a count, not yet expressed as a share. Direction is clearly upward (evidence consistent with displacement occurring). GS cautions the figure "does not fully capture the offsetting hiring surge tied to AI infrastructure investments."

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −3.3 percentage points (wage gap widening per SD of AI substitution exposure)
   **Quote:** "Goldman's regression analysis estimating that a one standard-deviation increase in AI substitution exposure widens the entry-level-to-experienced wage gap by roughly 3.3 percentage points."
   **Notes:** This is a wage gap metric (entry-level vs. experienced workers), not a median wage level. Classified as OVERLAY because it measures relative wage compression at entry level due to AI exposure, directionally negative for entry-level workers.

---

### Losing Your Job to AI Doesn't Just Lead to Unemployment, It Leaves Lasting Scars
- **Publisher:** Goldman Sachs (via CNN Business)
- **Date:** 2026-04-07
- **URL:** https://edition.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects
- **Evidence Tier:** 2/3 (Goldman Sachs research note authored by economists Pierfrancesco Mei and Jessica Rindels, published Monday April 7; CNN coverage is Tier 3 but the underlying data is Tier 2. Methodology: identified technology-displaced workers historically since 1980 using National Longitudinal Surveys [BLS federal program]. Not yet peer-reviewed.)
- **Source ID:** goldmansachs-scarring-2026

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −10 percentage points (real earnings, 10 years post-displacement)
   **Quote:** "10 years after a job loss, technology-displaced workers' real earnings were 10 percentage points below that of non-displaced workers."
   **Notes:** This is for *technology-displaced* workers specifically (not the full workforce), derived from National Longitudinal Surveys. Mapped as OVERLAY (not DATA_POINT) because it applies to a subpopulation of displaced workers rather than to median wages economy-wide. The direction is strongly downward. Goldman previously estimated 6–7% of US workers (~11 million) could be displaced by AI — if that share faces this earnings trajectory, the macro wage impact is significant.

2. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −3 % (real earnings, short-run, technology-displaced workers vs. negligible for others)
   **Quote:** "their inflation-adjusted earnings take bigger hits (more than 3%) versus other workers (negligible effect)."
   **Notes:** Short-run (months following displacement) effect on real earnings for technology-displaced workers. Reinforces downward wage pressure direction.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 6.5 % (midpoint of 6–7% range; ~11 million US workers)
   **Quote:** "Goldman Sachs previously estimated that 6% to 7% of US workers (about 11 million people) could have their jobs displaced by AI."
   **Notes:** This is the prior Goldman Sachs baseline estimate, reaffirmed in the context of this new research. Not a new number, but it is being cited as context for the scarring analysis published this week. Direction is upward pressure on the displacement graph.

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** +5 percentage points (additional likelihood of subsequent joblessness during a recession)
   **Quote:** "The effects of technology-related displacements are amplified (by three weeks of additional unemployment and a 5-percentage-point likelihood of subsequent joblessness)."
   **Notes:** This is a conditional risk multiplier (recession scenario), not a baseline displacement rate. Documents that AI-driven displacement interacts with macroeconomic cycles. The ongoing tariff-related economic uncertainty increases the relevance of this finding.

---

### Tech Industry Lays Off Nearly 80,000 Employees in Q1 2026 — Almost 50% Due to AI
- **Publisher:** Tom's Hardware (reporting Nikkei Asia original)
- **Date:** 2026-04-08
- **URL:** https://www.tomshardware.com/tech-industry/tech-industry-lays-off-nearly-80-000-employees-in-the-first-quarter-of-2026-almost-50-percent-of-affected-positions-cut-due-to-ai
- **Evidence Tier:** 3 (Trade publication covering Nikkei Asia reporting; primary data source is Nikkei Asia's compiled layoff tracking, January–April 2026. Attribution of cuts to AI is based on company-stated reasons; subject to "AI-washing" concern noted by OpenAI CEO Sam Altman and Cognizant Chief AI Officer Babak Hodjat.)
- **Source ID:** nikkeiasiatomshardware-tech-layoffs-q1-2026

**Statistics:**

1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 47.9 % (share of Q1 2026 tech layoffs attributed to AI/workflow automation)
   **Quote:** "78,557 workers in the tech industry have reportedly been laid off from January 1 to April 2026, with more than 76% of the affected positions located in the U.S. Nikkei Asia reports that 37,638 of these cuts, or 47.9%, have been attributed to the reduced need for human workers because of AI and workflow automation."
   **Notes:** Important caveat: This is based on company-stated reasons for layoffs, which may overstate AI attribution (per "AI-washing" warnings from industry leaders). The absolute count — 78,557 total tech workers, 76%+ in the US — is the most reliable figure; the 47.9% AI attribution is self-reported and directional only. Classified as OVERLAY rather than DATA_POINT because the graph unit is % of tech jobs displaced by 2030 (structural), while this measure is % of layoffs in one quarter attributed to AI (cyclical/stated reason).

---

## Sources Checked but Not Relevant or Not Within 7-Day Window

- **Census BTOS April 9, 2026** (https://www.census.gov/newsroom/press-releases/2026/btos-apr-9.html): Routine biweekly data release. Confirmed AI questions added November 17, 2025, will be published in Spring 2026. No new AI-specific quantitative statistics available in this release.

- **Forbes / Challenger, Gray & Christmas — March Layoff Report** (https://www.forbes.com/sites/maryroeloffs/2026/04/02/ai-blamed-heavily-for-march-job-cuts-report-says/): Published April 2, 2026 — **one day before the 7-day window**. Key stat: 60,620 US job cuts in March; AI cited as leading reason in 25% of announcements; tech sector led with 18,720 cuts. Recommend ingesting in next digest or noting as immediate context.

- **Brookings Institution / NBER — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement"** (https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/): Published January 21, 2026. Outside the 7-day window but contains the week's most policy-relevant US-specific figures (6.1 million workers with high AI exposure + low adaptive capacity; 86% are women). Already known to digest editors; recommend confirming ingestion status.

- **NBER Working Paper 34859 — "Chaining Tasks, Redefining Work: A Theory of AI Automation"** (https://www.nber.org/papers/w34859): Issue Date February 2026. Theoretical framework paper; no new empirical statistics directly mappable to graphs.

- **IMF Staff Discussion Note SDN/2026/001 — "New Jobs Creation in the AI Age"** (https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf): January 2026. Outside window. Key finding: employment in AI-vulnerable occupations is 3.6% lower after five years in high AI-skill-demand regions (relevant to `workforce-ai-exposure`). Previously published, recommend confirming ingestion.

- **WEF — "Four Futures for Jobs in the New Economy: AI and Talent in 2030"** (https://reports.weforum.org/docs/WEF_Four_Futures_for_Jobs_in_the_New_Economy_AI_and_Talent_in_2030_2025.pdf): 2025 report. Outside window; scenario-based framework only, no new empirical data.

- **theworlddata.com, almcorp.com, designrush.com, click-vision.com**: Tier 4 aggregators. No original data; all statistics traced back to previously known sources (Goldman Sachs, McKinsey, WEF). Not ingested.

- **ScienceDirect — "Artificial intelligence, tasks, skills, and wages: Worker-level evidence from Germany"** (https://www.sciencedirect.com/science/article/pii/S0048733325001143): German labor market data; global stat → overlay-only; outside 7-day window; not US-specific.

- **Business Insider — "Former Salesforce AI CEO Warns AI May Quietly Push Wages Down"** (https://www.businessinsider.com/ai-could-lower-wages-not-just-eliminate-jobs-3-2026): March 2026. Outside window. Contains interesting Brookings "intelligence saturation" tipping point thesis (37% automation triggers wage reversal; 14% already automated), but this is a model projection, not empirical measurement.

- **Washington Post — "AI job losses: Look up which workers are most vulnerable"** (https://www.washingtonpost.com/technology/interactive/2026/jobs-most-affected-ai-automation/): Published 2026 (no specific date found); primarily qualitative interactive. No new quantitative stats.

---

## Priority Recommendations

### Ingest Immediately
1. **Federal Reserve FEDS Note (April 3, 2026)** — Tier 1. The 18% BTOS firm adoption rate is a direct DATA_POINT for the `ai-adoption-rate` graph and the most authoritative US government measure available. The 41% GenAI work adoption figure from the RPS is a confirmed DATA_POINT for `genai-work-adoption`. Both should be updated in graphs immediately. The SBU's 78% employment-weighted figure should be added as an overlay context line.

2. **Goldman Sachs "16,000 jobs/month" note (April 6–7, 2026)** — Tier 2. The net monthly job loss figure (−16,000/month) and the entry-level wage gap widening (−3.3 pp per SD of AI substitution) are among the most specific quantitative estimates of AI's *current* labor market impact published to date. Flag for `total-us-jobs-lost` and `entry-level-wage-impact` overlays.

3. **Goldman Sachs "Scarring" note (April 7, 2026)** — Tier 2. The 10-year real earnings impact (−10 pp) for technology-displaced workers, derived from BLS National Longitudinal Surveys, is historically grounded and directionally important for `median-wage-impact`. The recession multiplier (+5 pp joblessness risk) is acutely timely given current tariff-related economic uncertainty.

### Statistics That Diverge from Current Graph Consensus
- **AI firm adoption rate (18%)** is notably lower than some widely-cited industry surveys (e.g., McKinsey's ~72%, Deloitte's ~66%) — the Fed note explains this gap clearly (firm-level BTOS vs. employment-weighted measures). Graphs currently using higher adoption figures should include methodology caveats.
- **16,000 net jobs/month lost** is more granular and current than most prior estimates. If annualized (~192,000/year), this is modest relative to a 170M-person labor force, but the *entry-level concentration* makes it disproportionately visible in hiring freezes and youth unemployment.
- **Tech sector layoffs (47.9% AI-attributed in Q1 2026)** is a striking headline but requires caution given self-reported attribution. The Challenger data (outside window, April 2) showing 25% AI attribution across all sectors is a better-controlled measure.

### Watch for Spring 2026
- **Census Bureau BTOS AI questions** — confirmed for Spring 2026 publication. This will provide the first official government data from the revised (November 2025) AI question wording covering firm AI use "in any business function." Will be a major DATA_POINT update for `ai-adoption-rate`.
- **NBER Volume on "Economics of Transformative AI"** — the Brookings/GovAI adaptive capacity paper (Manning & Aguirre) is a chapter in this forthcoming NBER volume. Full publication may trigger additional coverage and citation.