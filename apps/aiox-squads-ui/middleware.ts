import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Root middleware. Runs on every authenticated route to refresh the
 * Supabase session. In stub mode (no env vars) it short-circuits and
 * forwards the request untouched.
 */
export async function middleware(req: NextRequest) {
  return updateSession(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon, public assets
     * - /api/trpc (tRPC handles its own context via createContext)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
