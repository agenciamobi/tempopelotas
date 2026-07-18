import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getWeatherCameras } from "@/lib/weather-cameras";

const baseRoutes = [
  { path: "/", priority: 1, changeFrequency: "hourly" },
  { path: "/tempo-hoje-pelotas", priority: 0.95, changeFrequency: "hourly" },
  { path: "/previsao-7-dias-pelotas", priority: 0.9, changeFrequency: "hourly" },
  { path: "/chuva-em-pelotas", priority: 0.85, changeFrequency: "hourly" },
  { path: "/vento-em-pelotas", priority: 0.85, changeFrequency: "hourly" },
  { path: "/historico-climatico-pelotas", priority: 0.82, changeFrequency: "daily" },
  { path: "/alertas", priority: 0.8, changeFrequency: "hourly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const hasOnlineCamera = getWeatherCameras().some(
    (camera) => camera.status === "online",
  );
  const routes = hasOnlineCamera
    ? [
        ...baseRoutes,
        {
          path: "/cameras-ao-vivo-pelotas",
          priority: 0.82,
          changeFrequency: "hourly" as const,
        },
      ]
    : baseRoutes;

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
