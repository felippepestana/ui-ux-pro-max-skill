import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc/server";
import {
  FEE_CONTRACTS,
  INVOICES,
  PAYMENTS,
  type InvoiceStatus,
} from "@/lib/billing";

const invoiceStatusEnum = z.enum([
  "aberta",
  "enviada",
  "paga",
  "vencida",
  "cancelada",
]);

export const billingRouter = router({
  invoices: protectedProcedure
    .input(z.object({ status: invoiceStatusEnum.optional() }).optional())
    .query(({ input }) => {
      // TODO F6.4: ctx.db.invoice.findMany({ where: { officeId, status } })
      if (!input?.status) return INVOICES;
      return INVOICES.filter((i) => i.status === (input.status as InvoiceStatus));
    }),

  contracts: protectedProcedure.query(() => FEE_CONTRACTS),

  payments: protectedProcedure.query(() => PAYMENTS),

  kpis: protectedProcedure.query(() => {
    const billedThisMonth = INVOICES.filter((i) =>
      i.competenceMonth.startsWith("2026-04"),
    ).reduce((s, i) => s + i.totalBrl, 0);
    const receivedThisMonth = PAYMENTS.filter((p) =>
      p.paidAt.startsWith("2026-04"),
    ).reduce((s, p) => s + p.amountBrl, 0);
    const overdue = INVOICES.filter((i) => i.status === "vencida");
    const overdueTotal = overdue.reduce((s, i) => s + i.totalBrl, 0);
    return {
      billedThisMonth,
      receivedThisMonth,
      overdueTotal,
      overdueCount: overdue.length,
      activeContracts: FEE_CONTRACTS.filter((c) => c.status === "ativo").length,
      totalContracts: FEE_CONTRACTS.length,
      invoicesThisMonth: INVOICES.filter((i) =>
        i.competenceMonth.startsWith("2026-04"),
      ).length,
      paymentsThisMonth: PAYMENTS.filter((p) =>
        p.paidAt.startsWith("2026-04"),
      ).length,
    };
  }),
});
