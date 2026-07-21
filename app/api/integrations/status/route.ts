import { NextResponse } from "next/server";

function configured(value: string | undefined) {
  return Boolean(value?.trim());
}

export function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabasePublicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;

  const response = NextResponse.json({
    generatedAt: new Date().toISOString(),
    integrations: {
      gemini: {
        configured: configured(
          process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY,
        ),
        model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash",
      },
      youtube: {
        configured: configured(process.env.YOUTUBE_API_KEY),
        channel: process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || "@praiadolaranjal",
      },
      supabaseAuth: {
        configured: configured(supabaseUrl) && configured(supabasePublicKey),
        urlConfigured: configured(supabaseUrl),
        publishableKeyConfigured: configured(supabasePublicKey),
      },
      googleMaps: {
        browserConfigured: configured(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
        embedConfigured: configured(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY),
        serverConfigured: configured(process.env.GOOGLE_MAPS_SERVER_API_KEY),
      },
      pageSpeed: {
        configured: configured(process.env.GOOGLE_PAGESPEED_API_KEY),
      },
      googleOAuth: {
        configured:
          configured(process.env.GOOGLE_OAUTH_CLIENT_ID) &&
          configured(process.env.GOOGLE_OAUTH_CLIENT_SECRET),
      },
    },
  });

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
