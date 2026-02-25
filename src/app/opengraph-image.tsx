import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Early Signals of AI Impact — Tracking AI's impact on jobs and wages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Sparkline SVG path from data points
function sparklinePath(
  values: number[],
  width: number,
  height: number,
  padY = 6
): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = padY + (1 - (v - min) / range) * (height - padY * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// Key predictions data (hardcoded snapshot for OG image performance)
const metrics = [
  {
    label: "Job Displacement",
    value: "9%",
    sub: "of US jobs by 2030",
    color: "#ef4444",
    trend: [7, 5, 6, 5, 8, 6, 9, 12, 8, 7, 9, 10],
    direction: "up" as const,
  },
  {
    label: "Median Wage Impact",
    value: "-2.5%",
    sub: "real wages by 2030",
    color: "#f59e0b",
    trend: [-1, -2, -1.5, -3, -1, -2, -3, -5, -2.5, -2, -3, -2.5],
    direction: "down" as const,
  },
  {
    label: "AI Adoption",
    value: "40%",
    sub: "of companies by 2027",
    color: "#7c3aed",
    trend: [20, 22, 25, 28, 30, 32, 33, 35, 36, 38, 40],
    direction: "up" as const,
  },
  {
    label: "Earnings Call Mentions",
    value: "61%",
    sub: "of S&P 500 companies",
    color: "#3b82f6",
    trend: [20, 25, 28, 30, 34, 38, 40, 42, 48, 55, 61],
    direction: "up" as const,
  },
];

export default function OGImage() {
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
              "linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #ef4444 100%)",
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
              marginBottom: 36,
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
                  backgroundColor: "#7c3aed",
                  display: "flex",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#7c3aed",
                }}
              >
                Live Tracker
              </span>
            </div>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Early Signals of
            </h1>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              AI Impact
            </h1>
          </div>

          {/* Metrics grid */}
          <div
            style={{
              display: "flex",
              gap: 20,
              flex: 1,
            }}
          >
            {metrics.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: "24px 22px 20px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Color accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: m.color,
                    display: "flex",
                  }}
                />

                {/* Label */}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: 8,
                    letterSpacing: "0.01em",
                  }}
                >
                  {m.label}
                </span>

                {/* Value */}
                <span
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: m.color,
                    lineHeight: 1,
                    marginBottom: 4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </span>

                {/* Sub label */}
                <span
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    fontWeight: 500,
                    marginBottom: 16,
                  }}
                >
                  {m.sub}
                </span>

                {/* Sparkline */}
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "flex-end",
                  }}
                >
                  <svg
                    width="220"
                    height="80"
                    viewBox="0 0 220 80"
                    style={{ width: "100%", height: 80 }}
                  >
                    {/* Gradient fill under the line */}
                    <defs>
                      <linearGradient
                        id={`grad${idx}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={m.color}
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor={m.color}
                          stopOpacity="0.02"
                        />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d={`${sparklinePath(m.trend, 220, 80)} L220,80 L0,80 Z`}
                      fill={`url(#grad${idx})`}
                    />
                    {/* Line */}
                    <path
                      d={sparklinePath(m.trend, 220, 80)}
                      fill="none"
                      stroke={m.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* End dot */}
                    <circle
                      cx="220"
                      cy={(() => {
                        const vals = m.trend;
                        const min = Math.min(...vals);
                        const max = Math.max(...vals);
                        const range = max - min || 1;
                        return (
                          6 +
                          (1 - (vals[vals.length - 1] - min) / range) *
                            (80 - 12)
                        );
                      })()}
                      r="4"
                      fill={m.color}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              15 predictions tracked across displacement, wages & adoption
            </span>
            <span
              style={{
                fontSize: 14,
                color: "#7c3aed",
                fontWeight: 700,
              }}
            >
              labor.mattzieger.com
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
