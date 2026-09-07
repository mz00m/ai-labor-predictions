1	# AI Labor Research Digest — 2026-09-07
2	
3	## Summary
4	
5	Three qualifying sources published within the 7-day window (2026-08-31 through 2026-09-07): a Federal Reserve Bank of St. Louis blog post with an accompanying working paper on task-level AI adoption (Sept. 1), a Dallas Fed economics brief on AI automation and Texas job postings (Sept. 1), and the Challenger, Gray & Christmas August 2026 Job Cut Report (released Sept. 3). Two additional high-priority sources fell just outside the window — the Stanford Digital Economy Lab's August 12 revision of "Canaries in the Coal Mine?" (WATCHLIST: Brynjolfsson) and the BLS Employment Projections 2025–2035 (released Aug. 27) — and are included below as clearly important near-window releases. **Tier 1 highlight:** The St. Louis Fed paper by Bick, Blandin, Deming, and Schumacher provides the first nationally representative occupation- and task-level AI adoption indexes, documenting that 45% of U.S. workers now use GenAI on the job as of May 2026 while fewer than 3% of detailed work tasks exceed 50% adoption — characterizing adoption as "widespread but shallow."
6	
7	---
8	
9	## Recurring Series Status
10	
11	| Series | Status |
12	|---|---|
13	| `ellucian-highered-ai` | Not due (nextExpected: 2027-03-01) — no sweep required |
14	| Challenger Job Cut Report (informal recurring) | **NEW EDITION FOUND** — August 2026 Report, released 2026-09-03 |
15	| BLS Employment Projections (informal recurring) | **NEW EDITION FOUND** — 2025–2035 Projections, released 2026-08-27 *(4 days before window; included below)* |
16	| Census BTOS (informal recurring) | Biweekly releases ongoing; last major narrative story: May 2026 analysis (URL: /2026/08/ AI-use-at-work page — exact date unconfirmed within window) |
17	| Anthropic Economic Index | No new edition found this week |
18	| Stanford AI Index | Annual; 2026 edition already published; no mid-year update found |
19	| Yale Budget Lab AI report | No new release found this week |
20	| PwC Global AI Jobs Barometer | No new edition found this week |
21	| FactSet Earnings Insight | No new AI labor edition confirmed this week |
22	
23	---
24	
25	## New Sources
26	
27	### What Work Does Generative AI Do?
28	- **Publisher:** Federal Reserve Bank of St. Louis (On the Economy Blog) / St. Louis Fed Working Paper
29	- **Date:** 2026-09-01
30	- **URL:** https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do
31	- **Evidence Tier:** 1 (Federal Reserve System / government research, nationally representative survey data)
32	- **Source ID:** stlouisfed-ai-adoption-task-level-2026
33	- **WATCHLIST:** Alexander Bick ✓ | David Deming ✓ (lastChecked: 2026-04-14 — both researchers now updated)
34	
35	**Statistics:**
36	
37	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
38	   **Type:** DATA_POINT
39	   **Value:** 45 % of U.S. workers using GenAI at work (as of May 2026)
40	   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."
41	
42	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
43	   **Type:** OVERLAY (up)
44	   **Value:** 62 % of U.S. adults using AI (as of May 2026; broader population metric)
45	   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."
46	
47	3. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
48	   **Type:** OVERLAY (up)
49	   **Value:** 80 % of occupations where ≥20% of workers use AI
50	   **Quote:** "In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%. AI is not confined to a handful of tech jobs — it is assisting a broad share of labor market activity."
51	
52	4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
53	   **Type:** OVERLAY (neutral)
54	   **Value:** 40 % of occupations with >50% adoption rate (i.e., majority of occupations remain below 50%)
55	   **Quote:** "Only 40% of occupations have adoption rates above 50%, and just 16% exceed 70% adoption. Tasks are starker still: Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."
56	
57	5. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
58	   **Type:** OVERLAY (up — high adoption concentrated here)
59	   **Value:** 87.3 % AI adoption rate among computer and information research scientists
60	   **Quote:** "Adoption is highest in computing and professional occupations: computer and information research scientists (87.3%), information security analysts (85.4%), and network and computer systems administrators (82.4%). Computer programmers, public relations specialists, personal financial advisors and chief executives are all near or above 80%."
61	
62	6. **Graph:** Healthcare Admin Displacement (`healthcare-admin-displacement`)
63	   **Type:** OVERLAY (neutral — lower adoption than predicted)
64	   **Value:** 16.8 % actual AI adoption rate for medical secretaries vs. 61% predicted by exposure scores
65	   **Quote:** "Occupations built around sensitive records adopt far less than predicted; for example, medical secretaries and administrative assistants use AI at a 16.8% rate versus a predicted 61%."
66	
67	---
68	
69	### Job postings show early signs of AI automation impact
70	- **Publisher:** Federal Reserve Bank of Dallas (Dallas Fed Economics)
71	- **Date:** 2026-09-01
72	- **URL:** https://www.dallasfed.org/research/economics/2026/0901
73	- **Evidence Tier:** 1 (Federal Reserve System research, administrative job-posting data + Texas Business Outlook Survey)
74	- **Source ID:** dallasfed-job-postings-ai-automation-2026
75	
76	**Statistics:**
77	
78	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
79	   **Type:** OVERLAY (up)
80	   **Value:** 66 % of Texas firms using AI in May 2026 (up from 40% two years prior)
81	   **Quote:** "Two-thirds of firms surveyed in the May 2026 Texas Business Outlook Survey reported using AI, up from 40 percent two years prior."
82	   *(Note: Texas-specific; treat as OVERLAY, not national data point)*
83	
84	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
85	   **Type:** OVERLAY (down)
86	   **Value:** −8 % job posting decline for AI-exposed occupations by Q1 2025 (relative to less-exposed peers, same industry)
87	   **Quote:** "The findings suggest job postings fell 5 percent for more-exposed positions relative to less-exposed ones by the end of 2023 and by approximately 8 percent by first quarter 2025."
88	   *(Note: Texas Lightcast data, but authors confirm "Results from estimating the same model using job postings for each occupation-industry cell across the entire U.S. are quantitatively and qualitatively similar.")*
89	
90	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
91	   **Type:** OVERLAY (down)
92	   **Value:** −9 % job posting decline at existing (incumbent) AI-exposed firms by early 2026
93	   **Quote:** "Existing firms that were more exposed to AI reduced their demand by similar amounts to the aggregate effects found across occupations, decreasing their job postings by approximately 5–6 percent by the middle of 2024 and by 8–9 percent by early 2026."
94	
95	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
96	   **Type:** OVERLAY (down)
97	   **Value:** −2.6 % reduction in total AI-exposed job postings in Texas attributable to GenAI automation by 2025
98	   **Quote:** "Based on our calculations, we can estimate the effect of AI automation exposure on total Lightcast job posting behavior in Texas. Given AI usage rates and automation scores across occupations and Texas' industry composition, the estimates imply that automation exposure to generative AI reduced total Lightcast job postings in Texas by approximately 1.8 percent in 2024 and by 2.6 percent in 2025."
99	
100	5. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
101	   **Type:** OVERLAY (down — shifting composition)
102	   **Value:** −2 percentage-point reduction in the automatable-task share of job postings at highly AI-exposed firms after ChatGPT release
103	   **Quote:** "Firms whose listed jobs prior to the release of ChatGPT were destined to become 10 percent more automatable by GenAI posted jobs with 2 percentage points fewer automatable tasks after the release—a nearly 50 percent reduction relative to the mean in the data."
104	
105	---
106	
107	### Challenger, Gray & Christmas — August 2026 Job Cut Report
108	- **Publisher:** Challenger, Gray & Christmas (global outplacement and executive coaching firm)
109	- **Date:** 2026-09-03 (release date for August data)
110	- **URL:** https://www.challengergray.com/wp-content/uploads/2026/09/Challenger-Report-August-2026.pdf
111	- **Evidence Tier:** 2 (major employment tracking firm; employer-stated reasons, not independently verified)
112	- **Source ID:** challenger-gray-august-2026
113	- **RECURRING SERIES UPDATE:** Challenger Job Cuts Report (August 2026 edition)
114	
115	**Statistics:**
116	
117	1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
118	   **Type:** OVERLAY (up)
119	   **Value:** 116,175 job cut announcements citing AI year-to-date through August 2026 (~22% of all announced cuts)
120	   **Quote:** "So far this year, AI has been cited in 116,175 job cut announcements, approximately 22% of all cuts, and it remains the leading reason year-to-date."
121	   *(Note: Challenger tracks employer-stated reasons from announced, planned cuts — not confirmed separations. "AI-attributed" means company cited AI; does not verify each role replaced by AI.)*
122	
123	2. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
124	   **Type:** OVERLAY (neutral — signal cooling in August specifically)
125	   **Value:** 3,462 AI-cited job cuts in August 2026 alone (fell to fourth-most cited reason for the month)
126	   **Quote:** "Restructuring led all reasons for job cuts in August with 16,173 announced during the month, or 31%...AI fell to the fourth-most cited reason with 3,462 cuts."
127	
128	3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
129	   **Type:** OVERLAY (up — layoff signal concentrated in tech)
130	   **Value:** 155,126 tech sector job cuts year-to-date through August 2026 (+52% vs. same period 2025)
131	   **Quote:** "Technology announced 6,103 cuts in August, its lowest monthly total of 2026, for a year-to-date total of 155,126. That is an increase of 52% from the 102,239 cuts announced in this sector through August 2025. Technology still accounts for 29% of all job cuts announced this year."
132	
133	---
134	
135	## Near-Window Sources (Published Just Before Aug. 31 — Included Due to Importance)
136	
137	---
138	
139	### Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (Revised August 2026)
140	- **Publisher:** Stanford Digital Economy Lab
141	- **Date:** 2026-08-12 *(19 days before window — included as clearly important, possibly missed)*
142	- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
143	- **Evidence Tier:** 2 (major think tank / university research; ADP payroll administrative data, millions of U.S. workers through June 2026)
144	- **Source ID:** brynjolfsson-chandar-chen-canaries-aug2026
145	- **WATCHLIST:** Erik Brynjolfsson ✓ (lastChecked: 2026-04-14 — updated. Revised version now covers data through June 2026.)
146	
147	**Statistics:**
148	
149	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
150	   **Type:** OVERLAY (neutral — no aggregate displacement signal)
151	   **Value:** 0 % (no measurable economy-wide job displacement detected)
152	   **Quote:** "We find no evidence of widespread, economy-wide job displacement."
153	
154	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
155	   **Type:** OVERLAY (down — entry-level signal)
156	   **Value:** −19 % employment gap for young workers (ages 22–25) in AI-exposed occupations vs. their trajectory had they kept pace with less-exposed peers
157	   **Quote:** "However, employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
158	
159	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
160	   **Type:** OVERLAY (down — employment impact on entry-level; wage signal absent)
161	   **Value:** −19 % employment gap for ages 22–25 in highest AI-exposure occupations (operates through hiring, not wages)
162	   **Quote:** "It operates primarily through reduced hiring of young workers rather than increased separations...Adjustment is occurring through employment rather than base compensation."
163	
164	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
165	   **Type:** OVERLAY (down — widening over time)
166	   **Value:** Divergence widened steadily since first documented in August 2025
167	   **Quote:** "This divergence has widened steadily since we first documented it in August 2025."
168	
169	5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
170	   **Type:** OVERLAY (neutral)
171	   **Value:** No special tech-sector concentration; divergence persists when excluding technology firms
172	   **Quote:** "The divergence is not explained by several prominent alternative factors: it persists when excluding technology firms and computer occupations, when controlling for exposure to interest-rate increases and for remote work, and across alternative measures of AI exposure."
173	
174	---
175	
176	### BLS Employment Projections — 2025–2035
177	- **Publisher:** U.S. Bureau of Labor Statistics
178	- **Date:** 2026-08-27 *(4 days before window — included as clearly important government release, USDL-26-1422)*
179	- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf
180	- **Evidence Tier:** 1 (U.S. government official employment projections, Tier 1 highest confidence)
181	- **Source ID:** bls-employment-projections-2025-2035
182	- **RECURRING SERIES UPDATE:** BLS Employment Projections (2025–2035 edition)
183	
184	**Statistics:**
185	
186	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
187	   **Type:** OVERLAY (down — for office/admin group)
188	   **Value:** −4.0 % projected decline for office and administrative support occupations over 2025–2035 decade, shedding 752,100 jobs
189	   **Quote:** "The continued integration of automation tools, including those powered by AI, into workflows is likely to reduce demand for several office and administrative support occupations. This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."
190	
191	2. **Graph:** Creative Industry Displacement (`creative-industry-displacement`)
192	   **Type:** OVERLAY (neutral — below-average growth attributed partly to GenAI)
193	   **Value:** +1.5 % projected growth for arts, design, entertainment, sports, and media group (below total employment average of +3.5%)
194	   **Quote:** "The use of generative AI software, which can be leveraged to automate repetitive tasks and speed up certain processes, may limit demand for some jobs in the arts, design, entertainment, sports, and media occupational group."
195	
196	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
197	   **Type:** OVERLAY (up — infrastructure employment signal from AI demand)
198	   **Value:** +25.1 % projected growth for computing infrastructure providers / data processing / web hosting industry (adding 120,400 jobs)
199	   **Quote:** "Accelerated AI adoption is also expected to support employment growth in the computing infrastructure providers, data processing, web hosting, and related services industry. As a result, this industry is projected to grow 25.1 percent and add 120,400 new jobs over the projections period."
200	
201	4. **Graph:** Financial Services Displacement (`financial-services-displacement`)
202	   **Type:** OVERLAY (neutral — modest projected growth at +2.3%)
203	   **Value:** +2.3 % projected employment growth in finance and insurance sector, 2025–2035
204	   **Quote:** "Finance and insurance" projected employment change: +2.3% with +154,300 new jobs.
205	   *(Note: BLS does not separately attribute AI's contribution within finance. Treat as overlay only.)*
206	
207	5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
208	   **Type:** OVERLAY (neutral — new BLS data product released concurrently)
209	   **Value:** New AI exposure category product introduced; quantitative breakdown not yet published in this release
210	   **Quote:** "Alongside the 2025–35 projections, BLS is introducing a new data product that provides information about how occupations compare to one another based on their theoretical and observed exposure to artificial intelligence (AI). More information about the AI exposure categories can be found on release day at www.bls.gov/emp/publications/ai-exposure-categories.htm."
211	
212	---
213	
214	## Watchlist Check Summary (All Researchers — lastChecked 2026-04-14, All >30 Days Old)
215	
216	| Researcher | Affiliation | New Publications Found in Window |
217	|---|---|---|
218	| Daron Acemoglu | MIT | None found in this week's window |
219	| Erik Brynjolfsson | Stanford DEL | ✓ "Canaries" Revised Aug 12, 2026 (near-window) |
220	| Martha Gimbel | Yale Budget Lab | No new release found this week |
221	| James Bessen | BU TPRI | None found in this week's window |
222	| Jed Kolko | PIIE | None found in this week's window |
223	| Alex Imas | Chicago Booth | None found in this week's window |
224	| Molly Kinder | Formerly Brookings | None found in this week's window |
225	| Daniel Rock | Wharton / Workhelix | None found in this week's window |
226	| Alexander Bick | St. Louis Fed | ✓ "What Work Does Generative AI Do?" Sep 1, 2026 (IN WINDOW) |
227	| David Deming | Harvard / NBER | ✓ "What Work Does Generative AI Do?" Sep 1, 2026 (IN WINDOW) |
228	| Maria del Rio-Chanona | UCL / ILO | None found in this week's window |
229	| Andrea Eisfeldt | UCLA Anderson | None found in this week's window |
230	| Pascual Restrepo | Yale | None found in this week's window |
231	| Shakked Noy | MIT FutureTech | None found in this week's window |
232	| Neil Thompson | MIT FutureTech | None found in this week's window |
233	
234	---
235	
236	## Sources Checked but Not Relevant or Outside Window
237	
238	- `https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/` — Brookings/NBER adaptive capacity analysis (Manning & Aguirre); not dated within this week's window; describes AI exposure + adaptive capacity concept but not new quantitative data release this week
239	- `https://www.census.gov/library/stories/2026/08/ai-use-at-work.html` — Census HTOPS March 2026 data story (55% of workers used AI on job for at least one task); published August 2026 but exact date unconfirmed within window; page inaccessible at time of fetch; no date confirmed ≥Aug 31
240	- `https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf` — IMF SDN 2026/001 "Bridging Skill Gaps: New Jobs Creation in the AI Age" (Jaumotte et al.); date of publication not confirmed within this window; noted for future ingestion
241	- `https://www.nber.org/papers/w34859` — NBER WP 34859 "Chaining Tasks, Redefining Work" (Demirer, Horton, et al.); issued February 2026, not within window
242	- `https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf` — Original 2025 Canaries PDF (superseded by August 2026 revision)
243	- `https://lehd.ces.census.gov/applications/creat/viewbytag?tags=275` — Census LEHD working paper on AI and early career hiring (QWI data); interesting but exact publication date and tier unclear; noted for follow-up
244	- `https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-27.pdf` — Census working paper on AI and early career hiring; reference to a 12% early-career employment decline in most-AI-exposed quintile; publication date unconfirmed within window
245	- `https://documents1.worldbank.org/curated/en/099827011182513988/pdf/IDU-1300d27a-b3d3-43d9-8a52-047f784776c0.pdf` — World Bank Policy Research Working Paper 11263 "Labor Demand in the Age of Generative AI"; publication date unconfirmed within window
246	- `https://www.ilo.org/resource/news/new-ilo–world-bank-paper-highlights-uneven-global-impact-generative-ai-jobs` — ILO–World Bank background paper for World Development Report 2026; global scope, not new US-specific quantitative data
247	- `https://ssrn.com/abstract=5842084` — Azar, Gine, Sanz-Espín (December 2025) "The Wage Effects of Generative AI"; December 2025 SSRN working paper, outside window
248	- `https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html` — Fed FEDS Note (April 3, 2026); outside window
249	- Tier 4 aggregator sites (blog.letaido.com, axis-intelligence.com, click-vision.com, designrush.com, etc.) — Reviewed for sourced statistics but all statistics traced to earlier primary sources; no new Tier 4 content within window cited stats not already captured elsewhere
250	- Apollo Global Management wage compression paper (reported July 30–Aug 21, 2026) — High-interest finding (6.7% real wage growth gap in AI-exposed occupations post-2023; no employment effect) but publication date is outside the window; pre-print status unclear; noted for priority follow-up ingestion
251	
252	---
253	
254	## Priority Recommendations
255	
256	### Ingest Immediately (Tier 1, in or near window)
257	1. **St. Louis Fed / Bick, Blandin, Deming, Schumacher (Sep 1, 2026):** IN-WINDOW Tier 1 source. The 45% worker adoption figure is the freshest nationally representative reading on `genai-work-adoption`. The task-level breakdown (fewer than 3% of tasks exceed 50% adoption) is a significant constraint on near-term displacement projections — suggests graphs should reflect shallow penetration even amid rising headcount adoption.
258	2. **Dallas Fed / Dodini & Smith (Sep 1, 2026):** IN-WINDOW Tier 1 source. The 8–9% job-posting decline at AI-exposed incumbent firms by early 2026 is directly measurable labor demand compression — the most concrete demand-side signal found this week. Overlays recommended on `overall-us-displacement`.
259	3. **BLS Employment Projections 2025–2035 (Aug 27, 2026):** Tier 1 government release, 4 days outside window. The −4.0% / 752,100-job projection for office and administrative support is the first BLS official acknowledgment of AI-driven occupational group decline in a decennial projections cycle. This should be treated as a key anchor data point for `overall-us-displacement`. Also note: BLS simultaneously released new AI Exposure Categories — fetch `bls.gov/emp/publications/ai-exposure-categories.htm` for quantitative breakdown in a follow-up sweep.
260	
261	### Significant Divergence Flags
262	- **Canaries revised 19% gap vs. previous 12–14% estimates:** The Stanford revision widens the young-worker employment gap from the earlier ~14% figure (reported in March 2026 studies) to 19% as of June 2026 data. This is a notable upward revision to the entry-level displacement signal and diverges from the PIIE/Kolko "first inning" framing.
263	- **St. Louis Fed "shallow" finding vs. exposure model predictions:** The gap between predicted exposure (e.g., medical secretaries at 61% predicted vs. 16.8% actual adoption) suggests current `workforce-ai-exposure` graph predictions may be running significantly ahead of realized displacement effects.
264	- **Apollo wage compression (near-window):** If Apollo's finding of a 6.7% real wage growth lag in AI-exposed occupations is replicated in peer-reviewed work, it would represent the first credible quantitative reading for the `median-wage-impact` graph — currently signal-poor. Priority follow-up recommended.
265	
266	### New Government Data to Fetch
267	- **BLS AI Exposure Categories (released Aug 27, 2026):** Companion data product to Employment Projections — separate URL. Contains occupation-level AI exposure categorization using both theoretical and observed exposure. Fetch `https://www.bls.gov/emp/publications/ai-exposure-categories.htm` as a top-priority follow-up; may yield direct data points for `workforce-ai-exposure`.
268	- **Census CES Working Paper 26-27 on AI and early career hiring (QWI data):** Cited in search results as showing a 12% employment decline for ages 22–24 in most AI-exposed quintile of industry-state cells following ChatGPT. If publication date falls within or near window, this is a Tier 1 Census Bureau working paper warranting ingestion.
269	- **IMF SDN 2026/001 (Jaumotte et al.):** Confirm publication date and ingest — "Bridging Skill Gaps: New Jobs Creation in the AI Age" is an IMF Staff Discussion Note with multi-country AI skills analysis. Tier 2 international organization source.
# AI Labor Research Digest — 2026-09-07

## Summary

Three qualifying sources published within the 7-day window (2026-08-31 through 2026-09-07): a Federal Reserve Bank of St. Louis blog post with an accompanying working paper on task-level AI adoption (Sept. 1), a Dallas Fed economics brief on AI automation and Texas job postings (Sept. 1), and the Challenger, Gray & Christmas August 2026 Job Cut Report (released Sept. 3). Two additional high-priority sources fell just outside the window — the Stanford Digital Economy Lab's August 12 revision of "Canaries in the Coal Mine?" (WATCHLIST: Brynjolfsson) and the BLS Employment Projections 2025–2035 (released Aug. 27) — and are included below as clearly important near-window releases. **Tier 1 highlight:** The St. Louis Fed paper by Bick, Blandin, Deming, and Schumacher provides the first nationally representative occupation- and task-level AI adoption indexes, documenting that 45% of U.S. workers now use GenAI on the job as of May 2026 while fewer than 3% of detailed work tasks exceed 50% adoption — characterizing adoption as "widespread but shallow."

---

## Recurring Series Status

| Series | Status |
|---|---|
| `ellucian-highered-ai` | Not due (nextExpected: 2027-03-01) — no sweep required |
| Challenger Job Cut Report (informal recurring) | **NEW EDITION FOUND** — August 2026 Report, released 2026-09-03 |
| BLS Employment Projections (informal recurring) | **NEW EDITION FOUND** — 2025–2035 Projections, released 2026-08-27 *(4 days before window; included below)* |
| Census BTOS (informal recurring) | Biweekly releases ongoing; last major narrative story: May 2026 analysis (URL: /2026/08/ AI-use-at-work page — exact date unconfirmed within window) |
| Anthropic Economic Index | No new edition found this week |
| Stanford AI Index | Annual; 2026 edition already published; no mid-year update found |
| Yale Budget Lab AI report | No new release found this week |
| PwC Global AI Jobs Barometer | No new edition found this week |
| FactSet Earnings Insight | No new AI labor edition confirmed this week |

---

## New Sources

### What Work Does Generative AI Do?
- **Publisher:** Federal Reserve Bank of St. Louis (On the Economy Blog) / St. Louis Fed Working Paper
- **Date:** 2026-09-01
- **URL:** https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do
- **Evidence Tier:** 1 (Federal Reserve System / government research, nationally representative survey data)
- **Source ID:** stlouisfed-ai-adoption-task-level-2026
- **WATCHLIST:** Alexander Bick ✓ | David Deming ✓ (lastChecked: 2026-04-14 — both researchers now updated)

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 45 % of U.S. workers using GenAI at work (as of May 2026)
   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 62 % of U.S. adults using AI (as of May 2026; broader population metric)
   **Quote:** "Between August 2024 and May 2026, the share of adults using AI rose from 45% to 62%, and the share of workers using it for their jobs rose from 33% to 45%."

3. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 80 % of occupations where ≥20% of workers use AI
   **Quote:** "In more than 80% of occupations, at least 1 in 5 workers uses AI on the job, and more than 40% of tasks have adoption rates above 20%. AI is not confined to a handful of tech jobs — it is assisting a broad share of labor market activity."

4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (neutral)
   **Value:** 40 % of occupations with >50% adoption rate (i.e., majority of occupations remain below 50%)
   **Quote:** "Only 40% of occupations have adoption rates above 50%, and just 16% exceed 70% adoption. Tasks are starker still: Fewer than 3% of tasks have adoption rates above 50%, and none exceed 70% adoption."

5. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up — high adoption concentrated here)
   **Value:** 87.3 % AI adoption rate among computer and information research scientists
   **Quote:** "Adoption is highest in computing and professional occupations: computer and information research scientists (87.3%), information security analysts (85.4%), and network and computer systems administrators (82.4%). Computer programmers, public relations specialists, personal financial advisors and chief executives are all near or above 80%."

