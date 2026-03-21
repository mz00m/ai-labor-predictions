"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Treemap Earthquake on Occupation Exposure
 *
 * A "Simulate AI Shock" button that triggers a physics-based earthquake:
 * all treemap rectangles shake loose, jostle, and re-settle into positions
 * weighted by a new risk scenario.
 *
 * Attach this component near the treemap on /occupation-exposure.
 */

interface TreemapEarthquakeProps {
  /** Callback to trigger re-sort/resize of treemap data */
  onShock?: () => void;
  /** Whether the treemap is currently in "shocked" state */
  isShocked?: boolean;
  /** Reset callback */
  onReset?: () => void;
}

export default function TreemapEarthquake({
  onShock,
  isShocked = false,
  onReset,
}: TreemapEarthquakeProps) {
  const [shaking, setShaking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const triggerQuake = useCallback(() => {
    if (shaking) return;
    setShaking(true);

    // Phase 1: Shake all treemap rects
    if (!reducedMotion) {
      const rects = document.querySelectorAll("[data-treemap-rect]");
      rects.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        const delay = Math.random() * 100;
        const intensity = 2 + Math.random() * 4;

        // Initial jolt
        htmlEl.style.transition = `transform 0.1s ease ${delay}ms`;
        htmlEl.style.transform = `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px) rotate(${(Math.random() - 0.5) * 2}deg)`;

        // Shake sequence
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
          shakeCount++;
          const decay = 1 - shakeCount / 8;
          if (shakeCount >= 8) {
            clearInterval(shakeInterval);
            htmlEl.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
            htmlEl.style.transform = "translate(0, 0) rotate(0deg)";
            return;
          }
          htmlEl.style.transition = "transform 0.05s linear";
          htmlEl.style.transform = `translate(${(Math.random() - 0.5) * intensity * decay}px, ${(Math.random() - 0.5) * intensity * decay}px) rotate(${(Math.random() - 0.5) * decay}deg)`;
        }, 60);
      });

      // Also shake the container itself
      const container = document.querySelector("[data-treemap-container]") as HTMLElement;
      if (container) {
        container.style.animation = "treemap-quake 0.5s ease-out";
        setTimeout(() => {
          container.style.animation = "";
        }, 600);
      }
    }

    // Phase 2: Trigger data re-sort after shake settles
    setTimeout(() => {
      onShock?.();
      setShaking(false);
    }, reducedMotion ? 0 : 800);
  }, [shaking, onShock, reducedMotion]);

  return (
    <div ref={containerRef} className="inline-flex items-center gap-2">
      {!isShocked ? (
        <button
          onClick={triggerQuake}
          disabled={shaking}
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            shaking
              ? "text-[#F66B5C] border-[#F66B5C]/30 bg-[#F66B5C]/5"
              : "text-[var(--muted)] border-black/[0.08] hover:border-[#F66B5C]/30 hover:text-[#F66B5C] hover:bg-[#F66B5C]/5"
          }`}
          title="Simulate a sudden AI capability jump and see how occupations re-rank"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L6 6l-4 1 3 3-1 4 4-2 4 2-1-4 3-3-4-1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {shaking ? "Simulating..." : "Simulate AI Shock"}
        </button>
      ) : (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border text-[var(--accent)] border-[var(--accent)]/20 bg-[var(--accent-light)] hover:bg-[var(--accent)]/10 transition-all duration-200"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 8a6 6 0 0111.4-2.6M14 8a6 6 0 01-11.4 2.6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M14 2v4h-4M2 14v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reset to baseline
        </button>
      )}
    </div>
  );
}
