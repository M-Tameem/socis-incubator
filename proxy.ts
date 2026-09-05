import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Runs before every matched request. Refreshes the Supabase session cookie and
 * bounces signed-out visitors away from /dashboard and /admin.
 *
 * Next 16 renamed this file from middleware.ts to proxy.ts.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
