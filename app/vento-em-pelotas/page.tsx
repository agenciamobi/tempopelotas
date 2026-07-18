import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { WeatherIcon } from "@/components/weather-icon";
import { WeatherTrendChart } from "@/components/weather-trend-chart";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Vento em Pelotas agora e previsão de rajadas",
  description:
    "Consulte a velocidade e direção do vento em Pelotas, além das rajadas previstas para as próximas horas e dias.",
  alternates: { canonical: "/vento-em-pelotas" },
  openGraph: {
    title: "Vento e rajadas em Pelotas",
    description:
      "Velocidade, direção e previsão de rajadas para Pelotas, RS.",
    url: "/vento-em-pelotas",
  },
};

export default async function VentoEmPelotasPage() {
  const weather = await getPelotasWeather();
  const peakHour = weather.hourly.reduce<(typeof weather.hourly)[number] | undefined>(
    (selected, hour) =>
      !selected || hour.windGust > selected.windGust ? hour : selected,
    undefined,
  );
  const peakDay = weather.daily.reduce<(typeof weather.daily)[number] | undefined>(
    (selected, day) =>
      !selected || day.windGust > selected.windGust ? day : selected,
    undefined,
  );

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Vento e rajadas"
      title="Vento em Pelotas"
      description="Veja a velocidade atual, a direção predominante e a previsão de rajadas para organizar atividades ao ar livre e deslocamentos."
      currentPath="/vento-em-pelotas"
    >
      <section className="wind-hero" aria-labelledby="wind-now-title">
        <div className="wind-hero-icon">
          <WeatherIcon name="wind" title="Vento em Pelotas" />
        </div>
        <div>
          <span className="eyebrow">Agora</span>
          <h2 id="wind-now-title">{weather.current.windSpeed} km/h</h2>
          <p>Vento de {weather.current.windDirection}, com rajadas de até {weather.current.windGust} km/h.</p>
        </div>
        <div className="wind-direction" aria-label={`Direção do vento: ${weather.current.windDirection}`}>
          <span>N</span>
          <strong>{weather.current.windDirection}</strong>
          <i aria-hidden="true">↑</i>
        </div>
      </section>

      <section className="topic-metrics" aria-label="Resumo do vento previsto">
        <article>
          <span>Vento atual</span>
          <strong>{weather.current.windSpeed} km/h</strong>
          <small>Direção {weather.current.windDirection}</small>
        </article>
        <article>
          <span>Rajada atual</span>
          <strong>{weather.current.windGust} km/h</strong>
          <small>Valor instantâneo</small>
        </article>
        <article>
          <span>Pico nas próximas horas</span>
          <strong>{peakHour?.windGust ?? 0} km/h</strong>
          <small>{peakHour?.time ?? "Sem horário disponível"}</small>
        </article>
        <article>
          <span>Maior rajada da semana</span>
          <strong>{peakDay?.windGust ?? 0} km/h</strong>
          <small>{peakDay?.weekday} · {peakDay?.date}</small>
        </article>
      </section>

      <WeatherTrendChart hourly={weather.hourly} initialMetric="windGust" />

      <section className="topic-section" aria-labelledby="wind-hours-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Próximas horas</span>
            <h2 id="wind-hours-title">Velocidade e rajadas de vento</h2>
          </div>
          <p>A rajada é um aumento breve da velocidade e pode ser bem superior ao vento médio.</p>
        </div>
        <div className="wind-hourly-grid">
          {weather.hourly.map((hour, index) => (
            <article className={index === 0 ? "is-current" : ""} key={`${hour.time}-${index}`}>
              <strong>{hour.time}</strong>
              <WeatherIcon name={hour.icon} title={`Condição às ${hour.time}`} />
              <dl>
                <div><dt>Vento</dt><dd>{hour.windSpeed} km/h</dd></div>
                <div><dt>Rajadas</dt><dd>{hour.windGust} km/h</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section" aria-labelledby="wind-week-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tendência semanal</span>
            <h2 id="wind-week-title">Rajadas máximas previstas</h2>
          </div>
        </div>
        <div className="data-table" role="table" aria-label="Previsão semanal de rajadas">
          <div className="data-table-head" role="row">
            <span role="columnheader">Dia</span>
            <span role="columnheader">Rajada máxima</span>
            <span role="columnheader">Temperatura</span>
            <span role="columnheader">Condição</span>
          </div>
          {weather.daily.map((day) => (
            <div className="data-table-row" role="row" key={`${day.weekday}-${day.date}`}>
              <span role="cell"><strong>{day.weekday}</strong><small>{day.date}</small></span>
              <span role="cell">{day.windGust} km/h</span>
              <span role="cell">{day.max}° / {day.min}°</span>
              <span role="cell"><WeatherIcon name={day.icon} title={`Condição em ${day.weekday}`} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="topic-section topic-copy" aria-labelledby="wind-care-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Orientação geral</span>
            <h2 id="wind-care-title">Cuidados em dias de vento forte</h2>
          </div>
        </div>
        <div className="copy-columns">
          <div>
            <h3>Objetos e estruturas externas</h3>
            <p>Recolha objetos soltos em sacadas e pátios. Evite permanecer próximo a árvores, placas, estruturas metálicas e redes elétricas durante rajadas fortes.</p>
          </div>
          <div>
            <h3>Acompanhe avisos oficiais</h3>
            <p>As previsões são estimativas. Em condições adversas, siga as orientações da Defesa Civil, do INMET e das autoridades locais.</p>
          </div>
        </div>
      </section>
    </ForecastPageShell>
  );
}
