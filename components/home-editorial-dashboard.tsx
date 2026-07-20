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

const exploreGroups = [
  {
    title: "Previsão",
    links: [
      ["/tempo-hoje-pelotas", "Tempo hoje"],
      ["/previsao-7-dias-pelotas", "Próximos 7 dias"],
    ],
  },
  {
    title: "Condições",
    links: [
      ["/chuva-em-pelotas", "Chuva"],
      ["/vento-em-pelotas", "Vento"],
      ["/alertas", "Atenção meteorológica"],
    ],
  },
  {
    title: "Águas",
    links: [
      ["/situacao-hidrologica-pelotas", "Situação hidrológica"],
      ["/nivel-da-lagoa-dos-patos-laranjal", "Nível no Laranjal"],
    ],
  },
  {
    title: "Portal",
    links: [
      ["/cameras-ao-vivo-pelotas", "Câmeras"],
      ["/metodologia", "Fontes e metodologia"],
    ],
  },
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
  const today = weather.daily[0];
  const hourly = weather.hourly.slice(0, 7);
  const nextDays = weather.daily.slice(1, 5);
  const laranjalTrend = trendLabel(laranjal.trendCmPerHour);
  const guaibaTrend = trendLabel(guaiba.trendCmPerHour);
  const observationAvailable = observation.status !== "unavailable";

  return (
    <>
      <section className="home-story home-story--forecast" id="previsao-hoje" aria-labelledby="home-story-forecast-title">
        <header className="home-story-heading">
          <div>
            <span className="eyebrow">Hoje em Pelotas</span>
            <h2 id="home-story-forecast-title">O essencial para as próximas horas</h2>
          </div>
          <dl className="home-today-facts" aria-label="Resumo da previsão de hoje">
            <div><dt>Máxima</dt><dd>{today?.max ?? weather.current.temperature}°</dd></div>
            <div><dt>Mínima</dt><dd>{today?.min ?? weather.current.temperature}°</dd></div>
            <div><dt>Chuva</dt><dd>{today?.rainChance ?? 0}%</dd></div>
            <div><dt>Rajadas</dt><dd>{today?.windGust ?? weather.current.windGust} km/h</dd></div>
          </dl>
        </header>

        <div className={`home-advisory-strip is-${advisory.level}`}>
          <span aria-hidden="true" />
          <div>
            <small>{advisory.eyebrow}</small>
            <strong>{advisory.title}</strong>
          </div>
          <p>{advisory.reasons[0] ?? advisory.description}</p>
          <Link href="/alertas">Ver orientação</Link>
        </div>

        <div className="home-hourly-story" aria-label="Previsão para as próximas horas">
          {hourly.map((hour, index) => (
            <article className={index === 0 ? "is-current" : undefined} key={`${hour.time}-${index}`}>
              <span>{hour.time}</span>
              <WeatherIcon name={hour.icon} title={`Condição às ${hour.time}`} />
              <strong>{hour.temperature}°</strong>
              <small>{hour.precipitation}% chuva</small>
            </article>
          ))}
        </div>

        <div className="home-next-days">
          <div className="home-next-days__heading">
            <span className="eyebrow">Depois de hoje</span>
            <strong>Quatro dias em uma linha</strong>
          </div>
          <div className="home-next-days__list">
            {nextDays.map((day) => (
              <article key={`${day.weekday}-${day.date}`}>
                <div><strong>{day.weekday}</strong><span>{day.date}</span></div>
                <WeatherIcon name={day.icon} title={`Previsão para ${day.weekday}`} />
                <span>{day.rainChance}% chuva</span>
                <b>{day.max}° <small>{day.min}°</small></b>
              </article>
            ))}
          </div>
          <div className="home-inline-links">
            <Link href="/tempo-hoje-pelotas">Previsão detalhada de hoje <span aria-hidden="true">→</span></Link>
            <Link href="/previsao-7-dias-pelotas">Ver os 7 dias</Link>
          </div>
        </div>
      </section>

      <section className="home-map-story" aria-labelledby="home-map-story-title">
        <div className="home-map-story__copy">
          <span className="eyebrow">Contexto regional</span>
          <h2 id="home-map-story-title">Veja o tempo se aproximando</h2>
          <p>O mapa ajuda a enxergar a Zona Sul. Para decisões locais, priorize a previsão e as medições de Pelotas.</p>
        </div>
        <div className="home-map-story__frame">
          <WeatherMap regionalWeather={weather.regional} />
        </div>
      </section>

      <section className="home-observation-story" id="observacao-embrapa" aria-labelledby="home-observation-story-title">
        <div className="home-observation-story__intro">
          <span className="eyebrow">Medição local · Embrapa</span>
          <h2 id="home-observation-story-title">O que foi realmente observado</h2>
          <p>A previsão aponta possibilidades. A estação mostra o que foi medido em um ponto de Pelotas.</p>
          <Link href="/estacao-embrapa-pelotas">Abrir estação completa <span aria-hidden="true">→</span></Link>
        </div>

        {observationAvailable ? (
          <div className="home-observation-story__reading">
            <div className="home-observation-temperature">
              <small>{observation.status === "live" ? "Medição disponível" : "Dados parciais"}</small>
              <strong>{formatNumber(observation.current.temperature)}°</strong>
              <span>Sensação de {formatNumber(observation.current.feelsLike)} °C</span>
            </div>
            <dl>
              <div><dt>Umidade</dt><dd>{formatNumber(observation.current.humidity, 0)}%</dd></div>
              <div><dt>Vento</dt><dd>{formatNumber(observation.current.windSpeed)} km/h</dd></div>
              <div><dt>Chuva hoje</dt><dd>{formatNumber(observation.accumulated.rainDaily)} mm</dd></div>
              <div><dt>Pressão</dt><dd>{formatNumber(observation.current.pressure)} hPa</dd></div>
            </dl>
          </div>
        ) : (
          <div className="home-observation-story__unavailable">
            <strong>Medição temporariamente indisponível</strong>
            <span>{observation.error}</span>
          </div>
        )}
      </section>

      <section className="home-story home-story--water" id="situacao-das-aguas" aria-labelledby="home-water-story-title">
        <header className="home-story-heading">
          <div>
            <span className="eyebrow">Situação das águas</span>
            <h2 id="home-water-story-title">Comece pelo Laranjal</h2>
          </div>
          <p>A medição local é a referência principal. Os outros pontos ajudam a entender o comportamento da Lagoa dos Patos.</p>
        </header>

        <div className="home-water-story__layout">
          <article className={`home-water-focus is-${laranjal.status}`}>
            <div className="home-water-focus__topline">
              <div><span>Praia do Laranjal</span><small>{laranjal.source.station}</small></div>
              <b>{laranjal.status === "live" ? "Atualizado" : laranjal.status === "stale" ? "Leitura atrasada" : "Indisponível"}</b>
            </div>
            <div className="home-water-focus__reading"><strong>{formatNumber(laranjal.currentLevel, 2)}</strong><span>m</span></div>
            <p className={`home-water-trend is-${laranjalTrend.direction}`}><b aria-hidden="true">{laranjalTrend.symbol}</b>{laranjalTrend.label}</p>
            <dl>
              <div><dt>Variação 6h</dt><dd>{formatNumber(laranjal.change6hCm)} cm</dd></div>
              <div><dt>Variação 24h</dt><dd>{formatNumber(laranjal.change24hCm)} cm</dd></div>
              <div><dt>Atualização</dt><dd>{formatUpdatedAt(laranjal.updatedAt)}</dd></div>
            </dl>
            <Link href="/nivel-da-lagoa-dos-patos-laranjal">Ver histórico do Laranjal <span aria-hidden="true">→</span></Link>
          </article>

          <div className="home-water-table">
            <div className="home-water-table__heading">
              <div><span className="eyebrow">FURG & Portos RS</span><strong>Lagoa dos Patos, de norte a sul</strong></div>
              <small>{lagoon.available}/{lagoon.total} estações com leitura</small>
            </div>

            <div className="home-water-table__rows">
              {lagoon.observations.map((station) => {
                const trend = trendLabel(station.trendCmPerHour);
                return (
                  <article key={station.station.id} className={`risk-${station.risk} is-${station.status}`}>
                    <div><strong>{station.station.city}</strong><span>{station.station.name}</span></div>
                    <b>{formatNumber(station.currentLevelCm)} cm</b>
                    <span className={`is-${trend.direction}`}>{trend.symbol} {trend.label}</span>
                    <small>{stationState(station)}</small>
                  </article>
                );
              })}
            </div>

            <div className="home-water-context">
              <div><span>Contexto regional</span><strong>Guaíba em Porto Alegre</strong></div>
              <b>{formatNumber(guaiba.currentLevel, 2)} m</b>
              <span className={`is-${guaibaTrend.direction}`}>{guaibaTrend.symbol} {guaibaTrend.label}</span>
              <small>{formatUpdatedAt(guaiba.updatedAt)}</small>
            </div>
          </div>
        </div>

        <footer className="home-water-story__footer">
          <p>Cada régua possui referência própria. Não compare diretamente os valores absolutos entre estações.</p>
          <Link href="/situacao-hidrologica-pelotas">Abrir monitoramento completo <span aria-hidden="true">→</span></Link>
        </footer>
      </section>

      <section className="home-explore-story" id="explorar-portal" aria-labelledby="home-explore-story-title">
        <header>
          <span className="eyebrow">Explore o portal</span>
          <h2 id="home-explore-story-title">Vá direto ao assunto</h2>
        </header>
        <div className="home-explore-groups">
          {exploreGroups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <div>
                {group.links.map(([href, label]) => (
                  <Link href={href} key={href}>{label}<span aria-hidden="true">→</span></Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
