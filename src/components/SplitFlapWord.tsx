"use client";

/**
 * SplitFlapWord — a split-flap (Solari board) animation for a single word.
 *
 * Cycles: "yet." -> "expected." -> "today." -> "ever." -> "maybe?"
 * Pauses on "yet.", rapidly flips through middle words, lands on "maybe?"
 */

import { useState, useEffect, useCallback, useRef } from "react";

const WORDS = ["yet.", "expected.", "today.", "ever.", "maybe?"];
const HOLD_TIMES = [2400, 500, 500, 500, Infinity];
const FLIP_CHAR_STAGGER = 40;
const FLIP_DURATION = 220;
const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!?.abcdefghijklmnopqrstuvwxyz";

// Inject keyframes once
const STYLE_ID = "split-flap-keyframes";
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes splitFlapDown {
      0%   { transform: perspective(200px) rotateX(0deg); opacity: 1; }
      35%  { transform: perspective(200px) rotateX(-60deg); opacity: 0.5; }
      65%  { transform: perspective(200px) rotateX(15deg); opacity: 0.9; }
      100% { transform: perspective(200px) rotateX(0deg); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .split-flap-char { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export default function SplitFlapWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayChars, setDisplayChars] = useState<string[]>([]);
  const [flipping, setFlipping] = useState<boolean[]>([]);
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
      const flipState = new Array(maxLen).fill(false);
      const chars = prevPadded.split("");

      setDisplayChars([...chars]);
      setFlipping([...flipState]);
      setSettled(false);

      for (let i = 0; i < maxLen; i++) {
        const delay = i * FLIP_CHAR_STAGGER;

        const t1 = setTimeout(() => {
          flipState[i] = true;
          setFlipping([...flipState]);

          const cycleCount = 3 + Math.floor(Math.random() * 2);
          const interval = FLIP_DURATION / (cycleCount + 1);

          for (let c = 0; c < cycleCount; c++) {
            const t2 = setTimeout(() => {
              chars[i] = FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
              setDisplayChars([...chars]);
            }, interval * (c + 1));
            timeoutsRef.current.push(t2);
          }

          const t3 = setTimeout(() => {
            chars[i] = padded[i];
            flipState[i] = false;
            setDisplayChars([...chars]);
            setFlipping([...flipState]);
            if (i === maxLen - 1) {
              setDisplayChars(padded.trimEnd().split(""));
              setSettled(true);
            }
          }, FLIP_DURATION);
          timeoutsRef.current.push(t3);
        }, delay);
        timeoutsRef.current.push(t1);
      }
    },
    [clearTimeouts]
  );

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
    <span className="inline-flex items-baseline" aria-label={WORDS[WORDS.length - 1]} aria-live="polite">
      {displayChars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="split-flap-char inline-block text-[#F66B5C] italic font-bold"
          style={{
            minWidth: char === " " ? "0.15em" : undefined,
            animation: flipping[i] ? `splitFlapDown ${FLIP_DURATION}ms ease-in-out` : "none",
            transformOrigin: "center bottom",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
