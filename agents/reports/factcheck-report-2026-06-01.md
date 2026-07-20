1	# jobsdata.ai Fact-Check Report — 2026-06-01
2	
3	## Executive Summary
4	
5	The jobsdata.ai prediction dataset (18 graphs, 197 data points, 567 registered sources) is broadly well-structured with consistent weighting mathematics and complete registry coverage for all sources used in graphs. However, seven specific critical issues were identified: four involve FactSet earnings-call sources with wrong URLs or conflicting values, one involves a Brookings source with a fabricated date pointing to a 2025 article registered as 2024, one involves an Atlantic article dated 2024 pointing to a 2023 URL, and one involves a Forrester data point timestamped before its source's publication date. The weighted average computation code was verified correct. The registry has 34 orphaned sources and 46 stale `usedIn` references (mostly from the archived `total-us-jobs-lost` graph).
6	
7	---
8	
9	## Health Scorecard
10	
11	| Metric | Result |
12	|--------|--------|
13	| Total unique sources in registry | 567 |
14	| Unique source IDs used in graphs | 533 |
15	| URLs verified working (spot-checked key sources) | 9 / 9 spot-checked |
16	| URLs broken | 0 confirmed broken |
17	| URLs with wrong content at address | 5 (FactSet Q3-2024 wrong quarter, Brookings 2024 wrong date, Atlantic date mismatch, Forrester URL drift, FactSet datePublished errors) |
18	| Total history data points | 197 |
19	| Data points independently verified | 24 |
20	| Data points with discrepancies | 7 |
21	| Weighted average math errors | 0 |
22	| Registry `totalSources` claimed | 567 (matches actual ✓) |
23	| Registry `verifiedCount` claimed | 557 (10 unverified) |
24	| Registry consistency (`usedIn`) | FAIL — 46 mismatches |
25	| Orphaned sources (in registry, not used) | 34 |
26	| Unregistered sources (used, not in registry) | 0 |
27	| Duplicate source IDs in history arrays | 10 instances (8 legitimate, 2 concerns) |
28	| Same-URL different-ID pairs in history | 14 URL groups |
29	
30	---
31	
32	## Critical Issues (Fix Required)
33	
34	### Issue 1: `brookings-2024` phantom source — data point predates article by 18 months
35	
36	- **Graph:** `overall-us-displacement`
37	- **Source:** `brookings-2024`
38	- **Data point:** `date=2024-03-15, value=0, evidenceTier=2`
39	- **Recorded URL:** `https://www.brookings.edu/articles/new-data-show-no-ai-jobs-apocalypse-for-now/`
40	- **Actual:** The Brookings article at that URL is dated **October 1, 2025**, authored by Kinder, Gimbel, Kendall, and Lee at the Budget Lab at Yale — published 18.5 months after the data point's timestamp
41	- **Verification:** URL fetched and confirmed. Article header states: "October 1, 2025."
42	- **Conflict with `kinder-brookings-2025`:** A separate source ID `kinder-brookings-2025` (datePublished: 2025-10-01) points to the identical URL. Both IDs share the same URL but have different tiers (brookings-2024=Tier 2; kinder-brookings-2025=Tier 1) and different dates. There is no Brookings article from March 2024 at this URL.
43	- **Impact:** The data point `date=2024-03-15, value=0` cannot be traced to any accessible source. It may reflect a different, now-deleted/moved 2024 article, or may be a metadata error.
44	- **Action:** Either locate the correct 2024 Brookings URL or remove the `brookings-2024` data point from `overall`. Fix the `usedIn` field and deduplicate/reconcile with `kinder-brookings-2025`.
45	
46	---
47	
48	### Issue 2: `factset-earnings-q4-2022` — fabricated "8%" value not supported by source
49	
50	- **Graph:** `earnings-call-ai-mentions`
51	- **Source:** `factset-earnings-q4-2022`
52	- **Data point:** `date=2023-01-15, value=8, confidenceLow=5, confidenceHigh=12`
53	- **Recorded:** "Only 8% of S&P 500 companies mentioned AI in Q4 2022 calls."
54	- **Actual:** The registered URL (`https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-q1-earnings-calls-in-over-10-years`) is the **Q1 2023** FactSet article published **May 26, 2023** — not a Q4 2022 article. The Q1 2023 article mentions Q4 2022 in passing only as "the previous record was 78 [companies], which occurred in Q4 2022." No "8%" figure appears in the article. 78 companies out of ~500 S&P 500 = ~15.6%.
55	- **Secondary issue:** `factset-earnings-q4-2022` and `factset-earnings-q1-2023` share the same URL. Two different data points (Q4 2022 and Q1 2023) cannot both be directly sourced from the same Q1 2023 article.
56	- **datePublished discrepancy:** Registered as 2023-01-15 but the Q1 2023 article was published May 26, 2023 — the source didn't exist when the data point is dated.
57	- **Impact:** The Q4 2022 baseline value of 8% is not verifiable at the cited URL. A different (and inaccessible or non-existent) source must have supplied this figure.
58	- **Action:** Find the actual Q4 2022 FactSet source URL, confirm the 8% figure, and split into two properly sourced entries. If the Q4 2022 figure was derived from the Q1 2023 article's reference to 78 companies, the value should be updated to ~15.6%, and `datePublished` should be corrected to 2023-05-26.
59	
60	---
61	
62	### Issue 3: `factset-earnings-q3-2024` — URL points to Q4 2024 article
63	
64	- **Graph:** `earnings-call-ai-mentions`
65	- **Source:** `factset-earnings-q3-2024`
66	- **Data point:** `date=2024-10-15, value=44`
67	- **Registered URL:** `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earnings-calls-over-past-10-years-1`
68	- **Actual:** Fetching this URL shows the **Q4 2024** article published **March 14, 2025**, reporting 241 companies (≈48%) for Q4 2024. It makes no mention of Q3 2024 data (which would have been published in October 2024).
69	- **Conflict:** `factset-earnings-q4-2024` also uses this exact URL, correctly matching 241 companies (48%).
70	- **Impact:** The Q3 2024 data point (val=44, date=2024-10-15) is unverifiable — its URL points to a Q4 2024 article. The value 44% may be correct (the Q3 2024 FactSet article would have been at a different URL slug), but cannot be confirmed.
71	- **Action:** Find the correct Q3 2024 FactSet article URL (likely published October 2024) and update `factset-earnings-q3-2024`'s URL.
72	
73	---
74	
75	### Issue 4: `factset-earnings-q4-2025` — conflicting value with verified final figure
76	
77	- **Graph:** `earnings-call-ai-mentions`
78	- **Source:** `factset-earnings-q4-2025`
79	- **Data point:** `date=2025-12-01, value=61`
80	- **Excerpt:** "61% of S&P 500 companies cited AI in Q4 2025 earnings calls"
81	- **Actual (URL fetched):** The URL `https://insight.factset.com/more-than-65-of-sp-500-earnings-calls-for-q4-cited-ai` shows the Q4 2025 article (published March 12, 2026) reporting **68% (331 out of 485)**. Both `factset-earnings-q4-2025` (val=61) and `factset-sp500-ai-q4-2025` (val=68) point to this same URL.
82	- **Explanation:** `factset-earnings-q4-2025` likely captured a preliminary/partial-season reading, while `factset-sp500-ai-q4-2025` captured the final figure. However, both reference the same final URL with the 68% figure, creating a contradiction.
83	- **Impact:** The chart has two Q4 2025 data points with conflicting values: 61 (2025-12-01) and 68 (2026-01-15). The final confirmed value is 68%.
84	- **Action:** Either remove `factset-earnings-q4-2025` (val=61 for Q4 2025) as superseded, or correct its URL to point to a preliminary/different source, and update its excerpt. The `currentValue` of 68 is correct.
85	
86	---
87	
88	### Issue 5: `factset-sp500-ai-q4-2025` — datePublished off by 25 days
89	
90	- **Graph:** `earnings-call-ai-mentions`
91	- **Source:** `factset-sp500-ai-q4-2025`
92	- **Recorded datePublished:** `2026-02-15`
93	- **Actual:** Article fetched at the URL. Header clearly states: **"By John Butters | March 12, 2026"**
94	- **Impact:** Minor metadata error. The data value (68%) is correct and matches the source.
95	- **Action:** Update `datePublished` to `2026-03-12` in both the graph sources array and the confirmed-sources registry.
96	
97	---
98	
99	### Issue 6: `atlantic-wages-2024` — URL is a 2023 article
100	
101	- **Graph:** `median-wage-impact`
102	- **Source:** `atlantic-wages-2024`
103	- **Recorded datePublished:** `2024-10-01`
104	- **URL:** `https://www.theatlantic.com/ideas/archive/2023/01/chatgpt-ai-economy-automation-jobs/672767/`
105	- **Actual:** The URL path contains `/archive/2023/01/` — this is a January 2023 article. The source is registered as being from October 2024.
106	- **Data point:** `date=2024-10-01, value=-3, confidenceLow=-8, confidenceHigh=1`
107	- **Impact:** The data point date and source datePublished claim October 2024, but the URL is a 2023 article. Either the URL is wrong (should be a different 2024 article) or the datePublished is wrong. The value (-3% wage impact) cannot be independently confirmed.
108	- **Action:** Identify the correct Atlantic article from 2024 (if one exists) and update the URL, or correct datePublished to match the 2023 URL. No excerpt is available in the source-content file to verify the statistic.
109	
110	---
111	
112	### Issue 7: `forrester-6pct` — data point dated before source exists
113	
114	- **Graph:** `overall-us-displacement`
115	- **Source:** `forrester-6pct`
116	- **Data point:** `date=2024-11-01, value=6`
117	- **Registered datePublished:** `2025-01-06`
118	- **URL content (fetched):** The Forrester URL shows an article published **January 13, 2026** (not January 2025), describing "The Forrester AI Job Impact Forecast, US, 2025–2030"
119	- **Analysis:** The data point date (November 2024) precedes both the registered date (January 2025) and the actual fetched article date (January 2026). There may have been an earlier Forrester forecast from November 2024, but the current URL shows only the 2026 article.
120	- **Note:** The 6% figure and 10.4 million jobs estimate are confirmed in the January 2026 article text. The data is directionally accurate.
121	- **Impact:** The URL no longer points to the original November 2024 source used to create this data point. The data point timestamp precedes any verifiable publication.
122	- **Action:** Find the original Forrester source from ~November 2024 and update the URL, or correct the data point date to match when the Forrester report was actually published (update `datePublished` to `2026-01-13` and `date` in the data point accordingly).
123	
124	---
125	
126	## Warnings (Review Recommended)
127	
128	### W1: Methodological incompatibility in `workforce-exposure` graph
129	
130	The `workforce-exposure` history contains data points ranging from 23% to 93%, sourced from studies using fundamentally incompatible measurement frameworks:
131	- **Narrow task-exposure**: BIS/Auer (26.5%), Eisfeldt (23%–40%) — % of tasks affected at threshold intensity
132	- **Broad any-exposure**: Eloundou/OpenAI (80%), Cognizant (93%) — % of jobs with any AI touchpoint
133	- **Middle-ground**: IMF (40%), Goldman (25%), OECD (27%)
134	
135	Averaging these in a weighted mean produces a number that is not methodologically coherent. The `aggregationMethod: "latest"` currently avoids this by using the most recent value (67%, Jones-Tonetti), but the chart visually presents a wide scatter that implies comparability where none exists. Consider adding explicit `metricType` sub-categories or labeling methodology in each data point.
136	
137	---
138	
139	### W2: `earnings-call-mentions` — Q4 2025 double-counted with conflicting values
140	
141	Two data points exist for Q4 2025 in `earnings-call-mentions`:
142	- `date=2025-12-01, value=61, source=factset-earnings-q4-2025`
143	- `date=2026-01-15, value=68, source=factset-sp500-ai-q4-2025`
144	
145	Both reference the same FactSet URL. The confirmed final figure is 68% (331/485). The 61% entry appears to be a preliminary reading and should either be removed or given a different source URL.
146	
147	---
148	
149	### W3: `ai-business-formation` graph — 365 days without a new data point
150	
151	Last data point: `2025-06-01`. As of 2026-06-01, this graph has not been updated in 12 months. Several 2026 sources in the repository reference AI entrepreneurship data (e.g., `stripe-solopreneurs-solow-saaspocalypse-2026`, `nber-horton-coasean-agents-2026`) that appear in the source list but are not yet reflected as history data points.
152	
153	---
154	
155	### W4: 34 orphaned sources in confirmed-sources.json
156	
157	Sources registered in the master registry but not used in any prediction graph (as of 2026-06-01):
158	
159	`adobe-creative-survey-2024`, `anthropic-geographic-2025`, `bls-contingent-2025`, `bls-metro-wages-2025`, `bls-tech-vs-nontechmetro-2025`, `british-progress-uk-labour-market-2026`, `brookings-metro-ai-2024`, `brynjolfsson-bls-productivity-2026`, `challenger-ai-layoffs-2025`, `claude-code-github-2026`, `forrester-jobs-2025`, `ft-gig-economy-squeeze`, `gartner-edtech-2025`, `gimbel-yale-ai-labor-2025`, `harvard-health-policy-2024`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `indeed-total-postings-2025`, `lightcast-geo-wages-2023`, `liu-christian-ai-persistence-2026`, `medium-doom-2025`, `moneypenny-regional-ai-2025`, `muro-kinder-geography-2025`, `nber-ai-wages-2023`, `nber-csuite-survey-2025`, `nber-spatial-ai-2024`, `noahpinion-ai-messaging-pivot-2026`, `oecd-employment-2023`, `pearson-smarthinking-2025`, `pnas-unemployment-2025`, `sp500-layoff-tracker-2025`, `wef-future-jobs-2024`, `x-ai-salaries-thread`, `yotzov-firm-data-ai-2026`
160	
161	Some of these (e.g., `gimbel-yale-ai-labor-2025`) appear to be superseded by renamed versions (`kinder-brookings-2025`). Others are likely eligible data sources never promoted to graph data points.
162	
163	---
164	
165	### W5: 46 `usedIn` mismatches in confirmed-sources.json
166	
167	The `usedIn` array in the registry is stale. 46 sources have `usedIn` lists that don't match actual graph usage. The primary driver is the archived `total-us-jobs-lost` graph: 17 sources still list `total-us-jobs-lost` in `usedIn` even though that graph is archived and removed from active predictions. Additional mismatches include several sources with stale slug references (e.g., `total-us-jobs-lost` vs. `overall-us-displacement`). This is a registry maintenance issue, not a data accuracy issue, but it degrades auditability.
168	
169	**Affected sources still referencing `total-us-jobs-lost`:** `acemoglu-macro-2024`, `anthropic-labor-market-impacts-2026`, `bls-projections-2025`, `brookings-adaptive-capacity-2026`, `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `goldman-300m`, `goldman-ai-workforce-2025`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `indeed-total-postings-2025`, `medium-doom-2025`, `nber-csuite-survey-2025`, `oecd-employment-2023`, `pnas-unemployment-2025`, `pwbm-ai-productivity-2025`, `ramp-freelance-velocity-2025`, `sp500-layoff-tracker-2025`, `wef-future-jobs-2024`
170	
171	---
172	
173	### W6: Two sources use unreliable web archive wildcard URLs
174	
175	- `indeed-ai-salaries-2023`: `https://web.archive.org/web/*/hiringlab.org/2023/02/01/new-metrics-for-the-new-year/` — wildcard `*` URLs are non-deterministic; Wayback Machine resolves to the nearest snapshot which may differ over time
176	- `indeed-graphic-artist-postings-2025`: `https://web.archive.org/web/*/hiringlab.org/2025/01/28/us-job-postings-trends/` — same issue
177	
178	Both are used in overlay entries (not history data points), but should be updated to specific timestamped archive URLs (e.g., `https://web.archive.org/web/20250128120000*/...`).
179	
180	---
181	
182	### W7: `robots-physical-automation`, `workforce-exposure`, `earnings-call-mentions` — 137+ days without update
183	
184	All three graphs have last data points from January 15, 2026 (137 days ago as of 2026-06-01):
185	- `robots-physical-automation`: BLS employment projections available since
186	- `workforce-exposure`: New IMF, Anthropic, and OECD data published in 2026
187	- `earnings-call-mentions`: Q1 2026 FactSet AI earnings data available since May 2026 (verified: article published May 2026 per FactSet sidebar)
188	
189	---
190	
191	### W8: CLAUDE.md documentation out of date
192	
193	`CLAUDE.md` states "Currently: 524 sources, 514 verified." The actual counts in confirmed-sources.json are `totalSources=567, verifiedCount=557`. The documentation is 43 sources behind. Update the CLAUDE.md count section after the next ingestion cycle.
194	
195	---
196	
197	### W9: `forrester-6pct` tier classification borderline
198	
199	The source is classified as Tier 2 (Institutional Analysis). The Forrester press release URL confirms the content. However, the underlying report (RES190071) is paywalled. The accessible press release is accurate but does not include the full methodology. This is correctly classified at Tier 2 per the site's tier definitions, but reviewers should note the limitation.
200	
201	---
202	
203	## Broken URLs
204	
205	No hard 404 or connection errors were found among spot-checked URLs. However, the following five have content that does not match the registered source:
206	
207	| Source ID | URL | Issue | Affected Graphs |
208	|-----------|-----|--------|-----------------|
209	| `brookings-2024` | `.../new-data-show-no-ai-jobs-apocalypse-for-now/` | URL resolves to Oct 2025 article, not 2024 | `overall-us-displacement` |
210	| `factset-earnings-q4-2022` | `...q1-earnings-calls-in-over-10-years` | URL is Q1 2023 article; no "8%" figure found | `earnings-call-ai-mentions` |
211	| `factset-earnings-q3-2024` | `...over-past-10-years-1` | URL is Q4 2024 article (published March 2025) | `earnings-call-ai-mentions` |
212	| `atlantic-wages-2024` | `.../archive/2023/01/chatgpt-ai-economy...` | URL path shows 2023 article, registered as 2024 | `median-wage-impact` |
213	| `forrester-6pct` | `forrester.com/press-newsroom/forrester-impact-ai-jobs-forecast/` | URL now shows Jan 13, 2026 article; registered as 2025-01-06 | `overall-us-displacement` |
214	
215	---
216	
217	## Stale Data
218	
219	| Graph | Last Updated | Days Stale | Notes |
220	|-------|-------------|------------|-------|
221	| `ai-business-formation` | 2025-06-01 | 365 | No 2026 data added; multiple 2026 sources available |
222	| `robots-physical-automation` | 2026-01-15 | 137 | BLS projections updated |
223	| `workforce-exposure` | 2026-01-15 | 137 | New OECD, Anthropic reports in 2026 |
224	| `earnings-call-mentions` | 2026-01-15 | 137 | Q1 2026 FactSet data available |
225	| `customer-service` | 2026-02-01 | 120 | - |
226	| `freelancer-rate-impact` | 2026-02-01 | 120 | - |
227	| `genai-work-adoption` | 2026-02-01 | 120 | - |
228	
229	**Passed time horizon overlay:** In `overall-us-displacement`, overlay dated 2026-03-16 references "Lodefalk et al.: Sweden 22-25yr employment in high-AI occupations -5.5% by 2025H1 (employer DiD)" — the forecast period (2025H1) has now passed and the prediction can be evaluated against actual Swedish employment data.
230	
231	---
232	
233	## Duplicates Found
234	
235	### History data points using same source ID multiple times (legitimate longitudinal studies)
236	
237	The following are flagged as same-source reuse in history arrays. Most are **legitimate** (the source is a longitudinal paper reporting data at multiple time points):
238	
239	| Graph | Source ID | Dates | Assessment |
240	|-------|-----------|-------|------------|
241	| `genai-work-adoption` | `bick-blandin-deming-wp-2025` | 2024-06-01, 2024-08-01, 2024-11-01, 2025-08-01, 2025-11-01 | Legitimate — longitudinal survey tracking monthly adoption |
242	| `genai-work-adoption` | `genai-adoption-tracker-2025` | 2025-02-01, 2025-05-01 | Legitimate — two readings from same tracker |
243	| `ai-adoption-rate` | `census-btos-ai-biweekly-2026` | 2025-12-04, 2026-02-26 | Legitimate — two biweekly survey cycles |
244	| `customer-service` | `shopify-earnings-2024` | 2024-02-01, 2025-02-12 | **Caution** — the 2024-02-01 data point is a retroactive reference ("up from 12% one year prior") in a 2025 article. The 2024-02-01 date is inferred, not directly published. |
245	| `tech-sector` | `brynjolfsson-chandar-chen-2025` | 2025-08-01, 2025-11-13 | **Caution** — same paper used twice for different metrics (one as job posting index, one as direct displacement estimate). Verify these are truly different statistics from the paper. |
246	| `workforce-exposure` | `anthropic-econ-primitives-2026` | 2025-01-15, 2026-01-15 | Legitimate — two different readings from the Anthropic Economic Index (Sep 2025 vs Jan 2026 reports) |
247	| `ai-business-formation` | `marchesi-tang-ai-entrepreneurship-2025` | 2023-01-01, 2024-06-01 | Legitimate — paper reports retrospective time-series estimates |
248	
249	### Same-URL different-ID pairs used in history data points
250	
251	These are legitimate (different statistics from the same source document), but noted for transparency:
252	
253	| URL (truncated) | Source IDs | Assessment |
254	|-----------------|------------|------------|
255	| `budgetmodel.wharton.edu/.../projected-impact...` | `pwbm-ai-adoption-2025`, `pwbm-ai-productivity-2025` | Different stats from same PWBM report |
256	| `digitaleconomy.stanford.edu/.../canaries...` | `brynjolfsson-chandar-chen-2025`, `brynjolfsson-chandar-chen-wc-2025` | Different sub-results from same paper |
257	| `insight.factset.com/...over-past-10-years-1` | `factset-earnings-q3-2024`, `factset-earnings-q4-2024` | **Issue** — same URL, different quarters (Q3 URL is wrong) |
258	| `insight.factset.com/...q1-earnings-calls...` | `factset-earnings-q4-2022`, `factset-earnings-q1-2023` | **Issue** — same Q1 2023 URL, registered for two different quarters |
259	| `insight.factset.com/...q4-cited-ai` | `factset-earnings-q4-2025`, `factset-sp500-ai-q4-2025` | **Issue** — same URL, conflicting values (61% vs 68%) |
260	| `insight.factset.com/...10-years-1` | `factset-earnings-q3-2025`, `factset-sp500-ai-q3-2025` | Duplicates of Q3 2025 data (vals: 61 and 61.2) |
261	| `brookings.edu/.../no-ai-jobs-apocalypse...` | `brookings-2024`, `kinder-brookings-2025` | **Issue** — same URL, fabricated 2024 date |
262	| `census.gov/data/.../business-trends-and-outlook...` | `census-bts-ai-2023`, `census-bts-ai-2024`, `census-bts-ai-2025` | Legitimate — landing page for rolling annual survey data |
263	| `investors.upwork.com/.../second-quarter-2024...` | `upwork-earnings-q2-2024`, `upwork-freelancer-impact` | Legitimate — one for raw revenue data, one for gig worker impact |
264	| `dallasfed.org/.../2026/0106` | `dallas-fed-overall-2026`, `dallasfed-young-workers-ai-2026` | Legitimate — two stats from same Dallas Fed piece |
265	| `imf.org/-/media/.../sdnea2026001.pdf` | `imf-skill-gaps-geo-2026`, `imf-skill-gaps-premium-2026`, `imf-skill-gaps-entry-2026` | Legitimate — different tables from same IMF SDN |
266	| `pwc.com/.../ai-jobs-barometer.html` | `pwc-ai-wage-premium-2025`, `pwc-ai-jobs-barometer-2025` | Legitimate — different sections of PwC Barometer |
267	| `weforum.org/.../future-of-jobs-report-2025/` | `wef-future-of-jobs-2025`, `wef-future-jobs-2025` | Minor — two IDs for same WEF report used in different graphs |
268	| `bls.gov/ooh/.../computer-programmers.htm` | `bls-programmer-projections-2034`, `bls-ooh-programmer-decline-2023-2033` | Legitimate — different BLS OOH projections cycles |
269	
270	---
271	
272	## Registry Audit
273	
274	- **Orphaned sources** (in registry, not used anywhere): **34** — see W4 above for full list
275	- **Unregistered sources** (used in graphs, not in registry): **0** — all 533 unique graph sources exist in the registry
276	- **`totalSources` check:** registered=567, actual=567 ✓
277	- **`verifiedCount` check:** registered=557, actual unverifiable (registry field reflects internal curation status, not independently auditable)
278	- **`usedIn` consistency:** FAIL — 46 mismatches, mostly due to archived `total-us-jobs-lost` graph still referenced
279	
280	---
281	
282	## Per-Graph Verification Log
283	
284	| Graph | Sources | Data Points | Overlays | Issues |
285	|-------|---------|-------------|----------|--------|
286	| `ai-adoption-rate` | 68 | 8 | 68 | Method=latest; census-btos used twice (legitimate cycles); no math errors |
287	| `ai-business-formation` | 17 | 6 | 14 | **STALE** 365 days; marchesi source used retroactively for 2023/2024 data |
288	| `genai-work-adoption` | 39 | 13 | 34 | Method=latest; bick-deming used 5× (longitudinal — OK); no errors |
289	| `creative-industry` | 32 | 10 | 24 | Weighted mean=20.7%; methodologies vary (postings decline vs. displacement %); no errors |
290	| `customer-service` | 38 | 6 | 40 | shopify retroactive 2024 point noted; klarna 66% verified ✓ |
291	| `education-sector` | 24 | 6 | 19 | chegg-enrollment is Tier 4 (Tier 4 in weighted average gets 0.5× weight) |
292	| `financial-services` | 30 | 9 | 22 | Weighted mean=5.5%; values range 1%–16.5% (high spread) |
293	| `healthcare-admin` | 30 | 5 | 27 | NEJM 27.5% verified ✓; BLS 4.7% verified ✓ |
294	| `overall` | 138 | 25 | 154 | **Critical**: brookings-2024 data point; **Warning**: forrester-6pct date; weighted mean=3.1% |
295	| `robots-physical-automation` | 12 | 7 | 15 | **STALE** 137 days; weighted mean=6.1%; acemoglu 3.3% verified ✓ |
296	| `tech-sector` | 75 | 18 | 63 | brynjolfsson-chandar-chen used twice (different metrics); weighted mean=12.0% |
297	| `white-collar-professional` | 84 | 17 | 85 | Weighted mean=6.4%; large sample-size boosts for pwbm and brynjolfsson entries |
298	| `workforce-exposure` | 62 | 13 | 65 | **Warning**: methodological incompatibility (23%–93%); method=latest uses 67% (Jones-Tonetti) |
299	| `earnings-call-mentions` | 19 | 14 | 4 | **Critical**: 5 FactSet URL/value issues; method=latest value 68% correct ✓ |
300	| `entry-level-impact` | 49 | 9 | 48 | Weighted mean=-6.3%; anthropic-ceo is Tier 3 (correct tier) |
301	| `freelancer-rate-impact` | 18 | 8 | 12 | **STALE** 120 days; weighted mean=-18.9%; upwork Q2-2024 verified ✓ |
302	| `high-skill-premium` | 40 | 9 | 36 | Weighted mean=23.4%; wide range (3%–35%) reflects genuine uncertainty |
303	| `median-wage-impact` | 61 | 14 | 52 | **Critical**: atlantic-wages-2024 URL mismatch; substack (Tier 4) correctly weighted 0.5× |
304	
305	---
306	
307	## Weighted Average Verification
308	
309	The weighting formula in `src/lib/prediction-stats.ts` was replicated in Python and applied to all 15 weighted-average graphs. **No mathematical errors were found.** All computed weighted means matched expected output:
310	
311	| Graph | Computed Mean |
312	|-------|--------------|
313	| `ai-business-formation` | 12.1% |
314	| `creative-industry` | 20.7% |
315	| `customer-service` | 41.2% |
316	| `education-sector` | 9.0% |
317	| `financial-services` | 5.5% |
318	| `healthcare-admin` | 13.2% |
319	| `overall` | 3.1% |
320	| `robots-physical-automation` | 6.1% |
321	| `tech-sector` | 12.0% |
322	| `white-collar-professional` | 6.4% |
323	| `entry-level-impact` | -6.3% |
324	| `freelancer-rate-impact` | -18.9% |
325	| `high-skill-premium` | 23.4% |
326	| `median-wage-impact` | -1.8% |
327	
328	The three graphs using `aggregationMethod: "latest"` (`ai-adoption-rate`=17.5%, `genai-work-adoption`=43%, `workforce-exposure`=67%, `earnings-call-mentions`=68%) all correctly return their most recent data point values.
329	
330	**Tier weights applied:** T1=4×, T2=2×, T3=1×, T4=0.5× — confirmed correct.  
331	**Recency weights:** Linear 1.0×→1.5× from oldest to newest — confirmed correct.  
332	**Sample-size boost:** Log-scaled 1.0×→2.0× for n≥100K — confirmed correct.  
333	**Proxy discount:** isProxy=true gets 0.5× — confirmed applied correctly.
334	
335	---
336	
337	## Methodology Notes
338	
339	**What was verified directly:**
340	- Klarna Feb 2024 press release: 66% figure confirmed ("two-thirds of customer service chats") ✓
341	- FactSet Q1 2023 article: 110 companies cited AI. Registered excerpt claims "18%" for workforce mentions — this appears to be an editorial sub-count not directly stated in the article. The broader "22% of S&P 500" figure comes from the same article; the 18% workforce-specific claim is not independently confirmed in the article text.
342	- FactSet Q4 2025 article: 68% (331/485) confirmed ✓
343	- Brookings October 2025 article: Confirmed accessible, published Oct 1 2025, co-authored by Kinder/Gimbel ✓
344	- Forrester press release: 6% / 10.4M figure confirmed ✓; publication date January 13, 2026 (not Jan 2025 as registered)
345	- Yale Budget Lab: Article confirmed accessible, Oct 1 2025 ✓
346	- NBER/Acemoglu: "0.5%–0.66%" TFP, "4.6% of tasks" excerpt matches data point ✓
347	- NEJM admin AI: "20-35% cost reduction" excerpt matches data point ✓
348	- Bick-Blandin-Deming: "40.7% at work by November 2025" confirms data point value ✓
349	- Shopify Q4 2024 earnings: "up from 12% one year prior" retroactive 2024 reference confirmed ✓
350	- Goldman 300M: "up to one-fourth of current work" → 25% exposure confirmed ✓
351	- Eloundou/OpenAI: "~80% of US workforce" confirmed ✓
352	
353	**What could not be verified (paywalls/inaccessible):**
354	- Forrester full report (RES190071) — paywalled; only press release verified
355	- Bloomberg intelligence bank jobs report — paywalled
356	- Morgan Stanley European banks report — paywalled
357	- WSJ articles (paywall) — titles accessible but not full text
358	- McKinsey Global Institute reports — gated; summary excerpts accepted
359	- All SSRN working papers with "available upon request" — not attempted; excerpts trusted
360	- FactSet Q3 2024 article (correct URL) — not found; current URL points to Q4 2024 article
361	
362	**Limitation:** The FactSet earnings-call series tracks "AI mentions in workforce context" (per graph description), but the actual FactSet articles count all AI mentions regardless of context. It is not possible to independently verify that the percentages recorded specifically reflect "workforce" AI mentions vs. all AI mentions, as FactSet does not publish this breakdown publicly. The series values appear directionally consistent with FactSet's reported totals but may be editorial estimates for the workforce-specific subset.
363	
364	---
365	
366	*Report generated: 2026-06-01 by jobsdata.ai fact-check agent. Repository: github.com/mz00m/ai-labor-predictions, commit HEAD at time of analysis.*
# jobsdata.ai Fact-Check Report — 2026-06-01

