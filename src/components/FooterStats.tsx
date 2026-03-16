"use client";

import { useEffect, useState, useRef } from "react";

const PROJECT_START = new Date("2026-02-22T00:00:00Z");

/* ------------------------------------------------------------------ */
/*  Easter egg: "Source Zero" — triple-click "X days ago" to reveal    */
/*  a hand-drawn sparkline of the project's first week of commits.     */
/* ------------------------------------------------------------------ */

// Hardcoded first-week commit counts (historical, won't change)
const FIRST_WEEK = [3, 14, 11, 8, 22, 17, 9];
const FIRST_WEEK_MAX = Math.max(...FIRST_WEEK);

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

  const points = FIRST_WEEK.map((v, i) => ({
    x: padX + (i / (FIRST_WEEK.length - 1)) * usableW,
    y: padY + usableH - (v / FIRST_WEEK_MAX) * usableH,
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
  const clickTimesRef = useRef<number[]>([]);

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
    const now = Date.now();
    clickTimesRef.current.push(now);
    // Keep only last 3
    if (clickTimesRef.current.length > 3) {
      clickTimesRef.current = clickTimesRef.current.slice(-3);
    }
    // Check if 3 clicks within 500ms
    if (clickTimesRef.current.length >= 3) {
      const first = clickTimesRef.current[clickTimesRef.current.length - 3];
      if (now - first < 500) {
        setShowTimeline((prev) => !prev);
        clickTimesRef.current = [];
      }
    }
  };

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      started this as a weekend vibe coding project{" "}
      <span
        onClick={handleDaysClick}
        className="cursor-default select-none"
        role="button"
        tabIndex={-1}
        aria-hidden="true"
      >
        {daysSinceStart} days ago
      </span>
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
            className="block text-[10px] text-[var(--muted)] opacity-60 mt-0.5"
            style={{
              opacity: showTimeline ? 0.6 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
            }}
          >
            Day 1: 3 commits. Day 2: 14 commits. The weekend that got out of hand.
          </span>
        </span>
      </span>
    </span>
  );
}
