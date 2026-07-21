import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getServerConfig() {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  )?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseServerConfigured() {
  return getServerConfig() !== null;
}

export async function createClient() {
  const config = getServerConfig();
  if (!config) return null;

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components não podem gravar cookies. O proxy atualiza a sessão.
        }
      },
    },
  });
}
