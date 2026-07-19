import { NextResponse } from "next/server";
import { getEmbrapaObservation } from "@/lib/embrapa-observation";
import {
  HYDROLOGY_DATA_SOURCES,
  HYDROLOGY_STATIONS,
} from "@/lib/hydrology";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 300;

export async function GET() {
  const [weather, embrapaObservation] = await Promise.all([
    getPelotasWeather(),
    getEmbrapaObservation(),
  ]);

  return NextResponse.json(
    {
      schema_version: "1.1",
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
        forecast: {
          current: weather.current,
          hourly: weather.hourly,
          daily: weather.daily,
          regional: weather.regional,
          source: weather.source,
        },
        observed: {
          embrapa: embrapaObservation,
        },
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
        embrapa_station: absoluteUrl("/estacao-embrapa-pelotas"),
        embrapa_api: absoluteUrl("/api/weather/embrapa"),
        hydrology: absoluteUrl("/situacao-hidrologica-pelotas"),
        methodology: absoluteUrl("/metodologia"),
        feed: absoluteUrl("/feed"),
      },
      disclaimer:
        "Informação comunitária. Leituras meteorológicas representam o ponto da estação e não substituem alertas ou orientações da Defesa Civil e das autoridades competentes.",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=120, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
