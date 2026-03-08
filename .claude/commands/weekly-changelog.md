# jobsdata.ai Weekly Changelog Generator
## Save to: `.claude/commands/weekly-changelog.md`

You are the steward and chronicler of **jobsdata.ai** — a public labor market signals dashboard tracking AI's impact on employment across 17 prediction graphs. Every Sunday evening you generate a weekly changelog that will be posted to LinkedIn on Monday morning to keep the Opportunity AI audience informed on what's changed, what data was added, and how the site has evolved.

Your outputs are professional, data-forward, and practitioner-first. Never hype. Never vague. Every claim traces to an actual commit or file diff.

**Repo:** `mz00m/ai-labor-predictions`  
**Site:** jobsdata.ai (deployed via Vercel)

---

## STEP 1 — Establish the Review Window

```bash
TODAY=$(date +%Y-%m-%d)
SINCE=$(date -d "7 days ago" +%Y-%m-%d 2>/dev/null || date -v-7d +%Y-%m-%d)
echo "Review window: $SINCE → $TODAY"
```

**Inaugural run only:** If today is on or before March 8, 2026, use `2026-03-01` as the start date and label this the "Founding Week" edition.

---

## STEP 2 — Pull All Commits via GitHub API

Fetch all commits in the review window:

```bash
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/mz00m/ai-labor-predictions/commits?since=${SINCE}T00:00:00Z&until=${TODAY}T23:59:59Z&per_page=100" \
  | jq '[.[] | {sha: .sha, date: .commit.author.date, message: .commit.message, author: .commit.author.name}]'
```

For each commit SHA returned, fetch the full diff:

```bash
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/mz00m/ai-labor-predictions/commits/<SHA>" \
  | jq '{
      message: .commit.message,
      date: .commit.author.date,
      stats: .stats,
      files: [.files[] | {
        filename: .filename,
        additions: .additions,
        deletions: .deletions,
        status: .status,
        patch: .patch
      }]
    }'
```

Store all commit data and file diffs for analysis in Steps 3–4.

**If `$GITHUB_TOKEN` is not set**, stop and print:
```
ERROR: GITHUB_TOKEN environment variable not found.
Add it to your .env.local or export it in your shell, then re-run.
```

---

## STEP 3 — Fetch Current Data File Snapshots

Pull the current state of key data files to cross-reference diffs:

```bash
# Confirmed sources registry
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/mz00m/ai-labor-predictions/contents/src/data/confirmed-sources.json" \
  | jq -r '.content' | base64 -d | jq .

# Last updated timestamp
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/mz00m/ai-labor-predictions/contents/src/data/last-updated.json" \
  | jq -r '.content' | base64 -d | jq .

# List all prediction graph files
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/mz00m/ai-labor-predictions/contents/src/data/predictions" \
  | jq '[.[] | .name]'
```

For any prediction JSON file touched in the commit diffs, fetch its full contents:

```bash
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/mz00m/ai-labor-predictions/contents/src/data/predictions/<FILENAME>" \
  | jq -r '.content' | base64 -d | jq .
```

---

## STEP 4 — Categorize All Changes

Work through every commit diff. Organize all findings into these six categories. If a category has no changes this week, note "Nothing this week" — do not pad or invent.

---

### A. New Research Sources Added

Look for additions to:
- `src/data/confirmed-sources.json` — new keys in the `sources` object
- `src/data/predictions/*.json` — new entries in any `sources[]` array

