import { MetadataRoute } from "next";
import { getAllPredictions } from "@/lib/data-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const predictions = getAllPredictions();

  const predictionRoutes = predictions.map((p) => ({
    url: `https://jobsdata.org/predictions/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://jobsdata.org",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://jobsdata.org/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...predictionRoutes,
  ];
}
