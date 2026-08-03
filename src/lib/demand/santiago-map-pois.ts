/** Puntos fijos del mapa de /santiago — landmarks y estaciones de metro */
export const SANTIAGO_LANDMARKS = [
  {
    id: "movistar-arena",
    label: "Movistar Arena",
    lat: -33.46278,
    lng: -70.66194,
  },
  {
    id: "estadio-nacional",
    label: "Estadio Nacional",
    lat: -33.4648,
    lng: -70.6106,
  },
  {
    id: "barrio-italia",
    label: "Barrio Italia",
    lat: -33.4485,
    lng: -70.6248,
  },
  {
    id: "centro-historico",
    label: "Centro Histórico",
    lat: -33.4378,
    lng: -70.6505,
  },
  {
    id: "costanera-center",
    label: "Costanera Center",
    lat: -33.4177,
    lng: -70.6065,
  },
] as const;

/** Cuatro estaciones alineadas al inventario (Barrio Italia, Ñuble/Estadio, Toesca/Movistar). */
export const SANTIAGO_METRO_STATIONS = [
  {
    id: "metro-irarrazaval",
    label: "Metro Irarrázaval",
    lat: -33.4535471,
    lng: -70.6315175,
  },
  {
    id: "metro-nuble",
    label: "Metro Ñuble",
    lat: -33.4669688,
    lng: -70.6366262,
  },
  {
    id: "metro-estadio-nacional",
    label: "Metro Estadio Nacional",
    lat: -33.4609211,
    lng: -70.6097813,
  },
  {
    id: "metro-toesca",
    label: "Metro Toesca",
    lat: -33.4529423,
    lng: -70.6611249,
  },
] as const;

export const METRO_LOGO_SRC = "/brand/metro-santiago.png";
export const ESTADIO_NACIONAL_ICON_SRC = "/brand/estadio-nacional.png";
export const MOVISTAR_ARENA_ICON_SRC = "/brand/movistar-arena.png";

export function isEstadioNacionalLabel(label: string): boolean {
  return /estadio nacional/i.test(label) && !/^metro /i.test(label);
}

export function isMovistarArenaLabel(label: string): boolean {
  return /movistar arena/i.test(label) && !/^metro /i.test(label);
}

export type CustomVenuePin = {
  iconSrc: string;
  displayLabel: string;
};

export function resolveCustomVenuePin(label: string): CustomVenuePin | null {
  if (isEstadioNacionalLabel(label)) {
    return {
      iconSrc: ESTADIO_NACIONAL_ICON_SRC,
      displayLabel: "Estadio Nacional",
    };
  }
  if (isMovistarArenaLabel(label)) {
    return {
      iconSrc: MOVISTAR_ARENA_ICON_SRC,
      displayLabel: "Movistar Arena",
    };
  }
  return null;
}

export function santiagoCatalogMapMarkers() {
  return [
    ...SANTIAGO_LANDMARKS.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.label,
      kind: "landmark" as const,
    })),
    ...SANTIAGO_METRO_STATIONS.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.label,
      kind: "metro" as const,
    })),
  ];
}
