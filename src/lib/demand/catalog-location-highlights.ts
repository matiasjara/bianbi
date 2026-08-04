import { getPoi } from "@/lib/data/seed";
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

function metroName(station: string): string {
  return station.startsWith("Metro ") ? station : `Metro ${station}`;
}

/**
 * Bullets de ubicación para /santiago (sin evento de referencia).
 * Solo nombres: metro + puntos conocidos.
 */
export function buildCatalogLocationHighlights(
  prop: Pick<Property, "metroStations" | "nearbyPoiIds">,
  _locale: Locale,
): string[] {
  const highlights: string[] = [];

  for (const station of prop.metroStations.slice(0, 2)) {
    highlights.push(metroName(station));
  }

  const seen = new Set<string>();
  for (const id of CATALOG_POI_ORDER) {
    if (!prop.nearbyPoiIds.includes(id) || seen.has(id)) continue;
    seen.add(id);
    const poi = getPoi(id);
    if (!poi) continue;
    highlights.push(poi.name);
    if (highlights.length >= 4) break;
  }

  return highlights.slice(0, 4);
}
