import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc/server";
import {
  AUDIT_EVENTS,
  type AuditActorType,
  type AuditEntityType,
} from "@/lib/audit";

export const auditRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          actorType: z.enum(["human", "squad", "system"]).optional(),
          entityType: z
            .enum([
              "matter",
              "lead",
              "client",
              "document",
              "deadline",
              "task",
              "invoice",
              "squad_run",
              "hitl_task",
              "user",
            ])
            .optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      return AUDIT_EVENTS.filter((e) => {
        if (
          input?.actorType &&
          e.actorType !== (input.actorType as AuditActorType)
        ) {
          return false;
        }
        if (
          input?.entityType &&
          e.entityType !== (input.entityType as AuditEntityType)
        ) {
          return false;
        }
        if (input?.search) {
          const q = input.search.toLowerCase();
          if (
            !`${e.actorName} ${e.entityLabel} ${e.summary}`
              .toLowerCase()
              .includes(q)
          ) {
            return false;
          }
        }
        return true;
      });
    }),
});
