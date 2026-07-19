import Link from "next/link";
import { LagoonLevelHomeCard } from "@/components/lagoon-level-home-card";
import {
  ANA_TELEMETRY_URL,
  HYDROLOGY_FLOW,
  HYDROLOGY_STATIONS,
  SGB_SACE_URL,
} from "@/lib/hydrology";
import type { WeatherData } from "@/lib/weather-data";

type HydrologyOverviewProps = {
  weather: WeatherData;
};

function FlowArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5c3 3.7 5 6.3 5 9a5 5 0 0 1-10 0c0-2.7 2-5.3 5-9Z" />
      <path d="M4 19c2 0 2-1.2 4-1.2S10 19 12 19s2-1.2 4-1.2S18 19 20 19" />
    </svg>
  );
}

export function HydrologyOverview({ weather }: HydrologyOverviewProps) {
  const guaibaStation = HYDROLOGY_STATIONS[0];
  const laranjalStation = HYDROLOGY_STATIONS[1];
  const today = weather.daily[0];
  const strongestUpcomingGust = Math.max(
    weather.current.windGust,
    ...weather.hourly.map((hour) => hour.windGust),
  );

  return (
    <section
      className="hydrology-home"
      id="situacao-das-aguas"
      aria-labelledby="hydrology-home-title"
    >
      <div className="hydrology-home-intro">
        <div>
          <span className="hydrology-stage-label">Segunda etapa da homepage</span>
          <span className="eyebrow">Monitoramento para prevenção</span>
          <h2 id="hydrology-home-title">Situação das águas no Rio Grande do Sul e em Pelotas</h2>
          <p>
            O nível observado em Pelotas precisa ser interpretado dentro de um sistema maior. A água
            que chega ao Guaíba segue para a Lagoa dos Patos, enquanto vento, chuva e condições de
            escoamento influenciam a resposta no Laranjal e nas áreas baixas da cidade.
          </p>
        </div>
        <div className="hydrology-home-actions">
          <Link className="hydrology-primary-action" href="/situacao-hidrologica-pelotas">
            Abrir situação hidrológica
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="hydrology-secondary-action" href="/metodologia">
            Fontes e metodologia
          </Link>
        </div>
      </div>

      <ol className="hydrology-flow" aria-label="Caminho regional das águas até Pelotas">
        {HYDROLOGY_FLOW.map((step, index) => (
          <li key={step.title}>
            <span className="hydrology-flow-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
            {index < HYDROLOGY_FLOW.length - 1 ? (
              <span className="hydrology-flow-arrow">
                <FlowArrow />
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="hydrology-home-grid">
        <LagoonLevelHomeCard />

        <aside className="hydrology-context-column" aria-label="Contexto hidrológico regional e local">
          <article className="hydrology-context-card hydrology-context-card--regional">
            <div className="hydrology-context-icon">
              <WaterIcon />
            </div>
            <span className="eyebrow">Indicador regional</span>
            <h3>Guaíba em Porto Alegre</h3>
            <p>
              A estação {guaibaStation.name} ajuda a acompanhar o volume que seguirá para a Lagoa
              dos Patos. O dado não permite prever sozinho o nível futuro em Pelotas.
            </p>
            <dl>
              <div>
                <dt>Estação ANA</dt>
                <dd>{guaibaStation.code}</dd>
              </div>
              <div>
                <dt>Corpo hídrico</dt>
                <dd>{guaibaStation.waterBody}</dd>
              </div>
            </dl>
            <a href={ANA_TELEMETRY_URL} target="_blank" rel="noreferrer">
              Consultar telemetria oficial
              <span aria-hidden="true">↗</span>
            </a>
          </article>

          <article className="hydrology-context-card hydrology-context-card--local">
            <span className="eyebrow">Referência local</span>
            <h3>Estação Laranjal</h3>
            <p>{laranjalStation.role}</p>
            <dl>
              <div>
                <dt>Código ANA</dt>
                <dd>{laranjalStation.code}</dd>
              </div>
              <div>
                <dt>Local</dt>
                <dd>Praia do Laranjal</dd>
              </div>
            </dl>
            <Link href="/nivel-da-lagoa-dos-patos-laranjal">
              Ver medidor e orientações
              <span aria-hidden="true">→</span>
            </Link>
          </article>

          <div className="hydrology-driver-grid" aria-label="Condições meteorológicas relacionadas">
            <article>
              <span>Vento atual</span>
              <strong>{weather.current.windSpeed} km/h</strong>
              <small>{weather.current.windDirection}</small>
            </article>
            <article>
              <span>Maior rajada próxima</span>
              <strong>{strongestUpcomingGust} km/h</strong>
              <small>Agora e próximas horas</small>
            </article>
            <article>
              <span>Chuva prevista hoje</span>
              <strong>{today?.precipitation ?? 0} mm</strong>
              <small>{today?.rainChance ?? 0}% de probabilidade</small>
            </article>
          </div>

          <a className="hydrology-sgb-link" href={SGB_SACE_URL} target="_blank" rel="noreferrer">
            <span>
              <small>Serviço Geológico do Brasil</small>
              <strong>Consultar monitoramento e boletins do SACE</strong>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </aside>
      </div>

      <div className="hydrology-community-note">
        <strong>Informação para preparação comunitária</strong>
        <p>
          Este painel reúne contexto e fontes públicas para facilitar o acompanhamento. Ele não
          substitui alertas, ordens de evacuação ou orientações da Defesa Civil, Prefeitura, Sanep,
          ANA, SGB e demais autoridades competentes.
        </p>
      </div>
    </section>
  );
}
