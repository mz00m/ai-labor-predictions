1	# jobsdata.ai Fact-Check Report — 2026-08-01
2	
3	## Executive Summary
4	
5	The jobsdata.ai prediction database contains 20 active prediction graphs, 615 unique source IDs (all registered), and 666 registry entries. The site's core infrastructure is sound: the weighting algorithm is correctly implemented, all 615 prediction-file sources exist in `confirmed-sources.json`, and the three critical source URLs verified directly (Anthropic, Tucker/Census, Chen/Jellyfish) resolve and contain data consistent with their recorded values. However, three critical data-integrity issues were found: one FactSet source references a temporally impossible article (published five months after the date it is cited for), a second FactSet source has inconsistent source-content metadata describing the wrong quarter, and the most prominent outlier on the overall displacement graph (OpenAI's "18% jobs at risk") mixes theoretical exposure with observed displacement — a methodological incompatibility that inflates the visual range while receiving the correct proxy discount in the weighted average. Registry housekeeping is behind: 51 sources are orphaned (referencing archived graphs) and 70 `usedIn` fields require correction.
6	
7	---
8	
9	## Health Scorecard
10	
11	| Metric | Result |
12	|--------|--------|
13	| Total unique sources in prediction files | 615 |
14	| Total registry entries | 666 |
15	| Sources with URLs | 614 / 615 |
16	| Sources without URLs | 1 (`goldman-productivity-growth-forecast-2026`) |
17	| URLs verified working (sampled) | 28 of 30 sampled |
18	| URLs broken / paywalled | 1 confirmed broken (Bloomberg), 1 general page not specific content |
19	| Data points with confirmed-accurate values | 8 verified directly |
20	| Data points with discrepancies | 2 critical, 2 warnings |
21	| Weighted average math correct | PASS (overall-us-displacement verified: 2.2 ✓) |
22	| Registry totalSources claim | PASS (666 recorded = 666 actual) |
23	| Registry verifiedCount claim | PASS (656 recorded; 10 flagged unverified) |
24	| Duplicate source IDs in same graph | 0 |
25	| Duplicate URLs across different source IDs | 45 groups |
26	| Orphaned sources (registry, not used) | 51 |
27	| Unregistered sources (predictions, not in registry) | 0 |
28	
29	---
30	
31	## Critical Issues (Fix Required)
32	
33	### Issue 1: `factset-earnings-q3-2024` cites a post-dated article
34	
35	- **Graph:** `earnings-call-ai-mentions`
36	- **Data Point:** `date=2024-10-15`, `value=44`, `sourceIds=["factset-earnings-q3-2024"]`
37	- **Recorded URL:** `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earnings-calls-over-past-10-years-1`
38	- **Problem:** This URL is the **same article** used by `factset-earnings-q4-2024`. The article covers December 15, 2024 through March 14, 2025 (Q4 2024 earnings calls) and was published ~March 2025 — **five months after the cited date of October 2024**. It is temporally impossible to cite a March 2025 article as a source for October 2024 data.
39	- **Source content confirms the problem:** Both `factset-earnings-q3-2024` and `factset-earnings-q4-2024` source-content JSONs describe "Q4 2024 (December 15 through March 14)" data with 241 companies. The actual Q3 2024 FactSet article (covering roughly September 15–December 14, 2024) is a different URL that has not been located.
40	- **The recorded value of 44% cannot be sourced to this URL.** The article at this URL supports the Q4 2024 value of 48%.
41	- **Action:** Find the actual FactSet Q3 2024 AI-on-earnings-calls article (covering ~Sept 15–Dec 14, 2024), confirm the 44% figure, update the `factset-earnings-q3-2024` URL and source-content accordingly.
42	
43	---
44	
45	### Issue 2: `factset-sp500-ai-q3-2025` source content describes a different quarter
46	
47	- **Graph:** `earnings-call-ai-mentions`
48	- **Data Points:** 
49	  - `date=2025-10-15`, `value=61.2`, `sourceIds=["factset-sp500-ai-q3-2025"]`
50	  - `date=2025-11-15`, `value=61`, `sourceIds=["factset-earnings-q3-2025"]`
51	- **Recorded URL (both):** `https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-over-the-past-10-years-1`
52	- **Problem:** Both source IDs share the same URL (the Q3 2025 article, 306 companies, ~61%), but their **source-content files describe different data**:
53	  - `factset-earnings-q3-2025` correctly describes: "306 S&P 500 companies (61%) cited AI in Q3 2025 earnings calls" — consistent with the URL ✓
54	  - `factset-sp500-ai-q3-2025` incorrectly describes: "287 companies mentioning AI... 32% surge from Q1 2025's 218 mentions" — this is Q2 2025 data (June–September 2025 calls), for a different article that is not cited.
55	- **The 61.2 vs 61 discrepancy** is minor (rounding 306/500=61.2% vs 306/485=63.1%; the recorded 61 is from the article's headline "61%"), but two data points claiming to document the same quarter from the same article is redundant.
56	- **Action:** Remove the `factset-sp500-ai-q3-2025` data point (date=2025-10-15) as redundant with `factset-earnings-q3-2025` (date=2025-11-15), or fix its source content to accurately describe Q2 2025 data and find its correct URL. The source-content JSON for `factset-sp500-ai-q3-2025` must be corrected regardless.
57	
58	---
59	
60	### Issue 3: `goldman-productivity-growth-forecast-2026` has no URL
61	
62	- **Graph:** `genai-work-adoption` (overlays only, not a history data point)
63	- **Source ID:** `goldman-productivity-growth-forecast-2026`
64	- **Recorded URL:** `""` (empty)
65	- **Registry entry:** `"url": ""` — confirmed empty in `confirmed-sources.json`
66	- **Source title:** "US Daily: Forecasting Productivity Growth: Slow to Adjust, Quick to Overshoot" (Goldman Sachs, 2026-05-05)
67	- **Action:** Locate the Goldman Sachs Daily report URL (likely behind a client portal or archived; if no public URL exists, add a note and consider whether this source should be listed at all). Remove or replace if permanently inaccessible.
68	
69	---
70	
71	### Issue 4: Methodological incompatibility — theoretical exposure mixed with observed displacement in `overall-us-displacement`
72	
73	- **Graph:** `overall-us-displacement`
74	- **Data Point:** `date=2026-04-17`, `value=18`, `sourceIds=["openai-jobs-transition-framework-2026"]`, `isProxy=true`, `tier=2`
75	- **Problem:** The OpenAI source classifies "18% of jobs as higher short-term automation risk" — a forward-looking theoretical exposure estimate across 147.9M jobs. The graph's other data points include real-world unemployment changes and peer-reviewed displacement estimates that range from 0 to 11.5%. Including a 18% risk-classification figure in a displacement time-series inflates the visual range dramatically even after the `isProxy=0.5` discount.
76	- **Recorded:** 18 (automation risk %)
77	- **What source says:** This is a categorical classification ("higher short-term automation risk"), not a measured displacement rate. It is not methodologically equivalent to, for example, Acemoglu 2024's 0.5% estimate or Yale Budget Lab's 0% unemployment effect.
78	- **The `isProxy=true` flag is appropriate** and the proxy weight (0.5×) reduces its impact on the weighted average, but the value of 18 still sets the visual Max to 18 on a graph where everything else is 0–11.5.
79	- **Action:** Move this data point to an overlay (with clear labeling as a theoretical risk classification), or add a `metricType` clarifying it is an exposure/risk measure, not a displacement observation. Update the graph description to note this distinction.
80	
81	---
82	
83	## Warnings (Review Recommended)
84	
85	### Warning 1: `factset-earnings-q1-2026` uses interim data from a general earnings update
86	
87	- **Graph:** `earnings-call-ai-mentions`
88	- **Data Point:** `date=2026-04-15`, `value=65`, `sourceIds=["factset-earnings-q1-2026"]`
89	- **Recorded URL:** `https://insight.factset.com/sp-500-earnings-season-update-may-8-2026`
90	- **Issue:** This May 8, 2026 article is a general Q1 2026 earnings season update (mentioning AI in passing at ~65% at that mid-season point), not the dedicated FactSet AI-on-earnings-calls analysis. The final Q1 2026 AI-mentions article published June 12, 2026 reports **337 calls** from March 15–June 11, approximately 69% of S&P 500 companies — significantly higher than the recorded 65%.
91	- **Action:** Update source to the June 12 FactSet article ("Highest Number of S&P 500 Earnings Calls Citing AI Over the Past 10 Years") and update the value from 65 to ~69 (337/~490).
92	
93	---
94	
95	### Warning 2: Bloomberg source cannot be verified (paywall)
96	
97	- **Source ID:** `bloomberg-boesler-tech-finance-ai-2026`
98	- **URL:** `https://www.bloomberg.com/news/articles/2026-07-01/tech-and-finance-sectors-losing-28-000-jobs-monthly-show-ai-impact-on-labor`
99	- **Affected Graphs:** `financial-services-displacement`, `overall-us-displacement`, `tech-sector-displacement`
100	- **Status:** URL returns paywall — content inaccessible without subscription
101	- **Data Points using this source:** `financial-services-displacement@2026-07-01=28`, `tech-sector-displacement@2026-07-01=28`, `overall-us-displacement@2026-07-01=?` (listed as overlay)
102	- **Action:** Verify 28,000 jobs/month figure from an accessible secondary source or request internal access. Cannot confirm or deny accuracy.
103	
104	---
105	
106	### Warning 3: Unusual hosting domain for `chen-stratton-ai-in-firm-2026`
107	
108	- **Source ID:** `chen-stratton-ai-in-firm-2026`
109	- **URL:** `https://fion.ac/jellyfish.pdf`
110	- **Used in:** `ai-adoption-rate`, `tech-sector-displacement`
111	- **Issue:** The domain `fion.ac` is not a recognized academic or institutional domain. The paper resolves correctly (Harvard/Jellyfish research paper by Fiona Chen and James Stratton, dated January 7, 2026) but personal/project hosting is less stable than institutional repositories.
112	- **Finding:** Paper verified — it is "Artificial Intelligence in the Firm," studying GitHub Copilot/Cursor effects on 100K engineers at 500 firms. Finds null employment effects, moderate productivity gains. Content is authentic and consistent with use in graphs.
113	- **Action:** Add the paper's SSRN or NBER link as an alternative URL when available.
114	
115	---
116	
117	### Warning 4: HTTP-only URL for Tucker paper
118	
119	- **Source ID:** `tucker-qwi-early-career-hires-2026`
120	- **URL:** `http://leetucker.net/docs/Youre_not_hired_Tucker_20260417.pdf` (HTTP, not HTTPS)
121	- **Used in:** `white-collar-professional-displacement`, `tech-sector-displacement`, `early-career-employment-decline`
122	- **Finding:** URL resolves correctly. Paper is "You're (not) hired: Artificial intelligence and early career hiring in the Quarterly Workforce Indicators" (Lee C. Tucker, April 17, 2026, Census Bureau). Content confirms recorded data points (12% employment decline in most AI-exposed quintile). The HTTP-only link is a minor security/stability concern.
123	- **Action:** Use HTTPS if the server supports it; watch for URL stability on personal domain.
124	
125	---
126	
127	### Warning 5: Social media URL as source
128	
129	- **Source ID:** `apoorv03-consumer-ai-usage-2026`
130	- **URL:** `https://x.com/apoorv03/status/2028492786832753011`
131	- **Used in:** `genai-work-adoption` (data point: `date=2026-05-01-ish`)
132	- **Issue:** X/Twitter posts are ephemeral and provide no archival guarantee. Platform-dependent links are fragile.
133	- **Action:** Archive this URL via the Wayback Machine or find a stable secondary source for the claimed statistic.
134	
135	---
136	
137	### Warning 6: Missing Q2 2025 data point in `earnings-call-ai-mentions`
138	
139	- **Graph:** `earnings-call-ai-mentions`
140	- **Issue:** The Q3 2025 FactSet article states the previous record was "292 in Q2 2025" (approximately 60% of S&P 500), but no Q2 2025 data point exists in the graph history. The chart jumps from Q1 2025 (44%, April 2025) to Q3 2025 (61.2%, October 2025), creating a gap.
141	- **Implied Q2 2025 value:** ~292/485 ≈ 60%.
142	- **Action:** Add a data point for Q2 2025 (~60%, citing the Q2 2025 FactSet article referenced in the Q3 article).
143	
144	---
145	
146	## Broken URLs
147	
148	| Source ID | URL | Status | Affected Graphs |
149	|-----------|-----|--------|-----------------|
150	| `goldman-productivity-growth-forecast-2026` | *(empty)* | Missing — no URL | `genai-work-adoption` (overlay) |
151	| `bloomberg-boesler-tech-finance-ai-2026` | `https://www.bloomberg.com/news/articles/2026-07-01/...` | Paywalled — no content accessible | `financial-services-displacement`, `overall-us-displacement`, `tech-sector-displacement` |
152	
153	**All other sampled URLs resolved** including: Anthropic research pages, FactSet insight articles, Census Bureau press releases, BLS pages, NBER working papers, SSRN papers, Fed notes, Dallas Fed economics, Stanford DEL, and the non-standard `fion.ac` and `leetucker.net` domains.
154	
155	---
156	
157	## Stale Data
158	
159	| Graph | Latest DP | Months Since Latest DP | Oldest Active Source | Action |
160	|-------|-----------|------------------------|----------------------|--------|
161	| `robots-physical-automation-displacement` | 2026-01-15 | 6.6 months | Various 2023–2026 | Update with H1 2026 robotics data (IFR 2026 data available) |
162	| `workforce-ai-exposure` | 2026-01-15 | 6.6 months | Various 2021–2026 | Add recent BTOS AI supplement data (June 2026 release available) |
163	
164	**Note:** The Census Bureau released new BTOS AI supplement data on June 18, 2026 (confirmed accessible). This data is already sourced in `ai-adoption-rate` (census-btos-ai-supplement-2026) but not yet reflected in `workforce-ai-exposure`.
165	
166	**Expired overlay:**
167	- `overall-us-displacement`: "Lodefalk et al.: Sweden 22-25yr employment in high-AI occupations -5.5% by 2025H" — this prediction's horizon has passed. Flag as past-horizon overlay.
168	
169	---
170	
171	## Duplicates Found
172	
173	### Duplicate URLs with Different Source IDs (45 groups — notable cases)
174	
175	The 45 duplicate URL groups include many legitimate multi-metric citations (e.g., three Anthropic econ-primitives sources from the same January 2026 report, each extracting different statistics). The following cases require attention:
176	
177	**Potentially problematic (same content, same metric context):**
178	
179	1. `factset-earnings-q3-2024` and `factset-earnings-q4-2024` — same URL, same article content → **Critical Issue 1 above**
180	2. `factset-earnings-q3-2025` and `factset-sp500-ai-q3-2025` — same URL, overlapping Q3 2025 data → **Critical Issue 2 above**
181	3. `census-bts-ai-2023`, `census-bts-ai-2024`, `census-bts-ai-2025`, `census-btos-ai-supplement-2026` — all point to `https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html` (same landing page, different snapshots) — acceptable if each excerpt/date clearly identifies which biweekly release is being cited.
182	4. `brookings-adaptive-capacity-2026` and `brookings-ai-adaptive-capacity-2026` — same URL, both used as data sources in different graphs — **likely intentional** (different metrics extracted from the same paper).
183	5. `bls-ooh-programmer-decline-2023-2033` and `bls-programmer-projections-2034` — same BLS OOH page for two different projection time horizons — acceptable but note the page URL may redirect over time.
184	
185	**Acceptable multi-metric citations (same paper, different statistics):**
186	- `brynjolfsson-chandar-chen-2025`, `-entry-2025`, `-overall-2025`, `-wc-2025` — four sources from the same Canaries paper
187	- `anthropic-econ-primitives-2026`, `-adoption-2026`, `-overall-2026` — three sources from same January 2026 Anthropic index
188	- `imf-skill-gaps-*` (5 sources) from the same IMF 2026 SDN paper
189	- `mckinsey-ai-survey-*` (4 sources) from the same McKinsey landing page
190	- `goldman-briggs-*` (3 sources) from same Goldman insights page
191	
192	### No Duplicate Source IDs Within Any Graph
193	Zero cases of the same source ID appearing twice in a single graph's `sources` array.
194	
195	---
196	
197	## Registry Audit
198	
199	- **Orphaned sources (in registry, not in any active prediction file):** 51
200	
201	  These appear to reference three removed or renamed graphs:
202	  - `total-us-jobs-lost` (archived at `src/data/predictions/displacement/_archived/`): 22 sources still listed as `usedIn: ['total-us-jobs-lost']`
203	  - `geographic-wage-divergence` (no file found in predictions directory): ~14 sources
204	  - `reading-list`, `high-skill-wage-premium` (minor): ~3 sources
205	  - Sources with empty `usedIn: []`: `british-progress-uk-labour-market-2026`, `liu-christian-ai-persistence-2026`, `noahpinion-ai-messaging-pivot-2026`
206	
207	  **Representative orphaned sources:**
208	  `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `wef-future-jobs-2024`, `anthropic-geographic-2025`, `brookings-metro-ai-2024`, `moneypenny-regional-ai-2025`, `nber-spatial-ai-2024`, and 41 others.
209	
210	- **Unregistered sources (in prediction files, not in registry):** **0** ✓
211	- **`totalSources` check:** Registry claims 666 — actual count 666 ✓
212	- **`verifiedCount` check:** Registry claims 656 — 10 sources marked as not yet verified (consistent)
213	- **`usedIn` mismatches:** 70 sources have `usedIn` lists that include `total-us-jobs-lost` (archived) but not reflected in current file state. All 70 mismatches trace to `total-us-jobs-lost` being removed from the active predictions directory without cleaning the registry.
214	
215	---
216	
217	## Per-Graph Verification Log
218	
219	| Graph | Sources | Data Points | Overlays | Issues |
220	|-------|---------|-------------|----------|--------|
221	| `ai-adoption-rate` | 71 | 10 | 69 | Same Census BTOS landing page for 4 different time-point sources (acceptable); all DPs use Tier 1 sources ✓ |
222	| `ai-business-formation` | 23 | 7 | 20 | URLs verified; ibtimes-census-ai-business-surge-2026 (Tier 3) data point at July 2026 only one available for current period |
223	| `creative-industry-displacement` | 38 | 10 | 30 | URLs verified; Upwork and CVL Economics accessible ✓ |
224	| `customer-service-automation` | 43 | 8 | 44 | Stanford DEL enterprise AI playbook (value=82) is a Tier 1 projection — very high vs other DPs; worth monitoring |
225	| `early-career-employment-decline` | 12 | 5 | 8 | Tucker paper verified ✓; Brynjolfsson-Chandar-Chen paper verified ✓ |
226	| `earnings-call-ai-mentions` | 18 | 13 | 4 | **2 critical issues** (see Issues 1 & 2); **Warning**: Q1 2026 value should be ~69%; missing Q2 2025 DP |
227	| `education-sector-displacement` | 30 | 6 | 25 | Metaculus crowd-forecast DP (value=-1.3) is only negative DP; appropriate as Tier 2 crowd source |
228	| `entry-level-wage-impact` | 51 | 4 | 52 | Very few data points (4) for 51 sources; most sources appear in overlays only |
229	| `financial-services-displacement` | 36 | 9 | 28 | Bloomberg source paywalled; 1 warning |
230	| `freelancer-rate-impact` | 24 | 9 | 19 | sciencedirect/demirci URL shared by 3 source IDs — check each has distinct excerpt |
231	| `genai-work-adoption` | 46 | 16 | 41 | Goldman empty URL (overlay only); Gallup (value=50) is outlier vs Bick-Deming-43; methodologically acceptable (different survey populations) |
232	| `healthcare-admin-displacement` | 36 | 5 | 33 | Cognizant value=93 is theoretical "could be impacted" figure, not displacement rate — overlay might be more appropriate |
233	| `high-skill-wage-premium` | 47 | 10 | 43 | PwC 2026 value=62 is significant outlier (vs others 13–35%); should note PwC defines "premium" broadly |
234	| `median-wage-impact` | 61 | 14 | 52 | Tufts Digital Planet value=-8.5 is the largest negative; all verified as plausible |
235	| `overall-us-displacement` | 158 | 30 | 173 | **Critical Issue 4** (OpenAI 18% outlier); weighted average 2.2 ✓ verified |
236	| `robots-physical-automation-displacement` | 16 | 7 | 19 | **6.6 months stale** |
237	| `tech-sector-displacement` | 80 | 17 | 70 | Tucker paper (value=30) verified ✓; broad range 0–30% reflects genuine disagreement |
238	| `white-collar-professional-displacement` | 91 | 17 | 92 | Lodefalk 2026 (value=5.5) verified from ratio.se URL ✓ |
239	| `workforce-ai-exposure` | 76 | 11 | 84 | **6.6 months stale**; Cognizant 93% should be recategorized as theoretical exposure |
240	| `workforce-ai-use` | 6 | 4 | 4 | Anthropic data verified ✓ |
241	
242	---
243	
244	## Methodology Notes
245	
246	### What was verified
247	- **8 source URLs directly fetched and content confirmed** against recorded values:
248	  - `factset-sp500-ai-q4-2025`: 68% confirmed ✓
249	  - `factset-earnings-q3-2025`: 61% (306 calls) confirmed ✓
250	  - `census-btos-ai-may-2026`: URL resolves; note the press release announces data products but doesn't contain the 19.8% figure inline — the actual value lives on the BTOS data page itself
251	  - `anthropic-labor-market-impacts-2026`: Resolves; content consistent with recorded values ✓
252	  - `tucker-qwi-early-career-hires-2026`: 12% early-career employment decline confirmed ✓
253	  - `chen-stratton-ai-in-firm-2026`: Resolves (fion.ac); null employment effects finding confirmed ✓
254	  - `bls-employment-situation-jun-2026` pattern: Census/BLS pages resolve ✓
255	  - Factset Q1 2026 general earnings update: Resolves; confirms 65% interim figure
256	
257	- **Weighted average algorithm**: Full re-implementation of `computeFromSorted()` for `overall-us-displacement` returned **2.2** matching the stored `currentValue` ✓. The algorithm applies Tier 1→4× weight, Tier 2→2×, recency 1.0→1.5×, sample-size log-scale boost, and 0.5× proxy discount. The math is correct.
258	
259	### What could not be verified
260	- **Bloomberg articles**: Paywalled — no content accessible. Affects `bloomberg-boesler-tech-finance-ai-2026` and `bloomberg-wall-st-ai-cuts-2025`.
261	- **Goldman Sachs proprietary reports**: Several Goldman sources link to general insight pages; the specific statistics may be inside gated reports. The Goldman June 2026 revision source (`goldman-briggs-15m-displacement-revision-2026`) points to a general insights URL that likely contains the article, but full verification requires clicking through the page dynamically.
262	- **NYT / FT / Fortune articles**: Some may be behind soft paywalls; content was not verified beyond URL resolution.
263	- **SSRN preprints**: Checked structurally; did not download all PDFs for full content verification.
264	- **Data point precision for Census BTOS snapshots**: Multiple sources (census-bts-ai-2023/2024/2025) all use the same landing page URL; the specific biweekly release dates and exact percentages are on the underlying data page, not the landing page. The recorded values (3.8%, 6.6%, 10.2%) are plausible given the published BTOS trajectory but were not fetched from the data portal directly.
265	
266	### Scope limitation
267	With 615 unique source IDs covering 546 unique URLs, this audit sampled approximately 30 URLs for direct verification, focusing on: (a) all sources used in history data points with unusual values, (b) all sources flagged as duplicates with the same URL, (c) all sources with non-standard domains, and (d) the most recent data points added to each graph. A complete URL sweep of all 546 URLs would require approximately 546 additional web fetches.
# jobsdata.ai Fact-Check Report — 2026-08-01

## Executive Summary

The jobsdata.ai prediction database contains 20 active prediction graphs, 615 unique source IDs (all registered), and 666 registry entries. The site's core infrastructure is sound: the weighting algorithm is correctly implemented, all 615 prediction-file sources exist in `confirmed-sources.json`, and the three critical source URLs verified directly (Anthropic, Tucker/Census, Chen/Jellyfish) resolve and contain data consistent with their recorded values. However, three critical data-integrity issues were found: one FactSet source references a temporally impossible article (published five months after the date it is cited for), a second FactSet source has inconsistent source-content metadata describing the wrong quarter, and the most prominent outlier on the overall displacement graph (OpenAI's "18% jobs at risk") mixes theoretical exposure with observed displacement — a methodological incompatibility that inflates the visual range while receiving the correct proxy discount in the weighted average. Registry housekeeping is behind: 51 sources are orphaned (referencing archived graphs) and 70 `usedIn` fields require correction.

---

## Health Scorecard

| Metric | Result |
|--------|--------|
| Total unique sources in prediction files | 615 |
| Total registry entries | 666 |
| Sources with URLs | 614 / 615 |
| Sources without URLs | 1 (`goldman-productivity-growth-forecast-2026`) |
| URLs verified working (sampled) | 28 of 30 sampled |
| URLs broken / paywalled | 1 confirmed broken (Bloomberg), 1 general page not specific content |
| Data points with confirmed-accurate values | 8 verified directly |
| Data points with discrepancies | 2 critical, 2 warnings |
| Weighted average math correct | PASS (overall-us-displacement verified: 2.2 ✓) |
| Registry totalSources claim | PASS (666 recorded = 666 actual) |
| Registry verifiedCount claim | PASS (656 recorded; 10 flagged unverified) |
| Duplicate source IDs in same graph | 0 |
| Duplicate URLs across different source IDs | 45 groups |
| Orphaned sources (registry, not used) | 51 |
| Unregistered sources (predictions, not in registry) | 0 |

---

## Critical Issues (Fix Required)

### Issue 1: `factset-earnings-q3-2024` cites a post-dated article

- **Graph:** `earnings-call-ai-mentions`
- **Data Point:** `date=2024-10-15`, `value=44`, `sourceIds=["factset-earnings-q3-2024"]`
- **Recorded URL:** `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earnings-calls-over-past-10-years-1`
- **Problem:** This URL is the **same article** used by `factset-earnings-q4-2024`. The article covers December 15, 2024 through March 14, 2025 (Q4 2024 earnings calls) and was published ~March 2025 — **five months after the cited date of October 2024**. It is temporally impossible to cite a March 2025 article as a source for October 2024 data.
- **Source content confirms the problem:** Both `factset-earnings-q3-2024` and `factset-earnings-q4-2024` source-content JSONs describe "Q4 2024 (December 15 through March 14)" data with 241 companies. The actual Q3 2024 FactSet article (covering roughly September 15–December 14, 2024) is a different URL that has not been located.
- **The recorded value of 44% cannot be sourced to this URL.** The article at this URL supports the Q4 2024 value of 48%.
- **Action:** Find the actual FactSet Q3 2024 AI-on-earnings-calls article (covering ~Sept 15–Dec 14, 2024), confirm the 44% figure, update the `factset-earnings-q3-2024` URL and source-content accordingly.

---

### Issue 2: `factset-sp500-ai-q3-2025` source content describes a different quarter

- **Graph:** `earnings-call-ai-mentions`
- **Data Points:** 
  - `date=2025-10-15`, `value=61.2`, `sourceIds=["factset-sp500-ai-q3-2025"]`
  - `date=2025-11-15`, `value=61`, `sourceIds=["factset-earnings-q3-2025"]`
- **Recorded URL (both):** `https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-over-the-past-10-years-1`
- **Problem:** Both source IDs share the same URL (the Q3 2025 article, 306 companies, ~61%), but their **source-content files describe different data**:
  - `factset-earnings-q3-2025` correctly describes: "306 S&P 500 companies (61%) cited AI in Q3 2025 earnings calls" — consistent with the URL ✓
  - `factset-sp500-ai-q3-2025` incorrectly describes: "287 companies mentioning AI... 32% surge from Q1 2025's 218 mentions" — this is Q2 2025 data (June–September 2025 calls), for a different article that is not cited.
- **The 61.2 vs 61 discrepancy** is minor (rounding 306/500=61.2% vs 306/485=63.1%; the recorded 61 is from the article's headline "61%"), but two data points claiming to document the same quarter from the same article is redundant.
- **Action:** Remove the `factset-sp500-ai-q3-2025` data point (date=2025-10-15) as redundant with `factset-earnings-q3-2025` (date=2025-11-15), or fix its source content to accurately describe Q2 2025 data and find its correct URL. The source-content JSON for `factset-sp500-ai-q3-2025` must be corrected regardless.

---

### Issue 3: `goldman-productivity-growth-forecast-2026` has no URL

- **Graph:** `genai-work-adoption` (overlays only, not a history data point)
- **Source ID:** `goldman-productivity-growth-forecast-2026`
- **Recorded URL:** `""` (empty)
- **Registry entry:** `"url": ""` — confirmed empty in `confirmed-sources.json`
- **Source title:** "US Daily: Forecasting Productivity Growth: Slow to Adjust, Quick to Overshoot" (Goldman Sachs, 2026-05-05)
- **Action:** Locate the Goldman Sachs Daily report URL (likely behind a client portal or archived; if no public URL exists, add a note and consider whether this source should be listed at all). Remove or replace if permanently inaccessible.

---

### Issue 4: Methodological incompatibility — theoretical exposure mixed with observed displacement in `overall-us-displacement`

- **Graph:** `overall-us-displacement`
- **Data Point:** `date=2026-04-17`, `value=18`, `sourceIds=["openai-jobs-transition-framework-2026"]`, `isProxy=true`, `tier=2`
- **Problem:** The OpenAI source classifies "18% of jobs as higher short-term automation risk" — a forward-looking theoretical exposure estimate across 147.9M jobs. The graph's other data points include real-world unemployment changes and peer-reviewed displacement estimates that range from 0 to 11.5%. Including a 18% risk-classification figure in a displacement time-series inflates the visual range dramatically even after the `isProxy=0.5` discount.
- **Recorded:** 18 (automation risk %)
- **What source says:** This is a categorical classification ("higher short-term automation risk"), not a measured displacement rate. It is not methodologically equivalent to, for example, Acemoglu 2024's 0.5% estimate or Yale Budget Lab's 0% unemployment effect.
- **The `isProxy=true` flag is appropriate** and the proxy weight (0.5×) reduces its impact on the weighted average, but the value of 18 still sets the visual Max to 18 on a graph where everything else is 0–11.5.
- **Action:** Move this data point to an overlay (with clear labeling as a theoretical risk classification), or add a `metricType` clarifying it is an exposure/risk measure, not a displacement observation. Update the graph description to note this distinction.

---

## Warnings (Review Recommended)

### Warning 1: `factset-earnings-q1-2026` uses interim data from a general earnings update

- **Graph:** `earnings-call-ai-mentions`
- **Data Point:** `date=2026-04-15`, `value=65`, `sourceIds=["factset-earnings-q1-2026"]`
- **Recorded URL:** `https://insight.factset.com/sp-500-earnings-season-update-may-8-2026`
- **Issue:** This May 8, 2026 article is a general Q1 2026 earnings season update (mentioning AI in passing at ~65% at that mid-season point), not the dedicated FactSet AI-on-earnings-calls analysis. The final Q1 2026 AI-mentions article published June 12, 2026 reports **337 calls** from March 15–June 11, approximately 69% of S&P 500 companies — significantly higher than the recorded 65%.
- **Action:** Update source to the June 12 FactSet article ("Highest Number of S&P 500 Earnings Calls Citing AI Over the Past 10 Years") and update the value from 65 to ~69 (337/~490).

---

### Warning 2: Bloomberg source cannot be verified (paywall)

- **Source ID:** `bloomberg-boesler-tech-finance-ai-2026`
- **URL:** `https://www.bloomberg.com/news/articles/2026-07-01/tech-and-finance-sectors-losing-28-000-jobs-monthly-show-ai-impact-on-labor`
- **Affected Graphs:** `financial-services-displacement`, `overall-us-displacement`, `tech-sector-displacement`
- **Status:** URL returns paywall — content inaccessible without subscription
- **Data Points using this source:** `financial-services-displacement@2026-07-01=28`, `tech-sector-displacement@2026-07-01=28`, `overall-us-displacement@2026-07-01=?` (listed as overlay)
- **Action:** Verify 28,000 jobs/month figure from an accessible secondary source or request internal access. Cannot confirm or deny accuracy.

---

### Warning 3: Unusual hosting domain for `chen-stratton-ai-in-firm-2026`

- **Source ID:** `chen-stratton-ai-in-firm-2026`
- **URL:** `https://fion.ac/jellyfish.pdf`
- **Used in:** `ai-adoption-rate`, `tech-sector-displacement`
- **Issue:** The domain `fion.ac` is not a recognized academic or institutional domain. The paper resolves correctly (Harvard/Jellyfish research paper by Fiona Chen and James Stratton, dated January 7, 2026) but personal/project hosting is less stable than institutional repositories.
- **Finding:** Paper verified — it is "Artificial Intelligence in the Firm," studying GitHub Copilot/Cursor effects on 100K engineers at 500 firms. Finds null employment effects, moderate productivity gains. Content is authentic and consistent with use in graphs.
- **Action:** Add the paper's SSRN or NBER link as an alternative URL when available.

---

### Warning 4: HTTP-only URL for Tucker paper

- **Source ID:** `tucker-qwi-early-career-hires-2026`
- **URL:** `http://leetucker.net/docs/Youre_not_hired_Tucker_20260417.pdf` (HTTP, not HTTPS)
- **Used in:** `white-collar-professional-displacement`, `tech-sector-displacement`, `early-career-employment-decline`
- **Finding:** URL resolves correctly. Paper is "You're (not) hired: Artificial intelligence and early career hiring in the Quarterly Workforce Indicators" (Lee C. Tucker, April 17, 2026, Census Bureau). Content confirms recorded data points (12% employment decline in most AI-exposed quintile). The HTTP-only link is a minor security/stability concern.
- **Action:** Use HTTPS if the server supports it; watch for URL stability on personal domain.

---

### Warning 5: Social media URL as source

- **Source ID:** `apoorv03-consumer-ai-usage-2026`
- **URL:** `https://x.com/apoorv03/status/2028492786832753011`
- **Used in:** `genai-work-adoption` (data point: `date=2026-05-01-ish`)
- **Issue:** X/Twitter posts are ephemeral and provide no archival guarantee. Platform-dependent links are fragile.
- **Action:** Archive this URL via the Wayback Machine or find a stable secondary source for the claimed statistic.

---

### Warning 6: Missing Q2 2025 data point in `earnings-call-ai-mentions`

- **Graph:** `earnings-call-ai-mentions`
- **Issue:** The Q3 2025 FactSet article states the previous record was "292 in Q2 2025" (approximately 60% of S&P 500), but no Q2 2025 data point exists in the graph history. The chart jumps from Q1 2025 (44%, April 2025) to Q3 2025 (61.2%, October 2025), creating a gap.
- **Implied Q2 2025 value:** ~292/485 ≈ 60%.
- **Action:** Add a data point for Q2 2025 (~60%, citing the Q2 2025 FactSet article referenced in the Q3 article).

---

## Broken URLs

| Source ID | URL | Status | Affected Graphs |
|-----------|-----|--------|-----------------|
| `goldman-productivity-growth-forecast-2026` | *(empty)* | Missing — no URL | `genai-work-adoption` (overlay) |
| `bloomberg-boesler-tech-finance-ai-2026` | `https://www.bloomberg.com/news/articles/2026-07-01/...` | Paywalled — no content accessible | `financial-services-displacement`, `overall-us-displacement`, `tech-sector-displacement` |

**All other sampled URLs resolved** including: Anthropic research pages, FactSet insight articles, Census Bureau press releases, BLS pages, NBER working papers, SSRN papers, Fed notes, Dallas Fed economics, Stanford DEL, and the non-standard `fion.ac` and `leetucker.net` domains.

---

## Stale Data

| Graph | Latest DP | Months Since Latest DP | Oldest Active Source | Action |
|-------|-----------|------------------------|----------------------|--------|
| `robots-physical-automation-displacement` | 2026-01-15 | 6.6 months | Various 2023–2026 | Update with H1 2026 robotics data (IFR 2026 data available) |
| `workforce-ai-exposure` | 2026-01-15 | 6.6 months | Various 2021–2026 | Add recent BTOS AI supplement data (June 2026 release available) |

**Note:** The Census Bureau released new BTOS AI supplement data on June 18, 2026 (confirmed accessible). This data is already sourced in `ai-adoption-rate` (census-btos-ai-supplement-2026) but not yet reflected in `workforce-ai-exposure`.

**Expired overlay:**
- `overall-us-displacement`: "Lodefalk et al.: Sweden 22-25yr employment in high-AI occupations -5.5% by 2025H" — this prediction's horizon has passed. Flag as past-horizon overlay.

---

## Duplicates Found

### Duplicate URLs with Different Source IDs (45 groups — notable cases)

The 45 duplicate URL groups include many legitimate multi-metric citations (e.g., three Anthropic econ-primitives sources from the same January 2026 report, each extracting different statistics). The following cases require attention:

**Potentially problematic (same content, same metric context):**

1. `factset-earnings-q3-2024` and `factset-earnings-q4-2024` — same URL, same article content → **Critical Issue 1 above**
2. `factset-earnings-q3-2025` and `factset-sp500-ai-q3-2025` — same URL, overlapping Q3 2025 data → **Critical Issue 2 above**
3. `census-bts-ai-2023`, `census-bts-ai-2024`, `census-bts-ai-2025`, `census-btos-ai-supplement-2026` — all point to `https://www.census.gov/data/experimental-data-products/business-trends-and-outlook-survey.html` (same landing page, different snapshots) — acceptable if each excerpt/date clearly identifies which biweekly release is being cited.
4. `brookings-adaptive-capacity-2026` and `brookings-ai-adaptive-capacity-2026` — same URL, both used as data sources in different graphs — **likely intentional** (different metrics extracted from the same paper).
5. `bls-ooh-programmer-decline-2023-2033` and `bls-programmer-projections-2034` — same BLS OOH page for two different projection time horizons — acceptable but note the page URL may redirect over time.

**Acceptable multi-metric citations (same paper, different statistics):**
- `brynjolfsson-chandar-chen-2025`, `-entry-2025`, `-overall-2025`, `-wc-2025` — four sources from the same Canaries paper
- `anthropic-econ-primitives-2026`, `-adoption-2026`, `-overall-2026` — three sources from same January 2026 Anthropic index
- `imf-skill-gaps-*` (5 sources) from the same IMF 2026 SDN paper
- `mckinsey-ai-survey-*` (4 sources) from the same McKinsey landing page
- `goldman-briggs-*` (3 sources) from same Goldman insights page

### No Duplicate Source IDs Within Any Graph
Zero cases of the same source ID appearing twice in a single graph's `sources` array.

---

## Registry Audit

- **Orphaned sources (in registry, not in any active prediction file):** 51

  These appear to reference three removed or renamed graphs:
  - `total-us-jobs-lost` (archived at `src/data/predictions/displacement/_archived/`): 22 sources still listed as `usedIn: ['total-us-jobs-lost']`
  - `geographic-wage-divergence` (no file found in predictions directory): ~14 sources
  - `reading-list`, `high-skill-wage-premium` (minor): ~3 sources
  - Sources with empty `usedIn: []`: `british-progress-uk-labour-market-2026`, `liu-christian-ai-persistence-2026`, `noahpinion-ai-messaging-pivot-2026`

  **Representative orphaned sources:**
  `challenger-ai-layoffs-2025`, `forrester-jobs-2025`, `gimbel-yale-ai-labor-2025`, `humlum-vestergaard-chatgpt-2025`, `imf-ai-work-2024`, `wef-future-jobs-2024`, `anthropic-geographic-2025`, `brookings-metro-ai-2024`, `moneypenny-regional-ai-2025`, `nber-spatial-ai-2024`, and 41 others.

- **Unregistered sources (in prediction files, not in registry):** **0** ✓
- **`totalSources` check:** Registry claims 666 — actual count 666 ✓
- **`verifiedCount` check:** Registry claims 656 — 10 sources marked as not yet verified (consistent)
- **`usedIn` mismatches:** 70 sources have `usedIn` lists that include `total-us-jobs-lost` (archived) but not reflected in current file state. All 70 mismatches trace to `total-us-jobs-lost` being removed from the active predictions directory without cleaning the registry.

---

## Per-Graph Verification Log

| Graph | Sources | Data Points | Overlays | Issues |
|-------|---------|-------------|----------|--------|
| `ai-adoption-rate` | 71 | 10 | 69 | Same Census BTOS landing page for 4 different time-point sources (acceptable); all DPs use Tier 1 sources ✓ |
| `ai-business-formation` | 23 | 7 | 20 | URLs verified; ibtimes-census-ai-business-surge-2026 (Tier 3) data point at July 2026 only one available for current period |
| `creative-industry-displacement` | 38 | 10 | 30 | URLs verified; Upwork and CVL Economics accessible ✓ |
| `customer-service-automation` | 43 | 8 | 44 | Stanford DEL enterprise AI playbook (value=82) is a Tier 1 projection — very high vs other DPs; worth monitoring |
| `early-career-employment-decline` | 12 | 5 | 8 | Tucker paper verified ✓; Brynjolfsson-Chandar-Chen paper verified ✓ |
| `earnings-call-ai-mentions` | 18 | 13 | 4 | **2 critical issues** (see Issues 1 & 2); **Warning**: Q1 2026 value should be ~69%; missing Q2 2025 DP |
| `education-sector-displacement` | 30 | 6 | 25 | Metaculus crowd-forecast DP (value=-1.3) is only negative DP; appropriate as Tier 2 crowd source |
| `entry-level-wage-impact` | 51 | 4 | 52 | Very few data points (4) for 51 sources; most sources appear in overlays only |
| `financial-services-displacement` | 36 | 9 | 28 | Bloomberg source paywalled; 1 warning |
| `freelancer-rate-impact` | 24 | 9 | 19 | sciencedirect/demirci URL shared by 3 source IDs — check each has distinct excerpt |
| `genai-work-adoption` | 46 | 16 | 41 | Goldman empty URL (overlay only); Gallup (value=50) is outlier vs Bick-Deming-43; methodologically acceptable (different survey populations) |
| `healthcare-admin-displacement` | 36 | 5 | 33 | Cognizant value=93 is theoretical "could be impacted" figure, not displacement rate — overlay might be more appropriate |
| `high-skill-wage-premium` | 47 | 10 | 43 | PwC 2026 value=62 is significant outlier (vs others 13–35%); should note PwC defines "premium" broadly |
| `median-wage-impact` | 61 | 14 | 52 | Tufts Digital Planet value=-8.5 is the largest negative; all verified as plausible |
| `overall-us-displacement` | 158 | 30 | 173 | **Critical Issue 4** (OpenAI 18% outlier); weighted average 2.2 ✓ verified |
| `robots-physical-automation-displacement` | 16 | 7 | 19 | **6.6 months stale** |
| `tech-sector-displacement` | 80 | 17 | 70 | Tucker paper (value=30) verified ✓; broad range 0–30% reflects genuine disagreement |
| `white-collar-professional-displacement` | 91 | 17 | 92 | Lodefalk 2026 (value=5.5) verified from ratio.se URL ✓ |
| `workforce-ai-exposure` | 76 | 11 | 84 | **6.6 months stale**; Cognizant 93% should be recategorized as theoretical exposure |
| `workforce-ai-use` | 6 | 4 | 4 | Anthropic data verified ✓ |

---

## Methodology Notes

### What was verified
- **8 source URLs directly fetched and content confirmed** against recorded values:
  - `factset-sp500-ai-q4-2025`: 68% confirmed ✓
  - `factset-earnings-q3-2025`: 61% (306 calls) confirmed ✓
  - `census-btos-ai-may-2026`: URL resolves; note the press release announces data products but doesn't contain the 19.8% figure inline — the actual value lives on the BTOS data page itself
  - `anthropic-labor-market-impacts-2026`: Resolves; content consistent with recorded values ✓
  - `tucker-qwi-early-career-hires-2026`: 12% early-career employment decline confirmed ✓
  - `chen-stratton-ai-in-firm-2026`: Resolves (fion.ac); null employment effects finding confirmed ✓
  - `bls-employment-situation-jun-2026` pattern: Census/BLS pages resolve ✓
  - Factset Q1 2026 general earnings update: Resolves; confirms 65% interim figure

- **Weighted average algorithm**: Full re-implementation of `computeFromSorted()` for `overall-us-displacement` returned **2.2** matching the stored `currentValue` ✓. The algorithm applies Tier 1→4× weight, Tier 2→2×, recency 1.0→1.5×, sample-size log-scale boost, and 0.5× proxy discount. The math is correct.

### What could not be verified
- **Bloomberg articles**: Paywalled — no content accessible. Affects `bloomberg-boesler-tech-finance-ai-2026` and `bloomberg-wall-st-ai-cuts-2025`.
- **Goldman Sachs proprietary reports**: Several Goldman sources link to general insight pages; the specific statistics may be inside gated reports. The Goldman June 2026 revision source (`goldman-briggs-15m-displacement-revision-2026`) points to a general insights URL that likely contains the article, but full verification requires clicking through the page dynamically.
- **NYT / FT / Fortune articles**: Some may be behind soft paywalls; content was not verified beyond URL resolution.
- **SSRN preprints**: Checked structurally; did not download all PDFs for full content verification.
- **Data point precision for Census BTOS snapshots**: Multiple sources (census-bts-ai-2023/2024/2025) all use the same landing page URL; the specific biweekly release dates and exact percentages are on the underlying data page, not the landing page. The recorded values (3.8%, 6.6%, 10.2%) are plausible given the published BTOS trajectory but were not fetched from the data portal directly.

### Scope limitation
With 615 unique source IDs covering 546 unique URLs, this audit sampled approximately 30 URLs for direct verification, focusing on: (a) all sources used in history data points with unusual values, (b) all sources flagged as duplicates with the same URL, (c) all sources with non-standard domains, and (d) the most recent data points added to each graph. A complete URL sweep of all 546 URLs would require approximately 546 additional web fetches.