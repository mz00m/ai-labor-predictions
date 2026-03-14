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
    color: "#6B7BF7",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    borderColor: "border-indigo-400",
    description: "Highest confidence: direct empirical evidence",
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
    color: "#3ECFAE",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    borderColor: "border-teal-400",
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
    color: "#F7C96B",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-400",
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
    color: "#9A9AAF",
    bgColor: "bg-gray-100 dark:bg-gray-800/30",
    borderColor: "border-gray-400",
    description: "Unvetted: anecdotal and crowd-sourced",
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
