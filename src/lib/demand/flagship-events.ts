/**
 * Eventos insignia: el mismo tratamiento editorial “potente” de Guerreras
 * (guía + landing + share-card + mailing) reutilizable por deporte.
 */
import type { Locale } from "@/lib/i18n/locale";
import { formatDateRangeHuman } from "./dates";
import { stayNearStadiumPhrase } from "./venue-proximity-copy";

export type EventCopyOverride = {
  shortTitle?: string;
  eventSummary?: string;
  eventDescription?: string;
  headline?: string;
  subhead?: string;
  mustKnow?: string[];
  news?: string[];
  trustPoints?: string[];
};

export type EventCopyOverrideInput = {
  eventTitle: string;
  eventDates: string;
  eventStartsOn: string;
  eventEndsOn: string;
  venueName: string;
  properties: Array<{ walkingMinutes?: number }>;
};

export type FlagshipStat = { value: string; label: string };

export type FlagshipBrand = {
  badge: string;
  title: string;
  subtitle: string;
  venueLine: string;
  stats: FlagshipStat[];
  tips: string[];
  ctaLabel: string;
  cta: string;
};

export type FlagshipLandingUi = {
  whyTitle: string;
  whyBody: (venue: string) => string;
  unitsBody: (venue: string) => string;
  urgencyNote: (dates: string) => string;
  closeTitle: string;
  closeBody: (dates: string, venue: string) => string;
};

export type FlagshipMailing = {
  subject: string;
  bodyLines: string[];
};

export type FlagshipSportEvent = {
  id: string;
  /** Deporte para matching de orgs / listas Brevo */
  sportHints: string[];
  brevoListName: string;
  coverRel: string;
  match: (title: string) => boolean;
  brand: (locale: Locale) => FlagshipBrand;
  landing: (locale: Locale) => FlagshipLandingUi;
  mailing: (ctx: {
    eventTitle: string;
    eventDates: string;
    venueName: string;
    landingUrl: string;
  }) => FlagshipMailing;
  /** Copy de microsite/landing; null = usar template genérico + brand */
  buildCopy?: (
    pack: EventCopyOverrideInput,
    locale: Locale,
    nearestMins?: number,
  ) => EventCopyOverride;
};

function t(locale: Locale, es: string, en: string, pt: string): string {
  if (locale === "en") return en;
  if (locale === "pt") return pt;
  return es;
}

function datesOf(pack: EventCopyOverrideInput, locale: Locale) {
  return formatDateRangeHuman(
    pack.eventStartsOn,
    pack.eventEndsOn,
    locale === "pt" ? "pt" : locale === "en" ? "en" : "es",
  );
}

/* ─── Guerreras (registrado; copy sigue en microsite-event-overrides) ─── */

