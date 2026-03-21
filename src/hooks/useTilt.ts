"use client";

import { useRef, useCallback, useState } from "react";

/**
 * Adds a subtle 3D tilt effect to an element on mouse move.
 * Returns ref + style to spread onto the target element.
 * Respects prefers-reduced-motion.
 */
export function useTilt(maxDeg: number = 4) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transition: "transform 0.4s ease",
  });
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setStyle({
        transform: `perspective(600px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg) scale(1.01)`,
        transition: "transform 0.1s ease",
      });
    },
    [maxDeg]
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.4s ease",
    });
  }, []);

  return { ref, style, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}
