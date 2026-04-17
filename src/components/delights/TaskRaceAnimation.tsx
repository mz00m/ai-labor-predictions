"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Task Visualizer: "Race to Automation" Animation
 *
 * Tasks animate as runners on parallel tracks, each advancing toward
 * the "cost crossover" finish line at different speeds.
 * Users can toggle AI capability speed (1x, 2x, 5x).
 *
 * Stand-alone component to insert in the task visualizer economic timeline tab.
 */

interface RaceTask {
  name: string;
  /** Years until cost crossover from now */
  yearsToCrossover: number;
  color: string;
  /** Current animation progress 0-1 */
  progress: number;
}

interface TaskRaceAnimationProps {
  tasks: Array<{
    name: string;
    crossoverYear?: number;
    color?: string;
  }>;
  currentYear?: number;
}

const DEFAULT_COLORS = [
  "#ef4444", "#f59e0b", "#22c55e", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

export default function TaskRaceAnimation({
  tasks: inputTasks,
  currentYear = 2025,
}: TaskRaceAnimationProps) {
  const raceTasks: RaceTask[] = inputTasks.map((t, i) => ({
    name: t.name,
    yearsToCrossover: (t.crossoverYear ?? 2030) - currentYear,
    color: t.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    progress: 0,
  }));

  const [runners, setRunners] = useState(raceTasks);
  const [speed, setSpeed] = useState(1);
  const [racing, setRacing] = useState(false);
  const [finished, setFinished] = useState<string[]>([]);
  const animRef = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const startRace = useCallback(() => {
    setRunners(raceTasks);
    setFinished([]);
    setRacing(true);

    if (reducedMotion) {
      // Instant finish
      setRunners(raceTasks.map((r) => ({ ...r, progress: 1 })));
      setFinished(raceTasks.map((r) => r.name));
      setRacing(false);
      return;
    }

    const startTime = performance.now();
    const totalDuration = 6000; // 6 seconds for the full race

    const tick = (now: number) => {
      const elapsed = (now - startTime) * speed;
      const newFinished: string[] = [];

      setRunners((prev) =>
        prev.map((runner) => {
          // Faster tasks (fewer years) finish sooner
          const taskDuration = (runner.yearsToCrossover / 15) * totalDuration;
          const progress = Math.min(elapsed / taskDuration, 1);
          if (progress >= 1) newFinished.push(runner.name);
          return { ...runner, progress };
        })
      );

      setFinished((prev) => {
        const combined = prev.slice();
        for (const name of newFinished) {
          if (!combined.includes(name)) combined.push(name);
        }
        return combined;
      });

      if (elapsed < totalDuration * 1.5) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setRacing(false);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, [raceTasks, speed, reducedMotion]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const trackWidth = 340;
  const trackHeight = 28;
  const gap = 4;
  const svgH = runners.length * (trackHeight + gap) + 40;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={startRace}
          disabled={racing}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
            racing
              ? "text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent-light)]"
              : "text-[var(--muted)] border-strong hover:border-[var(--accent)]/30 hover:text-[var(--accent)] hover:bg-[var(--accent-light)]"
          }`}
        >
          {racing ? "Racing..." : finished.length > 0 ? "Race again" : "Start race"}
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-1 text-2xs text-[var(--muted)]">
          <span className="font-medium mr-1">AI speed:</span>
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-full border text-2xs font-medium transition-all ${
                speed === s
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-strong hover:border-[var(--accent)]/30"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Race tracks */}
      <svg viewBox={`0 0 430 ${svgH}`} className="w-full" style={{ maxWidth: 500 }}>
        {/* Finish line */}
        <line
          x1={trackWidth + 60}
          y1={10}
          x2={trackWidth + 60}
          y2={svgH - 10}
          stroke="#5C61F6"
          strokeWidth={2}
          strokeDasharray="4,4"
          opacity={0.3}
        />
        <text
          x={trackWidth + 65}
          y={20}
          fill="#5C61F6"
          fontSize="8"
          fontWeight="600"
          opacity={0.5}
        >
          Cost
        </text>
        <text
          x={trackWidth + 65}
          y={29}
          fill="#5C61F6"
          fontSize="8"
          fontWeight="600"
          opacity={0.5}
        >
          Parity
        </text>

        {runners.map((runner, i) => {
          const y = 15 + i * (trackHeight + gap);
          const runnerX = 60 + runner.progress * trackWidth;
          const hasFinished = finished.includes(runner.name);
          const finishOrder = finished.indexOf(runner.name);

          return (
            <g key={runner.name}>
              {/* Track */}
              <rect
                x={60}
                y={y}
                width={trackWidth}
                height={trackHeight}
                rx={4}
                fill="rgba(0,0,0,0.02)"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth={0.5}
              />

              {/* Progress trail */}
              <rect
                x={60}
                y={y}
                width={Math.max(0, runnerX - 60)}
                height={trackHeight}
                rx={4}
                fill={runner.color}
                opacity={0.08}
              />

              {/* Task name */}
              <text
                x={2}
                y={y + trackHeight / 2 + 3}
                fill="var(--muted)"
                fontSize="8"
                fontWeight="500"
              >
                {runner.name.length > 10 ? runner.name.slice(0, 10) + "..." : runner.name}
              </text>

              {/* Runner dot */}
              <circle
                cx={runnerX}
                cy={y + trackHeight / 2}
                r={5}
                fill={runner.color}
                opacity={hasFinished ? 1 : 0.8}
              >
                {racing && !hasFinished && !reducedMotion && (
                  <animate
                    attributeName="r"
                    values="4;5.5;4"
                    dur="0.3s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Finish flag */}
              {hasFinished && (
                <g>
                  <text
                    x={trackWidth + 70}
                    y={y + trackHeight / 2 + 3}
                    fill={runner.color}
                    fontSize="8"
                    fontWeight="700"
                  >
                    #{finishOrder + 1}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <p className="text-2xs text-[var(--muted)] italic opacity-60">
        Speed reflects years-to-cost-crossover: tasks closer to parity finish first
      </p>
    </div>
  );
}
