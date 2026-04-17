"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ECONOMY_RADAR } from "@/data/forecast";

const radarData = ECONOMY_RADAR.map((d) => ({
  dimension: d.label,
  score: d.score,
  fullMark: 10,
}));

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { dimension: string; score: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const meta = ECONOMY_RADAR.find((r) => r.label === d.dimension);
  return (
    <div className="bg-white border border-strong rounded-lg px-3 py-2 shadow-lg max-w-[220px]">
      <p className="text-base font-bold text-[#2E3650]">{d.dimension}</p>
      <p className="text-3xl font-black text-[#2E3650]">{d.score}/10</p>
      {meta && (
        <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
          {meta.description}
        </p>
      )}
    </div>
  );
}

export default function EconomyRadarChart() {
  return (
    <section className="mt-12 mb-10">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
        Five-Variable Framework
      </p>
      <h2 className="text-heading sm:text-heading-xl font-extrabold tracking-tight text-[#2E3650] mb-1">
        Economy-Wide Risk Assessment
      </h2>
      <p className="text-md text-[var(--muted)] mb-6 max-w-xl leading-relaxed">
        Two pressure dimensions drive displacement risk up. Three buffer
        dimensions absorb it. The net result: moderate risk, not catastrophe.
      </p>

      <div className="border border-card rounded-xl p-6 bg-white">
        <div className="mx-auto" style={{ maxWidth: 420 }}>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(0,0,0,0.06)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Economy-wide"
                dataKey="score"
                stroke="#5C61F6"
                fill="#5C61F6"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ r: 4, fill: "#5C61F6" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {ECONOMY_RADAR.map((d) => (
            <div
              key={d.dimension}
              className="text-center px-2 py-3 rounded-lg bg-black/[0.02]"
            >
              <p className="text-heading-sm font-black text-[#2E3650]">
                {d.score}
              </p>
              <p
                className={`text-2xs font-bold uppercase tracking-wider mt-0.5 ${
                  d.role === "pressure"
                    ? "text-[#F66B5C]"
                    : "text-emerald-600"
                }`}
              >
                {d.role}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1 leading-snug">
                {d.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
