1	# AI Labor Research Digest — 2026-08-24
2	
3	## Summary
4	
5	This was a sparse week for *new* primary AI labor market research published strictly within the August 17–24, 2026 window. No Tier 1–2 papers with fresh quantitative AI-labor statistics were released during the period. The most significant development is that the **Brynjolfsson, Chandar & Chen "Canaries in the Coal Mine" August 2026 revision** (published August 12, five days before the window opened) received **major mainstream media attention this week** — including Washington Post and widely circulated social-media coverage on August 22–23 — making it the dominant signal of the digest period. The paper's headline finding is a **widening 19% employment shortfall** for workers aged 22–25 in AI-exposed occupations relative to less-exposed peers, strengthening the entry-level canary signal first documented in August 2025. A BLS Summer Youth Labor Force annual data release occurred on August 20 but contained no AI-specific statistics. The Challenger, Gray & Christmas July 2026 report (released August 6) confirmed AI as the leading stated reason for U.S. job cuts for the **fifth consecutive month**, at 24% of all 2026 cuts to date.
6	
7	---
8	
9	## Recurring Series Status
10	
11	**Registry sweep (as of 2026-08-24):** The registry contains one tracked series.
12	
13	| Series ID | Next Expected | Status |
14	|---|---|---|
15	| `ellucian-highered-ai` | 2027-03-01 | ✅ Not due — last ingested 2026-03-04 (3rd Annual Higher Ed AI Survey). No sweep required. |
16	
17	*No other series are currently registered. The following commonly-monitored series — Challenger Report, Census BTOS, BLS Employment Situation, Stanford AI Index, Anthropic Economic Index, Yale Budget Lab tracker, PwC Barometer, IMF Staff Notes — are **not yet in the registry** and were checked opportunistically during this sweep (see new source entries below).*
18	
19	---
20	
21	## Watchlist Researcher Checks
22	
23	All 15 watchlist researchers have `lastChecked: 2026-04-14` — more than 30 days ago. Searches were run for all.
24	
25	**Finds this sweep:**
26	
27	| Researcher | Affiliation | Find |
28	|---|---|---|
29	| **Erik Brynjolfsson** | Stanford DEL | ✅ NEW — "Canaries in the Coal Mine?" revised August 12, 2026 (see full entry below) |
30	| **Bharat Chandar** | Stanford DEL | ✅ Same paper (co-author) |
31	| David Deming | Harvard/NBER | ❌ No new publications found in sweep window |
32	| Daron Acemoglu | MIT | ❌ No new publications found |
33	| Martha Gimbel | Yale Budget Lab | ❌ No new publications found |
34	| Jed Kolko | PIIE | ❌ No new publications found |
35	| Pascual Restrepo | Yale | ❌ No new publications found |
36	| All others | Various | ❌ No new publications found |
37	
38	---
39	
40	## New Sources
41	
42	---
43	
44	### [WATCHLIST] Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (Revised August 2026)
45	
46	- **Publisher:** Stanford Digital Economy Lab
47	- **Date:** 2026-08-12 *(paper); mainstream media coverage August 22–23, 2026 — within digest window)*
48	- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
49	- **PDF:** https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
50	- **Evidence Tier:** 2 (Stanford DEL working paper; administrative payroll microdata from ADP, the largest U.S. payroll processor; peer-reviewed methodology; not yet formally peer-reviewed as journal article)
51	- **Source ID:** stanford-del-canaries-2026-aug
52	- **Watchlist:** Erik Brynjolfsson, Bharat Chandar
53	
54	**Context:** This is the second major revision of the "Canaries" paper (original August 2025; February 2026 update; this August 2026 update). Data now run through **June 2026**, adding ~9 months of additional payroll records. The paper gained the widest mainstream attention to date this week, with the Washington Post and Slashdot running coverage on August 22–23, 2026. Authors frame findings as **descriptive, not causal** — alternative explanations (interest rates, remote work, pandemic over-hiring) are controlled for but not fully excluded.
55	
56	**Statistics:**
57	
58	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
59	   **Type:** OVERLAY (neutral — no aggregate displacement signal)
60	   **Value:** 0 % (no economywide displacement detected)
61	   **Quote:** "We find no evidence of widespread, economy-wide job displacement."
62	   **Note:** Neutral overlay — the 19% entry-level gap has NOT propagated to aggregate employment statistics.
63	
64	2. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
65	   **Type:** OVERLAY (up — early-career displacement signal strengthening)
66	   **Value:** −19 % (employment shortfall, ages 22–25, most AI-exposed quintiles vs. less-exposed peers, as of June 2026)
67	   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
68	   **Note:** This is a **measured employment gap**, not a forecast. The figure widened from 15% (July 2025 vintage) to 19% (June 2026). The direction of overlay is UP (metric will exceed current graph consensus) because this demonstrates real early-career displacement is accumulating.
69	
70	3. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
71	   **Type:** OVERLAY (up)
72	   **Value:** −11 % (absolute employment level decline, most-exposed quintiles, ages 22–25, Nov 2022 → Jun 2026)
73	   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
74	   **Note:** The 21-percentage-point divergence in levels (−11% vs. +10%) provides the clearest absolute magnitude of the entry-level gap.
75	
76	4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
77	   **Type:** OVERLAY (neutral)
78	   **Value:** 0 % (no base-pay compression detected to date)
79	   **Quote:** "Adjustment is occurring through employment rather than base compensation."
80	   **Note:** Wages (base pay) are **not yet declining** for young AI-exposed workers; the adjustment channel is entirely on the employment side. This contradicts the Apollo wage-compression finding (see below) and warrants monitoring.
81	
82	5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
83	   **Type:** OVERLAY (up)
84	   **Value:** ~20 % (software developer employment, ages 22–25, informal reference in blog post)
85	   **Quote:** "20% ↓ for 22–25 y/o software developers since late 2022" (from January 2026 conference slide deck)
86	   **Note:** Software developers were used as an illustrative example. This is consistent with the broader 19% figure but is occupation-specific.
87	
88	6. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
89	   **Type:** OVERLAY (up — automative vs. augmentative split matters)
90	   **Value:** n/a (directional)
91	   **Quote:** "Declines are concentrated in occupations where AI usage primarily substitutes for human tasks; where usage primarily complements workers, employment is flat or rising, especially for experienced workers."
92	   **Note:** Anthropic Economic Index automative/augmentative classification drives the occupation-level employment divergence. Augmentation-heavy roles show employment growth.
93	
94	---
95	
96	### [WATCHLIST-ADJACENT / NEAR-WINDOW] Challenger Gray & Christmas Job Cut Announcement Report — July 2026
97	
98	- **Publisher:** Challenger, Gray & Christmas
99	- **Date:** 2026-08-06 *(11 days before window; included as most recent Challenger update)*
100	- **URL:** https://www.challengergray.com/blog/challenger-report-layoffs-fall-hiring-picks-up-ai-leads-for-fifth-straight-month/
101	- **PDF:** https://www.challengergray.com/wp-content/uploads/2026/08/Challenger-Report-July-2026.pdf
102	- **Evidence Tier:** 2 (proprietary tracking of announced U.S. employer job cuts; Challenger has tracked this since the 1980s; not peer-reviewed; measures announced intentions, not confirmed layoffs)
103	- **Source ID:** challenger-job-cuts-jul2026
104	
105	**Statistics:**
106	
107	1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
108	   **Type:** OVERLAY (up)
109	   **Value:** 24 % (share of all 2026 U.S. job cuts citing AI as reason, year-to-date through July)
110	   **Quote:** "So far this year, AI has been cited in 112,713 job cut announcements, approximately 24% of all cuts. Since 2023, when AI was first tracked as a distinct reason, it has been cited in 184,538 job cut announcements."
111	   **Note:** This signal does not map perfectly to the S&P 500 earnings-call slug (which measures verbal mentions, not actual cuts). It is placed here as the closest available signal-only chart. Value represents cumulative 2026 YTD share.
112	
113	2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
114	   **Type:** OVERLAY (up)
115	   **Value:** 149,023 announced cuts in tech YTD 2026 (not a % of jobs displaced, so → overlay only)
116	   **Quote:** "Technology again led all sectors, announcing 9,867 job cuts in July for a total of 149,023 in 2026. That is an increase of 67% from the 89,251 cuts announced in this sector through July 2025. Technology now accounts for 31% of all job cuts announced this year."
117	   **Note:** Cannot map as data_point (raw headcount, not % of tech jobs displaced). Direction is clearly up vs. 2025 baseline.
118	
119	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
120	   **Type:** OVERLAY (neutral)
121	   **Value:** −41 % (YTD 2026 total cuts vs. YTD 2025 — cuts are FALLING overall)
122	   **Quote:** "Through July, employers have announced 477,033 job cuts, down 41% from the 806,383 cuts announced in the first seven months of 2025. [...] 'Hiring has also increased over last year by 25%, so while AI is shifting the labor market, it is not dismantling it,' said Andy Challenger."
123	   **Note:** Aggregate cuts are declining YoY (due to 2025 federal government/DOGE distortion). The neutral overlay reflects the mixed picture: AI-attributed cuts rising in percentage share even as total cuts fall.
124	
125	---
126	
127	### [NEAR-WINDOW] What Is Really Happening to Jobs? Separating AI Hype from Reality — SIEPR Policy Brief
128	
129	- **Publisher:** Stanford Institute for Economic Policy Research (SIEPR)
130	- **Date:** 2026-07-01 *(July 2026)*
131	- **URL:** https://siepr.stanford.edu/publications/policy-brief/what-really-happening-jobs-separating-ai-hype-reality
132	- **Evidence Tier:** 2 (think-tank policy synthesis by former BLS Commissioner Erika McEntarfer and SIEPR Director Neale Mahoney; synthesizes multiple Tier 1 sources)
133	- **Source ID:** siepr-ai-jobs-hype-reality-2026
134	
135	**Statistics:**
136	
137	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
138	   **Type:** OVERLAY (neutral)
139	   **Value:** +0.77 pp (unemployment rate increase for most AI-exposed workers since 2022, vs. +0.85 pp for least-exposed)
140	   **Quote:** "The unemployment rate for the top quintile of AI-exposed workers has risen by 0.77 percentage points since 2022, while the unemployment rate for the least-exposed workers rose slightly more, by 0.85 percentage points over the same period."
141	   **Note:** Source: IPUMS-CPS data, updating Eckhardt and Goldschlag (2025). The near-identical rise across exposure quintiles indicates **no differential AI displacement signal in aggregate unemployment data** to date.
142	
143	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
144	   **Type:** OVERLAY (down — firms with AI show employment growth, counter-displacement signal)
145	   **Value:** +10 % (employment growth at AI-adopting firms in two years following adoption)
146	   **Quote:** "Among firms that adopted enterprise AI, employment grew by 10 percent in the two years following adoption, an effect driven by firms with the highest per capita AI spending." *(citing Kharazian, Simon & Stevens, Ramp Economics Lab, June 2026)*
147	   **Note:** This is Ramp platform data (not a nationally representative sample), but directionally important.
148	
149	3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
150	   **Type:** DATA_POINT
151	   **Value:** 40 % (U.S. employed adults using AI at work, nationally representative household survey)
152	   **Quote:** "A nationally representative survey of households finds that over 40 percent of employed respondents use AI at work."
153	   **Note:** Source cited as a nationally representative household survey (consistent with RTPS/Bick-Blandin-Deming and Hartley et al. estimates in the 35–40% range for late 2025/early 2026). Corroborates existing graph range. Midpoint figure; exact survey date unclear.
154	
155	4. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
156	   **Type:** OVERLAY (neutral/up)
157	   **Value:** 5.6 % (unemployment rate for recent college graduates in early 2026, up 1.6 pp from three years earlier)
158	   **Quote:** "Recent graduates are facing the most challenging job market in years, with unemployment rates for new grads reaching 5.6 percent in early 2026, up 1.6 percentage points from three years earlier."
159	   **Note:** Source: Federal Reserve Bank of New York Labor Market for Recent College Graduates, 2026 Q1. This is a proxy for entry-level white-collar/tech displacement (not the same as tech-sector-displacement but relevant as an observed signal).
160	
161	---
162	
163	### [BACKGROUND — OUTSIDE WINDOW, FLAGGED FOR REGISTRY] The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
164	
165	- **Publisher:** U.S. Census Bureau, Center for Economic Studies
166	- **Date:** 2026-04-15
167	- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
168	- **Evidence Tier:** 1 (U.S. Census Bureau working paper; uses 2026 AI supplement to the nationally representative BTOS; government statistics)
169	- **Source ID:** census-btos-microstructure-2026
170	
171	**Note:** Published April 15, 2026. Outside the 7-day window and also outside the 30-day lookback. Included here because (a) no Census BTOS series is currently in the recurring registry and (b) this is the most current BTOS-based AI diffusion paper. **Recommend adding census-btos as a recurring series.**
172	
173	**Statistics:**
174	
175	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
176	   **Type:** DATA_POINT
177	   **Value:** 18 % (share of U.S. firms using AI in a business function, Nov 2025–Jan 2026 reference period, unweighted)
178	   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
179	   **Note:** This is the most rigorous current government estimate of firm-level AI adoption. The employment-weighted figure (32%) is more relevant for labor market impact. Consistent with Fed note finding ~18% at end of 2025.
180	
181	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
182	   **Type:** OVERLAY (up — sector concentration)
183	   **Value:** 50–60 % (AI use rate among very large firms in Information, Professional Services, Finance — employment-weighted 60–70%)
184	   **Quote:** "AI use is substantially higher in large firms and knowledge-intensive sectors, with use rates reaching 50%-60% (60%-70%, employment-weighted) for very large firms in the Information, Professional Services, and Finance sectors."
185	
186	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
187	   **Type:** OVERLAY (down — labor displacement is rare among adopters)
188	   **Value:** 2 % (share of AI-using firms reporting AI-related employment decreases)
189	   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
190	
191	4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
192	   **Type:** OVERLAY (up)
193	   **Value:** 23 % (share of firms where workers use AI in work-related tasks, unweighted; 41% employment-weighted)
194	   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks."
195	
196	---
197	
198	### [BACKGROUND — OUTSIDE WINDOW] PwC 2026 Global AI Jobs Barometer
199	
200	- **Publisher:** PwC
201	- **Date:** 2026-06-15
202	- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
203	- **Evidence Tier:** 2 (major consulting firm; analysis of over 1 billion job ads in 27 countries; not peer-reviewed; global scope)
204	- **Source ID:** pwc-aijb-2026
205	
206	**Statistics:**
207	
208	1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
209	   **Type:** OVERLAY (up — global, not US-specific)
210	   **Value:** 62 % (wage premium for AI-skilled workers globally, up from 57%)
211	   **Quote:** "the average wage premium for workers with AI skills has climbed to 62%, up from 57" [last year]
212	   **Note:** Global figure; prior year value was 57%. Direction: up. Cannot be used as US data_point.
213	
214	2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
215	   **Type:** OVERLAY (up — global)
216	   **Value:** +42 % faster salary growth (professionalised roles vs. democratised roles)
217	   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."
218	
219	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
220	   **Type:** OVERLAY (up — AI-exposed entry roles require senior skills, driving up expected wages)
221	   **Value:** +35 % (job openings growth for 'seniorised' AI-exposed entry-level roles since 2019; −10% for other entry-level roles)
222	   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles shrank 10%." *(from 2.4 million U.S. entry-level job ads analyzed)*
223	   **Note:** US data from PwC's Lightcast analysis. Entry-level roles exposed to AI increasingly require senior skills (leadership, creativity), creating upward wage pressure for those who qualify — while suppressing openings for non-AI-ready entry candidates.
224	
225	4. **Graph:** Overall US Displacement (`overall-us-displacement`)
226	   **Type:** OVERLAY (down — AI-leading firms are hiring more, not less)
227	   **Value:** +52 % vs. +36 % (workforce growth since 2018: most AI-exposed companies vs. least AI-exposed)
228	   **Quote:** "The most AI-exposed companies recorded workforce growth of 52% since 2018, compared with 36% among less AI-intensive organisations, suggesting that successful AI deployment may be creating opportunities for expansion rather than workforce reduction."
229	   **Note:** Global company-level data (survivorship bias caveat noted by PwC). Direction is a counter-displacement signal.
230	
231	---
232	
233	## Sources Checked but Not Relevant to AI Labor Statistics
234	
235	The following URLs were fetched or searched and did not yield new, AI-labor-specific quantitative statistics within the 7-day window or were otherwise not usable:
236	
237	- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Qualitative framework paper; NBER paper cited is Manning & Aguirre (2026), not a new Aug 2026 release; no new quantitative stats beyond prior ingestions
238	- https://arxiv.org/html/2509.15265v1 — "AI and Jobs: A Review of Theory, Estimates, and Evidence" (preprint, Aug 11, 2026); review paper synthesizing existing literature; productivity RCT meta-range (20–60%) is an aggregated secondary figure, not a new primary measurement
239	- https://documents1.worldbank.org/curated/en/099827011182513988 — World Bank "Labor Demand in the Age of Generative AI" (WP 11263); uses data through 2025Q2; estimated publication ~Nov 2025. Key finding (12% decline in postings for high-substitutability occupations) warrants future ingestion but is not a new Aug 2026 release.
240	- https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ — ICLE review; not primary research; aggregates results from other papers already tracked
241	- https://ssrn.com/abstract=5842084 — Azar, Gine & Sanz-Espín "The Wage Effects of Generative AI" (Dec 2025 SSRN); finds "significant wage declines but no aggregate employment effects" — abstract only accessible; not new to this period
242	- https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed FEDS Note (April 3, 2026); synthesizes BTOS, RPS, SBU surveys; key stats are same as Census BTOS paper above
243	- https://www.brookings.edu/articles/research-on-ai-and-the-labor-market-is-still-in-the-first-inning/ — Jed Kolko/PIIE review article (date undetermined from search results; appears early 2026); qualitative synthesis, no new primary stats
244	- https://www.bls.gov/schedule/2026/08_sched.htm — BLS August 2026 releases within window: Summer Youth Labor Force (Aug 20), State Unemployment (Aug 21); neither release contains AI-specific statistics
245	- https://www.redstate.com (Apollo Global analysis) — Tier 4 source; Apollo wage-compression finding is referenced across Tier 3 sources (Forbes, WhereWeWork) but the original Apollo report is not publicly available with full methodology; cannot verify unit or methodology
246	- https://www.demandsage.com, https://axis-intelligence.com, https://www.designrush.com — Tier 3/4 statistical aggregator sites; statistics are secondary compilations from primary sources already tracked; no new primary findings
247	- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf — IMF SDN 2026/001 "New Jobs Creation in the AI Age" (Jaumotte et al.); publication date unclear from search; warrants full ingestion separately; not confirmed as new Aug 2026 release
248	- https://www.imf.org/-/media/files/publications/sdn/2024/english/sdnea2024001.pdf — IMF SDN 2024/001 (older paper); not new
249	
250	---
251	
252	## Priority Recommendations
253	
254	### Ingest Immediately
255	
256	1. **Brynjolfsson, Chandar & Chen "Canaries" Aug 2026 Revision** — Tier 2 WATCHLIST hit. The 19% employment shortfall for young workers in AI-exposed occupations is the single most-discussed AI labor market finding this week. Particularly important for `white-collar-professional-displacement` and `entry-level-wage-impact` overlays. Entry-level employment gap has widened from 15% (Jul 2025) to 19% (Jun 2026) — a **4-percentage-point widening in ~12 months** that is directionally significant.
257	
258	2. **Census BTOS CES-WP-26-25 "Microstructure of AI Diffusion"** — Tier 1 U.S. government data. The 18% (unweighted) / 32% (employment-weighted) firm AI adoption figure is the most rigorous current estimate for `ai-adoption-rate`. The "2% of firms report employment decreases from AI" finding is an important counter-displacement data point. **Recommend adding `census-btos` as a recurring series** (cadence: ~monthly, from btos.census.gov).
259	
260	3. **PwC 2026 Global AI Jobs Barometer** — Tier 2. The 62% AI skills wage premium and the "seniorised entry-level" finding (7× more likely to require senior skills; +35%/−10% job opening split) are the strongest wage-premium and entry-level-skills statistics available for 2026. Mark global figures as overlays.
261	
262	### Statistics That Diverge Significantly from Current Graph Consensus
263	
264	- **Canaries 19% entry-level gap** — If the current `white-collar-professional-displacement` graph consensus is in the 10–15% range, a **19% employment shortfall already observed** for young workers in AI-exposed roles represents a material upside signal worth flagging.
265	
266	- **Census BTOS: only 2% of firms report AI-driven employment decreases** — This is likely lower than current graph assumptions and should exert **downward pressure on `overall-us-displacement`** near-term estimates.
267	
268	- **Canaries: wages are NOT declining (employment is the adjustment channel)** — The Brynjolfsson finding that "adjustment is occurring through employment rather than base compensation" directly contradicts the Apollo wage-compression narrative. If the graph consensus for `entry-level-wage-impact` assumes wage declines are already occurring, this finding suggests the adjustment is via hiring suppression, not pay cuts. Both signals may ultimately converge, but the *mechanism* matters for graph timing.
269	
270	### Watchlist / Registry Updates Required
271	
272	- **Update `lastChecked` for all watchlist researchers** to 2026-08-24.
273	- **Add recurring series:** `census-btos` (biweekly, Census BTOS AI supplement), `challenger-report` (monthly, Challenger Gray & Christmas), and `stanford-canaries` (quarterly, Stanford DEL) to the recurring-sources.json registry to ensure consistent sweep coverage going forward.
274	
275	---
276	
277	*Digest prepared by AI Research Agent | Coverage window: 2026-08-17 to 2026-08-24 | All statistics extracted verbatim from source documents; no paraphrasing of numeric claims.*
# AI Labor Research Digest — 2026-08-24

