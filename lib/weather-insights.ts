import type { DailyForecast, WeatherData } from "@/lib/weather-data";

export type AdvisoryLevel = "normal" | "attention" | "warning";

export type WeatherAdvisory = {
  level: AdvisoryLevel;
  eyebrow: string;
  title: string;
  description: string;
  reasons: string[];
};

function maxBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce<T | undefined>((selected, item) => {
    if (!selected || selector(item) > selector(selected)) return item;
    return selected;
  }, undefined);
}

function minBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce<T | undefined>((selected, item) => {
    if (!selected || selector(item) < selector(selected)) return item;
    return selected;
  }, undefined);
}

export function formatMillimeters(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function getWeatherAdvisory(weather: WeatherData): WeatherAdvisory {
  const today = weather.daily[0];
  const maxHourlyGust = Math.max(
    weather.current.windGust,
    ...weather.hourly.map((hour) => hour.windGust),
  );
  const maxHourlyRainChance = Math.max(
    today?.rainChance ?? 0,
    ...weather.hourly.map((hour) => hour.precipitation),
  );
  const hasStormSignal =
    weather.current.icon === "storm" ||
    weather.hourly.some((hour) => hour.icon === "storm") ||
    today?.icon === "storm";
  const precipitation = today?.precipitation ?? 0;
  const reasons: string[] = [];

  if (hasStormSignal) reasons.push("há indicação de temporal na previsão");
  if (maxHourlyGust >= 50) reasons.push(`rajadas podem chegar a ${maxHourlyGust} km/h`);
  if (maxHourlyRainChance >= 70) reasons.push(`probabilidade de chuva chega a ${maxHourlyRainChance}%`);
  if (precipitation >= 25) reasons.push(`acumulado estimado de ${formatMillimeters(precipitation)} mm hoje`);

  if (hasStormSignal || maxHourlyGust >= 75 || precipitation >= 50) {
    return {
      level: "warning",
      eyebrow: "Atenção meteorológica",
      title: "Há indicativos automáticos de tempo severo",
      description:
        "A previsão aponta condições que exigem acompanhamento. Consulte também os avisos oficiais da Defesa Civil e do INMET.",
      reasons,
    };
  }

  if (maxHourlyGust >= 50 || maxHourlyRainChance >= 70 || precipitation >= 25) {
    return {
      level: "attention",
      eyebrow: "Condições sob monitoramento",
      title: "A previsão recomenda atenção nas próximas horas",
      description:
        "Os dados automáticos mostram chuva ou vento em níveis que merecem acompanhamento, embora isso não represente um alerta oficial.",
      reasons,
    };
  }

  return {
    level: "normal",
    eyebrow: "Leitura automática da previsão",
    title: "Sem indicativos automáticos de tempo severo",
    description:
      "A previsão disponível não atingiu os limites internos de atenção para chuva, rajadas ou temporal. Avisos oficiais podem mudar a qualquer momento.",
    reasons: [],
  };
}

export function getWeekHighlights(days: DailyForecast[]) {
  const hottest = maxBy(days, (day) => day.max);
  const coldest = minBy(days, (day) => day.min);
  const wettest = maxBy(days, (day) => day.precipitation);
  const windiest = maxBy(days, (day) => day.windGust);

  return { hottest, coldest, wettest, windiest };
}