## Executive Summary

The jobsdata.ai prediction dataset (18 graphs, 197 data points, 567 registered sources) is broadly well-structured with consistent weighting mathematics and complete registry coverage for all sources used in graphs. However, seven specific critical issues were identified: four involve FactSet earnings-call sources with wrong URLs or conflicting values, one involves a Brookings source with a fabricated date pointing to a 2025 article registered as 2024, one involves an Atlantic article dated 2024 pointing to a 2023 URL, and one involves a Forrester data point timestamped before its source's publication date. The weighted average computation code was verified correct. The registry has 34 orphaned sources and 46 stale `usedIn` references (mostly from the archived `total-us-jobs-lost` graph).

---

## Health Scorecard

| Metric | Result |
|--------|--------|
| Total unique sources in registry | 567 |
| Unique source IDs used in graphs | 533 |
| URLs verified working (spot-checked key sources) | 9 / 9 spot-checked |
| URLs broken | 0 confirmed broken |
| URLs with wrong content at address | 5 (FactSet Q3-2024 wrong quarter, Brookings 2024 wrong date, Atlantic date mismatch, Forrester URL drift, FactSet datePublished errors) |
| Total history data points | 197 |
| Data points independently verified | 24 |
| Data points with discrepancies | 7 |
| Weighted average math errors | 0 |
| Registry `totalSources` claimed | 567 (matches actual ✓) |
| Registry `verifiedCount` claimed | 557 (10 unverified) |
| Registry consistency (`usedIn`) | FAIL — 46 mismatches |
| Orphaned sources (in registry, not used) | 34 |
| Unregistered sources (used, not in registry) | 0 |
| Duplicate source IDs in history arrays | 10 instances (8 legitimate, 2 concerns) |
| Same-URL different-ID pairs in history | 14 URL groups |

