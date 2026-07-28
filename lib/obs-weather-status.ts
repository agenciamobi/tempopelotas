import type { WeatherIconName } from "@/lib/weather-data";
import { getPelotasWeatherWithObservation } from "@/lib/weather-service";

export type ObsWeatherStatusData = {
  status: "live" | "unavailable";
  temperature: number | null;
  condition: string;
  icon: WeatherIconName;
  updatedAt: string;
};

const conditionLabels: Record<WeatherIconName, string> = {
  sun: "Ensolarado",
  moon: "Céu limpo",
  "partly-cloudy": "Parcialmente nublado",
  "partly-cloudy-night": "Parcialmente nublado",
  cloud: "Nublado",
  rain: "Chuva",
  storm: "Trovoadas",
  wind: "Ventoso",
};

export async function getObsWeatherStatus(): Promise<ObsWeatherStatusData> {
  const { weather, observation } = await getPelotasWeatherWithObservation();
  const measuredTemperature = observation.current.temperature;

  if (
    weather.current.source.kind !== "observation" ||
    observation.status === "unavailable" ||
    measuredTemperature === null
  ) {
    return {
      status: "unavailable",
      temperature: null,
      condition: "Indisponível",
      icon: "cloud",
      updatedAt: observation.source.fetchedAt,
    };
  }

  const icon = weather.current.icon ?? "cloud";

  return {
    status: "live",
    temperature: Math.round(measuredTemperature),
    condition: conditionLabels[icon],
    icon,
    updatedAt: observation.source.observationTime ?? observation.source.fetchedAt,
  };
}
