import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { HomeEditorialDashboard as HomeEditorialDashboardBase } from "@/components/home-editorial-dashboard";
import { HomeWeatherAiSummaries } from "@/components/weather-ai-summary";
import { WeatherIcon } from "@/components/weather-icon";
import type { EmbrapaObservationData } from "@/lib/embrapa-observation";
import type { GuaibaObservationData } from "@/lib/guaiba-monitor";
import type { LagoonMonitoringNetworkData } from "@/lib/lagoon-monitoring-network";
import type { LaranjalLevelData } from "@/lib/laranjal-level";
import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";
import type { WeatherAiSummaries } from "@/lib/weather-ai-summary";
import type { WeatherData } from "@/lib/weather-data";
import type { AdvisoryLevel } from "@/lib/weather-insights";

type HomeEditorialDashboardProps = {
  weather: WeatherData;
  summaries: WeatherAiSummaries;
  advisoryLevel?: AdvisoryLevel;
  observation: EmbrapaObservationData;
  laranjal: LaranjalLevelData;
  guaiba: GuaibaObservationData;
  lagoon: LagoonMonitoringNetworkData;
};

type SemanticContext = {
  currentHour: boolean;
  stationUnavailable: boolean;
  guaibaContext: boolean;
};

type ElementProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  title?: string;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (isValidElement<ElementProps>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function hasClass(className: string, token: string) {
  return className.split(/\s+/).includes(token);
}

function normalizeTextNode(node: ReactNode): ReactNode {
  if (typeof node !== "string") return node;
  if (node.trim() === "por volta de Agora") return "neste momento";
  return node;
}

function UfpelHomePanel() {
  return (
    <article className="home-water-focus home-water-focus--ufpel">
      <div className="home-water-focus__topline">
        <div>
          <span>Praia do Laranjal</span>
          <small>Painel público do LabHidroSens/UFPel</small>
        </div>
        <b>Fonte local</b>
      </div>
      <div className="home-water-focus__source-copy">
        <strong>Monitoramento da Lagoa dos Patos</strong>
        <p>
          O painel é exibido diretamente pela UFPel. O TEMPO Pelotas não define
          cota, estado de risco ou tendência própria para o Laranjal.
        </p>
      </div>
      <div className="home-water-focus__ufpel-frame">
        <iframe
          src={LAGOON_LEVEL_SOURCE.dashboardUrl}
          title="Painel público da Estação Laranjal do LabHidroSens e UFPel"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <a
        className="home-water-focus__source-link"
        href={LAGOON_LEVEL_SOURCE.dashboardUrl}
        target="_blank"
        rel="noreferrer"
      >
        Abrir painel original <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

function transformDashboardNode(
  node: ReactNode,
  context: SemanticContext,
): ReactNode {
  if (typeof node === "string") return normalizeTextNode(node);

  if (!isValidElement<ElementProps>(node)) {
    return node;
  }

  const props = node.props;
  const className = typeof props.className === "string" ? props.className : "";
  const isDomElement = typeof node.type === "string";

  if (
    isDomElement &&
    node.type === "article" &&
    hasClass(className, "home-water-focus")
  ) {
    return <UfpelHomePanel />;
  }

  const nextContext: SemanticContext = {
    currentHour:
      context.currentHour ||
      (node.type === "article" && hasClass(className, "is-current")),
    stationUnavailable:
      context.stationUnavailable ||
      (node.type === "article" && hasClass(className, "is-unavailable")),
    guaibaContext:
      context.guaibaContext || hasClass(className, "home-water-context"),
  };

  if (node.type === WeatherIcon && nextContext.currentHour) {
    return cloneElement(node as ReactElement<ElementProps>, {
      title: "Tempo agora",
    });
  }

  if (
    isDomElement &&
    node.type === "div" &&
    hasClass(className, "home-hourly-story__topline") &&
    nextContext.currentHour
  ) {
    const [timeLabel] = Children.toArray(props.children);
    return cloneElement(
      node as ReactElement<ElementProps>,
      undefined,
      transformDashboardNode(timeLabel, nextContext),
    );
  }

  const textContent = getTextContent(props.children);

  if (
    isDomElement &&
    node.type === "span" &&
    !nextContext.guaibaContext &&
    (hasClass(className, "is-rising") ||
      hasClass(className, "is-falling") ||
      hasClass(className, "is-stable"))
  ) {
    return cloneElement(
      node as ReactElement<ElementProps>,
      { className: "is-source-neutral" },
      "Variação disponível na fonte",
    );
  }

  if (
    isDomElement &&
    node.type === "small" &&
    !nextContext.guaibaContext &&
    [
      "Acima do nível de atenção",
      "Perto do nível de atenção",
      "Sem sinal de atenção",
    ].includes(textContent.trim())
  ) {
    return cloneElement(
      node as ReactElement<ElementProps>,
      undefined,
      "Sem classificação própria",
    );
  }

  const hasMissingValue = textContent.includes("—");

  if (isDomElement && hasMissingValue) {
    if (node.type === "dd") {
      return cloneElement(
        node as ReactElement<ElementProps>,
        undefined,
        "Indisponível",
      );
    }

    if (node.type === "strong" || node.type === "b") {
      return cloneElement(
        node as ReactElement<ElementProps>,
        undefined,
        "Sem leitura",
      );
    }

    if (node.type === "span") {
      const label = textContent.includes("Sensação")
        ? "Sensação indisponível"
        : "Indisponível";
      return cloneElement(node as ReactElement<ElementProps>, undefined, label);
    }
  }

  const transformedChildren = Children.map(props.children, (child) =>
    transformDashboardNode(child, nextContext),
  );

  const normalizedClassName = nextContext.guaibaContext
    ? className
    : className
        .split(/\s+/)
        .filter((token) => !token.startsWith("risk-"))
        .join(" ");

  return cloneElement(
    node as ReactElement<ElementProps>,
    normalizedClassName !== className
      ? { className: normalizedClassName || undefined }
      : undefined,
    transformedChildren,
  );
}

export function HomeEditorialDashboard({
  summaries,
  ...dashboardProps
}: HomeEditorialDashboardProps) {
  const dashboard = HomeEditorialDashboardBase(dashboardProps);
  const transformedDashboard = transformDashboardNode(dashboard, {
    currentHour: false,
    stationUnavailable: false,
    guaibaContext: false,
  });

  return (
    <>
      <HomeWeatherAiSummaries
        weather={dashboardProps.weather}
        summaries={summaries}
      />
      {transformedDashboard}
    </>
  );
}
