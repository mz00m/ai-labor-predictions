1	# AI Labor Research Digest — 2026-04-20
2	
3	## Summary
4	
5	This digest covers the period **2026-04-13 through 2026-04-20**. One Tier 1 source fell squarely within the window: a Federal Reserve Bank of New York (Liberty Street Economics) post published April 14, 2026, reporting results from the November 2025 Survey of Consumer Expectations (SCE). It provides the freshest nationally representative data on U.S. worker-level GenAI adoption rates (39%), the sharp income gradient of AI tool access, productivity self-assessments, and workers' monetary valuations of AI training access (median WTP 11.4% of salary; median required premium to relinquish access 15%). The rest of the window was quiet: no new BLS, Census BTOS AI-module, or NBER papers appeared between April 13–20. The Guardian published an opinion piece on April 16 within the window, but it contained no original quantitative data. The U.S. Census Bureau's first dedicated BTOS AI supplement is scheduled for release April 23, 2026 — one week ahead.
6	
7	---
8	
9	## New Sources
10	
11	### Use of Gen AI in the Workplace and the Value of Access to Training
12	- **Publisher:** Federal Reserve Bank of New York — Liberty Street Economics
13	- **Date:** 2026-04-14
14	- **URL:** https://libertystreeteconomics.newyorkfed.org/2026/04/use-of-gen-ai-in-the-workplace-and-the-value-of-access-to-training/
15	- **Evidence Tier:** 1 (Federal Reserve Bank — nationally representative survey)
16	- **Source ID:** nyfed-sce-genai-training-2026
17	
18	**Background:** Authors Ali Hashim, Gizem Kosar, and Wilbert van der Klaauw administered a supplemental module in the November 2025 Survey of Consumer Expectations (SCE), a rotating probability panel designed to be nationally representative of the U.S. population. The module asked employed respondents about: (1) current AI tool usage in their job; (2) productivity effects experienced; (3) access to employer-provided AI training; and (4) willingness to pay for AI training access, using a compensating-differential design. All statistics below are from this single survey instrument and data collection period.
19	
20	---
21	
22	**Statistics:**
23	
24	1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
25	   **Type:** DATA_POINT
26	   **Value:** 39 %
27	   **Unit:** % of employed adults reporting AI tool use in current or recent job
28	   **Quote:** "Among currently employed respondents, 39 percent report that they are either using AI tools in their current job or have used AI tools in their jobs in the last twelve months."
29	   **Publication date:** 2026-04-14
30	
31	2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
32	   **Type:** OVERLAY (up)
33	   **Value:** 24.2 %
34	   **Unit:** % salary premium required to give up employer-provided AI training access
35	   **Quote:** "workers who already have access to training...report that they would require a 24.2 percent salary increase to accept an otherwise identical job that doesn't offer access to any AI training, with a median of 15 percent."
36	   **Publication date:** 2026-04-14
37	   **Mapping note:** This is a compensating differential measuring the market value of AI training access among workers who have it. It is a leading indicator of the wage premium embedded in AI-augmented roles. Classified OVERLAY (not DATA_POINT) because the unit is a WTP measure rather than a directly observed wage premium over median.
38	
39	3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
40	   **Type:** OVERLAY (up)
41	   **Value:** 11.4 %
42	   **Unit:** % of salary workers without AI training would forego to gain access
43	   **Quote:** "Among workers who currently lack access to training, the average willingness to pay (WTP) for gaining this access is 11.4 percent of current salary."
44	   **Publication date:** 2026-04-14
45	   **Mapping note:** Workers without AI training disproportionately include entry-level, younger, lower-income workers. The post states: "younger workers, non-white workers, those without a college degree, and those with less than one year of job tenure express significantly higher willingness to pay for having access to training in AI skills." The 11.4% WTP figure is the most applicable entry-level signal in this dataset.
46	
47	4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
48	   **Type:** OVERLAY (neutral — documents within-sample heterogeneity)
49	   **Value:** 66.3 % (top earners, >$200k) vs. 15.9 % (low earners, <$50k)
50	   **Unit:** % within income bracket reporting AI tool use at work
51	   **Quote:** "AI adoption rises from 15.9 percent among workers earning under $50,000 to 66.3 percent among those earning over $200,000 annually."
52	   **Publication date:** 2026-04-14
53	   **Mapping note:** Documents the 4x disparity in AI adoption by income, informing distributional interpretation of the aggregate 39% figure.
54	
55	5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
56	   **Type:** OVERLAY (down)
57	   **Value:** 48 % (share lacking AI tool access or explicitly prohibited)
58	   **Unit:** % of employed workers without workplace AI tool access (37%) or with employer prohibition (11%)
59	   **Quote:** "37 percent of employed respondents say their workplace does not offer AI tools, and an additional 11 percent say their employer actively prohibits their use."
60	   **Publication date:** 2026-04-14
61	   **Mapping note:** This is a worker-level supply-side constraint on AI adoption. Nearly half (48%) of employed workers are blocked from workplace AI tool use, indicating that headline firm-level adoption rates overstate actual workforce penetration. Classified OVERLAY (not DATA_POINT) because the slug tracks firm-level adoption, not worker access.
62	
63	6. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
64	   **Type:** OVERLAY (up)
65	   **Value:** 62 %
66	   **Unit:** % of all respondents expecting AI to increase unemployment in next 12 months
67	   **Quote:** "Around 62 percent of all respondents believe the unemployment rate will increase over the next twelve months due to AI, while around 11.6 percent expect it will decrease due to AI."
68	   **Publication date:** 2026-04-14
69	   **Mapping note:** Expectation/sentiment measure, not a measured exposure rate. Classified OVERLAY. The high share (62%) reflects broad public perception of AI labor market exposure and is directionally informative.
70	
71	7. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
72	   **Type:** OVERLAY (up)
73	   **Value:** 58.7 %
74	   **Unit:** % of college graduates reporting AI tool use at work
75	   **Quote:** "college graduates are more than twice as likely to have used AI tools at work in the past twelve months as those without a college degree (58.7 percent versus 22.9 percent)."
76	   **Publication date:** 2026-04-14
77	   **Mapping note:** Confirms concentration of AI exposure in the college-educated white-collar workforce (the primary population of the displacement graph). Classified OVERLAY because this is adoption/usage, not measured displacement.
78	
79	---
80	
81	## Sources Checked but Not Relevant / Outside Window
82	
83	| Source | Date | Issue |
84	|---|---|---|
85	| Federal Reserve Board FEDS Note — "Monitoring AI Adoption in the U.S. Economy" (Allen, 2026) | **2026-04-03** | **10 days before window opens.** Rich Tier 1 data: BTOS 18% firm adoption; RPS 41% GenAI work adoption; SBU 78% employment-weighted. **Strongly recommend ingesting separately.** |
86	| BCG — "AI Will Reshape More Jobs Than It Replaces" | **2026-04-03** | **10 days before window opens.** Tier 2 microeconomic model: 50–55% of US jobs reshaped in 2–3 years; 10–15% vulnerable to elimination in 5 years. **Strongly recommend ingesting separately.** |
87	| Brookings/GovAI/NBER — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement" (Manning, Aguirre, Muro, Methkupally) | 2026-01-21 | Outside window. Key figure: 6.1 million workers face high AI exposure AND low adaptive capacity (3.9% of sampled workforce). |
88	| NBER WP 34836 — "Firm Data on AI" (Yotzov, Barrero, Bloom et al.) | 2026-02 | Outside window. ~70% of firms use AI; 80%+ report no 3-year employment/productivity impact; executives forecast −0.7% employment, +1.4% productivity over next 3 years. |
89	| NBER WP 34859 — "Chaining Tasks, Redefining Work" (Demirer, Horton, Immorlica et al.) | 2026-02 | Outside window. Theoretical model; limited extractable statistics. |
90	| IMF SDN/2026/001 — "Bridging Skill Gaps for the Future" (Jaumotte et al.) | 2026-01 | Outside window. Tier 1. Key: −3.6% employment in high-AI-exposure, low-complementarity occupations (5-year horizon); +3 to 3.4% wage premium from new AI skills. |
91	| phys.org — "Industries most exposed to AI are not only seeing productivity gains but jobs and wage growth too" | April 2026 (exact date unconfirmed) | Could not confirm date is within April 13–20 window; article was not directly fetchable. Reports a 2026 academic paper: +10% productivity, +3.9% job growth, +4.8% wage growth per standard deviation of AI exposure (2017–2024). If date is confirmed ≥ April 13, this would be a high-priority Tier 2 ingest. |
92	| The Guardian — "AI is destroying jobs – and the energy crisis could make that much worse" (Larry Elliott) | **2026-04-16** | ✅ Within window. **Tier 4 opinion column.** No original quantitative statistics. Not ingested. |
93	| CNN — "AI-driven job losses may leave lasting scars" (Goldman Sachs study summary) | 2026-04-07 | Outside window by 6 days. Goldman Sachs study: technology-displaced workers' earnings 10pp below peers at 10 years; scarring amplified during recessions. |
94	| Forbes — "Companies Cut 60,000 Jobs In March—And AI Is Largely To Blame" | 2026-04-02 | Outside window. Challenger, Gray & Christmas: AI cited in 25% of March 2026 job-cut announcements; 60,620 total U.S. cuts. |
95	| Census Bureau Tip Sheet TP26-08 | **2026-04-17** | ✅ Within window. No AI statistics yet. Confirms: "New questions on artificial intelligence (AI) were added November 17 and new AI supplemental content will be released April 23." |
96	| SSRN/Josephine Nartey — "AI Job Displacement Analysis 2025-2030" | Undated (posted ~early 2026) | **Tier 4.** Unreviewed SSRN paper with no institutional affiliation; methodology unclear; numbers appear to aggregate from secondary sources. Not ingested. |
97	| electroiq.com, almcorp.com, designrush.com, sqmagazine.co.uk, click-vision.com, aimultiple.com | Various | **Tier 4.** Aggregator/SEO sites. No original primary data. Not ingested. |
98	
99	---
100	
101	## Priority Recommendations
102	
103	### 🔴 Ingest Immediately (Tier 1, within window)
104	
105	**NY Fed Liberty Street Economics — "Use of Gen AI in the Workplace and the Value of Access to Training" (2026-04-14)**
106	- The 39% GenAI work adoption rate is the freshest nationally representative individual-level DATA_POINT for `genai-work-adoption`.
107	- The salary premium data (24.2% to relinquish; 11.4% WTP to gain) are novel compensating-differential estimates with strong implications for wage premium and entry-level wage graphs.
108	- Key policy-relevant finding: 48% of employed workers lack access to or are prohibited from using AI tools, constraining diffusion rates.
109	
110	---
111	
112	### 🟡 Prioritize for Immediate Retroactive Ingestion (Tier 1–2, just outside window)
113	
114	**1. Federal Reserve Board FEDS Note — "Monitoring AI Adoption in the U.S. Economy" (2026-04-03)**
115	- Synthesizes three nationally representative surveys; provides the authoritative reconciliation of divergent adoption estimates.
116	- `ai-adoption-rate` DATA_POINT: 18% firm-level (BTOS), 41% individual GenAI (RPS), 78% employment-weighted firm (SBU).
117	
118	**2. BCG — "AI Will Reshape More Jobs Than It Replaces" (2026-04-03)**
119	- Proprietary microeconomic model using BLS January 2026 employment as base (165 million jobs, 1,500 roles via Revelio Labs).
120	- Key statistics: 50–55% of US jobs reshaped in 2–3 years (up); 10–15% eliminated over 5 years (relevant to `total-us-jobs-lost` and `overall-us-displacement`). This is roughly double Goldman Sachs' 6–7% displacement estimate — a significant divergence worth flagging on graphs.
121	
122	**3. IMF SDN/2026/001 — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age" (Jaumotte et al., January 2026)**
123	- Highest-quality international Tier 1 source of Q1 2026.
124	- Downward employment signal for `entry-level-wage-impact` and `white-collar-professional-displacement`: employment levels 3.6% lower in regions with high AI-skill demand vs. comparable regions after 5 years (high-exposure, low-complementarity occupations only).
125	- Wage overlay for multiple graphs: new skills associated with 3–3.4% higher wages in U.S./UK job postings; AI-developer skills command 8%+ premium in U.S.
126	
127	---
128	
129	### 📅 Upcoming Data Releases to Monitor
130	
131	**U.S. Census Bureau BTOS AI Supplement — Expected April 23, 2026**
132	- First release under revised November 2025 question wording (AI in "any business function," replacing narrower "producing goods or services").
133	- Will be the authoritative government DATA_POINT for `ai-adoption-rate`. Set a calendar alert.
134	
135	---
136	
137	### ⚠️ Divergence Alerts
138	
139	| Issue | Description |
140	|---|---|
141	| BCG 10–15% elimination vs. Goldman 6–7% | BCG's 5-year estimate is roughly double Goldman Sachs' widely-cited displacement figure. Different methodologies, but the gap should be flagged explicitly on `total-us-jobs-lost` and `overall-us-displacement` graphs. |
142	| IMF downward employment vs. "AI creates jobs" narratives | IMF finds −3.6% employment (5-year) in high-exposure, low-complementarity occupations — at odds with augmentation-optimist overlays on several graphs. |
143	| BTOS 18% (firms) vs. RPS 41% (workers) vs. SBU 78% (employment-weighted) | All three are valid but measure different things. Ensures `ai-adoption-rate` graph context notes diverge significantly by methodology. |
144	| NY Fed SCE 39% vs. BTOS prior 3.8% | The magnitude difference is largely explained by question-wording change (narrow production vs. broad any-function), but still informative for graph trend lines. |
Here is the complete, verbatim contents of `digest.md`:

