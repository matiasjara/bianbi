import type { CampaignInterest, DemandSignal } from "./types";

const INGEST_STRIP = [
  /\baudiencia objetivo:.*?(?=\.|$)/gi,
  /\bpernocta\s*\+\s*mailing\b/gi,
  /\bfuente:\s*[^.]+\.?/gi,
  /\bevento detectado desde[^.]+\.?/gi,
  /\bverificar fecha\/venue\.?/gi,
  /\bevento ticketplus\s*·\s*[^.]+\.\s*/gi,
  /\bticketplus\s*·\s*[^.]+\.\s*/gi,
  /\bagenda tocador\s*·\s*ticketera:\s*\w+\.\s*/gi,
  /\bfecha:\s*[\d\-–—/,\s]+(?:\.|$)/gi,
  /\b\d{2}-\d{2}-\d{4}(?:\s*[–—-]\s*\d{2}-\d{2}-\d{4})?\.?\s*$/i,
  /\bind\s+\d{4}:\s*/gi,
  /\bideal\s+mailing[^.]*\.?\s*/gi,
  /\bmailing\s+a\s+[^.]*\.?\s*/gi,
  /\basociaciones\s+regionales\s*→[^.]*\.?\s*/gi,
  /\bdelegaciones[^.]*→\s*pernocta[^.]*\.?\s*/gi,
  /\([^)]*→[^)]*mailing[^)]*\)/gi,
  /\b\([^)]*pernocta[^)]*\)/gi,
];

const INTERNAL_SENTENCE =
  /\bmailing\b|\bpernocta\b|\bfederaci[oó]n(es)?\b|\bfehoch\b|\bdemanda\s+dom[eé]stica\b|\bnoches?\s+caras\b|\basociaciones\s+regionales\b|\baudiencia\s+objetivo\b|\bsube\s+fantasilandia\b|\bevento\s+detectado\b|\bverificar\s+fecha\b|\(\+puente\)|\+\s*puente\b|\bregiones\s*→\b|\b→\s*mailing\b/i;

const GENERIC_DESCRIPTION =
  /^(evento detectado|partido anfp en|m[uú]sica en|feriado oficial|temporada de|evento ticketplus)/i;

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\.\.+/g, ".").trim();
}

function ensurePeriod(text: string): string {
  const t = text.trim();
  return t.endsWith(".") ? t : `${t}.`;
}

function joinFactWithSchedule(
  fact: string,
  when: string,
  venue?: string,
): string {
  const base = fact.replace(/[.,\s]+$/, "").trim();
  if (venue) return `${base}, ${when} en ${venue}`;
  return `${base}, ${when}`;
}

function isMultiDay(start?: string, end?: string): boolean {
  return Boolean(start && end && start !== end);
}

function extractFootballMatch(title: string): { home: string; away: string } | null {
  const m = title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (!m) return null;
  const home = m[1]?.trim();
  const away = m[2]?.trim();
  if (!home || !away) return null;
  return { home, away };
}

function extractVenueAddress(raw: string): string | null {
  const m = raw.match(
    /(?:Av\.|Avda\.|Avenida|Calle|Parque|Estadio|Teatro|Matucana|Morand[eé])[^.]*(?:Chile|Santiago|RM|Providencia|Ñuñoa|Ñuble|Macul|Peñalolén|Estaci[oó]n Central)[^.]*/i,
  );
  if (!m) return null;
  const addr = collapse(m[0].replace(/\.\s*$/, ""));
  return addr.length >= 12 ? addr : null;
}

function cleanRawDescription(raw: string): string {
  let t = collapse(raw);
  for (const re of INGEST_STRIP) {
    t = collapse(t.replace(re, " "));
  }
  t = t.replace(/^partido en santiago rm:\s*/i, "Partido del Campeonato Chileno: ");
  t = t.replace(/^partido anfp en\s+/i, "Partido del Campeonato Chileno en ");
  t = t.replace(/^m[uú]sica en\s+/i, "Concierto en ");
  t = t.replace(/^evento ticketplus\s*·\s*/i, "");
  t = t.replace(/^ticketplus\s*·\s*/i, "");
  return collapse(t);
}