## Summary

This was a sparse week for *new* primary AI labor market research published strictly within the August 17–24, 2026 window. No Tier 1–2 papers with fresh quantitative AI-labor statistics were released during the period. The most significant development is that the **Brynjolfsson, Chandar & Chen "Canaries in the Coal Mine" August 2026 revision** (published August 12, five days before the window opened) received **major mainstream media attention this week** — including Washington Post and widely circulated social-media coverage on August 22–23 — making it the dominant signal of the digest period. The paper's headline finding is a **widening 19% employment shortfall** for workers aged 22–25 in AI-exposed occupations relative to less-exposed peers, strengthening the entry-level canary signal first documented in August 2025. A BLS Summer Youth Labor Force annual data release occurred on August 20 but contained no AI-specific statistics. The Challenger, Gray & Christmas July 2026 report (released August 6) confirmed AI as the leading stated reason for U.S. job cuts for the **fifth consecutive month**, at 24% of all 2026 cuts to date.

---

## Recurring Series Status

**Registry sweep (as of 2026-08-24):** The registry contains one tracked series.

| Series ID | Next Expected | Status |
|---|---|---|
| `ellucian-highered-ai` | 2027-03-01 | ✅ Not due — last ingested 2026-03-04 (3rd Annual Higher Ed AI Survey). No sweep required. |