For each new source, capture:
- **Title** and **publisher**
- **Evidence tier** (1 = peer-reviewed, 2 = think tank/intl org, 3 = major press, 4 = blog/opinion)
- **Publication date**
- **Which prediction graphs it feeds** (`usedIn` field)
- **Key finding** (from `excerpt` field — paraphrase, don't quote verbatim)

---

### B. New Data Points & Overlay Signals

Look for new entries in:
- `history[]` arrays → plotted data points on graph trend lines
- `overlays[]` arrays → directional signals shown alongside charts

For each new entry, note:
- Which graph (use the slug → title table below)
- Value (for data points) or direction — `up`, `down`, `neutral` (for overlays)
- Evidence tier of the underlying source
- Whether it moved `currentConsensus`, `consensusRange`, or `weightedAverage`

**Graph title reference:**

| Slug | Title |
|------|-------|
| `overall-us-displacement` | Overall US Job Displacement by 2030 |
| `total-us-jobs-lost` | Total US Jobs Lost to AI as % of Labor Force |
| `white-collar-professional-displacement` | White-Collar Professional Displacement |
| `tech-sector-displacement` | Tech Sector Displacement |
| `creative-industry-displacement` | Creative Industry Displacement |
| `education-sector-displacement` | Education Sector Displacement |
| `healthcare-admin-displacement` | Healthcare Admin Displacement |
| `customer-service-automation` | Customer Service Automation |
| `median-wage-impact` | Median Wage Impact from AI |
| `geographic-wage-divergence` | AI Hub vs. Non-Hub Wage Divergence |
| `entry-level-wage-impact` | Entry-Level Wage Impact |
| `high-skill-wage-premium` | High-Skill AI Wage Premium |
| `freelancer-rate-impact` | Freelancer/Gig Worker Rate Impact |
| `ai-adoption-rate` | AI Adoption Rate Across US Companies |
| `genai-work-adoption` | Generative AI Adoption at Work |
| `workforce-ai-exposure` | US Workforce AI Exposure |
| `earnings-call-ai-mentions` | S&P 500 AI Workforce Mentions in Earnings Calls |

---

### C. Prediction Graph Structural Changes

Look for changes to metadata fields in prediction JSON files:
- `currentConsensus`, `consensusRange`, `weightedAverage` — note old vs. new value if discernible from the patch
- `title`, `description`, `unit`, `target` — editorial/structural changes
- Entirely new prediction graph files (`status: added` in diff)

---

### D. Site Pages & Features

Look for changes in:
- `src/app/` or `src/pages/` — new routes or page-level changes
- `src/components/` — UI components added, modified, or removed

Key components to name explicitly if changed: industry tiles, sparklines, hero section, About page, `/history` page, earnings call transcript viewer, Now/Next/Later framework tiles.

Describe each change in plain language — what it looked like before, what it looks like now, what it enables.

---

### E. Data Pipeline & Scripts

Look for changes in:
- `scripts/` — ingestion scripts, data processing utilities, transcript parsers
- `.github/workflows/` — CI/CD automation

Describe what changed and what capability it adds or fixes.

---

### F. Configuration & Infrastructure

Look for meaningful changes in:
- `package.json` — new dependencies or integrations
- `next.config.js`, `tailwind.config.ts` — framework-level config
- `.env.example` — new environment variables

Only surface changes that matter to a technical reader (e.g., a new API integration). Skip routine version bumps unless they're significant upgrades.

---

## STEP 5 — Compute Metrics

Calculate from the raw commit and diff data:

```
COMMIT ACTIVITY
  Total commits this week:         [N]
  Total files changed:             [N]
  Lines added:                     [N]
  Lines removed:                   [N]

DATA ADDITIONS
  New research sources added:      [N]
    Tier 1 (peer-reviewed):        [N]
    Tier 2 (think tank/intl org):  [N]
    Tier 3 (major press):          [N]
    Tier 4 (blog/opinion):         [N]
  New data points added:           [N]
  New overlay signals added:       [N]
  Prediction graphs updated:       [N]

SITE CHANGES
  New pages or features:           [N]
  Script/pipeline changes:         [N]
```

---

## STEP 6 — Draft the LinkedIn Post

Write a LinkedIn post using the exact structure below.

**Tone:** Smart, practitioner-first, data-forward. The audience includes philanthropy leaders, workforce development practitioners, economists, and policymakers tracking AI's labor market impact. No hype. No "excited to share." Lead with the most substantive finding of the week.

---

```
📊 jobsdata.ai Weekly Update — [DATE RANGE, e.g., "Week of March 3–9, 2026"]

[LEDE: 1–2 sentences. Lead with the most substantive finding or meaningful shift from this week. Not "we updated the site." Example: "A new Brookings Institution analysis added this week pushes the site's weighted estimate for white-collar displacement 4 points higher — consistent with a pattern of upward revision across three consecutive weeks of data."]

What's new this week:

🔬 Research & data
→ [N] new sources added ([tier breakdown — e.g., "1 peer-reviewed, 2 think tank"])
→ [Most notable source: publisher + key finding in one crisp sentence]
→ [Second notable source if warranted]
→ [N] new data points and [N] directional signals added across [N] prediction graphs

📈 Data movements
→ [Most significant shift: which graph, what direction, what it implies]
→ [Secondary shift if notable — skip if not]

🛠️ Site updates
→ [Key UI or feature change described in plain language]
→ [Secondary change if notable — skip if not]

By the numbers: [N] commits · [N] files changed · [N] new data points · [N] sources added

[CLOSING: 2–3 sentences situating this week's updates in the broader context of the initiative. What questions is the data raising? What should practitioners watch for? Keep it substantive and forward-looking — not promotional.]

🔗 jobsdata.ai — tracking AI's real impact on work and wages

#AIandWork #FutureOfWork #LaborMarket #EconomicMobility #WorkforceDevelopment #OpportunityAI
```

---

## STEP 7 — Save Outputs

Create `changelog/` at the repo root if it doesn't exist, then save two files:

**1. Full internal changelog:**
Filename: `changelog/YYYY-MM-DD-weekly-changelog.md`

Include:
- Review window and run timestamp
- Full metrics table
- All categorized changes with specifics (commit SHAs, filenames, values)
- Raw commit list (SHA | date | message)
- LinkedIn post draft at the bottom

**2. LinkedIn post (publishable):**
Filename: `changelog/YYYY-MM-DD-linkedin-post.txt`

Plain text only. No markdown. No asterisks. No headers. Ready to copy-paste directly into LinkedIn.

After saving both files, print their paths and confirm success.

---

## RULES

1. **Never fabricate.** Every claim must trace to an actual commit SHA or file diff. If a category has no changes this week, say so — do not pad.
2. **Be specific.** "Redesigned industry tiles using a Now/Next/Later framework" beats "made improvements to the site."
3. **Lead with data.** The LinkedIn post should read like it comes from a researcher, not a marketer.
4. **Accurate counts.** Double-check all metrics against actual commit data before writing them.
5. **Tier honesty.** Always note evidence tier when describing sources — it signals rigor to the audience.
6. **No changes this week?** Write a brief honest "quiet week" post, save both files, and confirm.

---

## SCHEDULING

To run automatically every Sunday at 6:00 PM:

```bash
crontab -e
# Add this line (adjust repo path):
0 18 * * 0 cd /path/to/ai-labor-predictions && claude --print "/weekly-changelog" >> ~/logs/changelog-cron.log 2>&1
```

To run manually any Sunday evening:
```
/weekly-changelog
```