6. **Graph:** Healthcare Admin Displacement (`healthcare-admin-displacement`)
   **Type:** OVERLAY (neutral — lower adoption than predicted)
   **Value:** 16.8 % actual AI adoption rate for medical secretaries vs. 61% predicted by exposure scores
   **Quote:** "Occupations built around sensitive records adopt far less than predicted; for example, medical secretaries and administrative assistants use AI at a 16.8% rate versus a predicted 61%."

---

### Job postings show early signs of AI automation impact
- **Publisher:** Federal Reserve Bank of Dallas (Dallas Fed Economics)
- **Date:** 2026-09-01
- **URL:** https://www.dallasfed.org/research/economics/2026/0901
- **Evidence Tier:** 1 (Federal Reserve System research, administrative job-posting data + Texas Business Outlook Survey)
- **Source ID:** dallasfed-job-postings-ai-automation-2026

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 66 % of Texas firms using AI in May 2026 (up from 40% two years prior)
   **Quote:** "Two-thirds of firms surveyed in the May 2026 Texas Business Outlook Survey reported using AI, up from 40 percent two years prior."
   *(Note: Texas-specific; treat as OVERLAY, not national data point)*

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −8 % job posting decline for AI-exposed occupations by Q1 2025 (relative to less-exposed peers, same industry)
   **Quote:** "The findings suggest job postings fell 5 percent for more-exposed positions relative to less-exposed ones by the end of 2023 and by approximately 8 percent by first quarter 2025."
   *(Note: Texas Lightcast data, but authors confirm "Results from estimating the same model using job postings for each occupation-industry cell across the entire U.S. are quantitatively and qualitatively similar.")*

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −9 % job posting decline at existing (incumbent) AI-exposed firms by early 2026
   **Quote:** "Existing firms that were more exposed to AI reduced their demand by similar amounts to the aggregate effects found across occupations, decreasing their job postings by approximately 5–6 percent by the middle of 2024 and by 8–9 percent by early 2026."

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** −2.6 % reduction in total AI-exposed job postings in Texas attributable to GenAI automation by 2025
   **Quote:** "Based on our calculations, we can estimate the effect of AI automation exposure on total Lightcast job posting behavior in Texas. Given AI usage rates and automation scores across occupations and Texas' industry composition, the estimates imply that automation exposure to generative AI reduced total Lightcast job postings in Texas by approximately 1.8 percent in 2024 and by 2.6 percent in 2025."

5. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (down — shifting composition)
   **Value:** −2 percentage-point reduction in the automatable-task share of job postings at highly AI-exposed firms after ChatGPT release
   **Quote:** "Firms whose listed jobs prior to the release of ChatGPT were destined to become 10 percent more automatable by GenAI posted jobs with 2 percentage points fewer automatable tasks after the release—a nearly 50 percent reduction relative to the mean in the data."

---

### Challenger, Gray & Christmas — August 2026 Job Cut Report
- **Publisher:** Challenger, Gray & Christmas (global outplacement and executive coaching firm)
- **Date:** 2026-09-03 (release date for August data)
- **URL:** https://www.challengergray.com/wp-content/uploads/2026/09/Challenger-Report-August-2026.pdf
- **Evidence Tier:** 2 (major employment tracking firm; employer-stated reasons, not independently verified)
- **Source ID:** challenger-gray-august-2026
- **RECURRING SERIES UPDATE:** Challenger Job Cuts Report (August 2026 edition)

**Statistics:**

1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (up)
   **Value:** 116,175 job cut announcements citing AI year-to-date through August 2026 (~22% of all announced cuts)
   **Quote:** "So far this year, AI has been cited in 116,175 job cut announcements, approximately 22% of all cuts, and it remains the leading reason year-to-date."
   *(Note: Challenger tracks employer-stated reasons from announced, planned cuts — not confirmed separations. "AI-attributed" means company cited AI; does not verify each role replaced by AI.)*

2. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (neutral — signal cooling in August specifically)
   **Value:** 3,462 AI-cited job cuts in August 2026 alone (fell to fourth-most cited reason for the month)
   **Quote:** "Restructuring led all reasons for job cuts in August with 16,173 announced during the month, or 31%...AI fell to the fourth-most cited reason with 3,462 cuts."

3. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up — layoff signal concentrated in tech)
   **Value:** 155,126 tech sector job cuts year-to-date through August 2026 (+52% vs. same period 2025)
   **Quote:** "Technology announced 6,103 cuts in August, its lowest monthly total of 2026, for a year-to-date total of 155,126. That is an increase of 52% from the 102,239 cuts announced in this sector through August 2025. Technology still accounts for 29% of all job cuts announced this year."

---

## Near-Window Sources (Published Just Before Aug. 31 — Included Due to Importance)

---

### Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (Revised August 2026)
- **Publisher:** Stanford Digital Economy Lab
- **Date:** 2026-08-12 *(19 days before window — included as clearly important, possibly missed)*
- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
- **Evidence Tier:** 2 (major think tank / university research; ADP payroll administrative data, millions of U.S. workers through June 2026)
- **Source ID:** brynjolfsson-chandar-chen-canaries-aug2026
- **WATCHLIST:** Erik Brynjolfsson ✓ (lastChecked: 2026-04-14 — updated. Revised version now covers data through June 2026.)

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral — no aggregate displacement signal)
   **Value:** 0 % (no measurable economy-wide job displacement detected)
   **Quote:** "We find no evidence of widespread, economy-wide job displacement."

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — entry-level signal)
   **Value:** −19 % employment gap for young workers (ages 22–25) in AI-exposed occupations vs. their trajectory had they kept pace with less-exposed peers
   **Quote:** "However, employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down — employment impact on entry-level; wage signal absent)
   **Value:** −19 % employment gap for ages 22–25 in highest AI-exposure occupations (operates through hiring, not wages)
   **Quote:** "It operates primarily through reduced hiring of young workers rather than increased separations...Adjustment is occurring through employment rather than base compensation."

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — widening over time)
   **Value:** Divergence widened steadily since first documented in August 2025
   **Quote:** "This divergence has widened steadily since we first documented it in August 2025."

