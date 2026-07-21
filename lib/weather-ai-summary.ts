import { unstable_cache } from "next/cache";
import type {
  DailyForecast,
  WeatherData,
  WeatherIconName,
} from "@/lib/weather-data";

export type ForecastNarrative = {
  headline: string;
  summary: string;
};

export type WeatherAiSummaries = {
  status: "generated" | "unavailable";
  today: ForecastNarrative | null;
  tomorrow: ForecastNarrative | null;
  generatedAt: string | null;
  model: string | null;
};

type SummaryPayload = {
  city: string;
  current: {
    condition: string;
    temperatureC: number;
    feelsLikeC: number;
    humidityPercent: number;
    windSpeedKmh: number;
    windGustKmh: number;
    windDirection: string;
  };
  today: ForecastDayPayload;
  tomorrow: ForecastDayPayload;
  nextHours: Array<{
    time: string;
    temperatureC: number;
    rainChancePercent: number;
    windSpeedKmh: number;
    windGustKmh: number;
    condition: string;
  }>;
};

type ForecastDayPayload = {
  label: string;
  date: string;
  condition: string;
  minimumC: number;
  maximumC: number;
  rainChancePercent: number;
  rainVolumeMm: number;
  maximumWindGustKmh: number;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const conditionLabels: Record<WeatherIconName, string> = {
  sun: "predomínio de sol",
  moon: "céu limpo durante a noite",
  "partly-cloudy": "sol entre nuvens",
  "partly-cloudy-night": "noite parcialmente nublada",
  cloud: "céu nublado",
  rain: "chuva",
  storm: "risco de temporal",
  wind: "vento forte",
};

const blockedClaims = [
  /vai inundar/i,
  /sem risco/i,
  /não há risco/i,
  /está seguro/i,
  /sem perigo/i,
  /previsão oficial/i,
  /garantid[oa]/i,
  /com certeza/i,
  /evacue/i,
  /abandone sua casa/i,
];

function unavailableSummaries(): WeatherAiSummaries {
  return {
    status: "unavailable",
    today: null,
    tomorrow: null,
    generatedAt: null,
    model: null,
  };
}

function dayPayload(day: DailyForecast): ForecastDayPayload {
  return {
    label: day.weekday,
    date: day.date,
    condition: conditionLabels[day.icon],
    minimumC: day.min,
    maximumC: day.max,
    rainChancePercent: day.rainChance,
    rainVolumeMm: day.precipitation,
    maximumWindGustKmh: day.windGust,
  };
}

function buildPayload(weather: WeatherData): SummaryPayload | null {
  const today = weather.daily[0];
  const tomorrow = weather.daily[1];

  if (!today || !tomorrow || weather.source.isFallback) return null;

  return {
    city: `${weather.current.city}, ${weather.current.state}`,
    current: {
      condition: weather.current.condition,
      temperatureC: weather.current.temperature,
      feelsLikeC: weather.current.feelsLike,
      humidityPercent: weather.current.humidity,
      windSpeedKmh: weather.current.windSpeed,
      windGustKmh: weather.current.windGust,
      windDirection: weather.current.windDirection,
    },
    today: dayPayload(today),
    tomorrow: dayPayload(tomorrow),
    nextHours: weather.hourly.slice(0, 12).map((hour) => ({
      time: hour.time,
      temperatureC: hour.temperature,
      rainChancePercent: hour.precipitation,
      windSpeedKmh: hour.windSpeed,
      windGustKmh: hour.windGust,
      condition: conditionLabels[hour.icon],
    })),
  };
}

function cleanText(value: unknown, maximumLength: number) {
  if (typeof value !== "string") return null;

  const text = value
    .replace(/```(?:json)?/gi, "")
    .replace(/[*_#`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text || text.length > maximumLength) return null;
  if (/\d/.test(text)) return null;
  if (blockedClaims.some((claim) => claim.test(text))) return null;

  return text;
}

function parseNarrative(value: unknown): ForecastNarrative | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const headline = cleanText(candidate.headline, 90);
  const summary = cleanText(candidate.summary, 430);

  if (!headline || !summary) return null;
  if (summary.split(/\s+/).length < 18) return null;

  return { headline, summary };
}

function extractResponseText(response: GeminiGenerateContentResponse) {
  return response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
}

function parseModelResponse(text: string) {
  const normalized = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(normalized) as Record<string, unknown>;
  const today = parseNarrative(parsed.today);
  const tomorrow = parseNarrative(parsed.tomorrow);

  if (!today || !tomorrow) return null;
  return { today, tomorrow };
}

function buildPrompt(payload: SummaryPayload) {
  return [
    "Você é o editor meteorológico automático do portal TEMPO Pelotas.",
    "Produza dois resumos curtos em português do Brasil: um para hoje e outro para amanhã.",
    "Use exclusivamente os fatos contidos no JSON fornecido.",
    "O resumo de hoje pode considerar a condição atual, o consolidado diário e os próximos horários.",
    "O resumo de amanhã deve considerar somente o consolidado do próximo dia.",
    "Não mencione hidrologia, Lagoa dos Patos, cotas, enchentes ou níveis de rios.",
    "Não dê ordens, garantias, recomendações de emergência ou afirmações de segurança.",
    "Não escreva algarismos, unidades ou medições no texto; os números serão exibidos separadamente na interface.",
    "Destaque apenas tendência de chuva, variação térmica, condição predominante e vento quando forem relevantes.",
    "Cada headline deve ter entre três e nove palavras.",
    "Cada summary deve ter entre trinta e sessenta palavras, sem markdown.",
    "Responda somente com JSON válido neste formato:",
    '{"today":{"headline":"...","summary":"..."},"tomorrow":{"headline":"...","summary":"..."}}',
    "Dados:",
    JSON.stringify(payload),
  ].join("\n");
}

const generateCachedSummaries = unstable_cache(
  async (payloadJson: string, model: string): Promise<WeatherAiSummaries> => {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return unavailableSummaries();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      const payload = JSON.parse(payloadJson) as SummaryPayload;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: buildPrompt(payload) }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 650,
              responseMimeType: "application/json",
            },
          }),
          cache: "no-store",
          signal: controller.signal,
        },
      );

      if (!response.ok) return unavailableSummaries();

      const body = (await response.json()) as GeminiGenerateContentResponse;
      const text = extractResponseText(body);
      if (!text) return unavailableSummaries();

      const parsed = parseModelResponse(text);
      if (!parsed) return unavailableSummaries();

      return {
        status: "generated",
        today: parsed.today,
        tomorrow: parsed.tomorrow,
        generatedAt: new Date().toISOString(),
        model,
      };
    } catch {
      return unavailableSummaries();
    } finally {
      clearTimeout(timeout);
    }
  },
  ["weather-ai-summaries-v1"],
  { revalidate: 1_800 },
);

export async function getWeatherAiSummaries(
  weather: WeatherData,
): Promise<WeatherAiSummaries> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const payload = buildPayload(weather);

  if (!apiKey || !payload) return unavailableSummaries();

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  return generateCachedSummaries(JSON.stringify(payload), model);
}