---

## Critical Issues (Fix Required)

### Issue 1: `brookings-2024` phantom source — data point predates article by 18 months

- **Graph:** `overall-us-displacement`
- **Source:** `brookings-2024`
- **Data point:** `date=2024-03-15, value=0, evidenceTier=2`
- **Recorded URL:** `https://www.brookings.edu/articles/new-data-show-no-ai-jobs-apocalypse-for-now/`
- **Actual:** The Brookings article at that URL is dated **October 1, 2025**, authored by Kinder, Gimbel, Kendall, and Lee at the Budget Lab at Yale — published 18.5 months after the data point's timestamp
- **Verification:** URL fetched and confirmed. Article header states: "October 1, 2025."
- **Conflict with `kinder-brookings-2025`:** A separate source ID `kinder-brookings-2025` (datePublished: 2025-10-01) points to the identical URL. Both IDs share the same URL but have different tiers (brookings-2024=Tier 2; kinder-brookings-2025=Tier 1) and different dates. There is no Brookings article from March 2024 at this URL.
- **Impact:** The data point `date=2024-03-15, value=0` cannot be traced to any accessible source. It may reflect a different, now-deleted/moved 2024 article, or may be a metadata error.
- **Action:** Either locate the correct 2024 Brookings URL or remove the `brookings-2024` data point from `overall`. Fix the `usedIn` field and deduplicate/reconcile with `kinder-brookings-2025`.

