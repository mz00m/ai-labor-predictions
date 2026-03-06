import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "On Tap Intelligence — What History Tells Us About AI and Work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Technology arcs data matching CompressionComparison.tsx
const ARCS = [
  { label: "Steam Power", years: 90, color: "#d97706" },
  { label: "Electrification", years: 50, color: "#2563eb" },
  { label: "Computers", years: 40, color: "#7c3aed" },
  { label: "AI", years: 7, color: "#5C61F6" },
];

export default function OGImage() {
  // Layout constants for the arc area (within a 1088x260 container)
  // SVG viewBox: 0 100 820 260 → maps to the container
  const W = 820;
  const BL = 340; // baseline Y in SVG coords
  const OX = 60;
  const EX = 785;
  const TW = EX - OX;
  const MAX_H = 280;

  // Container dimensions (pixels in the OG image)
  const containerW = 1088;
  const containerH = 260;

  // SVG viewBox
  const vbX = 0;
  const vbY = 100;
  const vbW = 820;
  const vbH = 260;

  // Convert SVG coords to container pixel coords
  const toPixelX = (svgX: number) =>
    ((svgX - vbX) / vbW) * containerW;
  const toPixelY = (svgY: number) =>
    ((svgY - vbY) / vbH) * containerH;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafafa",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(59,130,246,0.04) 50%, rgba(239,68,68,0.03) 100%)",
            display: "flex",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, #d97706 0%, #2563eb 33%, #7c3aed 66%, #5C61F6 100%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "48px 56px 40px",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              {/* Pulse dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#5C61F6",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#5C61F6",
                }}
              >
                Historical Context
              </span>
            </div>
            <h1
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              On Tap Intelligence
            </h1>
            <p
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#6b7280",
                margin: "8px 0 0 0",
                lineHeight: 1.4,
              }}
            >
              AI is diffusing 5-12x faster than any prior technology revolution
            </p>
          </div>

          {/* Arc Visualization — SVG paths only + HTML labels */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: containerW,
              height: containerH,
              flex: 1,
            }}
          >
            {/* SVG: arcs, baseline, origin dot only (no text) */}
            <svg
              width={containerW}
              height={containerH}
              viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: containerW,
                height: containerH,
              }}
            >
              {/* Baseline */}
              <line
                x1={OX}
                y1={BL}
                x2={EX}
                y2={BL}
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              {/* Arcs */}
              {ARCS.map((arc) => {
                const maxYears = 90;
                const frac = arc.years / maxYears;
                const endX = OX + frac * TW;
                const peakY = BL - frac * MAX_H;
                const midX = (OX + endX) / 2;

                return (
                  <path
                    key={arc.label}
                    d={`M ${OX} ${BL} Q ${midX} ${peakY} ${endX} ${BL}`}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={arc.label === "AI" ? "3.5" : "2.5"}
                    strokeLinecap="round"
                    opacity={arc.label === "AI" ? 1 : 0.7}
                  />
                );
              })}

              {/* Origin dot */}
              <circle cx={OX} cy={BL} r="4" fill="#5C61F6" />
            </svg>

            {/* HTML labels positioned over arcs */}
            {ARCS.map((arc) => {
              const maxYears = 90;
              const frac = arc.years / maxYears;
              const endX = OX + frac * TW;
              const peakY = BL - frac * MAX_H;
              const midX = (OX + endX) / 2;
              const visualPeakY = (BL + peakY) / 2;

              // Convert to pixel coords
              const px = toPixelX(midX);
              const py = toPixelY(visualPeakY);

              return (
                <div
                  key={arc.label}
                  style={{
                    position: "absolute",
                    left: px,
                    top: py - 24,
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: arc.color,
                    }}
                  >
                    {arc.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#9ca3af",
                    }}
                  >
                    {arc.years} yrs
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom row: key stats + branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { label: "Compression", value: "5-12x", color: "#5C61F6" },
                { label: "AI Workers", value: "~70%", color: "#3b82f6" },
                { label: "Wage Premium", value: "+47%", color: "#059669" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: stat.color,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#9ca3af",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <span
              style={{
                fontSize: 14,
                color: "#5C61F6",
                fontWeight: 700,
              }}
            >
              jobsdata.ai
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
