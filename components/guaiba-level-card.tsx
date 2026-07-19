import type { GuaibaObservationData } from "@/lib/guaiba-monitor";

const CHART_WIDTH = 520;
const CHART_HEIGHT = 118;
const CHART_PADDING = 8;

function formatLevel(value: number | null, digits = 2) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatSigned(value: number | null, digits = 1) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: "exceptZero",
  }).format(value);
}

function formatUpdatedAt(value: string | null) {
  if (!value) return "Horário indisponível";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getTrend(data: GuaibaObservationData) {
  const rate = data.trendCmPerHour;

  if (rate === null) {
    return {
      label: "Tendência indisponível",
      detail: "série insuficiente",
      direction: "unavailable" as const,
      symbol: "·",
    };
  }

  if (Math.abs(rate) < 0.1) {
    return {
      label: "Estável",
      detail: "média das últimas 6h",
      direction: "stable" as const,
      symbol: "→",
    };
  }

  if (rate > 0) {
    return {
      label: "Subindo",
      detail: `${formatSigned(rate)} cm/h · média 6h`,
      direction: "rising" as const,
      symbol: "↑",
    };
  }

  return {
    label: "Descendo",
    detail: `${formatSigned(Math.abs(rate))} cm/h · média 6h`,
    direction: "falling" as const,
    symbol: "↓",
  };
}

function buildChartPath(data: GuaibaObservationData) {
  if (data.series.length < 2) return null;

  const levels = data.series.map((point) => point.level);
  const minimum = Math.min(...levels);
  const maximum = Math.max(...levels);
  const range = Math.max(maximum - minimum, 0.02);
  const innerWidth = CHART_WIDTH - CHART_PADDING * 2;
  const innerHeight = CHART_HEIGHT - CHART_PADDING * 2;

  const points = data.series.map((point, index) => {
    const x = CHART_PADDING + (index / (data.series.length - 1)) * innerWidth;
    const y = CHART_PADDING + ((maximum - point.level) / range) * innerHeight;

    return { x, y };
  });

  return {
    line: points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" "),
    area: `${points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" ")} L${points.at(-1)!.x.toFixed(1)},${CHART_HEIGHT} L${points[0].x.toFixed(1)},${CHART_HEIGHT} Z`,
    minimum,
    maximum,
  };
}

function DistanceToReference({ data }: { data: GuaibaObservationData }) {
  const distance = data.distanceToFloodReference;

  if (distance === null) return null;

  return (
    <p className="guaiba-reference-message">
      {distance >= 0 ? (
        <>
          <strong>{formatLevel(distance)} m</strong> abaixo da cota de inundação usada para Porto Alegre.
        </>
      ) : (
        <>
          <strong>{formatLevel(Math.abs(distance))} m</strong> acima da cota de inundação usada para Porto Alegre.
        </>
      )}
    </p>
  );
}

export function GuaibaLevelCard({ data }: { data: GuaibaObservationData }) {
  const available = data.status !== "unavailable" && data.currentLevel !== null;
  const trend = getTrend(data);
  const chart = buildChartPath(data);

  return (
    <article className={`guaiba-level-card guaiba-level-card--${data.status}`}>
      <div className="guaiba-level-card-header">
        <div>
          <span className="eyebrow">Indicador regional a montante</span>
          <h3>Nível do Guaíba</h3>
          <p>Porto Alegre / RS · Estação {data.station}</p>
        </div>
        <span className="guaiba-data-status">
          <i aria-hidden="true" />
          {data.status === "live"
            ? "Dados recentes"
            : data.status === "stale"
              ? "Leitura atrasada"
              : "Indisponível"}
        </span>
      </div>

      {available ? (
        <>
          <div className="guaiba-level-reading">
            <div className="guaiba-level-value">
              <strong>{formatLevel(data.currentLevel)}</strong>
              <span>m</span>
            </div>
            <div className={`guaiba-trend guaiba-trend--${trend.direction}`}>
              <span aria-hidden="true">{trend.symbol}</span>
              <div>
                <strong>{trend.label}</strong>
                <small>{trend.detail}</small>
              </div>
            </div>
          </div>

          <p className="guaiba-updated-at">Atualizado em {formatUpdatedAt(data.updatedAt)}</p>
          <DistanceToReference data={data} />

          {chart ? (
            <div className="guaiba-mini-chart" aria-label="Variação do nível do Guaíba nas últimas 24 horas">
              <div className="guaiba-chart-labels">
                <span>{formatLevel(chart.maximum)} m</span>
                <span>{formatLevel(chart.minimum)} m</span>
              </div>
              <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="guaiba-area-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path className="guaiba-chart-area" d={chart.area} />
                <path className="guaiba-chart-line" d={chart.line} />
              </svg>
              <div className="guaiba-chart-range">
                <span>24 horas atrás</span>
                <strong>Variação {formatSigned(data.variation24hCm)} cm</strong>
                <span>Agora</span>
              </div>
            </div>
          ) : null}

          <dl className="guaiba-summary-grid">
            <div>
              <dt>Cota de inundação</dt>
              <dd>{formatLevel(data.floodReference)} m</dd>
            </div>
            <div>
              <dt>Média da série</dt>
              <dd>{formatLevel(data.periodAverage)} m</dd>
            </div>
            <div>
              <dt>Faixa observada</dt>
              <dd>
                {formatLevel(data.periodMinimum)}–{formatLevel(data.periodMaximum)} m
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <div className="guaiba-unavailable-state" role="status">
          <strong>Nível temporariamente indisponível</strong>
          <p>{data.error}</p>
        </div>
      )}

      <div className="guaiba-context-note">
        <strong>Por que acompanhar?</strong>
        <p>
          O Guaíba é uma das grandes entradas de água da Lagoa dos Patos, mas não é a única. O cenário
          de Pelotas também depende de outras bacias, rios e arroios, do vento sobre a lagoa e do
          escoamento pelo canal da Barra entre Rio Grande e São José do Norte.
        </p>
      </div>

      <div className="guaiba-source-links">
        <a href={data.source.url} target="_blank" rel="noreferrer">
          Abrir monitor completo
          <span aria-hidden="true">↗</span>
        </a>
        <a href={data.source.methodologyUrl} target="_blank" rel="noreferrer">
          Metodologia da fonte
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <small className="guaiba-attribution">
        Agregação: {data.source.name}. Dados originais: {data.source.originalInstitutions}. Indicador
        regional, não previsão isolada para Pelotas.
      </small>
    </article>
  );
}
