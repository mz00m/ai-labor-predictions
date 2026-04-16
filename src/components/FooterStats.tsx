"use client";

import { useEffect, useState } from "react";

const PROJECT_START = new Date("2026-02-22T00:00:00Z");

/* ------------------------------------------------------------------ */
/*  Easter egg: "Source Zero" - click "X days ago" to reveal a         */
/*  hand-drawn sparkline of early commit milestones.                   */
/* ------------------------------------------------------------------ */

// Hardcoded commit milestones (historical, won't change)
// Days 1-7 + day 22 (the big push)
const COMMIT_DAYS = [3, 14, 11, 8, 22, 17, 9, 88];
const COMMIT_DAYS_MAX = Math.max(...COMMIT_DAYS);

// Deterministic wobble for hand-drawn feel
function wobble(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // -1 to 1
}

function HandDrawnSparkline() {
  const w = 280;
  const h = 32;
  const padX = 8;
  const padY = 4;
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;

  const points = COMMIT_DAYS.map((v, i) => ({
    x: padX + (i / (COMMIT_DAYS.length - 1)) * usableW,
    y: padY + usableH - (v / COMMIT_DAYS_MAX) * usableH,
  }));

  // Build a wobbly cubic bezier path
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    const cp1y = p0.y + wobble(i * 3) * 1.5;
    const cp2y = p1.y + wobble(i * 7 + 1) * 1.5;
    d += ` C${mx},${cp1y} ${mx},${cp2y} ${p1.x},${p1.y}`;
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="block"
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2}
          fill="var(--accent)"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

export default function FooterStats() {
  const [commitCount, setCommitCount] = useState<number | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
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

  const handleDaysClick = () => {
    setShowTimeline((prev) => !prev);
  };

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <span className="text-base text-[var(--muted)]">
      <a
        href="https://www.linkedin.com/in/mattzieger"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[var(--foreground)]"
      >
        Matt Zieger
      </a>{" "}
      started this as a weekend vibe coding project{" "}
      <button
        onClick={handleDaysClick}
        className="cursor-default select-none inline bg-transparent border-none p-0 font-inherit text-inherit"
        aria-expanded={showTimeline}
        aria-label="Toggle commit timeline"
      >
        {daysSinceStart} days ago
      </button>
      {commitCount !== null ? (
        <>
          , and since then has made{" "}
          <span className="text-[var(--foreground)] font-medium">{commitCount}</span>{" "}
          improvements and counting.
        </>
      ) : (
        "."
      )}
      {/* Hidden sparkline timeline */}
      <span
        className="block overflow-hidden"
        style={{
          maxHeight: showTimeline ? 80 : 0,
          transition: reducedMotion ? "none" : "max-height 0.3s ease",
        }}
      >
        <span className="block mt-2">
          <HandDrawnSparkline />
          <span
            className="block text-2xs text-[var(--muted)] opacity-60 mt-0.5"
            style={{
              opacity: showTimeline ? 0.6 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
            }}
          >
            Day 1: 3 commits. Day 2: 14 commits. Day 22: 88 commits. The weekend that got out of hand.
          </span>
        </span>
      </span>
    </span>
  );
}
