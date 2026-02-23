import { EvidenceTier } from "./types";

export interface TierConfig {
  tier: EvidenceTier;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  includes: string[];
}

export const TIER_CONFIGS: TierConfig[] = [
  {
    tier: 1,
    label: "Verified Data & Research",
    shortLabel: "Research",
    color: "#16a34a",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-500",
    description: "Highest confidence — direct empirical evidence",
    includes: [
      "Randomized controlled trials (RCTs)",
      "Peer-reviewed journal articles (AER, QJE, NBER)",
      "Government statistical data (BLS, Census, OECD)",
      "SEC filings, 10-K/10-Q reports, earnings transcripts",
      "Corporate investor presentations with disclosed data",
    ],
  },
  {
    tier: 2,
    label: "Institutional Analysis",
    shortLabel: "Institutional",
    color: "#2563eb",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-500",
    description: "Expert forecasts from credible institutions",
    includes: [
      "Think tank reports (Brookings, RAND, McKinsey Global Institute)",
      "International org forecasts (IMF, World Bank, ILO)",
      "Prediction markets (Metaculus, Polymarket, Kalshi)",
      "Working papers & preprints (arXiv, SSRN)",
      "Industry research (Gartner, Forrester, Deloitte)",
    ],
  },
  {
    tier: 3,
    label: "Journalism & Commentary",
    shortLabel: "News",
    color: "#ea580c",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-500",
    description: "Reporting and informed analysis",
    includes: [
      "Major news outlets (NYT, WSJ, FT, Reuters)",
      "Trade publications (TechCrunch, The Information)",
      "Long-form analysis & investigations",
      "Expert op-eds and columns",
    ],
  },
  {
    tier: 4,
    label: "Informal & Social",
    shortLabel: "Social",
    color: "#dc2626",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    borderColor: "border-red-500",
    description: "Unvetted — anecdotal and crowd-sourced",
    includes: [
      "Twitter/X threads and posts",
      "Reddit discussions",
      "Blog posts and Substack newsletters",
      "Podcasts and YouTube commentary",
    ],
  },
];

export function getTierConfig(tier: EvidenceTier): TierConfig {
  return TIER_CONFIGS[tier - 1];
}
