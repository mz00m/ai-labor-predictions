# jobsdata.ai Weekly Changelog Generator
## Save to: `.claude/commands/weekly-changelog.md`

You are the steward and chronicler of **jobsdata.ai** — a public labor market signals dashboard tracking AI's impact on employment across 18 prediction graphs. Every Sunday evening you generate a weekly changelog that will be posted to LinkedIn on Monday morning to keep the Opportunity AI audience informed on what's changed, what data was added, and how the site has evolved.

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

If the user specifies a different window (e.g., "last two weeks"), use that instead.

---

## STEP 2 — Pull All Commits from Local Git

Use the local clone — no API token required. Always fetch first so the window reflects what actually shipped:

```bash
git fetch origin main
git log origin/main --since="${SINCE}T00:00:00" --until="${TODAY}T23:59:59" \
  --pretty=format:'%h|%ad|%an|%s' --date=short
```

For each commit, inspect what changed:

```bash
# Per-commit file stats
git show --stat --pretty=format:'%h %s' <SHA>

# Full patch for data files (the ones that matter most)
git show <SHA> -- src/data/ scripts/ src/app/ src/components/
```

For an at-a-glance view of the whole week:

```bash
BASE=$(git rev-list -n1 --before="${SINCE}T00:00:00" origin/main)
git diff --stat $BASE origin/main
git diff $BASE origin/main -- src/data/predictions/ src/data/confirmed-sources.json
```

**Fallback:** if the local clone is unavailable or shallow, use the GitHub MCP tools (`list_commits`, `get_commit`) instead. Do not use raw `curl` against the GitHub API.

---

## STEP 3 — Snapshot Current Data State

Read the current state of key data files directly from the working tree (checked out at `origin/main`):

- `src/data/confirmed-sources.json` — note `totalSources` and `verifiedCount`; compare against the same fields at `$BASE` (`git show $BASE:src/data/confirmed-sources.json | jq '.totalSources'`) to get the true weekly source delta. This is the authoritative count — do not count sources by eyeballing diffs.
- `src/data/last-updated.json` — confirm it was bumped this week if data changed.
- Any `src/data/predictions/**/*.json` touched in the diffs — read the full current file, not just the patch, so you can report current values in context.
- `src/data/reading-list.json` and `src/components/FeaturedReads.tsx` — note any Featured Reads rotation this week.
- `research-log.tsv` (repo root, if present) — note research sessions run this week and whether their recommended sources were ingested. Unanswered research briefs are worth flagging in the changelog's forward-looking section.

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
| `overall-us-displacement` | Projected US Job Displacement from AI by 2030 |
| `white-collar-professional-displacement` | White-Collar Professional Displacement |
| `tech-sector-displacement` | Tech Sector Displacement |
| `creative-industry-displacement` | Creative Industry Displacement |
| `education-sector-displacement` | Education Sector Displacement |
| `healthcare-admin-displacement` | Healthcare Admin Displacement |
| `financial-services-displacement` | Financial Services Displacement |
| `customer-service-automation` | Customer Service Automation |
| `robots-physical-automation` | Robots & Physical Automation |
| `median-wage-impact` | Median Wage Impact from AI |
| `entry-level-wage-impact` | Entry-Level Wage Impact |
| `high-skill-wage-premium` | High-Skill AI Wage Premium |
| `freelancer-rate-impact` | Freelancer/Gig Worker Rate Impact |
| `ai-adoption-rate` | AI Adoption Rate Across US Companies |
| `genai-work-adoption` | Generative AI Adoption at Work |
| `ai-business-formation` | AI Business Formation |
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

## STEP 5.5 — Verify Data Movements (Quality Gate)

Before drafting anything public, verify that the "data movements" you plan to report are real and defensible. This step exists because a changelog that reports a chart movement caused by a mis-ingested data point amplifies the error to the site's whole audience.

For every prediction graph whose headline value (`currentValue` / weighted average) moved this week:

1. **Identify the cause.** Which new data point(s) or overlay(s) moved it? A weighted average shifting because sources were added is *not* the same as the world changing — say which it is.
2. **Sanity-check the new points.** For each `history[]` entry added this week, confirm: the value is plausible for the chart's unit (a 0.4 on a "% of jobs" chart is probably a misread index score); the geography matches (non-US studies should be overlays); `dataType` is set; sign convention follows the category rules in `CLAUDE.md`.
3. **Check `aggregationMethod` sensitivity.** On `"latest"` charts (`ai-adoption-rate`, `genai-work-adoption`, `workforce-ai-exposure`, `earnings-call-ai-mentions`), the newest point IS the headline. If the newest point looks anomalous relative to the prior trend, flag it in the internal changelog and do not report the movement on LinkedIn until resolved.
4. **Hero stat check.** Hero stats are computed by `getHeroStats()` in `src/lib/data-loader.ts` from `overall-us-displacement`. If that file changed, run a quick computation (or `npm run build` and inspect) to report the current projected/measured values accurately rather than quoting last week's numbers.

If this step surfaces a likely data-integrity problem, report it in the internal changelog under a **Data Quality Flags** section and recommend a `/data-quality-audit` run. Never silently include suspect movements in the public post.

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
- Data Quality Flags from Step 5.5 (or "none")
- Research sessions this week (from `research-log.tsv`) and any briefs awaiting ingestion decisions
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
