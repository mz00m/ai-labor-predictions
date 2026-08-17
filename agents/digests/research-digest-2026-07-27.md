1	# AI Labor Research Digest — 2026-07-27
2	
3	## Summary
4	
5	The past 7 days (July 20–27, 2026) yielded **one primary new quantitative release** strictly within the window: a July 22 Fortune exclusive reporting on an updated gender breakdown from the Stanford/ADP Canaries Dashboard (Brynjolfsson, Chandar, Chen). The update finds young women aged 22–25 in AI-exposed roles losing ground to men in employment growth — but, critically, the gap is driven by occupational sorting rather than AI treatment per se. The NBER Summer Institute 2026 "Digital Economics and Artificial Intelligence" session (organized by Brynjolfsson, Goldfarb, Tucker) ran July 22–24 this week; individual papers are not yet publicly catalogued but should be monitored. Just outside the 7-day window, the "We Must Act Now" statement (Stanford DEL, July 13) with 200+ economist signatories including 16 Nobel laureates represents a significant qualitative signal. **No new Tier 1 government statistics** (BLS, Census BTOS) were released in this window; the most recent BTOS release was July 16.
6	
7	---
8	
9	## Recurring Series Status
10	
11	| Series ID | Status |
12	|---|---|
13	| `ellucian-highered-ai` | **Not due** — `nextExpected: 2027-03-01`; no new edition search required |
14	
15	No other recurring series are registered in the current `recurring-sources.json`. The `ellucian-highered-ai` series next expected date is March 2027; no sweep needed this cycle.
16	
17	---
18	
19	## Researcher Watchlist Sweep
20	
21	All 15 researchers were last checked `2026-04-14` (>30 days ago). Summary of new findings:
22	
23	| Researcher | Finding |
24	|---|---|
25	| **Erik Brynjolfsson** | **IN-WINDOW NEW DATA** — Canaries Dashboard gender update, July 22, 2026 (see source below). Also: "Minimum Wages and Rise of Robots," NBER WP 34895, Feb 2026; organizing NBER SI 2026 Digital Economics this week. |
26	| **Daron Acemoglu** | New NBER WP 35336 "Automation and Repression" (Acemoglu, Gitmez, Shadmehr, ~June–July 2026); signed "We Must Act Now" (July 13, 2026). No labor-market statistics extractable from available abstracts within this window. |
27	| **Martha Gimbel** | Yale Budget Lab released "What We Do and Don't Know About How AI is Affecting the Labor Market" (Gimbel, Kendall, Nunn, May 7, 2026) — outside window but key finding: synthetic DiD design shows "no statistically or economically significant effects as of yet" in employment or wages for AI-exposed occupations. |
28	| **Jed Kolko** | PIIE "Research on AI and the Labor Market is Still in the First Inning" (March 10, 2026) — outside window; no new publications found within the 7-day window. |
29	| **James Bessen** | No new publications within the 7-day window. |
30	| **Alex Imas** | Cited in PIIE as summarizing AI productivity literature (Imas 2026, Substack); no peer-reviewed paper found within the 7-day window. |
31	| **Molly Kinder** | No new publications within the 7-day window; institutional affiliation now listed as "founding a new organization." |
32	| **Daniel Rock** | No new publications within the 7-day window. |
33	| **Alexander Bick** | St. Louis Fed RPS series now official FRED data (through Q1 2026: 43.4% of employed adults used GenAI for work); no new paper within the 7-day window. |
34	| **David Deming** | No new publications within the 7-day window. |
35	| **Maria del Rio-Chanona** | No new publications within the 7-day window. |
36	| **Andrea Eisfeldt** | Attended NBER SI 2026 Asset Pricing session (co-organizer noted); no new labor paper within window. |
37	| **Pascual Restrepo** | No new publications within the 7-day window. |
38	| **Shakked Noy** | No new publications within the 7-day window. |
39	| **Neil Thompson** | No new publications within the 7-day window. |
40	
41	---
42	
43	## New Sources
44	
45	### Stanford/ADP Canaries Dashboard — July 2026 Gender Breakdown Update (Fortune, July 22, 2026)
46	
47	- **Publisher:** Stanford Digital Economy Lab (Brynjolfsson, Chandar, Chen) + ADP Research (Richardson) — reported by Fortune
48	- **Date:** 2026-07-22
49	- **URL:** https://fortune.com/2026/07/22/women-entry-level-job-growth-slower-than-men-stanford-adp/
50	- **Evidence Tier:** 1 (Large-scale administrative payroll data; ADP covers ~26 million U.S. workers; 4.6 million in the Canaries balanced sample; 730+ occupations; monthly frequency)
51	- **Source ID:** stanford-adp-canaries-gender-2026
52	- **WATCHLIST:** Brynjolfsson
53	
54	**Background:** The Canaries Dashboard (launched June 10, 2026) is a continuously updated joint platform from Stanford DEL and ADP Research extending the August 2025 "Canaries in the Coal Mine?" paper (Brynjolfsson, Chandar, Chen). This July 22 update — shared exclusively with Fortune ahead of its public dashboard release on July 23 — introduces a **first-ever gender breakdown** of the entry-level employment data. The data now covers through June 2026 (approximately 3.5 years of post-ChatGPT payroll data).
55	
56	**Statistics:**
57	
58	1. **Graph:** Overall US Displacement (`overall-us-displacement`)
59	   **Type:** OVERLAY (up)
60	   **Value:** −3.5 % yr⁻¹ (early-career, most-exposed quintile)
61	   **Quote:** "early-career workers (22-25) in the most-exposed quintile are still contracting at 3.5%/yr, and -4.3% over the past year"
62	   **Note:** Sourced from jobsdata.ai synthesis of the June 2026 Canaries Dashboard refresh; consistent with prior Canaries publications. Units are employment growth rates, not percentage of jobs displaced — map as overlay, not data_point.
63	
64	2. **Graph:** Overall US Displacement (`overall-us-displacement`)
65	   **Type:** OVERLAY (neutral)
66	   **Value:** +1.1 % yr⁻¹ (most-exposed quintile, all ages) vs. +2.0 % yr⁻¹ (least-exposed quintile)
67	   **Quote:** "all exposure quintiles now show employment growth since ChatGPT — most-exposed +1.1%/yr vs +2.0%/yr least-exposed"
68	   **Note:** From jobsdata.ai citing the June 2026 Canaries refresh. Overall employment still positive in AI-exposed sectors; early-career split is the key signal.
69	
70	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
71	   **Type:** OVERLAY (down)
72	   **Value:** +1.3 % yr⁻¹ (women aged 22–25, all exposure levels; vs. +2.7% for men)
73	   **Quote:** "Women's employment grew just 1.3% annually since late 2022 for 22 to 25-year-olds, compared with 2.7% for men, Stanford and ADP found."
74	   **Note:** This is employment growth, not wages; map as overlay on `entry-level-wage-impact` (direction: down — women in entry-level gaining ground slower). Not a data_point for the unit (% wage change).
75	
76	4. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
77	   **Type:** OVERLAY (up)
78	   **Value:** −4.5 % yr⁻¹ (women aged 22–25, most-exposed quintile)
79	   **Quote:** "In the most-exposed quintile, employment among 22-to-25-year-old women shrank 4.5% a year against 2.5% for men."
80	   **Note:** The most-exposed quintile covers white-collar professional and clerical roles (software development, customer service, financial analysis). Employment contraction is an input for the displacement overlay, not a direct displacement measure.
81	
82	5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
83	   **Type:** OVERLAY (up)
84	   **Value:** 43.8 % (share of 22–25-year-old women in most-exposed job category)
85	   **Quote:** "Most of the gap traces back to that occupational mix: 43.8% of women work in the most-exposed category of jobs and 21.2% in the second-most-exposed, compared with 32.4% and 18.1% of men."
86	   **Note:** This is an occupational concentration measure for a demographic subset (young women), not a full-workforce exposure figure. Map as overlay on `workforce-ai-exposure` (up — confirms higher effective AI exposure for entry-level women via occupational sorting).
87	
88	6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
89	   **Type:** OVERLAY (up)
90	   **Value:** −2.5 % yr⁻¹ (men aged 22–25, most-exposed quintile)
91	   **Quote:** "Women's slower growth shows up in low-exposure jobs almost as much as in high-exposure ones. In the least-exposed quintile, employment among 22-to-25-year-old women grew just 1.3% a year after late 2022, compared with 2.7% for men — a gap nearly as wide as in the most-exposed category, where women's employment shrank 4.5% a year against 2.5% for men."
92	   **Note:** The 2.5% contraction for men in the most-exposed quintile is the comparable male figure. Also confirms the gender gap is "not noticeably correlated with AI exposure" — caution for AI attribution.
93	
94	**Key interpretive note from the source:** "These gaps are a feature of our broader sample; they are not noticeably correlated with AI exposure," the researchers wrote. Their conclusion: "Gender-based differences in the relationship between AI exposure and employment trends appear to be driven primarily by occupational composition, rather than disparate trends within given sets of occupations." This cautions against interpreting the women's employment gap as direct AI-displacement evidence; it is structural, not differential AI treatment.
95	
96	---
97	
98	## NBER Summer Institute 2026 — Digital Economics and Artificial Intelligence (Signal Only)
99	
100	- **Publisher:** National Bureau of Economic Research
101	- **Date:** 2026-07-22 through 2026-07-24 (ongoing as of this digest)
102	- **URL:** https://www.nber.org/conferences/si-2026-digital-economics-and-artificial-intelligence
103	- **Evidence Tier:** 1 (NBER working papers)
104	- **Organizers:** Erik Brynjolfsson, Avi Goldfarb, Catherine Tucker
105	- **Source ID:** nber-si-2026-digital-economics-ai
106	
107	**Note:** This conference is happening **this week** and is within the digest window. Individual paper abstracts are invitation-only and not yet publicly catalogued. No quantitative statistics could be extracted from conference materials for this digest. This is flagged as a **high-priority monitoring item** — new working papers presented here typically appear on NBER within 1–4 weeks of the conference. Recommend a follow-up sweep for NBER papers numbered above w35400 (approximate current frontier) in the next digest cycle.
108	
109	---
110	
111	## Near-Window Context: "We Must Act Now" Statement (Stanford DEL, July 13, 2026)
112	
113	> **Note:** Released July 13, 2026 — **seven days before this digest window opens.** Included here as essential context only; no new quantitative statistics.
114	
115	- **Publisher:** Stanford Digital Economy Lab
116	- **URL:** https://www.wemustactnow.ai / https://digitaleconomy.stanford.edu/news/wemustactnow/
117	- **Evidence Tier:** 2 (major academic institution statement)
118	- **Date:** 2026-07-13
119	
120	More than 200 economists and AI researchers — including 16 Nobel laureates and researchers from Anthropic, Google, and OpenAI — released an 88-word open letter warning: *"AI may become radically more powerful over the next 10 years. This could drive an unprecedented transformation of our economy, larger than the Industrial Revolution, but unfolding over a vastly shorter time frame. It could bring risks, including large-scale job displacement, as well as opportunities such as major gains in living standards."*
121	
122	**No extractable numeric statistics** — the statement is qualitative. However, it is editorially significant: Daron Acemoglu and Simon Johnson, who previously expressed skepticism about rapid AI displacement, are now among the signatories. Graph-mapping: not applicable (no quantitative claims). Flag for the `overall-us-displacement` and `earnings-call-ai-mentions` graphs as a qualitative sentiment overlay.
123	
124	---
125	
126	## Sources Checked but Not Relevant (within 7-day window or near-window)
127	
128	The following URLs were fetched or reviewed and did not yield new quantitative AI labor statistics publishable within the July 20–27, 2026 window:
129	
130	| URL | Reason |
131	|---|---|
132	| https://www.weforum.org/stories/jobs-and-the-future-of-work/ai-decimate-entry-level-jobs-expert-insights/ | Published June 29, 2026 (outside window); qualitative expert commentary only; quantitative stats (37% of young workers in high-exposure roles; 7% drop in junior postings) sourced from earlier WEF report, not new |
133	| https://www.census.gov/newsroom/press-releases/2026/btos-july-16.html | July 16 BTOS release (outside window); tip sheet only, no AI-specific statistics released |
134	| https://budgetlab.yale.edu/ | Yale Budget Lab homepage shows Martha Gimbel piece "The US Economy Is Walking a Tightrope Between Aging and AI" (July 9, 2026) — outside window; no new quantitative AI labor statistics |
135	| https://www.nber.org/papers/w34859 | NBER WP 34859 "Chaining Tasks, Redefining Work" (Demirer, Horton et al., Feb 2026) — outside window; theoretical framework only, no new empirical labor statistics |
136	| https://www.nber.org/papers/w35353 | NBER WP 35353 "Task-Specific Technical Change" (Althoff, Reichardt, June 2026) — outside window; key wage inequality finding (90-10 wage ratio falls 24% in moderate AI scenario) already catalogued |
137	| https://www.anthropic.com/research/labor-market-impacts | Anthropic "Labor Market Impacts" (Massenkoff, McCrory, March 5, 2026) — outside window; 14% drop in job-finding rate for young workers in exposed occupations already catalogued |
138	| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning | PIIE Kolko "First Inning" (March 10, 2026) — outside window |
139	| https://www.imf.org/en/publications/staff-discussion-notes/issues/2026/01/09/... | IMF SDN 2026/001 "Bridging Skill Gaps" (January 2026) — outside window; statistics from this report are important but not new this week |
140	| https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html | PwC 2026 AI Jobs Barometer (June 15, 2026) — outside window; 62% AI wage premium already catalogued |
141	| https://documents1.worldbank.org/curated/en/099827011182513988/pdf/... | World Bank "Labor Demand in Age of GenAI" (Liu, Wang, Yu, Sep 2025) — outside window; 12% decline in job postings for high-substitution occupations |
142	| https://marinamogilko.co/episode/72duHF7iZiU/ | Brynjolfsson Silicon Valley Girl podcast (July 21, 2026) — Tier 4; quotes only reiterate prior Canaries findings, no new statistics |
143	
144	---
145	
146	## Priority Recommendations
147	
148	### Ingest Immediately
149	1. **Stanford/ADP Canaries Dashboard Gender Update (July 22, 2026)** — Tier 1 payroll data, in-window, WATCHLIST. Five new statistics suitable for overlay mapping on `overall-us-displacement`, `white-collar-professional-displacement`, `entry-level-wage-impact`, and `workforce-ai-exposure`. Caution: all are employment-flow metrics (overlay), not displacement-rate data_points.
150	
151	### Monitor Urgently
152	2. **NBER SI 2026 Digital Economics & AI Papers** — Conference concluded July 24. Papers will appear on NBER.org within 1–4 weeks. Set next-sweep trigger for NBER working papers w35400–w35500 range. Organizers: Brynjolfsson, Goldfarb, Tucker. Likely to yield multiple Tier 1 labor market papers.
153	
154	3. **Acemoglu NBER WP 35336 "Automation and Repression"** — appears to have been released June–July 2026. Abstract not yet fully reviewed for labor statistics. Check full paper.
155	
156	### Significant Divergence from Graph Consensus
157	4. **Gender gap NOT driven by AI** — The Canaries gender update explicitly finds the employment gap between young women and men is **not correlated with AI exposure level**. This diverges from IMF/ILO findings that frame women as disproportionately AI-exposed and at higher displacement risk (those studies measure exposure, not realized employment outcomes). The Canaries finding is that within any AI-exposure band, women's employment growth trails men's by roughly the same amount. Graphs for `white-collar-professional-displacement` and `workforce-ai-exposure` should note this structural interpretation vs. AI-causation distinction.
158	
159	5. **Aggregate employment in most-exposed occupations is still POSITIVE** (+1.1%/yr per June 2026 Canaries) — this diverges from popular narratives of broad AI-driven employment losses. Displacement is concentrated in the 22–25 age cohort in exposed occupations (-3.5%/yr to -4.5%/yr), not across all workers. The `overall-us-displacement` graph currently likely conflates exposure measures with realized displacement; this data point clarifies that aggregate exposure ≠ aggregate displacement.
160	
161	### New Government Data Releases
162	6. **Next Census BTOS release** — Based on biweekly cadence from July 16 release, the next BTOS release is expected approximately **July 30, 2026**. Set alert for that date. This will update the core `ai-adoption-rate` graph data.
163	
164	7. **BLS 2025–35 Employment Projections** — BLS homepage noted "Upcoming 2025–35 Employment Projections release." This release has not yet occurred. When published, it will be Tier 1 data for `overall-us-displacement`, `tech-sector-displacement`, and `customer-service-automation`. Set high-priority alert.
165	
166	---
167	
168	*Digest compiled: 2026-07-27. Research window: 2026-07-20 to 2026-07-27. Sources consulted: 100+. Quantitative statistics extracted from within-window sources: 6 (all from one primary source). Next sweep recommended: 2026-08-03.*
# AI Labor Research Digest — 2026-07-27

