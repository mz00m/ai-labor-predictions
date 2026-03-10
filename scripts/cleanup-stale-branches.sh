#!/bin/bash
# Cleanup stale remote branches that have already been merged via PRs
# Generated 2026-03-10
#
# All branches listed below have been verified as merged into main:
#   - claude/download-missing-sources-lVMG9  (PR #127)
#   - claude/fix-chat-links-bC9k5            (PR #132)
#   - claude/fix-research-digest-qNcTv       (PR #121)
#   - claude/run-weekly-digest-aCNoT         (PR #125/#126)
#   - digest/2026-W10                        (PR #83)
#   - feat/chat-analytics                    (PR #133/#135)
#   - digest/2026-W09                        (stale, superseded by W10/W11)

set -e

BRANCHES=(
  "claude/download-missing-sources-lVMG9"
  "claude/fix-chat-links-bC9k5"
  "claude/fix-research-digest-qNcTv"
  "claude/run-weekly-digest-aCNoT"
  "digest/2026-W10"
  "feat/chat-analytics"
  "digest/2026-W09"
)

echo "Deleting ${#BRANCHES[@]} stale remote branches..."
echo ""

for branch in "${BRANCHES[@]}"; do
  echo "Deleting origin/$branch"
  git push origin --delete "$branch" && echo "  OK" || echo "  FAILED"
done

echo ""
echo "Pruning stale remote-tracking refs..."
git remote prune origin

echo "Done."
