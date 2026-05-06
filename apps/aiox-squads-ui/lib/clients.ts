/**
 * Mock dataset of Clients (PF/PJ) for the v1 UI demo.
 * Each client links back to the matters listed in lib/matters.ts and the
 * leads converted from lib/leads.ts.
 */

export type ClientKind = "PF" | "PJ";

export type ClientConflictStatus = "limpo" | "verificar" | "conflito";

export type Client = {
  id: string;
  kind: ClientKind;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  conflictStatus: ClientConflictStatus;
  matterIds: string[];
  totalBilledBrl: number;
  outstandingBrl: number;
  notes?: string;
  createdAt: string;
};

export const CLIENTS: Client[] = [
  {
    id: "cli-001",
    kind: "PF",
    name: "Pedro Souza",
    taxId: "123.456.789-00",
    email: "pedro.souza@email.com",
    phone: "+55 11 98765-4321",
    address: "Rua das Flores, 120 — São Paulo/SP",
    tags: ["consumidor", "indicação"],
    conflictStatus: "limpo",
    matterIds: ["mat-482"],
    totalBilledBrl: 7_000,
    outstandingBrl: 0,
    notes: "Indicado pelo cliente Souza & Cia.",
    createdAt: "2025-02-14",
  },
  {
    id: "cli-002",
    kind: "PF",
    name: "Ana Silva",
    taxId: "987.654.321-00",
    email: "ana.silva@email.com",
    phone: "+55 11 91234-5678",
    address: "Av. Paulista, 2000, ap 1402 — São Paulo/SP",
    tags: ["trabalhista"],
    conflictStatus: "limpo",
    matterIds: ["mat-479"],
    totalBilledBrl: 14_500,
    outstandingBrl: 4_500,
    createdAt: "2025-02-08",
  },
  {
    id: "cli-003",
    kind: "PJ",
    name: "Acme Holdings",
    taxId: "12.345.678/0001-90",
    email: "juridico@acme.com.br",
    phone: "+55 11 3000-1000",
    address: "Av. Faria Lima, 4500 — São Paulo/SP",
    tags: ["m&a", "key-account"],
    conflictStatus: "verificar",
    matterIds: ["mat-471"],
    totalBilledBrl: 280_000,
    outstandingBrl: 90_000,
    notes:
      "Cliente em processo de aquisição da TargetCo. Verificar conflito com fornecedores em comum.",
    createdAt: "2025-02-01",
  },
  {
    id: "cli-004",
    kind: "PJ",
    name: "Restaurante Bom Sabor ME",
    taxId: "23.456.789/0001-01",
    email: "fiscal@bomsabor.com.br",
    phone: "+55 19 3322-4455",
    address: "R. das Pedras, 88 — Campinas/SP",
    tags: ["tributário", "pequeno-porte"],
    conflictStatus: "limpo",
    matterIds: ["mat-465"],
    totalBilledBrl: 3_800,
    outstandingBrl: 1_200,
    createdAt: "2025-01-22",
  },
  {
    id: "cli-005",
    kind: "PJ",
    name: "Inova Tech S.A.",
    taxId: "34.567.890/0001-12",
    email: "rh.juridico@inovatech.com",
    phone: "+55 11 4002-8922",
    address: "R. Tecnologia, 100 — São Paulo/SP",
    tags: ["trabalhista", "tecnologia"],
    conflictStatus: "limpo",
    matterIds: ["mat-460"],
    totalBilledBrl: 22_000,
    outstandingBrl: 0,
    createdAt: "2025-01-15",
  },
  {
    id: "cli-006",
    kind: "PF",
    name: "Família Oliveira",
    taxId: "456.789.012-34",
    email: "contato.oliveira@gmail.com",
    phone: "+55 11 99887-6655",
    address: "R. dos Cravos, 250 — São Paulo/SP",
    tags: ["sucessões", "família"],
    conflictStatus: "limpo",
    matterIds: ["mat-454"],
    totalBilledBrl: 32_000,
    outstandingBrl: 8_000,
    createdAt: "2025-01-09",
  },
  {
    id: "cli-007",
    kind: "PJ",
    name: "Comércio União Ltda.",
    taxId: "45.678.901/0001-23",
    email: "contato@uniao.com.br",
    phone: "+55 11 2233-4455",
    address: "Av. das Indústrias, 700 — São Bernardo do Campo/SP",
    tags: ["empresarial", "encerrado"],
    conflictStatus: "limpo",
    matterIds: ["mat-441"],
    totalBilledBrl: 15_500,
    outstandingBrl: 0,
    createdAt: "2024-11-18",
  },
];

export function getClientById(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getClientByMatterId(matterId: string): Client | undefined {
  return CLIENTS.find((c) => c.matterIds.includes(matterId));
}
