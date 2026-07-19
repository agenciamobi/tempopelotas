import Link from "next/link";
import { EmbrapaObservationOverview } from "@/components/embrapa-observation-overview";
import { HydrologyOverview } from "@/components/hydrology-overview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { WeatherHero } from "@/components/weather-hero";
import { WeatherMap } from "@/components/weather-map";
import { WeatherNavigation } from "@/components/weather-navigation";
import { getGuaibaObservation } from "@/lib/guaiba-monitor";
import { getLagoonMonitoringNetwork } from "@/lib/lagoon-monitoring-network";
import { getLaranjalLevelData } from "@/lib/laranjal-level";
import { absoluteUrl } from "@/lib/site";
import { getWeatherAdvisory } from "@/lib/weather-insights";
import { getPelotasWeatherWithObservation } from "@/lib/weather-service";

export const revalidate = 300;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TEMPO Pelotas",
  url: absoluteUrl("/"),
  description:
    "Portal meteorológico e hidrológico local para preparação comunitária em Pelotas e na Zona Sul do Rio Grande do Sul.",
  inLanguage: "pt-BR",
  areaServed: {
    "@type": "City",
    name: "Pelotas",
    containedInPlace: {
      "@type": "State",
      name: "Rio Grande do Sul",
    },
  },
};

export default async function Home() {
  const [
    { weather, observation: embrapaObservation },
    guaibaObservation,
    lagoonMonitoring,
    laranjalObservation,
  ] = await Promise.all([
    getPelotasWeatherWithObservation(),
    getGuaibaObservation(),
    getLagoonMonitoringNetwork(),
    getLaranjalLevelData(),
  ]);
  const advisory = getWeatherAdvisory(weather);
  const today = weather.daily[0];
  const embrapaStatus =
    embrapaObservation.status === "live"
      ? "Medição disponível"
      : embrapaObservation.status === "unavailable"
        ? "Fonte indisponível"
        : "Dados parciais";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\u003c"),
        }}
      />

      <div className="site-shell site-shell--home">
        <SiteHeader advisoryLevel={advisory.level} variant="hero" />
        <WeatherHero weather={weather} />

        <main className="home-main-v2">
          <nav className="home-reading-order-v2" aria-label="Principais informações da homepage">
            <div className="home-reading-order-v2__intro">
              <span className="eyebrow">Leitura rápida</span>
              <strong>Comece pelo tempo de hoje e avance até a situação das águas</strong>
              <p>
                A homepage agora separa previsão, mapa, observação local e hidrologia para facilitar a leitura.
              </p>
            </div>

            <div className="home-reading-order-v2__links">
              <a href="#previsao-hoje" className={`is-${advisory.level}`}>
                <span>01</span>
                <div>
                  <small>Previsão e atenção</small>
                  <strong>{weather.current.temperature}° · {weather.current.condition}</strong>
                  <p>{advisory.title}</p>
                </div>
              </a>
              <a href="#regiao">
                <span>02</span>
                <div>
                  <small>Mapa regional</small>
                  <strong>Pelotas e Zona Sul</strong>
                  <p>Mapa, satélite e chuva.</p>
                </div>
              </a>
              <a href="#observacao-embrapa">
                <span>03</span>
                <div>
                  <small>Observação local</small>
                  <strong>Estação Embrapa</strong>
                  <p>{embrapaStatus}</p>
                </div>
              </a>
              <a href="#situacao-das-aguas">
                <span>04</span>
                <div>
                  <small>Situação hidrológica</small>
                  <strong>Laranjal, Lagoa e Guaíba</strong>
                  <p>Acompanhamento local e regional.</p>
                </div>
              </a>
            </div>
          </nav>

          <section className="home-stage-v2 home-stage-v2--forecast" id="previsao-hoje" aria-labelledby="home-forecast-title">
            <div className="home-stage-v2__heading">
              <div>
                <span className="eyebrow">01 · Previsão para Pelotas</span>
                <h2 id="home-forecast-title">O que esperar hoje e nos próximos dias</h2>
                <p>
                  Consulte primeiro a evolução por hora e a previsão semanal. Use o mapa ao lado para entender
                  como as condições se distribuem pela Zona Sul.
                </p>
              </div>
              <div className="home-stage-v2__summary" aria-label="Resumo da previsão de hoje">
                <div>
                  <small>Máxima</small>
                  <strong>{today?.max ?? weather.current.temperature}°</strong>
                </div>
                <div>
                  <small>Mínima</small>
                  <strong>{today?.min ?? weather.current.temperature}°</strong>
                </div>
                <div>
                  <small>Chance de chuva</small>
                  <strong>{today?.rainChance ?? 0}%</strong>
                </div>
              </div>
              <div className="home-stage-v2__actions">
                <Link href="/tempo-hoje-pelotas">Abrir previsão completa <span aria-hidden="true">→</span></Link>
                <Link href="/alertas">Ver condições de atenção</Link>
              </div>
            </div>

            <div className="home-forecast-grid-v2">
              <div className="home-forecast-content-v2">
                <WeatherDashboard weather={weather} showCurrent={false} />
              </div>

              <aside className="home-map-column-v2" aria-label="Mapa meteorológico regional">
                <WeatherMap regionalWeather={weather.regional} />
                <div className="home-map-note-v2">
                  <span className="eyebrow">Como usar o mapa</span>
                  <strong>Observe a região, mas priorize a previsão de Pelotas</strong>
                  <p>
                    Temperaturas e chuva podem variar entre municípios. Use os controles para alternar entre
                    mapa, satélite e precipitação.
                  </p>
                </div>
              </aside>
            </div>
          </section>

          <div className="home-stage-v2 home-stage-v2--observation">
            <div className="home-stage-marker-v2">
              <span>02</span>
              <div>
                <small>Observação oficial em Pelotas</small>
                <strong>Compare a previsão com o que foi realmente medido</strong>
              </div>
            </div>
            <EmbrapaObservationOverview observation={embrapaObservation} />
          </div>

          <div className="home-stage-v2 home-stage-v2--hydrology">
            <div className="home-stage-marker-v2">
              <span>03</span>
              <div>
                <small>Águas que podem afetar Pelotas</small>
                <strong>Comece pelo Laranjal e avance para Lagoa dos Patos e Guaíba</strong>
              </div>
              <Link href="/situacao-hidrologica-pelotas">Abrir página completa <span aria-hidden="true">→</span></Link>
            </div>
            <HydrologyOverview
              weather={weather}
              guaiba={guaibaObservation}
              lagoonMonitoring={lagoonMonitoring}
              laranjal={laranjalObservation}
            />
          </div>

          <div className="home-stage-v2 home-stage-v2--navigation" id="explorar-portal">
            <div className="home-stage-marker-v2">
              <span>04</span>
              <div>
                <small>Explore o portal</small>
                <strong>Acesse páginas específicas sem repetir toda a leitura da homepage</strong>
              </div>
            </div>
            <div className="home-weather-navigation">
              <WeatherNavigation />
            </div>
          </div>
        </main>

        <SiteFooter source={weather.source} />
      </div>
    </>
  );
}
