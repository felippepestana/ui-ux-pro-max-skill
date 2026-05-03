import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { getMatterById, MATTERS, type MatterStatus } from "@/lib/matters";

export const mattersRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          status: z
            .enum([
              "intake",
              "triagem",
              "ativo",
              "aguardando_cliente",
              "audiência",
              "encerrado",
            ])
            .optional(),
          search: z.string().optional(),
          criticalOnly: z.boolean().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      // TODO F6.2: replace with `ctx.db.matter.findMany({ where: { ... } })`
      // honoring `ctx.user.officeId` via RLS.
      return MATTERS.filter((m) => {
        if (input?.status && m.status !== input.status as MatterStatus) {
          return false;
        }
        if (input?.criticalOnly) {
          if (!m.nextDeadline || m.nextDeadline.hoursLeft > 72) return false;
        }
        if (input?.search) {
          const q = input.search.toLowerCase();
          const haystack =
            `${m.code} ${m.client} ${m.counterparty} ${m.responsibleName}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const matter = getMatterById(input.id);
      if (!matter) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Caso não encontrado" });
      }
      return matter;
    }),

  count: protectedProcedure.query(() => {
    // TODO F6.2: db.matter.count({ where: { officeId: ctx.user.officeId } })
    return MATTERS.length;
  }),
});
