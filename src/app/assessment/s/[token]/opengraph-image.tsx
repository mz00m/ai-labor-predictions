import { ImageResponse } from "next/og";
import { getAssessmentByShareToken } from "@/lib/assessment/db";
import { toPublicReport } from "@/lib/assessment/public-report";
import { computeHeadline } from "@/lib/assessment/headline";

export const runtime = "nodejs";
export const alt = "An AI action plan from jobsdata.ai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TOKEN_RE = /^[a-f0-9]{32}$/;

export default async function OGImage({ params }: { params: { token: string } }) {
  let orgName = "An AI action plan";
  let range: string | null = null;
  let taskCount = 0;

  if (TOKEN_RE.test(params.token)) {
    const assessment = await getAssessmentByShareToken(params.token);
    const data = assessment ? toPublicReport(assessment) : null;
    if (data) {
      orgName = data.organizationName;
      const headline = computeHeadline(data.report);
      if (headline) {
        range = `${headline.low}\u2013${headline.high}`;
        taskCount = headline.totalTasks;
      }
    }
  }

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
            padding: "60px 64px 44px",
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
              marginBottom: 12,
            }}
          >
            AI Action Plan
          </span>

          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#1a1a1a",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            {orgName}
          </h1>

          {range ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 48,
                flex: 1,
              }}
            >
              <span style={{ fontSize: 22, color: "#6b7280" }}>
                Routine work AI could take on, across this team
              </span>
              <div style={{ display: "flex", alignItems: "baseline", marginTop: 10 }}>
                <span
                  style={{
                    fontSize: 132,
                    fontWeight: 900,
                    color: "#1a1a1a",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {range}
                </span>
                <span
                  style={{
                    fontSize: 34,
                    color: "#9ca3af",
                    marginLeft: 20,
                    fontWeight: 500,
                  }}
                >
                  hours a week
                </span>
              </div>
              <span style={{ fontSize: 19, color: "#9ca3af", marginTop: 18 }}>
                Estimated across {taskCount} tasks analyzed. Indicative, not measured.
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <span style={{ fontSize: 26, color: "#6b7280", maxWidth: 800 }}>
                A task-by-task look at where AI fits this team&apos;s work.
              </span>
            </div>
          )}

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
              Build your own free plan
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
