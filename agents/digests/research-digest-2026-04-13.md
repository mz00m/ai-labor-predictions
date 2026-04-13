1	# AI Labor Research Digest — 2026-04-13
2	
3	## Summary
4	
5	Three new sources with quantitative AI labor statistics were confirmed within the April 6–13, 2026 window: two Goldman Sachs research notes (one on current monthly job displacement, one on long-run earnings scarring) covered by Fortune and CNN, and a Fortune exclusive interview with Anthropic's economics chief on observed vs. theoretical AI task exposure. No Tier 1 peer-reviewed or government statistical releases with new AI labor data fell within the window, though a highly relevant Federal Reserve FEDS Note (April 3) and a Challenger, Gray & Christmas monthly layoff report (April 2) fell just outside the seven-day cutoff and are flagged for ingestion. The dominant story this week is Goldman Sachs attempting to quantify, for the first time in granular terms, AI's net monthly job effect: −16,000 net U.S. jobs/month (−25,000 from substitution, +9,000 from augmentation), with Gen Z and entry-level workers bearing the heaviest burden.
6	
7	---
8	
9	## New Sources
10	
11	---
12	
13	### Goldman Sachs U.S. Daily — AI Substitution vs. Augmentation (via Fortune)
14	- **Publisher:** Goldman Sachs (primary research note by Elsie Peng); covered by Fortune
15	- **Date:** 2026-04-06
16	- **URL:** https://fortune.com/2026/04/06/ai-tech-displacement-effect-gen-z-16000-jobs-per-month/
17	- **Evidence Tier:** 2 (Major financial institution / investment bank research — Goldman Sachs)
18	- **Source ID:** goldman-sachs-displacement-2026
19	
20	**Statistics:**
21	
22	1. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
23	   **Type:** OVERLAY (down)
24	   **Value:** −16,000 net jobs/month (U.S.)
25	   **Quote:** "New research by Goldman Sachs economists finds that AI is already a measurable drag on the U.S. job market—erasing roughly 16,000 net jobs per month over the past year, with the pain falling hardest on Gen Z and entry-level workers."
26	   **Mapping note:** Unit is jobs/month, not "% of US labor force." Cannot place as a data_point on this graph (which uses % of labor force by 2030); classified as overlay. Direction: down (ongoing drag on employment).
27	
28	2. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
29	   **Type:** OVERLAY (down)
30	   **Value:** −25,000 jobs/month (substitution); +9,000 jobs/month (augmentation)
31	   **Quote:** "Goldman's breakdown shows AI substitution wiped out roughly 25,000 jobs per month in the past year, while augmentation added back about 9,000."
32	   **Mapping note:** Provides the gross decomposition underlying stat #1. Overlay only; no percent-of-labor-force anchor.
33	
34	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
35	   **Type:** OVERLAY (down)
36	   **Value:** −3.3 percentage points per 1 SD increase in AI substitution exposure (entry-level vs. experienced wage gap)
37	   **Quote:** "The wage gap has similarly deteriorated, with Goldman's regression analysis estimating that a one standard-deviation increase in AI substitution exposure widens the entry-level-to-experienced wage gap by roughly 3.3 percentage points."
38	   **Mapping note:** Directionally negative for entry-level wages but expressed as a regression coefficient per SD, not a direct % wage change by 2030. Overlay only.
39	
40	---
41	
42	### Goldman Sachs Research Note — Long-Run Scarring from AI Job Displacement (via CNN)
43	- **Publisher:** Goldman Sachs (research note by Pierfrancesco Mei and Jessica Rindels); covered by CNN
44	- **Date:** 2026-04-07
45	- **URL:** https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects
46	- **Evidence Tier:** 2 (Major financial institution research — Goldman Sachs)
47	- **Source ID:** goldman-sachs-scarring-2026
48	
49	**Statistics:**
50	
51	1. **Graph:** Median Wage Impact (`median-wage-impact`)
52	   **Type:** OVERLAY (down)
53	   **Value:** −10 percentage points (real earnings 10 years after technology-driven displacement)
54	   **Quote:** "Long-lasting impacts: 10 years after a job loss, technology-displaced workers' real earnings were 10 percentage points below that of non-displaced workers."
55	   **Mapping note:** This measures the long-run wage scar for displaced workers specifically, not for the median worker overall. However it is the strongest signal available on `median-wage-impact`'s downside scenario. Classified as overlay (not data_point) because the unit is displacement-conditional earnings gap, not the median wage forecast itself.
56	
57	2. **Graph:** Median Wage Impact (`median-wage-impact`)
58	   **Type:** OVERLAY (down)
59	   **Value:** −3% real earnings (short-run, vs. negligible for non-displaced)
60	   **Quote:** "Short-run impacts: It can take one month longer for technology-displaced workers to find a new job; and their inflation-adjusted earnings take bigger hits (more than 3%) versus other workers (negligible effect)."
61	   **Mapping note:** Short-run displacement wage effect. Overlay only; not a median-worker-level forecast.
62	
63	3. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
64	   **Type:** OVERLAY (up)
65	   **Value:** +5 percentage points (likelihood of subsequent joblessness when displacement coincides with recession)
66	   **Quote:** "Recessions worsen outcomes: The effects of technology-related displacements are amplified (by three weeks of additional unemployment and a 5-percentage-point likelihood of subsequent joblessness)."
67	   **Mapping note:** Overlay on displacement severity, not a count of displaced workers. Direction "up" = upward pressure on joblessness risk.
68	
69	4. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
70	   **Type:** OVERLAY (neutral)
71	   **Value:** 6–7% of US workers (≈11 million)
72	   **Quote:** "Goldman Sachs previously estimated that 6% to 7% of US workers (about 11 million people) could have their jobs displaced by AI."
73	   **Mapping note:** This is Goldman's existing long-run displacement estimate (not new this week; cited for context in the CNN article). Mapped as overlay-neutral because it is a previously published projection, not new quantitative evidence.
74	
75	---
76	
77	### Fortune / Anthropic — Observed vs. Theoretical AI Task Exposure (McCrory Interview)
78	- **Publisher:** Fortune (interview with Peter McCrory, Head of Economics, Anthropic)
79	- **Date:** 2026-04-07
80	- **URL:** https://fortune.com/2026/04/07/anthropic-economics-chief-peter-mccrory-jobs-killed-by-ai/
81	- **Evidence Tier:** 3 (Major news/trade publication — Fortune, with primary source being Anthropic's own Economic Index data)
82	- **Source ID:** anthropic-mcccrory-exposure-2026
83	
84	**Statistics:**
85	
86	1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
87	   **Type:** OVERLAY (down)
88	   **Value:** 94% theoretical exposure vs. ~30% observed/actual adoption for coding tasks
89	   **Quote:** "I was somewhat surprised that the gap between sort of coding in general, which as we point out had something like 94% theoretical exposure, but then based on actual adoption, it was closer to 30% of the tasks across all the jobs in that pocket of the economy."
90	   **Mapping note:** This is about the gap between theoretical and observed exposure for tech/coding roles — a strong downward signal on displacement timelines. "94% theoretical" ≠ "94% displaced," but is illustrative of the ceiling; "30% actual" is the operative current figure for tasks actually automated in practice. Classified as overlay-down on `tech-sector-displacement` (actual current AI penetration is far below what theoretical exposure models imply). Not a data_point because unit is "% of tasks automated in coding roles" not "% of tech jobs displaced."
91	
92	---
93	
94	## Near-Miss Sources (Published 3–6 Days Before Window; Flagged as Important)
95	
96	### Federal Reserve FEDS Note — "Monitoring AI Adoption in the U.S. Economy"
97	- **Publisher:** Federal Reserve Board of Governors (author: Jeffrey S. Allen)
98	- **Date:** 2026-04-03 *(3 days before the April 6 cutoff — flagged for ingestion)*
99	- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
100	- **Evidence Tier:** 1 (U.S. Federal Reserve Board staff analysis, drawing on Census BTOS, Real-Time Population Survey, and Atlanta Fed Survey of Business Uncertainty)
101	- **Source ID:** fed-ai-adoption-monitoring-2026
102	
103	**Statistics (near-miss; recommend ingesting):**
104	
105	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
106	   **Type:** DATA_POINT
107	   **Value:** 18% of U.S. firms (BTOS, end of 2025, 4-period moving average)
108	   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025. Prior to the question revision, the adoption rate had grown by 68 percent (3.9 percentage points) over the prior year but decelerated in Q2 2025."
109	   **Mapping note:** BTOS is exactly the data series mapped to this graph. Strong data_point candidate; the question wording changed in November 2025 (broadened from "producing goods or services" to "any business function"), so the 18% figure reflects the new, broader definition.
110	
111	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
112	   **Type:** DATA_POINT
113	   **Value:** 41% of the U.S. workforce (Real-Time Population Survey, November 2025)
114	   **Quote:** "The right panel of figure 2 shows that work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025. These metrics grew by about 31 percent (9.7 percentage points) and 26 percent (10.4 percentage points), respectively, for the year ending in November."
115	   **Mapping note:** RPS is the nationally representative individual-level survey for GenAI work adoption — direct match to this graph's intended series.
116	
117	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
118	   **Type:** OVERLAY (up)
119	   **Value:** >20% of firms (planned adoption, first half 2026)
120	   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
121	   **Mapping note:** Forward-looking indicator from BTOS planned-adoption data, suggests imminent upward revision to the current 18% data_point.
122	
123	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
124	   **Type:** OVERLAY (up)
125	   **Value:** 78% of U.S. labor force works at firms that have adopted AI (Survey of Business Uncertainty, employment-weighted, November 2025)
126	   **Quote:** "The SBU estimates an employment-weighted firm AI adoption rate of around 78 percent and an LLM adoption rate of about 54 percent. In this context, employment weighting approximates the share of the labor force working at firms that have adopted AI."
127	   **Mapping note:** The 78% figure represents exposure at the firm level (working at an AI-adopting firm), not individual use or individual job-level AI exposure. It is an upper-bound estimate and overlays the `workforce-ai-exposure` graph (direction: up, i.e., much of the workforce is now at AI-using firms even if individual-level exposure is lower).
128	
129	---
130	
131	### Forbes / Challenger, Gray & Christmas — March 2026 Job Cuts
132	- **Publisher:** Forbes (reporting on Challenger, Gray & Christmas monthly layoff report)
133	- **Date:** 2026-04-02 *(4 days before the April 6 cutoff — flagged for ingestion)*
134	- **URL:** https://www.forbes.com/sites/maryroeloffs/2026/04/02/ai-blamed-heavily-for-march-job-cuts-report-says/
135	- **Evidence Tier:** 3 (Major news, Forbes; underlying data from Challenger, Gray & Christmas — a specialized labor market tracking firm)
136	- **Source ID:** challenger-march-layoffs-2026
137	
138	**Statistics (near-miss):**
139	
140	1. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
141	   **Type:** OVERLAY (up)
142	   **Value:** AI cited as the reason in 25% of job-cut announcements (60,620 total cuts in March 2026)
143	   **Quote:** "U.S.-based employers announced 60,620 job cuts in March, according to Challenger, up 25% from 48,307 cuts announced in February. AI was the leading reason for cutting jobs, cited in 25% of announcements, followed by closings, restructuring and economic conditions."
144	   **Mapping note:** This is the leading reason for self-reported job-cut attributions. "Cited in announcements" ≠ actual confirmed AI-caused displacement, but it is a directional signal. Overlay-up.
145	
146	---
147	
148	## Sources Checked but Not Relevant to the Past 7 Days
149	
150	The following sources were retrieved and evaluated but were either (a) outside the April 6–13 window without meeting the "clearly important, possibly missed" threshold, (b) aggregator/blog posts without original quantitative claims, or (c) lacked sufficiently rigorous sourcing to warrant extraction:
151	
152	- **Brookings Institution** — "Measuring US workers' capacity to adapt to AI-driven job displacement" (January 21, 2026): High-quality Tier 2 source with strong data (3.9% of workers at high-exposure/low-adaptive-capacity intersection = ~6.1M workers; 86% are women), but published well outside the window and covered in earlier digests.
153	- **NBER Working Paper 34859** — "Chaining Tasks, Redefining Work: A Theory of AI Automation" (February 2026): Theoretical modeling paper, no new labor displacement statistics.
154	- **Census BTOS April 9, 2026 release** (https://www.census.gov/newsroom/press-releases/2026/btos-apr-9.html): Biweekly data release confirmed in-window (April 9), but AI-specific BTOS questions "will be released in Spring 2026" — not yet included in this data drop. No AI statistics in this release.
155	- **Federal Reserve FEDS Note** — "Monitoring AI Adoption in the U.S. Economy" (April 3, 2026): Published 3 days before the window; promoted to near-miss section above due to Tier 1 quality and direct relevance to `ai-adoption-rate` and `genai-work-adoption` graphs.
156	- **ILO** — "Generative AI and Jobs: A 2025 Update" (2025): Published in 2025, outside window.
157	- **IMF Staff Discussion Note SDN/2026/001** — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age" (2026): Confirmed 2026 publication but specific release date not verifiable as within the April 6–13 window; no new US-specific labor displacement statistics.
158	- **Business Insider** — "Former Salesforce AI CEO Warns AI May Quietly Push Wages Down" (March 2026): Published March 2026, outside window.
159	- **ScienceDirect / Research Policy** — "Artificial intelligence, tasks, skills, and wages: Worker-level evidence from Germany" (2025): Germany-only data, outside window.
160	- **theworlddata.com, almcorp.com, designrush.com, ibuidl.org, click-vision.com, sqmagazine.co.uk**: All Tier 4 aggregators. No original quantitative research; recycle statistics from WEF, Goldman Sachs, McKinsey without new primary data.
161	- **Washington Post interactive** — "AI job losses: Look up which workers are most vulnerable" (2026, exact date unclear): Page inaccessible; no statistics extracted.
162	- **Thomson Reuters Institute** — "2026 AI in Professional Services Report": Published March/April 2026 (exact date unclear from search results); reports 40% organization-wide AI usage in professional services (up from 22% in 2025), but no new US-specific labor displacement statistics that directly map to site graphs. Consider for next digest if published date confirmed within window.
163	
164	---
165	
166	## Priority Recommendations
167	
168	### Tier 1 Sources to Ingest Immediately
169	1. **Federal Reserve FEDS Note, April 3, 2026** — Ingest now despite being 3 days before the window. This is the most authoritative synthesis of AI adoption data available, directly feeding the `ai-adoption-rate` (18% BTOS) and `genai-work-adoption` (41% RPS) graphs with the most current figures from government-linked surveys. The year-on-year 31% growth in work GenAI adoption (9.7 pp increase to 41%) is a significant upward move in that series.
170	
171	### Statistics That Diverge Significantly from Graph Consensus
172	2. **Goldman Sachs net job loss figure (−16,000/month)**: The Goldman Sachs regression-based estimate of −16,000 net US jobs per month from AI is the first major attempt by a Tier 2 institution to quantify a *current, empirical* monthly job loss figure rather than a long-run projection. It is far lower than many headline projections (which count millions displaced over years), but it is based on regression analysis of existing labor data rather than direct AI attribution. It should be treated with caution (Goldman itself notes it does not capture AI infrastructure job creation). Direction consistent with `total-us-jobs-lost` graphs trending down but at a slow rate.
173	
174	3. **Anthropic data: only ~30% actual vs. 94% theoretical exposure in coding**: The large gap between theoretical AI task exposure and actual observed usage (94% → 30% for coding) is a significant downside signal for near-term `tech-sector-displacement` projections that rely on theoretical exposure scores. Policymakers and analysts using exposure-based projections may be substantially overestimating current-state displacement velocity.
175	
176	4. **Goldman Sachs wage scarring: −10 pp real earnings 10 years post-displacement**: This is the strongest long-run wage effect estimate seen in recent weeks and overlays `median-wage-impact` with a meaningful downside signal. However, it applies only to displaced workers (a subset), not all workers — so direct translation to median wage forecasts requires caution.
177	
178	### New Government Data Releases
179	5. **Census BTOS AI Questions (expected Spring 2026)**: The Census Bureau's April 9, 2026 BTOS release confirms that new AI-specific questions (added November 17, 2025) "will be released in Spring 2026." This will be a Tier 1 data release directly feeding the `ai-adoption-rate` graph. Monitor the Census BTOS data portal (https://www.census.gov/hfp/btos/data_downloads) for the AI module release — expected within the next 4–8 weeks.
180	
181	6. **IMF SDN/2026/001 — "Bridging Skill Gaps"**: Confirm publication date. If within the past 30 days, this contains Tier 2 statistics on skill gaps, wage premiums for new skills (3% wage premium for job postings with new skills in the US; up to 8.5% for postings with 4+ new skills), and a Skill Readiness Index with country-level rankings. These would map to `high-skill-wage-premium` and `genai-work-adoption` as overlays.
# AI Labor Research Digest — 2026-04-13

## Summary

Three new sources with quantitative AI labor statistics were confirmed within the April 6–13, 2026 window: two Goldman Sachs research notes (one on current monthly job displacement, one on long-run earnings scarring) covered by Fortune and CNN, and a Fortune exclusive interview with Anthropic's economics chief on observed vs. theoretical AI task exposure. No Tier 1 peer-reviewed or government statistical releases with new AI labor data fell within the window, though a highly relevant Federal Reserve FEDS Note (April 3) and a Challenger, Gray & Christmas monthly layoff report (April 2) fell just outside the seven-day cutoff and are flagged for ingestion. The dominant story this week is Goldman Sachs attempting to quantify, for the first time in granular terms, AI's net monthly job effect: −16,000 net U.S. jobs/month (−25,000 from substitution, +9,000 from augmentation), with Gen Z and entry-level workers bearing the heaviest burden.

---

## New Sources

---

### Goldman Sachs U.S. Daily — AI Substitution vs. Augmentation (via Fortune)
- **Publisher:** Goldman Sachs (primary research note by Elsie Peng); covered by Fortune
- **Date:** 2026-04-06
- **URL:** https://fortune.com/2026/04/06/ai-tech-displacement-effect-gen-z-16000-jobs-per-month/
- **Evidence Tier:** 2 (Major financial institution / investment bank research — Goldman Sachs)
- **Source ID:** goldman-sachs-displacement-2026

**Statistics:**

1. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
   **Type:** OVERLAY (down)
   **Value:** −16,000 net jobs/month (U.S.)
   **Quote:** "New research by Goldman Sachs economists finds that AI is already a measurable drag on the U.S. job market—erasing roughly 16,000 net jobs per month over the past year, with the pain falling hardest on Gen Z and entry-level workers."
   **Mapping note:** Unit is jobs/month, not "% of US labor force." Cannot place as a data_point on this graph (which uses % of labor force by 2030); classified as overlay. Direction: down (ongoing drag on employment).

2. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
   **Type:** OVERLAY (down)
   **Value:** −25,000 jobs/month (substitution); +9,000 jobs/month (augmentation)
   **Quote:** "Goldman's breakdown shows AI substitution wiped out roughly 25,000 jobs per month in the past year, while augmentation added back about 9,000."
   **Mapping note:** Provides the gross decomposition underlying stat #1. Overlay only; no percent-of-labor-force anchor.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −3.3 percentage points per 1 SD increase in AI substitution exposure (entry-level vs. experienced wage gap)
   **Quote:** "The wage gap has similarly deteriorated, with Goldman's regression analysis estimating that a one standard-deviation increase in AI substitution exposure widens the entry-level-to-experienced wage gap by roughly 3.3 percentage points."
   **Mapping note:** Directionally negative for entry-level wages but expressed as a regression coefficient per SD, not a direct % wage change by 2030. Overlay only.

---

### Goldman Sachs Research Note — Long-Run Scarring from AI Job Displacement (via CNN)
- **Publisher:** Goldman Sachs (research note by Pierfrancesco Mei and Jessica Rindels); covered by CNN
- **Date:** 2026-04-07
- **URL:** https://www.cnn.com/2026/04/07/economy/ai-job-losses-long-term-effects
- **Evidence Tier:** 2 (Major financial institution research — Goldman Sachs)
- **Source ID:** goldman-sachs-scarring-2026

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −10 percentage points (real earnings 10 years after technology-driven displacement)
   **Quote:** "Long-lasting impacts: 10 years after a job loss, technology-displaced workers' real earnings were 10 percentage points below that of non-displaced workers."
   **Mapping note:** This measures the long-run wage scar for displaced workers specifically, not for the median worker overall. However it is the strongest signal available on `median-wage-impact`'s downside scenario. Classified as overlay (not data_point) because the unit is displacement-conditional earnings gap, not the median wage forecast itself.

2. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −3% real earnings (short-run, vs. negligible for non-displaced)
   **Quote:** "Short-run impacts: It can take one month longer for technology-displaced workers to find a new job; and their inflation-adjusted earnings take bigger hits (more than 3%) versus other workers (negligible effect)."
   **Mapping note:** Short-run displacement wage effect. Overlay only; not a median-worker-level forecast.

3. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
   **Type:** OVERLAY (up)
   **Value:** +5 percentage points (likelihood of subsequent joblessness when displacement coincides with recession)
   **Quote:** "Recessions worsen outcomes: The effects of technology-related displacements are amplified (by three weeks of additional unemployment and a 5-percentage-point likelihood of subsequent joblessness)."
   **Mapping note:** Overlay on displacement severity, not a count of displaced workers. Direction "up" = upward pressure on joblessness risk.

4. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
   **Type:** OVERLAY (neutral)
   **Value:** 6–7% of US workers (≈11 million)
   **Quote:** "Goldman Sachs previously estimated that 6% to 7% of US workers (about 11 million people) could have their jobs displaced by AI."
   **Mapping note:** This is Goldman's existing long-run displacement estimate (not new this week; cited for context in the CNN article). Mapped as overlay-neutral because it is a previously published projection, not new quantitative evidence.

---

### Fortune / Anthropic — Observed vs. Theoretical AI Task Exposure (McCrory Interview)
- **Publisher:** Fortune (interview with Peter McCrory, Head of Economics, Anthropic)
- **Date:** 2026-04-07
- **URL:** https://fortune.com/2026/04/07/anthropic-economics-chief-peter-mccrory-jobs-killed-by-ai/
- **Evidence Tier:** 3 (Major news/trade publication — Fortune, with primary source being Anthropic's own Economic Index data)
- **Source ID:** anthropic-mcccrory-exposure-2026

**Statistics:**

1. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 94% theoretical exposure vs. ~30% observed/actual adoption for coding tasks
   **Quote:** "I was somewhat surprised that the gap between sort of coding in general, which as we point out had something like 94% theoretical exposure, but then based on actual adoption, it was closer to 30% of the tasks across all the jobs in that pocket of the economy."
   **Mapping note:** This is about the gap between theoretical and observed exposure for tech/coding roles — a strong downward signal on displacement timelines. "94% theoretical" ≠ "94% displaced," but is illustrative of the ceiling; "30% actual" is the operative current figure for tasks actually automated in practice. Classified as overlay-down on `tech-sector-displacement` (actual current AI penetration is far below what theoretical exposure models imply). Not a data_point because unit is "% of tasks automated in coding roles" not "% of tech jobs displaced."

---

## Near-Miss Sources (Published 3–6 Days Before Window; Flagged as Important)

### Federal Reserve FEDS Note — "Monitoring AI Adoption in the U.S. Economy"
- **Publisher:** Federal Reserve Board of Governors (author: Jeffrey S. Allen)
- **Date:** 2026-04-03 *(3 days before the April 6 cutoff — flagged for ingestion)*
- **URL:** https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html
- **Evidence Tier:** 1 (U.S. Federal Reserve Board staff analysis, drawing on Census BTOS, Real-Time Population Survey, and Atlanta Fed Survey of Business Uncertainty)
- **Source ID:** fed-ai-adoption-monitoring-2026

**Statistics (near-miss; recommend ingesting):**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18% of U.S. firms (BTOS, end of 2025, 4-period moving average)
   **Quote:** "Adoption stood at about 18 percent of firms at the end of 2025. Prior to the question revision, the adoption rate had grown by 68 percent (3.9 percentage points) over the prior year but decelerated in Q2 2025."
   **Mapping note:** BTOS is exactly the data series mapped to this graph. Strong data_point candidate; the question wording changed in November 2025 (broadened from "producing goods or services" to "any business function"), so the 18% figure reflects the new, broader definition.

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 41% of the U.S. workforce (Real-Time Population Survey, November 2025)
   **Quote:** "The right panel of figure 2 shows that work-related GenAI adoption reported in the RPS stands at about 41 percent of the workforce, and non-work-related usage at about 50 percent of the population as of the latest survey in November 2025. These metrics grew by about 31 percent (9.7 percentage points) and 26 percent (10.4 percentage points), respectively, for the year ending in November."
   **Mapping note:** RPS is the nationally representative individual-level survey for GenAI work adoption — direct match to this graph's intended series.

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** >20% of firms (planned adoption, first half 2026)
   **Quote:** "Over 20 percent of firms expect to use AI in the first half of 2026."
   **Mapping note:** Forward-looking indicator from BTOS planned-adoption data, suggests imminent upward revision to the current 18% data_point.

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 78% of U.S. labor force works at firms that have adopted AI (Survey of Business Uncertainty, employment-weighted, November 2025)
   **Quote:** "The SBU estimates an employment-weighted firm AI adoption rate of around 78 percent and an LLM adoption rate of about 54 percent. In this context, employment weighting approximates the share of the labor force working at firms that have adopted AI."
   **Mapping note:** The 78% figure represents exposure at the firm level (working at an AI-adopting firm), not individual use or individual job-level AI exposure. It is an upper-bound estimate and overlays the `workforce-ai-exposure` graph (direction: up, i.e., much of the workforce is now at AI-using firms even if individual-level exposure is lower).

---

### Forbes / Challenger, Gray & Christmas — March 2026 Job Cuts
- **Publisher:** Forbes (reporting on Challenger, Gray & Christmas monthly layoff report)
- **Date:** 2026-04-02 *(4 days before the April 6 cutoff — flagged for ingestion)*
- **URL:** https://www.forbes.com/sites/maryroeloffs/2026/04/02/ai-blamed-heavily-for-march-job-cuts-report-says/
- **Evidence Tier:** 3 (Major news, Forbes; underlying data from Challenger, Gray & Christmas — a specialized labor market tracking firm)
- **Source ID:** challenger-march-layoffs-2026

**Statistics (near-miss):**

1. **Graph:** Total U.S. Jobs Lost to AI (`total-us-jobs-lost`)
   **Type:** OVERLAY (up)
   **Value:** AI cited as the reason in 25% of job-cut announcements (60,620 total cuts in March 2026)
   **Quote:** "U.S.-based employers announced 60,620 job cuts in March, according to Challenger, up 25% from 48,307 cuts announced in February. AI was the leading reason for cutting jobs, cited in 25% of announcements, followed by closings, restructuring and economic conditions."
   **Mapping note:** This is the leading reason for self-reported job-cut attributions. "Cited in announcements" ≠ actual confirmed AI-caused displacement, but it is a directional signal. Overlay-up.

---

## Sources Checked but Not Relevant to the Past 7 Days

The following sources were retrieved and evaluated but were either (a) outside the April 6–13 window without meeting the "clearly important, possibly missed" threshold, (b) aggregator/blog posts without original quantitative claims, or (c) lacked sufficiently rigorous sourcing to warrant extraction:

- **Brookings Institution** — "Measuring US workers' capacity to adapt to AI-driven job displacement" (January 21, 2026): High-quality Tier 2 source with strong data (3.9% of workers at high-exposure/low-adaptive-capacity intersection = ~6.1M workers; 86% are women), but published well outside the window and covered in earlier digests.
- **NBER Working Paper 34859** — "Chaining Tasks, Redefining Work: A Theory of AI Automation" (February 2026): Theoretical modeling paper, no new labor displacement statistics.
- **Census BTOS April 9, 2026 release** (https://www.census.gov/newsroom/press-releases/2026/btos-apr-9.html): Biweekly data release confirmed in-window (April 9), but AI-specific BTOS questions "will be released in Spring 2026" — not yet included in this data drop. No AI statistics in this release.
- **Federal Reserve FEDS Note** — "Monitoring AI Adoption in the U.S. Economy" (April 3, 2026): Published 3 days before the window; promoted to near-miss section above due to Tier 1 quality and direct relevance to `ai-adoption-rate` and `genai-work-adoption` graphs.
- **ILO** — "Generative AI and Jobs: A 2025 Update" (2025): Published in 2025, outside window.
- **IMF Staff Discussion Note SDN/2026/001** — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age" (2026): Confirmed 2026 publication but specific release date not verifiable as within the April 6–13 window; no new US-specific labor displacement statistics.
- **Business Insider** — "Former Salesforce AI CEO Warns AI May Quietly Push Wages Down" (March 2026): Published March 2026, outside window.
- **ScienceDirect / Research Policy** — "Artificial intelligence, tasks, skills, and wages: Worker-level evidence from Germany" (2025): Germany-only data, outside window.
- **theworlddata.com, almcorp.com, designrush.com, ibuidl.org, click-vision.com, sqmagazine.co.uk**: All Tier 4 aggregators. No original quantitative research; recycle statistics from WEF, Goldman Sachs, McKinsey without new primary data.
- **Washington Post interactive** — "AI job losses: Look up which workers are most vulnerable" (2026, exact date unclear): Page inaccessible; no statistics extracted.
- **Thomson Reuters Institute** — "2026 AI in Professional Services Report": Published March/April 2026 (exact date unclear from search results); reports 40% organization-wide AI usage in professional services (up from 22% in 2025), but no new US-specific labor displacement statistics that directly map to site graphs. Consider for next digest if published date confirmed within window.

---

## Priority Recommendations

### Tier 1 Sources to Ingest Immediately
1. **Federal Reserve FEDS Note, April 3, 2026** — Ingest now despite being 3 days before the window. This is the most authoritative synthesis of AI adoption data available, directly feeding the `ai-adoption-rate` (18% BTOS) and `genai-work-adoption` (41% RPS) graphs with the most current figures from government-linked surveys. The year-on-year 31% growth in work GenAI adoption (9.7 pp increase to 41%) is a significant upward move in that series.

### Statistics That Diverge Significantly from Graph Consensus
2. **Goldman Sachs net job loss figure (−16,000/month)**: The Goldman Sachs regression-based estimate of −16,000 net US jobs per month from AI is the first major attempt by a Tier 2 institution to quantify a *current, empirical* monthly job loss figure rather than a long-run projection. It is far lower than many headline projections (which count millions displaced over years), but it is based on regression analysis of existing labor data rather than direct AI attribution. It should be treated with caution (Goldman itself notes it does not capture AI infrastructure job creation). Direction consistent with `total-us-jobs-lost` graphs trending down but at a slow rate.

3. **Anthropic data: only ~30% actual vs. 94% theoretical exposure in coding**: The large gap between theoretical AI task exposure and actual observed usage (94% → 30% for coding) is a significant downside signal for near-term `tech-sector-displacement` projections that rely on theoretical exposure scores. Policymakers and analysts using exposure-based projections may be substantially overestimating current-state displacement velocity.

4. **Goldman Sachs wage scarring: −10 pp real earnings 10 years post-displacement**: This is the strongest long-run wage effect estimate seen in recent weeks and overlays `median-wage-impact` with a meaningful downside signal. However, it applies only to displaced workers (a subset), not all workers — so direct translation to median wage forecasts requires caution.

### New Government Data Releases
5. **Census BTOS AI Questions (expected Spring 2026)**: The Census Bureau's April 9, 2026 BTOS release confirms that new AI-specific questions (added November 17, 2025) "will be released in Spring 2026." This will be a Tier 1 data release directly feeding the `ai-adoption-rate` graph. Monitor the Census BTOS data portal (https://www.census.gov/hfp/btos/data_downloads) for the AI module release — expected within the next 4–8 weeks.

6. **IMF SDN/2026/001 — "Bridging Skill Gaps"**: Confirm publication date. If within the past 30 days, this contains Tier 2 statistics on skill gaps, wage premiums for new skills (3% wage premium for job postings with new skills in the US; up to 8.5% for postings with 4+ new skills), and a Skill Readiness Index with country-level rankings. These would map to `high-skill-wage-premium` and `genai-work-adoption` as overlays.