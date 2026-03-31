import { MetadataRoute } from "next";
import { getAllPredictions } from "@/lib/data-loader";
import enrichedData from "@/data/enriched-occupations.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const predictions = getAllPredictions();

  const predictionRoutes = predictions.map((p) => ({
    url: `https://jobsdata.ai/predictions/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const occupationRoutes = enrichedData.occupations.map((o) => ({
    url: `https://jobsdata.ai/occupation-exposure/${o.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: "https://jobsdata.ai",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://jobsdata.ai/signals",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://jobsdata.ai/signals/firm-response",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://jobsdata.ai/j-curve",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://jobsdata.ai/history",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://jobsdata.ai/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...predictionRoutes,
    {
      url: "https://jobsdata.ai/occupation-exposure",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...occupationRoutes,
  ];
}
