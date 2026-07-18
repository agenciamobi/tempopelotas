import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { WeatherData } from "@/lib/weather-data";

const relatedPages = [
  {
    href: "/tempo-hoje-pelotas",
    title: "Tempo hoje",
    description: "Condição atual e previsão por hora.",
  },
  {
    href: "/previsao-7-dias-pelotas",
    title: "Previsão de 7 dias",
    description: "Máximas, mínimas e tendência semanal.",
  },
  {
    href: "/chuva-em-pelotas",
    title: "Chuva em Pelotas",
    description: "Probabilidade e acumulado estimado.",
  },
  {
    href: "/vento-em-pelotas",
    title: "Vento em Pelotas",
    description: "Velocidade, direção e rajadas.",
  },
  {
    href: "/alertas",
    title: "Alertas e atenção",
    description: "Leitura automática e fontes oficiais.",
  },
];

type ForecastPageShellProps = {
  weather: WeatherData;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  currentPath: string;
};

export function ForecastPageShell({
  weather,
  eyebrow,
  title,
  description,
  children,
  currentPath,
}: ForecastPageShellProps) {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="topic-page">
        <section className="topic-hero">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="topic-hero-status">
            <span>{weather.current.updatedAt}</span>
            <strong>{weather.current.temperature}°</strong>
            <small>{weather.current.condition}</small>
          </div>
        </section>

        {children}

        <section className="related-weather" aria-labelledby="related-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Explore a previsão</span>
              <h2 id="related-title">Informações meteorológicas de Pelotas</h2>
            </div>
          </div>
          <div className="related-weather-grid">
            {relatedPages
              .filter((page) => page.href !== currentPath)
              .map((page) => (
                <Link href={page.href} key={page.href}>
                  <strong>{page.title}</strong>
                  <span>{page.description}</span>
                  <i aria-hidden="true">→</i>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <SiteFooter source={weather.source} />
    </div>
  );
}
