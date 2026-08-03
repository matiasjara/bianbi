/** Distancia haversine en km. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Minutos estimados de traslado en Santiago (~28 km/h). */
export function travelMinutes(km: number): number {
  return Math.max(3, Math.round((km / 28) * 60));
}

/** @deprecated Usar travelMinutes */
export function walkingMinutes(km: number): number {
  return travelMinutes(km);
}

export function osmEmbedUrl(lat: number, lng: number, delta = 0.018): string {
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta,
  ].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function osmLink(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
}

/** Link OSM centrado en varios puntos (evento + deptos). */
export function osmLinkMulti(
  points: Array<{ lat: number; lng: number }>,
): string {
  if (points.length === 0) return "https://www.openstreetmap.org/";
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const midLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const first = points[0];
  return `https://www.openstreetmap.org/?mlat=${first.lat}&mlon=${first.lng}#map=14/${midLat}/${midLng}`;
}
