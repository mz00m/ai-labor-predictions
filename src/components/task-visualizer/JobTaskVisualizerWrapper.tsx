"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobTaskVisualizer from "./JobTaskVisualizer";
import type { DimensionScoresMap } from "./JobTaskVisualizer";

interface Props {
  dimensionScores: DimensionScoresMap;
}

function Inner({ dimensionScores }: Props) {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("job") || undefined;
  return <JobTaskVisualizer initialJobId={initialJobId} dimensionScores={dimensionScores} />;
}

export default function JobTaskVisualizerWrapper({ dimensionScores }: Props) {
  return (
    <Suspense fallback={<div className="h-[200px]" />}>
      <Inner dimensionScores={dimensionScores} />
    </Suspense>
  );
}
