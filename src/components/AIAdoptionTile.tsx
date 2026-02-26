"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const aiAdoptionData = [
  { date: "Jun 2024", overall: 43.9, work: 32.9, estimated: false },
  { date: "Aug 2024", overall: 44.6, work: 33.3, estimated: false },
  { date: "Nov 2024", overall: 46.3, work: 31.0, estimated: false },
  { date: "Feb 2025", overall: 49.5, work: 33.5, estimated: true },
  { date: "May 2025", overall: 52.0, work: 35.5, estimated: true },
  { date: "Aug 2025", overall: 54.6, work: 37.4, estimated: false },
  { date: "Nov 2025", overall: 55.9, work: 40.7, estimated: false },
];

const OVERALL_COLOR = "#7c3aed";
const WORK_COLOR = "#2563eb";

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

interface DataPoint {
  date: string;
  overall: number;
  work: number;
  estimated: boolean;
}

function AdoptionTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as DataPoint;
  if (!data) return null;

  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-3.5 max-w-xs shadow-sm">
      <p className="text-[12px] font-medium text-[var(--foreground)] mb-1.5">
        {data.date}
        {data.estimated && (
          <span className="ml-2 text-[10px] font-normal text-[var(--muted)] italic">
            estimated
          </span>
        )}
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: OVERALL_COLOR }}
          />
          <span className="text-[13px] text-[var(--foreground)]">
            Overall:{" "}
            <span className="font-bold stat-number">{data.overall}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: WORK_COLOR }}
          />
          <span className="text-[13px] text-[var(--foreground)]">
            At work:{" "}
            <span className="font-bold stat-number">{data.work}%</span>
          </span>
        </div>
      </div>
      {data.estimated && (
        <p className="text-[10px] text-[var(--muted)] mt-2 leading-snug">
          Values estimated from tracker chart
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Dot renderers                                               */
/* ------------------------------------------------------------------ */

function OverallDot(props: Record<string, unknown>) {
  const { cx, cy, payload } = props as {
    cx: number;
    cy: number;
    payload: DataPoint;
  };
  if (cx == null || cy == null) return <g />;

  if (payload.estimated) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4.5}
        fill="white"
        stroke={OVERALL_COLOR}
        strokeWidth={2}
      />
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4.5}
      fill={OVERALL_COLOR}
      stroke="white"
      strokeWidth={2}
    />
  );
}

function WorkDot(props: Record<string, unknown>) {
  const { cx, cy, payload } = props as {
    cx: number;
    cy: number;
    payload: DataPoint;
  };
  if (cx == null || cy == null) return <g />;

  if (payload.estimated) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4.5}
        fill="white"
        stroke={WORK_COLOR}
        strokeWidth={2}
      />
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4.5}
      fill={WORK_COLOR}
      stroke="white"
      strokeWidth={2}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AIAdoptionTile() {
  return (
    <div className="border border-black/[0.06] rounded-lg bg-white px-5 py-6 sm:px-6">
      {/* Title */}
      <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-1 leading-snug">
        Generative AI Adoption
      </h3>

      {/* Description */}
      <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-5 max-w-xl">
        Share of U.S. working-age adults (18&ndash;64) using generative AI, from
        a nationally representative survey run quarterly since June 2024.
        Overall adoption has reached 55.9% &mdash; outpacing both the PC and
        internet at comparable points post-launch. Work adoption (40.7%) lags
        overall use, consistent with workers adopting ahead of their employers.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-[13px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-[3px] rounded-full"
            style={{ backgroundColor: OVERALL_COLOR }}
          />
          Overall
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-[3px] rounded-full"
            style={{ backgroundColor: WORK_COLOR }}
          />
          At work
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full border-2 shrink-0"
            style={{ borderColor: "var(--muted)" }}
          />
          <span className="opacity-60">Estimated</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: "var(--muted)" }}
          />
          <span className="opacity-60">Confirmed</span>
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={aiAdoptionData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.15}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[20, 65]}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<AdoptionTooltip />} />
          <Line
            type="monotone"
            dataKey="overall"
            name="Overall"
            stroke={OVERALL_COLOR}
            strokeWidth={2.5}
            dot={OverallDot}
            activeDot={{ r: 6, fill: OVERALL_COLOR, stroke: "white", strokeWidth: 2 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="work"
            name="At work"
            stroke={WORK_COLOR}
            strokeWidth={2.5}
            dot={WorkDot}
            activeDot={{ r: 6, fill: WORK_COLOR, stroke: "white", strokeWidth: 2 }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Footnote */}
      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed opacity-70">
        Feb &amp; May 2025 values estimated from tracker chart; all other
        values from published working paper.
      </p>

      {/* Source */}
      <p className="text-[12px] text-[var(--muted)] mt-2">
        St. Louis Fed / Harvard RPS &middot; Updated quarterly &middot;{" "}
        <a
          href="http://GenAIAdoptionTracker.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--foreground)]"
        >
          GenAIAdoptionTracker.com
        </a>
      </p>
    </div>
  );
}
