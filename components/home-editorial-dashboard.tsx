import Link from "next/link";
import { WeatherIcon } from "@/components/weather-icon";
import { WeatherMap } from "@/components/weather-map";
import type { EmbrapaObservationData } from "@/lib/embrapa-observation";
import type { GuaibaObservationData } from "@/lib/guaiba-monitor";
import type {
  LagoonMonitoringNetworkData,
  LagoonMonitoringObservation,
} from "@/lib/lagoon-monitoring-network";
import type { LaranjalLevelData } from "@/lib/laranjal-level";
import type { WeatherData } from "@/lib/weather-data";
import { getWeatherAdvisory } from "@/lib/weather-insights";

type HomeEditorialDashboardProps = {
  weather: WeatherData;
  observation: EmbrapaObservationData;
  laranjal: LaranjalLevelData;
  guaiba: GuaibaObservationData;
  lagoon: LagoonMonitoringNetworkData;
};

const exploreLinks = [
  ["/tempo-hoje-pelotas", "Tempo hoje", "Previsão detalhada para as próximas horas"],
  ["/previsao-7-dias-pelotas", "Próximos 7 dias", "Temperatura, chuva e vento na semana"],
  ["/chuva-em-pelotas", "Chuva", "Probabilidade e volume previsto"],
  ["/vento-em-pelotas", "Vento", "Velocidade, direção e rajadas"],
  ["/alertas", "Condições de atenção", "Sinais calculados pelo portal"],
  ["/situacao-hidrologica-pelotas", "Situação das águas", "Laranjal, Lagoa dos Patos e Guaíba"],
  ["/cameras-ao-vivo-pelotas", "Câmeras", "Imagens de pontos de Pelotas"],
  ["/metodologia", "Fontes e metodologia", "Origem e tratamento dos dados"],
] as const;

