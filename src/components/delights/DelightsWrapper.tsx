"use client";

import ScrollProgressMeter from "./ScrollProgressMeter";

/**
 * Client-side wrapper that provides global delights:
 * - Scroll progress gradient bar
 *
 * Wrap this around {children} in the root layout.
 */

export default function DelightsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgressMeter />
      {children}
    </>
  );
}
