"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { JobTask, calculateCrossoverYear } from "@/data/job-tasks";

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
    return { label: `~${crossoverYear}`, color: "#EF4444", bg: "rgba(239, 68, 68, 0.06)" };
  }
  if (crossoverYear <= 2031) {
    return { label: `~${crossoverYear}`, color: "#6366F1", bg: "rgba(99, 102, 241, 0.06)" };
  }
  if (crossoverYear <= 2036) {
    return { label: `~${crossoverYear}`, color: "#10B981", bg: "rgba(16, 185, 129, 0.06)" };
  }
  return { label: "Lower risk (10yr+)", color: "#10B981", bg: "rgba(16, 185, 129, 0.06)" };
}

export default function TaskSliders({
  tasks,
  adjustedShares,
  onShareChange,
  humanWagePerHr,
}: TaskSlidersProps) {
  const handleChange = useCallback(
    (taskId: string, newVal: number) => {
      onShareChange(taskId, Math.max(0, Math.min(1, newVal)));
    },
    [onShareChange]
  );

  // Track risk badge transitions for pop animation
  const prevRiskRef = useRef<Record<string, string>>({});
  const [poppedBadges, setPoppedBadges] = useState<Record<string, boolean>>({});
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Check for risk-level transitions and trigger pop
  const checkRiskTransition = useCallback((taskId: string, label: string) => {
    if (reducedMotion.current) return;
    const prev = prevRiskRef.current[taskId];
    if (prev && prev !== label) {
      setPoppedBadges((p) => ({ ...p, [taskId]: true }));
      setTimeout(() => setPoppedBadges((p) => ({ ...p, [taskId]: false })), 400);
    }
    prevRiskRef.current[taskId] = label;
  }, []);

  return (
    <div className="space-y-3">
      <div className="mb-2">
        <p className="text-[12px] text-[var(--muted)]">
          Adjust sliders to match your actual workload. The others rebalance automatically.
          This changes your overall exposure profile, not when each task becomes automatable.
        </p>
      </div>

      {tasks.map((task) => {
        const share = adjustedShares[task.id] ?? task.timeShare;
        const crossover = calculateCrossoverYear(
          { ...task, timeShare: share },
          humanWagePerHr
        );
        const risk = getRiskBadge(crossover);
        checkRiskTransition(task.id, risk.label);
        const isPopped = poppedBadges[task.id];

        return (
          <div key={task.id} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${crossover !== null && crossover <= 2026 ? "risk-dot-pulse" : ""}`}
                  style={{ backgroundColor: risk.color }}
                />
                <span className="text-[13px] font-medium text-[var(--foreground)] truncate">
                  {task.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isPopped ? "risk-badge-pop" : ""}`}
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
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer slider-track"
              style={{
                background: `linear-gradient(to right, ${risk.color} 0%, ${risk.color} ${share * 100}%, rgba(0,0,0,0.06) ${share * 100}%, rgba(0,0,0,0.06) 100%)`,
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
