1	# AI Labor Research Digest — 2026-05-25
2	
3	## Summary
4	
5	This was a relatively quiet week (May 18–25, 2026) for new primary quantitative AI labor market research. The most notable new publication within the window is the Washington Center for Equitable Growth's AI research synthesis (May 21), which is a literature review and research-navigation guide rather than a primary study; it introduces an AI research database but generates no original quantitative statistics. The Census Bureau released its routine biweekly BTOS data update (May 21), which continues to make the AI supplement data available, but that data originates from the November 2025–January 2026 collection period already published in an April 2026 CES working paper. No Tier 1 (peer-reviewed or government-statistical-release) papers with new AI labor market estimates were published in the strict May 18–25 window. Two high-quality sources from just outside the window (the NY Fed Liberty Street post of May 14 and the Census CES working paper of April 2026) are flagged below as important near-window context.
6	
7	---
8	
9	## New Sources
10	
11	### Navigating the Research on the Impacts of AI on Work, Workers, and the Labor Market
12	- **Publisher:** Washington Center for Equitable Growth
13	- **Date:** 2026-05-21
14	- **URL:** https://equitablegrowth.org/research-paper/navigating-the-research-on-the-impacts-of-ai-on-work-workers-and-the-labor-market/
15	- **Evidence Tier:** 2 (Think tank / policy research institute)
16	- **Source ID:** equitable-growth-ai-labor-synthesis-2026
17	
18	**Description:** A 26-minute-read synthesis paper by Equitable Growth researcher Chiara Chanoi that introduces the organization's new quarterly AI research database. The paper explains frameworks (task-based, exposure metrics, etc.) used across the literature and summarizes broad themes. It is explicitly a navigation and accessibility tool for existing research—not a primary empirical study—and generates no original quantitative statistics about AI's labor market impacts. The paper does cite two non-original statistics from external surveys.
19	
20	**Statistics:**
21	
22	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
23	   **Type:** OVERLAY (neutral)
24	   **Value:** 52 % of workers worried about AI in the workplace (sentiment, not adoption)
25	   **Quote:** "In 2025, a survey on worker sentiment by the Pew Research Center found that while 52 percent of workers answered 'yes' when asked whether they feel worried about AI's future in the workplace, only 36 percent answered 'yes' to feeling hopeful about it."
26	   **Mapping note:** This is a sentiment measure, not an adoption or displacement metric; it overlays `genai-work-adoption` as neutral context only. Do **not** use as data_point.
27	
28	   *No additional extractable quantitative statistics unique to this publication. The paper synthesizes prior research but does not produce new measurements.*
29	
30	---
31	
32	### Business Trends and Outlook Survey Data Release — May 21, 2026
33	- **Publisher:** U.S. Census Bureau
34	- **Date:** 2026-05-21
35	- **URL:** https://www.census.gov/newsroom/press-releases/2026/btos-may-21.html
36	- **Evidence Tier:** 1 (U.S. Government — official statistical release)
37	- **Source ID:** census-btos-may21-2026
38	
39	**Description:** Routine biweekly BTOS data release. The press release confirms that AI supplement data (collected November 17, 2025 – February 8, 2026) "are now available on the BTOS webpage as data download files and visualizations." This is a standing announcement; the underlying AI statistics originate from the Census CES Working Paper CES-WP-26-25 (published April 2026, noted below as near-window context). **The May 21 release itself contains no new AI statistics beyond those previously available.** The BTOS sample covers approximately 1.2 million businesses with biweekly data collection.
40	
41	**Statistics:** No new AI-specific statistics are released in this tip sheet. The AI supplement data referenced has been available since April 2026 releases. See "Near-Window Sources" below for the originating statistics.
42	
43	---
44	
45	## Near-Window Sources (Within 14 Days — High Priority for Review)
46	
47	The following two sources were published just before the May 18 cutoff but contain the most significant new quantitative findings in the surrounding period. They are flagged here because they may not yet have been ingested and are directly graph-relevant.
48	
49	---
50	
51	### Do Job Postings Show Early Labor-Market Effects of AI?
52	- **Publisher:** Federal Reserve Bank of New York (Liberty Street Economics blog)
53	- **Date:** 2026-05-14
54	- **URL:** https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/
55	- **Evidence Tier:** 1 (Federal Reserve — government research)
56	- **Source ID:** nyfed-job-postings-ai-2026
57	- **Authors:** Richard Audoly, Miles Guerin, Giorgio Topa (NY Fed Research and Statistics Group)
58	
59	**Description:** An empirical analysis of AI exposure and U.S. job posting data, using Anthropic's AI exposure measure combined with Lightcast vacancy data (January 2026) and BLS OEWS employment data. Finds that while AI-exposed occupations show relative vacancy declines, this trend predates ChatGPT (began 2022), and there is no divergence between junior and senior positions in exposed occupations—making it difficult to attribute the hiring slowdown to AI alone.
60	
61	**Statistics:**
62	
63	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
64	   **Type:** OVERLAY (down — tentative signal but no clear AI causation)
65	   **Value:** n/a (directional finding, no single numeric value)
66	   **Quote:** "While job postings show a relative decline in vacancies in occupations with greater exposure to AI, that divergence began before the release of ChatGPT in late 2022. Moreover, we do not observe a divergence in labor demand between junior and senior positions within highly exposed occupations. These patterns make it difficult to attribute the recent slowdown in entry-level hiring to AI alone."
67	   **Mapping note:** This finding provides a downward directional signal on vacancy-based displacement proxies but explicitly cautions against AI attribution. Use as `overlay (neutral)` pending stronger causal evidence.
68	
69	2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
70	   **Type:** OVERLAY (neutral)
71	   **Value:** n/a (qualitative)
72	   **Quote:** "In line with this interpretation, the New York Fed's business surveys indicate that, so far, firms intend to incorporate AI mainly via retraining, with limited effects on hiring."
73	   **Mapping note:** Qualitative finding about firm intent; no numeric value extractable for data_point use.
74	
75	---
76	
77	### The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
78	- **Publisher:** U.S. Census Bureau — Center for Economic Studies (CES Working Paper CES-WP-26-25)
79	- **Date:** 2026-04 (page last revised April 22, 2026)
80	- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
81	- **Evidence Tier:** 1 (U.S. Government / Census Bureau empirical research)
82	- **Source ID:** census-ces-ai-diffusion-2026
83	- **Authors:** Kathryn Bonney, Cory Breaux, Emin Dinlersoz, Lucia Foster, John Haltiwanger, Aditya Pande
84	
85	**Description:** The primary empirical analysis underlying the 2026 BTOS AI supplement. Uses nationally representative data from the BTOS AI supplement (November 2025–January 2026) to characterize AI diffusion across three interconnected layers: firm-level adoption, business-function deployment, and worker-task integration. The most comprehensive U.S. government dataset on AI adoption patterns to date.
86	
87	**Statistics:**
88	
89	1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
90	   **Type:** DATA_POINT
91	   **Value:** 18 % of firms (32% on employment-weighted basis)
92	   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
93	   **Mapping note:** The 18% figure is the headline firm-level count; 32% is employment-weighted. For the `ai-adoption-rate` graph (which tracks % of US firms using AI via Census BTOS), use **18%** as the data_point value (unweighted); note that employment-weighted is 32%.
94	
95	2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
96	   **Type:** DATA_POINT
97	   **Value:** 23 % of firms have workers using AI in work-related tasks (41% employment-weighted)
98	   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks, though 65% of firms limit use to three or fewer tasks."
99	   **Mapping note:** The 41% employment-weighted figure aligns more closely with the `genai-work-adoption` graph concept (share of adults using GenAI at work), which is typically individual-level. The paper also references RPS data showing ~41% of the workforce reporting work-related GenAI use. Cross-check with RPS figures before ingesting as data_point.
100	
101	3. **Graph:** Overall US Displacement (`overall-us-displacement`)
102	   **Type:** OVERLAY (down — AI-related employment decline is rare)
103	   **Value:** 2 % of firms
104	   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
105	   **Mapping note:** The 2% figure is the share of adopting firms reporting AI-related employment decreases—not the share of workers displaced. This is a strong downward overlay on displacement graphs (i.e., displacement in the near term is smaller than many forecasts suggest), but cannot be converted to a workforce-% data_point.
106	
107	4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
108	   **Type:** OVERLAY (neutral)
109	   **Value:** 66 % of AI users augment-only; 65% of firms limit use to ≤3 tasks
110	   **Quote:** "A distinct divergence emerges, however, with respect to labor outcomes. Functional breadth and operational investment are positively associated with employment decreases, whereas worker-task integration shows no significant link to headcount reduction once functional integration and operational investment are taken into account."
111	   **Mapping note:** This finding shows exposure does not straightforwardly translate to displacement, supporting a neutral overlay on `workforce-ai-exposure` near-term graphs.
112	
113	---
114	
115	## Sources Checked but Not Relevant to New Quantitative Data This Week
116	
117	The following URLs were fetched or searched and found to contain either no new (post-May 18) quantitative AI labor data, to be aggregators of older statistics, or to be editorial/opinion content without primary data:
118	
119	- https://theworlddata.com/ai-job-displacement-statistics/ — Tier 4 aggregator; stats derived from 2025 sources (WEF FoJ 2025, Goldman Sachs Aug 2025, McKinsey 2025). No new data.
120	- https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics — Tier 4 aggregator of older statistics.
121	- https://almcorp.com/blog/ai-job-displacement-statistics/ — Tier 4 blog; synthesizes older sources.
122	- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 — SSRN paper (Josephine Nartey); a student/practitioner research report, not peer-reviewed; statistics appear to be secondary citations. Tier 4.
123	- https://gloat.com/blog/ai-labor-market/ — Tier 4 vendor blog (last updated March 2026).
124	- https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market — Yale Budget Lab tracker last substantively updated with March 2026 CPS data; no new statistics released this week.
125	- https://www.imf.org/.../sdnea2026001.pdf — IMF SDN 2026/001 ("Bridging Skill Gaps for the Future") published January 9, 2026; outside the 7-day window. Contains important statistics (cited extensively in other papers) but not new this week.
126	- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Brookings/NBER analysis published January 21, 2026; outside window.
127	- https://www.federalreserve.gov/.../monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed Board note published April 3, 2026; outside window.
128	- https://www.foxbusiness.com/economy/ai-raises-average-wages-21-substantially-reduces-wage-inequality-researchers-find — Fox Business article on Althoff & Reichardt Stanford paper published January 17, 2026; outside window.
129	- https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/ — NY Fed post published May 14, 2026 (4 days before window); flagged as near-window above.
130	- https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market — HBR March 2026; outside window.
131	- https://www.resultsense.com/news/2026-03-17-which-jobs-are-most-threatened-by-ai-new-research-maps-the-risks — March 17, 2026 coverage of Brookings/GovAI research; outside window.
132	- https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure — ILO 2025 publication; outside window.
133	- https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ — ICLE review paper; no clear 2026 publication date within window.
134	- https://arxiv.org/html/2509.15265v1 — arXiv review paper (September 2025 version); outside window.
135	
136	---
137	
138	## Priority Recommendations
139	
140	### Tier 1 Sources to Ingest Immediately
141	
142	1. **Census CES Working Paper CES-WP-26-25** (April 2026) — The most important recent government data on AI adoption. The 18% firm-adoption (32% employment-weighted) figures are the authoritative Census BTOS numbers for the `ai-adoption-rate` graph. The 2% employment-decrease finding is a significant near-term downside bound for displacement. **Should be ingested now if not already done.**
143	
144	2. **NY Fed Liberty Street Economics, May 14, 2026** — Federal Reserve empirical analysis of job postings and AI exposure. Finds the vacancy decline in exposed occupations predates ChatGPT and lacks a junior/senior split, weakening the AI-causation thesis. Important overlay for `overall-us-displacement` and `tech-sector-displacement` graphs.
145	
146	### Statistics That Diverge Significantly From Current Graph Consensus
147	
148	- The Census finding that **only 2% of adopting firms report AI-related employment decreases** (CES-WP-26-25) would significantly undercut displacement forecast curves if ingested as near-term context. Most prediction graphs likely show higher near-term displacement expectations; this datum is a strong downward overlay.
149	
150	- The Census finding that **66% of AI users rely solely on AI to augment tasks** challenges framing of AI as predominantly displacing technology (vs. productivity-augmenting).
151	
152	- The NY Fed finding that the **job-posting divergence predates ChatGPT** is a significant methodological challenge to AI-specific displacement arguments in the literature.
153	
154	### New Government Data Releases
155	
156	- The **Census Bureau BTOS AI supplement data** (Nov 2025–Jan 2026 reference period) was formally re-announced via the May 21, 2026 biweekly release. This is the most recent official U.S. government measurement of AI adoption at the firm level. Data download files and visualizations are available at: https://www.census.gov/hfp/btos/data
157	
158	- **Next expected BTOS release:** approximately June 4, 2026 (biweekly cadence). Given that the BTOS does not currently include a new AI supplement question cycle (the supplement ran Nov 2025–Feb 2026), upcoming releases are unlikely to contain new AI-specific data until a new supplement round is announced.
# AI Labor Research Digest — 2026-05-25

