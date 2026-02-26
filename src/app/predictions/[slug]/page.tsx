import { Metadata } from "next";
import { getAllPredictions, getPredictionBySlug } from "@/lib/data-loader";
import PredictionDetailPage from "./PredictionDetailClient";

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
    title,
    description,
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

export default function Page() {
  return <PredictionDetailPage />;
}
