import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "How Firms Respond to AI Productivity — Reduce, Amplify, or Expand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PATHS = [
  {
    title: "Reduce",
    subtitle: "Same output, fewer workers",
    color: "#dc2626",
    icon: "↓",
    stat: "−16%",
    statLabel: "entry-level roles in AI-exposed jobs",
  },
  {
    title: "Amplify",
    subtitle: "Same team, more output",
    color: "#16a34a",
    icon: "×",
    stat: "+26%",
    statLabel: "completed pull requests with AI",
  },
  {
    title: "Expand",
    subtitle: "New work, new roles, new markets",
    color: "#5C61F6",
    icon: "⑂",
    stat: "Jevons",
    statLabel: "efficiency grows demand, not shrinks it",
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
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(220,38,38,0.03) 0%, rgba(22,163,74,0.03) 50%, rgba(92,97,246,0.04) 100%)",
            display: "flex",
          }}
        />

        {/* Top accent bar — three-color */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            display: "flex",
          }}
        >
          <div
            style={{ flex: 1, backgroundColor: "#dc2626", display: "flex" }}
          />
          <div
            style={{ flex: 1, backgroundColor: "#16a34a", display: "flex" }}
          />
          <div
            style={{ flex: 1, backgroundColor: "#5C61F6", display: "flex" }}
          />
        </div>

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
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                AI Productivity → Firm Response
              </span>
            </div>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              What Happens When Workers
            </h1>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#1a1a1a",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Get More Productive?
            </h1>
          </div>

          {/* Three path cards */}
          <div
            style={{
              display: "flex",
              gap: 24,
              flex: 1,
            }}
          >
            {PATHS.map((path) => (
              <div
                key={path.title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: "28px 24px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Color top edge */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: path.color,
                    display: "flex",
                  }}
                />

                {/* Icon circle */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: path.color + "18",
                    color: path.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  {path.icon}
                </div>

                {/* Title */}
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: path.color,
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {path.title}
                </span>

                {/* Subtitle */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: 16,
                  }}
                >
                  {path.subtitle}
                </span>

                {/* Stat */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "auto",
                  }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: path.color,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {path.stat}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#9ca3af",
                      lineHeight: 1.3,
                    }}
                  >
                    {path.statLabel}
                  </span>
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
              marginTop: 20,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              Research-backed framework · Brynjolfsson et al.
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
