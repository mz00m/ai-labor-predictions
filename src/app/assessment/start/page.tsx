"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FileUploader, { FileEntry } from "@/components/assessment/FileUploader";
import {
  IndustryCategory,
  CompanySize,
  AiMaturityLevel,
  INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
  AI_MATURITY_LABELS,
} from "@/lib/assessment/types";
import { INDUSTRY_TEMPLATES } from "@/lib/assessment/taxonomy";

type Step = "basics" | "scope" | "details" | "upload" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "basics", label: "Organization" },
  { key: "scope", label: "Scope" },
  { key: "details", label: "Details" },
  { key: "upload", label: "Documents" },
  { key: "review", label: "Review" },
];

interface FormData {
  email: string;
  organizationName: string;
  industry: IndustryCategory | "";
  industryDetail: string;
  companySize: CompanySize | "";
  assessmentScope: "full-organization" | "department" | "team";
  departmentName: string;
  teamDescription: string;
  primaryFunctions: string[];
  keyRoles: string[];
  currentTools: string;
  currentAiUsage: AiMaturityLevel;
  biggestChallenges: string[];
  goals: string[];
  websiteUrl: string;
  additionalContext: string;
}

const initialFormData: FormData = {
  email: "",
  organizationName: "",
  industry: "",
  industryDetail: "",
  companySize: "",
  assessmentScope: "full-organization",
  departmentName: "",
  teamDescription: "",
  primaryFunctions: [],
  keyRoles: [],
  currentTools: "",
  currentAiUsage: "none",
  biggestChallenges: [],
  goals: [],
  websiteUrl: "",
  additionalContext: "",
};

