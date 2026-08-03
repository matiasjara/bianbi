import type { Poi, Property } from "@/lib/types";

/**
 * Inventario real (Airbnb) + POIs de Santiago.
 * Demanda y campañas viven en data/ingested + motor de calendario.
 */
const BUILDING_ITALIA = {
  buildingId: "edificio-italia-irarrazaval",
  buildingName: "Edificio Santa Elena · Barrio Italia",
  neighborhood: "Santiago / Barrio Italia",
  address: "Santa Elena 1316, Santiago, Región Metropolitana, Chile",
  metroStations: ["Irarrázaval"],
  nearbyPoiIds: [
    "poi-italia", // ~1.2 km
    "poi-estadio", // ~2.0 km
    "poi-lastarria", // ~2.2 km
    "poi-movistar", // ~3.0 km
  ],
  audiences: [
    "parejas",
    "gastronomia",
    "cultura",
    "turismo",
    "conciertos",
    "deportes",
  ] as Property["audiences"],
};

const BUILDING_ESTADIO = {
  buildingId: "edificio-nunoa-estadio",
  buildingName: "Ñuñoa · Estadio Nacional",
  neighborhood: "Ñuñoa",
  address: "Zañartu 2075, Ñuñoa, Región Metropolitana, Chile",
  metroStations: ["Ñuñoa", "Estadio Nacional"],
  nearbyPoiIds: [
    "poi-estadio", // ~0.9 km
    "poi-italia", // ~3.0 km
    "poi-movistar", // ~4.8 km
  ],
  audiences: [
    "parejas",
    "conciertos",
    "deportes",
    "turismo",
    "workation",
  ] as Property["audiences"],
};

const BUILDING_TOESCA = {
  buildingId: "edificio-toesca-centro",
  buildingName: "Santiago Centro · Metro Toesca",
  neighborhood: "Santiago Centro",
  address: "Toesca 112, Santiago, Región Metropolitana, Chile",
  metroStations: ["Toesca"],
  nearbyPoiIds: [
    "poi-movistar", // ~1.1 km
    "poi-ohiggins",
    "poi-club-hipico",
    "poi-fantasilandia",
  ],
  audiences: [
    "parejas",
    "familias",
    "turismo",
    "workation",
  ] as Property["audiences"],
};

