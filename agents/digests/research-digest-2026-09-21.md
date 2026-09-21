1	# AI Labor Research Digest — 2026-09-21
2	
3	## Summary
4	
5	The week of September 14–21, 2026 was a relatively quiet one for new primary releases. One source falls squarely within the 7-day window: the Yale Budget Lab's monthly CPS update ("Tracking the Impact of AI on the Labor Market," updated September 15, 2026), which reaffirms that no statistically clear AI-related labor market footprint has yet appeared in aggregate employment data. Several high-quality sources published just outside the window (September 1–13) are included in an *adjacent context* section given their recency and importance: the St. Louis Fed's first nationally representative task-level AI adoption indexes (Bick, Blandin, Deming, Schumacher — Sept 1), the Challenger Gray & Christmas August 2026 job-cuts report (Sept 3), and a CNBC/Apollo Global Management wage-compression analysis (Sept 13). No Tier 1 peer-reviewed paper published strictly within the 7-day window was located. The Yale Budget Lab update is Tier 2. Researchers on the watchlist — particularly Brynjolfsson, Bick, and Gimbel — were active in August–early September with significant new output.
6	
7	---
8	
9	## Recurring Series Status
10	
11	| Series | Status |
12	|---|---|
13	| **ellucian-highered-ai** | Not due (nextExpected: 2027-03-01) — no sweep required |
14	| **Yale Budget Lab AI tracker** *(tracked informally as a recurring series)* | **NEW EDITION** — "Tracking the Impact of AI on the Labor Market," updated September 15, 2026. Continuation of monthly CPS-based tracking; key takeaways unchanged from prior months: no aggregate AI footprint detected in occupational mix, employment, or unemployment data. |
15	| **Challenger Gray & Christmas** *(monthly)* | August 2026 data published September 3, 2026 — outside 7-day window; noted below. |
16	| **Census BTOS** *(biweekly)* | Most recently cited through May 3, 2026 data; no new release identified in this window. |
17	| **BLS Employment Projections** | 2025–35 cycle released August 27, 2026 — outside window; Tier 1 context noted below. |
18	
19	---
20	
21	## New Sources — Within 7-Day Window (Sept 14–21, 2026)
22	
23	### Yale Budget Lab — "Tracking the Impact of AI on the Labor Market" (September 15 Update)
24	- **Publisher:** The Budget Lab at Yale University
25	- **Date:** 2026-07-16 (original); **Updated: 2026-09-15** ← within window
26	- **URL:** https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market
27	- **Evidence Tier:** 2 (Non-partisan policy research center; uses BLS CPS microdata + Anthropic usage data)
28	- **Source ID:** yale-budgetlab-ai-tracker-sep2026
29	- **WATCHLIST:** Martha Gimbel (last checked 2026-04-14; >30 days)
30	- **RECURRING SERIES UPDATE**
31	
32	**Statistics:**
33	
34	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
35	   **Type:** OVERLAY (down)
36	   **Value:** 0 (no statistically detectable displacement signal)
37	   **Quote:** "The occupational mix is not yet changing in ways that clearly align with the introduction of AI into the workforce."
38	
39	2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
40	   **Type:** OVERLAY (neutral)
41	   **Value:** 0 (null result)
42	   **Quote:** "Measures of AI usage show no connection to changes in employment or unemployment."
43	
44	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
45	   **Type:** OVERLAY (down)
46	   **Value:** 0 (null result on causal identification)
47	   **Quote:** "A synthetic differences-in-differences analysis of AI exposure does not yet clearly indicate an AI-related labor market footprint."
48	
49	**Methodological note:** This update incorporates the July 2026 CPS microdata release. The synthetic differences-in-differences design is the Budget Lab's most rigorous causal identification strategy to date, making null findings here more informative than prior descriptive analyses.
50	
51	---
52	
53	## Adjacent Context — Sources Published September 1–13, 2026
54	*(Outside strict 7-day window; included because they post-date the researcher watchlist's last check of April 14, 2026 and are of high priority)*
55	
56	---
57	
58	### St. Louis Fed — "What Work Does Generative AI Do?"
59	- **Publisher:** Federal Reserve Bank of St. Louis (On the Economy blog + companion working paper)
60	- **Date:** 2026-09-01
61	- **URL:** https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do
62	- **Evidence Tier:** 1 (Federal Reserve research; nationally representative Real-Time Population Survey, ~14,000 workers across four quarterly waves Aug 2025–May 2026)
63	- **Source ID:** stlouisfed-bick-deming-ai-adoption-sep2026
64	- **WATCHLIST:** Alexander Bick (last checked 2026-04-14; >30 days); David Deming (last checked 2026-04-14; >30 days)
65	
66	**Statistics:**
67	
68	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
69	   **Type:** DATA_POINT
70	   **Value:** 45 (% of workers)
71	   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."
72	
73	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
74	   **Type:** DATA_POINT
75	   **Value:** 62 (% of adults)
76	   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."
77	
78	3. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
79	   **Type:** OVERLAY (neutral)
80	   **Value:** 20 (% threshold — lower bound of widespread adoption)
81	   **Quote:** "In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%."
82	
83	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
84	   **Type:** OVERLAY (neutral — nuance: shallow)
85	   **Value:** 3 (% of job tasks with majority-AI adoption)
86	   **Quote:** "Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."
87	
88	5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
89	   **Type:** OVERLAY (up — highest adoption sector)
90	   **Value:** 87.3 (% of computer and information research scientists using AI)
91	   **Quote:** "Adoption is highest in computing and professional occupations: computer and information research scientists (87.3%), information security analysts (85.4%), and network and computer systems administrators (82.4%)."
92	
93	**Key methodological contribution:** First nationally representative measures of AI adoption at the level of detailed work tasks (O*NET 2,000 activities). Distinguishes exposure scores from actual adoption — medical secretaries score 61% on exposure but adopt at only 16.8%.
94	
95	---
96	
97	### Challenger, Gray & Christmas — August 2026 Job Cut Announcement Report
98	- **Publisher:** Challenger, Gray & Christmas
99	- **Date:** 2026-09-03 (released first Thursday of September)
100	- **URL:** https://www.challengergray.com/wp-content/uploads/2026/09/Challenger-Report-August-2026.pdf
101	- **Evidence Tier:** 3 (Major labor market research firm; tracks announced — not completed — layoffs)
102	- **Source ID:** challenger-aug2026-job-cuts
103	
104	**Statistics:**
105	
106	1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
107	   **Type:** DATA_POINT (signal-only)
108	   **Value:** 116175 (announced AI-attributed cuts Jan–Aug 2026)
109	   **Quote:** "Across January to August, AI remains the leading year-to-date reason at 116,175 announcements, approximately 22% of the 529,914 total."
110	
111	2. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
112	   **Type:** OVERLAY (up — growing AI attribution vs prior year)
113	   **Value:** 22 (% of all 2026 cuts attributed to AI YTD)
114	   **Quote:** "Artificial Intelligence fell to the fourth-most cited reason with 3,462 cuts in August, its lowest monthly total since December 2025 when 142 cuts were attributed to AI. It ends a five-month run, beginning in March, in which AI was the leading monthly reason."
115	
116	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
117	   **Type:** OVERLAY (up — announced intent signal)
118	   **Value:** 116175 (announced cuts citing AI, Jan–Aug 2026)
119	   **Quote:** "116,175 announced U.S. job cuts cited AI as the reason from January through August 2026, about 22% of the 529,914 total." *(Note: these are announcements, not confirmed separations; treat as signal, not displacement data point)*
120	
121	**Mapping caution:** Challenger data reflects employer-stated reasons for planned cuts, not verified AI-caused separations. Appropriate only as signal/overlay on `earnings-call-ai-mentions`, not as a data point on displacement graphs.
122	
123	---
124	
125	### CNBC / Apollo Global Management — "The wages of American workers are under pressure. AI's potential role is drawing more attention"
126	- **Publisher:** CNBC (reporting on Apollo Global Management white paper by Torsten Slok and Sania Edlich)
127	- **Date:** 2026-09-13
128	- **URL:** https://www.cnbc.com/2026/09/13/ai-jobs-pay-inflation.html
129	- **Evidence Tier:** 3 (Major financial news; reporting on Tier 2 Apollo white paper; original study covers only 321 of ~800 BLS occupations, only 11 meet high-exposure threshold)
130	- **Source ID:** cnbc-apollo-wages-sep2026
131	
132	**Statistics:**
133	
134	1. **Graph:** Median Wage Impact (`median-wage-impact`)
135	   **Type:** OVERLAY (down)
136	   **Value:** -6.7 (percentage-point differential in wage growth vs less-exposed peers)
137	   **Quote:** "Their research found that workers in occupations classified as highly exposed to AI experienced real-wage growth that was 6.7 percentage points slower after 2023 than workers in less-exposed occupations."
138	
139	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
140	   **Type:** OVERLAY (down — concentrated at lower earners)
141	   **Value:** -24.3 (% decline in earnings growth for service workers in AI-exposed roles)
142	   **Quote:** "The wage compression is concentrated among lower earners: service workers in AI-exposed roles saw a 24.3% decline in earnings growth, and workers in the bottom wage quartile saw a 10.7% decline, while top earners showed no significant effect."
143	
144	3. **Graph:** Median Wage Impact (`median-wage-impact`)
145	   **Type:** OVERLAY (down — employment effect null)
146	   **Value:** 0 (employment effect — not statistically significant)
147	   **Quote:** "At the same time, the study found no statistically significant effect on employment. The authors say the results suggest companies may be capturing some of the productivity gains from AI through wage compression rather than workforce reduction."
148	
149	4. **Graph:** Median Wage Impact (`median-wage-impact`)
150	   **Type:** OVERLAY (down — structural)
151	   **Value:** 52.8 (labor share of nonfarm business output, Q2 2026 — lowest on record since 1947)
152	   **Quote:** "labor's share of nonfarm business output/income was 52.8% in the second quarter of 2026, the lowest in the series beginning in the first quarter of 1947, according to the BLS productivity report."
153	
154	**Methodological caution flagged by experts:** Apollo study used a limited subset of BLS data (321 of ~800 occupations; only 11 met high-exposure threshold). Ben Zipperer (EPI) and David Autor both cautioned against overgeneralizing. Authors themselves call it "early evidence."
155	
156	---
157	
158	## Significant Sources from August 2026 (Watchlist Activity — Previously Untracked)
159	
160	These are not within the 7-day window but are notable because all watchlist researchers were last checked April 14, 2026 (>30 days ago). All represent new findings since the last sweep.
161	
162	---
163	
164	### Stanford Digital Economy Lab / ADP — "Canaries in the Coal Mine?" (August 2026 Revised Version)
165	- **Publisher:** Stanford Digital Economy Lab (Erik Brynjolfsson, Bharat Chandar, Ruyu Chen)
166	- **Date:** 2026-08 (revised; original August 2025)
167	- **URL:** https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
168	- **Evidence Tier:** 1 (Administrative ADP payroll data covering millions of US workers through June 2026; high-frequency; 4.6M workers across 730+ occupations)
169	- **Source ID:** brynjolfsson-canaries-aug2026
170	- **WATCHLIST:** Erik Brynjolfsson (last checked 2026-04-14; >30 days)
171	
172	**Statistics:**
173	
174	1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
175	   **Type:** DATA_POINT
176	   **Value:** -19 (% employment gap vs less-exposed peers)
177	   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
178	
179	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
180	   **Type:** OVERLAY (neutral — null at aggregate)
181	   **Value:** 0 (no economy-wide displacement detected)
182	   **Quote:** "We find no evidence of widespread, economy-wide job displacement."
183	
184	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
185	   **Type:** OVERLAY (down — mechanism is reduced hiring, not wage cuts)
186	   **Value:** 0 (wage/compensation channel — flat)
187	   **Quote:** "Adjustment is occurring through employment rather than base compensation."
188	
189	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
190	   **Type:** OVERLAY (neutral — automation substitution vs augmentation split)
191	   **Value:** 0 (augmented occupations show flat or rising employment)
192	   **Quote:** "Declines are concentrated in occupations where AI usage primarily substitutes for human tasks; where usage primarily complements workers, employment is flat or rising, especially for experienced workers."
193	
194	5. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
195	   **Type:** OVERLAY (down — divergence widening)
196	   **Value:** -19 (ongoing divergence — widening over time)
197	   **Quote:** "This divergence has widened steadily since we first documented it in August 2025."
198	
199	**Critical context:** The August 2026 revision extends data through June 2026 (+10 months of data vs original). The 19% figure (up from 16% in the original) is the most current and granular large-scale administrative estimate of AI's employment effect on a specific demographic.
200	
201	---
202	
203	### Census Bureau CES Working Paper — "Graduating into Disruption: Labor Market Outcomes for AI-Exposed College Majors"
204	- **Publisher:** U.S. Census Bureau, Center for Economic Studies (CES-WP-26-56)
205	- **Date:** 2026-08 (August 2026)
206	- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-56.html
207	- **Evidence Tier:** 1 (Administrative records on college graduates; Census CES working paper)
208	- **Source ID:** census-ces-26-56-graduating-disruption
209	
210	**Statistics:**
211	
212	1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
213	   **Type:** DATA_POINT
214	   **Value:** -13 (% decline in initial full-quarter earnings for most AI-exposed college majors)
215	   **Quote:** "In regression-adjusted estimates, the most AI-exposed decile of college majors saw their likelihood of initial employment decline by five percentage points, while full-quarter initial earnings declined by thirteen percent."
216	
217	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
218	   **Type:** OVERLAY (down — employment probability channel)
219	   **Value:** -5 (percentage-point decline in initial employment probability)
220	   **Quote:** "the most AI-exposed decile of college majors saw their likelihood of initial employment decline by five percentage points, while full-quarter initial earnings declined by thirteen percent. This earnings decline is comparable in magnitude to the earnings losses associated with graduating into a large recession."
221	
222	**Mapping note:** The -13% earnings decline maps to `entry-level-wage-impact` as a DATA_POINT (observed, not projected). The recession-severity comparison is striking and corroborates Brynjolfsson's entry-level findings.
223	
224	---
225	
226	### U.S. Bureau of Labor Statistics — Employment Projections 2025–35 (AI Exposure Categories)
227	- **Publisher:** U.S. Bureau of Labor Statistics
228	- **Date:** 2026-08-27
229	- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf
230	- **Evidence Tier:** 1 (Official U.S. government employment projections; BLS)
231	- **Source ID:** bls-employment-projections-2025-35
232	
233	**Statistics:**
234	
235	1. **Graph:** Customer Service Automation (`customer-service-automation`)
236	   **Type:** DATA_POINT
237	   **Value:** -5.5 (% projected decline in customer service rep employment 2024–34)
238	   **Quote:** "Customer service representatives [projected employment change:] -5.5 [percent], [change in employment:] -153,700."
239	
240	2. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
241	   **Type:** OVERLAY (down — office/admin group fastest declining)
242	   **Value:** -4.0 (% projected decline for office and administrative support group 2025–35)
243	   **Quote:** "This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."
244	
245	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
246	   **Type:** OVERLAY (neutral — net employment growth projected)
247	   **Value:** 3.5 (% total employment growth 2025–35)
248	   **Quote:** "Total employment is projected to increase from 170.3 million to 176.2 million and grow 3.5 percent, which is slower than the 10.9 percent growth recorded over the 2015−25 decade."
249	
250	4. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
251	   **Type:** DATA_POINT
252	   **Value:** 15.8 (% projected growth in software developer employment 2024–34)
253	   **Quote:** "Employment of data scientists is projected to increase 33.5 percent between 2024 and 2034. ... The number of software developers is projected to grow by 15.8 percent over this period, though this represents an increase of over 267,000 jobs."
254	
255	5. **Graph:** Healthcare Admin Displacement (`healthcare-admin-displacement`)
256	   **Type:** DATA_POINT
257	   **Value:** -4.9 (% projected decline in medical transcriptionists 2024–34)
258	   **Quote:** "[Medical transcriptionists projected change:] -4.9 [percent change in employment]."
259	
260	**Mapping note:** BLS projections are 10-year horizon (2024–34 or 2025–35 depending on question). Consistent with graph endpoints. First BLS release to include official AI exposure categories as a companion data product.
261	
262	---
263	
264	## Sources Checked but Not Relevant / Outside Window
265	
266	The following URLs were retrieved but either predated the 7-day window significantly, contained no new quantitative AI labor statistics, or were aggregator/opinion content without primary data:
267	
268	- https://blog.letaido.com/ai-job-displacement-statistics — Aggregator roundup, no primary data (Tier 4)
269	- https://axis-intelligence.com/ai-job-displacement-statistics/ — Aggregator/commentary, last updated June 2026 (Tier 4)
270	- https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics — Aggregator, no primary data (Tier 4)
271	- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Manning & Aguirre Brookings companion post (January 2026; previously outside tracking window, not new this week)
272	- https://www.nber.org/papers/w34705 — Manning & Aguirre NBER WP 34705, January 2026; no new data this week
273	- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf — IMF SDN/2026/001 "New Jobs Creation in the AI Age"; exact publication month unclear (2026); referenced in earlier searches but date not confirmed within window
274	- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5842084 — Azar, Gine, Sanz-Espín "The Wage Effects of Generative AI" (SSRN, December 2025); outside window
275	- https://www.nber.org/papers/w34854 — Acemoglu, Autor, Johnson "Building Pro-Worker AI" (February 2026); outside window
276	- https://www.brookings.edu/articles/workforce-policy-for-the-age-of-ai/ — Brookings workforce policy piece, no new quantitative data this week
277	- https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html — Deloitte enterprise AI survey (Aug/Sep 2025 fieldwork), outside window and not AI labor market specific
278	- https://documents1.worldbank.org/curated/en/099827011182513988/pdf/IDU-1300d27a-b3d3-43d9-8a52-047f784776c0.pdf — World Bank "Labor Demand in the Age of Generative AI," date unclear; no new data confirmed this week
279	- https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed FEDS Note, April 3, 2026; outside window
280	
281	---
282	
283	## Recurring Series / Researcher Watchlist Full Sweep Summary
284	
285	All 15 researchers in researcher-watchlist.json had lastChecked: 2026-04-14 (>30 days). New activity found:
286	
287	| Researcher | New Output Found | Notes |
288	|---|---|---|
289	| Daron Acemoglu | "Building Pro-Worker AI" (NBER 34854, Feb 2026) | Outside 7-day window; already significant |
290	| Erik Brynjolfsson | "Canaries" revised Aug 2026; "Min Wages & Robots" NBER 34895 (Feb 2026) | Canaries update is major new data |
291	| Martha Gimbel | Yale Budget Lab tracker updated **Sept 15, 2026** | **IN WINDOW** |
292	| James Bessen | No new AI labor paper confirmed | |
293	| Jed Kolko | PIIE "First Inning" review (March 2026) | Outside window; referenced throughout |
294	| Alex Imas | No new AI labor paper confirmed this week | |
295	| Molly Kinder | Brookings adaptive capacity piece (Jan 2026) | Outside window |
296	| Daniel Rock | No new AI labor paper confirmed | |
297	| Alexander Bick | "What Work Does Generative AI Do?" (Sept 1, 2026) | Just outside window; major output |
298	| David Deming | "What Work Does Generative AI Do?" (Sept 1, 2026) | Just outside window; major output |
299	| Maria del Rio-Chanona | No new paper confirmed this week | |
300	| Andrea Eisfeldt | No new paper confirmed this week | |
301	| Pascual Restrepo | No new paper confirmed this week | |
302	| Shakked Noy | No new paper confirmed this week | |
303	| Neil Thompson | No new paper confirmed this week | |
304	
305	---
306	
307	## Priority Recommendations
308	
309	### Ingest Immediately
310	1. **Yale Budget Lab September 15 Update** (`overall-us-displacement`, `workforce-ai-exposure`) — **Tier 2**, in window, RECURRING UPDATE. Key null finding from a credible, methodologically careful source that now uses causal identification (synthetic DID). Update `lastIngested` for this recurring tracker.
311	
312	2. **Brynjolfsson "Canaries" August 2026 Revision** (`entry-level-wage-impact`) — **Tier 1**, high-frequency ADP administrative data through June 2026. The 19% employment gap for ages 22–25 is the most up-to-date, highest-quality point estimate for entry-level AI displacement effects. Divergence has **widened** from the original 16% finding.
313	
314	3. **Census CES-WP-26-56 "Graduating into Disruption"** (`entry-level-wage-impact`) — **Tier 1**, Census administrative records. -13% initial earnings for most AI-exposed college majors is a new, independent corroboration of entry-level effects using a different dataset and methodology.
315	
316	4. **BLS Employment Projections 2025–35** (`customer-service-automation`, `white-collar-professional-displacement`) — **Tier 1**, official US government 10-year projections. Office and administrative support is projected to shed 752,100 jobs (-4.0%), the most of any major occupational group. Customer service reps: -5.5% / -153,700 jobs.
317	
318	### Statistics That Diverge Significantly from Graph Consensus
319	- **Entry-level employment gap now 19%** (Brynjolfsson August 2026): If the current graph consensus is tracking a lower figure from the original August 2025 paper (16%), this update widens the estimate materially and should shift the data point.
320	- **Apollo wage compression (-6.7 pp)**: This is a new wage channel not previously captured. However, given the study's acknowledged limitations (only 11 high-exposure occupations), classify as overlay only until confirmed by larger datasets.
321	- **Labor share at 52.8%** (BLS Q2 2026): All-time historical low since 1947. Structurally relevant as context for `median-wage-impact` trajectory.
322	
323	### New Government Data Releases
324	- **BLS Employment Projections 2025–35** (Aug 27, 2026): First major BLS projection cycle to explicitly incorporate AI exposure categories. Introduces companion "AI exposure categories" data product. Should be treated as authoritative government baseline for all displacement graph projections.
325	- **Census HTOPS March 2026**: 55% of US workers reported using AI on the job across 11 task categories — this figure directly maps to `genai-work-adoption` as a DATA_POINT.
326	
327	### Watch List for Next Sweep
328	- **IMF SDN/2026/001** ("Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age"): Publication month within 2026 not confirmed; contains quantitative statistics on new skill wage premiums (3–3.4% higher wages for job postings requiring new skills in US/UK) that map to `high-skill-wage-premium`. Retrieve and ingest once date confirmed.
329	- **World Bank "Labor Demand in the Age of Generative AI"**: Job posting panel data 2018Q1–2025Q2; contains quantitative displacement estimates. Date unclear; retrieve for potential ingestion.
330	- **Apollo white paper (Slok & Edlich)**: Original study not yet retrieved directly — only CNBC secondary reporting. Retrieve primary source to verify exact statistics before ingesting as data points.
# AI Labor Research Digest — 2026-09-21

## Summary

The week of September 14–21, 2026 was a relatively quiet one for new primary releases. One source falls squarely within the 7-day window: the Yale Budget Lab's monthly CPS update ("Tracking the Impact of AI on the Labor Market," updated September 15, 2026), which reaffirms that no statistically clear AI-related labor market footprint has yet appeared in aggregate employment data. Several high-quality sources published just outside the window (September 1–13) are included in an *adjacent context* section given their recency and importance: the St. Louis Fed's first nationally representative task-level AI adoption indexes (Bick, Blandin, Deming, Schumacher — Sept 1), the Challenger Gray & Christmas August 2026 job-cuts report (Sept 3), and a CNBC/Apollo Global Management wage-compression analysis (Sept 13). No Tier 1 peer-reviewed paper published strictly within the 7-day window was located. The Yale Budget Lab update is Tier 2. Researchers on the watchlist — particularly Brynjolfsson, Bick, and Gimbel — were active in August–early September with significant new output.

---

## Recurring Series Status

| Series | Status |
|---|---|
| **ellucian-highered-ai** | Not due (nextExpected: 2027-03-01) — no sweep required |
| **Yale Budget Lab AI tracker** *(tracked informally as a recurring series)* | **NEW EDITION** — "Tracking the Impact of AI on the Labor Market," updated September 15, 2026. Continuation of monthly CPS-based tracking; key takeaways unchanged from prior months: no aggregate AI footprint detected in occupational mix, employment, or unemployment data. |
| **Challenger Gray & Christmas** *(monthly)* | August 2026 data published September 3, 2026 — outside 7-day window; noted below. |
| **Census BTOS** *(biweekly)* | Most recently cited through May 3, 2026 data; no new release identified in this window. |
| **BLS Employment Projections** | 2025–35 cycle released August 27, 2026 — outside window; Tier 1 context noted below. |

---

## New Sources — Within 7-Day Window (Sept 14–21, 2026)

### Yale Budget Lab — "Tracking the Impact of AI on the Labor Market" (September 15 Update)
- **Publisher:** The Budget Lab at Yale University
- **Date:** 2026-07-16 (original); **Updated: 2026-09-15** ← within window
- **URL:** https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market
- **Evidence Tier:** 2 (Non-partisan policy research center; uses BLS CPS microdata + Anthropic usage data)
- **Source ID:** yale-budgetlab-ai-tracker-sep2026
- **WATCHLIST:** Martha Gimbel (last checked 2026-04-14; >30 days)
- **RECURRING SERIES UPDATE**

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 0 (no statistically detectable displacement signal)
   **Quote:** "The occupational mix is not yet changing in ways that clearly align with the introduction of AI into the workforce."

2. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (null result)
   **Quote:** "Measures of AI usage show no connection to changes in employment or unemployment."

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 0 (null result on causal identification)
   **Quote:** "A synthetic differences-in-differences analysis of AI exposure does not yet clearly indicate an AI-related labor market footprint."

**Methodological note:** This update incorporates the July 2026 CPS microdata release. The synthetic differences-in-differences design is the Budget Lab's most rigorous causal identification strategy to date, making null findings here more informative than prior descriptive analyses.

---

## Adjacent Context — Sources Published September 1–13, 2026
*(Outside strict 7-day window; included because they post-date the researcher watchlist's last check of April 14, 2026 and are of high priority)*

---

### St. Louis Fed — "What Work Does Generative AI Do?"
- **Publisher:** Federal Reserve Bank of St. Louis (On the Economy blog + companion working paper)
- **Date:** 2026-09-01
- **URL:** https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do
- **Evidence Tier:** 1 (Federal Reserve research; nationally representative Real-Time Population Survey, ~14,000 workers across four quarterly waves Aug 2025–May 2026)
- **Source ID:** stlouisfed-bick-deming-ai-adoption-sep2026
- **WATCHLIST:** Alexander Bick (last checked 2026-04-14; >30 days); David Deming (last checked 2026-04-14; >30 days)

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 45 (% of workers)
   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 62 (% of adults)
   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."

3. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 20 (% threshold — lower bound of widespread adoption)
   **Quote:** "In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%."

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral — nuance: shallow)
   **Value:** 3 (% of job tasks with majority-AI adoption)
   **Quote:** "Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."

5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up — highest adoption sector)
   **Value:** 87.3 (% of computer and information research scientists using AI)
   **Quote:** "Adoption is highest in computing and professional occupations: computer and information research scientists (87.3%), information security analysts (85.4%), and network and computer systems administrators (82.4%)."

