import Link from "next/link";
import { GuaibaLevelCard } from "@/components/guaiba-level-card";
import { LagoonLevelHomeCard } from "@/components/lagoon-level-home-card";
import {
  HYDROLOGY_FLOW,
  HYDROLOGY_STATIONS,
  SGB_SACE_URL,
} from "@/lib/hydrology";
import type { GuaibaObservationData } from "@/lib/guaiba-monitor";
import type { WeatherData } from "@/lib/weather-data";

type HydrologyOverviewProps = {
  weather: WeatherData;
  guaiba: GuaibaObservationData;
};

function FlowArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export function HydrologyOverview({ weather, guaiba }: HydrologyOverviewProps) {
  const laranjalStation =
    HYDROLOGY_STATIONS.find((station) => station.code === "87955000") ??
    HYDROLOGY_STATIONS[0];
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
          <span className="hydrology-stage-label">Águas que podem afetar Pelotas</span>
          <span className="eyebrow">Acompanhamento para prevenção</span>
          <h2 id="hydrology-home-title">Situação das águas no Rio Grande do Sul e em Pelotas</h2>
          <p>
            Veja como estão o Guaíba e a Lagoa dos Patos e acompanhe as condições que podem influenciar
            o Laranjal e as áreas baixas de Pelotas. O cenário local depende de várias bacias, rios e
            arroios, além do vento, da chuva, do Canal São Gonçalo e da saída de água pela Barra de Rio
            Grande.
          </p>
        </div>
        <div className="hydrology-home-actions">
          <Link className="hydrology-primary-action" href="/situacao-hidrologica-pelotas">
            Ver panorama completo
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="hydrology-secondary-action" href="/metodologia">
            Entender os dados
          </Link>
        </div>
      </div>

      <ol className="hydrology-flow" aria-label="Contribuições e escoamento relacionados a Pelotas">
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
          <GuaibaLevelCard data={guaiba} />

          <article className="hydrology-context-card hydrology-context-card--local">
            <span className="eyebrow">Medição próxima de Pelotas</span>
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
              Acompanhar nível e orientações
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
              <small>Previsão para as próximas horas</small>
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
              <strong>Consultar níveis, boletins e avisos do SACE</strong>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </aside>
      </div>

      <div className="hydrology-community-note">
        <strong>Acompanhe e prepare-se</strong>
        <p>
          Observe a evolução dos níveis e mantenha atenção aos comunicados oficiais. Em situações de
          risco, siga as orientações da Defesa Civil, Prefeitura, Sanep, ANA, SGB e demais autoridades.
        </p>
      </div>
    </section>
  );
}
