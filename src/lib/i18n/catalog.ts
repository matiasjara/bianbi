import { getPoi, properties as allProperties } from "@/lib/data/seed";
import { publicPropertyLocation } from "@/lib/demand/public-location";
import { buildCatalogLocationHighlights } from "@/lib/demand/catalog-location-highlights";
import type { CampaignPackProperty } from "@/lib/demand/types";
import type { Locale } from "@/lib/i18n/locale";
import type { Property } from "@/lib/types";

export type CatalogSubheadPart = { text: string; bold?: boolean };

type CatalogUi = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroBadge: string;
  headline: string;
  subhead: CatalogSubheadPart[];
  heroMeta: string;
  heroStats: { value: string; label: string }[];
  ctaSee: string;
  ctaMap: string;
  whyTitle: string;
  whyBody: string;
  attractionsTitle: string;
  attractionsBody: string;
  unitsTitle: string;
  unitsBody: string;
  nearby: string;
  barrio: string;
  metro: string;
  beds: string;
  bedsValue: string;
  capacity: (n: number, bedrooms: number) => string;
  capacityLabel: string;
  airbnbRating: (rating: string, reviews: number, superhost: boolean) => string;
  ctaBook: string;
  paySafe: string;
  mapTitle: string;
  mapBody: string;
  mapUnit: string;
  closeTitle: string;
  closeBody: string;
  ctaGo: string;
  footerStay: string;
  footerDisclaimer: string;
};

