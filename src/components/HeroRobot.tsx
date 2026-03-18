"use client";

/**
 * HeroRobot — The silver robot walks along the h1 baseline on the homepage,
 * arrives near "AI", then plants a cane and leans on it (Sinatra style).
 *
 * 30% larger than the ChatbotBuddy version, with legs, arms, and a cane.
 * Hidden on mobile (md:block). Clicks open the chatbot.
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ── Palette (matches ChatbotBuddy) ──────────────────────────────────────────
const C = {
  body: "#C0C0C0",
  bodyDark: "#A0A0A8",
  chrome: "#E8E8EC",
  rivet: "#888890",
  screen: "#1A1A2E",
  eye: "#5C61F6",
  eyeGlow: "#7B80FF",
  mouth: "#5C61F6",
  antenna: "#A0A0A8",
  antennaTip: "#F66B5C",
  cane: "#8B7355",
  caneHandle: "#6B5335",
  shoe: "#2E2E34",
};

const WALK_MS = 2800;
const STEP_MS = 350;
const KF_ID = "hero-robot-kf";

function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KF_ID)) return;
  const el = document.createElement("style");
  el.id = KF_ID;
  el.textContent = `
@keyframes hrWalk{0%{transform:translateX(-250px)}100%{transform:translateX(0)}}
@keyframes hrLegL{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
@keyframes hrLegR{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}}
@keyframes hrArmL{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-10deg)}}
@keyframes hrArmR{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
@keyframes hrBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@media(prefers-reduced-motion:reduce){.hr-walk *{animation:none!important}}`;
  document.head.appendChild(el);
}

type Phase = "hidden" | "walking" | "settling" | "leaning";

export default function HeroRobot() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [eyeState, setEyeState] = useState<"open" | "blink">("open");
  const [reduced, setReduced] = useState(false);
  const blinkT = useRef<ReturnType<typeof setTimeout>>();

  useEffect(injectKeyframes, []);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Kick off walk after mount
  useEffect(() => {
    if (reduced) {
      setPhase("leaning");
      return;
    }
    const t = setTimeout(() => setPhase("walking"), 1000);
    return () => clearTimeout(t);
  }, [reduced]);

  // Walk → settling → lean sequence
  const onWalkEnd = useCallback((e: React.AnimationEvent) => {
    if (e.animationName !== "hrWalk") return;
    setPhase("settling");
    setTimeout(() => setPhase("leaning"), 400);
  }, []);

  // Blink cycle
  useEffect(() => {
    if (reduced) return;
    const sched = () => {
      blinkT.current = setTimeout(() => {
        setEyeState("blink");
        setTimeout(() => {
          setEyeState("open");
          sched();
        }, 110);
      }, 2500 + Math.random() * 3500);
    };
    sched();
    return () => clearTimeout(blinkT.current);
  }, [reduced]);

  const onClick = useCallback(() => {
    window.dispatchEvent(new Event("open-chatbot"));
  }, []);

  if (phase === "hidden") return null;

  const w = phase === "walking";
  const l = phase === "leaning";
  const eyeH = eyeState === "blink" ? 1 : 5;
  const eyeY = eyeState === "blink" ? 24 : 22;
  const eyeRx = eyeState === "blink" ? 0.5 : 2.5;
  const spring = "cubic-bezier(0.34,1.56,0.64,1)";

  return (
    <div
      className="absolute bottom-0 left-0 right-0 hidden md:block"
      style={{ height: 0, zIndex: 10, pointerEvents: "none" }}
    >
      <div
        className={w ? "hr-walk" : ""}
        onAnimationEnd={onWalkEnd}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        role="button"
        tabIndex={0}
        aria-label="Ask Gob — open AI assistant chat"
        style={{
          position: "absolute",
          bottom: 0,
          left: "18%",
          cursor: "pointer",
          pointerEvents: "auto",
          outline: "none",
          animation: w
            ? `hrWalk ${WALK_MS}ms ease-out forwards`
            : undefined,
        }}
      >
        <svg
          width={73}
          height={101}
          viewBox="0 0 56 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            overflow: "visible",
            display: "block",
            animation: w
              ? `hrBob ${STEP_MS}ms ease-in-out infinite`
              : undefined,
          }}
        >
          {/* ── Upper body — tilts on lean ── */}
          <g
            style={{
              transformOrigin: "24px 56px",
              transform: l ? "rotate(6deg)" : "rotate(0deg)",
              transition: `transform 0.6s ${spring}`,
            }}
          >
            {/* Antenna */}
            <rect x="22" y="3" width="4" height="9" rx="2" fill={C.antenna} />
            <circle
              cx="24"
              cy="3"
              r="3.5"
              fill={l ? C.antennaTip : C.rivet}
            >
              {l && (
                <animate
                  attributeName="opacity"
                  values="1;0.4;1"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Head */}
            <rect
              x="3"
              y="10"
              width="42"
              height="30"
              rx="7"
              fill={C.body}
            />
            <rect
              x="5"
              y="10"
              width="38"
              height="6"
              rx="3"
              fill={C.chrome}
              opacity="0.6"
            />
            <rect
              x="5"
              y="34"
              width="38"
              height="4"
              rx="2"
              fill={C.bodyDark}
              opacity="0.4"
            />

            {/* Face screen */}
            <rect
              x="7"
              y="15"
              width="34"
              height="22"
              rx="5"
              fill={C.screen}
            />
            <rect
              x="9"
              y="16"
              width="16"
              height="3"
              rx="1.5"
              fill="white"
              opacity="0.06"
            />

            {/* Eyes */}
            <rect
              x="13"
              y={eyeY}
              width="7"
              height={eyeH}
              rx={eyeRx}
              fill={C.eye}
            >
              <animate
                attributeName="opacity"
                values="1;0.6;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x="28"
              y={eyeY}
              width="7"
              height={eyeH}
              rx={eyeRx}
              fill={C.eye}
            >
              <animate
                attributeName="opacity"
                values="1;0.6;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Mouth — wider smirk when leaning */}
            <rect
              x={l ? 17 : 20}
              y="32"
              width={l ? 14 : 8}
              height="2"
              rx="1"
              fill={C.mouth}
              opacity="0.5"
            />

            {/* Ear bolts */}
            <circle cx="3" cy="25" r="3" fill={C.bodyDark} />
            <circle cx="3" cy="25" r="1.5" fill={C.chrome} />
            <circle cx="45" cy="25" r="3" fill={C.bodyDark} />
            <circle cx="45" cy="25" r="1.5" fill={C.chrome} />

            {/* Purple accent under head */}
            <rect
              x="9"
              y="37"
              width="30"
              height="1.5"
              rx="0.75"
              fill={C.eye}
              opacity="0.35"
            />

            {/* Neck */}
            <rect
              x="19"
              y="40"
              width="10"
              height="5"
              rx="2"
              fill={C.bodyDark}
            />
            <circle cx="22" cy="42.5" r="1" fill={C.rivet} />
            <circle cx="26" cy="42.5" r="1" fill={C.rivet} />

            {/* Torso */}
            <rect
              x="10"
              y="44"
              width="28"
              height="12"
              rx="5"
              fill={C.body}
            />
            <rect
              x="12"
              y="45"
              width="24"
              height="4"
              rx="2"
              fill={C.chrome}
              opacity="0.4"
            />
            <circle cx="24" cy="52" r="2.5" fill={C.eye} opacity="0.5">
              <animate
                attributeName="opacity"
                values="0.5;0.15;0.5"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="14" cy="52" r="1" fill={C.rivet} />
            <circle cx="34" cy="52" r="1" fill={C.rivet} />
            <rect
              x="16"
              y="50"
              width="16"
              height="1"
              rx="0.5"
              fill={C.eye}
              opacity="0.25"
            />

            {/* Left arm */}
            <g
              style={{
                transformOrigin: "6px 46px",
                animation: w
                  ? `hrArmL ${STEP_MS}ms ease-in-out infinite`
                  : undefined,
                transition: "transform 0.3s ease",
              }}
            >
              <rect
                x="3"
                y="46"
                width="5"
                height="12"
                rx="2.5"
                fill={C.body}
              />
              <circle cx="5.5" cy="58" r="2.5" fill={C.bodyDark} />
            </g>

            {/* Right arm — reaches toward cane on lean */}
            <g
              style={{
                transformOrigin: "42px 46px",
                animation: w
                  ? `hrArmR ${STEP_MS}ms ease-in-out infinite`
                  : undefined,
                transform: l ? "rotate(18deg)" : "rotate(0deg)",
                transition: `transform 0.5s ${spring}`,
              }}
            >
              <rect
                x="40"
                y="46"
                width="5"
                height="12"
                rx="2.5"
                fill={C.body}
              />
              <circle cx="42.5" cy="58" r="2.5" fill={C.bodyDark} />
            </g>
          </g>

          {/* ── Legs — stay grounded ── */}

          {/* Left leg — crosses in front on lean */}
          <g
            style={{
              transformOrigin: "18px 56px",
              animation: w
                ? `hrLegL ${STEP_MS}ms ease-in-out infinite`
                : undefined,
              transform: l
                ? "rotate(4deg) translateX(5px)"
                : "rotate(0deg)",
              transition: "transform 0.4s ease",
            }}
          >
            <rect
              x="15"
              y="56"
              width="6"
              height="13"
              rx="2"
              fill={C.body}
            />
            <circle cx="18" cy="63" r="1.5" fill={C.rivet} />
            <rect
              x="13"
              y="68"
              width="9"
              height="4"
              rx="2"
              fill={C.shoe}
            />
          </g>

          {/* Right leg — weight-bearing on lean */}
          <g
            style={{
              transformOrigin: "30px 56px",
              animation: w
                ? `hrLegR ${STEP_MS}ms ease-in-out infinite`
                : undefined,
              transform: l ? "rotate(-1deg)" : "rotate(0deg)",
              transition: "transform 0.4s ease",
            }}
          >
            <rect
              x="27"
              y="56"
              width="6"
              height="13"
              rx="2"
              fill={C.body}
            />
            <circle cx="30" cy="63" r="1.5" fill={C.rivet} />
            <rect
              x="26"
              y="68"
              width="9"
              height="4"
              rx="2"
              fill={C.shoe}
            />
          </g>

          {/* ── Cane — swings into place on lean ── */}
          <g
            style={{
              opacity: l ? 1 : 0,
              transform: l ? "rotate(0deg)" : "rotate(-40deg)",
              transformOrigin: "46px 48px",
              transition: `all 0.5s ${spring}`,
            }}
          >
            {/* Shaft */}
            <line
              x1="46"
              y1="48"
              x2="50"
              y2="73"
              stroke={C.cane}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Curved handle */}
            <path
              d="M46,48 Q46,44 42,44"
              stroke={C.caneHandle}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tip */}
            <circle cx="50" cy="73" r="1.2" fill={C.caneHandle} />
          </g>
        </svg>
      </div>
    </div>
  );
}
