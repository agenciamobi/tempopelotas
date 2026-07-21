import "server-only";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";

export type LaranjalLevelStatus = "live" | "stale" | "unavailable";

export type LaranjalLevelPoint = {
  timestamp: string;
  level: number;
};

export type LaranjalLevelData = {
  status: LaranjalLevelStatus;
  currentLevel: number | null;
  updatedAt: string | null;
  trendCmPerHour: number | null;
  change1hCm: number | null;
  change6hCm: number | null;
  change24hCm: number | null;
  periodAverage: number | null;
  periodMinimum: number | null;
  periodMaximum: number | null;
  series: LaranjalLevelPoint[];
  source: {
    name: string;
    station: string;
    location: string;
    url: string;
    fetchedAt: string;
  };
  error: string | null;
};

function sourceOnlyData(): LaranjalLevelData {
  return {
    status: "unavailable",
    currentLevel: null,
    updatedAt: null,
    trendCmPerHour: null,
    change1hCm: null,
    change6hCm: null,
    change24hCm: null,
    periodAverage: null,
    periodMinimum: null,
    periodMaximum: null,
    series: [],
    source: {
      name: LAGOON_LEVEL_SOURCE.name,
      station: LAGOON_LEVEL_SOURCE.station,
      location: LAGOON_LEVEL_SOURCE.location,
      url: LAGOON_LEVEL_SOURCE.dashboardUrl,
      fetchedAt: new Date().toISOString(),
    },
    error:
      "O TEMPO Pelotas não processa a telemetria desta estação. Consulte o painel público da UFPel.",
  };
}

/**
 * Mantido apenas por compatibilidade com consumidores antigos. O portal não
 * transforma a telemetria local em nível, tendência ou classificação própria.
 */
export function normalizeLaranjalTelemetry(
  _payload: unknown,
  _fetchedAt = new Date(),
): LaranjalLevelData {
  return sourceOnlyData();
}

export async function getLaranjalLevelData(): Promise<LaranjalLevelData> {
  return sourceOnlyData();
}

export const LARANJAL_LEVEL_CONFIG = {
  sourceUrl: LAGOON_LEVEL_SOURCE.dashboardUrl,
  mode: "source-only",
} as const;
