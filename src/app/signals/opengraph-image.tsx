import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "AI Automation Signals — Tracking where AI automation is heading by industry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Industry categories with signal strength (hardcoded snapshot for OG image perf)
const INDUSTRIES = [
  {
    name: "Customer Service",
    signal: 0.92,
    color: "#ef4444",
    tools: "Intercom, Zendesk AI",
  },
  {
    name: "Content & Marketing",
    signal: 0.85,
    color: "#f59e0b",
    tools: "Jasper, Copy.ai",
  },
  {
    name: "Software Dev",
    signal: 0.88,
    color: "#5C61F6",
    tools: "Copilot, Cursor",
  },
  {
    name: "Legal & Compliance",
    signal: 0.72,
    color: "#8b5cf6",
    tools: "Harvey, CoCounsel",
  },
  {
    name: "Data & Analytics",
    signal: 0.78,
    color: "#3b82f6",
    tools: "Tableau AI, Hex",
  },
  {
    name: "Design & Creative",
    signal: 0.68,
    color: "#059669",
    tools: "Midjourney, Figma AI",
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
              "linear-gradient(135deg, rgba(92,97,246,0.04) 0%, rgba(59,130,246,0.04) 50%, rgba(239,68,68,0.03) 100%)",
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
              "linear-gradient(90deg, #ef4444 0%, #f59e0b 25%, #5C61F6 50%, #3b82f6 75%, #059669 100%)",
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
              marginBottom: 32,
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
                Automation Signals
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
              Where Is AI Automation
            </h1>
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
              Heading?
            </h1>
          </div>

          {/* Industry signal bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              flex: 1,
            }}
          >
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {/* Industry name */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    width: 180,
                    flexShrink: 0,
                  }}
                >
                  {ind.name}
                </span>

                {/* Signal bar background */}
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: 28,
                    backgroundColor: "rgba(0,0,0,0.04)",
                    borderRadius: 6,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Filled portion */}
                  <div
                    style={{
                      display: "flex",
                      width: `${ind.signal * 100}%`,
                      height: "100%",
                      backgroundColor: ind.color,
                      borderRadius: 6,
                      opacity: 0.85,
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {Math.round(ind.signal * 100)}%
                    </span>
                  </div>
                </div>

                {/* Tools */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#9ca3af",
                    width: 160,
                    flexShrink: 0,
                  }}
                >
                  {ind.tools}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              6 industries &middot; npm download trends &middot; BLS employment
              data
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
