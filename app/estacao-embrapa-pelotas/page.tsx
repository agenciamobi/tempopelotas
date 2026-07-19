import type { Metadata } from "next";
import Link from "next/link";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import {
  EMBRAPA_MONITOR_URL,
  getEmbrapaObservation,
  type TimedObservation,
} from "@/lib/embrapa-observation";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Estação meteorológica da Embrapa em Pelotas",
  description:
    "Consulte temperatura, umidade, vento, pressão, chuva observada e extremos diários medidos pela Embrapa Clima Temperado em Pelotas.",
  alternates: { canonical: "/estacao-embrapa-pelotas" },
  openGraph: {
    title: "Dados meteorológicos da Embrapa em Pelotas",
    description:
      "Observações da estação automática da Embrapa Clima Temperado para complementar a previsão do tempo em Pelotas.",
    url: "/estacao-embrapa-pelotas",
  },
};

function formatNumber(value: number | null, maximumFractionDigits = 1) {
  if (value === null) return "Indisponível";

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function formatFetchedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function ExtremeCard({
  label,
  minimum,
  maximum,
  unit,
}: {
  label: string;
  minimum: TimedObservation;
  maximum: TimedObservation;
  unit: string;
}) {
  return (
    <article>
      <span>{label}</span>
      <div>
        <small>Mínima</small>
        <strong>{formatNumber(minimum.value)}{unit}</strong>
        <em>{minimum.time ?? "Horário indisponível"}</em>
      </div>
      <div>
        <small>Máxima</small>
        <strong>{formatNumber(maximum.value)}{unit}</strong>
        <em>{maximum.time ?? "Horário indisponível"}</em>
      </div>
    </article>
  );
}

export default async function EstacaoEmbrapaPelotasPage() {
  const [weather, observation] = await Promise.all([
    getPelotasWeather(),
    getEmbrapaObservation(),
  ]);
  const available = observation.status !== "unavailable";

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Observações meteorológicas da Embrapa Clima Temperado em Pelotas",
    description:
      "Temperatura, umidade, vento, pressão, chuva e evapotranspiração observados no Posto Meteorológico da Sede da Embrapa Clima Temperado.",
    url: absoluteUrl("/estacao-embrapa-pelotas"),
    sameAs: EMBRAPA_MONITOR_URL,
    spatialCoverage: "Pelotas, Rio Grande do Sul, Brasil",
    temporalCoverage: "Tempo real e acumulados do dia, mês e ano",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "Embrapa Clima Temperado",
      url: "https://www.embrapa.br/clima-temperado",
    },
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Observação meteorológica local"
      title="Estação Embrapa Clima Temperado"
      description="Dados medidos por uma estação automática em Pelotas para comparar o tempo observado com a previsão dos modelos meteorológicos."
      currentPath="/estacao-embrapa-pelotas"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema).replace(/</g, "\\u003c"),
        }}
      />

      {available ? (
        <>
          <section className="embrapa-page-current" aria-labelledby="embrapa-current-title">
            <div className="embrapa-page-reading">
              <span className="embrapa-live-status">
                <i aria-hidden="true" />
                {observation.status === "live" ? "Leitura reconhecida" : "Leitura parcial"}
              </span>
              <span className="eyebrow">Temperatura observada</span>
              <h2 id="embrapa-current-title">
                {formatNumber(observation.current.temperature)}°C
              </h2>
              <p>
                Sensação térmica de {formatNumber(observation.current.feelsLike)} °C e ponto de
                orvalho em {formatNumber(observation.current.dewPoint)} °C.
              </p>
              <small>Consulta ao painel em {formatFetchedAt(observation.source.fetchedAt)}</small>
            </div>

            <div className="embrapa-page-current-grid">
              <article>
                <span>Umidade relativa</span>
                <strong>{formatNumber(observation.current.humidity, 0)}%</strong>
              </article>
              <article>
                <span>Pressão atmosférica</span>
                <strong>{formatNumber(observation.current.pressure)} hPa</strong>
                <small>{observation.current.pressureTrend ?? "Tendência indisponível"}</small>
              </article>
              <article>
                <span>Vento observado</span>
                <strong>{formatNumber(observation.current.windSpeed)} km/h</strong>
                <small>{observation.current.windDirection ?? "Direção indisponível"}</small>
              </article>
              <article>
                <span>Nascer e pôr do sol</span>
                <strong>
                  {observation.current.sunrise ?? "—"} · {observation.current.sunset ?? "—"}
                </strong>
              </article>
            </div>
          </section>

          <section className="topic-section" aria-labelledby="embrapa-rain-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Precipitação observada</span>
                <h2 id="embrapa-rain-title">Quanto choveu na estação</h2>
              </div>
              <p>
                Estes valores são medições acumuladas no ponto da Embrapa, não estimativas dos
                modelos e não representam necessariamente todos os bairros de Pelotas.
              </p>
            </div>

            <div className="embrapa-accumulated-grid">
              <article>
                <span>Hoje</span>
                <strong>{formatNumber(observation.accumulated.rainDaily)} mm</strong>
              </article>
              <article>
                <span>No mês</span>
                <strong>{formatNumber(observation.accumulated.rainMonthly)} mm</strong>
              </article>
              <article>
                <span>No ano</span>
                <strong>{formatNumber(observation.accumulated.rainAnnual)} mm</strong>
              </article>
            </div>
          </section>

          <section className="topic-section" aria-labelledby="embrapa-extremes-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Mínimas e máximas do dia</span>
                <h2 id="embrapa-extremes-title">Extremos registrados</h2>
              </div>
              <p>
                Os horários indicam quando cada extremo foi registrado pela estação automática.
              </p>
            </div>

            <div className="embrapa-extremes-grid">
              <ExtremeCard
                label="Temperatura do ar"
                minimum={observation.extremes.temperatureMin}
                maximum={observation.extremes.temperatureMax}
                unit=" °C"
              />
              <ExtremeCard
                label="Umidade relativa"
                minimum={observation.extremes.humidityMin}
                maximum={observation.extremes.humidityMax}
                unit="%"
              />
              <ExtremeCard
                label="Ponto de orvalho"
                minimum={observation.extremes.dewPointMin}
                maximum={observation.extremes.dewPointMax}
                unit=" °C"
              />
              <article>
                <span>Maior velocidade do vento</span>
                <div>
                  <small>Máxima</small>
                  <strong>
                    {formatNumber(observation.extremes.windSpeedMax.value)} km/h
                  </strong>
                  <em>
                    {observation.extremes.windSpeedMax.time ?? "Horário indisponível"}
                  </em>
                </div>
              </article>
            </div>
          </section>

          <section className="topic-section" aria-labelledby="embrapa-agro-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Agrometeorologia</span>
                <h2 id="embrapa-agro-title">Evapotranspiração acumulada</h2>
              </div>
              <p>
                Indicador técnico relacionado à perda de água para a atmosfera, útil para irrigação,
                agricultura, hortas, estiagem e acompanhamento da disponibilidade hídrica.
              </p>
            </div>

            <div className="embrapa-accumulated-grid embrapa-accumulated-grid--agro">
              <article>
                <span>Hoje</span>
                <strong>
                  {formatNumber(observation.accumulated.evapotranspirationDaily, 2)} mm
                </strong>
              </article>
              <article>
                <span>No mês</span>
                <strong>
                  {formatNumber(observation.accumulated.evapotranspirationMonthly, 2)} mm
                </strong>
              </article>
              <article>
                <span>No ano</span>
                <strong>
                  {formatNumber(observation.accumulated.evapotranspirationAnnual, 2)} mm
                </strong>
              </article>
            </div>
          </section>
        </>
      ) : (
        <section className="topic-section embrapa-page-unavailable" role="status">
          <span className="eyebrow">Fonte temporariamente indisponível</span>
          <h2>Não foi possível reconhecer as leituras da estação</h2>
          <p>{observation.error}</p>
          <a href={EMBRAPA_MONITOR_URL} target="_blank" rel="noreferrer">
            Abrir monitor original da Embrapa
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      )}

      <section className="topic-section" aria-labelledby="embrapa-location-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Referência geográfica</span>
            <h2 id="embrapa-location-title">O que esta estação representa</h2>
          </div>
          <p>
            A estação fica na Sede da Embrapa Clima Temperado, em aproximadamente 31°42′S,
            52°24′W e 57 m de altitude.
          </p>
        </div>

        <div className="methodology-rules-grid">
          <article>
            <h3>Medição pontual</h3>
            <p>
              Temperatura, chuva e vento podem variar entre a estação, o Centro, o Laranjal e áreas
              rurais. O local da leitura deve permanecer visível.
            </p>
          </article>
          <article>
            <h3>Observação, não previsão</h3>
            <p>
              A estação informa o que foi medido. A previsão continua sendo calculada por modelos
              numéricos e pode apresentar valores diferentes.
            </p>
          </article>
          <article>
            <h3>Fonte externa</h3>
            <p>
              O TEMPO Pelotas interpreta a estrutura pública da página sem alterar os valores. Mudanças
              ou indisponibilidade no sistema original podem interromper a atualização.
            </p>
          </article>
          <article>
            <h3>Uso comunitário</h3>
            <p>
              Os dados ajudam na compreensão local, mas não substituem alertas meteorológicos,
              orientações da Defesa Civil ou decisões técnicas da Embrapa.
            </p>
          </article>
        </div>

        <div className="hydrology-home-actions">
          <a className="hydrology-primary-action" href={EMBRAPA_MONITOR_URL} target="_blank" rel="noreferrer">
            Abrir dados originais
            <span aria-hidden="true">↗</span>
          </a>
          <Link className="hydrology-secondary-action" href="/metodologia">
            Consultar metodologia
          </Link>
        </div>
      </section>
    </ForecastPageShell>
  );
}
