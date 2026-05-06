import { router } from "@/lib/trpc/server";
import { mattersRouter } from "@/lib/trpc/routers/matters";
import { leadsRouter } from "@/lib/trpc/routers/leads";
import { clientsRouter } from "@/lib/trpc/routers/clients";
import { squadsRouter } from "@/lib/trpc/routers/squads";
import { auditRouter } from "@/lib/trpc/routers/audit";
import { documentsRouter } from "@/lib/trpc/routers/documents";
import { tasksRouter } from "@/lib/trpc/routers/tasks";
import { deadlinesRouter } from "@/lib/trpc/routers/deadlines";
import { billingRouter } from "@/lib/trpc/routers/billing";

export const appRouter = router({
  matters: mattersRouter,
  leads: leadsRouter,
  clients: clientsRouter,
  squads: squadsRouter,
  audit: auditRouter,
  documents: documentsRouter,
  tasks: tasksRouter,
  deadlines: deadlinesRouter,
  billing: billingRouter,
});

export type AppRouter = typeof appRouter;
