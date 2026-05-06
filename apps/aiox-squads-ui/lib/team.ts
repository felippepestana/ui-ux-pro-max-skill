/**
 * Mock dataset of office team members + RBAC roles for the v1 UI demo.
 * Real role enforcement (server-side) lands in Phase F6/F7 with Supabase
 * Auth + RLS policies.
 */

export type Role = "socio" | "advogado" | "paralegal" | "financeiro" | "cliente";

export type Member = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  joinedAt: string;
  status: "ativo" | "convidado" | "inativo";
  lastActiveAt?: string;
};

export const ROLE_LABEL: Record<Role, string> = {
  socio: "Sócio(a)",
  advogado: "Advogado(a)",
  paralegal: "Paralegal",
  financeiro: "Financeiro",
  cliente: "Cliente convidado",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  socio: "Acesso total: gestão, faturamento, configurações e auditoria.",
  advogado: "Cria e edita casos, dispara squads, aprova HITL.",
  paralegal: "Tarefas, prazos, drafts. Não aprova HITL nem edita financeiro.",
  financeiro: "Contratos, faturas, recebimentos. Sem acesso ao mérito do caso.",
  cliente: "Acesso somente leitura aos seus próprios casos via portal.",
};

export const ROLE_VARIANT: Record<
  Role,
  "default" | "info" | "warning" | "accent" | "outline"
> = {
  socio: "info",
  advogado: "default",
  paralegal: "warning",
  financeiro: "accent",
  cliente: "outline",
};

export const MEMBERS: Member[] = [
  {
    id: "u-1",
    name: "Felippe Pestana",
    initials: "FP",
    email: "felippe@pestana.adv.br",
    role: "socio",
    joinedAt: "2024-08-01",
    status: "ativo",
    lastActiveAt: "2026-04-28T14:30:00Z",
  },
  {
    id: "u-2",
    name: "Mariana Costa",
    initials: "MC",
    email: "mariana@pestana.adv.br",
    role: "advogado",
    joinedAt: "2024-09-15",
    status: "ativo",
    lastActiveAt: "2026-04-28T11:18:00Z",
  },
  {
    id: "u-3",
    name: "Lucas Andrade",
    initials: "LA",
    email: "lucas@pestana.adv.br",
    role: "advogado",
    joinedAt: "2024-11-02",
    status: "ativo",
    lastActiveAt: "2026-04-27T18:45:00Z",
  },
  {
    id: "u-4",
    name: "Beatriz Rocha",
    initials: "BR",
    email: "beatriz@pestana.adv.br",
    role: "paralegal",
    joinedAt: "2025-01-15",
    status: "ativo",
    lastActiveAt: "2026-04-28T09:00:00Z",
  },
  {
    id: "u-5",
    name: "Carlos Tavares",
    initials: "CT",
    email: "financeiro@pestana.adv.br",
    role: "financeiro",
    joinedAt: "2024-08-20",
    status: "ativo",
    lastActiveAt: "2026-04-28T08:30:00Z",
  },
  {
    id: "u-6",
    name: "Acme Holdings · Rep. Jurídico",
    initials: "AC",
    email: "juridico@acme.com.br",
    role: "cliente",
    joinedAt: "2025-02-05",
    status: "ativo",
    lastActiveAt: "2026-04-26T16:00:00Z",
  },
  {
    id: "u-7",
    name: "Inova Tech · RH",
    initials: "IT",
    email: "rh.juridico@inovatech.com",
    role: "cliente",
    joinedAt: "2025-01-20",
    status: "convidado",
  },
];

export const ROLES: Role[] = ["socio", "advogado", "paralegal", "financeiro", "cliente"];
