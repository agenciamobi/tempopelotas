import Link from "next/link";
import { WeatherIcon } from "@/components/weather-icon";
import type { WeatherData } from "@/lib/weather-data";
import { getWeatherAdvisory } from "@/lib/weather-insights";

type WeatherHeroProps = {
  weather: WeatherData;
};

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="weather-hero-metric">
      <span>{label}</span>
      <strong>{value}</strong>
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
            Informação local para você <span>se preparar melhor.</span>
          </h1>
          <p className="weather-hero-description">
            Previsão do tempo, chuva, vento e situação das águas em uma leitura clara,
            atualizada e focada em Pelotas e na Zona Sul.
          </p>

          <div className="weather-hero-actions">
            <Link className="weather-hero-primary" href="/tempo-hoje-pelotas">
              Ver previsão de hoje
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
            <WeatherIcon name={current.icon} title={current.condition} />
          </div>

          <div className="weather-hero-temperature">
            <strong>{current.temperature}°</strong>
            <div>
              <span>{current.condition}</span>
              <small>Sensação de {current.feelsLike}°</small>
            </div>
          </div>

          <div className="weather-hero-metrics">
            <HeroMetric label="Umidade" value={`${current.humidity}%`} />
            <HeroMetric label="Vento" value={`${current.windSpeed} km/h`} />
            <HeroMetric label="Rajadas" value={`${current.windGust} km/h`} />
            <HeroMetric label="Visibilidade" value={`${current.visibility} km`} />
          </div>
        </div>
      </div>

      <div className="weather-hero-scroll">
        <span>Role para acompanhar</span>
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
