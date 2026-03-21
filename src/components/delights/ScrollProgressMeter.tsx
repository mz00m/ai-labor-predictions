"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Scroll Progress as "AI Adoption" Meter
 *
 * A themed scroll progress bar at the top of the page that fills as you scroll.
 * At certain thresholds, shows mini milestone labels.
 * Only appears on long pages (prediction detail, history).
 *
 * Respects prefers-reduced-motion (static bar, no animations).
 */

const MILESTONES = [
  { at: 0.15, label: "Deep learning (2012)" },
  { at: 0.35, label: "GPT-3 (2020)" },
  { at: 0.55, label: "ChatGPT (2022)" },
  { at: 0.75, label: "Enterprise adoption (2024)" },
  { at: 0.92, label: "You are here" },
];

export default function ScrollProgressMeter() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  const milestoneTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastMilestoneRef = useRef<number>(-1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.min(scrollTop / docHeight, 1);
      setProgress(pct);
      setVisible(scrollTop > 100);

      // Check milestones
      if (!reducedMotion) {
        const reachedIdx = MILESTONES.findLastIndex((m) => pct >= m.at);
        if (reachedIdx >= 0 && reachedIdx !== lastMilestoneRef.current) {
          lastMilestoneRef.current = reachedIdx;
          setActiveMilestone(MILESTONES[reachedIdx].label);
          if (milestoneTimerRef.current) clearTimeout(milestoneTimerRef.current);
          milestoneTimerRef.current = setTimeout(() => setActiveMilestone(null), 2500);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (milestoneTimerRef.current) clearTimeout(milestoneTimerRef.current);
    };
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-black/[0.03]"
      aria-hidden="true"
    >
      {/* Progress fill */}
      <div
        className="h-full bg-gradient-to-r from-[#5C61F6] via-[#3ECFAE] to-[#F7C96B]"
        style={{
          width: `${progress * 100}%`,
          transition: reducedMotion ? "none" : "width 0.1s linear",
        }}
      />

      {/* Milestone dots */}
      {MILESTONES.map((m) => (
        <div
          key={m.at}
          className="absolute top-0 h-1"
          style={{ left: `${m.at * 100}%` }}
        >
          <div
            className="w-1 h-1 rounded-full bg-white/60"
            style={{
              opacity: progress >= m.at ? 1 : 0.3,
            }}
          />
        </div>
      ))}

      {/* Active milestone tooltip */}
      {activeMilestone && (
        <div
          className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-[var(--accent)] bg-white border border-[var(--accent)]/20 rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap"
          style={{
            animation: reducedMotion ? "none" : "milestone-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {activeMilestone}
        </div>
      )}
    </div>
  );
}
