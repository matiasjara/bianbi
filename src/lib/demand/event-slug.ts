import { normalizePublicEventTitle } from "./event-title";

export function slugifyEventText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Slug público SEO: título legible + año (sin prefijo interest-intention). */
export function publicEventSlug(title: string, startDate: string, maxLen = 72): string {
  const year = startDate.slice(0, 4);
  const base = slugifyEventText(normalizePublicEventTitle(title));
  const withYear = base.includes(year) ? base : `${base}-${year}`;
  return withYear.slice(0, maxLen).replace(/-$/, "");
}

export function dedupeKeyForEvent(title: string, startDate: string, venueId: string): string {
  const t = slugifyEventText(normalizePublicEventTitle(title));
  return `${startDate}|${venueId || "unknown"}|${t}`;
}
