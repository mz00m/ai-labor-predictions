"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Animates a number from 0 to `end` over `duration` ms using ease-out.
 * Returns the current animated value. Respects prefers-reduced-motion.
 */
export function useCountUp(
  end: number,
  duration: number = 800,
  /** Delay before animation starts (ms) */
  delay: number = 0
): number {
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setValue(end);
      return;
    }

    let raf: number;
    let startTime: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    if (delay > 0) {
      timeoutId = setTimeout(() => {
        raf = requestAnimationFrame(animate);
      }, delay);
    } else {
      raf = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [end, duration, delay]);

  return value;
}
