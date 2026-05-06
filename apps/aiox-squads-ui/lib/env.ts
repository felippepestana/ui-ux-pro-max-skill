/**
 * Centralised env-var access with explicit "backend enabled" flag.
 *
 * The app supports two modes:
 *   1. **Stub mode** (no Supabase env vars). Auth/DB calls fall back to
 *      static mocks in `lib/{matters,leads,clients,squads,audit}.ts`.
 *      Useful for local UI work without provisioning anything.
 *   2. **Live mode** (Supabase env vars present + DATABASE_URL set).
 *      Auth resolves the real session, tRPC routers can hit Prisma.
 *
 * The flags are evaluated lazily (no top-level throws) so importing this
 * module never blocks the build, regardless of whether `.env` is set.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

export const ENV = {
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    serviceRoleKey: supabaseServiceRoleKey,
  },
  databaseUrl,
} as const;

export const SUPABASE_ENABLED = Boolean(supabaseUrl && supabaseAnonKey);
export const DATABASE_ENABLED = Boolean(databaseUrl);
export const BACKEND_ENABLED = SUPABASE_ENABLED && DATABASE_ENABLED;

export function requireSupabaseEnv(): {
  url: string;
  anonKey: string;
} {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase não está configurado. Defina NEXT_PUBLIC_SUPABASE_URL e " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY em .env. Veja docs/BACKEND.md.",
    );
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}
