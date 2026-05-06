import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { TASKS, type TaskPriority, type TaskStatus } from "@/lib/tasks";

const statusEnum = z.enum(["todo", "doing", "review", "done"]);
const priorityEnum = z.enum(["low", "normal", "high", "critical"]);

export const tasksRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          status: statusEnum.optional(),
          priority: priorityEnum.optional(),
          assigneeId: z.string().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      // TODO F6.4: ctx.db.task.findMany({ where: ... })
      return TASKS.filter((t) => {
        if (input?.status && t.status !== input.status) return false;
        if (input?.priority && t.priority !== input.priority) return false;
        if (input?.assigneeId && t.assignee.id !== input.assigneeId) return false;
        if (input?.search) {
          const q = input.search.toLowerCase();
          if (
            !`${t.title} ${t.matterCode} ${t.matterClient} ${t.assignee.name}`
              .toLowerCase()
              .includes(q)
          ) {
            return false;
          }
        }
        return true;
      });
    }),

  move: protectedProcedure
    .input(z.object({ id: z.string(), status: statusEnum }))
    .mutation(({ input }) => {
      const task = TASKS.find((t) => t.id === input.id);
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada" });
      }
      return { ...task, status: input.status as TaskStatus };
    }),

  byMatter: protectedProcedure
    .input(z.object({ matterId: z.string() }))
    .query(({ input }) => {
      return TASKS.filter((t) => t.matterId === input.matterId);
    }),
});

export type { TaskPriority };