const UI: Record<Locale, CatalogUi> = {
  es: {
    metaTitle: "Alojamientos en Santiago",
    metaDescription:
      "Alojamientos en Santiago: Barrio Italia, Ñuñoa y Centro. Metro cerca, barrio seguro y reserva directa en Airbnb.",
    eyebrow: "Santiago",
    heroBadge: "Santiago · Alojamientos",
    headline: "Alojamientos para tu estadía en Santiago",
    subhead: [
      {
        text: "Alojamientos nuevos y modernos, full equipados y en excelentes condiciones. Ideales para quedarte cerca del ",
      },
      { text: "Estadio Nacional", bold: true },
      { text: " o del " },
      { text: "Movistar Arena", bold: true },
      {
        text: " en eventos deportivos y conciertos. Barrios seguros, metro cerca y reserva directa en Airbnb.",
      },
    ],
    heroMeta: "Estadio Nacional · Movistar Arena",
    heroStats: [
      { value: "5", label: "Deptos" },
      { value: "3", label: "Barrios" },
      { value: "★", label: "Superhost" },
    ],
    ctaSee: "Ver alojamientos",
    ctaMap: "Ver mapa",
    whyTitle: "Por qué estos alojamientos",
    whyBody:
      "No es un hotel genérico: son alojamientos completos en Santiago, pensados para llegar, descansar y moverte con facilidad.",
    attractionsTitle: "Atractivos cerca",
    attractionsBody:
      "Barrios, venues y parques a los que llegas fácil desde los alojamientos — conciertos, deporte, gastronomía o turismo.",
    unitsTitle: "Alojamientos",
    unitsBody:
      "Cinco opciones full equipadas en Barrio Italia, Ñuñoa y Santiago Centro. Hasta 3 huéspedes, cama matrimonial y sofá-cama.",
    nearby: "Cerca de",
    barrio: "Barrio",
    metro: "Metro",
    beds: "Camas",
    bedsValue: "matrimonial + sofá-cama",
    capacity: (n, bedrooms) =>
      `hasta ${n} huésped${n === 1 ? "" : "es"} · ${bedrooms} dorm`,
    capacityLabel: "Capacidad",
    airbnbRating: (rating, reviews, superhost) =>
      `${rating} ★ · ${reviews} reseña${reviews === 1 ? "" : "s"}${superhost ? " · Superhost" : ""}`,
    ctaBook: "Reservar en Airbnb",
    paySafe: "Pago seguro · cancelación según política del anuncio",
    mapTitle: "Dónde están",
    mapBody: "Ubicación de los alojamientos en Santiago.",
    mapUnit: "Alojamiento",
    closeTitle: "Elige tu base en Santiago",
    closeBody:
      "Arriendas en Airbnb: pago protegido, check-in coordinado y reseñas reales. Nosotros te mostramos las opciones.",
    ctaGo: "Ver en Airbnb",
    footerStay: "Alojamiento independiente en Santiago",
    footerDisclaimer:
      "Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. No gestionamos arriendos, no cobramos reservas ni procesamos pagos: solo mostramos opciones y te redirigimos al anuncio oficial en Airbnb para que reserves allí.",
  },
  en: {
    metaTitle: "Accommodations in Santiago",
    metaDescription:
      "Accommodations in Santiago: Barrio Italia, Ñuñoa and Centro. Near the metro, safe neighborhoods, book direct on Airbnb.",
    eyebrow: "Santiago",
    heroBadge: "Santiago · Stays",
    headline: "Accommodations for your stay in Santiago",
    subhead: [
      {
        text: "New, modern stays — fully equipped and in excellent condition. Ideal if you want to stay near ",
      },
      { text: "Estadio Nacional", bold: true },
      { text: " or " },
      { text: "Movistar Arena", bold: true },
      {
        text: " for sports events and concerts. Safe neighborhoods, metro nearby, book direct on Airbnb.",
      },
    ],
    heroMeta: "Estadio Nacional · Movistar Arena",
    heroStats: [
      { value: "5", label: "Stays" },
      { value: "3", label: "Areas" },
      { value: "★", label: "Superhost" },
    ],
    ctaSee: "See accommodations",
    ctaMap: "See map",
    whyTitle: "Why these stays",
    whyBody:
      "Not a generic hotel: full accommodations in Santiago, made for arriving, resting, and getting around easily.",
    attractionsTitle: "Nearby attractions",
    attractionsBody:
      "Neighborhoods, venues and parks you can reach easily from the stays — concerts, sports, food or sightseeing.",
    unitsTitle: "Accommodations",
    unitsBody:
      "Five fully equipped options in Barrio Italia, Ñuñoa and Santiago Centro. Up to 3 guests, queen bed and sofa bed.",
    nearby: "Near",
    barrio: "Neighborhood",
    metro: "Metro",
    beds: "Beds",
    bedsValue: "queen bed + sofa bed",
    capacity: (n, bedrooms) =>
      `up to ${n} guest${n === 1 ? "" : "s"} · ${bedrooms} bed${bedrooms === 1 ? "" : "s"}`,
    capacityLabel: "Capacity",
    airbnbRating: (rating, reviews, superhost) =>
      `${rating} ★ · ${reviews} review${reviews === 1 ? "" : "s"}${superhost ? " · Superhost" : ""}`,
    ctaBook: "Book on Airbnb",
    paySafe: "Secure payment · cancellation per listing policy",
    mapTitle: "Where they are",
    mapBody: "Where the accommodations are in Santiago.",
    mapUnit: "Stay",
    closeTitle: "Pick your base in Santiago",
    closeBody:
      "You book on Airbnb: protected payment, arranged check-in and real reviews. We just show the options.",
    ctaGo: "View on Airbnb",
    footerStay: "Independent stay in Santiago",
    footerDisclaimer:
      "This site is not part of Airbnb and is not affiliated with Airbnb, Inc. We do not manage rentals, take bookings, or process payments — we only show options and send you to the official Airbnb listing to book there.",
  },
  pt: {
    metaTitle: "Alojamentos em Santiago",
    metaDescription:
      "Alojamentos em Santiago: Barrio Italia, Ñuñoa e Centro. Perto do metrô, bairro seguro e reserva direta no Airbnb.",
    eyebrow: "Santiago",
    heroBadge: "Santiago · Alojamentos",
    headline: "Alojamentos para sua estadia em Santiago",
    subhead: [
      {
        text: "Acomodações novas e modernas, totalmente equipadas e em excelentes condições. Ideais para ficar perto do ",
      },
      { text: "Estadio Nacional", bold: true },
      { text: " ou da " },
      { text: "Movistar Arena", bold: true },
      {
        text: " em eventos esportivos e shows. Bairros seguros, metrô perto e reserva direta no Airbnb.",
      },
    ],
    heroMeta: "Estadio Nacional · Movistar Arena",
    heroStats: [
      { value: "5", label: "Aloj." },
      { value: "3", label: "Bairros" },
      { value: "★", label: "Superhost" },
    ],
    ctaSee: "Ver alojamentos",
    ctaMap: "Ver mapa",
    whyTitle: "Por que estes alojamentos",
    whyBody:
      "Não é um hotel genérico: são alojamentos completos em Santiago, pensados para chegar, descansar e se locomover com facilidade.",
    attractionsTitle: "Atrações por perto",
    attractionsBody:
      "Bairros, venues e parques a que você chega fácil dos alojamentos — shows, esporte, gastronomia ou turismo.",
    unitsTitle: "Alojamentos",
    unitsBody:
      "Cinco opções totalmente equipadas em Barrio Italia, Ñuñoa e Santiago Centro. Até 3 hóspedes, cama de casal e sofá-cama.",
    nearby: "Perto de",
    barrio: "Bairro",
    metro: "Metrô",
    beds: "Camas",
    bedsValue: "casal + sofá-cama",
    capacity: (n, bedrooms) =>
      `até ${n} hóspede${n === 1 ? "" : "s"} · ${bedrooms} quarto${bedrooms === 1 ? "" : "s"}`,
    capacityLabel: "Capacidade",
    airbnbRating: (rating, reviews, superhost) =>
      `${rating} ★ · ${reviews} avaliação${reviews === 1 ? "" : "ões"}${superhost ? " · Superhost" : ""}`,
    ctaBook: "Reservar no Airbnb",
    paySafe: "Pagamento seguro · cancelamento conforme o anúncio",
    mapTitle: "Onde ficam",
    mapBody: "Localização dos alojamentos em Santiago.",
    mapUnit: "Alojamento",
    closeTitle: "Escolha sua base em Santiago",
    closeBody:
      "Você aluga no Airbnb: pagamento protegido, check-in combinado e avaliações reais. Nós só mostramos as opções.",
    ctaGo: "Ver no Airbnb",
    footerStay: "Hospedagem independente em Santiago",
    footerDisclaimer:
      "Este site não faz parte do Airbnb e não é afiliado à Airbnb, Inc. Não gerenciamos aluguéis, não cobramos reservas nem processamos pagamentos: só mostramos opções e redirecionamos para o anúncio oficial no Airbnb para você reservar lá.",
  },
};