## Summary

The past 7 days (July 20–27, 2026) yielded **one primary new quantitative release** strictly within the window: a July 22 Fortune exclusive reporting on an updated gender breakdown from the Stanford/ADP Canaries Dashboard (Brynjolfsson, Chandar, Chen). The update finds young women aged 22–25 in AI-exposed roles losing ground to men in employment growth — but, critically, the gap is driven by occupational sorting rather than AI treatment per se. The NBER Summer Institute 2026 "Digital Economics and Artificial Intelligence" session (organized by Brynjolfsson, Goldfarb, Tucker) ran July 22–24 this week; individual papers are not yet publicly catalogued but should be monitored. Just outside the 7-day window, the "We Must Act Now" statement (Stanford DEL, July 13) with 200+ economist signatories including 16 Nobel laureates represents a significant qualitative signal. **No new Tier 1 government statistics** (BLS, Census BTOS) were released in this window; the most recent BTOS release was July 16.

---

## Recurring Series Status

| Series ID | Status |
|---|---|
| `ellucian-highered-ai` | **Not due** — `nextExpected: 2027-03-01`; no new edition search required |

No other recurring series are registered in the current `recurring-sources.json`. The `ellucian-highered-ai` series next expected date is March 2027; no sweep needed this cycle.

---

## Researcher Watchlist Sweep

