"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Source Tier "Weight" Visualization
 *
 * Shows a tiny gravity-affected circle next to each source in the source list.
 * Tier 1 sources have large, heavy circles; Tier 4 have tiny, light ones.
 * On hover, the circle "drops" with realistic bounce physics.
 *
 * Usage: <SourceWeightDot tier={1} /> next to a source item.
 */

interface SourceWeightDotProps {
  tier: 1 | 2 | 3 | 4;
  /** Optional sample size for extra weight scaling */
  sampleSize?: number;
}

const TIER_CONFIG = {
  1: { size: 9, weight: 4, color: "#22c55e", label: "Tier 1 — heavy weight" },
  2: { size: 7, weight: 2, color: "#3b82f6", label: "Tier 2 — moderate weight" },
  3: { size: 5, weight: 1, color: "#f59e0b", label: "Tier 3 — light weight" },
  4: { size: 3.5, weight: 0.5, color: "#ef4444", label: "Tier 4 — very light" },
};

export default function SourceWeightDot({ tier, sampleSize }: SourceWeightDotProps) {
  const config = TIER_CONFIG[tier];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Bounce animation on hover
  useEffect(() => {
    if (!isHovered || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const r = config.size;
    const gravity = 200 * config.weight;
    const restitution = 0.4 + (4 - tier) * 0.1; // lighter balls bounce more
    const floorY = h - r - 1;

    let y = r + 2;
    let vy = 0;
    let settled = false;

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Shadow
      ctx!.fillStyle = `${config.color}20`;
      ctx!.beginPath();
      ctx!.ellipse(w / 2, floorY + r, r * 0.6, r * 0.15, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Ball
      ctx!.fillStyle = config.color;
      ctx!.beginPath();
      ctx!.arc(w / 2, y, r, 0, Math.PI * 2);
      ctx!.fill();

      // Highlight
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.beginPath();
      ctx!.arc(w / 2 - r * 0.2, y - r * 0.2, r * 0.35, 0, Math.PI * 2);
      ctx!.fill();
    }

    function tick() {
      if (settled) return;

      const dt = 1 / 60;
      vy += gravity * dt;
      y += vy * dt;

      if (y >= floorY) {
        y = floorY;
        vy = -Math.abs(vy) * restitution;
        if (Math.abs(vy) < 5) {
          settled = true;
          y = floorY;
        }
      }

      draw();
      if (!settled) {
        animRef.current = requestAnimationFrame(tick);
      }
    }

    draw();
    animRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animRef.current);
  }, [isHovered, reducedMotion, tier, config]);

  // Static display when not hovered
  const restY = reducedMotion ? "center" : "bottom";

  return (
    <div
      className="relative inline-flex items-center shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={config.label}
    >
      {isHovered && !reducedMotion ? (
        <canvas
          ref={canvasRef}
          width={config.size * 4}
          height={config.size * 6}
          className="block"
          style={{
            width: config.size * 4,
            height: config.size * 6,
          }}
        />
      ) : (
        <div
          className="rounded-full"
          style={{
            width: config.size * 2,
            height: config.size * 2,
            backgroundColor: config.color,
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
}
