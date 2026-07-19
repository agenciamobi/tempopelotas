"use client";

import { useState } from "react";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";

type LagoonLevelDashboardProps = {
  windSpeed: number;
  windDirection: string;
  windGust: number;
  precipitation: number;
  condition: string;
  updatedAt: string;
};

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 16.5a8 8 0 1 1 16 0" />
      <path d="m12 13 4-4" />
      <path d="M6.5 16.5h11" />
      <path d="M7.5 7.5 9 9M16.5 7.5 15 9M12 5v2" />
    </svg>
  );
}

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

export function LagoonLevelDashboard({
  windSpeed,
  windDirection,
  windGust,
  precipitation,
  condition,
  updatedAt,
}: LagoonLevelDashboardProps) {
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <section className="lagoon-dashboard" aria-labelledby="lagoon-dashboard-title">
      <div className="lagoon-dashboard-heading">
        <div>
          <span className="eyebrow">Medição externa em tempo real</span>
          <h2 id="lagoon-dashboard-title">Estação Laranjal</h2>
          <p>
            O quadro principal respeita a largura útil do painel do LabHidroSens. As condições
            meteorológicas relacionadas ficam organizadas ao lado, sem deixar área vazia no medidor.
          </p>
        </div>
        <div className="lagoon-source-badge">
          <span>Fonte</span>
          <strong>{LAGOON_LEVEL_SOURCE.name}</strong>
          <small>{LAGOON_LEVEL_SOURCE.location}</small>
        </div>
      </div>

      <div className="lagoon-dashboard-layout">
        <div className="lagoon-dashboard-main">
          <div className="lagoon-dashboard-frame">
            {dashboardOpen ? (
              <iframe
                src={LAGOON_LEVEL_SOURCE.dashboardUrl}
                title="Painel do nível da Lagoa dos Patos na Estação Laranjal"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button
                className="lagoon-dashboard-launch"
                type="button"
                onClick={() => setDashboardOpen(true)}
              >
                <span className="lagoon-dashboard-icon">
                  <GaugeIcon />
                </span>
                <strong>Carregar medidor da Lagoa dos Patos</strong>
                <small>O painel externo será aberto dentro desta página</small>
              </button>
            )}

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
            Caso o provedor impeça a incorporação ou a transmissão não carregue, utilize “Abrir
            painel original”. O TEMPO Pelotas apenas organiza o acesso e não altera os dados.
          </p>
        </div>

        <aside className="lagoon-dashboard-aside" aria-label="Condições relacionadas ao nível da lagoa">
          <article className="lagoon-station-card">
            <span className="lagoon-station-status">
              <i aria-hidden="true" />
              Monitoramento externo
            </span>
            <strong>Praia do Laranjal</strong>
            <small>Pelotas / RS · {updatedAt}</small>
          </article>

          <div className="lagoon-side-metrics">
            <article>
              <span className="lagoon-side-icon">
                <WindIcon />
              </span>
              <div>
                <small>Vento agora</small>
                <strong>{windSpeed} km/h</strong>
                <span>{windDirection}</span>
              </div>
            </article>
            <article>
              <span className="lagoon-side-icon">
                <WindIcon />
              </span>
              <div>
                <small>Maior rajada próxima</small>
                <strong>{windGust} km/h</strong>
                <span>Agora e próximas horas</span>
              </div>
            </article>
            <article>
              <span className="lagoon-side-icon">
                <RainIcon />
              </span>
              <div>
                <small>Chuva estimada hoje</small>
                <strong>{formatMillimeters(precipitation)} mm</strong>
                <span>Previsão meteorológica</span>
              </div>
            </article>
          </div>

          <article className="lagoon-reading-card">
            <span className="eyebrow">Leitura combinada</span>
            <h3>{condition}</h3>
            <p>
              Observe a tendência do nível junto do vento e da chuva. Uma leitura isolada não define
              risco de inundação.
            </p>
          </article>

          <a
            className="lagoon-original-link"
            href={LAGOON_LEVEL_SOURCE.dashboardUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <small>Fonte oficial do dado</small>
              <strong>Abrir painel completo</strong>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </aside>
      </div>
    </section>
  );
}
