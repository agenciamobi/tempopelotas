import type { Metadata } from "next";
import Link from "next/link";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { GuaibaLevelCard } from "@/components/guaiba-level-card";
import { LagoonMonitoringNetwork } from "@/components/lagoon-monitoring-network";
import { PelotasHydrologyWidget } from "@/components/pelotas-hydrology-widget";
import { getGuaibaObservation } from "@/lib/guaiba-monitor";
import {
  HYDROLOGY_FLOW,
  HYDROLOGY_STATIONS,
  SGB_SACE_URL,
} from "@/lib/hydrology";
import { getLagoonMonitoringNetwork } from "@/lib/lagoon-monitoring-network";
import { getLaranjalLevelData } from "@/lib/laranjal-level";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { getNivelGuaibaRegionalObservations } from "@/lib/nivel-guaiba-regional";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Situação das águas em Pelotas e na Lagoa dos Patos",
  description:
    "Acompanhe o nível no Laranjal, a rede da Lagoa dos Patos, o Guaíba, o vento e a chuva para entender melhor a situação das águas em Pelotas.",
  alternates: { canonical: "/situacao-hidrologica-pelotas" },
  openGraph: {
    title: "Situação das águas em Pelotas",
    description:
      "Veja o nível no Laranjal, a rede da Lagoa dos Patos, o Guaíba e as condições que podem influenciar Pelotas.",
    url: "/situacao-hidrologica-pelotas",
  },
};