const guerreras: FlagshipSportEvent = {
  id: "guerreras-u17-2026",
  sportHints: ["voleibol", "volley"],
  brevoListName: "Voleibol",
  coverRel: "guides/deportes/volleyball-accion.jpg",
  match: (title) =>
    /mundial.*u17.*voleibol|voleibol.*u17.*mundial|mundial femenino u17/i.test(
      title,
    ),
  brand: (locale) => {
    if (locale === "en") {
      return {
        badge: "HISTORIC · CHILE 2026",
        title: "Cheer on the Guerreras",
        subtitle:
          "Chile's first volleyball World Championship at home — for delegations, staff, families and fans",
        venueLine: "Estadio Nacional · Ñuñoa",
        stats: [
          { value: "24", label: "TEAMS" },
          { value: "9/14", label: "FROM REGIONS" },
          { value: "20:00", label: "DEBUT AUG 6" },
        ],
        tips: [
          "Location: Estadio Nacional · Ñuñoa",
          "Nearby metro: Estadio Nacional and Ñuble",
          "Chile debut: Aug 6 at 20:00 vs Czechia",
        ],
        ctaLabel: "NEAR THE VENUE",
        cta: "Find a stay nearby on Crambie",
      };
    }
    if (locale === "pt") {
      return {
        badge: "HISTÓRICO · CHILE 2026",
        title: "Apoie as Guerreiras",
        subtitle:
          "O primeiro Mundial de vôlei do Chile em casa — para delegações, staff, famílias e torcida",
        venueLine: "Estadio Nacional · Ñuñoa",
        stats: [
          { value: "24", label: "SELEÇÕES" },
          { value: "9/14", label: "DE REGIÕES" },
          { value: "20:00", label: "ESTREIA 6 AGO" },
        ],
        tips: [
          "Local: Estadio Nacional · Ñuñoa",
          "Metrô perto: Estadio Nacional e Ñuble",
          "Estreia do Chile: 6 ago às 20h vs Tchéquia",
        ],
        ctaLabel: "PERTO DO RECINTO",
        cta: "Encontre uma hospedagem perto na Crambie",
      };
    }
    return {
      badge: "HISTÓRICO · CHILE 2026",
      title: "Apoya a las Guerreras",
      subtitle:
        "El primer Mundial de vóleibol de Chile, en casa — para delegaciones, staff, familias e hinchada",
      venueLine: "Estadio Nacional · Ñuñoa",
      stats: [
        { value: "24", label: "SELECCIONES" },
        { value: "9/14", label: "DE REGIONES" },
        { value: "20:00", label: "DEBUT 6 AGO" },
      ],
      tips: [
        "Ubicación: Estadio Nacional · Ñuñoa",
        "Metro cercano: Estadio Nacional y Ñuble",
        "Debut Chile: 6 ago 20:00 vs República Checa",
      ],
      ctaLabel: "CERCA DEL RECINTO",
      cta: "Encuentra un alojamiento cerca en Crambie",
    };
  },
  landing: (locale) => {
    if (locale === "en") {
      return {
        whyTitle: "A base near the court for the whole World Cup",
        whyBody: (venue) =>
          `Chile's Guerreras are writing history at home. Staying near ${venue} works for delegations, staff, families and fans: you get to the gym on time and sleep nearby after long days.`,
        unitsBody: (venue) =>
          `Sorted by distance to ${venue}. World Cup dates fill up fast nearby — book soon on Airbnb (protected payment).`,
        urgencyNote: (dates) =>
          `Stays near the stadium for ${dates} fill up fast. Worth booking soon.`,
        closeTitle: "Book your base near the venue",
        closeBody: (dates, venue) =>
          `Dates around ${dates} fill up fast near ${venue} — teams, staff, families and clubs are traveling for the World Cup. Book on Airbnb to lock in your stay.`,
      };
    }
    if (locale === "pt") {
      return {
        whyTitle: "Uma base perto da quadra para todo o Mundial",
        whyBody: (venue) =>
          `As Guerreiras do Chile escrevem história em casa. Ficar perto de ${venue} serve para delegações, staff, famílias e torcida: você chega a tempo e dorme perto depois de jornadas longas.`,
        unitsBody: (venue) =>
          `Ordenados pela proximidade a ${venue}. Nas datas do Mundial as opções perto esgotam rápido — reserve logo no Airbnb (pagamento protegido).`,
        urgencyNote: (dates) =>
          `As hospedagens perto do Estádio para ${dates} esgotam rápido. Vale reservar logo.`,
        closeTitle: "Reserve sua base perto do recinto",
        closeBody: (dates, venue) =>
          `As datas de ${dates} enchem rápido perto de ${venue} — seleções, staff, famílias e clubes viajam pelo Mundial. Reserve no Airbnb e garanta a estadia.`,
      };
    }
    return {
      whyTitle: "Base cerca de la cancha para todo el Mundial",
      whyBody: (venue) =>
        `Las Guerreras escriben historia en casa. Quedarte cerca de ${venue} sirve para delegaciones, staff, familias e hinchada: llegas a tiempo al recinto y duermes cerca después de jornadas largas.`,
      unitsBody: (venue) =>
        `Ordenados por cercanía a ${venue}. En fechas de Mundial se llenan rápido cerca del Estadio: conviene reservar pronto en Airbnb (pago protegido).`,
      urgencyNote: (dates) =>
        `Los alojamientos cerca del Estadio para ${dates} se llenan rápido. Conviene reservar pronto.`,
      closeTitle: "Reserva tu base cerca del recinto",
      closeBody: (dates, venue) =>
        `Las fechas de ${dates} se llenan rápido cerca de ${venue}: selecciones, staff, familias y clubes viajan por el Mundial. Arriendas en Airbnb y aseguras tu estadía.`,
    };
  },
  mailing: ({ eventDates, venueName, landingUrl }) => ({
    subject: `[Santiago] Mundial Guerreras: alojamiento para delegaciones, staff y familias · ${eventDates}`,
    bodyLines: [
      "Hola,",
      "",
      `Chile organiza su primer Mundial de vóleibol (${eventDates}). Llegan delegaciones, staff, familias e hinchada de regiones.`,
      `Quédate a pasos del ${venueName}: barrio seguro, metro cerca y reserva directa en Airbnb.`,
      "En estas fechas los alojamientos cerca del Estadio se llenan rápido: conviene reservar pronto.",
      "",
      landingUrl,
    ],
  }),
};

/* ─── Copa Davis ─── */

