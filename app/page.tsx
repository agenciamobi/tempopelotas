import { EmbrapaObservationOverview } from "@/components/embrapa-observation-overview";
import { HydrologyOverview } from "@/components/hydrology-overview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { WeatherMap } from "@/components/weather-map";
import { WeatherNavigation } from "@/components/weather-navigation";
import { getEmbrapaObservation } from "@/lib/embrapa-observation";
import { absoluteUrl } from "@/lib/site";
import { getPelotasWeather } from "@/lib/weather-service";

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
  const [weather, embrapaObservation] = await Promise.all([
    getPelotasWeather(),
    getEmbrapaObservation(),
  ]);

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

        <EmbrapaObservationOverview observation={embrapaObservation} />

        <HydrologyOverview weather={weather} />

        <div className="home-weather-navigation">
          <WeatherNavigation />
        </div>

        <SiteFooter source={weather.source} />
      </div>
    </>
  );
}
