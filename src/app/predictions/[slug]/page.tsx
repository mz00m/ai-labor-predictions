import { Metadata } from "next";
import { getAllPredictions, getPredictionBySlug } from "@/lib/data-loader";
import PredictionDetailPage from "./PredictionDetailClient";

// Revalidate SSG pages hourly so deploys pick up data changes faster
export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPredictions().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const prediction = getPredictionBySlug(params.slug);

  if (!prediction) {
    return { title: "Prediction Not Found" };
  }

  const categoryLabel =
    prediction.category === "displacement"
      ? "Job Displacement"
      : prediction.category === "wages"
        ? "Wage Impact"
        : prediction.category === "adoption"
          ? "AI Adoption"
          : prediction.category === "signals"
            ? "Corporate Signals"
            : "Workforce Exposure";

  const title = `${prediction.title} — Early Signals of AI Impact`;
  const description = `${prediction.description} Tracked with ${prediction.sources.length} sources across ${prediction.timeHorizon}.`;

  return {
    title: prediction.title,
    description,
    alternates: {
      canonical: `/predictions/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Early Signals of AI Impact",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "article:section": categoryLabel,
    },
  };
}

export default function Page({ params }: Props) {
  const prediction = getPredictionBySlug(params.slug);

  const categoryLabel =
    prediction?.category === "displacement"
      ? "Job Displacement"
      : prediction?.category === "wages"
        ? "Wage Impact"
        : prediction?.category === "adoption"
          ? "AI Adoption"
          : prediction?.category === "signals"
            ? "Corporate Signals"
            : "Workforce Exposure";

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
        name: categoryLabel,
        item: `https://jobsdata.ai/#${prediction?.category ?? "displacement"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: prediction?.title ?? "Prediction",
        item: `https://jobsdata.ai/predictions/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PredictionDetailPage />
    </>
  );
}
