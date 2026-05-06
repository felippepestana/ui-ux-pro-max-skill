/**
 * Mock dataset of Tasks for the v1 UI demo.
 * Each task is bound to a Matter (lib/matters.ts) and may reference a
 * Deadline (lib/deadlines.ts). Real persistence in Phase F6.
 */

export type TaskStatus = "todo" | "doing" | "review" | "done";

export type TaskPriority = "low" | "normal" | "high" | "critical";

export type TaskAssignee = {
  id: string;
  name: string;
  initials: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  matterId: string;
  matterCode: string;
  matterClient: string;
  deadlineId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TaskAssignee;
  dueAt?: string;
  hoursLeft?: number;
  checklist?: { label: string; done: boolean }[];
  dependsOnId?: string;
};

export const TASK_STAGES: { key: TaskStatus; label: string; description: string }[] = [
  { key: "todo", label: "A fazer", description: "Aguardando início" },
  { key: "doing", label: "Em andamento", description: "Sendo executada" },
  { key: "review", label: "Revisão", description: "Aguardando aprovação" },
  { key: "done", label: "Concluída", description: "Finalizada" },
];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
  critical: "Crítica",
};

export const PRIORITY_VARIANT: Record<
  TaskPriority,
  "destructive" | "warning" | "default" | "outline"
> = {
  critical: "destructive",
  high: "warning",
  normal: "default",
  low: "outline",
};

const FELIPPE: TaskAssignee = { id: "u-1", name: "Felippe Pestana", initials: "FP" };
const MARIANA: TaskAssignee = { id: "u-2", name: "Mariana Costa", initials: "MC" };
const LUCAS: TaskAssignee = { id: "u-3", name: "Lucas Andrade", initials: "LA" };
const PARA1: TaskAssignee = { id: "u-4", name: "Beatriz Rocha", initials: "BR" };

export const ASSIGNEES: TaskAssignee[] = [FELIPPE, MARIANA, LUCAS, PARA1];

export const TASKS: Task[] = [
  {
    id: "task-001",
    title: "Redigir réplica processo 2025/482",
    description: "Resposta à contestação. Incorporar jurisprudência localizada pelo Squad.",
    matterId: "mat-482",
    matterCode: "2025/482",
    matterClient: "Pedro Souza",
    deadlineId: "dl-101",
    status: "doing",
    priority: "critical",
    assignee: FELIPPE,
    dueAt: "2026-04-30T15:00:00Z",
    hoursLeft: 50,
    checklist: [
      { label: "Levantar argumentos da contestação", done: true },
      { label: "Incluir 3 jurisprudências do Squad", done: true },
      { label: "Revisar valor do dano moral", done: false },
      { label: "Submeter para revisão do sócio", done: false },
    ],
  },
  {
    id: "task-002",
    title: "Coletar contracheques cliente Silva",
    description: "Documentos para instruir ação trabalhista.",
    matterId: "mat-479",
    matterCode: "2025/479",
    matterClient: "Ana Silva",
    status: "todo",
    priority: "high",
    assignee: PARA1,
    dueAt: "2026-04-29T18:00:00Z",
    hoursLeft: 22,
    checklist: [
      { label: "Solicitar via e-mail ao cliente", done: true },
      { label: "Validar período (24 meses)", done: false },
      { label: "Anexar ao caso", done: false },
    ],
  },
  {
    id: "task-003",
    title: "Due diligence — análise de cláusulas MSA",
    description: "47 cláusulas a revisar. Squad de DD identificou 3 com risco alto.",
    matterId: "mat-471",
    matterCode: "2025/471",
    matterClient: "Acme Holdings",
    status: "review",
    priority: "high",
    assignee: MARIANA,
    dueAt: "2026-05-04T17:00:00Z",
    hoursLeft: 140,
    checklist: [
      { label: "Cláusulas de indenização", done: true },
      { label: "MAC clause", done: true },
      { label: "Limitação de responsabilidade", done: true },
      { label: "Síntese para sócio", done: false },
    ],
  },
  {
    id: "task-004",
    title: "Confirmar audiência cliente Inova Tech",
    matterId: "mat-460",
    matterCode: "2025/460",
    matterClient: "Inova Tech S.A.",
    status: "todo",
    priority: "normal",
    assignee: MARIANA,
    dueAt: "2026-05-12T14:00:00Z",
    hoursLeft: 332,
  },
  {
    id: "task-005",
    title: "Atualizar inventário com novo herdeiro",
    matterId: "mat-454",
    matterCode: "2025/454",
    matterClient: "Família Oliveira",
    status: "doing",
    priority: "normal",
    assignee: FELIPPE,
    dueAt: "2026-05-08T17:00:00Z",
    hoursLeft: 240,
  },
  {
    id: "task-006",
    title: "Solicitar comprovante de pagamento ISS — Bom Sabor",
    matterId: "mat-465",
    matterCode: "2025/465",
    matterClient: "Restaurante Bom Sabor ME",
    status: "todo",
    priority: "low",
    assignee: LUCAS,
    hoursLeft: 96,
  },
  {
    id: "task-007",
    title: "Encerrar arquivamento Comércio União",
    matterId: "mat-441",
    matterCode: "2025/441",
    matterClient: "Comércio União Ltda.",
    status: "done",
    priority: "low",
    assignee: LUCAS,
    dueAt: "2026-04-15T18:00:00Z",
  },
  {
    id: "task-008",
    title: "Revisar minuta de petição inicial Silva",
    matterId: "mat-479",
    matterCode: "2025/479",
    matterClient: "Ana Silva",
    status: "review",
    priority: "high",
    assignee: FELIPPE,
    dueAt: "2026-05-02T15:00:00Z",
    hoursLeft: 92,
    dependsOnId: "task-002",
    checklist: [
      { label: "Estrutura processual ok", done: true },
      { label: "Pedidos coerentes", done: true },
      { label: "Valor dano moral", done: false },
    ],
  },
];

export function getTasksByMatterId(matterId: string): Task[] {
  return TASKS.filter((t) => t.matterId === matterId);
}

export function getTasksByAssignee(assigneeId: string): Task[] {
  return TASKS.filter((t) => t.assignee.id === assigneeId);
}
