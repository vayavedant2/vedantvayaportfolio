import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

const routes = [
  { path: "", priority: 1 },
  { path: "/works", priority: 0.8 },
  { path: "/info", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
