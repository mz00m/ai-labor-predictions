"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import { JobTask, calculateCrossoverYear, DEPLOYMENT_OVERHEAD } from "@/data/job-tasks";
import { useInView } from "@/hooks/useInView";

interface TaskBreakdownChartProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  humanWagePerHr: number;
}

/** Red/blue/green risk palette - the through-line of the whole visualizer */
function getRiskColor(crossoverYear: number | null): string {
  if (!crossoverYear || crossoverYear <= 2028) return "#EF4444"; // red. High risk
  if (crossoverYear <= 2031) return "#6366F1"; // indigo. Moderate
  return "#10B981"; // green. Durable
}

function getRiskLabel(crossoverYear: number | null): string {
  if (!crossoverYear || crossoverYear <= 2026) return "At risk now";
  if (crossoverYear <= 2028) return "1-2 years";
  if (crossoverYear <= 2031) return "3-5 years";
  if (crossoverYear <= 2036) return "5-10 years";
  return "Lower risk (10yr+)";
}

function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[260px]">
      <p className="text-[13px] font-semibold text-[var(--foreground)] mb-1">{data.name}</p>
      <p className="text-[12px] text-[var(--muted)] mb-2">{data.description}</p>
      <div className="space-y-1 text-[12px]">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">Time share</span>
          <span className="font-medium">{Math.round(data.adjustedShare * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">AI capability</span>
          <span className="font-medium">{Math.round(data.aiCapability * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">API cost</span>
          <span className="font-medium">${data.computeCost}/hr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">Cost crossover</span>
          <span className="font-medium" style={{ color: data.riskColor }}>
            {data.crossoverLabel}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-2 pt-1.5 border-t border-black/[0.06]">
        API cost = raw inference only. The Compute Costs tab adds a {DEPLOYMENT_OVERHEAD}x
        deployment overhead (integration, validation, monitoring).
      </p>
    </div>
  );
}

export default function TaskBreakdownChart({
  tasks,
  adjustedShares,
  humanWagePerHr,
}: TaskBreakdownChartProps) {
  const chartData = useMemo(() => {
    return tasks
      .map((task) => {
        const adjustedShare = adjustedShares[task.id] ?? task.timeShare;
        const crossover = calculateCrossoverYear(
          { ...task, timeShare: adjustedShare },
          humanWagePerHr
        );
        const riskColor = getRiskColor(crossover);
        return {
          id: task.id,
          name: task.name,
          description: task.description,
          adjustedShare,
          sharePercent: Math.round(adjustedShare * 100),
          aiCapability: task.aiCapability,
          computeCost: task.currentComputeCostPerHr,
          crossoverYear: crossover,
          crossoverLabel: crossover
            ? crossover <= 2026
              ? "Now"
              : `~${crossover}`
            : "Not foreseeable",
          riskColor,
          riskLabel: getRiskLabel(crossover),
        };
      })
      .sort((a, b) => b.adjustedShare - a.adjustedShare);
  }, [tasks, adjustedShares, humanWagePerHr]);

  // --- Grow-in animation: bars expand from 0 to full width on mount ---
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(0.2);
  const [animProgress, setAnimProgress] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) setAnimProgress(1);
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion.current) return;
    let start: number | null = null;
    let raf: number;
    const duration = 700; // ms
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimProgress(eased);
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const animatedData = useMemo(
    () =>
      chartData.map((d) => ({
        ...d,
        sharePercent: Math.round(d.sharePercent * animProgress),
      })),
    [chartData, animProgress]
  );

  return (
    <div ref={viewRef}>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={animatedData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, Math.max(...chartData.map(d => d.sharePercent), 1)]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fontSize: 12, fill: "#1a1a1a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Bar dataKey="sharePercent" radius={[0, 4, 4, 0]} barSize={24}>
              {animatedData.map((entry) => (
                <Cell key={entry.id} fill={entry.riskColor} fillOpacity={0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Simple risk legend */}
      <div className="flex gap-4 mt-4 pt-3 border-t border-black/[0.06]">
        {[
          { label: "High risk (<3yr)", color: "#EF4444" },
          { label: "Moderate (3-5yr)", color: "#6366F1" },
          { label: "Durable (5yr+)", color: "#10B981" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-[var(--muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
