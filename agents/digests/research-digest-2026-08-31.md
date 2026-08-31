1	# AI Labor Research Digest — 2026-08-31
2	
3	## Summary
4	
5	Four sources with direct labor-market statistics were identified for the period August 24–31, 2026. The most important is a **Tier 1 government release**: the BLS Employment Projections 2025–35 (August 27), which projects office and administrative support occupations losing 752,100 jobs — the steepest decline of any major occupational group — and simultaneously debuts a new AI Exposure Categories data product for all detailed occupations. A **WATCHLIST** revision of the Stanford/ADP "Canaries in the Coal Mine" paper (Brynjolfsson et al., August 2026) updates its employment gap for young workers in AI-exposed roles to 19%, widened from 15% at the July 2025 vintage, using payroll data through June 2026. An Apollo Global Management whitepaper on wage compression (primary publication July 30, 2026; broad media coverage began August 22) finds a 6.7% real-wage-growth penalty in high-AI-exposure occupations with no detectable employment effect — a divergent finding relative to displacement-focused research that warrants flagging. A YouGov/sociologist survey (August 29) finds only ~3% of 1,250 U.S. workers self-report job loss due to AI since 2023. No Tier 1 studies documenting measured aggregate displacement were found this week; the dominant signal remains **wage suppression and entry-level hiring contraction**, not aggregate unemployment.
6	
7	---
8	
9	## Recurring Series Status
10	
11	The registry contains one tracked series:
12	
13	- **ellucian-highered-ai**: nextExpected 2027-03-01 — **not due this cycle. No sweep required.**
14	
15	> **Unregistered high-priority release noted:** BLS Employment Projections 2025–35 (USDL-26-1422, August 27, 2026) is an annual Tier 1 release not yet in the recurring-sources.json registry. It is the functional equivalent of the BLS employment projections series and should be added. See full entry below.
16	
17	---
18	
19	## New Sources
20	
21	---
22	
23	### BLS Employment Projections 2025–2035 + New AI Exposure Categories
24	- **Publisher:** U.S. Bureau of Labor Statistics (BLS)
25	- **Date:** 2026-08-27
26	- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf; AI exposure supplement: https://www.bls.gov/emp/publications/ai-exposure-categories.htm
27	- **Evidence Tier:** 1 (U.S. Government Statistics)
28	- **Source ID:** bls-employment-projections-2026
29	
30	**Context:** Annual BLS employment projections release (USDL-26-1422), projections horizon 2025–2035. For the first time, BLS simultaneously launched a supplemental "AI Exposure Categories" data product classifying all detailed occupations into four tiers based on five external theoretical and observed-exposure datasets. BLS explicitly notes the uncertainty: "Developments in AI are proceeding rapidly, and the uncertainty about potential impacts remains very high." Projections assume technological progress in line with historical patterns; departures from that assumption would alter results.
31	
32	**Statistics:**
33	
34	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
35	   **Type:** OVERLAY (down)
36	   **Value:** -4.0 % (projected employment change, office & administrative support occupational group, 2025–35)
37	   **Quote:** "This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."
38	   **Note:** Decline explicitly linked to AI: "the continued integration of automation tools, including those powered by AI, into workflows is likely to reduce demand for several office and administrative support occupations." Not a displacement % of all US jobs; classify as overlay.
39	
40	2. **Graph:** Customer Service Automation (`customer-service-automation`)
41	   **Type:** OVERLAY (down)
42	   **Value:** -1.4 % (projected employment change, sales and related occupational group, 2025–35)
43	   **Quote:** "Further growth of e-commerce and incorporation of AI tools into the sales process are expected to continue contributing to job loss in the sales and related occupational group (-1.4 percent)."
44	
45	3. **Graph:** Creative Industry Displacement (`creative-industry-displacement`)
46	   **Type:** OVERLAY (down)
47	   **Value:** +1.5 % (projected employment change, arts/design/entertainment/sports/media occupational group, 2025–35 — below total economy average of +3.5%)
48	   **Quote:** "The use of generative AI software, which can be leveraged to automate repetitive tasks and speed up certain processes, may limit demand for some jobs in the arts, design, entertainment, sports, and media occupational group."
49	   **Note:** Group is growing but at less than half the economy-wide rate; overlay signals suppression rather than absolute decline.
50	
51	4. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
52	   **Type:** OVERLAY (up)
53	   **Value:** +25.1 % (projected employment growth, computing infrastructure providers, data processing, web hosting, 2025–35)
54	   **Quote:** "Accelerated AI adoption is also expected to support employment growth in the computing infrastructure providers, data processing, web hosting, and related services industry. As a result, this industry is projected to grow 25.1 percent and add 120,400 new jobs over the projections period."
55	
56	5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
57	   **Type:** OVERLAY (neutral — new data infrastructure, not a % exposure figure)
58	   **Value:** N/A (categorical classification)
59	   **Quote:** "Alongside the 2025–35 projections, BLS is introducing a new data product that provides information about how occupations compare to one another based on their theoretical and observed exposure to artificial intelligence (AI)."
60	   **Note:** BLS combined five external datasets (Felten/Raj/Seamans; Eloundou et al.; Eisfeldt et al.; Anthropic Economic Index; one additional observed-usage source) to produce four high-level categories for every detailed occupation. Availability URL: https://www.bls.gov/emp/publications/ai-exposure-categories.htm. No aggregate %-exposed figure is published in the release itself; do not use as a data point.
61	
62	---
63	
64	### "Canaries in the Coal Mine?" — Revised August 2026
65	- **Publisher:** Stanford Digital Economy Lab
66	- **Date:** 2026-08 (exact day within August not stated; PDF URL path confirms August 2026)
67	- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/; PDF: https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
68	- **Evidence Tier:** 2 (Think tank / academic institution; ADP administrative payroll records for millions of workers; not peer-reviewed but large-N, high-quality data)
69	- **Source ID:** stanford-del-canaries-aug2026
70	- **WATCHLIST:** Erik Brynjolfsson (lastChecked 2026-04-14, 139 days overdue)
71	
72	**Context:** Revised version of the August 2025 "Canaries" paper; extends ADP payroll data through June 2026, adding 10+ months and new mechanistic analysis. Six documented facts; authors are explicit that these are descriptive (not causal) findings. The divergence has widened from 15% (July 2025 vintage) to 19% (June 2026). New in the revision: evidence that declines concentrate in "codified knowledge" occupations (tasks transferable via text and formal training), while employment is flat or rising among experienced workers in "tacit knowledge" roles.
73	
74	**Statistics:**
75	
76	1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
77	   **Type:** OVERLAY (down)
78	   **Value:** -19 % (relative employment gap: young workers ages 22–25 in AI-exposed occupations vs. less-exposed peers, as of June 2026)
79	   **Quote:** "Employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
80	   **Note:** Unit mismatch — this is a relative employment count gap, not a wage change %. However, it is the closest active graph to entry-level labor-market conditions. Classify as overlay, not data point. The authors document that "adjustment is occurring through employment rather than base compensation," meaning wages for those still employed have not declined — the compression is in hiring.
81	
82	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
83	   **Type:** OVERLAY (neutral)
84	   **Value:** 0 (no statistically significant economy-wide displacement detected)
85	   **Quote:** "(1) We find no evidence of widespread, economy-wide job displacement."
86	   **Note:** This is a counter-signal to pessimistic displacement forecasts. Use as a downward-moderating overlay.
87	
88	3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
89	   **Type:** OVERLAY (down)
90	   **Value:** -11 % (absolute employment level change, workers ages 22–25 in the two most AI-exposed quintiles, Nov 2022 – Jun 2026)
91	   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
92	   **Note:** The most exposed quintiles are dominated by tech and professional services occupations (software developers, customer service representatives explicitly mentioned). Overlay only — does not give a % of tech jobs displaced.
93	
94	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
95	   **Type:** OVERLAY (down)
96	   **Value:** -0.2 % (most AI-exposed occupations, year-over-year employment growth as of April 2026, all ages combined)
97	   **Quote:** "The most AI-exposed occupations contracted just 0.2% year over year as of April 2026, compared to 0.1% growth for the least-exposed roles."
98	   **Note:** Very small aggregate signal; confirms the divergence is concentrated at entry-level, not across all ages. From the Canaries Dashboard, cross-referenced in Fortune reporting on the paper.
99	
100	---
101	
102	### Apollo Global Management — "The Impact of AI on the U.S. Labor Market"
103	- **Publisher:** Apollo Global Management (Torsten Slok, Chief Economist; Sania Edlich, Economist)
104	- **Date:** 2026-07-30 (primary whitepaper release); widespread media coverage began 2026-08-22 (Bloomberg interview) through 2026-08-24 (Dataconomy, TNW)
105	- **URL:** https://apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf; Coverage: https://dataconomy.com/2026/08/24/ai-reduces-wage-growth-more-than-jobs-says-apollo-analysis/
106	- **Evidence Tier:** 2 (Investment bank / financial institution analysis; uses difference-in-differences design with BLS OEWS wage data and Anthropic Economic Index; rigorous methodology but single-company AI usage signal and limited sample of 321 occupations)
107	- **Source ID:** apollo-ai-wage-impact-2026
108	
109	**Context:** Whitepaper was published July 30, 2026 but entered broad public and research discourse beginning August 22, 2026 via Bloomberg "Wall Street Week with David Westin" interview with Slok. It is included here because it was first widely discussed within the 7-day window and may have been missed prior. Methodology: difference-in-differences across 321 occupations matched by 6-digit SOC code to BLS OEWS wage data (2015–2025) and Anthropic Economic Index. Key caveat from authors: "their exposure measurement is based on data from only one company, and only a fraction of occupations was included in the analysis." The 24.3% figure for service workers is flagged by authors as based on a small subsample.
110	
111	**Statistics:**
112	
113	1. **Graph:** Median Wage Impact (`median-wage-impact`)
114	   **Type:** OVERLAY (down)
115	   **Value:** -6.7 (% slower real wage growth in high-AI-exposure occupations vs. low-exposure occupations, post-2023)
116	   **Quote:** "Using a difference-in-differences design with occupation and year fixed effects across 321 matched occupations from 2015 to 2025, we find that high-exposure occupations experience a 6.7% decline in real wage growth post-2023 with no detectable employment effects, suggesting firms are capturing AI productivity gains through wage suppression rather than workforce reduction."
117	   **Note:** This is a *relative* wage growth gap (high- vs. low-exposure), not an absolute change in real median wages for the full economy. Classify as overlay. Direction: the finding is consistent with downward pressure on wage growth for AI-exposed workers.
118	
119	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
120	   **Type:** OVERLAY (down)
121	   **Value:** -10.7 (% slower real wage growth, lowest wage quartile workers in high-exposure occupations, post-2023)
122	   **Quote:** "The wage gap was particularly pronounced among lower-paid workers, with a 10.7% difference in the lowest wage quartile, 5.4% in the second quartile, and 4.0% in the third quartile. No significant effects were identified in the highest wage quartile."
123	   **Note:** The lowest earners absorb the steepest wage suppression. Service workers show -24.3% but authors flag this as based on a small subsample.
124	
125	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
126	   **Type:** OVERLAY (neutral)
127	   **Value:** 0 (no statistically significant employment effect detected across 321 occupations)
128	   **Quote:** "Despite years of warnings about mass job displacement, the fallout from AI in terms of employment is actually 'insignificant,' said Slok, Apollo's chief economist."
129	   **Note:** This directly contradicts the displacement-focused predictions the graphs track; use as a moderating overlay.
130	
131	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
132	   **Type:** OVERLAY (neutral)
133	   **Value:** 5.8 (million workers currently in high-AI-exposure occupations, estimated by Apollo)
134	   **Quote:** "Around 5.8 million workers have roles that are highly exposed to AI, the paper estimated."
135	   **Note:** This is Apollo's estimate of the current affected universe using the Anthropic Economic Index. Global stats ≠ US-specific; however this IS a US figure. Overlay only — methodology differs substantially from Census BTOS or BLS exposure categories.
136	
137	---
138	
139	### YouGov Survey of 1,250 U.S. Workers on AI Job Impact
140	- **Publisher:** Jeffrey C. Dixon (Professor of Sociology, College of the Holy Cross), via YouGov; published via *The Conversation* / *Fortune*
141	- **Date:** 2026-08-29 (published in *Fortune*); survey fielded July 30–August 4, 2026
142	- **URL:** https://fortune.com/2026/08/29/ai-workers-survey-job-impact-2026/
143	- **Evidence Tier:** 3 (Major news; non-peer-reviewed study in progress; nationally weighted sample but opt-in panel; no jobless respondents included; workers may not accurately attribute job changes to AI)
144	- **Source ID:** dixon-yougov-ai-workers-survey-2026
145	
146	**Context:** Commissioned online survey of 1,250 employed U.S. adults by YouGov, weighted to be nationally representative on age, gender, race, and education. Covers three questions about AI-related job changes since 2023: job loss, new AI-created job gained, and promotion/advancement related to AI. Author Dixon notes limitations: respondents are all currently employed (excludes AI-displaced non-workers); self-attribution of job changes to AI is uncertain; YouGov opt-in panel may differ from random sample. Survey was conducted when the official BLS unemployment rate stood at 4.1%.
147	
148	**Statistics:**
149	
150	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
151	   **Type:** OVERLAY (down — strongly moderates displacement expectations)
152	   **Value:** 3 % (share of employed U.S. workers self-reporting job loss due to AI since 2023)
153	   **Quote:** "Only about 3% of workers said they had lost a job due to AI since 2023, while roughly 6% indicated they landed a job that didn't exist before AI. Approximately 9% said they've earned a promotion or advancement related to AI."
154	   **Note:** Self-reported job *loss* rate of ~3% is far below most displacement projections. However, the sample excludes people currently unemployed, which means AI-displaced workers who have not yet found new employment are not captured. Interpret with caution; strong downward moderator.
155	
156	2. **Graph:** AI Business Formation (`ai-business-formation`)
157	   **Type:** OVERLAY (up)
158	   **Value:** 6 % (share of employed U.S. workers self-reporting landing a new job that did not exist before AI since 2023)
159	   **Quote:** "Approximately 95% of surveyed workers said 'no' to the first question [job lost to AI]; 90% said no to the second [landed AI-created job]; and 88% said no to the last [received AI-linked promotion]."
160	   **Note:** The 6% AI-created-role figure maps imperfectly to `ai-business-formation`; it captures individual job creation rather than firm formation rates. Classify as overlay.
161	
162	---
163	
164	## Sources Checked but Not Relevant
165	
166	The following sources were retrieved and evaluated but either fell outside the 7-day window, lacked new quantitative AI labor statistics, or duplicated statistics already captured:
167	
168	- **Census HTOPS "AI Use at Work"** (https://www.census.gov/library/stories/2026/08/ai-use-at-work.html) — Published **August 11, 2026**, outside the 7-day window (before August 24). Contains important statistics (55% of U.S. workers report using AI for at least one job task; 31% saved 1–2 hours/week) but should be ingested in the prior digest cycle. Key stats on record: 55% workplace AI use rate (March 2026 HTOPS), 31% saved 1–2 hours with AI.
169	
170	- **NBER WP 34859 "Chaining Tasks, Redefining Work"** (Demirer, Horton, Immorlica, Lucier, Shahidi, 2026) — Publication date within 2026 not confirmed within the 7-day window; theoretical AI automation model, no new quantitative labor market statistics.
171	
172	- **Brookings "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement"** (Manning & Aguirre NBER paper) — No precise publication date confirmed in the 7-day window; primarily a methodological framework (adaptive capacity index), no new displacement % statistics.
173	
174	- **Brookings "Political Geography of AI Exposure"** — No new quantitative displacement/wage statistics; descriptive political geography analysis.
175	
176	- **Axis Intelligence "AI Job Displacement Statistics 2026"** (June 18, 2026) — Outside the window; aggregator site compiling third-party statistics, not a primary source.
177	
178	- **SSRN Nartey "AI Job Displacement Analysis 2025–2030"** (2025) — Outside the window; not a peer-reviewed source.
179	
180	- **IMF SDN 2026/001 "Bridging Skill Gaps for the Future"** — 2026 publication but no confirmed in-window date; no new US-specific labor statistics extracted.
181	
182	- **ILO–World Bank GenAI occupational exposure paper** (background study for World Development Report 2026) — No confirmed in-window date; no new US-specific statistics.
183	
184	- **General aggregator sites** (DesignRush, Click-Vision, AIExposure.org, LetAIdo, etc.) — Tier 4; synthesize previously published statistics; no primary quantitative findings within the window.
185	
186	---
187	
188	## Researcher Watchlist Status (all lastChecked: 2026-04-14, 139 days overdue)
189	
190	All 15 researchers have lastChecked dates of April 14, 2026 (139 days ago, > 30-day threshold). Sweep results:
191	
192	| Researcher | New Work in Window? | Notes |
193	|---|---|---|
194	| **Erik Brynjolfsson** | ✅ YES — **FOUND** | "Canaries" revised August 2026; see full entry above |
195	| Daron Acemoglu | No — within-window paper not confirmed | MIT publications page lists an August 2026 Labor Economics paper (with Ajzenman et al.) but subject unclear; "Building Pro-Worker AI" (NBER WP 34854) is from February 2026 |
196	| Pascual Restrepo | No new within-window papers confirmed | |
197	| David Deming | No new within-window papers confirmed | Bick/Blandin/Deming "Mind the Gap" (BPEA Spring 2026) precedes window |
198	| Alexander Bick | No new within-window papers confirmed | Same — "Mind the Gap" Spring 2026, "What Work Does Generative AI Do?" April 2026 |
199	| Martha Gimbel | No new within-window papers confirmed | Bloomberg piece August 17, 2026 (just outside window); Budget Lab AI tracker page updated to July 9, 2026 |
200	| Jed Kolko | No new within-window papers confirmed | PIIE AI+work event, date unconfirmed |
201	| James Bessen | No new within-window papers confirmed | |
202	| Alex Imas | No new within-window papers confirmed | |
203	| Molly Kinder | No new within-window papers confirmed | No affiliation update found |
204	| Daniel Rock | No new within-window papers confirmed | |
205	| Maria del Rio-Chanona | No new within-window papers confirmed | |
206	| Andrea Eisfeldt | No new within-window papers confirmed | |
207	| Shakked Noy | No new within-window papers confirmed | |
208	| Neil Thompson | No new within-window papers confirmed | |
209	
210	---
211	
212	## Priority Recommendations
213	
214	### Ingest Immediately
215	
216	1. **BLS Employment Projections 2025–35 (August 27, 2026)** — Tier 1. The single most authoritative source this week. The -4.0% / 752,100 projected job loss for office & administrative support is the strongest government-sourced quantitative signal to date on AI-linked occupational decline. **Also: add BLS Employment Projections as a new recurring series in the registry** (annual release, typically August). The new AI Exposure Categories product is a significant data infrastructure development — monitor `bls.gov/emp/publications/ai-exposure-categories.htm` for detailed occupation-level breakdowns.
217	
218	2. **Brynjolfsson et al. "Canaries in the Coal Mine" Revised August 2026** — Tier 2. The 19% entry-level employment gap is the widest it has been since the series began, widened from 15% at July 2025. Data through June 2026 using ADP administrative records. **Erik Brynjolfsson lastChecked should be updated to 2026-08-31.** This also updates the keyPapers entry `brynjolfsson-canaries-2025` to `brynjolfsson-canaries-aug2026`.
219	
220	### Divergences from Current Graph Consensus — Flag for Review
221	
222	3. **Apollo Wage Analysis (July 30/August 22, 2026)** — Tier 2. The finding that AI's primary labor market effect is **wage suppression, not job displacement**, with a 6.7% real-wage-growth penalty in high-exposure occupations, diverges significantly from the displacement-forward framing of most graphs. If confirmed in broader datasets, this supports strengthening `median-wage-impact` and `entry-level-wage-impact` overlays while moderating displacement graph trajectories. Caveat: single-company AI usage signal (Anthropic), 321-occupation sample.
223	
224	4. **Brynjolfsson entry-level gap update** — The 19% relative employment gap for ages 22–25 is the most robust empirical signal of labor-market change. Combined with Apollo's finding that wages are *not* declining (adjustment is through employment, not pay), this creates a **divergent pattern** between displacement and wage graphs: `entry-level-wage-impact` direction may need to be considered as near-neutral (no significant wage decline for those still employed) while `overall-us-displacement` and tech-sector proxies tilt downward for new cohorts.
225	
226	### New Government Data Infrastructure
227	
228	5. **BLS AI Exposure Categories** — This new data product (released August 27, 2026) classifies every detailed occupation by four levels of theoretical + observed AI exposure, combining five external datasets including the Anthropic Economic Index. It is the first official government classification of occupational AI exposure. **Recommend fetching** `https://www.bls.gov/emp/publications/ai-exposure-categories.htm` and its associated XLSX download for occupation-level mapping to the site's prediction graphs. This could enable direct data-point mappings for `workforce-ai-exposure` that have previously relied on third-party exposure indices.
229	
230	### For Next Digest Cycle
231	
232	6. **Census HTOPS "AI Use at Work" (August 11, 2026)** — Published just before this window. Key statistics: 55% of U.S. workers report using AI at work for at least one of 11 tasks (March 2026); 31% saved 1–2 hours per week. Ingest as data point for `genai-work-adoption`. This is Tier 1 (U.S. Census Bureau).
233	
234	7. **Yale Budget Lab AI tracker** — Martha Gimbel's team continues tracking labor market data; their tracker at budgetlab.yale.edu/research/tracking-impact-ai-labor-market should be checked. No new quantitative release found within this window; lastChecked for Martha Gimbel should be updated to 2026-08-31.
# AI Labor Research Digest — 2026-08-31

## Summary

Four sources with direct labor-market statistics were identified for the period August 24–31, 2026. The most important is a **Tier 1 government release**: the BLS Employment Projections 2025–35 (August 27), which projects office and administrative support occupations losing 752,100 jobs — the steepest decline of any major occupational group — and simultaneously debuts a new AI Exposure Categories data product for all detailed occupations. A **WATCHLIST** revision of the Stanford/ADP "Canaries in the Coal Mine" paper (Brynjolfsson et al., August 2026) updates its employment gap for young workers in AI-exposed roles to 19%, widened from 15% at the July 2025 vintage, using payroll data through June 2026. An Apollo Global Management whitepaper on wage compression (primary publication July 30, 2026; broad media coverage began August 22) finds a 6.7% real-wage-growth penalty in high-AI-exposure occupations with no detectable employment effect — a divergent finding relative to displacement-focused research that warrants flagging. A YouGov/sociologist survey (August 29) finds only ~3% of 1,250 U.S. workers self-report job loss due to AI since 2023. No Tier 1 studies documenting measured aggregate displacement were found this week; the dominant signal remains **wage suppression and entry-level hiring contraction**, not aggregate unemployment.

---

## Recurring Series Status

The registry contains one tracked series:

- **ellucian-highered-ai**: nextExpected 2027-03-01 — **not due this cycle. No sweep required.**

> **Unregistered high-priority release noted:** BLS Employment Projections 2025–35 (USDL-26-1422, August 27, 2026) is an annual Tier 1 release not yet in the recurring-sources.json registry. It is the functional equivalent of the BLS employment projections series and should be added. See full entry below.

---

## New Sources

---

### BLS Employment Projections 2025–2035 + New AI Exposure Categories
- **Publisher:** U.S. Bureau of Labor Statistics (BLS)
- **Date:** 2026-08-27
- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf; AI exposure supplement: https://www.bls.gov/emp/publications/ai-exposure-categories.htm
- **Evidence Tier:** 1 (U.S. Government Statistics)
- **Source ID:** bls-employment-projections-2026

**Context:** Annual BLS employment projections release (USDL-26-1422), projections horizon 2025–2035. For the first time, BLS simultaneously launched a supplemental "AI Exposure Categories" data product classifying all detailed occupations into four tiers based on five external theoretical and observed-exposure datasets. BLS explicitly notes the uncertainty: "Developments in AI are proceeding rapidly, and the uncertainty about potential impacts remains very high." Projections assume technological progress in line with historical patterns; departures from that assumption would alter results.

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** -4.0 % (projected employment change, office & administrative support occupational group, 2025–35)
   **Quote:** "This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."
   **Note:** Decline explicitly linked to AI: "the continued integration of automation tools, including those powered by AI, into workflows is likely to reduce demand for several office and administrative support occupations." Not a displacement % of all US jobs; classify as overlay.

2. **Graph:** Customer Service Automation (`customer-service-automation`)
   **Type:** OVERLAY (down)
   **Value:** -1.4 % (projected employment change, sales and related occupational group, 2025–35)
   **Quote:** "Further growth of e-commerce and incorporation of AI tools into the sales process are expected to continue contributing to job loss in the sales and related occupational group (-1.4 percent)."

3. **Graph:** Creative Industry Displacement (`creative-industry-displacement`)
   **Type:** OVERLAY (down)
   **Value:** +1.5 % (projected employment change, arts/design/entertainment/sports/media occupational group, 2025–35 — below total economy average of +3.5%)
   **Quote:** "The use of generative AI software, which can be leveraged to automate repetitive tasks and speed up certain processes, may limit demand for some jobs in the arts, design, entertainment, sports, and media occupational group."
   **Note:** Group is growing but at less than half the economy-wide rate; overlay signals suppression rather than absolute decline.

4. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** +25.1 % (projected employment growth, computing infrastructure providers, data processing, web hosting, 2025–35)
   **Quote:** "Accelerated AI adoption is also expected to support employment growth in the computing infrastructure providers, data processing, web hosting, and related services industry. As a result, this industry is projected to grow 25.1 percent and add 120,400 new jobs over the projections period."

5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral — new data infrastructure, not a % exposure figure)
   **Value:** N/A (categorical classification)
   **Quote:** "Alongside the 2025–35 projections, BLS is introducing a new data product that provides information about how occupations compare to one another based on their theoretical and observed exposure to artificial intelligence (AI)."
   **Note:** BLS combined five external datasets (Felten/Raj/Seamans; Eloundou et al.; Eisfeldt et al.; Anthropic Economic Index; one additional observed-usage source) to produce four high-level categories for every detailed occupation. Availability URL: https://www.bls.gov/emp/publications/ai-exposure-categories.htm. No aggregate %-exposed figure is published in the release itself; do not use as a data point.

