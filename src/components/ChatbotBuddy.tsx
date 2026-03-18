"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * ChatbotBuddy — A silver retro robot that peeks into the page from different edges.
 *
 * Three entrance modes:
 *  1. "side"   — 45° diagonal from top-right corner, near the Ask button, gripping the edge
 *  2. "top"    — drops down vertically from the top of the viewport, peeking upside-down
 *  3. "bottom" — pops up from the bottom edge on deeper pages (/about, /j-curve, /history, etc.)
 *
 * The robot is silver/metallic with glowing blue eyes — classic retro robot look.
 * Cycles through entrance modes on each page navigation.
 * Respects prefers-reduced-motion.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  body: "#C0C0C0",       // silver
  bodyDark: "#A0A0A8",   // shadow silver
  bodyLight: "#D8D8DC",  // highlight silver
  chrome: "#E8E8EC",     // bright chrome
  rivet: "#888890",      // bolt/rivet grey
  screen: "#1A1A2E",     // face screen
  eye: "#5C61F6",        // matches site accent — glowing blue
  eyeGlow: "#7B80FF",    // eye highlight
  mouth: "#5C61F6",
  antenna: "#A0A0A8",
  antennaTip: "#F66B5C", // coral signal light
};

const PEEK_PROMPTS = [
  "Got a data question?",
  "Curious about AI jobs?",
  "Ask me anything",
  "300+ sources ready",
  "What sector interests you?",
];

// Pages where the bottom entrance is used
const BOTTOM_PAGES = ["/about", "/j-curve", "/history", "/demand-elasticity", "/signals"];

type EntranceMode = "side" | "top" | "bottom";

