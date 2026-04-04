import { z } from "zod";

// ─── Shared enums ───────────────────────────────────────────────

const IndustryCategorySchema = z.enum([
  "nonprofit", "restaurant-hospitality", "manufacturing", "healthcare",
  "retail", "professional-services", "accounting-finance", "legal",
  "education", "construction", "real-estate", "technology",
  "media-marketing", "logistics-transportation", "agriculture",
  "government", "other",
]);

const CompanySizeSchema = z.enum([
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001+",
]);

const RevenueRangeSchema = z.enum([
  "under-500k", "500k-1m", "1m-5m", "5m-25m", "25m-100m", "100m-500m", "500m+",
]);

const AiMaturityLevelSchema = z.enum([
  "none", "exploring", "piloting", "some-adoption", "widespread",
]);

const FileCategorySchema = z.enum([
  "job-description", "employee-handbook", "org-chart", "process-document",
  "orientation-guide", "marketing-material", "financial-report", "other",
]);

const UploadedFileMetaSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  category: FileCategorySchema,
  uploadedAt: z.string(),
});

// ─── Input validation ───────────────────────────────────────────

export const AssessmentIntakeSchema = z.object({
  organizationName: z.string().min(1).max(200),
  industry: IndustryCategorySchema,
  industryDetail: z.string().max(500).optional(),
  companySize: CompanySizeSchema,
  annualRevenue: RevenueRangeSchema.optional(),
  assessmentScope: z.enum(["full-organization", "department", "team"]),
  departmentName: z.string().max(200).optional(),
  teamDescription: z.string().max(1000).optional(),
  primaryFunctions: z.array(z.string().max(200)).min(1).max(20),
  keyRoles: z.array(z.string().max(200)).min(1).max(30),
  currentTools: z.array(z.string().max(200)).max(50),
  currentAiUsage: AiMaturityLevelSchema,
  biggestChallenges: z.array(z.string().max(500)).min(1).max(10),
  goals: z.array(z.string().max(500)).min(1).max(10),
  uploadedFiles: z.array(UploadedFileMetaSchema).max(20).default([]),
  websiteUrl: z.string().url().max(500).optional().or(z.literal("")),
  additionalContext: z.string().max(5000).optional(),
});

// ─── Step context (carried across steps) ────────────────────────

export const StepContextSchema = z.object({
  documentInsights: z.array(z.string()).default([]),
  websiteSummary: z.string().optional(),
  extractedRoles: z.array(z.string()).optional(),
  extractedProcesses: z.array(z.string()).optional(),
  additionalContext: z.string().optional(),
});

// ─── Step 1: Profile output ─────────────────────────────────────

const OrganizationProfileSchema = z.object({
  summary: z.string().default(""),
  industryContext: z.string().default(""),
  aiReadinessScore: z.number().min(1).max(10).default(5),
  keyStrengths: z.array(z.string()).default([]),
  keyGaps: z.array(z.string()).default([]),
});

const QuickWinSchema = z.object({
  title: z.string(),
  description: z.string(),
  timeToImplement: z.string(),
  impact: z.enum(["high", "medium", "low"]),
  toolSuggestion: z.string().optional(),
});

export const Step1ProfileSchema = z.object({
  executiveSummary: z.string().default(""),
  organizationProfile: OrganizationProfileSchema.default({
    summary: "", industryContext: "", aiReadinessScore: 5, keyStrengths: [], keyGaps: [],
  }),
  quickWins: z.array(QuickWinSchema).default([]),
  extractedContext: StepContextSchema.optional(),
});

// ─── Step 2: Tasks output ───────────────────────────────────────

const ExampleToolSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  free: z.boolean().optional(),
});

const TaskAnalysisSchema = z.object({
  taskName: z.string(),
  department: z.string(),
  currentProcess: z.string(),
  aiOpportunity: z.enum(["high", "medium", "low"]),
  aiApproach: z.string(),
  expectedImpact: z.string(),
  complexity: z.enum(["simple", "moderate", "complex"]),
  onetAlignment: z.string().optional(),
  estimatedTimeSaved: z.string().optional(),
  exampleTools: z.array(ExampleToolSchema).optional(),
  gettingStarted: z.string().optional(),
  deploymentModel: z.enum(["copilot", "escalation", "full-automation", "agentic"]).optional(),
  deploymentModelRationale: z.string().optional(),
});

