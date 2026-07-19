import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { LagoonLevelDashboard } from "@/components/lagoon-level-dashboard";
import { absoluteUrl } from "@/lib/site";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Nível da Lagoa dos Patos no Laranjal em tempo real",
  description:
    "Acompanhe o nível da Lagoa dos Patos na Estação Laranjal, em Pelotas, e veja como vento e chuva podem influenciar o cenário local.",
  alternates: { canonical: "/nivel-da-lagoa-dos-patos-laranjal" },
  openGraph: {
    title: "Nível da Lagoa dos Patos no Laranjal",
    description:
      "Veja a medição da Estação Laranjal e acompanhe as condições meteorológicas relacionadas em Pelotas.",
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
      "Monitoramento do nível da Lagoa dos Patos na Praia do Laranjal, em Pelotas, com contexto de vento e chuva.",
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
      eyebrow="Lagoa dos Patos em Pelotas"
      title="Nível da Lagoa no Laranjal"
      description="Veja a medição da Estação Laranjal, acompanhe se o nível está subindo ou baixando e considere também vento, chuva e avisos oficiais."
      currentPath="/nivel-da-lagoa-dos-patos-laranjal"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema).replace(/</g, "\\u003c"),
        }}
      />

      <LagoonLevelDashboard
        windSpeed={weather.current.windSpeed}
        windDirection={weather.current.windDirection}
        windGust={maxHourlyGust}
        precipitation={today?.precipitation ?? 0}
        condition={weather.current.condition}
        updatedAt={weather.current.updatedAt}
      />

      <section className="topic-section lagoon-explanation" aria-labelledby="lagoon-explanation-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Antes de tomar decisões</span>
            <h2 id="lagoon-explanation-title">O que observar no medidor</h2>
          </div>
          <p>
            O número atual é importante, mas a evolução ao longo das horas oferece uma leitura mais
            útil. Compare o nível com as condições meteorológicas e com os comunicados das autoridades.
          </p>
        </div>

        <div className="lagoon-explanation-grid">
          <article>
            <span>01</span>
            <h3>Veja se está subindo ou baixando</h3>
            <p>
              Acompanhe vários pontos do gráfico. Uma sequência contínua de alta merece mais atenção do
              que uma única leitura isolada.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Observe vento e chuva</h3>
            <p>
              Vento persistente pode deslocar ou represar água na lagoa, enquanto chuva local e nas
              bacias contribuintes pode aumentar o volume recebido.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Confirme os avisos oficiais</h3>
            <p>
              Em caso de risco, siga as orientações da Defesa Civil, Prefeitura, Sanep e demais órgãos
              responsáveis pela resposta à emergência.
            </p>
          </article>
        </div>

        <div className="lagoon-disclaimer">
          <strong>Use o medidor como apoio</strong>
          <p>
            O TEMPO Pelotas não estabelece cotas de inundação para bairros, não emite ordem de
            evacuação e não substitui os alertas oficiais. A medição pertence à fonte identificada no
            painel.
          </p>
        </div>
      </section>
    </ForecastPageShell>
  );
}
