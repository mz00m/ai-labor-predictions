"use client";

import { useEffect, useRef } from "react";

/**
 * Disagreement Shake: Adds a subtle tremor to cards with "significant disagreement".
 *
 * Wraps a card element. When sourceSpread is high, the card occasionally
 * trembles for ~200ms every 15-30 seconds, as if the sources are arguing inside.
 * Intensity scales with the actual disagreement level.
 *
 * Respects prefers-reduced-motion (no animation).
 */

interface DisagreementShakeProps {
  /** Whether this card has significant disagreement */
  hasDisagreement: boolean;
  /** Spread ratio: (max-min)/|mean|. Higher = more shaking */
  spreadRatio?: number;
  children: React.ReactNode;
}

export default function DisagreementShake({
  hasDisagreement,
  spreadRatio = 0.5,
  children,
}: DisagreementShakeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!hasDisagreement) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const intensity = Math.min(spreadRatio / 2, 1.5); // 0 to 1.5

    function shake() {
      const el = ref.current;
      if (!el) return;

      // Apply CSS animation
      const px = 0.3 + intensity * 0.7; // 0.3px to 1px max
      el.style.animation = `disagreement-tremble ${150 + intensity * 100}ms ease-in-out`;
      el.style.setProperty("--shake-px", `${px}px`);

      // Remove animation after it plays
      const cleanup = setTimeout(() => {
        el.style.animation = "";
      }, 300);

      // Schedule next shake (15-30s, random interval)
      const nextDelay = 15000 + Math.random() * 15000;
      timerRef.current = setTimeout(shake, nextDelay);

      return () => clearTimeout(cleanup);
    }

    // Initial delay before first shake (5-15s)
    const initialDelay = 5000 + Math.random() * 10000;
    timerRef.current = setTimeout(shake, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasDisagreement, spreadRatio]);

  return <div ref={ref}>{children}</div>;
}