**Key methodological contribution:** First nationally representative measures of AI adoption at the level of detailed work tasks (O*NET 2,000 activities). Distinguishes exposure scores from actual adoption — medical secretaries score 61% on exposure but adopt at only 16.8%.

---

### Challenger, Gray & Christmas — August 2026 Job Cut Announcement Report
- **Publisher:** Challenger, Gray & Christmas
- **Date:** 2026-09-03 (released first Thursday of September)
- **URL:** https://www.challengergray.com/wp-content/uploads/2026/09/Challenger-Report-August-2026.pdf
- **Evidence Tier:** 3 (Major labor market research firm; tracks announced — not completed — layoffs)
- **Source ID:** challenger-aug2026-job-cuts

**Statistics:**

1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** DATA_POINT (signal-only)
   **Value:** 116175 (announced AI-attributed cuts Jan–Aug 2026)
   **Quote:** "Across January to August, AI remains the leading year-to-date reason at 116,175 announcements, approximately 22% of the 529,914 total."

2. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (up — growing AI attribution vs prior year)
   **Value:** 22 (% of all 2026 cuts attributed to AI YTD)
   **Quote:** "Artificial Intelligence fell to the fourth-most cited reason with 3,462 cuts in August, its lowest monthly total since December 2025 when 142 cuts were attributed to AI. It ends a five-month run, beginning in March, in which AI was the leading monthly reason."

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up — announced intent signal)
   **Value:** 116175 (announced cuts citing AI, Jan–Aug 2026)
   **Quote:** "116,175 announced U.S. job cuts cited AI as the reason from January through August 2026, about 22% of the 529,914 total." *(Note: these are announcements, not confirmed separations; treat as signal, not displacement data point)*

