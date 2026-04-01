"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Cursor Spotlight on History Timeline
 *
 * The cursor becomes a "spotlight" or "magnifying lens". As you move over
 * the GPT timeline section, a soft radial light reveals hidden micro-annotations
 * that aren't visible otherwise. Rewards slow, curious exploration.
 *
 * Wrap around the history timeline section. Hidden annotations appear
 * only when the spotlight is near them.
 */

interface Annotation {
  /** Relative position (0-1) along the x-axis of the container */
  x: number;
  /** Relative position (0-1) along the y-axis */
  y: number;
  /** The hidden text to reveal */
  text: string;
  /** Color accent */
  color: string;
}

const HIDDEN_ANNOTATIONS: Annotation[] = [
  {
    x: 0.08,
    y: 0.3,
    text: "Steam engines initially increased demand for horses",
    color: "#92400E",
  },
  {
    x: 0.25,
    y: 0.7,
    text: "Early cars were called 'horseless carriages'. We still name new tech after what it replaces",
    color: "#065F46",
  },
  {
    x: 0.45,
    y: 0.25,
    text: "ATMs led to more bank tellers, not fewer. Branches got cheaper to operate",
    color: "#1E40AF",
  },
  {
    x: 0.65,
    y: 0.65,
    text: "Spreadsheets eliminated 400K bookkeeping jobs but created 600K+ financial analyst roles",
    color: "#7C3AED",
  },
  {
    x: 0.85,
    y: 0.35,
    text: "Every past GPT compressed faster than predicted. AI is compressing fastest of all.",
    color: "#5C61F6",
  },
];

const SPOTLIGHT_RADIUS = 120; // px
const REVEAL_RADIUS = 140; // px. Slightly larger than spotlight

export default function CursorSpotlight({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  if (reducedMotion) {
    // Show all annotations statically with reduced opacity
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {HIDDEN_ANNOTATIONS.map((ann, i) => (
            <div
              key={i}
              className="absolute text-[10px] font-medium px-2 py-1 rounded-md max-w-[180px] leading-tight"
              style={{
                left: `${ann.x * 100}%`,
                top: `${ann.y * 100}%`,
                color: ann.color,
                backgroundColor: `${ann.color}10`,
                border: `1px solid ${ann.color}20`,
                transform: "translate(-50%, -50%)",
                opacity: 0.6,
              }}
            >
              {ann.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative cursor-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos(null);
      }}
    >
      {children}

      {/* Spotlight overlay */}
      {isHovering && mousePos && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Radial spotlight glow */}
          <div
            className="absolute rounded-full"
            style={{
              left: mousePos.x - SPOTLIGHT_RADIUS,
              top: mousePos.y - SPOTLIGHT_RADIUS,
              width: SPOTLIGHT_RADIUS * 2,
              height: SPOTLIGHT_RADIUS * 2,
              background: `radial-gradient(circle, rgba(92,97,246,0.06) 0%, transparent 70%)`,
              transition: "none",
            }}
          />

          {/* Custom cursor dot */}
          <div
            className="absolute w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(92,97,246,0.4)]"
            style={{
              left: mousePos.x - 4,
              top: mousePos.y - 4,
            }}
          />

          {/* Hidden annotations - revealed by proximity */}
          {HIDDEN_ANNOTATIONS.map((ann, i) => {
            const container = containerRef.current;
            if (!container) return null;
            const rect = container.getBoundingClientRect();
            const annX = ann.x * rect.width;
            const annY = ann.y * rect.height;
            const dist = Math.hypot(mousePos.x - annX, mousePos.y - annY);
            const opacity = dist < REVEAL_RADIUS
              ? Math.max(0, 1 - dist / REVEAL_RADIUS) * 0.9
              : 0;

            if (opacity <= 0.05) return null;

            return (
              <div
                key={i}
                className="absolute text-[10px] font-medium px-2 py-1 rounded-md max-w-[170px] leading-tight"
                style={{
                  left: `${ann.x * 100}%`,
                  top: `${ann.y * 100}%`,
                  color: ann.color,
                  backgroundColor: `${ann.color}${Math.round(opacity * 20).toString(16).padStart(2, "0")}`,
                  border: `1px solid ${ann.color}${Math.round(opacity * 40).toString(16).padStart(2, "0")}`,
                  transform: `translate(-50%, -50%) scale(${0.8 + opacity * 0.2})`,
                  opacity,
                }}
              >
                {ann.text}
              </div>
            );
          })}
        </div>
      )}

      {/* Hint text */}
      {!isHovering && (
        <p className="text-[10px] text-[var(--muted)] text-center mt-2 opacity-40 italic">
          Move your cursor over the timeline to discover hidden insights
        </p>
      )}
    </div>
  );
}
