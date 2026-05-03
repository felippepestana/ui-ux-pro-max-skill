/**
 * Mock dataset of Deadlines for the v1 UI demo.
 * Real forensic-rule calculation (BR — feriados nacionais + tribunal) is
 * deferred to Phase F9 (v1.5) per the approved roadmap. v1 supports manual
 * input + visual alerts only.
 */

export type DeadlineKind =
  | "audiência"
  | "petição"
  | "réplica"
  | "tréplica"
  | "memoriais"
  | "recurso"
  | "manifestação"
  | "diligência";

export type DeadlineStatus = "agendado" | "em_andamento" | "cumprido" | "perdido";

export type Deadline = {
  id: string;
  kind: DeadlineKind;
  title: string;
  matterId: string;
  matterCode: string;
  matterClient: string;
  court: string;
  responsibleName: string;
  responsibleInitials: string;
  dueAt: string; // ISO
  status: DeadlineStatus;
  forensicRule?: string;
  evidenceUrl?: string;
  fulfilledAt?: string;
};

export const KIND_LABEL: Record<DeadlineKind, string> = {
  audiência: "Audiência",
  petição: "Petição",
  réplica: "Réplica",
  tréplica: "Tréplica",
  memoriais: "Memoriais",
  recurso: "Recurso",
  manifestação: "Manifestação",
  diligência: "Diligência",
};

export const STATUS_LABEL: Record<DeadlineStatus, string> = {
  agendado: "Agendado",
  em_andamento: "Em andamento",
  cumprido: "Cumprido",
  perdido: "Perdido",
};

// Anchor "now" matches the rest of the mock data so visual tests are stable.
const NOW = new Date("2026-04-28T12:00:00.000Z");
const HOUR = 60 * 60 * 1000;

function inHours(h: number): string {
  return new Date(NOW.getTime() + h * HOUR).toISOString();
}

export const DEADLINES: Deadline[] = [
  {
    id: "dl-101",
    kind: "réplica",
    title: "Réplica à contestação — Souza vs. Magazine X",
    matterId: "mat-482",
    matterCode: "2025/482",
    matterClient: "Pedro Souza",
    court: "TJSP — 12ª Vara Cível",
    responsibleName: "Felippe Pestana",
    responsibleInitials: "FP",
    dueAt: inHours(50),
    status: "em_andamento",
    forensicRule: "CPC art. 350 — 15 dias úteis",
  },
  {
    id: "dl-102",
    kind: "petição",
    title: "Petição inicial — Silva (trabalhista)",
    matterId: "mat-479",
    matterCode: "2025/479",
    matterClient: "Ana Silva",
    court: "TRT 2ª Região",
    responsibleName: "Felippe Pestana",
    responsibleInitials: "FP",
    dueAt: inHours(92),
    status: "agendado",
    forensicRule: "Prescrição quinquenal — verificar termo",
  },
  {
    id: "dl-103",
    kind: "diligência",
    title: "Due Diligence — Aquisição Acme",
    matterId: "mat-471",
    matterCode: "2025/471",
    matterClient: "Acme Holdings",
    court: "Privado (M&A)",
    responsibleName: "Mariana Costa",
    responsibleInitials: "MC",
    dueAt: inHours(140),
    status: "em_andamento",
    forensicRule: "Acordo de exclusividade — 30 dias",
  },
  {
    id: "dl-104",
    kind: "audiência",
    title: "Audiência inaugural — Inova Tech",
    matterId: "mat-460",
    matterCode: "2025/460",
    matterClient: "Inova Tech S.A.",
    court: "TRT 2ª Região — 45ª VT",
    responsibleName: "Mariana Costa",
    responsibleInitials: "MC",
    dueAt: inHours(332),
    status: "agendado",
  },
  {
    id: "dl-105",
    kind: "manifestação",
    title: "Manifestação sobre cálculos — Família Oliveira",
    matterId: "mat-454",
    matterCode: "2025/454",
    matterClient: "Família Oliveira",
    court: "TJSP — 4ª Vara Família",
    responsibleName: "Felippe Pestana",
    responsibleInitials: "FP",
    dueAt: inHours(240),
    status: "agendado",
    forensicRule: "Despacho de 22/04 — 10 dias úteis",
  },
  {
    id: "dl-106",
    kind: "memoriais",
    title: "Memoriais finais — Bom Sabor",
    matterId: "mat-465",
    matterCode: "2025/465",
    matterClient: "Restaurante Bom Sabor ME",
    court: "Justiça Federal — 3ª Vara",
    responsibleName: "Lucas Andrade",
    responsibleInitials: "LA",
    dueAt: inHours(420),
    status: "agendado",
  },
  {
    id: "dl-107",
    kind: "recurso",
    title: "Apelação — Comércio União (encerrado)",
    matterId: "mat-441",
    matterCode: "2025/441",
    matterClient: "Comércio União Ltda.",
    court: "TJSP — 8ª Câmara Empresarial",
    responsibleName: "Lucas Andrade",
    responsibleInitials: "LA",
    dueAt: inHours(-72),
    status: "cumprido",
    fulfilledAt: inHours(-80),
    evidenceUrl: "#mock",
  },
];

export function hoursUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - NOW.getTime()) / HOUR);
}

export function isCritical(deadline: Deadline): boolean {
  if (deadline.status !== "agendado" && deadline.status !== "em_andamento") {
    return false;
  }
  return hoursUntil(deadline.dueAt) <= 72;
}

/**
 * Returns deadlines occurring on a specific calendar day (local timezone of
 * the runtime). Used by the calendar grid to render dots/markers.
 */
export function getDeadlinesOnDate(date: Date): Deadline[] {
  const target = date.toDateString();
  return DEADLINES.filter(
    (d) => new Date(d.dueAt).toDateString() === target,
  );
}

/**
 * Stable "today" anchor for the v1 UI mock. In Phase F6 this becomes
 * `new Date()` once data is real.
 */
export function todayAnchor(): Date {
  return new Date(NOW);
}