---

# AI Labor Research Digest — 2026-04-20

## Summary

This digest covers the period **2026-04-13 through 2026-04-20**. One Tier 1 source fell squarely within the window: a Federal Reserve Bank of New York (Liberty Street Economics) post published April 14, 2026, reporting results from the November 2025 Survey of Consumer Expectations (SCE). It provides the freshest nationally representative data on U.S. worker-level GenAI adoption rates (39%), the sharp income gradient of AI tool access, productivity self-assessments, and workers' monetary valuations of AI training access (median WTP 11.4% of salary; median required premium to relinquish access 15%). The rest of the window was quiet: no new BLS, Census BTOS AI-module, or NBER papers appeared between April 13–20. The Guardian published an opinion piece on April 16 within the window, but it contained no original quantitative data. The U.S. Census Bureau's first dedicated BTOS AI supplement is scheduled for release April 23, 2026 — one week ahead.

---

## New Sources

### Use of Gen AI in the Workplace and the Value of Access to Training
- **Publisher:** Federal Reserve Bank of New York — Liberty Street Economics
- **Date:** 2026-04-14
- **URL:** https://libertystreeteconomics.newyorkfed.org/2026/04/use-of-gen-ai-in-the-workplace-and-the-value-of-access-to-training/
- **Evidence Tier:** 1 (Federal Reserve Bank — nationally representative survey)
- **Source ID:** nyfed-sce-genai-training-2026

