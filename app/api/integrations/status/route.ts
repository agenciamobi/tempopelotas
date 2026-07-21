import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function configured(value: string | undefined) {
  return Boolean(value?.trim());
}

async function getGoogleProviderStatus(url: string, key: string) {
  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        Accept: "application/json",
        apikey: key,
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) return null;

    const body = (await response.json()) as {
      external?: { google?: boolean };
    };

    return body.external?.google === true;
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = getSupabasePublicConfig();
  const googleProviderEnabled = await getGoogleProviderStatus(
    supabase.url,
    supabase.key,
  );

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
        configured: Boolean(supabase.url && supabase.key),
        projectRef: "ovcpgjyomwjteapbvfwk",
        googleProviderEnabled,
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
