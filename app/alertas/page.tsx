import type { Metadata } from "next";
import Link from "next/link";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { formatMillimeters, getWeatherAdvisory } from "@/lib/weather-insights";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Alertas meteorológicos e condições de atenção em Pelotas",
  description:
    "Acompanhe indicativos automáticos de chuva intensa, temporal e rajadas de vento em Pelotas e consulte orientações de segurança.",
  alternates: { canonical: "/alertas" },
  openGraph: {
    title: "Alertas meteorológicos em Pelotas",
    description:
      "Leitura automática das condições de chuva, vento e temporal para Pelotas, RS.",
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
      eyebrow="Monitoramento meteorológico"
      title="Alertas e condições de atenção em Pelotas"
      description="Uma leitura automática da previsão para destacar chuva intensa, temporais e vento forte. Não substitui alertas emitidos por órgãos oficiais."
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

      <section className="topic-metrics" aria-label="Indicadores usados na análise automática">
        <article>
          <span>Chance máxima de chuva</span>
          <strong>{maxHourlyRain}%</strong>
          <small>Hoje e próximas horas</small>
        </article>
        <article>
          <span>Acumulado estimado</span>
          <strong>{formatMillimeters(today?.precipitation ?? 0)} mm</strong>
          <small>Previsão para hoje</small>
        </article>
        <article>
          <span>Maior rajada próxima</span>
          <strong>{maxHourlyGust} km/h</strong>
          <small>Agora e previsão horária</small>
        </article>
        <article>
          <span>Condição atual</span>
          <strong>{weather.current.temperature}°C</strong>
          <small>{weather.current.condition}</small>
        </article>
      </section>

      <section className="lagoon-alert-card" aria-label="Monitoramento do nível da lagoa">
        <span aria-hidden="true">≋</span>
        <div>
          <strong>Nível da Lagoa dos Patos — Estação Laranjal</strong>
          <small>
            Consulte o painel público do LabHidroSens / UFPel como informação complementar.
          </small>
        </div>
        <Link href="/nivel-da-lagoa-dos-patos-laranjal">Ver medidor</Link>
      </section>

      <section className="topic-section" aria-labelledby="monitoring-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Critérios internos</span>
            <h2 id="monitoring-title">Como funciona a leitura automática</h2>
          </div>
          <p>Os limites servem apenas para organizar a atenção do usuário e não possuem caráter oficial.</p>
        </div>
        <div className="threshold-grid">
          <article>
            <span className="threshold-dot threshold-dot--normal" aria-hidden="true" />
            <h3>Condição normal</h3>
            <p>Sem temporal indicado, chuva acumulada abaixo de 25 mm e rajadas abaixo de 50 km/h.</p>
          </article>
          <article>
            <span className="threshold-dot threshold-dot--attention" aria-hidden="true" />
            <h3>Atenção</h3>
            <p>Probabilidade de chuva a partir de 70%, acumulado de 25 mm ou rajadas de 50 km/h.</p>
          </article>
          <article>
            <span className="threshold-dot threshold-dot--warning" aria-hidden="true" />
            <h3>Indicativo severo</h3>
            <p>Temporal no modelo, acumulado a partir de 50 mm ou rajadas de 75 km/h.</p>
          </article>
        </div>
      </section>

      <section className="topic-section topic-copy" aria-labelledby="official-alerts-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Segurança</span>
            <h2 id="official-alerts-title">Priorize sempre os alertas oficiais</h2>
          </div>
        </div>
        <div className="copy-columns">
          <div>
            <h3>Defesa Civil</h3>
            <p>Em situações de risco, siga as orientações da Defesa Civil do Rio Grande do Sul e da Defesa Civil municipal.</p>
          </div>
          <div>
            <h3>INMET e autoridades locais</h3>
            <p>Consulte os avisos meteorológicos oficiais e evite deslocamentos ou atividades externas quando houver recomendação de segurança.</p>
          </div>
        </div>
        <p className="data-note">
          O TEMPO Pelotas interpreta automaticamente dados de previsão. A ausência de indicativo nesta página não garante ausência de risco.
        </p>
      </section>
    </ForecastPageShell>
  );
}