## Summary

This was a relatively quiet week (May 18–25, 2026) for new primary quantitative AI labor market research. The most notable new publication within the window is the Washington Center for Equitable Growth's AI research synthesis (May 21), which is a literature review and research-navigation guide rather than a primary study; it introduces an AI research database but generates no original quantitative statistics. The Census Bureau released its routine biweekly BTOS data update (May 21), which continues to make the AI supplement data available, but that data originates from the November 2025–January 2026 collection period already published in an April 2026 CES working paper. No Tier 1 (peer-reviewed or government-statistical-release) papers with new AI labor market estimates were published in the strict May 18–25 window. Two high-quality sources from just outside the window (the NY Fed Liberty Street post of May 14 and the Census CES working paper of April 2026) are flagged below as important near-window context.

---

## New Sources

### Navigating the Research on the Impacts of AI on Work, Workers, and the Labor Market
- **Publisher:** Washington Center for Equitable Growth
- **Date:** 2026-05-21
- **URL:** https://equitablegrowth.org/research-paper/navigating-the-research-on-the-impacts-of-ai-on-work-workers-and-the-labor-market/
- **Evidence Tier:** 2 (Think tank / policy research institute)
- **Source ID:** equitable-growth-ai-labor-synthesis-2026

**Description:** A 26-minute-read synthesis paper by Equitable Growth researcher Chiara Chanoi that introduces the organization's new quarterly AI research database. The paper explains frameworks (task-based, exposure metrics, etc.) used across the literature and summarizes broad themes. It is explicitly a navigation and accessibility tool for existing research—not a primary empirical study—and generates no original quantitative statistics about AI's labor market impacts. The paper does cite two non-original statistics from external surveys.

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (neutral)
   **Value:** 52 % of workers worried about AI in the workplace (sentiment, not adoption)
   **Quote:** "In 2025, a survey on worker sentiment by the Pew Research Center found that while 52 percent of workers answered 'yes' when asked whether they feel worried about AI's future in the workplace, only 36 percent answered 'yes' to feeling hopeful about it."
   **Mapping note:** This is a sentiment measure, not an adoption or displacement metric; it overlays `genai-work-adoption` as neutral context only. Do **not** use as data_point.

   *No additional extractable quantitative statistics unique to this publication. The paper synthesizes prior research but does not produce new measurements.*

