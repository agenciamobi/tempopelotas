import type { Metadata } from "next";
import { ForecastPageShell } from "@/components/forecast-page-shell";
import { WeatherIcon } from "@/components/weather-icon";
import { WeatherTrendChart } from "@/components/weather-trend-chart";
import { formatMillimeters } from "@/lib/weather-insights";
import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Tempo hoje em Pelotas",
  description:
    "Veja a temperatura agora, sensação térmica, chuva, vento e previsão por hora para Pelotas, RS.",
  alternates: { canonical: "/tempo-hoje-pelotas" },
  openGraph: {
    title: "Tempo hoje em Pelotas, RS",
    description:
      "Condição atual e previsão por hora para Pelotas, com chuva, vento e temperatura.",
    url: "/tempo-hoje-pelotas",
  },
};

export default async function TempoHojePelotasPage() {
  const weather = await getPelotasWeather();
  const { current, hourly, daily } = weather;
  const today = daily[0];
  const faqs = [
    {
      question: "Qual é a temperatura agora em Pelotas?",
      answer: `A temperatura atual em Pelotas é de ${current.temperature}°C, com sensação térmica de ${current.feelsLike}°C e condição de ${current.condition.toLowerCase()}.`,
    },
    {
      question: "Vai chover hoje em Pelotas?",
      answer: `A probabilidade máxima de chuva prevista para hoje é de ${today?.rainChance ?? 0}%, com acumulado estimado de ${formatMillimeters(today?.precipitation ?? 0)} mm.`,
    },
    {
      question: "Qual é a máxima e a mínima de hoje?",
      answer: `A previsão indica máxima de ${today?.max ?? current.temperature}°C e mínima de ${today?.min ?? current.temperature}°C em Pelotas.`,
    },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <ForecastPageShell
      weather={weather}
      eyebrow="Condição atual"
      title="Tempo hoje em Pelotas"
      description="Acompanhe a temperatura agora e a evolução da chuva, do vento e da sensação térmica ao longo do dia."
      currentPath="/tempo-hoje-pelotas"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="topic-current-card" aria-labelledby="today-current-title">
        <div className="topic-current-icon">
          <WeatherIcon name={current.icon} title={current.condition} />
        </div>
        <div className="topic-current-temperature">
          <span>{current.temperature}°</span>
          <div>
            <h2 id="today-current-title">{current.condition}</h2>
            <p>Sensação térmica de {current.feelsLike}°C</p>
          </div>
        </div>
        <div className="topic-current-range">
          <span>Máxima <strong>{today?.max ?? current.temperature}°</strong></span>
          <span>Mínima <strong>{today?.min ?? current.temperature}°</strong></span>
        </div>
      </section>

      <section className="topic-metrics" aria-label="Resumo do tempo hoje">
        <article><span>Umidade</span><strong>{current.humidity}%</strong><small>Umidade relativa do ar</small></article>
        <article><span>Vento</span><strong>{current.windSpeed} km/h</strong><small>Direção {current.windDirection}</small></article>
        <article><span>Rajadas</span><strong>{current.windGust} km/h</strong><small>Velocidade instantânea</small></article>
        <article><span>Chuva prevista</span><strong>{formatMillimeters(today?.precipitation ?? 0)} mm</strong><small>{today?.rainChance ?? 0}% de probabilidade</small></article>
      </section>

      <WeatherTrendChart hourly={hourly} initialMetric="temperature" />

      <section className="topic-section" aria-labelledby="today-hours-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Próximas horas</span>
            <h2 id="today-hours-title">Evolução do tempo em Pelotas</h2>
          </div>
          <p>Previsão horária com temperatura, chuva e rajadas de vento.</p>
        </div>
        <div className="topic-hourly-table">
          {hourly.map((hour, index) => (
            <article className={index === 0 ? "is-current" : ""} key={`${hour.time}-${index}`}>
              <strong>{hour.time}</strong>
              <WeatherIcon name={hour.icon} title={`Condição às ${hour.time}`} />
              <span>{hour.temperature}°C</span>
              <span>{hour.precipitation}% chuva</span>
              <span>Rajadas {hour.windGust} km/h</span>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section topic-copy" aria-labelledby="today-faq-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Perguntas frequentes</span>
            <h2 id="today-faq-title">Tempo em Pelotas hoje</h2>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="data-note">
          Os dados são modelos meteorológicos e podem mudar. Para decisões de segurança, consulte avisos oficiais da Defesa Civil e do INMET.
        </p>
      </section>
    </ForecastPageShell>
  );
}
