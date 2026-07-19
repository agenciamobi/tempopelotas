import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WeatherNavigation } from "@/components/weather-navigation";
import type { WeatherData } from "@/lib/weather-data";
import { getWeatherAdvisory } from "@/lib/weather-insights";

type ForecastPageShellProps = {
  weather: WeatherData;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  currentPath: string;
};

export function ForecastPageShell({
  weather,
  eyebrow,
  title,
  description,
  children,
  currentPath,
}: ForecastPageShellProps) {
  const advisoryLevel = getWeatherAdvisory(weather).level;

  return (
    <div className="site-shell">
      <SiteHeader advisoryLevel={advisoryLevel} />

      <main className="topic-page">
        <section className="topic-hero">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="topic-hero-status" aria-label="Tempo agora em Pelotas">
            <span>Atualizado em {weather.current.updatedAt}</span>
            <strong>{weather.current.temperature}°</strong>
            <small>{weather.current.condition}</small>
          </div>
        </section>

        {children}

        <WeatherNavigation currentPath={currentPath} />
      </main>

      <SiteFooter source={weather.source} />
    </div>
  );
}