5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** No special tech-sector concentration; divergence persists when excluding technology firms
   **Quote:** "The divergence is not explained by several prominent alternative factors: it persists when excluding technology firms and computer occupations, when controlling for exposure to interest-rate increases and for remote work, and across alternative measures of AI exposure."

---

### BLS Employment Projections — 2025–2035
- **Publisher:** U.S. Bureau of Labor Statistics
- **Date:** 2026-08-27 *(4 days before window — included as clearly important government release, USDL-26-1422)*
- **URL:** https://www.bls.gov/news.release/pdf/ecopro.pdf
- **Evidence Tier:** 1 (U.S. government official employment projections, Tier 1 highest confidence)
- **Source ID:** bls-employment-projections-2025-2035
- **RECURRING SERIES UPDATE:** BLS Employment Projections (2025–2035 edition)

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — for office/admin group)
   **Value:** −4.0 % projected decline for office and administrative support occupations over 2025–2035 decade, shedding 752,100 jobs
   **Quote:** "The continued integration of automation tools, including those powered by AI, into workflows is likely to reduce demand for several office and administrative support occupations. This occupational group is projected to decline at the fastest pace (-4.0 percent) and to shed 752,100 jobs over the 2025−35 decade, the most of any major occupational group."

2. **Graph:** Creative Industry Displacement (`creative-industry-displacement`)
   **Type:** OVERLAY (neutral — below-average growth attributed partly to GenAI)
   **Value:** +1.5 % projected growth for arts, design, entertainment, sports, and media group (below total employment average of +3.5%)
   **Quote:** "The use of generative AI software, which can be leveraged to automate repetitive tasks and speed up certain processes, may limit demand for some jobs in the arts, design, entertainment, sports, and media occupational group."

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up — infrastructure employment signal from AI demand)
   **Value:** +25.1 % projected growth for computing infrastructure providers / data processing / web hosting industry (adding 120,400 jobs)
   **Quote:** "Accelerated AI adoption is also expected to support employment growth in the computing infrastructure providers, data processing, web hosting, and related services industry. As a result, this industry is projected to grow 25.1 percent and add 120,400 new jobs over the projections period."

