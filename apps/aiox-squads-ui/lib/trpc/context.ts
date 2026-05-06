import { getCurrentUser, type SessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type Context = {
  user: SessionUser | null;
  db: typeof db;
};

export async function createContext(): Promise<Context> {
  const user = await getCurrentUser();
  return { user, db };
}
