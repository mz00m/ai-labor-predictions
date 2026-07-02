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
import rpsTracker from "@/data/rps-tracker.json";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const aiAdoptionData = rpsTracker.series;
const rpsSource = rpsTracker.source;
const rpsFootnote = rpsTracker.footnote;

const OVERALL_COLOR = "#4338CA";
const WORK_COLOR = "#A5B4FC";

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
    <div className="bg-white border border-strong rounded-lg p-3.5 max-w-xs shadow-sm">
      <p className="text-sm font-medium text-[var(--foreground)] mb-1.5">
        {data.date}
        {data.estimated && (
          <span className="ml-2 text-2xs font-normal text-[var(--muted)] italic">
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
          <span className="text-base text-[var(--foreground)]">
            Overall:{" "}
            <span className="font-bold stat-number">{data.overall}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: WORK_COLOR }}
          />
          <span className="text-base text-[var(--foreground)]">
            At work:{" "}
            <span className="font-bold stat-number">{data.work}%</span>
          </span>
        </div>
      </div>
      {data.estimated && (
        <p className="text-2xs text-[var(--muted)] mt-2 leading-snug">
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
/*  Chart Component                                                    */
/* ------------------------------------------------------------------ */

export default function AIAdoptionChart() {
  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-base text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-[3px] rounded-full"
            style={{ backgroundColor: OVERALL_COLOR }}
          />
          Overall adoption
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
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={aiAdoptionData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.06}
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
      <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed opacity-70">
        {rpsFootnote}
      </p>

      {/* Source */}
      <p className="text-sm text-[var(--muted)] mt-2">
        {rpsSource.publisher} &middot; {rpsSource.cadence} &middot;{" "}
        <a
          href={rpsSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--foreground)]"
        >
          {rpsSource.urlLabel}
        </a>
      </p>
    </div>
  );
}
