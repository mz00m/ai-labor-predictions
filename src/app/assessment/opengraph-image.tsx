import { ImageResponse } from "next/og";
import { SOURCE_COUNT_DISPLAY } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = "Get a personal AI action plan — free, task-by-task, research-backed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STEPS = [
  { label: "Your work", detail: "Tasks you actually do each week" },
  { label: "Task analysis", detail: "Where AI helps, where it doesn't" },
  { label: "Tools", detail: "Specific, named, matched to the task" },
  { label: "Action plan", detail: "What to try first, and why" },
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
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#5C61F6",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px 44px",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#5C61F6",
              marginBottom: 14,
            }}
          >
            AI Action Plan
          </span>

          <h1
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: "#1a1a1a",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Where does AI actually
          </h1>
          <h1
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: "#1a1a1a",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            fit your work?
          </h1>

          <p
            style={{
              fontSize: 22,
              color: "#6b7280",
              lineHeight: 1.4,
              marginTop: 18,
              marginBottom: 0,
              maxWidth: 760,
            }}
          >
            A free, task-by-task assessment. Five minutes in, a specific plan out.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 36,
              flex: 1,
              alignItems: "flex-start",
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  borderTop: "3px solid #5C61F6",
                  paddingTop: 14,
                  opacity: 1 - i * 0.15,
                }}
              >
                <span style={{ fontSize: 19, fontWeight: 700, color: "#1a1a1a" }}>
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    color: "#9ca3af",
                    lineHeight: 1.35,
                    marginTop: 6,
                  }}
                >
                  {step.detail}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              paddingTop: 18,
            }}
          >
            <span style={{ fontSize: 16, color: "#9ca3af", fontWeight: 500 }}>
              Built on {SOURCE_COUNT_DISPLAY} verified research sources
            </span>
            <span style={{ fontSize: 16, color: "#5C61F6", fontWeight: 700 }}>
              jobsdata.ai
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
