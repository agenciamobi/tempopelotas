export type WeatherIconName =
  | "sun"
  | "partly-cloudy"
  | "cloud"
  | "rain"
  | "storm"
  | "wind";

export type HourlyForecast = {
  time: string;
  temperature: number;
  precipitation: number;
  icon: WeatherIconName;
};

export type DailyForecast = {
  weekday: string;
  date: string;
  min: number;
  max: number;
  rainChance: number;
  icon: WeatherIconName;
};

export const currentWeather = {
  city: "Pelotas",
  state: "RS",
  temperature: 20,
  feelsLike: 20,
  condition: "Sol entre nuvens",
  humidity: 86,
  pressure: 1003,
  windSpeed: 12,
  windDirection: "NNE",
  visibility: 10,
  sunrise: "07:23",
  sunset: "17:47",
  updatedAt: "Demonstração visual",
  icon: "partly-cloudy" as WeatherIconName,
};

export const hourlyForecast: HourlyForecast[] = [
  { time: "Agora", temperature: 20, precipitation: 0, icon: "partly-cloudy" },
  { time: "16h", temperature: 20, precipitation: 10, icon: "partly-cloudy" },
  { time: "17h", temperature: 19, precipitation: 28, icon: "rain" },
  { time: "18h", temperature: 18, precipitation: 42, icon: "rain" },
  { time: "19h", temperature: 17, precipitation: 35, icon: "rain" },
  { time: "20h", temperature: 16, precipitation: 18, icon: "cloud" },
  { time: "21h", temperature: 16, precipitation: 8, icon: "cloud" },
];

export const dailyForecast: DailyForecast[] = [
  { weekday: "Hoje", date: "18 jul", min: 14, max: 20, rainChance: 38, icon: "partly-cloudy" },
  { weekday: "Dom", date: "19 jul", min: 13, max: 19, rainChance: 76, icon: "rain" },
  { weekday: "Seg", date: "20 jul", min: 12, max: 18, rainChance: 68, icon: "rain" },
  { weekday: "Ter", date: "21 jul", min: 11, max: 17, rainChance: 44, icon: "cloud" },
  { weekday: "Qua", date: "22 jul", min: 10, max: 18, rainChance: 18, icon: "partly-cloudy" },
  { weekday: "Qui", date: "23 jul", min: 12, max: 20, rainChance: 12, icon: "sun" },
  { weekday: "Sex", date: "24 jul", min: 13, max: 21, rainChance: 24, icon: "partly-cloudy" },
];

export const regionalWeather = [
  { city: "Pelotas", temperature: 20, condition: "partly-cloudy" as WeatherIconName, x: 61, y: 61 },
  { city: "Rio Grande", temperature: 19, condition: "cloud" as WeatherIconName, x: 74, y: 72 },
  { city: "Canguçu", temperature: 18, condition: "rain" as WeatherIconName, x: 45, y: 43 },
  { city: "São Lourenço", temperature: 19, condition: "partly-cloudy" as WeatherIconName, x: 62, y: 32 },
];
