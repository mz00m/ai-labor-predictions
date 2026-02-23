"use client";

import Link from "next/link";
import { Prediction, EvidenceTier } from "@/lib/types";
import PredictionChart from "./PredictionChart";

interface PredictionCardProps {
  prediction: Prediction;
  selectedTiers: EvidenceTier[];
}

export default function PredictionCard({
  prediction,
  selectedTiers,
}: PredictionCardProps) {
  const filtered = prediction.history.filter((d) =>
    selectedTiers.includes(d.evidenceTier)
  );
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let trend: "up" | "down" | "flat" = "flat";
  if (sorted.length >= 2) {
    const last = sorted[sorted.length - 1].value;
    const prev = sorted[sorted.length - 2].value;
    if (last > prev) trend = "up";
    else if (last < prev) trend = "down";
  }

  const trendIcon =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor =
    prediction.category === "displacement"
      ? trend === "up"
        ? "text-red-500"
        : trend === "down"
          ? "text-green-500"
          : "text-gray-400"
      : trend === "up"
        ? "text-green-500"
        : trend === "down"
          ? "text-red-500"
          : "text-gray-400";

  return (
    <Link href={`/predictions/${prediction.slug}`}>
      <div className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {prediction.category === "displacement"
              ? "Job Displacement"
              : "Wage Impact"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {prediction.timeHorizon}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {prediction.title}
        </h3>
        <div className="mb-3">
          <PredictionChart
            history={prediction.history}
            sources={prediction.sources}
            selectedTiers={selectedTiers}
            unit={prediction.unit.includes("%") ? "%" : ""}
            compact
          />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {prediction.currentValue > 0 ? "+" : ""}
              {prediction.currentValue}
              <span className="text-sm font-normal text-gray-500">
                {prediction.unit.includes("%") ? "%" : ` ${prediction.unit}`}
              </span>
            </span>
          </div>
          <span className={`text-lg font-bold ${trendColor}`}>
            {trendIcon}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {prediction.sources.length} sources
        </p>
      </div>
    </Link>
  );
}
