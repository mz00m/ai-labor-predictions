1	# AI Labor Research Digest — 2026-06-01
2	
3	## Summary
4	
5	An exhaustive search across 8+ targeted queries and >20 source fetches found **one Tier 1 source published within the May 25–June 1, 2026 window**: the U.S. Census Bureau's *America Counts* story "AI Use at U.S. Businesses" (May 26, 2026), drawing on BTOS biweekly panel data through May 3, 2026. Its headline finding — that 19.8% of all U.S. businesses used AI in a business function as of early May 2026, up from the 17–20% range since December 2025 — is a direct, nationally representative data point for the `ai-adoption-rate` graph. One additional Tier 2 source from just outside the window (Budget Lab at Yale, May 7, 2026) provides a rigorous null-effect causal estimate on employment and wages through Q1 2026, useful as a calibrating overlay. No new peer-reviewed papers on displacement magnitudes, wage effects, or sector-specific automation rates were published in this 7-day window.
6	
7	---
8	
9	## New Sources
10	
11	### AI Use at U.S. Businesses
12	
13	- **Publisher:** U.S. Census Bureau (America Counts story series)
14	- **Date:** 2026-05-26
15	- **URL:** https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
16	- **Evidence Tier:** 1 (U.S. government — nationally representative Business Trends and Outlook Survey, ~1.2M businesses, biweekly panel)
17	- **Source ID:** census-btos-ai-adoption-2026
18	
19	**Context:** The BTOS added an AI supplement in November 2025, asking firms whether they "used AI in any business function" in the prior two weeks. This story synthesizes the six months of data collected from December 14, 2025, through May 3, 2026. It is the most current, nationally representative time-series on firm-level AI adoption in the U.S. Authors: Adam Grundy, Cory Breaux, Dhanapati Khatiwoda.
20	
21	**Statistics:**
22	
23	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
24	   **Type:** DATA_POINT
25	   **Value:** 19.8 % of US firms using AI (Census BTOS, as of May 3, 2026 data collection period)
26	   **Quote:** "As of May 3, 2026, the AI use rates in the Information (39.7%) and Finance and Insurance (33.9%) sectors were both higher than the national rate (19.8%)"
27	
28	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
29	   **Type:** OVERLAY (up)
30	   **Value:** 18.5 % (midpoint of stated range, Dec 2025–May 2026 trend)
31	   **Quote:** "The BTOS data (December 2025 to May 2026) show that overall AI usage hovered between 17% and 20% — and that between 20% and 23% of businesses expected to be using it in the next six months."
32	   **Note:** Forward-looking indicator implies the adoption rate trajectory is rising; the 20–23% expected-use figure provides a near-term ceiling estimate and supports an upward directional overlay.
33	
34	3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
35	   **Type:** OVERLAY (up)
36	   **Value:** 37 % (large firms, 250+ employees, as of May 2026)
37	   **Quote:** "37% of firms with at least 250 employees reported using AI in their business operations."
38	   **Note:** Substantial concentration effect — large firms are nearly 2× the national average. Supports upward pressure on employment-weighted adoption (consistent with earlier Census CES-WP-26-25 finding of 32% on an employment-weighted basis).
39	
40	4. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
41	   **Type:** OVERLAY (up)
42	   **Value:** 32 % (mid-size firms, 100–249 employees, as of May 2026)
43	   **Quote:** "In the data collection period ending May 3, 2026, 32% of firms with 100 to 249 employees said they used AI."
44	
45	5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
46	   **Type:** OVERLAY (neutral)
47	   **Value:** 39.7 % (Information sector firms using AI)
48	   **Quote:** "As of May 3, 2026, the AI use rates in the Information (39.7%) and Finance and Insurance (33.9%) sectors were both higher than the national rate (19.8%) but neither reported significant shifts since December."
49	   **Note:** High adoption in the Information sector is consistent with displacement risk narratives for tech roles, but the "no significant shift since December" qualifier means this is an exposure/adoption measure, not a displacement measure. Classify as overlay (neutral) on tech displacement — high adoption does not confirm proportional job loss.
50	
51	6. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
52	   **Type:** OVERLAY (up)
53	   **Value:** ~14 % (Retail Trade sector firms using AI — well below national average)
54	   **Quote:** "businesses in the Retail Trade sector reported current and expected usage lower than the national average: around 14% of businesses currently use AI, and about 17% expect to in the next six months."
55	   **Note:** Retail lagging signals that customer-facing automation may be less advanced than forecast models imply; directional overlay is neutral-to-down for retail-specific exposure projections.
56	
57	---
58	
59	### What We Do and Don't Know About How AI Is Affecting the Labor Market
60	
61	> **Note:** Published May 7, 2026 — **18 days before** the 7-day window opens. Included here as a high-priority recently published source that may not yet be in the digest database and is directly relevant to multiple graph series.
62	
63	- **Publisher:** The Budget Lab at Yale University
64	- **Date:** 2026-05-07
65	- **URL:** https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market
66	- **Evidence Tier:** 2 (major nonpartisan policy think tank; uses CPS microdata and synthetic differences-in-differences econometrics)
67	- **Source ID:** budgetlab-yale-sdid-ai-effects-2026
68	
69	**Context:** Authors Martha Gimbel, Joshua Kendall, and Ryan Nunn apply a synthetic differences-in-differences (SDID) design to CPS data through Q1 2026 to estimate causal effects of AI exposure on employment shares and real wages. This is a significant methodological upgrade over earlier exposure-correlation studies. The paper explicitly acknowledges the design may miss narrow-group effects (e.g., 22–27-year-old new graduates) due to CPS sample size constraints.
70	
71	**Statistics:**
72	
73	7. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`)
74	   **Type:** OVERLAY (down)
75	   **Value:** 0 (no statistically significant employment share decline detected through Q1 2026)
76	   **Quote:** "Using an approach called synthetic differences-in-differences (SDID) that addresses these challenges, we generally find no statistically or economically significant effects as of yet. Specifically, we examine the employment and wages of AI-exposed and unexposed occupations… No impact is evident through the post-2022 time window."
77	   **Note:** The point estimate "in that quarter is virtually zero" for employment share. The 95% CI upper bound is ~5% of the average exposed occupation's employment share — i.e., displacement, if any, remains within noise. This calibrates downward pressure on near-term displacement projections.
78	
79	8. **Graph:** Median Wage Impact (`median-wage-impact`)
80	   **Type:** OVERLAY (neutral)
81	   **Value:** 0 (no statistically or economically significant wage impact detected through Q1 2026)
82	   **Quote:** "We also examine the log real hourly wages of AI-exposed and unexposed workers… Here again, we see no statistically or economically significant impact."
83	   **Note:** Wages in AI-exposed occupations are not detectably different from the synthetic comparison group through Q1 2026. This does not rule out future effects; the paper notes "Even if no effects are evident in 2022 or 2023, they may yet become evident in 2026 or 2027."
84	
85	9. **Graph:** Overall US Displacement (`overall-us-displacement`)
86	   **Type:** OVERLAY (down)
87	   **Value:** 0 (null effect on aggregate employment share through Q1 2026)
88	   **Quote:** "AI-exposed unemployment has risen somewhat more than unemployment of the comparison group, though the difference is not statistically significant" and "the point estimate itself in that quarter is virtually zero."
89	   **Note:** SDID is only as strong as the exposure metrics underlying it. Budget Lab cautions that occupations with both positive and negative AI shocks may average to zero even if individual effects are large.
90	
91	---
92	
93	## Sources Checked but Not Relevant to 7-Day Window
94	
95	The following URLs were fetched and confirmed to be **outside the May 25–June 1, 2026 window**, previously published or not yielding new quantitative AI labor stats:
96	
97	| URL | Reason |
98	|-----|---------|
99	| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Published January 21, 2026 — outside window |
100	| https://www.nber.org/system/files/working_papers/w34984/w34984.pdf | Published March 2026 — outside window |
101	| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | Published January 2026 — outside window |
102	| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Published April 3, 2026 — outside window |
103	| https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/ | Published May 14, 2026 — outside window |
104	| https://www.census.gov/newsroom/press-releases/2026/btos-may-21.html | May 21 BTOS data release — outside window (pre-dates May 25) |
105	| https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf | Census CES working paper, spring 2026 release — outside window |
106	| https://www.anthropic.com/research/labor-market-impacts | Published March 5, 2026 — outside window |
107	| https://almcorp.com/blog/ai-job-displacement-statistics/ | Tier 4 blog; no original research; no publication date |
108	| https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics | Tier 4 aggregator; no original research |
109	| https://launchready.ai/insights/ai-readiness/one-in-five-census-ai-adoption-reality-check-2026 | Tier 4 blog commentary on Census data, published May 29, 2026 — not original research |
110	| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-the-labor-market-still-first-inning | Tier 2 review essay; published prior to window; no new primary statistics |
111	| https://www.dallasfed.org/research/economics/2026/0224 | Dallas Fed — published February 2026, outside window |
112	| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | SSRN paper "AI Job Displacement Analysis" — undated/low quality; Tier 4 aggregation |
113	| https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-us-labor-market | Goldman Sachs article — references early 2026 data but page is not newly published |
114	| https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market | Published March 2026 — outside window |
115	
116	---
117	
118	## Priority Recommendations
119	
120	### Ingest Immediately (Tier 1 — In Window)
121	
122	1. **Census Bureau BTOS Story (May 26, 2026)** — `census-btos-ai-adoption-2026`
123	   - Direct data point for `ai-adoption-rate`: **19.8%** nationally as of May 3, 2026, up from ~17% in December 2025.
124	   - Sector overlays: Information (39.7%), Finance & Insurance (33.9%), Retail Trade (~14%).
125	   - Large-firm overlay: 37% at 250+ employee firms.
126	   - This is the most current, nationally representative government data on firm-level AI adoption in existence.
127	
128	### Ingest Soon (Tier 2 — Just Outside Window, May 2026)
129	
130	2. **Budget Lab at Yale SDID Analysis (May 7, 2026)** — `budgetlab-yale-sdid-ai-effects-2026`
131	   - Calibrating null result: zero detectable effect on employment share or real wages through Q1 2026, using causal econometric design on CPS data.
132	   - Important downward overlay for `total-us-jobs-lost`, `overall-us-displacement`, and `median-wage-impact` graphs.
133	   - The paper authors note effects "may yet become evident in 2026 or 2027" — directional caution is warranted.
134	
135	### Statistics Diverging Significantly from Current Graph Consensus
136	
137	- The **19.8% BTOS adoption rate** for all firms (including very small businesses with <5 employees) is notably *lower* than many headline figures cited in trade press (e.g., 72% or 88% "using AI in at least one function") which typically survey large enterprises. The BTOS population-representative figure should anchor the `ai-adoption-rate` graph, with enterprise-survey figures displayed as overlays.
138	- The **Budget Lab null result on wages and employment** (through Q1 2026, causal design) is a significant contrast to anticipatory displacement forecasts. Any graph consensus showing >2–3% employment decline by 2026 should be revisited against this finding.
139	
140	### New Government Data Releases to Monitor
141	
142	- **BTOS biweekly releases**: The Census Bureau releases BTOS data every two weeks. The next release after May 21 is expected around **June 4, 2026** and will extend the AI adoption trend line. Watch for statistically significant upticks above 20%.
143	- **BLS Employment Situation (monthly)**: The June 2026 release (for May 2026 data) will be a key test of whether AI-exposed occupation employment is diverging from the Budget Lab's null trend.
144	- **Census CES-WP-26-25 companion data**: The Spring 2026 BTOS AI supplement (Nov 2025–Jan 2026) has been released in working paper form; public microdata download may now be available for deeper analysis.
# AI Labor Research Digest — 2026-06-01

## Summary

An exhaustive search across 8+ targeted queries and >20 source fetches found **one Tier 1 source published within the May 25–June 1, 2026 window**: the U.S. Census Bureau's *America Counts* story "AI Use at U.S. Businesses" (May 26, 2026), drawing on BTOS biweekly panel data through May 3, 2026. Its headline finding — that 19.8% of all U.S. businesses used AI in a business function as of early May 2026, up from the 17–20% range since December 2025 — is a direct, nationally representative data point for the `ai-adoption-rate` graph. One additional Tier 2 source from just outside the window (Budget Lab at Yale, May 7, 2026) provides a rigorous null-effect causal estimate on employment and wages through Q1 2026, useful as a calibrating overlay. No new peer-reviewed papers on displacement magnitudes, wage effects, or sector-specific automation rates were published in this 7-day window.

---

## New Sources

### AI Use at U.S. Businesses

- **Publisher:** U.S. Census Bureau (America Counts story series)
- **Date:** 2026-05-26
- **URL:** https://www.census.gov/library/stories/2026/05/ai-use-businesses.html
- **Evidence Tier:** 1 (U.S. government — nationally representative Business Trends and Outlook Survey, ~1.2M businesses, biweekly panel)
- **Source ID:** census-btos-ai-adoption-2026

**Context:** The BTOS added an AI supplement in November 2025, asking firms whether they "used AI in any business function" in the prior two weeks. This story synthesizes the six months of data collected from December 14, 2025, through May 3, 2026. It is the most current, nationally representative time-series on firm-level AI adoption in the U.S. Authors: Adam Grundy, Cory Breaux, Dhanapati Khatiwoda.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 19.8 % of US firms using AI (Census BTOS, as of May 3, 2026 data collection period)
   **Quote:** "As of May 3, 2026, the AI use rates in the Information (39.7%) and Finance and Insurance (33.9%) sectors were both higher than the national rate (19.8%)"

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 18.5 % (midpoint of stated range, Dec 2025–May 2026 trend)
   **Quote:** "The BTOS data (December 2025 to May 2026) show that overall AI usage hovered between 17% and 20% — and that between 20% and 23% of businesses expected to be using it in the next six months."
   **Note:** Forward-looking indicator implies the adoption rate trajectory is rising; the 20–23% expected-use figure provides a near-term ceiling estimate and supports an upward directional overlay.

3. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 37 % (large firms, 250+ employees, as of May 2026)
   **Quote:** "37% of firms with at least 250 employees reported using AI in their business operations."
   **Note:** Substantial concentration effect — large firms are nearly 2× the national average. Supports upward pressure on employment-weighted adoption (consistent with earlier Census CES-WP-26-25 finding of 32% on an employment-weighted basis).

4. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (up)
   **Value:** 32 % (mid-size firms, 100–249 employees, as of May 2026)
   **Quote:** "In the data collection period ending May 3, 2026, 32% of firms with 100 to 249 employees said they used AI."

5. **Graph:** Tech Sector Displacement (`tech-sector-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** 39.7 % (Information sector firms using AI)
   **Quote:** "As of May 3, 2026, the AI use rates in the Information (39.7%) and Finance and Insurance (33.9%) sectors were both higher than the national rate (19.8%) but neither reported significant shifts since December."
   **Note:** High adoption in the Information sector is consistent with displacement risk narratives for tech roles, but the "no significant shift since December" qualifier means this is an exposure/adoption measure, not a displacement measure. Classify as overlay (neutral) on tech displacement — high adoption does not confirm proportional job loss.

6. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** ~14 % (Retail Trade sector firms using AI — well below national average)
   **Quote:** "businesses in the Retail Trade sector reported current and expected usage lower than the national average: around 14% of businesses currently use AI, and about 17% expect to in the next six months."
   **Note:** Retail lagging signals that customer-facing automation may be less advanced than forecast models imply; directional overlay is neutral-to-down for retail-specific exposure projections.

---

### What We Do and Don't Know About How AI Is Affecting the Labor Market

> **Note:** Published May 7, 2026 — **18 days before** the 7-day window opens. Included here as a high-priority recently published source that may not yet be in the digest database and is directly relevant to multiple graph series.

- **Publisher:** The Budget Lab at Yale University
- **Date:** 2026-05-07
- **URL:** https://budgetlab.yale.edu/research/what-we-do-and-dont-know-about-how-ai-affecting-labor-market
- **Evidence Tier:** 2 (major nonpartisan policy think tank; uses CPS microdata and synthetic differences-in-differences econometrics)
- **Source ID:** budgetlab-yale-sdid-ai-effects-2026

**Context:** Authors Martha Gimbel, Joshua Kendall, and Ryan Nunn apply a synthetic differences-in-differences (SDID) design to CPS data through Q1 2026 to estimate causal effects of AI exposure on employment shares and real wages. This is a significant methodological upgrade over earlier exposure-correlation studies. The paper explicitly acknowledges the design may miss narrow-group effects (e.g., 22–27-year-old new graduates) due to CPS sample size constraints.

