"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobTaskVisualizer from "./JobTaskVisualizer";

function Inner() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("job") || undefined;
  return <JobTaskVisualizer initialJobId={initialJobId} />;
}

export default function JobTaskVisualizerWrapper() {
  return (
    <Suspense fallback={<div className="h-[200px]" />}>
      <Inner />
    </Suspense>
  );
}
