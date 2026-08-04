/**
 * Copy editorial por evento — overrides cuando el template genérico queda corto.
 * Fuentes: FEVOCHI, Chile es Tuyo, El Vacanudo, RedGol.
 */
import { formatDateRangeHuman, formatDateRangeLongEs } from "./dates";
import type { Locale } from "@/lib/i18n/locale";
import type { MicrositeCopyInput } from "./microsite-event-copy";
import {
  guerrerasHeadlineProximity,
  stayNearStadiumPhrase,
} from "./venue-proximity-copy";

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

/** Campos mínimos para decidir / armar overrides editoriales. */
export type EventCopyOverrideInput = Pick<
  MicrositeCopyInput,
  | "eventTitle"
  | "eventDates"
  | "eventStartsOn"
  | "eventEndsOn"
  | "venueName"
  | "properties"
>;

function t(locale: Locale, es: string, en: string, pt: string): string {
  if (locale === "en") return en;
  if (locale === "pt") return pt;
  return es;
}

export function isMundialU17VolleyballTitle(title: string): boolean {
  return /mundial.*u17.*voleibol|voleibol.*u17.*mundial|mundial femenino u17/i.test(
    title,
  );
}

function isMundialU17Volleyball(pack: EventCopyOverrideInput): boolean {
  return isMundialU17VolleyballTitle(pack.eventTitle);
}

function displayDates(pack: EventCopyOverrideInput, locale: Locale): string {
  return formatDateRangeHuman(
    pack.eventStartsOn,
    pack.eventEndsOn,
    locale === "pt" ? "pt" : locale === "en" ? "en" : "es",
  );
}

