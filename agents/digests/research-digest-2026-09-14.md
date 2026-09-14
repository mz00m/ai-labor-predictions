1	# AI Labor Research Digest — 2026-09-14
2	
3	## Summary
4	
5	This digest covers the period 2026-09-07 through 2026-09-14. The strictly in-window week is thin on Tier 1–2 publications: two Tier 3 sources (iCIMS's September workforce report, published September 10, and a CNBC synthesis article from September 13) constitute the primary new window finds. However, three high-priority **WATCHLIST** hits landed in the days immediately preceding the window (St. Louis Fed/Bick-Deming September 1; Brynjolfsson-Chandar-Chen Canaries revised August 2026; Acemoglu Nature commentary August 21) and are flagged here for ingestion. The most quantitatively significant finding of the week is a CNBC-reported Apollo Global Management study showing workers in highly AI-exposed occupations saw real-wage growth **6.7 percentage points slower** after 2023 than less-exposed peers—with no statistically significant employment effect—suggesting wage compression, not layoffs, as AI's near-term labor channel. The St. Louis Fed WATCHLIST paper (Bick, Blandin, Deming, Schumacher) supplies the freshest direct read on `genai-work-adoption`: **45% of workers** are now using generative AI for their jobs as of May 2026, up from 33% in August 2024.
6	
7	---
8	
9	## Recurring Series Status
10	
11	*(Registry file `recurring-sources.json` — as of sweep date 2026-09-14)*
12	
13	| Series ID | Status |
14	|---|---|
15	| `ellucian-highered-ai` | **NOT DUE** — `nextExpected: 2027-03-01`. Last ingested 2026-03-04 (3rd Annual Higher Education AI Survey). No new edition searched; next sweep March 2027. |
16	
17	> **Informational note (not in registry):** Two high-profile recurring series published immediately *before* this window and are flagged for potential ingestion:
18	> - **Challenger, Gray & Christmas August 2026 Job Cut Report** — published 2026-09-02 (5 days before window). AI cited for 116,175 cuts YTD (22% of all 529,914 cuts). See full entry in WATCHLIST section below.
19	> - **BLS Employment Projections 2025–35** — released 2026-08-27. Projects office/admin support to shed 752,100 jobs (–4.0%) over the decade. Not yet in any tracked registry series.
20	
21	---
22	
23	## Researcher Watchlist Sweep
24	
25	*(All 15 researchers had `lastChecked: 2026-04-14` — 153 days ago, exceeding the 30-day threshold. All were swept.)*
26	
27	**WATCHLIST HITS (new publications found):**
28	
29	| Researcher | Find | Date |
30	|---|---|---|
31	| **Alexander Bick** (St. Louis Fed) | "What Work Does Generative AI Do?" — St. Louis Fed On the Economy blog post + working paper (with Blandin, Deming, Schumacher) | 2026-09-01 |
32	| **David Deming** (Harvard/NBER) | Same paper (co-author) | 2026-09-01 |
33	| **Erik Brynjolfsson** (Stanford DEL) | "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence" — Revised edition, Stanford DEL (with Chandar, Chen) | 2026-08-xx |
34	| **Daron Acemoglu** (MIT) | "Why we must stop talking about artificial general intelligence — and instead build 'pro-worker' AI" — *Nature* commentary | 2026-08-21 |
35	
36	**No new publications found (within 30-day lookback):** Martha Gimbel, James Bessen, Jed Kolko, Alex Imas, Molly Kinder, Daniel Rock, Maria del Rio-Chanona, Andrea Eisfeldt, Pascual Restrepo, Shakked Noy, Neil Thompson.
37	
38	---
39	
40	## New Sources
41	
42	---
43	
44	### iCIMS Insights: September 2026 Workforce Report
45	
46	- **Publisher:** iCIMS, Inc. (with Lightcast data; survey of 1,000 U.S. job seekers)
47	- **Date:** 2026-09-10
48	- **URL:** https://www.icims.com/company/newsroom/septemberinsights2026/
49	- **Evidence Tier:** 3 (Major industry platform with proprietary recruiting data; 3.1M users, 691M candidate profiles; separate 1,000-person survey)
50	- **Source ID:** icims-workforce-sept-2026
51	
52	**Statistics:**
53	
54	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
55	   **Type:** OVERLAY (up)
56	   **Value:** 4 % of U.S. hiring demand
57	   **Quote:** "Using Lightcast data, iCIMS found AI-related roles accounted for about 4% of U.S. hiring demand, compared with 2.7% in the U.K. and 1.2% in France."
58	   **Mapping note:** Lightcast job-posting data, not Census BTOS firm-level adoption survey. Treat as overlay only; unit (share of job postings) differs from BTOS firm-usage %.
59	
60	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
61	   **Type:** OVERLAY (up)
62	   **Value:** 47 % of job seekers building AI skills (self-reported)
63	   **Quote:** "Nearly half are actively building AI skills. 47% of job seekers said they had worked on their AI skills in the past six months, up from 41% a year ago."
64	   **Mapping note:** This is a supply-side skill-building measure among job seekers, not a current-worker usage measure. Directional signal only.
65	
66	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
67	   **Type:** OVERLAY (neutral)
68	   **Value:** 60 % feel ready; 61 % limited to general-purpose tools
69	   **Quote:** "AI confidence is ahead of specialized skill development. 60% said they feel ready to adapt to AI at work, yet 61% described their proficiency as limited to general-purpose tools such as ChatGPT, Copilot or Gemini."
70	   **Mapping note:** Shallow-adoption signal; consistent with St. Louis Fed finding that AI use is widespread but shallow.
71	
72	---
73	
74	### "The wages of American workers are under pressure. AI's potential role is drawing more attention" — CNBC
75	
76	- **Publisher:** CNBC (reporting on Apollo Global Management study by Torsten Slok and Sania Edlich, plus BLS data)
77	- **Date:** 2026-09-13
78	- **URL:** https://www.cnbc.com/2026/09/13/ai-jobs-pay-inflation.html
79	- **Evidence Tier:** 3 (Major financial news; article synthesizes an Apollo internal study + BLS government data)
80	- **Source ID:** cnbc-ai-wage-sep-2026
81	
82	> **Note:** The underlying Apollo study used 321 BLS occupational wage series with 11 meeting the high-exposure threshold, making sample-size limitations significant. The CNBC article includes cautions from economists (Zipperer, Autor, Acemoglu) about methodology. Treat wage statistics as early signals, not settled findings.
83	
84	**Statistics:**
85	
86	1. **Graph:** Median Wage Impact (`median-wage-impact`)
87	   **Type:** OVERLAY (down)
88	   **Value:** −6.7 percentage points (real wage growth differential, post-2023)
89	   **Quote:** "Their research found that workers in occupations classified as highly exposed to AI experienced real-wage growth that was 6.7 percentage points slower after 2023 than workers in less-exposed occupations."
90	   **Mapping note:** This is a *relative* real-wage-growth gap between high- and low-exposure occupations post-2023, not a projected absolute % change in median wages by 2030. Classify as OVERLAY (down) — directional evidence that AI exposure correlates with wage compression. Not a DATA_POINT for the graph's unit (% change in real median wage by 2030).
91	
92	2. **Graph:** Median Wage Impact (`median-wage-impact`)
93	   **Type:** OVERLAY (down)
94	   **Value:** 52.8 % (labor's share of nonfarm business output, Q2 2026)
95	   **Quote:** "labor's share of nonfarm business output/income was 52.8% in the second quarter of 2026, the lowest in the series beginning in the first quarter of 1947, according to the BLS productivity report."
96	   **Mapping note:** This is a macroeconomic signal (labor share at record low) consistent with downward pressure on median wages. Sourced directly from BLS; government Tier 1 data cited through Tier 3 article. Unit is labor share %, not wage growth %, so OVERLAY only.
97	
98	3. **Graph:** Median Wage Impact (`median-wage-impact`)
99	   **Type:** OVERLAY (neutral)
100	   **Value:** No statistically significant employment effect found
101	   **Quote:** "At the same time, the study found no statistically significant effect on employment. The authors say the results suggest companies may be capturing some of the productivity gains from AI through wage compression rather than workforce reduction."
102	   **Mapping note:** Important null result: wage compression without employment decline is inconsistent with displacement-heavy graph scenarios. Does not move displacement graphs.
103	
104	---
105	
106	### **WATCHLIST** — "What Work Does Generative AI Do?" — St. Louis Fed On the Economy Blog
107	
108	- **Publisher:** Federal Reserve Bank of St. Louis (Alexander Bick, Adam Blandin, David Deming, Tyler Schumacher)
109	- **Date:** 2026-09-01 *(6 days before window; included as WATCHLIST find per researcher sweep)*
110	- **URL:** https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do
111	- **Evidence Tier:** 1 (Federal Reserve; nationally representative Real-Time Population Survey, ~14,000 workers surveyed across four quarterly waves Aug 2025–May 2026; companion working paper at St. Louis Fed)
112	- **Source ID:** stlouisfed-bick-deming-genai-work-2026
113	- **WATCHLIST:** Bick (graphRelevance: `genai-work-adoption`); Deming (graphRelevance: `genai-work-adoption`, `high-skill-wage-premium`)
114	
115	**Statistics:**
116	
117	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
118	   **Type:** DATA_POINT
119	   **Value:** 45 % of workers using GenAI for their jobs (May 2026)
120	   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."
121	   **Mapping note:** Nationally representative RPS survey; directly measures the graph's target variable. Clean DATA_POINT. Prior reading was 33% (Aug 2024), now 45% (May 2026), implying sustained upward trend.
122	
123	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
124	   **Type:** OVERLAY (up)
125	   **Value:** >80 % of occupations have at least 20% worker AI adoption
126	   **Quote:** "AI adoption is widespread. In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%."
127	   **Mapping note:** Breadth of adoption across occupational categories. Directional signal consistent with upward trajectory in `genai-work-adoption`.
128	
129	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
130	   **Type:** OVERLAY (neutral)
131	   **Value:** Only 40 % of occupations have adoption rates above 50%; <3% of tasks above 50%
132	   **Quote:** "AI adoption runs shallow almost everywhere. Only 40% of occupations have adoption rates above 50%, and just 16% exceed 70% adoption. Tasks are starker still: Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."
133	   **Mapping note:** "Widespread but shallow" finding is a crucial qualifier. High-share-of-workers-using-AI does *not* mean AI is doing most of the work in those occupations. Suggests the graph's current trajectory may overestimate task-level impact.
134	
135	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
136	   **Type:** OVERLAY (neutral)
137	   **Value:** Medical secretaries: 16.8% actual AI adoption vs. 61% predicted by exposure scores
138	   **Quote:** "Occupations built around sensitive records adopt far less than predicted; for example, medical secretaries and administrative assistants use AI at a 16.8% rate versus a predicted 61%."
139	   **Mapping note:** Demonstrates that exposure scores (the main input to `workforce-ai-exposure` graph) significantly *overestimate* actual adoption in regulated/sensitive-record occupations. Important caveat for that graph's data quality.
140	
141	---
142	
143	### **WATCHLIST** — "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence" (Revised) — Stanford Digital Economy Lab
144	
145	- **Publisher:** Stanford Digital Economy Lab (Erik Brynjolfsson, Bharat Chandar, Ruyu Chen)
146	- **Date:** 2026-08-xx *(exact date within August; included as WATCHLIST find)*
147	- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
148	- **Evidence Tier:** 1 (ADP payroll data through June 2026; peer-reviewed-quality working paper; Tier 1 data source)
149	- **Source ID:** brynjolfsson-canaries-revised-2026
150	- **WATCHLIST:** Brynjolfsson (graphRelevance: `overall-us-displacement`, `genai-work-adoption`, `tech-sector-displacement`, `entry-level-wage-impact`)
151	
152	**Statistics:**
153	
154	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
155	   **Type:** OVERLAY (up)
156	   **Value:** 19 % below trend for ages 22–25 in AI-exposed occupations
157	   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
158	   **Mapping note:** This is a *relative employment gap* for a narrow age cohort (ages 22–25) in AI-exposed occupations vs. their less-exposed peers—not an absolute measure of % of US jobs displaced. Treat as OVERLAY (up) signaling early displacement pressure concentrated at entry level. Do NOT use as DATA_POINT for the overall-us-displacement graph (wrong unit, wrong population). Authors explicitly call these "canaries" and "descriptive indicators" rather than causal estimates.
159	
160	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
161	   **Type:** OVERLAY (down)
162	   **Value:** 19 % employment shortfall for 22–25 year olds vs. peers (employment, not wages)
163	   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
164	   **Mapping note:** The graph tracks "% entry-level wage change by 2030" (wages), but this statistic measures *employment*. Classified OVERLAY (down) as a directional signal that AI is contracting early-career labor demand, which typically precedes wage pressure. Not a DATA_POINT.
165	
166	---
167	
168	### **WATCHLIST** — "Why we must stop talking about artificial general intelligence — and instead build 'pro-worker' AI" — *Nature*
169	
170	- **Publisher:** *Nature* (Daron Acemoglu, MIT)
171	- **Date:** 2026-08-21
172	- **URL:** https://www.nature.com/articles/d41586-026-02566-6
173	- **Evidence Tier:** 1 (*Nature* peer-reviewed journal commentary; cites own and co-authors' established empirical work)
174	- **Source ID:** acemoglu-nature-proworker-2026
175	- **WATCHLIST:** Acemoglu (graphRelevance: `overall-us-displacement`, `median-wage-impact`, `tech-sector-displacement`)
176	
177	**Statistics:**
178	
179	1. **Graph:** Median Wage Impact (`median-wage-impact`)
180	   **Type:** OVERLAY (down)
181	   **Value:** Labor share fell from 58% to 52% of U.S. national income (past four decades)
182	   **Quote:** "Studies of the US labour market suggest that, since 1980, automation has played a crucial part in increasing inequality by reducing demand for workers who perform routine tasks... the adoption of industrial robots in manufacturing offers a clear example: evidence shows that although productivity has increased, many of the communities most exposed to automation experienced employment and wage declines."
183	   **Mapping note:** Long-run structural signal, not AI-specific or near-term. The 52% labor-share figure cited in the companion NBER working paper (w34854) converges with the BLS Q2 2026 reading of 52.8% cited in the CNBC article—two independent confirmations. OVERLAY (down) for `median-wage-impact`.
184	
185	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
186	   **Type:** OVERLAY (neutral)
187	   **Value:** Qualitative (no new quantitative displacement estimate; reaffirms existing framework)
188	   **Quote:** "The dynamic already visible with industrial robots is likely to intensify as AI adoption expands. What is at stake is not only shared prosperity, but also our democratic system."
189	   **Mapping note:** Policy commentary; does not add a new quantitative data point beyond Acemoglu's existing published work. No DATA_POINT mapping appropriate.
190	
191	---
192	
193	### **RECURRING-ADJACENT** — Challenger, Gray & Christmas: August 2026 Job Cut Announcement Report
194	
195	- **Publisher:** Challenger, Gray & Christmas
196	- **Date:** 2026-09-02 *(published 5 days before window; modified 2026-09-08 within window)*
197	- **URL:** https://www.challengergray.com/blog/challenger-report-august-job-cuts-up-58-consumer-products-food-lead/
198	- **Evidence Tier:** 2 (Established industry tracking series; self-reported layoff announcements, not confirmed separations)
199	- **Source ID:** challenger-aug-2026
200	- **Note:** Not currently in `recurring-sources.json`; recommend adding to registry.
201	
202	> **Caveat:** Challenger tracks *announced* layoff plans citing AI as a reason; this is not a confirmed headcount measure. Companies may cite AI for investor signaling purposes, as Challenger itself notes: "Naming AI in a layoff announcement can win over investors while pushing current and prospective employees away."
203	
204	**Statistics:**
205	
206	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
207	   **Type:** OVERLAY (up)
208	   **Value:** 116,175 AI-attributed cuts announced YTD (22% of all 529,914 cuts through August 2026)
209	   **Quote:** "Artificial Intelligence fell to the fourth-most cited reason with 3,462 cuts in August, its lowest monthly total since December 2025 when 142 cuts were attributed to AI. It ends a five-month run, beginning in March, in which AI was the leading monthly reason. So far this year, AI has been cited in 116,175 job cut announcements, approximately 22% of all cuts, and it remains the leading reason year-to-date."
210	   **Mapping note:** OVERLAY (up); these are announced, not actual, job losses attributed to AI. The 22% share is a signal of corporate AI restructuring narrative intensity, not confirmed displacement. Units (raw counts) are incompatible with `overall-us-displacement` graph unit (% of US jobs).
211	
212	2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
213	   **Type:** OVERLAY (up)
214	   **Value:** 155,126 tech-sector cuts through August 2026, +52% vs. same period 2025
215	   **Quote:** "Technology announced 6,103 cuts in August, its lowest monthly total of 2026, for a year-to-date total of 155,126. That is an increase of 52% from the 102,239 cuts announced in this sector through August 2025. Technology still accounts for 29% of all job cuts announced this year, more than any other industry."
216	   **Mapping note:** OVERLAY (up); year-over-year acceleration in tech layoff announcements. Not a % of tech jobs displaced — cannot serve as DATA_POINT.
217	
218	3. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`) — signal-only chart
219	   **Type:** OVERLAY (up)
220	   **Value:** AI as top reason YTD; fourth in August after five consecutive months leading
221	   **Quote:** "Restructuring led all reasons for job cuts in August with 16,173 announced during the month, or 31%. It is the highest monthly restructuring since January's 20,044, and the first month since February that Artificial Intelligence did not lead."
222	   **Mapping note:** The shift from AI #1 to #4 in August after five straight months at #1 is a meaningful signal. The `earnings-call-ai-mentions` graph tracks S&P 500 earnings call mentions, not Challenger reasons—but these two series serve similar early-warning functions. OVERLAY (neutral-to-up for year overall; cooler in August specifically).
223	
224	---
225	
226	### **RECURRING-ADJACENT** — BLS Employment Projections 2025–35
227	
228	- **Publisher:** U.S. Bureau of Labor Statistics
229	- **Date:** 2026-08-27
230	- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf
231	- **Evidence Tier:** 1 (U.S. government official statistical release)
232	- **Source ID:** bls-employment-projections-2025-35
233	- **Note:** Released 11 days before window. Highest-priority item for retroactive ingestion. Not in `recurring-sources.json`; recommend adding.
234	
235	**Statistics:**
236	
237	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
238	   **Type:** OVERLAY (up)
239	   **Value:** −4.0 % office and administrative support (projected 2025–2035); −752,100 jobs
240	   **Quote:** "The continued integration of automation tools, including those powered by AI, into workflows is likely to reduce demand for several office and administrative support occupations. This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."
241	   **Mapping note:** BLS official 10-year projection explicitly links AI to the largest single-category job loss. The –4.0% figure is a projected *employment change* for a subsector, not % of all US jobs. OVERLAY (up) on `overall-us-displacement`. Also relevant as OVERLAY (up) on `healthcare-admin-displacement` — medical secretaries and administrative assistants are subcategories mentioned separately by BLS.
242	
243	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
244	   **Type:** OVERLAY (neutral)
245	   **Value:** +3.5 % total U.S. employment growth 2025–2035 (+5.9 million jobs)
246	   **Quote:** "The U.S. economy is projected to add 5.9 million jobs from 2025 to 2035... Total employment is projected to increase from 170.3 million to 176.2 million and grow 3.5 percent, which is slower than the 10.9 percent growth recorded over the 2015−25 decade."
247	   **Mapping note:** Slower-than-prior-decade growth (3.5% vs. 10.9%) consistent with AI dampening employment momentum, but net positive. OVERLAY (neutral) — does not directly support high-displacement scenarios but shows growth deceleration.
248	
249	3. **Graph:** Creative Industry Displacement (`creative-industry-displacement`)
250	   **Type:** OVERLAY (up)
251	   **Value:** Qualitative (arts/design/media cited as likely to see limited demand from GenAI)
252	   **Quote:** "The use of generative AI software, which can be leveraged to automate repetitive tasks and speed up certain processes, may limit demand for some jobs in the arts, design, entertainment, sports, and media occupational group."
253	   **Mapping note:** No specific numeric % given for creative displacement in this release. OVERLAY (up) as a directional signal from BLS' official view.
254	
255	---
256	
257	## Sources Checked but Not Relevant
258	
259	The following URLs were fetched and reviewed but did not yield new quantitative AI labor statistics publishable within the strict 7-day window, or were found to be outside the window and not WATCHLIST-eligible:
260	
261	- `https://arxiv.org/abs/2509.15265` — "AI and jobs: A review of theory, estimates, and evidence" by del Rio-Chanona et al. **Submitted September 18, 2025** (not 2026). Outside 7-day window and not within watchlist lookback period. Contains useful synthesis statistics (productivity gains 20–60% in RCTs) but all are aggregated from prior literature, not new primary data.
262	- `https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/` — Manning, Aguirre, Muro, Methkupally (Brookings/GovAI). Published **January 21, 2026**; already past the 30-day watchlist lookback and not in the 7-day window. Strong paper; recommend verifying prior ingestion.
263	- `https://www.nber.org/papers/w34859` — Demirer, Horton et al., "Chaining Tasks, Redefining Work." Published **February 2026**; outside all lookback windows.
264	- `https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do` — *Included above* (September 1, 2026; WATCHLIST).
265	- `https://www.cnbc.com/2026/09/13/ai-jobs-pay-inflation.html` — *Included above* (September 13, 2026; in-window).
266	- `https://www.census.gov/library/stories/2026/05/ai-use-businesses.html` — Census BTOS story from May 2026. Outside window; data covers December 2025–May 2026 (17–20% of firms using AI). Not new this week.
267	- `https://www.census.gov/library/stories/2026/08/ai-use-at-work.html` — Census HTOPS August 2026 story. Published before window; reports 55% of U.S. workers used AI on the job in March 2026 HTOPS survey. Not new this week.
268	- `https://www.bls.gov/opub/ted/2026/artificial-intelligence-information-technology-and-employment-2024-34.htm` — BLS Economics Daily from **July 16, 2026**. Outside window.
269	- Multiple Tier 4 aggregator blog posts (letaido.com, axis-intelligence.com, designrush.com, click-vision.com, aiexposure.org, explodingtopics.com, etc.) — no primary data; all recycled prior studies.
270	
271	---
272	
273	## Priority Recommendations
274	
275	### Immediate Ingestion (Tier 1 sources, within or just outside window)
276	
277	1. **🔴 HIGH PRIORITY — BLS Employment Projections 2025–35 (2026-08-27):** Tier 1 government release. Projections explicitly link AI to –752,100 office/admin jobs and –4.0% occupational-group decline. This is the most authoritative forward-looking labor projection released in months. Recommend adding BLS Employment Projections to `recurring-sources.json` with cadence: `biennial`, `nextExpected: 2028-08-01`.
278	
279	2. **🔴 HIGH PRIORITY — Bick/Blandin/Deming/Schumacher St. Louis Fed (2026-09-01):** Tier 1 (Federal Reserve + nationally representative RPS). Supplies current **45% genai-work-adoption DATA_POINT** and introduces new occupation-/task-level indexes showing AI adoption is "widespread but shallow." Supersedes prior Bick-Deming November 2025 RPS readings. Update `genai-work-adoption` graph. This is a WATCHLIST hit for both Bick and Deming; recommend updating `lastChecked` for both researchers.
280	
281	3. **🟡 MEDIUM PRIORITY — Brynjolfsson-Chandar-Chen Canaries Revised (August 2026):** Tier 1 (ADP payroll data, Stanford DEL). The revised paper extends data through June 2026 and sharpens the 19% employment gap for ages 22–25 in AI-exposed occupations. This is a WATCHLIST hit for Brynjolfsson; recommend updating `lastChecked`. The 19% figure should be ingested as an OVERLAY on `overall-us-displacement` (up) and `entry-level-wage-impact` (down). Flag to users: this finding diverges significantly from studies using CPS data that find *no* employment effect — the discrepancy is methodological (ADP vs. CPS sample characteristics).
282	
283	### Statistics That Diverge Significantly from Current Graph Consensus
284	
285	- **Apollo/CNBC wage compression finding:** The –6.7 pp real-wage-growth gap for AI-exposed workers (Apollo, 2026) is a *new empirical* directional finding, but it is based on only 11 high-exposure BLS occupational categories. If the `median-wage-impact` graph currently shows positive or neutral wage projections, this is a bearish diverging signal. Monitor for replication.
286	
287	- **"Widespread but shallow" adoption (Bick/Deming):** The new finding that fewer than 3% of tasks exceed 50% AI adoption—despite 45% of workers using AI for their jobs—suggests that exposure-based models may be overcounting effective AI labor market impact. This is a consensus-challenging finding relevant to `workforce-ai-exposure` and `overall-us-displacement` calibration.
288	
289	- **Labor share at 47-year low (BLS Q2 2026):** Labor's share at 52.8% of nonfarm business output is the lowest since the series began in 1947. If current graph trajectories for `median-wage-impact` do not already reflect a declining labor-share trend, this BLS-sourced data point should prompt a downward adjustment to the overlay.
290	
291	### New Government Data Releases
292	
293	- **BLS Employment Projections 2025–35** (2026-08-27): First full decade projections to explicitly incorporate AI into occupational forecasts. Recommend treating as a high-priority recurring series.
294	- **BLS AI Exposure Categories** (released alongside projections at `bls.gov/emp/publications/ai-exposure-categories.htm`): New BLS data product providing theoretical and observed AI exposure categories across occupations. Recommend fetching full data product for `workforce-ai-exposure` graph calibration.
295	
296	---
297	
298	*Digest prepared: 2026-09-14 | Sources searched: 30+ URLs fetched | Strict 7-day window sources: 2 (iCIMS Sep 10; CNBC Sep 13) | WATCHLIST hits: 4 | Recurring-adjacent: 2*