*No other series are currently registered. The following commonly-monitored series — Challenger Report, Census BTOS, BLS Employment Situation, Stanford AI Index, Anthropic Economic Index, Yale Budget Lab tracker, PwC Barometer, IMF Staff Notes — are **not yet in the registry** and were checked opportunistically during this sweep (see new source entries below).*

---

## Watchlist Researcher Checks

All 15 watchlist researchers have `lastChecked: 2026-04-14` — more than 30 days ago. Searches were run for all.

**Finds this sweep:**

| Researcher | Affiliation | Find |
|---|---|---|
| **Erik Brynjolfsson** | Stanford DEL | ✅ NEW — "Canaries in the Coal Mine?" revised August 12, 2026 (see full entry below) |
| **Bharat Chandar** | Stanford DEL | ✅ Same paper (co-author) |
| David Deming | Harvard/NBER | ❌ No new publications found in sweep window |
| Daron Acemoglu | MIT | ❌ No new publications found |
| Martha Gimbel | Yale Budget Lab | ❌ No new publications found |
| Jed Kolko | PIIE | ❌ No new publications found |
| Pascual Restrepo | Yale | ❌ No new publications found |
| All others | Various | ❌ No new publications found |

---

## New Sources

---

### [WATCHLIST] Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (Revised August 2026)

