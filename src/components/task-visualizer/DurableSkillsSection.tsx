"use client";

import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  JobProfile,
  JobTask,
  TASK_CATEGORY_META,
  TaskCategory,
  calculateCrossoverYear,
} from "@/data/job-tasks";

interface DurableSkillsSectionProps {
  selectedJob: JobProfile | null;
  adjustedShares: Record<string, number>;
}

/**
 * Categories of durable human skills that remain valuable regardless of AI progress.
 * These map to the task categories where compute cost stays high and AI capability stays low.
 */
const DURABLE_SKILLS = [
  {
    id: "trust-building",
    name: "Trust & Relationship Building",
    description:
      "People choose doctors, advisors, and managers based on trust. Building authentic human relationships is a skill that compounds over a career and cannot be replicated by a model.",
    categories: ["interpersonal"] as TaskCategory[],
    icon: "handshake",
  },
  {
    id: "physical-presence",
    name: "Physical Presence & Dexterity",
    description:
      "Tasks requiring hands, spatial reasoning, and real-world navigation remain among the most expensive to automate. Robotics lags AI cognition by years.",
    categories: ["physical-manual"] as TaskCategory[],
    icon: "hand",
  },
  {
    id: "judgment-ambiguity",
    name: "Judgment Under Ambiguity",
    description:
      "When the problem is novel, the stakes are high, and the data is incomplete, humans who can synthesize context and make judgment calls are irreplaceable. This is different from analysis. It requires wisdom.",
    categories: ["analysis-decision"] as TaskCategory[],
    icon: "scale",
  },
  {
    id: "creative-vision",
    name: "Creative Vision & Taste",
    description:
      "AI can generate infinite variations. The scarce skill is knowing which one is right: having taste, editorial judgment, and a creative point of view that connects with an audience.",
    categories: ["creative-generative"] as TaskCategory[],
    icon: "sparkle",
  },
  {
    id: "leadership",
    name: "Leadership & Motivation",
    description:
      "Getting groups of humans to coordinate, stay motivated, navigate conflict, and row in the same direction requires emotional intelligence that remains deeply human.",
    categories: ["coordination-management", "interpersonal"] as TaskCategory[],
    icon: "people",
  },
  {
    id: "cross-domain",
    name: "Cross-Domain Integration",
    description:
      "The most valuable professionals connect knowledge across domains: the engineer who understands the business, the therapist who understands systems. AI excels at depth; humans at bridging.",
    categories: ["analysis-decision", "interpersonal"] as TaskCategory[],
    icon: "bridge",
  },
];

