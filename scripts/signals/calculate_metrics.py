#!/usr/bin/env python3
"""
Calculate derived metrics from download and employment data.

Reads monthly_downloads.json, bls_employment.json, and taxonomy.json.
Calculates:
- Per-package: MoM growth, rolling averages, surging detection, sparklines
- Per-industry: aggregated growth rates, employment changes, tool counts
- AAI (Automation Acceleration Index): Tier 2 growth / Tier 1 growth over time

Writes results to src/data/signals/metrics.json.

Usage:
    python3 scripts/signals/calculate_metrics.py
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
TAXONOMY_PATH = ROOT / "src" / "data" / "signals" / "taxonomy.json"
DOWNLOADS_PATH = ROOT / "src" / "data" / "signals" / "monthly_downloads.json"
BLS_PATH = ROOT / "src" / "data" / "signals" / "bls_employment.json"
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "metrics.json"


def load_data():
    with open(TAXONOMY_PATH) as f:
        taxonomy = json.load(f)
    with open(DOWNLOADS_PATH) as f:
        downloads = json.load(f)

    bls = None
    if BLS_PATH.exists():
        with open(BLS_PATH) as f:
            bls = json.load(f)
    else:
        print("WARNING: No BLS employment data found. Employment metrics will be null.")

    return taxonomy, downloads, bls


def calc_mom_growth(values: list[int]) -> list[float]:
    """Calculate month-over-month growth rates (as decimals)."""
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
    """Average of the last `window` values."""
    if not values or len(values) < window:
        subset = values if values else []
    else:
        subset = values[-window:]
    return sum(subset) / len(subset) if subset else 0.0


def detect_surging(growth_rates: list[float]) -> tuple[bool, str | None]:
    """
    Detect surging conditions:
    1. 3+ consecutive months of >20% MoM growth
    2. Last 3-month avg growth is 2x+ the prior 3-month avg
    """
    if len(growth_rates) >= 3:
        consecutive = 0
        for g in growth_rates:
            if g > 0.20:
                consecutive += 1
                if consecutive >= 3:
                    return True, "3+ consecutive months of >20% growth"
            else:
                consecutive = 0

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

    source = pkg_config.get("source", "pypi")
    tier = pkg_config.get("tier", "tier2")
    industries = pkg_config.get("industries", [])
    label = pkg_config.get("label", pkg_name)

    if len(downloads) < 2:
        return {
            "package": pkg_name,
            "source": source,
            "tier": tier,
            "industries": industries,
            "label": label,
            "latestMonthlyDownloads": downloads[-1] if downloads else 0,
            "momGrowth": 0.0,
            "rollingAvg3mGrowth": 0.0,
            "rollingAvg6mGrowth": 0.0,
            "isSurging": False,
            "sparkline": downloads[-6:] if downloads else [],
        }

    growth_rates = calc_mom_growth(downloads)
    is_surging, reason = detect_surging(growth_rates)

    result = {
        "package": pkg_name,
        "source": source,
        "tier": tier,
        "industries": industries,
        "label": label,
        "latestMonthlyDownloads": downloads[-1],
        "momGrowth": round(growth_rates[-1], 4) if growth_rates else 0.0,
        "rollingAvg3mGrowth": round(rolling_avg(growth_rates, 3), 4),
        "rollingAvg6mGrowth": round(rolling_avg(growth_rates, 6), 4),
        "isSurging": is_surging,
        "sparkline": downloads[-6:],
    }
    if reason:
        result["surgingReason"] = reason
    return result


def calculate_aai_history(downloads_data, pkg_config_map):
    """
    Calculate Automation Acceleration Index per month.
    AAI = mean(Tier 2 MoM growth) / mean(Tier 1 MoM growth)
    Each package counted once (by its primary identity, not duplicated across industries).
    """
    pkg_monthly: dict[str, dict[str, int]] = {}
    for pkg_data in downloads_data["packages"]:
        name = pkg_data["package"]
        monthly = {}
        for d in pkg_data["data"]:
            monthly[d["month"]] = d["downloads"]
        pkg_monthly[name] = monthly

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
            elif config["tier"] == "tier2":
                tier2_growths.append(growth)

        if not tier1_growths or not tier2_growths:
            continue

        tier1_avg = sum(tier1_growths) / len(tier1_growths)
        tier2_avg = sum(tier2_growths) / len(tier2_growths)

        if tier1_avg <= 0.001:
            aai = tier2_avg / 0.001 if tier2_avg > 0 else 1.0
        else:
            aai = tier2_avg / tier1_avg

        aai = max(-10.0, min(10.0, aai))

        aai_history.append({
            "month": curr_month,
            "aai": round(aai, 3),
            "tier2AvgGrowth": round(tier2_avg, 4),
            "tier1AvgGrowth": round(tier1_avg, 4),
        })

    return aai_history


def determine_aai_trend(aai_history: list[dict]) -> str:
    if len(aai_history) < 3:
        return "stable"

    recent = [h["aai"] for h in aai_history[-3:]]
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


def calculate_employment_changes(bls_data, taxonomy):
    """
    Calculate employment change per industry:
    - % change since Nov 2022 (ChatGPT launch)
    - Year-over-year % change
    Average across all BLS series for each industry.
    """
    if not bls_data:
        return {}

    industry_changes = {}

    for industry_key, industry_config in taxonomy["industries"].items():
        bls_series_ids = [s["id"] for s in industry_config.get("blsSeries", [])]
        if not bls_series_ids:
            continue

        since_nov2022_changes = []
        yoy_changes = []

        for series in bls_data.get("series", []):
            if series["id"] not in bls_series_ids:
                continue

            data = series.get("data", [])
            if not data:
                continue

            # Build lookup
            by_month = {d["month"]: d["value"] for d in data}

            # Latest month
            latest_month = max(by_month.keys())
            latest_value = by_month[latest_month]

            # Nov 2022 baseline
            nov2022 = by_month.get("2022-11")
            if nov2022 and nov2022 > 0:
                change = (latest_value - nov2022) / nov2022
                since_nov2022_changes.append(change)

            # YoY: compare latest to same month previous year
            latest_year = int(latest_month[:4])
            latest_mo = latest_month[5:]
            prev_year_month = f"{latest_year - 1}-{latest_mo}"
            prev_year_value = by_month.get(prev_year_month)
            if prev_year_value and prev_year_value > 0:
                yoy = (latest_value - prev_year_value) / prev_year_value
                yoy_changes.append(yoy)

        industry_changes[industry_key] = {
            "employmentChangeSinceNov2022": round(
                sum(since_nov2022_changes) / len(since_nov2022_changes), 4
            ) if since_nov2022_changes else None,
            "employmentChangeYoY": round(
                sum(yoy_changes) / len(yoy_changes), 4
            ) if yoy_changes else None,
        }

    return industry_changes


def calculate_industry_metrics(package_metrics, taxonomy, employment_changes):
    """Aggregate metrics by industry. Tools counted fully in every industry they belong to."""
    industry_packages: dict[str, list[dict]] = {}

    for pm in package_metrics:
        # Skip tier1 packages (they have no industry assignment)
        if pm["tier"] == "tier1":
            continue
        for ind in pm["industries"]:
            if ind not in industry_packages:
                industry_packages[ind] = []
            industry_packages[ind].append(pm)

    results = []
    for industry_key, industry_config in taxonomy["industries"].items():
        pkgs = industry_packages.get(industry_key, [])
        growth_3m = [p["rollingAvg3mGrowth"] for p in pkgs if p["rollingAvg3mGrowth"] != 0]

        emp = employment_changes.get(industry_key, {})

        results.append({
            "industry": industry_key,
            "label": industry_config["label"],
            "color": industry_config["color"],
            "toolGrowth3m": round(
                sum(growth_3m) / len(growth_3m), 4
            ) if growth_3m else 0.0,
            "employmentChangeSinceNov2022": emp.get("employmentChangeSinceNov2022"),
            "employmentChangeYoY": emp.get("employmentChangeYoY"),
            "toolCount": len(pkgs),
            "surgingCount": sum(1 for p in pkgs if p["isSurging"]),
            "packages": [p["package"] for p in pkgs],
        })

    # Sort by tool growth (fastest first)
    results.sort(key=lambda x: x["toolGrowth3m"], reverse=True)
    return results


def main():
    taxonomy, downloads, bls = load_data()

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
        surging = " ** SURGING **" if metrics["isSurging"] else ""
        print(f"  {name}: {metrics['latestMonthlyDownloads']:>12,}/mo  MoM: {growth_pct:+.1f}%{surging}")

    # Calculate AAI history
    print("\nCalculating AAI history...")
    aai_history = calculate_aai_history(downloads, pkg_config_map)
    current_aai = aai_history[-1]["aai"] if aai_history else 1.0
    aai_trend = determine_aai_trend(aai_history)
    print(f"  Current AAI: {current_aai:.2f}x ({aai_trend})")
    print(f"  History: {len(aai_history)} months")

    # Calculate employment changes
    print("\nCalculating employment changes...")
    employment_changes = calculate_employment_changes(bls, taxonomy)
    for ind, changes in employment_changes.items():
        label = taxonomy["industries"][ind]["label"]
        emp = changes.get("employmentChangeSinceNov2022")
        yoy = changes.get("employmentChangeYoY")
        emp_str = f"{emp*100:+.1f}%" if emp is not None else "N/A"
        yoy_str = f"{yoy*100:+.1f}%" if yoy is not None else "N/A"
        print(f"  {label}: since Nov 2022: {emp_str}, YoY: {yoy_str}")

    # Calculate industry metrics
    print("\nCalculating industry metrics...")
    industry_metrics = calculate_industry_metrics(package_metrics, taxonomy, employment_changes)
    for im in industry_metrics:
        print(f"  {im['label']}: tool growth {im['toolGrowth3m']*100:+.1f}%, "
              f"{im['toolCount']} tools, {im['surgingCount']} surging")

    # Identify surging packages
    surging_packages = [p["package"] for p in package_metrics if p["isSurging"]]
    if surging_packages:
        print(f"\nSurging packages: {', '.join(surging_packages)}")

    # Count tier2 tools only
    tier2_count = sum(1 for p in package_metrics if p["tier"] == "tier2")

    # Write output
    output = {
        "calculatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "currentAAI": current_aai,
        "aaiTrend": aai_trend,
        "aaiHistory": aai_history,
        "industries": industry_metrics,
        "packages": package_metrics,
        "surgingPackages": surging_packages,
        "totalToolCount": tier2_count,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote metrics to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
