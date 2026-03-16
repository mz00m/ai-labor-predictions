"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Easter egg: "Confidence Interval" — hover a hero stat for 2+       */
/*  seconds and the number oscillates between its confidence bounds,   */
/*  revealing the uncertainty behind every point estimate.              */
/* ------------------------------------------------------------------ */

interface HeroStatWobbleProps {
  center: number;
  low: number;
  high: number;
  children: (displayValue: string | null, wobbling: boolean) => React.ReactNode;
}

export default function HeroStatWobble({
  center,
  low,
  high,
  children,
}: HeroStatWobbleProps) {
  const [wobbling, setWobbling] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | null>(null);
  const dwellTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();
  const startTimeRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => {
      if (dwellTimer.current) clearTimeout(dwellTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const startOscillation = useCallback(() => {
    if (reducedMotionRef.current) {
      // No animation — show range as text
      setDisplayValue(`${low}–${high}`);
      setWobbling(true);
      return;
    }

    setWobbling(true);
    startTimeRef.current = performance.now();
    const amplitude = (high - low) / 2;
    const midpoint = (high + low) / 2;
    const period = 3000; // 3 second full cycle

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      const t = (elapsed % period) / period;
      const value = midpoint + amplitude * Math.sin(t * 2 * Math.PI);
      setDisplayValue(value.toFixed(1));
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [low, high]);

  const stopOscillation = useCallback(() => {
    if (dwellTimer.current) clearTimeout(dwellTimer.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (wobbling && !reducedMotionRef.current) {
      // Spring back to center value
      const currentStr = displayValue;
      const currentVal = currentStr ? parseFloat(currentStr) : center;
      let val = currentVal;
      let velocity = 0;
      const stiffness = 200;
      const damping = 20;
      let lastTime = performance.now();

      const springTick = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        const force = (center - val) * stiffness;
        const dampForce = velocity * damping;
        velocity += (force - dampForce) * dt;
        val += velocity * dt;

        if (Math.abs(val - center) < 0.05 && Math.abs(velocity) < 0.5) {
          setDisplayValue(null);
          setWobbling(false);
          return;
        }

        setDisplayValue(val.toFixed(1));
        rafRef.current = requestAnimationFrame(springTick);
      };

      rafRef.current = requestAnimationFrame(springTick);
    } else {
      setDisplayValue(null);
      setWobbling(false);
    }
  }, [wobbling, displayValue, center]);

  const handleMouseEnter = () => {
    dwellTimer.current = setTimeout(startOscillation, 2000);
  };

  const handleMouseLeave = () => {
    stopOscillation();
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="contents"
    >
      {children(displayValue, wobbling)}
    </span>
  );
}
