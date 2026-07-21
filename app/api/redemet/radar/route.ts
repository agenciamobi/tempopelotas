import { NextRequest, NextResponse } from "next/server";
import { getRedemetRadar } from "@/lib/redemet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requested = Number(request.nextUrl.searchParams.get("frames") ?? 10);
  const payload = await getRedemetRadar(requested);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=180, stale-while-revalidate=300",
    },
  });
}
