#!/usr/bin/env python3
"""
Fetch GitHub repository activity data for tracked packages.

For each unique githubRepo in taxonomy.json:
  - Total stars, forks, open issues from /repos/{owner}/{repo}
  - Monthly new issues (via search API, last 12 months)
  - Weekly commit activity (via /stats/commit_activity, last 52 weeks)

Writes to src/data/signals/github_activity.json.

Usage:
    GITHUB_TOKEN=ghp_... python3 scripts/signals/fetch_github.py
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
TAXONOMY_PATH = ROOT / "src" / "data" / "signals" / "taxonomy.json"
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "github_activity.json"

GITHUB_API = "https://api.github.com"


def get_headers():
    token = os.environ.get("GITHUB_TOKEN", "")
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def github_get(url, params=None):
    """Make a GitHub API request with rate limit handling."""
    headers = get_headers()

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=30)
    except requests.RequestException as e:
        print(f"    ERROR: request failed: {e}")
        return None

    remaining = int(resp.headers.get("X-RateLimit-Remaining", 5000))
    reset_ts = int(resp.headers.get("X-RateLimit-Reset", 0))

    # Handle primary rate limit
    if resp.status_code == 403 and remaining == 0:
        wait = max(0, reset_ts - time.time()) + 2
        print(f"    Rate limited. Waiting {wait:.0f}s...")
        time.sleep(wait)
        return github_get(url, params)

    # Handle secondary rate limit (abuse detection)
    if resp.status_code == 403 and "secondary rate limit" in resp.text.lower():
        retry_after = int(resp.headers.get("Retry-After", 60))
        print(f"    Secondary rate limit. Waiting {retry_after}s...")
        time.sleep(retry_after)
        return github_get(url, params)

    if resp.status_code == 422:
        print(f"    WARNING: search returned 422 (query may be invalid)")
        return None

    if resp.status_code == 404:
        return None

    if resp.status_code != 200:
        print(f"    ERROR: {resp.status_code} from {url}")
        return None

    # Proactive wait if running low
    if remaining < 5:
        wait = max(0, reset_ts - time.time()) + 2
        print(f"    Rate limit low ({remaining}). Waiting {wait:.0f}s...")
        time.sleep(wait)

    return resp


def get_months_range(n_months=12):
    """Get a list of (start_str, end_str, month_key) for the last n months."""
    now = datetime.now(timezone.utc)
    months = []
    for i in range(n_months):
        year = now.year
        month = now.month - i
        while month <= 0:
            month += 12
            year -= 1

        start = datetime(year, month, 1, tzinfo=timezone.utc)
        next_month = month + 1
        next_year = year
        if next_month > 12:
            next_month = 1
            next_year += 1
        end = datetime(next_year, next_month, 1, tzinfo=timezone.utc)

        month_key = f"{year}-{month:02d}"
        start_str = start.strftime("%Y-%m-%d")
        end_str = end.strftime("%Y-%m-%d")
        months.append((start_str, end_str, month_key))

    months.reverse()
    return months


def fetch_repo_info(owner, repo):
    """Fetch basic repo info (stars, forks, open issues)."""
    resp = github_get(f"{GITHUB_API}/repos/{owner}/{repo}")
    if not resp:
        return None
    data = resp.json()
    return {
        "totalStars": data.get("stargazers_count", 0),
        "forks": data.get("forks_count", 0),
        "openIssues": data.get("open_issues_count", 0),
    }


def fetch_weekly_commits(owner, repo):
    """Fetch weekly commit counts for the last year via /stats/commit_activity.

    Returns list of {"week": "YYYY-MM-DD", "commits": N} for last 52 weeks.
    The API may return 202 (computing) on first call — retry once after a pause.
    """
    url = f"{GITHUB_API}/repos/{owner}/{repo}/stats/commit_activity"
    resp = github_get(url)

    # GitHub returns 202 while computing stats — wait and retry
    if resp and resp.status_code == 202:
        time.sleep(3)
        resp = github_get(url)

    if not resp:
        return []

    try:
        data = resp.json()
    except Exception:
        return []

    if not isinstance(data, list):
        return []

    weeks = []
    for entry in data:
        ts = entry.get("week", 0)
        total = entry.get("total", 0)
        week_date = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
        weeks.append({"week": week_date, "commits": total})

    return weeks


def fetch_monthly_issues(owner, repo, months):
    """Fetch monthly new issue counts using the search API."""
    monthly_issues = []
    for start_str, end_str, month_key in months:
        query = f"repo:{owner}/{repo} is:issue created:{start_str}..{end_str}"
        resp = github_get(
            f"{GITHUB_API}/search/issues",
            params={"q": query, "per_page": 1},
        )

        if resp:
            count = resp.json().get("total_count", 0)
            monthly_issues.append({"month": month_key, "issues": count})
            print(f".", end="", flush=True)
        else:
            monthly_issues.append({"month": month_key, "issues": 0})
            print(f"x", end="", flush=True)

        # Search API: 30 req/min authenticated. Space them out.
        time.sleep(2.5)

    total = sum(m["issues"] for m in monthly_issues)
    print(f" {total} issues")
    return monthly_issues


def build_repo_map(taxonomy):
    """Build a map of unique repos to their associated packages."""
    repo_map = {}
    for pkg in taxonomy["packages"]:
        repo = pkg.get("githubRepo")
        if not repo:
            continue
        if repo not in repo_map:
            repo_map[repo] = []
        repo_map[repo].append(pkg["name"])
    return repo_map


def main():
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        print("WARNING: No GITHUB_TOKEN set. Rate limit will be 60 req/hr (vs 5,000 with token).")
        print("  Set: export GITHUB_TOKEN=ghp_your_token_here\n")

    with open(TAXONOMY_PATH) as f:
        taxonomy = json.load(f)

    repo_map = build_repo_map(taxonomy)
    unique_repos = list(repo_map.keys())
    print(f"Found {len(unique_repos)} unique GitHub repos across {sum(len(v) for v in repo_map.values())} packages")
    print(f"Estimated time: ~{len(unique_repos) * 35}s ({len(unique_repos)} repos x 12 months x 2.5s)\n")

    months = get_months_range(12)

    results = []
    for i, repo_full in enumerate(unique_repos, 1):
        owner, repo = repo_full.split("/", 1)
        packages = repo_map[repo_full]
        print(f"[{i}/{len(unique_repos)}] {repo_full} ({', '.join(packages)})")

        # 1. Basic repo info (total stars)
        info = fetch_repo_info(owner, repo)
        if not info:
            print(f"    SKIP: Could not fetch repo info")
            continue

        print(f"    Stars: {info['totalStars']:,} | Forks: {info['forks']:,} | Issues: ", end="", flush=True)

        # 2. Monthly issues via search
        monthly_issues = fetch_monthly_issues(owner, repo, months)

        # 3. Weekly commit activity
        print(f"    Commits: ", end="", flush=True)
        weekly_commits = fetch_weekly_commits(owner, repo)
        if weekly_commits:
            recent_total = sum(w["commits"] for w in weekly_commits[-4:])
            print(f"{len(weekly_commits)} weeks, last 4wk: {recent_total} commits")
        else:
            print("unavailable")

        results.append({
            "repo": repo_full,
            "packages": packages,
            "totalStars": info["totalStars"],
            "forks": info["forks"],
            "openIssues": info["openIssues"],
            "weeklyCommits": weekly_commits,
            "monthlyIssues": monthly_issues,
        })

        time.sleep(0.5)

    output = {
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "repos": results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(results)} repos to {OUTPUT_PATH}")
    total_stars = sum(r["totalStars"] for r in results)
    print(f"Total stars across all repos: {total_stars:,}")


if __name__ == "__main__":
    main()