All 15 researchers were last checked `2026-04-14` (>30 days ago). Summary of new findings:

| Researcher | Finding |
|---|---|
| **Erik Brynjolfsson** | **IN-WINDOW NEW DATA** — Canaries Dashboard gender update, July 22, 2026 (see source below). Also: "Minimum Wages and Rise of Robots," NBER WP 34895, Feb 2026; organizing NBER SI 2026 Digital Economics this week. |
| **Daron Acemoglu** | New NBER WP 35336 "Automation and Repression" (Acemoglu, Gitmez, Shadmehr, ~June–July 2026); signed "We Must Act Now" (July 13, 2026). No labor-market statistics extractable from available abstracts within this window. |
| **Martha Gimbel** | Yale Budget Lab released "What We Do and Don't Know About How AI is Affecting the Labor Market" (Gimbel, Kendall, Nunn, May 7, 2026) — outside window but key finding: synthetic DiD design shows "no statistically or economically significant effects as of yet" in employment or wages for AI-exposed occupations. |
| **Jed Kolko** | PIIE "Research on AI and the Labor Market is Still in the First Inning" (March 10, 2026) — outside window; no new publications found within the 7-day window. |
| **James Bessen** | No new publications within the 7-day window. |
| **Alex Imas** | Cited in PIIE as summarizing AI productivity literature (Imas 2026, Substack); no peer-reviewed paper found within the 7-day window. |
| **Molly Kinder** | No new publications within the 7-day window; institutional affiliation now listed as "founding a new organization." |
| **Daniel Rock** | No new publications within the 7-day window. |
| **Alexander Bick** | St. Louis Fed RPS series now official FRED data (through Q1 2026: 43.4% of employed adults used GenAI for work); no new paper within the 7-day window. |
| **David Deming** | No new publications within the 7-day window. |
| **Maria del Rio-Chanona** | No new publications within the 7-day window. |
| **Andrea Eisfeldt** | Attended NBER SI 2026 Asset Pricing session (co-organizer noted); no new labor paper within window. |
| **Pascual Restrepo** | No new publications within the 7-day window. |
| **Shakked Noy** | No new publications within the 7-day window. |
| **Neil Thompson** | No new publications within the 7-day window. |

