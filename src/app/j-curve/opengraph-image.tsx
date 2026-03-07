import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "The Productivity J-Curve — Why AI's Impact Hasn't Shown Up Yet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  // J-curve path (measured TFP error)
  const curvePoints = [
    [0, 0.5],
    [0.05, 0.49],
    [0.1, 0.46],
    [0.15, 0.4],
    [0.2, 0.33],
    [0.25, 0.27],
    [0.3, 0.23],
    [0.35, 0.21],
    [0.4, 0.2],
    [0.45, 0.21],
    [0.5, 0.25],
    [0.55, 0.32],
    [0.6, 0.42],
    [0.65, 0.53],
    [0.7, 0.62],
    [0.75, 0.69],
    [0.8, 0.74],
    [0.85, 0.78],
    [0.9, 0.8],
    [0.95, 0.81],
    [1, 0.82],
  ];

  const chartX = 80;
  const chartY = 160;
  const chartW = 500;
  const chartH = 340;

  function toSvg(pt: number[]): [number, number] {
    return [chartX + pt[0] * chartW, chartY + (1 - pt[1]) * chartH];
  }

  function smoothPath(pts: number[][]): string {
    const svgPts = pts.map(toSvg);
    let d = `M${svgPts[0][0]},${svgPts[0][1]}`;
    for (let i = 1; i < svgPts.length; i++) {
      const prev = svgPts[i - 1];
      const curr = svgPts[i];
      const cpx = (prev[0] + curr[0]) / 2;
      d += ` C${cpx},${prev[1]} ${cpx},${curr[1]} ${curr[0]},${curr[1]}`;
    }
    return d;
  }

  const jCurvePath = smoothPath(curvePoints);
  const zeroY = chartY + 0.5 * chartH;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a12",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 60%, rgba(92,97,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(239,68,68,0.08) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* SVG J-curve */}
        <svg
          width="620"
          height="630"
          viewBox="0 0 620 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Zero line */}
          <line
            x1={chartX}
            y1={zeroY}
            x2={chartX + chartW}
            y2={zeroY}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          {/* J-curve */}
          <path
            d={jCurvePath}
            fill="none"
            stroke="#5C61F6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Filled area below zero line (understated region) */}
          <path
            d={`${jCurvePath} L${chartX + chartW},${zeroY} L${chartX},${zeroY} Z`}
            fill="rgba(239,68,68,0.06)"
          />
        </svg>

        {/* Right-side content */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 60,
            width: 520,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 28,
                height: 3,
                backgroundColor: "#5C61F6",
                borderRadius: 2,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#5C61F6",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
              }}
            >
              Explainer
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            The Productivity
            <br />
            J-Curve
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.5,
              marginBottom: 32,
            }}
          >
            Why transformative technologies make productivity look worse
            before making it better
          </p>

          {/* Three stat boxes */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {[
              { value: "~40y", label: "Electricity", color: "#f59e0b" },
              { value: "~25y", label: "IT / Computers", color: "#5C61F6" },
              { value: "?", label: "AI", color: "#ef4444" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "12px 20px",
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: `1px solid ${s.color}40`,
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Citation */}
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Brynjolfsson, Rock &amp; Syverson (2021)
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 60,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            jobsdata.ai
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