**Mapping caution:** Challenger data reflects employer-stated reasons for planned cuts, not verified AI-caused separations. Appropriate only as signal/overlay on `earnings-call-ai-mentions`, not as a data point on displacement graphs.

---

### CNBC / Apollo Global Management — "The wages of American workers are under pressure. AI's potential role is drawing more attention"
- **Publisher:** CNBC (reporting on Apollo Global Management white paper by Torsten Slok and Sania Edlich)
- **Date:** 2026-09-13
- **URL:** https://www.cnbc.com/2026/09/13/ai-jobs-pay-inflation.html
- **Evidence Tier:** 3 (Major financial news; reporting on Tier 2 Apollo white paper; original study covers only 321 of ~800 BLS occupations, only 11 meet high-exposure threshold)
- **Source ID:** cnbc-apollo-wages-sep2026

**Statistics:**

1. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** -6.7 (percentage-point differential in wage growth vs less-exposed peers)
   **Quote:** "Their research found that workers in occupations classified as highly exposed to AI experienced real-wage growth that was 6.7 percentage points slower after 2023 than workers in less-exposed occupations."

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down — concentrated at lower earners)
   **Value:** -24.3 (% decline in earnings growth for service workers in AI-exposed roles)
   **Quote:** "The wage compression is concentrated among lower earners: service workers in AI-exposed roles saw a 24.3% decline in earnings growth, and workers in the bottom wage quartile saw a 10.7% decline, while top earners showed no significant effect."

3. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down — employment effect null)
   **Value:** 0 (employment effect — not statistically significant)
   **Quote:** "At the same time, the study found no statistically significant effect on employment. The authors say the results suggest companies may be capturing some of the productivity gains from AI through wage compression rather than workforce reduction."

4. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (down — structural)
   **Value:** 52.8 (labor share of nonfarm business output, Q2 2026 — lowest on record since 1947)
   **Quote:** "labor's share of nonfarm business output/income was 52.8% in the second quarter of 2026, the lowest in the series beginning in the first quarter of 1947, according to the BLS productivity report."

**Methodological caution flagged by experts:** Apollo study used a limited subset of BLS data (321 of ~800 occupations; only 11 met high-exposure threshold). Ben Zipperer (EPI) and David Autor both cautioned against overgeneralizing. Authors themselves call it "early evidence."

---

## Significant Sources from August 2026 (Watchlist Activity — Previously Untracked)

These are not within the 7-day window but are notable because all watchlist researchers were last checked April 14, 2026 (>30 days ago). All represent new findings since the last sweep.

---

### Stanford Digital Economy Lab / ADP — "Canaries in the Coal Mine?" (August 2026 Revised Version)
- **Publisher:** Stanford Digital Economy Lab (Erik Brynjolfsson, Bharat Chandar, Ruyu Chen)
- **Date:** 2026-08 (revised; original August 2025)
- **URL:** https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
- **Evidence Tier:** 1 (Administrative ADP payroll data covering millions of US workers through June 2026; high-frequency; 4.6M workers across 730+ occupations)
- **Source ID:** brynjolfsson-canaries-aug2026
- **WATCHLIST:** Erik Brynjolfsson (last checked 2026-04-14; >30 days)

