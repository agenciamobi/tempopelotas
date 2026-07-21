"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseBrowserConfigured() {
  return getBrowserConfig() !== null;
}

export function createClient() {
  const config = getBrowserConfig();
  if (!config) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(config.url, config.key, {
      cookieOptions: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    });
  }

  return browserClient;
}
