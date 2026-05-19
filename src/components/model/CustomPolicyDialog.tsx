"use client";

import { useState } from "react";
import {
  CustomPolicy,
  makeCustomPolicyId,
  saveCustomPolicy,
} from "@/lib/custom-policies";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (policy: CustomPolicy) => void;
}

type Stage = "input" | "extracting" | "review" | "error";

interface ExtractionResponse {
  policy?: {
    name: string;
    category: string;
    tagline: string;
    description: string;
    typicalCostMillions: number;
    durationYears: number;
    targetSectors: string[] | null;
    evidence: string;
    addresses: Array<"adoption" | "friction">;
    workforceImpacts: string[];
    targetPopulations: string[];
    sectorOverrides: Record<string, Record<string, number>>;
    knobShifts: Record<string, number>;
    confidence: number;
    extractionNotes: string;
  };
  error?: string;
  rawSnippet?: string;
}

export default function CustomPolicyDialog({ open, onClose, onAdded }: Props) {
  const [stage, setStage] = useState<Stage>("input");
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [extracted, setExtracted] = useState<ExtractionResponse["policy"] | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!open) return null;

  async function handleExtract() {
    setStage("extracting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/model/extract-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          inputMode === "text" ? { text } : { url }
        ),
      });
      const data = (await res.json()) as ExtractionResponse;
      if (!res.ok || !data.policy) {
        setErrorMsg(data.error ?? "Extraction failed.");
        setStage("error");
        return;
      }
      setExtracted(data.policy);
      setStage("review");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setStage("error");
    }
  }

  function handleAccept() {
    if (!extracted) return;
    const policy: CustomPolicy = {
      id: makeCustomPolicyId(extracted.name),
      name: extracted.name,
      category: extracted.category,
      tagline: extracted.tagline,
      description: extracted.description,
      typicalCostMillions: extracted.typicalCostMillions,
      durationYears: extracted.durationYears,
      targetSectors: extracted.targetSectors,
      evidence: extracted.evidence,
      evidenceUrl: inputMode === "url" ? url : "",
      addresses: extracted.addresses,
      workforceImpacts: extracted.workforceImpacts,
      targetPopulations: extracted.targetPopulations,
      sectorOverrides: extracted.sectorOverrides as never,
      knobShifts: extracted.knobShifts as never,
      addedAt: Date.now(),
      isCustom: true,
      sourceSnippet: (inputMode === "text" ? text : url).slice(0, 500),
      extractionConfidence: extracted.confidence,
      extractionNotes: extracted.extractionNotes,
    };
    saveCustomPolicy(policy);
    onAdded(policy);
    reset();
  }

  function reset() {
    setStage("input");
    setText("");
    setUrl("");
    setExtracted(null);
    setErrorMsg("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        className="bg-[var(--background)] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Bring your own policy
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Paste a policy document or program design. Claude extracts the
              structure; the engine simulates it like a catalog entry.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] text-xl leading-none px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {stage === "input" && (
            <InputStage
              inputMode={inputMode}
              setInputMode={setInputMode}
              text={text}
              setText={setText}
              url={url}
              setUrl={setUrl}
              onExtract={handleExtract}
            />
          )}

          {stage === "extracting" && (
            <div className="text-center py-12">
              <p className="text-base text-[var(--foreground)] mb-1">
                Reading the policy…
              </p>
              <p className="text-xs text-[var(--muted)]">
                Claude is extracting structure, sectors, target populations,
                budget, and modeled effects. ~10–20 seconds.
              </p>
            </div>
          )}

          {stage === "error" && (
            <div className="text-center py-8">
              <p className="text-base text-[#a53024] mb-2 font-medium">
                Extraction failed
              </p>
              <p className="text-sm text-[var(--muted)] mb-4">{errorMsg}</p>
              <button
                type="button"
                onClick={() => setStage("input")}
                className="text-sm text-[var(--accent-text)] hover:underline"
              >
                ← Try again
              </button>
            </div>
          )}

          {stage === "review" && extracted && (
            <ReviewStage extracted={extracted} />
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t border-divider flex items-center justify-between gap-3 bg-card">
          <p className="text-xs text-[var(--muted)] italic">
            Custom policies are stored only in your browser. Clear browser data to remove.
          </p>
          <div className="flex gap-2">
            {stage === "review" && (
              <>
                <button
                  type="button"
                  onClick={() => setStage("input")}
                  className="text-xs px-3 py-2 rounded border border-card text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="text-sm px-4 py-2 rounded bg-[var(--accent-text)] text-white font-medium hover:opacity-90"
                >
                  Add to catalog
                </button>
              </>
            )}
            {stage === "input" && (
              <button
                type="button"
                onClick={handleExtract}
                disabled={(inputMode === "text" ? text.length < 60 : url.length < 8)}
                className="text-sm px-4 py-2 rounded bg-[var(--accent-text)] text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Extract structure →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputStage({
  inputMode,
  setInputMode,
  text,
  setText,
  url,
  setUrl,
  onExtract,
}: {
  inputMode: "text" | "url";
  setInputMode: (m: "text" | "url") => void;
  text: string;
  setText: (t: string) => void;
  url: string;
  setUrl: (u: string) => void;
  onExtract: () => void;
}) {
  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        <button
          type="button"
          onClick={() => setInputMode("text")}
          className={`px-3 py-1.5 text-sm rounded ${
            inputMode === "text"
              ? "bg-[var(--accent-text)] text-white"
              : "bg-card text-[var(--muted)]"
          }`}
        >
          Paste text
        </button>
        <button
          type="button"
          onClick={() => setInputMode("url")}
          className={`px-3 py-1.5 text-sm rounded ${
            inputMode === "url"
              ? "bg-[var(--accent-text)] text-white"
              : "bg-card text-[var(--muted)]"
          }`}
        >
          Fetch URL
        </button>
      </div>

      {inputMode === "text" ? (
        <>
          <label className="block">
            <span className="text-xs text-[var(--muted)] uppercase tracking-wider">
              Policy document or program design
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the policy document here — RFP, program design, state plan, foundation strategy, etc. 60+ chars minimum. Up to ~12,000 chars will be sent for extraction."
              className="w-full mt-1 bg-card border border-card rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] font-mono leading-[1.5] min-h-[280px] focus:outline-none focus:border-[var(--foreground)]"
            />
          </label>
          <p className="text-xs text-[var(--muted)] mt-2 tabular-nums">
            {text.length.toLocaleString()} chars
            {text.length > 12000 && (
              <span className="text-[#a36e1e] ml-2">
                · only the first 12K will be analyzed
              </span>
            )}
          </p>
        </>
      ) : (
        <label className="block">
          <span className="text-xs text-[var(--muted)] uppercase tracking-wider">
            Public URL to a policy document
          </span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://wioaplans.dol.gov/node/..."
            className="w-full mt-1 bg-card border border-card rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)]"
          />
          <p className="text-xs text-[var(--muted)] mt-2">
            We&apos;ll fetch the page server-side and strip HTML. Works best on
            plain documents; results may be poor on JS-heavy SPAs. PDFs are
            not yet supported — paste the text directly for those.
          </p>
        </label>
      )}

      <details className="mt-5 text-xs text-[var(--muted)]">
        <summary className="cursor-pointer hover:text-[var(--foreground)]">
          What gets extracted?
        </summary>
        <ul className="mt-2 ml-4 list-disc space-y-1 leading-[1.6]">
          <li>Policy name, category, and tagline</li>
          <li>Total budget (inferred if not stated) and duration</li>
          <li>Target NAICS sectors and target populations</li>
          <li>Workforce impacts (3–6 concrete outcomes)</li>
          <li>Which framework dimensions the policy moves (adoption / friction)</li>
          <li>
            Sector-parameter overrides + global knob shifts that the engine
            will use to simulate the policy&apos;s effect
          </li>
          <li>
            A confidence score + notes on what was inferred vs. extracted
            directly
          </li>
        </ul>
      </details>
    </div>
  );
}

function ReviewStage({
  extracted,
}: {
  extracted: NonNullable<ExtractionResponse["policy"]>;
}) {
  const confColor =
    extracted.confidence >= 0.7
      ? "#3a8a4f"
      : extracted.confidence >= 0.4
      ? "#a36e1e"
      : "#d4493a";
  const confLabel =
    extracted.confidence >= 0.7
      ? "High"
      : extracted.confidence >= 0.4
      ? "Medium"
      : "Low";

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg p-3 border-l-4"
        style={{ borderColor: confColor, background: `${confColor}10` }}
      >
        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: confColor }}>
          {confLabel} extraction confidence ({(extracted.confidence * 100).toFixed(0)}%)
        </p>
        <p className="text-xs text-[var(--muted)] mt-1 leading-[1.6]">
          {extracted.extractionNotes}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          Name
        </p>
        <p className="text-base font-semibold text-[var(--foreground)]">
          {extracted.name}
        </p>
        <p className="text-sm text-[var(--muted)] mt-0.5">{extracted.tagline}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Field label="Category" value={extracted.category} />
        <Field label="Budget" value={`$${extracted.typicalCostMillions}M`} />
        <Field label="Duration" value={`${extracted.durationYears}yr`} />
        <Field
          label="Sectors"
          value={
            extracted.targetSectors
              ? extracted.targetSectors.join(", ")
              : "Cross-sector"
          }
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Description
        </p>
        <p className="text-sm text-[var(--muted)] leading-[1.6]">
          {extracted.description}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Target populations
        </p>
        <div className="flex flex-wrap gap-1.5">
          {extracted.targetPopulations.map((p) => (
            <span key={p} className="text-xs px-2 py-1 rounded bg-card text-[var(--foreground)]">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Workforce impacts
        </p>
        <ul className="text-sm text-[var(--muted)] leading-[1.6] list-disc ml-5 space-y-1">
          {extracted.workforceImpacts.map((imp, i) => (
            <li key={i}>{imp}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Evidence
        </p>
        <p className="text-sm text-[var(--muted)] leading-[1.6] italic">
          {extracted.evidence}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Sector overrides
          </p>
          {Object.keys(extracted.sectorOverrides).length === 0 ? (
            <p className="text-xs text-[var(--muted)] italic">None</p>
          ) : (
            <ul className="text-[11px] text-[var(--muted)] font-mono leading-[1.5]">
              {Object.entries(extracted.sectorOverrides).map(([naics, params]) => (
                <li key={naics}>
                  <strong className="text-[var(--foreground)]">NAICS {naics}:</strong>{" "}
                  {Object.entries(params)
                    .map(([k, v]) => `${k}=${v}`)
                    .join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Knob shifts
          </p>
          {Object.keys(extracted.knobShifts).length === 0 ? (
            <p className="text-xs text-[var(--muted)] italic">None</p>
          ) : (
            <ul className="text-[11px] text-[var(--muted)] font-mono leading-[1.5]">
              {Object.entries(extracted.knobShifts).map(([k, v]) => (
                <li key={k}>
                  <strong className="text-[var(--foreground)]">{k}</strong> = {v}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-lg p-3 bg-card border border-divider">
        <p className="text-xs text-[var(--muted)] leading-[1.6]">
          <strong className="text-[var(--foreground)]">Note:</strong> click{" "}
          <em>Add to catalog</em> to use this policy in the diagnostic or
          portfolio tools. It&apos;s saved to your browser only — share by
          re-pasting the source text, not by sharing the URL.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="text-sm text-[var(--foreground)] font-medium">{value}</p>
    </div>
  );
}
