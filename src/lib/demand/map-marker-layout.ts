export type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  kind: "venue" | "property" | "landmark" | "metro";
};

/** Conserva coordenadas reales; el alineado visual va en el HTML del pin. */
export function layoutMapMarkers(markers: MapMarker[]): MapMarker[] {
  return markers;
}
