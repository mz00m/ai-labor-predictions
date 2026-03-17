"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ChatbotBuddy — A friendly robot that peeks from the right edge of the viewport.
 * - Idle: bobs gently, blinks, occasionally shows a speech bubble
 * - Hover: eyes widen, antenna glows, leans in
 * - Click: opens the chatbot panel
 * - Respects prefers-reduced-motion
 */

const PEEK_PROMPTS = [
  "Got a data question?",
  "Curious about AI jobs?",
  "Ask me anything",
  "300+ sources ready",
  "What sector interests you?",
];

function RobotSVG({
  eyeState,
  isHovered,
  antennaGlow,
}: {
  eyeState: "open" | "blink" | "wide";
  isHovered: boolean;
  antennaGlow: boolean;
}) {
  const eyeHeight = eyeState === "blink" ? 1 : eyeState === "wide" ? 7 : 5;
  const eyeY = eyeState === "blink" ? 22 : eyeState === "wide" ? 19 : 20;
  const mouthWidth = isHovered ? 12 : 8;

  return (
    <svg
      width="52"
      height="58"
      viewBox="0 0 52 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="robot-svg"
    >
      {/* Antenna */}
      <line
        x1="26"
        y1="2"
        x2="26"
        y2="12"
        stroke="#5C61F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="26"
        cy="2"
        r="3"
        fill={antennaGlow ? "#F66B5C" : "#5C61F6"}
        className="antenna-tip"
      >
        {antennaGlow && (
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      {antennaGlow && (
        <circle cx="26" cy="2" r="6" fill="#F66B5C" opacity="0.2">
          <animate
            attributeName="r"
            values="4;7;4"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.2;0.05;0.2"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Head */}
      <rect
        x="4"
        y="10"
        width="44"
        height="34"
        rx="8"
        fill="#1A1A2E"
        stroke="#5C61F6"
        strokeWidth="1.5"
      />

      {/* Screen/face area */}
      <rect x="8" y="14" width="36" height="26" rx="5" fill="#0D1117" />

      {/* Eyes */}
      <rect
        x="14"
        y={eyeY}
        width="6"
        height={eyeHeight}
        rx={eyeState === "blink" ? 0.5 : 2}
        fill="#00FF88"
        className="eye-left"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x="32"
        y={eyeY}
        width="6"
        height={eyeHeight}
        rx={eyeState === "blink" ? 0.5 : 2}
        fill="#00FF88"
        className="eye-right"
      >
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Mouth — horizontal line that widens on hover */}
      <rect
        x={26 - mouthWidth / 2}
        y="32"
        width={mouthWidth}
        height="2"
        rx="1"
        fill="#00FF88"
        opacity="0.6"
      />

      {/* Ear bolts */}
      <circle cx="4" cy="27" r="2.5" fill="#5C61F6" opacity="0.7" />
      <circle cx="48" cy="27" r="2.5" fill="#5C61F6" opacity="0.7" />

      {/* Neck */}
      <rect x="22" y="44" width="8" height="4" rx="1" fill="#1A1A2E" />

      {/* Body hint */}
      <rect
        x="14"
        y="48"
        width="24"
        height="10"
        rx="4"
        fill="#1A1A2E"
        stroke="#5C61F6"
        strokeWidth="1"
        opacity="0.8"
      />
      {/* Body light */}
      <circle cx="26" cy="53" r="2" fill="#5C61F6" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default function ChatbotBuddy() {
  const [isHovered, setIsHovered] = useState(false);
  const [eyeState, setEyeState] = useState<"open" | "blink" | "wide">("open");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(PEEK_PROMPTS[0]);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const promptIndexRef = useRef(0);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Entrance delay — slide in after a moment
  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Listen for chatbot open/close to hide buddy when chat is open
  useEffect(() => {
    function handleOpen() {
      setChatOpen(true);
    }
    function handleClose() {
      setChatOpen(false);
    }
    window.addEventListener("open-chatbot", handleOpen);
    window.addEventListener("close-chatbot", handleClose);
    return () => {
      window.removeEventListener("open-chatbot", handleOpen);
      window.removeEventListener("close-chatbot", handleClose);
    };
  }, []);

  // Blink cycle
  useEffect(() => {
    if (reducedMotion) return;

    function scheduleBlink() {
      const delay = 2500 + Math.random() * 4000;
      blinkTimerRef.current = setTimeout(() => {
        setEyeState("blink");
        setTimeout(() => {
          setEyeState("open");
          scheduleBlink();
        }, 120);
      }, delay);
    }
    scheduleBlink();
    return () => clearTimeout(blinkTimerRef.current);
  }, [reducedMotion]);

  // Occasional speech bubble
  useEffect(() => {
    if (reducedMotion) return;

    function scheduleBubble() {
      const delay = 8000 + Math.random() * 12000;
      bubbleTimerRef.current = setTimeout(() => {
        promptIndexRef.current =
          (promptIndexRef.current + 1) % PEEK_PROMPTS.length;
        setBubbleText(PEEK_PROMPTS[promptIndexRef.current]);
        setShowBubble(true);
        setTimeout(() => {
          setShowBubble(false);
          scheduleBubble();
        }, 3500);
      }, delay);
    }
    // Show first bubble after 5s
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(true);
      setTimeout(() => {
        setShowBubble(false);
        scheduleBubble();
      }, 3500);
    }, 5000);
    return () => clearTimeout(bubbleTimerRef.current);
  }, [reducedMotion]);

  // Hover: widen eyes
  useEffect(() => {
    if (isHovered) {
      setEyeState("wide");
      setShowBubble(true);
      setBubbleText("Click to chat!");
    } else {
      setEyeState("open");
    }
  }, [isHovered]);

  const handleClick = useCallback(() => {
    window.dispatchEvent(new Event("open-chatbot"));
    setShowBubble(false);
  }, []);

  // Don't render when chat is open
  if (chatOpen) return null;

  return (
    <div
      className={`fixed z-[55] transition-transform ${
        reducedMotion ? "duration-0" : "duration-500 ease-out"
      } ${hasEntered ? "translate-x-0" : "translate-x-full"}`}
      style={{
        right: 0,
        bottom: "clamp(80px, 15vh, 200px)",
      }}
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <div
        className={`absolute right-[68px] bottom-[20px] whitespace-nowrap bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1A1A2E] shadow-lg transition-all ${
          reducedMotion ? "duration-0" : "duration-300"
        } ${
          showBubble
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        {bubbleText}
        {/* Bubble arrow */}
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-white" />
        <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-black/[0.08]" />
      </div>

      {/* Robot container — peeking from right */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-center w-[64px] h-[72px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C61F6] focus-visible:ring-offset-2 rounded-l-xl transition-transform ${
          reducedMotion ? "duration-0" : "duration-300 ease-out"
        } ${isHovered ? "-translate-x-2" : "translate-x-[12px]"}`}
        style={{
          animation:
            !reducedMotion && !isHovered
              ? "buddyBob 4s ease-in-out infinite"
              : undefined,
        }}
        aria-label="Open AI assistant chat"
      >
        {/* Glow behind robot on hover */}
        <div
          className={`absolute inset-0 rounded-l-xl bg-[#5C61F6]/10 transition-opacity ${
            reducedMotion ? "duration-0" : "duration-300"
          } ${isHovered ? "opacity-100" : "opacity-0"}`}
        />
        <RobotSVG
          eyeState={eyeState}
          isHovered={isHovered}
          antennaGlow={showBubble || isHovered}
        />
      </button>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes buddyBob {
          0%,
          100% {
            transform: translateY(0px) translateX(12px);
          }
          50% {
            transform: translateY(-4px) translateX(12px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          button {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/** Compact inline trigger for the navbar — keeps existing "Ask" button functionality */
export function ChatTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[var(--accent)] hover:bg-[#4b50e5] px-3 py-1.5 rounded-md transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 52 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="10"
          width="44"
          height="34"
          rx="8"
          fill="currentColor"
          opacity="0.3"
        />
        <rect x="14" y="20" width="6" height="5" rx="2" fill="currentColor" />
        <rect x="32" y="20" width="6" height="5" rx="2" fill="currentColor" />
        <rect x="22" y="32" width="8" height="2" rx="1" fill="currentColor" opacity="0.6" />
      </svg>
      Ask
    </button>
  );
}
