import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/env";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers
 * and tRPC procedures. Reads/writes cookies via the next/headers store so
 * the session is shared with the rest of the request.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as CookieOptions),
          );
        } catch {
          // Server Components cannot set cookies — silently ignore. The
          // middleware (middleware.ts) is responsible for refreshing.
        }
      },
    },
  });
}
