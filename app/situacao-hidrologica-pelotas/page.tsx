import type { Metadata } from "next";
import Link from "next/link";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { GuaibaLevelCard } from "@/components/guaiba-level-card";
import { LagoonLevelDashboard } from "@/components/lagoon-level-dashboard";
import { getGuaibaObservation } from "@/lib/guaiba-monitor";
import {
  HYDROLOGY_FLOW,
  HYDROLOGY_STATIONS,
  SGB_SACE_URL,
} from "@/lib/hydrology";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Situação hidrológica de Pelotas e da Lagoa dos Patos",
  description:
    "Acompanhe o contexto do Guaíba, das bacias contribuintes, da Lagoa dos Patos, Estação Laranjal, vento e chuva para preparação comunitária em Pelotas.",
  alternates: { canonical: "/situacao-hidrologica-pelotas" },
  openGraph: {
    title: "Situação hidrológica de Pelotas",
    description:
      "Fontes públicas, nível do Guaíba, estações da Lagoa dos Patos e monitoramento local para compreender o cenário das águas em Pelotas.",
    url: "/situacao-hidrologica-pelotas",
  },
};

export default async function SituacaoHidrologicaPelotasPage() {
  const [weather, guaiba] = await Promise.all([
    getPelotasWeather(),
    getGuaibaObservation(),
  ]);
  const today = weather.daily[0];
  const maxHourlyGust = Math.max(
    weather.current.windGust,
    ...weather.hourly.map((hour) => hour.windGust),
  );

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Referências de monitoramento hidrológico para Pelotas",
    description:
      "Conjunto de referências públicas e estações utilizadas para contextualizar a situação hidrológica da Lagoa dos Patos e de Pelotas.",
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
        contentUrl: absoluteUrl("/pelotas.json"),
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: absoluteUrl("/api/hydrology/guaiba"),
      },
    ],
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Águas e preparação comunitária"
      title="Situação hidrológica de Pelotas"
      description="Entenda como as bacias do Guaíba, outros afluentes, a Lagoa dos Patos, o vento e o escoamento pela Barra se conectam ao monitoramento do Laranjal e das áreas baixas da cidade."
      currentPath="/situacao-hidrologica-pelotas"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="topic-section" aria-labelledby="hydrology-path-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Visão regional e local</span>
            <h2 id="hydrology-path-title">Como a água chega ao cenário de Pelotas</h2>
          </div>
          <p>
            O Guaíba é um indicador importante, mas a resposta em Pelotas também depende de outras
            bacias que drenam para a Lagoa dos Patos, do Canal São Gonçalo, do vento, da chuva e do
            escoamento pelo canal da Barra entre Rio Grande e São José do Norte.
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

      <section className="topic-section" aria-labelledby="guaiba-monitor-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Indicador regional a montante</span>
            <h2 id="guaiba-monitor-title">Guaíba em Porto Alegre</h2>
          </div>
          <p>
            A tendência do Guaíba ajuda a compreender uma das principais contribuições que seguem para
            a Lagoa dos Patos. Ela não deve ser usada isoladamente para prever o nível futuro no
            Laranjal.
          </p>
        </div>
        <div className="guaiba-page-card">
          <GuaibaLevelCard data={guaiba} />
        </div>
      </section>

      <LagoonLevelDashboard
        windSpeed={weather.current.windSpeed}
        windDirection={weather.current.windDirection}
        windGust={maxHourlyGust}
        precipitation={today?.precipitation ?? 0}
        condition={weather.current.condition}
        updatedAt={weather.current.updatedAt}
      />

      <section className="topic-section" aria-labelledby="station-network-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Rede de referência</span>
            <h2 id="station-network-title">Estações oficiais relacionadas</h2>
          </div>
          <p>
            Os códigos identificam pontos da Rede Hidrometeorológica Nacional. Níveis de estações
            diferentes não devem ser comparados diretamente como se utilizassem a mesma referência
            vertical.
          </p>
        </div>

        <div className="hydrology-stations-grid">
          {HYDROLOGY_STATIONS.map((station) => (
            <article key={station.code}>
              <span className="station-code">ANA {station.code}</span>
              <small>{station.city}</small>
              <h3>{station.name}</h3>
              <p>{station.role}</p>
              <a href={station.officialUrl} target="_blank" rel="noreferrer">
                Consultar fonte oficial
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="hydrology-guidance-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Uso responsável</span>
            <h2 id="hydrology-guidance-title">Como usar o painel para se preparar</h2>
          </div>
          <p>
            A preparação deve considerar tendência, atualização dos sensores e comunicados das
            autoridades, nunca apenas um único número.
          </p>
        </div>

        <div className="methodology-rules-grid">
          <article>
            <h3>Observe a tendência</h3>
            <p>
              Verifique se o nível permanece em alta, estável ou em queda ao longo de várias
              medições. Leituras isoladas podem sofrer atraso ou oscilação.
            </p>
          </article>
          <article>
            <h3>Considere toda a bacia</h3>
            <p>
              Guaíba, Camaquã, Mirim–São Gonçalo, Litoral Médio, rios menores, arroios e chuva local
              contribuem em escalas diferentes de tempo.
            </p>
          </article>
          <article>
            <h3>Considere vento e saída</h3>
            <p>
              A direção do vento pode represar ou favorecer o deslocamento da água, enquanto a Barra
              de Rio Grande controla a conexão natural com o oceano.
            </p>
          </article>
          <article>
            <h3>Confirme a atualização</h3>
            <p>
              Sensores automáticos podem ficar temporariamente sem comunicação. Sempre confira data,
              horário e instituição responsável pela leitura.
            </p>
          </article>
          <article>
            <h3>Siga orientações oficiais</h3>
            <p>
              Em situação de risco, priorize Defesa Civil, Prefeitura, Sanep, ANA, SGB e demais
              órgãos responsáveis por alertas e ações de resposta.
            </p>
          </article>
        </div>

        <div className="lagoon-disclaimer">
          <strong>Limite do portal</strong>
          <p>
            O TEMPO Pelotas organiza informações públicas para facilitar a preparação da comunidade.
            O portal não define cotas de inundação para Pelotas, não emite ordem de evacuação e não
            substitui um sistema oficial de alerta.
          </p>
        </div>

        <div className="hydrology-home-actions">
          <Link className="hydrology-primary-action" href="/metodologia">
            Consultar metodologia e fontes
            <span aria-hidden="true">→</span>
          </Link>
          <a className="hydrology-secondary-action" href={SGB_SACE_URL} target="_blank" rel="noreferrer">
            Abrir SACE / SGB
            <span aria-hidden="true">↗</span>
          </a>
          <a className="hydrology-secondary-action" href={LAGOON_LEVEL_SOURCE.dashboardUrl} target="_blank" rel="noreferrer">
            Abrir medidor original
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </ForecastPageShell>
  );
}
