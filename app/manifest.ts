import type { MetadataRoute } from "next";
import { getWeatherCameras } from "@/lib/weather-cameras";

export default function manifest(): MetadataRoute.Manifest {
  const hasOnlineCamera = getWeatherCameras().some(
    (camera) => camera.status === "online",
  );
  const shortcuts = [
    {
      name: "Tempo agora",
      short_name: "Agora",
      description: "Abrir as condições atuais de Pelotas.",
      url: "/",
    },
    {
      name: "Previsão de 7 dias",
      short_name: "7 dias",
      description: "Consultar máximas, mínimas e tendência semanal.",
      url: "/previsao-7-dias-pelotas",
    },
    {
      name: "Chuva em Pelotas",
      short_name: "Chuva",
      description: "Consultar probabilidade e acumulado de chuva.",
      url: "/chuva-em-pelotas",
    },
    ...(hasOnlineCamera
      ? [
          {
            name: "Câmeras de Pelotas",
            short_name: "Câmeras",
            description: "Abrir os pontos de observação visual da cidade.",
            url: "/cameras-ao-vivo-pelotas",
          },
        ]
      : []),
    {
      name: "Histórico de Pelotas",
      short_name: "Histórico",
      description: "Comparar temperatura, chuva e vento dos últimos 30 dias.",
      url: "/historico-climatico-pelotas",
    },
    {
      name: "Alertas meteorológicos",
      short_name: "Alertas",
      description: "Abrir a análise de condições de atenção.",
      url: "/alertas",
    },
  ];

  return {
    id: "/",
    name: "TEMPO Pelotas",
    short_name: "Tempo Pelotas",
    description:
      "Previsão do tempo, chuva, vento e condições meteorológicas em Pelotas, RS.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eaf0f3",
    theme_color: "#071e2f",
    lang: "pt-BR",
    orientation: "portrait-primary",
    categories: ["weather", "utilities", "local"],
    shortcuts,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