function formatNumber(value: number | null, maximumFractionDigits = 1) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function formatUpdatedAt(value: string | null) {
  if (!value) return "Horário indisponível";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function trendLabel(value: number | null) {
  if (value === null) return { symbol: "·", label: "Sem tendência", direction: "unknown" };
  if (Math.abs(value) < 0.1) return { symbol: "→", label: "Estável", direction: "stable" };
  if (value > 0) return { symbol: "↑", label: `Subindo ${formatNumber(value)} cm/h`, direction: "rising" };
  return { symbol: "↓", label: `Baixando ${formatNumber(Math.abs(value))} cm/h`, direction: "falling" };
}

function stationState(observation: LagoonMonitoringObservation) {
  if (observation.status === "unavailable") return "Indisponível";
  if (observation.status === "stale") return "Atrasada";
  if (observation.risk === "flooding") return "Acima da cota";
  if (observation.risk === "attention") return "Próximo da cota";
  return "Abaixo da cota";
}

export function HomeEditorialDashboard({
  weather,
  observation,
  laranjal,
  guaiba,
  lagoon,
}: HomeEditorialDashboardProps) {
  const advisory = getWeatherAdvisory(weather);
  const hourly = weather.hourly.slice(0, 8);
  const daily = weather.daily.slice(0, 5);
  const laranjalTrend = trendLabel(laranjal.trendCmPerHour);
  const guaibaTrend = trendLabel(guaiba.trendCmPerHour);
  const observationAvailable = observation.status !== "unavailable";

  return (
    <>
      <section className="home-editorial-section home-editorial-forecast" id="previsao-hoje" aria-labelledby="home-editorial-forecast-title">
        <header className="home-editorial-heading">
          <div>
            <span className="eyebrow">Previsão para Pelotas</span>
            <h2 id="home-editorial-forecast-title">O que muda nas próximas horas</h2>
          </div>
          <p>
            Uma leitura direta da temperatura, chuva e vento. Abra a página completa somente quando precisar de mais detalhes.
          </p>
        </header>

        <div className={`home-advisory-line is-${advisory.level}`}>
          <span aria-hidden="true" />
          <div>
            <small>{advisory.eyebrow}</small>
            <strong>{advisory.title}</strong>
          </div>
          <p>{advisory.reasons[0] ?? advisory.description}</p>
          <Link href="/alertas">Entender</Link>
        </div>

        <div className="home-editorial-weather-grid">
          <div className="home-editorial-forecast-column">
            <div className="home-hourly-line" aria-label="Previsão para as próximas horas">
              {hourly.map((hour, index) => (
                <article className={index === 0 ? "is-current" : undefined} key={`${hour.time}-${index}`}>
                  <span>{hour.time}</span>
                  <WeatherIcon name={hour.icon} title={`Condição às ${hour.time}`} />
                  <strong>{hour.temperature}°</strong>
                  <small>{hour.precipitation}% chuva</small>
                </article>
              ))}
            </div>

            <div className="home-days-editorial" aria-label="Resumo dos próximos dias">
              <div className="home-days-editorial__title">
                <span className="eyebrow">Próximos dias</span>
                <strong>Uma visão curta da semana</strong>
              </div>
              <div className="home-days-editorial__list">
                {daily.map((day, index) => (
                  <article className={index === 0 ? "is-today" : undefined} key={`${day.weekday}-${day.date}`}>
                    <div>
                      <strong>{day.weekday}</strong>
                      <span>{day.date}</span>
                    </div>
                    <WeatherIcon name={day.icon} title={`Previsão para ${day.weekday}`} />
                    <span>{day.rainChance}% chuva</span>
                    <b>{day.max}° <small>{day.min}°</small></b>
                  </article>
                ))}
              </div>
            </div>

            <div className="home-editorial-actions">
              <Link href="/tempo-hoje-pelotas">Ver previsão de hoje <span aria-hidden="true">→</span></Link>
              <Link href="/previsao-7-dias-pelotas">Abrir os 7 dias</Link>
            </div>
          </div>

          <aside className="home-editorial-map" aria-label="Mapa meteorológico da Zona Sul">
            <WeatherMap regionalWeather={weather.regional} />
            <p>
              Use o mapa para observar a região. Para decisões locais, priorize os dados e a previsão de Pelotas.
            </p>
          </aside>
        </div>
      </section>

      <section className="home-observation-editorial" id="observacao-embrapa" aria-labelledby="home-observation-title">
        <div className="home-observation-editorial__intro">
          <span className="eyebrow">Medição local · Embrapa</span>
          <h2 id="home-observation-title">O que foi realmente observado</h2>
          <p>
            A previsão aponta o que pode acontecer. A estação mostra o que foi medido em um ponto de Pelotas.
          </p>
          <Link href="/estacao-embrapa-pelotas">Abrir estação completa <span aria-hidden="true">→</span></Link>
        </div>

        {observationAvailable ? (
          <div className="home-observation-editorial__data">
            <div className="home-observation-primary">
              <small>{observation.status === "live" ? "Medição disponível" : "Dados parciais"}</small>
              <strong>{formatNumber(observation.current.temperature)}°</strong>
              <span>Sensação de {formatNumber(observation.current.feelsLike)} °C</span>
            </div>
            <dl>
              <div>
                <dt>Umidade</dt>
                <dd>{formatNumber(observation.current.humidity, 0)}%</dd>
              </div>
              <div>
                <dt>Vento</dt>
                <dd>{formatNumber(observation.current.windSpeed)} km/h</dd>
              </div>
              <div>
                <dt>Chuva hoje</dt>
                <dd>{formatNumber(observation.accumulated.rainDaily)} mm</dd>
              </div>
              <div>
                <dt>Pressão</dt>
                <dd>{formatNumber(observation.current.pressure)} hPa</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="home-observation-editorial__unavailable">
            <strong>Medição temporariamente indisponível</strong>
            <span>{observation.error}</span>
          </div>
        )}
      </section>

      <section className="home-editorial-section home-water-editorial" id="situacao-das-aguas" aria-labelledby="home-water-title">
        <header className="home-editorial-heading">
          <div>
            <span className="eyebrow">Situação das águas</span>
            <h2 id="home-water-title">Comece pelo Laranjal</h2>
          </div>
          <p>
            A medição local é a referência principal. Os demais pontos ajudam a compreender o comportamento da Lagoa dos Patos.
          </p>
        </header>

        <div className="home-water-editorial__layout">
          <article className={`home-water-local is-${laranjal.status}`}>
            <div className="home-water-local__topline">
              <div>
                <span>Praia do Laranjal</span>
                <small>{laranjal.source.station}</small>
              </div>
              <b>{laranjal.status === "live" ? "Atualizado" : laranjal.status === "stale" ? "Leitura atrasada" : "Indisponível"}</b>
            </div>

            <div className="home-water-local__reading">
              <strong>{formatNumber(laranjal.currentLevel, 2)}</strong>
              <span>m</span>
            </div>
            <p className={`home-water-trend is-${laranjalTrend.direction}`}>
              <b aria-hidden="true">{laranjalTrend.symbol}</b>
              {laranjalTrend.label}
            </p>
            <dl>
              <div><dt>Variação 6h</dt><dd>{formatNumber(laranjal.change6hCm)} cm</dd></div>
              <div><dt>Variação 24h</dt><dd>{formatNumber(laranjal.change24hCm)} cm</dd></div>
              <div><dt>Atualização</dt><dd>{formatUpdatedAt(laranjal.updatedAt)}</dd></div>
            </dl>
            <Link href="/nivel-da-lagoa-dos-patos-laranjal">Ver histórico do Laranjal <span aria-hidden="true">→</span></Link>
          </article>

          <div className="home-water-network">
            <div className="home-water-network__heading">
              <div>
                <span className="eyebrow">FURG & Portos RS</span>
                <strong>Lagoa dos Patos, de norte a sul</strong>
              </div>
              <small>{lagoon.available}/{lagoon.total} estações com leitura</small>
            </div>

            <div className="home-water-network__list">
              {lagoon.observations.map((station) => {
                const trend = trendLabel(station.trendCmPerHour);

                return (
                  <article key={station.station.id} className={`risk-${station.risk} is-${station.status}`}>
                    <div>
                      <strong>{station.station.city}</strong>
                      <span>{station.station.name}</span>
                    </div>
                    <p>
                      <b>{formatNumber(station.currentLevelCm)} cm</b>
                      <span className={`is-${trend.direction}`}>{trend.symbol} {trend.label}</span>
                    </p>
                    <small>{stationState(station)}</small>
                  </article>
                );
              })}
            </div>

            <div className="home-water-guaiba">
              <div>
                <span>Contexto regional</span>
                <strong>Guaíba em Porto Alegre</strong>
              </div>
              <p>
                <b>{formatNumber(guaiba.currentLevel, 2)} m</b>
                <span className={`is-${guaibaTrend.direction}`}>{guaibaTrend.symbol} {guaibaTrend.label}</span>
              </p>
              <small>{formatUpdatedAt(guaiba.updatedAt)}</small>
            </div>
          </div>
        </div>

        <div className="home-water-editorial__footer">
          <p>Não compare diretamente as cotas entre estações: cada régua possui referência própria.</p>
          <Link href="/situacao-hidrologica-pelotas">Abrir monitoramento completo <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="home-explore-editorial" id="explorar-portal" aria-labelledby="home-explore-title">
        <header>
          <span className="eyebrow">Explore o portal</span>
          <h2 id="home-explore-title">Vá direto ao que procura</h2>
        </header>
        <div>
          {exploreLinks.map(([href, title, description], index) => (
            <Link href={href} key={href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{title}</strong><small>{description}</small></div>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
