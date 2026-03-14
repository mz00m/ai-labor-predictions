"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import {
  JobTask,
  DEPLOYMENT_OVERHEAD,
  generateCostTrajectory,
  getTaskTokenCost,
  MODEL_PRICING,
} from "@/data/job-tasks";

interface ComputeCostChartProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  humanWagePerHr: number;
}

/** Distinct multi-hue palette so each task line is easy to tell apart */
const LINE_COLORS = [
  "#6366F1", // indigo
  "#F59E0B", // amber
  "#10B981", // emerald
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#F97316", // orange
  "#EC4899", // pink
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[260px]">
      <p className="text-[12px] font-semibold text-[var(--foreground)] mb-2">{label}</p>
      {payload
        .filter((p) => p.value !== undefined && p.dataKey !== "humanCost")
        .map((p) => {
          const val = typeof p.value === "number" ? p.value : 0;
          return (
            <div key={p.dataKey} className="flex justify-between text-[11px] mb-0.5">
              <span style={{ color: p.color }}>{String(p.name)}</span>
              <span className="font-medium ml-3">
                ${val < 1 ? val.toFixed(2) : val.toFixed(0)}/hr
              </span>
            </div>
          );
        })}
      {payload.find((p) => p.dataKey === "humanCost") && (
        <div className="flex justify-between text-[11px] mt-1 pt-1 border-t border-black/[0.06]">
          <span className="text-[var(--muted)]">Your wage</span>
          <span className="font-medium">
            ${payload.find((p) => p.dataKey === "humanCost")?.value?.toFixed(0)}/hr
          </span>
        </div>
      )}
    </div>
  );
}

