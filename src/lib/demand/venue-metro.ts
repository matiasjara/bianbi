import { distanceKm } from "@/lib/demand/geo";
import { SANTIAGO_METRO_STATIONS } from "@/lib/demand/santiago-map-pois";
import type { Locale } from "@/lib/i18n/locale";

export type VenueMetroStation = (typeof SANTIAGO_METRO_STATIONS)[number];

const MAX_KM = 2.8;

function metroShort(label: string) {
  return label.replace(/^Metro\s+/i, "");
}

/** Estaciones de Metro más cercanas a un punto (venue del evento). */
export function nearestMetroStations(
  lat: number,
  lng: number,
  limit = 2,
): VenueMetroStation[] {
  const ranked = SANTIAGO_METRO_STATIONS.map((s) => ({
    station: s,
    km: distanceKm(lat, lng, s.lat, s.lng),
  })).sort((a, b) => a.km - b.km);

  const within = ranked.filter((r) => r.km <= MAX_KM).map((r) => r.station);
  const pick = within.length > 0 ? within : ranked.slice(0, 1).map((r) => r.station);
  return pick.slice(0, limit);
}

export function formatVenueMetroList(stations: VenueMetroStation[]): string {
  return stations.map((s) => s.label).join(" · ");
}

export function formatVenueMetroMustKnow(
  stations: VenueMetroStation[],
  locale: Locale,
): string {
  const names = stations.map((s) => metroShort(s.label)).join(
    locale === "en" ? " and " : locale === "pt" ? " e " : " y ",
  );
  if (locale === "en") {
    return stations.length === 1
      ? `Nearest metro to the venue: ${names}.`
      : `Nearest metro stations to the venue: ${names}.`;
  }
  if (locale === "pt") {
    return stations.length === 1
      ? `Metrô mais próximo do venue: ${names}.`
      : `Metrôs mais próximos do venue: ${names}.`;
  }
  return stations.length === 1
    ? `Metro más cercano al venue: ${names}.`
    : `Metros más cercanos al venue: ${names}.`;
}

export function formatVenueMetroTransport(
  stations: VenueMetroStation[],
  locale: Locale,
): string {
  const list = formatVenueMetroList(stations);
  if (locale === "en") return `Metro to the venue: ${list}.`;
  if (locale === "pt") return `Metrô até o venue: ${list}.`;
  return `Metro al venue: ${list}.`;
}

export function formatVenueMetroSnapshot(
  stations: VenueMetroStation[],
  locale: Locale,
): string {
  const list = stations.map((s) => metroShort(s.label)).join(" · ");
  if (locale === "en") return `Nearest metro: ${list}`;
  if (locale === "pt") return `Metrô mais próximo: ${list}`;
  return `Metro más cercano: ${list}`;
}
