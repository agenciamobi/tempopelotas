import { SiteHeader } from "@/components/site-header";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { WeatherMap } from "@/components/weather-map";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TEMPO Pelotas",
  url: absoluteUrl("/"),
  description:
    "Portal meteorológico local com previsão do tempo para Pelotas e a Zona Sul do Rio Grande do Sul.",
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
  const weather = await getPelotasWeather();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="site-shell">
        <SiteHeader />

        <div className="dashboard-layout">
          <WeatherMap regionalWeather={weather.regional} />
          <WeatherDashboard weather={weather} />
        </div>

        <footer className="site-footer">
          <div>
            <strong>TEMPO Pelotas</strong>
            <p>Informação meteorológica local, clara e acessível.</p>
          </div>
          <p>
            Fonte meteorológica: {weather.source.url ? (
              <a href={weather.source.url} target="_blank" rel="noreferrer">
                {weather.source.name}
              </a>
            ) : weather.source.name}
            {weather.source.isFallback
              ? ". A integração externa está temporariamente indisponível e o sistema exibiu dados de contingência."
              : ". Dados atualizados automaticamente a cada 10 minutos."}
          </p>
        </footer>
      </div>
    </>
  );
}
