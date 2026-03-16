"use client";

import { useEffect, useState } from "react";

const PROJECT_START = new Date("2026-02-22T00:00:00Z");

interface AboutStatsProps {
  totalCost: string;
}

export default function AboutStats({ totalCost }: AboutStatsProps) {
  const [commitCount, setCommitCount] = useState<number | null>(null);

  const daysSinceStart = Math.floor(
    (Date.now() - PROJECT_START.getTime()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    fetch("/api/commit-count")
      .then((res) => res.json())
      .then((data) => {
        if (data.commitCount) setCommitCount(data.commitCount);
      })
      .catch(() => {});
  }, []);

  return (
    <p className="text-[14px] text-[var(--muted)] leading-relaxed">
      Matt Zieger started this as a weekend vibe coding project {daysSinceStart} days ago
      {commitCount !== null ? (
        <>
          , and since then has made{" "}
          <span className="font-medium text-[var(--foreground)]">{commitCount}</span>{" "}
          improvements and counting.
        </>
      ) : (
        "."
      )}{" "}
      In total this has cost {totalCost}.
    </p>
  );
}
