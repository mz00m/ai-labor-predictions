// Assessment feature types

export interface AssessmentUser {
  id: string;
  email: string;
  createdAt: string;
  stripeCustomerId?: string;
}

// Multi-step pipeline types

export type AssessmentStep = "profile" | "tasks" | "tools" | "risks";

export const ASSESSMENT_STEPS: AssessmentStep[] = ["profile", "tasks", "tools", "risks"];

export const STEP_LABELS: Record<AssessmentStep, string> = {
  profile: "Organization Profile & Quick Wins",
  tasks: "Task-by-Task Analysis",
  tools: "Tool Recommendations & Roadmap",
  risks: "Risk Assessment & Policy",
};

export const STEP_DESCRIPTIONS: Record<AssessmentStep, string> = {
  profile: "We'll analyze your organization, industry context, and identify immediate AI opportunities.",
  tasks: "Deep dive into your specific tasks and roles to find the highest-impact AI applications.",
  tools: "Concrete tool recommendations, implementation roadmap, and ROI projections.",
  risks: "Risk assessment, change management guidance, AI policy, and prompt library.",
};

/** Feedback the user provides between steps */
export interface StepFeedback {
  step: AssessmentStep;
  /** Free-text guidance for the next step */
  comments?: string;
  /** Specific items to prioritize or deprioritize */
  adjustments?: {
    prioritize?: string[];
    deprioritize?: string[];
  };
  /** Timestamp */
  submittedAt: string;
}

/** Context extracted from uploaded files and website, carried across steps */
export interface StepContext {
  /** Key findings from uploaded documents */
  documentInsights: string[];
  /** Website content summary */
  websiteSummary?: string;
  /** Extracted role/task information from documents */
  extractedRoles?: string[];
  /** Extracted process/workflow information */
  extractedProcesses?: string[];
  /** Any other contextual data from step 1 */
  additionalContext?: string;
}

export interface Assessment {
  id: string;
  userId: string;
  status: "intake" | "analyzing" | "complete" | "error";
  createdAt: string;
  completedAt?: string;
  // Intake data (structured questionnaire)
  intake: AssessmentIntake;
  // Analysis output (sanitized — no PII)
  report?: AssessmentReport;
  // Multi-step pipeline state
  currentStep?: AssessmentStep;
  stepContext?: StepContext;
  stepFeedback?: StepFeedback[];
  // Add-ons purchased
  addOns: {
    policyAndPrompts: boolean;
  };
  // Payment
  stripePaymentId?: string;
  paid: boolean;
  // Free preview (limited report shown before payment)
  previewGenerated: boolean;
}

export type ToolPreference =
  | "use-existing"
  | "find-new"
  | "build-own"
  | "no-preference";

export interface AssessmentIntake {
  // Organization basics
  organizationName: string;
  industry: IndustryCategory;
  industryDetail?: string;
  companySize: CompanySize;
  annualRevenue?: RevenueRange;
  // Scope
  assessmentScope: "full-organization" | "department" | "team";
  departmentName?: string;
  teamDescription?: string;
  // The person's specific role / job title
  jobTitle?: string;
  // Key functions and roles
  primaryFunctions: string[];
  keyRoles: string[];
  // Current tech landscape
  currentTools: string[];
  currentAiUsage: AiMaturityLevel;
  // Tool approach preference
  toolPreference?: ToolPreference;
  // Pain points and goals
  biggestChallenges: string[];
  goals: string[];
  // Optional: a specific problem they want AI to solve
  specificProblem?: string;
  // Uploaded content (metadata only — files processed in-memory)
  uploadedFiles: UploadedFileMeta[];
  websiteUrl?: string;
  additionalContext?: string;
}

export interface UploadedFileMeta {
  name: string;
  type: string;
  size: number;
  category: FileCategory;
  uploadedAt: string;
  // Content is NOT stored — only processed in-memory
}

export type FileCategory =
  | "job-description"
  | "employee-handbook"
  | "org-chart"
  | "process-document"
  | "orientation-guide"
  | "marketing-material"
  | "financial-report"
  | "other";

