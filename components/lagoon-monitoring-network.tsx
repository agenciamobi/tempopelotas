import type {
  LagoonMonitoringNetworkData,
  LagoonMonitoringObservation,
} from "@/lib/lagoon-monitoring-network";

function formatLevel(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatUpdatedAt(value: string | null) {
  if (!value) return "Horário indisponível";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getRiskLabel(observation: LagoonMonitoringObservation) {
  if (observation.status === "unavailable") return "Indisponível";
  if (observation.status === "stale") return "Leitura atrasada";
  if (observation.risk === "flooding") return "Acima da cota";
  if (observation.risk === "attention") return "Próximo da cota";
  return "Abaixo da cota";
}

function getDistanceLabel(observation: LagoonMonitoringObservation) {
  const distance = observation.distanceToFloodCm;
  if (distance === null) return "Sem comparação disponível";

  if (distance > 0) {
    return `${formatLevel(distance)} cm abaixo da cota local`;
  }

  if (distance < 0) {
    return `${formatLevel(Math.abs(distance))} cm acima da cota local`;
  }

  return "Na cota de inundação local";
}

export function LagoonMonitoringNetwork({
  data,
  variant = "full",
}: {
  data: LagoonMonitoringNetworkData;
  variant?: "home" | "full";
}) {
  return (
    <section
      className={`lagoon-monitoring-network lagoon-monitoring-network--${variant} is-${data.status}`}
      aria-labelledby={`lagoon-monitoring-title-${variant}`}
    >
      <div className="lagoon-monitoring-heading">
        <div>
          <span className="eyebrow">FURG & Portos RS</span>
          <h3 id={`lagoon-monitoring-title-${variant}`}>
            Rede de Monitoramento da Lagoa dos Patos
          </h3>
          <p>
            Compare diferentes pontos da lagoa, do encontro com o Guaíba até o estuário em Rio Grande e São José do Norte.
          </p>
        </div>
        <a href={data.source.url} target="_blank" rel="noreferrer">
          Abrir fonte
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="lagoon-monitoring-summary" role="status">
        <span className="lagoon-monitoring-summary-dot" aria-hidden="true" />
        <strong>
          {data.available}/{data.total} estações com leitura
        </strong>
        <small>
          {data.latestUpdatedAt
            ? `Leitura mais recente: ${formatUpdatedAt(data.latestUpdatedAt)}`
            : "As leituras estão temporariamente indisponíveis"}
        </small>
      </div>

      <div className="lagoon-monitoring-grid">
        {data.observations.map((observation) => {
          const available = observation.currentLevelCm !== null;
          const progress = Math.max(
            0,
            Math.min(observation.floodThresholdPercentage ?? 0, 100),
          );

          return (
            <article
              className={`lagoon-monitoring-card is-${observation.status} risk-${observation.risk}`}
              key={observation.station.id}
            >
              <div className="lagoon-monitoring-card-head">
                <div>
                  <small>{observation.station.city}</small>
                  <h4>{observation.station.name}</h4>
                </div>
                <span>{getRiskLabel(observation)}</span>
              </div>

              {available ? (
                <>
                  <div className="lagoon-monitoring-reading">
                    <strong>{formatLevel(observation.currentLevelCm)}</strong>
                    <span>cm</span>
                  </div>
                  <p className="lagoon-monitoring-distance">
                    {getDistanceLabel(observation)}
                  </p>
                  <div
                    className="lagoon-monitoring-progress"
                    aria-label={`${formatLevel(observation.floodThresholdPercentage)}% da cota de inundação local`}
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <dl className="lagoon-monitoring-metrics">
                    <div>
                      <dt>Cota local</dt>
                      <dd>{formatLevel(observation.floodLevelCm)} cm</dd>
                    </div>
                    <div>
                      <dt>Máx. mai/2024</dt>
                      <dd>{formatLevel(observation.may2024MaximumCm)} cm</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <div className="lagoon-monitoring-unavailable">
                  <strong>Leitura indisponível</strong>
                  <p>{observation.error}</p>
                </div>
              )}

              <p className="lagoon-monitoring-role">{observation.station.role}</p>
              <footer>
                <small>
                  {observation.updatedAt
                    ? `Atualizado em ${formatUpdatedAt(observation.updatedAt)}`
                    : "Aguardando atualização da fonte"}
                </small>
                <a href={data.source.url} target="_blank" rel="noreferrer" aria-label={`Abrir fonte de ${observation.station.name}`}>
                  ↗
                </a>
              </footer>
            </article>
          );
        })}
      </div>

      <div className="lagoon-monitoring-note">
        <strong>Como interpretar</strong>
        <p>
          As medições são reduzidas ao referencial vertical brasileiro, mas cada município possui sua própria cota de inundação. Para risco local, compare cada leitura com a cota exibida no mesmo card. Estes dados não substituem avisos da Defesa Civil.
        </p>
      </div>
    </section>
  );
}
