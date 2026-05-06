/**
 * Mock dataset of Knowledge Base entries for the v1 UI demo.
 * Three flavors: jurisprudence (court decisions), models (precedents to
 * reuse), súmulas (binding tribunal statements). Real semantic search
 * lands in v1.5; for now the page does substring search.
 */

export type KnowledgeKind = "jurisprudencia" | "modelo" | "sumula" | "doutrina";

export type KnowledgeArea =
  | "Cível"
  | "Trabalhista"
  | "Empresarial"
  | "Tributário"
  | "Consumidor"
  | "Família"
  | "Administrativo"
  | "Penal";

export type KnowledgeEntry = {
  id: string;
  kind: KnowledgeKind;
  area: KnowledgeArea;
  topic: string;
  title: string;
  source: string;
  date?: string;
  rapporteur?: string;
  excerpt: string;
  tags: string[];
  citations: number;
  url?: string;
};

export const KIND_LABEL: Record<KnowledgeKind, string> = {
  jurisprudencia: "Jurisprudência",
  modelo: "Modelo",
  sumula: "Súmula",
  doutrina: "Doutrina",
};

export const KIND_VARIANT: Record<
  KnowledgeKind,
  "info" | "default" | "accent" | "outline"
> = {
  jurisprudencia: "info",
  modelo: "default",
  sumula: "accent",
  doutrina: "outline",
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "kb-001",
    kind: "jurisprudencia",
    area: "Consumidor",
    topic: "Cobrança vexatória",
    title: "REsp 2.014.391/SP — Repetição em dobro do indébito",
    source: "STJ — 4ª Turma",
    date: "2024-08-12",
    rapporteur: "Min. Raul Araújo",
    excerpt:
      "A repetição em dobro do indébito (CDC art. 42, p. único) independe de prova de má-fé do credor; basta que a cobrança seja indevida.",
    tags: ["cdc", "art-42", "dano-material"],
    citations: 47,
    url: "#mock",
  },
  {
    id: "kb-002",
    kind: "jurisprudencia",
    area: "Consumidor",
    topic: "Dano moral",
    title: "REsp 1.785.004/SP — Dano moral por inscrição indevida",
    source: "STJ — 3ª Turma",
    date: "2023-11-22",
    rapporteur: "Min. Nancy Andrighi",
    excerpt:
      "Inscrição indevida em cadastro de inadimplentes gera dano moral in re ipsa, dispensando prova do prejuízo concreto.",
    tags: ["dano-moral", "in-re-ipsa", "spc-serasa"],
    citations: 89,
    url: "#mock",
  },
  {
    id: "kb-003",
    kind: "sumula",
    area: "Consumidor",
    topic: "Inscrição indevida",
    title: "Súmula 385 STJ",
    source: "STJ",
    date: "2009-05-26",
    excerpt:
      "Da anotação irregular em cadastro de proteção ao crédito, não cabe indenização por dano moral, quando preexistente legítima inscrição, ressalvado o direito ao cancelamento.",
    tags: ["sumula", "cadastro-credito"],
    citations: 312,
    url: "#mock",
  },
  {
    id: "kb-004",
    kind: "jurisprudencia",
    area: "Trabalhista",
    topic: "Vínculo empregatício",
    title: "RR 0001234-56.2022.5.02.0001 — Reconhecimento de vínculo",
    source: "TST — 6ª Turma",
    date: "2024-03-08",
    rapporteur: "Min. Augusto César",
    excerpt:
      "Pejotização configura fraude quando presentes os requisitos do art. 3º da CLT, ainda que mascarada por contrato de prestação de serviços.",
    tags: ["pejotização", "art-3-clt"],
    citations: 56,
    url: "#mock",
  },
  {
    id: "kb-005",
    kind: "sumula",
    area: "Trabalhista",
    topic: "Horas extras",
    title: "Súmula 437 TST",
    source: "TST",
    date: "2012-09-27",
    excerpt:
      "Após a edição da Lei n. 11.901/2009, o tempo despendido no deslocamento até o local de trabalho integra a jornada se prestado em local de difícil acesso ou não servido por transporte público regular.",
    tags: ["sumula", "jornada", "horas-extras"],
    citations: 178,
    url: "#mock",
  },
  {
    id: "kb-006",
    kind: "modelo",
    area: "Empresarial",
    topic: "M&A",
    title: "Cláusula MAC — Material Adverse Change",
    source: "Acervo do escritório",
    excerpt:
      "Modelo de cláusula MAC com gatilhos quantitativos (queda EBITDA > 20%) e qualitativos (perda de cliente-âncora), aprovada em 4 operações.",
    tags: ["m&a", "msa", "mac-clause"],
    citations: 4,
  },
  {
    id: "kb-007",
    kind: "modelo",
    area: "Empresarial",
    topic: "M&A",
    title: "Cláusula de não-concorrência (5 anos, raio nacional)",
    source: "Acervo do escritório",
    excerpt:
      "Não-concorrência limitada a 5 anos e ao território nacional, com penalidade líquida e exceções para investidores passivos.",
    tags: ["m&a", "não-concorrência", "noncompete"],
    citations: 11,
  },
  {
    id: "kb-008",
    kind: "doutrina",
    area: "Cível",
    topic: "Tutela provisória",
    title: "Theodoro Júnior — Curso de Direito Processual Civil v.1, cap. 25",
    source: "Doutrina",
    date: "2024-01-01",
    excerpt:
      "Discussão sobre os pressupostos da tutela de urgência em comparação com a tutela da evidência (CPC art. 311).",
    tags: ["doutrina", "tutela-urgencia", "cpc"],
    citations: 22,
  },
  {
    id: "kb-009",
    kind: "jurisprudencia",
    area: "Tributário",
    topic: "Execução fiscal",
    title: "REsp 1.892.469/SP — Prescrição intercorrente",
    source: "STJ — 1ª Seção",
    date: "2023-06-14",
    rapporteur: "Min. Mauro Campbell",
    excerpt:
      "Verificada a inércia do exequente por mais de 5 anos sem causa justificada, opera-se a prescrição intercorrente (Lei 6.830/80, art. 40).",
    tags: ["execução-fiscal", "prescrição-intercorrente", "art-40-lef"],
    citations: 34,
    url: "#mock",
  },
  {
    id: "kb-010",
    kind: "jurisprudencia",
    area: "Família",
    topic: "Inventário",
    title: "REsp 2.103.554/MG — Inventário extrajudicial com menor",
    source: "STJ — 3ª Turma",
    date: "2024-09-19",
    rapporteur: "Min. Moura Ribeiro",
    excerpt:
      "Admissibilidade de inventário extrajudicial com herdeiro incapaz desde que não haja conflito e mediante atuação do MP.",
    tags: ["inventário", "extrajudicial", "incapaz"],
    citations: 18,
    url: "#mock",
  },
];

export function getKnowledgeAreas(): KnowledgeArea[] {
  const set = new Set<KnowledgeArea>();
  for (const k of KNOWLEDGE) set.add(k.area);
  return Array.from(set).sort();
}

export function getKnowledgeTopicsForArea(
  area: KnowledgeArea,
): { topic: string; count: number }[] {
  const map = new Map<string, number>();
  for (const k of KNOWLEDGE) {
    if (k.area !== area) continue;
    map.set(k.topic, (map.get(k.topic) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}
