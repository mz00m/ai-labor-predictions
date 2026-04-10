#!/usr/bin/env python3
"""
Weekly AI Labor Research Agent for jobsdata.ai

Searches for new AI labor market research, extracts quantitative statistics,
and maps them to jobsdata.ai prediction graphs. Outputs a structured digest
for human review before any data is committed.

Usage:
    # First run: creates the agent and environment (IDs saved to .agent_config.json)
    python research_agent.py

    # Subsequent runs: reuses existing agent/environment
    python research_agent.py

    # With cron (every Monday at 8am):
    # 0 8 * * 1 cd /path/to/agents && python research_agent.py

    # With GitHub Actions: see research_agent_workflow.yml

Requires:
    pip install anthropic
    export ANTHROPIC_API_KEY="your-key"
"""

import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

from anthropic import Anthropic

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CONFIG_FILE = Path(__file__).parent / ".agent_config.json"
OUTPUT_DIR = Path(__file__).parent / "digests"

AGENT_NAME = "jobsdata-research-agent"
AGENT_MODEL = "claude-sonnet-4-6"
BETA_HEADER = "managed-agents-2026-04-01"

# Where your jobsdata.ai repo lives (the agent clones it into its container)
REPO_URL = os.environ.get("JOBSDATA_REPO_URL", "https://github.com/mz00m/ai-labor-predictions.git")

SYSTEM_PROMPT = """You are a research agent for jobsdata.ai, an AI labor market predictions tracker.
Your job is to find new AI labor market research published in the past 7 days,
extract quantitative statistics, and produce a structured digest mapping findings
to the site's prediction graphs.

You are thorough, precise, and conservative. You never invent statistics — only
extract what is explicitly stated in sources. You always use exact quotes. When
uncertain about graph mapping, you default to overlay (not data_point).

You have access to web search and web fetch tools. Use them aggressively to find
and read sources."""

