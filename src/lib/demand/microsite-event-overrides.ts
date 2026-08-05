/**
 * Copy editorial por evento — overrides cuando el template genérico queda corto.
 * Fuentes: FEVOCHI, Chile es Tuyo, El Vacanudo, RedGol.
 */
import { formatDateRangeHuman, formatDateRangeLongEs } from "./dates";
import type { Locale } from "@/lib/i18n/locale";
import type { MicrositeCopyInput } from "./microsite-event-copy";
import { matchFlagship } from "./flagship-events";
import {
  guerrerasHeadlineProximity,
  stayNearStadiumPhrase,
} from "./venue-proximity-copy";

export type EventCopyOverride = {
  shortTitle?: string;
  venueName?: string;
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

function isPostaSantiagoTitle(title: string): boolean {
  return /posta de santiago/i.test(title);
}

function postaSantiagoOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  nearestMinsOverride?: number,
): EventCopyOverride {
  const dates = displayDates(pack, locale);
  const mins =
    nearestMinsOverride ?? pack.properties[0]?.walkingMinutes ?? 20;
  const basesUrl =
    "https://clubatleticosantiago.cl/wp-content/uploads/2026/01/Bases-40a-Posta-de-Santiago-Escuela-Militar-2026.pdf";

  return {
    shortTitle: t(locale, "40ª Posta de Santiago", "40th Posta de Santiago", "40ª Posta de Santiago"),
    headline: t(
      locale,
      `Posta de Santiago en Escuela Militar · a ~${mins} min de tu alojamiento`,
      `Posta de Santiago at Escuela Militar · ~${mins} min from your stay`,
      `Posta de Santiago na Escuela Militar · ~${mins} min da sua hospedagem`,
    ),
    subhead: t(
      locale,
      `${dates}, 10:00–12:30 · circuito interno Escuela Militar (Av. Presidente Riesco 4601, Las Condes).\n\nOrganiza Club Atlético Santiago con la Escuela Militar. Participan colegios de Santiago y regiones, clubes AARM y asociaciones invitadas.`,
      `${dates}, 10:00–12:30 · internal circuit at Escuela Militar (4601 Presidente Riesco Ave., Las Condes).\n\nHosted by Club Atlético Santiago and Escuela Militar. School teams from Santiago and regions, AARM clubs and invited associations.`,
      `${dates}, 10:00–12:30 · circuito interno Escuela Militar (Av. Presidente Riesco 4601, Las Condes).\n\nOrganiza o Club Atlético Santiago com a Escuela Militar. Participam colégios de Santiago e regiões, clubes AARM e associações convidadas.`,
    ),
    eventSummary: t(
      locale,
      `Domingo 23 de agosto de 2026, 10:00–12:30 en Escuela Militar (Las Condes). Cuatro categorías de posta por relevos: escolares y federadas, damas y varones. Inscripciones hasta el 20 de agosto en secretaria@clubatleticosantiago.cl.`,
      `Sunday 23 August 2026, 10:00–12:30 at Escuela Militar (Las Condes). Four relay categories: school and club, women and men. Entries until 20 August at secretaria@clubatleticosantiago.cl.`,
      `Domingo 23 de agosto de 2026, 10:00–12:30 na Escuela Militar (Las Condes). Quatro categorias de posta por revezamento: escolares e federadas, feminino e masculino. Inscrições até 20 de agosto em secretaria@clubatleticosantiago.cl.`,
    ),
    eventDescription: t(
      locale,
      `La 40ª Posta de Santiago se realiza el domingo 23 de agosto de 2026 entre las 10:00 y las 12:30 horas en un circuito interno de la Escuela Militar (Av. Presidente Riesco Nº4601, Las Condes). La organizan el Club Atlético Santiago y el Departamento de Educación Física de la Escuela Militar.\n\n¿Quién puede participar? Establecimientos educacionales de Santiago y regiones; clubes federados de la AARM u otras asociaciones atléticas; e instituciones invitadas.\n\nCategorías: damas y varones escolares intermedia-superior (5 y 8 relevos); damas y varones federadas todo competidor (5 y 10 relevos).\n\nInscripciones: envía nómina con nombre, RUT y fecha de nacimiento de cada atleta a secretaria@clubatleticosantiago.cl hasta el jueves 20 de agosto de 2026. Consultas: José Miguel Bustamante (+56 9 9538 4775) o Pablo Squella (+56 9 9275 6014).\n\nPrograma: 10:00 posta damas escolares · 10:25 varones escolares · 11:00 damas federadas · 11:25 varones federados · 12:00 premiación. Bases completas: ${basesUrl}`,
      `The 40th Posta de Santiago takes place Sunday 23 August 2026 from 10:00 to 12:30 on an internal circuit at Escuela Militar (4601 Presidente Riesco Ave., Las Condes). Organized by Club Atlético Santiago and the Escuela Militar PE department.\n\nWho can enter? Schools from Santiago and regions; federated clubs from AARM or other athletics associations; invited institutions.\n\nCategories: school and open women/men relay teams (5–10 legs per category).\n\nEntries: send roster with full name, ID number and birth date for each athlete to secretaria@clubatleticosantiago.cl by Thursday 20 August 2026. Questions: José Miguel Bustamante (+56 9 9538 4775) or Pablo Squella (+56 9 9275 6014).\n\nSchedule: 10:00 school girls · 10:25 school boys · 11:00 club women · 11:25 club men · 12:00 awards. Full rules: ${basesUrl}`,
      `A 40ª Posta de Santiago será no domingo 23 de agosto de 2026 das 10:00 às 12:30 em circuito interno da Escuela Militar (Av. Presidente Riesco 4601, Las Condes). Organizam o Club Atlético Santiago e o Departamento de Educação Física da Escuela Militar.\n\nQuem pode participar? Estabelecimentos educacionais de Santiago e regiões; clubes federados da AARM ou outras associações; instituições convidadas.\n\nCategorias: feminino e masculino escolar e federado, em postas por revezamento.\n\nInscrições: envie nomina com nome, RUT e data de nascimento para secretaria@clubatleticosantiago.cl até quinta 20 de agosto de 2026. Consultas: José Miguel Bustamante (+56 9 9538 4775) ou Pablo Squella (+56 9 9275 6014).\n\nPrograma: 10:00 escolar feminino · 10:25 escolar masculino · 11:00 federado feminino · 11:25 federado masculino · 12:00 premiação. Bases: ${basesUrl}`,
    ),
    mustKnow: [
      t(
        locale,
        "Sede: Escuela Militar, Av. Presidente Riesco 4601, Las Condes — no es Movistar Arena ni Estadio Nacional.",
        "Venue: Escuela Militar, 4601 Presidente Riesco Ave., Las Condes — not Movistar Arena or Estadio Nacional.",
        "Sede: Escuela Militar, Av. Presidente Riesco 4601, Las Condes — não é Movistar Arena nem Estadio Nacional.",
      ),
      t(
        locale,
        "Inscripciones hasta el jueves 20 de agosto en secretaria@clubatleticosantiago.cl (nombre, RUT y fecha de nacimiento por atleta).",
        "Entries until Thursday 20 August at secretaria@clubatleticosantiago.cl (name, ID and birth date per athlete).",
        "Inscrições até quinta 20 de agosto em secretaria@clubatleticosantiago.cl (nome, RUT e data de nascimento por atleta).",
      ),
      t(
        locale,
        "Participan colegios de Santiago y regiones, clubes AARM y asociaciones atléticas invitadas.",
        "Schools from Santiago and regions, AARM clubs and invited athletics associations.",
        "Participam colégios de Santiago e regiões, clubes AARM e associações convidadas.",
      ),
      t(
        locale,
        "Horario: domingo 23 ago, 10:00–12:30 (premiación 12:00).",
        "Schedule: Sunday 23 Aug, 10:00–12:30 (awards 12:00).",
        "Horário: domingo 23 ago, 10:00–12:30 (premiação 12:00).",
      ),
      t(
        locale,
        `Bases oficiales (PDF): ${basesUrl}`,
        `Official rules (PDF): ${basesUrl}`,
        `Bases oficiais (PDF): ${basesUrl}`,
      ),
    ],
    news: [
      t(
        locale,
        "40ª edición de la Posta de Santiago — tradicional posta por relevos escolar y federada.",
        "40th edition of Posta de Santiago — classic school and club relay meet.",
        "40ª edição da Posta de Santiago — clássica posta por revezamento escolar e federada.",
      ),
      t(
        locale,
        "Colegios de regiones suelen viajar con equipos completos: conviene reservar alojamiento con anticipación.",
        "Regional schools often travel with full teams — book accommodation early.",
        "Colégios de regiões costumam viajar com equipes completas: reserve hospedagem com antecedência.",
      ),
    ],
    trustPoints: [
      t(
        locale,
        "Barrio Italia, Providencia o Ñuñoa: buena base para llegar a Las Condes y volver sin apuro",
        "Barrio Italia, Providencia or Ñuñoa: solid base to reach Las Condes and get back easily",
        "Barrio Italia, Providencia ou Ñuñoa: boa base para chegar a Las Condes e voltar sem pressa",
      ),
      t(
        locale,
        "Reserva directa en Airbnb: pago protegido y reseñas reales",
        "Book direct on Airbnb: protected payment and real reviews",
        "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
      ),
    ],
  };
}

