"use client";

import { useState, useEffect } from "react";

/**
 * Scroll Progress Bar
 *
 * A simple scroll progress bar at the top of the page with a color gradient.
 * No labels - the gradient speaks for itself.
 *
 * Respects prefers-reduced-motion (static bar, no transition).
 */

export default function ScrollProgressMeter() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
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
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-black/[0.03]"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#5C61F6] via-[#3ECFAE] to-[#F7C96B]"
        style={{
          width: `${progress * 100}%`,
          transition: reducedMotion ? "none" : "width 0.1s linear",
        }}
      />
    </div>
  );
}
