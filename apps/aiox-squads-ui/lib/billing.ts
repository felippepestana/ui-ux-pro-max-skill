/**
 * Mock dataset of FeeContracts + Invoices + Payments for the v1 UI demo.
 * Real persistence + Brazilian tax/NF integration land in Phase F7/F9.
 */

export type FeeKind = "fixo" | "exito" | "hora" | "mensal";

export type FeeContract = {
  id: string;
  matterId?: string;
  matterCode?: string;
  clientId: string;
  clientName: string;
  kind: FeeKind;
  description: string;
  fixedFeeBrl?: number;
  successFeePercent?: number;
  hourlyRateBrl?: number;
  monthlyRetainerBrl?: number;
  signedAt: string;
  status: "ativo" | "encerrado";
};

export type InvoiceStatus = "aberta" | "enviada" | "paga" | "vencida" | "cancelada";

export type Invoice = {
  id: string;
  number: string;
  contractId?: string;
  clientId: string;
  clientName: string;
  matterCode?: string;
  competenceMonth: string; // YYYY-MM
  issuedAt: string;
  dueAt: string;
  totalBrl: number;
  status: InvoiceStatus;
  lines: { description: string; qty: number; unitBrl: number }[];
};

export type Payment = {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  paidAt: string;
  amountBrl: number;
  method: "PIX" | "TED" | "Boleto" | "Cartão";
};

export const FEE_KIND_LABEL: Record<FeeKind, string> = {
  fixo: "Honorário fixo",
  exito: "Êxito (sucumbencial)",
  hora: "Por hora",
  mensal: "Mensalidade",
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  aberta: "Aberta",
  enviada: "Enviada",
  paga: "Paga",
  vencida: "Vencida",
  cancelada: "Cancelada",
};

export const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "info" | "success" | "destructive" | "outline"
> = {
  aberta: "default",
  enviada: "info",
  paga: "success",
  vencida: "destructive",
  cancelada: "outline",
};

