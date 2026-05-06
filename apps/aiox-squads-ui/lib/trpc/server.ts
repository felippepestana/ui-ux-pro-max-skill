import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "@/lib/trpc/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { user: ctx.user, db: ctx.db } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserHasRole = (allowed: ReadonlyArray<string>) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!allowed.includes(ctx.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Requer um dos papéis: ${allowed.join(", ")}`,
      });
    }
    return next({ ctx: { user: ctx.user, db: ctx.db } });
  });

export const partnerProcedure = t.procedure.use(enforceUserHasRole(["socio"]));
export const lawyerProcedure = t.procedure.use(
  enforceUserHasRole(["socio", "advogado"]),
);
export const financialProcedure = t.procedure.use(
  enforceUserHasRole(["socio", "financeiro"]),
);
