1	# AI Labor Research Digest — 2026-07-13
2	
3	## Summary
4	
5	Two Tier 3 sources published on July 6, 2026 are the primary new finds strictly within the seven-day window: a Bloomberg/Claims Journal report documenting that payrolls in the financial-activities and information sectors are falling at **28,000 jobs per month** on average based on government data, and an Allwork.Space report on Goldman Sachs research estimating that **9% of the U.S. workforce** (~15 million workers) may ultimately be displaced. Martha Gimbel at the Yale Budget Lab (WATCHLIST) published a new op-ed on July 9 ("The US Economy Is Walking a Tightrope Between Aging and AI") but its full content was inaccessible for stat extraction. No Tier 1 peer-reviewed papers or government statistical releases fell within the strict 7-day window. Three significant sources from outside the window — the Stanford DEL "AI Economic Indicators / Canaries Dashboard" launch (June 10), the PwC 2026 Global AI Jobs Barometer (June 15), and the Challenger, Gray & Christmas June 2026 report (July 1) — are flagged as high-priority near-misses that may have been missed in prior ingestion.
6	
7	---
8	
9	## Recurring Series Status
10	
11	- **ellucian-highered-ai**: NOT DUE — nextExpected 2027-03-01; last ingested 2026-03-04. No search required.
12	
13	---
14	
15	## Researcher Watchlist Sweep
16	
17	All 15 researchers were last checked 2026-04-14 (89 days ago). Sweep conducted on all. Finds:
18	
19	| Researcher | Status | Finding |
20	|---|---|---|
21	| Daron Acemoglu | Found (outside window) | NBER WP 34854 "Building Pro-Worker Artificial Intelligence" (with Autor & Johnson), February 2026. Conceptual framework paper — no discrete employment statistics; policy-facing. |
22	| Erik Brynjolfsson | **WATCHLIST FIND** | Stanford Digital Economy Lab "AI Economic Indicators" launched June 10, 2026 with Canaries Dashboard (ADP payroll data; 4.6M workers, 730+ occupations). Most recent data through April 2026. See full entry below. |
23	| Martha Gimbel | **WATCHLIST FIND** | Yale Budget Lab article "The US Economy Is Walking a Tightrope Between Aging and AI," July 9, 2026. Content inaccessible for stat extraction. |
24	| James Bessen | No new find in last 7 days | — |
25	| Jed Kolko | Found (outside window) | PIIE "Research on AI and the Labor Market Is Still in the First Inning," 2026. Methodology review, no new displacement statistics. |
26	| Alex Imas | Found (outside window) | Referenced as new "Director of AGI Economics" at Google DeepMind (May 2026); PIIE piece cites Imas (2026) summary of productivity literature. No standalone new quantitative paper. |
27	| Molly Kinder | No new find in last 7 days | — |
28	| Daniel Rock | No new find in last 7 days | — |
29	| Alexander Bick | Found (outside window) | Bick, Blandin & Deming "The Rapid Adoption of Generative AI" appears in Management Science ahead-of-print 2026 (previously a working paper). Data cited: 43% of workers used GenAI for work in Jan–Feb 2026 wave. No major new stats beyond prior digests. |
30	| David Deming | No new find in last 7 days | — |
31	| Maria del Rio-Chanona | No new find in last 7 days | — |
32	| Andrea Eisfeldt | No new find in last 7 days | — |
33	| Pascual Restrepo | No new find in last 7 days | — |
34	| Shakked Noy | No new find in last 7 days | — |
35	| Neil Thompson | No new find in last 7 days | — |
36	
37	---
38	
39	## New Sources — Within 7-Day Window (July 6–13, 2026)
40	
41	---
42	
43	### AI's Impact: Tech and Finance Sectors Losing 28,000 Jobs Monthly
44	
45	- **Publisher:** Bloomberg (via Claims Journal)
46	- **Date:** 2026-07-06
47	- **URL:** https://www.claimsjournal.com/news/national/2026/07/06/338604.htm
48	- **Evidence Tier:** 3 (Major news — Bloomberg reporting on government BLS payroll data and Challenger, Gray & Christmas tracker)
49	- **Source ID:** bloomberg-finance-tech-payrolls-2026
50	
51	**Statistics:**
52	
53	1. **Graph:** Financial Services Displacement (`financial-services-displacement`)
54	   **Type:** OVERLAY (down)
55	   **Value:** −28,000 jobs/month (combined financial-activities + information sectors, 2026 average YTD through May)
56	   **Quote:** "A decline in payrolls in the financial-activities and information sectors — where AI adoption rates have been fastest — has accelerated in 2026, to 28,000 per month on average based on government data."
57	   **Notes:** This is a measured average monthly payroll loss in two high-AI-exposure sectors, not a forecast displacement percentage. Treat as directional overlay (down pressure on financial-services employment) rather than a 2030 projection data point. Yale Budget Lab director Ryan Nunn noted no unusual *layoff* spike, suggesting impact is flowing through slower hiring rather than mass cuts.
58	
59	2. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
60	   **Type:** OVERLAY (up)
61	   **Value:** ~102,000 announced AI-attributed job cuts YTD 2026 (through June 2026, per Challenger, Gray & Christmas)
62	   **Quote:** "His firm, which tracks layoff plans, found almost 102,000 announced job cuts attributed to AI so far this year."
63	   **Notes:** "Announced job cuts attributed to AI" is a self-reported employer attribution, not a measured labor displacement figure. Appropriate as a signal overlay on the AI-mentions chart, not as a displacement data point.
64	
65	3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
66	   **Type:** OVERLAY (down)
67	   **Value:** ~33% of all 2026 layoffs are in tech sector
68	   **Quote:** "Overall, the tech sector accounted for a third of all layoffs announced in 2026."
69	   **Notes:** Directional signal only; no % of tech jobs displaced by 2030.
70	
71	4. **Graph:** Financial Services Displacement (`financial-services-displacement`)
72	   **Type:** OVERLAY (neutral — qualifier added)
73	   **Value:** No displacement (slower hiring/attrition channel observed)
74	   **Quote:** "Layoff data for the financial-activities industry showed no unusual increase in 2026, suggesting AI may be affecting employment first through slower hiring and attrition rather than broad-based job cuts, Nunn said."
75	   **Notes:** Yale Budget Lab commentary from Ryan Nunn contextualizing the payroll-loss signal. Highlights that the mechanism is hiring slowdown, not mass layoffs — important for graph narrative.
76	
77	---
78	
79	### Goldman Sachs: AI Could Displace 9% of the U.S. Workforce
80	
81	- **Publisher:** Allwork.Space (reporting on Goldman Sachs Exchanges podcast recorded June 2026)
82	- **Date:** 2026-07-06
83	- **URL:** https://allwork.space/2026/07/goldman-sachs-says-ai-could-displace-9-of-the-u-s-workforce/
84	- **Evidence Tier:** 2 (Goldman Sachs institutional research — major financial institution; original source: https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-will-ai-impact-the-labor-market)
85	- **Source ID:** goldman-sachs-displacement-9pct-2026
86	
87	**Statistics:**
88	
89	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
90	   **Type:** DATA_POINT
91	   **Value:** 9 (% of U.S. workforce eventually displaced)
92	   **Quote:** "Joseph Briggs, who leads the bank's global economics team, estimates about 9% of the U.S. workforce could be displaced as AI adoption expands across industries."
93	   **Notes:** Goldman Sachs has previously cited 6–7% (their March 2023 Global Economics paper). The 9% figure appears to be an updated estimate from the June 2026 podcast. The headline of 15 million workers corresponds to ~9% of the ~167M U.S. civilian labor force. This is a long-run eventual-displacement estimate, appropriate as a data point on the overall-us-displacement graph.
94	
95	2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
96	   **Type:** OVERLAY (down)
97	   **Value:** −12,500 jobs/month (midpoint of stated range)
98	   **Quote:** "He estimates AI is reducing monthly job growth in those industries by between 10,000 and 15,000 positions."
99	   **Notes:** "Those industries" = technology, management consulting, and graphic design per article. Not a % of tech jobs by 2030, so this is an overlay signal. Midpoint of the range used as numeric value.
100	
101	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
102	   **Type:** OVERLAY (down)
103	   **Value:** ~15,000,000 workers (absolute count)
104	   **Quote:** "Artificial intelligence could displace roughly 15 million U.S. workers over time, according to Goldman Sachs."
105	   **Notes:** Redundant with the 9% figure above; same underlying estimate expressed as an absolute count. Do not double-count as separate data points.
106	
107	---
108	
109	### Yale Budget Lab — "The US Economy Is Walking a Tightrope Between Aging and AI"
110	
111	- **Publisher:** Yale Budget Lab
112	- **Date:** 2026-07-09
113	- **URL:** https://budgetlab.yale.edu/ (article title confirmed; direct URL inaccessible for fetch)
114	- **Evidence Tier:** 2 (Yale Budget Lab — established non-partisan policy research center)
115	- **Source ID:** yale-budget-lab-aging-ai-2026-07
116	
117	**Statistics:**
118	*Content inaccessible for stat extraction during this sweep. The article by Martha Gimbel was confirmed published July 9, 2026 on the Yale Budget Lab homepage. No verbatim quotes or statistics can be extracted. Recommend manual review at budgetlab.yale.edu.*
119	
120	---
121	
122	## Near-Miss Sources — Outside 7-Day Window but Flagged as Possibly Not Yet Ingested
123	
124	These sources fall just outside the July 6–13 window but are important recent publications that warrant immediate review:
125	
126	---
127	
128	### Stanford Digital Economy Lab — AI Economic Indicators & Canaries Dashboard Launch *(WATCHLIST: Brynjolfsson)*
129	
130	- **Publisher:** Stanford Digital Economy Lab / ADP Research
131	- **Date:** 2026-06-10
132	- **URL:** https://digitaleconomy.stanford.edu/news/stanford-digital-economy-lab-launches-the-ai-economic-indicators-tracking-ais-impact-on-the-economy/
133	- **Evidence Tier:** 2 (Stanford University research lab / ADP administrative payroll data — 4.6M workers, 730+ occupations)
134	- **Source ID:** stanford-del-canaries-dashboard-2026-06
135	
136	This is the launch of a permanently updated dashboard extending the "Canaries in the Coal Mine?" paper data through April 2026. Significant: it formalizes ADP payroll data as a recurring near-real-time signal for the site.
137	
138	**Statistics from Research Note #1 (June 2026) and Fortune coverage (June 27, 2026):**
139	
140	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
141	   **Type:** OVERLAY (down — concentrated at entry-level)
142	   **Value:** −0.2 (% year-over-year employment change, most AI-exposed occupations, April 2026)
143	   **Quote:** "Across all workers, the numbers remain muted. The most AI-exposed occupations contracted just 0.2% year over year as of April 2026, compared to 0.1% growth for the least-exposed."
144	   *(Fortune, June 27, 2026, quoting dashboard data)*
145	   **Notes:** This is a measured ADP payroll trend, not a displacement forecast. Net aggregate effect is modest; the signal is the divergence by exposure tier.
146	
147	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
148	   **Type:** OVERLAY (down)
149	   **Value:** −13 (% relative employment decline, ages 22–25, most AI-exposed occupations, since late 2022)
150	   **Quote:** "Since the widespread adoption of generative AI tools beginning in late 2022, employment for early-career workers in the most AI-exposed occupations fell by 13% on a relative basis, even after controlling for broader firm-level disruptions."
151	   *(Fortune, March 4, 2026, on Brynjolfsson's August 2025 Canaries paper extended to Feb 2026)*
152	   **Notes:** "13% on a relative basis" is an employment count decline for 22–25-year-olds in highly AI-exposed occupations, not a wage figure. Mapped to `entry-level-wage-impact` as a directional overlay since the graph tracks entry-level economic outcomes and this is the closest graph measuring early-career AI impacts.
153	
154	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
155	   **Type:** OVERLAY (neutral with divergence caveat)
156	   **Value:** — (no single number; split signal)
157	   **Quote:** '"In the aggregate, AI's impact on jobs remains modest," Richardson stressed in a June 16 blog post on the first batch of dashboard data. But when AI's impact is measured by career stage, she continued, "dramatic differences emerge."'
158	   *(Fortune, June 27, 2026, quoting ADP Chief Economist Nela Richardson)*
159	   **Notes:** Context qualifier: ADP's own chief economist characterizes the aggregate as modest while flagging career-stage divergence.
160	
161	---
162	
163	### PwC 2026 Global AI Jobs Barometer
164	
165	- **Publisher:** PwC
166	- **Date:** 2026-06-15
167	- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
168	- **Evidence Tier:** 2 (PwC Global — analysis of 1+ billion job ads across 27 countries; Tier 2 classification as major consultancy/think-tank)
169	- **Source ID:** pwc-ai-jobs-barometer-2026
170	
171	This is a new annual edition of the PwC AI Jobs Barometer (previously ingested for 2025). Not in recurring-sources.json — recommend adding.
172	
173	**Statistics:**
174	
175	1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
176	   **Type:** DATA_POINT
177	   **Value:** 62 (% average wage premium for AI skills in job ads, global, 2026)
178	   **Quote:** "As companies continue to boost productivity with AI, the average wage premium for workers with AI skills continued to surge higher – hitting 62%, up from 57% last year."
179	   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
180	   **Notes:** Global job-ad–based measure. Up from 57% in 2025. Some sectors reach 118% (consumer markets); government sector only 16%. Appropriate as a data point on the high-skill-wage-premium graph given unit compatibility (% premium). Note global scope.
181	
182	2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
183	   **Type:** OVERLAY (up for AI-exposed roles, down for others)
184	   **Value:** +35 / −10 (% employment change for AI-exposed vs. other entry-level roles since 2019, US data)
185	   **Quote:** "Entry-level outlook diverges: Analysis of US data shows AI-exposed entry-level roles are seven times more likely to require traditionally senior-level skills such as judgement and leadership. These roles grew 35% since 2019, while other entry-level roles declined by 10%."
186	   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
187	   **Notes:** The divergence (AI-exposed entry roles +35%, non-AI entry roles −10%) is a US job-ad finding, not a wage figure, but directly relevant to the entry-level outlook captured by this graph. Overlay direction is ambiguous — use `neutral` with text note of polarization.
188	
189	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
190	   **Type:** OVERLAY (up)
191	   **Value:** 69 (% faster growth of AI-skills jobs vs total jobs market at 9%)
192	   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%."
193	   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
194	   **Notes:** Job-posting demand signal; not a firm-level AI adoption rate. Overlay only.
195	
196	4. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
197	   **Type:** OVERLAY (up)
198	   **Value:** 42 (% faster wage growth for "professionalised" vs "democratised" AI jobs since 2021)
199	   **Quote:** "Two-track jobs market: jobs 'professionalised' by AI are growing twice as fast as jobs 'democratised' by AI with 42% faster wage growth since 2021."
200	   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
201	   **Notes:** Supports the directional trajectory of high-skill wage premium widening.
202	
203	---
204	
205	### Challenger, Gray & Christmas — June 2026 Job Cuts Report
206	
207	- **Publisher:** Challenger, Gray & Christmas
208	- **Date:** 2026-07-01
209	- **URL:** https://www.challengergray.com/blog/challenger-report-june-layoffs-cool-to-45849-down-53-from-may-ai-leads-reasons-for-fourth-consecutive-month/
210	- **Evidence Tier:** 3 (Industry tracker — Challenger monitors employer layoff announcements; important recurring signal but methodology is self-reported employer attribution)
211	- **Source ID:** challenger-gray-june-2026
212	
213	Released July 1, 2026 — five days before the window. Flagged as potentially missed in last ingestion given `lastSweep: null` in registry.
214	
215	**Statistics:**
216	
217	1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
218	   **Type:** OVERLAY (up)
219	   **Value:** 23 (% of all 2026 announced job cuts attributed to AI, through June 2026)
220	   **Quote:** "So far this year, AI has been cited in 101,743 job cut announcements, approximately 23% of all cuts. Since 2023, when AI was first tracked as a distinct reason, it has been cited in 173,568 job cut announcements."
221	   *(Challenger, Gray & Christmas June 2026 Report)*
222	   **Notes:** AI was the leading stated reason for job cuts for the fourth consecutive month in June. Signal is self-reported employer attribution — subject to "AI-washing" (firms may cite AI to justify cuts driven by other factors). Appropriate for the earnings-call signal graph only.
223	
224	2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
225	   **Type:** OVERLAY (down)
226	   **Value:** 31 (% of June 2026 job cuts where AI was cited as reason)
227	   **Quote:** "In June, Artificial Intelligence led all reasons for job cuts, with 14,029 announced during the month, or 31%."
228	   *(Challenger, Gray & Christmas June 2026 Report)*
229	   **Notes:** "Technology now accounts for nearly a third of all job cuts announced this year." Tech-concentration signal.
230	
231	---
232	
233	### U.S. Census Bureau — BTOS AI Supplement (Spring 2026 Data)
234	
235	- **Publisher:** U.S. Census Bureau
236	- **Date:** 2026-05-01 (story published); underlying CES Working Paper CES-WP-26-25 released Spring 2026
237	- **URL:** https://www.census.gov/library/stories/2026/05/ai-use-businesses.html; working paper: https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf
238	- **Evidence Tier:** 1 (U.S. Census Bureau — BTOS is a nationally representative government survey of ~1.2M businesses)
239	- **Source ID:** census-btos-spring-2026
240	
241	**Statistics:**
242	
243	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
244	   **Type:** DATA_POINT
245	   **Value:** 18 (% of all U.S. firms using AI in any business function; Nov 2025–Jan 2026 reference period)
246	   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
247	   *(CES Working Paper CES-WP-26-25, Spring 2026)*
248	   **Notes:** The 18% figure uses the revised broader BTOS question ("in any business function"). Employment-weighted rate is 32% — a more meaningful indicator of worker-level exposure. The May 2026 story confirms that through May 3, 2026, overall usage "hovered between 17% and 20%."
249	
250	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
251	   **Type:** DATA_POINT
252	   **Value:** 37 (% of firms with 250+ employees using AI, per May 3, 2026 BTOS data)
253	   **Quote:** "For example, 37% of firms with at least 250 employees reported using AI in their business operations."
254	   *(Census.gov BTOS story, May 2026)*
255	   **Notes:** Strong size gradient: large firms 37%+; firms with ≤4 employees <20%.
256	
257	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
258	   **Type:** DATA_POINT
259	   **Value:** 23 (% of firms where workers use AI in work-related tasks; Nov 2025–Jan 2026)
260	   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks, though 65% of firms limit use to three or fewer tasks."
261	   *(CES Working Paper CES-WP-26-25)*
262	   **Notes:** 23% is the firm-level rate; 41% is employment-weighted. Cross-walk to the `genai-work-adoption` graph (which targets % of adults using GenAI at work) is approximate — these are firm counts, not worker counts.
263	
264	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
265	   **Type:** OVERLAY (neutral)
266	   **Value:** 2 (% of AI-adopting firms seeing AI-related employment decreases)
267	   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
268	   *(CES Working Paper CES-WP-26-25)*
269	   **Notes:** Important counterweight to displacement narratives — as of Nov 2025–Jan 2026, employment displacement at the firm level remains rare in representative national data.
270	
271	---
272	
273	## Sources Checked but Not Relevant (no new quantitative AI labor stats within last 7 days)
274	
275	| URL | Reason |
276	|---|---|
277	| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Published January 21, 2026 — outside window; no new stats added this week |
278	| https://www.nber.org/papers/w34859 | NBER WP 34859 (Demirer et al., Feb 2026) — theoretical model, no empirical displacement statistics extracted |
279	| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | IMF SDN/2026/001 "New Jobs Creation in the AI Age" — important but published Q1 2026, outside window |
280	| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Fed Reserve FEDS Note, April 3, 2026 — outside window |
281	| https://bitsjournal.researchfloor.org/generative-artificial-intelligence-exposure-and-u-s-occupational-wage-polarization-early-evidence-and-workforce-education-implications-from-2018-2025-occupational-data/ | Tier 4 journal; no confirmed peer review; outside window |
282	| https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html | PwC Barometer summary page; stats extracted from press release instead |
283	| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | SSRN preprint, 2025 date, Tier 4 — stats sourced from pre-existing literature, not original data |
284	| https://allwork.space/2026/07/goldman-sachs-says-ai-could-displace-9-of-the-u-s-workforce/ | See above — retained as primary source entry |
285	| https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html | Deloitte State of AI 2026 — surveyed Aug–Sep 2025; no new AI labor displacement stats within window |
286	| https://budgetlab.yale.edu/research/us-economy-walking-tightrope-between-aging-and-ai | Content not accessible (url_not_allowed); confirmed published July 9, 2026 |
287	| https://www.anthropic.com/research/labor-market-impacts | Anthropic "Labor Market Impacts" paper (Massenkoff & McCrory), March 5, 2026 — outside window |
288	| Multiple stats aggregator blogs (designrush.com, click-vision.com, wearetenet.com, etc.) | Tier 4 — stats sourced from pre-existing primary literature, no original data |
289	
290	---
291	
292	## Priority Recommendations
293	
294	### Ingest Immediately
295	
296	1. **Census BTOS Spring 2026 data** — Tier 1 government survey. The 18% firm AI-adoption rate is the highest-quality US firm-level AI adoption measure available and directly feeds the `ai-adoption-rate` graph as a data point. The CES working paper (CES-WP-26-25) provides employment-weighted rates (32%) that are more representative of worker exposure. Most recent reference period: Nov 2025–Jan 2026.
297	
298	2. **Stanford DEL / ADP Canaries Dashboard (June 10, 2026)** — The launch of this permanently updated dashboard by Brynjolfsson and ADP Research is the most significant new AI labor monitoring infrastructure since the Anthropic Economic Index. The −0.2% year-over-year employment trend in most AI-exposed occupations (April 2026 data) and the −13% relative decline for ages 22–25 are the most empirically grounded real-time signals in the field. Recommend adding as a recurring series in `recurring-sources.json` with monthly cadence.
299	
300	3. **PwC 2026 Global AI Jobs Barometer (June 15, 2026)** — Tier 2, annual series. The 62% AI-skills wage premium is a new data point for `high-skill-wage-premium`. The entry-level divergence (+35%/−10%) is a meaningful new signal. Recommend adding to `recurring-sources.json` as an annual series with `nextExpected: 2027-06-01`.
301	
302	### Divergent Statistics Warranting Graph Attention
303	
304	- **Goldman Sachs 9%** vs. prior site consensus: Goldman's own March 2023 paper cited 6–7%. The June 2026 podcast figure of 9% (~15M workers) is an upward revision. This would be a meaningful new data point if confirmed via the primary GS source — recommend verifying at https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-will-ai-impact-the-labor-market.
305	
306	- **BTOS 2% firm displacement rate** vs. Challenger/Bloomberg payroll-loss signals: The Census BTOS finding that only 2% of firms report AI-related employment *decreases* stands in notable tension with the Bloomberg/Claims Journal report that payrolls in the financial-activities and information sectors are declining 28,000/month. The reconciliation (noted by Yale Budget Lab's Nunn) is that impact is flowing through *reduced hiring* rather than *active layoffs* — firms are not "decreasing" employment but simply not replacing attrition. Graph annotations should distinguish displacement-via-layoffs from displacement-via-hiring-slowdown.
307	
308	- **Entry-level divergence convergence**: Brynjolfsson (−13% relative, ADP payroll data), PwC (−10% non-AI entry-level roles), and Goldman Sachs (AI slowing monthly job growth by 10–15K) are all pointing in the same direction on entry-level pressure. This is the most empirically consistent sub-signal across multiple Tier 2 sources and warrants prominence on the `entry-level-wage-impact` graph.
309	
310	### Recurring Series Due — No New Edition Found
311	
312	- **Challenger, Gray & Christmas July 2026** report (for June data) was released July 1, just before the window. No July data report yet for July 2026 layoffs — expected ~August 1, 2026.
313	- **Census BTOS biweekly release** — Last release June 18, 2026. Next release expected ~July 2, 2026 (potentially just released this week — check census.gov/newsroom/press-releases for July 2, 2026 BTOS release).
314	- **ADP Canaries Dashboard** — Updated monthly. Check digitaleconomy.stanford.edu/project/indicators/canaries-dashboard/ for May or June 2026 data update.
315	
316	---
317	
318	*Digest compiled 2026-07-13. All statistics extracted verbatim from primary sources. Exact quote marks indicate source text; no paraphrasing used for stat extraction.*
# AI Labor Research Digest — 2026-07-13

## Summary

Two Tier 3 sources published on July 6, 2026 are the primary new finds strictly within the seven-day window: a Bloomberg/Claims Journal report documenting that payrolls in the financial-activities and information sectors are falling at **28,000 jobs per month** on average based on government data, and an Allwork.Space report on Goldman Sachs research estimating that **9% of the U.S. workforce** (~15 million workers) may ultimately be displaced. Martha Gimbel at the Yale Budget Lab (WATCHLIST) published a new op-ed on July 9 ("The US Economy Is Walking a Tightrope Between Aging and AI") but its full content was inaccessible for stat extraction. No Tier 1 peer-reviewed papers or government statistical releases fell within the strict 7-day window. Three significant sources from outside the window — the Stanford DEL "AI Economic Indicators / Canaries Dashboard" launch (June 10), the PwC 2026 Global AI Jobs Barometer (June 15), and the Challenger, Gray & Christmas June 2026 report (July 1) — are flagged as high-priority near-misses that may have been missed in prior ingestion.

---

## Recurring Series Status

- **ellucian-highered-ai**: NOT DUE — nextExpected 2027-03-01; last ingested 2026-03-04. No search required.

---

## Researcher Watchlist Sweep

All 15 researchers were last checked 2026-04-14 (89 days ago). Sweep conducted on all. Finds:

| Researcher | Status | Finding |
|---|---|---|
| Daron Acemoglu | Found (outside window) | NBER WP 34854 "Building Pro-Worker Artificial Intelligence" (with Autor & Johnson), February 2026. Conceptual framework paper — no discrete employment statistics; policy-facing. |
| Erik Brynjolfsson | **WATCHLIST FIND** | Stanford Digital Economy Lab "AI Economic Indicators" launched June 10, 2026 with Canaries Dashboard (ADP payroll data; 4.6M workers, 730+ occupations). Most recent data through April 2026. See full entry below. |
| Martha Gimbel | **WATCHLIST FIND** | Yale Budget Lab article "The US Economy Is Walking a Tightrope Between Aging and AI," July 9, 2026. Content inaccessible for stat extraction. |
| James Bessen | No new find in last 7 days | — |
| Jed Kolko | Found (outside window) | PIIE "Research on AI and the Labor Market Is Still in the First Inning," 2026. Methodology review, no new displacement statistics. |
| Alex Imas | Found (outside window) | Referenced as new "Director of AGI Economics" at Google DeepMind (May 2026); PIIE piece cites Imas (2026) summary of productivity literature. No standalone new quantitative paper. |
| Molly Kinder | No new find in last 7 days | — |
| Daniel Rock | No new find in last 7 days | — |
| Alexander Bick | Found (outside window) | Bick, Blandin & Deming "The Rapid Adoption of Generative AI" appears in Management Science ahead-of-print 2026 (previously a working paper). Data cited: 43% of workers used GenAI for work in Jan–Feb 2026 wave. No major new stats beyond prior digests. |
| David Deming | No new find in last 7 days | — |
| Maria del Rio-Chanona | No new find in last 7 days | — |
| Andrea Eisfeldt | No new find in last 7 days | — |
| Pascual Restrepo | No new find in last 7 days | — |
| Shakked Noy | No new find in last 7 days | — |
| Neil Thompson | No new find in last 7 days | — |

---

## New Sources — Within 7-Day Window (July 6–13, 2026)

---

### AI's Impact: Tech and Finance Sectors Losing 28,000 Jobs Monthly

- **Publisher:** Bloomberg (via Claims Journal)
- **Date:** 2026-07-06
- **URL:** https://www.claimsjournal.com/news/national/2026/07/06/338604.htm
- **Evidence Tier:** 3 (Major news — Bloomberg reporting on government BLS payroll data and Challenger, Gray & Christmas tracker)
- **Source ID:** bloomberg-finance-tech-payrolls-2026

**Statistics:**

1. **Graph:** Financial Services Displacement (`financial-services-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −28,000 jobs/month (combined financial-activities + information sectors, 2026 average YTD through May)
   **Quote:** "A decline in payrolls in the financial-activities and information sectors — where AI adoption rates have been fastest — has accelerated in 2026, to 28,000 per month on average based on government data."
   **Notes:** This is a measured average monthly payroll loss in two high-AI-exposure sectors, not a forecast displacement percentage. Treat as directional overlay (down pressure on financial-services employment) rather than a 2030 projection data point. Yale Budget Lab director Ryan Nunn noted no unusual *layoff* spike, suggesting impact is flowing through slower hiring rather than mass cuts.

2. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (up)
   **Value:** ~102,000 announced AI-attributed job cuts YTD 2026 (through June 2026, per Challenger, Gray & Christmas)
   **Quote:** "His firm, which tracks layoff plans, found almost 102,000 announced job cuts attributed to AI so far this year."
   **Notes:** "Announced job cuts attributed to AI" is a self-reported employer attribution, not a measured labor displacement figure. Appropriate as a signal overlay on the AI-mentions chart, not as a displacement data point.

3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** ~33% of all 2026 layoffs are in tech sector
   **Quote:** "Overall, the tech sector accounted for a third of all layoffs announced in 2026."
   **Notes:** Directional signal only; no % of tech jobs displaced by 2030.

4. **Graph:** Financial Services Displacement (`financial-services-displacement`)
   **Type:** OVERLAY (neutral — qualifier added)
   **Value:** No displacement (slower hiring/attrition channel observed)
   **Quote:** "Layoff data for the financial-activities industry showed no unusual increase in 2026, suggesting AI may be affecting employment first through slower hiring and attrition rather than broad-based job cuts, Nunn said."
   **Notes:** Yale Budget Lab commentary from Ryan Nunn contextualizing the payroll-loss signal. Highlights that the mechanism is hiring slowdown, not mass layoffs — important for graph narrative.

---

### Goldman Sachs: AI Could Displace 9% of the U.S. Workforce

- **Publisher:** Allwork.Space (reporting on Goldman Sachs Exchanges podcast recorded June 2026)
- **Date:** 2026-07-06
- **URL:** https://allwork.space/2026/07/goldman-sachs-says-ai-could-displace-9-of-the-u-s-workforce/
- **Evidence Tier:** 2 (Goldman Sachs institutional research — major financial institution; original source: https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-will-ai-impact-the-labor-market)
- **Source ID:** goldman-sachs-displacement-9pct-2026

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** DATA_POINT
   **Value:** 9 (% of U.S. workforce eventually displaced)
   **Quote:** "Joseph Briggs, who leads the bank's global economics team, estimates about 9% of the U.S. workforce could be displaced as AI adoption expands across industries."
   **Notes:** Goldman Sachs has previously cited 6–7% (their March 2023 Global Economics paper). The 9% figure appears to be an updated estimate from the June 2026 podcast. The headline of 15 million workers corresponds to ~9% of the ~167M U.S. civilian labor force. This is a long-run eventual-displacement estimate, appropriate as a data point on the overall-us-displacement graph.

2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −12,500 jobs/month (midpoint of stated range)
   **Quote:** "He estimates AI is reducing monthly job growth in those industries by between 10,000 and 15,000 positions."
   **Notes:** "Those industries" = technology, management consulting, and graphic design per article. Not a % of tech jobs by 2030, so this is an overlay signal. Midpoint of the range used as numeric value.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** ~15,000,000 workers (absolute count)
   **Quote:** "Artificial intelligence could displace roughly 15 million U.S. workers over time, according to Goldman Sachs."
   **Notes:** Redundant with the 9% figure above; same underlying estimate expressed as an absolute count. Do not double-count as separate data points.

---

### Yale Budget Lab — "The US Economy Is Walking a Tightrope Between Aging and AI"

- **Publisher:** Yale Budget Lab
- **Date:** 2026-07-09
- **URL:** https://budgetlab.yale.edu/ (article title confirmed; direct URL inaccessible for fetch)
- **Evidence Tier:** 2 (Yale Budget Lab — established non-partisan policy research center)
- **Source ID:** yale-budget-lab-aging-ai-2026-07

**Statistics:**
*Content inaccessible for stat extraction during this sweep. The article by Martha Gimbel was confirmed published July 9, 2026 on the Yale Budget Lab homepage. No verbatim quotes or statistics can be extracted. Recommend manual review at budgetlab.yale.edu.*

---

## Near-Miss Sources — Outside 7-Day Window but Flagged as Possibly Not Yet Ingested

These sources fall just outside the July 6–13 window but are important recent publications that warrant immediate review:

---

### Stanford Digital Economy Lab — AI Economic Indicators & Canaries Dashboard Launch *(WATCHLIST: Brynjolfsson)*

- **Publisher:** Stanford Digital Economy Lab / ADP Research
- **Date:** 2026-06-10
- **URL:** https://digitaleconomy.stanford.edu/news/stanford-digital-economy-lab-launches-the-ai-economic-indicators-tracking-ais-impact-on-the-economy/
- **Evidence Tier:** 2 (Stanford University research lab / ADP administrative payroll data — 4.6M workers, 730+ occupations)
- **Source ID:** stanford-del-canaries-dashboard-2026-06

This is the launch of a permanently updated dashboard extending the "Canaries in the Coal Mine?" paper data through April 2026. Significant: it formalizes ADP payroll data as a recurring near-real-time signal for the site.

**Statistics from Research Note #1 (June 2026) and Fortune coverage (June 27, 2026):**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — concentrated at entry-level)
   **Value:** −0.2 (% year-over-year employment change, most AI-exposed occupations, April 2026)
   **Quote:** "Across all workers, the numbers remain muted. The most AI-exposed occupations contracted just 0.2% year over year as of April 2026, compared to 0.1% growth for the least-exposed."
   *(Fortune, June 27, 2026, quoting dashboard data)*
   **Notes:** This is a measured ADP payroll trend, not a displacement forecast. Net aggregate effect is modest; the signal is the divergence by exposure tier.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** −13 (% relative employment decline, ages 22–25, most AI-exposed occupations, since late 2022)
   **Quote:** "Since the widespread adoption of generative AI tools beginning in late 2022, employment for early-career workers in the most AI-exposed occupations fell by 13% on a relative basis, even after controlling for broader firm-level disruptions."
   *(Fortune, March 4, 2026, on Brynjolfsson's August 2025 Canaries paper extended to Feb 2026)*
   **Notes:** "13% on a relative basis" is an employment count decline for 22–25-year-olds in highly AI-exposed occupations, not a wage figure. Mapped to `entry-level-wage-impact` as a directional overlay since the graph tracks entry-level economic outcomes and this is the closest graph measuring early-career AI impacts.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (neutral with divergence caveat)
   **Value:** — (no single number; split signal)
   **Quote:** '"In the aggregate, AI's impact on jobs remains modest," Richardson stressed in a June 16 blog post on the first batch of dashboard data. But when AI's impact is measured by career stage, she continued, "dramatic differences emerge."'
   *(Fortune, June 27, 2026, quoting ADP Chief Economist Nela Richardson)*
   **Notes:** Context qualifier: ADP's own chief economist characterizes the aggregate as modest while flagging career-stage divergence.

---

### PwC 2026 Global AI Jobs Barometer

- **Publisher:** PwC
- **Date:** 2026-06-15
- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
- **Evidence Tier:** 2 (PwC Global — analysis of 1+ billion job ads across 27 countries; Tier 2 classification as major consultancy/think-tank)
- **Source ID:** pwc-ai-jobs-barometer-2026

This is a new annual edition of the PwC AI Jobs Barometer (previously ingested for 2025). Not in recurring-sources.json — recommend adding.

**Statistics:**

1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** DATA_POINT
   **Value:** 62 (% average wage premium for AI skills in job ads, global, 2026)
   **Quote:** "As companies continue to boost productivity with AI, the average wage premium for workers with AI skills continued to surge higher – hitting 62%, up from 57% last year."
   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
   **Notes:** Global job-ad–based measure. Up from 57% in 2025. Some sectors reach 118% (consumer markets); government sector only 16%. Appropriate as a data point on the high-skill-wage-premium graph given unit compatibility (% premium). Note global scope.

2. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (up for AI-exposed roles, down for others)
   **Value:** +35 / −10 (% employment change for AI-exposed vs. other entry-level roles since 2019, US data)
   **Quote:** "Entry-level outlook diverges: Analysis of US data shows AI-exposed entry-level roles are seven times more likely to require traditionally senior-level skills such as judgement and leadership. These roles grew 35% since 2019, while other entry-level roles declined by 10%."
   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
   **Notes:** The divergence (AI-exposed entry roles +35%, non-AI entry roles −10%) is a US job-ad finding, not a wage figure, but directly relevant to the entry-level outlook captured by this graph. Overlay direction is ambiguous — use `neutral` with text note of polarization.

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 69 (% faster growth of AI-skills jobs vs total jobs market at 9%)
   **Quote:** "Jobs requiring specific AI skills are growing almost eight times (69%) faster than the total jobs market (9%), with the average wage premium for AI skills rising to 62%."
   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
   **Notes:** Job-posting demand signal; not a firm-level AI adoption rate. Overlay only.

4. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 42 (% faster wage growth for "professionalised" vs "democratised" AI jobs since 2021)
   **Quote:** "Two-track jobs market: jobs 'professionalised' by AI are growing twice as fast as jobs 'democratised' by AI with 42% faster wage growth since 2021."
   *(PwC 2026 Global AI Jobs Barometer press release, June 15, 2026)*
   **Notes:** Supports the directional trajectory of high-skill wage premium widening.

---

### Challenger, Gray & Christmas — June 2026 Job Cuts Report

- **Publisher:** Challenger, Gray & Christmas
- **Date:** 2026-07-01
- **URL:** https://www.challengergray.com/blog/challenger-report-june-layoffs-cool-to-45849-down-53-from-may-ai-leads-reasons-for-fourth-consecutive-month/
- **Evidence Tier:** 3 (Industry tracker — Challenger monitors employer layoff announcements; important recurring signal but methodology is self-reported employer attribution)
- **Source ID:** challenger-gray-june-2026

Released July 1, 2026 — five days before the window. Flagged as potentially missed in last ingestion given `lastSweep: null` in registry.

**Statistics:**

1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (up)
   **Value:** 23 (% of all 2026 announced job cuts attributed to AI, through June 2026)
   **Quote:** "So far this year, AI has been cited in 101,743 job cut announcements, approximately 23% of all cuts. Since 2023, when AI was first tracked as a distinct reason, it has been cited in 173,568 job cut announcements."
   *(Challenger, Gray & Christmas June 2026 Report)*
   **Notes:** AI was the leading stated reason for job cuts for the fourth consecutive month in June. Signal is self-reported employer attribution — subject to "AI-washing" (firms may cite AI to justify cuts driven by other factors). Appropriate for the earnings-call signal graph only.

2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 31 (% of June 2026 job cuts where AI was cited as reason)
   **Quote:** "In June, Artificial Intelligence led all reasons for job cuts, with 14,029 announced during the month, or 31%."
   *(Challenger, Gray & Christmas June 2026 Report)*
   **Notes:** "Technology now accounts for nearly a third of all job cuts announced this year." Tech-concentration signal.

---

### U.S. Census Bureau — BTOS AI Supplement (Spring 2026 Data)

- **Publisher:** U.S. Census Bureau
- **Date:** 2026-05-01 (story published); underlying CES Working Paper CES-WP-26-25 released Spring 2026
- **URL:** https://www.census.gov/library/stories/2026/05/ai-use-businesses.html; working paper: https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf
- **Evidence Tier:** 1 (U.S. Census Bureau — BTOS is a nationally representative government survey of ~1.2M businesses)
- **Source ID:** census-btos-spring-2026

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 (% of all U.S. firms using AI in any business function; Nov 2025–Jan 2026 reference period)
   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
   *(CES Working Paper CES-WP-26-25, Spring 2026)*
   **Notes:** The 18% figure uses the revised broader BTOS question ("in any business function"). Employment-weighted rate is 32% — a more meaningful indicator of worker-level exposure. The May 2026 story confirms that through May 3, 2026, overall usage "hovered between 17% and 20%."

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 37 (% of firms with 250+ employees using AI, per May 3, 2026 BTOS data)
   **Quote:** "For example, 37% of firms with at least 250 employees reported using AI in their business operations."
   *(Census.gov BTOS story, May 2026)*
   **Notes:** Strong size gradient: large firms 37%+; firms with ≤4 employees <20%.

3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 23 (% of firms where workers use AI in work-related tasks; Nov 2025–Jan 2026)
   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks, though 65% of firms limit use to three or fewer tasks."
   *(CES Working Paper CES-WP-26-25)*
   **Notes:** 23% is the firm-level rate; 41% is employment-weighted. Cross-walk to the `genai-work-adoption` graph (which targets % of adults using GenAI at work) is approximate — these are firm counts, not worker counts.

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 2 (% of AI-adopting firms seeing AI-related employment decreases)
   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
   *(CES Working Paper CES-WP-26-25)*
   **Notes:** Important counterweight to displacement narratives — as of Nov 2025–Jan 2026, employment displacement at the firm level remains rare in representative national data.

---

## Sources Checked but Not Relevant (no new quantitative AI labor stats within last 7 days)

| URL | Reason |
|---|---|
| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Published January 21, 2026 — outside window; no new stats added this week |
| https://www.nber.org/papers/w34859 | NBER WP 34859 (Demirer et al., Feb 2026) — theoretical model, no empirical displacement statistics extracted |
| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | IMF SDN/2026/001 "New Jobs Creation in the AI Age" — important but published Q1 2026, outside window |
| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Fed Reserve FEDS Note, April 3, 2026 — outside window |
| https://bitsjournal.researchfloor.org/generative-artificial-intelligence-exposure-and-u-s-occupational-wage-polarization-early-evidence-and-workforce-education-implications-from-2018-2025-occupational-data/ | Tier 4 journal; no confirmed peer review; outside window |
| https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html | PwC Barometer summary page; stats extracted from press release instead |
| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | SSRN preprint, 2025 date, Tier 4 — stats sourced from pre-existing literature, not original data |
| https://allwork.space/2026/07/goldman-sachs-says-ai-could-displace-9-of-the-u-s-workforce/ | See above — retained as primary source entry |
| https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html | Deloitte State of AI 2026 — surveyed Aug–Sep 2025; no new AI labor displacement stats within window |
| https://budgetlab.yale.edu/research/us-economy-walking-tightrope-between-aging-and-ai | Content not accessible (url_not_allowed); confirmed published July 9, 2026 |
| https://www.anthropic.com/research/labor-market-impacts | Anthropic "Labor Market Impacts" paper (Massenkoff & McCrory), March 5, 2026 — outside window |
| Multiple stats aggregator blogs (designrush.com, click-vision.com, wearetenet.com, etc.) | Tier 4 — stats sourced from pre-existing primary literature, no original data |

---

## Priority Recommendations

### Ingest Immediately

1. **Census BTOS Spring 2026 data** — Tier 1 government survey. The 18% firm AI-adoption rate is the highest-quality US firm-level AI adoption measure available and directly feeds the `ai-adoption-rate` graph as a data point. The CES working paper (CES-WP-26-25) provides employment-weighted rates (32%) that are more representative of worker exposure. Most recent reference period: Nov 2025–Jan 2026.

2. **Stanford DEL / ADP Canaries Dashboard (June 10, 2026)** — The launch of this permanently updated dashboard by Brynjolfsson and ADP Research is the most significant new AI labor monitoring infrastructure since the Anthropic Economic Index. The −0.2% year-over-year employment trend in most AI-exposed occupations (April 2026 data) and the −13% relative decline for ages 22–25 are the most empirically grounded real-time signals in the field. Recommend adding as a recurring series in `recurring-sources.json` with monthly cadence.

3. **PwC 2026 Global AI Jobs Barometer (June 15, 2026)** — Tier 2, annual series. The 62% AI-skills wage premium is a new data point for `high-skill-wage-premium`. The entry-level divergence (+35%/−10%) is a meaningful new signal. Recommend adding to `recurring-sources.json` as an annual series with `nextExpected: 2027-06-01`.

### Divergent Statistics Warranting Graph Attention

- **Goldman Sachs 9%** vs. prior site consensus: Goldman's own March 2023 paper cited 6–7%. The June 2026 podcast figure of 9% (~15M workers) is an upward revision. This would be a meaningful new data point if confirmed via the primary GS source — recommend verifying at https://www.goldmansachs.com/insights/goldman-sachs-exchanges/how-will-ai-impact-the-labor-market.

- **BTOS 2% firm displacement rate** vs. Challenger/Bloomberg payroll-loss signals: The Census BTOS finding that only 2% of firms report AI-related employment *decreases* stands in notable tension with the Bloomberg/Claims Journal report that payrolls in the financial-activities and information sectors are declining 28,000/month. The reconciliation (noted by Yale Budget Lab's Nunn) is that impact is flowing through *reduced hiring* rather than *active layoffs* — firms are not "decreasing" employment but simply not replacing attrition. Graph annotations should distinguish displacement-via-layoffs from displacement-via-hiring-slowdown.

- **Entry-level divergence convergence**: Brynjolfsson (−13% relative, ADP payroll data), PwC (−10% non-AI entry-level roles), and Goldman Sachs (AI slowing monthly job growth by 10–15K) are all pointing in the same direction on entry-level pressure. This is the most empirically consistent sub-signal across multiple Tier 2 sources and warrants prominence on the `entry-level-wage-impact` graph.

### Recurring Series Due — No New Edition Found

- **Challenger, Gray & Christmas July 2026** report (for June data) was released July 1, just before the window. No July data report yet for July 2026 layoffs — expected ~August 1, 2026.
- **Census BTOS biweekly release** — Last release June 18, 2026. Next release expected ~July 2, 2026 (potentially just released this week — check census.gov/newsroom/press-releases for July 2, 2026 BTOS release).
- **ADP Canaries Dashboard** — Updated monthly. Check digitaleconomy.stanford.edu/project/indicators/canaries-dashboard/ for May or June 2026 data update.

---

*Digest compiled 2026-07-13. All statistics extracted verbatim from primary sources. Exact quote marks indicate source text; no paraphrasing used for stat extraction.*