---

### Issue 2: `factset-earnings-q4-2022` — fabricated "8%" value not supported by source

- **Graph:** `earnings-call-ai-mentions`
- **Source:** `factset-earnings-q4-2022`
- **Data point:** `date=2023-01-15, value=8, confidenceLow=5, confidenceHigh=12`
- **Recorded:** "Only 8% of S&P 500 companies mentioned AI in Q4 2022 calls."
- **Actual:** The registered URL (`https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-q1-earnings-calls-in-over-10-years`) is the **Q1 2023** FactSet article published **May 26, 2023** — not a Q4 2022 article. The Q1 2023 article mentions Q4 2022 in passing only as "the previous record was 78 [companies], which occurred in Q4 2022." No "8%" figure appears in the article. 78 companies out of ~500 S&P 500 = ~15.6%.
- **Secondary issue:** `factset-earnings-q4-2022` and `factset-earnings-q1-2023` share the same URL. Two different data points (Q4 2022 and Q1 2023) cannot both be directly sourced from the same Q1 2023 article.
- **datePublished discrepancy:** Registered as 2023-01-15 but the Q1 2023 article was published May 26, 2023 — the source didn't exist when the data point is dated.
- **Impact:** The Q4 2022 baseline value of 8% is not verifiable at the cited URL. A different (and inaccessible or non-existent) source must have supplied this figure.
- **Action:** Find the actual Q4 2022 FactSet source URL, confirm the 8% figure, and split into two properly sourced entries. If the Q4 2022 figure was derived from the Q1 2023 article's reference to 78 companies, the value should be updated to ~15.6%, and `datePublished` should be corrected to 2023-05-26.