export type IndustryCategory =
  | "nonprofit"
  | "restaurant-hospitality"
  | "manufacturing"
  | "healthcare"
  | "retail"
  | "professional-services"
  | "accounting-finance"
  | "legal"
  | "education"
  | "construction"
  | "real-estate"
  | "technology"
  | "media-marketing"
  | "logistics-transportation"
  | "agriculture"
  | "government"
  | "other";

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1001-5000"
  | "5001+";

export type RevenueRange =
  | "under-500k"
  | "500k-1m"
  | "1m-5m"
  | "5m-25m"
  | "25m-100m"
  | "100m-500m"
  | "500m+";

export type AiMaturityLevel =
  | "none"
  | "exploring"
  | "piloting"
  | "some-adoption"
  | "widespread";

// Report output types

export interface AssessmentReport {
  executiveSummary: string;
  organizationProfile: OrganizationProfile;
  /** Quick wins identified in step 1 — things to try this week */
  quickWins?: QuickWin[];
  taskAnalysis: TaskAnalysis[];
  toolRecommendations: ToolRecommendation[];
  riskAssessment: RiskAssessment;
  implementationRoadmap: ImplementationRoadmap;
  roiProjections: RoiProjection[];
  /** Human capabilities that appreciate with AI — skills to invest in */
  humanCapabilities?: HumanCapability[];
  furtherEvaluation: string[];
  /** Human capabilities that appreciate with AI adoption */
  humanCapabilities?: HumanCapability[];
  // Add-on content (only populated if purchased)
  aiPolicy?: AiPolicyDocument;
  promptLibrary?: PromptLibraryEntry[];
}

export interface QuickWin {
  title: string;
  description: string;
  timeToImplement: string; // e.g. "30 minutes", "1 hour", "this afternoon"
  impact: "high" | "medium" | "low";
  toolSuggestion?: string;
}

export interface OrganizationProfile {
  summary: string;
  industryContext: string;
  aiReadinessScore: number; // 1-10
  aiReadinessRationale?: string; // Why this score, not higher or lower
  aiReadinessNextSteps?: string[]; // 2-3 actions to improve the score
  keyStrengths: string[];
  keyGaps: string[];
}

export interface TaskAnalysis {
  taskName: string;
  department: string;
  currentProcess: string;
  aiOpportunity: "high" | "medium" | "low";
  aiApproach: string;
  expectedImpact: string;
  complexity: "simple" | "moderate" | "complex";
  onetAlignment?: string; // O*NET task code reference
  estimatedTimeSaved?: string; // e.g. "3-5 hrs/week"
  exampleTools?: { name: string; url?: string; free?: boolean }[];
  gettingStarted?: string; // 1-2 sentence quick-start
  deploymentModel?: "copilot" | "escalation" | "full-automation" | "agentic";
  deploymentModelRationale?: string; // Why this model fits
}

export interface ToolRecommendation {
  /** General category (e.g., "AI writing assistant") */
  category: string;
  /** Specific product name if from tools KB (e.g., "Grammarly") */
  toolName?: string;
  purpose: string;
  expectedValue: string;
  implementationEffort: "low" | "medium" | "high";
  priorityTier: "immediate" | "medium-term" | "long-term";
  /** 3-tier recommendation system: start-here (do this first), add-next (after foundations work), consider-later (when ready) */
  recommendationTier?: "start-here" | "add-next" | "consider-later";
  estimatedMonthlyCost?: string;
  specificProducts?: { name: string; url?: string; pricing?: string; free?: boolean }[];
  gettingStarted?: string[]; // Step-by-step to start using
  realWorldExample?: string; // "A nonprofit in Portland used X to..."
  successKpis?: string[]; // Measurable KPIs to track success
  /** What manual process this tool replaces */
  whatItReplaces?: string;
  /** How long to learn: "5 minutes", "20 minutes", "2-3 hours", "a dedicated afternoon" */
  learningTime?: string;
  /** Specific trigger for upgrading from free to paid */
  upgradeSignal?: string;
  /** Single concrete first task to try from their actual work */
  firstTask?: string;
}

export interface DimensionScores {
  technicalExposure: number;    // 0-10: how many tasks can AI handle?
  adoptionSpeed: number;        // 0-10: how fast is AI being adopted?
  adaptability: number;         // 0-10: how transferable are skills?
  demandElasticity: number;     // 0-10: does efficiency create more demand?
  complementarity: number;      // 0-10: does AI replace or enhance?
}