- **Publisher:** Stanford Digital Economy Lab
- **Date:** 2026-08-12 *(paper); mainstream media coverage August 22–23, 2026 — within digest window)*
- **URL:** https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/
- **PDF:** https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
- **Evidence Tier:** 2 (Stanford DEL working paper; administrative payroll microdata from ADP, the largest U.S. payroll processor; peer-reviewed methodology; not yet formally peer-reviewed as journal article)
- **Source ID:** stanford-del-canaries-2026-aug
- **Watchlist:** Erik Brynjolfsson, Bharat Chandar

**Context:** This is the second major revision of the "Canaries" paper (original August 2025; February 2026 update; this August 2026 update). Data now run through **June 2026**, adding ~9 months of additional payroll records. The paper gained the widest mainstream attention to date this week, with the Washington Post and Slashdot running coverage on August 22–23, 2026. Authors frame findings as **descriptive, not causal** — alternative explanations (interest rates, remote work, pandemic over-hiring) are controlled for but not fully excluded.

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral — no aggregate displacement signal)
   **Value:** 0 % (no economywide displacement detected)
   **Quote:** "We find no evidence of widespread, economy-wide job displacement."
   **Note:** Neutral overlay — the 19% entry-level gap has NOT propagated to aggregate employment statistics.

2. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up — early-career displacement signal strengthening)
   **Value:** −19 % (employment shortfall, ages 22–25, most AI-exposed quintiles vs. less-exposed peers, as of June 2026)
   **Quote:** "employment of young workers (ages 22–25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap."
   **Note:** This is a **measured employment gap**, not a forecast. The figure widened from 15% (July 2025 vintage) to 19% (June 2026). The direction of overlay is UP (metric will exceed current graph consensus) because this demonstrates real early-career displacement is accumulating.

