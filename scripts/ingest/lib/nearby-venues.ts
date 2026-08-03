/**
 * Venues RM cercanos al inventario Crambie (≤ ~5 km de algún depto).
 * Referencia: src/lib/data/seed.ts
 */
export type NearbyVenue = {
  id: string;
  label: string;
  match: RegExp;
  poiIds: string[];
  propertyCodes: string[];
  tags: string[];
  ticketmasterPageSlug?: string;
  puntoticketPath?: string;
};

export const NEARBY_VENUES: NearbyVenue[] = [
  {
    id: "estadio_nacional",
    label: "Estadio Nacional Julio Martínez Prádanos, Ñuñoa",
    match: /estadio nacional|julio mart[ií]nez pr[aá]danos|av\.?\s*grecia 2001/i,
    poiIds: ["poi-estadio"],
    propertyCodes: ["Z114", "Z107", "E801", "E214", "T112"],
    tags: ["estadio_nacional", "deportes", "conciertos"],
    ticketmasterPageSlug: "estadio-nacional",
  },
  {
    id: "movistar_arena",
    label: "Movistar Arena",
    match: /movistar arena|beaucheff 1204|parque o['']?higgins.*movistar/i,
    poiIds: ["poi-movistar"],
    propertyCodes: ["E801", "E214", "T112", "Z114", "Z107"],
    tags: ["movistar_arena", "conciertos"],
    puntoticketPath: "movistar-arena",
  },
  {
    id: "parque_ohiggins",
    label: "Parque O'Higgins",
    match: /parque o['']?higgins|c[uú]pula parque|lollapalooza chile|festival bamba/i,
    poiIds: ["poi-ohiggins", "poi-movistar"],
    propertyCodes: ["T112", "E801", "E214", "Z114", "Z107"],
    tags: ["parque_ohiggins", "festival", "conciertos"],
  },
  {
    id: "teatro_caupolican",
    label: "Teatro Caupolicán",
    match: /teatro caupolic[aá]n|caupolic[aá]n/i,
    poiIds: ["poi-movistar", "poi-lastarria"],
    propertyCodes: ["E801", "E214", "T112"],
    tags: ["teatro_caupolican", "conciertos"],
    puntoticketPath: "teatro-caupolican",
  },
  {
    id: "teatro_coliseo",
    label: "Teatro Coliseo",
    match: /teatro coliseo/i,
    poiIds: ["poi-movistar", "poi-lastarria"],
    propertyCodes: ["E801", "E214", "T112"],
    tags: ["teatro_coliseo", "conciertos"],
    puntoticketPath: "teatro-coliseo",
  },
  {
    id: "club_hipico",
    label: "Club Hípico de Santiago",
    match: /club h[ií]pico|blanco encalada 254/i,
    poiIds: ["poi-club-hipico", "poi-movistar"],
    propertyCodes: ["T112", "E801", "E214"],
    tags: ["club_hipico", "conciertos"],
  },
  {
    id: "estacion_mapocho",
    label: "Estación Mapocho",
    match: /estaci[oó]n mapocho|centro cultural estaci[oó]n mapocho/i,
    poiIds: ["poi-movistar", "poi-lastarria"],
    propertyCodes: ["E801", "E214", "T112"],
    tags: ["estacion_mapocho", "conciertos"],
  },
  {
    id: "estadio_monumental",
    label: "Estadio Monumental David Arellano, Macul",
    match: /estadio monumental|marathon 5300|david arellano/i,
    poiIds: ["poi-estadio"],
    propertyCodes: ["Z114", "Z107", "E801", "E214"],
    tags: ["estadio_monumental", "deportes"],
    ticketmasterPageSlug: "estadio-monumental",
  },
];

const EXCLUDE_VENUE =
  /gran arena monticello|bicentenario la florida|estadio bicentenario|metropolitan santiago|teatro mori|nescaf[eé] de las artes|teatro oriente|san gin[eé]s|cenco florida|estadio la portada|estadio nicol[aá]s chahu[aá]n|teatro zoco|lo barnechea|claro arena|san bernardo|vi[nñ]a del mar|la serena|valpara[ií]so|antofagasta|temuco|iquique|blondie santiago centro|teatro municipal de valpara[ií]so|teatro universidad de concepci[oó]n|municipal de vi[nñ]a|mostazal|monticello/i;

export function matchNearbyVenue(text: string): NearbyVenue | null {
  if (EXCLUDE_VENUE.test(text)) return null;
  for (const venue of NEARBY_VENUES) {
    if (venue.match.test(text)) return venue;
  }
  return null;
}

export function puntoticketVenuePages(): Array<{
  path: string;
  url: string;
  venue: NearbyVenue;
}> {
  return NEARBY_VENUES.filter((v) => v.puntoticketPath).map((venue) => ({
    path: venue.puntoticketPath!,
    url: `https://www.puntoticket.com/${venue.puntoticketPath}`,
    venue,
  }));
}
