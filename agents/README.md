# jobsdata.ai Agents

Autonomous agents for research, fact-checking, and monitoring of jobsdata.ai.
Built on the Claude Managed Agents API (beta, April 2026).

## Agents

### 1. Research Agent (`research_agent.py`)

Weekly scan for new AI labor market research. Searches NBER, Brookings, BLS,
McKinsey, IMF, and major outlets. Extracts quantitative statistics and maps
them to the 17 prediction graphs.

**Output:** `digests/research-digest-YYYY-MM-DD.md`

### 2. Fact-Check Agent (`factcheck_agent.py`)

Monthly verification of all site data. Checks every source URL, verifies data
point accuracy against cited sources, recalculates weighted averages, and audits
the source registry for consistency.

**Output:** `reports/factcheck-report-YYYY-MM-DD.md`

## Setup

### Prerequisites

```bash
pip install anthropic
export ANTHROPIC_API_KEY="your-key"
```

### First Run

Each agent creates its own Managed Agent and Environment on first run.
Configuration is saved to `.agent_config.json` / `.factcheck_config.json`
so subsequent runs reuse the same agent.

```bash
# Run the research agent
python research_agent.py

# Run the fact-check agent
python factcheck_agent.py
```

### GitHub Actions (Recommended)

Copy the workflow files to your repo:

```
.github/workflows/research_agent.yml    # Mondays at 8am ET
.github/workflows/factcheck_agent.yml   # 1st of month at 9am ET
```

Add your API key as a repository secret:
- Go to Settings > Secrets > Actions
- Add `ANTHROPIC_API_KEY`

Both workflows can also be triggered manually via the Actions tab.

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | (required) | Your Anthropic API key |
| `JOBSDATA_REPO_URL` | `https://github.com/mz00m/ai-labor-predictions.git` | Git URL for the repo |
| `GITHUB_TOKEN` | (optional) | For cloning private repos in the fact-check agent |

## How It Works

Each agent uses the Claude Managed Agents API:

1. **Agent** — defines the model (Sonnet), system prompt, and tools (bash, files, web search, web fetch)
2. **Environment** — a cloud container with unrestricted network access
3. **Session** — a single run where Claude autonomously searches, reads, analyzes, and writes a report
4. **Output** — a structured markdown digest/report saved locally and (via GitHub Actions) committed as a PR

The agents are read-only by design. They produce reports for human review.
Source ingestion into the actual data files is a separate, human-approved step.

## Cost Estimates

| Agent | Frequency | Est. Cost/Run | Monthly |
|-------|-----------|---------------|---------|
| Research | Weekly | $2–5 | ~$12–20 |
| Fact-check | Monthly | $5–10 | ~$5–10 |

Costs depend on how many sources are found/checked. Using Sonnet (not Opus)
keeps costs reasonable.
