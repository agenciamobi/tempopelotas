import "server-only";

export const LAGOON_MONITORING_SOURCE_URL =
  "https://monitoramentolagoadospatos.com.br/";

const REVALIDATE_SECONDS = 300;
const REQUEST_TIMEOUT_MS = 10_000;
const STALE_AFTER_MINUTES = 180;

export type LagoonMonitoringStationDefinition = {
  id: string;
  name: string;
  city: string;
  role: string;
  floodLevelCm: number;
  may2024MaximumCm: number;
};

export type LagoonMonitoringObservationStatus =
  | "live"
  | "stale"
  | "unavailable";

export type LagoonMonitoringRisk =
  | "normal"
  | "attention"
  | "flooding"
  | "unavailable";

export type LagoonMonitoringObservation = {
  station: LagoonMonitoringStationDefinition;
  status: LagoonMonitoringObservationStatus;
  risk: LagoonMonitoringRisk;
  currentLevelCm: number | null;
  updatedAt: string | null;
  floodLevelCm: number;
  may2024MaximumCm: number;
  distanceToFloodCm: number | null;
  floodThresholdPercentage: number | null;
  error: string | null;
};

export type LagoonMonitoringNetworkData = {
  status: "live" | "partial" | "stale" | "unavailable";
  available: number;
  total: number;
  latestUpdatedAt: string | null;
  observations: LagoonMonitoringObservation[];
  source: {
    name: string;
    organizations: string;
    url: string;
    reference: string;
    fetchedAt: string;
  };
  error: string | null;
};

export const LAGOON_MONITORING_STATIONS: LagoonMonitoringStationDefinition[] = [
  {
    id: "furg-ccmar",
    name: "FURG CCMAR",
    city: "Rio Grande / RS",
    role: "Acompanha o estuário e a saída da Lagoa dos Patos para o oceano.",
    floodLevelCm: 80,
    may2024MaximumCm: 218,
  },
  {
    id: "sao-lourenco-do-sul",
    name: "São Lourenço do Sul",
    city: "São Lourenço do Sul / RS",
    role: "Ajuda a observar a margem oeste da lagoa entre Arambaré e Pelotas.",
    floodLevelCm: 148,
    may2024MaximumCm: 284,
  },
  {
    id: "arambare",
    name: "Arambaré",
    city: "Arambaré / RS",
    role: "Mostra a propagação dos níveis pela região centro-oeste da lagoa.",
    floodLevelCm: 225,
    may2024MaximumCm: 286,
  },
  {
    id: "sao-jose-do-norte",
    name: "São José do Norte",
    city: "São José do Norte / RS",
    role: "Complementa a leitura do estuário no lado oposto a Rio Grande.",
    floodLevelCm: 108,
    may2024MaximumCm: 226,
  },
  {
    id: "itapua",
    name: "Itapuã",
    city: "Viamão / RS",
    role: "Acompanha a porção norte da lagoa, próxima à comunicação com o Guaíba.",
    floodLevelCm: 280,
    may2024MaximumCm: 318,
  },
];

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x")) {
      const codePoint = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    }

    if (entity.startsWith("#")) {
      const codePoint = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    }

    return named[entity.toLowerCase()] ?? match;
  });
}

