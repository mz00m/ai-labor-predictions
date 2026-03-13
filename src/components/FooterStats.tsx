"use client";

import { useEffect, useState } from "react";

const PROJECT_START = new Date("2026-02-22T00:00:00Z");

export default function FooterStats() {
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
    <span className="text-[13px] text-[var(--muted)]">
      <a
        href="https://www.linkedin.com/in/mattzieger"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[var(--foreground)]"
      >
        Matt Zieger
      </a>{" "}
      started this as a weekend vibe coding project {daysSinceStart} days ago
      {commitCount !== null ? (
        <>
          , and since then has made{" "}
          <span className="text-[var(--foreground)] font-medium">{commitCount}</span>{" "}
          improvements and counting.
        </>
      ) : (
        "."
      )}
    </span>
  );
}
