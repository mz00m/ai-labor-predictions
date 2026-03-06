import { ImageResponse } from "next/og";
import { getAllPredictions, getPredictionBySlug } from "@/lib/data-loader";

export const runtime = "edge";
export const alt = "AI Labor Market Prediction — Early Signals of AI Impact";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPredictions().map((p) => ({ slug: p.slug }));
}

// Category colors and labels
const CATEGORY_META: Record<
  string,
  { color: string; label: string; gradient: string }
> = {
  displacement: {
    color: "#ef4444",
    label: "Job Displacement",
    gradient:
      "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 100%)",
  },
  wages: {
    color: "#f59e0b",
    label: "Wage Impact",
    gradient:
      "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)",
  },
  adoption: {
    color: "#5C61F6",
    label: "AI Adoption",
    gradient:
      "linear-gradient(135deg, rgba(92,97,246,0.06) 0%, rgba(92,97,246,0.02) 100%)",
  },
  signals: {
    color: "#3b82f6",
    label: "Corporate Signals",
    gradient:
      "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%)",
  },
  exposure: {
    color: "#8b5cf6",
    label: "Workforce Exposure",
    gradient:
      "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(139,92,246,0.02) 100%)",
  },
};

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

export default function OGImage({ params }: { params: { slug: string } }) {
  const prediction = getPredictionBySlug(params.slug);

  if (!prediction) {
    // Fallback for unknown slugs
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafafa",
            fontFamily: "Inter, -apple-system, sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: "#1a1a1a",
          }}
        >
          Prediction Not Found
        </div>
      ),
      { ...size }
    );
  }

  const cat = CATEGORY_META[prediction.category] || CATEGORY_META.displacement;
  const trendValues = prediction.history.map((h) => h.value);
  const currentVal =
    prediction.currentValue ?? trendValues[trendValues.length - 1] ?? 0;
  const sourceCount = prediction.sources.length;

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
        {/* Gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: cat.gradient,
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
            backgroundColor: cat.color,
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
          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "white",
                backgroundColor: cat.color,
                padding: "5px 14px",
                borderRadius: 20,
              }}
            >
              {cat.label}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#9ca3af",
              }}
            >
              {prediction.timeHorizon}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#1a1a1a",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
              maxWidth: 800,
            }}
          >
            {prediction.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#6b7280",
              lineHeight: 1.5,
              margin: "12px 0 0 0",
              maxWidth: 700,
            }}
          >
            {prediction.description.length > 150
              ? prediction.description.slice(0, 150) + "..."
              : prediction.description}
          </p>

          {/* Main value + sparkline area */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 48,
              flex: 1,
              marginTop: 24,
            }}
          >
            {/* Big value */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Current Weighted Estimate
              </span>
              <span
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: cat.color,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {currentVal}
                <span style={{ fontSize: 36, fontWeight: 700 }}>
                  {prediction.unit.includes("%") ? "%" : ""}
                </span>
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#9ca3af",
                  marginTop: 4,
                }}
              >
                {prediction.unit}
              </span>
            </div>

            {/* Sparkline */}
            {trendValues.length >= 2 && (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "flex-end",
                  maxWidth: 500,
                }}
              >
                <svg
                  width="500"
                  height="120"
                  viewBox="0 0 500 120"
                  style={{ width: "100%", height: 120 }}
                >
                  <defs>
                    <linearGradient
                      id="sparkGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={cat.color}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={cat.color}
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d={`${sparklinePath(trendValues, 500, 120)} L500,120 L0,120 Z`}
                    fill="url(#sparkGrad)"
                  />
                  {/* Line */}
                  <path
                    d={sparklinePath(trendValues, 500, 120)}
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* End dot */}
                  <circle
                    cx="500"
                    cy={(() => {
                      const vals = trendValues;
                      const min = Math.min(...vals);
                      const max = Math.max(...vals);
                      const range = max - min || 1;
                      return (
                        6 +
                        (1 - (vals[vals.length - 1] - min) / range) *
                          (120 - 12)
                      );
                    })()}
                    r="5"
                    fill={cat.color}
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              {sourceCount} sources &middot; {prediction.timeHorizon}
            </span>
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
