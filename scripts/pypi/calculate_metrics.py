#!/usr/bin/env python3
"""
Calculate derived metrics from PyPI download data.

Reads monthly_downloads.json and packages.json, calculates:
- Per-package: MoM growth, rolling averages, breakout detection, sparklines
- Per-domain: aggregated growth rates
- AAI (Automation Acceleration Index): Tier 2 growth / Tier 1 growth over time

Writes results to src/data/pypi/metrics.json.

Usage:
    python3 scripts/pypi/calculate_metrics.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
PACKAGES_PATH = ROOT / "src" / "data" / "pypi" / "packages.json"
DOWNLOADS_PATH = ROOT / "src" / "data" / "pypi" / "monthly_downloads.json"
OUTPUT_PATH = ROOT / "src" / "data" / "pypi" / "metrics.json"


def load_data():
    with open(PACKAGES_PATH) as f:
        taxonomy = json.load(f)
    with open(DOWNLOADS_PATH) as f:
        downloads = json.load(f)
    return taxonomy, downloads


def calc_mom_growth(values: list[int]) -> list[float]:
    """Calculate month-over-month growth rates (as decimals, not percentages)."""
    growth = []
    for i in range(1, len(values)):
        prev = values[i - 1]
        curr = values[i]
        if prev > 0:
            growth.append((curr - prev) / prev)
        else:
            growth.append(0.0)
    return growth


def rolling_avg(values: list[float], window: int) -> float:
    """Average of the last `window` values. Returns 0.0 if not enough data."""
    if not values or len(values) < window:
        subset = values if values else []
    else:
        subset = values[-window:]
    return sum(subset) / len(subset) if subset else 0.0


def detect_breakout(growth_rates: list[float]) -> tuple[bool, str | None]:
    """
    Detect breakout conditions:
    1. 3+ consecutive months of >20% MoM growth
    2. Last 3-month avg growth is 2x+ the prior 3-month avg growth
    """
    # Condition 1: 3+ consecutive months >20%
    if len(growth_rates) >= 3:
        consecutive = 0
        for g in growth_rates:
            if g > 0.20:
                consecutive += 1
                if consecutive >= 3:
                    return True, "3+ consecutive months of >20% MoM growth"
            else:
                consecutive = 0

    # Condition 2: growth rate doubled from prior quarter
    if len(growth_rates) >= 6:
        recent_avg = sum(growth_rates[-3:]) / 3
        prior_avg = sum(growth_rates[-6:-3]) / 3
        if prior_avg > 0.01 and recent_avg >= prior_avg * 2:
            return True, f"Growth rate doubled: {recent_avg:.0%} vs prior {prior_avg:.0%}"

    return False, None


def calculate_package_metrics(pkg_name, pkg_data, pkg_config):
    """Calculate all metrics for a single package."""
    data_points = pkg_data.get("data", [])
    downloads = [d["downloads"] for d in data_points]

    if len(downloads) < 2:
        return {
            "package": pkg_name,
            "tier": pkg_config["tier"],
            "domain": pkg_config["domain"],
            "latestMonthlyDownloads": downloads[-1] if downloads else 0,
            "momGrowth": 0.0,
            "rollingAvg3mGrowth": 0.0,
            "rollingAvg6mGrowth": 0.0,
            "isBreakout": False,
            "sparkline": downloads[-6:] if downloads else [],
        }

    growth_rates = calc_mom_growth(downloads)

    is_breakout, reason = detect_breakout(growth_rates)

    result = {
        "package": pkg_name,
        "tier": pkg_config["tier"],
        "domain": pkg_config["domain"],
        "latestMonthlyDownloads": downloads[-1],
        "momGrowth": round(growth_rates[-1], 4) if growth_rates else 0.0,
        "rollingAvg3mGrowth": round(rolling_avg(growth_rates, 3), 4),
        "rollingAvg6mGrowth": round(rolling_avg(growth_rates, 6), 4),
        "isBreakout": is_breakout,
        "sparkline": downloads[-6:],
    }
    if reason:
        result["breakoutReason"] = reason
    return result


def calculate_aai_history(downloads_data, pkg_config_map):
    """
    Calculate Automation Acceleration Index per month.
    AAI = mean(Tier 2 MoM growth) / mean(Tier 1 MoM growth)
    """
    # Build per-package monthly series keyed by month
    pkg_monthly: dict[str, dict[str, int]] = {}
    for pkg_data in downloads_data["packages"]:
        name = pkg_data["package"]
        monthly = {}
        for d in pkg_data["data"]:
            monthly[d["month"]] = d["downloads"]
        pkg_monthly[name] = monthly

    # Get all months across all packages
    all_months: set[str] = set()
    for monthly in pkg_monthly.values():
        all_months.update(monthly.keys())
    sorted_months = sorted(all_months)

    if len(sorted_months) < 2:
        return []

    aai_history = []
    for i in range(1, len(sorted_months)):
        prev_month = sorted_months[i - 1]
        curr_month = sorted_months[i]

        tier1_growths = []
        tier2_growths = []

        for name, monthly in pkg_monthly.items():
            config = pkg_config_map.get(name)
            if not config:
                continue

            prev_val = monthly.get(prev_month, 0)
            curr_val = monthly.get(curr_month, 0)

            if prev_val > 0:
                growth = (curr_val - prev_val) / prev_val
            else:
                continue

            if config["tier"] == "tier1":
                tier1_growths.append(growth)
            elif config["tier"] in ("tier2", "tier3"):
                tier2_growths.append(growth)

        if not tier1_growths or not tier2_growths:
            continue

        tier1_avg = sum(tier1_growths) / len(tier1_growths)
        tier2_avg = sum(tier2_growths) / len(tier2_growths)

        # Clamp denominator to avoid division by zero or nonsensical ratios
        if tier1_avg <= 0.001:
            aai = tier2_avg / 0.001 if tier2_avg > 0 else 1.0
        else:
            aai = tier2_avg / tier1_avg

        # Clamp to reasonable range
        aai = max(-10.0, min(10.0, aai))

        aai_history.append({
            "month": curr_month,
            "aai": round(aai, 3),
            "tier2AvgGrowth": round(tier2_avg, 4),
            "tier1AvgGrowth": round(tier1_avg, 4),
        })

    return aai_history


def determine_aai_trend(aai_history: list[dict]) -> str:
    """Determine if AAI is accelerating, stable, or decelerating."""
    if len(aai_history) < 3:
        return "stable"

    recent = [h["aai"] for h in aai_history[-3:]]

    # Simple linear trend: compare first vs last of the 3 points
    change = recent[-1] - recent[0]
    avg_aai = sum(recent) / len(recent)

    if avg_aai == 0:
        return "stable"

    relative_change = change / max(abs(avg_aai), 0.1)

    if relative_change > 0.10:
        return "accelerating"
    elif relative_change < -0.10:
        return "decelerating"
    return "stable"


def calculate_domain_metrics(package_metrics, taxonomy):
    """Aggregate metrics by domain."""
    domain_packages: dict[str, list[dict]] = {}

    for pm in package_metrics:
        domain = pm["domain"]
        if domain not in domain_packages:
            domain_packages[domain] = []
        domain_packages[domain].append(pm)

    domain_info = taxonomy["domains"]
    results = []

    for domain, pkgs in sorted(domain_packages.items()):
        info = domain_info.get(domain, {"label": domain, "color": "#6b7280"})
        growth_3m = [p["rollingAvg3mGrowth"] for p in pkgs if p["rollingAvg3mGrowth"] != 0]
        growth_6m = [p["rollingAvg6mGrowth"] for p in pkgs if p["rollingAvg6mGrowth"] != 0]

        results.append({
            "domain": domain,
            "label": info["label"],
            "color": info["color"],
            "avgGrowth3m": round(sum(growth_3m) / len(growth_3m), 4) if growth_3m else 0.0,
            "avgGrowth6m": round(sum(growth_6m) / len(growth_6m), 4) if growth_6m else 0.0,
            "totalDownloads": sum(p["latestMonthlyDownloads"] for p in pkgs),
            "packageCount": len(pkgs),
            "packages": [p["package"] for p in pkgs],
        })

    return results


def main():
    taxonomy, downloads = load_data()

    # Build config lookup
    pkg_config_map = {p["name"]: p for p in taxonomy["packages"]}

    # Build downloads lookup
    pkg_downloads_map = {p["package"]: p for p in downloads["packages"]}

    # Calculate per-package metrics
    print("Calculating per-package metrics...")
    package_metrics = []
    for pkg_config in taxonomy["packages"]:
        name = pkg_config["name"]
        pkg_data = pkg_downloads_map.get(name)
        if not pkg_data:
            print(f"  SKIP {name}: no download data")
            continue
        metrics = calculate_package_metrics(name, pkg_data, pkg_config)
        package_metrics.append(metrics)
        growth_pct = metrics["momGrowth"] * 100
        breakout = " ** BREAKOUT **" if metrics["isBreakout"] else ""
        print(f"  {name}: {metrics['latestMonthlyDownloads']:>12,}/mo  MoM: {growth_pct:+.1f}%{breakout}")

    # Calculate AAI history
    print("\nCalculating AAI history...")
    aai_history = calculate_aai_history(downloads, pkg_config_map)
    current_aai = aai_history[-1]["aai"] if aai_history else 1.0
    aai_trend = determine_aai_trend(aai_history)
    print(f"  Current AAI: {current_aai:.2f}x ({aai_trend})")
    print(f"  History: {len(aai_history)} months")

    # Calculate domain metrics
    print("\nCalculating domain metrics...")
    domain_metrics = calculate_domain_metrics(package_metrics, taxonomy)
    for dm in domain_metrics:
        print(f"  {dm['label']}: {dm['avgGrowth3m']*100:+.1f}% (3m avg), {dm['packageCount']} packages")

    # Identify breakout packages
    breakout_packages = [p["package"] for p in package_metrics if p["isBreakout"]]
    if breakout_packages:
        print(f"\nBreakout packages: {', '.join(breakout_packages)}")

    # Write output
    output = {
        "calculatedAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "currentAAI": current_aai,
        "aaiTrend": aai_trend,
        "aaiHistory": aai_history,
        "packages": package_metrics,
        "domains": domain_metrics,
        "breakoutPackages": breakout_packages,
    }

    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote metrics to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
