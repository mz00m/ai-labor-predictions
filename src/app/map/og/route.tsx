import { ImageResponse } from "next/og";
import stateRisk from "@/data/risk/state-risk.json";
import msaSummary from "@/data/regional/msa-summary.json";
import countyRisk from "@/data/risk/county-risk.json";

/**
 * Dynamic Open Graph image for /map shares.
 *
 *   /map/og?view=state&id=11        -> District of Columbia card
 *   /map/og?view=metro&id=12420     -> Austin-Round Rock-San Marcos card
 *   /map/og?view=county&id=48453    -> Travis County card
 *   /map/og                         -> National default card
 *
 * Renders a 1200x630 PNG using Next's ImageResponse (Satori under the
 * hood — inline-style JSX only, no Tailwind, no CSS files). Plain
 * system fonts for portability.
 */

// Node runtime, not edge — the state/MSA/county JSONs we read total
// >4 MB, which exceeds the edge bundle ceiling. Node serverless handles
// it fine and gives us full filesystem access.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ARCHETYPE_COLORS = {
  "automation-risk": "#DC2626",
  reorganize: "#F59E0B",
  grow: "#16A34A",
  "less-change": "#94A3B8",
} as const;

const ARCHETYPE_SHORT = {
  "automation-risk": "Auto-risk",
  reorganize: "Reorganize",
  grow: "Grow",
  "less-change": "Less change",
} as const;

type ViewMode = "country" | "metro" | "county";
type ArchetypeMix = Record<keyof typeof ARCHETYPE_COLORS, number>;

interface ResolvedRegion {
  label: string;
  scopeKicker: string; // "STATE" | "METRO" | "COUNTY" | "NATIONAL"
  totalEmployment: number;
  netRisk100: number;
  atRiskShare: number | null; // 0-1
  archetypeMix?: ArchetypeMix;
}

function resolve(view: ViewMode | "national", id: string | null): ResolvedRegion {
  if (view === "country" && id) {
    const s = (stateRisk as { states: Array<{ fips: string; title: string; totalEmployment: number; weightedNetRisk100: number; weightedNetRisk100Full?: number; archetypeMix?: ArchetypeMix }> })
      .states.find((x) => x.fips === id);
    if (s) {
      return {
        label: s.title,
        scopeKicker: "STATE",
        totalEmployment: s.totalEmployment,
        netRisk100: s.weightedNetRisk100Full ?? s.weightedNetRisk100,
        atRiskShare: s.archetypeMix?.["automation-risk"] ?? null,
        archetypeMix: s.archetypeMix,
      };
    }
  }
  if (view === "metro" && id) {
    const m = (msaSummary as { areas: Array<{ cbsa: string; title: string; totalEmployment: number; weightedNetRisk100: number; weightedNetRisk100Full?: number; archetypeMix?: ArchetypeMix }> })
      .areas.find((x) => x.cbsa === id);
    if (m) {
      return {
        label: m.title,
        scopeKicker: "METRO",
        totalEmployment: m.totalEmployment,
        netRisk100: m.weightedNetRisk100Full ?? m.weightedNetRisk100,
        atRiskShare: m.archetypeMix?.["automation-risk"] ?? null,
        archetypeMix: m.archetypeMix,
      };
    }
  }
  if (view === "county" && id) {
    const c = (countyRisk as { counties: Array<{ fips: string; name: string; totalEmployment: number; weightedNetRisk100: number; archetypeMix?: ArchetypeMix }> })
      .counties.find((x) => x.fips === id);
    if (c) {
      return {
        label: c.name,
        scopeKicker: "COUNTY",
        totalEmployment: c.totalEmployment,
        netRisk100: c.weightedNetRisk100,
        atRiskShare: c.archetypeMix?.["automation-risk"] ?? null,
        archetypeMix: c.archetypeMix,
      };
    }
  }
  return {
    label: "AI Labor Risk Map",
    scopeKicker: "NATIONAL",
    totalEmployment: 0,
    netRisk100: 0,
    atRiskShare: null,
  };
}

function riskColorFromShare(share: number | null): string {
  if (share == null) return "#94A3B8";
  if (share >= 0.45) return "#DC2626";
  if (share >= 0.35) return "#F59E0B";
  if (share >= 0.25) return "#FBBF24";
  return "#16A34A";
}

function formatJobs(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("en-US");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = (searchParams.get("view") || "national") as ViewMode | "national";
  const id = searchParams.get("id");

  const region = resolve(view as ViewMode, id);
  const atRiskPct = region.atRiskShare != null ? Math.round(region.atRiskShare * 100) : null;
  const headlineColor = riskColorFromShare(region.atRiskShare);
  const isNational = region.scopeKicker === "NATIONAL";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          padding: "60px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#0F172A",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "#5C61F6",
                borderRadius: 6,
              }}
            />
            jobsdata.ai
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#5C61F6",
              textTransform: "uppercase",
            }}
          >
            {region.scopeKicker} · AI Labor Risk Map
          </div>
        </div>

        {/* Region label */}
        <div
          style={{
            display: "flex",
            fontSize: isNational ? 64 : 56,
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.05,
            letterSpacing: -1.5,
            marginBottom: 18,
            maxWidth: 1050,
          }}
        >
          {region.label}
        </div>

        {/* Headline stat */}
        {atRiskPct != null ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 18,
              }}
            >
              <span
                style={{
                  fontSize: 120,
                  fontWeight: 900,
                  color: headlineColor,
                  lineHeight: 1,
                  letterSpacing: -3,
                  fontFamily: "monospace",
                }}
              >
                {atRiskPct}%
              </span>
              <span
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#475569",
                  maxWidth: 540,
                  lineHeight: 1.2,
                }}
              >
                of jobs in automation-risk occupations
              </span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#64748B",
                marginTop: 6,
              }}
            >
              {formatJobs(region.totalEmployment)} jobs scored · Net risk {region.netRisk100}/100
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 30,
              fontWeight: 500,
              color: "#475569",
              maxWidth: 1000,
              lineHeight: 1.3,
              marginTop: 4,
            }}
          >
            Every US county, metro, and state scored on a 5-variable framework
            — exposure, adoption, adaptability, demand elasticity, complementarity.
          </div>
        )}

        {/* Archetype mix bar */}
        {region.archetypeMix && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: "#94A3B8",
                marginBottom: 8,
              }}
            >
              Archetype mix (employment share)
            </div>
            <div
              style={{
                display: "flex",
                height: 18,
                width: "100%",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              {(["automation-risk", "reorganize", "grow", "less-change"] as const).map(
                (k) => (
                  <div
                    key={k}
                    style={{
                      width: `${(region.archetypeMix?.[k] ?? 0) * 100}%`,
                      background: ARCHETYPE_COLORS[k],
                    }}
                  />
                ),
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 22,
                marginTop: 10,
                fontSize: 16,
                color: "#475569",
              }}
            >
              {(["automation-risk", "reorganize", "grow", "less-change"] as const).map(
                (k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: ARCHETYPE_COLORS[k],
                      }}
                    />
                    {ARCHETYPE_SHORT[k]}{" "}
                    <span style={{ fontFamily: "monospace", color: "#0F172A", fontWeight: 600 }}>
                      {Math.round((region.archetypeMix?.[k] ?? 0) * 100)}%
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTop: "1px solid #E2E8F0",
            fontSize: 14,
            color: "#64748B",
          }}
        >
          <div style={{ display: "flex" }}>
            342 occupations · 5-variable framework
          </div>
          <div style={{ display: "flex", fontWeight: 600 }}>
            jobsdata.ai/map
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
