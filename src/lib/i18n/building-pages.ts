import {
  getPropertiesForStayBuilding,
  getStayBuilding,
  getStayBuildingNearbyPois,
  type StayBuilding,
} from "@/lib/data/stay-buildings";
import { publicPropertyLocation } from "@/lib/demand/public-location";
import { buildCatalogLocationHighlights } from "@/lib/demand/catalog-location-highlights";
import type { CampaignPackProperty } from "@/lib/demand/types";
import type { Locale } from "@/lib/i18n/locale";
import { getCatalogStayProperties } from "@/lib/i18n/catalog";

type BuildingPageCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  heroMeta: string;
  whyTitle: string;
  whyPoints: string[];
  attractionsTitle: string;
  attractionsBody: string;
  unitsTitle: string;
  unitsBody: (units: number) => string;
  mapTitle: string;
  mapBody: string;
  ctaSee: string;
  ctaMap: string;
  seeAllBuildings: string;
  paySafe: string;
  footerStay: string;
  footerDisclaimer: string;
};

const POI_BLURB: Record<string, Record<Locale, string>> = {
  "poi-italia": {
    es: "Anticuarios, diseño y cafés",
    en: "Antiques, design and cafés",
    pt: "Antiguidades, design e cafés",
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

const COPY: Record<string, Record<Locale, BuildingPageCopy>> = {
  "edificio-italia-irarrazaval": {
    es: {
      metaTitle: "Alojamiento Barrio Italia · Metro Irarrázaval",
      metaDescription:
        "Dos departamentos full equipados en Barrio Italia, Metro Irarrázaval. Superhost, check-in autónomo y reserva directa en Airbnb.",
      eyebrow: "Barrio Italia",
      headline: "Alojamiento en Barrio Italia / Metro Irarrázaval",
      subhead:
        "Dos unidades en el mismo edificio: barrio residencial, gastronomía caminable y metro a pocas cuadras. Base cómoda para conciertos, deporte o turismo en Santiago.",
      heroMeta: "2 deptos · Metro Irarrázaval · Superhost",
      whyTitle: "Por qué este edificio",
      whyPoints: [
        "Barrio Italia a ~1 km: cafés, diseño y vida de barrio los fines de semana",
        "Metro Irarrázaval para moverte sin auto por Santiago",
        "Estadio Nacional y Movistar Arena a distancia razonable en metro o rideshare",
        "Dos unidades en el mismo edificio: ideal si viajan parejas o familias pequeñas",
        "Check-in autónomo con cerradura digital en varias unidades",
        "Reserva directa en Airbnb con anfitriones Superhost",
      ],
      attractionsTitle: "Cerca de este edificio",
      attractionsBody:
        "Lugares a los que llegas fácil desde Santa Elena / Irarrázaval.",
      unitsTitle: "Unidades disponibles",
      unitsBody: (n) =>
        `${n} departamento${n === 1 ? "" : "s"} full equipado${n === 1 ? "" : "s"} en este edificio. Hasta 3 huéspedes, cama matrimonial y sofá-cama.`,
      mapTitle: "Ubicación",
      mapBody: "Barrio Italia / Metro Irarrázaval — zona residencial bien conectada.",
      ctaSee: "Ver unidades",
      ctaMap: "Ver mapa",
      seeAllBuildings: "Ver todos los alojamientos en Santiago",
      paySafe: "Pago seguro · cancelación según política del anuncio",
      footerStay: "Alojamiento independiente en Barrio Italia",
      footerDisclaimer:
        "Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. No gestionamos arriendos ni cobramos reservas: solo mostramos opciones y te redirigimos al anuncio oficial.",
    },
    en: {
      metaTitle: "Barrio Italia stay · Irarrázaval Metro",
      metaDescription:
        "Two fully equipped apartments in Barrio Italia, near Irarrázaval Metro. Superhost, self check-in, book direct on Airbnb.",
      eyebrow: "Barrio Italia",
      headline: "Stay in Barrio Italia / Irarrázaval Metro",
      subhead:
        "Two units in the same building: residential neighborhood, walkable food scene and metro nearby. A comfortable base for concerts, sports or sightseeing in Santiago.",
      heroMeta: "2 stays · Irarrázaval Metro · Superhost",
      whyTitle: "Why this building",
      whyPoints: [
        "Barrio Italia ~1 km away: cafés, design shops and weekend street life",
        "Irarrázaval Metro to get around Santiago without a car",
        "Estadio Nacional and Movistar Arena within easy reach by metro or rideshare",
        "Two units in the same building — handy for couples or small groups",
        "Self check-in with digital lock on several listings",
        "Book direct on Airbnb with Superhost hosts",
      ],
      attractionsTitle: "Near this building",
      attractionsBody: "Places you can reach easily from Santa Elena / Irarrázaval.",
      unitsTitle: "Available units",
      unitsBody: (n) =>
        `${n} fully equipped apartment${n === 1 ? "" : "s"} in this building. Up to 3 guests, queen bed and sofa bed.`,
      mapTitle: "Location",
      mapBody: "Barrio Italia / Irarrázaval Metro — well-connected residential area.",
      ctaSee: "See units",
      ctaMap: "See map",
      seeAllBuildings: "See all stays in Santiago",
      paySafe: "Secure payment · cancellation per listing policy",
      footerStay: "Independent stay in Barrio Italia",
      footerDisclaimer:
        "This site is not part of Airbnb and is not affiliated with Airbnb, Inc. We do not manage rentals or take bookings — we only show options and send you to the official listing.",
    },
    pt: {
      metaTitle: "Alojamento Barrio Italia · Metrô Irarrázaval",
      metaDescription:
        "Dois apartamentos totalmente equipados no Barrio Italia, perto do Metrô Irarrázaval. Superhost, check-in autônomo e reserva direta no Airbnb.",
      eyebrow: "Barrio Italia",
      headline: "Alojamento no Barrio Italia / Metrô Irarrázaval",
      subhead:
        "Duas unidades no mesmo edifício: bairro residencial, gastronomia a pé e metrô perto. Base confortável para shows, esporte ou turismo em Santiago.",
      heroMeta: "2 acomodações · Metrô Irarrázaval · Superhost",
      whyTitle: "Por que este edifício",
      whyPoints: [
        "Barrio Italia a ~1 km: cafés, design e vida de bairro nos fins de semana",
        "Metrô Irarrázaval para circular sem carro por Santiago",
        "Estadio Nacional e Movistar Arena a distância razoável de metrô ou app",
        "Duas unidades no mesmo edifício — ideal para casais ou famílias pequenas",
        "Check-in autônomo com fechadura digital em várias unidades",
        "Reserva direta no Airbnb com anfitriões Superhost",
      ],
      attractionsTitle: "Perto deste edifício",
      attractionsBody: "Lugares a que você chega fácil a partir de Santa Elena / Irarrázaval.",
      unitsTitle: "Unidades disponíveis",
      unitsBody: (n) =>
        `${n} apartamento${n === 1 ? "" : "s"} totalmente equipado${n === 1 ? "" : "s"} neste edifício. Até 3 hóspedes, cama de casal e sofá-cama.`,
      mapTitle: "Localização",
      mapBody: "Barrio Italia / Metrô Irarrázaval — zona residencial bem conectada.",
      ctaSee: "Ver unidades",
      ctaMap: "Ver mapa",
      seeAllBuildings: "Ver todos os alojamentos em Santiago",
      paySafe: "Pagamento seguro · cancelamento conforme o anúncio",
      footerStay: "Hospedagem independente no Barrio Italia",
      footerDisclaimer:
        "Este site não faz parte do Airbnb e não é afiliado à Airbnb, Inc. Não gerenciamos aluguéis nem cobramos reservas: só mostramos opções e redirecionamos para o anúncio oficial.",
    },
  },
  "edificio-nunoa-estadio": {
    es: {
      metaTitle: "Alojamiento Ñuñoa · Estadio Nacional",
      metaDescription:
        "Dos departamentos en Zañartu, a pasos del Estadio Nacional. Estacionamiento incluido, Superhost y reserva en Airbnb.",
      eyebrow: "Ñuñoa",
      headline: "Alojamiento en Ñuñoa / Estadio Nacional",
      subhead:
        "Dos unidades en Zañartu 2075: a ~15 min a pie del Estadio Nacional, con estacionamiento incluido. Ideal para partidos, maratones, conciertos masivos y eventos deportivos.",
      heroMeta: "2 deptos · Estacionamiento · Superhost",
      whyTitle: "Por qué este edificio",
      whyPoints: [
        "Estadio Nacional a ~0,9 km: llegas caminando o en pocos minutos en auto",
        "Estacionamiento incluido — clave si vienes en auto al recinto",
        "Metro Estadio Nacional y Ñuble para moverte por Santiago",
        "Barrio residencial de Ñuñoa, tranquilo entre jornadas de evento",
        "Dos unidades en el mismo edificio para delegaciones o familias",
        "Check-in autónomo y anfitriones Superhost en Airbnb",
      ],
      attractionsTitle: "Cerca de este edificio",
      attractionsBody: "Recintos y barrios a los que llegas fácil desde Zañartu.",
      unitsTitle: "Unidades disponibles",
      unitsBody: (n) =>
        `${n} departamento${n === 1 ? "" : "s"} con estacionamiento en este edificio. Hasta 3 huéspedes por unidad.`,
      mapTitle: "Ubicación",
      mapBody: "Ñuñoa (Zañartu) — a pasos del Estadio Nacional.",
      ctaSee: "Ver unidades",
      ctaMap: "Ver mapa",
      seeAllBuildings: "Ver todos los alojamientos en Santiago",
      paySafe: "Pago seguro · cancelación según política del anuncio",
      footerStay: "Alojamiento independiente en Ñuñoa",
      footerDisclaimer:
        "Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. No gestionamos arriendos ni cobramos reservas: solo mostramos opciones y te redirigimos al anuncio oficial.",
    },
    en: {
      metaTitle: "Ñuñoa stay · Estadio Nacional",
      metaDescription:
        "Two apartments on Zañartu, steps from Estadio Nacional. Parking included, Superhost, book on Airbnb.",
      eyebrow: "Ñuñoa",
      headline: "Stay in Ñuñoa / Estadio Nacional",
      subhead:
        "Two units at Zañartu 2075: ~15 min walk to Estadio Nacional with parking included. Built for matches, marathons, big concerts and sports events.",
      heroMeta: "2 stays · Parking · Superhost",
      whyTitle: "Why this building",
      whyPoints: [
        "Estadio Nacional ~0.9 km away: walk or a short drive to the venue",
        "Parking included — essential if you're driving to the stadium",
        "Estadio Nacional and Ñuble Metro stations nearby",
        "Quiet residential Ñuñoa between long event days",
        "Two units in the same building for teams or families",
        "Self check-in and Superhost listings on Airbnb",
      ],
      attractionsTitle: "Near this building",
      attractionsBody: "Venues and neighborhoods you can reach easily from Zañartu.",
      unitsTitle: "Available units",
      unitsBody: (n) =>
        `${n} apartment${n === 1 ? "" : "s"} with parking in this building. Up to 3 guests per unit.`,
      mapTitle: "Location",
      mapBody: "Ñuñoa (Zañartu) — steps from Estadio Nacional.",
      ctaSee: "See units",
      ctaMap: "See map",
      seeAllBuildings: "See all stays in Santiago",
      paySafe: "Secure payment · cancellation per listing policy",
      footerStay: "Independent stay in Ñuñoa",
      footerDisclaimer:
        "This site is not part of Airbnb and is not affiliated with Airbnb, Inc. We do not manage rentals or take bookings — we only show options and send you to the official listing.",
    },
    pt: {
      metaTitle: "Alojamento Ñuñoa · Estadio Nacional",
      metaDescription:
        "Dois apartamentos na Zañartu, perto do Estadio Nacional. Estacionamento incluído, Superhost e reserva no Airbnb.",
      eyebrow: "Ñuñoa",
      headline: "Alojamento em Ñuñoa / Estadio Nacional",
      subhead:
        "Duas unidades na Zañartu 2075: ~15 min a pé do Estadio Nacional, com estacionamento incluído. Ideal para jogos, maratonas, shows e eventos esportivos.",
      heroMeta: "2 acomodações · Estacionamento · Superhost",
      whyTitle: "Por que este edifício",
      whyPoints: [
        "Estadio Nacional a ~0,9 km: caminhada ou poucos minutos de carro",
        "Estacionamento incluído — essencial se for de carro ao estádio",
        "Metrô Estadio Nacional e Ñuble perto",
        "Bairro residencial de Ñuñoa, tranquilo entre dias de evento",
        "Duas unidades no mesmo edifício para delegações ou famílias",
        "Check-in autônomo e anúncios Superhost no Airbnb",
      ],
      attractionsTitle: "Perto deste edifício",
      attractionsBody: "Recintos e bairros a que você chega fácil a partir da Zañartu.",
      unitsTitle: "Unidades disponíveis",
      unitsBody: (n) =>
        `${n} apartamento${n === 1 ? "" : "s"} com estacionamento neste edifício. Até 3 hóspedes por unidade.`,
      mapTitle: "Localização",
      mapBody: "Ñuñoa (Zañartu) — perto do Estadio Nacional.",
      ctaSee: "Ver unidades",
      ctaMap: "Ver mapa",
      seeAllBuildings: "Ver todos os alojamentos em Santiago",
      paySafe: "Pagamento seguro · cancelamento conforme o anúncio",
      footerStay: "Hospedagem independente em Ñuñoa",
      footerDisclaimer:
        "Este site não faz parte do Airbnb e não é afiliado à Airbnb, Inc. Não gerenciamos aluguéis nem cobramos reservas: só mostramos opções e redirecionamos para o anúncio oficial.",
    },
  },
  "edificio-toesca-centro": {
    es: {
      metaTitle: "Alojamiento Metro Toesca · Movistar Arena",
      metaDescription:
        "Departamento full equipado en Toesca 112, cerca de Movistar Arena, Parque O'Higgins y Fantasilandia. Superhost en Airbnb.",
      eyebrow: "Santiago Centro",
      headline: "Alojamiento en Metro Toesca / Movistar Arena",
      subhead:
        "Un departamento en Toesca 112: a ~1 km de Movistar Arena y Parque O'Higgins. Metro Toesca a pocas cuadras — base ideal para conciertos, ferias y planes familiares.",
      heroMeta: "1 depto · Metro Toesca · Superhost",
      whyTitle: "Por qué este edificio",
      whyPoints: [
        "Movistar Arena ~1,1 km: conciertos y eventos masivos en Parque O'Higgins",
        "Fantasilandia y Parque O'Higgins a distancia caminable",
        "Metro Toesca para cruzar Santiago sin auto",
        "Club Hípico y eventos ecuestres en la misma zona",
        "Check-in autónomo con cerradura digital",
        "Reserva directa en Airbnb con anfitrión Superhost",
      ],
      attractionsTitle: "Cerca de este edificio",
      attractionsBody:
        "Recintos y parques alrededor de Toesca y Parque O'Higgins.",
      unitsTitle: "Unidad disponible",
      unitsBody: (n) =>
        `${n} departamento full equipado. Hasta 3 huéspedes, cama matrimonial y sofá-cama.`,
      mapTitle: "Ubicación",
      mapBody: "Toesca / Parque O'Higgins — zona de conciertos y eventos masivos.",
      ctaSee: "Ver unidad",
      ctaMap: "Ver mapa",
      seeAllBuildings: "Ver todos los alojamientos en Santiago",
      paySafe: "Pago seguro · cancelación según política del anuncio",
      footerStay: "Alojamiento independiente en Santiago Centro",
      footerDisclaimer:
        "Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. No gestionamos arriendos ni cobramos reservas: solo mostramos opciones y te redirigimos al anuncio oficial.",
    },
    en: {
      metaTitle: "Toesca Metro stay · Movistar Arena",
      metaDescription:
        "Fully equipped apartment at Toesca 112, near Movistar Arena, Parque O'Higgins and Fantasilandia. Superhost on Airbnb.",
      eyebrow: "Santiago Centro",
      headline: "Stay at Toesca Metro / Movistar Arena",
      subhead:
        "One apartment at Toesca 112: ~1 km from Movistar Arena and Parque O'Higgins. Toesca Metro a few blocks away — a strong base for concerts, fairs and family plans.",
      heroMeta: "1 stay · Toesca Metro · Superhost",
      whyTitle: "Why this building",
      whyPoints: [
        "Movistar Arena ~1.1 km: major concerts in Parque O'Higgins",
        "Fantasilandia and Parque O'Higgins within walking distance",
        "Toesca Metro to cross Santiago without a car",
        "Club Hípico and equestrian events in the same area",
        "Self check-in with digital lock",
        "Book direct on Airbnb with a Superhost",
      ],
      attractionsTitle: "Near this building",
      attractionsBody: "Venues and parks around Toesca and Parque O'Higgins.",
      unitsTitle: "Available unit",
      unitsBody: (n) =>
        `${n} fully equipped apartment. Up to 3 guests, queen bed and sofa bed.`,
      mapTitle: "Location",
      mapBody: "Toesca / Parque O'Higgins — concert and mega-event zone.",
      ctaSee: "See unit",
      ctaMap: "See map",
      seeAllBuildings: "See all stays in Santiago",
      paySafe: "Secure payment · cancellation per listing policy",
      footerStay: "Independent stay in Santiago Centro",
      footerDisclaimer:
        "This site is not part of Airbnb and is not affiliated with Airbnb, Inc. We do not manage rentals or take bookings — we only show options and send you to the official listing.",
    },
    pt: {
      metaTitle: "Alojamento Metrô Toesca · Movistar Arena",
      metaDescription:
        "Apartamento totalmente equipado na Toesca 112, perto da Movistar Arena, Parque O'Higgins e Fantasilandia. Superhost no Airbnb.",
      eyebrow: "Santiago Centro",
      headline: "Alojamento no Metrô Toesca / Movistar Arena",
      subhead:
        "Uma unidade na Toesca 112: ~1 km da Movistar Arena e do Parque O'Higgins. Metrô Toesca a poucas quadras — base ideal para shows, feiras e planos em família.",
      heroMeta: "1 acomodação · Metrô Toesca · Superhost",
      whyTitle: "Por que este edifício",
      whyPoints: [
        "Movistar Arena ~1,1 km: shows e eventos grandes no Parque O'Higgins",
        "Fantasilandia e Parque O'Higgins a distância caminhável",
        "Metrô Toesca para cruzar Santiago sem carro",
        "Club Hípico e eventos equestres na mesma zona",
        "Check-in autônomo com fechadura digital",
        "Reserva direta no Airbnb com anfitrião Superhost",
      ],
      attractionsTitle: "Perto deste edifício",
      attractionsBody: "Recintos e parques ao redor de Toesca e Parque O'Higgins.",
      unitsTitle: "Unidade disponível",
      unitsBody: (n) =>
        `${n} apartamento totalmente equipado. Até 3 hóspedes, cama de casal e sofá-cama.`,
      mapTitle: "Localização",
      mapBody: "Toesca / Parque O'Higgins — zona de shows e megaeventos.",
      ctaSee: "Ver unidade",
      ctaMap: "Ver mapa",
      seeAllBuildings: "Ver todos os alojamentos em Santiago",
      paySafe: "Pagamento seguro · cancelamento conforme o anúncio",
      footerStay: "Hospedagem independente em Santiago Centro",
      footerDisclaimer:
        "Este site não faz parte do Airbnb e não é afiliado à Airbnb, Inc. Não gerenciamos aluguéis nem cobramos reservas: só mostramos opções e redirecionamos para o anúncio oficial.",
    },
  },
};

export function getBuildingPageCopy(buildingId: string, locale: Locale) {
  return COPY[buildingId]?.[locale] ?? COPY[buildingId]?.es;
}

export function getBuildingPageAttractions(building: StayBuilding, locale: Locale) {
  return getStayBuildingNearbyPois(building).map((poi) => ({
    id: poi.id,
    name: poi.name,
    blurb: POI_BLURB[poi.id]?.[locale] ?? poi.description,
  }));
}

export function getBuildingStayProperties(
  buildingId: string,
  locale: Locale,
): CampaignPackProperty[] {
  return getCatalogStayProperties(locale).filter((p) => {
    const prop = getPropertiesForStayBuilding(buildingId).find((x) => x.slug === p.slug);
    return Boolean(prop);
  });
}

export function getBuildingPublicLocation(building: StayBuilding) {
  return publicPropertyLocation(building.neighborhood, building.address);
}

export function resolveBuildingPage(buildingId: string) {
  const building = getStayBuilding(buildingId);
  if (!building) return null;
  return building;
}

export function getBuildingLocationHighlights(
  buildingId: string,
  locale: Locale,
): string[] {
  const prop = getPropertiesForStayBuilding(buildingId)[0];
  if (!prop) return [];
  return buildCatalogLocationHighlights(prop, locale);
}