---

### "Canaries in the Coal Mine?" — Revised August 2026
- **Publisher:** Stanford Digital Economy Lab
- **Date:** 2026-08 (exact day within August not stated; PDF URL path confirms August 2026)
- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/; PDF: https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
- **Evidence Tier:** 2 (Think tank / academic institution; ADP administrative payroll records for millions of workers; not peer-reviewed but large-N, high-quality data)
- **Source ID:** stanford-del-canaries-aug2026
- **WATCHLIST:** Erik Brynjolfsson (lastChecked 2026-04-14, 139 days overdue)

**Context:** Revised version of the August 2025 "Canaries" paper; extends ADP payroll data through June 2026, adding 10+ months and new mechanistic analysis. Six documented facts; authors are explicit that these are descriptive (not causal) findings. The divergence has widened from 15% (July 2025 vintage) to 19% (June 2026). New in the revision: evidence that declines concentrate in "codified knowledge" occupations (tasks transferable via text and formal training), while employment is flat or rising among experienced workers in "tacit knowledge" roles.

**Statistics:**

1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -19 % (relative employment gap: young workers ages 22–25 in AI-exposed occupations vs. less-exposed peers, as of June 2026)
   **Quote:** "Employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
   **Note:** Unit mismatch — this is a relative employment count gap, not a wage change %. However, it is the closest active graph to entry-level labor-market conditions. Classify as overlay, not data point. The authors document that "adjustment is occurring through employment rather than base compensation," meaning wages for those still employed have not declined — the compression is in hiring.

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no statistically significant economy-wide displacement detected)
   **Quote:** "(1) We find no evidence of widespread, economy-wide job displacement."
   **Note:** This is a counter-signal to pessimistic displacement forecasts. Use as a downward-moderating overlay.