**Background:** Authors Ali Hashim, Gizem Kosar, and Wilbert van der Klaauw administered a supplemental module in the November 2025 Survey of Consumer Expectations (SCE), a rotating probability panel designed to be nationally representative of the U.S. population. The module asked employed respondents about: (1) current AI tool usage in their job; (2) productivity effects experienced; (3) access to employer-provided AI training; and (4) willingness to pay for AI training access, using a compensating-differential design. All statistics below are from this single survey instrument and data collection period.

---

**Statistics:**

1. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** DATA_POINT
   **Value:** 39 %
   **Unit:** % of employed adults reporting AI tool use in current or recent job
   **Quote:** "Among currently employed respondents, 39 percent report that they are either using AI tools in their current job or have used AI tools in their jobs in the last twelve months."
   **Publication date:** 2026-04-14

2. **Graph:** High-Skill Wage Premium (`high-skill-wage-premium`)
   **Type:** OVERLAY (up)
   **Value:** 24.2 %
   **Unit:** % salary premium required to give up employer-provided AI training access
   **Quote:** "workers who already have access to training...report that they would require a 24.2 percent salary increase to accept an otherwise identical job that doesn't offer access to any AI training, with a median of 15 percent."
   **Publication date:** 2026-04-14
   **Mapping note:** This is a compensating differential measuring the market value of AI training access among workers who have it. It is a leading indicator of the wage premium embedded in AI-augmented roles. Classified OVERLAY (not DATA_POINT) because the unit is a WTP measure rather than a directly observed wage premium over median.