const copaDavis: FlagshipSportEvent = {
  id: "copa-davis-2026",
  sportHints: ["tenis", "tennis", "davis"],
  brevoListName: "Tenis",
  coverRel: "guides/deportes/estadio-nacional.png",
  match: (title) => /copa\s*davis/i.test(title),
  brand: (locale) => {
    if (locale === "en") {
      return {
        badge: "DAVIS CUP · CHILE 2026",
        title: "Chile hosts Davis Cup",
        subtitle:
          "Home rubbers for the national team — players, staff, federations and fans traveling to Santiago",
        venueLine: "Court Central · Parque Estadio Nacional",
        stats: [
          { value: "CL", label: "HOME" },
          { value: "5", label: "RUBBERS" },
          { value: "ÑUÑOA", label: "VENUE" },
        ],
        tips: [
          "Venue: Court Central · Parque Estadio Nacional",
          "Nearby metro: Estadio Nacional and Ñuble",
          "Built for teams, staff, federations and traveling fans",
        ],
        ctaLabel: "NEAR THE COURT",
        cta: "Find a stay nearby on Crambie",
      };
    }
    if (locale === "pt") {
      return {
        badge: "COPA DAVIS · CHILE 2026",
        title: "Chile recebe a Copa Davis",
        subtitle:
          "Jogos em casa da seleção — atletas, staff, federações e torcida viajando a Santiago",
        venueLine: "Court Central · Parque Estadio Nacional",
        stats: [
          { value: "CL", label: "CASA" },
          { value: "5", label: "JOGOS" },
          { value: "ÑUÑOA", label: "SEDE" },
        ],
        tips: [
          "Local: Court Central · Parque Estadio Nacional",
          "Metrô perto: Estadio Nacional e Ñuble",
          "Para equipes, staff, federações e torcida viajante",
        ],
        ctaLabel: "PERTO DA QUADRA",
        cta: "Encontre uma hospedagem perto na Crambie",
      };
    }
    return {
      badge: "COPA DAVIS · CHILE 2026",
      title: "Chile recibe la Copa Davis",
      subtitle:
        "Series en casa de la Roja del tenis — jugadores, staff, federaciones e hinchada que viajan a Santiago",
      venueLine: "Court Central · Parque Estadio Nacional",
      stats: [
        { value: "CL", label: "LOCAL" },
        { value: "5", label: "PUNTOS" },
        { value: "ÑUÑOA", label: "SEDE" },
      ],
      tips: [
        "Ubicación: Court Central · Parque Estadio Nacional",
        "Metro cercano: Estadio Nacional y Ñuble",
        "Para selecciones, staff, federaciones e hinchada viajera",
      ],
      ctaLabel: "CERCA DE LA CANCHA",
      cta: "Encuentra un alojamiento cerca en Crambie",
    };
  },
  landing: (locale) => {
    if (locale === "en") {
      return {
        whyTitle: "A base near Court Central for Davis Cup",
        whyBody: (venue) =>
          `Davis Cup weekends fill Ñuñoa with teams, coaches and traveling fans. Staying near ${venue} means short transfers and rest between rubbers.`,
        unitsBody: (venue) =>
          `Sorted by distance to ${venue}. Davis Cup dates fill up fast — book soon on Airbnb.`,
        urgencyNote: (dates) =>
          `Stays near the tennis complex for ${dates} fill up fast. Worth booking soon.`,
        closeTitle: "Book your base for Davis Cup",
        closeBody: (dates, venue) =>
          `Around ${dates}, rooms near ${venue} go quickly with federations and fans in town. Lock in your stay on Airbnb.`,
      };
    }
    if (locale === "pt") {
      return {
        whyTitle: "Uma base perto do Court Central na Copa Davis",
        whyBody: (venue) =>
          `A Copa Davis enche Ñuñoa com equipes, técnicos e torcida. Ficar perto de ${venue} encurta o traslado e permite descansar entre os jogos.`,
        unitsBody: (venue) =>
          `Ordenados por proximidade a ${venue}. Nas datas da Copa Davis as opções esgotam rápido — reserve logo no Airbnb.`,
        urgencyNote: (dates) =>
          `As hospedagens perto do complexo de tênis para ${dates} esgotam rápido. Vale reservar logo.`,
        closeTitle: "Reserve sua base para a Copa Davis",
        closeBody: (dates, venue) =>
          `Em torno de ${dates}, os aptos perto de ${venue} somem com federações e torcida na cidade. Garanta no Airbnb.`,
      };
    }
    return {
      whyTitle: "Base cerca del Court Central para la Copa Davis",
      whyBody: (venue) =>
        `La Copa Davis llena Ñuñoa de selecciones, cuerpo técnico e hinchada viajera. Quedarte cerca de ${venue} acorta traslados y permite descansar entre puntos.`,
      unitsBody: (venue) =>
        `Ordenados por cercanía a ${venue}. En fechas de Copa Davis se llenan rápido: conviene reservar pronto en Airbnb.`,
      urgencyNote: (dates) =>
        `Los alojamientos cerca del complejo de tenis para ${dates} se llenan rápido. Conviene reservar pronto.`,
      closeTitle: "Reserva tu base para la Copa Davis",
      closeBody: (dates, venue) =>
        `En torno a ${dates}, cerca de ${venue} se llena con federaciones e hinchada. Arriendas en Airbnb y aseguras tu estadía.`,
    };
  },
  buildCopy: (pack, locale, nearestMins) => {
    const dates = datesOf(pack, locale);
    const mins = nearestMins ?? pack.properties[0]?.walkingMinutes ?? 12;
    const stayNear = stayNearStadiumPhrase(
      mins,
      locale,
      "Court Central / Parque Estadio Nacional",
    );
    return {
      shortTitle: t(locale, "Copa Davis en Santiago", "Davis Cup in Santiago", "Copa Davis em Santiago"),
      headline: t(
        locale,
        `Copa Davis en casa — quédate cerca del Court Central`,
        `Davis Cup at home — stay near Court Central`,
        `Copa Davis em casa — fique perto do Court Central`,
      ),
      subhead: t(
        locale,
        `${dates}. Chile recibe series de Copa Davis en el Parque Estadio Nacional. Ideal para jugadores, staff, federaciones, asociaciones de tenis e hinchada que viaja.\n\n${stayNear}. Metro, barrio seguro y reserva directa en Airbnb.`,
        `${dates}. Chile hosts Davis Cup ties at Parque Estadio Nacional. Built for players, staff, tennis federations and traveling fans.\n\n${stayNear}. Metro, safe area, book direct on Airbnb.`,
        `${dates}. O Chile recebe a Copa Davis no Parque Estadio Nacional. Para atletas, staff, federações de tênis e torcida viajante.\n\n${stayNear}. Metrô, bairro seguro e reserva direta no Airbnb.`,
      ),
      mustKnow: [
        t(
          locale,
          "Sede: Court Central / complejo tenístico del Parque Estadio Nacional, Ñuñoa.",
          "Venue: Court Central / tennis complex at Parque Estadio Nacional, Ñuñoa.",
          "Sede: Court Central / complexo de tênis do Parque Estadio Nacional, Ñuñoa.",
        ),
        t(
          locale,
          "Público: selecciones, staff, federaciones, asociaciones regionales y clubes de tenis.",
          "Audience: teams, staff, federations, regional associations and tennis clubs.",
          "Público: seleções, staff, federações, associações regionais e clubes de tênis.",
        ),
        t(
          locale,
          "Metro cercano: Estadio Nacional y Ñuble. Conviene reservar pronto en fechas de series.",
          "Nearby metro: Estadio Nacional and Ñuble. Book early around tie weekends.",
          "Metrô perto: Estadio Nacional e Ñuble. Reserve cedo nas datas das series.",
        ),
      ],
      trustPoints: [
        stayNear,
        t(
          locale,
          "Pensado para federaciones, clubes, staff e hinchada de regiones",
          "Built for federations, clubs, staff and regional fans",
          "Pensado para federações, clubes, staff e torcida de regiões",
        ),
        t(
          locale,
          "Ñuñoa: barrio seguro con metro Estadio Nacional / Ñuble",
          "Ñuñoa: safe neighborhood with Estadio Nacional / Ñuble metro",
          "Ñuñoa: bairro seguro com metrô Estadio Nacional / Ñuble",
        ),
        t(
          locale,
          "Reserva directa en Airbnb: pago protegido y reseñas reales",
          "Book direct on Airbnb: protected payment and real reviews",
          "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
        ),
      ],
    };
  },
  mailing: ({ eventTitle, eventDates, venueName, landingUrl }) => ({
    subject: `Copa Davis en Santiago: quédate a pasos del Court Central · Estadio Nacional`,
    bodyLines: [
      "Hola,",
      "",
      `Por ${eventTitle} (${eventDates}) Chile recibe series de Copa Davis en ${venueName}.`,
      "Armamos alojamientos a pasos del Court Central para federaciones, asociaciones, clubes, staff e hinchada.",
      "Reserva directa en Airbnb: metro Estadio Nacional / Ñuble, barrio seguro y base cerca de la cancha.",
      "En fechas de Davis los alojamientos en Ñuñoa se llenan rápido: conviene reservar pronto.",
      "",
      landingUrl,
    ],
  }),
};

