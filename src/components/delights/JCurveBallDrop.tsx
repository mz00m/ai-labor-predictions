"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * J-Curve Ball Drop Physics Demo
 *
 * Click the "Drop a ball" button to release a ball at the top of the J-curve.
 * It rolls down the curve path with realistic gravity, accelerates through
 * the trough, and climbs the other side. Multiple balls can pile up at the trough.
 *
 * Integrates alongside the existing JCurveChart SVG.
 */

interface Ball {
  id: number;
  t: number; // parametric position along curve (0-1)
  v: number; // velocity (dt/frame)
  opacity: number;
  color: string;
  size: number;
  settled: boolean;
}

const BALL_COLORS = ["#6B7BF7", "#F66B5C", "#3ECFAE", "#F7C96B", "#DDA0DD", "#FF8C42"];
const GRAVITY = 2.8; // How strongly slope affects velocity
const FRICTION = 0.992;
const BOUNCE_DAMPING = 0.3;

// Same curve as JCurveChart — normalized 0-1
const CURVE_POINTS = [
  [0, 0.5], [0.05, 0.49], [0.1, 0.46], [0.15, 0.4],
  [0.2, 0.33], [0.25, 0.27], [0.3, 0.23], [0.35, 0.21],
  [0.4, 0.2], [0.45, 0.21], [0.5, 0.25], [0.55, 0.32],
  [0.6, 0.42], [0.65, 0.53], [0.7, 0.62], [0.75, 0.69],
  [0.8, 0.74], [0.85, 0.78], [0.9, 0.8], [0.95, 0.81],
  [1, 0.82],
];

function getYAtT(t: number): number {
  // Interpolate between curve points
  const idx = t * (CURVE_POINTS.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, CURVE_POINTS.length - 1);
  const frac = idx - lo;
  return CURVE_POINTS[lo][1] * (1 - frac) + CURVE_POINTS[hi][1] * frac;
}

function getSlopeAtT(t: number): number {
  const dt = 0.01;
  const y0 = getYAtT(Math.max(0, t - dt));
  const y1 = getYAtT(Math.min(1, t + dt));
  return (y1 - y0) / (2 * dt);
}

let ballIdCounter = 0;

export default function JCurveBallDrop() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const animRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const dropBall = useCallback(() => {
    const newBall: Ball = {
      id: ++ballIdCounter,
      t: 0.02,
      v: 0.001,
      opacity: 1,
      color: BALL_COLORS[ballIdCounter % BALL_COLORS.length],
      size: 5 + Math.random() * 2,
      settled: false,
    };
    ballsRef.current = [...ballsRef.current, newBall];
    setBalls([...ballsRef.current]);

    if (reducedMotion) {
      // Instant settle at trough
      newBall.t = 0.4;
      newBall.v = 0;
      newBall.settled = true;
      ballsRef.current = [...ballsRef.current];
      setBalls([...ballsRef.current]);
      return;
    }

    // Start animation loop if not running
    if (!animRef.current) {
      const tick = () => {
        let anyMoving = false;
        ballsRef.current = ballsRef.current.map((ball) => {
          if (ball.settled) return ball;

          // Slope-driven acceleration (negative slope = downhill = positive acceleration)
          const slope = getSlopeAtT(ball.t);
          const acceleration = slope * GRAVITY * 0.001;
          let v = (ball.v + acceleration) * FRICTION;
          let t = ball.t + v;

          // Boundary checks
          if (t <= 0) {
            t = 0.001;
            v = Math.abs(v) * BOUNCE_DAMPING;
          }
          if (t >= 1) {
            t = 0.999;
            v = -Math.abs(v) * BOUNCE_DAMPING;
          }

          const isSettled = Math.abs(v) < 0.0001 && Math.abs(slope) < 0.3;
          if (!isSettled) anyMoving = true;

          return { ...ball, t, v, settled: isSettled };
        });

        // Fade out old settled balls (keep max 8)
        if (ballsRef.current.filter((b) => b.settled).length > 8) {
          const firstSettled = ballsRef.current.findIndex((b) => b.settled);
          if (firstSettled >= 0) {
            ballsRef.current = ballsRef.current.filter((_, i) => i !== firstSettled);
          }
        }

        setBalls([...ballsRef.current]);

        if (anyMoving) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = 0;
        }
      };
      animRef.current = requestAnimationFrame(tick);
    }
  }, [reducedMotion]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // SVG coordinate mapping (must match JCurveChart dimensions)
  const W = 720, H = 340;
  const padL = 60, padR = 80, padT = 40, padB = 60;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  function toSvg(t: number): [number, number] {
    const y = getYAtT(t);
    return [padL + t * chartW, padT + (1 - y) * chartH];
  }

  return (
    <div className="relative">
      {/* Ball overlay SVG — positioned absolutely over the JCurveChart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full pointer-events-none"
        style={{ maxWidth: 720 }}
        aria-hidden="true"
      >
        {balls.map((ball) => {
          const [cx, cy] = toSvg(ball.t);
          return (
            <g key={ball.id}>
              {/* Shadow */}
              <ellipse
                cx={cx}
                cy={cy + ball.size + 2}
                rx={ball.size * 0.6}
                ry={ball.size * 0.15}
                fill="rgba(0,0,0,0.1)"
                opacity={ball.opacity}
              />
              {/* Ball */}
              <circle
                cx={cx}
                cy={cy}
                r={ball.size}
                fill={ball.color}
                opacity={ball.opacity}
                style={{
                  filter: `drop-shadow(0 1px 2px ${ball.color}40)`,
                }}
              />
              {/* Highlight */}
              <circle
                cx={cx - ball.size * 0.25}
                cy={cy - ball.size * 0.25}
                r={ball.size * 0.3}
                fill="white"
                opacity={ball.opacity * 0.4}
              />
            </g>
          );
        })}
      </svg>

      {/* Drop button */}
      <button
        onClick={dropBall}
        className="absolute top-1 right-1 z-10 text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)]/10 px-2.5 py-1 rounded-full border border-[var(--accent)]/20 cursor-pointer"
        aria-label="Drop a ball on the J-curve"
      >
        Drop a ball
      </button>
    </div>
  );
}
