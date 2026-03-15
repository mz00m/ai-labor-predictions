/**
 * Industry Adoption Speed Index
 *
 * A multiplier on CATEGORY_ADOPTION_LAG that reflects how fast different
 * industries actually adopt new technology. Task-level lag captures per-task
 * friction (e.g., "analysis tasks take 3.5 extra years everywhere"), while
 * industry speed captures per-industry friction (e.g., "healthcare is slow
 * at everything").
 *
 * Methodology: five-factor composite, each scored 1-5 and weighted:
 *
 *   Factor                              Weight  Source
 *   ─────────────────────────────────────────────────────────────────
 *   Regulatory burden                    25%    OECD Product Market Regulation;
 *                                               Blind (2012) "Impact of Regulation on Innovation"
 *   Digital maturity / IT workforce      25%    McKinsey "Digital America" (2015);
 *                                               BLS IT occupation share by industry
 *   Competitive pressure / margins       20%    Industry concentration data;
 *                                               Autor et al. (2020)
 *   Labor rigidity / union density       15%    BLS union membership by industry;
 *                                               Acemoglu & Restrepo (2020)
 *   Organizational complexity            15%    Firm size distributions;
 *                                               Brynjolfsson et al. (2021) "The Turing Trap"
 *
 * The resulting composite score maps to a multiplier:
 *   - 1.0 = baseline adoption pace (industry-neutral)
 *   - < 1.0 = faster than baseline (fewer structural barriers)
 *   - > 1.0 = slower than baseline (more structural barriers)
 *
 * The multiplier scales CATEGORY_ADOPTION_LAG values. For example, a task
 * with 3.0 years of task-level lag in an industry with multiplier 1.4
 * produces 3.0 * 1.4 = 4.2 years of total adoption lag beyond cost parity.
 */

export interface IndustrySpeed {
  multiplier: number;
  label: string;
  rationale: string;
}

/**
 * Adoption speed by job category (17 categories used in the task visualizer).
 * Sorted from fastest to slowest adopter.
 */
export const INDUSTRY_ADOPTION_SPEED: Record<string, IndustrySpeed> = {
  "Technology": {
    multiplier: 0.6,
    label: "Very fast",
    rationale: "High digital maturity, tech-native workforce, intense competitive pressure, minimal regulatory burden",
  },
  "Media & Communications": {
    multiplier: 0.7,
    label: "Fast",
    rationale: "Digital-native workflows, margin pressure from AI-first competitors, low regulatory friction",
  },
  "Arts & Design": {
    multiplier: 0.75,
    label: "Fast",
    rationale: "Tool-oriented workflows, freelance flexibility enables rapid individual adoption",
  },
  "Business & Finance": {
    multiplier: 0.85,
    label: "Moderate-fast",
    rationale: "High digital maturity, strong ROI incentive, but moderate compliance requirements (SOX, audit trails)",
  },
  "Office & Admin": {
    multiplier: 0.85,
    label: "Moderate-fast",
    rationale: "Clear automation ROI, process-oriented work, but large-org change management drag",
  },
  "Sales": {
    multiplier: 0.85,
    label: "Moderate-fast",
    rationale: "Revenue-driven adoption incentive, CRM ecosystem already AI-enabled",
  },
  "Retail": {
    multiplier: 0.9,
    label: "Moderate",
    rationale: "Margin pressure drives adoption, but fragmented industry with many small operators",
  },
  "Management": {
    multiplier: 1.0,
    label: "Baseline",
    rationale: "Spans all industries — adoption speed reflects the specific industry managed",
  },
  "Building & Grounds": {
    multiplier: 1.1,
    label: "Moderate-slow",
    rationale: "Low-tech workflows, but low regulatory burden; limited mainly by robotics cost curves",
  },
  "Food & Hospitality": {
    multiplier: 1.1,
    label: "Moderate-slow",
    rationale: "Fragmented small businesses, low IT investment, high labor turnover reduces training ROI",
  },
  "Community & Social Services": {
    multiplier: 1.2,
    label: "Slow",
    rationale: "Government/nonprofit funding constraints, ethical review requirements, low IT budgets",
  },
  "Legal": {
    multiplier: 1.2,
    label: "Slow",
    rationale: "Malpractice liability, bar association oversight, billable-hour incentive misalignment",
  },
  "Education": {
    multiplier: 1.25,
    label: "Slow",
    rationale: "Institutional inertia, academic governance structures, equity concerns, union density ~35%",
  },
  "Construction & Trades": {
    multiplier: 1.3,
    label: "Slow",
    rationale: "Safety regulation, union density ~13%, physical workflows, high capital switching costs",
  },
  "Transportation": {
    multiplier: 1.3,
    label: "Slow",
    rationale: "Federal safety regulation (FMCSA/FAA), union contracts, capital-intensive fleet transitions",
  },
  "Protective Services": {
    multiplier: 1.3,
    label: "Slow",
    rationale: "Government employment, civil service rules, public accountability requirements",
  },
  "Healthcare": {
    multiplier: 1.4,
    label: "Very slow",
    rationale: "FDA/HIPAA regulation, malpractice liability, clinical validation requirements, strong unions",
  },
};

/**
 * Adoption speed by SOC major group (22 groups used in the economy-wide model).
 * Maps each BLS occupation group to its industry-appropriate multiplier.
 */
export const SOC_INDUSTRY_SPEED: Record<string, number> = {
  "management":               1.0,   // Management — spans all industries
  "business-financial":       0.85,  // Business & Finance
  "computer-math":            0.6,   // Technology
  "architecture-engineering": 1.1,   // Engineering: safety codes, licensing
  "life-physical-social-science": 1.0, // Science: varies widely
  "community-social":         1.2,   // Community & Social Services
  "legal":                    1.2,   // Legal
  "education":                1.25,  // Education
  "arts-media":               0.725, // Blended Arts & Design + Media & Communications
  "healthcare-practitioners": 1.4,   // Healthcare (clinical)
  "healthcare-support":       1.3,   // Healthcare (support, lower regulatory bar)
  "protective-service":       1.3,   // Protective Services
  "food-serving":             1.1,   // Food & Hospitality
  "building-grounds":         1.1,   // Building & Grounds
  "personal-care":            1.15,  // Healthcare-adjacent + low-regulation services
  "sales":                    0.85,  // Sales
  "office-admin":             0.85,  // Office & Admin
  "farming-fishing":          1.2,   // Low IT investment, seasonal workforce
  "construction":             1.3,   // Construction & Trades
  "installation-repair":      1.2,   // Trades-adjacent, licensing requirements
  "production":               1.1,   // Manufacturing: capital intensive but competitive
  "transportation":           1.3,   // Transportation
};

/**
 * Slider preset labels for the user-facing control.
 */
export const ADOPTION_SPEED_PRESETS: { value: number; label: string }[] = [
  { value: 0.5, label: "Aggressive" },
  { value: 0.75, label: "Fast" },
  { value: 1.0, label: "Baseline" },
  { value: 1.5, label: "Slow" },
  { value: 2.0, label: "Very slow" },
];

/**
 * Get the label for a given multiplier value.
 */
export function getSpeedLabel(multiplier: number): string {
  if (multiplier <= 0.65) return "Very fast";
  if (multiplier <= 0.8) return "Fast";
  if (multiplier <= 0.95) return "Moderate-fast";
  if (multiplier <= 1.05) return "Baseline";
  if (multiplier <= 1.15) return "Moderate-slow";
  if (multiplier <= 1.35) return "Slow";
  return "Very slow";
}
