"use client";

import { useCallback } from "react";
import {
  INDUSTRY_ADOPTION_SPEED,
  ADOPTION_SPEED_PRESETS,
  getSpeedLabel,
} from "@/data/industry-adoption-speed";

interface IndustrySpeedSliderProps {
  /** Job category name (e.g., "Healthcare", "Technology") */
  category: string;
  /** Current multiplier value */
  value: number;
  /** Callback when user adjusts the slider */
  onChange: (value: number) => void;
}

export default function IndustrySpeedSlider({
  category,
  value,
  onChange,
}: IndustrySpeedSliderProps) {
  const industryData = INDUSTRY_ADOPTION_SPEED[category];
  const defaultValue = industryData?.multiplier ?? 1.0;
  const isCustom = Math.abs(value - defaultValue) > 0.01;
  const currentLabel = getSpeedLabel(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  const handleReset = useCallback(() => {
    onChange(defaultValue);
  }, [onChange, defaultValue]);

  // Map value to percentage for gradient (0.5 → 0%, 2.0 → 100%)
  const pct = ((value - 0.5) / 1.5) * 100;

  // Color based on speed: fast = green, baseline = indigo, slow = amber
  const color =
    value <= 0.8
      ? "#10B981"
      : value <= 1.05
        ? "#6366F1"
        : value <= 1.3
          ? "#F59E0B"
          : "#EF4444";

  return (
    <div className="mt-5 pt-5 border-t border-card">
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="text-base font-semibold text-[var(--foreground)]">
          Industry adoption speed
        </h4>
        {isCustom && (
          <button
            onClick={handleReset}
            className="text-2xs text-[var(--muted)] hover:text-[var(--foreground)] underline"
          >
            Reset to {category} default
          </button>
        )}
      </div>

      {/* Current value display */}
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="text-base font-bold"
          style={{ color }}
        >
          {currentLabel}
        </span>
        <span className="text-xs text-[var(--muted)] tabular-nums">
          {value.toFixed(2)}x
        </span>
        {!isCustom && industryData && (
          <span className="text-2xs text-[var(--muted)] opacity-60">
            ({category} default)
          </span>
        )}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0.5}
        max={2.0}
        step={0.05}
        value={value}
        onChange={handleChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(0,0,0,0.06) ${pct}%, rgba(0,0,0,0.06) 100%)`,
        }}
      />

      {/* Tick marks */}
      <div className="flex justify-between mt-1 px-0.5">
        {ADOPTION_SPEED_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`speed-preset text-3xs transition-colors ${
              Math.abs(value - preset.value) < 0.03
                ? "text-[var(--foreground)] font-medium"
                : "text-[var(--muted)] opacity-50 hover:opacity-100"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Methodology note */}
      <p className="text-2xs text-[var(--muted)] mt-2 leading-relaxed">
        How quickly {category.toLowerCase()} firms typically adopt new technology.
        {industryData && (
          <> {industryData.rationale}.</>
        )}
        {" "}This scales the institutional adoption lag on all tasks.
      </p>
    </div>
  );
}
