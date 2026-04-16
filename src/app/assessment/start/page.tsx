"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FileUploader, { FileEntry } from "@/components/assessment/FileUploader";
import {
  IndustryCategory,
  CompanySize,
  AiMaturityLevel,
  ToolPreference,
  INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
  AI_MATURITY_LABELS,
  TOOL_PREFERENCE_LABELS,
} from "@/lib/assessment/types";
import { INDUSTRY_TEMPLATES } from "@/lib/assessment/taxonomy";

type Step = "you" | "scope" | "tasks" | "upload" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "you", label: "Your Organization" },
  { key: "scope", label: "Your Role" },
  { key: "tasks", label: "Tasks AI Could Touch" },
  { key: "upload", label: "Add Context" },
  { key: "review", label: "Confirm & Generate" },
];

const LOADING_MESSAGES = [
  { maxSeconds: 8, text: "Reading your uploaded documents and website..." },
  { maxSeconds: 18, text: "Mapping your tasks against our AI capability database..." },
  { maxSeconds: 30, text: "Analyzing automation potential for each task..." },
  { maxSeconds: 42, text: "Matching tools and services to your workflow..." },
  { maxSeconds: 55, text: "Building your implementation roadmap..." },
  { maxSeconds: 70, text: "Generating ROI projections and risk assessment..." },
  { maxSeconds: Infinity, text: "Finalizing your personalized action plan..." },
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
  jobTitle: string;
  primaryFunctions: string[];
  keyRoles: string[];
  currentTools: string;
  currentAiUsage: AiMaturityLevel;
  toolPreference: ToolPreference | "";
  biggestChallenges: string[];
  goals: string[];
  specificProblem: string;
  websiteUrl: string;
  additionalContext: string;
}

const initialFormData: FormData = {
  email: "",
  organizationName: "",
  industry: "",
  industryDetail: "",
  companySize: "",
  assessmentScope: "team",
  departmentName: "",
  teamDescription: "",
  jobTitle: "",
  primaryFunctions: [],
  keyRoles: [],
  currentTools: "",
  currentAiUsage: "none",
  toolPreference: "",
  biggestChallenges: [],
  goals: [],
  specificProblem: "",
  websiteUrl: "",
  additionalContext: "",
};