// ── Silver Robot SVG ─────────────────────────────────────────────────────────
function RobotSVG({
  eyeState,
  isHovered,
  antennaGlow,
}: {
  eyeState: "open" | "blink" | "wide";
  isHovered: boolean;
  antennaGlow: boolean;
}) {
  const eyeH = eyeState === "blink" ? 1 : eyeState === "wide" ? 8 : 5;
  const eyeY = eyeState === "blink" ? 24 : eyeState === "wide" ? 20.5 : 22;
  const eyeRx = eyeState === "blink" ? 0.5 : 2.5;
  const mouthW = isHovered ? 14 : 8;

  return (
    <svg
      width="48"
      height="56"
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Antenna stalk */}
      <rect x="22" y="3" width="4" height="9" rx="2" fill={C.antenna} />
      {/* Antenna tip — glows coral when active */}
      <circle cx="24" cy="3" r="3.5" fill={antennaGlow ? C.antennaTip : C.rivet}>
        {antennaGlow && (
          <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      {antennaGlow && (
        <circle cx="24" cy="3" r="6" fill={C.antennaTip} opacity="0.15">
          <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.03;0.15" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Head — main silver shell */}
      <rect x="3" y="10" width="42" height="30" rx="7" fill={C.body} />
      {/* Chrome highlight strip across top of head */}
      <rect x="5" y="10" width="38" height="6" rx="3" fill={C.chrome} opacity="0.6" />
      {/* Shadow under head */}
      <rect x="5" y="34" width="38" height="4" rx="2" fill={C.bodyDark} opacity="0.4" />

      {/* Face screen (inset dark visor) */}
      <rect x="7" y="15" width="34" height="22" rx="5" fill={C.screen} />
      {/* Screen gloss */}
      <rect x="9" y="16" width="16" height="3" rx="1.5" fill="white" opacity="0.06" />

      {/* Eyes */}
      <rect x="13" y={eyeY} width="7" height={eyeH} rx={eyeRx} fill={C.eye}>
        <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y={eyeY} width="7" height={eyeH} rx={eyeRx} fill={C.eye}>
        <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Eye glow (subtle bloom) */}
      {(eyeState === "wide" || isHovered) && (
        <>
          <rect x="11" y={eyeY - 1} width="11" height={eyeH + 2} rx="3" fill={C.eyeGlow} opacity="0.15" />
          <rect x="26" y={eyeY - 1} width="11" height={eyeH + 2} rx="3" fill={C.eyeGlow} opacity="0.15" />
        </>
      )}

      {/* Mouth — little speaker grille */}
      <rect x={24 - mouthW / 2} y="32" width={mouthW} height="2" rx="1" fill={C.mouth} opacity="0.5" />

      {/* Ear bolts — riveted to the side */}
      <circle cx="3" cy="25" r="3" fill={C.bodyDark} />
      <circle cx="3" cy="25" r="1.5" fill={C.chrome} />
      <circle cx="45" cy="25" r="3" fill={C.bodyDark} />
      <circle cx="45" cy="25" r="1.5" fill={C.chrome} />

      {/* Neck */}
      <rect x="19" y="40" width="10" height="5" rx="2" fill={C.bodyDark} />
      {/* Neck rivets */}
      <circle cx="22" cy="42.5" r="1" fill={C.rivet} />
      <circle cx="26" cy="42.5" r="1" fill={C.rivet} />

      {/* Body / torso hint */}
      <rect x="10" y="44" width="28" height="12" rx="5" fill={C.body} />
      {/* Chest plate highlight */}
      <rect x="12" y="45" width="24" height="4" rx="2" fill={C.chrome} opacity="0.4" />
      {/* Chest indicator light */}
      <circle cx="24" cy="52" r="2.5" fill={C.eye} opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.15;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Body rivets */}
      <circle cx="14" cy="52" r="1" fill={C.rivet} />
      <circle cx="34" cy="52" r="1" fill={C.rivet} />

      {/* Purple accent stripe along head bottom edge — ties to Ask button */}
      <rect x="9" y="37" width="30" height="1.5" rx="0.75" fill={C.eye} opacity="0.35" />
      {/* Purple accent line on torso */}
      <rect x="16" y="50" width="16" height="1" rx="0.5" fill={C.eye} opacity="0.25" />
    </svg>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ChatbotBuddy() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [eyeState, setEyeState] = useState<"open" | "blink" | "wide">("open");
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(PEEK_PROMPTS[0]);
  const [chatOpen, setChatOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [entrance, setEntrance] = useState<EntranceMode>("side");
  const blinkRef = useRef<ReturnType<typeof setTimeout>>();
  const bubbleRef = useRef<ReturnType<typeof setTimeout>>();
  const promptIdx = useRef(0);
  const navCountRef = useRef(0);

  // ── Reduced motion ──
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── Pick entrance mode on page nav ──
  useEffect(() => {
    navCountRef.current += 1;
    setEntered(false);
    setShowBubble(false);

    // First visit → always "side" (near the Ask button)
    if (navCountRef.current === 1) {
      setEntrance("side");
    } else if (BOTTOM_PAGES.some((p) => pathname.startsWith(p))) {
      setEntrance("bottom");
    } else {
      // Cycle: side → top → side → top ...
      setEntrance(navCountRef.current % 3 === 0 ? "top" : "side");
    }

    // Delay entrance so it feels like the robot is arriving
    const delay = navCountRef.current === 1 ? 1400 : 800;
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [pathname]);

  // ── Chat open/close ──
  useEffect(() => {
    const onOpen = () => setChatOpen(true);
    const onClose = () => setChatOpen(false);
    window.addEventListener("open-chatbot", onOpen);
    window.addEventListener("close-chatbot", onClose);
    return () => {
      window.removeEventListener("open-chatbot", onOpen);
      window.removeEventListener("close-chatbot", onClose);
    };
  }, []);

  // ── Blink cycle ──
  useEffect(() => {
    if (reducedMotion) return;
    function schedule() {
      blinkRef.current = setTimeout(() => {
        setEyeState("blink");
        setTimeout(() => { setEyeState("open"); schedule(); }, 110);
      }, 2500 + Math.random() * 3500);
    }
    schedule();
    return () => clearTimeout(blinkRef.current);
  }, [reducedMotion]);

  // ── Speech bubbles ──
  useEffect(() => {
    if (reducedMotion || !entered) return;
    function schedule() {
      bubbleRef.current = setTimeout(() => {
        promptIdx.current = (promptIdx.current + 1) % PEEK_PROMPTS.length;
        setBubbleText(PEEK_PROMPTS[promptIdx.current]);
        setShowBubble(true);
        setTimeout(() => { setShowBubble(false); schedule(); }, 3200);
      }, 7000 + Math.random() * 10000);
    }
    // First bubble after a short delay
    bubbleRef.current = setTimeout(() => {
      setShowBubble(true);
      setTimeout(() => { setShowBubble(false); schedule(); }, 3200);
    }, 3500);
    return () => clearTimeout(bubbleRef.current);
  }, [reducedMotion, entered, entrance]);

  // ── Hover ──
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

  if (chatOpen) return null;

  // ── Position & transform for each entrance mode ──
  const positionStyles = getPositionStyles(entrance, entered, isHovered, reducedMotion);
  const bubblePos = getBubblePosition(entrance);

  return (
    <div
      className="fixed z-[55] hidden md:block"
      style={positionStyles.wrapper}
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <div
        className={`absolute whitespace-nowrap bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1A1A2E] shadow-lg transition-all ${
          reducedMotion ? "duration-0" : "duration-300"
        } ${
          showBubble
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={bubblePos.style}
      >
        {bubbleText}
        {/* Arrow */}
        <div style={bubblePos.arrowStyle} />
      </div>

      {/* Robot button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-center cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C61F6] focus-visible:ring-offset-2
          rounded-xl`}
        style={positionStyles.robot}
        aria-label="Ask Gob — open AI assistant chat"
      >
        {/* Hover glow */}
        <div
          className={`absolute inset-[-4px] rounded-xl transition-opacity ${
            reducedMotion ? "duration-0" : "duration-300"
          } ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background: "radial-gradient(circle, rgba(92,97,246,0.12) 0%, transparent 70%)",
          }}
        />
        {/* The little hand/gripper that clings to the edge */}
        {entrance === "side" && (
          <div
            className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[6px] h-[16px] rounded-l-sm"
            style={{ background: C.bodyDark }}
          />
        )}
        {entrance === "top" && (
          <div
            className="absolute -top-[3px] left-1/2 -translate-x-1/2 h-[6px] w-[16px] rounded-b-sm"
            style={{ background: C.bodyDark }}
          />
        )}
        {entrance === "bottom" && (
          <div
            className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-[6px] w-[16px] rounded-t-sm"
            style={{ background: C.bodyDark }}
          />
        )}
        <div style={positionStyles.svgRotate}>
          <RobotSVG
            eyeState={eyeState}
            isHovered={isHovered}
            antennaGlow={showBubble || isHovered}
          />
        </div>
      </button>

      {/* Keyframes injected once */}
      <style jsx>{`
        @keyframes buddySideBob {
          0%, 100% { transform: translate(0, 0) rotate(-8deg); }
          50% { transform: translate(-2px, -3px) rotate(-6deg); }
        }
        @keyframes buddyTopBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        @keyframes buddyBottomBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          button { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Position helpers ─────────────────────────────────────────────────────────

function getPositionStyles(
  mode: EntranceMode,
  entered: boolean,
  hovered: boolean,
  reduced: boolean,
) {
  const dur = reduced ? "0ms" : "600ms";
  const ease = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // springy overshoot

  if (mode === "side") {
    // 45° diagonal from top-right, near the Ask button
    return {
      wrapper: {
        top: "48px", // just below the 48px navbar
        right: "0px",
        transition: `transform ${dur} ${ease}`,
        transform: entered
          ? hovered
            ? "translate(-6px, 4px) rotate(0deg)"
            : "translate(10px, 0px)"
          : "translate(80px, -80px) rotate(45deg)",
      } as React.CSSProperties,
      robot: {
        width: "56px",
        height: "64px",
        animation: !reduced && entered && !hovered
          ? "buddySideBob 4s ease-in-out infinite"
          : undefined,
      } as React.CSSProperties,
      svgRotate: {
        transform: entered ? "rotate(0deg)" : "rotate(-45deg)",
        transition: `transform ${dur} ${ease}`,
      } as React.CSSProperties,
    };
  }

  if (mode === "top") {
    // Drops down from top center-right
    return {
      wrapper: {
        top: "0px",
        right: "60px",
        transition: `transform ${dur} ${ease}`,
        transform: entered
          ? hovered
            ? "translateY(6px)"
            : "translateY(-8px)"
          : "translateY(-80px)",
      } as React.CSSProperties,
      robot: {
        width: "56px",
        height: "64px",
        animation: !reduced && entered && !hovered
          ? "buddyTopBob 3.5s ease-in-out infinite"
          : undefined,
      } as React.CSSProperties,
      svgRotate: {
        transform: "rotate(180deg)",
        transition: `transform ${dur} ${ease}`,
      } as React.CSSProperties,
    };
  }

  // bottom
  return {
    wrapper: {
      bottom: "0px",
      right: "32px",
      transition: `transform ${dur} ${ease}`,
      transform: entered
        ? hovered
          ? "translateY(-6px)"
          : "translateY(12px)"
        : "translateY(80px)",
    } as React.CSSProperties,
    robot: {
      width: "56px",
      height: "64px",
      animation: !reduced && entered && !hovered
        ? "buddyBottomBob 3.5s ease-in-out infinite"
        : undefined,
    } as React.CSSProperties,
    svgRotate: {
      transform: "rotate(0deg)",
      transition: `transform ${dur} ${ease}`,
    } as React.CSSProperties,
  };
}

function getBubblePosition(mode: EntranceMode) {
  if (mode === "side") {
    return {
      style: {
        right: "64px",
        top: "50%",
        transform: "translateY(-50%)",
      } as React.CSSProperties,
      arrowStyle: {
        position: "absolute" as const,
        right: "-6px",
        top: "50%",
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "6px solid white",
      } as React.CSSProperties,
    };
  }
  if (mode === "top") {
    return {
      style: {
        left: "50%",
        top: "72px",
        transform: "translateX(-50%)",
      } as React.CSSProperties,
      arrowStyle: {
        position: "absolute" as const,
        top: "-6px",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderBottom: "6px solid white",
      } as React.CSSProperties,
    };
  }
  // bottom
  return {
    style: {
      left: "50%",
      bottom: "72px",
      transform: "translateX(-50%)",
    } as React.CSSProperties,
    arrowStyle: {
      position: "absolute" as const,
      bottom: "-6px",
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: 0,
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderTop: "6px solid white",
    } as React.CSSProperties,
  };
}

// ── Navbar trigger (kept in sync with robot style) ───────────────────────────
export function ChatTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[var(--accent)] hover:bg-[#4b50e5] px-3 py-1.5 rounded-md transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Simplified robot head silhouette */}
        <rect x="3" y="8" width="42" height="30" rx="7" fill="white" opacity="0.3" />
        <rect x="13" y="20" width="7" height="5" rx="2.5" fill="white" />
        <rect x="28" y="20" width="7" height="5" rx="2.5" fill="white" />
        <rect x="20" y="30" width="8" height="2" rx="1" fill="white" opacity="0.5" />
        {/* Antenna */}
        <rect x="22" y="2" width="4" height="7" rx="2" fill="white" opacity="0.4" />
        <circle cx="24" cy="2" r="2" fill="white" opacity="0.6" />
      </svg>
      Ask Gob
    </button>
  );
}
