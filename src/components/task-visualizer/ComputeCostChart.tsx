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
  TASK_CATEGORY_META,
  generateCostTrajectory,
} from "@/data/job-tasks";

interface ComputeCostChartProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  humanWagePerHr: number;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3 max-w-[220px]">
      <p className="text-[12px] font-semibold text-[var(--foreground)] mb-2">{label}</p>
      {payload
        .filter((p) => p.value !== undefined && p.dataKey !== "humanCost")
        .map((p) => (
          <div key={p.dataKey} className="flex justify-between text-[11px] mb-0.5">
            <span style={{ color: p.color }}>{String(p.name)}</span>
            <span className="font-medium ml-3">
              ${typeof p.value === "number" ? p.value.toFixed(2) : p.value}/hr
            </span>
          </div>
        ))}
      {payload.find((p) => p.dataKey === "humanCost") && (
        <div className="flex justify-between text-[11px] mt-1 pt-1 border-t border-black/[0.06]">
          <span className="text-[var(--muted)]">Human cost</span>
          <span className="font-medium">
            ${payload.find((p) => p.dataKey === "humanCost")?.value?.toFixed(2)}/hr
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
      // Blended human cost as reference
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

  return (
    <div>
      {/* Task selector pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tasks.map((task) => {
          const isSelected = selectedTasks.has(task.id);
          const color = TASK_CATEGORY_META[task.category].color;
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors"
              style={{
                borderColor: isSelected ? color : "rgba(0,0,0,0.08)",
                backgroundColor: isSelected ? `${color}10` : "transparent",
                color: isSelected ? color : "#6b7280",
              }}
            >
              {task.name}
            </button>
          );
        })}
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
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
              tickFormatter={(v) => `$${v}`}
              scale="log"
              domain={["auto", "auto"]}
              allowDataOverflow
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={humanWagePerHr}
              stroke="#EF4444"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: `Human wage: $${humanWagePerHr}/hr`,
                position: "insideTopRight",
                fill: "#EF4444",
                fontSize: 11,
              }}
            />
            {tasks
              .filter((t) => selectedTasks.has(t.id))
              .map((task) => (
                <Line
                  key={task.id}
                  type="monotone"
                  dataKey={task.id}
                  name={task.name}
                  stroke={TASK_CATEGORY_META[task.category].color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3">
        Log scale. When a task line drops below the red wage line, there is economic incentive to automate it.
        Cost decline rates based on observed AI inference cost trends (30-48% annual decline).
      </p>
    </div>
  );
}
