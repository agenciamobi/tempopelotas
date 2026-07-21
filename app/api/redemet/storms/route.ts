import { NextRequest, NextResponse } from "next/server";
import { getRedemetStorms } from "@/lib/redemet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requested = Number(request.nextUrl.searchParams.get("frames") ?? 20);
  const payload = await getRedemetStorms(requested);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
