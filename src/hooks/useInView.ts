"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns true once the element is visible in the viewport.
 * Fires once and disconnects (no repeat triggers).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.3
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
