import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";
import { getSupabaseConnection } from "@/lib/supabase/config";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key, clientOptions } = getSupabaseConnection();

  return createServerClient<Database>(
    url,
    key,
    {
      ...clientOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component. The middleware refreshes the
            // session, so this can be safely ignored.
          }
        },
      },
    },
  );
}