RESEARCH_PROMPT = """## Your Task

Search for AI labor market research published in the **last 7 days** (since {since_date}).
Produce a structured research digest.

## Step 1: Search Strategy

Run at least 8 targeted searches:

1. `"AI job displacement" OR "AI labor market" research paper {year}`
2. `"AI automation" jobs study site:nber.org OR site:brookings.edu OR site:mckinsey.com {year}`
3. `"AI workforce" survey OR report site:bls.gov OR site:census.gov {year}`
4. `"generative AI" employment OR wages new study {year}`
5. `"AI adoption" firms OR companies survey OR report {year}`
6. `"AI impact" "labor market" IMF OR OECD OR ILO OR "World Bank" {year}`
7. `"artificial intelligence" jobs lost OR created OR displaced {month} {year}`
8. `"AI automation" "wage impact" OR "wage effect" OR "earnings" {year}`

For each promising result, fetch the full page content and look for quantitative claims.

## Step 2: For Each Source Found

Extract every quantitative statistic about AI's impact on jobs, wages, workforce, or the economy.

For each statistic capture:
- **Exact verbatim quote** from the source (copy-paste, never paraphrase)
- **Numeric value** (midpoint for ranges; negative for declines)
- **Unit of measurement**
- **Publication date**
- **Evidence tier:**
  - Tier 1: Peer-reviewed, government stats, RCTs (NBER, BLS, Census, AER, Science, Nature)
  - Tier 2: Think tanks, international orgs (Brookings, McKinsey, RAND, IMF, Gartner)
  - Tier 3: Major news, trade pubs (NYT, WSJ, Bloomberg, MIT Tech Review)
  - Tier 4: Blogs, social media, podcasts, opinion

## Step 3: Map to Prediction Graphs

These are the 17 prediction graphs. Map each statistic to exactly one.

**Displacement (8):**
| Slug | Unit |
|---|---|
| `overall-us-displacement` | % of US jobs displaced by 2030 |
| `total-us-jobs-lost` | % of US labor force lost to AI |
| `white-collar-professional-displacement` | % of white-collar roles displaced by 2030 |
| `tech-sector-displacement` | % of tech jobs displaced by 2030 |
| `creative-industry-displacement` | % of creative roles displaced by 2030 |
| `education-sector-displacement` | % of education roles displaced by 2030 |
| `healthcare-admin-displacement` | % of healthcare admin roles displaced by 2030 |
| `customer-service-automation` | % of customer service interactions automated by 2028 |

**Wages (5):**
| Slug | Unit |
|---|---|
| `median-wage-impact` | % change in real median wage by 2030 |
| `geographic-wage-divergence` | % AI hub wage premium by 2030 |
| `entry-level-wage-impact` | % entry-level wage change by 2030 |
| `high-skill-wage-premium` | % high-skill wage premium over median by 2030 |
| `freelancer-rate-impact` | % freelancer rate change by 2028 |

**Adoption & Exposure (4):**
| Slug | Unit |
|---|---|
| `ai-adoption-rate` | % of US firms using AI (Census BTOS) |
| `genai-work-adoption` | % of adults using GenAI at work |
| `workforce-ai-exposure` | % of US jobs exposed to AI |
| `earnings-call-ai-mentions` | % of S&P 500 mentioning AI workforce |

**Mapping rules:**
- Unit compatibility is the primary criterion
- Exposure ≠ displacement ≠ measured loss
- Global stats → overlay on US-specific graphs (don't use as data_point)
- "Tasks automatable" ≠ "jobs displaced"
- When uncertain → classify as `overlay` (not `data_point`)
- Overlay direction: `up` (metric will be higher), `down` (lower), `neutral`

## Step 4: Write the Digest

Write the complete digest to a file called `digest.md` in your working directory.

Use this exact structure:

```markdown
# AI Labor Research Digest — {date}

## Summary
[2-3 sentences: sources found, major findings, any Tier 1 highlights]

## New Sources

### [Source Title]
- **Publisher:** [name]
- **Date:** [YYYY-MM-DD]
- **URL:** [url]
- **Evidence Tier:** [1-4] ([label])
- **Source ID:** [publisher-topic-year]

**Statistics:**

1. **Graph:** [title] (`[slug]`)
   **Type:** DATA_POINT | OVERLAY ([direction])
   **Value:** [number] [unit]
   **Quote:** "[exact quote]"

[repeat for each source]

## Sources Checked but Not Relevant
[URLs checked that didn't yield new quantitative AI labor stats]

## Priority Recommendations
- Tier 1 sources to ingest immediately
- Statistics that diverge significantly from current graph consensus
- New government data releases
```

## Rules
- Never invent statistics. Only extract what's explicitly stated.
- Always use exact quotes from the source text.
- An empty week is a valid result — say so if nothing new was found.
- Focus on the last 7 days. Note older sources only if clearly important and possibly missed.
- Quality over quantity: 2 Tier 1-2 sources > 10 Tier 4 blog posts.
"""


def load_config():
    """Load saved agent/environment IDs, or return empty dict."""
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text())
    return {}


def save_config(config):
    """Persist agent/environment IDs for reuse."""
    CONFIG_FILE.write_text(json.dumps(config, indent=2))


def setup_agent(client):
    """Create or retrieve the research agent and environment."""
    config = load_config()

    # Create agent if needed
    if "agent_id" not in config:
        print("Creating research agent...")
        agent = client.beta.agents.create(
            name=AGENT_NAME,
            model=AGENT_MODEL,
            system=SYSTEM_PROMPT,
            tools=[{"type": "agent_toolset_20260401"}],
        )
        config["agent_id"] = agent.id
        config["agent_version"] = agent.version
        print(f"  Agent created: {agent.id}")

    # Create environment if needed
    if "environment_id" not in config:
        print("Creating environment...")
        environment = client.beta.environments.create(
            name="jobsdata-research-env",
            config={
                "type": "cloud",
                "networking": {"type": "unrestricted"},
            },
        )
        config["environment_id"] = environment.id
        print(f"  Environment created: {environment.id}")

    save_config(config)
    return config


