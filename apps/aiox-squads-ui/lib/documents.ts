/**
 * Mock dataset of Documents and Templates for the v1 UI demo.
 * Documents bind to a Matter; templates live at the office level. Real
 * persistence (incl. version blob storage in Vercel Blob / S3) lives in
 * Phase F6.
 */

export type DocumentStatus =
  | "rascunho"
  | "em_revisao"
  | "aprovado"
  | "protocolado"
  | "arquivado";

export type DocumentKind =
  | "petição_inicial"
  | "réplica"
  | "memoriais"
  | "recurso"
  | "contrato"
  | "parecer"
  | "procuração"
  | "due_diligence";

export type DocumentVersion = {
  id: string;
  version: number;
  authorName: string;
  authorInitials: string;
  sourceRunId?: string;
  excerpt: string;
  createdAt: string;
  diffSummary?: { added: number; removed: number };
};

export type DocumentItem = {
  id: string;
  title: string;
  kind: DocumentKind;
  matterId: string;
  matterCode: string;
  matterClient: string;
  status: DocumentStatus;
  templateId?: string;
  versions: DocumentVersion[];
  currentVersion: number;
  approvalsRequired: number;
  approvalsObtained: number;
  signers: string[];
  updatedAt: string;
};

export type DocumentTemplate = {
  id: string;
  title: string;
  area: string;
  kind: DocumentKind;
  description: string;
  variables: string[];
  usageCount: number;
};

export const STATUS_LABEL: Record<DocumentStatus, string> = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  aprovado: "Aprovado",
  protocolado: "Protocolado",
  arquivado: "Arquivado",
};

export const STATUS_VARIANT: Record<
  DocumentStatus,
  "default" | "info" | "warning" | "success" | "outline"
> = {
  rascunho: "default",
  em_revisao: "warning",
  aprovado: "success",
  protocolado: "info",
  arquivado: "outline",
};

export const KIND_LABEL: Record<DocumentKind, string> = {
  petição_inicial: "Petição inicial",
  réplica: "Réplica",
  memoriais: "Memoriais",
  recurso: "Recurso",
  contrato: "Contrato",
  parecer: "Parecer",
  procuração: "Procuração",
  due_diligence: "Due Diligence",
};

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: "tpl-001",
    title: "Petição inicial — Consumidor (cobrança vexatória)",
    area: "Consumidor",
    kind: "petição_inicial",
    description:
      "Modelo padrão para ações de repetição em dobro do indébito (CDC art. 42, parágrafo único) com pedido de dano moral.",
    variables: ["client_name", "counterparty", "case_value", "facts_summary"],
    usageCount: 23,
  },
  {
    id: "tpl-002",
    title: "Petição inicial — Trabalhista (vínculo empregatício)",
    area: "Trabalhista",
    kind: "petição_inicial",
    description:
      "Modelo para reclamação trabalhista com pedido de reconhecimento de vínculo, verbas rescisórias e dano moral.",
    variables: ["client_name", "employer", "period", "salary", "case_value"],
    usageCount: 41,
  },
  {
    id: "tpl-003",
    title: "Réplica — Genérica",
    area: "Cível",
    kind: "réplica",
    description: "Estrutura de réplica à contestação com refutação ponto a ponto.",
    variables: ["client_name", "process_number", "contested_arguments"],
    usageCount: 67,
  },
  {
    id: "tpl-004",
    title: "Contrato de honorários — Sucumbenciais + êxito",
    area: "Administrativo",
    kind: "contrato",
    description:
      "Modelo de contrato com honorários percentuais sobre êxito e sucumbenciais.",
    variables: ["client_name", "scope", "success_fee_percent", "fixed_fee"],
    usageCount: 89,
  },
  {
    id: "tpl-005",
    title: "Procuração ad judicia",
    area: "Administrativo",
    kind: "procuração",
    description:
      "Procuração padrão para representação em juízo, com poderes específicos preenchíveis.",
    variables: ["client_name", "client_taxId", "powers"],
    usageCount: 142,
  },
  {
    id: "tpl-006",
    title: "Parecer de Due Diligence — M&A",
    area: "Empresarial",
    kind: "due_diligence",
    description:
      "Estrutura padrão de parecer de DD com seções de risco alto/médio/baixo e síntese executiva.",
    variables: ["target_company", "buyer", "scope", "findings"],
    usageCount: 12,
  },
  {
    id: "tpl-007",
    title: "Memoriais finais — Cível",
    area: "Cível",
    kind: "memoriais",
    description:
      "Estrutura para memoriais com retomada da tese, refutação da contestação e pedidos.",
    variables: ["client_name", "process_number", "key_arguments"],
    usageCount: 34,
  },
  {
    id: "tpl-008",
    title: "Apelação — Cível",
    area: "Cível",
    kind: "recurso",
    description: "Estrutura de apelação com preliminares + mérito + pedidos.",
    variables: ["client_name", "decision_summary", "appeal_grounds"],
    usageCount: 28,
  },
];

