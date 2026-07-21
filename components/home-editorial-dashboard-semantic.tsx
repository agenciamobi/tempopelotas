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
import type { WeatherAiSummaries } from "@/lib/weather-ai-summary";
import type { WeatherData } from "@/lib/weather-data";
import type { AdvisoryLevel } from "@/lib/weather-insights";
import {
  getWaterLevelVisualState,
  type WaterLevelVisualState,
  waterLevelStateClass,
} from "@/lib/water-level-state";

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
  laranjalUnavailable: boolean;
  stationUnavailable: boolean;
  guaibaContext: boolean;
};

type WaterVisualStates = {
  laranjal: WaterLevelVisualState;
  guaiba: WaterLevelVisualState;
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

function appendClass(className: string, token: string) {
  return className ? `${className} ${token}` : token;
}

function normalizeTextNode(node: ReactNode): ReactNode {
  if (typeof node !== "string") return node;
  if (node.trim() === "por volta de Agora") return "neste momento";
  return node;
}

function transformDashboardNode(
  node: ReactNode,
  context: SemanticContext,
  waterStates: WaterVisualStates,
): ReactNode {
  if (typeof node === "string") return normalizeTextNode(node);

  if (!isValidElement<ElementProps>(node)) {
    return node;
  }

  const props = node.props;
  const className = typeof props.className === "string" ? props.className : "";
  const isDomElement = typeof node.type === "string";
  const nextContext: SemanticContext = {
    currentHour:
      context.currentHour ||
      (node.type === "article" && hasClass(className, "is-current")),
    laranjalUnavailable:
      context.laranjalUnavailable ||
      (node.type === "article" &&
        hasClass(className, "home-water-focus") &&
        hasClass(className, "is-unavailable")),
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
      transformDashboardNode(timeLabel, nextContext, waterStates),
    );
  }

  if (
    isDomElement &&
    node.type === "div" &&
    hasClass(className, "home-water-focus__reading") &&
    nextContext.laranjalUnavailable
  ) {
    return cloneElement(
      node as ReactElement<ElementProps>,
      undefined,
      <strong>Sem leitura</strong>,
    );
  }

  if (
    isDomElement &&
    node.type === "p" &&
    hasClass(className, "home-water-trend") &&
    hasClass(className, "is-unknown")
  ) {
    return cloneElement(
      node as ReactElement<ElementProps>,
      undefined,
      "Tendência indisponível",
    );
  }

  if (
    isDomElement &&
    node.type === "span" &&
    hasClass(className, "is-unknown")
  ) {
    return cloneElement(
      node as ReactElement<ElementProps>,
      undefined,
      "Tendência indisponível",
    );
  }

  const textContent = getTextContent(props.children);
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
    transformDashboardNode(child, nextContext, waterStates),
  );

  let normalizedClassName = className;

  if (hasClass(className, "home-water-focus")) {
    normalizedClassName = appendClass(
      normalizedClassName,
      waterLevelStateClass(waterStates.laranjal),
    );
  }

  if (hasClass(className, "home-water-context")) {
    normalizedClassName = appendClass(
      normalizedClassName,
      waterLevelStateClass(waterStates.guaiba),
    );
  }

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
  const waterStates: WaterVisualStates = {
    laranjal: getWaterLevelVisualState({
      rate: dashboardProps.laranjal.trendCmPerHour,
      available:
        dashboardProps.laranjal.status !== "unavailable" &&
        dashboardProps.laranjal.currentLevel !== null,
    }),
    guaiba: getWaterLevelVisualState({
      rate: dashboardProps.guaiba.trendCmPerHour,
      available:
        dashboardProps.guaiba.status !== "unavailable" &&
        dashboardProps.guaiba.currentLevel !== null,
      currentLevel: dashboardProps.guaiba.currentLevel,
      threshold: dashboardProps.guaiba.floodReference,
    }),
  };
  const transformedDashboard = transformDashboardNode(
    dashboard,
    {
      currentHour: false,
      laranjalUnavailable: false,
      stationUnavailable: false,
      guaibaContext: false,
    },
    waterStates,
  );

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
