1	# jobsdata.ai Fact-Check Report — 2026-04-10
2	
3	## Executive Summary
4	
5	jobsdata.ai tracks 18 AI labor market prediction graphs across 513 registered sources and 182 history data points. The site is actively maintained (registry `lastUpdated: 2026-04-07`) and the API-served values are dynamically computed and generally reasonable. However, **six graphs display stale hardcoded `currentValue` fields** that diverge from the API's live computed aggregate — with white-collar displacement the most severe mismatch (hardcoded 0.9% vs. live 5.8%). Additionally, **all 15 Factset insight.factset.com URLs return 404** due to truncated slugs, the Klarna anchor data point (customer-service: 66%) lacks a working source URL, and the BLS MLR article is cited to support negative tech displacement projections that contradict the article's actual findings. No duplicate source IDs within graphs were found; registry count fields are accurate; and 31 orphaned sources correspond to two planned future graphs (`total-us-jobs-lost`, `geographic-wage-divergence`).
6	
7	---
8	
9	## Health Scorecard
10	
11	| Metric | Result |
12	|--------|--------|
13	| Total graphs | 18 |
14	| Total unique sources (registry) | 513 |
15	| Registry `totalSources` accurate | ✅ PASS (claimed 513, actual 513) |
16	| Registry `verifiedCount` accurate | ✅ PASS (claimed 503, actual 503) |
17	| Total history data points | 182 |
18	| Total overlays | 648 |
19	| URLs verified working (sampled) | ~20 / 37 sampled |
20	| URLs broken/404 confirmed | 17 (15 Factset + Klarna + amazon-8k) |
21	| URLs inaccessible (bot-blocking 403) | ~6 (BLS, SSRN, WEF — content likely exists) |
22	| currentValue matches API | 12 / 18 graphs |
23	| currentValue **stale** (mismatch ≥ 0.4pp) | 6 graphs |
24	| Data point vs. source excerpt discrepancies found | 3 confirmed, 2 probable |
25	| Duplicate source IDs within same graph | 0 |
26	| Same URL → multiple source IDs (shared URL) | 52 pairs (mostly legitimate multi-extract) |
27	| Orphaned registry sources | 31 (planned future graphs) |
28	| Unregistered sources (in graph, not registry) | 0 |
29	| Registry `usedIn` field discrepancies | 44 sources |
30	| Graphs with passed time horizon | 0 |
31	
32	---
33	
34	## Critical Issues (Fix Required)
35	
36	### Issue 1: BLS MLR source cited for data values it does not support
37	
38	- **Graph:** `tech-sector-displacement`
39	- **Source:** `bls-mlr-ai-employment-projections-2025`
40	- **Recorded:** Six data points (2025–2030): `0, -1.8, -3.6, -5.4, -7.2, -9` (% tech sector displacement)
41	- **Actual:** The BLS Monthly Labor Review article (Feb 2025) explicitly projects software developer employment to **increase 17.9%** through 2033, not decline. The article's only negative tech occupational projections are customer service representatives (−5%) and medical transcriptionists (−4.7%) over 2023–33 — neither of which equals −9% tech displacement by 2030.
42	- **Action:** Remove or re-source the six extrapolated projection data points (`2025-02-10` through `2030-02-10`). If a −9% programmer-specific trajectory is intended, cite the BLS OOH computer programmer page (`bls-ooh-programmer-decline-2023-2033`) which projects a −25% decline 2023–2033 for that specific occupation — and recalculate accordingly.
43	
44	---
45	
46	### Issue 2: `white-collar-professional-displacement` currentValue severely stale
47	
48	- **Graph:** `white-collar-professional-displacement`
49	- **Source:** JS bundle data file (`currentValue` field)
50	- **Recorded in JS bundle:** `0.9`
51	- **Actual (API-computed):** `5.8`
52	- **Difference:** 4.9 percentage points — the displayed value is **84% lower** than the live computed aggregate.
53	- **Action:** Rebuild/redeploy the static JS bundle so `currentValue` reflects the current weighted average. This is the most severe of the six stale-value discrepancies. The SEO structured data (schema.org Observation) already shows 5.8 correctly; only the JS bundle is wrong.
54	
55	---
56	
57	### Issue 3: All 15 Factset source URLs return 404 (truncated slugs)
58	
59	- **Graphs affected:** `earnings-call-ai-mentions` (all 15 history data points), plus overlays in multiple other graphs
60	- **Source IDs affected:** `factset-earnings-q4-2022` through `factset-sp500-ai-q4-2025`
61	- **Recorded URLs (sample):**
62	  - `https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-ov` → **HTTP 404**
63	  - `https://insight.factset.com/highest-number-of-sp-500-companies-citing-ai-on-earn` → **HTTP 404**
64	- **Issue:** All Factset URLs appear to be truncated mid-slug (e.g., ending in `-citing-ai-ov`, `-citing-ai-on-earn`). The Factset insight homepage (insight.factset.com) itself resolves correctly (HTTP 200), confirming these are broken slugs, not a domain-level block.
65	- **Additional:** Three source IDs (`factset-earnings-q3-2025`, `factset-earnings-q4-2025`, `factset-sp500-ai-q3-2025`) all share the **same truncated URL**, making disambiguation impossible.
66	- **Action:** Locate and enter the full, untruncated Factset article URLs for all 15 entries. This affects the primary source documentation for the entire `earnings-call-ai-mentions` graph.
67	
68	---
69	
70	### Issue 4: `earnings-call-ai-mentions` Q3 2025 data point — value mismatch and wrong date
71	
72	- **Graph:** `earnings-call-ai-mentions`
73	- **Source:** `factset-earnings-q3-2025`
74	- **Recorded:** `value = 58`, `date = 2025-07-15`
75	- **Source excerpt:** *"Record 306 S&P 500 companies (61%) cited AI in Q3 2025 earnings calls"*
76	- **Discrepancy 1:** `58` ≠ `61`. The excerpt explicitly states 61% (306 ÷ ~500).
77	- **Discrepancy 2:** Q3 2025 earnings calls are reported in October–November 2025. The date `2025-07-15` is during Q3 itself — before those calls would be made. The source's `datePublished` is `2025-11-15`, which should be the data point date.
78	- **Action:** Change `value` from `58` to `61`, and change `date` from `2025-07-15` to `2025-11-15`.
79	
80	---
81	
82	### Issue 5: Klarna Tier-1 anchor source URL broken (404)
83	
84	- **Graph:** `customer-service-automation`
85	- **Source:** `klarna-earnings-2024`
86	- **Recorded URL:** `https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/`
87	- **Status:** HTTP 404
88	- **Impact:** This is the **single highest-value data point** in the graph (`value = 66`, date `2024-01-20`, Tier 1), establishing the 66% CS automation baseline. Without a working URL, this claim cannot be independently verified.
89	- **Action:** Update the URL to the current Klarna press release location (likely moved to their press archive). The Klarna press release is widely cited and the 66% / "two-thirds" claim is verifiable via web archive or alternate sources (Reuters, Financial Times, etc.).
90	
91	---
92	
93	### Issue 6: `bls-programmer-employment-observed` — value mismatch and URL broken
94	
95	- **Graph:** `tech-sector-displacement`
96	- **Source:** `bls-programmer-employment-observed`
97	- **Recorded:** `value = 13.8` (% of jobs displaced, 2024-11-01, Tier 1)
98	- **Source excerpt:** *"Computer programmer employment (routine coding roles) fell ~27.5% in roughly two years following ChatGPT's release"*
99	- **URL status:** `https://www.bls.gov/oes/current/oes151251.htm` → redirects to the BLS OEWS **tables index**, not the computer programmer occupation page (HTTP 403 on direct fetch; confirmed redirect to generic index via web_fetch).
100	- **Value discrepancy:** 13.8 ≠ 27.5. These numbers may measure different things (13.8% could represent the portion of the tech sector displaced vs. the 27.5% programmer-specific employment drop), but this is not documented in the data point, creating verification ambiguity.
101	- **Action:** (a) Update URL to the specific BLS OES programmer page (the current canonical URL for SOC 15-1251). (b) Add a `proxyContext` or label clarifying why the recorded value (13.8) differs from the excerpt (27.5).
102	
103	---
104	
105	### Issue 7: `acemoglu-macro-2024` cited for 5% displacement — excerpt says "limited"
106	
107	- **Graph:** `overall-us-displacement`
108	- **Source:** `acemoglu-macro-2024` ("The Simple Macroeconomics of AI," NBER w32487)
109	- **Recorded:** `value = 5` (% US job displacement, 2024-04-01, Tier 1, projected)
110	- **Source excerpt:** *"AI may increase TFP by only 0.53-0.66% over 10 years, with limited job displacement effects."*
111	- **Issue:** The excerpt describes Acemoglu's conclusion as **"limited job displacement effects"** — which directly contradicts using this source to anchor a 5% displacement projection. This paper's thesis is that pessimism about AI productivity/displacement is warranted and that widely cited high-displacement figures are overestimates.
112	- **Action:** Either (a) replace the source excerpt with the specific passage in the paper that supports a 5% figure, or (b) re-source this data point to a different paper that directly projects 5% displacement.
113	
114	---
115	
116	## Warnings (Review Recommended)
117	
118	### Warning 1: Five additional `currentValue` fields are stale
119	
120	The JS bundle contains hardcoded `currentValue` fields for all 18 graphs, but 6 diverge from the API's live computed aggregate. Beyond Issue 2 (white-collar), five others are stale:
121	
122	| Graph | Bundle `currentValue` | API `mean` | Difference |
123	|-------|-----------------------|------------|------------|
124	| `tech-sector-displacement` | 2.0 | 1.6 | −0.4 |
125	| `education-sector-displacement` | 12.2 | 11.2 | −1.0 |
126	| `high-skill-wage-premium` | 23.8 | 23.4 | −0.4 |
127	| `median-wage-impact` | −1.4 | −1.9 | −0.5 |
128	| `entry-level-wage-impact` | −6.7 | −6.3 | +0.4 |
129	
130	These discrepancies suggest the last bundle build predates several recent data point additions visible in the API. They represent a deployment pipeline issue rather than data entry errors.
131	
132	---
133	
134	### Warning 2: `substack-wages-doom` — Tier 4 source, no excerpt, -5% median wage claim
135	
136	- **Graph:** `median-wage-impact`
137	- **Source:** `substack-wages-doom` (arindube.substack.com, Tier 4)
138	- **Data point:** `value = -5`, type = projected (2025-05-01)
139	- **Issue:** No source excerpt is recorded. Arindrajit Dube's Substack post "The Wage Compression that Persisted" discusses wage dynamics but is primarily about past wage compression, not a forward-looking -5% median wage projection. Without an excerpt, the claimed -5% cannot be verified. This is also the most pessimistic wage data point from a non-peer-reviewed source.
140	- **Action:** Add an excerpt with the exact passage supporting -5%, or downgrade the data point's evidenceTier to reflect the speculative nature.
141	
142	---
143	
144	### Warning 3: `acemoglu-restrepo-robots-jpe-2020` — 71 months old, no newer replacement in `robots-physical-automation`
145	
146	- **Graph:** `robots-physical-automation-displacement`
147	- **Source:** `acemoglu-restrepo-robots-jpe-2020` (published 2020-06-01)
148	- **Issue:** This 2020 JPE paper is the foundational source for the 3.3% displacement anchor in the robots graph. Multiple newer papers exist (IFR World Robotics 2024–2025, McKinsey agents/robots 2025) but none directly replaces this historical anchor. The data point (value=3.3, date=2020-06-01) is legitimate as a historical benchmark, but reviewers should note it predates the generative AI era.
149	- **Action:** Add a note in the data point label distinguishing pre-GenAI robot automation from AI-enabled automation projections.
150	
151	---
152	
153	### Warning 4: Methodological mixing in `tech-sector-displacement` — proxy vs. direct measurements not always marked
154	
155	- **Issue:** Several data points in `tech-sector-displacement` use job posting declines as proxies for displacement (correctly marked with `isProxy: true` and conversion factors), but the `bls-programmer-employment-observed` data point (value=13.8, Tier 1) has **no `isProxy` flag** despite appearing to represent either: (a) a converted figure from a different metric, or (b) a partial-sector displacement figure derived from a 27.5% occupation-specific number. This creates ambiguity in the weighted average calculation.
156	- **Action:** Add a `proxyContext` or label field documenting the derivation of the 13.8% figure.
157	
158	---
159	
160	### Warning 5: Three `wef-future-jobs-2025`-related source IDs share the same URL
161	
162	- **Sources:** `wef-education-displacement-2025`, `wef-future-jobs-2024`, `wef-future-jobs-2025`, `wef-future-of-jobs-financial-2025`, `wef-future-of-jobs-2025` — all pointing to `https://www.weforum.org/publications/the-future-of-jobs-report-2025`
163	- **Issue:** The WEF FoJ 2025 report is one document; five source IDs reference it for different statistics (education, finance, general), but `wef-future-jobs-2024` (the 2024 ID) is pointing to the 2025 report URL — likely a data entry error.
164	- **Action:** Verify that `wef-future-jobs-2024` should point to the 2023 or 2024 WEF report, not the 2025 report.
165	
166	---
167	
168	### Warning 6: `blog-mass-unemployment` — Tier 4 Medium post, no excerpt, 403
169	
170	- **Graph:** `overall-us-displacement`
171	- **Source:** `blog-mass-unemployment`
172	- **URL:** `https://medium.com/@jamiebulloch/were-not-ready-for-mass-ai-unemployment-f54d39a4c08d` → HTTP 403 (likely bot-blocking but cannot confirm content)
173	- **Excerpt:** Empty
174	- **Issue:** Tier 4 blog post with no excerpt being used in the overall displacement graph. Without an excerpt, the specific claim cannot be verified.
175	- **Action:** Add an excerpt or remove from the graph's source list.
176	
177	---
178	
179	### Warning 7: Multiple source IDs pointing to same URL — potential double-weighting
180	
181	Fifty-two pairs of source IDs share the same (often truncated) URL. Most represent legitimate multiple-extract from a single paper (e.g., `imf-skill-gaps-entry-2026`, `imf-skill-gaps-premium-2026`, etc., all from the same IMF SDN PDF). However, the following represent **the same data extracted under different names**, potentially creating artificial inflation of source count:
182	
183	| Duplicate Group | Shared URL |
184	|-----------------|------------|
185	| `korinek-stiglitz-steering-2025` / `stiglitz-korinek-steering-2025` | Same SSRN paper (5279584) — same paper, two IDs |
186	| `brookings-2024` / `kinder-brookings-2025` | Same Brookings article |
187	| `brookings-adaptive-capacity-2026` / `brookings-ai-adaptive-capacity-2026` | Same Brookings article |
188	| `medium-doom-2025` / `blog-mass-unemployment` | Same Medium blog post |
189	| `nber-ai-legal-impact-2025` / `papanikolaou-schmidt-ai-labor-2025` / `nber-hampole-ai-labor-2025` | All listed as NBER w33509, but these are different papers |
190	| `nber-bloom-firm-data-ai-2026` / `nber-firm-data-ai-2026` / `nber-bloom-firm-data-adoption-2026` / `nber-csuite-survey-2025` / `yotzov-firm-data-ai-2026` | All listed as NBER w34836 |
191	| `factset-earnings-q3-2024` / `factset-earnings-q4-2024` | Same truncated URL (different articles) |
192	| `factset-earnings-q1-2023` / `factset-earnings-q4-2022` | Same truncated URL (different articles) |
193	
194	- **Action:** Deduplicate the `korinek-stiglitz` pair (one should be removed or the URL corrected). Verify the NBER w33509 group — this may be a URL error since that NBER paper number belongs to one specific study.
195	
196	---
197	
198	## Broken URLs
199	
200	| Source ID | URL (truncated) | HTTP Status | Affected Graphs |
201	|-----------|----------------|-------------|-----------------|
202	| `klarna-earnings-2024` | klarna.com/international/press/klarna-ai-assistant... | 404 | `customer-service-automation` |
203	| `bls-programmer-employment-observed` | bls.gov/oes/current/oes151251.htm | 403/redirect-to-index | `tech-sector-displacement` |
204	| `factset-earnings-q4-2022` | insight.factset.com/...citing-ai-on-q1-e | 404 (truncated) | `earnings-call-ai-mentions` |
205	| `factset-earnings-q1-2023` | insight.factset.com/...citing-ai-on-q1-e | 404 (truncated) | `earnings-call-ai-mentions` |
206	| `factset-earnings-q2-2023` | insight.factset.com/...citing-ai-on-q2-e | 404 (truncated) | `earnings-call-ai-mentions` |
207	| `factset-earnings-q3-2023` | insight.factset.com/...discussing-ai-on-earnings-cal | 404 (truncated) | `earnings-call-ai-mentions` |
208	| `factset-earnings-q4-2023` | insight.factset.com/...citing-ai- | 404 (truncated) | `earnings-call-ai-mentions` |
209	| `factset-earnings-q1-2024` | insight.factset.com/...citing-ai-on-earn | 404 (truncated) | `earnings-call-ai-mentions` |
210	| `factset-earnings-q2-2024` | insight.factset.com/...cited-ai-on-earning | 404 (truncated) | `earnings-call-ai-mentions` |
211	| `factset-earnings-q3-2024` | insight.factset.com/...citing-ai-on-earn | 404 (truncated, same as Q4 2024) | `earnings-call-ai-mentions` |
212	| `factset-earnings-q4-2024` | insight.factset.com/...citing-ai-on-earn | 404 (truncated) | `earnings-call-ai-mentions` |
213	| `factset-earnings-q1-2025` | insight.factset.com/...cited-ai-on-ea | 404 (truncated) | `earnings-call-ai-mentions` |
214	| `factset-earnings-q3-2025` | insight.factset.com/...citing-ai-ov | 404 (truncated, shared with q4-2025) | `earnings-call-ai-mentions` |
215	| `factset-earnings-q4-2025` | insight.factset.com/...citing-ai-ov | 404 (truncated) | `earnings-call-ai-mentions` |
216	| `factset-sp500-ai-q3-2025` | insight.factset.com/...citing-ai-ov | 404 (truncated, 3-way URL clash) | `earnings-call-ai-mentions` |
217	| `factset-sp500-ai-q4-2025` | insight.factset.com/...sp-500-earnings-calls-for-q4-cited-a | 404 (truncated) | `earnings-call-ai-mentions` |
218	
219	**Note:** The Factset `insight.factset.com` domain itself resolves (HTTP 200), confirming this is a URL truncation problem, not a domain issue. The full untruncated article slugs need to be retrieved from Factset's Earnings Insight archives.
220	
221	**URLs verified working (selected):**
222	- `goldman-300m` (goldmansachs.com) ✅ — confirmed article content matches excerpt
223	- `bls-mlr-ai-employment-projections-2025` (bls.gov/opub/mlr) ✅ — full article accessible
224	- `wef-future-jobs-2025` (weforum.org) ✅ — page resolves
225	- `acemoglu-macro-2024` (nber.org/papers/w32487) ✅
226	- `brynjolfsson-chandar-chen-2025` (digitaleconomy.stanford.edu) ✅
227	- `brookings-2024` / `kinder-brookings-2025` (brookings.edu) ✅
228	- `yale-budget-lab-2025` (budgetlab.yale.edu) ✅
229	- `tufts-digital-planet-ai-jobs-risk-2026` (digitalplanet.tufts.edu) ✅
230	- `dallas-fed-overall-2026` (dallasfed.org) ✅
231	- `chen-stratton-ai-in-firm-2026` (fion.ac/jellyfish.pdf) ✅ — hosted on GitHub Pages under personal academic domain
232	
233	---
234	
235	## Stale Data
236	
237	| Graph | Last Data Point | Oldest Critical Source | Months Since Last Update | Action |
238	|-------|-----------------|----------------------|--------------------------|--------|
239	| `robots-physical-automation-displacement` | 2026-01-15 | `acemoglu-restrepo-robots-jpe-2020` (71 mo) | 2.8 mo | Low urgency; historical anchor is appropriate |
240	| `earnings-call-ai-mentions` | 2026-01-15 | `factset-earnings-q4-2022` (39 mo) | 2.8 mo | Fix broken URLs; Q1 2026 data likely available |
241	| `freelancer-rate-impact` | 2026-02-01 | `upwork-trends-2023` (35 mo) | 2.3 mo | Add Q4 2025 / Q1 2026 Upwork/Fiverr data |
242	| `workforce-ai-exposure` | 2026-01-15 | `goldman-300m` (37 mo) | 2.8 mo | Goldman 300M (Mar 2023) remains a valid historical anchor |
243	| `customer-service-automation` | 2026-02-01 | `klarna-earnings-2024` (26 mo) | 2.3 mo | Fix Klarna URL; consider Q1 2026 agentic CS data |
244	| `ai-adoption-rate` | 2026-02-26 | `census-bts-ai-2023` (32 mo) | 1.4 mo | Historical BTS data point is appropriate |
245	
246	**Note:** The "tech-sector-displacement" and "ai-business-formation" graphs show last data point dates of 2030 and 2030 respectively — these are future projection endpoints from the BLS MLR series, not actual last-updated dates. Both graphs have current (2025–2026) observed data points as well.
247	
248	---
249	
250	## Duplicates Found
251	
252	### Confirmed duplicate source entries (same paper, different IDs):
253	
254	1. **`korinek-stiglitz-steering-2025` / `stiglitz-korinek-steering-2025`** — Both point to the same SSRN paper (abstract_id=5279584). One is used in `median-wage-impact` (as `korinek-trammell-growth-2025`? — verify). The other references `wages-median`. Both should be merged into a single source ID.
255	
256	2. **`medium-doom-2025` / `blog-mass-unemployment`** — Both point to the same Medium blog post. `blog-mass-unemployment` is active in `overall-us-displacement`; `medium-doom-2025` is orphaned. The latter should be removed from the registry.
257	
258	3. **`brookings-2024` / `kinder-brookings-2025`** — Same Brookings article (different names suggest different access dates, but same URL). Used in different graphs with different values (0 in `tech-sector-displacement`, 0 in `overall-us-displacement`). Both values seem reasonable for the same "no AI apocalypse" finding.
259	
260	### Factset URL collisions (same truncated URL, different IDs — critical):
261	
262	- `factset-earnings-q1-2023` and `factset-earnings-q4-2022` → both use the same truncated URL
263	- `factset-earnings-q3-2024` and `factset-earnings-q4-2024` → both use the same truncated URL
264	- `factset-earnings-q3-2025`, `factset-earnings-q4-2025`, and `factset-sp500-ai-q3-2025` → all three use the same truncated URL
265	
266	---
267	
268	## Registry Audit
269	
270	- **Orphaned sources (in registry, not used in any active graph):** 31
271	  - 20 sources reference `total-us-jobs-lost` (planned future graph)
272	  - 7 sources reference `geographic-wage-divergence` (planned future graph)
273	  - 4 additional orphans appear to have been superseded:
274	    - `adobe-creative-survey-2024` (listed for `creative-industry-displacement`, but not in graph's sources array)
275	    - `harvard-health-policy-2024` (listed for `healthcare-admin-displacement`, but not in graph's sources array)
276	    - `brynjolfsson-bls-productivity-2026` (listed for `median-wage-impact`, but not used)
277	    - `claude-code-github-2026` (listed for `ai-adoption-rate`, but not used)
278	  
279	- **Unregistered sources (in graph, not in registry):** 0 — clean
280	
281	- **Count check:** `totalSources = 513` ✅ (actual: 513), `verifiedCount = 503` ✅ (actual: 503)
282	
283	- **`usedIn` field discrepancies:** 44 sources have at least one `usedIn` entry that doesn't match actual graph usage. The most common pattern (23 sources) is listing `total-us-jobs-lost` — a planned graph not yet deployed. Five sources reference `white-collar-professional-displacement` or `tech-sector-displacement` in `usedIn` but are not actually in those graphs' `sources` arrays:
284	  - `bls-information-sector-mar-2026`, `bls-unemployment-rate-mar-2026`, `fred-jolts-feb-2026`, `fred-unemploy-mar-2026`, `korinek-stiglitz-steering-2026`
285	
286	---
287	
288	## Per-Graph Verification Log
289	
290	| Graph | Sources | Data Points | Overlays | Issues |
291	|-------|---------|-------------|----------|--------|
292	| `tech-sector-displacement` | 67 | 15 | 64 | **CRITICAL**: BLS MLR cited for projections contradicting source; BLS programmer URL broken; currentValue stale (2 vs 1.6) |
293	| `customer-service-automation` | 34 | 6 | 35 | **CRITICAL**: Klarna anchor URL 404; currentValue matches API ✅ |
294	| `overall-us-displacement` | 112 | 23 | 116 | WARNING: Acemoglu cited for 5% value while excerpt says "limited"; currentValue matches API ✅ |
295	| `white-collar-professional-displacement` | 72 | 15 | 72 | **CRITICAL**: currentValue stale (0.9 vs 5.8) |
296	| `creative-industry-displacement` | 30 | 9 | 23 | OK; currentValue matches API ✅ |
297	| `healthcare-admin-displacement` | 29 | 5 | 26 | OK; currentValue matches API ✅ |
298	| `education-sector-displacement` | 23 | 5 | 19 | currentValue stale (12.2 vs 11.2) |
299	| `financial-services-displacement` | 28 | 8 | 21 | OK; currentValue matches API ✅ |
300	| `robots-physical-automation-displacement` | 12 | 7 | 15 | Oldest source (2020); OK contextually; currentValue matches API ✅ |
301	| `high-skill-wage-premium` | 38 | 9 | 33 | currentValue stale (23.8 vs 23.4); minor |
302	| `median-wage-impact` | 52 | 13 | 43 | WARNING: `substack-wages-doom` no excerpt; currentValue stale (-1.4 vs -1.9) |
303	| `freelancer-rate-impact` | 16 | 7 | 10 | OK; currentValue matches API ✅ |
304	| `entry-level-wage-impact` | 40 | 9 | 38 | currentValue stale (-6.7 vs -6.3); minor |
305	| `ai-adoption-rate` | 58 | 6 | 59 | OK; currentValue matches API ✅ |
306	| `genai-work-adoption` | 26 | 11 | 18 | OK; currentValue matches API ✅ |
307	| `ai-business-formation` | 16 | 6 | 12 | OK; currentValue matches API ✅ |
308	| `earnings-call-ai-mentions` | 18 | 15 | 3 | **CRITICAL**: All 15 Factset URLs broken (404); Q3 2025 value=58 should be 61; Q3 2025 date wrong (July vs November) |
309	| `workforce-ai-exposure` | 45 | 13 | 41 | OK; currentValue matches API ✅ |
310	
311	---
312	
313	## Methodology Notes
314	
315	**What was verified:**
316	- All 18 graph JSON data structures extracted from the deployed Vercel JS bundle
317	- `confirmed-sources.json` (513 sources) extracted from the deployed bundle
318	- API responses from `jobsdata.ai/api/v1/predictions/[slug]` for all 18 graphs
319	- Live schema.org structured data (Observation/Dataset markup) for all 18 prediction pages
320	- 37 source URLs checked directly (via curl + web_fetch)
321	- 2 key sources (goldman-300m, BLS MLR 2025) content-verified against recorded excerpts
322	
323	**What could not be verified:**
324	- **BLS OES programmer employment data** (oes151251.htm redirects; 403 on direct access): The claimed 27.5% two-year programmer employment decline could not be confirmed against live BLS data. Historical BLS OES data supports a significant programmer employment decline post-2022, but the precise 27.5% figure is unverified.
325	- **SSRN papers** (hartley-genai-labor-2026, fed-atl-duke-cfo-ai-productivity-2026 and others): SSRN returns HTTP 403 to automated requests. These are legitimate academic papers; the 403s are bot-detection, not broken URLs.
326	- **McKinsey reports** (mckinsey-2023 and others): mckinsey.com returned HTTP 503 during the check window — likely rate limiting, not a broken URL.
327	- **Paywalled content**: Bloomberg Intelligence, Morgan Stanley, and similar financial institution reports could not be content-verified.
328	- **All 15 Factset insight.factset.com article pages**: Returned 404. The data values recorded in excerpts appear credible based on publicly known Factset earnings insight reporting patterns, but source-level confirmation is blocked by the broken URLs.
329	- **WEF Future of Jobs 2025**: Domain resolves (verified) but automated download was blocked; content verification was partial.
330	- **Git history / changelogs**: Clone timed out. All analysis was performed against the deployed Vercel bundle and API. Repository-level blame or diff analysis was not possible.
331	
332	**Weighting formula confirmed:** `Tier 1 = 4×, Tier 2 = 2×, Tier 3 = 1×, Tier 4 = 0.5×` with additional recency and sample-size adjustments per site schema markup. The raw tier-weighted calculation gives values within 10% of the API-reported means for most graphs, consistent with the stated "recency adjustment" modifier.
333	
334	**Note on `tech-sector-displacement` future-dated data points:** Five data points are dated 2026–2030, generated as BLS projection extrapolations. The "last updated" date for this graph therefore shows 2030 in raw data, though the last real observation is November 2025.
335	
336	---
337	
338	*Report generated: 2026-04-10. Repo clone unavailable (timeout); analysis performed against deployed Vercel bundle (build: `dpl_CnWirj7eVh4KKVPbR3D6XsZkv6x9`) and live API at ai-labor-predictions.vercel.app.*
The complete contents of `report.md` are reproduced above exactly as they appear in the file — all 338 lines, verbatim, from the `# jobsdata.ai Fact-Check Report — 2026-04-10` header through the final italicized methodology note at the bottom.