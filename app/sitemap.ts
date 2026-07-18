import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const routes = [
  { path: "/", priority: 1 },
  { path: "/tempo-hoje-pelotas", priority: 0.95 },
  { path: "/previsao-7-dias-pelotas", priority: 0.9 },
  { path: "/chuva-em-pelotas", priority: 0.85 },
  { path: "/vento-em-pelotas", priority: 0.85 },
  { path: "/alertas", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: route.priority,
  }));
}
