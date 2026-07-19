import type { Metadata } from "next";
import Link from "next/link";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { formatMillimeters, getWeatherAdvisory } from "@/lib/weather-insights";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Condições de atenção para chuva e vento em Pelotas",
  description:
    "Veja sinais de chuva forte, temporal e rajadas em Pelotas e consulte orientações de segurança.",
  alternates: { canonical: "/alertas" },
  openGraph: {
    title: "Condições de atenção em Pelotas",
    description:
      "Acompanhe chuva, vento e temporais previstos para Pelotas, RS.",
    url: "/alertas",
  },
};

export default async function AlertasPage() {
  const weather = await getPelotasWeather();
  const advisory = getWeatherAdvisory(weather);
  const today = weather.daily[0];
  const maxHourlyRain = Math.max(
    today?.rainChance ?? 0,
    ...weather.hourly.map((hour) => hour.precipitation),
  );
  const maxHourlyGust = Math.max(
    weather.current.windGust,
    ...weather.hourly.map((hour) => hour.windGust),
  );

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Atenção ao tempo"
      title="Condições de atenção em Pelotas"
      description="Veja quando a previsão indica chuva forte, temporal ou vento intenso. Esta página ajuda no acompanhamento, mas não substitui os avisos oficiais."
      currentPath="/alertas"
    >
      <section className={`advisory-panel advisory-panel--${advisory.level}`} aria-labelledby="advisory-title">
        <div className="advisory-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3Zm0 6v5m0 3v.01" /></svg>
        </div>
        <div>
          <span className="eyebrow">{advisory.eyebrow}</span>
          <h2 id="advisory-title">{advisory.title}</h2>
          <p>{advisory.description}</p>
          {advisory.reasons.length ? (
            <ul>
              {advisory.reasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="topic-metrics" aria-label="Informações usadas nesta avaliação">
        <article>
          <span>Maior chance de chuva</span>
          <strong>{maxHourlyRain}%</strong>
          <small>Hoje e próximas horas</small>
        </article>
        <article>
          <span>Volume de chuva previsto</span>
          <strong>{formatMillimeters(today?.precipitation ?? 0)} mm</strong>
          <small>Para hoje</small>
        </article>
        <article>
          <span>Rajada mais forte prevista</span>
          <strong>{maxHourlyGust} km/h</strong>
          <small>Agora e próximas horas</small>
        </article>
        <article>
          <span>Tempo agora</span>
          <strong>{weather.current.temperature}°C</strong>
          <small>{weather.current.condition}</small>
        </article>
      </section>

      <section className="lagoon-alert-card" aria-label="Nível da Lagoa dos Patos">
        <span aria-hidden="true">≋</span>
        <div>
          <strong>Nível da Lagoa dos Patos no Laranjal</strong>
          <small>
            Veja se o nível está subindo ou baixando e compare com vento, chuva e avisos oficiais.
          </small>
        </div>
        <Link href="/nivel-da-lagoa-dos-patos-laranjal">Ver medidor</Link>
      </section>

      <section className="topic-section" aria-labelledby="monitoring-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Como classificamos a atenção</span>
            <h2 id="monitoring-title">O que significa cada situação</h2>
          </div>
          <p>Esta classificação organiza as informações da previsão. Ela não é um alerta emitido pela Defesa Civil ou pelo INMET.</p>
        </div>
        <div className="threshold-grid">
          <article>
            <span className="threshold-dot threshold-dot--normal" aria-hidden="true" />
            <h3>Sem sinal importante no momento</h3>
            <p>A previsão não mostra temporal, chuva muito volumosa ou rajadas fortes para o período analisado.</p>
          </article>
          <article>
            <span className="threshold-dot threshold-dot--attention" aria-hidden="true" />
            <h3>Atenção</h3>
            <p>Há chance alta de chuva, volume mais elevado ou rajadas que merecem acompanhamento.</p>
          </article>
          <article>
            <span className="threshold-dot threshold-dot--warning" aria-hidden="true" />
            <h3>Atenção redobrada</h3>
            <p>A previsão mostra temporal, chuva muito volumosa ou rajadas fortes. Consulte imediatamente os avisos oficiais.</p>
          </article>
        </div>
      </section>

      <section className="topic-section topic-copy" aria-labelledby="official-alerts-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Segurança</span>
            <h2 id="official-alerts-title">Siga sempre os avisos oficiais</h2>
          </div>
        </div>
        <div className="copy-columns">
          <div>
            <h3>Defesa Civil</h3>
            <p>Em situações de risco, siga as orientações da Defesa Civil do Rio Grande do Sul e da Defesa Civil de Pelotas.</p>
          </div>
          <div>
            <h3>INMET e autoridades locais</h3>
            <p>Consulte os avisos oficiais e evite deslocamentos ou atividades externas quando houver recomendação de segurança.</p>
          </div>
        </div>
        <p className="data-note">
          A ausência de aviso nesta página não garante ausência de risco. Confira os canais oficiais sempre que o tempo estiver instável.
        </p>
      </section>
    </ForecastPageShell>
  );
}