**Statistics:**

1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** DATA_POINT
   **Value:** -19 (% employment gap vs less-exposed peers)
   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral — null at aggregate)
   **Value:** 0 (no economy-wide displacement detected)
   **Quote:** "We find no evidence of widespread, economy-wide job displacement."

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down — mechanism is reduced hiring, not wage cuts)
   **Value:** 0 (wage/compensation channel — flat)
   **Quote:** "Adjustment is occurring through employment rather than base compensation."

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral — automation substitution vs augmentation split)
   **Value:** 0 (augmented occupations show flat or rising employment)
   **Quote:** "Declines are concentrated in occupations where AI usage primarily substitutes for human tasks; where usage primarily complements workers, employment is flat or rising, especially for experienced workers."

5. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down — divergence widening)
   **Value:** -19 (ongoing divergence — widening over time)
   **Quote:** "This divergence has widened steadily since we first documented it in August 2025."

**Critical context:** The August 2026 revision extends data through June 2026 (+10 months of data vs original). The 19% figure (up from 16% in the original) is the most current and granular large-scale administrative estimate of AI's employment effect on a specific demographic.

---

### Census Bureau CES Working Paper — "Graduating into Disruption: Labor Market Outcomes for AI-Exposed College Majors"
- **Publisher:** U.S. Census Bureau, Center for Economic Studies (CES-WP-26-56)
- **Date:** 2026-08 (August 2026)
- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-56.html
- **Evidence Tier:** 1 (Administrative records on college graduates; Census CES working paper)
- **Source ID:** census-ces-26-56-graduating-disruption