---

### Business Trends and Outlook Survey Data Release — May 21, 2026
- **Publisher:** U.S. Census Bureau
- **Date:** 2026-05-21
- **URL:** https://www.census.gov/newsroom/press-releases/2026/btos-may-21.html
- **Evidence Tier:** 1 (U.S. Government — official statistical release)
- **Source ID:** census-btos-may21-2026

**Description:** Routine biweekly BTOS data release. The press release confirms that AI supplement data (collected November 17, 2025 – February 8, 2026) "are now available on the BTOS webpage as data download files and visualizations." This is a standing announcement; the underlying AI statistics originate from the Census CES Working Paper CES-WP-26-25 (published April 2026, noted below as near-window context). **The May 21 release itself contains no new AI statistics beyond those previously available.** The BTOS sample covers approximately 1.2 million businesses with biweekly data collection.

**Statistics:** No new AI-specific statistics are released in this tip sheet. The AI supplement data referenced has been available since April 2026 releases. See "Near-Window Sources" below for the originating statistics.

---

## Near-Window Sources (Within 14 Days — High Priority for Review)

The following two sources were published just before the May 18 cutoff but contain the most significant new quantitative findings in the surrounding period. They are flagged here because they may not yet have been ingested and are directly graph-relevant.

---

### Do Job Postings Show Early Labor-Market Effects of AI?
- **Publisher:** Federal Reserve Bank of New York (Liberty Street Economics blog)
- **Date:** 2026-05-14
- **URL:** https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/
- **Evidence Tier:** 1 (Federal Reserve — government research)
- **Source ID:** nyfed-job-postings-ai-2026
- **Authors:** Richard Audoly, Miles Guerin, Giorgio Topa (NY Fed Research and Statistics Group)