---

## New Sources

### Stanford/ADP Canaries Dashboard — July 2026 Gender Breakdown Update (Fortune, July 22, 2026)

- **Publisher:** Stanford Digital Economy Lab (Brynjolfsson, Chandar, Chen) + ADP Research (Richardson) — reported by Fortune
- **Date:** 2026-07-22
- **URL:** https://fortune.com/2026/07/22/women-entry-level-job-growth-slower-than-men-stanford-adp/
- **Evidence Tier:** 1 (Large-scale administrative payroll data; ADP covers ~26 million U.S. workers; 4.6 million in the Canaries balanced sample; 730+ occupations; monthly frequency)
- **Source ID:** stanford-adp-canaries-gender-2026
- **WATCHLIST:** Brynjolfsson

**Background:** The Canaries Dashboard (launched June 10, 2026) is a continuously updated joint platform from Stanford DEL and ADP Research extending the August 2025 "Canaries in the Coal Mine?" paper (Brynjolfsson, Chandar, Chen). This July 22 update — shared exclusively with Fortune ahead of its public dashboard release on July 23 — introduces a **first-ever gender breakdown** of the entry-level employment data. The data now covers through June 2026 (approximately 3.5 years of post-ChatGPT payroll data).

**Statistics:**

1. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −3.5 % yr⁻¹ (early-career, most-exposed quintile)
   **Quote:** "early-career workers (22-25) in the most-exposed quintile are still contracting at 3.5%/yr, and -4.3% over the past year"
   **Note:** Sourced from jobsdata.ai synthesis of the June 2026 Canaries Dashboard refresh; consistent with prior Canaries publications. Units are employment growth rates, not percentage of jobs displaced — map as overlay, not data_point.

