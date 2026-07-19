import Link from "next/link";
import { GuaibaLevelCard } from "@/components/guaiba-level-card";
import { LagoonMonitoringNetwork } from "@/components/lagoon-monitoring-network";
import { PelotasHydrologyWidget } from "@/components/pelotas-hydrology-widget";
import { HYDROLOGY_FLOW, SGB_SACE_URL } from "@/lib/hydrology";
import type { GuaibaObservationData } from "@/lib/guaiba-monitor";
import type { LagoonMonitoringNetworkData } from "@/lib/lagoon-monitoring-network";
import type { LaranjalLevelData } from "@/lib/laranjal-level";
import type { NivelGuaibaCityObservation } from "@/lib/nivel-guaiba-regional";
import type { WeatherData } from "@/lib/weather-data";

type HydrologyOverviewProps = {
  weather: WeatherData;
  guaiba: GuaibaObservationData;
  /**
   * Mantido como opcional para compatibilidade com versões anteriores.
   * A homepage não renderiza o diretório regional; ele pertence à página interna.
   */
  guaibaRegional?: NivelGuaibaCityObservation[];
  lagoonMonitoring: LagoonMonitoringNetworkData;
  laranjal: LaranjalLevelData;
};

function FlowArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export function HydrologyOverview({
  weather,
  guaiba,
  lagoonMonitoring,
  laranjal,
}: HydrologyOverviewProps) {
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
        <PelotasHydrologyWidget
          initialData={laranjal}
          weather={{
            windSpeed: weather.current.windSpeed,
            windDirection: weather.current.windDirection,
            windGust: strongestUpcomingGust,
            precipitation: today?.precipitation ?? 0,
          }}
          headingLevel="h3"
          className="pelotas-hydrology-widget--home"
        />

        <aside className="hydrology-context-column" aria-label="Informações sobre o Guaíba e o Laranjal">
          <GuaibaLevelCard data={guaiba} />

          <a className="hydrology-sgb-link" href={SGB_SACE_URL} target="_blank" rel="noreferrer">
            <span>
              <small>Serviço Geológico do Brasil</small>
              <strong>Consultar níveis, boletins e avisos oficiais</strong>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </aside>
      </div>

      <LagoonMonitoringNetwork data={lagoonMonitoring} variant="home" />
    </section>
  );
}
