/** Calendar-date boundaries in Guelph, including the full closing day. */
export function getApplicationStatus(
  settings: { applications_open?: string; applications_close?: string },
  now = new Date(),
): "upcoming" | "open" | "closed" {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  const start = settings.applications_open;
  const end = settings.applications_close;
  if ((start && !/^\d{4}-\d{2}-\d{2}$/.test(start)) || (end && !/^\d{4}-\d{2}-\d{2}$/.test(end))) return "closed";
  if (end && today > end) return "closed";
  if (start && today < start) return "upcoming";
  return "open";
}
