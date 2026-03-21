"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Shake to Shuffle Sources
 *
 * A button that physically simulates dropping all source cards as weighted objects.
 * Heavier-weighted sources (T1, large sample size, recent) settle to the top;
 * lighter ones sink to the bottom. Cards jostle with spring physics.
 *
 * Usage: Place next to the Sources heading on prediction detail pages.
 */

interface ShuffleSourcesProps {
  /** Number of sources to give visual feedback */
  sourceCount: number;
  /** Callback to trigger sort by weight (parent handles actual reorder) */
  onShuffle?: () => void;
}

export default function ShuffleSources({ sourceCount, onShuffle }: ShuffleSourcesProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const handleShuffle = useCallback(() => {
    if (isShuffling) return;
    setIsShuffling(true);

    // Animate all source items
    if (!reducedMotion) {
      const items = document.querySelectorAll(".source-item");
      items.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        const delay = Math.random() * 200;
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = -10 - Math.random() * 20;

        htmlEl.style.transition = `transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`;
        htmlEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        setTimeout(() => {
          htmlEl.style.transition = `transform 0.5s cubic-bezier(0.34,1.56,0.64,1)`;
          htmlEl.style.transform = "translate(0, 0)";
        }, 300 + delay);
      });
    }

    // Trigger the actual sort
    setTimeout(() => {
      onShuffle?.();
      setIsShuffling(false);
    }, reducedMotion ? 0 : 800);
  }, [isShuffling, onShuffle, reducedMotion]);

  return (
    <button
      ref={buttonRef}
      onClick={handleShuffle}
      disabled={isShuffling}
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all duration-200 ${
        isShuffling
          ? "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent-light)]"
          : "text-[var(--muted)] border-black/[0.08] hover:border-[var(--accent)]/30 hover:text-[var(--accent)] hover:bg-[var(--accent-light)]"
      }`}
      title="Sort sources by weight (tier, recency, sample size)"
      aria-label="Sort sources by weight"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className={isShuffling && !reducedMotion ? "animate-spin" : ""}
        style={{ animationDuration: "0.6s" }}
      >
        <path
          d="M2 4h12M4 8h8M6 12h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {isShuffling ? "Sorting..." : "Sort by weight"}
    </button>
  );
}
