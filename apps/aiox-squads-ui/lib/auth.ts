/**
 * Authentication helpers.
 *
 * F6.1 ships a stubbed `getCurrentUser` that always returns the office
 * sócio (Felippe Pestana) so server routes can be wired without a real
 * Supabase Auth integration. F6.2 replaces this with the real Supabase
 * session lookup (cookie + service role).
 */

export type SessionUser = {
  id: string;
  officeId: string;
  email: string;
  name: string;
  role: "socio" | "advogado" | "paralegal" | "financeiro" | "cliente";
};

const STUB_USER: SessionUser = {
  id: "u-1",
  officeId: "off-1",
  email: "felippe@pestana.adv.br",
  name: "Felippe Pestana",
  role: "socio",
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  // TODO Phase F6.2: replace with `supabase.auth.getUser()` reading cookies.
  return STUB_USER;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
