import { getPelotasWeather } from "@/lib/weather-service";

export const revalidate = 600;

export async function GET() {
  const weather = await getPelotasWeather();

  return Response.json(weather, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
    },
  });
}
