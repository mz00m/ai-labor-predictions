"use client";

import { useEffect, useRef, useState } from "react";
import type { IndustryMetrics } from "@/lib/signal-types";
import { useMagneticTilt } from "@/hooks/useMagneticTilt";
import { useInView } from "@/hooks/useInView";

interface IndustryCardProps {
  industry: IndustryMetrics;
  isExpanded: boolean;
  onToggle: () => void;
}

function getHeatBg(growth: number): string {
  if (growth <= 0) return "rgba(220, 38, 38, 0.06)";
  if (growth <= 0.05) return "rgba(22, 163, 74, 0.06)";
  if (growth <= 0.10) return "rgba(22, 163, 74, 0.08)";
  if (growth <= 0.20) return "rgba(22, 163, 74, 0.10)";
  if (growth <= 0.40) return "rgba(22, 163, 74, 0.14)";
  return "rgba(22, 163, 74, 0.18)";
}

function formatEmployment(val: number | null): string {
  if (val === null) return "No data";
  const pct = (val * 100).toFixed(1);
  return `${val >= 0 ? "+" : ""}${pct}%`;
}

function employmentColor(val: number | null): string {
  if (val === null) return "var(--muted)";
  if (val > 0.02) return "#16a34a";
  if (val < -0.02) return "#dc2626";
  return "var(--muted)";
}

/** Animates a number from 0 to target over ~600ms on mount (once in view) */
function useAnimatedNumber(target: number, inView: boolean): number {
  const [val, setVal] = useState(0);
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) setVal(target);
  }, [target]);

  useEffect(() => {
    if (!inView || reducedMotion.current) return;
    let start: number | null = null;
    let raf: number;
    const duration = 600;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * target);
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return val;
}

export default function IndustryCard({
  industry,
  isExpanded,
  onToggle,
}: IndustryCardProps) {
  const growth = industry.toolGrowth3m;
  const heatWidth = Math.min(Math.max(growth * 100, 0), 100);

  // Magnetic tilt for the card
  const { ref: tiltRef, style: tiltStyle } = useMagneticTilt<HTMLButtonElement>({
    maxTilt: 3,
    hoverScale: 1.01,
  });

  // Animate heat bar and numbers on scroll-in
  const { ref: viewRef, inView } = useInView<HTMLButtonElement>(0.3);
  const animGrowth = useAnimatedNumber(growth * 100, inView);
  const empChange = industry.employmentChangeSinceNov2022;
  const animEmp = useAnimatedNumber(empChange !== null ? empChange * 100 : 0, inView);
  const animHeat = useAnimatedNumber(heatWidth, inView);

  // Merge refs
  const mergedRef = useRef<HTMLButtonElement>(null);
  const setRefs = (el: HTMLButtonElement | null) => {
    (mergedRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
    (tiltRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
    (viewRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
  };

  return (
    <button
      ref={setRefs}
      onClick={onToggle}
      className={`industry-card w-full text-left rounded-xl border p-4 sm:p-5 ${
        isExpanded
          ? "border-black/[0.12] bg-white shadow-sm"
          : "border-black/[0.06] bg-white"
      }`}
      style={isExpanded ? undefined : tiltStyle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="industry-dot w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: industry.color }}
          />
          <h3 className="text-[15px] sm:text-[17px] font-bold text-[var(--foreground)]">
            {industry.label}
          </h3>
        </div>
        <span
          className="industry-chevron text-[12px] text-[var(--muted)] shrink-0 mt-0.5 inline-block"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          &#9660;
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* AI tool growth */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-0.5">
            AI tool growth
          </p>
          <p
            className="text-[22px] sm:text-[26px] font-black stat-number leading-none tabular-nums"
            style={{
              color: growth > 0 ? "#16a34a" : growth < 0 ? "#dc2626" : "var(--muted)",
            }}
          >
            {animGrowth >= 0 ? "+" : ""}
            {animGrowth.toFixed(1)}%
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">3-month avg</p>
        </div>

        {/* Employment trend */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)] mb-0.5">
            Employment (BLS)
          </p>
          <p
            className="text-[22px] sm:text-[26px] font-black stat-number leading-none tabular-nums"
            style={{
              color: employmentColor(industry.employmentChangeSinceNov2022),
            }}
          >
            {empChange === null
              ? "No data"
              : `${animEmp >= 0 ? "+" : ""}${animEmp.toFixed(1)}%`}
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">
            vs late 2022
          </p>
        </div>
      </div>

      {/* Heat bar - grows from left on scroll-in */}
      <div className="mt-3 h-1.5 rounded-full bg-black/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${animHeat}%`,
            background: `linear-gradient(to right, #bbf7d0, #16a34a)`,
            opacity: 0.7,
            transition: "none",
          }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>
          {industry.toolCount} tool{industry.toolCount !== 1 ? "s" : ""} tracked
        </span>
        {industry.surgingCount > 0 && (
          <span
            className="surging-badge font-semibold px-1.5 py-0.5 rounded-full text-[10px]"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#d97706",
            }}
          >
            {industry.surgingCount} surging
          </span>
        )}
      </div>
    </button>
  );
}
