#!/usr/bin/env python3
"""
Fetch HuggingFace model download data by pipeline category.

Tracks the top models in categories that map to our industry domains:
  - automatic-speech-recognition → Creative & Media
  - document-question-answering → Legal & Compliance, Finance
  - text-to-image → Creative & Media
  - text-generation → Software & IT (code models)
  - text-classification → Healthcare (biomedical)

For each category, fetches the top models by download count and aggregates
total downloads as an industry-level signal.

Usage:
    python3 scripts/signals/fetch_huggingface.py
"""

import json
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
OUTPUT_PATH = ROOT / "src" / "data" / "signals" / "huggingface_downloads.json"

HF_API = "https://huggingface.co/api/models"

# Categories to track, mapped to our industry keys
CATEGORIES = [
    {
        "pipeline_tag": "automatic-speech-recognition",
        "label": "Speech-to-Text",
        "industries": ["creative"],
        "top_n": 10,
    },
    {
        "pipeline_tag": "document-question-answering",
        "label": "Document QA",
        "industries": ["legal", "finance"],
        "top_n": 10,
    },
    {
        "pipeline_tag": "text-to-image",
        "label": "Image Generation",
        "industries": ["creative"],
        "top_n": 10,
    },
    {
        "pipeline_tag": "text-generation",
        "label": "Code Generation",
        "industries": ["software_it"],
        "top_n": 10,
        # Filter to code-focused models by searching for common code model names
        "filter_keywords": ["code", "starcoder", "codellama", "codegemma", "deepseek-coder", "qwen2.5-coder"],
    },
    {
        "pipeline_tag": "text-classification",
        "label": "Biomedical NLP",
        "industries": ["healthcare"],
        "top_n": 10,
        "filter_keywords": ["bio", "med", "clinical", "pubmed", "health"],
    },
]


def fetch_models(pipeline_tag: str, limit: int = 50) -> list[dict]:
    """Fetch models from HuggingFace API sorted by downloads."""
    params = {
        "pipeline_tag": pipeline_tag,
        "sort": "downloads",
        "direction": "-1",
        "limit": limit,
    }
    try:
        resp = requests.get(HF_API, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        print(f"  ERROR fetching {pipeline_tag}: {e}")
        return []


def filter_models(models: list[dict], keywords: list[str] | None) -> list[dict]:
    """If keywords provided, filter models to those matching any keyword in their ID."""
    if not keywords:
        return models
    filtered = []
    for m in models:
        model_id = m.get("id", "").lower()
        if any(kw.lower() in model_id for kw in keywords):
            filtered.append(m)
    return filtered


def main():
    print("Fetching HuggingFace model data...\n")

    results = []
    for cat in CATEGORIES:
        tag = cat["pipeline_tag"]
        label = cat["label"]
        top_n = cat["top_n"]
        keywords = cat.get("filter_keywords")

        print(f"[{label}] pipeline_tag={tag}", end="")
        if keywords:
            print(f" (filtering: {', '.join(keywords)})", end="")
        print("...")

        # Fetch more if we need to filter
        fetch_limit = 200 if keywords else top_n
        models = fetch_models(tag, limit=fetch_limit)
        if keywords:
            models = filter_models(models, keywords)
        models = models[:top_n]

        total_downloads = sum(m.get("downloads", 0) for m in models)
        total_likes = sum(m.get("likes", 0) for m in models)

        model_entries = []
        for m in models:
            model_entries.append({
                "id": m.get("id", ""),
                "downloads": m.get("downloads", 0),
                "likes": m.get("likes", 0),
            })
            print(f"  {m.get('id', '?')}: {m.get('downloads', 0):,} downloads, {m.get('likes', 0):,} likes")

        results.append({
            "pipelineTag": tag,
            "label": label,
            "industries": cat["industries"],
            "totalDownloads": total_downloads,
            "totalLikes": total_likes,
            "modelCount": len(model_entries),
            "models": model_entries,
        })

        print(f"  TOTAL: {total_downloads:,} downloads, {total_likes:,} likes ({len(model_entries)} models)\n")
        time.sleep(0.5)

    output = {
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "categories": results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Wrote {len(results)} categories to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
