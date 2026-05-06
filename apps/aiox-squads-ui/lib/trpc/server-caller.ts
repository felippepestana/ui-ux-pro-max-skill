import "server-only";
import { cache } from "react";
import { appRouter } from "@/lib/trpc/routers/_app";
import { createContext } from "@/lib/trpc/context";

/**
 * Server-side tRPC caller for Server Components and Route Handlers.
 *
 * Usage:
 *   const trpc = await createServerCaller();
 *   const matter = await trpc.matters.byId({ id });
 *
 * The context is cached per-request via React.cache so we avoid hitting
 * `getCurrentUser()` (and the cookie store) multiple times in the same
 * render. Once F6.3 finishes, every Server Component should fetch through
 * this caller instead of importing the mocks directly.
 */
const getContext = cache(createContext);

export async function createServerCaller() {
  const ctx = await getContext();
  return appRouter.createCaller(ctx);
}
