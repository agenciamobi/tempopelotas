import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { PelotasHydrologyWidget } from "@/components/pelotas-hydrology-widget";
import { absoluteUrl } from "@/lib/site";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Monitoramento da Lagoa dos Patos no Laranjal",
  description:
    "Consulte o painel público do LabHidroSens/UFPel para acompanhar a Estação Laranjal, em Pelotas.",
  alternates: { canonical: "/nivel-da-lagoa-dos-patos-laranjal" },
  openGraph: {
    title: "Monitoramento da Lagoa dos Patos no Laranjal",
    description:
      "Acesse o painel público da UFPel para consultar a Estação Laranjal.",
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
    name: "Monitoramento da Lagoa dos Patos na Estação Laranjal",
    url: absoluteUrl("/nivel-da-lagoa-dos-patos-laranjal"),
    description:
      "Acesso ao painel público da Estação Laranjal, em Pelotas, com contexto meteorológico local.",
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
      eyebrow="Praia do Laranjal"
      title="Monitoramento da Lagoa dos Patos"
      description="Consulte o painel público da UFPel. O TEMPO Pelotas não calcula nível, tendência, cota ou situação de risco para esta estação."
      currentPath="/nivel-da-lagoa-dos-patos-laranjal"
      heroStat={{
        label: "Fonte local",
        value: "UFPel",
        detail: "Painel público do LabHidroSens",
        ariaLabel: "Fonte local: painel público do LabHidroSens e UFPel",
        tone: "water",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema).replace(/</g, "\u003c"),
        }}
      />

      <PelotasHydrologyWidget />

      <section className="topic-section lagoon-explanation" aria-labelledby="lagoon-explanation-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Contexto meteorológico</span>
            <h2 id="lagoon-explanation-title">Vento e chuva em Pelotas</h2>
          </div>
          <p>
            Os números meteorológicos abaixo permanecem separados do painel hidrológico e não são usados pelo portal para classificar a situação do Laranjal.
          </p>
        </div>

        <div className="lagoon-explanation-grid">
          <article>
            <span>01</span>
            <h3>Vento agora</h3>
            <p>
              {weather.current.windSpeed} km/h, direção {weather.current.windDirection}.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Rajada prevista</h3>
            <p>Até {maxHourlyGust} km/h nas próximas horas.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Chuva prevista hoje</h3>
            <p>{today?.precipitation ?? 0} mm na previsão diária para Pelotas.</p>
          </article>
        </div>

        <div className="lagoon-disclaimer">
          <strong>Fonte e critérios permanecem com a UFPel</strong>
          <p>
            Para confirmar a leitura ou interpretar o painel, consulte a fonte original. Em situações de risco, siga os comunicados da Defesa Civil e das autoridades responsáveis.
          </p>
        </div>
      </section>
    </ForecastPageShell>
  );
}