function mundialU17VolleyballOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  nearestMinsOverride?: number,
): EventCopyOverride {
  const dates = displayDates(pack, locale);
  const datesLong = formatDateRangeLongEs(
    pack.eventStartsOn,
    pack.eventEndsOn,
  );
  const mins =
    nearestMinsOverride ?? pack.properties[0]?.walkingMinutes ?? 15;
  const stayNear = stayNearStadiumPhrase(mins, locale, "Estadio Nacional");

  return {
    shortTitle: t(
      locale,
      "Mundial de las Guerreras Sub-17",
      "U17 Women's World Championship — Chile's Guerreras",
      "Mundial das Guerreiras Sub-17",
    ),
    headline: guerrerasHeadlineProximity(mins, locale),
    subhead: t(
      locale,
      `${dates}. Por primera vez Chile organiza un Mundial de vóleibol. Las Guerreras Sub-17 son de todo el país: 9 de 14 jugadoras vienen de regiones.\n\n${stayNear}. Pensado para delegaciones, staff, familias e hinchada: metro, barrio seguro y reserva directa en Airbnb.`,
      `${dates}. For the first time, Chile hosts a volleyball World Championship. The U17 Guerreras represent the whole country — 9 of 14 players are from outside Santiago.\n\n${stayNear}. Built for delegations, staff, families and fans: metro, safe neighborhood, book direct on Airbnb.`,
      `${dates}. Pela primeira vez o Chile organiza um Mundial de vôlei. As Guerreiras Sub-17 são de todo o país: 9 de 14 jogadoras vêm de outras regiões.\n\n${stayNear}. Pensado para delegações, staff, famílias e torcida: metrô, bairro seguro e reserva direta no Airbnb.`,
    ),
    eventSummary: t(
      locale,
      `Del ${datesLong}, Chile escribe historia con el Mundial Femenino Sub-17 FIVB. 24 selecciones, tres sedes. Guía para delegaciones, staff, familias e hinchada: llegar, entradas y dormir cerca del Parque Estadio Nacional.`,
      `From ${dates}, Chile makes history hosting the FIVB U17 Women's World Championship. 24 teams, three venues. Guide for delegations, staff, families and fans: getting there, tickets and staying near Parque Estadio Nacional.`,
      `De ${dates}, o Chile escreve história com o Mundial Feminino Sub-17 da FIVB. 24 seleções, três sedes. Guia para delegações, staff, famílias e torcida: chegar, ingressos e dormir perto do Parque Estadio Nacional.`,
    ),
    eventDescription: t(
      locale,
      `Es el Mundial más importante que ha tenido el vóleibol chileno: del ${datesLong}, Chile organiza por primera vez un Campeonato Mundial Femenino Sub-17 de la FIVB. 24 selecciones de los cinco continentes. Las Guerreras debutan el jueves 6 de agosto a las 20:00 ante República Checa en el Gimnasio de Deportes Colectivos del Parque Estadio Nacional.\n\nLa nómina del DT Raúl Pereira es un espejo del país: 9 de 14 jugadoras vienen de Punta Arenas, Concepción, Quillota, Concón, Los Ángeles, Valparaíso, Pichilemu y Linares. A Santiago llegan delegaciones internacionales, staff técnico, familias y hinchada de regiones.\n\nSedes: Parque Estadio Nacional en Ñuñoa (grupos desde el 6; cuartos 14, semis 15, final 16 — oro 19:00); San Felipe y Los Andes en el Valle del Aconcagua. Grupo A: Chile, Turquía, Egipto, EE.UU., Tailandia y República Checa. Entradas desde $3.800 en Ticketpro. Aquí te ayudamos a quedarte cerca del recinto para competir, trabajar o alentar.`,
      `This is the biggest moment in Chilean volleyball history: from ${dates}, Chile hosts its first FIVB U17 Women's World Championship. 24 teams from five continents. The Guerreras open Thursday 6 Aug at 20:00 vs Czechia at the Collective Sports Gym, Parque Estadio Nacional.\n\nCoach Raúl Pereira's squad mirrors the country: 9 of 14 players come from Punta Arenas, Concepción, Quillota, Concón, Los Ángeles, Valparaíso, Pichilemu and Linares. International delegations, coaching staff, families and regional fans are coming to Santiago.\n\nVenues: Parque Estadio Nacional in Ñuñoa (groups from the 6th; quarters 14, semis 15, final 16 — gold 19:00); San Felipe and Los Andes in Aconcagua Valley. Group A: Chile, Türkiye, Egypt, USA, Thailand and Czechia. Tickets from CLP $3,800 via Ticketpro. We'll help you stay close to the venue — whether you're competing, working the event or cheering.`,
      `É o momento mais importante do vôlei chileno: de ${dates}, o Chile organiza pela primeira vez um Mundial Feminino Sub-17 da FIVB. 24 seleções dos cinco continentes. As Guerreiras estreiam na quinta 6 de agosto às 20h contra a Tchéquia no Ginásio de Esportes Coletivos do Parque Estadio Nacional.\n\nA lista do técnico Raúl Pereira espelha o país: 9 de 14 jogadoras vêm de Punta Arenas, Concepción, Quillota, Concón, Los Ángeles, Valparaíso, Pichilemu e Linares. Chegam a Santiago delegações internacionais, staff técnico, famílias e torcida de regiões.\n\nSedes: Parque Estadio Nacional em Ñuñoa (grupos a partir do dia 6; quartas 14, semis 15, final 16 — ouro 19h); San Felipe e Los Andes no Vale do Aconcagua. Grupo A: Chile, Turquia, Egito, EUA, Tailândia e Tchéquia. Ingressos a partir de $3.800 no Ticketpro. Ajudamos você a ficar perto do recinto para competir, trabalhar ou torcer.`,
    ),
    mustKnow: [
      t(
        locale,
        "Hito histórico: primer Mundial de vóleibol que Chile organiza. Las Guerreras debutan el 6 ago a las 20:00 vs República Checa en Ñuñoa.",
        "Historic first: Chile's first volleyball World Cup as host. The Guerreras open 6 Aug at 20:00 vs Czechia in Ñuñoa.",
        "Marco histórico: primeiro Mundial de vôlei que o Chile organiza. As Guerreiras estreiam em 6 ago às 20h vs Tchéquia em Ñuñoa.",
      ),
      t(
        locale,
        "Selección de todo Chile: 9 de 14 jugadoras de regiones (Punta Arenas, Concepción, Quillota, Concón, Los Ángeles, Valparaíso, Pichilemu, Linares).",
        "A squad from all of Chile: 9 of 14 players from regions (Punta Arenas, Concepción, Quillota, Concón, Los Ángeles, Valparaíso, Pichilemu, Linares).",
        "Seleção de todo o Chile: 9 de 14 jogadoras de regiões (Punta Arenas, Concepción, Quillota, Concón, Los Ángeles, Valparaíso, Pichilemu, Linares).",
      ),
      t(
        locale,
        "Si vienes con delegación, staff o a alentar: llega un día antes y reserva pronto cerca del Parque Estadio Nacional — en fechas de Mundial se llenan rápido.",
        "Coming with a delegation, staff or to cheer: arrive a day early and book soon near Parque Estadio Nacional — World Cup dates fill up fast.",
        "Se você vem com delegação, staff ou para torcer: chegue um dia antes e reserve logo perto do Parque Estadio Nacional — nas datas do Mundial esgotam rápido.",
      ),
      t(
        locale,
        "Tres sedes: Santiago, San Felipe y Los Andes. Fase decisiva en Ñuñoa (cuartos 14, semis 15, final 16 — oro 19:00).",
        "Three venues: Santiago, San Felipe and Los Andes. Knockouts in Ñuñoa (quarters 14, semis 15, final 16 — gold 19:00).",
        "Três sedes: Santiago, San Felipe e Los Andes. Fase decisiva em Ñuñoa (quartas 14, semis 15, final 16 — ouro 19h).",
      ),
      t(
        locale,
        "Entradas desde $3.800 solo en Ticketpro.",
        "Tickets from CLP $3,800 only via Ticketpro.",
        "Ingressos a partir de $3.800 só no Ticketpro.",
      ),
      t(
        locale,
        `${stayNear} · metro Estadio Nacional o Ñuble para moverte sin auto.`,
        `${stayNear} · Estadio Nacional or Ñuble metro to get around without a car.`,
        `${stayNear} · metrô Estadio Nacional ou Ñuble para circular sem carro.`,
      ),
    ],
    news: [
      t(
        locale,
        "Las Guerreras ya tienen nómina: Chile se prepara para su Mundial en casa.",
        "The Guerreras squad is set: Chile is ready for its home World Championship.",
        "As Guerreiras já têm lista: o Chile se prepara para o Mundial em casa.",
      ),
      t(
        locale,
        "24 delegaciones en Chile: sedes en Ñuñoa, San Felipe y Los Andes para el staff y las selecciones.",
        "24 delegations in Chile: venues in Ñuñoa, San Felipe and Los Andes for staff and teams.",
        "24 delegações no Chile: sedes em Ñuñoa, San Felipe e Los Andes para staff e seleções.",
      ),
      t(
        locale,
        "Grupo A de alto nivel: Chile vs Turquía, Egipto, EE.UU., Tailandia y República Checa.",
        "Tough Group A: Chile vs Türkiye, Egypt, USA, Thailand and Czechia.",
        "Grupo A de alto nível: Chile vs Turquia, Egito, EUA, Tailândia e Tchéquia.",
      ),
      t(
        locale,
        "Ñuñoa, Barrio Italia o Centro: base cómoda para delegaciones, staff y quienes vienen a apoyar.",
        "Ñuñoa, Barrio Italia or downtown: a solid base for delegations, staff and those coming to support.",
        "Ñuñoa, Barrio Italia ou Centro: base confortável para delegações, staff e quem vem apoiar.",
      ),
    ],
    trustPoints: [
      t(
        locale,
        `${stayNear}: llegas al recinto sin apuro y vuelves a dormir cerca`,
        `${stayNear}: get to the venue without the rush and sleep nearby`,
        `${stayNear}: chegue ao recinto sem pressa e durma perto`,
      ),
      t(
        locale,
        "Pensado para delegaciones, staff, familias e hinchada de regiones",
        "Built for delegations, staff, families and regional fans",
        "Pensado para delegações, staff, famílias e torcida de regiões",
      ),
      t(
        locale,
        "Ñuñoa: barrio residencial, seguro y con metro Estadio Nacional / Ñuble a mano",
        "Ñuñoa: residential, safe neighborhood with Estadio Nacional / Ñuble metro nearby",
        "Ñuñoa: bairro residencial, seguro e com metrô Estadio Nacional / Ñuble à mão",
      ),
      t(
        locale,
        "Arriendas directo en Airbnb: pago protegido, mensajería y reseñas reales",
        "Book direct on Airbnb: protected payment, messaging and real reviews",
        "Alugue direto no Airbnb: pagamento protegido, mensagens e avaliações reais",
      ),
      t(
        locale,
        "Check-in autónomo y alojamiento completo: base cómoda entre partidos, turnos y jornadas largas",
        "Self check-in and a full apartment: a comfortable base between matches, shifts and long days",
        "Check-in autônomo e apartamento completo: base confortável entre jogos, turnos e jornadas longas",
      ),
    ],
  };
}

export function getEventCopyOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  opts?: { nearestMins?: number },
): EventCopyOverride | null {
  if (isMundialU17Volleyball(pack)) {
    return mundialU17VolleyballOverride(pack, locale, opts?.nearestMins);
  }
  return null;
}

export function isInternalNewsLine(text: string): boolean {
  return (
    /\(\d+\s*·\s*~/.test(text) ||
    /\bpernocta\b/i.test(text) ||
    /\bmailing\b/i.test(text)
  );
}
