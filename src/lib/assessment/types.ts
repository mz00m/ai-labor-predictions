// Assessment feature types

export interface AssessmentUser {
  id: string;
  email: string;
  createdAt: string;
  stripeCustomerId?: string;
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
  // Key functions and roles
  primaryFunctions: string[];
  keyRoles: string[];
  // Current tech landscape
  currentTools: string[];
  currentAiUsage: AiMaturityLevel;
  // Pain points and goals
  biggestChallenges: string[];
  goals: string[];
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
  taskAnalysis: TaskAnalysis[];
  toolRecommendations: ToolRecommendation[];
  riskAssessment: RiskAssessment;
  implementationRoadmap: ImplementationRoadmap;
  roiProjections: RoiProjection[];
  furtherEvaluation: string[];
  // Add-on content (only populated if purchased)
  aiPolicy?: AiPolicyDocument;
  promptLibrary?: PromptLibraryEntry[];
}

export interface OrganizationProfile {
  summary: string;
  industryContext: string;
  aiReadinessScore: number; // 1-10
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
  estimatedMonthlyCost?: string;
  specificProducts?: { name: string; url?: string; pricing?: string; free?: boolean }[];
  gettingStarted?: string[]; // Step-by-step to start using
  realWorldExample?: string; // "A nonprofit in Portland used X to..."
  successKpis?: string[]; // Measurable KPIs to track success
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
