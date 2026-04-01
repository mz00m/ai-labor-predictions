"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Canvas-based particle burst that fires when exposure score crosses
 * a threshold. Confetti for high risk (>70), sparkles for low risk (<20).
 * Discovered, not announced - the particles just appear.
 * Respects prefers-reduced-motion.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle";
}

const HIGH_RISK_COLORS = ["#EF4444", "#F97316", "#DC2626", "#FB923C", "#FCA5A5", "#6366F1"];
const LOW_RISK_COLORS = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#059669", "#5C61F6"];

interface ExposureParticlesProps {
  score: number;
  /** Fire trigger - increment to fire again */
  trigger: number;
}

export default function ExposureParticles({ score, trigger }: ExposureParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const spawnParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (reducedMotion.current) return;

      const isHighRisk = score > 70;
      const isLowRisk = score < 20;
      if (!isHighRisk && !isLowRisk) return;

      const colors = isHighRisk ? HIGH_RISK_COLORS : LOW_RISK_COLORS;
      const count = isHighRisk ? 35 : 20;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        newParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isHighRisk ? 2 : 1),
          life: 1,
          decay: 0.012 + Math.random() * 0.008,
          size: isHighRisk ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          shape: isHighRisk && Math.random() > 0.4 ? "rect" : "circle",
        });
      }
      particlesRef.current = [...particlesRef.current, ...newParticles];
    },
    [score]
  );

  // Animate particles
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const alive: Particle[] = [];
    for (const p of particlesRef.current) {
      // Physics: gravity + friction
      p.vy += 0.08;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0) continue;
      alive.push(p);

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    particlesRef.current = alive;

    if (alive.length > 0) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  // Fire on trigger change
  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match parent
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    spawnParticles(canvas);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, spawnParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