/* ─── FEDACHI Marathon Sudamericano 2026 ─── */

const fedachiMarathonFlagship: FlagshipSportEvent = {
  id: "fedachi-marathon-2026",
  sportHints: ["atletismo", "athletics", "running", "maraton"],
  brevoListName: "Atletismo",
  coverRel: "guides/deportes/atletismo.png",
  match: (title) =>
    /fedachi marathon|fedachimarathon|sudamericano marat[oó]n fedachi/i.test(
      title,
    ),
  brand: (locale) => {
    if (locale === "en") {
      return {
        badge: "MARATHON · SANTIAGO 2026",
        title: "FEDACHI Marathon South American 2026",
        subtitle:
          "~12,000 runners at Estadio Nacional — 5K, 10K, 21K and 42K · South American Championship by ASICS",
        venueLine: "Estadio Nacional · Ñuñoa",
        stats: [
          { value: "12K", label: "RUNNERS" },
          { value: "42K", label: "FINISH" },
          { value: "SUD", label: "CHAMP" },
        ],
        tips: [
          "Chile's official athletics marathon — World Athletics certified",
          "42K start and finish at Estadio Nacional; kit pickup 13–14 Nov",
          "For runners, clubs, federations and families from every region",
        ],
        ctaLabel: "NEAR THE START",
        cta: "Find a stay nearby on Crambie",
      };
    }
    if (locale === "pt") {
      return {
        badge: "MARATONA · SANTIAGO 2026",
        title: "FEDACHI Marathon Sul-Americano 2026",
        subtitle:
          "~12.000 corredores no Estadio Nacional — 5K, 10K, 21K e 42K · Campeonato Sul-Americano by ASICS",
        venueLine: "Estadio Nacional · Ñuñoa",
        stats: [
          { value: "12K", label: "CORREDORES" },
          { value: "42K", label: "META" },
          { value: "SUD", label: "CAMPEONATO" },
        ],
        tips: [
          "Maratona oficial do atletismo no Chile — certificada World Athletics",
          "42K com largada e chegada no Estadio Nacional; retirada de kit 13–14 nov",
          "Para corredores, clubes, federações e famílias de todas as regiões",
        ],
        ctaLabel: "PERTO DA LARGADA",
        cta: "Encontre uma hospedagem perto na Crambie",
      };
    }
    return {
      badge: "MARATÓN · SANTIAGO 2026",
      title: "FEDACHI Marathon Sudamericano 2026",
      subtitle:
        "~12.000 corredores en Estadio Nacional — 5K, 10K, 21K y 42K · Campeonato Sudamericano by ASICS",
      venueLine: "Estadio Nacional · Ñuñoa",
      stats: [
        { value: "12K", label: "CORREDORES" },
        { value: "42K", label: "META" },
        { value: "SUD", label: "CAMPEONATO" },
      ],
      tips: [
        "El maratón oficial del atletismo en Chile — certificado World Athletics",
        "42K con largada y meta en el Estadio Nacional; kit pickup 13–14 nov",
        "Para corredores, clubes, federaciones y familias de regiones",
      ],
      ctaLabel: "CERCA DE LA LARGADA",
      cta: "Encuentra un alojamiento cerca en Crambie",
    };
  },
  landing: (locale) => {
    if (locale === "en") {
      return {
        whyTitle: "A base near the start for marathon weekend",
        whyBody: (venue) =>
          `FEDACHI Marathon brings ~12,000 runners and supporters to ${venue}. Staying in Ñuñoa keeps kit pickup, race morning and the finish line within reach.`,
        unitsBody: (venue) =>
          `Sorted by distance to ${venue}. Marathon weekend fills up fast — book soon on Airbnb.`,
        urgencyNote: (dates) =>
          `Stays near Estadio Nacional for ${dates} fill up fast with runners and García Huidobro overlap. Worth booking early.`,
        closeTitle: "Book your base for FEDACHI Marathon",
        closeBody: (dates, venue) =>
          `Around ${dates}, rooms near ${venue} go quickly with ~12,000 runners in town. Book on Airbnb.`,
      };
    }
    if (locale === "pt") {
      return {
        whyTitle: "Uma base perto da largada no fim de semana do maratona",
        whyBody: (venue) =>
          `O FEDACHI Marathon reúne ~12.000 corredores e acompanhantes em ${venue}. Ficar em Ñuñoa facilita retirada de kit, manhã de prova e chegada.`,
        unitsBody: (venue) =>
          `Ordenados por proximidade a ${venue}. No fim de semana do maratona esgota rápido — reserve logo no Airbnb.`,
        urgencyNote: (dates) =>
          `Hospedagens perto do Estadio para ${dates} esgotam rápido com corredores e sobreposição com García Huidobro. Vale reservar cedo.`,
        closeTitle: "Reserve sua base para o FEDACHI Marathon",
        closeBody: (dates, venue) =>
          `Em torno de ${dates}, perto de ${venue} enche com ~12.000 corredores. Garanta no Airbnb.`,
      };
    }
    return {
      whyTitle: "Base cerca de la largada para el fin de semana del maratón",
      whyBody: (venue) =>
        `El FEDACHI Marathon convoca ~12.000 corredores y acompañantes en ${venue}. Quedarte en Ñuñoa facilita kit pickup, madrugada de carrera y meta.`,
      unitsBody: (venue) =>
        `Ordenados por cercanía a ${venue}. El fin de semana del maratón se llena rápido: conviene reservar pronto en Airbnb.`,
      urgencyNote: (dates) =>
        `Los alojamientos cerca del Estadio para ${dates} se llenan rápido con corredores y coincidencia con García Huidobro. Conviene reservar con anticipación.`,
      closeTitle: "Reserva tu base para el FEDACHI Marathon",
      closeBody: (dates, venue) =>
        `En torno a ${dates}, cerca de ${venue} se llena con ~12.000 corredores. Arriendas en Airbnb y aseguras tu estadía.`,
    };
  },
  mailing: ({ eventTitle, eventDates, venueName, landingUrl }) => ({
    subject: `FEDACHI Marathon Sudamericano: alojamiento cerca del Estadio Nacional · ${eventDates}`,
    bodyLines: [
      "Hola,",
      "",
      `Por ${eventTitle} (${eventDates}) se esperan ~12.000 corredores en ${venueName}.`,
      "Armamos alojamientos a pasos del Estadio Nacional para corredores, clubes, federaciones y familias que viajan.",
      "Ideal para kit pickup (13–14 nov) y largada matinal: metro Estadio Nacional / Ñuble, barrio seguro y reserva en Airbnb.",
      "El fin de semana del maratón en Ñuñoa se llena rápido: conviene reservar pronto.",
      "",
      landingUrl,
    ],
  }),
};

