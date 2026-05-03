import { router } from "@/lib/trpc/server";
import { mattersRouter } from "@/lib/trpc/routers/matters";
import { leadsRouter } from "@/lib/trpc/routers/leads";
import { clientsRouter } from "@/lib/trpc/routers/clients";
import { squadsRouter } from "@/lib/trpc/routers/squads";
import { auditRouter } from "@/lib/trpc/routers/audit";

export const appRouter = router({
  matters: mattersRouter,
  leads: leadsRouter,
  clients: clientsRouter,
  squads: squadsRouter,
  audit: auditRouter,
});

export type AppRouter = typeof appRouter;