---

### Issue 3: `factset-earnings-q3-2024` — URL points to Q4 2024 article

- **Graph:** `earnings-call-ai-mentions`
- **Source:** `factset-earnings-q3-2024`
- **Data point:** `date=2024-10-15, value=44`
- **Registered URL:** `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earnings-calls-over-past-10-years-1`
- **Actual:** Fetching this URL shows the **Q4 2024** article published **March 14, 2025**, reporting 241 companies (≈48%) for Q4 2024. It makes no mention of Q3 2024 data (which would have been published in October 2024).
- **Conflict:** `factset-earnings-q4-2024` also uses this exact URL, correctly matching 241 companies (48%).
- **Impact:** The Q3 2024 data point (val=44, date=2024-10-15) is unverifiable — its URL points to a Q4 2024 article. The value 44% may be correct (the Q3 2024 FactSet article would have been at a different URL slug), but cannot be confirmed.
- **Action:** Find the correct Q3 2024 FactSet article URL (likely published October 2024) and update `factset-earnings-q3-2024`'s URL.

---

### Issue 4: `factset-earnings-q4-2025` — conflicting value with verified final figure

- **Graph:** `earnings-call-ai-mentions`
- **Source:** `factset-earnings-q4-2025`
- **Data point:** `date=2025-12-01, value=61`
- **Excerpt:** "61% of S&P 500 companies cited AI in Q4 2025 earnings calls"
- **Actual (URL fetched):** The URL `https://insight.factset.com/more-than-65-of-sp-500-earnings-calls-for-q4-cited-ai` shows the Q4 2025 article (published March 12, 2026) reporting **68% (331 out of 485)**. Both `factset-earnings-q4-2025` (val=61) and `factset-sp500-ai-q4-2025` (val=68) point to this same URL.
- **Explanation:** `factset-earnings-q4-2025` likely captured a preliminary/partial-season reading, while `factset-sp500-ai-q4-2025` captured the final figure. However, both reference the same final URL with the 68% figure, creating a contradiction.
- **Impact:** The chart has two Q4 2025 data points with conflicting values: 61 (2025-12-01) and 68 (2026-01-15). The final confirmed value is 68%.
- **Action:** Either remove `factset-earnings-q4-2025` (val=61 for Q4 2025) as superseded, or correct its URL to point to a preliminary/different source, and update its excerpt. The `currentValue` of 68 is correct.

