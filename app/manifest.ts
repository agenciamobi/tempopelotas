import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TEMPO Pelotas",
    short_name: "Tempo Pelotas",
    description:
      "Previsão do tempo, chuva, vento e condições meteorológicas em Pelotas, RS.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f5",
    theme_color: "#071e2f",
    lang: "pt-BR",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
