"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv, SUPABASE_ENABLED } from "@/lib/env";

/**
 * Browser-side Supabase client. Used by the login form and any client
 * component that needs to read auth state directly. When Supabase is not
 * configured, callers should branch on SUPABASE_ENABLED first.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient(url, anonKey);
}

export { SUPABASE_ENABLED };
