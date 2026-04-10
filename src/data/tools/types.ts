/**
 * Office Automation Tools Knowledge Base — Type Definitions
 *
 * Structured schema for AI/automation tools across 11 categories.
 * Designed for incremental growth: add new tools by appending entries
 * to category files.
 */

export type ToolCategory =
  | "office"
  | "administrative"
  | "billing"
  | "marketing"
  | "customer-management"
  | "data-analytics"
  | "hr-recruiting"
  | "compliance-legal"
  | "sales-enablement"
  | "it-security"
  | "inventory-supply-chain";

export const TOOL_CATEGORY_META: Record<
  ToolCategory,
  { label: string; description: string }
> = {
  office: {
    label: "Office & Productivity",
    description:
      "General-purpose office tools: writing, documents, spreadsheets, presentations, email, scheduling",
  },
  administrative: {
    label: "Administrative & Operations",
    description:
      "Back-office operations: HR, compliance, document management, project management, process automation",
  },
  billing: {
    label: "Billing & Finance",
    description:
      "Invoicing, accounting, expense management, payroll, payment processing, financial reporting",
  },
  marketing: {
    label: "Marketing & Content",
    description:
      "Content creation, SEO, social media, email campaigns, analytics, design, ad management",
  },
  "customer-management": {
    label: "Customer Management",
    description:
      "CRM, support ticketing, chatbots, customer communication, feedback, loyalty programs",
  },
  "data-analytics": {
    label: "Data & Analytics",
    description:
      "BI dashboards, data visualization, reporting, data cleaning, spreadsheet automation, metrics tracking",
  },
  "hr-recruiting": {
    label: "HR & Recruiting",
    description:
      "Applicant tracking, candidate screening, interview scheduling, onboarding, performance management",
  },
  "compliance-legal": {
    label: "Compliance & Legal",
    description:
      "Contract management, regulatory tracking, policy management, audit readiness, risk monitoring",
  },
  "sales-enablement": {
    label: "Sales Enablement",
    description:
      "Proposal builders, CPQ, conversation intelligence, sales coaching, deal rooms, outbound automation",
  },
  "it-security": {
    label: "IT & Security",
    description:
      "Password management, endpoint security, IT helpdesk, device management, identity access, MDM",
  },
  "inventory-supply-chain": {
    label: "Inventory & Supply Chain",
    description:
      "Stock management, order fulfillment, procurement, warehouse management, demand forecasting",
  },
};

export type PricingModel =
  | "free"
  | "freemium"
  | "free-trial"
  | "paid"
  | "per-seat"
  | "usage-based";

export type CompanySizeFit = "solo" | "small" | "mid" | "enterprise";

export type AiNative = "ai-native" | "ai-enhanced" | "ai-optional" | "traditional-with-ai";

export interface ToolEntry {
  /** Unique slug: lowercase, hyphenated (e.g. "notion-ai") */
  id: string;
  /** Product name as commonly known */
  name: string;
  /** Primary category */
  category: ToolCategory;
  /** More specific function within the category */
  subcategory: string;
  /** 1-2 sentence plain-language description of what it does */
  description: string;
  /** What specific office tasks this automates — be concrete */
  automationCapabilities: string[];
  /** How AI is integrated */
  aiNative: AiNative;
  /** Pricing model */
  pricingModel: PricingModel;
  /** Human-readable pricing (e.g. "$10/user/mo", "Free up to 3 users") */
  pricingDetails: string;
  /** Which company sizes this fits best */
  bestFor: CompanySizeFit[];
  /** Industries where this is especially relevant (use IndustryCategory slugs) */
  relevantIndustries?: string[];
  /** What it integrates with (other tool names or categories) */
  integrations?: string[];
  /** Known limitations or caveats */
  limitations?: string[];
  /** Product URL */
  url?: string;
  /** Date this entry was last verified (YYYY-MM-DD) */
  lastVerified: string;
}

/**
 * Helper type for building category files.
 * Each category file exports a const array of ToolEntry.
 */
export type ToolCatalog = ToolEntry[];
