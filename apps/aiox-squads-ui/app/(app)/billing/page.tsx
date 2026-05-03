"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  FileText,
  Plus,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BRL,
  BRL_DETAILED,
  FEE_CONTRACTS,
  FEE_KIND_LABEL,
  INVOICES,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_VARIANT,
  PAYMENTS,
  type FeeContract,
  type Invoice,
  type Payment,
} from "@/lib/billing";

export default function BillingPage() {
  const billedThisMonth = INVOICES.filter((i) =>
    i.competenceMonth.startsWith("2026-04"),
  ).reduce((s, i) => s + i.totalBrl, 0);
  const receivedThisMonth = PAYMENTS.filter((p) =>
    p.paidAt.startsWith("2026-04"),
  ).reduce((s, p) => s + p.amountBrl, 0);
  const overdue = INVOICES.filter((i) => i.status === "vencida");
  const overdueTotal = overdue.reduce((s, i) => s + i.totalBrl, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Negócio · Faturamento
          </p>
          <h1 className="mt-1 font-serif text-4xl">Faturamento</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
            Contratos de honorários, faturas, recebimentos e relatórios.
            Conciliação bancária + emissão de NF chegam em pós-v1.5.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <FileText aria-hidden /> Novo contrato
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Nova fatura
          </Button>
        </div>
      </header>

      <section
        aria-label="KPIs financeiros"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Faturado abr/2026"
          value={BRL.format(billedThisMonth)}
          hint={`${INVOICES.filter((i) => i.competenceMonth.startsWith("2026-04")).length} faturas emitidas`}
          tone="primary"
          icon={<Receipt className="h-4 w-4" />}
        />
        <KpiCard
          label="Recebido abr/2026"
          value={BRL.format(receivedThisMonth)}
          hint={`${PAYMENTS.filter((p) => p.paidAt.startsWith("2026-04")).length} pagamentos`}
          tone="success"
          icon={<Wallet className="h-4 w-4" />}
        />
        <KpiCard
          label="Em aberto vencido"
          value={BRL.format(overdueTotal)}
          hint={`${overdue.length} faturas vencidas`}
          tone={overdueTotal > 0 ? "destructive" : "default"}
          icon={<AlertCircle className="h-4 w-4" />}
        />
        <KpiCard
          label="Contratos ativos"
          value={String(FEE_CONTRACTS.filter((c) => c.status === "ativo").length)}
          hint={`${FEE_CONTRACTS.length} no total`}
          tone="accent"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </section>

      <Tabs defaultValue="invoices" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="payments">Recebimentos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-0">
          <InvoicesTable invoices={INVOICES} />
        </TabsContent>
        <TabsContent value="contracts" className="mt-0">
          <ContractsTable contracts={FEE_CONTRACTS} />
        </TabsContent>
        <TabsContent value="payments" className="mt-0">
          <PaymentsTable payments={PAYMENTS} />
        </TabsContent>
        <TabsContent value="reports" className="mt-0">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="font-serif text-lg">Relatórios financeiros</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Dashboards por cliente, área e período chegam na F7 final
                (com export CSV).
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  tone,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "success" | "destructive" | "accent" | "default";
  icon: React.ReactNode;
}) {
  const toneBg = {
    primary: "bg-[var(--surface-primary)] text-[var(--primary)]",
    success: "bg-[var(--surface-success)] text-[var(--success)]",
    destructive: "bg-[var(--surface-destructive)] text-[var(--destructive)]",
    accent: "bg-[var(--surface-accent)] text-[var(--accent)]",
    default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  }[tone];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
        <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${toneBg}`}
          aria-hidden
        >
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-2xl font-semibold">{value}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>
      </CardContent>
    </Card>
  );
}

function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nº</th>
              <th className="px-4 py-3 text-left font-semibold">Cliente · Caso</th>
              <th className="px-4 py-3 text-left font-semibold">Competência</th>
              <th className="px-4 py-3 text-left font-semibold">Vencimento</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr
                key={i.id}
                className="border-t border-[var(--border)] hover:bg-[var(--muted)]/40"
              >
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--primary)]">
                  {i.number}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{i.clientName}</p>
                  {i.matterCode && (
                    <p className="font-mono text-[10px] text-[var(--muted-foreground)]">
                      {i.matterCode}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {new Date(i.competenceMonth + "-01").toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-xs">
                  {new Date(i.dueAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {BRL_DETAILED.format(i.totalBrl)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={INVOICE_STATUS_VARIANT[i.status]}>
                    {INVOICE_STATUS_LABEL[i.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm">
                    <ArrowDownToLine aria-hidden /> PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ContractsTable({ contracts }: { contracts: FeeContract[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {contracts.map((c) => (
        <li key={c.id}>
          <Card className="h-full">
            <CardContent className="flex h-full flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <Badge variant={c.status === "ativo" ? "success" : "outline"}>
                  {c.status}
                </Badge>
                <Badge variant="default" className="text-[10px]">
                  {FEE_KIND_LABEL[c.kind]}
                </Badge>
              </div>
              <p className="font-serif text-base font-semibold">{c.clientName}</p>
              {c.matterCode && (
                <p className="font-mono text-[10px] text-[var(--primary)]">
                  {c.matterCode}
                </p>
              )}
              <p className="text-sm text-[var(--muted-foreground)]">
                {c.description}
              </p>
              <p className="mt-auto text-[10px] text-[var(--muted-foreground)]">
                Assinado em {new Date(c.signedAt).toLocaleDateString("pt-BR")}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function PaymentsTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="font-serif text-lg text-[var(--muted-foreground)]">
            Nenhum recebimento registrado.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Data</th>
              <th className="px-4 py-3 text-left font-semibold">Fatura</th>
              <th className="px-4 py-3 text-left font-semibold">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold">Método</th>
              <th className="px-4 py-3 text-right font-semibold">Valor</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-t border-[var(--border)] hover:bg-[var(--muted)]/40"
              >
                <td className="px-4 py-3 text-xs">
                  {new Date(p.paidAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--primary)]">
                  {p.invoiceNumber}
                </td>
                <td className="px-4 py-3">{p.clientName}</td>
                <td className="px-4 py-3 text-xs">
                  <Badge variant="outline">{p.method}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className="inline-flex items-center gap-1 text-[var(--success)]">
                    <CheckCircle2 className="h-3 w-3" aria-hidden />
                    {BRL_DETAILED.format(p.amountBrl)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
