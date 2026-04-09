#!/usr/bin/env python3
"""
Monthly Fact-Check Agent for jobsdata.ai

Verifies every data point against its cited source, checks weighted average
math, flags broken URLs, and produces a health report. Read-only — never
modifies site data.

Usage:
    # First run: creates the agent and environment
    python factcheck_agent.py

    # Point it at your repo (cloned into agent container)
    JOBSDATA_REPO_URL=https://github.com/mz00m/ai-labor-predictions.git python factcheck_agent.py

    # With cron (1st of each month at 9am):
    # 0 9 1 * * cd /path/to/agents && python factcheck_agent.py

Requires:
    pip install anthropic
    export ANTHROPIC_API_KEY="your-key"
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

from anthropic import Anthropic

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CONFIG_FILE = Path(__file__).parent / ".factcheck_config.json"
OUTPUT_DIR = Path(__file__).parent / "reports"

AGENT_NAME = "jobsdata-factcheck-agent"
AGENT_MODEL = "claude-sonnet-4-6"

REPO_URL = os.environ.get(
    "JOBSDATA_REPO_URL",
    "https://github.com/mz00m/ai-labor-predictions.git",
)

# If you have a GitHub token for private repos
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

SYSTEM_PROMPT = """You are a fact-checking agent for jobsdata.ai, an AI labor market predictions tracker.
Your job is to systematically verify the integrity of all data on the site:
- Every data point must trace back to its cited source
- Weighted averages must be mathematically correct
- Source URLs must still be accessible
- No duplicates, no orphaned entries, no stale data

You are meticulous and precise. You produce a structured report with specific,
actionable findings. You NEVER modify data files — you are read-only.

You have access to bash, file tools, web search, and web fetch."""

FACTCHECK_PROMPT = """## Your Task

Perform a comprehensive fact-check of the jobsdata.ai prediction data.
Today's date: {date}

## Step 0: Clone the Repository

```bash
git clone {repo_url} /tmp/jobsdata
cd /tmp/jobsdata
```

{auth_instructions}

If the clone fails, note this in the report and do what you can with web-accessible sources.

## Step 1: Load All Data Files

Read all prediction JSON files from `src/data/predictions/`. For each of the 17 graphs, load:
- `sources` array
- `history` array (data points)
- `overlays` array

Also read `src/data/confirmed-sources.json` for the master registry.

List every unique source with its ID, URL, and which graphs reference it.

## Step 2: URL Health Check

For every unique source URL:
1. Attempt to fetch it (use web_fetch)
2. Record: source_id, URL, HTTP status, whether content loads
3. Categorize:
   - Resolves and contains expected content
   - Redirects (note destination)
   - Broken (404, timeout, paywall with no content)

Do this systematically — every single URL.

## Step 3: Data Point Verification

For each `data_point` entry in each graph's `history`:
1. Look up the source by `sourceIds`
2. Find the source URL and recorded excerpt/quote
3. If the URL is accessible, fetch it and verify:
   - Does the source text actually contain the claimed statistic?
   - Does the recorded value match the source?
   - Are confidence ranges (confidenceLow/confidenceHigh) calculated correctly?
4. If URL is inaccessible, note "verification attempted, URL broken"

Flag any discrepancy with:
- What's recorded in the data file
- What the source actually says
- The specific difference

## Step 4: Weighted Average Verification

For each prediction graph:
1. List all data points with their evidence tiers and values
2. Check the weighting logic:
   - Tier 1 sources should weight higher than Tier 4
   - Recalculate the weighted average from raw data
   - Compare your calculation to any displayed average
3. Flag:
   - Single outliers dominating the average
   - Methodologically incompatible sources being averaged (exposure mixed with displacement)
   - Confidence ranges that don't reflect actual spread

Note: The weighting formula may be in the site's JavaScript code. Check `src/` for
calculation logic if present.

## Step 5: Registry Consistency

Cross-reference prediction files against `confirmed-sources.json`:
1. Every source in a prediction file should exist in confirmed-sources.json
2. Every `usedIn` entry should match actual usage
3. `totalSources` and `verifiedCount` should match real counts
4. No orphaned sources (in registry, not used anywhere)
5. No unregistered sources (used in graphs, not in registry)

## Step 6: Staleness Check

Flag entries that may need attention:
- Sources older than 24 months with no newer replacement
- Graphs with no new data added in 6+ months
- Overlays whose time horizon has now passed (e.g., "by 2025" predictions)
- Data points from sources known to have published updated versions

## Step 7: Duplicate Detection

Scan for:
- Same source ID appearing twice in the same graph
- Different source IDs pointing to the same URL
- Near-identical statistics from the same publisher/report

## Step 8: Write the Report

Save the complete report to `report.md`:

```markdown
# jobsdata.ai Fact-Check Report — {date}

## Executive Summary
[3-4 sentences: overall data health, critical issues, verification coverage]

## Health Scorecard
| Metric | Result |
|--------|--------|
| Total unique sources | [N] |
| URLs verified working | [N] / [total] |
| URLs broken | [N] |
| Data points verified accurate | [N] / [total] |
| Data points with discrepancies | [N] |
| Registry consistency | PASS / FAIL |
| Duplicate entries found | [N] |

## Critical Issues (Fix Required)
[Anything actively wrong — incorrect values, math errors, broken core sources]

### Issue 1: [Title]
- **Graph:** `[slug]`
- **Source:** [source-id]
- **Recorded:** [what the data file says]
- **Actual:** [what the source says]
- **Action:** [specific fix]

## Warnings (Review Recommended)
[Not wrong, but deserves attention — stale data, borderline mappings]

## Broken URLs
| Source ID | URL | Status | Affected Graphs |
|-----------|-----|--------|-----------------|

## Stale Data
| Graph | Last Updated | Oldest Source | Months Stale | Action |
|-------|-------------|---------------|--------------|--------|

## Duplicates Found
[List with specific file locations]

## Registry Audit
- Orphaned sources: [list or "none"]
- Unregistered sources: [list or "none"]
- Count check: totalSources=[recorded] (actual=[N]), verifiedCount=[recorded] (actual=[N])

## Per-Graph Verification Log
| Graph | Sources | Data Points | Overlays | Issues |
|-------|---------|-------------|----------|--------|
| `overall-us-displacement` | [N] | [N] verified | [N] | [summary] |
| ... | ... | ... | ... | ... |

## Methodology Notes
[What couldn't be verified and why (paywalls, etc.)]
```

## Rules
- NEVER modify any data files. This agent is strictly read-only.
- Document every verification attempt, even failed ones.
- Be specific: include recorded value AND actual value for every discrepancy.
- If the repo isn't accessible, verify what you can (URLs via web) and note limitations.
- Prioritize critical issues (wrong data affecting charts) over cosmetic issues.
"""


def load_config():
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text())
    return {}


def save_config(config):
    CONFIG_FILE.write_text(json.dumps(config, indent=2))


def setup_agent(client):
    config = load_config()

    if "agent_id" not in config:
        print("Creating fact-check agent...")
        agent = client.beta.agents.create(
            name=AGENT_NAME,
            model=AGENT_MODEL,
            system=SYSTEM_PROMPT,
            tools=[{"type": "agent_toolset_20260401"}],
        )
        config["agent_id"] = agent.id
        config["agent_version"] = agent.version
        print(f"  Agent created: {agent.id}")

    if "environment_id" not in config:
        print("Creating environment...")
        environment = client.beta.environments.create(
            name="jobsdata-factcheck-env",
            config={
                "type": "cloud",
                "networking": {"type": "unrestricted"},
            },
        )
        config["environment_id"] = environment.id
        print(f"  Environment created: {environment.id}")

    save_config(config)
    return config


def run_factcheck_session(client, config):
    now = datetime.now()

    # Build auth instructions if token is available
    auth_instructions = ""
    if GITHUB_TOKEN:
        auth_instructions = f"""
If the clone requires authentication, use:
```bash
git clone https://x-access-token:{GITHUB_TOKEN}@github.com/mz00m/ai-labor-predictions.git /tmp/jobsdata
```
"""

    prompt = FACTCHECK_PROMPT.format(
        date=now.strftime("%Y-%m-%d"),
        repo_url=REPO_URL,
        auth_instructions=auth_instructions,
    )

    print(f"\nStarting fact-check session ({now.strftime('%Y-%m-%d %H:%M')})...")
    session = client.beta.sessions.create(
        agent=config["agent_id"],
        environment_id=config["environment_id"],
        title=f"Fact-check {now.strftime('%Y-%m-%d')}",
    )
    print(f"  Session: {session.id}")

    # Stream events
    tool_calls = []

    with client.beta.sessions.events.stream(session.id) as stream:
        client.beta.sessions.events.send(
            session.id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": prompt}],
                }
            ],
        )

        print("  Agent working", end="", flush=True)

        for event in stream:
            match event.type:
                case "agent.tool_use":
                    tool_calls.append(event.name)
                    print(".", end="", flush=True)
                case "session.status_idle":
                    print(" done.")
                    break

    print(f"  Tool calls made: {len(tool_calls)}")

    # Retrieve the report
    print("  Retrieving report...")
    report = retrieve_report(client, session.id)
    return report, session.id


def retrieve_report(client, session_id):
    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(
            session_id,
            events=[
                {
                    "type": "user.message",
                    "content": [
                        {
                            "type": "text",
                            "text": "Print the complete contents of report.md using cat. Output ONLY the file contents.",
                        }
                    ],
                }
            ],
        )

        text_parts = []
        for event in stream:
            match event.type:
                case "agent.message":
                    for block in event.content:
                        if hasattr(block, "text"):
                            text_parts.append(block.text)
                case "session.status_idle":
                    break

    return "".join(text_parts)


def save_report(content):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"factcheck-report-{datetime.now().strftime('%Y-%m-%d')}.md"
    path = OUTPUT_DIR / filename
    path.write_text(content)
    print(f"  Saved: {path}")
    return path


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable required")
        sys.exit(1)

    client = Anthropic()

    config = setup_agent(client)
    report, session_id = run_factcheck_session(client, config)

    if report:
        path = save_report(report)
        print(f"\n✓ Fact-check report ready: {path}")
        print(f"  Session ID: {session_id}")
    else:
        print("\n⚠ No report content received. Check session logs.")
        print(f"  Session ID: {session_id}")


if __name__ == "__main__":
    main()