function SkillIcon({ type }: { type: string }) {
  const svgProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "handshake":
      return (
        <svg {...svgProps}>
          <path d="M20 8H16L12.5 12L9.5 9L4 14" />
          <path d="M14 4L20 4L20 10" />
        </svg>
      );
    case "hand":
      return (
        <svg {...svgProps}>
          <path d="M18 11V6a2 2 0 00-4 0v5" />
          <path d="M14 10V4a2 2 0 00-4 0v6" />
          <path d="M10 10.5V5a2 2 0 00-4 0v9" />
          <path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2a8 8 0 01-6-2.7" />
        </svg>
      );
    case "scale":
      return (
        <svg {...svgProps}>
          <path d="M12 3v18" />
          <path d="M5 6l7-3 7 3" />
          <path d="M2 12l3-6 3 6a3 3 0 01-6 0z" />
          <path d="M16 12l3-6 3 6a3 3 0 01-6 0z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...svgProps}>
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      );
    case "people":
      return (
        <svg {...svgProps}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "bridge":
      return (
        <svg {...svgProps}>
          <path d="M4 18h16" />
          <path d="M4 18V8" />
          <path d="M20 18V8" />
          <path d="M4 8c0-4 4-5 8-5s8 1 8 5" />
          <path d="M8 18V11" />
          <path d="M12 18V9" />
          <path d="M16 18V11" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DurableSkillsSection({
  selectedJob,
  adjustedShares,
}: DurableSkillsSectionProps) {
  // Compute radar chart data based on how durable each category is for the selected job
  const radarData = useMemo(() => {
    if (!selectedJob) return null;

    const catDurability: Record<TaskCategory, { totalShare: number; avgYears: number }> = {} as Record<TaskCategory, { totalShare: number; avgYears: number }>;

    for (const task of selectedJob.tasks) {
      const share = adjustedShares[task.id] ?? task.timeShare;
      const crossover = calculateCrossoverYear(
        { ...task, timeShare: share },
        selectedJob.medianWagePerHr
      );
      const years = crossover ? crossover - 2026 : 15;
      if (!catDurability[task.category]) {
        catDurability[task.category] = { totalShare: 0, avgYears: 0 };
      }
      catDurability[task.category].totalShare += share;
      catDurability[task.category].avgYears += years * share;
    }

    return Object.entries(catDurability)
      .filter(([, v]) => v.totalShare > 0.02)
      .map(([cat, v]) => ({
        category: TASK_CATEGORY_META[cat as TaskCategory].label,
        durability: Math.min(100, Math.round((v.avgYears / v.totalShare) * 10)),
        timeShare: Math.round(v.totalShare * 100),
        fullMark: 100,
      }))
      .sort((a, b) => b.durability - a.durability);
  }, [selectedJob, adjustedShares]);

  // Which durable skills are most relevant to this job?
  const relevantSkills = useMemo(() => {
    if (!selectedJob) return DURABLE_SKILLS;

    const jobCategories = new Set(selectedJob.tasks.map((t) => t.category));
    return DURABLE_SKILLS.filter((skill) =>
      skill.categories.some((cat) => jobCategories.has(cat))
    );
  }, [selectedJob]);

  // Compute the "durable" percentage
  const durablePercent = useMemo(() => {
    if (!selectedJob) return 0;
    return Math.round(
      selectedJob.tasks.reduce((sum, task) => {
        const share = adjustedShares[task.id] ?? task.timeShare;
        const crossover = calculateCrossoverYear(
          { ...task, timeShare: share },
          selectedJob.medianWagePerHr
        );
        const years = crossover ? crossover - 2026 : 15;
        return sum + (years >= 5 ? share : 0);
      }, 0) * 100
    );
  }, [selectedJob, adjustedShares]);

  return (
    <div className="mt-12 pt-8 border-t border-black/[0.06]">
      <div className="mb-8">
        <h3 className="text-[20px] font-bold text-[var(--foreground)] tracking-tight mb-2">
          The skills that stay valuable
        </h3>
        <p className="text-[14px] text-[var(--muted)] max-w-2xl leading-relaxed">
          Automation pressure is real, but it is unevenly distributed. The tasks that are hardest and most
          expensive to automate are often the ones that matter most, and they represent real opportunity
          for anyone willing to invest in them.
        </p>
      </div>

      {/* Hero stat + radar chart side by side when job selected */}
      {selectedJob && radarData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-6">
            <p className="text-[28px] font-bold text-[#10B981] tracking-tight leading-none">
              {durablePercent}%
            </p>
            <p className="text-[14px] text-[var(--foreground)] font-medium mt-2">
              of your time is on tasks with strong human advantage
            </p>
            <p className="text-[12px] text-[var(--muted)] mt-2">
              These tasks won&apos;t face meaningful automation pressure for 5+ years and represent
              the foundation for your long-term career resilience.
            </p>
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(0,0,0,0.06)" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-2">
                        <p className="text-[12px] font-medium">{d.category}</p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {d.timeShare}% of your time · durability: {d.durability}/100
                        </p>
                      </div>
                    );
                  }}
                />
                <Radar
                  dataKey="durability"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Durable skill cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relevantSkills.map((skill) => (
          <div
            key={skill.id}
            className="rounded-xl border border-black/[0.06] p-4 hover:border-emerald-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[#10B981]">
                <SkillIcon type={skill.icon} />
              </div>
              <h4 className="text-[13px] font-semibold text-[var(--foreground)]">
                {skill.name}
              </h4>
            </div>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              {skill.description}
            </p>
          </div>
        ))}
      </div>

      {/* Closing message */}
      <div className="mt-8 rounded-xl bg-black/[0.02] border border-black/[0.06] p-6 max-w-2xl">
        <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
          <strong>The bottom line:</strong> AI will automate tasks, not jobs. The professionals who thrive will
          be the ones who deliberately shift their time toward the tasks that are hardest to automate
          and get better at working <em>with</em> AI on everything else. The goal isn&apos;t to compete
          with AI. It&apos;s to become the kind of person who makes AI more useful.
        </p>
      </div>
    </div>
  );
}
