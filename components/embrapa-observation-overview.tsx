import Link from "next/link";
import type { EmbrapaObservationData } from "@/lib/embrapa-observation";

type EmbrapaObservationOverviewProps = {
  observation: EmbrapaObservationData;
};

function formatNumber(value: number | null, maximumFractionDigits = 1) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function formatFetchedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function ObservationIcon({ type }: { type: "temperature" | "humidity" | "wind" | "rain" }) {
  const paths = {
    temperature: (
      <>
        <path d="M9 14.7V5.5a3 3 0 0 1 6 0v9.2a5 5 0 1 1-6 0Z" />
        <path d="M12 8v8" />
      </>
    ),
    humidity: <path d="M12 3.5c3 3.7 5 6.3 5 9a5 5 0 0 1-10 0c0-2.7 2-5.3 5-9Z" />,
    wind: (
      <>
        <path d="M3 8h10.5a2.5 2.5 0 1 0-2.2-3.7" />
        <path d="M3 12h15a2.5 2.5 0 1 1-2.2 3.7" />
        <path d="M3 16h7" />
      </>
    ),
    rain: (
      <>
        <path d="M6.5 15.5h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.7 3.2 3.2 0 0 0-.1 6.3Z" />
        <path d="m9 18-1 2M13 18l-1 2M17 18l-1 2" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export function EmbrapaObservationOverview({
  observation,
}: EmbrapaObservationOverviewProps) {
  const available = observation.status !== "unavailable";

  return (
    <section
      className="embrapa-observation-home"
      id="observacao-embrapa"
      aria-labelledby="embrapa-observation-title"
    >
      <div className="embrapa-observation-intro">
        <div>
          <span className="embrapa-stage-label">Observação meteorológica local</span>
          <span className="eyebrow">Estação física em Pelotas</span>
          <h2 id="embrapa-observation-title">
            Dados medidos pela Embrapa Clima Temperado
          </h2>
          <p>
            Leituras da estação automática instalada no Posto Meteorológico da Sede da Embrapa.
            Elas mostram o que foi observado naquele ponto e complementam a previsão dos modelos.
          </p>
        </div>
        <div className="embrapa-observation-actions">
          <Link className="embrapa-primary-action" href="/estacao-embrapa-pelotas">
            Ver estação completa
            <span aria-hidden="true">→</span>
          </Link>
          <a
            className="embrapa-secondary-action"
            href={observation.source.url}
            target="_blank"
            rel="noreferrer"
          >
            Abrir fonte original
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {available ? (
        <div className="embrapa-observation-grid">
          <article className="embrapa-current-card">
            <div className="embrapa-current-topline">
              <span className="embrapa-live-status">
                <i aria-hidden="true" />
                {observation.status === "live" ? "Leitura reconhecida" : "Leitura parcial"}
              </span>
              <small>
                Consulta {formatFetchedAt(observation.source.fetchedAt)}
              </small>
            </div>

            <div className="embrapa-temperature-reading">
              <span>{formatNumber(observation.current.temperature)}°</span>
              <div>
                <strong>Temperatura observada</strong>
                <small>
                  Sensação de {formatNumber(observation.current.feelsLike)} °C
                </small>
              </div>
            </div>

            <div className="embrapa-primary-metrics">
              <div>
                <span>Umidade</span>
                <strong>{formatNumber(observation.current.humidity, 0)}%</strong>
              </div>
              <div>
                <span>Ponto de orvalho</span>
                <strong>{formatNumber(observation.current.dewPoint)} °C</strong>
              </div>
              <div>
                <span>Pressão</span>
                <strong>{formatNumber(observation.current.pressure)} hPa</strong>
                {observation.current.pressureTrend ? (
                  <small>{observation.current.pressureTrend}</small>
                ) : null}
              </div>
            </div>
          </article>

          <div className="embrapa-observation-metrics">
            <article>
              <span className="embrapa-metric-icon">
                <ObservationIcon type="wind" />
              </span>
              <div>
                <small>Vento observado</small>
                <strong>{formatNumber(observation.current.windSpeed)} km/h</strong>
                <span>{observation.current.windDirection ?? "Direção indisponível"}</span>
              </div>
            </article>
            <article>
              <span className="embrapa-metric-icon">
                <ObservationIcon type="rain" />
              </span>
              <div>
                <small>Chuva medida hoje</small>
                <strong>{formatNumber(observation.accumulated.rainDaily)} mm</strong>
                <span>{formatNumber(observation.accumulated.rainMonthly)} mm no mês</span>
              </div>
            </article>
            <article>
              <span className="embrapa-metric-icon">
                <ObservationIcon type="temperature" />
              </span>
              <div>
                <small>Extremos de hoje</small>
                <strong>
                  {formatNumber(observation.extremes.temperatureMin.value)}° /{" "}
                  {formatNumber(observation.extremes.temperatureMax.value)}°
                </strong>
                <span>
                  Mín. {observation.extremes.temperatureMin.time ?? "—"} · Máx.{" "}
                  {observation.extremes.temperatureMax.time ?? "—"}
                </span>
              </div>
            </article>
            <article>
              <span className="embrapa-metric-icon">
                <ObservationIcon type="humidity" />
              </span>
              <div>
                <small>Evapotranspiração</small>
                <strong>
                  {formatNumber(observation.accumulated.evapotranspirationDaily, 2)} mm
                </strong>
                <span>
                  {formatNumber(observation.accumulated.evapotranspirationMonthly, 2)} mm no mês
                </span>
              </div>
            </article>
          </div>

          <aside className="embrapa-station-context">
            <span className="eyebrow">Local da medição</span>
            <h3>Posto Meteorológico da Sede</h3>
            <p>
              Latitude 31°42′S, longitude 52°24′W e altitude de 57 m. A leitura representa esse
              ponto físico e pode diferir do Centro, Laranjal e demais bairros.
            </p>
            <dl>
              <div>
                <dt>Nascer do sol</dt>
                <dd>{observation.current.sunrise ?? "—"}</dd>
              </div>
              <div>
                <dt>Pôr do sol</dt>
                <dd>{observation.current.sunset ?? "—"}</dd>
              </div>
              <div>
                <dt>Chuva anual</dt>
                <dd>{formatNumber(observation.accumulated.rainAnnual)} mm</dd>
              </div>
            </dl>
            <p className="embrapa-source-note">
              Fonte: Embrapa Clima Temperado. Dados coletados automaticamente e sujeitos a atraso,
              manutenção ou indisponibilidade da estação.
            </p>
          </aside>
        </div>
      ) : (
        <div className="embrapa-unavailable-card" role="status">
          <strong>Estação temporariamente indisponível</strong>
          <p>{observation.error}</p>
          <a href={observation.source.url} target="_blank" rel="noreferrer">
            Consultar diretamente na Embrapa
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </section>
  );
}
