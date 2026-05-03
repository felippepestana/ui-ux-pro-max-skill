import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { CLIENTS, getClientById } from "@/lib/clients";

export const clientsRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          kind: z.enum(["PF", "PJ"]).optional(),
          conflictStatus: z
            .enum(["limpo", "verificar", "conflito"])
            .optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      return CLIENTS.filter((c) => {
        if (input?.kind && c.kind !== input.kind) return false;
        if (input?.conflictStatus && c.conflictStatus !== input.conflictStatus)
          return false;
        if (input?.search) {
          const q = input.search.toLowerCase();
          if (
            !`${c.name} ${c.taxId} ${c.email} ${c.tags.join(" ")}`
              .toLowerCase()
              .includes(q)
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
      const client = getClientById(input.id);
      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cliente não encontrado" });
      }
      return client;
    }),
});
