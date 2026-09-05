const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_KEY = "local-development-placeholder";

const unavailableFetch: typeof fetch = async () =>
  new Response(JSON.stringify({ message: "Supabase is not configured for this preview." }), {
    // A 5xx response makes the auth client retry with exponential backoff.
    status: 400,
    headers: { "content-type": "application/json" },
  });

/**
 * Keep the public site responsive before local Supabase credentials are added.
 * Production still fails fast when required configuration is missing entirely.
 */
export function getSupabaseConnection(key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (process.env.NODE_ENV === "production" && (!url || !key)) {
    throw new Error("Missing required Supabase environment variables.");
  }

  const resolvedUrl = url || LOCAL_URL;
  const resolvedKey = key || LOCAL_KEY;
  const configured = resolvedUrl !== LOCAL_URL && resolvedKey !== LOCAL_KEY;

  return {
    url: resolvedUrl,
    key: resolvedKey,
    clientOptions: configured ? {} : { global: { fetch: unavailableFetch } },
  };
}
