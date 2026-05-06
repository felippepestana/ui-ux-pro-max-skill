/**
 * Prisma client singleton.
 *
 * Until DATABASE_URL is configured (see docs/BACKEND.md), `prisma generate`
 * is not run and `@prisma/client` exposes a stub. Importing this module is
 * still safe — the singleton only instantiates lazily when used.
 *
 * In Phase F6.2 the tRPC routers will start calling `db.matter.findMany`
 * etc. directly; until then they delegate to the in-repo mocks.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