function normalizePublicFragment(text: string): string {
  let t = collapse(text);
  t = t.replace(/\s*\+\s*/g, " y ");
  t = t.replace(/\s*→\s*/g, ", ");
  t = t.replace(/\s*·\s*/g, ". ");
  t = t.replace(/\bsantiago-chile\b/i, "Santiago");
  t = t.replace(/\bmetropolitan santiago\b/i, "Santiago");
  if (/^[a-záéíóúñ]/.test(t)) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }
  return collapse(t);
}

function extractPublicSentences(raw: string): string[] {
  const cleaned = cleanRawDescription(raw);
  if (!cleaned || GENERIC_DESCRIPTION.test(cleaned)) return [];

  const chunks = cleaned
    .split(/(?<=[.!?])\s+|\s·\s|\s→\s/)
    .map((s) => normalizePublicFragment(s.replace(/[.!?]+$/, "")))
    .filter((s) => s.length >= 18);

  return chunks.filter((s) => {
    if (INTERNAL_SENTENCE.test(s)) return false;
    if (/^fecha:/i.test(s)) return false;
    if (/^fuente:/i.test(s)) return false;
    if (/^\d{2}-\d{2}-\d{4}/.test(s)) return false;
    if (/^sedes?\s+t[ií]picas/i.test(s)) return false;
    if (/^hockey c[eé]sped fehoch\b/i.test(s)) return false;
    return true;
  });
}

function factAddsValue(fact: string, title: string): boolean {
  if (fact.length < 28) return false;
  const words = title
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4);
  const factLower = fact.toLowerCase();
  const overlap = words.filter((w) => factLower.includes(w)).length;
  if (overlap >= Math.min(3, words.length)) {
    return /court central|centro claudia|vel[oó]dromo|cross country|competencia|clasificatorio|delegaciones|universitarias|expositores|congreso|feria/i.test(
      fact,
    );
  }
  return true;
}

function datePhrase(eventDates: string, multiDay: boolean): string {
  return multiDay ? `entre el ${eventDates}` : `el ${eventDates}`;
}

function sportDetail(title: string): string | null {
  const t = title.toLowerCase();
  if (/hockey/.test(t)) {
    return "Competencia de hockey césped con jornadas en Santiago";
  }
  if (/atletismo|cross country|fedachi/.test(t)) {
    return "Campeonato de atletismo con participantes de distintas regiones";
  }
  if (/copa davis|tenis/.test(t)) {
    return "Serie de tenis con público local y visitantes";
  }
  if (/ciclismo|vel[oó]dromo|panamericano/.test(t)) {
    return "Competencia de ciclismo en pista con delegaciones internacionales";
  }
  if (/v[oó]leibol|fevochi/.test(t)) {
    return "Torneo de vóleibol con equipos nacionales";
  }
  if (/rugby/.test(t)) {
    return "Partido o torneo de rugby con hinchadas viajeras";
  }
  return null;
}