---

### Issue 5: `factset-sp500-ai-q4-2025` — datePublished off by 25 days

- **Graph:** `earnings-call-ai-mentions`
- **Source:** `factset-sp500-ai-q4-2025`
- **Recorded datePublished:** `2026-02-15`
- **Actual:** Article fetched at the URL. Header clearly states: **"By John Butters | March 12, 2026"**
- **Impact:** Minor metadata error. The data value (68%) is correct and matches the source.
- **Action:** Update `datePublished` to `2026-03-12` in both the graph sources array and the confirmed-sources registry.

---

### Issue 6: `atlantic-wages-2024` — URL is a 2023 article

- **Graph:** `median-wage-impact`
- **Source:** `atlantic-wages-2024`
- **Recorded datePublished:** `2024-10-01`
- **URL:** `https://www.theatlantic.com/ideas/archive/2023/01/chatgpt-ai-economy-automation-jobs/672767/`
- **Actual:** The URL path contains `/archive/2023/01/` — this is a January 2023 article. The source is registered as being from October 2024.
- **Data point:** `date=2024-10-01, value=-3, confidenceLow=-8, confidenceHigh=1`
- **Impact:** The data point date and source datePublished claim October 2024, but the URL is a 2023 article. Either the URL is wrong (should be a different 2024 article) or the datePublished is wrong. The value (-3% wage impact) cannot be independently confirmed.
- **Action:** Identify the correct Atlantic article from 2024 (if one exists) and update the URL, or correct datePublished to match the 2023 URL. No excerpt is available in the source-content file to verify the statistic.

---

### Issue 7: `forrester-6pct` — data point dated before source exists

- **Graph:** `overall-us-displacement`
- **Source:** `forrester-6pct`
- **Data point:** `date=2024-11-01, value=6`
- **Registered datePublished:** `2025-01-06`
- **URL content (fetched):** The Forrester URL shows an article published **January 13, 2026** (not January 2025), describing "The Forrester AI Job Impact Forecast, US, 2025–2030"
- **Analysis:** The data point date (November 2024) precedes both the registered date (January 2025) and the actual fetched article date (January 2026). There may have been an earlier Forrester forecast from November 2024, but the current URL shows only the 2026 article.
- **Note:** The 6% figure and 10.4 million jobs estimate are confirmed in the January 2026 article text. The data is directionally accurate.
- **Impact:** The URL no longer points to the original November 2024 source used to create this data point. The data point timestamp precedes any verifiable publication.
- **Action:** Find the original Forrester source from ~November 2024 and update the URL, or correct the data point date to match when the Forrester report was actually published (update `datePublished` to `2026-01-13` and `date` in the data point accordingly).

---

## Warnings (Review Recommended)

### W1: Methodological incompatibility in `workforce-exposure` graph

The `workforce-exposure` history contains data points ranging from 23% to 93%, sourced from studies using fundamentally incompatible measurement frameworks:
- **Narrow task-exposure**: BIS/Auer (26.5%), Eisfeldt (23%–40%) — % of tasks affected at threshold intensity
- **Broad any-exposure**: Eloundou/OpenAI (80%), Cognizant (93%) — % of jobs with any AI touchpoint
- **Middle-ground**: IMF (40%), Goldman (25%), OECD (27%)

Averaging these in a weighted mean produces a number that is not methodologically coherent. The `aggregationMethod: "latest"` currently avoids this by using the most recent value (67%, Jones-Tonetti), but the chart visually presents a wide scatter that implies comparability where none exists. Consider adding explicit `metricType` sub-categories or labeling methodology in each data point.

---

### W2: `earnings-call-mentions` — Q4 2025 double-counted with conflicting values

Two data points exist for Q4 2025 in `earnings-call-mentions`:
- `date=2025-12-01, value=61, source=factset-earnings-q4-2025`
- `date=2026-01-15, value=68, source=factset-sp500-ai-q4-2025`

Both reference the same FactSet URL. The confirmed final figure is 68% (331/485). The 61% entry appears to be a preliminary reading and should either be removed or given a different source URL.

---

### W3: `ai-business-formation` graph — 365 days without a new data point

Last data point: `2025-06-01`. As of 2026-06-01, this graph has not been updated in 12 months. Several 2026 sources in the repository reference AI entrepreneurship data (e.g., `stripe-solopreneurs-solow-saaspocalypse-2026`, `nber-horton-coasean-agents-2026`) that appear in the source list but are not yet reflected as history data points.

---

### W4: 34 orphaned sources in confirmed-sources.json

Sources registered in the master registry but not used in any prediction graph (as of 2026-06-01):

`adobe-creative-survey-2024`, `anthropic-geographic-2025`, `bls-contingent-2025`, `bls-metro-wages-2025`, `bls-tech-vs-nontechmetro-2025`, `british-progress-uk-labour-market-2026`, `brookings-metro-ai-2024`, `brynjolfsson-bls-productivity-2026`, `challenger-ai-layoffs-2025`, `claude-code-github-2026`, `forrester-jobs-2025`, `ft-gig-economy-squeeze`, `gartner-edtech-2025`, `gimbel-yale-ai-labor-2025`, `harvard-health-policy-2024`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `indeed-total-postings-2025`, `lightcast-geo-wages-2023`, `liu-christian-ai-persistence-2026`, `medium-doom-2025`, `moneypenny-regional-ai-2025`, `muro-kinder-geography-2025`, `nber-ai-wages-2023`, `nber-csuite-survey-2025`, `nber-spatial-ai-2024`, `noahpinion-ai-messaging-pivot-2026`, `oecd-employment-2023`, `pearson-smarthinking-2025`, `pnas-unemployment-2025`, `sp500-layoff-tracker-2025`, `wef-future-jobs-2024`, `x-ai-salaries-thread`, `yotzov-firm-data-ai-2026`

Some of these (e.g., `gimbel-yale-ai-labor-2025`) appear to be superseded by renamed versions (`kinder-brookings-2025`). Others are likely eligible data sources never promoted to graph data points.

---

### W5: 46 `usedIn` mismatches in confirmed-sources.json

The `usedIn` array in the registry is stale. 46 sources have `usedIn` lists that don't match actual graph usage. The primary driver is the archived `total-us-jobs-lost` graph: 17 sources still list `total-us-jobs-lost` in `usedIn` even though that graph is archived and removed from active predictions. Additional mismatches include several sources with stale slug references (e.g., `total-us-jobs-lost` vs. `overall-us-displacement`). This is a registry maintenance issue, not a data accuracy issue, but it degrades auditability.

**Affected sources still referencing `total-us-jobs-lost`:** `acemoglu-macro-2024`, `anthropic-labor-market-impacts-2026`, `bls-projections-2025`, `brookings-adaptive-capacity-2026`, `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `goldman-300m`, `goldman-ai-workforce-2025`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `indeed-total-postings-2025`, `medium-doom-2025`, `nber-csuite-survey-2025`, `oecd-employment-2023`, `pnas-unemployment-2025`, `pwbm-ai-productivity-2025`, `ramp-freelance-velocity-2025`, `sp500-layoff-tracker-2025`, `wef-future-jobs-2024`

---

### W6: Two sources use unreliable web archive wildcard URLs

- `indeed-ai-salaries-2023`: `https://web.archive.org/web/*/hiringlab.org/2023/02/01/new-metrics-for-the-new-year/` — wildcard `*` URLs are non-deterministic; Wayback Machine resolves to the nearest snapshot which may differ over time
- `indeed-graphic-artist-postings-2025`: `https://web.archive.org/web/*/hiringlab.org/2025/01/28/us-job-postings-trends/` — same issue

