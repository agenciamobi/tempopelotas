import Link from "next/link";

const pages = [
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

type WeatherNavigationProps = {
  currentPath?: string;
};

export function WeatherNavigation({ currentPath }: WeatherNavigationProps) {
  return (
    <section className="related-weather" aria-labelledby="related-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Explore a previsão</span>
          <h2 id="related-title">Informações meteorológicas de Pelotas</h2>
        </div>
      </div>
      <div className="related-weather-grid">
        {pages
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
  );
}
