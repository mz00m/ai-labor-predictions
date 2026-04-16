import type { Metadata } from "next";
import {
  getScorecard,
  getAllOccupationSlugs,
} from "@/lib/assessment/scorecard";
import ScorecardView from "@/components/scorecard/ScorecardView";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllOccupationSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const scorecard = getScorecard(params.slug);

  if (!scorecard) {
    return { title: "Occupation Not Found | jobsdata.ai" };
  }

  const title = `${scorecard.title}: AI Score ${scorecard.score}/10 | jobsdata.ai`;
  const description = `Your AI opportunity score for ${scorecard.title} is ${scorecard.score}/10 (${scorecard.bandLabel}). See your top AI tools, task breakdown, and 3 action items to level up. Free, instant, no signup required.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/scorecard/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "jobsdata.ai",
      url: `https://jobsdata.ai/scorecard/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${scorecard.title}: AI Score ${scorecard.score}/10`,
      description,
    },
  };
}

export default function ScorecardPage({ params }: Props) {
  const scorecard = getScorecard(params.slug);

  if (!scorecard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Occupation not found
          </h1>
          <p className="text-gray-600 mb-6">
            We don&apos;t have scorecard data for this occupation yet.
          </p>
          <a
            href="/scorecard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5C61F6] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Search occupations
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jobsdata.ai",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Scorecard",
        item: "https://jobsdata.ai/scorecard",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: scorecard.title,
        item: `https://jobsdata.ai/scorecard/${scorecard.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ScorecardView scorecard={scorecard} />
    </>
  );
}
