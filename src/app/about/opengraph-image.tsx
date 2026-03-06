import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "About — Early Signals of AI Impact";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
              "linear-gradient(135deg, rgba(92,97,246,0.04) 0%, rgba(59,130,246,0.03) 50%, rgba(92,97,246,0.02) 100%)",
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
              "linear-gradient(90deg, #5C61F6 0%, #3b82f6 50%, #5C61F6 100%)",
            display: "flex",
          }}
        />

        {/* Content — centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "56px 80px",
            position: "relative",
          }}
        >
          {/* About badge */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "white",
              backgroundColor: "#5C61F6",
              padding: "6px 18px",
              borderRadius: 20,
              marginBottom: 24,
            }}
          >
            About
          </span>

          {/* Site title */}
          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#1a1a1a",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            Early Signals of
          </h1>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#1a1a1a",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            AI Impact
          </h1>

          {/* Mission */}
          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#6b7280",
              lineHeight: 1.6,
              textAlign: "center",
              maxWidth: 650,
              margin: "24px 0 0 0",
            }}
          >
            Tracking the early evidence of how AI is reshaping jobs, wages, and
            the workforce. Open-source, multi-source, evidence-weighted.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 48,
              marginTop: 40,
            }}
          >
            {[
              { value: "17", label: "Predictions" },
              { value: "298+", label: "Sources" },
              { value: "4", label: "Evidence Tiers" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "#5C61F6",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#9ca3af",
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 32,
          }}
        >
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
    ),
    {
      ...size,
    }
  );
}
