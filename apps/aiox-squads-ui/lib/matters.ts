/**
 * Mock dataset of Matters (Casos) for the v1 UI demo.
 * Replaces the placeholder /matters route in Phase F2.
 * Real persistence in Phase F6 (Postgres + Prisma + tRPC).
 */

export type MatterArea =
  | "Cível"
  | "Trabalhista"
  | "Empresarial"
  | "Tributário"
  | "Consumidor";

export type MatterStatus =
  | "intake"
  | "triagem"
  | "ativo"
  | "aguardando_cliente"
  | "audiência"
  | "encerrado";

export type MatterPriority = "low" | "normal" | "high" | "critical";

export type Matter = {
  id: string;
  code: string;
  client: string;
  counterparty: string;
  area: MatterArea;
  status: MatterStatus;
  priority: MatterPriority;
  caseValueBrl: number;
  responsibleName: string;
  responsibleInitials: string;
  openedAt: string;
  nextDeadline?: { label: string; dueAt: string; hoursLeft: number };
  activeSquadRunId?: string;
};

export const STATUS_LABEL: Record<MatterStatus, string> = {
  intake: "Intake",
  triagem: "Em triagem",
  ativo: "Ativo",
  aguardando_cliente: "Aguardando cliente",
  audiência: "Audiência",
  encerrado: "Encerrado",
};

export const PRIORITY_LABEL: Record<MatterPriority, string> = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
  critical: "Crítica",
};

export const AREAS: MatterArea[] = [
  "Cível",
  "Trabalhista",
  "Empresarial",
  "Tributário",
  "Consumidor",
];

export const MATTERS: Matter[] = [
  {
    id: "mat-482",
    code: "2025/482",
    client: "Pedro Souza",
    counterparty: "Magazine X Comércio S.A.",
    area: "Consumidor",
    status: "ativo",
    priority: "critical",
    caseValueBrl: 35_000,
    responsibleName: "Felippe Pestana",
    responsibleInitials: "FP",
    openedAt: "2025-02-14",
    nextDeadline: { label: "Réplica", dueAt: "2026-04-30", hoursLeft: 50 },
    activeSquadRunId: "run-281",
  },
  {
    id: "mat-479",
    code: "2025/479",
    client: "Ana Silva",
    counterparty: "Construtora Beta Ltda.",
    area: "Trabalhista",
    status: "ativo",
    priority: "high",
    caseValueBrl: 145_000,
    responsibleName: "Felippe Pestana",
    responsibleInitials: "FP",
    openedAt: "2025-02-08",
    nextDeadline: { label: "Petição inicial", dueAt: "2026-05-02", hoursLeft: 92 },
  },
  {
    id: "mat-471",
    code: "2025/471",
    client: "Acme Holdings",
    counterparty: "TargetCo Ltda.",
    area: "Empresarial",
    status: "triagem",
    priority: "high",
    caseValueBrl: 4_800_000,
    responsibleName: "Mariana Costa",
    responsibleInitials: "MC",
    openedAt: "2025-02-01",
    nextDeadline: { label: "Due Diligence", dueAt: "2026-05-04", hoursLeft: 140 },
  },
  {
    id: "mat-465",
    code: "2025/465",
    client: "Restaurante Bom Sabor ME",
    counterparty: "Município de Campinas",
    area: "Tributário",
    status: "aguardando_cliente",
    priority: "normal",
    caseValueBrl: 28_500,
    responsibleName: "Lucas Andrade",
    responsibleInitials: "LA",
    openedAt: "2025-01-22",
  },
  {
    id: "mat-460",
    code: "2025/460",
    client: "Inova Tech S.A.",
    counterparty: "Ex-funcionário João P.",
    area: "Trabalhista",
    status: "audiência",
    priority: "normal",
    caseValueBrl: 75_000,
    responsibleName: "Mariana Costa",
    responsibleInitials: "MC",
    openedAt: "2025-01-15",
    nextDeadline: { label: "Audiência inaugural", dueAt: "2026-05-12", hoursLeft: 332 },
  },
  {
    id: "mat-454",
    code: "2025/454",
    client: "Família Oliveira",
    counterparty: "Espólio de J. Oliveira",
    area: "Cível",
    status: "ativo",
    priority: "low",
    caseValueBrl: 320_000,
    responsibleName: "Felippe Pestana",
    responsibleInitials: "FP",
    openedAt: "2025-01-09",
  },
  {
    id: "mat-441",
    code: "2025/441",
    client: "Comércio União Ltda.",
    counterparty: "Fornecedor Y",
    area: "Empresarial",
    status: "encerrado",
    priority: "low",
    caseValueBrl: 92_000,
    responsibleName: "Lucas Andrade",
    responsibleInitials: "LA",
    openedAt: "2024-11-18",
  },
];

export function getMatterById(id: string): Matter | undefined {
  return MATTERS.find((matter) => matter.id === id);
}

export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
