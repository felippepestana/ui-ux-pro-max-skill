/**
 * Authentication helpers (dual-mode).
 *
 * - When Supabase env vars are present, `getCurrentUser` reads the real
 *   session (cookie-based) via @supabase/ssr and resolves the office
 *   membership via Prisma. RBAC enforcement uses the real `role`.
 * - When Supabase is not configured (no env vars), it falls back to a
 *   stub returning the office sócio so the UI keeps working in dev.
 *
 * F6.3 will pin the stub branch behind `process.env.NODE_ENV !== "production"`
 * so production deploys without env vars fail loudly.
 */

import { db } from "@/lib/db";
import { BACKEND_ENABLED, SUPABASE_ENABLED } from "@/lib/env";

export type SessionRole =
  | "socio"
  | "advogado"
  | "paralegal"
  | "financeiro"
  | "cliente";

export type SessionUser = {
  id: string;
  officeId: string;
  email: string;
  name: string;
  role: SessionRole;
};

const STUB_USER: SessionUser = {
  id: "u-1",
  officeId: "off-1",
  email: "felippe@pestana.adv.br",
  name: "Felippe Pestana",
  role: "socio",
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!SUPABASE_ENABLED) {
    return STUB_USER;
  }

  // Lazy import so the build doesn't fail when @supabase/ssr is enabled
  // but the cookies API isn't available (during static generation).
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (!BACKEND_ENABLED) {
    // Supabase auth resolved but Prisma is not configured yet — return a
    // bare-minimum session so the UI can render.
    return {
      id: user.id,
      officeId: STUB_USER.officeId,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? user.email ?? "",
      role: "socio",
    };
  }

  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: { id: true, officeId: true, email: true, name: true, role: true },
  });
  if (!profile) return null;

  return {
    id: profile.id,
    officeId: profile.officeId,
    email: profile.email,
    name: profile.name,
    role: profile.role as SessionRole,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