3. **Graph:** White-Collar / Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −11 % (absolute employment level decline, most-exposed quintiles, ages 22–25, Nov 2022 → Jun 2026)
   **Quote:** "In levels, employment of workers ages 22–25 in the two most exposed quintiles fell about 11% between November 2022 and June 2026, while employment of the same age group in the three least-exposed quintiles grew about 10%."
   **Note:** The 21-percentage-point divergence in levels (−11% vs. +10%) provides the clearest absolute magnitude of the entry-level gap.

4. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 % (no base-pay compression detected to date)
   **Quote:** "Adjustment is occurring through employment rather than base compensation."
   **Note:** Wages (base pay) are **not yet declining** for young AI-exposed workers; the adjustment channel is entirely on the employment side. This contradicts the Apollo wage-compression finding (see below) and warrants monitoring.

5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** ~20 % (software developer employment, ages 22–25, informal reference in blog post)
   **Quote:** "20% ↓ for 22–25 y/o software developers since late 2022" (from January 2026 conference slide deck)
   **Note:** Software developers were used as an illustrative example. This is consistent with the broader 19% figure but is occupation-specific.

6. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up — automative vs. augmentative split matters)
   **Value:** n/a (directional)
   **Quote:** "Declines are concentrated in occupations where AI usage primarily substitutes for human tasks; where usage primarily complements workers, employment is flat or rising, especially for experienced workers."
   **Note:** Anthropic Economic Index automative/augmentative classification drives the occupation-level employment divergence. Augmentation-heavy roles show employment growth.

