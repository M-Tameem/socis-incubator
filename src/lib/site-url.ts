const PRODUCTION_SITE_URL = "https://socis-incubator.vercel.app";

/** Canonical origin for emailed links; production must never fall back to localhost. */
export function getSiteUrl() {
  const production = process.env.NODE_ENV === "production";
  const fallback = production ? PRODUCTION_SITE_URL : "http://localhost:3000";
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return fallback;

  try {
    const url = new URL(configured);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    const local = hostname === "localhost" || hostname.endsWith(".localhost") ||
      hostname === "[::1]" || hostname === "0.0.0.0" || hostname.startsWith("127.");
    if (url.username || url.password || !["http:", "https:"].includes(url.protocol)) return fallback;
    if (production && (local || url.protocol !== "https:")) return fallback;
    return url.origin;
  } catch {
    return fallback;
  }
}
