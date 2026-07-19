import { NextResponse } from "next/server";
import {
  HYDROLOGY_DATA_SOURCES,
  HYDROLOGY_STATIONS,
} from "@/lib/hydrology";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export async function GET() {
  const weather = await getPelotasWeather();

  return NextResponse.json(
    {
      schema_version: "1.0",
      generated_at: new Date().toISOString(),
      location: {
        city: "Pelotas",
        state: "RS",
        country: "BR",
        latitude: -31.7654,
        longitude: -52.3376,
        timezone: "America/Sao_Paulo",
      },
      weather: {
        current: weather.current,
        hourly: weather.hourly,
        daily: weather.daily,
        regional: weather.regional,
        source: weather.source,
      },
      hydrology: {
        status: "contextual-monitoring",
        live_level: null,
        live_level_note:
          "O nível local é exibido no painel externo do LabHidroSens / UFPel. A integração numérica oficial com ANA/SGB ainda depende de credenciais e validação da API.",
        local_dashboard: {
          station: LAGOON_LEVEL_SOURCE.station,
          provider: LAGOON_LEVEL_SOURCE.name,
          location: LAGOON_LEVEL_SOURCE.location,
          url: LAGOON_LEVEL_SOURCE.dashboardUrl,
        },
        official_stations: HYDROLOGY_STATIONS,
        sources: HYDROLOGY_DATA_SOURCES,
      },
      links: {
        home: absoluteUrl("/"),
        hydrology: absoluteUrl("/situacao-hidrologica-pelotas"),
        methodology: absoluteUrl("/metodologia"),
        feed: absoluteUrl("/feed"),
      },
      disclaimer:
        "Informação comunitária. Não substitui alertas, ordens de evacuação ou orientações da Defesa Civil e das autoridades competentes.",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=600",
      },
    },
  );
}