3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** -11 % (absolute employment level change, workers ages 22–25 in the two most AI-exposed quintiles, Nov 2022 – Jun 2026)
   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
   **Note:** The most exposed quintiles are dominated by tech and professional services occupations (software developers, customer service representatives explicitly mentioned). Overlay only — does not give a % of tech jobs displaced.

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** -0.2 % (most AI-exposed occupations, year-over-year employment growth as of April 2026, all ages combined)
   **Quote:** "The most AI-exposed occupations contracted just 0.2% year over year as of April 2026, compared to 0.1% growth for the least-exposed roles."
   **Note:** Very small aggregate signal; confirms the divergence is concentrated at entry-level, not across all ages. From the Canaries Dashboard, cross-referenced in Fortune reporting on the paper.

---

### Apollo Global Management — "The Impact of AI on the U.S. Labor Market"
- **Publisher:** Apollo Global Management (Torsten Slok, Chief Economist; Sania Edlich, Economist)
- **Date:** 2026-07-30 (primary whitepaper release); widespread media coverage began 2026-08-22 (Bloomberg interview) through 2026-08-24 (Dataconomy, TNW)
- **URL:** https://apollo.com/content/dam/apolloaem/pdf/daily-spark/2026/jul/30/Whitepaper-Impact%20of%20AI%20on%20U.S.%20Labor%20Market-2026-R2%201.pdf; Coverage: https://dataconomy.com/2026/08/24/ai-reduces-wage-growth-more-than-jobs-says-apollo-analysis/
- **Evidence Tier:** 2 (Investment bank / financial institution analysis; uses difference-in-differences design with BLS OEWS wage data and Anthropic Economic Index; rigorous methodology but single-company AI usage signal and limited sample of 321 occupations)
- **Source ID:** apollo-ai-wage-impact-2026

