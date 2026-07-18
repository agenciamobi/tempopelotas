import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tempopelotas.com.br/sitemap.xml",
    host: "https://tempopelotas.com.br",
  };
}