**Description:** An empirical analysis of AI exposure and U.S. job posting data, using Anthropic's AI exposure measure combined with Lightcast vacancy data (January 2026) and BLS OEWS employment data. Finds that while AI-exposed occupations show relative vacancy declines, this trend predates ChatGPT (began 2022), and there is no divergence between junior and senior positions in exposed occupations—making it difficult to attribute the hiring slowdown to AI alone.

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — tentative signal but no clear AI causation)
   **Value:** n/a (directional finding, no single numeric value)
   **Quote:** "While job postings show a relative decline in vacancies in occupations with greater exposure to AI, that divergence began before the release of ChatGPT in late 2022. Moreover, we do not observe a divergence in labor demand between junior and senior positions within highly exposed occupations. These patterns make it difficult to attribute the recent slowdown in entry-level hiring to AI alone."
   **Mapping note:** This finding provides a downward directional signal on vacancy-based displacement proxies but explicitly cautions against AI attribution. Use as `overlay (neutral)` pending stronger causal evidence.

2. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (neutral)
   **Value:** n/a (qualitative)
   **Quote:** "In line with this interpretation, the New York Fed's business surveys indicate that, so far, firms intend to incorporate AI mainly via retraining, with limited effects on hiring."
   **Mapping note:** Qualitative finding about firm intent; no numeric value extractable for data_point use.

