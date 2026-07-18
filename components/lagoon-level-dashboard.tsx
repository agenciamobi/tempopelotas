"use client";

import { useState } from "react";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";

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

export function LagoonLevelDashboard() {
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <section className="lagoon-dashboard" aria-labelledby="lagoon-dashboard-title">
      <div className="lagoon-dashboard-heading">
        <div>
          <span className="eyebrow">Medição externa em tempo real</span>
          <h2 id="lagoon-dashboard-title">Estação Laranjal</h2>
          <p>
            O painel abaixo é fornecido pelo LabHidroSens e apresenta as medições disponibilizadas
            para o ponto da Praia do Laranjal.
          </p>
        </div>
        <div className="lagoon-source-badge">
          <span>Fonte</span>
          <strong>{LAGOON_LEVEL_SOURCE.name}</strong>
          <small>{LAGOON_LEVEL_SOURCE.location}</small>
        </div>
      </div>

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
        Caso o provedor impeça a incorporação ou a transmissão não carregue, utilize o botão
        “Abrir painel original”. O TEMPO Pelotas apenas organiza o acesso e não altera os dados.
      </p>
    </section>
  );
}