export const FEE_CONTRACTS: FeeContract[] = [
  {
    id: "fee-001",
    matterId: "mat-482",
    matterCode: "2025/482",
    clientId: "cli-001",
    clientName: "Pedro Souza",
    kind: "exito",
    description: "20% sobre valor recebido (dano material + moral).",
    successFeePercent: 20,
    signedAt: "2025-02-15",
    status: "ativo",
  },
  {
    id: "fee-002",
    matterId: "mat-479",
    matterCode: "2025/479",
    clientId: "cli-002",
    clientName: "Ana Silva",
    kind: "exito",
    description: "10% sobre verbas rescisórias + R$ 4.500 fixo na entrada.",
    successFeePercent: 10,
    fixedFeeBrl: 4_500,
    signedAt: "2025-02-08",
    status: "ativo",
  },
  {
    id: "fee-003",
    matterId: "mat-471",
    matterCode: "2025/471",
    clientId: "cli-003",
    clientName: "Acme Holdings",
    kind: "fixo",
    description: "R$ 80.000 fixo + 1,5% sobre o valor da operação no fechamento.",
    fixedFeeBrl: 80_000,
    successFeePercent: 1.5,
    signedAt: "2025-02-03",
    status: "ativo",
  },
  {
    id: "fee-004",
    clientId: "cli-005",
    clientName: "Inova Tech S.A.",
    kind: "mensal",
    description: "Assessoria mensal trabalhista — 15h incluídas, R$ 12.000/mês.",
    monthlyRetainerBrl: 12_000,
    hourlyRateBrl: 600,
    signedAt: "2025-01-15",
    status: "ativo",
  },
  {
    id: "fee-005",
    matterId: "mat-465",
    matterCode: "2025/465",
    clientId: "cli-004",
    clientName: "Restaurante Bom Sabor ME",
    kind: "fixo",
    description: "R$ 5.000 fixo (parcelado em 4x).",
    fixedFeeBrl: 5_000,
    signedAt: "2025-01-22",
    status: "ativo",
  },
  {
    id: "fee-006",
    matterId: "mat-454",
    matterCode: "2025/454",
    clientId: "cli-006",
    clientName: "Família Oliveira",
    kind: "exito",
    description: "10% sobre quinhão hereditário transferido.",
    successFeePercent: 10,
    signedAt: "2025-01-09",
    status: "ativo",
  },
  {
    id: "fee-007",
    matterId: "mat-441",
    matterCode: "2025/441",
    clientId: "cli-007",
    clientName: "Comércio União Ltda.",
    kind: "fixo",
    description: "R$ 15.500 fixo (encerrado).",
    fixedFeeBrl: 15_500,
    signedAt: "2024-11-18",
    status: "encerrado",
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "inv-101",
    number: "2026/0042",
    contractId: "fee-003",
    clientId: "cli-003",
    clientName: "Acme Holdings",
    matterCode: "2025/471",
    competenceMonth: "2026-04",
    issuedAt: "2026-04-05",
    dueAt: "2026-05-05",
    totalBrl: 90_000,
    status: "enviada",
    lines: [
      { description: "Honorários fixos — abril/2026", qty: 1, unitBrl: 80_000 },
      { description: "Despesas reembolsáveis (DD)", qty: 1, unitBrl: 10_000 },
    ],
  },
  {
    id: "inv-102",
    number: "2026/0041",
    contractId: "fee-004",
    clientId: "cli-005",
    clientName: "Inova Tech S.A.",
    matterCode: "2025/460",
    competenceMonth: "2026-04",
    issuedAt: "2026-04-01",
    dueAt: "2026-04-15",
    totalBrl: 12_000,
    status: "paga",
    lines: [
      { description: "Mensalidade trabalhista — abril/2026", qty: 1, unitBrl: 12_000 },
    ],
  },
  {
    id: "inv-103",
    number: "2026/0038",
    contractId: "fee-002",
    clientId: "cli-002",
    clientName: "Ana Silva",
    matterCode: "2025/479",
    competenceMonth: "2026-03",
    issuedAt: "2026-03-15",
    dueAt: "2026-04-15",
    totalBrl: 4_500,
    status: "vencida",
    lines: [
      { description: "Honorário fixo de entrada", qty: 1, unitBrl: 4_500 },
    ],
  },
  {
    id: "inv-104",
    number: "2026/0036",
    contractId: "fee-005",
    clientId: "cli-004",
    clientName: "Restaurante Bom Sabor ME",
    matterCode: "2025/465",
    competenceMonth: "2026-03",
    issuedAt: "2026-03-10",
    dueAt: "2026-04-10",
    totalBrl: 1_250,
    status: "paga",
    lines: [
      { description: "Parcela 3/4 — honorário fixo", qty: 1, unitBrl: 1_250 },
    ],
  },
  {
    id: "inv-105",
    number: "2026/0035",
    contractId: "fee-006",
    clientId: "cli-006",
    clientName: "Família Oliveira",
    matterCode: "2025/454",
    competenceMonth: "2026-03",
    issuedAt: "2026-03-08",
    dueAt: "2026-04-08",
    totalBrl: 8_000,
    status: "vencida",
    lines: [
      { description: "Honorário sobre transferência inicial", qty: 1, unitBrl: 8_000 },
    ],
  },
  {
    id: "inv-106",
    number: "2026/0030",
    contractId: "fee-001",
    clientId: "cli-001",
    clientName: "Pedro Souza",
    matterCode: "2025/482",
    competenceMonth: "2026-02",
    issuedAt: "2026-02-20",
    dueAt: "2026-03-20",
    totalBrl: 7_000,
    status: "paga",
    lines: [
      { description: "Honorários iniciais", qty: 1, unitBrl: 7_000 },
    ],
  },
];

export const PAYMENTS: Payment[] = [
  {
    id: "pay-201",
    invoiceId: "inv-102",
    invoiceNumber: "2026/0041",
    clientName: "Inova Tech S.A.",
    paidAt: "2026-04-12",
    amountBrl: 12_000,
    method: "PIX",
  },
  {
    id: "pay-202",
    invoiceId: "inv-104",
    invoiceNumber: "2026/0036",
    clientName: "Restaurante Bom Sabor ME",
    paidAt: "2026-04-08",
    amountBrl: 1_250,
    method: "Boleto",
  },
  {
    id: "pay-203",
    invoiceId: "inv-106",
    invoiceNumber: "2026/0030",
    clientName: "Pedro Souza",
    paidAt: "2026-03-15",
    amountBrl: 7_000,
    method: "PIX",
  },
];

export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export const BRL_DETAILED = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
