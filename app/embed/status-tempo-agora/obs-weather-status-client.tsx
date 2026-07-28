"use client";

import { useEffect, useState } from "react";

import type { ObsWeatherStatusData } from "@/lib/obs-weather-status";
import type { WeatherIconName } from "@/lib/weather-data";

import styles from "./page.module.css";

const REFRESH_INTERVAL_MS = 5 * 60 * 1_000;

function WeatherStatusIcon({ name, label }: { name: WeatherIconName; label: string }) {
  const common = {
    viewBox: "0 0 96 96",
    role: "img" as const,
    "aria-label": label,
  };

  if (name === "sun") {
    return (
      <svg {...common}>
        <circle cx="48" cy="48" r="17" fill="currentColor" />
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <path d="M48 8v11M48 77v11M8 48h11M77 48h11M20 20l8 8M68 68l8 8M76 20l-8 8M28 68l-8 8" />
        </g>
      </svg>
    );
  }

  if (name === "moon") {
    return (
      <svg {...common}>
        <path d="M70 62c-22 5-40-12-36-34 2-8 6-14 12-19-20 1-36 18-36 39 0 22 18 40 40 40 18 0 33-12 38-28-5 1-11 2-18 2Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "wind") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 35h47c10 0 10-16 0-16-6 0-9 4-9 8M12 50h66c10 0 10 17 0 17-6 0-9-4-9-8M12 65h36" />
      </svg>
    );
  }

  const hasRain = name === "rain" || name === "storm";
  const hasSun = name === "partly-cloudy";
  const hasMoon = name === "partly-cloudy-night";

  return (
    <svg {...common} fill="none">
      {hasSun ? <circle cx="64" cy="29" r="15" fill="currentColor" opacity="0.85" /> : null}
      {hasMoon ? <path d="M76 43c-15 3-27-8-24-23 1-5 4-9 8-12-14 1-24 12-24 26 0 15 12 27 27 27 12 0 23-8 26-19-4 1-8 1-13 1Z" fill="currentColor" opacity="0.85" /> : null}
      <path d="M70 70H29c-11 0-19-7-19-17 0-9 7-16 16-17 3-12 13-20 26-20 15 0 27 11 28 26 8 2 13 7 13 14 0 8-7 14-16 14h-7Z" fill="currentColor" />
      {hasRain ? (
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8">
          <path d="m31 78-4 8M50 78l-4 8M69 78l-4 8" />
        </g>
      ) : null}
      {name === "storm" ? <path d="M52 68h13L54 83h9L42 94l7-16h-9l12-10Z" fill="currentColor" /> : null}
    </svg>
  );
}

export function ObsWeatherStatusClient({ initialData }: { initialData: ObsWeatherStatusData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const response = await fetch("/api/widgets/status-tempo-agora", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Widget respondeu com HTTP ${response.status}`);
        const nextData = (await response.json()) as ObsWeatherStatusData;
        if (active) setData(nextData);
      } catch {
        if (active) {
          setData((current) => ({
            ...current,
            status: "unavailable",
            temperature: null,
            condition: "Indisponível",
            icon: "cloud",
          }));
        }
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const live = data.status === "live";

  return (
    <main className={styles.viewport} aria-label="Status do tempo agora em Pelotas">
      <section
        className={`${styles.widget} ${live ? styles.live : styles.unavailable}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={styles.icon}>
          <WeatherStatusIcon name={data.icon} label={data.condition} />
        </div>
        <div className={styles.reading}>
          <span className={styles.condition}>{data.condition}</span>
          <strong className={styles.temperature}>
            {data.temperature === null ? "—" : data.temperature}
            <small>°C</small>
          </strong>
        </div>
      </section>
    </main>
  );
}
