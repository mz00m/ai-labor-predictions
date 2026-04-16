"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";


/* ------------------------------------------------------------------ */
/*  Falling-dot physics for the broken chart Easter egg                */
/*  Dots detach from a "broken" chart line and fall under gravity.     */
/*  Trigger: visit any non-existent URL.                               */
/* ------------------------------------------------------------------ */

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  radius: number;
  color: string;
  bounced: boolean;
}

const DOT_COLORS = ["#6B7BF7", "#3ECFAE", "#F7C96B", "#9A9AAF", "#F26D6D"];
const GRAVITY = 680; // px/s²
const RESTITUTION = 0.4;
const FLOOR_Y = 180; // SVG units

function createDots(): Dot[] {
  // 12 dots scattered along the "chart line" from x=200..500
  return Array.from({ length: 12 }, (_, i) => {
    const progress = i / 11;
    const x = 200 + progress * 300;
    // Chart line: gentle upward curve for first 60%, then break downward
    const baseY = progress < 0.6
      ? 120 - progress * 40 + Math.sin(progress * 6) * 8
      : 120 - 0.6 * 40 + (progress - 0.6) * 200;
    return {
      x,
      y: Math.min(baseY, FLOOR_Y),
      vx: (Math.random() - 0.5) * 30,
      vy: -20 - Math.random() * 40,
      opacity: 1,
      radius: 3 + Math.random() * 2,
      color: DOT_COLORS[i % DOT_COLORS.length],
      bounced: false,
    };
  });
}

export default function NotFound() {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const [animating, setAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    if (mq.matches) {
      // Show dots at rest on the floor
      setDots(
        createDots().map((d) => ({
          ...d,
          y: FLOOR_Y - d.radius,
          vy: 0,
          vx: 0,
          opacity: 0.6,
          bounced: true,
        }))
      );
      return;
    }

    // Start animation after the line draws (0.8s delay)
    const timer = setTimeout(() => {
      setDots(createDots());
      setAnimating(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animating || reducedMotion) return;

    let frameId: number;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = now;

      setDots((prev) => {
        let allSettled = true;
        const next = prev.map((d) => {
          if (d.opacity <= 0) return d;
          allSettled = false;

          let { x, y, vx, vy, opacity, bounced } = d;
          vy += GRAVITY * dt;
          x += vx * dt;
          y += vy * dt;
          vx *= 0.99;

          // Bounce off floor
          if (y >= FLOOR_Y - d.radius) {
            y = FLOOR_Y - d.radius;
            vy = -Math.abs(vy) * RESTITUTION;
            if (!bounced) {
              bounced = true;
            }
            // Start fading after bounce
            if (Math.abs(vy) < 20) {
              opacity -= dt * 0.8;
            }
          }

          return { ...d, x, y, vx, vy, opacity: Math.max(0, opacity), bounced };
        });

        if (allSettled) setAnimating(false);
        return next;
      });

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [animating, reducedMotion]);

  // Chart line path: gentle curve then break
  const linePath = (() => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 30; i++) {
      const p = i / 30;
      const x = 60 + p * 480;
      if (p < 0.6) {
        const y = 120 - p * 40 + Math.sin(p * 6) * 8;
        pts.push([x, y]);
      } else {
        const y = 120 - 0.6 * 40 + (p - 0.6) * 200;
        if (y < FLOOR_Y + 20) pts.push([x, y]);
      }
    }
    return pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0]},${pt[1]}`).join(" ");
  })();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20">
      {/* 404 heading */}
      <div className="flex items-baseline gap-0 mb-6">
        <span className="text-[80px] sm:text-[120px] font-black tracking-tighter text-[#2E3650] leading-none">
          4
        </span>
        <span className="text-[80px] sm:text-[120px] font-black tracking-tighter text-[#F66B5C] leading-none">
          0
        </span>
        <span className="text-[80px] sm:text-[120px] font-black tracking-tighter text-[#2E3650] leading-none">
          4
        </span>
      </div>

      {/* Broken chart SVG */}
      <svg
        ref={canvasRef}
        viewBox="0 0 600 200"
        className="w-full max-w-md h-auto mb-8"
        aria-hidden="true"
      >
        {/* Grid lines */}
        <line x1="60" y1="40" x2="60" y2="180" stroke="#2E3650" strokeWidth="0.5" opacity="0.1" />
        <line x1="60" y1="180" x2="540" y2="180" stroke="#2E3650" strokeWidth="0.5" opacity="0.1" />
        {[60, 100, 140, 180].map((y) => (
          <line key={y} x1="60" y1={y} x2="540" y2={y} stroke="#2E3650" strokeWidth="0.5" opacity="0.06" strokeDasharray="3 3" />
        ))}

        {/* Chart line - draws in then breaks */}
        <path
          d={linePath}
          fill="none"
          stroke="#5C61F6"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={reducedMotion ? "" : "animate-chart-draw"}
          style={reducedMotion ? {} : {
            strokeDasharray: 800,
            strokeDashoffset: 800,
          }}
        />

        {/* Falling dots */}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.radius}
            fill={d.color}
            opacity={d.opacity}
          />
        ))}
      </svg>

      {/* Message */}
      <p className="text-lg text-[var(--muted)] mb-6 text-center">
        This page has been displaced.
      </p>

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-base font-medium text-[var(--accent)] hover:text-[var(--accent-text)] no-underline"
      >
        Back to the dashboard
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}