export default function ComputeCostChart({
  tasks,
  adjustedShares,
  humanWagePerHr,
}: ComputeCostChartProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    () => new Set(tasks.slice(0, 3).map((t) => t.id))
  );

  const chartData = useMemo(() => {
    const years = 10;
    const data: Record<string, number | string>[] = [];

    for (let y = 0; y <= years; y++) {
      const point: Record<string, number | string> = { year: `${2026 + y}` };
      point.humanCost = Math.round(humanWagePerHr * 100) / 100;

      for (const task of tasks) {
        if (!selectedTasks.has(task.id)) continue;
        const share = adjustedShares[task.id] ?? task.timeShare;
        const trajectory = generateCostTrajectory(
          { ...task, timeShare: share },
          humanWagePerHr,
          years
        );
        point[task.id] = trajectory[y].computeCost / share; // per full-hour equivalent
      }
      data.push(point);
    }
    return data;
  }, [tasks, adjustedShares, humanWagePerHr, selectedTasks]);

  // Compute Y-axis domain to ensure both wage and all task lines are visible
  const yDomain = useMemo(() => {
    let minVal = humanWagePerHr;
    let maxVal = humanWagePerHr;
    for (const point of chartData) {
      for (const [key, val] of Object.entries(point)) {
        if (key === "year" || key === "humanCost") continue;
        if (typeof val === "number" && val > 0) {
          minVal = Math.min(minVal, val);
          maxVal = Math.max(maxVal, val);
        }
      }
    }
    // Add padding: go 2x below min and 2x above max for log scale
    return [Math.max(0.01, minVal / 3), maxVal * 2];
  }, [chartData, humanWagePerHr]);

  const toggleTask = (id: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Assign colors by selection order, not category
  const selectedTasksList = tasks.filter((t) => selectedTasks.has(t.id));

  return (
    <div>
      {/* Explanation */}
      <div className="rounded-lg bg-black/[0.02] border border-black/[0.06] p-3 mb-5">
        <p className="text-[12px] text-[var(--foreground)] leading-relaxed">
          Each line shows the <strong>total production cost to automate one hour</strong> of
          a task — raw API cost plus a {DEPLOYMENT_OVERHEAD}x deployment overhead
          (integration engineering, error handling, validation, human review, monitoring).
          When a line drops below the{" "}
          <span className="text-[#EF4444] font-medium">red wage line</span>, there is
          economic incentive to automate that task. These costs are higher than the raw API
          costs shown in the Task Breakdown tab because real-world deployment adds significant overhead.
        </p>
      </div>

      {/* Task selector pills — neutral styling */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tasks.map((task, i) => {
          const isSelected = selectedTasks.has(task.id);
          const color = LINE_COLORS[i % LINE_COLORS.length];
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors"
              style={{
                borderColor: isSelected ? color : "rgba(0,0,0,0.08)",
                backgroundColor: isSelected ? `${color}12` : "transparent",
                color: isSelected ? color : "#9ca3af",
              }}
            >
              {task.name}
            </button>
          );
        })}
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
              scale="log"
              domain={yDomain}
              allowDataOverflow
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={humanWagePerHr}
              stroke="#EF4444"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{
                value: `Your wage: $${humanWagePerHr}/hr`,
                position: "insideTopRight",
                fill: "#EF4444",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            {selectedTasksList.map((task, i) => (
              <Line
                key={task.id}
                type="monotone"
                dataKey={task.id}
                name={task.name}
                stroke={LINE_COLORS[tasks.indexOf(task) % LINE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        Log scale. Includes {DEPLOYMENT_OVERHEAD}x deployment overhead (integration, tooling, validation)
        on top of raw API costs. Cost decline rates: 30-48% annual based on observed AI inference trends.
      </p>

      {/* Token economics breakdown */}
      <div className="mt-6 pt-5 border-t border-black/[0.06]">
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
          How we calculate cost per task
        </h4>
        <p className="text-[11px] text-[var(--muted)] mb-3">
          Raw API cost = Calls/hr x (Input tokens x Input price + Output tokens x Output price) x Call overhead.
          Deployment overhead ({DEPLOYMENT_OVERHEAD}x) is applied separately in the crossover calculation.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-black/[0.06]">
                <th className="text-left py-1.5 pr-2 text-[var(--foreground)] font-semibold">Task</th>
                <th className="text-right py-1.5 px-2 text-[var(--foreground)] font-semibold">Model tier</th>
                <th className="text-right py-1.5 px-2 text-[var(--foreground)] font-semibold">In tokens</th>
                <th className="text-right py-1.5 px-2 text-[var(--foreground)] font-semibold">Out tokens</th>
                <th className="text-right py-1.5 px-2 text-[var(--foreground)] font-semibold">Calls/hr</th>
                <th className="text-right py-1.5 px-2 text-[var(--foreground)] font-semibold">$/call</th>
                <th className="text-right py-1.5 px-2 text-[var(--foreground)] font-semibold">Overhead</th>
                <th className="text-right py-1.5 pl-2 text-[var(--foreground)] font-semibold">Raw $/hr</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              {selectedTasksList.map((task, i) => {
                const { costPerHour, profile, costPerCall } = getTaskTokenCost(task);
                const tierLabel = MODEL_PRICING[profile.modelTier].label.split(" ")[0];
                const lineColor = LINE_COLORS[tasks.indexOf(task) % LINE_COLORS.length];
                return (
                  <tr key={task.id} className="border-b border-black/[0.03]">
                    <td className="py-1.5 pr-2 font-medium" style={{ color: lineColor }}>
                      {task.name}
                    </td>
                    <td className="text-right py-1.5 px-2">{tierLabel}</td>
                    <td className="text-right py-1.5 px-2 tabular-nums">
                      {profile.inputTokensPerCall >= 1000
                        ? `${(profile.inputTokensPerCall / 1000).toFixed(0)}K`
                        : profile.inputTokensPerCall}
                    </td>
                    <td className="text-right py-1.5 px-2 tabular-nums">
                      {profile.outputTokensPerCall >= 1000
                        ? `${(profile.outputTokensPerCall / 1000).toFixed(0)}K`
                        : profile.outputTokensPerCall}
                    </td>
                    <td className="text-right py-1.5 px-2 tabular-nums">{profile.callsPerHumanHour}</td>
                    <td className="text-right py-1.5 px-2 tabular-nums">${costPerCall < 0.01 ? costPerCall.toFixed(4) : costPerCall.toFixed(3)}</td>
                    <td className="text-right py-1.5 px-2 tabular-nums">{profile.overheadMultiplier}x</td>
                    <td className="text-right py-1.5 pl-2 tabular-nums font-medium text-[var(--foreground)]">
                      ${costPerHour < 1 ? costPerHour.toFixed(3) : costPerHour.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[var(--muted)] mt-2">
          Model tiers: <strong className="text-[var(--foreground)]">Small</strong> ({MODEL_PRICING.small.examples}),{" "}
          <strong className="text-[var(--foreground)]">Mid</strong> ({MODEL_PRICING.mid.examples}),{" "}
          <strong className="text-[var(--foreground)]">Frontier</strong> ({MODEL_PRICING.frontier.examples}).
          Pricing as of mid-2026.
        </p>
      </div>
    </div>
  );
}
