import { MetadataRoute } from "next";
import { getAllPredictions } from "@/lib/data-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const predictions = getAllPredictions();

  const predictionRoutes = predictions.map((p) => ({
    url: `https://labor.mattzieger.com/predictions/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://labor.mattzieger.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://labor.mattzieger.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...predictionRoutes,
  ];
}