const AMENITY: Record<string, Record<Locale, string>> = {
  "Unidad completa": {
    es: "Unidad completa",
    en: "Entire place",
    pt: "Espaço inteiro",
  },
  "Cama matrimonial": {
    es: "Cama matrimonial",
    en: "Queen bed",
    pt: "Cama de casal",
  },
  "Sofá-cama": { es: "Sofá-cama", en: "Sofa bed", pt: "Sofá-cama" },
  "Check-in autónomo (smart lock)": {
    es: "Cerradura digital",
    en: "Digital lock",
    pt: "Fechadura digital",
  },
  Estacionamiento: {
    es: "Estacionamiento",
    en: "Parking",
    pt: "Estacionamento",
  },
  "Sin estacionamiento": {
    es: "Sin estacionamiento",
    en: "No parking",
    pt: "Sem estacionamento",
  },
};

const POI_BLURB: Record<string, Record<Locale, string>> = {
  "poi-italia": {
    es: "Anticuarios, diseño y cafés",
    en: "Antiques, design and cafés",
    pt: "Antiguidades, design e cafés",
  },
  "poi-santiago-hub": {
    es: "Hub de alojamiento hacia centros de ski",
    en: "Stay hub for ski resorts",
    pt: "Base de hospedagem para ski",
  },
  "poi-movistar": {
    es: "Conciertos y eventos masivos",
    en: "Concerts and big events",
    pt: "Shows e eventos grandes",
  },
  "poi-estadio": {
    es: "Fútbol y eventos deportivos",
    en: "Football and sports events",
    pt: "Futebol e eventos esportivos",
  },
  "poi-lastarria": {
    es: "Cultura y gastronomía caminable",
    en: "Walkable culture and food",
    pt: "Cultura e gastronomia a pé",
  },
  "poi-fantasilandia": {
    es: "Parque de diversiones familiar",
    en: "Family amusement park",
    pt: "Parque de diversões familiar",
  },
  "poi-santa-lucia": {
    es: "Mirador histórico en el centro",
    en: "Historic viewpoint downtown",
    pt: "Mirante histórico no centro",
  },
  "poi-costanera": {
    es: "Mirador más alto de Latinoamérica",
    en: "Tallest viewpoint in Latin America",
    pt: "Mirante mais alto da América Latina",
  },
  "poi-ohiggins": {
    es: "Parque urbano y eventos al aire libre",
    en: "Urban park and outdoor events",
    pt: "Parque urbano e eventos ao ar livre",
  },
  "poi-club-hipico": {
    es: "Club hípico histórico de Santiago",
    en: "Historic Santiago horse racing club",
    pt: "Clube hípico histórico de Santiago",
  },
};

const WHY_POINTS: Record<Locale, string[]> = {
  es: [
    "Barrios seguros y residenciales: Barrio Italia, Ñuñoa y Santiago Centro",
    "Deptos en Ñuñoa con estacionamiento incluido — ideal si vas en auto al estadio o eventos",
    "Alojamientos nuevos y modernos, full equipados y en excelentes condiciones",
    "Cerradura digital para tu comodidad y seguridad",
    "Metro cerca para moverte sin auto",
    "Reserva directa en Airbnb: pago protegido y reseñas reales",
  ],
  en: [
    "Safe residential neighborhoods: Barrio Italia, Ñuñoa and Santiago Centro",
    "Ñuñoa stays include parking — handy if you're driving to the stadium or events",
    "New, modern stays — fully equipped and in excellent condition",
    "Digital lock for comfort and security",
    "Metro nearby so you can get around without a car",
    "Book direct on Airbnb: protected payment and real reviews",
  ],
  pt: [
    "Bairros seguros e residenciais: Barrio Italia, Ñuñoa e Santiago Centro",
    "Acomodações em Ñuñoa com estacionamento incluído — ideal se for de carro ao estádio",
    "Acomodações novas e modernas, totalmente equipadas e em excelentes condições",
    "Fechadura digital para conforto e segurança",
    "Metrô perto para circular sem carro",
    "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
  ],
};

