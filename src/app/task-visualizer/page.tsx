import type { Metadata } from "next";
import enrichedData from "@/data/enriched-occupations.json";
import { scoreKarpathyOccupations } from "@/lib/karpathy-scoring";
import { TASK_VIS_TO_ENRICHED } from "@/data/task-vis-to-enriched";
import JobTaskVisualizerWrapper from "@/components/task-visualizer/JobTaskVisualizerWrapper";

export const metadata: Metadata = {
  title: "What parts of your job will be cheaper to do with AI?",
  description:
    "Every job is made up of tasks. AI costs are dropping fast, and some of your tasks will be cheaper to do with AI before others. See which ones, and when.",
};

// Pre-compute 5D scores for occupations that map from task-vis profiles
const rawForScoring = enrichedData.occupations.map((o) => ({
  title: o.title,
  slug: o.slug,
  category: o.category,
  pay: o.pay,
  jobs: o.jobs,
  outlook: null,
  outlook_desc: "",
  education: o.education,
  exposure: o.exposure,
  exposure_rationale: o.exposure_rationale,
  url: o.blsUrl,
}));

const allScored = scoreKarpathyOccupations(rawForScoring);
const scoredBySlug = new Map(allScored.map((s) => [s.raw.slug, s]));

// Build a map from task-vis job ID → dimension scores
const dimensionScores: Record<
  string,
  {
    scores: Record<string, number>;
    dimensionality: {
      effectiveDimensions: number;
      complementarityBase: number;
      dimensionalityAdj: number;
      source: "cfo" | "heuristic";
    };
  }
> = {};

for (const [jobId, enrichedSlug] of Object.entries(TASK_VIS_TO_ENRICHED)) {
  const scored = scoredBySlug.get(enrichedSlug);
  if (scored) {
    dimensionScores[jobId] = {
      scores: scored.scores,
      dimensionality: scored.dimensionality,
    };
  }
}

export default function TaskVisualizerPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[var(--foreground)] tracking-tight leading-tight">
          What parts of your job will be cheaper to do with AI?
        </h1>
        <p className="text-[14px] text-[var(--muted)] mt-1.5 max-w-2xl leading-relaxed">
          Every job is really a bundle of tasks. As AI gets cheaper and more capable,
          some of those tasks will cost less to do with AI than with a person. This tool
          breaks your job into its tasks and shows you which ones face that pressure first,
          which ones stay human for a long time, and how the economics are shifting.
        </p>
      </header>

      <JobTaskVisualizerWrapper dimensionScores={dimensionScores} />
    </div>
  );
}
