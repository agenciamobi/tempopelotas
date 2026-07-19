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
          <span className="eyebrow">Acompanhe para se preparar</span>
          <h2 id="hydrology-home-title">Situação das águas no Rio Grande do Sul e em Pelotas</h2>
          <p>
            Veja como estão o Guaíba e a Lagoa dos Patos e acompanhe o que pode influenciar o Laranjal
            e as áreas mais baixas de Pelotas. O nível local depende de vários rios e arroios, além do
            vento, da chuva, do Canal São Gonçalo e da saída de água para o oceano.
          </p>
        </div>
        <div className="hydrology-home-actions">
          <Link className="hydrology-primary-action" href="/situacao-hidrologica-pelotas">
            Ver situação completa
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="hydrology-secondary-action" href="/metodologia">
            Ver de onde vêm as informações
          </Link>
        </div>
      </div>

      <ol className="hydrology-flow" aria-label="Caminho da água até a região de Pelotas">
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

        <aside className="hydrology-context-column" aria-label="Informações sobre o Guaíba e o Laranjal">
          <GuaibaLevelCard data={guaiba} />

          <article className="hydrology-context-card hydrology-context-card--local">
            <span className="eyebrow">Medição próxima de Pelotas</span>
            <h3>Estação Laranjal</h3>
            <p>{laranjalStation.role}</p>
            <dl>
              <div>
                <dt>Identificação da estação</dt>
                <dd>ANA {laranjalStation.code}</dd>
              </div>
              <div>
                <dt>Local</dt>
                <dd>Praia do Laranjal</dd>
              </div>
            </dl>
            <Link href="/nivel-da-lagoa-dos-patos-laranjal">
              Ver nível e orientações
              <span aria-hidden="true">→</span>
            </Link>
          </article>

          <div className="hydrology-driver-grid" aria-label="Vento e chuva em Pelotas">
            <article>
              <span>Vento agora</span>
              <strong>{weather.current.windSpeed} km/h</strong>
              <small>Direção {weather.current.windDirection}</small>
            </article>
            <article>
              <span>Rajada mais forte nas próximas horas</span>
              <strong>{strongestUpcomingGust} km/h</strong>
              <small>Previsão para Pelotas</small>
            </article>
            <article>
              <span>Chuva prevista hoje</span>
              <strong>{today?.precipitation ?? 0} mm</strong>
              <small>{today?.rainChance ?? 0}% de chance</small>
            </article>
          </div>

          <a className="hydrology-sgb-link" href={SGB_SACE_URL} target="_blank" rel="noreferrer">
            <span>
              <small>Serviço Geológico do Brasil</small>
              <strong>Consultar níveis, boletins e avisos oficiais</strong>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </aside>
      </div>

      <div className="hydrology-community-note">
        <strong>Acompanhe e prepare-se</strong>
        <p>
          Observe a mudança dos níveis e mantenha atenção aos comunicados oficiais. Em situações de
          risco, siga as orientações da Defesa Civil, Prefeitura, Sanep e demais autoridades.
        </p>
      </div>
    </section>
  );
}
