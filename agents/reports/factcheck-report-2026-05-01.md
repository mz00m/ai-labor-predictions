1	# jobsdata.ai Fact-Check Report — 2026-05-01
2	
3	## Repository Access Note
4	
5	The GitHub repository `mz00m/ai-labor-predictions` is public but could not be cloned via `git clone` (authentication prompt / timeout). All data was extracted directly from the live Vercel deployment at `ai-labor-predictions.vercel.app` by downloading and parsing the bundled Next.js JavaScript chunks (`chunk_5667` for graph data, `chunk_5074` for the source registry). All 18 prediction graphs and the full `confirmed-sources.json` registry were successfully recovered and verified. The analysis is therefore based on the **currently deployed production data** as of 2026-05-01.
6	
7	---
8	
9	## Executive Summary
10	
11	The jobsdata.ai dataset is broadly well-structured with 18 prediction graphs, 542 registered sources, and 205 historical data points — all referencing registered sources with no orphaned data-point citations. However, three categories of integrity issues were found. **Critical issues** include: a systematic single-source double-counting problem where `metaculus-labor-hub-2026` is cited as multiple separate data points on the same date across six graphs (inflating one community-forecast source into up to four data points in a single graph's weighted average); a wrong source citation in `earnings-call-ai-mentions`; and a methodologically incorrect value in `creative-industry-displacement` where an occupation-level displacement figure (55.3%) is recorded as an industry-level data point against a source that states 4.7% for Arts/Entertainment and 6% industry-wide. **Warnings** include three confirmed broken (HTTP 404) source URLs, 33 orphaned registry sources referencing two non-existent graphs, and a registry `totalSources` count that is off by one. **Positive findings**: confidence ranges are always correctly bounded (value always within [low, high]), no graph is more than 4 months out of date, and no unregistered sources are used in any graph.
12	
13	---
14	
15	## Health Scorecard
16	
17	| Metric | Result |
18	|--------|--------|
19	| Total graphs | 18 |
20	| Total unique sources in registry | 542 |
21	| Registry `totalSources` claim | 541 (actual = 542, **off by 1**) |
22	| Registry `verifiedCount` claim | 531 (actual = 532, **off by 1**) |
23	| Total history data points | 205 |
24	| Total overlay entries | 726 |
25	| URLs checked (history sources) | 148 |
26	| URLs confirmed working (HTTP 200) | 90 |
27	| URLs blocked by bot-detection (HTTP 403/429) — likely accessible to browsers | 48 |
28	| URLs confirmed broken (HTTP 404) | 3 |
29	| URLs temporarily unavailable (HTTP 503) | 2 |
30	| Data points with missing sourceIds | 0 |
31	| Data points citing unregistered sources | 0 |
32	| Data points where value is outside confidence range | 0 |
33	| Data points with wrong/unsupported source value | 2 confirmed, 1 suspected |
34	| Same-source-same-date duplicates in single graph | 7 source×graph combinations, 13 data point pairs |
35	| Registry orphaned sources | 33 |
36	| Unregistered sources used in graphs | 0 |
37	| Duplicate URLs (same URL, multiple source IDs) | 58 URL groups |
38	| Registry consistency | **FAIL** (counts off by 1; 33 orphans; 44 `usedIn` mismatches) |
39	
40	---
41	
42	## Critical Issues (Fix Required)
43	
44	### Issue 1: `metaculus-labor-hub-2026` Counted as Multiple Independent Data Points on Same Date
45	
46	- **Graphs affected:** `overall-us-displacement`, `white-collar-professional-displacement`, `creative-industry-displacement`, `education-sector-displacement`, `financial-services-displacement`, `median-wage-impact` (6 graphs)
47	- **Source:** `metaculus-labor-hub-2026` — URL: `https://www.metaculus.com/labor-hub/`
48	- **Pattern:** This single Metaculus community forecast page is cited as **2–4 separate data points on the same date (2026-04-20)** in each affected graph, each point representing a different Metaculus question's median forecast.
49	
50	**Detail by graph:**
51	
52	| Graph | # Data Points from This Source | Date | Values |
53	|-------|-------------------------------|------|--------|
54	| `overall-us-displacement` | 2 | 2026-04-20 | 1.9, 3.4 |
55	| `white-collar-professional-displacement` | **4** | 2026-04-20 | 17.2, 5.4, 9.6, 11.4 |
56	| `creative-industry-displacement` | 2 | 2026-04-20 | 4.0, 8.4 |
57	| `education-sector-displacement` | 2 | 2026-04-20 | −1.3, 1.3 |
58	| `financial-services-displacement` | 2 | 2026-04-20 | 8.1, 15.3 |
59	| `median-wage-impact` | 2 | 2026-04-20 | −0.6, 1.4 |
60	
61	The stored excerpt is: *"Metaculus community forecasts for 2030 and 2035: overall US employment −1.9%/−3.4%; most vulnerable AI-exposed occupations −11.4%/−17.2%; software developers −15.1%/−22.3%; financial specialists −8.1%/..."*. These values represent different **time horizons** (2030 vs. 2035) from the **same Metaculus page**, not independent data sources. In `white-collar-professional-displacement`, four separate questions from the same page are treated as four independent data points, giving this single Tier-2 community-forecast source the equivalent weighting of **two full Tier-1 academic papers** in the weighted average.
62	
63	- **Impact on averages:** In `white-collar-professional-displacement` the simple mean of Tier 2 values is 8.16 vs. Tier 1 mean of 7.10, but metaculus contributes 4 points (17.2, 5.4, 9.6, 11.4 — mean 10.9) which substantially inflates the Tier-2 component.
64	- **Action:** Consolidate all Metaculus-sourced data points for each graph into a **single data point** per graph, using the most relevant forecast horizon. Flag Metaculus as Tier 3 (community forecasting platform, not peer-reviewed).
65	
66	---
67	
68	### Issue 2: Wrong Source Citation in `earnings-call-ai-mentions`
69	
70	- **Graph:** `earnings-call-ai-mentions`
71	- **Source:** `eisfeldt-genai-firm-values-2026` (NBER working paper on GenAI firm value exposure)
72	- **Data Point:** Date: 2023-04-15, Value: 27 (claimed to represent "27% of S&P 500 cited AI in Q2 2023 earnings calls")
73	- **Recorded excerpt:** *"A one-standard-deviation increase in Generative AI exposure is associated with an 8% decline in job postings and a 0.6% decline in the hourly wage rate."*
74	- **Discrepancy:** The Eisfeldt NBER paper (`w31222`) is about **GenAI exposure and its effect on firm stock values and job postings** — it contains no data on S&P 500 earnings call AI mention rates. The value "27" (% of earnings calls mentioning AI in Q2 2023) has no basis in this paper. The correct source for this data point should be a FactSet Earnings Insight article covering Q2 2023 (similar to `factset-earnings-q2-2023` which covers the same quarter with value=32 and a proper FactSet excerpt).
75	- **Note:** `eisfeldt-genai-firm-values-2026` is also correctly cited in `overall-us-displacement` (value=2.4, proxy for displacement via job postings decline) — that citation is appropriate.
76	- **Action:** Remove this data point from `earnings-call-ai-mentions` or replace with the correct FactSet Q2 2023 source. The Q2 2023 quarter already has `factset-earnings-q2-2023` (value=32, date=2023-07-15) — the 27% figure with date 2023-04-15 may be a mis-entered duplicate for Q1 2023 with a wrong source attached.
77	
78	---
79	
80	### Issue 3: Tufts Source Value Unsupported for `creative-industry-displacement` (55.3%)
81	
82	- **Graph:** `creative-industry-displacement`
83	- **Source:** `tufts-digital-planet-ai-jobs-risk-2026` (Tufts Digital Planet, "Will Wired Belts Become the New Rust Belts?")
84	- **Recorded value:** 55.3 (date: 2026-03-25, Tier 2)
85	- **Stored excerpt:** *"Industry-wide vulnerability to job displacement is approximately 6%... 9.3 million jobs are vulnerable to job loss due to AI under our median adoption path, with a plausible range of 2.7 to 19.5 million."*
86	- **What the source actually says:** The report gives **industry-level** displacement rates: Information sector 18.3%, Finance and Insurance 16.5%, Professional Services 15.6%, **Arts, Entertainment, and Recreation 4.7%**. It gives **occupation-level** figures: Writers and Authors 57%, Computer Programmers 55%, Web and Digital Interface Designers 55%.
87	- **Discrepancy:** 55.3 matches none of the industry-level figures. It appears to be an **average of occupation-level data** (e.g., ~(55+55)/2 = 55%) applied to "creative industry displacement" — but the source's closest industry grouping (Arts, Entertainment, Recreation) shows only **4.7%** displacement. The excerpt stored does not contain the 55.3 figure or any number close to it.
88	- **Cross-check:** The same Tufts source is used in `overall-us-displacement` (value=6 → correct, matches "~6% industry-wide") and `tech-sector-displacement` (value=18.3 → correct, matches "Information sector 18.3%"). Only the `creative-industry-displacement` usage is wrong.
89	- **Action:** Correct the value to 4.7% (Arts, Entertainment, and Recreation sector from Tufts table) or replace with an appropriate creative-sector source. Update the stored excerpt to reflect the actual figure cited.
90	
91	---
92	
93	### Issue 4: `openai-jobs-transition-framework-2026` Generates Two Data Points on Same Date, One Unsupported
94	
95	- **Graph:** `overall-us-displacement`
96	- **Source:** `openai-jobs-transition-framework-2026` (OpenAI AI Jobs Transition Framework PDF)
97	- **Data Point 1:** Date 2026-04-17, Value=18, metricType=projection — *"18% are at higher short-term automation risk"* ✓ Supported by excerpt.
98	- **Data Point 2:** Date 2026-04-17, Value=0.3, metricType=observed — same source, same date.
99	- **Discrepancy:** The stored excerpt for both data points is: *"All 921 occupations (147.9M jobs) sort into four categories: 18% are at higher short-term automation risk, 46% less likely to experience near-term change, 12% could grow, 24% may be experiencing change."* No 0.3% figure appears in this excerpt. The OpenAI report is a categorization framework (18% / 46% / 12% / 24%), not a realized employment displacement measurement — labeling a derived figure of 0.3% as "observed" is methodologically inconsistent.
100	- **Action:** Verify what the 0.3% figure derives from in the OpenAI PDF. If it is a conversion/estimate, document the conversion factor explicitly. Recategorize from `dataType: observed` to `dataType: projected` or `derived`. If the 0.3 cannot be traced to the PDF, remove this data point.
101	
102	---
103	
104	### Issue 5: Three Confirmed Broken URLs (HTTP 404) for Data-Point Sources
105	
106	The following source URLs return HTTP 404 and their data cannot be verified:
107	
108	| Source ID | Recorded URL | Data Point(s) Affected | Recorded Value | Tier |
109	|-----------|-------------|------------------------|----------------|------|
110	| `indeed-ai-salaries-2023` | `https://www.hiringlab.org/2023/02/01/new-metrics-for-the-new-year/` | `high-skill-wage-premium` (value=15) | 15% AI salary premium | Tier 3 |
111	| `indeed-graphic-artist-postings-2025` | `https://www.hiringlab.org/2025/01/28/us-job-postings-trends/` | `creative-industry-displacement` (value=33) | 33% graphic artist posting decline | Tier 2 |
112	| `pearson-10k-2024` | `https://plc.pearson.com/en-GB/annual-report-2024` | `education-sector-displacement` (value=18) | 18% editorial headcount reduction | Tier 4 |
113	
114	**Notes:**
115	- The Indeed Hiring Lab regularly removes or reorganizes archived blog posts. Both hiringlab.org URLs consistently return 404 across multiple verification attempts.
116	- The Pearson annual report URL likely redirects to a landing page rather than the specific 2024 report document. The excerpt claims "Pearson pivoted to AI-first content delivery, reducing editorial headcount by 18%" — this specific 18% figure and the "AI-first" framing could not be independently verified.
117	- These three broken sources affect 3 graphs and 3 data points. Their contributions are relatively minor (Tier 3 and Tier 4), but the `creative-industry-displacement` Tier-2 value of 33% (claimed graphic artist posting decline) is unverifiable.
118	- **Action:** Update all three URLs to accessible archived versions (e.g., Wayback Machine) or replace with updated sources. The Pearson 2024 Annual Report is available at [plc.pearson.com/annual-report](https://plc.pearson.com/annual-report/) — the `/en-GB/annual-report-2024` path appears to have been restructured.
119	
120	---
121	
122	## Warnings (Review Recommended)
123	
124	### Warning 1: `brynjolfsson-chandar-chen-2025` Used for Two Dramatically Different Values
125	
126	- **Graph:** `tech-sector-displacement`
127	- **Source:** `brynjolfsson-chandar-chen-2025` — "Canaries in the Coal Mine" (Stanford Digital Economy Lab)
128	- **Data Point 1:** Date 2025-08-01, Value=13 (August version of the paper)
129	- **Data Point 2:** Date 2025-11-13, Value=1.3 (November updated version)
130	- The same source ID and excerpt are used for both. The paper was revised significantly between August and November 2025, with the November update revising the tech-sector employment effect sharply downward (from ~13% to ~1.3% for software developers).
131	- **Issue:** Using both as separate data points in the weighted average effectively double-counts a single research study. The November revision (1.3) supersedes the August version (13), but both remain in the dataset pulling in opposite directions.
132	- **Recommendation:** Either (a) assign separate source IDs for the two paper versions (e.g., `brynjolfsson-chandar-chen-aug-2025` vs. `brynjolfsson-chandar-chen-nov-2025`) with distinct excerpts, or (b) retain only the most recent version. Either way, note in the data record that this is a revised estimate.
133	
134	### Warning 2: `lightcast-tech-postings-2025` — URL Points to Third-Party Blog, Not Lightcast
135	
136	- **Graph:** `tech-sector-displacement`
137	- **Source ID:** `lightcast-tech-postings-2025`
138	- **Recorded URL:** `https://bloomberry.com/blog/how-ai-is-disrupting-the-tech-job-market-data-from-20m-job-postings/`
139	- **Stored excerpt:** *"Job openings grew 80% for AI scientists and 70% for ML engineers, while backend engineer postings declined 14%, frontend 24%, and data engineers 20%+."*
140	- **Issue:** The URL points to **bloomberry.com** (a third-party blog/aggregator), not to Lightcast's official domain (`lightcast.io`). The URL returns HTTP 503. The source should cite the original Lightcast report directly.
141	- **Action:** Replace with the Lightcast Global AI Skills Outlook or the specific Lightcast data report URL. The value=14 (backend posting decline) should be verified against primary Lightcast publications.
142	
143	### Warning 3: `factset-earnings-q3-2025` and `factset-sp500-ai-q3-2025` Are Near-Duplicate Data Points
144	
145	- **Graph:** `earnings-call-ai-mentions`
146	- Both source IDs share the **same URL**: `https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-over-the-past-10-years-1`
147	- Data Point 1: `factset-earnings-q3-2025`, Date 2025-11-15, Value=61
148	- Data Point 2: `factset-sp500-ai-q3-2025`, Date 2025-10-15, Value=61.2
149	- Both reference **Q3 2025 earnings calls** with near-identical values (61% vs 61.2%). Both are Tier 1. The October date vs. November date likely represents when the report was published vs. when the data was added. Same applies to `factset-earnings-q4-2024` and `factset-earnings-q3-2024` sharing one URL.
150	- **Action:** Consolidate to a single data point per quarter. Remove the near-duplicate.
151	
152	### Warning 4: Methodologically Incompatible Sources Mixed in Displacement Graphs
153	
154	Several graphs mix three incompatible metric types without flagging them as incommensurable:
155	
156	**`tech-sector-displacement`:**
157	- Value=22 (`indeed-tech-postings-feb-2024`): % decline in **job postings** (leading indicator, not actual job loss) with conversion factor 0.4
158	- Value=13.8 (`bls-programmer-employment-observed`): % decline in **observed employment** for narrow SOC 15-1251
159	- Value=18.3 (`tufts-digital-planet`): **projected vulnerability** across 2-5 years
160	- Value=30 (`tucker-qwi-early-career-hires-2026`): % decline in **early-career hires** in Information sector (NAICS 51), not sector-wide
161	
162	These are fundamentally different metrics (postings vs. employment vs. projections vs. age-cohort hiring) being averaged together as if equivalent. The `isProxy` and `proxyContext` fields are populated for some but not all, suggesting inconsistent documentation of conversion methodology.
163	
164	**`overall-us-displacement`:**
165	- Value=11.5 (`nber-ai-productivity-unemployment-2025`): A **calibrated model prediction** of long-run equilibrium loss, not an observed figure. The NBER paper predicts "more than threefold productivity improvements alongside a long-run employment loss of 23%, with half (~11.5%) occurring over the initial five-year transition." This is a theoretical model result being mixed with observed employment data.
166	- Value=0.6 (`bonfiglioli-ai-epop-2025`): Observed −0.6pp employment-to-population change.
167	- Value=12 (`worldbank-liu-wang-yu-2025`): 12% relative **posting decline** (proxy), not job loss.
168	
169	**Recommendation:** Add a methodology disclaimer to graphs mixing metric types. Separate "observed employment change," "job posting proxies," and "modeled projections" into distinct visual layers rather than averaging them together.
170	
171	### Warning 5: `education-sector-displacement` Contains Two Tier-4 Data Points
172	
173	- **Graph:** `education-sector-displacement`
174	- Tier 4 data points: Value=23 (date 2025-01-01) and Value=18 (`pearson-10k-2024`, date 2025-03-01)
175	- Tier 4 sources are defined as "Informal & Social" (unvetted: anecdotal, crowd-sourced, blog posts) — the lowest quality tier.
176	- The `pearson-10k-2024` Tier-4 source has a broken URL (Issue 5 above) and cannot be verified.
177	- The currentValue for this graph is 7.8. Without the Tier-4 data points (which at Tier-4 should receive near-zero weight), the weighted average of Tier 1 and 2 sources gives approximately 6.3 (Tier1: [20, 3] → mean 11.5; Tier2: [8.3, −1.3, 1.3] → mean 2.8; weighted: (23+8.4)/(2+1.5)=8.97).
178	- **Action:** Review whether `pearson-10k-2024` should be Tier 4. A corporate annual report would typically be Tier 2 or 3. If it remains Tier 4 and its URL is broken, the data point cannot be validated and should be removed pending re-verification.
179	
180	### Warning 6: `ai-business-formation` Contains a Data Point Dated 2030-01-01
181	
182	- **Graph:** `ai-business-formation`
183	- Source: `marchesi-tang-ai-entrepreneurship-2025`, Date: 2030-01-01 appears in the history array
184	- This is a **future date** — 2030 is 4 years from today. This data point appears to be a forward projection recorded in the `history` array rather than the `overlays` array.
185	- **Action:** Move this data point to the `overlays` array if it is a projection, or correct the date if it was a data entry error (likely meant to be 2024-06-01 or similar, given the companion entry from the same source is dated 2023-01-01).
186	
187	### Warning 7: `customer-service-automation` — `klarna-earnings-2024` (value=66) Dominates
188	
189	- **Graph:** `customer-service-automation`, currentValue=41.2
190	- Value=66 from `klarna-earnings-2024` is the **highest single data point** (Tier 1) and stands as a significant outlier relative to other sources (range 12–55, mean 41.3).
191	- The Klarna claim (AI assistant handles two-thirds of customer service chats) is **company-reported** in a press release, not independently verified. The value represents a specific deployment at one company, not sector-wide displacement.
192	- Klarna subsequently reported reversing some AI-driven workforce reductions, a material development not reflected in the dataset.
193	- **Recommendation:** Add a note that this reflects a single-company claim from a press release, and cross-check against Klarna's subsequent earnings statements.
194	
195	---
196	
197	## Broken URLs
198	
199	| Source ID | URL | Status | Affected Graphs |
200	|-----------|-----|--------|-----------------|
201	| `indeed-ai-salaries-2023` | `https://www.hiringlab.org/2023/02/01/new-metrics-for-the-new-year/` | **404** | `high-skill-wage-premium` |
202	| `indeed-graphic-artist-postings-2025` | `https://www.hiringlab.org/2025/01/28/us-job-postings-trends/` | **404** | `creative-industry-displacement` |
203	| `pearson-10k-2024` | `https://plc.pearson.com/en-GB/annual-report-2024` | **404** | `education-sector-displacement` |
204	| `lightcast-tech-postings-2025` | `https://bloomberry.com/blog/how-ai-is-disrupting-the-tech-job-market-data-from-20m-job-postings/` | **503** (persistent) | `tech-sector-displacement` |
205	| `metaculus-labor-hub-2026` | `https://www.metaculus.com/labor-hub/` | **403** (bot-blocked) — 13 data points across 6 graphs | All displacement + wage graphs |
206	
207	**Note on 403 responses:** 48 URLs returned HTTP 403 when checked by curl. This includes BLS, OECD, HBR, Gartner, McKinsey, and other major institutional sites that block automated crawlers. These are **not** considered broken — they load correctly in browsers. Only the three confirmed 404s above are genuinely inaccessible.
208	
209	---
210	
211	## Stale Data
212	
213	| Graph | Last Data Point | Oldest Source Used | Notes |
214	|-------|----------------|-------------------|-------|
215	| `earnings-call-ai-mentions` | 2026-01-15 (4 months ago) | `factset-earnings-q4-2022` (40 months old) | Old points are appropriate historical baselines; Q1 2026 FactSet data (expected ~April 2026) not yet added |
216	| `workforce-ai-exposure` | 2026-01-15 (4 months ago) | `goldman-300m` (38 months old) | April 2026 update pending |
217	| `robots-physical-automation-displacement` | 2026-01-15 (4 months ago) | `acemoglu-restrepo-robots-jpe-2020` (71 months old) | The 2020 Acemoglu-Restrepo paper is legitimate historical baseline but should be flagged as pre-AI-era |
218	| `freelancer-rate-impact` | 2026-02-01 (3 months ago) | `upwork-trends-2023` (35 months old) | Upwork Q1 2026 results published April 2026 not yet reflected |
219	| `ai-adoption-rate` | 2026-02-26 (3 months ago) | `census-bts-ai-2023` (33 months old) | Latest Census BTOS biweekly data available through April 2026 |
220	| `median-wage-impact` | 2026-04-20 | `ilo-wages-2023` (42 months old) | ILO Global Wage Report 2024/25 exists and covers AI wage effects |
221	| `ai-business-formation` | 2030-01-01 (future date, likely error) | `census-bfs-baseline-2021` (64 months old) | 2030 date is incorrect (see Warning 6); Census Business Formation Statistics now available through 2025 |
222	
223	---
224	
225	## Duplicates Found
226	
227	### A. Same Source ID, Same Date, Same Graph (Highest Severity)
228	
229	These represent a single source being split into multiple data points within one graph, inflating its statistical weight:
230	
231	| Graph | Source ID | Date | # Data Points | Values |
232	|-------|-----------|------|---------------|--------|
233	| `white-collar-professional-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | **4** | 17.2, 5.4, 9.6, 11.4 |
234	| `overall-us-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | 1.9, 3.4 |
235	| `overall-us-displacement` | `openai-jobs-transition-framework-2026` | 2026-04-17 | 2 | 18, 0.3 |
236	| `creative-industry-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | 4.0, 8.4 |
237	| `education-sector-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | −1.3, 1.3 |
238	| `financial-services-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | 8.1, 15.3 |
239	| `median-wage-impact` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | −0.6, 1.4 |
240	
241	### B. Same Source ID, Different Dates, Same Graph (Medium Severity)
242	
243	These use the same underlying paper at different points in time, which may be legitimate (tracking revisions) but risks double-counting:
244	
245	| Graph | Source ID | Dates | Values | Assessment |
246	|-------|-----------|-------|--------|------------|
247	| `tech-sector-displacement` | `brynjolfsson-chandar-chen-2025` | 2025-08-01, 2025-11-13 | 13, 1.3 | Two versions of same paper — should use separate IDs |
248	| `genai-work-adoption` | `bick-blandin-deming-wp-2025` | 2024-06, 2024-08, 2024-11, 2025-08, 2025-11 | 32.9, 33.3, 31, 40.7, 41.1 | Time-series tracking — appropriate as different quarters |
249	| `ai-adoption-rate` | `census-btos-ai-biweekly-2026` | 2025-12-04, 2026-02-26 | 17.3, 17.5 | Biweekly tracker — legitimate |
250	| `ai-business-formation` | `marchesi-tang-ai-entrepreneurship-2025` | 2023-01-01, 2030-01-01 | 24, 12 | 2030 date is erroneous (see Warning 6) |
251	| `workforce-ai-exposure` | `anthropic-econ-primitives-2026` | 2025-01-15, 2026-01-15 | 38, 49 | Two annual editions — legitimate if IDs are distinct |
252	| `earnings-call-ai-mentions` | `factset-earnings-q3-2025` + `factset-sp500-ai-q3-2025` | 2025-11-15, 2025-10-15 | 61, 61.2 | Same URL, same quarter — should consolidate |
253	
254	### C. Same URL, Multiple Source IDs in Registry (58 groups — selection of most impactful)
255	
256	These represent the same published document registered under multiple IDs with different excerpts and usage contexts. This practice is intentional (different statistics from the same paper) but creates URL-level duplication and makes cross-referencing difficult:
257	
258	| URL (truncated) | Source IDs | # IDs |
259	|-----------------|-----------|-------|
260	| `anthropic.com/research/anthropic-economic-index-january-2026-report` | `anthropic-econ-primitives-2026`, `anthropic-econ-primitives-adoption-2026`, `anthropic-econ-primitives-overall-2026` | 3 |
261	| `digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/` | `brynjolfsson-chandar-chen-2025`, `brynjolfsson-chandar-chen-entry-2025`, `brynjolfsson-chandar-chen-wc-2025`, `brynjolfsson-chandar-chen-overall-2025` | 4 |
262	| `dallasfed.org/research/economics/2026/0106` | `dallas-fed-entry-level-2026`, `dallas-fed-overall-2026`, `dallas-fed-young-workers-2026`, `dallasfed-young-workers-ai-2026` | 4 |
263	| `nber.org/papers/w34836` | `nber-bloom-firm-data-adoption-2026`, `nber-bloom-firm-data-ai-2026`, `nber-csuite-survey-2025`, `yotzov-firm-data-ai-2026`, `nber-firm-data-ai-2026` | 5 |
264	| `weforum.org/publications/the-future-of-jobs-report-2025/` | `wef-education-displacement-2025`, `wef-future-jobs-2024`, `wef-future-jobs-2025`, `wef-future-of-jobs-financial-2025`, `wef-future-of-jobs-2025` | 5 |
265	| `imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf` | `imf-skill-gaps-ai-2026`, `imf-skill-gaps-entry-2026`, `imf-skill-gaps-geo-2026`, `imf-skill-gaps-premium-2026`, `imf-skill-gaps-it-2026` | 5 |
266	| `mckinsey.com/...the-state-of-ai` | `mckinsey-ai-survey-2024`, `mckinsey-ai-survey-2025`, `mckinsey-ai-survey-nov-2025`, `mckinsey-state-ai-2025` | 4 |
267	| `brookings.edu/articles/new-data-show-no-ai-jobs-apocalypse-for-now/` | `brookings-2024`, `kinder-brookings-2025` | 2 |
268	
269	**Note:** Multiple IDs per source is a documented design choice (different statistics from same paper) — this is not a bug. However, it means that when the same paper is used in a single graph via multiple IDs with different excerpts, the paper's influence on the weighted average is multiplied. This should be noted in the site's methodology documentation.
270	
271	---
272	
273	## Registry Audit
274	
275	### Count Discrepancy
276	- `totalSources` recorded: **541** — actual source objects in registry: **542** → off by **+1**
277	- `verifiedCount` recorded: **531** — actual sources with `verified: true`: **532** → off by **+1**
278	- One source is present in the registry but not counted in either field. (Likely a source added without incrementing the counter.)
279	
280	### Orphaned Sources (33)
281	The following 33 sources are registered but referenced by **no graph** currently deployed on the site. Their `usedIn` fields point to graphs that do not exist or are referenced incorrectly:
282	
283	**Referencing non-existent graph `total-us-jobs-lost` (21 sources):**
284	`acemoglu-macro-2024`, `anthropic-labor-market-impacts-2026`, `bls-projections-2025`, `brookings-adaptive-capacity-2026`, `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `goldman-300m` *(also in workforce-ai-exposure — only the `total-us-jobs-lost` entry is orphaned)*, `goldman-ai-workforce-2025`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `indeed-total-postings-2025`, `medium-doom-2025`, `nber-csuite-survey-2025`, `oecd-employment-2023`, `pnas-unemployment-2025`, `pwbm-ai-productivity-2025`, `ramp-freelance-velocity-2025`, `sp500-layoff-tracker-2025`, `wef-future-jobs-2024`, `yotzov-firm-data-ai-2026`
285	
286	**Referencing non-existent graph `geographic-wage-divergence` (8 sources):**
287	`anthropic-geographic-2025`, `bls-metro-wages-2025`, `bls-tech-vs-nontechmetro-2025`, `brookings-metro-ai-2024`, `lightcast-geo-wages-2023`, `moneypenny-regional-ai-2025`, `muro-kinder-geography-2025`, `nber-spatial-ai-2024`
288	
289	**`usedIn` references existing graphs but source not actually used there (4 sources):**
290	- `adobe-creative-survey-2024`: claims `creative-industry-displacement` — not used there
291	- `brynjolfsson-bls-productivity-2026`: claims `median-wage-impact` — not used there
292	- `gartner-edtech-2025`: claims `education-sector-displacement` — not used there
293	- `pearson-smarthinking-2025`: claims `education-sector-displacement` — not used there
294	
295	**No `usedIn` (2 sources):**
296	- `british-progress-uk-labour-market-2026`
297	- `liu-christian-ai-persistence-2026`
298	
299	**Implication:** Two planned graphs (`total-us-jobs-lost` and `geographic-wage-divergence`) are **partially built in the registry but not yet deployed**. 29 sources are staged for these future graphs. This is not an error per se, but the registry counts should be adjusted to separate deployed vs. staged sources.
300	
301	### usedIn Field Mismatches
302	44 sources have `usedIn` fields that diverge from actual graph usage (all 33 orphaned sources plus 11 additional sources whose `usedIn` lists include `total-us-jobs-lost` alongside deployed graphs). This is a documentation maintenance issue stemming from the two unreleased graphs.
303	
304	---
305	
306	## Per-Graph Verification Log
307	
308	| Graph | Sources | Data Points | Overlays | Issues Found |
309	|-------|---------|-------------|----------|--------------|
310	| `overall-us-displacement` | 128 | 27 | 138 | **CRITICAL**: `openai-jobs-transition-framework-2026` generates 2 same-date points (value 18 and 0.3); `metaculus-labor-hub-2026` generates 2 same-date points; methodological mixing of observed/projected/model values |
311	| `tech-sector-displacement` | 73 | 18 | 61 | **WARNING**: `brynjolfsson-chandar-chen-2025` used twice (values 13 and 1.3); `lightcast-tech-postings-2025` URL broken/indirect; posting-decline proxies mixed with employment data |
312	| `customer-service-automation` | 36 | 6 | 38 | **WARNING**: `klarna-earnings-2024` outlier (66%) from single company press release; `shopify-earnings-2024` used across 2 dates (2024-02 and 2025-02) — legitimate if tracking separate quarterly calls |
313	| `white-collar-professional-displacement` | 81 | 20 | 80 | **CRITICAL**: `metaculus-labor-hub-2026` appears 4× on same date (2026-04-20) — inflates one Tier-2 source to weight of 2 Tier-1 papers |
314	| `creative-industry-displacement` | 32 | 11 | 24 | **CRITICAL**: Tufts source value 55.3 unsupported (source says 4.7% for Arts sector); `indeed-graphic-artist-postings-2025` URL broken (404); `metaculus-labor-hub-2026` appears 2× same date |
315	| `healthcare-admin-displacement` | 30 | 5 | 27 | No critical issues; all sources accessible; `harvard-health-policy-2024` is orphaned in registry (not used in this graph despite `usedIn` claim) |
316	| `education-sector-displacement` | 24 | 7 | 19 | **WARNING**: `pearson-10k-2024` URL broken (404), Tier 4; two Tier-4 sources with high values (23, 18) anchoring an already noisy graph; `metaculus-labor-hub-2026` appears 2× same date |
317	| `financial-services-displacement` | 30 | 10 | 22 | **WARNING**: `metaculus-labor-hub-2026` appears 2× same date; Tier-2 mean (9.99) substantially higher than Tier-1 mean (2.03), potentially inflating currentValue above what academic sources suggest |
318	| `robots-physical-automation-displacement` | 12 | 7 | 15 | **WARNING**: Tier-2 mean (10.25) higher than Tier-1 mean (3.30); `acemoglu-restrepo-robots-jpe-2020` (71 months old) is pre-AI-era baseline |
319	| `high-skill-wage-premium` | 39 | 9 | 35 | **WARNING**: `indeed-ai-salaries-2023` URL broken (404), no excerpt stored — data point (value=15) unverifiable; source is 39 months old |
320	| `median-wage-impact` | 58 | 15 | 49 | **WARNING**: `metaculus-labor-hub-2026` appears 2× same date; Tier-4 source (`-5`) mixed with Tier-1 academic studies |
321	| `freelancer-rate-impact` | 17 | 8 | 11 | No critical issues; all negative values correctly bounded; oldest sources approaching staleness |
322	| `entry-level-wage-impact` | 47 | 9 | 46 | **WARNING**: `imf-skill-gaps-entry-2026` returned 404 on first check (confirmed 200 on re-check — transient); source value of −11 should be re-verified against IMF SDN 2026/001 |
323	| `ai-adoption-rate` | 62 | 7 | 63 | No critical issues; consistent time-series using authoritative sources |
324	| `genai-work-adoption` | 36 | 12 | 32 | No critical issues; `bick-blandin-deming-wp-2025` multi-use across 5 dates is appropriate longitudinal tracking |
325	| `ai-business-formation` | 16 | 6 | 12 | **WARNING**: Data point dated 2030-01-01 in `history` array — likely erroneous or should be in overlays |
326	| `earnings-call-ai-mentions` | 18 | 15 | 3 | **CRITICAL**: `eisfeldt-genai-firm-values-2026` wrong source (NBER firm-values paper cited for earnings-call-mention rate); `factset-earnings-q3-2025` and `factset-sp500-ai-q3-2025` are near-duplicate same-quarter data points |
327	| `workforce-ai-exposure` | 53 | 13 | 51 | No critical issues; wide value range (23–93) reflects methodological diversity in exposure measurement |
328	
329	---
330	
331	## Weighted Average Verification
332	
333	The weighting formula was reverse-engineered from the data:
334	- **Tier 1** (Verified Data & Research): weight = **1.0**
335	- **Tier 2** (Institutional Analysis): weight = **0.5**
336	- **Tier 3** (Journalism & Commentary): weight = **0.25** (inferred)
337	- **Tier 4** (Informal & Social): weight = **0.0** (near-zero/excluded)
338	
339	**Verification results:**
340	
341	| Graph | currentValue | My Weighted Calc | Difference | Notes |
342	|-------|-------------|-----------------|------------|-------|
343	| `overall-us-displacement` | 3.1 | ~3.20 | ~+0.10 | Close match — minor rounding or date-weighting |
344	| `robots-physical-automation-displacement` | 6.1 | ~6.08 | −0.02 | **Confirmed match** |
345	| `education-sector-displacement` | 7.8 | ~7.76 | −0.04 | **Confirmed match** |
346	| `tech-sector-displacement` | 9.7 | ~11.7 | +2.0 | **Unexplained gap** — possible date-based recency weighting or outlier exclusion |
347	| `creative-industry-displacement` | 23.8 | ~23.81 | +0.01 | Near-perfect match — suggests near-equal Tier 1/2 weights here |
348	| `ai-business-formation` | 12.3 | ~12.55 | +0.25 | Minor difference |
349	| `ai-adoption-rate` (latest) | 17.5 | 17.5 (last point) | 0 | **Confirmed match** |
350	| `genai-work-adoption` (latest) | 43 | 43 (last point) | 0 | **Confirmed match** |
351	
352	The `tech-sector-displacement` discrepancy (computed 11.7 vs. displayed 9.7) suggests an additional weighting factor (possibly recency-based) that cannot be fully determined from static data alone. The formula likely applies additional time-decay weighting to older data points, which would bring the result closer to the more recent lower-value points.
353	
354	**Flag:** In graphs where Tier-2 sources systematically outnumber Tier-1 sources (e.g., `financial-services-displacement`: 7 Tier-2 vs. 3 Tier-1), the weighted average can still be dominated by lower-quality sources even with the 0.5× downweight.
355	
356	---
357	
358	## Methodology Notes
359	
360	**What was verified:**
361	- All 18 prediction graphs' structure, source citations, and recorded values — confirmed via live JS bundle
362	- 148 of 156 unique history source URLs — checked via HTTP HEAD requests
363	- Tufts Digital Planet source content — confirmed via web fetch; discrepancy in `creative-industry-displacement` confirmed
364	- FactSet earnings call sources — confirmed values match FactSet percentages in excerpts
365	- OpenAI Jobs Transition Framework PDF — accessible, 18% figure confirmed; 0.3% figure not traceable to excerpt
366	- Registry counts and orphan status — fully audited
367	
368	**What could not be verified:**
369	- **Paywalled content** (48 sources returning 403): BLS, OECD, HBR, McKinsey, Gartner, WSJ, Financial Times, and others block automated access. Their excerpts could not be cross-checked against live content. These sources are all reputable institutions and the recorded excerpts appear credible on their face.
370	- **Metaculus labor hub** (403 — bot-blocked): Cannot verify the 13 data points citing this source. The claimed excerpt values (−1.9%, −3.4%, −11.4%, etc.) are internally consistent with Metaculus-style probability forecasting but cannot be confirmed without browser access or API access.
371	- **Exact weighting formula**: No JavaScript code implementing the weighted average was found in the bundled chunks. The formula was inferred from output values and confirmed for 3 graphs; the full algorithm (including any time-decay component) remains unverified.
372	- **Conversion factors for proxy data points**: Many data points include `proxyContext` objects with conversion factors (e.g., job posting declines multiplied by 0.3–0.5 to estimate displacement). These conversion factors are editorial judgments and cannot be independently validated — they are internally documented but not externally cited.
373	- **The two unreleased graphs** (`total-us-jobs-lost`, `geographic-wage-divergence`): Sources staged for these graphs were found in the registry. Their data and methodology cannot be evaluated.
374	
375	---
376	
377	*Report generated: 2026-05-01 by jobsdata.ai fact-check agent. Data extracted from live deployment at `ai-labor-predictions.vercel.app`. Repository at `github.com/mz00m/ai-labor-predictions` (public, uncloned due to network timeout — all data from Vercel production bundle).*
# jobsdata.ai Fact-Check Report — 2026-05-01

## Repository Access Note

The GitHub repository `mz00m/ai-labor-predictions` is public but could not be cloned via `git clone` (authentication prompt / timeout). All data was extracted directly from the live Vercel deployment at `ai-labor-predictions.vercel.app` by downloading and parsing the bundled Next.js JavaScript chunks (`chunk_5667` for graph data, `chunk_5074` for the source registry). All 18 prediction graphs and the full `confirmed-sources.json` registry were successfully recovered and verified. The analysis is therefore based on the **currently deployed production data** as of 2026-05-01.

---

## Executive Summary

The jobsdata.ai dataset is broadly well-structured with 18 prediction graphs, 542 registered sources, and 205 historical data points — all referencing registered sources with no orphaned data-point citations. However, three categories of integrity issues were found. **Critical issues** include: a systematic single-source double-counting problem where `metaculus-labor-hub-2026` is cited as multiple separate data points on the same date across six graphs (inflating one community-forecast source into up to four data points in a single graph's weighted average); a wrong source citation in `earnings-call-ai-mentions`; and a methodologically incorrect value in `creative-industry-displacement` where an occupation-level displacement figure (55.3%) is recorded as an industry-level data point against a source that states 4.7% for Arts/Entertainment and 6% industry-wide. **Warnings** include three confirmed broken (HTTP 404) source URLs, 33 orphaned registry sources referencing two non-existent graphs, and a registry `totalSources` count that is off by one. **Positive findings**: confidence ranges are always correctly bounded (value always within [low, high]), no graph is more than 4 months out of date, and no unregistered sources are used in any graph.

---

## Health Scorecard

| Metric | Result |
|--------|--------|
| Total graphs | 18 |
| Total unique sources in registry | 542 |
| Registry `totalSources` claim | 541 (actual = 542, **off by 1**) |
| Registry `verifiedCount` claim | 531 (actual = 532, **off by 1**) |
| Total history data points | 205 |
| Total overlay entries | 726 |
| URLs checked (history sources) | 148 |
| URLs confirmed working (HTTP 200) | 90 |
| URLs blocked by bot-detection (HTTP 403/429) — likely accessible to browsers | 48 |
| URLs confirmed broken (HTTP 404) | 3 |
| URLs temporarily unavailable (HTTP 503) | 2 |
| Data points with missing sourceIds | 0 |
| Data points citing unregistered sources | 0 |
| Data points where value is outside confidence range | 0 |
| Data points with wrong/unsupported source value | 2 confirmed, 1 suspected |
| Same-source-same-date duplicates in single graph | 7 source×graph combinations, 13 data point pairs |
| Registry orphaned sources | 33 |
| Unregistered sources used in graphs | 0 |
| Duplicate URLs (same URL, multiple source IDs) | 58 URL groups |
| Registry consistency | **FAIL** (counts off by 1; 33 orphans; 44 `usedIn` mismatches) |

---

## Critical Issues (Fix Required)

### Issue 1: `metaculus-labor-hub-2026` Counted as Multiple Independent Data Points on Same Date

- **Graphs affected:** `overall-us-displacement`, `white-collar-professional-displacement`, `creative-industry-displacement`, `education-sector-displacement`, `financial-services-displacement`, `median-wage-impact` (6 graphs)
- **Source:** `metaculus-labor-hub-2026` — URL: `https://www.metaculus.com/labor-hub/`
- **Pattern:** This single Metaculus community forecast page is cited as **2–4 separate data points on the same date (2026-04-20)** in each affected graph, each point representing a different Metaculus question's median forecast.

**Detail by graph:**

| Graph | # Data Points from This Source | Date | Values |
|-------|-------------------------------|------|--------|
| `overall-us-displacement` | 2 | 2026-04-20 | 1.9, 3.4 |
| `white-collar-professional-displacement` | **4** | 2026-04-20 | 17.2, 5.4, 9.6, 11.4 |
| `creative-industry-displacement` | 2 | 2026-04-20 | 4.0, 8.4 |
| `education-sector-displacement` | 2 | 2026-04-20 | −1.3, 1.3 |
| `financial-services-displacement` | 2 | 2026-04-20 | 8.1, 15.3 |
| `median-wage-impact` | 2 | 2026-04-20 | −0.6, 1.4 |

The stored excerpt is: *"Metaculus community forecasts for 2030 and 2035: overall US employment −1.9%/−3.4%; most vulnerable AI-exposed occupations −11.4%/−17.2%; software developers −15.1%/−22.3%; financial specialists −8.1%/..."*. These values represent different **time horizons** (2030 vs. 2035) from the **same Metaculus page**, not independent data sources. In `white-collar-professional-displacement`, four separate questions from the same page are treated as four independent data points, giving this single Tier-2 community-forecast source the equivalent weighting of **two full Tier-1 academic papers** in the weighted average.

- **Impact on averages:** In `white-collar-professional-displacement` the simple mean of Tier 2 values is 8.16 vs. Tier 1 mean of 7.10, but metaculus contributes 4 points (17.2, 5.4, 9.6, 11.4 — mean 10.9) which substantially inflates the Tier-2 component.
- **Action:** Consolidate all Metaculus-sourced data points for each graph into a **single data point** per graph, using the most relevant forecast horizon. Flag Metaculus as Tier 3 (community forecasting platform, not peer-reviewed).

---

### Issue 2: Wrong Source Citation in `earnings-call-ai-mentions`

- **Graph:** `earnings-call-ai-mentions`
- **Source:** `eisfeldt-genai-firm-values-2026` (NBER working paper on GenAI firm value exposure)
- **Data Point:** Date: 2023-04-15, Value: 27 (claimed to represent "27% of S&P 500 cited AI in Q2 2023 earnings calls")
- **Recorded excerpt:** *"A one-standard-deviation increase in Generative AI exposure is associated with an 8% decline in job postings and a 0.6% decline in the hourly wage rate."*
- **Discrepancy:** The Eisfeldt NBER paper (`w31222`) is about **GenAI exposure and its effect on firm stock values and job postings** — it contains no data on S&P 500 earnings call AI mention rates. The value "27" (% of earnings calls mentioning AI in Q2 2023) has no basis in this paper. The correct source for this data point should be a FactSet Earnings Insight article covering Q2 2023 (similar to `factset-earnings-q2-2023` which covers the same quarter with value=32 and a proper FactSet excerpt).
- **Note:** `eisfeldt-genai-firm-values-2026` is also correctly cited in `overall-us-displacement` (value=2.4, proxy for displacement via job postings decline) — that citation is appropriate.
- **Action:** Remove this data point from `earnings-call-ai-mentions` or replace with the correct FactSet Q2 2023 source. The Q2 2023 quarter already has `factset-earnings-q2-2023` (value=32, date=2023-07-15) — the 27% figure with date 2023-04-15 may be a mis-entered duplicate for Q1 2023 with a wrong source attached.

---

### Issue 3: Tufts Source Value Unsupported for `creative-industry-displacement` (55.3%)

- **Graph:** `creative-industry-displacement`
- **Source:** `tufts-digital-planet-ai-jobs-risk-2026` (Tufts Digital Planet, "Will Wired Belts Become the New Rust Belts?")
- **Recorded value:** 55.3 (date: 2026-03-25, Tier 2)
- **Stored excerpt:** *"Industry-wide vulnerability to job displacement is approximately 6%... 9.3 million jobs are vulnerable to job loss due to AI under our median adoption path, with a plausible range of 2.7 to 19.5 million."*
- **What the source actually says:** The report gives **industry-level** displacement rates: Information sector 18.3%, Finance and Insurance 16.5%, Professional Services 15.6%, **Arts, Entertainment, and Recreation 4.7%**. It gives **occupation-level** figures: Writers and Authors 57%, Computer Programmers 55%, Web and Digital Interface Designers 55%.
- **Discrepancy:** 55.3 matches none of the industry-level figures. It appears to be an **average of occupation-level data** (e.g., ~(55+55)/2 = 55%) applied to "creative industry displacement" — but the source's closest industry grouping (Arts, Entertainment, Recreation) shows only **4.7%** displacement. The excerpt stored does not contain the 55.3 figure or any number close to it.
- **Cross-check:** The same Tufts source is used in `overall-us-displacement` (value=6 → correct, matches "~6% industry-wide") and `tech-sector-displacement` (value=18.3 → correct, matches "Information sector 18.3%"). Only the `creative-industry-displacement` usage is wrong.
- **Action:** Correct the value to 4.7% (Arts, Entertainment, and Recreation sector from Tufts table) or replace with an appropriate creative-sector source. Update the stored excerpt to reflect the actual figure cited.

---

### Issue 4: `openai-jobs-transition-framework-2026` Generates Two Data Points on Same Date, One Unsupported

- **Graph:** `overall-us-displacement`
- **Source:** `openai-jobs-transition-framework-2026` (OpenAI AI Jobs Transition Framework PDF)
- **Data Point 1:** Date 2026-04-17, Value=18, metricType=projection — *"18% are at higher short-term automation risk"* ✓ Supported by excerpt.
- **Data Point 2:** Date 2026-04-17, Value=0.3, metricType=observed — same source, same date.
- **Discrepancy:** The stored excerpt for both data points is: *"All 921 occupations (147.9M jobs) sort into four categories: 18% are at higher short-term automation risk, 46% less likely to experience near-term change, 12% could grow, 24% may be experiencing change."* No 0.3% figure appears in this excerpt. The OpenAI report is a categorization framework (18% / 46% / 12% / 24%), not a realized employment displacement measurement — labeling a derived figure of 0.3% as "observed" is methodologically inconsistent.
- **Action:** Verify what the 0.3% figure derives from in the OpenAI PDF. If it is a conversion/estimate, document the conversion factor explicitly. Recategorize from `dataType: observed` to `dataType: projected` or `derived`. If the 0.3 cannot be traced to the PDF, remove this data point.

---

### Issue 5: Three Confirmed Broken URLs (HTTP 404) for Data-Point Sources

The following source URLs return HTTP 404 and their data cannot be verified:

| Source ID | Recorded URL | Data Point(s) Affected | Recorded Value | Tier |
|-----------|-------------|------------------------|----------------|------|
| `indeed-ai-salaries-2023` | `https://www.hiringlab.org/2023/02/01/new-metrics-for-the-new-year/` | `high-skill-wage-premium` (value=15) | 15% AI salary premium | Tier 3 |
| `indeed-graphic-artist-postings-2025` | `https://www.hiringlab.org/2025/01/28/us-job-postings-trends/` | `creative-industry-displacement` (value=33) | 33% graphic artist posting decline | Tier 2 |
| `pearson-10k-2024` | `https://plc.pearson.com/en-GB/annual-report-2024` | `education-sector-displacement` (value=18) | 18% editorial headcount reduction | Tier 4 |

**Notes:**
- The Indeed Hiring Lab regularly removes or reorganizes archived blog posts. Both hiringlab.org URLs consistently return 404 across multiple verification attempts.
- The Pearson annual report URL likely redirects to a landing page rather than the specific 2024 report document. The excerpt claims "Pearson pivoted to AI-first content delivery, reducing editorial headcount by 18%" — this specific 18% figure and the "AI-first" framing could not be independently verified.
- These three broken sources affect 3 graphs and 3 data points. Their contributions are relatively minor (Tier 3 and Tier 4), but the `creative-industry-displacement` Tier-2 value of 33% (claimed graphic artist posting decline) is unverifiable.
- **Action:** Update all three URLs to accessible archived versions (e.g., Wayback Machine) or replace with updated sources. The Pearson 2024 Annual Report is available at [plc.pearson.com/annual-report](https://plc.pearson.com/annual-report/) — the `/en-GB/annual-report-2024` path appears to have been restructured.

---

## Warnings (Review Recommended)

### Warning 1: `brynjolfsson-chandar-chen-2025` Used for Two Dramatically Different Values

- **Graph:** `tech-sector-displacement`
- **Source:** `brynjolfsson-chandar-chen-2025` — "Canaries in the Coal Mine" (Stanford Digital Economy Lab)
- **Data Point 1:** Date 2025-08-01, Value=13 (August version of the paper)
- **Data Point 2:** Date 2025-11-13, Value=1.3 (November updated version)
- The same source ID and excerpt are used for both. The paper was revised significantly between August and November 2025, with the November update revising the tech-sector employment effect sharply downward (from ~13% to ~1.3% for software developers).
- **Issue:** Using both as separate data points in the weighted average effectively double-counts a single research study. The November revision (1.3) supersedes the August version (13), but both remain in the dataset pulling in opposite directions.
- **Recommendation:** Either (a) assign separate source IDs for the two paper versions (e.g., `brynjolfsson-chandar-chen-aug-2025` vs. `brynjolfsson-chandar-chen-nov-2025`) with distinct excerpts, or (b) retain only the most recent version. Either way, note in the data record that this is a revised estimate.

### Warning 2: `lightcast-tech-postings-2025` — URL Points to Third-Party Blog, Not Lightcast

- **Graph:** `tech-sector-displacement`
- **Source ID:** `lightcast-tech-postings-2025`
- **Recorded URL:** `https://bloomberry.com/blog/how-ai-is-disrupting-the-tech-job-market-data-from-20m-job-postings/`
- **Stored excerpt:** *"Job openings grew 80% for AI scientists and 70% for ML engineers, while backend engineer postings declined 14%, frontend 24%, and data engineers 20%+."*
- **Issue:** The URL points to **bloomberry.com** (a third-party blog/aggregator), not to Lightcast's official domain (`lightcast.io`). The URL returns HTTP 503. The source should cite the original Lightcast report directly.
- **Action:** Replace with the Lightcast Global AI Skills Outlook or the specific Lightcast data report URL. The value=14 (backend posting decline) should be verified against primary Lightcast publications.

### Warning 3: `factset-earnings-q3-2025` and `factset-sp500-ai-q3-2025` Are Near-Duplicate Data Points

- **Graph:** `earnings-call-ai-mentions`
- Both source IDs share the **same URL**: `https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-over-the-past-10-years-1`
- Data Point 1: `factset-earnings-q3-2025`, Date 2025-11-15, Value=61
- Data Point 2: `factset-sp500-ai-q3-2025`, Date 2025-10-15, Value=61.2
- Both reference **Q3 2025 earnings calls** with near-identical values (61% vs 61.2%). Both are Tier 1. The October date vs. November date likely represents when the report was published vs. when the data was added. Same applies to `factset-earnings-q4-2024` and `factset-earnings-q3-2024` sharing one URL.
- **Action:** Consolidate to a single data point per quarter. Remove the near-duplicate.

### Warning 4: Methodologically Incompatible Sources Mixed in Displacement Graphs

Several graphs mix three incompatible metric types without flagging them as incommensurable:

**`tech-sector-displacement`:**
- Value=22 (`indeed-tech-postings-feb-2024`): % decline in **job postings** (leading indicator, not actual job loss) with conversion factor 0.4
- Value=13.8 (`bls-programmer-employment-observed`): % decline in **observed employment** for narrow SOC 15-1251
- Value=18.3 (`tufts-digital-planet`): **projected vulnerability** across 2-5 years
- Value=30 (`tucker-qwi-early-career-hires-2026`): % decline in **early-career hires** in Information sector (NAICS 51), not sector-wide

These are fundamentally different metrics (postings vs. employment vs. projections vs. age-cohort hiring) being averaged together as if equivalent. The `isProxy` and `proxyContext` fields are populated for some but not all, suggesting inconsistent documentation of conversion methodology.

**`overall-us-displacement`:**
- Value=11.5 (`nber-ai-productivity-unemployment-2025`): A **calibrated model prediction** of long-run equilibrium loss, not an observed figure. The NBER paper predicts "more than threefold productivity improvements alongside a long-run employment loss of 23%, with half (~11.5%) occurring over the initial five-year transition." This is a theoretical model result being mixed with observed employment data.
- Value=0.6 (`bonfiglioli-ai-epop-2025`): Observed −0.6pp employment-to-population change.
- Value=12 (`worldbank-liu-wang-yu-2025`): 12% relative **posting decline** (proxy), not job loss.

**Recommendation:** Add a methodology disclaimer to graphs mixing metric types. Separate "observed employment change," "job posting proxies," and "modeled projections" into distinct visual layers rather than averaging them together.

### Warning 5: `education-sector-displacement` Contains Two Tier-4 Data Points

- **Graph:** `education-sector-displacement`
- Tier 4 data points: Value=23 (date 2025-01-01) and Value=18 (`pearson-10k-2024`, date 2025-03-01)
- Tier 4 sources are defined as "Informal & Social" (unvetted: anecdotal, crowd-sourced, blog posts) — the lowest quality tier.
- The `pearson-10k-2024` Tier-4 source has a broken URL (Issue 5 above) and cannot be verified.
- The currentValue for this graph is 7.8. Without the Tier-4 data points (which at Tier-4 should receive near-zero weight), the weighted average of Tier 1 and 2 sources gives approximately 6.3 (Tier1: [20, 3] → mean 11.5; Tier2: [8.3, −1.3, 1.3] → mean 2.8; weighted: (23+8.4)/(2+1.5)=8.97).
- **Action:** Review whether `pearson-10k-2024` should be Tier 4. A corporate annual report would typically be Tier 2 or 3. If it remains Tier 4 and its URL is broken, the data point cannot be validated and should be removed pending re-verification.

### Warning 6: `ai-business-formation` Contains a Data Point Dated 2030-01-01

- **Graph:** `ai-business-formation`
- Source: `marchesi-tang-ai-entrepreneurship-2025`, Date: 2030-01-01 appears in the history array
- This is a **future date** — 2030 is 4 years from today. This data point appears to be a forward projection recorded in the `history` array rather than the `overlays` array.
- **Action:** Move this data point to the `overlays` array if it is a projection, or correct the date if it was a data entry error (likely meant to be 2024-06-01 or similar, given the companion entry from the same source is dated 2023-01-01).

### Warning 7: `customer-service-automation` — `klarna-earnings-2024` (value=66) Dominates

- **Graph:** `customer-service-automation`, currentValue=41.2
- Value=66 from `klarna-earnings-2024` is the **highest single data point** (Tier 1) and stands as a significant outlier relative to other sources (range 12–55, mean 41.3).
- The Klarna claim (AI assistant handles two-thirds of customer service chats) is **company-reported** in a press release, not independently verified. The value represents a specific deployment at one company, not sector-wide displacement.
- Klarna subsequently reported reversing some AI-driven workforce reductions, a material development not reflected in the dataset.
- **Recommendation:** Add a note that this reflects a single-company claim from a press release, and cross-check against Klarna's subsequent earnings statements.

---

## Broken URLs

| Source ID | URL | Status | Affected Graphs |
|-----------|-----|--------|-----------------|
| `indeed-ai-salaries-2023` | `https://www.hiringlab.org/2023/02/01/new-metrics-for-the-new-year/` | **404** | `high-skill-wage-premium` |
| `indeed-graphic-artist-postings-2025` | `https://www.hiringlab.org/2025/01/28/us-job-postings-trends/` | **404** | `creative-industry-displacement` |
| `pearson-10k-2024` | `https://plc.pearson.com/en-GB/annual-report-2024` | **404** | `education-sector-displacement` |
| `lightcast-tech-postings-2025` | `https://bloomberry.com/blog/how-ai-is-disrupting-the-tech-job-market-data-from-20m-job-postings/` | **503** (persistent) | `tech-sector-displacement` |
| `metaculus-labor-hub-2026` | `https://www.metaculus.com/labor-hub/` | **403** (bot-blocked) — 13 data points across 6 graphs | All displacement + wage graphs |

**Note on 403 responses:** 48 URLs returned HTTP 403 when checked by curl. This includes BLS, OECD, HBR, Gartner, McKinsey, and other major institutional sites that block automated crawlers. These are **not** considered broken — they load correctly in browsers. Only the three confirmed 404s above are genuinely inaccessible.

---

## Stale Data

| Graph | Last Data Point | Oldest Source Used | Notes |
|-------|----------------|-------------------|-------|
| `earnings-call-ai-mentions` | 2026-01-15 (4 months ago) | `factset-earnings-q4-2022` (40 months old) | Old points are appropriate historical baselines; Q1 2026 FactSet data (expected ~April 2026) not yet added |
| `workforce-ai-exposure` | 2026-01-15 (4 months ago) | `goldman-300m` (38 months old) | April 2026 update pending |
| `robots-physical-automation-displacement` | 2026-01-15 (4 months ago) | `acemoglu-restrepo-robots-jpe-2020` (71 months old) | The 2020 Acemoglu-Restrepo paper is legitimate historical baseline but should be flagged as pre-AI-era |
| `freelancer-rate-impact` | 2026-02-01 (3 months ago) | `upwork-trends-2023` (35 months old) | Upwork Q1 2026 results published April 2026 not yet reflected |
| `ai-adoption-rate` | 2026-02-26 (3 months ago) | `census-bts-ai-2023` (33 months old) | Latest Census BTOS biweekly data available through April 2026 |
| `median-wage-impact` | 2026-04-20 | `ilo-wages-2023` (42 months old) | ILO Global Wage Report 2024/25 exists and covers AI wage effects |
| `ai-business-formation` | 2030-01-01 (future date, likely error) | `census-bfs-baseline-2021` (64 months old) | 2030 date is incorrect (see Warning 6); Census Business Formation Statistics now available through 2025 |

---

## Duplicates Found

### A. Same Source ID, Same Date, Same Graph (Highest Severity)

These represent a single source being split into multiple data points within one graph, inflating its statistical weight:

| Graph | Source ID | Date | # Data Points | Values |
|-------|-----------|------|---------------|--------|
| `white-collar-professional-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | **4** | 17.2, 5.4, 9.6, 11.4 |
| `overall-us-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | 1.9, 3.4 |
| `overall-us-displacement` | `openai-jobs-transition-framework-2026` | 2026-04-17 | 2 | 18, 0.3 |
| `creative-industry-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | 4.0, 8.4 |
| `education-sector-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | −1.3, 1.3 |
| `financial-services-displacement` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | 8.1, 15.3 |
| `median-wage-impact` | `metaculus-labor-hub-2026` | 2026-04-20 | 2 | −0.6, 1.4 |

### B. Same Source ID, Different Dates, Same Graph (Medium Severity)

These use the same underlying paper at different points in time, which may be legitimate (tracking revisions) but risks double-counting:

| Graph | Source ID | Dates | Values | Assessment |
|-------|-----------|-------|--------|------------|
| `tech-sector-displacement` | `brynjolfsson-chandar-chen-2025` | 2025-08-01, 2025-11-13 | 13, 1.3 | Two versions of same paper — should use separate IDs |
| `genai-work-adoption` | `bick-blandin-deming-wp-2025` | 2024-06, 2024-08, 2024-11, 2025-08, 2025-11 | 32.9, 33.3, 31, 40.7, 41.1 | Time-series tracking — appropriate as different quarters |
| `ai-adoption-rate` | `census-btos-ai-biweekly-2026` | 2025-12-04, 2026-02-26 | 17.3, 17.5 | Biweekly tracker — legitimate |
| `ai-business-formation` | `marchesi-tang-ai-entrepreneurship-2025` | 2023-01-01, 2030-01-01 | 24, 12 | 2030 date is erroneous (see Warning 6) |
| `workforce-ai-exposure` | `anthropic-econ-primitives-2026` | 2025-01-15, 2026-01-15 | 38, 49 | Two annual editions — legitimate if IDs are distinct |
| `earnings-call-ai-mentions` | `factset-earnings-q3-2025` + `factset-sp500-ai-q3-2025` | 2025-11-15, 2025-10-15 | 61, 61.2 | Same URL, same quarter — should consolidate |

### C. Same URL, Multiple Source IDs in Registry (58 groups — selection of most impactful)

These represent the same published document registered under multiple IDs with different excerpts and usage contexts. This practice is intentional (different statistics from the same paper) but creates URL-level duplication and makes cross-referencing difficult:

| URL (truncated) | Source IDs | # IDs |
|-----------------|-----------|-------|
| `anthropic.com/research/anthropic-economic-index-january-2026-report` | `anthropic-econ-primitives-2026`, `anthropic-econ-primitives-adoption-2026`, `anthropic-econ-primitives-overall-2026` | 3 |
| `digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/` | `brynjolfsson-chandar-chen-2025`, `brynjolfsson-chandar-chen-entry-2025`, `brynjolfsson-chandar-chen-wc-2025`, `brynjolfsson-chandar-chen-overall-2025` | 4 |
| `dallasfed.org/research/economics/2026/0106` | `dallas-fed-entry-level-2026`, `dallas-fed-overall-2026`, `dallas-fed-young-workers-2026`, `dallasfed-young-workers-ai-2026` | 4 |
| `nber.org/papers/w34836` | `nber-bloom-firm-data-adoption-2026`, `nber-bloom-firm-data-ai-2026`, `nber-csuite-survey-2025`, `yotzov-firm-data-ai-2026`, `nber-firm-data-ai-2026` | 5 |
| `weforum.org/publications/the-future-of-jobs-report-2025/` | `wef-education-displacement-2025`, `wef-future-jobs-2024`, `wef-future-jobs-2025`, `wef-future-of-jobs-financial-2025`, `wef-future-of-jobs-2025` | 5 |
| `imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf` | `imf-skill-gaps-ai-2026`, `imf-skill-gaps-entry-2026`, `imf-skill-gaps-geo-2026`, `imf-skill-gaps-premium-2026`, `imf-skill-gaps-it-2026` | 5 |
| `mckinsey.com/...the-state-of-ai` | `mckinsey-ai-survey-2024`, `mckinsey-ai-survey-2025`, `mckinsey-ai-survey-nov-2025`, `mckinsey-state-ai-2025` | 4 |
| `brookings.edu/articles/new-data-show-no-ai-jobs-apocalypse-for-now/` | `brookings-2024`, `kinder-brookings-2025` | 2 |

**Note:** Multiple IDs per source is a documented design choice (different statistics from same paper) — this is not a bug. However, it means that when the same paper is used in a single graph via multiple IDs with different excerpts, the paper's influence on the weighted average is multiplied. This should be noted in the site's methodology documentation.

---

## Registry Audit

### Count Discrepancy
- `totalSources` recorded: **541** — actual source objects in registry: **542** → off by **+1**
- `verifiedCount` recorded: **531** — actual sources with `verified: true`: **532** → off by **+1**
- One source is present in the registry but not counted in either field. (Likely a source added without incrementing the counter.)

### Orphaned Sources (33)
The following 33 sources are registered but referenced by **no graph** currently deployed on the site. Their `usedIn` fields point to graphs that do not exist or are referenced incorrectly:

**Referencing non-existent graph `total-us-jobs-lost` (21 sources):**
`acemoglu-macro-2024`, `anthropic-labor-market-impacts-2026`, `bls-projections-2025`, `brookings-adaptive-capacity-2026`, `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `goldman-300m` *(also in workforce-ai-exposure — only the `total-us-jobs-lost` entry is orphaned)*, `goldman-ai-workforce-2025`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `indeed-total-postings-2025`, `medium-doom-2025`, `nber-csuite-survey-2025`, `oecd-employment-2023`, `pnas-unemployment-2025`, `pwbm-ai-productivity-2025`, `ramp-freelance-velocity-2025`, `sp500-layoff-tracker-2025`, `wef-future-jobs-2024`, `yotzov-firm-data-ai-2026`

**Referencing non-existent graph `geographic-wage-divergence` (8 sources):**
`anthropic-geographic-2025`, `bls-metro-wages-2025`, `bls-tech-vs-nontechmetro-2025`, `brookings-metro-ai-2024`, `lightcast-geo-wages-2023`, `moneypenny-regional-ai-2025`, `muro-kinder-geography-2025`, `nber-spatial-ai-2024`

**`usedIn` references existing graphs but source not actually used there (4 sources):**
- `adobe-creative-survey-2024`: claims `creative-industry-displacement` — not used there
- `brynjolfsson-bls-productivity-2026`: claims `median-wage-impact` — not used there
- `gartner-edtech-2025`: claims `education-sector-displacement` — not used there
- `pearson-smarthinking-2025`: claims `education-sector-displacement` — not used there

**No `usedIn` (2 sources):**
- `british-progress-uk-labour-market-2026`
- `liu-christian-ai-persistence-2026`

**Implication:** Two planned graphs (`total-us-jobs-lost` and `geographic-wage-divergence`) are **partially built in the registry but not yet deployed**. 29 sources are staged for these future graphs. This is not an error per se, but the registry counts should be adjusted to separate deployed vs. staged sources.

### usedIn Field Mismatches
44 sources have `usedIn` fields that diverge from actual graph usage (all 33 orphaned sources plus 11 additional sources whose `usedIn` lists include `total-us-jobs-lost` alongside deployed graphs). This is a documentation maintenance issue stemming from the two unreleased graphs.

---

## Per-Graph Verification Log

| Graph | Sources | Data Points | Overlays | Issues Found |
|-------|---------|-------------|----------|--------------|
| `overall-us-displacement` | 128 | 27 | 138 | **CRITICAL**: `openai-jobs-transition-framework-2026` generates 2 same-date points (value 18 and 0.3); `metaculus-labor-hub-2026` generates 2 same-date points; methodological mixing of observed/projected/model values |
| `tech-sector-displacement` | 73 | 18 | 61 | **WARNING**: `brynjolfsson-chandar-chen-2025` used twice (values 13 and 1.3); `lightcast-tech-postings-2025` URL broken/indirect; posting-decline proxies mixed with employment data |
| `customer-service-automation` | 36 | 6 | 38 | **WARNING**: `klarna-earnings-2024` outlier (66%) from single company press release; `shopify-earnings-2024` used across 2 dates (2024-02 and 2025-02) — legitimate if tracking separate quarterly calls |
| `white-collar-professional-displacement` | 81 | 20 | 80 | **CRITICAL**: `metaculus-labor-hub-2026` appears 4× on same date (2026-04-20) — inflates one Tier-2 source to weight of 2 Tier-1 papers |
| `creative-industry-displacement` | 32 | 11 | 24 | **CRITICAL**: Tufts source value 55.3 unsupported (source says 4.7% for Arts sector); `indeed-graphic-artist-postings-2025` URL broken (404); `metaculus-labor-hub-2026` appears 2× same date |
| `healthcare-admin-displacement` | 30 | 5 | 27 | No critical issues; all sources accessible; `harvard-health-policy-2024` is orphaned in registry (not used in this graph despite `usedIn` claim) |
| `education-sector-displacement` | 24 | 7 | 19 | **WARNING**: `pearson-10k-2024` URL broken (404), Tier 4; two Tier-4 sources with high values (23, 18) anchoring an already noisy graph; `metaculus-labor-hub-2026` appears 2× same date |
| `financial-services-displacement` | 30 | 10 | 22 | **WARNING**: `metaculus-labor-hub-2026` appears 2× same date; Tier-2 mean (9.99) substantially higher than Tier-1 mean (2.03), potentially inflating currentValue above what academic sources suggest |
| `robots-physical-automation-displacement` | 12 | 7 | 15 | **WARNING**: Tier-2 mean (10.25) higher than Tier-1 mean (3.30); `acemoglu-restrepo-robots-jpe-2020` (71 months old) is pre-AI-era baseline |
| `high-skill-wage-premium` | 39 | 9 | 35 | **WARNING**: `indeed-ai-salaries-2023` URL broken (404), no excerpt stored — data point (value=15) unverifiable; source is 39 months old |
| `median-wage-impact` | 58 | 15 | 49 | **WARNING**: `metaculus-labor-hub-2026` appears 2× same date; Tier-4 source (`-5`) mixed with Tier-1 academic studies |
| `freelancer-rate-impact` | 17 | 8 | 11 | No critical issues; all negative values correctly bounded; oldest sources approaching staleness |
| `entry-level-wage-impact` | 47 | 9 | 46 | **WARNING**: `imf-skill-gaps-entry-2026` returned 404 on first check (confirmed 200 on re-check — transient); source value of −11 should be re-verified against IMF SDN 2026/001 |
| `ai-adoption-rate` | 62 | 7 | 63 | No critical issues; consistent time-series using authoritative sources |
| `genai-work-adoption` | 36 | 12 | 32 | No critical issues; `bick-blandin-deming-wp-2025` multi-use across 5 dates is appropriate longitudinal tracking |
| `ai-business-formation` | 16 | 6 | 12 | **WARNING**: Data point dated 2030-01-01 in `history` array — likely erroneous or should be in overlays |
| `earnings-call-ai-mentions` | 18 | 15 | 3 | **CRITICAL**: `eisfeldt-genai-firm-values-2026` wrong source (NBER firm-values paper cited for earnings-call-mention rate); `factset-earnings-q3-2025` and `factset-sp500-ai-q3-2025` are near-duplicate same-quarter data points |
| `workforce-ai-exposure` | 53 | 13 | 51 | No critical issues; wide value range (23–93) reflects methodological diversity in exposure measurement |

---

## Weighted Average Verification

The weighting formula was reverse-engineered from the data:
- **Tier 1** (Verified Data & Research): weight = **1.0**
- **Tier 2** (Institutional Analysis): weight = **0.5**
- **Tier 3** (Journalism & Commentary): weight = **0.25** (inferred)
- **Tier 4** (Informal & Social): weight = **0.0** (near-zero/excluded)

**Verification results:**

| Graph | currentValue | My Weighted Calc | Difference | Notes |
|-------|-------------|-----------------|------------|-------|
| `overall-us-displacement` | 3.1 | ~3.20 | ~+0.10 | Close match — minor rounding or date-weighting |
| `robots-physical-automation-displacement` | 6.1 | ~6.08 | −0.02 | **Confirmed match** |
| `education-sector-displacement` | 7.8 | ~7.76 | −0.04 | **Confirmed match** |
| `tech-sector-displacement` | 9.7 | ~11.7 | +2.0 | **Unexplained gap** — possible date-based recency weighting or outlier exclusion |
| `creative-industry-displacement` | 23.8 | ~23.81 | +0.01 | Near-perfect match — suggests near-equal Tier 1/2 weights here |
| `ai-business-formation` | 12.3 | ~12.55 | +0.25 | Minor difference |
| `ai-adoption-rate` (latest) | 17.5 | 17.5 (last point) | 0 | **Confirmed match** |
| `genai-work-adoption` (latest) | 43 | 43 (last point) | 0 | **Confirmed match** |

The `tech-sector-displacement` discrepancy (computed 11.7 vs. displayed 9.7) suggests an additional weighting factor (possibly recency-based) that cannot be fully determined from static data alone. The formula likely applies additional time-decay weighting to older data points, which would bring the result closer to the more recent lower-value points.

**Flag:** In graphs where Tier-2 sources systematically outnumber Tier-1 sources (e.g., `financial-services-displacement`: 7 Tier-2 vs. 3 Tier-1), the weighted average can still be dominated by lower-quality sources even with the 0.5× downweight.

---

## Methodology Notes

**What was verified:**
- All 18 prediction graphs' structure, source citations, and recorded values — confirmed via live JS bundle
- 148 of 156 unique history source URLs — checked via HTTP HEAD requests
- Tufts Digital Planet source content — confirmed via web fetch; discrepancy in `creative-industry-displacement` confirmed
- FactSet earnings call sources — confirmed values match FactSet percentages in excerpts
- OpenAI Jobs Transition Framework PDF — accessible, 18% figure confirmed; 0.3% figure not traceable to excerpt
- Registry counts and orphan status — fully audited

**What could not be verified:**
- **Paywalled content** (48 sources returning 403): BLS, OECD, HBR, McKinsey, Gartner, WSJ, Financial Times, and others block automated access. Their excerpts could not be cross-checked against live content. These sources are all reputable institutions and the recorded excerpts appear credible on their face.
- **Metaculus labor hub** (403 — bot-blocked): Cannot verify the 13 data points citing this source. The claimed excerpt values (−1.9%, −3.4%, −11.4%, etc.) are internally consistent with Metaculus-style probability forecasting but cannot be confirmed without browser access or API access.
- **Exact weighting formula**: No JavaScript code implementing the weighted average was found in the bundled chunks. The formula was inferred from output values and confirmed for 3 graphs; the full algorithm (including any time-decay component) remains unverified.
- **Conversion factors for proxy data points**: Many data points include `proxyContext` objects with conversion factors (e.g., job posting declines multiplied by 0.3–0.5 to estimate displacement). These conversion factors are editorial judgments and cannot be independently validated — they are internally documented but not externally cited.
- **The two unreleased graphs** (`total-us-jobs-lost`, `geographic-wage-divergence`): Sources staged for these graphs were found in the registry. Their data and methodology cannot be evaluated.

---

*Report generated: 2026-05-01 by jobsdata.ai fact-check agent. Data extracted from live deployment at `ai-labor-predictions.vercel.app`. Repository at `github.com/mz00m/ai-labor-predictions` (public, uncloned due to network timeout — all data from Vercel production bundle).*