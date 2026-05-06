import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { DEADLINES, isCritical, type DeadlineStatus } from "@/lib/deadlines";

const statusEnum = z.enum(["agendado", "em_andamento", "cumprido", "perdido"]);

export const deadlinesRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          status: statusEnum.optional(),
          criticalOnly: z.boolean().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      // TODO F6.4: ctx.db.deadline.findMany({ where: ... })
      return DEADLINES.filter((d) => {
        if (input?.status && d.status !== (input.status as DeadlineStatus)) {
          return false;
        }
        if (input?.criticalOnly && !isCritical(d)) return false;
        if (input?.search) {
          const q = input.search.toLowerCase();
          const haystack =
            `${d.title} ${d.matterCode} ${d.matterClient} ${d.court} ${d.responsibleName}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    }),

  byMatter: protectedProcedure
    .input(z.object({ matterId: z.string() }))
    .query(({ input }) => DEADLINES.filter((d) => d.matterId === input.matterId)),
});