function composeAttendeeDescription(input: {
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
  eventStartsOn?: string;
  eventEndsOn?: string;
  signal?: DemandSignal;
}): string {
  const { eventTitle, venueName, interest, eventDates, signal } = input;
  const multiDay = isMultiDay(input.eventStartsOn, input.eventEndsOn);
  const when = datePhrase(eventDates, multiDay);

  if (/mundial.*u17.*voleibol|voleibol.*u17.*mundial/i.test(eventTitle)) {
    return `Es histórico: Chile organiza por primera vez un Mundial de vóleibol (${when}). Las Guerreras Sub-17 son de todo el país — 9 de 14 jugadoras vienen de regiones — y debutan el 6 ago a las 20:00 vs República Checa en el Parque Estadio Nacional. 24 selecciones en Santiago, San Felipe y Los Andes. Entradas Ticketpro desde $3.800. Ideal para delegaciones, staff, familias e hinchada que necesitan quedarse cerca.`;
  }

  const snippets = signal?.description
    ? extractPublicSentences(signal.description)
    : [];
  const fact =
    snippets.find((s) => factAddsValue(s, eventTitle)) ??
    snippets[0] ??
    null;

  switch (interest) {
    case "concierto": {
      const lead = `${eventTitle} se presenta en ${venueName}, Santiago, ${when}.`;
      const body =
        "Es un show en vivo: confirma horario de puertas, entradas oficiales y cómo llegar al recinto si vienes de otra ciudad.";
      return fact ? `${ensurePeriod(fact)} ${lead} ${body}` : `${lead} ${body}`;
    }
    case "otro_evento": {
      const lead = `${eventTitle} se realiza en ${venueName}, Santiago, ${when}.`;
      const body =
        "Función cultural en sala: conviene llegar con anticipación, revisar ubicación de asientos y planificar alojamiento cerca si viajas desde otra región.";
      return fact ? `${ensurePeriod(fact)} ${lead} ${body}` : `${lead} ${body}`;
    }
    case "partido_futbol": {
      const match = extractFootballMatch(eventTitle);
      const lead = match
        ? `${match.home} recibe a ${match.away} en ${venueName}, Santiago, ${when}, por el Campeonato Nacional.`
        : `${eventTitle} se juega en ${venueName}, Santiago, ${when}.`;
      const body =
        "Partido de fútbol: confirma horario, tribuna y accesos el día del encuentro; en fechas con alta convocatoria hay cortes de calle y colas tempranas.";
      return `${lead} ${body}`;
    }
    case "deporte_competencia": {
      const tip =
        "Consulta calendario de competencias, sedes auxiliares y entradas en la organización oficial del evento.";
      if (fact && factAddsValue(fact, eventTitle)) {
        return `${ensurePeriod(joinFactWithSchedule(fact, when))} ${tip}`;
      }
      const detail = sportDetail(eventTitle);
      const lead = detail
        ? `${eventTitle}: ${detail} en ${venueName}, ${when}.`
        : `${eventTitle} se disputa en ${venueName}, Santiago, ${when}.`;
      return `${lead} ${tip}`;
    }
    case "congreso_feria": {
      const tip =
        "Encuentro profesional con asistentes nacionales e internacionales: revisa credenciales, programa y reserva alojamiento con anticipación.";
      if (fact && factAddsValue(fact, eventTitle)) {
        return `${ensurePeriod(joinFactWithSchedule(fact, when, venueName))} ${tip}`;
      }
      const lead = `${eventTitle} se realiza en ${venueName}, Santiago, ${when}.`;
      return `${lead} ${tip}`;
    }
    case "nieve":
      return `Temporada de nieve en la cordillera (${eventDates}). Santiago funciona como base para Valle Nevado, Farellones y Portillo: planifica traslados, equipo y noches en la ciudad según tu itinerario de ski.`;
    case "feriado_puente":
      return `${eventTitle} en Santiago (${eventDates}). Fin de semana largo con alta movilidad en la ciudad: esta guía reúne alojamiento, transporte y tips para aprovechar el feriado.`;
    case "vacaciones_familias":
      return `${eventTitle} (${eventDates}). Periodo de vacaciones escolares con mayor demanda de planes familiares en Santiago: aquí encontrarás alojamiento, movilidad y actividades recomendadas.`;
    case "turismo_general":
      return `${eventTitle} en Santiago (${eventDates}). Guía práctica con alojamiento, transporte y recomendaciones para moverte por la ciudad en estas fechas.`;
    default: {
      const lead = `${eventTitle} en ${venueName}, Santiago, ${when}.`;
      const body =
        "Información esencial para asistentes: confirma horarios, accesos y entradas en la fuente oficial del evento.";
      return `${lead} ${body}`;
    }
  }
}

/** Texto público sobre el evento (prosa para asistentes, sin ruido de ingest). */
export function publicEventDescription(input: {
  signal?: DemandSignal;
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
  eventStartsOn?: string;
  eventEndsOn?: string;
}): string {
  const raw = input.signal?.description?.trim() ?? "";
  let text = composeAttendeeDescription(input);

  const address = raw ? extractVenueAddress(raw) : null;
  if (
    address &&
    !text.toLowerCase().includes(address.slice(0, 10).toLowerCase()) &&
    !text.toLowerCase().includes(input.venueName.toLowerCase().slice(0, 8))
  ) {
    text = `${text.replace(/\.$/, "")}. Dirección del recinto: ${address}.`;
  }

  const withPeriod = ensurePeriod(text);
  return withPeriod.length > 420
    ? `${withPeriod.slice(0, 417).trimEnd()}…`
    : withPeriod;
}

