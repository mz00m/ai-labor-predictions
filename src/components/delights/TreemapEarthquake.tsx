"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Treemap Earthquake on Occupation Exposure
 *
 * A "Simulate AI Shock" button that triggers a physics-based earthquake:
 * the canvas treemap container shakes with CSS animation, then the
 * dimension switches to show a "shocked" view (technicalExposure at max).
 *
 * Works with the canvas-based KarpathyTreemap by shaking its container.
 */

interface TreemapEarthquakeProps {
  /** Callback to switch dimension to simulate shock */
  onShock: () => void;
  /** Whether the treemap is currently in "shocked" state */
  isShocked: boolean;
  /** Reset callback */
  onReset: () => void;
}

export default function TreemapEarthquake({
  onShock,
  isShocked,
  onReset,
}: TreemapEarthquakeProps) {
  const [shaking, setShaking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const triggerQuake = useCallback(() => {
    if (shaking) return;
    setShaking(true);

    if (!reducedMotion) {
      // Find the treemap canvas wrapper and shake it
      const treemapSection = document.getElementById("treemap");
      if (treemapSection) {
        // Find the canvas element inside
        const canvas = treemapSection.querySelector("canvas");
        const target = canvas?.parentElement ?? treemapSection;
        target.style.animation = "treemap-quake 0.6s ease-out";

        // Add a brief red flash overlay
        const flash = document.createElement("div");
        flash.style.cssText = `
          position: absolute; inset: 0; pointer-events: none; z-index: 10;
          background: radial-gradient(ellipse at center, rgba(246,107,92,0.15), transparent 70%);
          animation: treemap-flash 0.6s ease-out forwards;
        `;
        target.style.position = "relative";
        target.appendChild(flash);

        setTimeout(() => {
          target.style.animation = "";
          flash.remove();
        }, 700);
      }
    }

    // Switch dimension after shake settles
    setTimeout(() => {
      onShock();
      setShaking(false);
    }, reducedMotion ? 0 : 650);
  }, [shaking, onShock, reducedMotion]);

  return (
    <div className="inline-flex items-center gap-2">
      {!isShocked ? (
        <button
          onClick={triggerQuake}
          disabled={shaking}
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            shaking
              ? "text-[#F66B5C] border-[#F66B5C]/40 bg-[#F66B5C]/10"
              : "text-white/50 border-white/[0.1] hover:border-[#F66B5C]/40 hover:text-[#F66B5C] hover:bg-[#F66B5C]/10"
          }`}
          title="Simulate a sudden AI capability jump and see how occupations re-rank by technical exposure"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1l1.5 4.5H14l-3.5 2.8 1.2 4.7L8 10.2 4.3 13l1.2-4.7L2 5.5h4.5z"
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
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border text-white/50 border-white/[0.1] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all duration-200"
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