3. **Graph:** Entry-Level Wage Impact (`entry-level-wage-impact`)
   **Type:** OVERLAY (up)
   **Value:** 11.4 %
   **Unit:** % of salary workers without AI training would forego to gain access
   **Quote:** "Among workers who currently lack access to training, the average willingness to pay (WTP) for gaining this access is 11.4 percent of current salary."
   **Publication date:** 2026-04-14
   **Mapping note:** Workers without AI training disproportionately include entry-level, younger, lower-income workers. The post states: "younger workers, non-white workers, those without a college degree, and those with less than one year of job tenure express significantly higher willingness to pay for having access to training in AI skills." The 11.4% WTP figure is the most applicable entry-level signal in this dataset.

4. **Graph:** GenAI Work Adoption (`genai-work-adoption`)
   **Type:** OVERLAY (neutral — documents within-sample heterogeneity)
   **Value:** 66.3 % (top earners, >$200k) vs. 15.9 % (low earners, <$50k)
   **Unit:** % within income bracket reporting AI tool use at work
   **Quote:** "AI adoption rises from 15.9 percent among workers earning under $50,000 to 66.3 percent among those earning over $200,000 annually."
   **Publication date:** 2026-04-14
   **Mapping note:** Documents the 4x disparity in AI adoption by income, informing distributional interpretation of the aggregate 39% figure.

