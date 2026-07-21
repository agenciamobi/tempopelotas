import type { CppmetForecastData } from "@/lib/cppmet-forecast";

type CppmetForecastSummaryProps = {
  data: CppmetForecastData;
};

function formatTemperature(value: number | null) {
  if (value === null) return null;

  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
  }).format(value)}°`;
}

export function CppmetForecastSummary({ data }: CppmetForecastSummaryProps) {
  if (data.status !== "live" || data.items.length === 0) return null;

  return (
    <section
      className="cppmet-forecast-summary"
      aria-labelledby="cppmet-forecast-summary-title"
    >
      <header className="cppmet-forecast-summary__heading">
        <div>
          <span className="eyebrow">Previsão elaborada em Pelotas</span>
          <h2 id="cppmet-forecast-summary-title">Resumo do CPPMet/UFPel</h2>
        </div>
        <p>
          Texto publicado pelo Centro de Pesquisas e Previsões Meteorológicas da
          Universidade Federal de Pelotas.
        </p>
      </header>

      <div className="cppmet-forecast-summary__grid">
        {data.items.map((item) => (
          <article key={`${item.day}-${item.text}`}>
            <div className="cppmet-forecast-summary__day">
              <strong>{item.day}</strong>
              {item.minimum !== null || item.maximum !== null ? (
                <span>
                  {formatTemperature(item.minimum) ?? "—"}
                  <i aria-hidden="true">/</i>
                  {formatTemperature(item.maximum) ?? "—"}
                </span>
              ) : null}
            </div>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>

      <footer>
        <span>Fonte: CPPMet / UFPel</span>
        <a href={data.source.url} target="_blank" rel="noreferrer">
          Conferir publicação original
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </section>
  );
}