function isCampeonatoNacionalU16Title(title: string): boolean {
  return /campeonato nacional u16/i.test(title);
}

function campeonatoNacionalU16Override(
  pack: EventCopyOverrideInput,
  locale: Locale,
  nearestMinsOverride?: number,
): EventCopyOverride {
  const dates = displayDates(pack, locale);
  const mins =
    nearestMinsOverride ?? pack.properties[0]?.walkingMinutes ?? 15;
  const calendarUrl = "https://fedachi.cl/calendar";

  return {
    venueName: t(locale, "Santiago, Chile", "Santiago, Chile", "Santiago, Chile"),
    shortTitle: t(
      locale,
      "Campeonato Nacional U16",
      "National U16 Championship",
      "Campeonato Nacional U16",
    ),
    headline: t(
      locale,
      `Campeonato Nacional U16 en Santiago · a ~${mins} min de tu alojamiento`,
      `National U16 Championship in Santiago · ~${mins} min from your stay`,
      `Campeonato Nacional U16 em Santiago · ~${mins} min da sua hospedagem`,
    ),
    subhead: t(
      locale,
      `${dates} · Santiago, Chile.\n\nCompetencia nacional FEDACHI. La sede exacta aún no está publicada con detalle; confirma en el calendario oficial antes de viajar.`,
      `${dates} · Santiago, Chile.\n\nFEDACHI national meet. Exact venue details are not fully published yet — check the official calendar before you travel.`,
      `${dates} · Santiago, Chile.\n\nCompetição nacional FEDACHI. A sede exata ainda não está publicada com detalhe; confirme no calendário oficial antes de viajar.`,
    ),
    eventSummary: t(
      locale,
      `12 de septiembre de 2026 en Santiago, Chile. Campeonato Nacional U16 FEDACHI — sede por confirmar en calendario FEDACHI.`,
      `12 September 2026 in Santiago, Chile. FEDACHI National U16 — venue to be confirmed on the federation calendar.`,
      `12 de setembro de 2026 em Santiago, Chile. Campeonato Nacional U16 FEDACHI — sede a confirmar no calendário FEDACHI.`,
    ),
    eventDescription: t(
      locale,
      `El Campeonato Nacional U16 FEDACHI está programado para el 12 de septiembre de 2026 en Santiago, Chile. Por ahora no hay información pública suficiente para indicar un recinto específico.\n\nParticipan atletas menores de 16 años inscritos por sus asociaciones regionales. Si viajas con una delegación, revisa la convocatoria de tu federación y el calendario oficial: ${calendarUrl}\n\nConsultas FEDACHI: fedachi@fedachi.cl · secretariotecnico@fedachi.cl`,
      `The FEDACHI National U16 is scheduled for 12 September 2026 in Santiago, Chile. There is not enough public information yet to name a specific venue.\n\nUnder-16 athletes enter through their regional associations. If you travel with a team, check your federation notice and the official calendar: ${calendarUrl}\n\nFEDACHI enquiries: fedachi@fedachi.cl · secretariotecnico@fedachi.cl`,
      `O Campeonato Nacional U16 FEDACHI está programado para 12 de setembro de 2026 em Santiago, Chile. Por enquanto não há informação pública suficiente para indicar um recinto específico.\n\nAtletas menores de 16 anos entram pelas associações regionais. Se viajar com delegação, confira a convocatória da federação e o calendário oficial: ${calendarUrl}\n\nConsultas FEDACHI: fedachi@fedachi.cl · secretariotecnico@fedachi.cl`,
    ),
    mustKnow: [
      t(
        locale,
        "Ubicación publicada solo como Santiago, Chile — sede exacta por confirmar.",
        "Location published only as Santiago, Chile — exact venue TBC.",
        "Local publicado apenas como Santiago, Chile — sede exata a confirmar.",
      ),
      t(
        locale,
        `Calendario oficial FEDACHI: ${calendarUrl}`,
        `Official FEDACHI calendar: ${calendarUrl}`,
        `Calendário oficial FEDACHI: ${calendarUrl}`,
      ),
      t(
        locale,
        "Ñuñoa, Providencia y Barrio Italia son bases habituales para eventos federados en Santiago.",
        "Ñuñoa, Providencia and Barrio Italia are common bases for federation events in Santiago.",
        "Ñuñoa, Providencia e Barrio Italia são bases habituais para eventos federados em Santiago.",
      ),
    ],
    news: [
      t(
        locale,
        "Campeonato Nacional U16 — fecha clave del calendario juvenil FEDACHI.",
        "National U16 — key date on the FEDACHI youth calendar.",
        "Campeonato Nacional U16 — data-chave do calendário juvenil FEDACHI.",
      ),
    ],
    trustPoints: [
      t(
        locale,
        "Reserva en Santiago con flexibilidad hasta confirmar sede y horarios",
        "Book in Santiago with flexibility until venue and schedule are confirmed",
        "Reserve em Santiago com flexibilidade até confirmar sede e horários",
      ),
      t(
        locale,
        "Reserva directa en Airbnb: pago protegido y reseñas reales",
        "Book direct on Airbnb: protected payment and real reviews",
        "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
      ),
    ],
  };
}

