"use client";

import { useState, useEffect, useCallback } from "react";
import { FORECAST_PREDICTIONS, CATEGORY_COLORS } from "@/data/forecast";

interface UserPrediction {
  displayName: string;
  values: Record<string, number>;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

const STORAGE_KEY = "jobsdata-user-prediction";

function getStoredPrediction(): UserPrediction | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function defaultValues(): Record<string, number> {
  const vals: Record<string, number> = {};
  for (const p of FORECAST_PREDICTIONS) {
    vals[p.id] = p.prediction;
  }
  return vals;
}

export default function PlaceYourPrediction() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [values, setValues] = useState<Record<string, number>>(defaultValues);
  const [confidence, setConfidence] = useState(5);
  const [reasoning, setReasoning] = useState("");
  const [saved, setSaved] = useState<UserPrediction | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = getStoredPrediction();
    if (stored) {
      setSaved(stored);
      setName(stored.displayName);
      setValues(stored.values);
      setConfidence(stored.confidence);
      setReasoning(stored.reasoning);
    }
    setHydrated(true);
  }, []);

  const handleSave = useCallback(() => {
    const entry: UserPrediction = {
      displayName: name || "Anonymous",
      values,
      confidence,
      reasoning,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    setSaved(entry);
  }, [name, values, confidence, reasoning]);

  const handleReset = useCallback(() => {
    setValues(defaultValues());
    setConfidence(5);
    setReasoning("");
    setName("");
    localStorage.removeItem(STORAGE_KEY);
    setSaved(null);
  }, []);

  const updateValue = useCallback((id: string, val: number) => {
    setValues((prev: Record<string, number>) => ({ ...prev, [id]: val }));
  }, []);

  return (
    <section className="mb-12">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between border border-card rounded-xl px-6 py-5 hover:shadow-sm transition-shadow bg-gradient-to-r from-[#5C61F6]/[0.03] to-transparent">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
              Interactive
            </p>
            <h2 className="text-3xl sm:text-heading-lg font-extrabold tracking-tight text-[#2E3650]">
              Place Your Prediction
            </h2>
            <p className="text-base text-[var(--muted)] mt-1">
              Set your own values for each metric. How do you see 2030?
            </p>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`text-[var(--muted)] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {open && hydrated && (
        <div className="border border-t-0 border-card rounded-b-xl px-6 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2E3650] mb-1">
              Your name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Anonymous"
              className="w-full max-w-xs border border-black/[0.1] rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            />
          </div>

          <div className="space-y-4">
            {FORECAST_PREDICTIONS.map((p) => {
              const catColor = CATEGORY_COLORS[p.category] ?? "#5C61F6";
              const userVal = values[p.id] ?? p.prediction;
              const diff = userVal - p.prediction;
              const diffStr =
                diff === 0
                  ? "same"
                  : `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`;

              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-44 sm:w-56 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-sm shrink-0"
                        style={{ backgroundColor: catColor }}
                      />
                      <span className="text-sm font-medium text-[#2E3650] truncate">
                        {p.shortTitle}
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={p.sliderMin}
                    max={p.sliderMax}
                    step={p.sliderStep}
                    value={userVal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateValue(p.id, parseFloat(e.target.value))
                    }
                    className="flex-1 accent-[#5C61F6] h-1.5"
                  />
                  <div className="w-20 text-right shrink-0">
                    <span className="text-md font-bold text-[#2E3650]">
                      {userVal}
                      {p.unit}
                    </span>
                    <span
                      className={`block text-2xs ${
                        diff === 0
                          ? "text-[var(--muted)]"
                          : diff > 0
                            ? "text-[#F66B5C]"
                            : "text-emerald-600"
                      }`}
                    >
                      {diffStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3650] mb-1">
              Confidence (1 = guess, 10 = would bet the house)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={confidence}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfidence(parseInt(e.target.value))}
                className="flex-1 accent-[#5C61F6] h-1.5"
              />
              <span className="text-2xl font-black text-[#2E3650] w-8 text-right">
                {confidence}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3650] mb-1">
              Reasoning (optional)
            </label>
            <textarea
              value={reasoning}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReasoning(e.target.value)}
              rows={3}
              placeholder="What informs your prediction?"
              className="w-full border border-black/[0.1] rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-[var(--accent)] text-white text-base font-medium rounded-lg px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              Save My Prediction
            </button>
            <button
              onClick={handleReset}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Reset
            </button>
            {saved && (
              <span className="text-xs text-emerald-600 font-medium">
                Saved {new Date(saved.timestamp).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
