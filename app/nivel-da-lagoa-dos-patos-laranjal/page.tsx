import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { LagoonLevelDashboard } from "@/components/lagoon-level-dashboard";
import { absoluteUrl } from "@/lib/site";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { formatMillimeters } from "@/lib/weather-insights";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Nível da Lagoa dos Patos no Laranjal em tempo real",
  description:
    "Consulte o medidor do nível da Lagoa dos Patos na Estação Laranjal, em Pelotas, com acesso ao painel do LabHidroSens / UFPel.",
  alternates: { canonical: "/nivel-da-lagoa-dos-patos-laranjal" },
  openGraph: {
    title: "Nível da Lagoa dos Patos no Laranjal",
    description:
      "Acompanhe a Estação Laranjal e consulte o painel externo de medição do nível da Lagoa dos Patos.",
    url: "/nivel-da-lagoa-dos-patos-laranjal",
  },
};

export default async function NivelDaLagoaPage() {
  const weather = await getPelotasWeather();
  const today = weather.daily[0];
  const maxHourlyGust = Math.max(
    weather.current.windGust,
    ...weather.hourly.map((hour) => hour.windGust),
  );

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Nível da Lagoa dos Patos na Estação Laranjal",
    url: absoluteUrl("/nivel-da-lagoa-dos-patos-laranjal"),
    description:
      "Página de acesso ao painel público de medição do nível da Lagoa dos Patos na Praia do Laranjal, em Pelotas.",
    inLanguage: "pt-BR",
    about: {
      "@type": "BodyOfWater",
      name: "Lagoa dos Patos",
    },
    isBasedOn: LAGOON_LEVEL_SOURCE.dashboardUrl,
    provider: {
      "@type": "Organization",
      name: LAGOON_LEVEL_SOURCE.name,
    },
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Monitoramento hidrológico"
      title="Nível da Lagoa dos Patos no Laranjal"
      description="Acompanhe o painel público da Estação Laranjal e compare a medição com as condições atuais de vento e chuva em Pelotas."
      currentPath="/nivel-da-lagoa-dos-patos-laranjal"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="lagoon-context" aria-label="Condições meteorológicas relacionadas">
        <article>
          <span>Estação monitorada</span>
          <strong>Laranjal</strong>
          <small>Praia do Laranjal, Pelotas / RS</small>
        </article>
        <article>
          <span>Vento agora</span>
          <strong>{weather.current.windSpeed} km/h</strong>
          <small>{weather.current.windDirection}</small>
        </article>
        <article>
          <span>Maior rajada próxima</span>
          <strong>{maxHourlyGust} km/h</strong>
          <small>Agora e próximas horas</small>
        </article>
        <article>
          <span>Chuva estimada hoje</span>
          <strong>{formatMillimeters(today?.precipitation ?? 0)} mm</strong>
          <small>Previsão meteorológica, não medição da lagoa</small>
        </article>
      </section>

      <LagoonLevelDashboard />

      <section className="topic-section lagoon-explanation" aria-labelledby="lagoon-explanation-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Leitura responsável</span>
            <h2 id="lagoon-explanation-title">Como usar essa informação</h2>
          </div>
          <p>
            O valor exibido pelo medidor deve ser interpretado conforme a referência técnica da
            própria estação e em conjunto com comunicados dos órgãos responsáveis.
          </p>
        </div>

        <div className="lagoon-explanation-grid">
          <article>
            <span>01</span>
            <h3>Acompanhe a tendência</h3>
            <p>
              Observe a evolução ao longo do tempo. Uma leitura isolada não descreve sozinha a
              dinâmica da Lagoa dos Patos.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Compare com vento e chuva</h3>
            <p>
              Condições meteorológicas e aportes hídricos podem influenciar o comportamento da
              lagoa em diferentes escalas de tempo.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Priorize avisos oficiais</h3>
            <p>
              Em situação de risco, siga Defesa Civil, Prefeitura, Sanep e demais autoridades
              competentes.
            </p>
          </article>
        </div>

        <div className="lagoon-disclaimer">
          <strong>Importante</strong>
          <p>
            O TEMPO Pelotas não define cotas de inundação nem transforma automaticamente a leitura
            da estação em alerta. O painel e os dados pertencem ao provedor indicado.
          </p>
        </div>
      </section>
    </ForecastPageShell>
  );
}
