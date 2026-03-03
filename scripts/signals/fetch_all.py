#!/usr/bin/env python3
"""
Run the full signals data pipeline:
  1. Fetch PyPI download stats
  2. Fetch npm download stats
  3. Fetch BLS employment data
  4. Fetch GitHub activity (stars, issues)
  5. Fetch StackOverflow question volume
  6. Calculate derived metrics

Usage:
    python3 scripts/signals/fetch_all.py
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent


def run_script(name: str) -> bool:
    script = SCRIPTS_DIR / name
    print(f"\n{'='*60}")
    print(f"Running {name}...")
    print(f"{'='*60}\n")

    result = subprocess.run(
        [sys.executable, str(script)],
        cwd=str(SCRIPTS_DIR.parent.parent),
    )

    if result.returncode != 0:
        print(f"\nERROR: {name} failed with exit code {result.returncode}")
        return False
    return True


def main():
    steps = [
        "fetch_pypistats.py",
        "fetch_npm.py",
        "fetch_bls.py",
        "fetch_github.py",
        "fetch_stackoverflow.py",
        "fetch_huggingface.py",
        "calculate_metrics.py",
    ]

    for step in steps:
        if not run_script(step):
            print(f"\nPipeline stopped at {step}.")
            sys.exit(1)

    print(f"\n{'='*60}")
    print("All data pipeline steps completed successfully!")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