---

### [WATCHLIST-ADJACENT / NEAR-WINDOW] Challenger Gray & Christmas Job Cut Announcement Report — July 2026

- **Publisher:** Challenger, Gray & Christmas
- **Date:** 2026-08-06 *(11 days before window; included as most recent Challenger update)*
- **URL:** https://www.challengergray.com/blog/challenger-report-layoffs-fall-hiring-picks-up-ai-leads-for-fifth-straight-month/
- **PDF:** https://www.challengergray.com/wp-content/uploads/2026/08/Challenger-Report-July-2026.pdf
- **Evidence Tier:** 2 (proprietary tracking of announced U.S. employer job cuts; Challenger has tracked this since the 1980s; not peer-reviewed; measures announced intentions, not confirmed layoffs)
- **Source ID:** challenger-job-cuts-jul2026

**Statistics:**

1. **Graph:** Earnings Call AI Mentions (`earnings-call-ai-mentions`)
   **Type:** OVERLAY (up)
   **Value:** 24 % (share of all 2026 U.S. job cuts citing AI as reason, year-to-date through July)
   **Quote:** "So far this year, AI has been cited in 112,713 job cut announcements, approximately 24% of all cuts. Since 2023, when AI was first tracked as a distinct reason, it has been cited in 184,538 job cut announcements."
   **Note:** This signal does not map perfectly to the S&P 500 earnings-call slug (which measures verbal mentions, not actual cuts). It is placed here as the closest available signal-only chart. Value represents cumulative 2026 YTD share.

2. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 149,023 announced cuts in tech YTD 2026 (not a % of jobs displaced, so → overlay only)
   **Quote:** "Technology again led all sectors, announcing 9,867 job cuts in July for a total of 149,023 in 2026. That is an increase of 67% from the 89,251 cuts announced in this sector through July 2025. Technology now accounts for 31% of all job cuts announced this year."
   **Note:** Cannot map as data_point (raw headcount, not % of tech jobs displaced). Direction is clearly up vs. 2025 baseline.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** −41 % (YTD 2026 total cuts vs. YTD 2025 — cuts are FALLING overall)
   **Quote:** "Through July, employers have announced 477,033 job cuts, down 41% from the 806,383 cuts announced in the first seven months of 2025. [...] 'Hiring has also increased over last year by 25%, so while AI is shifting the labor market, it is not dismantling it,' said Andy Challenger."
   **Note:** Aggregate cuts are declining YoY (due to 2025 federal government/DOGE distortion). The neutral overlay reflects the mixed picture: AI-attributed cuts rising in percentage share even as total cuts fall.

---

### [NEAR-WINDOW] What Is Really Happening to Jobs? Separating AI Hype from Reality — SIEPR Policy Brief

- **Publisher:** Stanford Institute for Economic Policy Research (SIEPR)
- **Date:** 2026-07-01 *(July 2026)*
- **URL:** https://siepr.stanford.edu/publications/policy-brief/what-really-happening-jobs-separating-ai-hype-reality
- **Evidence Tier:** 2 (think-tank policy synthesis by former BLS Commissioner Erika McEntarfer and SIEPR Director Neale Mahoney; synthesizes multiple Tier 1 sources)
- **Source ID:** siepr-ai-jobs-hype-reality-2026

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** +0.77 pp (unemployment rate increase for most AI-exposed workers since 2022, vs. +0.85 pp for least-exposed)
   **Quote:** "The unemployment rate for the top quintile of AI-exposed workers has risen by 0.77 percentage points since 2022, while the unemployment rate for the least-exposed workers rose slightly more, by 0.85 percentage points over the same period."
   **Note:** Source: IPUMS-CPS data, updating Eckhardt and Goldschlag (2025). The near-identical rise across exposure quintiles indicates **no differential AI displacement signal in aggregate unemployment data** to date.

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — firms with AI show employment growth, counter-displacement signal)
   **Value:** +10 % (employment growth at AI-adopting firms in two years following adoption)
   **Quote:** "Among firms that adopted enterprise AI, employment grew by 10 percent in the two years following adoption, an effect driven by firms with the highest per capita AI spending." *(citing Kharazian, Simon & Stevens, Ramp Economics Lab, June 2026)*
   **Note:** This is Ramp platform data (not a nationally representative sample), but directionally important.

3. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 40 % (U.S. employed adults using AI at work, nationally representative household survey)
   **Quote:** "A nationally representative survey of households finds that over 40 percent of employed respondents use AI at work."
   **Note:** Source cited as a nationally representative household survey (consistent with RTPS/Bick-Blandin-Deming and Hartley et al. estimates in the 35–40% range for late 2025/early 2026). Corroborates existing graph range. Midpoint figure; exact survey date unclear.

4. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (neutral/up)
   **Value:** 5.6 % (unemployment rate for recent college graduates in early 2026, up 1.6 pp from three years earlier)
   **Quote:** "Recent graduates are facing the most challenging job market in years, with unemployment rates for new grads reaching 5.6 percent in early 2026, up 1.6 percentage points from three years earlier."
   **Note:** Source: Federal Reserve Bank of New York Labor Market for Recent College Graduates, 2026 Q1. This is a proxy for entry-level white-collar/tech displacement (not the same as tech-sector-displacement but relevant as an observed signal).

---

### [BACKGROUND — OUTSIDE WINDOW, FLAGGED FOR REGISTRY] The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks

- **Publisher:** U.S. Census Bureau, Center for Economic Studies
- **Date:** 2026-04-15
- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
- **Evidence Tier:** 1 (U.S. Census Bureau working paper; uses 2026 AI supplement to the nationally representative BTOS; government statistics)
- **Source ID:** census-btos-microstructure-2026

**Note:** Published April 15, 2026. Outside the 7-day window and also outside the 30-day lookback. Included here because (a) no Census BTOS series is currently in the recurring registry and (b) this is the most current BTOS-based AI diffusion paper. **Recommend adding census-btos as a recurring series.**

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % (share of U.S. firms using AI in a business function, Nov 2025–Jan 2026 reference period, unweighted)
   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
   **Note:** This is the most rigorous current government estimate of firm-level AI adoption. The employment-weighted figure (32%) is more relevant for labor market impact. Consistent with Fed note finding ~18% at end of 2025.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up — sector concentration)
   **Value:** 50–60 % (AI use rate among very large firms in Information, Professional Services, Finance — employment-weighted 60–70%)
   **Quote:** "AI use is substantially higher in large firms and knowledge-intensive sectors, with use rates reaching 50%-60% (60%-70%, employment-weighted) for very large firms in the Information, Professional Services, and Finance sectors."

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — labor displacement is rare among adopters)
   **Value:** 2 % (share of AI-using firms reporting AI-related employment decreases)
   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."

4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (up)
   **Value:** 23 % (share of firms where workers use AI in work-related tasks, unweighted; 41% employment-weighted)
   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks."

---

### [BACKGROUND — OUTSIDE WINDOW] PwC 2026 Global AI Jobs Barometer

- **Publisher:** PwC
- **Date:** 2026-06-15
- **URL:** https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
- **Evidence Tier:** 2 (major consulting firm; analysis of over 1 billion job ads in 27 countries; not peer-reviewed; global scope)
- **Source ID:** pwc-aijb-2026

**Statistics:**

1. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up — global, not US-specific)
   **Value:** 62 % (wage premium for AI-skilled workers globally, up from 57%)
   **Quote:** "the average wage premium for workers with AI skills has climbed to 62%, up from 57" [last year]
   **Note:** Global figure; prior year value was 57%. Direction: up. Cannot be used as US data_point.

2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up — global)
   **Value:** +42 % faster salary growth (professionalised roles vs. democratised roles)
   **Quote:** "'Professionalised' roles (such as radiologists or recruiters) are seeing twice the growth in available jobs and 42% faster salary growth than those categorised as 'democratised' (such as IT service managers or medical secretaries)."

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (up — AI-exposed entry roles require senior skills, driving up expected wages)
   **Value:** +35 % (job openings growth for 'seniorised' AI-exposed entry-level roles since 2019; −10% for other entry-level roles)
   **Quote:** "Job openings for these 'seniorised' entry-level roles have grown 35% since 2019, while other entry-level roles shrank 10%." *(from 2.4 million U.S. entry-level job ads analyzed)*
   **Note:** US data from PwC's Lightcast analysis. Entry-level roles exposed to AI increasingly require senior skills (leadership, creativity), creating upward wage pressure for those who qualify — while suppressing openings for non-AI-ready entry candidates.

4. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — AI-leading firms are hiring more, not less)
   **Value:** +52 % vs. +36 % (workforce growth since 2018: most AI-exposed companies vs. least AI-exposed)
   **Quote:** "The most AI-exposed companies recorded workforce growth of 52% since 2018, compared with 36% among less AI-intensive organisations, suggesting that successful AI deployment may be creating opportunities for expansion rather than workforce reduction."
   **Note:** Global company-level data (survivorship bias caveat noted by PwC). Direction is a counter-displacement signal.

---

## Sources Checked but Not Relevant to AI Labor Statistics

