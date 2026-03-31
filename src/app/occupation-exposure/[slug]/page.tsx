import type { Metadata } from "next";
import enrichedData from "@/data/enriched-occupations.json";
import { scoreKarpathyOccupations } from "@/lib/karpathy-scoring";
import OccupationSlugPage from "@/components/occupation-exposure/OccupationSlugPage";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

// Build all scored occupations at module level (server only, not shipped to client)
const rawForScoring = enrichedData.occupations.map((o) => ({
  title: o.title,
  slug: o.slug,
  category: o.category,
  pay: o.pay,
  jobs: o.jobs,
  outlook: null,
  outlook_desc: "",
  education: o.education,
  exposure: o.exposure,
  exposure_rationale: o.exposure_rationale,
  url: o.blsUrl,
}));

const allScored = scoreKarpathyOccupations(rawForScoring);
const scoredBySlug = new Map(allScored.map((s) => [s.raw.slug, s]));
const enrichedBySlug = new Map(
  enrichedData.occupations.map((o) => [o.slug, o])
);

export function generateStaticParams() {
  return enrichedData.occupations.map((o) => ({ slug: o.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const occ = enrichedBySlug.get(params.slug);

  if (!occ) {
    return { title: "Occupation Not Found" };
  }

  const title = `${occ.title} — AI Displacement Risk | jobsdata.ai`;
  const description = `How exposed is "${occ.title}" to AI displacement? 5-dimensional risk analysis covering technical exposure, adoption speed, adaptability, demand elasticity, and complementarity. Based on O*NET task data and Karpathy's GPT-scored analysis.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/occupation-exposure/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "jobsdata.ai",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page({ params }: Props) {
  const scored = scoredBySlug.get(params.slug);
  const enriched = enrichedBySlug.get(params.slug);

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
        name: "Beyond Exposure",
        item: "https://jobsdata.ai/occupation-exposure",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: enriched?.title ?? "Occupation",
        item: `https://jobsdata.ai/occupation-exposure/${params.slug}`,
      },
    ],
  };

  // Serialize only what the client needs
  const clientData = scored && enriched
    ? {
        scores: scored.scores,
        dimensionality: scored.dimensionality,
        socGroupId: scored.socGroupId,
        enriched: {
          slug: enriched.slug,
          title: enriched.title,
          onetCode: enriched.onetCode,
          category: enriched.category,
          pay: enriched.pay,
          jobs: enriched.jobs,
          education: enriched.education,
          exposure: enriched.exposure,
          exposure_rationale: enriched.exposure_rationale,
          blsUrl: enriched.blsUrl,
          taskComposition: enriched.taskComposition,
          tasks: enriched.tasks,
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div
        className="text-white min-h-screen py-8 sm:py-12 px-6 sm:px-10"
        style={{
          background: "#0a0a0f",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          marginTop: "-4rem",
          marginBottom: "-4rem",
          paddingLeft: "max(1.5rem, calc(50vw - 36rem))",
          paddingRight: "max(1.5rem, calc(50vw - 36rem))",
        }}
      >
        <OccupationSlugPage data={clientData} />
      </div>
    </>
  );
}
