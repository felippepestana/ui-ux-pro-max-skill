import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { getLeadById, LEADS, type LeadStage } from "@/lib/leads";

const stageEnum = z.enum([
  "novo",
  "qualificado",
  "proposta",
  "aceite",
  "perdido",
]);

export const leadsRouter = router({
  list: protectedProcedure
    .input(
      z.object({ stage: stageEnum.optional(), search: z.string().optional() }).optional(),
    )
    .query(({ input }) => {
      return LEADS.filter((l) => {
        if (input?.stage && l.stage !== input.stage) return false;
        if (input?.search) {
          const q = input.search.toLowerCase();
          if (
            !`${l.name} ${l.area} ${l.summary}`.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const lead = getLeadById(input.id);
      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead não encontrado" });
      }
      return lead;
    }),

  move: protectedProcedure
    .input(z.object({ id: z.string(), stage: stageEnum }))
    .mutation(({ input }) => {
      // TODO F6.2: db.lead.update({ where: { id }, data: { stage } }) +
      // create AuditLog entry.
      const lead = getLeadById(input.id);
      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead não encontrado" });
      }
      return { ...lead, stage: input.stage as LeadStage };
    }),
});
