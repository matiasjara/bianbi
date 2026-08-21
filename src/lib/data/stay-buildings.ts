import { getPoi, properties } from "@/lib/data/seed";
import type { Property, PropertyAudience } from "@/lib/types";

export type StayBuilding = {
  buildingId: string;
  buildingName: string;
  neighborhood: string;
  address: string;
  metroStations: string[];
  nearbyPoiIds: string[];
  audiences: PropertyAudience[];
  lat: number;
  lng: number;
  heroImage: string;
  unitCount: number;
};

const HERO_BY_BUILDING: Record<string, string> = {
  "edificio-italia-irarrazaval": "/guides/barrios/barrio-italia.png",
  "edificio-nunoa-estadio": "/guides/deportes/estadio-nacional.png",
  "edificio-toesca-centro": "/guides/conciertos/movistar-arena.png",
};

function buildStayBuilding(
  buildingId: string,
  units: Property[],
): StayBuilding | null {
  const first = units[0];
  if (!first?.buildingId) return null;

  return {
    buildingId,
    buildingName: first.buildingName ?? first.neighborhood,
    neighborhood: first.neighborhood,
    address: first.address,
    metroStations: first.metroStations,
    nearbyPoiIds: first.nearbyPoiIds,
    audiences: first.audiences,
    lat: first.lat,
    lng: first.lng,
    heroImage: HERO_BY_BUILDING[buildingId] ?? "/guides/deportes/estadio-nacional.png",
    unitCount: units.length,
  };
}

let cachedBuildings: StayBuilding[] | null = null;

export function getStayBuildings(): StayBuilding[] {
  if (cachedBuildings) return cachedBuildings;

  const byBuilding = new Map<string, Property[]>();
  for (const prop of properties.filter((p) => p.isReal && p.buildingId)) {
    const list = byBuilding.get(prop.buildingId!) ?? [];
    list.push(prop);
    byBuilding.set(prop.buildingId!, list);
  }

  cachedBuildings = [...byBuilding.entries()]
    .map(([buildingId, units]) => buildStayBuilding(buildingId, units))
    .filter((b): b is StayBuilding => Boolean(b));

  return cachedBuildings;
}

export function getStayBuilding(slug: string): StayBuilding | undefined {
  return getStayBuildings().find((b) => b.buildingId === slug);
}

export function getPropertiesForStayBuilding(buildingId: string): Property[] {
  return properties.filter((p) => p.isReal && p.buildingId === buildingId);
}

export function getAllStayBuildingSlugs(): string[] {
  return getStayBuildings().map((b) => b.buildingId);
}

export function getStayBuildingNearbyPois(building: StayBuilding) {
  return building.nearbyPoiIds
    .map((id) => getPoi(id))
    .filter((poi): poi is NonNullable<typeof poi> => Boolean(poi));
}
