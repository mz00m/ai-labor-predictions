"use client";

/**
 * SplitFlapWord — mechanical split-flap (Solari board) display.
 *
 * Mimics a real train station departure board: each character has a visible
 * top/bottom split with a divider line. Characters drop through with a sharp,
 * mechanical "chka-chka-chka" rhythm — abrupt snaps, not smooth easing.
 *
 * Sequence: "yet." → "expected." → "today." → "ever." → "maybe?"
 */

import { useState, useEffect, useCallback, useRef } from "react";

const WORDS = ["yet.", "expected.", "today.", "ever.", "maybe?"];
const HOLD_TIMES = [2400, 500, 500, 500, Infinity];

// Mechanical timing — sharp, regular intervals like a real board
const TICK_MS = 55; // Time per flap tick — the "chka" rhythm
const TICKS_PER_CHAR = 6; // How many flaps each character cycles through
const CHAR_STAGGER = 15; // ms between columns starting (near-simultaneous, like real boards)

// The alphabet the flaps cycle through (real boards use this order)
const FLAP_ORDER = " ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?abcdefghijklmnopqrstuvwxyz";

const STYLE_ID = "split-flap-styles";
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .sf-cell {
      display: inline-flex;
      position: relative;
      width: 0.62em;
      height: 1.3em;
      overflow: hidden;
      border-radius: 2px;
      vertical-align: baseline;
    }
    .sf-cell-inner {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* The horizontal split line — signature of a real flap display */
    .sf-cell-inner::after {
      content: '';
      position: absolute;
      left: 5%;
      right: 5%;
      top: 50%;
      height: 1px;
      background: rgba(0,0,0,0.08);
      pointer-events: none;
    }
    /* Flap drop: sharp snap down with a tiny mechanical bounce */
    @keyframes flapDrop {
      0%   { transform: translateY(-35%); opacity: 0.3; }
      60%  { transform: translateY(2%); opacity: 1; }
      80%  { transform: translateY(-1%); opacity: 1; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .sf-dropping {
      animation: flapDrop 50ms steps(3, end) forwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .sf-dropping { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export default function SplitFlapWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayChars, setDisplayChars] = useState<string[]>([]);
  const [dropping, setDropping] = useState<boolean[]>([]);
  const [settled, setSettled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    ensureStyles();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    setDisplayChars(WORDS[0].split(""));
  }, []);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const flipToWord = useCallback(
    (targetWord: string, prevWord: string) => {
      clearTimeouts();

      const maxLen = Math.max(targetWord.length, prevWord.length);
      const padded = targetWord.padEnd(maxLen, " ");
      const prevPadded = prevWord.padEnd(maxLen, " ");
      const chars = prevPadded.split("");
      const dropState = new Array(maxLen).fill(false);

      setDisplayChars([...chars]);
      setDropping([...dropState]);
      setSettled(false);

      // Each column flips through TICKS_PER_CHAR characters with a slight stagger
      for (let col = 0; col < maxLen; col++) {
        const colDelay = col * CHAR_STAGGER;

        for (let tick = 0; tick < TICKS_PER_CHAR; tick++) {
          const isLast = tick === TICKS_PER_CHAR - 1;
          const t = setTimeout(() => {
            // Trigger the drop animation on each tick
            dropState[col] = true;
            setDropping([...dropState]);

            if (isLast) {
              // Land on the target character
              chars[col] = padded[col];
            } else {
              // Cycle through random flap characters
              const ri = Math.floor(Math.random() * FLAP_ORDER.length);
              chars[col] = FLAP_ORDER[ri];
            }
            setDisplayChars([...chars]);

            // Reset drop state briefly so the next tick re-triggers the animation
            const resetT = setTimeout(() => {
              dropState[col] = false;
              setDropping([...dropState]);
            }, TICK_MS * 0.6);
            timeoutsRef.current.push(resetT);

            // Check if entire board has settled
            if (isLast && col === maxLen - 1) {
              const finalT = setTimeout(() => {
                setDisplayChars(padded.trimEnd().split(""));
                setSettled(true);
              }, TICK_MS);
              timeoutsRef.current.push(finalT);
            }
          }, colDelay + tick * TICK_MS);
          timeoutsRef.current.push(t);
        }
      }
    },
    [clearTimeouts]
  );

  // Sequence controller
  useEffect(() => {
    if (reducedMotion) {
      setDisplayChars(WORDS[WORDS.length - 1].split(""));
      setSettled(true);
      return;
    }
    if (!settled) return;
    const holdTime = HOLD_TIMES[wordIndex];
    if (holdTime === Infinity) return;

    const t = setTimeout(() => {
      const next = wordIndex + 1;
      if (next < WORDS.length) {
        flipToWord(WORDS[next], WORDS[wordIndex]);
        setWordIndex(next);
      }
    }, holdTime);
    return () => clearTimeout(t);
  }, [wordIndex, settled, flipToWord, reducedMotion]);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  return (
    <span
      className="inline-flex items-baseline gap-[0.5px]"
      aria-label={WORDS[WORDS.length - 1]}
      aria-live="polite"
    >
      {displayChars.map((char, i) => (
        <span key={i} className="sf-cell" aria-hidden="true">
          <span className={`sf-cell-inner ${dropping[i] ? "sf-dropping" : ""}`}>
            <span className="text-[#F66B5C] italic font-bold">
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