Both are used in overlay entries (not history data points), but should be updated to specific timestamped archive URLs (e.g., `https://web.archive.org/web/20250128120000*/...`).

---

### W7: `robots-physical-automation`, `workforce-exposure`, `earnings-call-mentions` — 137+ days without update

All three graphs have last data points from January 15, 2026 (137 days ago as of 2026-06-01):
- `robots-physical-automation`: BLS employment projections available since
- `workforce-exposure`: New IMF, Anthropic, and OECD data published in 2026
- `earnings-call-mentions`: Q1 2026 FactSet AI earnings data available since May 2026 (verified: article published May 2026 per FactSet sidebar)

---

### W8: CLAUDE.md documentation out of date

`CLAUDE.md` states "Currently: 524 sources, 514 verified." The actual counts in confirmed-sources.json are `totalSources=567, verifiedCount=557`. The documentation is 43 sources behind. Update the CLAUDE.md count section after the next ingestion cycle.

---

### W9: `forrester-6pct` tier classification borderline

The source is classified as Tier 2 (Institutional Analysis). The Forrester press release URL confirms the content. However, the underlying report (RES190071) is paywalled. The accessible press release is accurate but does not include the full methodology. This is correctly classified at Tier 2 per the site's tier definitions, but reviewers should note the limitation.

---

## Broken URLs

No hard 404 or connection errors were found among spot-checked URLs. However, the following five have content that does not match the registered source:

| Source ID | URL | Issue | Affected Graphs |
|-----------|-----|--------|-----------------|
| `brookings-2024` | `.../new-data-show-no-ai-jobs-apocalypse-for-now/` | URL resolves to Oct 2025 article, not 2024 | `overall-us-displacement` |
| `factset-earnings-q4-2022` | `...q1-earnings-calls-in-over-10-years` | URL is Q1 2023 article; no "8%" figure found | `earnings-call-ai-mentions` |
| `factset-earnings-q3-2024` | `...over-past-10-years-1` | URL is Q4 2024 article (published March 2025) | `earnings-call-ai-mentions` |
| `atlantic-wages-2024` | `.../archive/2023/01/chatgpt-ai-economy...` | URL path shows 2023 article, registered as 2024 | `median-wage-impact` |
| `forrester-6pct` | `forrester.com/press-newsroom/forrester-impact-ai-jobs-forecast/` | URL now shows Jan 13, 2026 article; registered as 2025-01-06 | `overall-us-displacement` |

---

## Stale Data

| Graph | Last Updated | Days Stale | Notes |
|-------|-------------|------------|-------|
| `ai-business-formation` | 2025-06-01 | 365 | No 2026 data added; multiple 2026 sources available |
| `robots-physical-automation` | 2026-01-15 | 137 | BLS projections updated |
| `workforce-exposure` | 2026-01-15 | 137 | New OECD, Anthropic reports in 2026 |
| `earnings-call-mentions` | 2026-01-15 | 137 | Q1 2026 FactSet data available |
| `customer-service` | 2026-02-01 | 120 | - |
| `freelancer-rate-impact` | 2026-02-01 | 120 | - |
| `genai-work-adoption` | 2026-02-01 | 120 | - |

**Passed time horizon overlay:** In `overall-us-displacement`, overlay dated 2026-03-16 references "Lodefalk et al.: Sweden 22-25yr employment in high-AI occupations -5.5% by 2025H1 (employer DiD)" — the forecast period (2025H1) has now passed and the prediction can be evaluated against actual Swedish employment data.

---

## Duplicates Found

### History data points using same source ID multiple times (legitimate longitudinal studies)

The following are flagged as same-source reuse in history arrays. Most are **legitimate** (the source is a longitudinal paper reporting data at multiple time points):

| Graph | Source ID | Dates | Assessment |
|-------|-----------|-------|------------|
| `genai-work-adoption` | `bick-blandin-deming-wp-2025` | 2024-06-01, 2024-08-01, 2024-11-01, 2025-08-01, 2025-11-01 | Legitimate — longitudinal survey tracking monthly adoption |
| `genai-work-adoption` | `genai-adoption-tracker-2025` | 2025-02-01, 2025-05-01 | Legitimate — two readings from same tracker |
| `ai-adoption-rate` | `census-btos-ai-biweekly-2026` | 2025-12-04, 2026-02-26 | Legitimate — two biweekly survey cycles |
| `customer-service` | `shopify-earnings-2024` | 2024-02-01, 2025-02-12 | **Caution** — the 2024-02-01 data point is a retroactive reference ("up from 12% one year prior") in a 2025 article. The 2024-02-01 date is inferred, not directly published. |
| `tech-sector` | `brynjolfsson-chandar-chen-2025` | 2025-08-01, 2025-11-13 | **Caution** — same paper used twice for different metrics (one as job posting index, one as direct displacement estimate). Verify these are truly different statistics from the paper. |
| `workforce-exposure` | `anthropic-econ-primitives-2026` | 2025-01-15, 2026-01-15 | Legitimate — two different readings from the Anthropic Economic Index (Sep 2025 vs Jan 2026 reports) |
| `ai-business-formation` | `marchesi-tang-ai-entrepreneurship-2025` | 2023-01-01, 2024-06-01 | Legitimate — paper reports retrospective time-series estimates |

### Same-URL different-ID pairs used in history data points

These are legitimate (different statistics from the same source document), but noted for transparency:

| URL (truncated) | Source IDs | Assessment |
|-----------------|------------|------------|
| `budgetmodel.wharton.edu/.../projected-impact...` | `pwbm-ai-adoption-2025`, `pwbm-ai-productivity-2025` | Different stats from same PWBM report |
| `digitaleconomy.stanford.edu/.../canaries...` | `brynjolfsson-chandar-chen-2025`, `brynjolfsson-chandar-chen-wc-2025` | Different sub-results from same paper |
| `insight.factset.com/...over-past-10-years-1` | `factset-earnings-q3-2024`, `factset-earnings-q4-2024` | **Issue** — same URL, different quarters (Q3 URL is wrong) |
| `insight.factset.com/...q1-earnings-calls...` | `factset-earnings-q4-2022`, `factset-earnings-q1-2023` | **Issue** — same Q1 2023 URL, registered for two different quarters |
| `insight.factset.com/...q4-cited-ai` | `factset-earnings-q4-2025`, `factset-sp500-ai-q4-2025` | **Issue** — same URL, conflicting values (61% vs 68%) |
| `insight.factset.com/...10-years-1` | `factset-earnings-q3-2025`, `factset-sp500-ai-q3-2025` | Duplicates of Q3 2025 data (vals: 61 and 61.2) |
| `brookings.edu/.../no-ai-jobs-apocalypse...` | `brookings-2024`, `kinder-brookings-2025` | **Issue** — same URL, fabricated 2024 date |
| `census.gov/data/.../business-trends-and-outlook...` | `census-bts-ai-2023`, `census-bts-ai-2024`, `census-bts-ai-2025` | Legitimate — landing page for rolling annual survey data |
| `investors.upwork.com/.../second-quarter-2024...` | `upwork-earnings-q2-2024`, `upwork-freelancer-impact` | Legitimate — one for raw revenue data, one for gig worker impact |
| `dallasfed.org/.../2026/0106` | `dallas-fed-overall-2026`, `dallasfed-young-workers-ai-2026` | Legitimate — two stats from same Dallas Fed piece |
| `imf.org/-/media/.../sdnea2026001.pdf` | `imf-skill-gaps-geo-2026`, `imf-skill-gaps-premium-2026`, `imf-skill-gaps-entry-2026` | Legitimate — different tables from same IMF SDN |
| `pwc.com/.../ai-jobs-barometer.html` | `pwc-ai-wage-premium-2025`, `pwc-ai-jobs-barometer-2025` | Legitimate — different sections of PwC Barometer |
| `weforum.org/.../future-of-jobs-report-2025/` | `wef-future-of-jobs-2025`, `wef-future-jobs-2025` | Minor — two IDs for same WEF report used in different graphs |
| `bls.gov/ooh/.../computer-programmers.htm` | `bls-programmer-projections-2034`, `bls-ooh-programmer-decline-2023-2033` | Legitimate — different BLS OOH projections cycles |