/* ─── Atletismo (Interescolar Final + Masters / FEDACHI potentes) ─── */

const atletismoFlagship: FlagshipSportEvent = {
  id: "atletismo-nacional-2026",
  sportHints: ["atletismo", "athletics", "interescolar", "fedachi", "cas"],
  brevoListName: "Atletismo",
  coverRel: "guides/deportes/atletismo.png",
  match: (title) =>
    /atletismo|interescolar|fedachi|marat[oó]n|posta de santiago|ram[oó]n sandoval|garc[ií]a huidobro|orlando guaita|mario correa/i.test(
      title,
    ) &&
    !/fedachi marathon|fedachimarathon|sudamericano marat[oó]n fedachi/i.test(
      title,
    ) &&
    !/hockey|voleibol|davis|futbol|fútbol/i.test(title),
  brand: (locale) => {
    if (locale === "en") {
      return {
        badge: "ATHLETICS · SANTIAGO 2026",
        title: "Race week in Santiago",
        subtitle:
          "National and school meets at Parque Estadio Nacional — athletes, coaches, associations and families from the regions",
        venueLine: "Parque Estadio Nacional · Ñuñoa",
        stats: [
          { value: "CAS", label: "HOST" },
          { value: "RM", label: "VENUE" },
          { value: "REG", label: "TRAVEL" },
        ],
        tips: [
          "Venue: Parque Estadio Nacional / Mario Recordón",
          "Nearby metro: Estadio Nacional and Ñuble",
          "For athletes, coaches, athletics associations and families",
        ],
        ctaLabel: "NEAR THE TRACK",
        cta: "Find a stay nearby on Crambie",
      };
    }
    if (locale === "pt") {
      return {
        badge: "ATLETISMO · SANTIAGO 2026",
        title: "Semana de pista em Santiago",
        subtitle:
          "Campeonatos e interescolares no Parque Estadio Nacional — atletas, técnicos, associações e famílias das regiões",
        venueLine: "Parque Estadio Nacional · Ñuñoa",
        stats: [
          { value: "CAS", label: "SEDE" },
          { value: "RM", label: "PISTA" },
          { value: "REG", label: "VIAGEM" },
        ],
        tips: [
          "Local: Parque Estadio Nacional / Mario Recordón",
          "Metrô perto: Estadio Nacional e Ñuble",
          "Para atletas, técnicos, associações e famílias",
        ],
        ctaLabel: "PERTO DA PISTA",
        cta: "Encontre uma hospedagem perto na Crambie",
      };
    }
    return {
      badge: "ATLETISMO · SANTIAGO 2026",
      title: "Semana de pista en Santiago",
      subtitle:
        "Campeonatos e interescolares en el Parque Estadio Nacional — atletas, técnicos, asociaciones y familias de regiones",
      venueLine: "Parque Estadio Nacional · Ñuñoa",
      stats: [
        { value: "CAS", label: "SEDE" },
        { value: "RM", label: "PISTA" },
        { value: "REG", label: "VIAJE" },
      ],
      tips: [
        "Ubicación: Parque Estadio Nacional / Mario Recordón",
        "Metro cercano: Estadio Nacional y Ñuble",
        "Para atletas, técnicos, asociaciones de atletismo y familias",
      ],
      ctaLabel: "CERCA DE LA PISTA",
      cta: "Encuentra un alojamiento cerca en Crambie",
    };
  },
  landing: (locale) => {
    if (locale === "en") {
      return {
        whyTitle: "A base near the track for championship week",
        whyBody: (venue) =>
          `Athletics meets bring athletes, coaches and families from every region. Staying near ${venue} keeps early call times and late finals manageable.`,
        unitsBody: (venue) =>
          `Sorted by distance to ${venue}. Championship weekends fill up fast — book soon on Airbnb.`,
        urgencyNote: (dates) =>
          `Stays near the stadium for ${dates} fill up fast with traveling teams. Worth booking soon.`,
        closeTitle: "Book your base for athletics week",
        closeBody: (dates, venue) =>
          `Around ${dates}, rooms near ${venue} go quickly with associations and families in town. Book on Airbnb.`,
      };
    }
    if (locale === "pt") {
      return {
        whyTitle: "Uma base perto da pista na semana de campeonato",
        whyBody: (venue) =>
          `Os campeonatos de atletismo trazem atletas, técnicos e famílias de todas as regiões. Ficar perto de ${venue} facilita horários cedo e finais à noite.`,
        unitsBody: (venue) =>
          `Ordenados por proximidade a ${venue}. Nos fins de semana de campeonato as opções esgotam rápido — reserve logo no Airbnb.`,
        urgencyNote: (dates) =>
          `As hospedagens perto do Estádio para ${dates} esgotam rápido com equipes viajantes. Vale reservar logo.`,
        closeTitle: "Reserve sua base para a semana de atletismo",
        closeBody: (dates, venue) =>
          `Em torno de ${dates}, perto de ${venue} enche com associações e famílias. Garanta no Airbnb.`,
      };
    }
    return {
      whyTitle: "Base cerca de la pista para la semana de campeonato",
      whyBody: (venue) =>
        `Los campeonatos de atletismo traen atletas, técnicos y familias de todas las regiones. Quedarte cerca de ${venue} facilita horarios tempranos y finales largas.`,
      unitsBody: (venue) =>
        `Ordenados por cercanía a ${venue}. En fines de semana de campeonato se llenan rápido: conviene reservar pronto en Airbnb.`,
      urgencyNote: (dates) =>
        `Los alojamientos cerca del Estadio para ${dates} se llenan rápido con delegaciones. Conviene reservar pronto.`,
      closeTitle: "Reserva tu base para la semana de atletismo",
      closeBody: (dates, venue) =>
        `En torno a ${dates}, cerca de ${venue} se llena con asociaciones y familias. Arriendas en Airbnb y aseguras tu estadía.`,
    };
  },
  buildCopy: (pack, locale, nearestMins) => {
    const dates = datesOf(pack, locale);
    const mins = nearestMins ?? pack.properties[0]?.walkingMinutes ?? 12;
    const stayNear = stayNearStadiumPhrase(mins, locale, "Estadio Nacional");
    return {
      shortTitle: t(locale, "Atletismo en Santiago", "Athletics in Santiago", "Atletismo em Santiago"),
      headline: t(
        locale,
        "Atletismo en el Nacional — quédate cerca de la pista",
        "Athletics at the Nacional — stay near the track",
        "Atletismo no Nacional — fique perto da pista",
      ),
      subhead: t(
        locale,
        `${dates}. Campeonato en el Parque Estadio Nacional. Ideal para atletas, técnicos, asociaciones regionales y familias que acompañan.\n\n${stayNear}. Metro, barrio seguro y reserva en Airbnb.`,
        `${dates}. Meet at Parque Estadio Nacional. Built for athletes, coaches, regional associations and families.\n\n${stayNear}. Metro, safe area, book on Airbnb.`,
        `${dates}. Campeonato no Parque Estadio Nacional. Para atletas, técnicos, associações regionais e famílias.\n\n${stayNear}. Metrô, bairro seguro e Airbnb.`,
      ),
      mustKnow: [
        t(
          locale,
          "Sede: Parque Estadio Nacional / Pista Mario Recordón, Ñuñoa.",
          "Venue: Parque Estadio Nacional / Mario Recordón track, Ñuñoa.",
          "Sede: Parque Estadio Nacional / Pista Mario Recordón, Ñuñoa.",
        ),
        t(
          locale,
          "Público: atletas, técnicos, FEDACHI/CAS, asociaciones regionales y familias.",
          "Audience: athletes, coaches, FEDACHI/CAS, regional associations and families.",
          "Público: atletas, técnicos, FEDACHI/CAS, associações regionais e famílias.",
        ),
        t(
          locale,
          "Metro Estadio Nacional o Ñuble. En fechas de campeonato reserva pronto.",
          "Estadio Nacional or Ñuble metro. Book early around championship dates.",
          "Metrô Estadio Nacional ou Ñuble. Reserve cedo nas datas de campeonato.",
        ),
      ],
      trustPoints: [
        stayNear,
        t(
          locale,
          "Pensado para asociaciones, clubes, staff y familias de regiones",
          "Built for associations, clubs, staff and regional families",
          "Pensado para associações, clubes, staff e famílias de regiões",
        ),
        t(
          locale,
          "Ñuñoa: barrio seguro con metro Estadio Nacional / Ñuble",
          "Ñuñoa: safe neighborhood with Estadio Nacional / Ñuble metro",
          "Ñuñoa: bairro seguro com metrô Estadio Nacional / Ñuble",
        ),
        t(
          locale,
          "Reserva directa en Airbnb: pago protegido y reseñas reales",
          "Book direct on Airbnb: protected payment and real reviews",
          "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
        ),
      ],
    };
  },
  mailing: ({ eventTitle, eventDates, venueName, landingUrl }) => ({
    subject: `Atletismo en el Estadio Nacional: base cerca de la pista para asociaciones y familias`,
    bodyLines: [
      "Hola,",
      "",
      `Por ${eventTitle} (${eventDates}) hay competencia en ${venueName}.`,
      "Armamos alojamientos a pasos de la pista para atletas, técnicos, asociaciones, clubes y familias que viajan.",
      "Reserva directa en Airbnb: metro Estadio Nacional / Ñuble, barrio seguro y base cerca del recinto.",
      "En fines de semana de campeonato los alojamientos en Ñuñoa se llenan rápido: conviene reservar pronto.",
      "",
      landingUrl,
    ],
  }),
};