def run_research_session(client, config):
    """Start a session, send the research prompt, and collect results."""

    now = datetime.now()
    since = now - timedelta(days=7)

    prompt = RESEARCH_PROMPT.format(
        since_date=since.strftime("%Y-%m-%d"),
        date=now.strftime("%Y-%m-%d"),
        year=now.year,
        month=now.strftime("%B"),
    )

    # Create session
    print(f"\nStarting research session ({now.strftime('%Y-%m-%d %H:%M')})...")
    session = client.beta.sessions.create(
        agent=config["agent_id"],
        environment_id=config["environment_id"],
        title=f"Research scan {now.strftime('%Y-%m-%d')}",
    )
    print(f"  Session: {session.id}")

    # Stream events with reconnection on dropped connections
    final_text = []
    tool_calls = []
    message_sent = False
    max_retries = 3

    for attempt in range(max_retries):
        try:
            with client.beta.sessions.events.stream(session.id) as stream:
                if not message_sent:
                    client.beta.sessions.events.send(
                        session.id,
                        events=[
                            {
                                "type": "user.message",
                                "content": [{"type": "text", "text": prompt}],
                            }
                        ],
                    )
                    message_sent = True
                    print("  Agent working", end="", flush=True)
                else:
                    print(f"\n  Reconnected (attempt {attempt + 1})", end="", flush=True)

                for event in stream:
                    match event.type:
                        case "agent.message":
                            for block in event.content:
                                if hasattr(block, "text"):
                                    final_text.append(block.text)
                        case "agent.tool_use":
                            tool_calls.append(event.name)
                            print(".", end="", flush=True)
                        case "session.status_idle":
                            print(" done.")
                            break
                else:
                    continue
                break  # session.status_idle was hit
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"\n  Stream disconnected: {e}")
                print(f"  Waiting 5s before reconnecting...", flush=True)
                time.sleep(5)
            else:
                print(f"\n  Stream failed after {max_retries} attempts: {e}")
                raise

    print(f"  Tool calls made: {len(tool_calls)}")

    # Retrieve the digest file from the session's filesystem
    # The agent writes it to digest.md in its working directory
    print("  Retrieving digest...")
    digest_content = retrieve_digest(client, session.id, config)

    return digest_content, session.id


def retrieve_digest(client, session_id, config):
    """Ask the agent to output the digest file contents in its response."""

    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(
            session_id,
            events=[
                {
                    "type": "user.message",
                    "content": [
                        {
                            "type": "text",
                            "text": "Read the file digest.md and respond with its COMPLETE contents. Do not summarize — output the entire file verbatim in your response text.",
                        }
                    ],
                }
            ],
        )

        text_parts = []
        event_types_seen = []
        for event in stream:
            event_types_seen.append(event.type)
            match event.type:
                case "agent.message":
                    for block in event.content:
                        if hasattr(block, "text"):
                            text_parts.append(block.text)
                case "agent.tool_result":
                    if hasattr(event, "content"):
                        for block in event.content:
                            if hasattr(block, "text"):
                                text_parts.append(block.text)
                case "session.status_idle":
                    break

    result = "".join(text_parts)
    if not result:
        print(f"  Warning: no content captured. Event types seen: {set(event_types_seen)}")
    return result


def save_digest(content):
    """Save the digest locally with a dated filename."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"research-digest-{datetime.now().strftime('%Y-%m-%d')}.md"
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

    # Setup (creates agent + environment on first run)
    config = setup_agent(client)

    # Run the research session
    digest, session_id = run_research_session(client, config)

    # Save results
    if digest:
        path = save_digest(digest)
        print(f"\n✓ Research digest ready for review: {path}")
        print(f"  Session ID: {session_id}")
    else:
        print("\n⚠ No digest content received. Check session logs.")
        print(f"  Session ID: {session_id}")


if __name__ == "__main__":
    main()
