import { SiteHeader } from "@/components/site-header";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { WeatherMap } from "@/components/weather-map";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TEMPO Pelotas",
  url: "https://tempopelotas.com.br/",
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

export default function Home() {
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
          <WeatherMap />
          <WeatherDashboard />
        </div>

        <footer className="site-footer">
          <div>
            <strong>TEMPO Pelotas</strong>
            <p>Informação meteorológica local, clara e acessível.</p>
          </div>
          <p>
            Front-end inicial com dados demonstrativos. A fonte oficial será identificada em cada previsão após a integração da API.
          </p>
        </footer>
      </div>
    </>
  );
}
