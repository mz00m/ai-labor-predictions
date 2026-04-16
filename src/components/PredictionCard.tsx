"use client";

import { useRef } from "react";
import Link from "next/link";
import { Prediction, EvidenceTier } from "@/lib/types";
import { computeAggregate } from "@/lib/prediction-stats";
import PredictionChart from "./PredictionChart";
import { useMagneticTilt } from "@/hooks/useMagneticTilt";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";


interface PredictionCardProps {
  prediction: Prediction;
  selectedTiers: EvidenceTier[];
}

export default function PredictionCard({
  prediction,
  selectedTiers,
}: PredictionCardProps) {
  const agg = computeAggregate(prediction, selectedTiers);

  const trendColor = agg.trendIsBad
    ? "text-red-500"
    : agg.trend !== "flat" && !agg.trendIsBad
      ? "text-green-500"
      : "text-gray-400";

  // Show range + disagreement disclaimer when source spread is wide or many sources
  const spread = agg.max - agg.min;
  const meanAbs = Math.abs(agg.mean) || 1;
  const sourceCount = prediction.history.filter((d) => selectedTiers.includes(d.evidenceTier)).length;
  const hasSignificantDisagreement = agg.min !== agg.max && (spread / meanAbs > 0.5 || sourceCount > 5);
  const isLowConfidence = sourceCount > 0 && sourceCount < 6;

  // Magnetic tilt - subtle 3D depth on hover
  const { ref: tiltRef, style: tiltStyle } = useMagneticTilt<HTMLDivElement>({
    maxTilt: 5,
    hoverScale: 1.02,
    perspective: 600,
  });

  // Intersection-triggered count-up for the big stat number
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(0.3);
  const animatedMean = useCountUp(
    Math.round(agg.mean * 10) / 10 * 10, // x10 for precision
    700,
    inView ? 0 : 99999
  );
  const displayMean = animatedMean / 10;

  // Merge refs
  const mergedRef = (el: HTMLDivElement | null) => {
    (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (viewRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <Link href={`/predictions/${prediction.slug}`}>
      <div
        ref={mergedRef}
        className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg cursor-pointer"
        style={{
          ...tiltStyle,
          willChange: "transform",
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {prediction.category === "displacement"
              ? "Job Displacement"
              : prediction.category === "wages"
                ? "Wage Impact"
                : prediction.category === "adoption"
                  ? "AI Adoption"
                  : prediction.category === "signals"
                    ? "Signal"
                    : prediction.category === "exposure"
                      ? "AI Exposure"
                      : prediction.category}
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
            overlays={prediction.overlays}
          />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {agg.mean > 0 && prediction.category === "wages" ? "+" : ""}
              {inView
                ? (Number.isInteger(agg.mean) ? Math.round(displayMean) : displayMean.toFixed(1))
                : "0"}
              <span className="text-sm font-normal text-gray-500">
                {prediction.unit.includes("%") ? "%" : ` ${prediction.unit}`}
              </span>
            </span>
          </div>
          {agg.trend !== "flat" && (
            <span className={`text-xs font-medium ${trendColor}`} style={{ opacity: 0.7 }}>
              Trending {agg.trend === "up" ? "▲" : "▼"}
            </span>
          )}
        </div>
        {hasSignificantDisagreement && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Range: {agg.min}–{agg.max}{prediction.unit.includes("%") ? "%" : ""}
          </p>
        )}
        <p className={`text-xs mt-1 ${hasSignificantDisagreement ? "text-[var(--signal-warning-muted)]" : "text-gray-500 dark:text-gray-400"}`}>
          {prediction.sources.length} sources{hasSignificantDisagreement ? ". Significant disagreement" : ""}
          {isLowConfidence && (
            <span className="ml-1.5 inline-block text-2xs font-medium text-[var(--signal-warning-muted)] bg-[#d97706]/[0.08] rounded px-1.5 py-0.5">
              Low confidence
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