The following URLs were fetched or searched and did not yield new, AI-labor-specific quantitative statistics within the 7-day window or were otherwise not usable:

- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Qualitative framework paper; NBER paper cited is Manning & Aguirre (2026), not a new Aug 2026 release; no new quantitative stats beyond prior ingestions
- https://arxiv.org/html/2509.15265v1 — "AI and Jobs: A Review of Theory, Estimates, and Evidence" (preprint, Aug 11, 2026); review paper synthesizing existing literature; productivity RCT meta-range (20–60%) is an aggregated secondary figure, not a new primary measurement
- https://documents1.worldbank.org/curated/en/099827011182513988 — World Bank "Labor Demand in the Age of Generative AI" (WP 11263); uses data through 2025Q2; estimated publication ~Nov 2025. Key finding (12% decline in postings for high-substitutability occupations) warrants future ingestion but is not a new Aug 2026 release.
- https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ — ICLE review; not primary research; aggregates results from other papers already tracked
- https://ssrn.com/abstract=5842084 — Azar, Gine & Sanz-Espín "The Wage Effects of Generative AI" (Dec 2025 SSRN); finds "significant wage declines but no aggregate employment effects" — abstract only accessible; not new to this period
- https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed FEDS Note (April 3, 2026); synthesizes BTOS, RPS, SBU surveys; key stats are same as Census BTOS paper above
- https://www.brookings.edu/articles/research-on-ai-and-the-labor-market-is-still-in-the-first-inning/ — Jed Kolko/PIIE review article (date undetermined from search results; appears early 2026); qualitative synthesis, no new primary stats
- https://www.bls.gov/schedule/2026/08_sched.htm — BLS August 2026 releases within window: Summer Youth Labor Force (Aug 20), State Unemployment (Aug 21); neither release contains AI-specific statistics
- https://www.redstate.com (Apollo Global analysis) — Tier 4 source; Apollo wage-compression finding is referenced across Tier 3 sources (Forbes, WhereWeWork) but the original Apollo report is not publicly available with full methodology; cannot verify unit or methodology
- https://www.demandsage.com, https://axis-intelligence.com, https://www.designrush.com — Tier 3/4 statistical aggregator sites; statistics are secondary compilations from primary sources already tracked; no new primary findings
- https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf — IMF SDN 2026/001 "New Jobs Creation in the AI Age" (Jaumotte et al.); publication date unclear from search; warrants full ingestion separately; not confirmed as new Aug 2026 release
- https://www.imf.org/-/media/files/publications/sdn/2024/english/sdnea2024001.pdf — IMF SDN 2024/001 (older paper); not new

---

## Priority Recommendations

### Ingest Immediately

1. **Brynjolfsson, Chandar & Chen "Canaries" Aug 2026 Revision** — Tier 2 WATCHLIST hit. The 19% employment shortfall for young workers in AI-exposed occupations is the single most-discussed AI labor market finding this week. Particularly important for `white-collar-professional-displacement` and `entry-level-wage-impact` overlays. Entry-level employment gap has widened from 15% (Jul 2025) to 19% (Jun 2026) — a **4-percentage-point widening in ~12 months** that is directionally significant.

2. **Census BTOS CES-WP-26-25 "Microstructure of AI Diffusion"** — Tier 1 U.S. government data. The 18% (unweighted) / 32% (employment-weighted) firm AI adoption figure is the most rigorous current estimate for `ai-adoption-rate`. The "2% of firms report employment decreases from AI" finding is an important counter-displacement data point. **Recommend adding `census-btos` as a recurring series** (cadence: ~monthly, from btos.census.gov).

3. **PwC 2026 Global AI Jobs Barometer** — Tier 2. The 62% AI skills wage premium and the "seniorised entry-level" finding (7× more likely to require senior skills; +35%/−10% job opening split) are the strongest wage-premium and entry-level-skills statistics available for 2026. Mark global figures as overlays.

### Statistics That Diverge Significantly from Current Graph Consensus

- **Canaries 19% entry-level gap** — If the current `white-collar-professional-displacement` graph consensus is in the 10–15% range, a **19% employment shortfall already observed** for young workers in AI-exposed roles represents a material upside signal worth flagging.

- **Census BTOS: only 2% of firms report AI-driven employment decreases** — This is likely lower than current graph assumptions and should exert **downward pressure on `overall-us-displacement`** near-term estimates.

- **Canaries: wages are NOT declining (employment is the adjustment channel)** — The Brynjolfsson finding that "adjustment is occurring through employment rather than base compensation" directly contradicts the Apollo wage-compression narrative. If the graph consensus for `entry-level-wage-impact` assumes wage declines are already occurring, this finding suggests the adjustment is via hiring suppression, not pay cuts. Both signals may ultimately converge, but the *mechanism* matters for graph timing.

### Watchlist / Registry Updates Required

- **Update `lastChecked` for all watchlist researchers** to 2026-08-24.
- **Add recurring series:** `census-btos` (biweekly, Census BTOS AI supplement), `challenger-report` (monthly, Challenger Gray & Christmas), and `stanford-canaries` (quarterly, Stanford DEL) to the recurring-sources.json registry to ensure consistent sweep coverage going forward.

---

*Digest prepared by AI Research Agent | Coverage window: 2026-08-17 to 2026-08-24 | All statistics extracted verbatim from source documents; no paraphrasing of numeric claims.*