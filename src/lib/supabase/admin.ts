import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { getSupabaseConnection } from "@/lib/supabase/config";

/**
 * Service-role client. Bypasses RLS, so it is only ever imported by server
 * actions that have already checked the caller is an executive.
 */
export function createAdminClient() {
  const { url, key, clientOptions } = getSupabaseConnection(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  return createClient<Database>(url, key, {
    ...clientOptions,
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
