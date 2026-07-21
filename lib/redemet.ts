import "server-only";

import type {
  RedemetBounds,
  RedemetImageFrame,
  RedemetImageLayerResponse,
  RedemetSatelliteType,
  RedemetStormFrame,
  RedemetStormLayerResponse,
} from "@/lib/redemet-types";

const DEFAULT_BASE_URL = "https://api-redemet.decea.mil.br/";
const PROVIDER = "REDEMET / DECEA" as const;
const TIMEZONE = "America/Sao_Paulo";
const IMAGE_PROXY_PATH = "/api/redemet/image";

const RADAR_AREA = process.env.REDEMET_RADAR_AREA?.trim() || "cn";
const RADAR_PRODUCT = process.env.REDEMET_RADAR_PRODUCT?.trim() || "maxcappi";

const SATELLITE_LABELS: Record<RedemetSatelliteType, string> = {
  realcada: "Satélite infravermelho realçado",
  ir: "Satélite infravermelho",
  vis: "Satélite visível",
};

type JsonRecord = Record<string, unknown>;

type RawImageFrame = {
  path: string;
  data: string | null;
  bounds: RedemetBounds | null;
  locality: string | null;
};

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function clampFrameCount(value: number, maximum: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(maximum, Math.round(value)));
}

function apiBaseUrl() {
  const configured = process.env.REDEMET_API_BASE_URL?.trim();
  return configured || DEFAULT_BASE_URL;
}

function apiKey() {
  return process.env.REDEMET_API_KEY?.trim() || null;
}

function buildApiUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(path.replace(/^\//, ""), apiBaseUrl().endsWith("/") ? apiBaseUrl() : `${apiBaseUrl()}/`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  return url;
}

async function fetchRedemet(path: string, params: Record<string, string | number | undefined>, revalidate: number) {
  const key = apiKey();
  if (!key) throw new Error("REDEMET_API_KEY não configurada");

  const response = await fetch(buildApiUrl(path, params), {
    headers: {
      Accept: "application/json",
      "X-Api-Key": key,
      "User-Agent": "TempoPelotas/1.0 (+https://tempopelotas.com.br)",
    },
    next: { revalidate },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`REDEMET respondeu com status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const root = asRecord(payload);

  if (root?.status === false) {
    throw new Error(asString(root.message) || "REDEMET informou indisponibilidade");
  }

  return payload;
}

function readBounds(record: JsonRecord | null): RedemetBounds | null {
  if (!record) return null;

  const west = asNumber(record.lon_min ?? record.longitude_min ?? record.west);
  const east = asNumber(record.lon_max ?? record.longitude_max ?? record.east);
  const south = asNumber(record.lat_min ?? record.latitude_min ?? record.south);
  const north = asNumber(record.lat_max ?? record.latitude_max ?? record.north);

  if (west === null || east === null || south === null || north === null) return null;
  if (west >= east || south >= north) return null;

  return { west, south, east, north };
}

function findFirstBounds(value: unknown): RedemetBounds | null {
  const record = asRecord(value);
  if (record) {
    const direct = readBounds(record);
    if (direct) return direct;

    for (const nested of Object.values(record)) {
      const found = findFirstBounds(nested);
      if (found) return found;
    }
  }

  if (Array.isArray(value)) {
    for (const nested of value) {
      const found = findFirstBounds(nested);
      if (found) return found;
    }
  }

  return null;
}

function collectImageFrames(value: unknown, inheritedBounds: RedemetBounds | null = null): RawImageFrame[] {
  const output: RawImageFrame[] = [];
  const record = asRecord(value);

  if (record) {
    const bounds = readBounds(record) ?? inheritedBounds;
    const path = asString(record.path ?? record.url ?? record.imagem);

    if (path && /^https:\/\//i.test(path)) {
      output.push({
        path,
        data: asString(record.data ?? record.date ?? record.datetime),
        bounds,
        locality: asString(record.localidade ?? record.area ?? record.codigo),
      });
    }

    for (const nested of Object.values(record)) {
      output.push(...collectImageFrames(nested, bounds));
    }
  } else if (Array.isArray(value)) {
    for (const nested of value) {
      output.push(...collectImageFrames(nested, inheritedBounds));
    }
  }

  return output;
}

function parseDate(value: string | null) {
  if (!value) return null;

  const normalized = value.includes("T")
    ? value
    : value.replace(" ", "T").replace(/--/g, "T");
  const withZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized)
    ? normalized
    : `${normalized}-03:00`;
  const date = new Date(withZone);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatFrameLabel(value: string | null, fallbackIndex: number) {
  const date = parseDate(value);

  if (date) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return value?.slice(-5) || `Quadro ${fallbackIndex + 1}`;
}

function proxyImageUrl(path: string) {
  return `${IMAGE_PROXY_PATH}?src=${encodeURIComponent(path)}`;
}

function normalizeImageFrames(raw: RawImageFrame[], fallbackBounds: RedemetBounds | null, area?: string) {
  const unique = new Map<string, RawImageFrame>();

  for (const frame of raw) {
    if (area && frame.locality && frame.locality.toLowerCase() !== area.toLowerCase()) continue;
    if (!frame.bounds && !fallbackBounds) continue;
    unique.set(frame.path, frame);
  }

  return [...unique.values()]
    .sort((a, b) => {
      const aTime = parseDate(a.data)?.getTime() ?? 0;
      const bTime = parseDate(b.data)?.getTime() ?? 0;
      return aTime - bTime;
    })
    .map<RedemetImageFrame>((frame, index) => ({
      id: `${index}-${frame.data ?? frame.path}`,
      label: formatFrameLabel(frame.data, index),
      observedAt: parseDate(frame.data)?.toISOString() ?? null,
      imageUrl: proxyImageUrl(frame.path),
      bounds: frame.bounds ?? fallbackBounds!,
    }));
}

function emptyImageLayer(product: string, sourceLabel: string, error: string): RedemetImageLayerResponse {
  return {
    configured: Boolean(apiKey()),
    available: false,
    provider: PROVIDER,
    product,
    sourceLabel,
    frames: [],
    currentIndex: 0,
    updatedAt: new Date().toISOString(),
    error,
  };
}

function emptyStormLayer(error: string): RedemetStormLayerResponse {
  return {
    configured: Boolean(apiKey()),
    available: false,
    provider: PROVIDER,
    product: "STSC — ocorrências de trovoada",
    sourceLabel: "Sistema de Tempo Severo Convectivo da REDEMET",
    frames: [],
    currentIndex: 0,
    updatedAt: new Date().toISOString(),
    error,
  };
}

function findProperty(value: unknown, property: string): unknown {
  const record = asRecord(value);

  if (record) {
    if (property in record) return record[property];

    for (const nested of Object.values(record)) {
      const found = findProperty(nested, property);
      if (found !== undefined) return found;
    }
  } else if (Array.isArray(value)) {
    for (const nested of value) {
      const found = findProperty(nested, property);
      if (found !== undefined) return found;
    }
  }

  return undefined;
}

function extractAnimationLabels(value: unknown) {
  const anima = findProperty(value, "anima");
  return Array.isArray(anima) ? anima.map(asString).filter((item): item is string => Boolean(item)) : [];
}

export async function getRedemetRadar(frameCount = 10): Promise<RedemetImageLayerResponse> {
  const framesRequested = clampFrameCount(frameCount, 15, 10);
  const product = `Radar meteorológico de Canguçu — ${RADAR_PRODUCT}`;
  const sourceLabel = "Radar de Canguçu / RS";

  if (!apiKey()) {
    return emptyImageLayer(product, sourceLabel, "Integração REDEMET aguardando configuração da chave.");
  }

  try {
    const payload = await fetchRedemet(
      `produtos/radar/${encodeURIComponent(RADAR_PRODUCT)}`,
      { area: RADAR_AREA, anima: framesRequested },
      180,
    );
    const fallbackBounds = findFirstBounds(payload);
    const frames = normalizeImageFrames(collectImageFrames(payload), fallbackBounds, RADAR_AREA).slice(-framesRequested);

    if (!frames.length) {
      return emptyImageLayer(product, sourceLabel, "A REDEMET não retornou imagens recentes do radar de Canguçu.");
    }

    return {
      configured: true,
      available: true,
      provider: PROVIDER,
      product,
      sourceLabel,
      frames,
      currentIndex: frames.length - 1,
      updatedAt: frames.at(-1)?.observedAt ?? new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    console.error("[redemet] Falha ao consultar radar:", error);
    return emptyImageLayer(product, sourceLabel, "Radar REDEMET temporariamente indisponível.");
  }
}

export async function getRedemetSatellite(
  type: RedemetSatelliteType = "realcada",
  frameCount = 10,
): Promise<RedemetImageLayerResponse> {
  const framesRequested = clampFrameCount(frameCount, 15, 10);
  const product = SATELLITE_LABELS[type];
  const sourceLabel = "Satélite meteorológico REDEMET";

  if (!apiKey()) {
    return emptyImageLayer(product, sourceLabel, "Integração REDEMET aguardando configuração da chave.");
  }

  try {
    const payload = await fetchRedemet(
      `produtos/satelite/${type}`,
      { anima: framesRequested },
      300,
    );
    const fallbackBounds = findFirstBounds(payload);
    const frames = normalizeImageFrames(collectImageFrames(payload), fallbackBounds).slice(-framesRequested);

    if (!frames.length) {
      return emptyImageLayer(product, sourceLabel, "A REDEMET não retornou imagens recentes de satélite.");
    }

    return {
      configured: true,
      available: true,
      provider: PROVIDER,
      product,
      sourceLabel,
      frames,
      currentIndex: frames.length - 1,
      updatedAt: frames.at(-1)?.observedAt ?? new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    console.error("[redemet] Falha ao consultar satélite:", error);
    return emptyImageLayer(product, sourceLabel, "Satélite REDEMET temporariamente indisponível.");
  }
}

function extractStormFrames(value: unknown) {
  const rawFrames = findProperty(value, "stsc");
  const labels = extractAnimationLabels(value);

  if (!Array.isArray(rawFrames)) return [];

  return rawFrames.map<RedemetStormFrame>((rawFrame, frameIndex) => {
    const candidates = Array.isArray(rawFrame) ? rawFrame : [];
    const points = candidates
      .map((candidate) => {
        const record = asRecord(candidate);
        const latitude = asNumber(record?.la ?? record?.lat ?? record?.latitude);
        const longitude = asNumber(record?.lo ?? record?.lon ?? record?.longitude);

        if (latitude === null || longitude === null) return null;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
        return { latitude, longitude };
      })
      .filter((point): point is { latitude: number; longitude: number } => Boolean(point));
    const label = labels[frameIndex] || `Quadro ${frameIndex + 1}`;

    return {
      id: `${frameIndex}-${label}`,
      label,
      observedAt: null,
      points,
    };
  });
}

export async function getRedemetStorms(frameCount = 20): Promise<RedemetStormLayerResponse> {
  const framesRequested = clampFrameCount(frameCount, 60, 20);

  if (!apiKey()) {
    return emptyStormLayer("Integração REDEMET aguardando configuração da chave.");
  }

  try {
    const payload = await fetchRedemet("produtos/stsc", { anima: framesRequested }, 120);
    const frames = extractStormFrames(payload).slice(-framesRequested);

    if (!frames.length) {
      return emptyStormLayer("A REDEMET não retornou quadros recentes de trovoadas.");
    }

    return {
      configured: true,
      available: true,
      provider: PROVIDER,
      product: "STSC — ocorrências de trovoada",
      sourceLabel: "Sistema de Tempo Severo Convectivo da REDEMET",
      frames,
      currentIndex: frames.length - 1,
      updatedAt: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    console.error("[redemet] Falha ao consultar trovoadas:", error);
    return emptyStormLayer("Monitoramento de trovoadas REDEMET temporariamente indisponível.");
  }
}

export function isAllowedRedemetImageUrl(value: string) {
  try {
    const url = new URL(value);
    const allowedHosts = new Set([
      "estatico-redemet.decea.mil.br",
      "redemet.decea.mil.br",
      "redemet.decea.gov.br",
    ]);

    return url.protocol === "https:" && allowedHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
