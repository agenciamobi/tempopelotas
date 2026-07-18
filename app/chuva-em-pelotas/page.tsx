import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { WeatherIcon } from "@/components/weather-icon";
import { formatMillimeters } from "@/lib/weather-insights";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Chuva em Pelotas hoje e nos próximos dias",
  description:
    "Veja a probabilidade de chuva em Pelotas por hora, o acumulado previsto e a tendência para os próximos 7 dias.",
  alternates: { canonical: "/chuva-em-pelotas" },
  openGraph: {
    title: "Previsão de chuva em Pelotas",
    description:
      "Probabilidade por hora e acumulado estimado de chuva para Pelotas, RS.",
    url: "/chuva-em-pelotas",
  },
};

export default async function ChuvaEmPelotasPage() {
  const weather = await getPelotasWeather();
  const today = weather.daily[0];
  const peakHour = weather.hourly.reduce<(typeof weather.hourly)[number] | undefined>(
    (selected, hour) =>
      !selected || hour.precipitation > selected.precipitation ? hour : selected,
    undefined,
  );
  const wettestDay = weather.daily.reduce<(typeof weather.daily)[number] | undefined>(
    (selected, day) =>
      !selected || day.precipitation > selected.precipitation ? day : selected,
    undefined,
  );

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Precipitação"
      title="Chuva em Pelotas"
      description="Acompanhe a chance de chuva por hora e o volume estimado para hoje e para os próximos dias."
      currentPath="/chuva-em-pelotas"
    >
      <section className="topic-metrics" aria-label="Resumo da chuva prevista">
        <article>
          <span>Chance máxima hoje</span>
          <strong>{today?.rainChance ?? 0}%</strong>
          <small>Probabilidade diária</small>
        </article>
        <article>
          <span>Acumulado hoje</span>
          <strong>{formatMillimeters(today?.precipitation ?? 0)} mm</strong>
          <small>Volume estimado</small>
        </article>
        <article>
          <span>Pico nas próximas horas</span>
          <strong>{peakHour?.precipitation ?? 0}%</strong>
          <small>{peakHour?.time ?? "Sem horário disponível"}</small>
        </article>
        <article>
          <span>Maior acumulado da semana</span>
          <strong>{formatMillimeters(wettestDay?.precipitation ?? 0)} mm</strong>
          <small>{wettestDay?.weekday} · {wettestDay?.date}</small>
        </article>
      </section>

      <section className="topic-section" aria-labelledby="rain-hours-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Próximas horas</span>
            <h2 id="rain-hours-title">Probabilidade de chuva por hora</h2>
          </div>
          <p>Valores maiores indicam maior possibilidade de precipitação no período.</p>
        </div>
        <div className="rain-bars">
          {weather.hourly.map((hour, index) => (
            <article key={`${hour.time}-${index}`}>
              <div>
                <strong>{hour.time}</strong>
                <WeatherIcon name={hour.icon} title={`Condição às ${hour.time}`} />
              </div>
              <div className="rain-progress" aria-label={`${hour.precipitation}% de probabilidade de chuva`}>
                <span style={{ width: `${Math.min(100, hour.precipitation)}%` }} />
              </div>
              <strong>{hour.precipitation}%</strong>
              <small>{hour.temperature}°C</small>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="rain-week-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Próximos 7 dias</span>
            <h2 id="rain-week-title">Tendência de chuva na semana</h2>
          </div>
        </div>
        <div className="data-table" role="table" aria-label="Previsão semanal de chuva">
          <div className="data-table-head" role="row">
            <span role="columnheader">Dia</span>
            <span role="columnheader">Probabilidade</span>
            <span role="columnheader">Acumulado</span>
            <span role="columnheader">Condição</span>
          </div>
          {weather.daily.map((day) => (
            <div className="data-table-row" role="row" key={`${day.weekday}-${day.date}`}>
              <span role="cell"><strong>{day.weekday}</strong><small>{day.date}</small></span>
              <span role="cell">{day.rainChance}%</span>
              <span role="cell">{formatMillimeters(day.precipitation)} mm</span>
              <span role="cell"><WeatherIcon name={day.icon} title={`Condição em ${day.weekday}`} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="topic-section topic-copy" aria-labelledby="rain-explain-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Entenda os dados</span>
            <h2 id="rain-explain-title">Chance de chuva não é volume de chuva</h2>
          </div>
        </div>
        <div className="copy-columns">
          <div>
            <h3>Probabilidade</h3>
            <p>Indica a possibilidade de chover em Pelotas durante o período. Uma chance alta não informa, sozinha, se a chuva será fraca ou intensa.</p>
          </div>
          <div>
            <h3>Acumulado em milímetros</h3>
            <p>Representa o volume total estimado. Como referência física, 1 mm equivale aproximadamente a 1 litro de água por metro quadrado.</p>
          </div>
        </div>
      </section>
    </ForecastPageShell>
  );
}