export const properties: Property[] = [
  {
    id: "prop-e801",
    code: "E801",
    ...BUILDING_ITALIA,
    isReal: true,
    airbnbId: "1599328111588834445",
    name: "Departamento cerca de Barrio Italia",
    slug: "depto-barrio-italia-irarrazaval-a",
    lat: -33.4585,
    lng: -70.6303,
    capacity: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Unidad completa",
      "Cama matrimonial",
      "Sofá-cama",
      "Check-in autónomo (smart lock)",
      "Mascotas permitidas",
      "Metro Irarrázaval",
    ],
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599328111588834445/original/2aabe7e0-1b4e-4034-9aa9-92a2aad83d2b.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599328111588834445/original/900d151b-525d-442c-b894-f6f85d742023.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599328111588834445/original/d90493e0-157e-4c7b-adad-8ca772e1289b.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599328111588834445/original/4ae237e2-5427-4942-be1e-7bb108bd8ccf.jpeg",
    ],
    airbnbUrl: "https://www.airbnb.cl/rooms/1599328111588834445",
    description:
      "Departamento 1D/1B con cama matrimonial y sofá-cama (hasta 3 huéspedes), cerca de Barrio Italia, Metro Irarrázaval y Mega Canal.",
    rating: 5.0,
    reviewCount: 6,
    isSuperhost: true,
    occupancyNext30: null,
    availableNightsNext30: null,
  },
  {
    id: "prop-e214",
    code: "E214",
    ...BUILDING_ITALIA,
    isReal: true,
    airbnbId: "1599316115945821099",
    name: "Departamento cerca de Barrio Italia",
    slug: "depto-barrio-italia-irarrazaval-b",
    lat: -33.4585,
    lng: -70.6303,
    capacity: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Unidad completa",
      "Cama matrimonial",
      "Sofá-cama",
      "Metro Irarrázaval",
      "Cerca de Barrio Italia",
    ],
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599316115945821099/original/e581b68c-5048-4d00-972e-18d119020f54.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599316115945821099/original/948b201b-9d67-4faf-ad82-7b32cabeed1e.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599316115945821099/original/81efc083-4257-44bd-a679-c9c0e39a7d0a.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599316115945821099/original/08292721-5403-46d1-8082-4bdb5b029031.jpeg",
    ],
    airbnbUrl: "https://www.airbnb.cl/rooms/1599316115945821099",
    description:
      "Departamento 1D/1B con cama matrimonial y sofá-cama (hasta 3 huéspedes), cerca de Barrio Italia, Metro Irarrázaval y Mega.",
    rating: 5.0,
    reviewCount: 4,
    isSuperhost: true,
    occupancyNext30: null,
    availableNightsNext30: null,
  },
  {
    id: "prop-z114",
    code: "Z114",
    ...BUILDING_ESTADIO,
    isReal: true,
    airbnbId: "1589223102087983072",
    name: "Departamento cerca del Estadio Nacional",
    slug: "depto-nunoa-estadio-nacional",
    lat: -33.47303,
    lng: -70.61094,
    capacity: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Unidad completa",
      "Cama matrimonial",
      "Sofá-cama",
      "Estacionamiento",
      "Check-in autónomo (smart lock)",
      "Mascotas permitidas",
      "Cerca del Estadio Nacional",
    ],
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/c37f24ca-e731-48d3-88fb-3c7792ecea96.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/adfe9863-c78a-42f2-9618-1ef5229e7b5c.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/ecfb719b-2c2e-41d4-ba44-b702eb6c6805.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/1dddba7b-8d5b-4cc2-bed3-dee0efe72f4b.jpeg",
    ],
    airbnbUrl: "https://www.airbnb.cl/rooms/1589223102087983072",
    description:
      "Departamento moderno 1D/1B en Ñuñoa con cama matrimonial y sofá-cama (hasta 3 huéspedes), muy cerca del Estadio Nacional. Incluye estacionamiento.",
    rating: 5.0,
    reviewCount: 10,
    isSuperhost: true,
    occupancyNext30: null,
    availableNightsNext30: null,
  },
  {
    id: "prop-z107",
    code: "Z107",
    ...BUILDING_ESTADIO,
    isReal: true,
    airbnbId: "1589231422574001170",
    name: "Departamento cerca del Estadio Nacional",
    slug: "depto-nunoa-estadio-nacional-b",
    lat: -33.47303,
    lng: -70.61094,
    capacity: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Unidad completa",
      "Cama matrimonial",
      "Sofá-cama",
      "Estacionamiento",
      "Check-in autónomo (smart lock)",
      "Cerca del Estadio Nacional",
    ],
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589231422574001170/original/d88292bb-89ec-44a9-a50c-783bfa6bb6a3.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589231422574001170/original/e611c903-0c92-45a8-a9f9-90238ecb6d24.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589231422574001170/original/23005c56-5f0a-4b65-bfdd-aa5d40c90403.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589231422574001170/original/2cca4c97-82c5-41e1-845e-04b2670175fd.jpeg",
    ],
    airbnbUrl: "https://www.airbnb.cl/rooms/1589231422574001170",
    description:
      "Departamento 1D/1B en Ñuñoa con cama matrimonial y sofá-cama (hasta 3 huéspedes), a pasos del Estadio Nacional. Incluye estacionamiento.",
    rating: 5.0,
    reviewCount: 14,
    isSuperhost: true,
    occupancyNext30: null,
    availableNightsNext30: null,
  },
  {
    id: "prop-t112",
    code: "T112",
    ...BUILDING_TOESCA,
    isReal: true,
    airbnbId: "1575446462764908645",
    name: "Departamento cerca de Fantasilandia · Metro Toesca",
    slug: "depto-fantasilandia-metro-toesca",
    lat: -33.4541,
    lng: -70.6650,
    capacity: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Unidad completa",
      "Cama matrimonial",
      "Sofá-cama",
      "Check-in autónomo (smart lock)",
      "Mascotas permitidas",
      "Metro Toesca",
      "Sin estacionamiento",
    ],
    photos: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1575446462764908645/original/ba1290cc-676c-4f3e-8833-f26643367303.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1575446462764908645/original/ccb839f2-7070-4f7a-8963-0d0ed2393c8d.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1575446462764908645/original/fa924c9b-1f63-411e-a05e-5a1861bf6361.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1575446462764908645/original/d2de87c9-87b0-48a6-98ba-f6a03c522b7a.jpeg",
    ],
    airbnbUrl: "https://www.airbnb.cl/rooms/1575446462764908645",
    description:
      "Departamento moderno en Santiago Centro con cama matrimonial y sofá-cama (hasta 3 huéspedes), a minutos del Metro Toesca y cerca de Parque O'Higgins, Club Hípico, Movistar Arena y Fantasilandia. Sin estacionamiento.",
    rating: 5.0,
    reviewCount: 9,
    isSuperhost: true,
    occupancyNext30: null,
    availableNightsNext30: null,
  },
];