export interface HumanCapability {
  name: string;
  appreciationScore: number;    // 1-10, how much more valuable with AI
  whyAppreciating: string;      // Why this skill grows in value
  howToDevelop: string;         // Practical development advice
  automationResistance: string[]; // What makes this hard to automate
  relevantTasks: string[];      // Which of their analyzed tasks this applies to
}

export interface RiskAssessment {
  overallRiskLevel: "low" | "moderate" | "high";
  displacementRisk: string;
  skillGaps: string[];
  changeManagementNotes: string;
  dataPrivacyConsiderations: string;
  commonPitfalls?: string[]; // Industry-specific failure modes to avoid
  resistanceSources?: string[]; // Where organizational pushback typically comes from
  dataReadinessNote?: string; // Advice on working with imperfect data
  dimensionScores?: DimensionScores; // 5-dimensional risk framework scores
}

export interface ImplementationRoadmap {
  immediate: RoadmapPhase; // 0-3 months
  mediumTerm: RoadmapPhase; // 3-6 months
  longTerm: RoadmapPhase; // 6-12+ months
}

export interface RoadmapPhase {
  timeframe: string;
  objectives: string[];
  actions: RoadmapAction[];
  expectedOutcomes: string[];
  estimatedInvestment?: string;
}

export interface RoadmapAction {
  title: string;
  description: string;
  owner: string;
  priority: "critical" | "high" | "medium" | "low";
  howTo?: string;
  resource?: { label: string; url: string };
}

export interface RoiProjection {
  area: string;
  currentCost: string;
  projectedSavings: string;
  timeToValue: string;
  confidence: "high" | "moderate" | "low";
  basis: string;
  calculationDetail?: string; // Show the math
}

export interface HumanCapability {
  name: string;
  whyItMatters: string;
  howToDevelop: string;
  appreciationScore: number; // 7-10 scale
}

export interface AiPolicyDocument {
  sections: {
    title: string;
    content: string;
  }[];
}

export interface PromptLibraryEntry {
  title: string;
  department: string;
  useCase: string;
  prompt: string;
  tips: string[];
}

// Industry display labels
export const INDUSTRY_LABELS: Record<IndustryCategory, string> = {
  "nonprofit": "Nonprofit / NGO",
  "restaurant-hospitality": "Restaurant / Hospitality",
  "manufacturing": "Manufacturing",
  "healthcare": "Healthcare / Medical Practice",
  "retail": "Retail",
  "professional-services": "Professional Services / Consulting",
  "accounting-finance": "Accounting / Financial Services",
  "legal": "Legal Services",
  "education": "Education",
  "construction": "Construction / Trades",
  "real-estate": "Real Estate",
  "technology": "Technology",
  "media-marketing": "Media / Marketing / Creative",
  "logistics-transportation": "Logistics / Transportation",
  "agriculture": "Agriculture",
  "government": "Government / Public Sector",
  "other": "Other",
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  "1-10": "1-10 employees",
  "11-50": "11-50 employees",
  "51-200": "51-200 employees",
  "201-500": "201-500 employees",
  "501-1000": "501-1,000 employees",
  "1001-5000": "1,001-5,000 employees",
  "5001+": "5,001+ employees",
};

export const AI_MATURITY_LABELS: Record<AiMaturityLevel, string> = {
  "none": "I haven't really used AI tools yet",
  "exploring": "I've tried ChatGPT or similar a few times",
  "piloting": "I use AI occasionally for specific tasks",
  "some-adoption": "AI is part of my regular workflow",
  "widespread": "I use AI tools daily across most of my work",
};

export const TOOL_PREFERENCE_LABELS: Record<ToolPreference, string> = {
  "use-existing": "Add AI to tools I already use",
  "find-new": "Find new AI-native tools",
  "build-own": "Build custom AI solutions",
  "no-preference": "Not sure yet — show me options",
};

export const FILE_CATEGORY_LABELS: Record<FileCategory, string> = {
  "job-description": "Job Description",
  "employee-handbook": "Employee Handbook",
  "org-chart": "Org Chart",
  "process-document": "Process / SOP Document",
  "orientation-guide": "Orientation / Onboarding Guide",
  "marketing-material": "Marketing Material",
  "financial-report": "Financial Report",
  "other": "Other Document",
};
