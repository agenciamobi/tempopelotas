import type {
  LagoonMonitoringNetworkData,
  LagoonMonitoringObservation,
} from "@/lib/lagoon-monitoring-network";
import {
  getWaterLevelTrendDirection,
  getWaterLevelVisualState,
  waterLevelStateClass,
} from "@/lib/water-level-state";

const CHART_WIDTH = 240;
const CHART_HEIGHT = 54;
const CHART_PADDING = 3;

function formatLevel(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatSigned(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: Math.abs(value) % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
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
  if (observation.risk === "flooding") return "Na cota ou acima";
  if (observation.risk === "attention") return "Próximo da cota";
  return "Abaixo da cota";
}

function getDistanceLabel(observation: LagoonMonitoringObservation) {
  const distance = observation.distanceToFloodCm;
  if (distance === null) return "Sem comparação disponível";

  if (distance > 0) {
    return `${formatLevel(distance)} cm abaixo da cota de inundação informada`;
  }

  if (distance < 0) {
    return `${formatLevel(Math.abs(distance))} cm acima da cota de inundação informada`;
  }

  return "Na cota de inundação informada pela fonte";
}

function getTrend(observation: LagoonMonitoringObservation) {
  if (observation.status === "stale") {
    return {
      direction: "unavailable" as const,
      symbol: "·",
      label: "Sem tendência atual",
      detail: "leitura atrasada",
    };
  }

  const rate = observation.trendCmPerHour;
  const direction = getWaterLevelTrendDirection(rate);

  if (direction === "unavailable") {
    return {
      direction,
      symbol: "·",
      label: "Sem tendência",
      detail: "série insuficiente",
    };
  }

  if (direction === "stable") {
    return {
      direction,
      symbol: "→",
      label: "Estável",
      detail: "sem mudança relevante",
    };
  }

  if (direction === "rising") {
    return {
      direction,
      symbol: "↑",
      label: "Subindo",
      detail: `${formatSigned(rate)} cm/h`,
    };
  }

  return {
    direction,
    symbol: "↓",
    label: "Baixando",
    detail: `${formatSigned(Math.abs(rate!))} cm/h`,
  };
}

function buildChart(observation: LagoonMonitoringObservation) {
  if (observation.series.length < 2) return null;

  const points = observation.series.slice(-96);
  const levels = points.map((point) => point.levelCm);
  const minimum = Math.min(...levels);
  const maximum = Math.max(...levels);
  const range = Math.max(maximum - minimum, 1);
  const innerWidth = CHART_WIDTH - CHART_PADDING * 2;
  const innerHeight = CHART_HEIGHT - CHART_PADDING * 2;

  const coordinates = points.map((point, index) => ({
    x: CHART_PADDING + (index / (points.length - 1)) * innerWidth,
    y:
      CHART_PADDING +
      ((maximum - point.levelCm) / range) * innerHeight,
  }));

  const line = coordinates
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`,
    )
    .join(" ");
  const first = coordinates[0];
  const last = coordinates.at(-1)!;

  return {
    line,
    area: `${line} L${last.x.toFixed(1)},${CHART_HEIGHT} L${first.x.toFixed(1)},${CHART_HEIGHT} Z`,
    minimum,
    maximum,
  };
}

function networkSummary(data: LagoonMonitoringNetworkData) {
  if (data.available === 0) return "Nenhuma estação com leitura disponível";
  if (data.live === data.total) return `${data.live}/${data.total} estações atualizadas`;
  if (data.live > 0 && data.stale > 0) {
    return `${data.live} atualizadas · ${data.stale} atrasadas`;
  }
  if (data.live > 0) return `${data.live}/${data.total} estações atualizadas`;
  return `${data.stale} estações com leitura atrasada`;
}

export function LagoonMonitoringNetwork({
  data,
  variant = "full",
}: {
  data: LagoonMonitoringNetworkData;
  variant?: "home" | "full";
}) {
  const compact = variant === "home";

  return (
    <section
      className={`lagoon-monitoring-network lagoon-monitoring-network--${variant} is-${data.status}`}
      aria-labelledby={`lagoon-monitoring-title-${variant}`}
    >
      <div className="lagoon-monitoring-heading">
        <div>
          <span className="eyebrow">FURG &amp; Portos RS</span>
          <h3 id={`lagoon-monitoring-title-${variant}`}>
            {compact
              ? "Níveis ao longo da Lagoa dos Patos"
              : "Rede de Monitoramento da Lagoa dos Patos"}
          </h3>
          <p>
            {compact
              ? "Compare as leituras mais recentes de cinco pontos monitorados entre o norte e o sul da lagoa."
              : "Leituras da API pública dos linígrafos, com série recente, tendência calculada e comparação com as cotas de inundação informadas pela própria fonte."}
          </p>
        </div>
        <a href={data.source.url} target="_blank" rel="noreferrer">
          Abrir fonte
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="lagoon-monitoring-summary" role="status">
        <span className="lagoon-monitoring-summary-dot" aria-hidden="true" />
        <strong>{networkSummary(data)}</strong>
        <small>
          {data.latestUpdatedAt
            ? `Leitura mais recente: ${formatUpdatedAt(data.latestUpdatedAt)}`
            : "As leituras estão temporariamente indisponíveis"}
        </small>
      </div>

      <div className="lagoon-monitoring-grid">
        {data.observations.map((observation) => {
          const hasReading = observation.currentLevelCm !== null;
          const isCurrent = hasReading && observation.status === "live";
          const progress = Math.max(
            0,
            Math.min(observation.floodThresholdPercentage ?? 0, 100),
          );
          const trend = getTrend(observation);
          const visualState = getWaterLevelVisualState({
            rate: isCurrent ? observation.trendCmPerHour : null,
            available: isCurrent,
            currentLevel: isCurrent ? observation.currentLevelCm : null,
            threshold: isCurrent ? observation.floodLevelCm : null,
          });
          const chart = compact ? null : buildChart(observation);

          return (
            <article
              className={`lagoon-monitoring-card is-${observation.status} risk-${observation.risk} ${waterLevelStateClass(visualState)}`}
              key={observation.station.id}
            >
              <div className="lagoon-monitoring-card-head">
                <div>
                  <small>
                    {observation.station.city} · {observation.station.sensorId}
                  </small>
                  <h4>{observation.station.name}</h4>
                </div>
                <span>{getRiskLabel(observation)}</span>
              </div>

              {hasReading ? (
                <>
                  <div className="lagoon-monitoring-reading-row">
                    <div className="lagoon-monitoring-reading">
                      <strong>{formatLevel(observation.currentLevelCm)}</strong>
                      <span>cm</span>
                    </div>
                    <div
                      className={`lagoon-monitoring-trend is-${trend.direction}`}
                      aria-label={`${trend.label}: ${trend.detail}`}
                    >
                      <b aria-hidden="true">{trend.symbol}</b>
                      <span>
                        <strong>{trend.label}</strong>
                        <small>{trend.detail}</small>
                      </span>
                    </div>
                  </div>

                  <p className="lagoon-monitoring-distance">
                    {getDistanceLabel(observation)}
                  </p>
                  <div
                    className="lagoon-monitoring-progress"
                    aria-label={`${formatLevel(observation.floodThresholdPercentage)}% da cota de inundação informada pela fonte`}
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>

                  {chart ? (
                    <div
                      className="lagoon-monitoring-chart"
                      aria-label={`Variação recente do nível em ${observation.station.name}`}
                    >
                      <div>
                        <span>{formatLevel(chart.maximum)} cm</span>
                        <span>{formatLevel(chart.minimum)} cm</span>
                      </div>
                      <svg
                        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                        role="img"
                        aria-hidden="true"
                      >
                        <path
                          className="lagoon-monitoring-chart-area"
                          d={chart.area}
                        />
                        <path
                          className="lagoon-monitoring-chart-line"
                          d={chart.line}
                        />
                      </svg>
                      <small>Últimas leituras disponíveis</small>
                    </div>
                  ) : null}

                  <dl
                    className={`lagoon-monitoring-metrics${compact ? " is-compact" : ""}`}
                  >
                    <div>
                      <dt>Cota informada</dt>
                      <dd>{formatLevel(observation.floodLevelCm)} cm</dd>
                    </div>
                    <div>
                      <dt>Variação 24h</dt>
                      <dd>{formatSigned(observation.change24hCm)} cm</dd>
                    </div>
                    {!compact ? (
                      <div>
                        <dt>Máx. mai/2024</dt>
                        <dd>{formatLevel(observation.may2024MaximumCm)} cm</dd>
                      </div>
                    ) : null}
                  </dl>
                </>
              ) : (
                <div className="lagoon-monitoring-unavailable">
                  <strong>Leitura indisponível</strong>
                  <p>{observation.error}</p>
                </div>
              )}

              {observation.error && hasReading ? (
                <p className="lagoon-monitoring-role">{observation.error}</p>
              ) : !compact ? (
                <p className="lagoon-monitoring-role">
                  {observation.station.role}
                </p>
              ) : null}
              <footer>
                <small>
                  {observation.updatedAt
                    ? `Leitura de ${formatUpdatedAt(observation.updatedAt)}`
                    : "Aguardando atualização da fonte"}
                </small>
                <a
                  href={data.source.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir fonte de ${observation.station.name}`}
                >
                  ↗
                </a>
              </footer>
            </article>
          );
        })}
      </div>

      {!compact ? (
        <div className="lagoon-monitoring-note">
          <strong>Como interpretar</strong>
          <p>
            As tendências e variações são calculadas apenas quando existe uma
            janela temporal compatível. As cotas de inundação e os máximos de
            maio de 2024 são reproduzidos do portal preliminar da FURG e Portos
            RS. Compare cada leitura somente com a referência do mesmo card.
            Dados atrasados ficam neutros e não representam condição atual. Estes
            dados não substituem avisos da Defesa Civil.
          </p>
        </div>
      ) : null}
    </section>
  );
}
