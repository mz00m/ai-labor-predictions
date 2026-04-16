import type { Metadata } from "next";
import ScorecardSearch from "@/components/scorecard/ScorecardSearch";
import { getAllOccupationSlugs, getOccupationBySlug } from "@/lib/assessment/scorecard";

export const metadata: Metadata = {
  title: "AI Scorecard: Find Your Occupation's AI Score | jobsdata.ai",
  description:
    "Get your free AI opportunity score. See how AI affects your role, which tools to use, and 3 actions to level up. 342 occupations scored instantly.",
  openGraph: {
    title: "AI Scorecard | jobsdata.ai",
    description:
      "Find your occupation's AI score. Free, instant, no signup required.",
    type: "website",
    siteName: "jobsdata.ai",
    url: "https://jobsdata.ai/scorecard",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Scorecard | jobsdata.ai",
    description:
      "Find your occupation's AI score. Free, instant, no signup required.",
  },
  alternates: {
    canonical: "/scorecard",
  },
};

// Build lightweight index at build time (not shipped as full JSON to client)
function getOccupationIndex() {
  const slugs = getAllOccupationSlugs();
  return slugs
    .map((slug) => {
      const occ = getOccupationBySlug(slug);
      if (!occ) return null;
      return {
        slug: occ.slug,
        title: occ.title,
        category: occ.category,
        exposure: occ.exposure,
      };
    })
    .filter(Boolean) as {
    slug: string;
    title: string;
    category: string;
    exposure: number;
  }[];
}

export default function ScorecardIndexPage() {
  const occupations = getOccupationIndex();

  return <ScorecardSearch occupations={occupations} />;
}