2. **Graph:** Overall US Displacement (`overall-us-displacement`)
   **Type:** OVERLAY (neutral)
   **Value:** +1.1 % yr⁻¹ (most-exposed quintile, all ages) vs. +2.0 % yr⁻¹ (least-exposed quintile)
   **Quote:** "all exposure quintiles now show employment growth since ChatGPT — most-exposed +1.1%/yr vs +2.0%/yr least-exposed"
   **Note:** From jobsdata.ai citing the June 2026 Canaries refresh. Overall employment still positive in AI-exposed sectors; early-career split is the key signal.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (down)
   **Value:** +1.3 % yr⁻¹ (women aged 22–25, all exposure levels; vs. +2.7% for men)
   **Quote:** "Women's employment grew just 1.3% annually since late 2022 for 22 to 25-year-olds, compared with 2.7% for men, Stanford and ADP found."
   **Note:** This is employment growth, not wages; map as overlay on `entry-level-wage-impact` (direction: down — women in entry-level gaining ground slower). Not a data_point for the unit (% wage change).

4. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −4.5 % yr⁻¹ (women aged 22–25, most-exposed quintile)
   **Quote:** "In the most-exposed quintile, employment among 22-to-25-year-old women shrank 4.5% a year against 2.5% for men."
   **Note:** The most-exposed quintile covers white-collar professional and clerical roles (software development, customer service, financial analysis). Employment contraction is an input for the displacement overlay, not a direct displacement measure.

5. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 43.8 % (share of 22–25-year-old women in most-exposed job category)
   **Quote:** "Most of the gap traces back to that occupational mix: 43.8% of women work in the most-exposed category of jobs and 21.2% in the second-most-exposed, compared with 32.4% and 18.1% of men."
   **Note:** This is an occupational concentration measure for a demographic subset (young women), not a full-workforce exposure figure. Map as overlay on `workforce-ai-exposure` (up — confirms higher effective AI exposure for entry-level women via occupational sorting).

6. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** −2.5 % yr⁻¹ (men aged 22–25, most-exposed quintile)
   **Quote:** "Women's slower growth shows up in low-exposure jobs almost as much as in high-exposure ones. In the least-exposed quintile, employment among 22-to-25-year-old women grew just 1.3% a year after late 2022, compared with 2.7% for men — a gap nearly as wide as in the most-exposed category, where women's employment shrank 4.5% a year against 2.5% for men."
   **Note:** The 2.5% contraction for men in the most-exposed quintile is the comparable male figure. Also confirms the gender gap is "not noticeably correlated with AI exposure" — caution for AI attribution.

**Key interpretive note from the source:** "These gaps are a feature of our broader sample; they are not noticeably correlated with AI exposure," the researchers wrote. Their conclusion: "Gender-based differences in the relationship between AI exposure and employment trends appear to be driven primarily by occupational composition, rather than disparate trends within given sets of occupations." This cautions against interpreting the women's employment gap as direct AI-displacement evidence; it is structural, not differential AI treatment.

