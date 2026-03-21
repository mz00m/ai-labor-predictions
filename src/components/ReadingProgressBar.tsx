"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar at the top of the viewport showing scroll progress.
 * Appears only after user has scrolled past the first 100px.
 */
export default function ReadingProgressBar({ color = "var(--accent)" }: { color?: string }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      setVisible(scrollTop > 100);
      setProgress(Math.min(scrollTop / docHeight, 1));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none"
      style={{ opacity: 0.8 }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: color,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
