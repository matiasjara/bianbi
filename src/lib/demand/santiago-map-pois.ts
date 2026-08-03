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

export const SANTIAGO_METRO_STATIONS = [
  {
    id: "metro-nunoa",
    label: "Metro Ñuñoa",
    lat: -33.4569,
    lng: -70.5973,
  },
  {
    id: "metro-irarrazaval",
    label: "Metro Irarrázaval",
    lat: -33.4444,
    lng: -70.6282,
  },
  {
    id: "metro-toesca",
    label: "Metro Toesca",
    lat: -33.4562,
    lng: -70.6643,
  },
  {
    id: "metro-estadio-nacional",
    label: "Metro Estadio Nacional",
    lat: -33.4662,
    lng: -70.6088,
  },
  {
    id: "metro-franklin",
    label: "Metro Franklin",
    lat: -33.4766,
    lng: -70.6494,
  },
  {
    id: "metro-moneda",
    label: "Metro Moneda",
    lat: -33.4442,
    lng: -70.6506,
  },
  {
    id: "metro-baquedano",
    label: "Metro Baquedano",
    lat: -33.4396,
    lng: -70.6314,
  },
  {
    id: "metro-universidad-de-chile",
    label: "Metro Universidad de Chile",
    lat: -33.4481,
    lng: -70.6514,
  },
  {
    id: "metro-republica",
    label: "Metro República",
    lat: -33.4317,
    lng: -70.6386,
  },
] as const;

export const METRO_LOGO_SRC = "/brand/metro-santiago.png";

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
