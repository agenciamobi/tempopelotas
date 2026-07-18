"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
} from "maplibre-gl";
import type {
  RegionalWeather,
  WeatherIconName,
} from "@/lib/weather-data";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const PELOTAS_CENTER: [number, number] = [-52.3376, -31.7654];

const conditionLabels: Record<WeatherIconName, string> = {
  sun: "Céu limpo",
  moon: "Noite de céu limpo",
  "partly-cloudy": "Sol entre nuvens",
  "partly-cloudy-night": "Noite parcialmente nublada",
  cloud: "Céu nublado",
  rain: "Chuva",
  storm: "Temporal",
  wind: "Vento",
};

type WeatherMapProps = {
  regionalWeather: RegionalWeather[];
};

function createMarkerElement(item: RegionalWeather) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "regional-map-marker";
  element.dataset.condition = item.condition;
  element.setAttribute(
    "aria-label",
    `${item.city}: ${item.temperature} graus, ${conditionLabels[item.condition]}`,
  );

  if (item.city === "Pelotas") {
    element.classList.add("is-active");
  }

  const temperature = document.createElement("strong");
  temperature.textContent = `${item.temperature}°`;

  const city = document.createElement("span");
  city.textContent = item.city;

  element.append(temperature, city);
  return element;
}

function createPopupContent(item: RegionalWeather) {
  const content = document.createElement("div");
  content.className = "regional-map-popup";

  const city = document.createElement("strong");
  city.textContent = item.city;

  const condition = document.createElement("span");
  condition.textContent = `${item.temperature}° · ${conditionLabels[item.condition]}`;

  content.append(city, condition);
  return content;
}

export function WeatherMap({ regionalWeather }: WeatherMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const initializingRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const temperatureRange = useMemo(() => {
    const temperatures = regionalWeather.map((item) => item.temperature);

    return {
      min: temperatures.length ? Math.min(...temperatures) : 0,
      max: temperatures.length ? Math.max(...temperatures) : 0,
    };
  }, [regionalWeather]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const initializeMap = async () => {
      if (mapRef.current || initializingRef.current || cancelled) return;
      initializingRef.current = true;

      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: MAP_STYLE,
          center: PELOTAS_CENTER,
          zoom: 7.4,
          minZoom: 6,
          maxZoom: 13,
          cooperativeGestures: true,
        });

        mapRef.current = map;
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.addControl(
          new maplibregl.NavigationControl({
            showCompass: false,
            visualizePitch: false,
          }),
          "bottom-right",
        );

        const bounds = new maplibregl.LngLatBounds();

        markersRef.current = regionalWeather.map((item) => {
          bounds.extend([item.longitude, item.latitude]);

          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: true,
            offset: 18,
          }).setDOMContent(createPopupContent(item));

          return new maplibregl.Marker({
            element: createMarkerElement(item),
            anchor: "bottom",
          })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(popup)
            .addTo(map);
        });

        map.once("load", () => {
          if (cancelled) return;

          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
              padding: { top: 125, right: 70, bottom: 100, left: 70 },
              maxZoom: 8.8,
              duration: 0,
            });
          }

          setIsLoaded(true);
        });
      } catch (error) {
        console.error("Falha ao inicializar o mapa regional:", error);
        if (!cancelled) setHasError(true);
      } finally {
        initializingRef.current = false;
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            void initializeMap();
            observer?.disconnect();
          }
        },
        { rootMargin: "280px" },
      );
      observer.observe(container);
    } else {
      void initializeMap();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [regionalWeather]);

  const centerOnPelotas = () => {
    mapRef.current?.easeTo({
      center: PELOTAS_CENTER,
      zoom: 9.3,
      duration: 700,
    });
  };

  return (
    <section className="map-panel" id="regiao" aria-labelledby="map-title">
      <div className="map-panel-heading">
        <div>
          <span className="eyebrow">Zona Sul do RS</span>
          <h2 id="map-title">Tempo na região</h2>
        </div>
        <button
          className="map-control"
          type="button"
          aria-label="Centralizar mapa em Pelotas"
          onClick={centerOnPelotas}
          disabled={!isLoaded}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 3h-2.07A7 7 0 0 0 13 5.07V3h-2v2.07A7 7 0 0 0 5.07 11H3v2h2.07A7 7 0 0 0 11 18.93V21h2v-2.07A7 7 0 0 0 18.93 13H21v-2Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div
        className="map-canvas map-canvas--interactive"
        aria-label="Mapa interativo com condições meteorológicas de Pelotas e cidades da Zona Sul"
      >
        <div ref={mapContainerRef} className="regional-map-engine" />

        <div
          className={`map-loading ${isLoaded ? "is-hidden" : ""} ${hasError ? "has-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true" />
          <strong>{hasError ? "Mapa temporariamente indisponível" : "Carregando mapa regional"}</strong>
          <small>
            {hasError
              ? "As temperaturas continuam disponíveis abaixo."
              : "A camada geográfica é carregada somente quando necessária."}
          </small>
        </div>

        <div className="map-legend" aria-label="Intervalo de temperatura regional">
          <span>{temperatureRange.min}°</span>
          <i aria-hidden="true" />
          <span>{temperatureRange.max}°</span>
        </div>
      </div>

      <ul className="regional-weather-accessible">
        {regionalWeather.map((item) => (
          <li key={item.city}>
            {item.city}: {item.temperature} graus, {conditionLabels[item.condition]}.
          </li>
        ))}
      </ul>
    </section>
  );
}
