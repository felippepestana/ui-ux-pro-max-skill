/**
 * Mock dataset of Leads (CRM/Pipeline) for the v1 UI demo.
 * Mirrors the Lead entity drafted in the Prisma schema (lib/squads.ts neighbour).
 * Real persistence in Phase F6 (Postgres + Prisma + tRPC).
 */

export type LeadStage =
  | "novo"
  | "qualificado"
  | "proposta"
  | "aceite"
  | "perdido";

export type LeadSource =
  | "site"
  | "indicação"
  | "linkedin"
  | "instagram"
  | "google"
  | "evento";

export type Lead = {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  source: LeadSource;
  area: string;
  summary: string;
  estimatedValueBrl: number;
  stage: LeadStage;
  createdAt: string;
  expectedCloseAt?: string;
  triagedBySquad?: { runId: string; confidence: number; recommendation: "aceitar" | "recusar" | "revisar" };
  lostReason?: string;
};

export const STAGES: { key: LeadStage; label: string; description: string }[] = [
  { key: "novo", label: "Novo", description: "Aguardando triagem inicial" },
  { key: "qualificado", label: "Qualificado", description: "Pré-aceito, aguardando proposta" },
  { key: "proposta", label: "Proposta enviada", description: "Aguardando resposta do prospect" },
  { key: "aceite", label: "Aceite", description: "Pronto para conversão em cliente + caso" },
  { key: "perdido", label: "Perdido", description: "Recusado ou sem retorno" },
];

export const SOURCE_LABEL: Record<LeadSource, string> = {
  site: "Site",
  indicação: "Indicação",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  google: "Google Ads",
  evento: "Evento",
};

export const LEADS: Lead[] = [
  {
    id: "lead-104",
    name: "Cláudia Marques",
    contactEmail: "claudia.marques@gmail.com",
    contactPhone: "+55 11 98123-0001",
    source: "site",
    area: "Direito do Consumidor",
    summary:
      "Cobrança vexatória após quitação por loja Magazine X. Procura repetição em dobro + dano moral.",
    estimatedValueBrl: 35_000,
    stage: "novo",
    createdAt: "2026-04-27",
    triagedBySquad: { runId: "run-401", confidence: 0.91, recommendation: "aceitar" },
  },
  {
    id: "lead-103",
    name: "TechBR Sistemas Ltda.",
    contactEmail: "juridico@techbr.com",
    contactPhone: "+55 11 3456-7890",
    source: "linkedin",
    area: "Empresarial / M&A",
    summary:
      "Aquisição de startup do setor edtech. Precisa de due diligence e estruturação societária.",
    estimatedValueBrl: 120_000,
    stage: "qualificado",
    createdAt: "2026-04-25",
    expectedCloseAt: "2026-05-15",
  },
  {
    id: "lead-102",
    name: "Rafael Oliveira",
    contactEmail: "rafael.oliveira@example.com",
    contactPhone: "+55 21 99111-2222",
    source: "indicação",
    area: "Trabalhista",
    summary:
      "Reclamação trabalhista — vínculo empregatício não reconhecido em estágio prolongado.",
    estimatedValueBrl: 145_000,
    stage: "qualificado",
    createdAt: "2026-04-22",
  },
  {
    id: "lead-101",
    name: "Padaria Bom Pão ME",
    contactEmail: "contato@bompao.com.br",
    contactPhone: "+55 11 4567-8901",
    source: "google",
    area: "Tributário",
    summary:
      "Execução fiscal por suposto débito de ISS. Cliente alega já ter quitado.",
    estimatedValueBrl: 28_500,
    stage: "proposta",
    createdAt: "2026-04-18",
    expectedCloseAt: "2026-05-05",
  },
  {
    id: "lead-100",
    name: "Construtora Athenas",
    contactEmail: "j.silva@athenas.com.br",
    contactPhone: "+55 31 3344-5566",
    source: "evento",
    area: "Empresarial",
    summary:
      "Disputa contratual com fornecedor de aço. Possível arbitragem CCBC.",
    estimatedValueBrl: 850_000,
    stage: "proposta",
    createdAt: "2026-04-15",
    expectedCloseAt: "2026-04-30",
  },
  {
    id: "lead-099",
    name: "Família Costa",
    contactEmail: "contato.costa@gmail.com",
    contactPhone: "+55 11 99888-7777",
    source: "indicação",
    area: "Sucessões",
    summary:
      "Inventário judicial. Espólio estimado em R$ 2.4M com 4 herdeiros.",
    estimatedValueBrl: 240_000,
    stage: "aceite",
    createdAt: "2026-04-10",
  },
  {
    id: "lead-098",
    name: "Marina Lopes",
    contactEmail: "marina.lopes@email.com",
    contactPhone: "+55 11 95544-3322",
    source: "instagram",
    area: "Família",
    summary: "Divórcio consensual com partilha de imóvel financiado.",
    estimatedValueBrl: 12_000,
    stage: "perdido",
    createdAt: "2026-04-05",
    lostReason: "Optou por outro escritório por preço menor",
  },
];

export function getLeadById(id: string): Lead | undefined {
  return LEADS.find((lead) => lead.id === id);
}

export function getLeadsByStage(stage: LeadStage): Lead[] {
  return LEADS.filter((lead) => lead.stage === stage);
}

export function getPipelineValue(stage: LeadStage): number {
  return getLeadsByStage(stage).reduce((sum, l) => sum + l.estimatedValueBrl, 0);
}
