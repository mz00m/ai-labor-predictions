"use client";

import { useCallback } from "react";
import { JobTask, TASK_CATEGORY_META, calculateCrossoverYear } from "@/data/job-tasks";

interface TaskSlidersProps {
  tasks: JobTask[];
  adjustedShares: Record<string, number>;
  onShareChange: (taskId: string, value: number) => void;
  humanWagePerHr: number;
}

function getRiskBadge(crossoverYear: number | null) {
  if (!crossoverYear || crossoverYear <= 2026) {
    return { label: "At risk now", color: "#EF4444", bg: "rgba(239, 68, 68, 0.08)" };
  }
  if (crossoverYear <= 2028) {
    return { label: `~${crossoverYear}`, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)" };
  }
  if (crossoverYear <= 2031) {
    return { label: `~${crossoverYear}`, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.06)" };
  }
  if (crossoverYear <= 2036) {
    return { label: `~${crossoverYear}`, color: "#10B981", bg: "rgba(16, 185, 129, 0.06)" };
  }
  return { label: "Safe (10yr+)", color: "#5C61F6", bg: "rgba(92, 97, 246, 0.06)" };
}

export default function TaskSliders({
  tasks,
  adjustedShares,
  onShareChange,
  humanWagePerHr,
}: TaskSlidersProps) {
  const totalShare = Object.values(adjustedShares).reduce((s, v) => s + v, 0);

  const handleChange = useCallback(
    (taskId: string, newVal: number) => {
      onShareChange(taskId, Math.max(0, Math.min(1, newVal)));
    },
    [onShareChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] text-[var(--muted)]">
          Adjust sliders to match your actual workload
        </p>
        <span
          className={`text-[12px] font-medium ${
            Math.abs(totalShare - 1) < 0.02 ? "text-[#10B981]" : "text-[#F59E0B]"
          }`}
        >
          Total: {Math.round(totalShare * 100)}%
        </span>
      </div>

      {tasks.map((task) => {
        const share = adjustedShares[task.id] ?? task.timeShare;
        const crossover = calculateCrossoverYear(
          { ...task, timeShare: share },
          humanWagePerHr
        );
        const risk = getRiskBadge(crossover);
        const catMeta = TASK_CATEGORY_META[task.category];

        return (
          <div key={task.id} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: catMeta.color }}
                />
                <span className="text-[13px] font-medium text-[var(--foreground)] truncate">
                  {task.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ color: risk.color, backgroundColor: risk.bg }}
                >
                  {risk.label}
                </span>
                <span className="text-[12px] font-medium text-[var(--foreground)] w-[36px] text-right tabular-nums">
                  {Math.round(share * 100)}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(share * 100)}
              onChange={(e) => handleChange(task.id, parseInt(e.target.value) / 100)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${catMeta.color} 0%, ${catMeta.color} ${share * 100}%, rgba(0,0,0,0.06) ${share * 100}%, rgba(0,0,0,0.06) 100%)`,
              }}
            />
            <p className="text-[11px] text-[var(--muted)] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