**Context:** Whitepaper was published July 30, 2026 but entered broad public and research discourse beginning August 22, 2026 via Bloomberg "Wall Street Week with David Westin" interview with Slok. It is included here because it was first widely discussed within the 7-day window and may have been missed prior. Methodology: difference-in-differences across 321 occupations matched by 6-digit SOC code to BLS OEWS wage data (2015–2025) and Anthropic Economic Index. Key caveat from authors: "their exposure measurement is based on data from only one company, and only a fraction of occupations was included in the analysis." The 24.3% figure for service workers is flagged by authors as based on a small subsample.

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -6.7 (% slower real wage growth in high-AI-exposure occupations vs. low-exposure occupations, post-2023)
   **Quote:** "Using a difference-in-differences design with occupation and year fixed effects across 321 matched occupations from 2015 to 2025, we find that high-exposure occupations experience a 6.7% decline in real wage growth post-2023 with no detectable employment effects, suggesting firms are capturing AI productivity gains through wage suppression rather than workforce reduction."
   **Note:** This is a *relative* wage growth gap (high- vs. low-exposure), not an absolute change in real median wages for the full economy. Classify as overlay. Direction: the finding is consistent with downward pressure on wage growth for AI-exposed workers.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -10.7 (% slower real wage growth, lowest wage quartile workers in high-exposure occupations, post-2023)
   **Quote:** "The wage gap was particularly pronounced among lower-paid workers, with a 10.7% difference in the lowest wage quartile, 5.4% in the second quartile, and 4.0% in the third quartile. No significant effects were identified in the highest wage quartile."
   **Note:** The lowest earners absorb the steepest wage suppression. Service workers show -24.3% but authors flag this as based on a small subsample.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no statistically significant employment effect detected across 321 occupations)
   **Quote:** "Despite years of warnings about mass job displacement, the fallout from AI in terms of employment is actually 'insignificant,' said Slok, Apollo's chief economist."
   **Note:** This directly contradicts the displacement-focused predictions the graphs track; use as a moderating overlay.

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 5.8 (million workers currently in high-AI-exposure occupations, estimated by Apollo)
   **Quote:** "Around 5.8 million workers have roles that are highly exposed to AI, the paper estimated."
   **Note:** This is Apollo's estimate of the current affected universe using the Anthropic Economic Index. Global stats ≠ US-specific; however this IS a US figure. Overlay only — methodology differs substantially from Census BTOS or BLS exposure categories.