/* ─── Hockey césped (Nacional Primera / FIH) ─── */

const hockeyFlagship: FlagshipSportEvent = {
  id: "hockey-cesped-2026",
  sportHints: ["hockey", "fehoch", "fih"],
  brevoListName: "Hockey",
  coverRel: "guides/deportes/hockey.png",
  match: (title) =>
    /\bhockey\b|fehoch|fih|diablas|diablos/i.test(title) &&
    !/hielo|ice\s*hockey/i.test(title),
  brand: (locale) => {
    if (locale === "en") {
      return {
        badge: "HOCKEY · SANTIAGO 2026",
        title: "Field hockey in the capital",
        subtitle:
          "National leagues and internationals at Parque Estadio Nacional — clubs, FEHOCH, staff and traveling fans",
        venueLine: "Parque Estadio Nacional · Ñuñoa",
        stats: [
          { value: "FEHOCH", label: "FED" },
          { value: "1ª", label: "DIVISION" },
          { value: "ÑUÑOA", label: "VENUE" },
        ],
        tips: [
          "Venue: Parque Estadio Nacional / Centro Claudia Schüler",
          "Nearby metro: Estadio Nacional and Ñuble",
          "For clubs, federations, staff and regional fans",
        ],
        ctaLabel: "NEAR THE PITCH",
        cta: "Find a stay nearby on Crambie",
      };
    }
    if (locale === "pt") {
      return {
        badge: "HÓQUEI · SANTIAGO 2026",
        title: "Hóquei na capital",
        subtitle:
          "Ligas nacionais e internacionais no Parque Estadio Nacional — clubes, FEHOCH, staff e torcida viajante",
        venueLine: "Parque Estadio Nacional · Ñuñoa",
        stats: [
          { value: "FEHOCH", label: "FED" },
          { value: "1ª", label: "DIVISÃO" },
          { value: "ÑUÑOA", label: "SEDE" },
        ],
        tips: [
          "Local: Parque Estadio Nacional / Centro Claudia Schüler",
          "Metrô perto: Estadio Nacional e Ñuble",
          "Para clubes, federações, staff e torcida de regiões",
        ],
        ctaLabel: "PERTO DO CAMPO",
        cta: "Encontre uma hospedagem perto na Crambie",
      };
    }
    return {
      badge: "HOCKEY · SANTIAGO 2026",
      title: "Hockey césped en la capital",
      subtitle:
        "Ligas nacionales e internacionales en el Parque Estadio Nacional — clubes, FEHOCH, staff e hinchada viajera",
      venueLine: "Parque Estadio Nacional · Ñuñoa",
      stats: [
        { value: "FEHOCH", label: "FED" },
        { value: "1ª", label: "DIVISIÓN" },
        { value: "ÑUÑOA", label: "SEDE" },
      ],
      tips: [
        "Ubicación: Parque Estadio Nacional / Centro Claudia Schüler",
        "Metro cercano: Estadio Nacional y Ñuble",
        "Para clubes, federaciones, staff e hinchada de regiones",
      ],
      ctaLabel: "CERCA DE LA CANCHA",
      cta: "Encuentra un alojamiento cerca en Crambie",
    };
  },
  landing: (locale) => {
    if (locale === "en") {
      return {
        whyTitle: "A base near the pitch for hockey weekends",
        whyBody: (venue) =>
          `FEHOCH weekends and internationals bring clubs and staff from across Chile. Staying near ${venue} keeps match days simple.`,
        unitsBody: (venue) =>
          `Sorted by distance to ${venue}. Hockey weekends fill Ñuñoa fast — book soon on Airbnb.`,
        urgencyNote: (dates) =>
          `Stays near the stadium for ${dates} fill up with traveling clubs. Worth booking soon.`,
        closeTitle: "Book your base for hockey weekend",
        closeBody: (dates, venue) =>
          `Around ${dates}, rooms near ${venue} go quickly with clubs in town. Book on Airbnb.`,
      };
    }
    if (locale === "pt") {
      return {
        whyTitle: "Uma base perto do campo nos fins de semana de hóquei",
        whyBody: (venue) =>
          `Os fins de semana FEHOCH e os internacionais trazem clubes e staff de todo o Chile. Ficar perto de ${venue} simplifica o dia de jogo.`,
        unitsBody: (venue) =>
          `Ordenados por proximidade a ${venue}. Nos fins de semana de hóquei Ñuñoa esgota rápido — reserve logo no Airbnb.`,
        urgencyNote: (dates) =>
          `As hospedagens perto do Estádio para ${dates} esgotam com clubes viajantes. Vale reservar logo.`,
        closeTitle: "Reserve sua base para o fim de semana de hóquei",
        closeBody: (dates, venue) =>
          `Em torno de ${dates}, perto de ${venue} enche com clubes na cidade. Garanta no Airbnb.`,
      };
    }
    return {
      whyTitle: "Base cerca de la cancha para el fin de semana de hockey",
      whyBody: (venue) =>
        `Los fines de semana FEHOCH y los internacionales traen clubes y staff de todo Chile. Quedarte cerca de ${venue} simplifica el día de partido.`,
      unitsBody: (venue) =>
        `Ordenados por cercanía a ${venue}. En fines de semana de hockey Ñuñoa se llena rápido: conviene reservar pronto en Airbnb.`,
      urgencyNote: (dates) =>
        `Los alojamientos cerca del Estadio para ${dates} se llenan con clubes viajeros. Conviene reservar pronto.`,
      closeTitle: "Reserva tu base para el fin de semana de hockey",
      closeBody: (dates, venue) =>
        `En torno a ${dates}, cerca de ${venue} se llena con clubes en la ciudad. Arriendas en Airbnb y aseguras tu estadía.`,
    };
  },
  buildCopy: (pack, locale, nearestMins) => {
    const dates = datesOf(pack, locale);
    const mins = nearestMins ?? pack.properties[0]?.walkingMinutes ?? 12;
    const stayNear = stayNearStadiumPhrase(mins, locale, "Estadio Nacional");
    return {
      shortTitle: t(locale, "Hockey césped en Santiago", "Field hockey in Santiago", "Hóquei em Santiago"),
      headline: t(
        locale,
        "Hockey en el Nacional — quédate cerca de la cancha",
        "Hockey at the Nacional — stay near the pitch",
        "Hóquei no Nacional — fique perto do campo",
      ),
      subhead: t(
        locale,
        `${dates}. Competencia FEHOCH / internacional en el Parque Estadio Nacional. Ideal para clubes, federación, staff e hinchada de regiones.\n\n${stayNear}. Metro, barrio seguro y reserva en Airbnb.`,
        `${dates}. FEHOCH / international hockey at Parque Estadio Nacional. Built for clubs, federation, staff and regional fans.\n\n${stayNear}. Metro, safe area, book on Airbnb.`,
        `${dates}. Competição FEHOCH / internacional no Parque Estadio Nacional. Para clubes, federação, staff e torcida de regiões.\n\n${stayNear}. Metrô, bairro seguro e Airbnb.`,
      ),
      mustKnow: [
        t(
          locale,
          "Sede: Parque Estadio Nacional / Centro de Hockey Claudia Schüler, Ñuñoa.",
          "Venue: Parque Estadio Nacional / Claudia Schüler Hockey Centre, Ñuñoa.",
          "Sede: Parque Estadio Nacional / Centro de Hóquei Claudia Schüler, Ñuñoa.",
        ),
        t(
          locale,
          "Público: clubes FEHOCH, federación, staff técnico e hinchada de regiones.",
          "Audience: FEHOCH clubs, federation, coaching staff and regional fans.",
          "Público: clubes FEHOCH, federação, staff técnico e torcida de regiões.",
        ),
        t(
          locale,
          "Metro Estadio Nacional o Ñuble. En fechas de liga reserva pronto.",
          "Estadio Nacional or Ñuble metro. Book early around league weekends.",
          "Metrô Estadio Nacional ou Ñuble. Reserve cedo nos fins de semana de liga.",
        ),
      ],
      trustPoints: [
        stayNear,
        t(
          locale,
          "Pensado para clubes, federación, staff e hinchada de regiones",
          "Built for clubs, federation, staff and regional fans",
          "Pensado para clubes, federação, staff e torcida de regiões",
        ),
        t(
          locale,
          "Ñuñoa: barrio seguro con metro Estadio Nacional / Ñuble",
          "Ñuñoa: safe neighborhood with Estadio Nacional / Ñuble metro",
          "Ñuñoa: bairro seguro com metrô Estadio Nacional / Ñuble",
        ),
        t(
          locale,
          "Reserva directa en Airbnb: pago protegido y reseñas reales",
          "Book direct on Airbnb: protected payment and real reviews",
          "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
        ),
      ],
    };
  },
  mailing: ({ eventTitle, eventDates, venueName, landingUrl }) => ({
    subject: `Hockey césped en Santiago: quédate a pasos de la cancha · Estadio Nacional`,
    bodyLines: [
      "Hola,",
      "",
      `Por ${eventTitle} (${eventDates}) hay competencia en ${venueName}.`,
      "Armamos alojamientos a pasos de la cancha para clubes FEHOCH, federación, staff e hinchada de regiones.",
      "Reserva directa en Airbnb: metro Estadio Nacional / Ñuble, barrio seguro y base cerca del recinto.",
      "En fines de semana de liga los alojamientos en Ñuñoa se llenan rápido: conviene reservar pronto.",
      "",
      landingUrl,
    ],
  }),
};

export const FLAGSHIP_EVENTS: FlagshipSportEvent[] = [
  guerreras,
  copaDavis,
  fedachiMarathonFlagship,
  atletismoFlagship,
  hockeyFlagship,
];

export function matchFlagship(title: string): FlagshipSportEvent | null {
  return FLAGSHIP_EVENTS.find((f) => f.match(title)) ?? null;
}

export function isFlagshipTitle(title: string): boolean {
  return matchFlagship(title) != null;
}
