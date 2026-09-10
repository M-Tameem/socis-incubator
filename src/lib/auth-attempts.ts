import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/** Persistent, atomic limits also work across separate serverless instances. */
export async function allowAuthAttempt(operation: "signup" | "recovery", email: string) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return false;
  const requestHeaders = await headers();
  // Vercel overwrites this header. Other hosts use a shared bucket until configured.
  const ip = process.env.VERCEL === "1"
    ? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    : "shared";
  const admin = createAdminClient();
  for (const [scope, value, limit] of [["ip", ip, 200], ["email", email, 5]] as const) {
    const bucket = createHmac("sha256", secret).update(`${operation}:${scope}:${value}`).digest("hex");
    const { data, error } = await admin.rpc("consume_auth_attempt", {
      bucket_key: bucket, attempt_limit: limit, window_seconds: 3600,
    });
    if (error || !data) return false;
  }
  return true;
}
