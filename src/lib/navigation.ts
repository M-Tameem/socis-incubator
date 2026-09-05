/**
 * Restrict post-auth redirects to paths on this site. URL parsing also catches
 * backslash-based inputs that browsers can otherwise interpret as a new host.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;

  try {
    const base = "https://local.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