function tAmenity(a: string, locale: Locale): string {
  return AMENITY[a]?.[locale] ?? a;
}

function pitchFor(prop: Property, locale: Locale): string {
  const parking = prop.amenities.some((a) => /^estacionamiento$/i.test(a.trim()));
  const metro =
    prop.metroStations.length > 0
      ? locale === "en"
        ? `Metro ${prop.metroStations.slice(0, 2).join(" / ")}`
        : locale === "pt"
          ? `Metrô ${prop.metroStations.slice(0, 2).join(" / ")}`
          : `Metro ${prop.metroStations.slice(0, 2).join(" / ")}`
      : null;
  const nearbyNames = prop.nearbyPoiIds
    .slice(0, 2)
    .map((id) => getPoi(id)?.name)
    .filter(Boolean);

  if (locale === "en") {
    return [
      `${prop.neighborhood}: residential and well connected`,
      parking ? "Parking included" : null,
      metro,
      nearbyNames.length ? `Near ${nearbyNames.join(" · ")}` : null,
      prop.isSuperhost ? "Airbnb Superhost" : "Book on Airbnb",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (locale === "pt") {
    return [
      `${prop.neighborhood}: residencial e bem conectado`,
      parking ? "Estacionamento incluído" : null,
      metro,
      nearbyNames.length ? `Perto de ${nearbyNames.join(" · ")}` : null,
      prop.isSuperhost ? "Superhost no Airbnb" : "Reserve no Airbnb",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return [
    `${prop.neighborhood}: residencial y bien conectado`,
    parking ? "Estacionamiento incluido" : null,
    metro,
    nearbyNames.length ? `Cerca de ${nearbyNames.join(" · ")}` : null,
    prop.isSuperhost ? "Superhost en Airbnb" : "Reserva en Airbnb",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function getCatalogUi(locale: Locale) {
  return UI[locale];
}

export function getCatalogWhyPoints(locale: Locale) {
  return WHY_POINTS[locale];
}

export function getCatalogAttractions(locale: Locale) {
  const ids = [
    "poi-italia",
    "poi-estadio",
    "poi-movistar",
    "poi-ohiggins",
    "poi-club-hipico",
    "poi-lastarria",
  ];
  return ids
    .map((id) => {
      const poi = getPoi(id);
      if (!poi) return null;
      return {
        id,
        name: poi.name,
        blurb: POI_BLURB[id]?.[locale] ?? poi.description,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}

export function getCatalogProperties(locale: Locale) {
  return allProperties
    .filter((p) => p.isReal)
    .map((p) => ({
      ...p,
      pitchLocalized: pitchFor(p, locale),
      amenitiesLocalized: p.amenities
        .filter(
          (a) =>
            !/^Metro |^Cerca de /i.test(a) && !/mascota/i.test(a),
        )
        .map((a) => tAmenity(a, locale))
        .slice(0, 6),
      nearbyLabels: p.nearbyPoiIds
        .map((id) => getPoi(id)?.name)
        .filter((n): n is string => Boolean(n))
        .slice(0, 4),
    }));
}

/** Deptos en formato MicrositeStayList (agrupados por edificio). */
export function getCatalogStayProperties(locale: Locale): CampaignPackProperty[] {
  return allProperties
    .filter((p) => p.isReal)
    .map((p) => {
      return {
        code: p.code,
        name: p.name,
        slug: p.slug,
        photo: p.photos[0] ?? "",
        photos: p.photos,
        capacity: p.capacity,
        bedrooms: p.bedrooms,
        neighborhood: p.neighborhood,
        buildingName: p.buildingName,
        address: publicPropertyLocation(p.neighborhood, p.address),
        amenities: p.amenities.slice(0, 6),
        distanceKm: 0,
        walkingMinutes: 0,
        airbnbUrl: p.airbnbUrl,
        lat: p.lat,
        lng: p.lng,
        metroStations: p.metroStations,
        rating: p.rating ?? 5,
        reviewCount: p.reviewCount,
        isSuperhost: true,
        pitch: pitchFor(p, locale),
        locationHighlights: buildCatalogLocationHighlights(p, locale),
      };
    });
}