---

### The Microstructure of AI Diffusion: Evidence from Firms, Business Functions, and Worker Tasks
- **Publisher:** U.S. Census Bureau — Center for Economic Studies (CES Working Paper CES-WP-26-25)
- **Date:** 2026-04 (page last revised April 22, 2026)
- **URL:** https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html
- **Evidence Tier:** 1 (U.S. Government / Census Bureau empirical research)
- **Source ID:** census-ces-ai-diffusion-2026
- **Authors:** Kathryn Bonney, Cory Breaux, Emin Dinlersoz, Lucia Foster, John Haltiwanger, Aditya Pande

**Description:** The primary empirical analysis underlying the 2026 BTOS AI supplement. Uses nationally representative data from the BTOS AI supplement (November 2025–January 2026) to characterize AI diffusion across three interconnected layers: firm-level adoption, business-function deployment, and worker-task integration. The most comprehensive U.S. government dataset on AI adoption patterns to date.

**Statistics:**

1. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** DATA_POINT
   **Value:** 18 % of firms (32% on employment-weighted basis)
   **Quote:** "During the supplement reference period (Nov 2025-Jan 2026), 18% of firms used AI in a business function, rising to 32% on an employment-weighted basis; adoption is expected to reach 22% within six months."
   **Mapping note:** The 18% figure is the headline firm-level count; 32% is employment-weighted. For the `ai-adoption-rate` graph (which tracks % of US firms using AI via Census BTOS), use **18%** as the data_point value (unweighted); note that employment-weighted is 32%.

2. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 23 % of firms have workers using AI in work-related tasks (41% employment-weighted)
   **Quote:** "In 23% (41%, employment-weighted) of firms, workers use AI in work-related tasks. Writing, document analysis, and information search are the leading Generative AI use in tasks, though 65% of firms limit use to three or fewer tasks."
   **Mapping note:** The 41% employment-weighted figure aligns more closely with the `genai-work-adoption` graph concept (share of adults using GenAI at work), which is typically individual-level. The paper also references RPS data showing ~41% of the workforce reporting work-related GenAI use. Cross-check with RPS figures before ingesting as data_point.

3. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (down — AI-related employment decline is rare)
   **Value:** 2 % of firms
   **Quote:** "Most users (66%) rely on AI solely to augment tasks, while AI-related employment decreases are rare, occurring in only 2% of firms."
   **Mapping note:** The 2% figure is the share of adopting firms reporting AI-related employment decreases—not the share of workers displaced. This is a strong downward overlay on displacement graphs (i.e., displacement in the near term is smaller than many forecasts suggest), but cannot be converted to a workforce-% data_point.

4. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (neutral)
   **Value:** 66 % of AI users augment-only; 65% of firms limit use to ≤3 tasks
   **Quote:** "A distinct divergence emerges, however, with respect to labor outcomes. Functional breadth and operational investment are positively associated with employment decreases, whereas worker-task integration shows no significant link to headcount reduction once functional integration and operational investment are taken into account."
   **Mapping note:** This finding shows exposure does not straightforwardly translate to displacement, supporting a neutral overlay on `workforce-ai-exposure` near-term graphs.

---

## Sources Checked but Not Relevant to New Quantitative Data This Week

The following URLs were fetched or searched and found to contain either no new (post-May 18) quantitative AI labor data, to be aggregators of older statistics, or to be editorial/opinion content without primary data:

- https://theworlddata.com/ai-job-displacement-statistics/ — Tier 4 aggregator; stats derived from 2025 sources (WEF FoJ 2025, Goldman Sachs Aug 2025, McKinsey 2025). No new data.
- https://www.designrush.com/agency/ai-companies/trends/ai-job-displacement-statistics — Tier 4 aggregator of older statistics.
- https://almcorp.com/blog/ai-job-displacement-statistics/ — Tier 4 blog; synthesizes older sources.
- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5316265 — SSRN paper (Josephine Nartey); a student/practitioner research report, not peer-reviewed; statistics appear to be secondary citations. Tier 4.
- https://gloat.com/blog/ai-labor-market/ — Tier 4 vendor blog (last updated March 2026).
- https://budgetlab.yale.edu/research/tracking-impact-ai-labor-market — Yale Budget Lab tracker last substantively updated with March 2026 CPS data; no new statistics released this week.
- https://www.imf.org/.../sdnea2026001.pdf — IMF SDN 2026/001 ("Bridging Skill Gaps for the Future") published January 9, 2026; outside the 7-day window. Contains important statistics (cited extensively in other papers) but not new this week.
- https://www.brookings.edu/articles/measuring-us-workers-capacity-to-adapt-to-ai-driven-job-displacement/ — Brookings/NBER analysis published January 21, 2026; outside window.
- https://www.federalreserve.gov/.../monitoring-ai-adoption-in-the-u-s-economy-20260403.html — Fed Board note published April 3, 2026; outside window.
- https://www.foxbusiness.com/economy/ai-raises-average-wages-21-substantially-reduces-wage-inequality-researchers-find — Fox Business article on Althoff & Reichardt Stanford paper published January 17, 2026; outside window.
- https://libertystreeteconomics.newyorkfed.org/2026/05/do-job-postings-show-early-labor-market-effects-of-ai/ — NY Fed post published May 14, 2026 (4 days before window); flagged as near-window above.
- https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market — HBR March 2026; outside window.
- https://www.resultsense.com/news/2026-03-17-which-jobs-are-most-threatened-by-ai-new-research-maps-the-risks — March 17, 2026 coverage of Brookings/GovAI research; outside window.
- https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure — ILO 2025 publication; outside window.
- https://laweconcenter.org/resources/ai-productivity-and-labor-markets-a-review-of-the-empirical-evidence/ — ICLE review paper; no clear 2026 publication date within window.
- https://arxiv.org/html/2509.15265v1 — arXiv review paper (September 2025 version); outside window.

---

## Priority Recommendations

### Tier 1 Sources to Ingest Immediately

1. **Census CES Working Paper CES-WP-26-25** (April 2026) — The most important recent government data on AI adoption. The 18% firm-adoption (32% employment-weighted) figures are the authoritative Census BTOS numbers for the `ai-adoption-rate` graph. The 2% employment-decrease finding is a significant near-term downside bound for displacement. **Should be ingested now if not already done.**

2. **NY Fed Liberty Street Economics, May 14, 2026** — Federal Reserve empirical analysis of job postings and AI exposure. Finds the vacancy decline in exposed occupations predates ChatGPT and lacks a junior/senior split, weakening the AI-causation thesis. Important overlay for `overall-us-displacement` and `tech-sector-displacement` graphs.

### Statistics That Diverge Significantly From Current Graph Consensus

- The Census finding that **only 2% of adopting firms report AI-related employment decreases** (CES-WP-26-25) would significantly undercut displacement forecast curves if ingested as near-term context. Most prediction graphs likely show higher near-term displacement expectations; this datum is a strong downward overlay.

- The Census finding that **66% of AI users rely solely on AI to augment tasks** challenges framing of AI as predominantly displacing technology (vs. productivity-augmenting).

- The NY Fed finding that the **job-posting divergence predates ChatGPT** is a significant methodological challenge to AI-specific displacement arguments in the literature.

### New Government Data Releases

- The **Census Bureau BTOS AI supplement data** (Nov 2025–Jan 2026 reference period) was formally re-announced via the May 21, 2026 biweekly release. This is the most recent official U.S. government measurement of AI adoption at the firm level. Data download files and visualizations are available at: https://www.census.gov/hfp/btos/data

- **Next expected BTOS release:** approximately June 4, 2026 (biweekly cadence). Given that the BTOS does not currently include a new AI supplement question cycle (the supplement ran Nov 2025–Feb 2026), upcoming releases are unlikely to contain new AI-specific data until a new supplement round is announced.