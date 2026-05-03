/**
 * Mock catalog of the 3 priority Squads for v1 (validated with the user):
 *   1. Pesquisa Jurisprudencial
 *   2. Redação de Petição Inicial
 *   3. Triagem de Lead
 *
 * Real persistence comes in Phase F6 (Postgres + Prisma + tRPC). Until then,
 * everything reads from this static module. Each Squad declares which
 * context types it accepts (Matter | Document | Lead) so the
 * SquadLauncherButton can filter by entity in F2 onwards.
 */

/**
 * `iconKey` is a string identifier (not the LucideIcon component) so the
 * Squad type stays serialisable and can cross the RSC boundary into client
 * components. Use `getSquadIcon(iconKey)` from `lib/squad-icons` to resolve
 * the actual icon component on the client.
 */
export type SquadIconKey = "book-open-check" | "file-edit" | "user-plus";

export type SquadContextType = "matter" | "document" | "lead";

export type Agent = {
  key: string;
  name: string;
  role: string;
  capabilities: string[];
};

export type Squad = {
  id: string;
  key: string;
  name: string;
  tagline: string;
  description: string;
  iconKey: SquadIconKey;
  contextTypes: SquadContextType[];
  agents: Agent[];
  avgDurationSeconds: number;
  avgTokens: number;
  avgCostBrl: number;
  runsCompleted: number;
};

export const SQUADS: Squad[] = [
  {
    id: "sq-jurisp",
    key: "pesquisa-jurisprudencial",
    name: "Pesquisa Jurisprudencial",
    tagline: "Encontra precedentes alinhados à tese do caso",
    description:
      "Pipeline que extrai a controvérsia jurídica do caso, busca decisões em STJ/STF e tribunais relevantes, ranqueia por aderência e devolve citações clicáveis prontas para ancorar a peça.",
    iconKey: "book-open-check",
    contextTypes: ["matter", "document"],
    agents: [
      {
        key: "extrator-tese",
        name: "Extrator de Tese",
        role: "Identifica controvérsia",
        capabilities: ["resumo", "classificação"],
      },
      {
        key: "buscador",
        name: "Buscador",
        role: "Consulta tribunais e bases",
        capabilities: ["STJ", "STF", "TJ", "vector-search"],
      },
      {
        key: "rankeador",
        name: "Rankeador",
        role: "Ordena por aderência",
        capabilities: ["semantic-similarity", "recency"],
      },
      {
        key: "citador",
        name: "Citador",
        role: "Formata citações",
        capabilities: ["ABNT", "links-fonte"],
      },
    ],
    avgDurationSeconds: 92,
    avgTokens: 38_420,
    avgCostBrl: 1.85,
    runsCompleted: 281,
  },
  {
    id: "sq-peticao",
    key: "redacao-peticao-inicial",
    name: "Redação de Petição Inicial",
    tagline: "Gera primeira versão de petição com base no caso",
    description:
      "Toma o resumo do caso, pedidos e jurisprudência relacionada, devolve uma minuta de petição inicial com estrutura processual correta, fundamentação e pedidos. Resultado entra no módulo Documentos como versão v1 em rascunho.",
    iconKey: "file-edit",
    contextTypes: ["matter", "document"],
    agents: [
      {
        key: "estruturador",
        name: "Estruturador",
        role: "Monta estrutura processual",
        capabilities: ["CPC", "rito-comum", "rito-especial"],
      },
      {
        key: "redator",
        name: "Redator",
        role: "Escreve fundamentação",
        capabilities: ["linguagem-jurídica", "tese-defesa"],
      },
      {
        key: "revisor",
        name: "Revisor de Forma",
        role: "Verifica formalidade e ABNT",
        capabilities: ["ABNT", "ortografia", "consistência"],
      },
    ],
    avgDurationSeconds: 168,
    avgTokens: 22_180,
    avgCostBrl: 1.05,
    runsCompleted: 114,
  },
  {
    id: "sq-triagem",
    key: "triagem-lead",
    name: "Triagem de Lead",
    tagline: "Qualifica lead recebido e sugere área de atuação",
    description:
      "Analisa o conteúdo recebido (formulário, e-mail, WhatsApp), identifica área do direito, urgência, potencial conflito de interesse e estima valor de causa. Devolve recomendação de aceite ou recusa com justificativa.",
    iconKey: "user-plus",
    contextTypes: ["lead"],
    agents: [
      {
        key: "classificador",
        name: "Classificador de Área",
        role: "Identifica área e tipo",
        capabilities: ["taxonomia-jurídica", "NER-jurídico"],
      },
      {
        key: "avaliador-conflito",
        name: "Avaliador de Conflito",
        role: "Cruza com base de clientes",
        capabilities: ["match-CPF/CNPJ", "grafo-relacionamento"],
      },
      {
        key: "estimador-valor",
        name: "Estimador de Valor",
        role: "Sugere valor de causa",
        capabilities: ["benchmark-histórico", "regressão"],
      },
    ],
    avgDurationSeconds: 28,
    avgTokens: 6_400,
    avgCostBrl: 0.32,
    runsCompleted: 412,
  },
];

export function getSquadById(id: string): Squad | undefined {
  return SQUADS.find((squad) => squad.id === id);
}

export function getSquadsForContext(type: SquadContextType): Squad[] {
  return SQUADS.filter((squad) => squad.contextTypes.includes(type));
}

export type RunStatus =
  | "queued"
  | "running"
  | "needs_review"
  | "approved"
  | "rejected"
  | "failed";

export type RunStepStatus = "queued" | "running" | "done" | "failed";

export type SquadRunStep = {
  agentKey: string;
  agentName: string;
  status: RunStepStatus;
  startedAt?: string;
  finishedAt?: string;
  tokens: number;
  costBrl: number;
  output?: string;
  citations?: { title: string; source: string; url?: string }[];
};

export type SquadRun = {
  id: string;
  squadId: string;
  squadName: string;
  contextType: SquadContextType;
  contextLabel: string;
  status: RunStatus;
  startedAt: string;
  steps: SquadRunStep[];
  totalTokens: number;
  totalCostBrl: number;
  progress: number;
};

const NOW = "2026-04-28T15:30:00.000Z";

export const ACTIVE_RUNS: SquadRun[] = [
  {
    id: "run-281",
    squadId: "sq-jurisp",
    squadName: "Pesquisa Jurisprudencial",
    contextType: "matter",
    contextLabel: "Caso 2025/482 — Souza vs. Magazine X",
    status: "running",
    startedAt: NOW,
    progress: 72,
    totalTokens: 27_600,
    totalCostBrl: 1.32,
    steps: [
      {
        agentKey: "extrator-tese",
        agentName: "Extrator de Tese",
        status: "done",
        tokens: 4_200,
        costBrl: 0.2,
        output:
          "Controvérsia: cobrança vexatória após quitação. Tese aplicável: CDC art. 42, parágrafo único.",
      },
      {
        agentKey: "buscador",
        agentName: "Buscador",
        status: "done",
        tokens: 9_400,
        costBrl: 0.45,
        output: "14 decisões encontradas no TJSP nos últimos 24 meses.",
      },
      {
        agentKey: "rankeador",
        agentName: "Rankeador",
        status: "running",
        tokens: 14_000,
        costBrl: 0.67,
      },
      {
        agentKey: "citador",
        agentName: "Citador",
        status: "queued",
        tokens: 0,
        costBrl: 0,
      },
    ],
  },
];
