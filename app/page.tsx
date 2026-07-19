import { EmbrapaObservationOverview } from "@/components/embrapa-observation-overview";
import { HydrologyOverview } from "@/components/hydrology-overview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { WeatherHero } from "@/components/weather-hero";
import { WeatherMap } from "@/components/weather-map";
import { WeatherNavigation } from "@/components/weather-navigation";
import { getGuaibaObservation } from "@/lib/guaiba-monitor";
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
  const [{ weather, observation: embrapaObservation }, guaibaObservation] =
    await Promise.all([
      getPelotasWeatherWithObservation(),
      getGuaibaObservation(),
    ]);
  const advisoryLevel = getWeatherAdvisory(weather).level;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\u003c"),
        }}
      />

      <div className="site-shell">
        <SiteHeader advisoryLevel={advisoryLevel} />
        <WeatherHero weather={weather} />

        <div className="dashboard-layout dashboard-layout--after-hero">
          <WeatherMap regionalWeather={weather.regional} />
          <WeatherDashboard weather={weather} showCurrent={false} />
        </div>

        <EmbrapaObservationOverview observation={embrapaObservation} />

        <HydrologyOverview weather={weather} guaiba={guaibaObservation} />

        <div className="home-weather-navigation">
          <WeatherNavigation />
        </div>

        <SiteFooter source={weather.source} />
      </div>
    </>
  );
}