"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Reduced motion check
// ---------------------------------------------------------------------------

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---------------------------------------------------------------------------
// Spring-loaded button wrapper
// ---------------------------------------------------------------------------
// Compresses on press, springs back with overshoot on release.
// Wraps any clickable element.

export function useSpringPress() {
  const [pressed, setPressed] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  const style: React.CSSProperties = reduced.current
    ? {}
    : {
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: pressed
          ? "transform 0.1s ease-in"
          : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };

  const handlers = {
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
  };

  return { style, handlers };
}

// ---------------------------------------------------------------------------
// Pill pop – brief scale overshoot when a pill toggles on
// ---------------------------------------------------------------------------

export function usePillPop(isSelected: boolean) {
  const prevSelected = useRef(isSelected);
  const [popping, setPopping] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (isSelected && !prevSelected.current && !reduced.current) {
      setPopping(true);
      const id = setTimeout(() => setPopping(false), 300);
      return () => clearTimeout(id);
    }
    prevSelected.current = isSelected;
  }, [isSelected]);

  const style: React.CSSProperties = popping
    ? {
        transform: "scale(1)",
        animation: "pill-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }
    : {};

  return { style };
}

// ---------------------------------------------------------------------------
// Particle burst – small dots burst from a point (canvas-free, DOM-based)
// ---------------------------------------------------------------------------
// Returns a trigger function and a portal element to render.

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

const BURST_COLORS = ["#5C61F6", "#a78bfa", "#7c3aed", "#818cf8", "#c4b5fd"];

export function useParticleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const frameRef = useRef<number>();
  const idCounter = useRef(0);

  const burst = useCallback(
    (originX: number, originY: number, count = 12) => {
      if (prefersReducedMotion()) return;

      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        newParticles.push({
          id: idCounter.current++,
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // slight upward bias
          size: 3 + Math.random() * 3,
          color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
          opacity: 1,
        });
      }

      setParticles(newParticles);

      let frame = 0;
      const maxFrames = 40;

      function animate() {
        frame++;
        if (frame > maxFrames) {
          setParticles([]);
          return;
        }
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.12, // gravity
              vx: p.vx * 0.98, // friction
              opacity: 1 - frame / maxFrames,
              size: p.size * (1 - frame / maxFrames * 0.3),
            }))
            .filter((p) => p.opacity > 0)
        );
        frameRef.current = requestAnimationFrame(animate);
      }

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(animate);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const portal =
    particles.length > 0 ? (
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>
    ) : null;

  return { burst, portal };
}

// ---------------------------------------------------------------------------
// Counting number animation – counts from 0 to target
// ---------------------------------------------------------------------------

export function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (reduced.current || target === 0) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Global keyframe injection (pill-pop animation)
// ---------------------------------------------------------------------------

export function DelightStyles() {
  return (
    <style jsx global>{`
      @keyframes pill-pop {
        0% { transform: scale(0.85); }
        50% { transform: scale(1.08); }
        100% { transform: scale(1); }
      }
      @keyframes score-glow {
        0% { box-shadow: 0 0 0 0 rgba(92, 97, 246, 0.4); }
        50% { box-shadow: 0 0 12px 4px rgba(92, 97, 246, 0.2); }
        100% { box-shadow: 0 0 0 0 rgba(92, 97, 246, 0); }
      }
      @keyframes bar-grow {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
    `}</style>
  );
}
