import Link from "next/link";
import type { ReactNode } from "react";
import { WeatherIcon } from "@/components/weather-icon";
import type { WeatherData } from "@/lib/weather-data";
import {
  getWeatherAdvisory,
  type AdvisoryLevel,
  type WeatherAdvisory,
} from "@/lib/weather-insights";

type WeatherHeroProps = {
  weather: WeatherData;
  advisoryLevel?: AdvisoryLevel;
  officialAlertCount?: number;
};

type HeroMetricIconName = "humidity" | "wind" | "gust" | "visibility";

type HeroPresentation = {
  badge: string;
  kicker: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
  photoHref: string;
  photoCredit: string;
};

const heroPresentationByLevel = {
  normal: {
    badge: "Dados locais atualizados",
    kicker: "Tempo agora em Pelotas",
    title: "Veja o tempo agora.",
    highlightedTitle: "Planeje as próximas horas.",
    description:
      "Consulte a condição atual e os principais sinais de chuva, temperatura e vento para organizar o seu dia.",
    primaryAction: {
      href: "/tempo-hoje-pelotas",
      label: "Ver previsão de hoje",
    },
    secondaryAction: {
      href: "/previsao-7-dias-pelotas",
      label: "Ver próximos 7 dias",
    },
    photoHref:
      "https://commons.wikimedia.org/wiki/File:Amanhecer_na_Praia_do_Laranjal.jpg",
    photoCredit: "Foto: Sebastian2112 / CC BY-SA 4.0",
  },
  attention: {
    badge: "Atenção nas próximas horas",
    kicker: "Atenção em Pelotas",
    title: "Chuva e vento podem aumentar.",
    highlightedTitle: "Acompanhe as próximas horas.",
    description:
      "Veja os períodos mais sensíveis da previsão e confira os avisos oficiais antes de sair ou programar atividades externas.",
    primaryAction: {
      href: "/alertas",
      label: "Ver avisos oficiais",
    },
    secondaryAction: {
      href: "/tempo-hoje-pelotas",
      label: "Ver previsão hora a hora",
    },
    photoHref:
      "https://commons.wikimedia.org/wiki/File:Sunset_over_Calm_Lake.jpg",
    photoCredit: "Foto: Kane Morley / CC BY-SA 4.0",
  },
  warning: {
    badge: "Atenção redobrada",
    kicker: "Atenção em Pelotas",
    title: "Há risco de tempo forte.",
    highlightedTitle: "Veja quando a atenção aumenta.",
    description:
      "Consulte os avisos oficiais e os horários com maior possibilidade de chuva intensa, temporal ou rajadas fortes.",
    primaryAction: {
      href: "/alertas",
      label: "Ver avisos oficiais",
    },
    secondaryAction: {
      href: "/tempo-hoje-pelotas",
      label: "Ver previsão hora a hora",
    },
    photoHref: "https://commons.wikimedia.org/wiki/File:Heavy_Rain.jpg",
    photoCredit: "Foto: Pridatko Oleksandr / domínio público",
  },
} satisfies Record<AdvisoryLevel, HeroPresentation>;

function getHeroPresentation(
  advisory: WeatherAdvisory,
  level: AdvisoryLevel,
): HeroPresentation {
  const presentation = heroPresentationByLevel[level];

  if (level === "normal" || level !== advisory.level) return presentation;

  return {
    ...presentation,
    badge: advisory.eyebrow,
  };
}

function capitalizeSentence(value: string) {
  return value.replace(/^./, (character) => character.toUpperCase());
}

function getCurrentSourceMeta(current: WeatherData["current"]) {
  if (current.source.kind === "observation") {
    const updateTime = current.source.observedAt
      ? `Atualizado às ${current.source.observedAt}`
      : "Dados atualizados";

    return `${updateTime} · ${current.source.name}`;
  }

  return `${current.updatedAt} · ${current.source.name}`;
}

function getOfficialAlertLabel(count: number) {
  return count === 1 ? "1 aviso oficial ativo" : `${count} avisos oficiais ativos`;
}

function getOfficialAlertReason(count: number) {
  return count === 1
    ? "Pelotas está incluída em um aviso oficial do INMET"
    : `Pelotas está incluída em ${count} avisos oficiais do INMET`;
}

