import { NextResponse } from "next/server";

import { getObsWeatherStatus } from "@/lib/obs-weather-status";

export const revalidate = 300;

export async function GET() {
  const data = await getObsWeatherStatus();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
      "Content-Language": "pt-BR",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
    },
  });
}
