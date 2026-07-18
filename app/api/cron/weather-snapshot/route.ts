import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPelotasHistoricalDay } from "@/lib/weather-history-service";
import {
  getWeatherSnapshotStorageStatus,
  upsertWeatherSnapshot,
} from "@/lib/weather-snapshot-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const storage = getWeatherSnapshotStorageStatus();

  if (!storage.configured) {
    return NextResponse.json(
      {
        success: true,
        skipped: true,
        reason: "Armazenamento de snapshots ainda não configurado",
        missing: storage.missing,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  try {
    const day = await getPelotasHistoricalDay();
    const snapshot = await upsertWeatherSnapshot(
      day,
      "Open-Meteo Historical Forecast",
    );

    return NextResponse.json(
      {
        success: true,
        stored: true,
        snapshot,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Falha na captura diária do snapshot meteorológico:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível persistir o snapshot meteorológico",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