**Statistics:**

7. **Graph:** Total US Jobs Lost (`total-us-jobs-lost`)
   **Type:** OVERLAY (down)
   **Value:** 0 (no statistically significant employment share decline detected through Q1 2026)
   **Quote:** "Using an approach called synthetic differences-in-differences (SDID) that addresses these challenges, we generally find no statistically or economically significant effects as of yet. Specifically, we examine the employment and wages of AI-exposed and unexposed occupations… No impact is evident through the post-2022 time window."
   **Note:** The point estimate "in that quarter is virtually zero" for employment share. The 95% CI upper bound is ~5% of the average exposed occupation's employment share — i.e., displacement, if any, remains within noise. This calibrates downward pressure on near-term displacement projections.

8. **Graph:** Median Wage Impact (`median-wage-impact`)
   **Type:** OVERLAY (neutral)
   **Value:** 0 (no statistically or economically significant wage impact detected through Q1 2026)
   **Quote:** "We also examine the log real hourly wages of AI-exposed and unexposed workers… Here again, we see no statistically or economically significant impact."
   **Note:** Wages in AI-exposed occupations are not detectably different from the synthetic comparison group through Q1 2026. This does not rule out future effects; the paper notes "Even if no effects are evident in 2022 or 2023, they may yet become evident in 2026 or 2027."

9. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down)
   **Value:** 0 (null effect on aggregate employment share through Q1 2026)
   **Quote:** "AI-exposed unemployment has risen somewhat more than unemployment of the comparison group, though the difference is not statistically significant" and "the point estimate itself in that quarter is virtually zero."
   **Note:** SDID is only as strong as the exposure metrics underlying it. Budget Lab cautions that occupations with both positive and negative AI shocks may average to zero even if individual effects are large.

---

## Sources Checked but Not Relevant to 7-Day Window

The following URLs were fetched and confirmed to be **outside the May 25–June 1, 2026 window**, previously published or not yielding new quantitative AI labor stats:

| URL | Reason |
|-----|---------|
| https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ | Published January 21, 2026 — outside window |
| https://www.nber.org/system/files/working_papers/w34984/w34984.pdf | Published March 2026 — outside window |
| https://www.imf.org/-/media/files/publications/sdn/2026/english/sdnea2026001.pdf | Published January 2026 — outside window |
| https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html | Published April 3, 2026 — outside window |
| https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/ | Published May 14, 2026 — outside window |
| https://www.census.gov/newsroom/press-releases/2026/btos-may-21.html | May 21 BTOS data release — outside window (pre-dates May 25) |
| https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf | Census CES working paper, spring 2026 release — outside window |
| https://www.anthropic.com/research/labor-market-impacts | Published March 5, 2026 — outside window |
| https://almcorp.com/blog/ai-job-displacement-statistics/ | Tier 4 blog; no original research; no publication date |
| https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics | Tier 4 aggregator; no original research |
| https://launchready.ai/insights/ai-readiness/one-in-five-census-ai-adoption-reality-check-2026 | Tier 4 blog commentary on Census data, published May 29, 2026 — not original research |
| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-the-labor-market-still-first-inning | Tier 2 review essay; published prior to window; no new primary statistics |
| https://www.dallasfed.org/research/economics/2026/0224 | Dallas Fed — published February 2026, outside window |
| https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 | SSRN paper "AI Job Displacement Analysis" — undated/low quality; Tier 4 aggregation |
| https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-us-labor-market | Goldman Sachs article — references early 2026 data but page is not newly published |
| https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market | Published March 2026 — outside window |