export const Step2TasksSchema = z.object({
  taskAnalysis: z.array(TaskAnalysisSchema).default([]),
});

// ─── Step 3: Tools output ───────────────────────────────────────

const SpecificProductSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  pricing: z.string().optional(),
  free: z.boolean().optional(),
});

const ToolRecommendationSchema = z.object({
  category: z.string(),
  toolName: z.string().optional(),
  purpose: z.string(),
  expectedValue: z.string(),
  implementationEffort: z.enum(["low", "medium", "high"]),
  priorityTier: z.enum(["immediate", "medium-term", "long-term"]),
  recommendationTier: z.enum(["start-here", "add-next", "consider-later"]).optional(),
  estimatedMonthlyCost: z.string().optional(),
  specificProducts: z.array(SpecificProductSchema).optional(),
  gettingStarted: z.array(z.string()).optional(),
  realWorldExample: z.string().optional(),
  successKpis: z.array(z.string()).optional(),
  whatItReplaces: z.string().optional(),
  learningTime: z.string().optional(),
  upgradeSignal: z.string().optional(),
  firstTask: z.string().optional(),
});

const ResourceSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const RoadmapActionSchema = z.object({
  title: z.string(),
  description: z.string(),
  owner: z.string(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  howTo: z.string().optional(),
  resource: ResourceSchema.optional(),
});

const RoadmapPhaseSchema = z.object({
  timeframe: z.string(),
  objectives: z.array(z.string()).default([]),
  actions: z.array(RoadmapActionSchema).default([]),
  expectedOutcomes: z.array(z.string()).default([]),
  estimatedInvestment: z.string().optional(),
});

const ImplementationRoadmapSchema = z.object({
  immediate: RoadmapPhaseSchema.default({
    timeframe: "0-3 months", objectives: [], actions: [], expectedOutcomes: [],
  }),
  mediumTerm: RoadmapPhaseSchema.default({
    timeframe: "3-6 months", objectives: [], actions: [], expectedOutcomes: [],
  }),
  longTerm: RoadmapPhaseSchema.default({
    timeframe: "6-12+ months", objectives: [], actions: [], expectedOutcomes: [],
  }),
});

const RoiProjectionSchema = z.object({
  area: z.string(),
  currentCost: z.string(),
  projectedSavings: z.string(),
  timeToValue: z.string(),
  confidence: z.enum(["high", "moderate", "low"]),
  basis: z.string(),
  calculationDetail: z.string().optional(),
});

export const Step3ToolsSchema = z.object({
  toolRecommendations: z.array(ToolRecommendationSchema).default([]),
  implementationRoadmap: ImplementationRoadmapSchema.default({
    immediate: { timeframe: "0-3 months", objectives: [], actions: [], expectedOutcomes: [] },
    mediumTerm: { timeframe: "3-6 months", objectives: [], actions: [], expectedOutcomes: [] },
    longTerm: { timeframe: "6-12+ months", objectives: [], actions: [], expectedOutcomes: [] },
  }),
  roiProjections: z.array(RoiProjectionSchema).default([]),
});

// ─── Step 4: Risks output ───────────────────────────────────────

const RiskAssessmentSchema = z.object({
  overallRiskLevel: z.enum(["low", "moderate", "high"]).default("moderate"),
  displacementRisk: z.string().default(""),
  skillGaps: z.array(z.string()).default([]),
  changeManagementNotes: z.string().default(""),
  dataPrivacyConsiderations: z.string().default(""),
  commonPitfalls: z.array(z.string()).optional(),
  resistanceSources: z.array(z.string()).optional(),
  dataReadinessNote: z.string().optional(),
});

const AiPolicySectionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const AiPolicyDocumentSchema = z.object({
  sections: z.array(AiPolicySectionSchema),
});

const PromptLibraryEntrySchema = z.object({
  title: z.string(),
  department: z.string(),
  useCase: z.string(),
  prompt: z.string(),
  tips: z.array(z.string()),
});

export const Step4RisksSchema = z.object({
  riskAssessment: RiskAssessmentSchema.default({
    overallRiskLevel: "moderate",
    displacementRisk: "",
    skillGaps: [],
    changeManagementNotes: "",
    dataPrivacyConsiderations: "",
  }),
  furtherEvaluation: z.array(z.string()).default([]),
  aiPolicy: AiPolicyDocumentSchema.optional(),
  promptLibrary: z.array(PromptLibraryEntrySchema).optional(),
});