function isCampeonatoNacionalU18Title(title: string): boolean {
  return /campeonato nacional u18/i.test(title);
}

function campeonatoNacionalU18Override(
  pack: EventCopyOverrideInput,
  locale: Locale,
  nearestMinsOverride?: number,
): EventCopyOverride {
  const dates = displayDates(pack, locale);
  const mins =
    nearestMinsOverride ?? pack.properties[0]?.walkingMinutes ?? 12;
  const convocatoriaUrl = "https://www.instagram.com/p/Danr5lvkV4S";

  return {
    shortTitle: t(
      locale,
      "Campeonato Nacional U18",
      "National U18 Championship",
      "Campeonato Nacional U18",
    ),
    headline: t(
      locale,
      `Campeonato Nacional U18 en Mario Recordón · a ~${mins} min de tu alojamiento`,
      `National U18 Championship at Mario Recordón · ~${mins} min from your stay`,
      `Campeonato Nacional U18 no Mario Recordón · ~${mins} min da sua hospedagem`,
    ),
    subhead: t(
      locale,
      `${dates} · Estadio Atlético Mario Recordón, Parque Estadio Nacional (Ñuñoa).\n\nCompetencia nacional FEDACHI en pista. Participan atletas de asociaciones regionales inscritos vía sus federaciones.`,
      `${dates} · Mario Recordón Athletic Stadium, Estadio Nacional Park (Ñuñoa).\n\nFEDACHI national track meet. Athletes from regional associations enter through their federations.`,
      `${dates} · Estádio Atlético Mario Recordón, Parque Estadio Nacional (Ñuñoa).\n\nCompetição nacional FEDACHI em pista. Atletas de associações regionais inscritos via suas federações.`,
    ),
    eventSummary: t(
      locale,
      `5 y 6 de septiembre de 2026 en el Estadio Atlético Mario Recordón (Parque Estadio Nacional). Campeonato Nacional U18 FEDACHI con pruebas de pista y campo.`,
      `5–6 September 2026 at Mario Recordón Athletic Stadium (Estadio Nacional Park). FEDACHI National U18 track & field championship.`,
      `5 e 6 de setembro de 2026 no Estádio Atlético Mario Recordón (Parque Estadio Nacional). Campeonato Nacional U18 FEDACHI em pista e campo.`,
    ),
    eventDescription: t(
      locale,
      `El Campeonato Nacional U18 se disputa el 5 y 6 de septiembre de 2026 en el Estadio Atlético Mario Recordón, dentro del Parque Estadio Nacional (Av. Grecia / Ñuñoa, Santiago). Organiza la Federación Atlética de Chile (FEDACHI).\n\n¿Quién compite? Atletas menores de 18 años clasificados e inscritos por sus asociaciones regionales. Las delegaciones suelen llegar desde regiones con entrenadores, técnicos y apoyo familiar.\n\nConvocatoria oficial FEDACHI: ${convocatoriaUrl}\n\nConsultas generales: fedachi@fedachi.cl · secretariotecnico@fedachi.cl`,
      `The National U18 Championship takes place 5–6 September 2026 at Mario Recordón Athletic Stadium, within Estadio Nacional Park (Av. Grecia / Ñuñoa, Santiago). Organized by the Chilean Athletics Federation (FEDACHI).\n\nWho competes? Under-18 athletes qualified and entered by their regional associations. Teams often travel from regions with coaches, staff and family.\n\nOfficial FEDACHI announcement: ${convocatoriaUrl}\n\nGeneral enquiries: fedachi@fedachi.cl · secretariotecnico@fedachi.cl`,
      `O Campeonato Nacional U18 será nos dias 5 e 6 de setembro de 2026 no Estádio Atlético Mario Recordón, no Parque Estadio Nacional (Av. Grecia / Ñuñoa, Santiago). Organiza a Federação Atlética do Chile (FEDACHI).\n\nQuem compete? Atletas menores de 18 anos classificados e inscritos pelas associações regionais. Delegações costumam chegar de outras regiões com equipe técnica e familiares.\n\nConvocatória oficial FEDACHI: ${convocatoriaUrl}\n\nConsultas: fedachi@fedachi.cl · secretariotecnico@fedachi.cl`,
    ),
    mustKnow: [
      t(
        locale,
        "Sede: Estadio Atlético Mario Recordón (pista), Parque Estadio Nacional — no confundir con el Estadio Nacional de fútbol.",
        "Venue: Mario Recordón Athletic Stadium (track), Estadio Nacional Park — not the football stadium.",
        "Sede: Estádio Atlético Mario Recordón (pista), Parque Estadio Nacional — não confundir com o estádio de futebol.",
      ),
      t(
        locale,
        "Evento de dos días (5–6 sep): ideal reservar alojamiento cerca del parque para sábado y domingo.",
        "Two-day meet (5–6 Sep): book near the park for Saturday and Sunday.",
        "Evento de dois dias (5–6 set): reserve hospedagem perto do parque para sábado e domingo.",
      ),
      t(
        locale,
        `Convocatoria FEDACHI: ${convocatoriaUrl}`,
        `FEDACHI announcement: ${convocatoriaUrl}`,
        `Convocatória FEDACHI: ${convocatoriaUrl}`,
      ),
    ],
    news: [
      t(
        locale,
        "Campeonato Nacional U18 FEDACHI — una de las fechas clave del calendario federado de fin de invierno.",
        "FEDACHI National U18 — a key late-winter date on the federation calendar.",
        "Campeonato Nacional U18 FEDACHI — uma das datas-chave do calendário federado de fim de inverno.",
      ),
      t(
        locale,
        "Delegaciones regionales suelen pernoctar en Ñuñoa, Providencia o Barrio Italia por cercanía al parque.",
        "Regional delegations often stay in Ñuñoa, Providencia or Barrio Italia for park access.",
        "Delegações regionais costumam pernoitar em Ñuñoa, Providencia ou Barrio Italia pela proximidade ao parque.",
      ),
    ],
    trustPoints: [
      t(
        locale,
        "Ñuñoa y Providencia: a pocos minutos del Estadio Mario Recordón y con buen acceso en metro",
        "Ñuñoa and Providencia: minutes from Mario Recordón with easy metro access",
        "Ñuñoa e Providencia: a poucos minutos do Estádio Mario Recordón e com bom acesso de metrô",
      ),
      t(
        locale,
        "Reserva directa en Airbnb: pago protegido y reseñas reales",
        "Book direct on Airbnb: protected payment and real reviews",
        "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
      ),
    ],
  };
}

