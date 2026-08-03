export type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  kind: "venue" | "property" | "landmark" | "metro";
};

const CENTER_KINDS = new Set<MapMarker["kind"]>(["venue", "landmark"]);

function centroid(points: Array<{ lat: number; lng: number }>) {
  if (points.length === 0) return { lat: 0, lng: 0 };
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}

function boundsOf(markers: MapMarker[]) {
  const lats = markers.map((m) => m.lat);
  const lngs = markers.map((m) => m.lng);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

/** Separa pins en columnas (metro · venue/POI · alojamiento) y evita solapamiento vertical. */
export function layoutMapMarkers(markers: MapMarker[]): MapMarker[] {
  if (markers.length <= 1) return markers;

  const box = boundsOf(markers);
  const lngSpan = Math.max(box.maxLng - box.minLng, 0.004);
  const latSpan = Math.max(box.maxLat - box.minLat, 0.004);
  const lngOffset = Math.max(lngSpan * 0.34, 0.007);
  const minLatGap = Math.max(latSpan * 0.14, 0.0035);

  const centerSource = markers.filter((m) => CENTER_KINDS.has(m.kind));
  const anchor = centroid(
    centerSource.length > 0 ? centerSource : markers,
  );

  const metro = markers.filter((m) => m.kind === "metro");
  const center = markers.filter((m) => CENTER_KINDS.has(m.kind));
  const properties = markers.filter((m) => m.kind === "property");

  function spreadColumn(group: MapMarker[], lng: number): MapMarker[] {
    const sorted = [...group].sort((a, b) => b.lat - a.lat);
    const placedLats: number[] = [];

    return sorted.map((marker) => {
      let lat = marker.lat;
      for (const prev of placedLats) {
        if (Math.abs(lat - prev) < minLatGap) {
          lat = prev - minLatGap;
        }
      }
      placedLats.push(lat);
      return { ...marker, lat, lng };
    });
  }

  return [
    ...spreadColumn(metro, anchor.lng - lngOffset),
    ...spreadColumn(center, anchor.lng),
    ...spreadColumn(properties, anchor.lng + lngOffset),
  ];
}