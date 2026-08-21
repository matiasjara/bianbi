import { getPoi } from "@/lib/data/seed";
import type { StayBuilding } from "@/lib/data/stay-buildings";
import type { MapMarker } from "@/lib/demand/map-marker-layout";

/** Atractivo principal del mapa en cada landing /alojamiento/[slug]. */
const BUILDING_MAP_ANCHOR: Record<
  string,
  { poiId: string; label: string }
> = {
  "edificio-italia-irarrazaval": {
    poiId: "poi-italia",
    label: "Barrio Italia",
  },
  "edificio-nunoa-estadio": {
    poiId: "poi-estadio",
    label: "Estadio Nacional",
  },
  "edificio-toesca-centro": {
    poiId: "poi-movistar",
    label: "Movistar Arena",
  },
};

/** Un pin de alojamiento + el atractivo más cercano (logo + etiqueta negra). */
export function buildStayBuildingMapMarkers(building: StayBuilding): MapMarker[] {
  const markers: MapMarker[] = [
    {
      lat: building.lat,
      lng: building.lng,
      label: building.buildingName,
      kind: "property",
    },
  ];

  const anchor = BUILDING_MAP_ANCHOR[building.buildingId];
  if (!anchor) return markers;

  const poi = getPoi(anchor.poiId);
  if (!poi) return markers;

  markers.push({
    lat: poi.lat,
    lng: poi.lng,
    label: anchor.label,
    kind: "landmark",
  });

  return markers;
}