export default function AssessmentStartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("you");
  const [form, setForm] = useState<FormData>(initialFormData);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submitting) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [submitting]);

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

  const industryTemplate = form.industry ? INDUSTRY_TEMPLATES[form.industry] : null;

  // Score each department by relevance to the user's role description + department name + job title
  const getDeptRelevance = useCallback((deptName: string, deptRoles: string[]): number => {
    const desc = (form.teamDescription + " " + form.departmentName).toLowerCase();
    if (!desc.trim()) return 0;
    const deptLower = deptName.toLowerCase();
    const words = desc.split(/[\s,;./]+/).filter((w) => w.length > 2);
    let score = 0;
    // Department name match
    for (const part of deptLower.split(/[\s/]+/)) {
      if (part.length > 2 && desc.includes(part)) score += 3;
    }
    // Role match
    for (const role of deptRoles) {
      const roleLower = role.toLowerCase();
      for (const part of roleLower.split(/[\s/]+/)) {
        if (part.length > 2 && words.some((w) => w.includes(part) || part.includes(w))) score += 2;
      }
    }
    return score;
  }, [form.teamDescription, form.departmentName]);

  // When moving from scope to tasks, pre-select roles and functions based on description
  const prefillFromDescription = useCallback(() => {
    if (!industryTemplate) return;
    const desc = (form.teamDescription + " " + form.departmentName).toLowerCase();
    if (!desc.trim()) return;

    // Find the most relevant department(s)
    const scored = industryTemplate.departments.map((dept) => ({
      dept,
      score: getDeptRelevance(dept.name, dept.typicalRoles),
    }));
    const topScore = Math.max(...scored.map((s) => s.score));
    if (topScore === 0) return;

    const relevantDepts = scored.filter((s) => s.score > 0).map((s) => s.dept);

    const matchedFunctions = relevantDepts.flatMap((d) => d.keyFunctions);
    const matchedRoles = relevantDepts.flatMap((d) => d.typicalRoles);

    setForm((prev) => ({
      ...prev,
      primaryFunctions: prev.primaryFunctions.length > 0 ? prev.primaryFunctions : matchedFunctions,
      keyRoles: prev.keyRoles.length > 0 ? prev.keyRoles : matchedRoles,
    }));
  }, [form.teamDescription, form.departmentName, industryTemplate, getDeptRelevance]);

  const canAdvance = (): boolean => {
    switch (step) {
      case "you":
        return !!form.email && !!form.organizationName && !!form.industry && !!form.companySize;
      case "scope":
        return true;
      case "tasks":
        return form.primaryFunctions.length > 0;
      case "upload":
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const intakeData = {
        organizationName: form.organizationName,
        industry: form.industry,
        industryDetail: form.industryDetail,
        companySize: form.companySize,
        assessmentScope: form.assessmentScope,
        departmentName: form.departmentName,
        teamDescription: form.teamDescription,
        jobTitle: form.jobTitle || undefined,
        primaryFunctions: form.primaryFunctions,
        keyRoles: form.keyRoles,
        currentTools: form.currentTools.split(",").map((t) => t.trim()).filter(Boolean),
        currentAiUsage: form.currentAiUsage,
        toolPreference: form.toolPreference || undefined,
        biggestChallenges: form.biggestChallenges,
        goals: form.goals,
        specificProblem: form.specificProblem || undefined,
        websiteUrl: (() => {
          const url = form.websiteUrl.trim();
          if (!url) return "";
          if (!/^https?:\/\//i.test(url)) return `https://${url}`;
          return url;
        })(),
        additionalContext: form.additionalContext,
        uploadedFiles: files.map((f) => f.meta),
      };

      const formPayload = new FormData();
      formPayload.append("intake", JSON.stringify(intakeData));
      formPayload.append("email", form.email);
      formPayload.append("mode", "full");
      formPayload.append("step", "profile"); // Multi-step: start with step 1

      for (const entry of files) {
        formPayload.append("files", entry.file);
      }

      // Retry up to 2 times on network failures with a 120s timeout per attempt
      let lastErr: Error | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 120_000);

          const res = await fetch("/api/assessment/analyze", {
            method: "POST",
            body: formPayload,
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            // Don't retry on validation errors (4xx) — only on server/network errors
            if (res.status >= 400 && res.status < 500) {
              throw new Error(data.error || "Please check your inputs and try again.");
            }
            throw new Error(data.error || "Server error — please try again.");
          }

          const data = await res.json();
          if (!data.assessmentId) {
            throw new Error("No assessment ID returned. Please try again.");
          }
          // Redirect to progress page for multi-step review
          router.push(`/assessment/progress?id=${data.assessmentId}`);
          return; // Success — exit the function
        } catch (err) {
          lastErr = err instanceof Error ? err : new Error("An error occurred");
          // Don't retry on validation/client errors
          if (lastErr.message.includes("check your inputs")) throw lastErr;
          // Don't retry on abort (timeout) — show error immediately
          if (lastErr.name === "AbortError") {
            throw new Error("The request took too long. Please try again — it usually works on the second attempt.");
          }
          // For network errors, retry once after a brief pause
          if (attempt < 1) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }
      }
      throw lastErr || new Error("Failed to start assessment. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const loadingMessage = LOADING_MESSAGES.find((m) => elapsedSeconds < m.maxSeconds)?.text || LOADING_MESSAGES[LOADING_MESSAGES.length - 1].text;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
      {/* Privacy badge */}
      <div className="flex items-center gap-2 mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your data processed in-memory only. Nothing stored.
        </span>
      </div>

      {/* Hero headline */}
      <h1 className="text-[32px] sm:text-[40px] font-bold text-gray-900 leading-tight mb-10 tracking-tight">
        AI is already changing your industry.{" "}
        <span className="text-gray-400">Find out where it can help you.</span>
      </h1>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (i <= currentStepIndex) {
                    setStep(s.key);
                  } else if (i === currentStepIndex + 1) {
                    if (step === "scope") prefillFromDescription();
                    setStep(s.key);
                  }
                }}
                disabled={i > currentStepIndex + 1}
                className={`text-sm font-medium px-2.5 py-1 rounded transition-colors ${
                  s.key === step
                    ? "bg-[#5C61F6] text-white"
                    : i < currentStepIndex
                      ? "bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
                      : i === currentStepIndex + 1
                        ? "text-gray-400 hover:text-gray-900 cursor-pointer"
                        : "text-gray-300 cursor-default"
                }`}
              >
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step: About You */}
      {step === "you" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">Let&apos;s start with the basics</h2>
            <p className="text-md text-gray-500">
              Tell us where you work and what you do. This helps us tailor everything
              to your specific situation. The more detail you provide across these steps,
              the more specific and actionable your report will be.
            </p>
          </div>

          <Field label="Your email" required>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </Field>

          <Field label="Your company or organization" required>
            <input
              type="text"
              value={form.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
              placeholder="e.g., Smith & Associates, Downtown Bakery, Self-employed"
              className="input-field"
            />
          </Field>

          <Field label="Your industry" required>
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
                placeholder="e.g., Veterinary services, Event planning"
                className="input-field"
              />
            </Field>
          )}

          <Field label="How many people work there?" required>
            <select
              value={form.companySize}
              onChange={(e) => updateField("companySize", e.target.value as CompanySize)}
              className="input-field"
            >
              <option value="">Select size</option>
              <option value="1-10">Just me / 1-10 people</option>
              <option value="11-50">11-50 people</option>
              <option value="51-200">51-200 people</option>
              <option value="201-500">201-500 people</option>
              <option value="501-1000">501-1,000 people</option>
              <option value="1001-5000">1,001-5,000 people</option>
              <option value="5001+">5,001+ people</option>
            </select>
          </Field>
        </div>
      )}

      {/* Step: Your Role */}
      {step === "scope" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">What are we looking at?</h2>
            <p className="text-md text-gray-500">
              We can focus on just your work, your team, or the whole business.
              The more focused, the more specific the recommendations.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {([
              { value: "team", label: "My Work", desc: "Focus on my specific role and tasks" },
              { value: "department", label: "My Team", desc: "My department or team's workflows" },
              { value: "full-organization", label: "The Whole Business", desc: "All functions across the business" },
            ] as const).map((option) => (
              <button
                key={option.value}
                onClick={() => updateField("assessmentScope", option.value)}
                className={`text-left p-4 rounded-xl border-2 transition-colors ${
                  form.assessmentScope === option.value
                    ? "border-[#5C61F6] bg-[#5C61F6]/[0.04]"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <div className="text-md font-semibold text-gray-900 mb-1">{option.label}</div>
                <div className="text-sm text-gray-400">{option.desc}</div>
              </button>
            ))}
          </div>

          <Field label="Your job title or role">
            <input
              type="text"
              value={form.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              placeholder="e.g., Office Manager, Marketing Director, Founder, Paralegal"
              className="input-field"
            />
          </Field>

          {form.assessmentScope === "department" && (
            <Field label="What team or department?">
              <input
                type="text"
                value={form.departmentName}
                onChange={(e) => updateField("departmentName", e.target.value)}
                placeholder="e.g., Marketing, Operations, Front office"
                className="input-field"
              />
            </Field>
          )}

          {form.assessmentScope === "team" && (
            <Field label="Describe what you do day-to-day">
              <textarea
                value={form.teamDescription}
                onChange={(e) => updateField("teamDescription", e.target.value)}
                placeholder="e.g., I handle client intake, scheduling, invoicing, and follow-up communications. I also manage our social media and monthly newsletter."
                className="input-field min-h-[80px] resize-y"
                maxLength={3000}
              />
              <p className="text-xs text-gray-300 mt-1 text-right">{form.teamDescription.length}/3,000</p>
            </Field>
          )}

          <Field label="How much are you using AI today?">
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

      {/* Step: Your Work */}
      {step === "tasks" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">What does your work look like?</h2>
            <p className="text-md text-gray-500">
              {industryTemplate
                ? `Here are common tasks in your industry. Select everything that's part of your work — the more you select, the more thorough your analysis.`
                : `Select the tasks and functions that are part of your work — the more you select, the more thorough your analysis.`}
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">Tasks I spend time on</label>
            {industryTemplate && (() => {
              const sorted = [...industryTemplate.departments]
                .map((d) => ({ ...d, relevance: getDeptRelevance(d.name, d.typicalRoles) }))
                .sort((a, b) => b.relevance - a.relevance);
              const relevant = sorted.filter((d) => d.relevance > 0);
              const other = sorted.filter((d) => d.relevance === 0);
              const showGrouped = relevant.length > 0;
              return (
                <div className="space-y-4 mb-3">
                  {showGrouped ? (
                    <>
                      {relevant.map((dept) => (
                        <div key={dept.name}>
                          <p className="text-sm font-medium text-[#5C61F6] mb-2">{dept.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {dept.keyFunctions.map((fn) => (
                              <button
                                key={fn}
                                onClick={() => toggleArrayItem("primaryFunctions", fn)}
                                className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                                  form.primaryFunctions.includes(fn)
                                    ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                                }`}
                              >
                                {fn}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {other.length > 0 && (
                        <details className="group">
                          <summary className="text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                            Other departments ({other.length})
                          </summary>
                          <div className="mt-3 space-y-4">
                            {other.map((dept) => (
                              <div key={dept.name}>
                                <p className="text-sm font-medium text-gray-400 mb-2">{dept.name}</p>
                                <div className="flex flex-wrap gap-2">
                                  {dept.keyFunctions.map((fn) => (
                                    <button
                                      key={fn}
                                      onClick={() => toggleArrayItem("primaryFunctions", fn)}
                                      className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                                        form.primaryFunctions.includes(fn)
                                          ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                                      }`}
                                    >
                                      {fn}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {sorted.flatMap((d) => d.keyFunctions).map((fn) => (
                        <button
                          key={fn}
                          onClick={() => toggleArrayItem("primaryFunctions", fn)}
                          className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                            form.primaryFunctions.includes(fn)
                              ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {fn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            <AddCustomItem
              placeholder="Add a task not listed above"
              onAdd={(val) => {
                if (!form.primaryFunctions.includes(val)) {
                  setForm((prev) => ({ ...prev, primaryFunctions: [...prev.primaryFunctions, val] }));
                }
              }}
            />
            {form.primaryFunctions
              .filter((fn) => !industryTemplate?.departments.flatMap((d) => d.keyFunctions).includes(fn))
              .map((fn) => (
                <span key={fn} className="inline-flex items-center gap-1 text-base px-3 py-1.5 rounded-full border border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6] mr-2 mt-2">
                  {fn}
                  <button onClick={() => toggleArrayItem("primaryFunctions", fn)} className="ml-1 hover:text-red-500">&times;</button>
                </span>
              ))}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">My role (or roles I work with)</label>
            {industryTemplate && (() => {
              const sorted = [...industryTemplate.departments]
                .map((d) => ({ ...d, relevance: getDeptRelevance(d.name, d.typicalRoles) }))
                .sort((a, b) => b.relevance - a.relevance);
              const relevant = sorted.filter((d) => d.relevance > 0);
              const other = sorted.filter((d) => d.relevance === 0);
              const showGrouped = relevant.length > 0;
              return (
                <div className="space-y-4 mb-3">
                  {showGrouped ? (
                    <>
                      {relevant.map((dept) => (
                        <div key={dept.name}>
                          <p className="text-sm font-medium text-[#5C61F6] mb-2">{dept.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {dept.typicalRoles.map((role) => (
                              <button
                                key={role}
                                onClick={() => toggleArrayItem("keyRoles", role)}
                                className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                                  form.keyRoles.includes(role)
                                    ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {other.length > 0 && (
                        <details className="group">
                          <summary className="text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                            Other departments ({other.length})
                          </summary>
                          <div className="mt-3 space-y-4">
                            {other.map((dept) => (
                              <div key={dept.name}>
                                <p className="text-sm font-medium text-gray-400 mb-2">{dept.name}</p>
                                <div className="flex flex-wrap gap-2">
                                  {dept.typicalRoles.map((role) => (
                                    <button
                                      key={role}
                                      onClick={() => toggleArrayItem("keyRoles", role)}
                                      className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                                        form.keyRoles.includes(role)
                                          ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                                      }`}
                                    >
                                      {role}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {sorted.flatMap((d) => d.typicalRoles).map((role) => (
                        <button
                          key={role}
                          onClick={() => toggleArrayItem("keyRoles", role)}
                          className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                            form.keyRoles.includes(role)
                              ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            <AddCustomItem
              placeholder="Add a role not listed above"
              onAdd={(val) => {
                if (!form.keyRoles.includes(val)) {
                  setForm((prev) => ({ ...prev, keyRoles: [...prev.keyRoles, val] }));
                }
              }}
            />
            {form.keyRoles
              .filter((r) => !industryTemplate?.departments.flatMap((d) => d.typicalRoles).includes(r))
              .map((role) => (
                <span key={role} className="inline-flex items-center gap-1 text-base px-3 py-1.5 rounded-full border border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6] mr-2 mt-2">
                  {role}
                  <button onClick={() => toggleArrayItem("keyRoles", role)} className="ml-1 hover:text-red-500">&times;</button>
                </span>
              ))}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">Where I feel the most friction</label>
            <div className="flex flex-wrap gap-2">
              {[
                ...(industryTemplate?.commonChallenges || []),
                "Too many repetitive tasks",
                "Not enough hours in the day",
                "Communication takes forever",
                "Data entry and manual processes",
                "Hard to keep up with everything",
                "Writing takes too long",
                "Searching for information",
              ].filter((v, i, a) => a.indexOf(v) === i).map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => toggleArrayItem("biggestChallenges", challenge)}
                  className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                    form.biggestChallenges.includes(challenge)
                      ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">What I&apos;m hoping AI can help with</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Get repetitive tasks off my plate",
                "Write faster (emails, reports, proposals)",
                "Make better use of data I already have",
                "Respond to clients/customers faster",
                "Keep better organized",
                "Learn new skills",
                "Free up time for creative / strategic work",
                "Stop doing things that don't need a human",
                "Help my team work more efficiently",
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem("goals", goal)}
                  className={`text-base px-3 py-1.5 rounded-full border transition-colors ${
                    form.goals.includes(goal)
                      ? "border-[#5C61F6] bg-[#5C61F6]/[0.1] text-[#5C61F6]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <Field label="Is there a specific problem you want AI to help solve? (optional)">
            <textarea
              value={form.specificProblem}
              onChange={(e) => updateField("specificProblem", e.target.value)}
              placeholder="e.g., I spend 10+ hours a week writing proposals and each one is slightly different. I need a way to generate first drafts faster."
              className="input-field min-h-[80px] resize-y"
              maxLength={5000}
            />
            <p className="text-xs text-gray-300 mt-1 text-right">{form.specificProblem.length}/5,000</p>
          </Field>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">How do you want to approach AI tools?</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {(Object.entries(TOOL_PREFERENCE_LABELS) as [ToolPreference, string][]).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => updateField("toolPreference", value)}
                  className={`text-left p-3 rounded-xl border-2 transition-colors ${
                    form.toolPreference === value
                      ? "border-[#5C61F6] bg-[#5C61F6]/[0.04]"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="text-base font-medium text-gray-900">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <Field label="Tools and software I use regularly (comma-separated)">
            <input
              type="text"
              value={form.currentTools}
              onChange={(e) => updateField("currentTools", e.target.value)}
              placeholder="e.g., Google Docs, QuickBooks, Slack, Excel, Canva, GitHub Copilot"
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">
              Include AI tools you already have access to — we&apos;ll show you how to get more from them.
            </p>
          </Field>
        </div>
      )}

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">Help us understand your work better (optional)</h2>
            <p className="text-md text-gray-500">
              The more context you share, the more specific your plan will be.
              Upload anything that describes what you do, or just skip this step.
              Everything is processed in-memory and never stored.
            </p>
          </div>

          {industryTemplate && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <p className="text-sm font-semibold text-[#5C61F6] uppercase tracking-wider mb-2">
                Things that help us give better recommendations
              </p>
              <ul className="space-y-1">
                {industryTemplate.suggestedUploads.map((item) => (
                  <li key={item} className="text-base text-gray-500 flex gap-2">
                    <span className="text-gray-300">-</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FileUploader files={files} onFilesChange={setFiles} />

          <Field label="Your company website (optional)">
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => updateField("websiteUrl", e.target.value)}
              placeholder="https://yourcompany.com"
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">
              We&apos;ll review your website to understand what your business does and how you serve clients.
            </p>
          </Field>

          <Field label="Anything else we should know? (optional)">
            <textarea
              value={form.additionalContext}
              onChange={(e) => updateField("additionalContext", e.target.value)}
              placeholder="e.g., I spend most of my time on invoicing and follow-ups. I've tried ChatGPT a few times but don't know how to make it work for my specific tasks."
              className="input-field min-h-[100px] resize-y"
              maxLength={5000}
            />
            <p className="text-xs text-gray-300 mt-1 text-right">{form.additionalContext.length}/5,000</p>
          </Field>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">Ready to go</h2>
            <p className="text-md text-gray-500">
              Here&apos;s what we know. Ready to generate your plan?
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
            <ReviewRow label="You" value={form.email} />
            <ReviewRow label="Company" value={form.organizationName} />
            <ReviewRow label="Industry" value={form.industry ? INDUSTRY_LABELS[form.industry] : "-"} />
            <ReviewRow label="Size" value={form.companySize ? COMPANY_SIZE_LABELS[form.companySize] : "-"} />
            {form.jobTitle && <ReviewRow label="Role" value={form.jobTitle} />}
            <ReviewRow label="Focus" value={
              form.assessmentScope === "team" ? "My work" :
              form.assessmentScope === "department" ? `My team (${form.departmentName || "not specified"})` :
              "The whole business"
            } />
            <ReviewRow label="AI experience" value={AI_MATURITY_LABELS[form.currentAiUsage]} />
            {form.toolPreference && <ReviewRow label="Tool approach" value={TOOL_PREFERENCE_LABELS[form.toolPreference]} />}
            <ReviewRow label="Tasks" value={form.primaryFunctions.join(", ") || "None selected"} />
            <ReviewRow label="Friction" value={form.biggestChallenges.join(", ") || "None selected"} />
            <ReviewRow label="Goals" value={form.goals.join(", ") || "None selected"} />
            {form.specificProblem && <ReviewRow label="Problem to solve" value={form.specificProblem} />}
            <ReviewRow label="Documents" value={files.length > 0 ? `${files.length} file(s)` : "None"} />
            {form.websiteUrl && <ReviewRow label="Website" value={form.websiteUrl} />}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-base text-red-600">
              {error}
            </div>
          )}

          {submitting ? (
            <div className="border border-[#5C61F6]/20 bg-[#5C61F6]/5 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-[#5C61F6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <div>
                  <p className="text-md font-medium text-gray-900">
                    Building your AI action plan...
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5 transition-opacity duration-500">
                    {loadingMessage}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#5C61F6] h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(95, (elapsedSeconds / 70) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")} elapsed</span>
                <span>Typically 45-90 seconds</span>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="w-full bg-[#5C61F6] hover:bg-[#4F52D4] text-white font-semibold text-md py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Generate Your Free AI Action Plan
              </button>

              <p className="text-sm text-gray-400 text-center">
                Your files are processed in-memory only, nothing stored.
              </p>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      {step !== "review" && (
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(STEPS[currentStepIndex - 1]?.key || "you")}
            disabled={currentStepIndex === 0}
            className="text-base text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              const nextStep = STEPS[currentStepIndex + 1]?.key || "review";
              if (step === "scope" && nextStep === "tasks") prefillFromDescription();
              setStep(nextStep);
            }}
            disabled={!canAdvance()}
            className="text-base font-medium bg-[#5C61F6] hover:bg-[#4F52D4] disabled:opacity-30 disabled:cursor-default text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Inline styles for form fields */}
      <style jsx global>{`
        .assessment-wrapper .input-field {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .assessment-wrapper .input-field:focus {
          border-color: #5C61F6;
        }
        .assessment-wrapper .input-field::placeholder {
          color: #9ca3af;
        }
        .assessment-wrapper select.input-field {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
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
      <label className="block text-base font-medium text-gray-700 mb-2">
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
      <span className="text-base text-gray-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-base text-gray-700">{value}</span>
    </div>
  );
}

function AddCustomItem({ placeholder, onAdd }: { placeholder: string; onAdd: (value: string) => void }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
        placeholder={placeholder}
        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#5C61F6]"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!value.trim()}
        className="text-base font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#5C61F6] hover:text-[#5C61F6] transition-colors disabled:opacity-30 disabled:cursor-default"
      >
        Add
      </button>
    </div>
  );
}