function isFedachiMarathonTitle(title: string): boolean {
  return /fedachi marathon|sudamericano marat[oó]n fedachi/i.test(title);
}

function fedachiMarathonOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  nearestMinsOverride?: number,
): EventCopyOverride {
  const dates = displayDates(pack, locale);
  const mins =
    nearestMinsOverride ?? pack.properties[0]?.walkingMinutes ?? 8;
  const siteUrl = "https://fedachimarathon.cl/";

  return {
    shortTitle: t(
      locale,
      "FEDACHI Marathon Sudamericano 2026",
      "FEDACHI Marathon South American 2026",
      "FEDACHI Marathon Sul-Americano 2026",
    ),
    headline: t(
      locale,
      `FEDACHI Marathon en Estadio Nacional · a ~${mins} min de tu alojamiento`,
      `FEDACHI Marathon at Estadio Nacional · ~${mins} min from your stay`,
      `FEDACHI Marathon no Estadio Nacional · ~${mins} min da sua hospedagem`,
    ),
    subhead: t(
      locale,
      `Domingo 15 de noviembre de 2026, 06:30 hrs · Estadio Nacional.\n\nCampeonato Sudamericano en 4 distancias: 5K, 10K, 21K y 42K. El maratón oficial del atletismo en Chile.`,
      `Sunday 15 November 2026, 06:30 · Estadio Nacional.\n\nSouth American Championship in four distances: 5K, 10K, 21K and 42K. Chile's official athletics marathon.`,
      `Domingo 15 de novembro de 2026, 06:30 · Estadio Nacional.\n\nCampeonato Sul-Americano em 4 distâncias: 5K, 10K, 21K e 42K. O maratona oficial do atletismo no Chile.`,
    ),
    eventSummary: t(
      locale,
      `15 de noviembre de 2026, inicio 06:30 hrs. FEDACHI Marathon Sudamericano 2026 by ASICS: 5K familiar, 10K, medio maratón 21K y maratón 42K con largada y meta en Estadio Nacional.`,
      `15 November 2026, start 06:30. FEDACHI Marathon South American 2026 by ASICS: family 5K, 10K, half marathon 21K and 42K marathon with start and finish at Estadio Nacional.`,
      `15 de novembro de 2026, início 06:30. FEDACHI Marathon Sul-Americano 2026 by ASICS: 5K familiar, 10K, meia maratona 21K e maratona 42K com largada e chegada no Estadio Nacional.`,
    ),
    eventDescription: t(
      locale,
      `El FEDACHI Marathon Sudamericano 2026 se realiza el domingo 15 de noviembre de 2026 con inicio del evento a las 06:30 hrs en el Estadio Nacional de Santiago. Organiza la Federación Atlética de Chile (FEDACHI) con apoyo de Caja Los Andes y ASICS.\n\nDistancias con categoría de Campeonato Sudamericano: 5K (desde 10 años), 10K (desde 16), medio maratón 21K y maratón 42K (desde 18). La prueba reina tiene largada y meta en el Estadio Nacional.\n\nInscripción incluye polera oficial ASICS, morral de competencia, dorsal con chip y medalla finisher. Entrega de kits: 13 y 14 de noviembre, 10:00–20:00 hrs (lugar por confirmar).\n\nInscríbete y revisa valores en ${siteUrl} · info@fedachimarathon.cl · cambios@fedachimarathon.cl`,
      `FEDACHI Marathon South American 2026 takes place Sunday 15 November 2026 with event start at 06:30 at Estadio Nacional, Santiago. Organized by the Chilean Athletics Federation (FEDACHI) with Caja Los Andes and ASICS.\n\nDistances with South American Championship status: 5K (from age 10), 10K (from 16), 21K half marathon and 42K marathon (from 18). The main race starts and finishes at Estadio Nacional.\n\nEntry includes official ASICS shirt, race bag, chipped bib and finisher medal. Kit pickup: 13–14 November, 10:00–20:00 (venue TBC).\n\nRegister at ${siteUrl} · info@fedachimarathon.cl · cambios@fedachimarathon.cl`,
      `O FEDACHI Marathon Sul-Americano 2026 será no domingo 15 de novembro de 2026 com início às 06:30 no Estadio Nacional de Santiago. Organiza a Federação Atlética do Chile (FEDACHI) com Caja Los Andes e ASICS.\n\nDistâncias com categoria de Campeonato Sul-Americano: 5K (a partir de 10 anos), 10K (a partir de 16), meia maratona 21K e maratona 42K (a partir de 18). A prova rainha tem largada e chegada no Estadio Nacional.\n\nInscrição inclui camiseta oficial ASICS, mochila, número com chip e medalha finisher. Retirada de kits: 13 e 14 de novembro, 10:00–20:00 (local a confirmar).\n\nInscreva-se em ${siteUrl} · info@fedachimarathon.cl · cambios@fedachimarathon.cl`,
    ),
    mustKnow: [
      t(
        locale,
        "Largada general 06:30 hrs · horarios por distancia se confirmarán antes del evento.",
        "General start 06:30 · per-distance start times to be confirmed.",
        "Largada geral 06:30 · horários por distância serão confirmados antes do evento.",
      ),
      t(
        locale,
        "42K con largada y meta en Estadio Nacional; recorrido urbano por avenidas de Santiago.",
        "42K starts and finishes at Estadio Nacional; urban course through Santiago avenues.",
        "42K com largada e chegada no Estadio Nacional; percurso urbano pelas avenidas de Santiago.",
      ),
      t(
        locale,
        `Sitio oficial e inscripción: ${siteUrl}`,
        `Official site and registration: ${siteUrl}`,
        `Site oficial e inscrição: ${siteUrl}`,
      ),
    ],
    news: [
      t(
        locale,
        "Evento internacional Sudamericano 2026 — atrae corredores elite y masivos de Chile y la región.",
        "2026 South American event — draws elite and mass runners from Chile and the region.",
        "Evento internacional Sul-Americano 2026 — atrai corredores elite e amadores do Chile e da região.",
      ),
      t(
        locale,
        "Coincide con el fin de semana del García Huidobro (14–15 nov): alta demanda de alojamiento en Ñuñoa.",
        "Same weekend as García Huidobro (14–15 Nov): high accommodation demand in Ñuñoa.",
        "Coincide com o fim de semana do García Huidobro (14–15 nov): alta demanda de hospedagem em Ñuñoa.",
      ),
    ],
    trustPoints: [
      t(
        locale,
        "Ñuñoa a pasos del Estadio Nacional: ideal para kit pickup (13–14 nov) y largada matinal",
        "Ñuñoa steps from Estadio Nacional: ideal for kit pickup (13–14 Nov) and early start",
        "Ñuñoa a passos do Estadio Nacional: ideal para retirada de kit (13–14 nov) e largada matinal",
      ),
      t(
        locale,
        "Reserva directa en Airbnb: pago protegido y reseñas reales",
        "Book direct on Airbnb: protected payment and real reviews",
        "Reserva direta no Airbnb: pagamento protegido e avaliações reais",
      ),
    ],
  };
}

export function getEventCopyOverride(
  pack: EventCopyOverrideInput,
  locale: Locale,
  opts?: { nearestMins?: number },
): EventCopyOverride | null {
  if (isPostaSantiagoTitle(pack.eventTitle)) {
    return postaSantiagoOverride(pack, locale, opts?.nearestMins);
  }
  if (isCampeonatoNacionalU16Title(pack.eventTitle)) {
    return campeonatoNacionalU16Override(pack, locale, opts?.nearestMins);
  }
  if (isCampeonatoNacionalU18Title(pack.eventTitle)) {
    return campeonatoNacionalU18Override(pack, locale, opts?.nearestMins);
  }
  if (isFedachiMarathonTitle(pack.eventTitle)) {
    return fedachiMarathonOverride(pack, locale, opts?.nearestMins);
  }
  // Guerreras: copy histórico ya afinado (no tocar).
  if (isMundialU17Volleyball(pack)) {
    return mundialU17VolleyballOverride(pack, locale, opts?.nearestMins);
  }
  const flagship = matchFlagship(pack.eventTitle);
  if (flagship?.buildCopy) {
    return flagship.buildCopy(pack, locale, opts?.nearestMins);
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