---

## Priority Recommendations

### Ingest Immediately (Tier 1 — In Window)

1. **Census Bureau BTOS Story (May 26, 2026)** — `census-btos-ai-adoption-2026`
   - Direct data point for `ai-adoption-rate`: **19.8%** nationally as of May 3, 2026, up from ~17% in December 2025.
   - Sector overlays: Information (39.7%), Finance & Insurance (33.9%), Retail Trade (~14%).
   - Large-firm overlay: 37% at 250+ employee firms.
   - This is the most current, nationally representative government data on firm-level AI adoption in existence.

### Ingest Soon (Tier 2 — Just Outside Window, May 2026)

2. **Budget Lab at Yale SDID Analysis (May 7, 2026)** — `budgetlab-yale-sdid-ai-effects-2026`
   - Calibrating null result: zero detectable effect on employment share or real wages through Q1 2026, using causal econometric design on CPS data.
   - Important downward overlay for `total-us-jobs-lost`, `overall-us-displacement`, and `median-wage-impact` graphs.
   - The paper authors note effects "may yet become evident in 2026 or 2027" — directional caution is warranted.

### Statistics Diverging Significantly from Current Graph Consensus

- The **19.8% BTOS adoption rate** for all firms (including very small businesses with <5 employees) is notably *lower* than many headline figures cited in trade press (e.g., 72% or 88% "using AI in at least one function") which typically survey large enterprises. The BTOS population-representative figure should anchor the `ai-adoption-rate` graph, with enterprise-survey figures displayed as overlays.
- The **Budget Lab null result on wages and employment** (through Q1 2026, causal design) is a significant contrast to anticipatory displacement forecasts. Any graph consensus showing >2–3% employment decline by 2026 should be revisited against this finding.

### New Government Data Releases to Monitor

- **BTOS biweekly releases**: The Census Bureau releases BTOS data every two weeks. The next release after May 21 is expected around **June 4, 2026** and will extend the AI adoption trend line. Watch for statistically significant upticks above 20%.
- **BLS Employment Situation (monthly)**: The June 2026 release (for May 2026 data) will be a key test of whether AI-exposed occupation employment is diverging from the Budget Lab's null trend.
- **Census CES-WP-26-25 companion data**: The Spring 2026 BTOS AI supplement (Nov 2025–Jan 2026) has been released in working paper form; public microdata download may now be available for deeper analysis.