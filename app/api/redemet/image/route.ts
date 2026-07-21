import { NextRequest, NextResponse } from "next/server";
import { isAllowedRedemetImageUrl } from "@/lib/redemet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("src")?.trim();

  if (!source || !isAllowedRedemetImageUrl(source)) {
    return NextResponse.json(
      { error: "Imagem REDEMET inválida." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(source, {
      headers: {
        Accept: "image/png,image/webp,image/*;q=0.8",
        "User-Agent": "TempoPelotas/1.0 (+https://tempopelotas.com.br)",
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(12_000),
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Imagem REDEMET temporariamente indisponível." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const image = await response.arrayBuffer();

    return new NextResponse(image, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=1800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[redemet] Falha ao entregar imagem:", error);

    return NextResponse.json(
      { error: "Imagem REDEMET temporariamente indisponível." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