export default function AssessmentStartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basics");
  const [form, setForm] = useState<FormData>(initialFormData);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayItem = useCallback((key: "primaryFunctions" | "keyRoles" | "biggestChallenges" | "goals", item: string) => {
    setForm((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      };
    });
  }, []);

  const canAdvance = (): boolean => {
    switch (step) {
      case "basics":
        return !!form.email && !!form.organizationName && !!form.industry && !!form.companySize;
      case "scope":
        return true;
      case "details":
        return form.primaryFunctions.length > 0;
      case "upload":
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (mode: "preview" | "full") => {
    setSubmitting(true);
    setError(null);

    try {
      // Build form data with files for in-memory processing
      const formPayload = new FormData();
      formPayload.append("intake", JSON.stringify({
        organizationName: form.organizationName,
        industry: form.industry,
        industryDetail: form.industryDetail,
        companySize: form.companySize,
        assessmentScope: form.assessmentScope,
        departmentName: form.departmentName,
        teamDescription: form.teamDescription,
        primaryFunctions: form.primaryFunctions,
        keyRoles: form.keyRoles,
        currentTools: form.currentTools.split(",").map((t) => t.trim()).filter(Boolean),
        currentAiUsage: form.currentAiUsage,
        biggestChallenges: form.biggestChallenges,
        goals: form.goals,
        websiteUrl: form.websiteUrl,
        additionalContext: form.additionalContext,
        uploadedFiles: files.map((f) => f.meta),
      }));
      formPayload.append("email", form.email);
      formPayload.append("mode", mode);

      // Attach files for in-memory processing
      for (const entry of files) {
        formPayload.append("files", entry.file);
      }

      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit assessment");
      }

      const data = await res.json();

      if (mode === "preview") {
        // Show preview, then prompt for payment
        router.push(`/assessment/report?id=${data.assessmentId}&preview=true`);
      } else {
        // Redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          router.push(`/assessment/report?id=${data.assessmentId}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Get industry-specific suggestions
  const industryTemplate = form.industry ? INDUSTRY_TEMPLATES[form.industry] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <button
                onClick={() => i <= currentStepIndex && setStep(s.key)}
                disabled={i > currentStepIndex}
                className={`text-[12px] font-medium px-2.5 py-1 rounded transition-colors ${
                  s.key === step
                    ? "bg-[#5C61F6] text-white"
                    : i < currentStepIndex
                      ? "bg-white/[0.06] text-[#8B95A5] hover:text-white cursor-pointer"
                      : "text-[#3A4250] cursor-default"
                }`}
              >
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <svg className="w-3 h-3 text-[#2A3040]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step: Basics */}
      {step === "basics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-white mb-2">Tell us about your organization</h2>
            <p className="text-[14px] text-[#8B95A5]">
              This helps us tailor recommendations to your specific context and industry.
            </p>
          </div>

          <Field label="Your email" required>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@company.com"
              className="input-field"
            />
          </Field>

          <Field label="Organization name" required>
            <input
              type="text"
              value={form.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
              placeholder="Acme Corp"
              className="input-field"
            />
          </Field>

          <Field label="Industry" required>
            <select
              value={form.industry}
              onChange={(e) => updateField("industry", e.target.value as IndustryCategory)}
              className="input-field"
            >
              <option value="">Select your industry</option>
              {(Object.entries(INDUSTRY_LABELS) as [IndustryCategory, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>

          {form.industry === "other" && (
            <Field label="Describe your industry">
              <input
                type="text"
                value={form.industryDetail}
                onChange={(e) => updateField("industryDetail", e.target.value)}
                placeholder="e.g., Veterinary services"
                className="input-field"
              />
            </Field>
          )}

          <Field label="Company size" required>
            <select
              value={form.companySize}
              onChange={(e) => updateField("companySize", e.target.value as CompanySize)}
              className="input-field"
            >
              <option value="">Select size</option>
              {(Object.entries(COMPANY_SIZE_LABELS) as [CompanySize, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {/* Step: Scope */}
      {step === "scope" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-white mb-2">Assessment scope</h2>
            <p className="text-[14px] text-[#8B95A5]">
              Are we looking at the whole organization, a specific department, or a team?
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {([
              { value: "full-organization", label: "Full Organization", desc: "All departments and functions" },
              { value: "department", label: "Single Department", desc: "One department or division" },
              { value: "team", label: "Specific Team", desc: "A focused team or function" },
            ] as const).map((option) => (
              <button
                key={option.value}
                onClick={() => updateField("assessmentScope", option.value)}
                className={`text-left p-4 rounded-xl border-2 transition-colors ${
                  form.assessmentScope === option.value
                    ? "border-[#5C61F6] bg-[#5C61F6]/[0.04]"
                    : "border-white/[0.06] hover:border-white/[0.12] bg-[#111827]/40"
                }`}
              >
                <div className="text-[14px] font-semibold text-white mb-1">{option.label}</div>
                <div className="text-[12px] text-[#5A6478]">{option.desc}</div>
              </button>
            ))}
          </div>

          {form.assessmentScope === "department" && (
            <Field label="Department name">
              <input
                type="text"
                value={form.departmentName}
                onChange={(e) => updateField("departmentName", e.target.value)}
                placeholder="e.g., Marketing, Operations, Finance"
                className="input-field"
              />
            </Field>
          )}

          {form.assessmentScope === "team" && (
            <Field label="Describe the team">
              <textarea
                value={form.teamDescription}
                onChange={(e) => updateField("teamDescription", e.target.value)}
                placeholder="e.g., Customer support team handling inbound inquiries via email and phone"
                className="input-field min-h-[80px] resize-y"
              />
            </Field>
          )}

          <Field label="Current AI usage">
            <select
              value={form.currentAiUsage}
              onChange={(e) => updateField("currentAiUsage", e.target.value as AiMaturityLevel)}
              className="input-field"
            >
              {(Object.entries(AI_MATURITY_LABELS) as [AiMaturityLevel, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {/* Step: Details */}
      {step === "details" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-white mb-2">Functions and priorities</h2>
            <p className="text-[14px] text-[#8B95A5]">
              {industryTemplate
                ? `Based on your industry, here are common functions. Select all that apply.`
                : `Select the key functions your organization performs.`}
            </p>
          </div>

          {industryTemplate && (
            <div>
              <label className="block text-[13px] font-medium text-[#C5CDD8] mb-3">Key functions</label>
              <div className="flex flex-wrap gap-2">
                {industryTemplate.departments.flatMap((d) => d.keyFunctions).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => toggleArrayItem("primaryFunctions", fn)}
                    className={`text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
                      form.primaryFunctions.includes(fn)
                        ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                        : "border-white/[0.08] text-[#8B95A5] hover:border-white/[0.15]"
                    }`}
                  >
                    {fn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {industryTemplate && (
            <div>
              <label className="block text-[13px] font-medium text-[#C5CDD8] mb-3">Key roles in scope</label>
              <div className="flex flex-wrap gap-2">
                {industryTemplate.departments.flatMap((d) => d.typicalRoles).map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleArrayItem("keyRoles", role)}
                    className={`text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
                      form.keyRoles.includes(role)
                        ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                        : "border-white/[0.08] text-[#8B95A5] hover:border-white/[0.15]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-[#C5CDD8] mb-3">Biggest challenges</label>
            <div className="flex flex-wrap gap-2">
              {[
                ...(industryTemplate?.commonChallenges || []),
                "Staff capacity / burnout",
                "Process inefficiency",
                "Communication bottlenecks",
                "Data management",
                "Customer / client responsiveness",
                "Scaling without adding headcount",
              ].filter((v, i, a) => a.indexOf(v) === i).map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => toggleArrayItem("biggestChallenges", challenge)}
                  className={`text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
                    form.biggestChallenges.includes(challenge)
                      ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                      : "border-white/[0.08] text-[#8B95A5] hover:border-white/[0.15]"
                    }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#C5CDD8] mb-3">Primary goals for AI adoption</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Reduce repetitive tasks",
                "Improve customer/client service",
                "Speed up document creation",
                "Better data analysis and reporting",
                "Reduce costs",
                "Improve quality / accuracy",
                "Scale operations",
                "Competitive advantage",
                "Staff development / upskilling",
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem("goals", goal)}
                  className={`text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
                    form.goals.includes(goal)
                      ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                      : "border-white/[0.08] text-[#8B95A5] hover:border-white/[0.15]"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <Field label="Current tools (comma-separated)">
            <input
              type="text"
              value={form.currentTools}
              onChange={(e) => updateField("currentTools", e.target.value)}
              placeholder="e.g., QuickBooks, Slack, Google Workspace, Salesforce"
              className="input-field"
            />
          </Field>
        </div>
      )}

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-white mb-2">Upload documents (optional)</h2>
            <p className="text-[14px] text-[#8B95A5]">
              The more context you provide, the more specific our recommendations.
              All files are processed in-memory and never stored.
            </p>
          </div>

          {industryTemplate && (
            <div className="bg-[#111827]/40 border border-white/[0.04] rounded-lg p-4">
              <p className="text-[12px] font-semibold text-[#5C61F6] uppercase tracking-wider mb-2">
                Suggested uploads for your industry
              </p>
              <ul className="space-y-1">
                {industryTemplate.suggestedUploads.map((item) => (
                  <li key={item} className="text-[13px] text-[#8B95A5] flex gap-2">
                    <span className="text-[#5A6478]">-</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FileUploader files={files} onFilesChange={setFiles} />

          <Field label="Website URL (optional)">
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => updateField("websiteUrl", e.target.value)}
              placeholder="https://yourcompany.com"
              className="input-field"
            />
            <p className="text-[11px] text-[#5A6478] mt-1">
              We can review your website to understand your services, team structure, and public-facing operations.
            </p>
          </Field>

          <Field label="Additional context (optional)">
            <textarea
              value={form.additionalContext}
              onChange={(e) => updateField("additionalContext", e.target.value)}
              placeholder="Anything else that would help us understand your organization — upcoming changes, specific pain points, budget constraints, etc."
              className="input-field min-h-[100px] resize-y"
              maxLength={2000}
            />
          </Field>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-white mb-2">Review and submit</h2>
            <p className="text-[14px] text-[#8B95A5]">
              Review your information below, then choose to get a free preview or unlock the full report.
            </p>
          </div>

          <div className="bg-[#111827]/60 border border-white/[0.06] rounded-xl p-6 space-y-4">
            <ReviewRow label="Organization" value={form.organizationName} />
            <ReviewRow label="Industry" value={form.industry ? INDUSTRY_LABELS[form.industry] : "-"} />
            <ReviewRow label="Size" value={form.companySize ? COMPANY_SIZE_LABELS[form.companySize] : "-"} />
            <ReviewRow label="Scope" value={form.assessmentScope.replace("-", " ")} />
            {form.departmentName && <ReviewRow label="Department" value={form.departmentName} />}
            <ReviewRow label="AI maturity" value={AI_MATURITY_LABELS[form.currentAiUsage]} />
            <ReviewRow label="Functions" value={form.primaryFunctions.join(", ") || "None selected"} />
            <ReviewRow label="Challenges" value={form.biggestChallenges.join(", ") || "None selected"} />
            <ReviewRow label="Goals" value={form.goals.join(", ") || "None selected"} />
            <ReviewRow label="Documents" value={files.length > 0 ? `${files.length} file(s)` : "None"} />
            {form.websiteUrl && <ReviewRow label="Website" value={form.websiteUrl} />}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-[13px] text-red-400">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleSubmit("preview")}
              disabled={submitting}
              className="w-full border border-white/[0.1] text-[#8B95A5] hover:text-white hover:border-white/[0.2] font-medium text-[14px] py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Get Free Preview"}
            </button>
            <button
              onClick={() => handleSubmit("full")}
              disabled={submitting}
              className="w-full bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-[14px] py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Unlock Full Report — $100"}
            </button>
          </div>

          <p className="text-[12px] text-[#5A6478] text-center">
            Payment processed securely via Stripe. Your data is processed in-memory only.
          </p>
        </div>
      )}

      {/* Navigation */}
      {step !== "review" && (
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(STEPS[currentStepIndex - 1]?.key || "basics")}
            disabled={currentStepIndex === 0}
            className="text-[13px] text-[#5A6478] hover:text-white disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setStep(STEPS[currentStepIndex + 1]?.key || "review")}
            disabled={!canAdvance()}
            className="text-[13px] font-medium bg-[#5C61F6] hover:bg-[#4F52D4] disabled:opacity-30 disabled:cursor-default text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Inline styles for form fields */}
      <style jsx global>{`
        .assessment-wrapper .input-field {
          width: 100%;
          background: rgba(17, 24, 39, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 14px;
          color: #E2E8F0;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .assessment-wrapper .input-field:focus {
          border-color: #5C61F6;
        }
        .assessment-wrapper .input-field::placeholder {
          color: #3A4250;
        }
        .assessment-wrapper select.input-field {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235A6478' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#C5CDD8] mb-2">
        {label}
        {required && <span className="text-[#5C61F6] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-[13px] text-[#5A6478] w-28 flex-shrink-0">{label}</span>
      <span className="text-[13px] text-[#C5CDD8]">{value}</span>
    </div>
  );
}
