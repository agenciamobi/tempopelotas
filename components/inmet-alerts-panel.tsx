import Link from "next/link";
import type {
  InmetAlert,
  InmetAlertsData,
  InmetAlertRelevance,
} from "@/lib/inmet-alerts";

type InmetAlertsPanelProps = {
  data: InmetAlertsData;
  variant?: "home" | "page";
};

const relevanceLabels: Record<InmetAlertRelevance, string> = {
  pelotas: "Inclui Pelotas",
  regional: "Possível interesse regional",
  state: "Outras áreas do RS",
};

function formatDateTime(value: string | null) {
  if (!value) return "Horário não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function periodLabel(alert: InmetAlert) {
  const start = formatDateTime(alert.startsAt);
  const end = formatDateTime(alert.expiresAt);

  if (!alert.expiresAt) return alert.period === "upcoming" ? `Previsto a partir de ${start}` : `Em vigor desde ${start}`;
  return alert.period === "upcoming" ? `Previsto de ${start} até ${end}` : `Vigente até ${end}`;
}

function relevanceSummary(data: InmetAlertsData) {
  if (data.counts.pelotas > 0) {
    return data.counts.pelotas === 1
      ? "Pelotas está incluída em um aviso oficial."
      : `Pelotas está incluída em ${data.counts.pelotas} avisos oficiais.`;
  }
  if (data.counts.regional > 0) {
    return "Há aviso para uma região próxima ou relacionada à Zona Sul.";
  }
  return data.counts.total === 1
    ? "Há um aviso oficial vigente no Rio Grande do Sul."
    : `Há ${data.counts.total} avisos oficiais vigentes no Rio Grande do Sul.`;
}

