import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { getSupabaseConnection } from "@/lib/supabase/config";

/**
 * Server-only service-role client. Bypasses RLS. Callers must enforce executive
 * access or the specific signup/recovery checks before using privileged operations.
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