**Statistics:**

1. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** DATA_POINT
   **Value:** -13 (% decline in initial full-quarter earnings for most AI-exposed college majors)
   **Quote:** "In regression-adjusted estimates, the most AI-exposed decile of college majors saw their likelihood of initial employment decline by five percentage points, while full-quarter initial earnings declined by thirteen percent."

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down — employment probability channel)
   **Value:** -5 (percentage-point decline in initial employment probability)
   **Quote:** "the most AI-exposed decile of college majors saw their likelihood of initial employment decline by five percentage points, while full-quarter initial earnings declined by thirteen percent. This earnings decline is comparable in magnitude to the earnings losses associated with graduating into a large recession."

**Mapping note:** The -13% earnings decline maps to `entry-level-wage-impact` as a DATA_POINT (observed, not projected). The recession-severity comparison is striking and corroborates Brynjolfsson's entry-level findings.

---

### U.S. Bureau of Labor Statistics — Employment Projections 2025–35 (AI Exposure Categories)
- **Publisher:** U.S. Bureau of Labor Statistics
- **Date:** 2026-08-27
- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf
- **Evidence Tier:** 1 (Official U.S. government employment projections; BLS)
- **Source ID:** bls-employment-projections-2025-35

**Statistics:**

1. **Graph:** Customer Service Automation (`customer-service-automation`)
   **Type:** DATA_POINT
   **Value:** -5.5 (% projected decline in customer service rep employment 2024–34)
   **Quote:** "Customer service representatives [projected employment change:] -5.5 [percent], [change in employment:] -153,700."

2. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (down — office/admin group fastest declining)
   **Value:** -4.0 (% projected decline for office and administrative support group 2025–35)
   **Quote:** "This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral — net employment growth projected)
   **Value:** 3.5 (% total employment growth 2025–35)
   **Quote:** "Total employment is projected to increase from 170.3 million to 176.2 million and grow 3.5 percent, which is slower than the 10.9 percent growth recorded over the 2015−25 decade."

4. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** DATA_POINT
   **Value:** 15.8 (% projected growth in software developer employment 2024–34)
   **Quote:** "Employment of data scientists is projected to increase 33.5 percent between 2024 and 2034. ... The number of software developers is projected to grow by 15.8 percent over this period, though this represents an increase of over 267,000 jobs."

5. **Graph:** Healthcare Admin Displacement (`healthcare-admin-displacement`)
   **Type:** DATA_POINT
   **Value:** -4.9 (% projected decline in medical transcriptionists 2024–34)
   **Quote:** "[Medical transcriptionists projected change:] -4.9 [percent change in employment]."

**Mapping note:** BLS projections are 10-year horizon (2024–34 or 2025–35 depending on question). Consistent with graph endpoints. First BLS release to include official AI exposure categories as a companion data product.

---

## Sources Checked but Not Relevant / Outside Window

The following URLs were retrieved but either predated the 7-day window significantly, contained no new quantitative AI labor statistics, or were aggregator/opinion content without primary data:

