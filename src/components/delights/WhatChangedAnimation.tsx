"use client";

import { useState, useEffect, useRef } from "react";

/**
 * "What Changed?" Diff Animation on Data Updates
 *
 * After a new source is ingested and values change, this component
 * shows a one-time animation: the old value fades out and the new value
 * types in character-by-character (split-flap style). The confidence band
 * morphs smoothly from old bounds to new.
 *
 * Stores seen values in sessionStorage so animation only plays once per update.
 */

interface WhatChangedAnimationProps {
  /** Unique key for this prediction (e.g., slug) */
  predictionSlug: string;
  /** Current value to display */
  currentValue: number;
  /** Unit suffix */
  unit?: string;
  /** Previous value (if different, triggers animation) */
  previousValue?: number;
  /** Font size class */
  className?: string;
}

const FLIP_CHARS = "0123456789.-+%";

export default function WhatChangedAnimation({
  predictionSlug,
  currentValue,
  previousValue,
  unit = "%",
  className = "",
}: WhatChangedAnimationProps) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const targetStr = formatValue(currentValue, unit);
    const storageKey = `whatchanged-${predictionSlug}`;

    // Check if we've already shown this animation
    const lastSeen = sessionStorage.getItem(storageKey);
    if (lastSeen === targetStr || !previousValue || previousValue === currentValue) {
      setDisplayValue(targetStr);
      return;
    }

    // Store the new value
    sessionStorage.setItem(storageKey, targetStr);

    if (reducedMotion) {
      setDisplayValue(targetStr);
      setShowDiff(true);
      setTimeout(() => setShowDiff(false), 3000);
      return;
    }

    // Animate: split-flap from old to new
    const fromStr = formatValue(previousValue, unit);
    setIsAnimating(true);
    setShowDiff(true);

    // Phase 1: Show old value briefly
    setDisplayValue(fromStr);

    // Phase 2: Flip each character
    const maxLen = Math.max(fromStr.length, targetStr.length);
    const flipsPerChar = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < maxLen; i++) {
      const baseDelay = 400 + i * 80;

      // Random flips
      for (let f = 0; f < flipsPerChar; f++) {
        const timer = setTimeout(() => {
          setDisplayValue((prev) => {
            const chars = prev.split("");
            chars[i] = FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)];
            return chars.join("");
          });
        }, baseDelay + f * 60);
        animRef.current.push(timer);
      }

      // Final character
      const finalTimer = setTimeout(() => {
        setDisplayValue((prev) => {
          const chars = prev.split("");
          chars[i] = targetStr[i] ?? "";
          // Trim to target length
          return chars.slice(0, targetStr.length).join("");
        });
      }, baseDelay + flipsPerChar * 60);
      animRef.current.push(finalTimer);
    }

    // Phase 3: Clean up
    const cleanupTimer = setTimeout(() => {
      setDisplayValue(targetStr);
      setIsAnimating(false);
    }, 400 + maxLen * 80 + flipsPerChar * 60 + 200);
    animRef.current.push(cleanupTimer);

    const hideDiffTimer = setTimeout(() => setShowDiff(false), 4000);
    animRef.current.push(hideDiffTimer);

    return () => {
      animRef.current.forEach(clearTimeout);
      animRef.current = [];
    };
  }, [currentValue, previousValue, predictionSlug, unit, reducedMotion]);

  const diff = previousValue ? currentValue - previousValue : 0;
  const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  const diffColor = diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "var(--muted)";

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span
        className={`tabular-nums ${isAnimating ? "text-[var(--accent)]" : ""}`}
        style={{
          transition: isAnimating ? "none" : "color 0.3s ease",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {displayValue}
      </span>
      {showDiff && diff !== 0 && (
        <span
          className="text-base font-medium"
          style={{
            color: diffColor,
            animation: reducedMotion ? "none" : "milestone-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          ({diffStr})
        </span>
      )}
    </span>
  );
}

function formatValue(v: number, unit: string): string {
  const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(1);
  return `${formatted}${unit}`;
}