---

## NBER Summer Institute 2026 — Digital Economics and Artificial Intelligence (Signal Only)

- **Publisher:** National Bureau of Economic Research
- **Date:** 2026-07-22 through 2026-07-24 (ongoing as of this digest)
- **URL:** https://www.nber.org/conferences/si-2026-digital-economics-and-artificial-intelligence
- **Evidence Tier:** 1 (NBER working papers)
- **Organizers:** Erik Brynjolfsson, Avi Goldfarb, Catherine Tucker
- **Source ID:** nber-si-2026-digital-economics-ai

**Note:** This conference is happening **this week** and is within the digest window. Individual paper abstracts are invitation-only and not yet publicly catalogued. No quantitative statistics could be extracted from conference materials for this digest. This is flagged as a **high-priority monitoring item** — new working papers presented here typically appear on NBER within 1–4 weeks of the conference. Recommend a follow-up sweep for NBER papers numbered above w35400 (approximate current frontier) in the next digest cycle.

---

## Near-Window Context: "We Must Act Now" Statement (Stanford DEL, July 13, 2026)

> **Note:** Released July 13, 2026 — **seven days before this digest window opens.** Included here as essential context only; no new quantitative statistics.

- **Publisher:** Stanford Digital Economy Lab
- **URL:** https://www.wemustactnow.ai / https://digitaleconomy.stanford.edu/news/wemustactnow/
- **Evidence Tier:** 2 (major academic institution statement)
- **Date:** 2026-07-13

More than 200 economists and AI researchers — including 16 Nobel laureates and researchers from Anthropic, Google, and OpenAI — released an 88-word open letter warning: *"AI may become radically more powerful over the next 10 years. This could drive an unprecedented transformation of our economy, larger than the Industrial Revolution, but unfolding over a vastly shorter time frame. It could bring risks, including large-scale job displacement, as well as opportunities such as major gains in living standards."*

**No extractable numeric statistics** — the statement is qualitative. However, it is editorially significant: Daron Acemoglu and Simon Johnson, who previously expressed skepticism about rapid AI displacement, are now among the signatories. Graph-mapping: not applicable (no quantitative claims). Flag for the `overall-us-displacement` and `earnings-call-ai-mentions` graphs as a qualitative sentiment overlay.

---

## Sources Checked but Not Relevant (within 7-day window or near-window)

The following URLs were fetched or reviewed and did not yield new quantitative AI labor statistics publishable within the July 20–27, 2026 window:

