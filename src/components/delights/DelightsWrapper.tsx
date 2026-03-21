"use client";

import { KonamiModeProvider } from "./KonamiMode";
import ScrollProgressMeter from "./ScrollProgressMeter";

/**
 * Client-side wrapper that provides all global delights:
 * - Konami Code mode (doomer/accelerationist)
 * - Scroll progress AI adoption meter
 *
 * Wrap this around {children} in the root layout.
 */

export default function DelightsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <KonamiModeProvider>
      <ScrollProgressMeter />
      {children}
    </KonamiModeProvider>
  );
}
