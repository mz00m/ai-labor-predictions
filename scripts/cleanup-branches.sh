#!/bin/bash
# Branch cleanup script for ai-labor-predictions
# Run this locally to delete stale remote branches
#
# Usage: bash scripts/cleanup-branches.sh [--dry-run]

set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN MODE (no branches will be deleted) ==="
  echo
fi

# Branches to delete
BRANCHES_TO_DELETE=(
  "digest/2026-W10"
  "claude/fix-research-digest-qNcTv"
  "claude/run-weekly-digest-aCNoT"
  "claude/download-missing-sources-lVMG9"
  "claude/fix-chat-links-bC9k5"
)

echo "Branches targeted for deletion:"
for branch in "${BRANCHES_TO_DELETE[@]}"; do
  echo "  - $branch"
done
echo

if [[ "$DRY_RUN" == true ]]; then
  echo "Run without --dry-run to actually delete these branches."
  exit 0
fi

read -p "Proceed with deletion? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

for branch in "${BRANCHES_TO_DELETE[@]}"; do
  echo "Deleting origin/$branch ..."
  git push origin --delete "$branch" 2>&1 && echo "  Done." || echo "  Failed (may already be deleted)."
done

echo
echo "Cleanup complete. Remaining remote branches:"
git fetch --prune origin
git branch -r
