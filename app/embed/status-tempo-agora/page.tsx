import type { Metadata } from "next";

import { getObsWeatherStatus } from "@/lib/obs-weather-status";

import { ObsWeatherStatusClient } from "./obs-weather-status-client";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Status do tempo agora em Pelotas — OBS",
  description: "Widget técnico de condição e temperatura atual para uso no OBS Studio.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      "max-image-preview": "none",
    },
  },
};

export default async function ObsWeatherStatusPage() {
  const initialData = await getObsWeatherStatus();

  return <ObsWeatherStatusClient initialData={initialData} />;
}