- https://blog.letaido.com/ai-job-displacement-statistics — Aggregator roundup, no primary data (Tier 4)
- https://axis-intelligence.com/ai-job-displacement-statistics/ — Aggregator/commentary, last updated June 2026 (Tier 4)
- https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics — Aggregator, no primary data (Tier 4)
- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Manning & Aguirre Brookings companion post (January 2026; previously outside tracking window, not new this week)
- https://www.nber.org/papers/w34705 — Manning & Aguirre NBER WP 34705, January 2026; no new data this week
- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf — IMF SDN/2026/001 "New Jobs Creation in the AI Age"; exact publication month unclear (2026); referenced in earlier searches but date not confirmed within window
- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5842084 — Azar, Gine, Sanz-Espín "The Wage Effects of Generative AI" (SSRN, December 2025); outside window
- https://www.nber.org/papers/w34854 — Acemoglu, Autor, Johnson "Building Pro-Worker AI" (February 2026); outside window
- https://www.brookings.edu/articles/workforce-policy-for-the-age-of-ai/ — Brookings workforce policy piece, no new quantitative data this week
- https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html — Deloitte enterprise AI survey (Aug/Sep 2025 fieldwork), outside window and not AI labor market specific
- https://documents1.worldbank.org/curated/en/099827011182513988/pdf/IDU-1300d27a-b3d3-43d9-8a52-047f784776c0.pdf — World Bank "Labor Demand in the Age of Generative AI," date unclear; no new data confirmed this week
- https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed FEDS Note, April 3, 2026; outside window

---

## Recurring Series / Researcher Watchlist Full Sweep Summary

All 15 researchers in researcher-watchlist.json had lastChecked: 2026-04-14 (>30 days). New activity found:

| Researcher | New Output Found | Notes |
|---|---|---|
| Daron Acemoglu | "Building Pro-Worker AI" (NBER 34854, Feb 2026) | Outside 7-day window; already significant |
| Erik Brynjolfsson | "Canaries" revised Aug 2026; "Min Wages & Robots" NBER 34895 (Feb 2026) | Canaries update is major new data |
| Martha Gimbel | Yale Budget Lab tracker updated **Sept 15, 2026** | **IN WINDOW** |
| James Bessen | No new AI labor paper confirmed | |
| Jed Kolko | PIIE "First Inning" review (March 2026) | Outside window; referenced throughout |
| Alex Imas | No new AI labor paper confirmed this week | |
| Molly Kinder | Brookings adaptive capacity piece (Jan 2026) | Outside window |
| Daniel Rock | No new AI labor paper confirmed | |
| Alexander Bick | "What Work Does Generative AI Do?" (Sept 1, 2026) | Just outside window; major output |
| David Deming | "What Work Does Generative AI Do?" (Sept 1, 2026) | Just outside window; major output |
| Maria del Rio-Chanona | No new paper confirmed this week | |
| Andrea Eisfeldt | No new paper confirmed this week | |
| Pascual Restrepo | No new paper confirmed this week | |
| Shakked Noy | No new paper confirmed this week | |
| Neil Thompson | No new paper confirmed this week | |

---

## Priority Recommendations

### Ingest Immediately
1. **Yale Budget Lab September 15 Update** (`overall-us-displacement`, `workforce-ai-exposure`) — **Tier 2**, in window, RECURRING UPDATE. Key null finding from a credible, methodologically careful source that now uses causal identification (synthetic DID). Update `lastIngested` for this recurring tracker.

2. **Brynjolfsson "Canaries" August 2026 Revision** (`entry-level-wage-impact`) — **Tier 1**, high-frequency ADP administrative data through June 2026. The 19% employment gap for ages 22–25 is the most up-to-date, highest-quality point estimate for entry-level AI displacement effects. Divergence has **widened** from the original 16% finding.

3. **Census CES-WP-26-56 "Graduating into Disruption"** (`entry-level-wage-impact`) — **Tier 1**, Census administrative records. -13% initial earnings for most AI-exposed college majors is a new, independent corroboration of entry-level effects using a different dataset and methodology.

4. **BLS Employment Projections 2025–35** (`customer-service-automation`, `white-collar-professional-displacement`) — **Tier 1**, official US government 10-year projections. Office and administrative support is projected to shed 752,100 jobs (-4.0%), the most of any major occupational group. Customer service reps: -5.5% / -153,700 jobs.

### Statistics That Diverge Significantly from Graph Consensus
- **Entry-level employment gap now 19%** (Brynjolfsson August 2026): If the current graph consensus is tracking a lower figure from the original August 2025 paper (16%), this update widens the estimate materially and should shift the data point.
- **Apollo wage compression (-6.7 pp)**: This is a new wage channel not previously captured. However, given the study's acknowledged limitations (only 11 high-exposure occupations), classify as overlay only until confirmed by larger datasets.
- **Labor share at 52.8%** (BLS Q2 2026): All-time historical low since 1947. Structurally relevant as context for `median-wage-impact` trajectory.

### New Government Data Releases
- **BLS Employment Projections 2025–35** (Aug 27, 2026): First major BLS projection cycle to explicitly incorporate AI exposure categories. Introduces companion "AI exposure categories" data product. Should be treated as authoritative government baseline for all displacement graph projections.
- **Census HTOPS March 2026**: 55% of US workers reported using AI on the job across 11 task categories — this figure directly maps to `genai-work-adoption` as a DATA_POINT.

### Watch List for Next Sweep
- **IMF SDN/2026/001** ("Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age"): Publication month within 2026 not confirmed; contains quantitative statistics on new skill wage premiums (3–3.4% higher wages for job postings requiring new skills in US/UK) that map to `high-skill-wage-premium`. Retrieve and ingest once date confirmed.
- **World Bank "Labor Demand in the Age of Generative AI"**: Job posting panel data 2018Q1–2025Q2; contains quantitative displacement estimates. Date unclear; retrieve for potential ingestion.
- **Apollo white paper (Slok & Edlich)**: Original study not yet retrieved directly — only CNBC secondary reporting. Retrieve primary source to verify exact statistics before ingesting as data points.