5. **Graph:** AI Adoption Rate (`ai-adoption-rate`)
   **Type:** OVERLAY (down)
   **Value:** 48 % (share lacking AI tool access or explicitly prohibited)
   **Unit:** % of employed workers without workplace AI tool access (37%) or with employer prohibition (11%)
   **Quote:** "37 percent of employed respondents say their workplace does not offer AI tools, and an additional 11 percent say their employer actively prohibits their use."
   **Publication date:** 2026-04-14
   **Mapping note:** This is a worker-level supply-side constraint on AI adoption. Nearly half (48%) of employed workers are blocked from workplace AI tool use, indicating that headline firm-level adoption rates overstate actual workforce penetration. Classified OVERLAY (not DATA_POINT) because the slug tracks firm-level adoption, not worker access.

6. **Graph:** Workforce AI Exposure (`workforce-ai-exposure`)
   **Type:** OVERLAY (up)
   **Value:** 62 %
   **Unit:** % of all respondents expecting AI to increase unemployment in next 12 months
   **Quote:** "Around 62 percent of all respondents believe the unemployment rate will increase over the next twelve months due to AI, while around 11.6 percent expect it will decrease due to AI."
   **Publication date:** 2026-04-14
   **Mapping note:** Expectation/sentiment measure, not a measured exposure rate. Classified OVERLAY. The high share (62%) reflects broad public perception of AI labor market exposure and is directionally informative.