4. **Graph:** Financial Services Displacement (`financial-services-displacement`)
   **Type:** OVERLAY (neutral — modest projected growth at +2.3%)
   **Value:** +2.3 % projected employment growth in finance and insurance sector, 2025–2035
   **Quote:** "Finance and insurance" projected employment change: +2.3% with +154,300 new jobs.
   *(Note: BLS does not separately attribute AI's contribution within finance. Treat as overlay only.)*

5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral — new BLS data product released concurrently)
   **Value:** New AI exposure category product introduced; quantitative breakdown not yet published in this release
   **Quote:** "Alongside the 2025–35 projections, BLS is introducing a new data product that provides information about how occupations compare to one another based on their theoretical and observed exposure to artificial intelligence (AI). More information about the AI exposure categories can be found on release day at www.bls.gov/emp/publications/ai-exposure-categories.htm."

---

## Watchlist Check Summary (All Researchers — lastChecked 2026-04-14, All >30 Days Old)

| Researcher | Affiliation | New Publications Found in Window |
|---|---|---|
| Daron Acemoglu | MIT | None found in this week's window |
| Erik Brynjolfsson | Stanford DEL | ✓ "Canaries" Revised Aug 12, 2026 (near-window) |
| Martha Gimbel | Yale Budget Lab | No new release found this week |
| James Bessen | BU TPRI | None found in this week's window |
| Jed Kolko | PIIE | None found in this week's window |
| Alex Imas | Chicago Booth | None found in this week's window |
| Molly Kinder | Formerly Brookings | None found in this week's window |
| Daniel Rock | Wharton / Workhelix | None found in this week's window |
| Alexander Bick | St. Louis Fed | ✓ "What Work Does Generative AI Do?" Sep 1, 2026 (IN WINDOW) |
| David Deming | Harvard / NBER | ✓ "What Work Does Generative AI Do?" Sep 1, 2026 (IN WINDOW) |
| Maria del Rio-Chanona | UCL / ILO | None found in this week's window |
| Andrea Eisfeldt | UCLA Anderson | None found in this week's window |
| Pascual Restrepo | Yale | None found in this week's window |
| Shakked Noy | MIT FutureTech | None found in this week's window |
| Neil Thompson | MIT FutureTech | None found in this week's window |

