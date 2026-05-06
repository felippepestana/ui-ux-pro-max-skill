import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { ENV, SUPABASE_ENABLED } from "@/lib/env";

/**
 * Refreshes the Supabase session on every request. This middleware is
 * invoked from the root `middleware.ts` so the session cookie stays fresh
 * across navigations. When Supabase is not configured (stub mode) it is a
 * no-op that simply forwards the request.
 */
export async function updateSession(req: NextRequest) {
  if (!SUPABASE_ENABLED || !ENV.supabase.url || !ENV.supabase.anonKey) {
    return NextResponse.next({ request: req });
  }

  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(ENV.supabase.url, ENV.supabase.anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          req.cookies.set(name, value),
        );
        response = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as CookieOptions),
        );
      },
    },
  });

  // Calling getUser() refreshes the session if the access token has
  // expired but the refresh token is still valid.
  await supabase.auth.getUser();

  return response;
}