function decodeEscapedText(value: string) {
  return value
    .replace(/\\u([\da-f]{4})/gi, (_, hexadecimal: string) =>
      String.fromCharCode(Number.parseInt(hexadecimal, 16)),
    )
    .replace(/\\x([\da-f]{2})/gi, (_, hexadecimal: string) =>
      String.fromCharCode(Number.parseInt(hexadecimal, 16)),
    )
    .replace(/\\[nrt]/g, " ")
    .replace(/\\"/g, '"')
    .replace(/\\\//g, "/");
}

function htmlToSearchableText(html: string) {
  return decodeEntities(decodeEscapedText(html))
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}\[\]"|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value: string | undefined) {
  if (!value) return null;

  const compact = value.trim().replace(/\s/g, "");
  const normalized = compact.includes(",")
    ? compact.replace(/\./g, "").replace(",", ".")
    : compact;
  const parsed = Number(normalized);

  return Number.isFinite(parsed) && parsed > -500 && parsed < 5_000
    ? parsed
    : null;
}

function parseUpdatedAt(segment: string) {
  const brazilian = segment.match(
    /Última atualização\s*:?\s*(\d{2}\/\d{2}\/\d{4})\s*,?\s*(\d{2}:\d{2}(?::\d{2})?)/i,
  );

  if (brazilian) {
    const [day, month, year] = brazilian[1].split("/");
    const clock = brazilian[2].length === 5 ? `${brazilian[2]}:00` : brazilian[2];
    const parsed = new Date(`${year}-${month}-${day}T${clock}-03:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  const iso = segment.match(
    /(20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2}))/i,
  );
  if (!iso) return null;

  const parsed = new Date(iso[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function stationUnavailable(
  station: LagoonMonitoringStationDefinition,
  error: string,
): LagoonMonitoringObservation {
  return {
    station,
    status: "unavailable",
    risk: "unavailable",
    currentLevelCm: null,
    updatedAt: null,
    floodLevelCm: station.floodLevelCm,
    may2024MaximumCm: station.may2024MaximumCm,
    distanceToFloodCm: null,
    floodThresholdPercentage: null,
    error,
  };
}

function parseStation(
  text: string,
  station: LagoonMonitoringStationDefinition,
  nextStationName: string | null,
  fetchedAt: Date,
): LagoonMonitoringObservation {
  const start = text.indexOf(station.name);
  if (start === -1) {
    return stationUnavailable(station, "A estação não foi encontrada na página da fonte.");
  }

  const next = nextStationName
    ? text.indexOf(nextStationName, start + station.name.length)
    : -1;
  const segment = text.slice(start, next > start ? next : start + 2_500);
  const currentLevel = parseNumber(
    segment.match(/Cota Atual\s*([+-]?\d+(?:[.,]\d+)?)\s*cm/i)?.[1],
  );
  const updatedAt = parseUpdatedAt(segment);
  const parsedFloodLevel = parseNumber(
    segment.match(/Cota de Inundação\s*:?\s*([+-]?\d+(?:[.,]\d+)?)\s*cm/i)?.[1],
  );
  const parsedMaximum = parseNumber(
    segment.match(/Máx\.?\s*Maio\/2024\s*:?\s*([+-]?\d+(?:[.,]\d+)?)\s*cm/i)?.[1],
  );

  if (currentLevel === null || !updatedAt) {
    return stationUnavailable(
      station,
      "A fonte foi carregada, mas a leitura atual não pôde ser interpretada.",
    );
  }

  const floodLevelCm = parsedFloodLevel ?? station.floodLevelCm;
  const may2024MaximumCm = parsedMaximum ?? station.may2024MaximumCm;
  const distanceToFloodCm = round(floodLevelCm - currentLevel);
  const floodThresholdPercentage = round((currentLevel / floodLevelCm) * 100);
  const ageMinutes = Math.max(
    0,
    (fetchedAt.getTime() - new Date(updatedAt).getTime()) / 60_000,
  );
  const status: LagoonMonitoringObservationStatus =
    ageMinutes > STALE_AFTER_MINUTES ? "stale" : "live";
  const risk: LagoonMonitoringRisk =
    currentLevel >= floodLevelCm
      ? "flooding"
      : currentLevel >= floodLevelCm * 0.85
        ? "attention"
        : "normal";

  return {
    station,
    status,
    risk,
    currentLevelCm: round(currentLevel),
    updatedAt,
    floodLevelCm: round(floodLevelCm),
    may2024MaximumCm: round(may2024MaximumCm),
    distanceToFloodCm,
    floodThresholdPercentage,
    error: status === "stale" ? "A última leitura publicada está atrasada." : null,
  };
}

function buildNetwork(
  observations: LagoonMonitoringObservation[],
  fetchedAt: Date,
  error: string | null = null,
): LagoonMonitoringNetworkData {
  const availableObservations = observations.filter(
    (observation) => observation.currentLevelCm !== null,
  );
  const live = availableObservations.filter(
    (observation) => observation.status === "live",
  ).length;
  const latestUpdatedAt =
    availableObservations
      .map((observation) => observation.updatedAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null;

  let status: LagoonMonitoringNetworkData["status"] = "unavailable";
  if (live === observations.length) status = "live";
  else if (live > 0) status = "partial";
  else if (availableObservations.length > 0) status = "stale";

  return {
    status,
    available: availableObservations.length,
    total: observations.length,
    latestUpdatedAt,
    observations,
    source: {
      name: "Rede de Monitoramento do Nível da Lagoa dos Patos",
      organizations: "FURG & Portos RS",
      url: LAGOON_MONITORING_SOURCE_URL,
      reference: "Referencial vertical brasileiro — Marégrafo de Imbituba/SC",
      fetchedAt: fetchedAt.toISOString(),
    },
    error,
  };
}

export function normalizeLagoonMonitoringHtml(
  html: string,
  fetchedAt = new Date(),
): LagoonMonitoringNetworkData {
  const text = htmlToSearchableText(html);
  const observations = LAGOON_MONITORING_STATIONS.map((station, index) =>
    parseStation(
      text,
      station,
      LAGOON_MONITORING_STATIONS[index + 1]?.name ?? null,
      fetchedAt,
    ),
  );

  return buildNetwork(observations, fetchedAt);
}

export async function getLagoonMonitoringNetwork(): Promise<LagoonMonitoringNetworkData> {
  const fetchedAt = new Date();

  try {
    const response = await fetch(LAGOON_MONITORING_SOURCE_URL, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "TEMPO-Pelotas/1.0 (+https://tempopelotas.agenciamobi.com.br)",
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`A fonte respondeu com status ${response.status}`);
    }

    const html = await response.text();
    if (html.length < 200) {
      throw new Error("A fonte devolveu uma página sem conteúdo suficiente.");
    }

    return normalizeLagoonMonitoringHtml(html, fetchedAt);
  } catch (error) {
    console.error("Falha ao consultar a rede da Lagoa dos Patos:", error);
    return buildNetwork(
      LAGOON_MONITORING_STATIONS.map((station) =>
        stationUnavailable(
          station,
          "A leitura desta estação está temporariamente indisponível.",
        ),
      ),
      fetchedAt,
      "A Rede de Monitoramento da Lagoa dos Patos está temporariamente indisponível.",
    );
  }
}

export const LAGOON_MONITORING_CONFIG = {
  revalidateSeconds: REVALIDATE_SECONDS,
  staleAfterMinutes: STALE_AFTER_MINUTES,
  sourceUrl: LAGOON_MONITORING_SOURCE_URL,
} as const;