export default async function SituacaoHidrologicaPelotasPage() {
  const [weather, guaiba, guaibaRegional, lagoonMonitoring, laranjalLevel] =
    await Promise.all([
      getPelotasWeather(),
      getGuaibaObservation(),
      getNivelGuaibaRegionalObservations(),
      getLagoonMonitoringNetwork(),
      getLaranjalLevelData(),
    ]);
  const today = weather.daily[0];
  const maxHourlyGust = Math.max(
    weather.current.windGust,
    ...weather.hourly.map((hour) => hour.windGust),
  );

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Informações sobre as águas relacionadas a Pelotas",
    description:
      "Informações públicas sobre o nível no Laranjal, o Guaíba, a Lagoa dos Patos e outros pontos monitorados no Rio Grande do Sul.",
    url: absoluteUrl("/situacao-hidrologica-pelotas"),
    spatialCoverage: "Pelotas, Lagoa dos Patos e Rio Grande do Sul",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "TEMPO Pelotas",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: absoluteUrl("/api/hydrology/laranjal"),
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: absoluteUrl("/api/hydrology/guaiba"),
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: absoluteUrl("/api/hydrology/guaiba/cities"),
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: absoluteUrl("/api/hydrology/lagoon-network"),
      },
    ],
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Águas e segurança em Pelotas"
      title="Situação das águas"
      description="Veja primeiro o nível medido no Laranjal e compare com a rede da Lagoa dos Patos, o Guaíba, a chuva e o vento. Juntas, essas informações ajudam a acompanhar o que pode afetar as áreas mais baixas de Pelotas."
      currentPath="/situacao-hidrologica-pelotas"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema).replace(/</g, "\u003c"),
        }}
      />

      <section className="topic-section hydrology-live-section" aria-labelledby="hydrology-live-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Acompanhamento agora</span>
            <h2 id="hydrology-live-title">Nível no Laranjal, no Guaíba e na rede regional</h2>
          </div>
          <p>
            Comece pela medição da Praia do Laranjal, que representa Pelotas. O nível do Guaíba e os demais
            pontos regionais ajudam a compreender o caminho da água, mas não determinam sozinhos o que
            acontecerá na cidade.
          </p>
        </div>

        <div className="hydrology-monitor-grid">
          <PelotasHydrologyWidget
            headingLevel="h3"
            initialData={laranjalLevel}
            weather={{
              windSpeed: weather.current.windSpeed,
              windDirection: weather.current.windDirection,
              windGust: maxHourlyGust,
              precipitation: today?.precipitation ?? 0,
            }}
          />
          <GuaibaLevelCard data={guaiba} regional={guaibaRegional} />
        </div>
      </section>

      <LagoonMonitoringNetwork data={lagoonMonitoring} variant="full" />

      <section className="topic-section" aria-labelledby="hydrology-path-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Entenda o caminho da água</span>
            <h2 id="hydrology-path-title">Por que o nível pode mudar em Pelotas</h2>
          </div>
          <p>
            A água que chega ao Laranjal não vem apenas do Guaíba. Outros rios e arroios também chegam
            à Lagoa dos Patos. O vento, a chuva e a saída para o oceano entre Rio Grande e São José do
            Norte também fazem diferença.
          </p>
        </div>

        <div className="hydrology-page-flow">
          {HYDROLOGY_FLOW.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="station-network-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Outros locais acompanhados</span>
            <h2 id="station-network-title">Medições oficiais relacionadas à lagoa</h2>
          </div>
          <p>
            Cada medidor pode utilizar uma estação e uma metodologia próprias. Confira a fonte, o horário
            e a referência antes de interpretar ou comparar valores.
          </p>
        </div>

        <div className="hydrology-stations-grid">
          {HYDROLOGY_STATIONS.map((station) => (
            <article key={station.code}>
              <span className="station-code">Identificação ANA {station.code}</span>
              <small>{station.city}</small>
              <h3>{station.name}</h3>
              <p>{station.role}</p>
              <a href={station.officialUrl} target="_blank" rel="noreferrer">
                Consultar medição oficial
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="hydrology-guidance-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Acompanhe com segurança</span>
            <h2 id="hydrology-guidance-title">O que observar para se preparar</h2>
          </div>
          <p>
            Não tome decisões por uma única leitura. Veja a mudança ao longo das horas, confira quando a
            medição foi atualizada e acompanhe os avisos das autoridades.
          </p>
        </div>

        <div className="methodology-rules-grid">
          <article>
            <h3>Veja se o nível continua subindo</h3>
            <p>
              Compare várias medições. Uma subida contínua merece mais atenção do que uma pequena mudança isolada.
            </p>
          </article>
          <article>
            <h3>Considere todos os rios e arroios</h3>
            <p>
              O Guaíba é importante, mas Camaquã, Mirim–São Gonçalo, Litoral Médio e outros cursos de água também alimentam a lagoa.
            </p>
          </article>
          <article>
            <h3>Observe o vento e a saída para o mar</h3>
            <p>
              O vento pode empurrar ou segurar a água. A saída da lagoa para o oceano fica entre Rio Grande e São José do Norte.
            </p>
          </article>
          <article>
            <h3>Confira a data e o horário</h3>
            <p>
              O medidor pode atrasar ou ficar fora do ar. Antes de interpretar o valor, veja quando ele foi atualizado.
            </p>
          </article>
          <article>
            <h3>Siga os avisos oficiais</h3>
            <p>
              Em situação de risco, siga a Defesa Civil, a Prefeitura, o Sanep e os demais órgãos responsáveis pela segurança da população.
            </p>
          </article>
        </div>

        <div className="lagoon-disclaimer">
          <strong>O portal ajuda no acompanhamento</strong>
          <p>
            O TEMPO Pelotas não determina quando uma área vai alagar e não emite ordem de saída. Em situações de risco, siga sempre os avisos oficiais.
          </p>
        </div>

        <div className="hydrology-home-actions">
          <Link className="hydrology-primary-action" href="/metodologia">
            Ver de onde vêm as informações
            <span aria-hidden="true">→</span>
          </Link>
          <a className="hydrology-secondary-action" href={SGB_SACE_URL} target="_blank" rel="noreferrer">
            Consultar o Serviço Geológico do Brasil
            <span aria-hidden="true">↗</span>
          </a>
          <a className="hydrology-secondary-action" href={LAGOON_LEVEL_SOURCE.dashboardUrl} target="_blank" rel="noreferrer">
            Abrir medidor do Laranjal
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </ForecastPageShell>
  );
}