function HeroMetricIcon({ name }: { name: HeroMetricIconName }) {
  const paths = {
    humidity: <path d="M12 3.2S6.8 9.3 6.8 13.7a5.2 5.2 0 0 0 10.4 0C17.2 9.3 12 3.2 12 3.2Z" />,
    wind: <path d="M3 8h10.5c3.8 0 3.8-5.5.2-5.5-1.9 0-2.9 1-2.9 2.8M3 13h15.5c3.8 0 3.8 6.5.2 6.5-1.9 0-2.9-1-2.9-2.8M3 18h7.5" />,
    gust: <path d="M4 7.5h10.8M4 12h16M4 16.5h12.5M17.5 5.2l2.5 2.3-2.5 2.3" />,
    visibility: <path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Zm9.5-2.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />,
  } satisfies Record<HeroMetricIconName, ReactNode>;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: HeroMetricIconName;
  label: string;
  value: string;
}) {
  return (
    <div className="weather-hero-metric">
      <HeroMetricIcon name={icon} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export function WeatherHero({
  weather,
  advisoryLevel,
  officialAlertCount = 0,
}: WeatherHeroProps) {
  const { current } = weather;
  const advisory = getWeatherAdvisory(weather);
  const resolvedLevel = advisoryLevel ?? advisory.level;
  const presentation = getHeroPresentation(advisory, resolvedLevel);
  const today = weather.daily[0];
  const officialAlertReason = officialAlertCount > 0
    ? getOfficialAlertReason(officialAlertCount)
    : null;
  const weatherReasons = advisory.level === "normal"
    ? []
    : advisory.reasons.map(capitalizeSentence);
  const reasons = [officialAlertReason, ...weatherReasons]
    .filter((reason): reason is string => Boolean(reason))
    .slice(0, 2);
  const statusLabel = officialAlertCount > 0
    ? getOfficialAlertLabel(officialAlertCount)
    : presentation.badge;
  const currentSourceMeta = getCurrentSourceMeta(current);

  return (
    <section
      className={`weather-hero weather-hero--${resolvedLevel}`}
      data-official-alerts={officialAlertCount > 0 ? "true" : "false"}
      aria-labelledby="weather-hero-title"
    >
      <div className="weather-hero-photo" aria-hidden="true" />
      <div className="weather-hero-overlay" aria-hidden="true" />
      <div className="weather-hero-orbit weather-hero-orbit--one" aria-hidden="true" />
      <div className="weather-hero-orbit weather-hero-orbit--two" aria-hidden="true" />

      <div className="weather-hero-content">
        <div className="weather-hero-copy">
          <span
            className={`weather-hero-status weather-hero-status--${resolvedLevel}${officialAlertCount > 0 ? " weather-hero-status--official" : ""}`}
          >
            <i aria-hidden="true" />
            {statusLabel}
          </span>

          <p className="weather-hero-kicker">{presentation.kicker}</p>
          <h1 id="weather-hero-title">
            {presentation.title} <span>{presentation.highlightedTitle}</span>
          </h1>
          <p className="weather-hero-description">{presentation.description}</p>

          {today ? (
            <dl className="weather-hero-daily-facts" aria-label="Resumo da previsão de hoje">
              <div>
                <dt>Máxima e mínima</dt>
                <dd>{today.max}° <small>/ {today.min}°</small></dd>
              </div>
              <div>
                <dt>Chance de chuva</dt>
                <dd>{today.precipitation}%</dd>
              </div>
              <div>
                <dt>Rajada mais forte</dt>
                <dd>{today.windGust} <small>km/h</small></dd>
              </div>
            </dl>
          ) : null}

          {reasons.length > 0 ? (
            <div className="weather-hero-reasons" aria-label="Por que é preciso atenção">
              {reasons.map((reason) => (
                <span key={reason}>{reason}</span>
              ))}
            </div>
          ) : null}

          <div className="weather-hero-actions">
            <Link className="weather-hero-primary" href={presentation.primaryAction.href}>
              {presentation.primaryAction.label}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="weather-hero-secondary" href={presentation.secondaryAction.href}>
              {presentation.secondaryAction.label}
            </Link>
          </div>
        </div>

        <div className="weather-hero-now" aria-label="Tempo agora em Pelotas">
          <div className="weather-hero-now-heading">
            <div>
              <span>Pelotas, RS</span>
              <small>{currentSourceMeta}</small>
            </div>
            <span className="weather-hero-live"><i aria-hidden="true" /> Agora</span>
          </div>

          <div className="weather-hero-visual">
            <div className="weather-hero-icon">
              <WeatherIcon name={current.icon} title={current.condition} />
            </div>

            <div className="weather-hero-temperature">
              <strong>{current.temperature}°</strong>
              <div>
                <span>{current.condition}</span>
                <small>Sensação de {current.feelsLike}°</small>
              </div>
            </div>
          </div>

          <div className="weather-hero-metrics">
            <HeroMetric icon="humidity" label="Umidade" value={`${current.humidity}%`} />
            <HeroMetric icon="wind" label="Vento" value={`${current.windSpeed} km/h`} />
            <HeroMetric icon="gust" label="Rajada" value={`${current.windGust} km/h`} />
            <HeroMetric icon="visibility" label="Visibilidade" value={`${current.visibility} km`} />
          </div>
        </div>
      </div>

      <div className="weather-hero-scroll">
        <span>Veja a previsão abaixo</span>
        <i aria-hidden="true">↓</i>
      </div>

      <a
        className="weather-hero-credit"
        href={presentation.photoHref}
        target="_blank"
        rel="noreferrer"
      >
        {presentation.photoCredit}
      </a>
    </section>
  );
}