export const DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-001",
    title: "Petição inicial — Souza vs. Magazine X",
    kind: "petição_inicial",
    matterId: "mat-482",
    matterCode: "2025/482",
    matterClient: "Pedro Souza",
    status: "protocolado",
    templateId: "tpl-001",
    versions: [
      {
        id: "v-001-1",
        version: 1,
        authorName: "Squad: Redação de Petição",
        authorInitials: "SQ",
        sourceRunId: "run-114",
        excerpt:
          "Trata-se de ação declaratória cumulada com indenização por danos morais...",
        createdAt: "2025-02-15T10:00:00Z",
      },
      {
        id: "v-001-2",
        version: 2,
        authorName: "Felippe Pestana",
        authorInitials: "FP",
        excerpt:
          "Trata-se de ação declaratória de inexistência de débito cumulada com indenização...",
        createdAt: "2025-02-16T14:30:00Z",
        diffSummary: { added: 142, removed: 47 },
      },
      {
        id: "v-001-3",
        version: 3,
        authorName: "Felippe Pestana",
        authorInitials: "FP",
        excerpt:
          "Trata-se de ação declaratória de inexistência de débito cumulada com indenização por danos morais e repetição em dobro do indébito (CDC art. 42, parágrafo único)...",
        createdAt: "2025-02-17T09:15:00Z",
        diffSummary: { added: 86, removed: 12 },
      },
    ],
    currentVersion: 3,
    approvalsRequired: 1,
    approvalsObtained: 1,
    signers: ["Felippe Pestana"],
    updatedAt: "2025-02-17T09:15:00Z",
  },
  {
    id: "doc-002",
    title: "Réplica à contestação — Souza vs. Magazine X",
    kind: "réplica",
    matterId: "mat-482",
    matterCode: "2025/482",
    matterClient: "Pedro Souza",
    status: "em_revisao",
    templateId: "tpl-003",
    versions: [
      {
        id: "v-002-1",
        version: 1,
        authorName: "Felippe Pestana",
        authorInitials: "FP",
        excerpt:
          "Refutamos integralmente os argumentos da contestação. As 14 decisões juntadas pelo Squad de Pesquisa Jurisprudencial demonstram que...",
        createdAt: "2026-04-28T14:32:00Z",
      },
    ],
    currentVersion: 1,
    approvalsRequired: 1,
    approvalsObtained: 0,
    signers: [],
    updatedAt: "2026-04-28T14:32:00Z",
  },
  {
    id: "doc-003",
    title: "Petição inicial — Silva (trabalhista)",
    kind: "petição_inicial",
    matterId: "mat-479",
    matterCode: "2025/479",
    matterClient: "Ana Silva",
    status: "em_revisao",
    templateId: "tpl-002",
    versions: [
      {
        id: "v-003-1",
        version: 1,
        authorName: "Squad: Redação de Petição",
        authorInitials: "SQ",
        sourceRunId: "run-116",
        excerpt:
          "Pleiteamos o reconhecimento de vínculo empregatício, verbas rescisórias, danos morais e honorários sucumbenciais...",
        createdAt: "2026-04-26T11:20:00Z",
      },
    ],
    currentVersion: 1,
    approvalsRequired: 1,
    approvalsObtained: 0,
    signers: [],
    updatedAt: "2026-04-26T11:20:00Z",
  },
  {
    id: "doc-004",
    title: "Parecer de Due Diligence — Acme/TargetCo",
    kind: "due_diligence",
    matterId: "mat-471",
    matterCode: "2025/471",
    matterClient: "Acme Holdings",
    status: "rascunho",
    templateId: "tpl-006",
    versions: [
      {
        id: "v-004-1",
        version: 1,
        authorName: "Squad: Due Diligence",
        authorInitials: "SQ",
        sourceRunId: "run-22",
        excerpt:
          "Análise de 47 cláusulas do MSA. 3 cláusulas com risco ALTO (limitação de responsabilidade, indenização e MAC clause). 8 com sugestão de revisão.",
        createdAt: "2026-04-27T16:00:00Z",
      },
    ],
    currentVersion: 1,
    approvalsRequired: 2,
    approvalsObtained: 0,
    signers: [],
    updatedAt: "2026-04-27T16:00:00Z",
  },
  {
    id: "doc-005",
    title: "Contrato de honorários — Acme",
    kind: "contrato",
    matterId: "mat-471",
    matterCode: "2025/471",
    matterClient: "Acme Holdings",
    status: "aprovado",
    templateId: "tpl-004",
    versions: [
      {
        id: "v-005-1",
        version: 1,
        authorName: "Mariana Costa",
        authorInitials: "MC",
        excerpt:
          "Honorários fixos de R$ 80.000 + 1,5% sobre o valor da operação no caso de fechamento.",
        createdAt: "2025-02-03T15:00:00Z",
      },
    ],
    currentVersion: 1,
    approvalsRequired: 1,
    approvalsObtained: 1,
    signers: ["Mariana Costa", "Acme Holdings (juridico@acme.com.br)"],
    updatedAt: "2025-02-04T10:00:00Z",
  },
  {
    id: "doc-006",
    title: "Procuração ad judicia — Inova Tech",
    kind: "procuração",
    matterId: "mat-460",
    matterCode: "2025/460",
    matterClient: "Inova Tech S.A.",
    status: "aprovado",
    templateId: "tpl-005",
    versions: [
      {
        id: "v-006-1",
        version: 1,
        authorName: "Mariana Costa",
        authorInitials: "MC",
        excerpt:
          "Procuração ad judicia com poderes amplos para o foro em geral e específicos para confessar e transigir.",
        createdAt: "2025-01-16T09:00:00Z",
      },
    ],
    currentVersion: 1,
    approvalsRequired: 1,
    approvalsObtained: 1,
    signers: ["Mariana Costa", "Inova Tech S.A."],
    updatedAt: "2025-01-16T11:00:00Z",
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  return DOCUMENTS.find((d) => d.id === id);
}

export function getDocumentsByMatter(matterId: string): DocumentItem[] {
  return DOCUMENTS.filter((d) => d.matterId === matterId);
}
