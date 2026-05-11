// Shared types for the /map page.
// Mirrors the actual shape of src/data/risk/{occupation,sector}-risk.json
// produced by the risk-scoring sibling agent.

export type RiskBucket = "low" | "medium" | "high";

export interface OccupationRiskTask {
  taskName: string;
  category: string;
  importance: number;
  riskScore: number;        // 0-100
  riskBucket: RiskBucket;
}

export interface OccupationRisk {
  slug: string;
  title: string;
  onetCode?: string;
  category: string;          // BLS major group slug
  jobs: number;
  pay: number;
  exposure: number;
  technicalExposure: number; // 0-10
  adoptionSpeed: number;
  adaptability: number;
  demandElasticity: number;
  complementarity: number;
  netRisk: number;           // 0-10
  netRisk100: number;        // 0-100
  pctHighRiskTime: number;   // 0-100
  pctMediumRiskTime: number; // 0-100
  pctLowRiskTime: number;    // 0-100
  effectiveDimensions?: number;
  tasks: OccupationRiskTask[];
}

export interface OccupationRiskFile {
  generatedAt: string;
  methodology: string;
  count?: number;
  occupations: OccupationRisk[];
}

export interface SectorTopRiskItem {
  slug: string;
  title: string;
  netRisk: number;           // 0-10
  jobs: number;
}

export interface SectorRisk {
  category: string;
  totalJobs: number;
  occupationCount: number;
  weightedNetRisk: number;   // 0-10
  weightedNetRisk100: number;// 0-100
  meanNetRisk: number;
  topRisk: SectorTopRiskItem[];
  // Optional — may be added by future versions of the sector data
  label?: string;
  pctHighRiskTime?: number;
}

export interface SectorRiskFile {
  generatedAt: string;
  methodology?: string;
  count?: number;
  sectors: SectorRisk[];
}

// Computed per-sector aggregate used by the heatmap.
export interface SectorAggregate extends SectorRisk {
  label: string;
  pctHighRiskTime: number;
  pctMediumRiskTime: number;
  pctLowRiskTime: number;
}

// Slug -> display label for BLS major groups
export const CATEGORY_LABELS: Record<string, string> = {
  "architecture-and-engineering": "Architecture & engineering",
  "arts-and-design": "Arts & design",
  "building-and-grounds-cleaning": "Building & grounds cleaning",
  "business-and-financial": "Business & financial",
  "community-and-social-service": "Community & social service",
  "computer-and-information-technology": "Computer & IT",
  "construction-and-extraction": "Construction & extraction",
  "education-training-and-library": "Education, training & library",
  "entertainment-and-sports": "Entertainment & sports",
  "farming-fishing-and-forestry": "Farming, fishing & forestry",
  "food-preparation-and-serving": "Food preparation & serving",
  "healthcare": "Healthcare",
  "installation-maintenance-and-repair": "Installation, maintenance & repair",
  "legal": "Legal",
  "life-physical-and-social-science": "Life, physical & social science",
  "management": "Management",
  "math": "Math",
  "media-and-communication": "Media & communication",
  "military": "Military",
  "office-and-administrative-support": "Office & admin support",
  "personal-care-and-service": "Personal care & service",
  "production": "Production",
  "protective-service": "Protective service",
  "sales": "Sales",
  "transportation-and-material-moving": "Transportation & material moving",
};

export function prettyCategory(slug: string): string {
  return (
    CATEGORY_LABELS[slug] ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

// Risk color scale. Anchored to the existing OccupationExposurePage palette:
// green (low) -> amber (mid) -> red (high). For a 0-10 net risk.
export function riskColor(netRisk0to10: number): string {
  if (netRisk0to10 >= 6.5) return "#DC2626";
  if (netRisk0to10 >= 5) return "#F59E0B";
  if (netRisk0to10 >= 3.5) return "#FBBF24";
  return "#16A34A";
}

// Soft fill (for chips / bars) -- low-opacity hex (no rgba so it works in
// inline styles without alpha math).
export function riskTint(netRisk0to10: number): string {
  if (netRisk0to10 >= 6.5) return "#FEE2E2";
  if (netRisk0to10 >= 5) return "#FEF3C7";
  if (netRisk0to10 >= 3.5) return "#FEF9C3";
  return "#DCFCE7";
}

export function riskColor100(netRisk0to100: number): string {
  return riskColor(netRisk0to100 / 10);
}

export function formatJobs(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("en-US");
}

export function formatPay(n: number): string {
  if (!n) return "—";
  return `$${(n / 1000).toFixed(0)}K`;
}
