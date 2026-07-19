import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";

type LagoonLevelDashboardProps = {
  windSpeed: number;
  windDirection: string;
  windGust: number;
  precipitation: number;
  condition: string;
  updatedAt: string;
};

function WindIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8h10.5a2.5 2.5 0 1 0-2.2-3.7" />
      <path d="M3 12h15a2.5 2.5 0 1 1-2.2 3.7" />
      <path d="M3 16h7" />
    </svg>
  );
}

function RainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 15.5h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.7 3.2 3.2 0 0 0-.1 6.3Z" />
      <path d="m9 18-1 2M13 18l-1 2M17 18l-1 2" />
    </svg>
  );
}

function formatMillimeters(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function LagoonLevelDashboard({
  windSpeed,
  windDirection,
  windGust,
  precipitation,
  condition,
  updatedAt,
}: LagoonLevelDashboardProps) {
  return (
    <section className="lagoon-dashboard" aria-labelledby="lagoon-dashboard-title">
      <div className="lagoon-dashboard-heading">
        <div>
          <span className="eyebrow">Monitoramento na Praia do Laranjal</span>
          <h2 id="lagoon-dashboard-title">Nível da Lagoa dos Patos</h2>
          <p>
            Acompanhe a medição da Estação Laranjal e observe a evolução do nível junto das condições
            de vento e chuva em Pelotas. O gráfico é atualizado pelo LabHidroSens / UFPel.
          </p>
        </div>
        <div className="lagoon-source-badge">
          <span>Dados do medidor</span>
          <strong>{LAGOON_LEVEL_SOURCE.name}</strong>
          <small>{LAGOON_LEVEL_SOURCE.location}</small>
        </div>
      </div>

      <div className="lagoon-dashboard-layout">
        <div className="lagoon-dashboard-main">
          <div className="lagoon-dashboard-frame">
            <iframe
              src={LAGOON_LEVEL_SOURCE.dashboardUrl}
              title="Painel do nível da Lagoa dos Patos na Estação Laranjal"
              loading="eager"
              allow="fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />

            <div className="lagoon-dashboard-toolbar">
              <span>
                <i aria-hidden="true" />
                Estação Laranjal
              </span>
              <a
                href={LAGOON_LEVEL_SOURCE.dashboardUrl}
                target="_blank"
                rel="noreferrer"
              >
                Abrir painel original
                <b aria-hidden="true">↗</b>
              </a>
            </div>
          </div>

          <p className="lagoon-dashboard-note">
            O medidor representa a Estação Laranjal. Caso o gráfico não apareça, abra o painel original
            para consultar diretamente a fonte responsável pela leitura.
          </p>
        </div>

        <aside className="lagoon-dashboard-aside" aria-label="Condições relacionadas ao nível da lagoa">
          <article className="lagoon-station-card">
            <span className="lagoon-station-status">
              <i aria-hidden="true" />
              Estação em acompanhamento
            </span>
            <strong>Praia do Laranjal</strong>
            <small>Pelotas / RS · tempo atualizado em {formatUpdatedAt(updatedAt)}</small>
          </article>

          <div className="lagoon-side-metrics">
            <article>
              <span className="lagoon-side-icon">
                <WindIcon />
              </span>
              <div>
                <small>Vento em Pelotas agora</small>
                <strong>{windSpeed} km/h</strong>
                <span>{windDirection}</span>
              </div>
            </article>
            <article>
              <span className="lagoon-side-icon">
                <WindIcon />
              </span>
              <div>
                <small>Maior rajada nas próximas horas</small>
                <strong>{windGust} km/h</strong>
                <span>Previsão para Pelotas</span>
              </div>
            </article>
            <article>
              <span className="lagoon-side-icon">
                <RainIcon />
              </span>
              <div>
                <small>Chuva prevista para hoje</small>
                <strong>{formatMillimeters(precipitation)} mm</strong>
                <span>Estimativa meteorológica</span>
              </div>
            </article>
          </div>

          <article className="lagoon-reading-card">
            <span className="eyebrow">Condições em Pelotas</span>
            <h3>{condition}</h3>
            <p>
              Observe se o nível está subindo, estável ou baixando e acompanhe os avisos das
              autoridades. Vento e chuva podem alterar o comportamento da água no Laranjal.
            </p>
          </article>

          <a
            className="lagoon-original-link"
            href={LAGOON_LEVEL_SOURCE.dashboardUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <small>LabHidroSens / UFPel</small>
              <strong>Consultar o painel completo</strong>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </aside>
      </div>
    </section>
  );
}
