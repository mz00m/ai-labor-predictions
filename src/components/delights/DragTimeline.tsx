"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Drag the Timeline on Prediction Charts
 *
 * Renders a draggable handle at the end year of a prediction chart.
 * Users can drag left/right to see "What if displacement happens by 2027?"
 * The confidence band stretches/compresses like elastic.
 * Releasing snaps back with spring physics wobble.
 *
 * Overlay this on the prediction chart area.
 */

interface DragTimelineProps {
  /** The original target year (e.g., 2030) */
  targetYear: number;
  /** Current year for left bound */
  currentYear?: number;
  /** Min/max range for the stat */
  min: number;
  max: number;
  /** Unit suffix */
  unit?: string;
  /** Mean value */
  mean: number;
}

export default function DragTimeline({
  targetYear,
  currentYear = 2025,
  min,
  max,
  mean,
  unit = "%",
}: DragTimelineProps) {
  const [dragOffset, setDragOffset] = useState(0); // px offset from original position
  const [isDragging, setIsDragging] = useState(false);
  const [springOffset, setSpringOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const animRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX - dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newOffset = clientX - startXRef.current;
      // Clamp to reasonable range (-200 to 100 px)
      setDragOffset(Math.max(-200, Math.min(100, newOffset)));
    };

    const handleEnd = () => {
      setIsDragging(false);
      velocityRef.current = dragOffset * 0.3; // Initial spring velocity

      if (reducedMotion) {
        setDragOffset(0);
        setSpringOffset(0);
        return;
      }

      // Spring back animation
      let offset = dragOffset;
      let velocity = velocityRef.current;
      const stiffness = 300;
      const damping = 20;

      const tick = () => {
        const force = -offset * stiffness;
        const dampForce = velocity * damping;
        velocity += (force - dampForce) * (1 / 60);
        offset += velocity * (1 / 60);

        if (Math.abs(offset) < 0.5 && Math.abs(velocity) < 1) {
          setDragOffset(0);
          setSpringOffset(0);
          return;
        }

        setDragOffset(offset);
        setSpringOffset(offset);
        animRef.current = requestAnimationFrame(tick);
      };

      animRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, dragOffset, reducedMotion]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Calculate derived year from offset
  const pxPerYear = 40; // approximate
  const yearShift = Math.round(dragOffset / pxPerYear);
  const displayYear = targetYear + yearShift;
  const yearRange = targetYear - currentYear;
  const compressionFactor = yearShift < 0
    ? Math.max(0.5, (yearRange + yearShift) / yearRange)
    : Math.min(1.5, (yearRange + yearShift) / yearRange);

  // Adjusted confidence band based on time compression/expansion
  const adjustedMin = min * compressionFactor;
  const adjustedMax = max * (2 - compressionFactor);

  const isActive = isDragging || Math.abs(dragOffset) > 1;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Draggable handle */}
      <div
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 cursor-ew-resize select-none touch-none ${
          isDragging ? "scale-110" : ""
        }`}
        style={{
          transform: `translate(${dragOffset}px, -50%)`,
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="slider"
        aria-label={`Drag to adjust target year. Currently ${displayYear}`}
        aria-valuemin={currentYear + 1}
        aria-valuemax={targetYear + 5}
        aria-valuenow={displayYear}
        tabIndex={0}
      >
        {/* Handle visual */}
        <div className={`flex flex-col items-center gap-0.5 ${isDragging ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
          <div className="w-4 h-8 rounded-full bg-[var(--accent)] border-2 border-white shadow-md flex items-center justify-center">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M2 2v8M6 2v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Year tooltip — shows when dragging */}
      {isActive && (
        <div
          className="absolute -top-10 z-30 text-[11px] font-bold text-white bg-[var(--accent)] rounded-md px-2.5 py-1 shadow-lg whitespace-nowrap"
          style={{
            right: -dragOffset - 12,
            animation: reducedMotion ? "none" : "milestone-pop 0.15s ease-out both",
          }}
        >
          by {displayYear}
          <span className="text-[9px] opacity-70 ml-1.5">
            ({adjustedMin.toFixed(0)}–{adjustedMax.toFixed(0)}{unit} range)
          </span>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--accent)] rotate-45" />
        </div>
      )}
    </div>
  );
}
