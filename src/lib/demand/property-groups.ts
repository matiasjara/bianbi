import type { CampaignPackProperty } from "./types";
import { propertyHasParking } from "@/lib/i18n/stay-labels";

export type StayUnit = {
  slug: string;
  name: string;
  airbnbUrl: string;
  photo: string;
  photos: string[];
  rating?: number;
  reviewCount?: number;
};

export type PropertyStayGroup = {
  key: string;
  buildingName?: string;
  neighborhood: string;
  address: string;
  walkingMinutes: number;
  distanceKm: number;
  lat: number;
  lng: number;
  photo: string;
  /** Galería del edificio (une fotos de todas las unidades). */
  photos: string[];
  units: StayUnit[];
  hasParking: boolean;
  /** Bullets concretos de ubicación (p. ej. catálogo /santiago) */
  locationHighlights?: string[];
};

/** Agrupa deptos por ubicación (misma lat/lng ≈ mismo edificio). El orden global se mantiene. */
export function groupPropertiesByLocation(
  props: CampaignPackProperty[],
): PropertyStayGroup[] {
  const groups: PropertyStayGroup[] = [];
  const indexByKey = new Map<string, number>();

  for (const p of props) {
    const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
    const unitPhotos = p.photos.length ? p.photos : [p.photo].filter(Boolean);
    const unit: StayUnit = {
      slug: p.slug,
      name: p.name,
      airbnbUrl: p.airbnbUrl,
      photo: p.photo,
      photos: unitPhotos,
      rating: p.rating,
      reviewCount: p.reviewCount,
    };

    const idx = indexByKey.get(key);
    if (idx != null) {
      groups[idx].units.push(unit);
      groups[idx].photos.push(...unitPhotos);
      if (propertyHasParking(p.amenities)) {
        groups[idx].hasParking = true;
      }
      continue;
    }

    indexByKey.set(key, groups.length);
    groups.push({
      key,
      buildingName: p.buildingName,
      neighborhood: p.neighborhood,
      address: p.address,
      walkingMinutes: p.walkingMinutes,
      distanceKm: p.distanceKm,
      lat: p.lat,
      lng: p.lng,
      photo: p.photo,
      photos: [...unitPhotos],
      units: [unit],
      hasParking: propertyHasParking(p.amenities),
      locationHighlights: p.locationHighlights,
    });
  }

  return groups;
}

/** Un marcador por edificio (evita pins duplicados en el mapa). */
export function uniquePropertyLocations<T extends { lat: number; lng: number }>(
  props: T[],
): T[] {
  const seen = new Set<string>();
  return props.filter((p) => {
    const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