---

### YouGov Survey of 1,250 U.S. Workers on AI Job Impact
- **Publisher:** Jeffrey C. Dixon (Professor of Sociology, College of the Holy Cross), via YouGov; published via *The Conversation* / *Fortune*
- **Date:** 2026-08-29 (published in *Fortune*); survey fielded July 30–August 4, 2026
- **URL:** https://fortune.com/2026/08/29/ai-workers-survey-job-impact-2026/
- **Evidence Tier:** 3 (Major news; non-peer-reviewed study in progress; nationally weighted sample but opt-in panel; no jobless respondents included; workers may not accurately attribute job changes to AI)
- **Source ID:** dixon-yougov-ai-workers-survey-2026

**Context:** Commissioned online survey of 1,250 employed U.S. adults by YouGov, weighted to be nationally representative on age, gender, race, and education. Covers three questions about AI-related job changes since 2023: job loss, new AI-created job gained, and promotion/advancement related to AI. Author Dixon notes limitations: respondents are all currently employed (excludes AI-displaced non-workers); self-attribution of job changes to AI is uncertain; YouGov opt-in panel may differ from random sample. Survey was conducted when the official BLS unemployment rate stood at 4.1%.

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — strongly moderates displacement expectations)
   **Value:** 3 % (share of employed U.S. workers self-reporting job loss due to AI since 2023)
   **Quote:** "Only about 3% of workers said they had lost a job due to AI since 2023, while roughly 6% indicated they landed a job that didn't exist before AI. Approximately 9% said they've earned a promotion or advancement related to AI."
   **Note:** Self-reported job *loss* rate of ~3% is far below most displacement projections. However, the sample excludes people currently unemployed, which means AI-displaced workers who have not yet found new employment are not captured. Interpret with caution; strong downward moderator.

