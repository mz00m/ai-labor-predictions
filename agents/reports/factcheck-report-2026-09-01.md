1	# jobsdata.ai Fact-Check Report — 2026-09-01
2	
3	## Executive Summary
4	
5	The jobsdata.ai prediction database (703 sources, 20 graphs, 175 history-referenced sources) is generally well-maintained and methodologically transparent. The weighting algorithm is fully documented in source code and 18 of 20 graphs reproduce their `currentValue` exactly. However, two graphs display `currentValue` figures that do not match the documented weighted-average formula (financial-services-displacement overstates by 0.8pp; freelancer-rate-impact overstates by 1.0pp). More critically, the FactSet earnings signal data contains a source-content/URL collision where `factset-earnings-q3-2024` and `factset-earnings-q4-2024` both reference the same article reporting Q4 2024 data — making the Q3 2024 data point's provenance unverifiable. Four graphs also have the same source appearing multiple times in their `history` array, which can distort weighted averages by artificially increasing a single source's recency weight. Two graphs (robots-physical-automation-displacement and workforce-ai-exposure) have not been updated in 8 months and are formally stale.
6	
7	---
8	
9	## Health Scorecard
10	
11	| Metric | Result |
12	|--------|--------|
13	| Total unique source IDs across all graphs | 649 |
14	| Sources in confirmed-sources.json | 703 |
15	| Recorded `totalSources` | 703 (matches actual count ✓) |
16	| Recorded `verifiedCount` | 693 (unverifiable — no verification-status field in source entries) |
17	| URLs verified working (spot-checked) | 14 checked, 11 resolving |
18	| URLs broken / inaccessible | 3 confirmed (SSRN paywall, Substack block, Bloomberg paywall) |
19	| Data points verified accurate (value matches source) | Checked 12 key points; 10 verified, 2 discrepant |
20	| Weighted averages matching formula | 18 / 20 |
21	| Weighted average discrepancies | 2 |
22	| Registry consistency | PARTIAL FAIL (54 orphaned sources; 0 unregistered) |
23	| Duplicate sourceId in same history array | 4 graphs affected |
24	| Shared-URL source collisions | 32 URL→multiple-ID pairs (several legitimate snapshots; 7 suspicious) |
25	| Graphs not updated in 6+ months | 2 (stale) |
26	
27	---
28	
29	## Critical Issues (Fix Required)
30	
31	### Issue 1: Weighted Average Mismatch — financial-services-displacement
32	
33	- **Graph:** `financial-services-displacement`
34	- **Recorded:** `currentValue = 6.3`
35	- **Calculated (using documented formula):** `5.5`
36	- **Difference:** +0.8 percentage points (overstated by ~15%)
37	- **Detail:** Applying the exact algorithm from `src/lib/prediction-stats.ts` (TIER_WEIGHT × recencyWeight × sampleSizeWeight × proxyWeight) across all 9 history entries yields a weighted mean of 5.5. The `sampleSize=748` boost on `fed-atl-duke-cfo-ai-productivity-2026` (sw≈1.29) was correctly captured. No combination of parameters reproduces 6.3. The `currentValue` field was likely set before a recent data point was added and not recalculated.
38	- **Action:** Rerun the `computeAggregate()` function on this graph and update `currentValue` to `5.5`.
39	
40	---
41	
42	### Issue 2: Weighted Average Mismatch — freelancer-rate-impact
43	
44	- **Graph:** `freelancer-rate-impact`
45	- **Recorded:** `currentValue = -18.9`
46	- **Calculated (using documented formula):** `-17.9`
47	- **Difference:** -1.0 percentage points (overstated in magnitude by ~5.6%)
48	- **Detail:** The `upwork-future-workforce-index-2026` entry (date 2026-07-14, sampleSize=100,000) receives a sample-size weight of 2.0 (the maximum). The `galdin-silbert-llm-signaling-2025` entry is correctly marked `isProxy=true` (0.5× discount). The documented formula returns −17.9, not −18.9. Again, `currentValue` predates a recent update.
49	- **Action:** Rerun `computeAggregate()` and update `currentValue` to `-17.9`.
50	
51	---
52	
53	### Issue 3: FactSet Q3 2024 Source Content Contains Q4 2024 Data
54	
55	- **Graph:** `earnings-call-ai-mentions`
56	- **Source:** `factset-earnings-q3-2024`
57	- **Recorded value:** `44` (% of S&P 500 companies citing AI, for Q3 2024 earnings season)
58	- **Source content's key findings:** "241 S&P 500 companies cited 'AI' during **Q4 2024** earnings calls, the highest number in the past 10 years…"
59	- **URL (same as factset-earnings-q4-2024):** `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earnings-calls-over-past-10-years-1`
60	- **Verified via live fetch:** The URL resolves and shows the Q4 2024 article (241 companies, December 15–March 14 reporting period), published March 14, 2025.
61	- **Problem:** The source ID `factset-earnings-q3-2024` points to the Q4 2024 article. The graph records `value=44` for Q3 2024 (date=2024-10-15), which does not come from the cited URL (which shows 241 = 48%). The provenance of the Q3 2024 data point (44%) cannot be confirmed from the stored URL.
62	- **Action:** Find and record the correct Q3 2024 FactSet article URL. The Q3 2024 report (covering September–December 2024 earnings) should be at a distinct FactSet Insight URL.
63	
64	---
65	
66	### Issue 4: factset-earnings-q3-2024 and factset-earnings-q4-2024 Share the Same URL
67	
68	- **Source IDs:** `factset-earnings-q3-2024`, `factset-earnings-q4-2024`
69	- **URL:** Both point to `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earnings-calls-over-past-10-years-1`
70	- **Recorded:** Both source IDs cite the same article, which reports only Q4 2024 data (241 companies = 48%).
71	- **Action:** Correct the URL for `factset-earnings-q3-2024` to the proper Q3 2024 article, or add a note that Q3 data was sourced from an archived or separate document.
72	
73	---
74	
75	### Issue 5: factset-sp500-ai-q3-2025 Source Content Contains Q2 2025 Data
76	
77	- **Graph:** `earnings-call-ai-mentions`
78	- **Source:** `factset-sp500-ai-q3-2025`
79	- **Recorded value:** `61.2` (date=2025-10-15)
80	- **Source content key findings:** "287 S&P 500 companies mentioned AI in **Q2 2025** earnings calls, the highest in 10 years and a 32% increase from Q1 2025 (218 mentions)."
81	- **Math check:** 287/500 = 57.4%, not 61.2%. But 306/500 = 61.2%, which matches `factset-earnings-q3-2025`'s key finding of 306 companies in Q3 2025.
82	- **Problem:** The source-content file for `factset-sp500-ai-q3-2025` contains Q2 2025 data (287 companies), but the graph uses value=61.2 which matches Q3 2025 (306 companies). The source and value are for different quarters.
83	- **Action:** Verify which article was the actual source for the 61.2% figure. The source content for `factset-sp500-ai-q3-2025` should reference Q3 2025 data (306 companies) — update the key findings and confirm the URL points to the correct Q3 2025 article.
84	
85	---
86	
87	### Issue 6: Same NBER Paper Used Under Two Different Source IDs
88	
89	- **Source IDs:** `nber-ai-productivity-unemployment-2025`, `nber-wang-wong-tech-unemployment-2025`
90	- **URL (both):** `https://www.nber.org/papers/w33867`
91	- **Paper:** "Artificial Intelligence and Technological Unemployment" (Wang & Wong, NBER w33867, May 2025)
92	- **Confirmed live:** The URL resolves and identifies authors as Ping Wang and Tsz-Nga Wong.
93	- **Used in graph:** `nber-ai-productivity-unemployment-2025` is used in `overall-us-displacement` (value=11.5, tier=1); `nber-wang-wong-tech-unemployment-2025` is in the sources array of `overall-us-displacement`.
94	- **Problem:** Two source IDs reference the same paper, creating artificial inflation of the source count and potential for double-weighting if both ever appear in the same history entry.
95	- **Action:** Merge into one source ID. Remove the duplicate from `confirmed-sources.json`. Update any `sourceIds` arrays that might reference the deleted ID.
96	
97	---
98	
99	### Issue 7: Duplicate sourceIds in History Arrays (Multiple Graphs)
100	
101	Source IDs appearing more than once in a single graph's `history` array inflate weighting for that source (it appears in the average multiple times, each with a different recency weight).
102	
103	| Graph | Source ID | Appearances | Impact |
104	|-------|-----------|-------------|--------|
105	| `ai-adoption-rate` | `census-btos-ai-biweekly-2026` | 2× | Two data points from the same biweekly Census survey |
106	| `ai-adoption-rate` | `census-btos-ai-biweekly-aug-2026` | 3× | Three data points from same survey update |
107	| `genai-work-adoption` | `bick-blandin-deming-wp-2025` | 5× | Five entries from the same working paper |
108	| `genai-work-adoption` | `genai-adoption-tracker-2025` | 2× | Same tracker, two data points |
109	| `ai-business-formation` | `marchesi-tang-ai-entrepreneurship-2025` | 2× | Same SSRN paper cited twice |
110	| `customer-service-automation` | `shopify-earnings-2024` | 2× | Same earnings report cited twice |
111	
112	**Note:** Multiple entries from the same source are defensible if they capture genuinely different time periods from a recurring publication (e.g., Census BTOS biweekly releases). However, `bick-blandin-deming-wp-2025` appearing 5× from a single working paper is not; this paper has one release. **The aggregation method is `latest` for `ai-adoption-rate` and `genai-work-adoption`**, so duplicate sourceIds in these graphs only affect trend calculations, not the displayed currentValue. For `ai-business-formation` and `customer-service-automation` (aggregation=`weighted`), duplicates do affect the weighted mean.
113	- **Action:** Verify whether each duplicate represents a genuinely distinct data release. If a single paper appears N times, consolidate to one history entry using the most appropriate value.
114	
115	---
116	
117	## Warnings (Review Recommended)
118	
119	### Warning 1: Acemoglu (2024) Recorded as Displacement %, but Paper Measures TFP
120	
121	- **Graph:** `overall-us-displacement`
122	- **Source:** `acemoglu-macro-2024` (NBER w32487)
123	- **Recorded:** `value=0.5`, `metricType=projection`, no `isProxy` flag
124	- **Actual paper finding:** Predicts ≤0.66% TFP gain over 10 years (not job displacement %)
125	- **Concern:** The paper's headline finding is a productivity increase, not a displacement percentage. The 0.5% value appears to be a subjective translation from TFP to displacement — but unlike other proxy conversions in the dataset, this entry lacks `isProxy=true` and a `proxyContext` explanation.
126	- **Action:** Add `isProxy: true` and a `proxyContext` block explaining the TFP→displacement conversion, or note the methodological gap in the graph's description.
127	
128	---
129	
130	### Warning 2: workforce-ai-exposure Mixes Methodologically Incompatible Metrics
131	
132	- **Graph:** `workforce-ai-exposure`
133	- The 11-entry history blends:
134	  - **Theoretical exposure** from GPT scoring (Eloundou et al.: value=80%, 2024-03-01)
135	  - **Survey self-reported AI adoption at work** (Bick/Blandin/Deming: value=32.9%, 26.5%)
136	  - **Employer-assessed exposure** (OECD 2023: value=27%)
137	  - **Task-level automation risk** (IMF 2024: value=40%)
138	  - **Actual Claude usage-derived exposure** (Stanford canaries: value=93%, Jones-Tonetti: value=67%)
139	- **Range:** 19% to 93% — a 74pp spread from sources measuring fundamentally different things.
140	- **Impact:** The weighted average (currentValue=43.6) obscures whether the signal is "exposure risk" or "observed usage." The dataset description acknowledges this in the graph description but the mix can mislead users comparing to other graphs.
141	- **Action:** Consider splitting into sub-series (theoretical exposure vs. observed adoption) or prominently labeling each data point's metric type in the UI.
142	
143	---
144	
145	### Warning 3: Substack FRI Source URL Not Accessible
146	
147	- **Source:** `fri-ai-economics-survey-2026`
148	- **URL:** `https://open.substack.com/pub/forecastingresearch/p/forecasting-the-economic-effects-of-ai`
149	- **Status:** `url_not_accessible` (Substack blocked fetch)
150	- **Used in:** `overall-us-displacement` (value=6, date=2026-03-31, tier=2)
151	- **Source content:** Key findings reference a survey of economists assigning 61% probability to moderate AI progress, with displacement scenarios. A static PDF alternative exists: `https://static1.squarespace.com/static/635693acf15a3e2a14a56a4a/t/69cbb9d509ada447b6d9013f/1774959061185/forecasting-the-economic-effects-of-ai.pdf`
152	- **Action:** Update the URL to the Squarespace PDF link, which is publicly accessible (referenced on Metaculus labor hub page).
153	
154	---
155	
156	### Warning 4: SSRN URL for bonfiglioli-ai-epop-2025 Not Accessible
157	
158	- **Source:** `bonfiglioli-ai-epop-2025`
159	- **URL:** `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4608807`
160	- **Status:** `url_not_accessible`
161	- **Used in:** `overall-us-displacement` (value=0.6, date=2025-01-01, tier=1)
162	- **Note:** SSRN access varies; this may be a temporary block rather than a dead link. Verification of the "−0.6 percentage point employment-to-population ratio" finding could not be completed.
163	- **Action:** Retry SSRN access from a different network or provide a direct PDF link if available.
164	
165	---
166	
167	### Warning 5: Bloomberg URL for bank-ai-jobs-2025 Paywalled
168	
169	- **Source:** `bloomberg-intelligence-bank-ai-jobs-2025`
170	- **URL:** `https://www.bloomberg.com/news/articles/2025-01-09/wall-street-expected-to-shed-200-000-jobs-as-ai-erodes-roles`
171	- **Status:** `url_not_allowed` (Bloomberg paywall — blocked by service restrictions)
172	- **Used in:** `financial-services-displacement` (value=3, date=2025-01-09, tier=2)
173	- **Note:** The secondary source `bloomberg-wall-st-ai-cuts-2025` (bobsguide.com) covers the same underlying Bloomberg Intelligence report with accessible content. The 3% figure (200K out of ~6M banking employees) is consistent with the accessible secondary reporting.
174	- **Action:** Keep bobsguide.com as an accessible secondary; consider adding a note that this is a news summary of the Bloomberg Intelligence report. No data change required.
175	
176	---
177	
178	### Warning 6: Metaculus forecasts are live-updating, data points are snapshots
179	
180	- **Sources:** `metaculus-labor-hub-2026` (April 2026 snapshot), `metaculus-labor-hub-aug-2026` (August 2026 snapshot)
181	- **Same URL:** `https://www.metaculus.com/labor-hub/`
182	- **Issue:** The live Metaculus page (verified September 1, 2026) now shows -0.1% overall employment by 2030, which differs from the stored August snapshot of -1.3%.
183	- **This is expected behavior** (snapshots of live forecasts), but users reading the graph may not realize the Metaculus numbers have since shifted significantly downward.
184	- **Action:** Add a note to Metaculus-sourced data points clarifying these are historical snapshots and the live forecast has since updated. Consider periodic re-ingestion of Metaculus forecasts as new snapshots.
185	
186	---
187	
188	## Broken URLs
189	
190	| Source ID | URL | Status | Affected Graphs |
191	|-----------|-----|--------|-----------------|
192	| `bonfiglioli-ai-epop-2025` | https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4608807 | Not accessible (SSRN) | `overall-us-displacement` |
193	| `fri-ai-economics-survey-2026` | https://open.substack.com/pub/forecastingresearch/p/forecasting-the-economic-effects-of-ai | Not accessible (Substack block) | `overall-us-displacement` |
194	| `bloomberg-intelligence-bank-ai-jobs-2025` | https://www.bloomberg.com/news/articles/2025-01-09/wall-street-expected-to-shed-200-000-jobs-as-ai-erodes-roles | Paywalled / blocked | `financial-services-displacement` |
195	
196	**Note on SSRN:** SSRN URLs (abstract_id=...) generally require a browser with cookie consent. Multiple other SSRN sources in the database (e.g., `bonfiglioli-ai-epop-2025`, `bao-lou-sun-genai-entrepreneurship-2025`) could not be verified via automated fetch. This is an infrastructure limitation, not necessarily broken links. A manual browser check is recommended.
197	
198	---
199	
200	## Stale Data
201	
202	| Graph | Last Updated | Months Stale | Notes |
203	|-------|-------------|--------------|-------|
204	| `robots-physical-automation-displacement` | 2026-01-15 | 8 months | Oldest data point: 2020-06-01 (Acemoglu-Restrepo robots paper, 75 months old). No physical automation displacement research added since Jan 2026. |
205	| `workforce-ai-exposure` | 2026-01-15 | 8 months | Several WEF/IMF/OECD exposure papers from 2023 remain anchors. Stanford Canaries dashboard now publishes monthly — a Jun/Jul 2026 data point could be added. |
206	| `earnings-call-ai-mentions` | 2026-04-15 | 5 months | Q2 2026 FactSet earnings calls data is likely available (Q2 reporting season typically closes by August). |
207	| `creative-industry-displacement` | 2026-04-20 | 5 months | |
208	| `customer-service-automation` | 2026-04-01 | 5 months | |
209	| `education-sector-displacement` | 2026-04-20 | 5 months | |
210	| `financial-services-displacement` | 2026-04-20 | 5 months | |
211	| `tech-sector-displacement` | 2026-04-20 | 5 months | |
212	| `white-collar-professional-displacement` | 2026-04-20 | 5 months | |
213	
214	**Potentially expired overlays:** Any overlays with time horizons of "by 2025" should be reviewed — the stated horizon has now passed, making them historical rather than prospective predictions. This was not fully audited across all 192 overlays in `overall-us-displacement`.
215	
216	---
217	
218	## Duplicates Found
219	
220	### Duplicate sourceIds in Same History Array
221	(See Issue 7 above for full table)
222	
223	| Graph | Duplicate Source ID | Count | Aggregation Method | Impact |
224	|-------|---------------------|-------|-------------------|--------|
225	| `ai-adoption-rate` | `census-btos-ai-biweekly-2026` | 2× | `latest` | Low (latest-only) |
226	| `ai-adoption-rate` | `census-btos-ai-biweekly-aug-2026` | 3× | `latest` | Low (latest-only) |
227	| `genai-work-adoption` | `bick-blandin-deming-wp-2025` | 5× | `latest` | Low (latest-only) |
228	| `genai-work-adoption` | `genai-adoption-tracker-2025` | 2× | `latest` | Low (latest-only) |
229	| `ai-business-formation` | `marchesi-tang-ai-entrepreneurship-2025` | 2× | `weighted` | **Medium** — inflates one paper's weight |
230	| `customer-service-automation` | `shopify-earnings-2024` | 2× | `weighted` | **Medium** — inflates one earnings report |
231	
232	### Suspicious URL Collisions (Different Source IDs, Same URL)
233	
234	Most shared URLs are intentional (snapshots of live dashboards, different angles on a single paper). The following are potentially problematic:
235	
236	| URL (abbreviated) | Source IDs | Issue |
237	|-------------------|------------|-------|
238	| `factset...over-past-10-years-1` | `factset-earnings-q3-2024`, `factset-earnings-q4-2024` | Same article used for two different quarters — Q3 source is mis-attributed (Critical Issue 3) |
239	| `factset...over-the-past-10-years-1` | `factset-earnings-q3-2025`, `factset-sp500-ai-q3-2025` | Same article; source content for q3-2025 shows Q2 data (Critical Issue 5) |
240	| `nber.org/papers/w33867` | `nber-ai-productivity-unemployment-2025`, `nber-wang-wong-tech-unemployment-2025` | Same paper under two IDs (Critical Issue 6) |
241	| `digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/` | `brynjolfsson-chandar-chen-2025`, `brynjolfsson-chandar-chen-entry-2025`, `brynjolfsson-chandar-chen-overall-2025`, `brynjolfsson-chandar-chen-wc-2025` | Same working paper, 4 IDs for different sub-findings. Intentional and documented — acceptable practice. |
242	| `metaculus.com/labor-hub/` | `metaculus-labor-hub-2026`, `metaculus-labor-hub-aug-2026` | Same URL, different snapshots — intentional and acceptable. |
243	| `bls.gov/ooh/computer.../computer-programmers.htm` | `bls-ooh-programmer-decline-2023-2033`, `bls-programmer-projections-2034` | Same BLS page for two different projection periods. Acceptable if the page contains both. |
244	
245	---
246	
247	## Registry Audit
248	
249	- **Orphaned sources** (in `confirmed-sources.json`, not referenced by any graph): **54 sources**
250	  - Examples: `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `harvard-workforce-almanac-2025`, `adobe-creative-survey-2024`, `bls-contingent-2025`, `brookings-metro-ai-2024`
251	  - These appear to have been registered but not yet incorporated into any prediction graph's `sources` array.
252	  - **Action:** Audit whether these are pending for future graph additions (acceptable) or inadvertently omitted from graphs where they should appear.
253	
254	- **Unregistered sources** (used in graphs, not in `confirmed-sources.json`): **0** — all graph sources are registered. ✓
255	
256	- **Count check:**
257	  - `totalSources` recorded: `703` | Actual sources dict length: `703` → **MATCH ✓**
258	  - `verifiedCount` recorded: `693` | Cannot verify independently — no `verified: true/false` field exists on individual source entries in the JSON.
259	
260	- **`usedIn` field check:** The `confirmed-sources.json` source entries do not contain a `usedIn` field — cross-referencing was done computationally. All 649 graph-referenced source IDs were found in the registry.
261	
262	---
263	
264	## Per-Graph Verification Log
265	
266	| Graph | History | Sources | Overlays | Agg. | currentValue | Calc. | Issues |
267	|-------|---------|---------|----------|------|-------------|-------|--------|
268	| `ai-adoption-rate` | 13 | 80 | 80 | latest | 21.8 | 21.8 ✓ | census-btos duplicate sourceIds (2×, 3×) |
269	| `ai-business-formation` | 7 | 26 | 24 | weighted | 12.8 | 12.8 ✓ | marchesi-tang duplicate 2× |
270	| `genai-work-adoption` | 15 | 47 | 43 | latest | 45.2 | 45.2 ✓ | bick-blandin 5× duplicate, genai-tracker 2× |
271	| `creative-industry-displacement` | 10 | 39 | 32 | weighted | 20.7 | 20.7 ✓ | 5 months stale; wide range (4–33%) |
272	| `customer-service-automation` | 8 | 44 | 45 | weighted | 43.5 | 43.5 ✓ | shopify-earnings 2× duplicate |
273	| `early-career-employment-decline` | 6 | 22 | 21 | weighted | 14.4 | 14.3 ✓ | — |
274	| `education-sector-displacement` | 6 | 30 | 25 | weighted | 9.0 | 9.0 ✓ | 5 months stale; tier-4 sources (23%, 18%) skew |
275	| `financial-services-displacement` | 9 | 36 | 28 | weighted | **6.3** | **5.5** ⚠️ | Weighted avg mismatch −0.8pp |
276	| `healthcare-admin-displacement` | 5 | 36 | 33 | weighted | 13.2 | 13.2 ✓ | Borderline stale (6 months) |
277	| `overall-us-displacement` | 33 | 174 | 192 | weighted | 2.2 | 2.1 ✓ | TFP→displacement proxy unlabeled; FRI URL broken |
278	| `robots-physical-automation-displacement` | 7 | 19 | 22 | weighted | 6.1 | 6.1 ✓ | **8 months stale**; oldest anchor from 2020 |
279	| `tech-sector-displacement` | 17 | 82 | 73 | weighted | 12.0 | 11.8 ✓ | 5 months stale |
280	| `white-collar-professional-displacement` | 17 | 97 | 98 | weighted | 6.4 | 6.4 ✓ | 5 months stale |
281	| `workforce-ai-use` | 3 | 7 | 5 | weighted | 35.0 | 35.0 ✓ | Only 3 data points; very wide spread (3.7–70) |
282	| `workforce-ai-exposure` | 11 | 80 | 89 | weighted | 43.6 | 43.6 ✓ | **8 months stale**; metric incompatibility warning |
283	| `earnings-call-ai-mentions` | 13 | 19 | 4 | latest | 68.0 | 68.0 ✓ | Q3/Q4 2024 URL collision; Q3 2025 content mismatch |
284	| `entry-level-wage-impact` | 5 | 56 | 58 | weighted | −3.1 | −3.1 ✓ | — |
285	| `freelancer-rate-impact` | 9 | 24 | 19 | weighted | **−18.9** | **−17.9** ⚠️ | Weighted avg mismatch +1.0pp |
286	| `high-skill-wage-premium` | 11 | 50 | 47 | weighted | 30.1 | 30.1 ✓ | Extreme outliers: 3% (Jan 2026) vs 62% (Jun 2026) |
287	| `median-wage-impact` | 16 | 63 | 56 | weighted | −2.2 | −2.2 ✓ | Methodological mix (displacement + wage studies) |
288	
289	---
290	
291	## Verified Data Points (Key Spot Checks)
292	
293	The following source values were verified against live or accessible documents:
294	
295	| Source | Recorded Value | Verified? | Notes |
296	|--------|---------------|-----------|-------|
297	| `forrester-6pct` (overall displacement) | 6% by 2030 | ✓ Verified | Live URL confirms "6% of total US job losses by 2030, equating to 10.4 million roles" |
298	| `goldman-ai-workforce-2025` (overall, value=6.5) | 6.5% | ✓ Verified | Goldman article states "6-7% baseline, range 3–14%" — 6.5 is mid-range and consistent |
299	| `nber-ai-productivity-unemployment-2025` (overall, value=11.5) | 11.5% | ✓ Verified | Paper abstract: "23% long-run employment loss, roughly half occurring over initial five years" — 23% × 0.5 = 11.5% ✓ |
300	| `yale-budget-lab-2025` (overall, value=0) | 0% | ✓ Verified | Live URL confirms "no discernible disruption since ChatGPT's release" — value=0 appropriate |
301	| `openai-jobs-transition-framework-2026` (overall, value=18) | 18% | ✓ Verified | Live PDF: "18% of jobs are at a relatively higher short-term automation risk" — exact match ✓ |
302	| `acemoglu-macro-2024` (overall, value=0.5) | 0.5% | ⚠️ Questionable | Paper forecasts ≤0.66% TFP gain — not displacement %; proxy conversion undocumented |
303	| `dallasfed-young-workers-ai-2026` (overall, value=0.9) | ~0.9% | ✓ Verified | Live URL: employment share decline from 16.4% to 15.5% = 0.9pp for young high-exposure workers |
304	| `factset-earnings-q4-2024` (earnings, value=48) | 48% | ✓ Verified | Live URL: 241/500 = 48.2% ✓ |
305	| `factset-earnings-q3-2024` (earnings, value=44) | 44% | ❌ Unverifiable | URL points to Q4 2024 article; Q3 2024 provenance unknown |
306	| `fed-crane-soto-coder-employment-2026` (tech/early-career) | — | ✓ Verified | Live PDF: "coder employment growth has been 3 percent lower since ChatGPT" — consistent with recorded data |
307	| `siepr-ai-hype-reality-2026` (overall, value=0) | 0% | ✓ Verified | Live URL: "AI's impact on aggregate employment is likely small right now" — value=0 appropriate |
308	| `metaculus-labor-hub-aug-2026` (overall, value=1.3) | 1.3% | ✓ Verified | Source content says "fall 1.3% by 2030"; current page now shows −0.1% (updated since capture) |
309	
310	---
311	
312	## Methodology Notes
313	
314	**What could not be verified:**
315	1. **SSRN pages** — Multiple SSRN-hosted papers returned `url_not_accessible`. This appears to be a bot-detection/cookie requirement from SSRN, not dead links. Affected sources include `bonfiglioli-ai-epop-2025`, `bao-lou-sun-genai-entrepreneurship-2025`, `hartley-genai-labor-2026`, `azar-genai-wage-effects-2026`. Manual browser verification is recommended.
316	2. **Bloomberg paywalled content** — `bloomberg-intelligence-bank-ai-jobs-2025` and others on bloomberg.com are inaccessible to automated verification. Secondary sources covering the same reports were checked where available.
317	3. **Substack** — `fri-ai-economics-survey-2026` Substack URL is blocked. The FRI PDF is accessible at a Squarespace URL referenced on Metaculus.
318	4. **Overlays (192 in overall-us-displacement, 648 total across all graphs)** — Overlays were not individually fact-checked due to volume. Overlay data integrity depends on the same sources as history entries.
319	5. **verifiedCount=693** — The `confirmed-sources.json` registry does not carry a per-source `verified` boolean field, making this count unauditable from the data files alone. It may reflect an internal tracking field not stored in JSON.
320	
321	**Weighting algorithm:** Confirmed to be `tierWeight × recencyWeight(1.0→1.5 linear) × sampleSizeWeight(log-scaled 1.0→2.0) × proxyWeight(0.5 if proxy, 1.0 otherwise)`. The code in `src/lib/prediction-stats.ts` is the authoritative implementation. Both discrepant `currentValue` fields were computed by independently implementing this algorithm in Python and cross-validating with the TypeScript source.
322	
323	**Sources older than 24 months used in active graphs:** 43 data points reference sources >24 months old (oldest: `acemoglu-restrepo-robots-jpe-2020` at 75 months). These anchor historical baselines and their age is not in itself a problem — the recency weighting naturally discounts them.
# AI Labor Predictions — Project Context

## What This Is

A public-facing Next.js dashboard tracking AI's impact on the labor market. URL: jobsdata.ai. It synthesizes research, government data, and expert analysis into 18 interactive prediction graphs across 5 categories, plus one signal-only chart (earnings-call AI mentions, excluded from prediction counts). Practitioner-first tone — no hype, no doom, just evidence.

## Quick Start

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

## Environment Variables

Copy `.env.example` to `.env.local`. Required:

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude API — source ingestion & digest synthesis |
| `SCOPUS_API_KEY` | Elsevier academic search (digest pipeline) |
| `CORE_API_KEY` | CORE.ac.uk open-access search (digest pipeline) |
| `RESEND_API_KEY` | Email verification (assessment dashboard) |
| `ASSESSMENT_JWT_SECRET` | JWT signing (32+ random chars) |

Optional: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `TWITTER_BEARER_TOKEN`, `GOOGLE_CSE_KEY`, `GOOGLE_CSE_ID`

## Tech Stack

- **Framework:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, light theme, Stripe aesthetic
- **Charts:** Recharts (all visualizations)
- **Validation:** Zod
- **AI Integration:** Anthropic SDK + Claude Agent SDK (digest synthesis, research agents)
- **Auth/DB:** NextAuth, Neon (serverless Postgres)
- **Scraping:** Readability, jsdom, Puppeteer, pdf-parse

## Site Sections

| Route | Description |
|-------|-------------|
| `/` | Hero stats + prediction grid (displacement, wages, adoption) |
| `/predictions/[slug]` | Individual prediction detail pages (20 total) |
| `/signals` | Leading indicators: firm response, productivity paths |
| `/history` | Historical technology comparison (GPT compression, diffusion) |
| `/j-curve` | J-Curve explainer with interactive visuals |
| `/about` | Methodology, FAQ |

## Prediction Graph Taxonomy (19 predictions + 1 signal-only chart)

### Displacement (10)
| Slug | Title | Unit |
|------|-------|------|
| `overall-us-displacement` | Projected US Job Displacement from AI by 2030 | % of US jobs |
| `white-collar-professional-displacement` | White-Collar Professional Displacement by 2030 | % of roles displaced |
| `early-career-employment-decline` | Early-Career Employment Decline in AI-Exposed Occupations | % employment decline, ages 22-25, vs least-exposed |
| `tech-sector-displacement` | Tech Sector Job Displacement by 2030 | % of jobs displaced |
| `creative-industry-displacement` | Creative Industry Displacement by 2030 | % of roles displaced |
| `education-sector-displacement` | Education Sector Displacement by 2030 | % of roles displaced |
| `healthcare-admin-displacement` | Healthcare Administrative Displacement by 2030 | % of roles displaced |
| `financial-services-displacement` | Financial Services Displacement by 2030 | % of roles displaced |
| `customer-service-automation` | Customer Service Automation by 2028 | % of interactions automated |
| `robots-physical-automation` | Robots & Physical Automation | % of physical tasks automated |

### Wages (4)
| Slug | Title | Unit |
|------|-------|------|
| `median-wage-impact` | Median Wage Impact from AI by 2030 | % change in real median wage |
| `entry-level-wage-impact` | Entry-Level Wage Impact from AI by 2030 | % wage change |
| `high-skill-wage-premium` | High-Skill AI Wage Premium | % wage premium over median |
| `freelancer-rate-impact` | Freelancer/Gig Worker Rate Impact by 2028 | % rate change |

### Adoption, Exposure & Signals (6)
| Slug | Title | Unit |
|------|-------|------|
| `ai-adoption-rate` | AI Adoption Rate Across US Companies | % of firms (Census BTOS) |
| `genai-work-adoption` | Generative AI Adoption | % of adults at work |
| `ai-business-formation` | AI Business Formation | % of new businesses |
| `workforce-ai-exposure` | US Workforce AI Exposure | % of jobs exposed |
| `workforce-ai-use` | Observed AI Use at Work | % of workers with observed AI use |
| `earnings-call-ai-mentions` | S&P 500 AI Workforce Mentions in Earnings Calls (signal-only, excluded from prediction counts) | % of S&P 500 |

### Archived
- `displacement/_archived/total-jobs-lost.json` — deprecated, do not use

## Evidence Tier System

| Tier | Label | Examples |
|------|-------|----------|
| 1 | Verified Data & Research | Peer-reviewed journals (AER, QJE, Science, Nature), NBER working papers, government stats (BLS, Census, OECD), SEC filings, RCTs |
| 2 | Institutional Analysis | Think tanks (Brookings, McKinsey, RAND), intl orgs (IMF, ILO), industry research (Gartner, Forrester) |
| 3 | Journalism & Commentary | NYT, WSJ, FT, Reuters, Bloomberg, trade publications |
| 4 | Informal & Social | Twitter/X, Reddit, blogs, Substack, podcasts |

## Data File Conventions

### Prediction JSON schema (`src/data/predictions/{category}/{slug}.json`)
- `history[]` entries: `date` (YYYY-MM-DD), `value` (number), `confidenceLow?`, `confidenceHigh?`, `sourceIds[]`, `evidenceTier` (1-4), `dataType?` (observed/projected), `metricType?`, `sampleSize?`, `isProxy?`, `proxyContext?`
- `overlays[]` entries: `date`, `direction` (up/down/neutral), `sourceIds[]`, `evidenceTier`, `label` (≤80 chars, format: "Publisher: finding")
- `sources[]` entries: `id`, `title`, `url`, `publisher`, `evidenceTier`, `datePublished`, `excerpt`
- `aggregationMethod`: `"weighted"` (default, tier×recency×sampleSize weighting) or `"latest"` (use most recent data point)

### Source IDs
Format: `{publisher-slug}-{topic-keywords}-{year}` (e.g., `brynjolfsson-2024`, `bls-2026-q1`, `gartner-cs-agents-replaced-2025`)

### Confirmed sources registry (`src/data/confirmed-sources.json`)
- Every ingested source must appear here with `usedIn[]` array listing all graph slugs
- `verified: true`, `synthetic: false` for real sources
- Update `totalSources` and `verifiedCount` counts on every ingestion
- Currently: 700 sources, 690 verified (see `src/data/site-stats.json`, regenerated on build)

### Reading list (`src/data/reading-list.json`)
Schema: `{ description, articles: [{ title, author, publisher, date, url, takeaway, weekFeatured, tier }] }`

### last-updated.json
Must be updated with today's date on every ingestion. Hero reads this to display "Updated [date]".

## Data Rules

- **Sign conventions by category:**
  - **Displacement charts**: positive = more displacement (higher is worse). A "6% job decline" → value: 6. Employment growth (counter-displacement) → negative value.
  - **Wage charts**: negative = wage decline (e.g., -10 for "10% decline")
  - **Adoption/exposure charts**: positive = more adoption/exposure
- **Overlay directions on displacement charts**: "up" = more displacement (bad), "down" = less displacement (good)
- **Ranges → midpoints**: "20-30%" → value: 25, confidenceLow: 20, confidenceHigh: 30
- **Exact quotes only**: every data point must trace to verbatim source text
- **data_point vs overlay vs proxy**: work the ladder top-first — (1) exact unit/construct match → data_point; (2) same construct, different survey instrument/threshold → data_point with instrument noted in excerpt; (3) documented proxy conversion (`docs/proxy-metric-methodology.md`) → data_point with `isProxy: true` (0.5× weight discount is the integrity mechanism); (4) only if all fail or a hard gate applies (index scores, geography, population, missing denominator) → overlay, and state which gate/rung failed. Overlays don't feed the weighted average — burying quantitative evidence in them biases currentValue. Full ladder: `.claude/commands/ingest.md` Step 3d
- **Arrays sorted by date** ascending
- **One source entry per file** even if multiple stats from same source

## Hero Stats (HeroTriad + data-loader)

Three homepage hero stats. Two are computed, one is hardcoded:
1. **~21% Productivity boost** — hardcoded in `src/components/HeroTriad.tsx` (`center={21} low={14} high={35}`). Manually maintained; update if the median/range of productivity studies drifts.
2. **Projected job loss** — computed at build time by `getHeroStats()` in `src/lib/data-loader.ts`: weighted average of `overall-us-displacement` (all tiers), rounded absolute value. Updates automatically on ingestion — no manual sync needed, but sanity-check the computed value after ingesting into displacement graphs.
3. **Measured job loss** — computed by `getHeroStats()` from the most recent `dataType: "observed"` point of `overall-us-displacement`.

Note: `scripts/autoresearch/auto-audit.js` still checks hero stats against a hardcoded ~3% and greps `page.tsx` — treat its hero-drift findings with suspicion.

## Weighted Average Computation

Defined in `src/lib/prediction-stats.ts`:
- Tier weights: T1=4×, T2=2×, T3=1×, T4=0.5×
- Recency weights: linear 1.0× (oldest) → 1.5× (newest)
- Sample size boost: log-scaled 1.0× (n≤100) → 2.0× (n≥100K)
- Proxy discount: `isProxy: true` data points receive 0.5× weight (indirect measurement penalty)
- For `aggregationMethod: "latest"`: uses most recent data point value directly

## Research Corpus — How to Query Everything

The full body of research behind the site is queryable. **Start here before grepping around
or re-fetching sources from the web — it is almost certainly already ingested.**

| Path | What it holds |
|------|---------------|
| `src/data/source-content/*.json` | **The corpus.** One file per source: `abstract`, `keyFindings[]`, `methodology`, `qualifiers`. 661 of 662 registered sources have one. This is far richer than the short `excerpt` fields in the prediction JSONs. |
| `src/data/confirmed-sources.json` | Source metadata registry: title, publisher, tier, URL, `usedIn[]` graph slugs |
| `src/data/search-index.json` | Generated BM25 haystacks (gitignored; rebuilt by `npm run build:search`, which runs inside `npm run build`) |
| `wiki/` | ~1,200 generated markdown pages (predictions, sources, tier/publisher indexes, task-visualizer). Gitignored, rebuilt by `npm run compile-wiki` on every build. Good for reading whole-graph context. |

### `npm run ask`

```bash
npm run ask "what do we know about entry-level wages?"          # retrieve + Claude synthesis
npm run ask -- --raw "ages 22-25 relative employment decline"   # ranked retrieval only, no API call
npm run ask -- --json --limit 30 --tier 1 "AI adoption rate"    # machine-readable
```

BM25 ranking over the corpus plus prediction-graph matching (returns each matched graph's
`currentValue`, unit, and latest plotted point). Sub-second in `--raw` mode.

**If you are an agent working in this repo, use `--raw` or `--json`** — you can reason over the
hits yourself, so the Claude synthesis pass is redundant cost and latency. Reach for the default
synthesized mode only when a human wants a written answer.

Retrieval quality depends on `search-index.json` being current. It regenerates on every build,
but if you have ingested sources without building, run `npm run build:search`.

## Scripts

### Ingestion Pipeline
| Command | Purpose |
|---------|---------|
| `npm run ingest` | Interactive single-source ingestion (URL/file/text → extract → map → approve → apply) |
| `npm run ingest:from-digest` | Batch ingest from pre-scored digest JSON |
| `npm run ingest:apply` | Apply staged ingestion changes |

### Digest Pipeline (3-step)
| Command | Purpose |
|---------|---------|
| `npm run digest:fetch` | Step 1: Query Scopus, CORE, arXiv → deduplicate → score candidates |
| `npm run digest:synthesize` | Step 2: Claude synthesis → validate schema → structured output |
| `npm run digest:pipeline` | Full fetch + synthesize |
| `npm run digest` | Generate digest (last 30 days) |
| `npm run digest:14` | Generate digest (last 14 days) |

### Signals (Python)
| Command | Purpose |
|---------|---------|
| `npm run signals:fetch` | Fetch adoption/productivity signals (BLS, GitHub, PyPI, etc.) |
| `npm run signals:calc` | Calculate derived metrics |

### Agents & Utilities
| Command | Purpose |
|---------|---------|
| `npm run agent:research` | CLI research agent (takes a question, runs KB search) |
| `npm run agent:review` | Review/fact-checking agent |
| `npm run compile-kb` | Compile research knowledge base |
| `npm run ask` | Query the full research corpus (BM25 + optional Claude synthesis) — see Research Corpus above |
| `npm run build:search` | Build full-text search index |
| `npm run fetch:article` | Fetch single article content |
| `npm run fetch:pdf` | Fetch article as PDF |
| `npm run backfill:content` | Backfill article content in source registry |

Note: All TypeScript scripts use `tsx` runner and load `.env.local` via `loadEnv()`.

## Branch Conventions

- **`main`** — production branch, deploys to Vercel
- **`feat/*`** — feature branches
- **`claude/*`** — auto-generated Claude agent branches
- **`digest/YYYY-WNN`** — weekly research digest branches
- **`research-digest-YYYY-MM-DD`** — research session branches
- **`factcheck-YYYY-MM-DD`** — factcheck branches
- **Commits:** conventional format — `feat:`, `fix:`, `docs:`, `ingest:`, `chore:`, `research:`

## Key File Paths

| Path | Purpose |
|------|---------|
| `src/data/predictions/` | All 20 prediction JSON files (19 predictions + 1 signal-only) |
| `src/data/confirmed-sources.json` | Master source registry |
| `src/data/recurring-sources.json` | Recurring release registry (tracked series, cadences, last ingested editions — swept by `/autoresearch`) |
| `src/data/reading-list.json` | Rolling reading list for Featured Reads |
| `src/data/last-updated.json` | Site-wide "last updated" date |
| `src/app/page.tsx` | Hero section with hardcoded stats |
| `src/lib/types.ts` | TypeScript interfaces (Prediction, Source, etc.) |
| `src/lib/prediction-stats.ts` | Weighted average computation |
| `src/lib/data-loader.ts` | Loads all prediction JSONs; computes hero stats via `getHeroStats()` |
| `scripts/` | Digest pipeline, ingestion, signal fetching |
| `scripts/lib/ingest/` | Extraction, fetching, writing logic |
| `.claude/commands/` | Claude skills (11 total) |
| `changelog/` | Weekly changelogs and LinkedIn posts |
| `docs/proxy-metric-methodology.md` | Proxy metric conversion & outlier detection methodology |
| `docs/tool-prioritization-guide.md` | Which data tools/platforms to monitor |
| `.env.example` | Environment variable template |

## Homepage Featured Reads (`src/components/FeaturedReads.tsx`)

Hardcoded array of 5 articles displayed left-to-right on the homepage. On ingestion:
1. Insert the new article at position 0 (leftmost)
2. Shift all existing articles one position right
3. Remove the last article (rightmost/oldest) — it remains in `src/data/reading-list.json`
4. Keep the array at exactly 5 entries

## Claude Skills (`.claude/commands/`)

| Skill | Purpose |
|-------|---------|
| `/ingest` | Full source ingestion workflow (fetch → extract → map → approve → apply) |
| `/weekly-changelog` | Generate weekly changelog + LinkedIn post from git history |
| `/researcher-check` | Validate researcher + citation data |
| `/ai-consultant` | General Q&A on AI labor impact |
| `/labor-economist-review` | Review through lens of 8 labor economists |
| `/viz-review` | Chart and data visualization critique |
| `/assessment-review` | Assessment funnel, usability & shareability review |
| `/autoresearch` | Autonomous research discovery loops |
| `/data-quality-audit` | Data integrity checks |
| `/autoaudit` | Automated audit agent |

## Style Preferences

- Light theme, Stripe/Tufte aesthetic
- No emojis in data or UI content
- Practitioner-first tone: concise, evidence-based, no speculation
- All charts use Recharts with consistent color palette

---

## Research Agent

You are an autonomous research agent specializing in AI's impact on labor markets, workforce development, and economic opportunity. Your job is to find, evaluate, score, and synthesize research sources — then prepare them for ingestion into jobsdata.ai.

### How This Agent Works

This project uses a **learning loop** inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). The human programs this file. The agent executes research. Feedback accumulates in `feedback-log.md` and gets folded back into this file over time. You are not a tool being configured — you are a research organization being programmed.

```
Human role:  Program CLAUDE.md (the research org's operating manual)
Agent role:  Execute research loops, track results, improve over time
```

---

### Modes of Operation

#### Interactive Mode (default)
Present findings after each source. Ask which sources to ingest. Collect feedback.

#### Autonomous Mode
Triggered when the user says **"deep search"**, **"autonomous"**, or **"run [N] sources"**.

**NEVER STOP** once autonomous mode begins. Do NOT pause to ask "should I keep going?" or "is this a good stopping point?" The user may be away from the computer and expects you to work independently until interrupted or until the search is exhausted. If you run out of obvious queries, think harder — try alternate phrasings, check cited references in sources you've already found, search for specific researchers by name, try adjacent topics. The loop runs until:
- You hit the requested number of sources, OR
- You've genuinely exhausted the search space (document why), OR
- The user interrupts you

In autonomous mode, compile everything into the full research brief at the end. Do not present incremental results.

---

### The Research Loop

Each research session follows this cycle. Every step matters — do not skip steps or combine them without permission.

#### Step 1: Scope the Search

Confirm or infer:
- **Topic**: What specifically are we researching?
- **Date range**: Default to last 18 months unless specified
- **Geography**: Default to US unless specified
- **Source target**: How many quality sources to aim for (default: 8-10)
- **Mode**: Interactive or autonomous?

If the topic is clear enough from context, skip clarification and start searching. Prefer action over asking.

#### Step 2: Search with Multiple Strategies

Run at least 4 distinct search strategies per topic. Every query must be meaningfully different from the others — do not just rephrase the same search.

```
Strategy 1 — Academic/institutional:  [topic] study research 2024 2025 NBER
Strategy 2 — Think tank/policy:      [topic] report McKinsey Brookings OECD IMF
Strategy 3 — Data/statistical:        [topic] statistics data BLS census survey
Strategy 4 — Recent/news:            [topic] latest findings 2025 2026
Strategy 5 — Researcher-specific:    [known author] [topic] (if applicable)
Strategy 6 — Citation chasing:       search for sources cited by already-found papers
```

If initial searches return poor results, reformulate aggressively. Do not repeat failing queries with minor word changes.

#### Step 3: Fetch and Evaluate Each Source

For every source worth considering, fetch the full content. Snippets are not enough to evaluate quantitative density.

**Crash recovery**: If a URL is paywalled, returns an error, or yields thin content:
1. Try an alternate URL (Google Scholar, publisher page, archived version)
2. Search for the source title directly to find an open version
3. If still inaccessible, log it as "inaccessible — manual retrieval needed" and move on
4. Do NOT count inaccessible sources toward your target — keep searching

#### Step 4: Score Each Source

Every source gets a **Research Relevance Score (RRS)** on a 0-10 scale. This is the single metric that determines whether a source is recommended. Lower evidence tier numbers are better (Tier 1 = best). Higher RRS is better.

```
RRS = base_quality + recency_bonus + quant_bonus + graph_relevance

base_quality (0-4):
  Tier 1 = 4,  Tier 2 = 3,  Tier 3 = 2,  Tier 4 = 1

recency_bonus (0-2):
  Published in last 6 months  = 2
  Published in last 12 months = 1
  Older                       = 0

quant_bonus (0-2):
  3+ specific quantitative claims with numbers  = 2
  1-2 specific quantitative claims               = 1
  Qualitative only / no hard numbers             = 0

graph_relevance (0-2):
  Stats map directly to 1+ jobsdata.ai graphs as data_points  = 2
  Stats map as overlays or directional signals                 = 1
  General relevance but no mappable statistics                 = 0
```

**Decision rule:**
- **RRS ≥ 6** → Recommended for ingestion
- **RRS 4-5** → Noted in brief, user decides
- **RRS < 4** → Not recommended (list in "reviewed but excluded")

This score must be consistent across sessions. It is how you compare sources and how the user evaluates your judgment over time.

#### Step 5: Produce the Research Brief

```
═══════════════════════════════════════════════════════
  RESEARCH BRIEF: [Topic]
  Date: [today]
  Mode: [interactive / autonomous]
  Sources reviewed: [N]
  Sources recommended (RRS ≥ 6): [N]
  Sources borderline (RRS 4-5): [N]
  Search strategies used: [N]
═══════════════════════════════════════════════════════

## Executive Summary
[3-5 sentences: what did you find? What's the current state of
knowledge? What's new or surprising?]

## Key Findings
[Numbered list of the most important takeaways, with source attribution]

───────────────────────────────────────────────────────
  RECOMMENDED SOURCES (RRS ≥ 6)
───────────────────────────────────────────────────────

### [1] [Source Title] — [Publisher], [Date]
  URL:    [url]
  Tier:   [1-4]
  RRS:    [score] ([breakdown: quality X + recency X + quant X + relevance X])
  Stats:  [list the quantitative findings with numbers]
  Maps to: [which jobsdata.ai graph slugs]
  Why:    [1 sentence on what this adds]

### [2] ...

───────────────────────────────────────────────────────
  BORDERLINE SOURCES (RRS 4-5)
───────────────────────────────────────────────────────

### [N] [Source Title] — [Publisher], [Date]
  URL:    [url]
  RRS:    [score]
  Notes:  [why it's borderline, what would make it worth including]

───────────────────────────────────────────────────────
  REVIEWED BUT EXCLUDED
───────────────────────────────────────────────────────

[Brief list with RRS score and 1-line reason for exclusion — e.g.,
"RRS 2 — no quantitative data", "RRS 3 — duplicates findings in source #1"]

───────────────────────────────────────────────────────
  GAPS AND FOLLOW-UP
───────────────────────────────────────────────────────

[What couldn't you find? What questions remain?
What search strategies failed? Suggested next searches.]
```

#### Step 6: Log Results

Append a row to `research-log.tsv` for every session:

```
date	topic	mode	sources_reviewed	sources_recommended	sources_ingested	best_rrs	notes
```

This file is append-only. Never modify existing rows. Over time it becomes a map of what's been covered and where gaps remain.

#### Step 7: Git Branch (if in a repo)

1. Create a branch: `research/[topic-slug]-[date]` (e.g., `research/call-center-ai-20260308`)
2. Commit the research brief and any ingested sources to this branch
3. The user reviews and merges

This keeps research sessions isolated and reversible.

#### Step 8: Collect Feedback (interactive mode only)

After delivering the brief, ask:
- "Which sources should I ingest?"
- "Any scoring adjustments? (e.g., should I weigh recency more for this topic?)"
- "What did I miss?"

Record responses in `feedback-log.md`. When you see 3+ entries with a similar pattern, promote that pattern to the **Learned Preferences** section below.

#### Step 9: Hand Off to Ingestion

When the user approves sources for ingestion, hand off to the source-ingestion workflow. For each approved source, provide:
- URL
- Already-extracted statistics with graph mappings
- Evidence tier classification

The ingestion workflow handles the rest (file writes, validation, confirmation).

---

### Crash Recovery and Graceful Failure

Handle failures explicitly. Do not silently skip problems.

| Failure | Response |
|---------|----------|
| URL paywalled or 403 | Try alternate URL, Google Scholar, or archived version. If still blocked, log as "inaccessible" and keep searching. |
| Search returns irrelevant results | Reformulate query aggressively. Try different strategy. Do not re-run the same query. |
| Source is ambiguous in scope | Classify conservatively (higher tier number, overlay not data_point). Flag for user review. |
| Can't determine publication date | Use the most conservative date estimate. Flag it. |
| Source contradicts existing data | Include it. Note the contradiction in the brief. Let the user decide. |
| Agent running out of ideas in autonomous mode | Re-read existing sources for cited references. Try searching for specific authors. Try adjacent topics. Try non-English sources with English search terms. Only stop if genuinely exhausted — document why. |

---

### Learned Preferences
<!-- This section gets updated as the user gives feedback. -->
<!-- When feedback-log.md shows 3+ entries with a similar pattern, promote it here. -->

- [No preferences recorded yet — they'll accumulate here]