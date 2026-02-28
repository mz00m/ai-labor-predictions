"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import ageUsageData from "@/data/age-usage.json";

/* ------------------------------------------------------------------ */
/*  Config                                                              */
/* ------------------------------------------------------------------ */

const AGE_COLORS: Record<string, string> = {
  "18-25": "#5C61F6",
  "26-35": "#22c55e",
  "36-45": "#e8a838",
  "46-55": "#d4601a",
  "56-65": "#b02020",
  "66+": "#9333ea",
};

/* ------------------------------------------------------------------ */
/*  Chart data transform                                               */
/* ------------------------------------------------------------------ */

const chartData = ageUsageData.data.map((d) => ({
  month: d.month,
  label: formatMonth(d.month),
  "18-25": d["18-25"],
  "26-35": d["26-35"],
  "36-45": d["36-45"],
  "46-55": d["46-55"],
  "56-65": d["56-65"],
  "66+": d["66+"],
}));

function formatMonth(m: string): string {
  const [year, month] = m.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month, 10) - 1]} '${year.slice(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Tooltip                                                             */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3.5 shadow-sm min-w-[160px]">
      <p className="text-[12px] font-medium text-[var(--foreground)] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[11px] text-[var(--muted)]">{entry.dataKey}</span>
          </div>
          <span className="text-[12px] font-bold text-[var(--foreground)]">
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function AgeUsageTile() {
  const first = ageUsageData.data[0];
  const last = ageUsageData.data[ageUsageData.data.length - 1];

  return (
    <section id="age-usage" className="mt-12">
      <div className="mb-8">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          {ageUsageData.title}
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-2xl">
          {ageUsageData.subtitle}. Young adults (18-25) send nearly half of all
          messages but their share is declining as adoption broadens across older
          demographics.
        </p>
      </div>

      <div className="border border-black/[0.06] rounded-lg bg-white p-5 sm:p-6">
        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ageUsageData.ageBrackets.map((bracket) => {
            const latestVal = last[bracket as keyof typeof last] as number;
            const firstVal = first[bracket as keyof typeof first] as number;
            const delta = latestVal - firstVal;
            const isUp = delta > 0;
            return (
              <span
                key={bracket}
                className="text-[11px] font-bold px-2 py-1 rounded-full"
                style={{
                  color: AGE_COLORS[bracket],
                  backgroundColor: `${AGE_COLORS[bracket]}12`,
                }}
              >
                {bracket}: {latestVal}%{" "}
                <span className="opacity-70">
                  ({isUp ? "+" : ""}{delta.toFixed(1)}pp)
                </span>
              </span>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 55]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              {ageUsageData.ageBrackets.map((bracket) => (
                <Line
                  key={bracket}
                  type="monotone"
                  dataKey={bracket}
                  stroke={AGE_COLORS[bracket]}
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: AGE_COLORS[bracket], strokeWidth: 0 }}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff" }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key takeaway */}
        <div className="mt-5 p-3 rounded-md bg-blue-50/50 border border-blue-200/30">
          <p className="text-[12px] text-blue-900 leading-relaxed">
            <span className="font-bold">Key trend:</span>{" "}
            The 18-25 age group dominates ChatGPT usage with ~{last["18-25"]}% of
            messages, but this share has fallen from {first["18-25"]}% as older
            cohorts accelerate adoption. Work-related usage is highest among
            36-45 year olds, while younger users skew toward personal and
            educational tasks.
          </p>
        </div>

        {/* Source attribution */}
        <div className="mt-4 pt-3 border-t border-black/[0.06]">
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Source:{" "}
            <a
              href={ageUsageData.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--foreground)]"
            >
              {ageUsageData.source.name}
            </a>
            {" "}&middot;{" "}
            {ageUsageData.source.authors}
            {" "}&middot;{" "}
            <a
              href={ageUsageData.source.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--foreground)]"
            >
              NBER Paper
            </a>
            {" "}&middot;{" "}
            {ageUsageData.source.license}
            {" "}&middot;{" "}
            <span className="opacity-70">{ageUsageData.source.note}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
