"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Konami Code Easter Egg.
 * Type: up up down down left right left right b a
 * Triggers a confetti burst of tiny chart-themed shapes.
 */

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "square" | "bar";
  opacity: number;
}

const COLORS = ["#5C61F6", "#F66B5C", "#3ECFAE", "#F7C96B", "#93C5FD", "#ec4899"];

export default function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const bufferRef = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      bufferRef.current.push(e.key);
      if (bufferRef.current.length > KONAMI.length) {
        bufferRef.current = bufferRef.current.slice(-KONAMI.length);
      }
      if (
        bufferRef.current.length === KONAMI.length &&
        bufferRef.current.every((k, i) => k === KONAMI[i])
      ) {
        setActive(true);
        bufferRef.current = [];
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const spawnParticles = useCallback(() => {
    const particles: Particle[] = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < 120; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 3 + Math.random() * 8;
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * w * 0.4,
        y: h * 0.3 + (Math.random() - 0.5) * h * 0.2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: (["circle", "square", "bar"] as const)[Math.floor(Math.random() * 3)],
        opacity: 1,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesRef.current = spawnParticles();

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particlesRef.current) {
        if (p.opacity <= 0) continue;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.99; // drag
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.006;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // bar — tall and thin like a chart bar
          ctx.fillRect(-p.size / 4, -p.size, p.size / 2, p.size * 2);
        }

        ctx.restore();
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setActive(false);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, spawnParticles]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    />
  );
}
