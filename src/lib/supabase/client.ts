import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";
import { getSupabaseConnection } from "@/lib/supabase/config";

export function createClient() {
  const { url, key, clientOptions } = getSupabaseConnection();
  return createBrowserClient<Database>(url, key, clientOptions);
}