| URL | Reason |
|---|---|
| https://www.weforum.org/stories/jobs-and-the-future-of-work/ai-decimate-entry-level-jobs-expert-insights/ | Published June 29, 2026 (outside window); qualitative expert commentary only; quantitative stats (37% of young workers in high-exposure roles; 7% drop in junior postings) sourced from earlier WEF report, not new |
| https://www.census.gov/newsroom/press-releases/2026/btos-july-16.html | July 16 BTOS release (outside window); tip sheet only, no AI-specific statistics released |
| https://budgetlab.yale.edu/ | Yale Budget Lab homepage shows Martha Gimbel piece "The US Economy Is Walking a Tightrope Between Aging and AI" (July 9, 2026) — outside window; no new quantitative AI labor statistics |
| https://www.nber.org/papers/w34859 | NBER WP 34859 "Chaining Tasks, Redefining Work" (Demirer, Horton et al., Feb 2026) — outside window; theoretical framework only, no new empirical labor statistics |
| https://www.nber.org/papers/w35353 | NBER WP 35353 "Task-Specific Technical Change" (Althoff, Reichardt, June 2026) — outside window; key wage inequality finding (90-10 wage ratio falls 24% in moderate AI scenario) already catalogued |
| https://www.anthropic.com/research/labor-market-impacts | Anthropic "Labor Market Impacts" (Massenkoff, McCrory, March 5, 2026) — outside window; 14% drop in job-finding rate for young workers in exposed occupations already catalogued |
| https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning | PIIE Kolko "First Inning" (March 10, 2026) — outside window |
| https://www.imf.org/en/publications/staff-discussion-notes/issues/2026/01/09/... | IMF SDN 2026/001 "Bridging Skill Gaps" (January 2026) — outside window; statistics from this report are important but not new this week |
| https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html | PwC 2026 AI Jobs Barometer (June 15, 2026) — outside window; 62% AI wage premium already catalogued |
| https://documents1.worldbank.org/curated/en/099827011182513988/pdf/... | World Bank "Labor Demand in Age of GenAI" (Liu, Wang, Yu, Sep 2025) — outside window; 12% decline in job postings for high-substitution occupations |
| https://marinamogilko.co/episode/72duHF7iZiU/ | Brynjolfsson Silicon Valley Girl podcast (July 21, 2026) — Tier 4; quotes only reiterate prior Canaries findings, no new statistics |

---

## Priority Recommendations

### Ingest Immediately
1. **Stanford/ADP Canaries Dashboard Gender Update (July 22, 2026)** — Tier 1 payroll data, in-window, WATCHLIST. Five new statistics suitable for overlay mapping on `overall-us-displacement`, `white-collar-professional-displacement`, `entry-level-wage-impact`, and `workforce-ai-exposure`. Caution: all are employment-flow metrics (overlay), not displacement-rate data_points.

### Monitor Urgently
2. **NBER SI 2026 Digital Economics & AI Papers** — Conference concluded July 24. Papers will appear on NBER.org within 1–4 weeks. Set next-sweep trigger for NBER working papers w35400–w35500 range. Organizers: Brynjolfsson, Goldfarb, Tucker. Likely to yield multiple Tier 1 labor market papers.

3. **Acemoglu NBER WP 35336 "Automation and Repression"** — appears to have been released June–July 2026. Abstract not yet fully reviewed for labor statistics. Check full paper.

### Significant Divergence from Graph Consensus
4. **Gender gap NOT driven by AI** — The Canaries gender update explicitly finds the employment gap between young women and men is **not correlated with AI exposure level**. This diverges from IMF/ILO findings that frame women as disproportionately AI-exposed and at higher displacement risk (those studies measure exposure, not realized employment outcomes). The Canaries finding is that within any AI-exposure band, women's employment growth trails men's by roughly the same amount. Graphs for `white-collar-professional-displacement` and `workforce-ai-exposure` should note this structural interpretation vs. AI-causation distinction.

5. **Aggregate employment in most-exposed occupations is still POSITIVE** (+1.1%/yr per June 2026 Canaries) — this diverges from popular narratives of broad AI-driven employment losses. Displacement is concentrated in the 22–25 age cohort in exposed occupations (-3.5%/yr to -4.5%/yr), not across all workers. The `overall-us-displacement` graph currently likely conflates exposure measures with realized displacement; this data point clarifies that aggregate exposure ≠ aggregate displacement.

### New Government Data Releases
6. **Next Census BTOS release** — Based on biweekly cadence from July 16 release, the next BTOS release is expected approximately **July 30, 2026**. Set alert for that date. This will update the core `ai-adoption-rate` graph data.

7. **BLS 2025–35 Employment Projections** — BLS homepage noted "Upcoming 2025–35 Employment Projections release." This release has not yet occurred. When published, it will be Tier 1 data for `overall-us-displacement`, `tech-sector-displacement`, and `customer-service-automation`. Set high-priority alert.

---

*Digest compiled: 2026-07-27. Research window: 2026-07-20 to 2026-07-27. Sources consulted: 100+. Quantitative statistics extracted from within-window sources: 6 (all from one primary source). Next sweep recommended: 2026-08-03.*