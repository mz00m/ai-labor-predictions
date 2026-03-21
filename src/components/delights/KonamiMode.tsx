"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

/**
 * Konami Code Easter Egg: "Doomer Mode" / "Accelerationist Mode"
 *
 * How to trigger:
 * - Type "doom" anywhere on the page → Doomer mode (pessimist filter)
 * - Type "acc" anywhere → Accelerationist mode (optimist filter)
 * - Konami code (↑↑↓↓←→←→BA) → cycles through modes
 * - Press Escape or click dismiss to return to normal
 *
 * Adds a CSS class to <html> that downstream components can read.
 */

type ViewMode = "normal" | "doomer" | "accelerationist";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

interface KonamiContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}

const KonamiContext = createContext<KonamiContextValue>({
  mode: "normal",
  setMode: () => {},
});

export function useKonamiMode() {
  return useContext(KonamiContext);
}

export function KonamiModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("normal");
  const [buffer, setBuffer] = useState<string[]>([]);
  const [charBuffer, setCharBuffer] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Apply CSS class to html element
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("doomer-mode", "accelerationist-mode");
    if (mode === "doomer") html.classList.add("doomer-mode");
    if (mode === "accelerationist") html.classList.add("accelerationist-mode");
  }, [mode]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Escape dismisses any mode
      if (e.key === "Escape" && mode !== "normal") {
        setMode("normal");
        setBuffer([]);
        setCharBuffer("");
        return;
      }

      // Skip if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Konami code detection
      setBuffer((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
          // Cycle: normal → doomer → accelerationist → normal
          setMode((m) =>
            m === "normal" ? "doomer" : m === "doomer" ? "accelerationist" : "normal"
          );
          return [];
        }
        return next;
      });

      // Character buffer for "doom" and "acc"
      if (e.key.length === 1) {
        setCharBuffer((prev) => {
          const next = (prev + e.key.toLowerCase()).slice(-4);
          if (next.endsWith("doom")) {
            setMode((m) => (m === "doomer" ? "normal" : "doomer"));
            return "";
          }
          if (next.endsWith("acc")) {
            setMode((m) => (m === "accelerationist" ? "normal" : "accelerationist"));
            return "";
          }
          return next;
        });
      }
    },
    [mode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <KonamiContext.Provider value={{ mode, setMode }}>
      {children}
      {mode !== "normal" && (
        <KonamiBanner mode={mode} onDismiss={() => setMode("normal")} reducedMotion={reducedMotion} />
      )}
    </KonamiContext.Provider>
  );
}

function KonamiBanner({
  mode,
  onDismiss,
  reducedMotion,
}: {
  mode: ViewMode;
  onDismiss: () => void;
  reducedMotion: boolean;
}) {
  const isDoomer = mode === "doomer";
  const bg = isDoomer
    ? "bg-gradient-to-r from-red-900/95 via-red-800/95 to-orange-900/95"
    : "bg-gradient-to-r from-emerald-900/95 via-green-800/95 to-teal-900/95";
  const borderColor = isDoomer ? "border-red-500/30" : "border-emerald-500/30";
  const icon = isDoomer ? "🔴" : "🟢";
  const label = isDoomer ? "Doomer Mode" : "Accelerationist Mode";
  const subtitle = isDoomer
    ? "Showing most pessimistic estimates only"
    : "Showing most optimistic estimates only";

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] ${bg} border-b ${borderColor} text-white px-4 py-2.5 flex items-center justify-between gap-3`}
      style={{
        animation: reducedMotion ? "none" : "konami-slide-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <div className="min-w-0">
          <span className="text-[13px] font-bold tracking-wide">{label}</span>
          <span className="text-[11px] opacity-70 ml-2 hidden sm:inline">{subtitle}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] opacity-50 hidden sm:block">
          Reality is somewhere in between
        </span>
        <button
          onClick={onDismiss}
          className="text-[11px] font-medium opacity-70 hover:opacity-100 px-2 py-1 rounded border border-white/20 hover:bg-white/10"
          aria-label="Dismiss filter mode"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default KonamiModeProvider;