---

## Sources Checked but Not Relevant or Outside Window

- `https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/` — Brookings/NBER adaptive capacity analysis (Manning & Aguirre); not dated within this week's window; describes AI exposure + adaptive capacity concept but not new quantitative data release this week
- `https://www.census.gov/library/stories/2026/08/ai-use-at-work.html` — Census HTOPS March 2026 data story (55% of workers used AI on job for at least one task); published August 2026 but exact date unconfirmed within window; page inaccessible at time of fetch; no date confirmed ≥Aug 31
- `https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf` — IMF SDN 2026/001 "Bridging Skill Gaps: New Jobs Creation in the AI Age" (Jaumotte et al.); date of publication not confirmed within this window; noted for future ingestion
- `https://www.nber.org/papers/w34859` — NBER WP 34859 "Chaining Tasks, Redefining Work" (Demirer, Horton, et al.); issued February 2026, not within window
- `https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf` — Original 2025 Canaries PDF (superseded by August 2026 revision)
- `https://lehd.ces.census.gov/applications/creat/viewbytag?tags=275` — Census LEHD working paper on AI and early career hiring (QWI data); interesting but exact publication date and tier unclear; noted for follow-up
- `https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-27.pdf` — Census working paper on AI and early career hiring; reference to a 12% early-career employment decline in most-AI-exposed quintile; publication date unconfirmed within window
- `https://documents1.worldbank.org/curated/en/099827011182513988/pdf/IDU-1300d27a-b3d3-43d9-8a52-047f784776c0.pdf` — World Bank Policy Research Working Paper 11263 "Labor Demand in the Age of Generative AI"; publication date unconfirmed within window
- `https://www.ilo.org/resource/news/new-ilo–world-bank-paper-highlights-uneven-global-impact-generative-ai-jobs` — ILO–World Bank background paper for World Development Report 2026; global scope, not new US-specific quantitative data
- `https://ssrn.com/abstract=5842084` — Azar, Gine, Sanz-Espín (December 2025) "The Wage Effects of Generative AI"; December 2025 SSRN working paper, outside window
- `https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html` — Fed FEDS Note (April 3, 2026); outside window
- Tier 4 aggregator sites (blog.letaido.com, axis-intelligence.com, click-vision.com, designrush.com, etc.) — Reviewed for sourced statistics but all statistics traced to earlier primary sources; no new Tier 4 content within window cited stats not already captured elsewhere
- Apollo Global Management wage compression paper (reported July 30–Aug 21, 2026) — High-interest finding (6.7% real wage growth gap in AI-exposed occupations post-2023; no employment effect) but publication date is outside the window; pre-print status unclear; noted for priority follow-up ingestion

