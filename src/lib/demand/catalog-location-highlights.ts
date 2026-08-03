import { getPoi } from "@/lib/data/seed";
import { distanceKm, travelMinutes } from "@/lib/demand/geo";
import type { Property } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";

/** POIs que vale la pena mencionar en el catálogo /santiago (sin evento ancla) */
const CATALOG_POI_ORDER = [
  "poi-italia",
  "poi-estadio",
  "poi-movistar",
  "poi-ohiggins",
  "poi-lastarria",
  "poi-costanera",
  "poi-club-hipico",
] as const;

function reachLabel(locale: Locale, mins: number, place: string): string {
  if (mins <= 6) {
    if (locale === "en") return `${place} — very close`;
    if (locale === "pt") return `${place} — bem perto`;
    return `${place} — muy cerca`;
  }
  if (locale === "en") return `${mins} min to ${place}`;
  if (locale === "pt") return `${mins} min até ${place}`;
  return `${mins} min al ${place}`;
}

function metroLabel(locale: Locale, station: string): string {
  const name = station.startsWith("Metro ") ? station : `Metro ${station}`;
  if (locale === "en") return `${name} — steps away`;
  if (locale === "pt") return `${name} — a poucos passos`;
  return `${name} — a pasos`;
}

/**
 * Bullets de ubicación para /santiago (sin evento de referencia).
 * Metro + distancias explícitas a puntos conocidos de Santiago.
 */
export function buildCatalogLocationHighlights(
  prop: Pick<
    Property,
    "lat" | "lng" | "metroStations" | "nearbyPoiIds" | "amenities"
  >,
  locale: Locale,
): string[] {
  const highlights: string[] = [];

  for (const station of prop.metroStations.slice(0, 2)) {
    highlights.push(metroLabel(locale, station));
  }

  const seen = new Set<string>();
  for (const id of CATALOG_POI_ORDER) {
    if (!prop.nearbyPoiIds.includes(id) || seen.has(id)) continue;
    seen.add(id);
    const poi = getPoi(id);
    if (!poi) continue;
    const km = distanceKm(prop.lat, prop.lng, poi.lat, poi.lng);
    const mins = travelMinutes(km);
    highlights.push(reachLabel(locale, mins, poi.name));
    if (highlights.length >= 4) break;
  }

  return highlights.slice(0, 4);
}
