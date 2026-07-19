import Link from "next/link";
import type { ReactNode } from "react";
import { WeatherIcon } from "@/components/weather-icon";
import type { WeatherData } from "@/lib/weather-data";
import { getWeatherAdvisory } from "@/lib/weather-insights";

type WeatherHeroProps = {
  weather: WeatherData;
};

type HeroMetricIcon = "humidity" | "wind" | "gust" | "visibility";

function HeroMetricIcon({ name }: { name: HeroMetricIcon }) {
  const paths = {
    humidity: <path d="M12 3.2S6.8 9.3 6.8 13.7a5.2 5.2 0 0 0 10.4 0C17.2 9.3 12 3.2 12 3.2Z" />,
    wind: <path d="M3 8h10.5c3.8 0 3.8-5.5.2-5.5-1.9 0-2.9 1-2.9 2.8M3 13h15.5c3.8 0 3.8 6.5.2 6.5-1.9 0-2.9-1-2.9-2.8M3 18h7.5" />,
    gust: <path d="M4 7.5h10.8M4 12h16M4 16.5h12.5M17.5 5.2l2.5 2.3-2.5 2.3" />,
    visibility: <path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Zm9.5-2.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />,
  } satisfies Record<HeroMetricIcon, ReactNode>;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: HeroMetricIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="weather-hero-metric">
      <HeroMetricIcon name={icon} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export function WeatherHero({ weather }: WeatherHeroProps) {
  const { current } = weather;
  const advisory = getWeatherAdvisory(weather);

  return (
    <section className="weather-hero" aria-labelledby="weather-hero-title">
      <div className="weather-hero-photo" aria-hidden="true" />
      <div className="weather-hero-overlay" aria-hidden="true" />
      <div className="weather-hero-orbit weather-hero-orbit--one" aria-hidden="true" />
      <div className="weather-hero-orbit weather-hero-orbit--two" aria-hidden="true" />

      <div className="weather-hero-content">
        <div className="weather-hero-copy">
          <span className={`weather-hero-status weather-hero-status--${advisory.level}`}>
            <i aria-hidden="true" />
            {advisory.level === "normal" ? "Condições monitoradas" : advisory.eyebrow}
          </span>

          <p className="weather-hero-kicker">Tempo agora em Pelotas</p>
          <h1 id="weather-hero-title">
            O tempo de Pelotas. <span>Clareza para se preparar.</span>
          </h1>
          <p className="weather-hero-description">
            Previsão, chuva, vento e situação das águas em uma leitura local,
            objetiva e atualizada para Pelotas e a Zona Sul.
          </p>

          <div className="weather-hero-actions">
            <Link className="weather-hero-primary" href="/tempo-hoje-pelotas">
              Ver previsão completa
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="weather-hero-secondary" href="/alertas">
              Consultar alertas
            </Link>
          </div>
        </div>

        <div className="weather-hero-now" aria-label="Condição meteorológica atual em Pelotas">
          <div className="weather-hero-now-heading">
            <div>
              <span>Pelotas, RS</span>
              <small>Atualizado em {current.updatedAt}</small>
            </div>
            <span className="weather-hero-live"><i aria-hidden="true" /> Agora</span>
          </div>

          <div className="weather-hero-visual">
            <div className="weather-hero-icon">
              <WeatherIcon name={current.icon} title={current.condition} />
            </div>

            <div className="weather-hero-temperature">
              <strong>{current.temperature}°</strong>
              <div>
                <span>{current.condition}</span>
                <small>Sensação de {current.feelsLike}°</small>
              </div>
            </div>
          </div>

          <div className="weather-hero-metrics">
            <HeroMetric icon="humidity" label="Umidade" value={`${current.humidity}%`} />
            <HeroMetric icon="wind" label="Vento" value={`${current.windSpeed} km/h`} />
            <HeroMetric icon="gust" label="Rajadas" value={`${current.windGust} km/h`} />
            <HeroMetric icon="visibility" label="Visibilidade" value={`${current.visibility} km`} />
          </div>
        </div>
      </div>

      <div className="weather-hero-scroll">
        <span>Continue para acompanhar</span>
        <i aria-hidden="true">↓</i>
      </div>

      <a
        className="weather-hero-credit"
        href="https://commons.wikimedia.org/wiki/File:Amanhecer_na_Praia_do_Laranjal.jpg"
        target="_blank"
        rel="noreferrer"
      >
        Foto: Sebastian2112 / CC BY-SA 4.0
      </a>
    </section>
  );
}
