import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { WeatherHistoryChart } from "@/components/weather-history-chart";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeatherHistory } from "@/lib/weather-history-service";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Histórico climático recente de Pelotas",
  description:
    "Consulte temperatura, chuva e rajadas registradas nos últimos 30 dias em Pelotas, RS, com comparações e destaques do período.",
  alternates: { canonical: "/historico-climatico-pelotas" },
  openGraph: {
    title: "Histórico recente do tempo em Pelotas",
    description:
      "Compare temperatura, precipitação e vento dos últimos 30 dias em Pelotas, RS.",
    url: "/historico-climatico-pelotas",
  },
};

export default async function HistoricoClimaticoPelotasPage() {
  const [weather, history] = await Promise.all([
    getPelotasWeather(),
    getPelotasWeatherHistory(),
  ]);
  const { summary } = history;

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Histórico meteorológico recente de Pelotas",
    description:
      "Série diária dos últimos 30 dias com temperaturas máximas e mínimas, precipitação acumulada e rajadas de vento em Pelotas, RS.",
    url: absoluteUrl("/historico-climatico-pelotas"),
    temporalCoverage: `${history.days[0]?.date}/${history.days.at(-1)?.date}`,
    spatialCoverage: {
      "@type": "Place",
      name: "Pelotas, Rio Grande do Sul, Brasil",
      geo: {
        "@type": "GeoCoordinates",
        latitude: -31.7654,
        longitude: -52.3376,
      },
    },
    creator: {
      "@type": "Organization",
      name: "TEMPO Pelotas",
    },
    isBasedOn: history.source.url || undefined,
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Histórico recente"
      title="Como foi o tempo em Pelotas"
      description="Compare temperatura, chuva e rajadas dos últimos 30 dias para entender a variação meteorológica recente na cidade."
      currentPath="/historico-climatico-pelotas"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="history-summary" aria-label="Resumo dos últimos 30 dias">
        <article>
          <span>Média das máximas</span>
          <strong>{summary.averageMax}°C</strong>
          <small>{summary.periodLabel}</small>
        </article>
        <article>
          <span>Média das mínimas</span>
          <strong>{summary.averageMin}°C</strong>
          <small>Temperatura mínima diária</small>
        </article>
        <article>
          <span>Chuva acumulada</span>
          <strong>{summary.totalPrecipitation.toFixed(1)} mm</strong>
          <small>Soma estimada do período</small>
        </article>
        <article>
          <span>Maior rajada</span>
          <strong>{summary.strongestWindGust} km/h</strong>
          <small>Valor máximo diário</small>
        </article>
      </section>

      <WeatherHistoryChart days={history.days} />

      <section className="history-records" aria-label="Destaques meteorológicos do período">
        <article>
          <span>Dia mais quente</span>
          <strong>{summary.warmestDay.temperatureMax}°C</strong>
          <p>{summary.warmestDay.weekday}, {summary.warmestDay.label}</p>
        </article>
        <article>
          <span>Noite mais fria</span>
          <strong>{summary.coldestDay.temperatureMin}°C</strong>
          <p>{summary.coldestDay.weekday}, {summary.coldestDay.label}</p>
        </article>
        <article>
          <span>Dia mais chuvoso</span>
          <strong>{summary.wettestDay.precipitation.toFixed(1)} mm</strong>
          <p>{summary.wettestDay.weekday}, {summary.wettestDay.label}</p>
        </article>
      </section>

      <section className="history-note" aria-labelledby="history-method-title">
        <span className="eyebrow">Metodologia</span>
        <h2 id="history-method-title">Histórico de modelos meteorológicos</h2>
        <p>
          Os valores representam uma série histórica modelada para as coordenadas de Pelotas. Eles são úteis para comparação e acompanhamento de tendência, mas podem diferir de medições realizadas por estações meteorológicas específicas. Fonte: {history.source.name}.
        </p>
        {history.source.isFallback ? (
          <p className="data-note">
            A fonte histórica estava indisponível nesta atualização. O painel está exibindo uma amostra demonstrativa temporária e não deve ser utilizado para decisões técnicas.
          </p>
        ) : null}
      </section>
    </ForecastPageShell>
  );
}
