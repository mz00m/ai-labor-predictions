"use client";

import { useRef, useCallback, useEffect, useState } from "react";

/**
 * Physics-based magnetic tilt for card elements.
 * Returns a ref to attach and a style object with transform + transition.
 * Uses spring physics for settling - things find their place naturally.
 * Respects prefers-reduced-motion.
 */
export function useMagneticTilt<T extends HTMLElement = HTMLDivElement>(opts?: {
  /** Max tilt angle in degrees (default: 4) */
  maxTilt?: number;
  /** Perspective distance in px (default: 800) */
  perspective?: number;
  /** Spring stiffness (default: 200) */
  stiffness?: number;
  /** Spring damping (default: 20) */
  damping?: number;
  /** Subtle scale on hover (default: 1.015) */
  hoverScale?: number;
}) {
  const {
    maxTilt = 4,
    perspective = 800,
    stiffness = 200,
    damping = 20,
    hoverScale = 1.015,
  } = opts ?? {};

  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const rafRef = useRef<number>(0);
  const currentRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const targetRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const velocityRef = useRef({ rotateX: 0, rotateY: 0, scale: 0 });
  const activeRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const animate = useCallback(() => {
    const current = currentRef.current;
    const target = targetRef.current;
    const velocity = velocityRef.current;
    const dt = 1 / 60; // assume 60fps for spring calc

    // Spring physics for each axis
    for (const key of ["rotateX", "rotateY", "scale"] as const) {
      const force = (target[key] - current[key]) * stiffness;
      const dampForce = velocity[key] * damping;
      velocity[key] += (force - dampForce) * dt;
      current[key] += velocity[key] * dt;
    }

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${current.rotateX.toFixed(2)}deg) rotateY(${current.rotateY.toFixed(2)}deg) scale(${current.scale.toFixed(4)})`,
      transition: "box-shadow 0.2s ease",
    });

    // Keep animating if still moving
    const moving =
      Math.abs(velocity.rotateX) > 0.01 ||
      Math.abs(velocity.rotateY) > 0.01 ||
      Math.abs(velocity.scale) > 0.001 ||
      Math.abs(target.rotateX - current.rotateX) > 0.01 ||
      Math.abs(target.rotateY - current.rotateY) > 0.01;

    if (moving || activeRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [perspective, stiffness, damping]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reducedMotionRef.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      // Map to tilt: center = 0, edges = maxTilt
      targetRef.current.rotateX = (0.5 - y) * maxTilt;
      targetRef.current.rotateY = (x - 0.5) * maxTilt;
      targetRef.current.scale = hoverScale;
    },
    [maxTilt, hoverScale]
  );

  const onMouseEnter = useCallback(() => {
    if (reducedMotionRef.current) return;
    activeRef.current = true;
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const onMouseLeave = useCallback(() => {
    activeRef.current = false;
    targetRef.current = { rotateX: 0, rotateY: 0, scale: 1 };
    // Let the animation loop continue to spring back
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onMouseEnter, onMouseMove, onMouseLeave]);

  return { ref, style };
}