7. **Graph:** White-Collar Professional Displacement (`white-collar-professional-displacement`)
   **Type:** OVERLAY (up)
   **Value:** 58.7 %
   **Unit:** % of college graduates reporting AI tool use at work
   **Quote:** "college graduates are more than twice as likely to have used AI tools at work in the past twelve months as those without a college degree (58.7 percent versus 22.9 percent)."
   **Publication date:** 2026-04-14
   **Mapping note:** Confirms concentration of AI exposure in the college-educated white-collar workforce (the primary population of the displacement graph). Classified OVERLAY because this is adoption/usage, not measured displacement.

---

## Sources Checked but Not Relevant / Outside Window

| Source | Date | Issue |
|---|---|---|
| Federal Reserve Board FEDS Note — "Monitoring AI Adoption in the U.S. Economy" (Allen, 2026) | **2026-04-03** | **10 days before window opens.** Rich Tier 1 data: BTOS 18% firm adoption; RPS 41% GenAI work adoption; SBU 78% employment-weighted. **Strongly recommend ingesting separately.** |
| BCG — "AI Will Reshape More Jobs Than It Replaces" | **2026-04-03** | **10 days before window opens.** Tier 2 microeconomic model: 50–55% of US jobs reshaped in 2–3 years; 10–15% vulnerable to elimination in 5 years. **Strongly recommend ingesting separately.** |
| Brookings/GovAI/NBER — "Measuring US Workers' Capacity to Adapt to AI-Driven Job Displacement" (Manning, Aguirre, Muro, Methkupally) | 2026-01-21 | Outside window. Key figure: 6.1 million workers face high AI exposure AND low adaptive capacity (3.9% of sampled workforce). |
| NBER WP 34836 — "Firm Data on AI" (Yotzov, Barrero, Bloom et al.) | 2026-02 | Outside window. ~70% of firms use AI; 80%+ report no 3-year employment/productivity impact; executives forecast −0.7% employment, +1.4% productivity over next 3 years. |
| NBER WP 34859 — "Chaining Tasks, Redefining Work" (Demirer, Horton, Immorlica et al.) | 2026-02 | Outside window. Theoretical model; limited extractable statistics. |
| IMF SDN/2026/001 — "Bridging Skill Gaps for the Future" (Jaumotte et al.) | 2026-01 | Outside window. Tier 1. Key: −3.6% employment in high-AI-exposure, low-complementarity occupations (5-year horizon); +3 to 3.4% wage premium from new AI skills. |
| phys.org — "Industries most exposed to AI are not only seeing productivity gains but jobs and wage growth too" | April 2026 (exact date unconfirmed) | Could not confirm date is within April 13–20 window; article was not directly fetchable. Reports a 2026 academic paper: +10% productivity, +3.9% job growth, +4.8% wage growth per standard deviation of AI exposure (2017–2024). If date is confirmed ≥ April 13, this would be a high-priority Tier 2 ingest. |
| The Guardian — "AI is destroying jobs – and the energy crisis could make that much worse" (Larry Elliott) | **2026-04-16** | ✅ Within window. **Tier 4 opinion column.** No original quantitative statistics. Not ingested. |
| CNN — "AI-driven job losses may leave lasting scars" (Goldman Sachs study summary) | 2026-04-07 | Outside window by 6 days. Goldman Sachs study: technology-displaced workers' earnings 10pp below peers at 10 years; scarring amplified during recessions. |
| Forbes — "Companies Cut 60,000 Jobs In March—And AI Is Largely To Blame" | 2026-04-02 | Outside window. Challenger, Gray & Christmas: AI cited in 25% of March 2026 job-cut announcements; 60,620 total U.S. cuts. |
| Census Bureau Tip Sheet TP26-08 | **2026-04-17** | ✅ Within window. No AI statistics yet. Confirms: "New questions on artificial intelligence (AI) were added November 17 and new AI supplemental content will be released April 23." |
| SSRN/Josephine Nartey — "AI Job Displacement Analysis 2025-2030" | Undated (posted ~early 2026) | **Tier 4.** Unreviewed SSRN paper with no institutional affiliation; methodology unclear; numbers appear to aggregate from secondary sources. Not ingested. |
| electroiq.com, almcorp.com, designrush.com, sqmagazine.co.uk, click-vision.com, aimultiple.com | Various | **Tier 4.** Aggregator/SEO sites. No original primary data. Not ingested. |