function AlertRow({ alert }: { alert: InmetAlert }) {
  const areaText = alert.areas[0] ||
    (alert.municipalities.length ? `${alert.municipalities.length} municípios informados` : "Consulte a área oficial");

  return (
    <article className={`inmet-alert-card severity-${alert.severity} relevance-${alert.relevance}`}>
      <div className="inmet-alert-card__topline">
        <span className="inmet-alert-severity">{alert.severityLabel}</span>
        <span className="inmet-alert-relevance">{relevanceLabels[alert.relevance]}</span>
      </div>
      <div className="inmet-alert-card__heading">
        <div>
          <h3>{alert.headline || alert.event}</h3>
          <p>{periodLabel(alert)}</p>
        </div>
        <span className="inmet-alert-event">{alert.event}</span>
      </div>
      <p className="inmet-alert-area"><strong>Área:</strong> {areaText}</p>
      {alert.description ? <p className="inmet-alert-description">{alert.description}</p> : null}
      {alert.instruction ? (
        <details>
          <summary>Orientações oficiais</summary>
          <p>{alert.instruction}</p>
        </details>
      ) : null}
      <a href={alert.officialUrl} target="_blank" rel="noreferrer">
        Conferir aviso no INMET <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

function HomePanel({ data }: { data: InmetAlertsData }) {
  if (data.status !== "live" || data.alerts.length === 0) return null;

  const primary = data.alerts[0];

  return (
    <section className={`home-inmet-alerts severity-${primary.severity}`} aria-labelledby="home-inmet-title">
      <div className="home-inmet-alerts__mark" aria-hidden="true">!</div>
      <div className="home-inmet-alerts__copy">
        <span>Informação oficial · INMET</span>
        <h2 id="home-inmet-title">{relevanceSummary(data)}</h2>
        <p>{primary.event} · {periodLabel(primary)}</p>
      </div>
      <Link href="/alertas">Ver avisos e áreas <span aria-hidden="true">→</span></Link>
    </section>
  );
}

export function InmetAlertsPanel({ data, variant = "page" }: InmetAlertsPanelProps) {
  if (variant === "home") return <HomePanel data={data} />;

  if (data.status === "unavailable") {
    return (
      <section className="inmet-alerts-section is-unavailable" aria-labelledby="inmet-alerts-title">
        <header className="inmet-alerts-heading">
          <div>
            <span className="eyebrow">Fonte oficial · INMET</span>
            <h2 id="inmet-alerts-title">Avisos meteorológicos no Rio Grande do Sul</h2>
          </div>
          <span className="inmet-source-status">Consulta indisponível</span>
        </header>
        <div className="inmet-alerts-empty">
          <strong>Não foi possível consultar o feed oficial agora.</strong>
          <p>Isso não significa ausência de avisos. Consulte diretamente o portal do INMET.</p>
          <a href={data.source.portalUrl} target="_blank" rel="noreferrer">Abrir avisos do INMET <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    );
  }

  if (data.alerts.length === 0) {
    return (
      <section className="inmet-alerts-section is-clear" aria-labelledby="inmet-alerts-title">
        <header className="inmet-alerts-heading">
          <div>
            <span className="eyebrow">Fonte oficial · INMET</span>
            <h2 id="inmet-alerts-title">Avisos meteorológicos no Rio Grande do Sul</h2>
          </div>
          <span className="inmet-source-status">Consulta atualizada</span>
        </header>
        <div className="inmet-alerts-empty">
          <strong>Nenhum aviso vigente para o RS foi encontrado no feed consultado.</strong>
          <p>A situação pode mudar. O portal verifica novamente o serviço oficial a cada poucos minutos.</p>
          <a href={data.source.portalUrl} target="_blank" rel="noreferrer">Conferir diretamente no INMET <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    );
  }

  const pelotas = data.alerts.filter((alert) => alert.relevance === "pelotas");
  const regional = data.alerts.filter((alert) => alert.relevance === "regional");
  const state = data.alerts.filter((alert) => alert.relevance === "state");
  const groups = [
    { id: "pelotas", title: "Avisos que incluem Pelotas", description: "Correspondência pelo código municipal ou menção explícita à cidade.", alerts: pelotas },
    { id: "regional", title: "Possível interesse para a Zona Sul", description: "Avisos que mencionam áreas regionais relacionadas, sem confirmação municipal explícita.", alerts: regional },
    { id: "estado", title: "Demais avisos no Rio Grande do Sul", description: "Contexto estadual para deslocamentos, viagens e acompanhamento geral.", alerts: state },
  ].filter((group) => group.alerts.length > 0);

  return (
    <section className="inmet-alerts-section" aria-labelledby="inmet-alerts-title">
      <header className="inmet-alerts-heading">
        <div>
          <span className="eyebrow">Fonte oficial · INMET</span>
          <h2 id="inmet-alerts-title">Avisos meteorológicos no Rio Grande do Sul</h2>
          <p>{relevanceSummary(data)} Os avisos abaixo são emitidos pelo INMET e não pela classificação automática do TEMPO Pelotas.</p>
        </div>
        <div className="inmet-alerts-counts" aria-label="Resumo dos avisos">
          <div><strong>{data.counts.pelotas}</strong><span>Pelotas</span></div>
          <div><strong>{data.counts.regional}</strong><span>Zona Sul</span></div>
          <div><strong>{data.counts.state}</strong><span>Estado</span></div>
        </div>
      </header>

      <div className="inmet-alert-groups">
        {groups.map((group) => (
          <section className={`inmet-alert-group group-${group.id}`} key={group.id} aria-labelledby={`inmet-group-${group.id}`}>
            <header>
              <div>
                <h3 id={`inmet-group-${group.id}`}>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <span>{group.alerts.length}</span>
            </header>
            <div className="inmet-alert-list">
              {group.alerts.map((alert) => <AlertRow alert={alert} key={alert.id} />)}
            </div>
          </section>
        ))}
      </div>

      <footer className="inmet-alerts-footer">
        <p>Última consulta: {formatDateTime(data.source.fetchedAt)}. A área informada pelo INMET deve ser conferida no aviso original.</p>
        <a href={data.source.portalUrl} target="_blank" rel="noreferrer">Portal oficial do INMET <span aria-hidden="true">↗</span></a>
      </footer>
    </section>
  );
}
