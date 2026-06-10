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

  const staticRoutes: MetadataRoute.Sitemap = ([
    { path: "/predictions", changeFrequency: "daily", priority: 0.9 },
    { path: "/map", changeFrequency: "weekly", priority: 0.8 },
    { path: "/compare", changeFrequency: "weekly", priority: 0.7 },
    { path: "/task-visualizer", changeFrequency: "weekly", priority: 0.8 },
    { path: "/task-visualizer/economy", changeFrequency: "weekly", priority: 0.7 },
    { path: "/productivity", changeFrequency: "monthly", priority: 0.7 },
    { path: "/demand-elasticity", changeFrequency: "monthly", priority: 0.6 },
    { path: "/research", changeFrequency: "weekly", priority: 0.8 },
    { path: "/methodology", changeFrequency: "monthly", priority: 0.6 },
    { path: "/suggest", changeFrequency: "monthly", priority: 0.4 },
    { path: "/learn/reading-list", changeFrequency: "weekly", priority: 0.7 },
    { path: "/assessment", changeFrequency: "monthly", priority: 0.8 },
    { path: "/assessment/start", changeFrequency: "monthly", priority: 0.6 },
    { path: "/assessment/methodology", changeFrequency: "monthly", priority: 0.5 },
  ] as const).map(({ path, changeFrequency, priority }) => ({
    url: `https://jobsdata.ai${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  return [
    {
      url: "https://jobsdata.ai",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...staticRoutes,
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
      url: "https://jobsdata.ai/scorecard",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...enrichedData.occupations.map((o) => ({
      url: `https://jobsdata.ai/scorecard/${o.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: "https://jobsdata.ai/occupation-exposure",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...occupationRoutes,
  ];
}
