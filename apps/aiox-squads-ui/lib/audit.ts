/**
 * Mock dataset of AuditLog events for the v1 UI demo.
 * Source: human (user action), squad (Squad Run), system (cron, automation).
 * Real audit ingestion lives in Phase F6/F7 (writes happen on every mutation
 * via tRPC middleware).
 */

export type AuditActorType = "human" | "squad" | "system";

export type AuditEntityType =
  | "matter"
  | "lead"
  | "client"
  | "document"
  | "deadline"
  | "task"
  | "invoice"
  | "squad_run"
  | "hitl_task"
  | "user";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "execute"
  | "complete"
  | "share";

export type AuditEvent = {
  id: string;
  actorType: AuditActorType;
  actorName: string;
  actorInitials?: string;
  entityType: AuditEntityType;
  entityId: string;
  entityLabel: string;
  action: AuditAction;
  summary: string;
  diff?: { field: string; before: string; after: string }[];
  occurredAt: string;
  ip?: string;
};

export const ACTOR_LABEL: Record<AuditActorType, string> = {
  human: "Humano",
  squad: "Squad",
  system: "Sistema",
};

export const ACTOR_VARIANT: Record<
  AuditActorType,
  "default" | "accent" | "outline"
> = {
  human: "default",
  squad: "accent",
  system: "outline",
};

export const ENTITY_LABEL: Record<AuditEntityType, string> = {
  matter: "Caso",
  lead: "Lead",
  client: "Cliente",
  document: "Documento",
  deadline: "Prazo",
  task: "Tarefa",
  invoice: "Fatura",
  squad_run: "Squad Run",
  hitl_task: "HITL",
  user: "Usuário",
};

export const ACTION_LABEL: Record<AuditAction, string> = {
  create: "criou",
  update: "atualizou",
  delete: "removeu",
  approve: "aprovou",
  reject: "rejeitou",
  execute: "executou",
  complete: "concluiu",
  share: "compartilhou",
};

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "ev-501",
    actorType: "squad",
    actorName: "Squad: Pesquisa Jurisprudencial",
    entityType: "squad_run",
    entityId: "run-281",
    entityLabel: "Run #281 · Caso 2025/482",
    action: "execute",
    summary:
      "Iniciou execução com 4 agentes em pipeline. Contexto: Souza vs. Magazine X.",
    occurredAt: "2026-04-28T14:32:00Z",
  },
  {
    id: "ev-502",
    actorType: "human",
    actorName: "Felippe Pestana",
    actorInitials: "FP",
    entityType: "document",
    entityId: "doc-002",
    entityLabel: "Réplica à contestação — Souza vs. Magazine X",
    action: "create",
    summary: "Criou documento v1 com base em modelo tpl-003.",
    occurredAt: "2026-04-28T14:32:00Z",
    ip: "200.158.4.21",
  },
  {
    id: "ev-503",
    actorType: "human",
    actorName: "Mariana Costa",
    actorInitials: "MC",
    entityType: "task",
    entityId: "task-003",
    entityLabel: "Due diligence — análise de cláusulas MSA",
    action: "update",
    summary: "Moveu tarefa de Em andamento para Revisão.",
    diff: [{ field: "status", before: "doing", after: "review" }],
    occurredAt: "2026-04-28T11:18:00Z",
    ip: "200.158.4.45",
  },
  {
    id: "ev-504",
    actorType: "squad",
    actorName: "Squad: Triagem de Lead",
    entityType: "lead",
    entityId: "lead-104",
    entityLabel: "Cláudia Marques · Direito do Consumidor",
    action: "execute",
    summary:
      "Lead triado: ACEITAR (91% confiança). Sem conflito identificado.",
    diff: [
      { field: "stage", before: "novo", after: "novo" },
      { field: "triagedBySquad", before: "—", after: "run-401" },
    ],
    occurredAt: "2026-04-27T14:32:00Z",
  },
  {
    id: "ev-505",
    actorType: "human",
    actorName: "Felippe Pestana",
    actorInitials: "FP",
    entityType: "hitl_task",
    entityId: "hitl-114",
    entityLabel: "Aprovação · Doc 003 — Petição Silva",
    action: "approve",
    summary: "Aprovou minuta de petição inicial gerada pelo Squad.",
    diff: [{ field: "status", before: "needs_review", after: "approved" }],
    occurredAt: "2026-04-27T09:50:00Z",
    ip: "200.158.4.21",
  },
  {
    id: "ev-506",
    actorType: "human",
    actorName: "Lucas Andrade",
    actorInitials: "LA",
    entityType: "invoice",
    entityId: "inv-104",
    entityLabel: "Fatura 2026/0036 · Bom Sabor",
    action: "update",
    summary: "Marcou fatura como paga (R$ 1.250 via Boleto).",
    diff: [{ field: "status", before: "enviada", after: "paga" }],
    occurredAt: "2026-04-08T10:14:00Z",
    ip: "200.158.4.30",
  },
  {
    id: "ev-507",
    actorType: "system",
    actorName: "aiox · Cron de prazos",
    entityType: "deadline",
    entityId: "dl-101",
    entityLabel: "Réplica · Caso 2025/482",
    action: "update",
    summary:
      "Reminder D-2 enviado por e-mail para Felippe Pestana.",
    occurredAt: "2026-04-26T08:00:00Z",
  },
  {
    id: "ev-508",
    actorType: "human",
    actorName: "Mariana Costa",
    actorInitials: "MC",
    entityType: "matter",
    entityId: "mat-471",
    entityLabel: "Caso 2025/471 · Aquisição Acme",
    action: "update",
    summary: "Atualizou prioridade de Normal para Alta.",
    diff: [{ field: "priority", before: "normal", after: "high" }],
    occurredAt: "2026-04-25T16:00:00Z",
    ip: "200.158.4.45",
  },
  {
    id: "ev-509",
    actorType: "human",
    actorName: "Felippe Pestana",
    actorInitials: "FP",
    entityType: "client",
    entityId: "cli-001",
    entityLabel: "Pedro Souza",
    action: "create",
    summary: "Cadastrou novo cliente PF a partir do lead lead-100.",
    occurredAt: "2025-02-14T10:00:00Z",
    ip: "200.158.4.21",
  },
  {
    id: "ev-510",
    actorType: "system",
    actorName: "aiox · LGPD",
    entityType: "user",
    entityId: "u-1",
    entityLabel: "Felippe Pestana",
    action: "share",
    summary:
      "Exportação de dados solicitada (LGPD). 14 entidades incluídas.",
    occurredAt: "2026-04-20T14:00:00Z",
  },
];

export function getAuditByEntity(
  type: AuditEntityType,
  id: string,
): AuditEvent[] {
  return AUDIT_EVENTS.filter(
    (e) => e.entityType === type && e.entityId === id,
  );
}