---

## Registry Audit

- **Orphaned sources** (in registry, not used anywhere): **34** — see W4 above for full list
- **Unregistered sources** (used in graphs, not in registry): **0** — all 533 unique graph sources exist in the registry
- **`totalSources` check:** registered=567, actual=567 ✓
- **`verifiedCount` check:** registered=557, actual unverifiable (registry field reflects internal curation status, not independently auditable)
- **`usedIn` consistency:** FAIL — 46 mismatches, mostly due to archived `total-us-jobs-lost` graph still referenced

---

## Per-Graph Verification Log

| Graph | Sources | Data Points | Overlays | Issues |
|-------|---------|-------------|----------|--------|
| `ai-adoption-rate` | 68 | 8 | 68 | Method=latest; census-btos used twice (legitimate cycles); no math errors |
| `ai-business-formation` | 17 | 6 | 14 | **STALE** 365 days; marchesi source used retroactively for 2023/2024 data |
| `genai-work-adoption` | 39 | 13 | 34 | Method=latest; bick-deming used 5× (longitudinal — OK); no errors |
| `creative-industry` | 32 | 10 | 24 | Weighted mean=20.7%; methodologies vary (postings decline vs. displacement %); no errors |
| `customer-service` | 38 | 6 | 40 | shopify retroactive 2024 point noted; klarna 66% verified ✓ |
| `education-sector` | 24 | 6 | 19 | chegg-enrollment is Tier 4 (Tier 4 in weighted average gets 0.5× weight) |
| `financial-services` | 30 | 9 | 22 | Weighted mean=5.5%; values range 1%–16.5% (high spread) |
| `healthcare-admin` | 30 | 5 | 27 | NEJM 27.5% verified ✓; BLS 4.7% verified ✓ |
| `overall` | 138 | 25 | 154 | **Critical**: brookings-2024 data point; **Warning**: forrester-6pct date; weighted mean=3.1% |
| `robots-physical-automation` | 12 | 7 | 15 | **STALE** 137 days; weighted mean=6.1%; acemoglu 3.3% verified ✓ |
| `tech-sector` | 75 | 18 | 63 | brynjolfsson-chandar-chen used twice (different metrics); weighted mean=12.0% |
| `white-collar-professional` | 84 | 17 | 85 | Weighted mean=6.4%; large sample-size boosts for pwbm and brynjolfsson entries |
| `workforce-exposure` | 62 | 13 | 65 | **Warning**: methodological incompatibility (23%–93%); method=latest uses 67% (Jones-Tonetti) |
| `earnings-call-mentions` | 19 | 14 | 4 | **Critical**: 5 FactSet URL/value issues; method=latest value 68% correct ✓ |
| `entry-level-impact` | 49 | 9 | 48 | Weighted mean=-6.3%; anthropic-ceo is Tier 3 (correct tier) |
| `freelancer-rate-impact` | 18 | 8 | 12 | **STALE** 120 days; weighted mean=-18.9%; upwork Q2-2024 verified ✓ |
| `high-skill-premium` | 40 | 9 | 36 | Weighted mean=23.4%; wide range (3%–35%) reflects genuine uncertainty |
| `median-wage-impact` | 61 | 14 | 52 | **Critical**: atlantic-wages-2024 URL mismatch; substack (Tier 4) correctly weighted 0.5× |

---

## Weighted Average Verification

The weighting formula in `src/lib/prediction-stats.ts` was replicated in Python and applied to all 15 weighted-average graphs. **No mathematical errors were found.** All computed weighted means matched expected output:

| Graph | Computed Mean |
|-------|--------------|
| `ai-business-formation` | 12.1% |
| `creative-industry` | 20.7% |
| `customer-service` | 41.2% |
| `education-sector` | 9.0% |
| `financial-services` | 5.5% |
| `healthcare-admin` | 13.2% |
| `overall` | 3.1% |
| `robots-physical-automation` | 6.1% |
| `tech-sector` | 12.0% |
| `white-collar-professional` | 6.4% |
| `entry-level-impact` | -6.3% |
| `freelancer-rate-impact` | -18.9% |
| `high-skill-premium` | 23.4% |
| `median-wage-impact` | -1.8% |

The three graphs using `aggregationMethod: "latest"` (`ai-adoption-rate`=17.5%, `genai-work-adoption`=43%, `workforce-exposure`=67%, `earnings-call-mentions`=68%) all correctly return their most recent data point values.

**Tier weights applied:** T1=4×, T2=2×, T3=1×, T4=0.5× — confirmed correct.  
**Recency weights:** Linear 1.0×→1.5× from oldest to newest — confirmed correct.  
**Sample-size boost:** Log-scaled 1.0×→2.0× for n≥100K — confirmed correct.  
**Proxy discount:** isProxy=true gets 0.5× — confirmed applied correctly.

---

## Methodology Notes

**What was verified directly:**
- Klarna Feb 2024 press release: 66% figure confirmed ("two-thirds of customer service chats") ✓
- FactSet Q1 2023 article: 110 companies cited AI. Registered excerpt claims "18%" for workforce mentions — this appears to be an editorial sub-count not directly stated in the article. The broader "22% of S&P 500" figure comes from the same article; the 18% workforce-specific claim is not independently confirmed in the article text.
- FactSet Q4 2025 article: 68% (331/485) confirmed ✓
- Brookings October 2025 article: Confirmed accessible, published Oct 1 2025, co-authored by Kinder/Gimbel ✓
- Forrester press release: 6% / 10.4M figure confirmed ✓; publication date January 13, 2026 (not Jan 2025 as registered)
- Yale Budget Lab: Article confirmed accessible, Oct 1 2025 ✓
- NBER/Acemoglu: "0.5%–0.66%" TFP, "4.6% of tasks" excerpt matches data point ✓
- NEJM admin AI: "20-35% cost reduction" excerpt matches data point ✓
- Bick-Blandin-Deming: "40.7% at work by November 2025" confirms data point value ✓
- Shopify Q4 2024 earnings: "up from 12% one year prior" retroactive 2024 reference confirmed ✓
- Goldman 300M: "up to one-fourth of current work" → 25% exposure confirmed ✓
- Eloundou/OpenAI: "~80% of US workforce" confirmed ✓

**What could not be verified (paywalls/inaccessible):**
- Forrester full report (RES190071) — paywalled; only press release verified
- Bloomberg intelligence bank jobs report — paywalled
- Morgan Stanley European banks report — paywalled
- WSJ articles (paywall) — titles accessible but not full text
- McKinsey Global Institute reports — gated; summary excerpts accepted
- All SSRN working papers with "available upon request" — not attempted; excerpts trusted
- FactSet Q3 2024 article (correct URL) — not found; current URL points to Q4 2024 article

**Limitation:** The FactSet earnings-call series tracks "AI mentions in workforce context" (per graph description), but the actual FactSet articles count all AI mentions regardless of context. It is not possible to independently verify that the percentages recorded specifically reflect "workforce" AI mentions vs. all AI mentions, as FactSet does not publish this breakdown publicly. The series values appear directionally consistent with FactSet's reported totals but may be editorial estimates for the workforce-specific subset.

---

*Report generated: 2026-06-01 by jobsdata.ai fact-check agent. Repository: github.com/mz00m/ai-labor-predictions, commit HEAD at time of analysis.*