---

## Priority Recommendations

### 🔴 Ingest Immediately (Tier 1, within window)

**NY Fed Liberty Street Economics — "Use of Gen AI in the Workplace and the Value of Access to Training" (2026-04-14)**
- The 39% GenAI work adoption rate is the freshest nationally representative individual-level DATA_POINT for `genai-work-adoption`.
- The salary premium data (24.2% to relinquish; 11.4% WTP to gain) are novel compensating-differential estimates with strong implications for wage premium and entry-level wage graphs.
- Key policy-relevant finding: 48% of employed workers lack access to or are prohibited from using AI tools, constraining diffusion rates.

---

### 🟡 Prioritize for Immediate Retroactive Ingestion (Tier 1–2, just outside window)

**1. Federal Reserve Board FEDS Note — "Monitoring AI Adoption in the U.S. Economy" (2026-04-03)**
- Synthesizes three nationally representative surveys; provides the authoritative reconciliation of divergent adoption estimates.
- `ai-adoption-rate` DATA_POINT: 18% firm-level (BTOS), 41% individual GenAI (RPS), 78% employment-weighted firm (SBU).

**2. BCG — "AI Will Reshape More Jobs Than It Replaces" (2026-04-03)**
- Proprietary microeconomic model using BLS January 2026 employment as base (165 million jobs, 1,500 roles via Revelio Labs).
- Key statistics: 50–55% of US jobs reshaped in 2–3 years (up); 10–15% eliminated over 5 years (relevant to `total-us-jobs-lost` and `overall-us-displacement`). This is roughly double Goldman Sachs' 6–7% displacement estimate — a significant divergence worth flagging on graphs.

**3. IMF SDN/2026/001 — "Bridging Skill Gaps for the Future: New Jobs Creation in the AI Age" (Jaumotte et al., January 2026)**
- Highest-quality international Tier 1 source of Q1 2026.
- Downward employment signal for `entry-level-wage-impact` and `white-collar-professional-displacement`: employment levels 3.6% lower in regions with high AI-skill demand vs. comparable regions after 5 years (high-exposure, low-complementarity occupations only).
- Wage overlay for multiple graphs: new skills associated with 3–3.4% higher wages in U.S./UK job postings; AI-developer skills command 8%+ premium in U.S.

---

### 📅 Upcoming Data Releases to Monitor

**U.S. Census Bureau BTOS AI Supplement — Expected April 23, 2026**
- First release under revised November 2025 question wording (AI in "any business function," replacing narrower "producing goods or services").
- Will be the authoritative government DATA_POINT for `ai-adoption-rate`. Set a calendar alert.

---

### ⚠️ Divergence Alerts

| Issue | Description |
|---|---|
| BCG 10–15% elimination vs. Goldman 6–7% | BCG's 5-year estimate is roughly double Goldman Sachs' widely-cited displacement figure. Different methodologies, but the gap should be flagged explicitly on `total-us-jobs-lost` and `overall-us-displacement` graphs. |
| IMF downward employment vs. "AI creates jobs" narratives | IMF finds −3.6% employment (5-year) in high-exposure, low-complementarity occupations — at odds with augmentation-optimist overlays on several graphs. |
| BTOS 18% (firms) vs. RPS 41% (workers) vs. SBU 78% (employment-weighted) | All three are valid but measure different things. Ensures `ai-adoption-rate` graph context notes diverge significantly by methodology. |
| NY Fed SCE 39% vs. BTOS prior 3.8% | The magnitude difference is largely explained by question-wording change (narrow production vs. broad any-function), but still informative for graph trend lines. |