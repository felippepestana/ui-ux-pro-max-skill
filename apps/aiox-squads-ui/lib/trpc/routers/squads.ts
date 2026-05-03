import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/lib/trpc/server";
import {
  ACTIVE_RUNS,
  getSquadById,
  getSquadsForContext,
  SQUADS,
  type SquadContextType,
} from "@/lib/squads";

export const squadsRouter = router({
  list: protectedProcedure.query(() => SQUADS),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const squad = getSquadById(input.id);
      if (!squad) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Squad não encontrado" });
      }
      return squad;
    }),

  forContext: protectedProcedure
    .input(z.object({ contextType: z.enum(["matter", "document", "lead"]) }))
    .query(({ input }) => getSquadsForContext(input.contextType as SquadContextType)),

  activeRuns: protectedProcedure.query(() => ACTIVE_RUNS),

  start: protectedProcedure
    .input(
      z.object({
        squadId: z.string(),
        contextType: z.enum(["matter", "document", "lead"]),
        contextId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // TODO F6.2: enqueue Inngest job + create SquadRun row + return runId.
      return {
        runId: `run-${Date.now()}`,
        squadId: input.squadId,
        contextType: input.contextType,
        contextId: input.contextId,
        status: "queued" as const,
      };
    }),
});
