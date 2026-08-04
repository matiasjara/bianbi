/**
 * Identidad de shows/conciertos: agrupa Ticketmaster + Tocador del mismo
 * artista aunque el título o el día exacto varíen levemente.
 */
import { weekendFriday } from "./hockey-group";
import type { DemandSignal } from "./types";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Headliner corto (antes de tour / subtítulo). */
export function showIdentity(title: string): string {
  // "Iron Maiden - Run For Your Lives…" → "Iron Maiden"
  const head = title.split(/\s*[-–—:|]\s*/)[0] ?? title;
  let t = normalize(head)
    .replace(/\b20\d{2}\b/g, " ")
    .replace(
      /\b(world tour|tour|live|presents?|presenta|en vivo|in santiago|santiago)\b.*$/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

  const words = t.split(" ").filter(Boolean).slice(0, 3);
  return words.join("-").slice(0, 40) || "show";
}

export function showCampaignGroupKey(signal: DemandSignal): string {
  const artist = showIdentity(signal.title);
  const weekend = weekendFriday(signal.startsOn);
  return `show:${artist}:${weekend}`;
}