---

## Priority Recommendations

### Ingest Immediately (Tier 1, in or near window)
1. **St. Louis Fed / Bick, Blandin, Deming, Schumacher (Sep 1, 2026):** IN-WINDOW Tier 1 source. The 45% worker adoption figure is the freshest nationally representative reading on `genai-work-adoption`. The task-level breakdown (fewer than 3% of tasks exceed 50% adoption) is a significant constraint on near-term displacement projections — suggests graphs should reflect shallow penetration even amid rising headcount adoption.
2. **Dallas Fed / Dodini & Smith (Sep 1, 2026):** IN-WINDOW Tier 1 source. The 8–9% job-posting decline at AI-exposed incumbent firms by early 2026 is directly measurable labor demand compression — the most concrete demand-side signal found this week. Overlays recommended on `overall-us-displacement`.
3. **BLS Employment Projections 2025–2035 (Aug 27, 2026):** Tier 1 government release, 4 days outside window. The −4.0% / 752,100-job projection for office and administrative support is the first BLS official acknowledgment of AI-driven occupational group decline in a decennial projections cycle. This should be treated as a key anchor data point for `overall-us-displacement`. Also note: BLS simultaneously released new AI Exposure Categories — fetch `bls.gov/emp/publications/ai-exposure-categories.htm` for quantitative breakdown in a follow-up sweep.

### Significant Divergence Flags
- **Canaries revised 19% gap vs. previous 12–14% estimates:** The Stanford revision widens the young-worker employment gap from the earlier ~14% figure (reported in March 2026 studies) to 19% as of June 2026 data. This is a notable upward revision to the entry-level displacement signal and diverges from the PIIE/Kolko "first inning" framing.
- **St. Louis Fed "shallow" finding vs. exposure model predictions:** The gap between predicted exposure (e.g., medical secretaries at 61% predicted vs. 16.8% actual adoption) suggests current `workforce-ai-exposure` graph predictions may be running significantly ahead of realized displacement effects.
- **Apollo wage compression (near-window):** If Apollo's finding of a 6.7% real wage growth lag in AI-exposed occupations is replicated in peer-reviewed work, it would represent the first credible quantitative reading for the `median-wage-impact` graph — currently signal-poor. Priority follow-up recommended.

### New Government Data to Fetch
- **BLS AI Exposure Categories (released Aug 27, 2026):** Companion data product to Employment Projections — separate URL. Contains occupation-level AI exposure categorization using both theoretical and observed exposure. Fetch `https://www.bls.gov/emp/publications/ai-exposure-categories.htm` as a top-priority follow-up; may yield direct data points for `workforce-ai-exposure`.
- **Census CES Working Paper 26-27 on AI and early career hiring (QWI data):** Cited in search results as showing a 12% employment decline for ages 22–24 in most AI-exposed quintile of industry-state cells following ChatGPT. If publication date falls within or near window, this is a Tier 1 Census Bureau working paper warranting ingestion.
- **IMF SDN 2026/001 (Jaumotte et al.):** Confirm publication date and ingest — "Bridging Skill Gaps: New Jobs Creation in the AI Age" is an IMF Staff Discussion Note with multi-country AI skills analysis. Tier 2 international organization source.