export function publicEventDescriptionEn(input: {
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
  eventStartsOn?: string;
  eventEndsOn?: string;
}): string {
  const { eventTitle, venueName, interest, eventDates } = input;
  const multiDay = isMultiDay(input.eventStartsOn, input.eventEndsOn);
  const when = multiDay ? `from ${eventDates}` : `on ${eventDates}`;

  switch (interest) {
    case "concierto":
      return `${eventTitle} performs at ${venueName}, Santiago, ${when}. Live show — confirm door times, official tickets and how to reach the venue if you're traveling from out of town.`;
    case "otro_evento":
      return `${eventTitle} at ${venueName}, Santiago, ${when}. Cultural performance — arrive early, check your seat location and book nearby accommodation if you're visiting from another region.`;
    case "partido_futbol": {
      const match = extractFootballMatch(eventTitle);
      const lead = match
        ? `${match.home} host ${match.away} at ${venueName}, Santiago, ${when}, in the Chilean league.`
        : `${eventTitle} at ${venueName}, Santiago, ${when}.`;
      return `${lead} Football match — confirm kickoff, stand and access on match day; expect street closures and early queues on high-demand dates.`;
    }
    case "deporte_competencia":
      return `${eventTitle} at ${venueName}, Santiago, ${when}. Sports competition — check the official schedule, auxiliary venues and tickets with the organizers.`;
    case "congreso_feria":
      return `${eventTitle} at ${venueName}, Santiago, ${when}. Professional gathering with national and international attendees — review credentials, program and book accommodation early.`;
    case "nieve":
      return `Snow season in the Andes (${eventDates}). Use Santiago as your base for Valle Nevado, Farellones and Portillo — plan transfers, gear and city nights around your ski itinerary.`;
    default:
      return `${eventTitle} at ${venueName}, Santiago, ${when}. Essential info for attendees — confirm times, access and tickets through the official event source.`;
  }
}

export function publicEventDescriptionPt(input: {
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
  eventStartsOn?: string;
  eventEndsOn?: string;
}): string {
  const { eventTitle, venueName, interest, eventDates } = input;
  const multiDay = isMultiDay(input.eventStartsOn, input.eventEndsOn);
  const when = multiDay ? `entre ${eventDates}` : `em ${eventDates}`;

  switch (interest) {
    case "concierto":
      return `${eventTitle} se apresenta em ${venueName}, Santiago, ${when}. Show ao vivo — confirme horário de portões, ingressos oficiais e como chegar ao local se vier de outra cidade.`;
    case "otro_evento":
      return `${eventTitle} em ${venueName}, Santiago, ${when}. Apresentação cultural — chegue com antecedência, confira o assento e reserve hospedagem próxima se vier de outra região.`;
    case "partido_futbol": {
      const match = extractFootballMatch(eventTitle);
      const lead = match
        ? `${match.home} recebe ${match.away} em ${venueName}, Santiago, ${when}, pelo campeonato chileno.`
        : `${eventTitle} em ${venueName}, Santiago, ${when}.`;
      return `${lead} Jogo de futebol — confirme horário, setor e acessos no dia; em datas de alta demanda há bloqueios e filas cedo.`;
    }
    case "deporte_competencia":
      return `${eventTitle} em ${venueName}, Santiago, ${when}. Competição esportiva — consulte calendário oficial, sedes auxiliares e ingressos com a organização.`;
    case "congreso_feria":
      return `${eventTitle} em ${venueName}, Santiago, ${when}. Encontro profissional com participantes nacionais e internacionais — revise credenciais, programação e reserve hospedagem com antecedência.`;
    case "nieve":
      return `Temporada de neve na cordilheira (${eventDates}). Santiago como base para Valle Nevado, Farellones e Portillo — planeje traslados, equipamento e noites na cidade conforme seu roteiro de ski.`;
    default:
      return `${eventTitle} em ${venueName}, Santiago, ${when}. Informação essencial para o público — confirme horários, acessos e ingressos na fonte oficial do evento.`;
  }
}