2. **Graph:** AI Business Formation (`ai-business-formation`)
   **Type:** OVERLAY (up)
   **Value:** 6 % (share of employed U.S. workers self-reporting landing a new job that did not exist before AI since 2023)
   **Quote:** "Approximately 95% of surveyed workers said 'no' to the first question [job lost to AI]; 90% said no to the second [landed AI-created job]; and 88% said no to the last [received AI-linked promotion]."
   **Note:** The 6% AI-created-role figure maps imperfectly to `ai-business-formation`; it captures individual job creation rather than firm formation rates. Classify as overlay.

---

## Sources Checked but Not Relevant

The following sources were retrieved and evaluated but either fell outside the 7-day window, lacked new quantitative AI labor statistics, or duplicated statistics already captured:

- **Census HTOPS "AI Use at Work"** (https://www.census.gov/library/stories/2026/08/ai-use-at-work.html) — Published **August 11, 2026**, outside the 7-day window (before August 24). Contains important statistics (55% of U.S. workers report using AI for at least one job task; 31% saved 1–2 hours/week) but should be ingested in the prior digest cycle. Key stats on record: 55% workplace AI use rate (March 2026 HTOPS), 31% saved 1–2 hours with AI.

- **NBER WP 34859 "Chaining Tasks, Redefining Work"** (Demirer, Horton, Immorlica, Lucier, Shahidi, 2026) — Publication date within 2026 not confirmed within the 7-day window; theoretical AI automation model, no new quantitative labor market statistics.

- **Brookings "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement"** (Manning & Aguirre NBER paper) — No precise publication date confirmed in the 7-day window; primarily a methodological framework (adaptive capacity index), no new displacement % statistics.

- **Brookings "Political Geography of AI Exposure"** — No new quantitative displacement/wage statistics; descriptive political geography analysis.

- **Axis Intelligence "AI Job Displacement Statistics 2026"** (June 18, 2026) — Outside the window; aggregator site compiling third-party statistics, not a primary source.

- **SSRN Nartey "AI Job Displacement Analysis 2025–2030"** (2025) — Outside the window; not a peer-reviewed source.

- **IMF SDN 2026/001 "Bridging Skill Gaps for the Future"** — 2026 publication but no confirmed in-window date; no new US-specific labor statistics extracted.

- **ILO–World Bank GenAI occupational exposure paper** (background study for World Development Report 2026) — No confirmed in-window date; no new US-specific statistics.

- **General aggregator sites** (DesignRush, Click-Vision, AIExposure.org, LetAIdo, etc.) — Tier 4; synthesize previously published statistics; no primary quantitative findings within the window.

---

## Researcher Watchlist Status (all lastChecked: 2026-04-14, 139 days overdue)

All 15 researchers have lastChecked dates of April 14, 2026 (139 days ago, > 30-day threshold). Sweep results:

| Researcher | New Work in Window? | Notes |
|---|---|---|
| **Erik Brynjolfsson** | ✅ YES — **FOUND** | "Canaries" revised August 2026; see full entry above |
| Daron Acemoglu | No — within-window paper not confirmed | MIT publications page lists an August 2026 Labor Economics paper (with Ajzenman et al.) but subject unclear; "Building Pro-Worker AI" (NBER WP 34854) is from February 2026 |
| Pascual Restrepo | No new within-window papers confirmed | |
| David Deming | No new within-window papers confirmed | Bick/Blandin/Deming "Mind the Gap" (BPEA Spring 2026) precedes window |
| Alexander Bick | No new within-window papers confirmed | Same — "Mind the Gap" Spring 2026, "What Work Does Generative AI Do?" April 2026 |
| Martha Gimbel | No new within-window papers confirmed | Bloomberg piece August 17, 2026 (just outside window); Budget Lab AI tracker page updated to July 9, 2026 |
| Jed Kolko | No new within-window papers confirmed | PIIE AI+work event, date unconfirmed |
| James Bessen | No new within-window papers confirmed | |
| Alex Imas | No new within-window papers confirmed | |
| Molly Kinder | No new within-window papers confirmed | No affiliation update found |
| Daniel Rock | No new within-window papers confirmed | |
| Maria del Rio-Chanona | No new within-window papers confirmed | |
| Andrea Eisfeldt | No new within-window papers confirmed | |
| Shakked Noy | No new within-window papers confirmed | |
| Neil Thompson | No new within-window papers confirmed | |

---

## Priority Recommendations

### Ingest Immediately

1. **BLS Employment Projections 2025–35 (August 27, 2026)** — Tier 1. The single most authoritative source this week. The -4.0% / 752,100 projected job loss for office & administrative support is the strongest government-sourced quantitative signal to date on AI-linked occupational decline. **Also: add BLS Employment Projections as a new recurring series in the registry** (annual release, typically August). The new AI Exposure Categories product is a significant data infrastructure development — monitor `bls.gov/emp/publications/ai-exposure-categories.htm` for detailed occupation-level breakdowns.

2. **Brynjolfsson et al. "Canaries in the Coal Mine" Revised August 2026** — Tier 2. The 19% entry-level employment gap is the widest it has been since the series began, widened from 15% at July 2025. Data through June 2026 using ADP administrative records. **Erik Brynjolfsson lastChecked should be updated to 2026-08-31.** This also updates the keyPapers entry `brynjolfsson-canaries-2025` to `brynjolfsson-canaries-aug2026`.

### Divergences from Current Graph Consensus — Flag for Review

3. **Apollo Wage Analysis (July 30/August 22, 2026)** — Tier 2. The finding that AI's primary labor market effect is **wage suppression, not job displacement**, with a 6.7% real-wage-growth penalty in high-exposure occupations, diverges significantly from the displacement-forward framing of most graphs. If confirmed in broader datasets, this supports strengthening `median-wage-impact` and `entry-level-wage-impact` overlays while moderating displacement graph trajectories. Caveat: single-company AI usage signal (Anthropic), 321-occupation sample.

4. **Brynjolfsson entry-level gap update** — The 19% relative employment gap for ages 22–25 is the most robust empirical signal of labor-market change. Combined with Apollo's finding that wages are *not* declining (adjustment is through employment, not pay), this creates a **divergent pattern** between displacement and wage graphs: `entry-level-wage-impact` direction may need to be considered as near-neutral (no significant wage decline for those still employed) while `overall-us-displacement` and tech-sector proxies tilt downward for new cohorts.

### New Government Data Infrastructure

5. **BLS AI Exposure Categories** — This new data product (released August 27, 2026) classifies every detailed occupation by four levels of theoretical + observed AI exposure, combining five external datasets including the Anthropic Economic Index. It is the first official government classification of occupational AI exposure. **Recommend fetching** `https://www.bls.gov/emp/publications/ai-exposure-categories.htm` and its associated XLSX download for occupation-level mapping to the site's prediction graphs. This could enable direct data-point mappings for `workforce-ai-exposure` that have previously relied on third-party exposure indices.

### For Next Digest Cycle

6. **Census HTOPS "AI Use at Work" (August 11, 2026)** — Published just before this window. Key statistics: 55% of U.S. workers report using AI at work for at least one of 11 tasks (March 2026); 31% saved 1–2 hours per week. Ingest as data point for `genai-work-adoption`. This is Tier 1 (U.S. Census Bureau).

7. **Yale Budget Lab AI tracker** — Martha Gimbel's team continues tracking labor market data; their tracker at budgetlab.yale.edu/research/tracking-impact-ai-labor-market should be checked. No new quantitative release found within this window; lastChecked for Martha Gimbel should be updated to 2026-08-31.