export const pois: Poi[] = [
  {
    id: "poi-movistar",
    name: "Movistar Arena",
    slug: "movistar-arena",
    category: "venue",
    // Av. Beaucheff 1204 · Parque O'Higgins
    lat: -33.46278,
    lng: -70.66194,
    influenceRadiusKm: 3,
    seasonality: "Todo el año — peaks en conciertos",
    description: "Principal arena de conciertos y eventos masivos de Santiago.",
  },
  {
    id: "poi-estadio",
    name: "Estadio Nacional",
    slug: "estadio-nacional",
    category: "venue",
    lat: -33.4648,
    lng: -70.6106,
    influenceRadiusKm: 2.5,
    seasonality: "Partidos, finales y eventos deportivos",
    description: "Estadio histórico para fútbol y eventos de gran escala.",
  },
  {
    id: "poi-lastarria",
    name: "Barrio Lastarria",
    slug: "barrio-lastarria",
    category: "barrio",
    lat: -33.4405,
    lng: -70.6408,
    influenceRadiusKm: 1.2,
    seasonality: "Fuerte demanda turística todo el año",
    description: "Barrio cultural y gastronómico caminable en el centro.",
  },
  {
    id: "poi-italia",
    name: "Barrio Italia",
    slug: "barrio-italia",
    category: "barrio",
    lat: -33.4485,
    lng: -70.6248,
    influenceRadiusKm: 1.5,
    seasonality: "Fines de semana y turismo creativo",
    description: "Anticuarios, diseño, cafés y vida de barrio.",
  },
  {
    id: "poi-santiago-hub",
    name: "Santiago — base cordillera",
    slug: "santiago-hub-nieve",
    category: "barrio",
    lat: -33.456,
    lng: -70.648,
    influenceRadiusKm: 6,
    seasonality: "Jun–Ago — hub hacia centros de ski",
    description:
      "Zona de alojamiento en Santiago para viajeros que van a Valle Nevado, Farellones, Portillo y otros centros de nieve.",
  },
  {
    id: "poi-santa-lucia",
    name: "Cerro Santa Lucía",
    slug: "cerro-santa-lucia",
    category: "atraccion",
    lat: -33.4401,
    lng: -70.644,
    influenceRadiusKm: 1,
    seasonality: "Turismo diurno constante",
    description: "Mirador histórico junto a Lastarria.",
  },
  {
    id: "poi-costanera",
    name: "Sky Costanera",
    slug: "sky-costanera",
    category: "atraccion",
    lat: -33.4177,
    lng: -70.6065,
    influenceRadiusKm: 2,
    seasonality: "Turismo todo el año",
    description: "Mirador más alto de Latinoamérica en Providencia.",
  },
  {
    id: "poi-fantasilandia",
    name: "Fantasilandia",
    slug: "fantasilandia",
    category: "atraccion",
    lat: -33.4605,
    lng: -70.662,
    influenceRadiusKm: 2,
    seasonality: "Vacaciones y fines de semana familiares",
    description: "Parque de diversiones en el Parque O'Higgins.",
  },
  {
    id: "poi-ohiggins",
    name: "Parque O'Higgins",
    slug: "parque-ohiggins",
    category: "atraccion",
    lat: -33.4618,
    lng: -70.6605,
    influenceRadiusKm: 2,
    seasonality: "Fines de semana, ferias y eventos al aire libre",
    description: "Gran parque urbano con espacios verdes y eventos.",
  },
  {
    id: "poi-club-hipico",
    name: "Club Hípico",
    slug: "club-hipico",
    category: "venue",
    lat: -33.4672,
    lng: -70.6678,
    influenceRadiusKm: 2,
    seasonality: "Carreras y eventos",
    description: "Histórico club hípico de Santiago.",
  },
];

export function getPoi(id: string) {
  return pois.find((p) => p.id === id);
}

export function getProperty(id: string) {
  return properties.find((p) => p.id === id);
}

export function getPropertyByCode(code: string) {
  return properties.find((p) => p.code === code);
}
