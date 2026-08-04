/**
 * Intereses de campaña: marketing dirigido = una intención por pack.
 * Nieve ≠ concierto ≠ partido ≠ competencia federada.
 */
import type { CampaignInterest, DemandSignal } from "./types";
import {
  competitionCampaignGroupKey,
} from "./competition-group";
import {
  hockeyCampaignGroupKey,
  isHockeySignal,
} from "./hockey-group";
import { isCongressOrFairEvent, isCongressOrFairSignal } from "./congress-fair";
import { showCampaignGroupKey } from "./show-group";

export type { CampaignInterest };

const INTEREST_LABELS: Record<CampaignInterest, string> = {
  nieve: "Nieve / ski",
  concierto: "Concierto / show",
  partido_futbol: "Partido de fútbol",
  deporte_competencia: "Competencia deportiva",
  feriado_puente: "Feriado / puente",
  vacaciones_familias: "Vacaciones familias",
  turismo_general: "Turismo estacional",
  congreso_feria: "Congreso / feria",
  otro_evento: "Teatro / cultura / otros",
};

export function interestLabel(interest: CampaignInterest): string {
  return INTEREST_LABELS[interest];
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugPart(s: string) {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/** Stand-up / humor en vivo → tratamos como show, no teatro. */
function isStandUpOrComedyShow(text: string): boolean {
  return /\bstandup\b|\bstand-up\b|\bstand up\b|\bhumorista\b|\bcomedia en vivo\b|\bcomedy\b|\bopen mic\b|\bopen mic\b/i.test(
    text,
  );
}

/** Teatro, danza, artes escénicas y formatos culturales (no música). */
export function isTheaterOrCulturalEvent(text: string): boolean {
  const t = normalize(text);
  if (isStandUpOrComedyShow(t)) return false;
  if (isCongressOrFairEvent(t)) return false;

  return (
    /\bteatro\b|\bobra\b|\bdramatur|\bmon[oó]logo\b|\bfunci[oó]n\b|\bartes esc[eé]nicas\b|\bmontaje\b|\bpuesta en escena\b|\bcompa[nñ][ií]a teatral\b|\bciclo de teatro\b|\btemporada teatral\b|\bteatral\b|\bbeckett\b|\bshakespeare\b|\bchejov\b|\bibsen\b|\bpinter\b|\bvidela\b|\bescenograf/i.test(
      t,
    ) ||
    /\bteatro mori\b|\bmori bellavista\b|morand[eé]\s*25|\bteatro oriente\b|\bteatro nescaf|\bteatro municipal\b|\bsala metr[oó]nomo\b|\bteatro zoco\b|\bteatro cariola\b|\bteatro caupol|\bteatro coliseo\b|\bteatro universitario\b|\bcentro cultural\b|\bcentro gam\b|\bestaci[oó]n mapocho\b/i.test(
      t,
    ) ||
    /\b(danza|ballet|performance|museo|charla|conferencia|taller|seminario)\b/i.test(
      t,
    ) ||
    /\bexposici[oó]n\b|\bferia del libro\b/i.test(t)
  );
}

/** Conciertos, tours y shows musicales. */
export function isMusicConcertEvent(text: string): boolean {
  const t = normalize(text);
  if (isTheaterOrCulturalEvent(t)) return false;

  return (
    /\bconcierto\b|\btour\b|\blive in\b|\bfestival\b|\blollapalooza\b|\bcreamfields\b|\bfauna\b|\bjazz\b|\brock\b|\bpop\b|\bmusica\b|\bm[uú]sica\b|\bbanda\b|\bdj\b|\brecital\b|\bciclo de piano\b|\bsoda stereo\b|\bser[uú] gir[aá]n\b|\bmovistar arena\b|\bestadio nacional\b|\bparque o'?higgins\b|\bclub subterr[aá]neo\b|\bblondie\b|\brock alternativo\b|\brock chileno\b/i.test(
      t,
    )
  );
}

/** Tags de audiencia al ingestar (TicketPlus, etc.). */
export function inferEventAudienceTags(title: string, blob = ""): string[] {
  const text = normalize(`${title} ${blob}`);
  const tags = ["eventos"];
  if (isCongressOrFairEvent(text)) {
    tags.push("congresos", "ferias", "mice");
  } else if (isTheaterOrCulturalEvent(text)) {
    tags.push("teatro", "cultura");
  } else if (isMusicConcertEvent(text)) {
    tags.push("conciertos");
  }
  return tags;
}

/** Clasifica una señal en un interés de campaña (mutuamente excluyente). */
export function classifyInterest(signal: DemandSignal): CampaignInterest {
  const text = normalize(`${signal.title} ${signal.description}`);
  const tags = signal.audienceTags.map(normalize);

  if (
    tags.includes("nieve") ||
    /\bnieve\b|ski|valle nevado|farellones|portillo|la parva|el colorado/.test(
      text,
    )
  ) {
    return "nieve";
  }

  if (signal.kind === "school_break") {
    return "vacaciones_familias";
  }

  if (
    tags.includes("familias") &&
    /vacaciones de invierno|receso escolar|invierno escolares/.test(text)
  ) {
    return "vacaciones_familias";
  }

  if (
    signal.kind === "holiday" ||
    /fiestas patrias|feriado|puente nacional|dieciocho/.test(text)
  ) {
    return "feriado_puente";
  }
  const isFootball =
    signal.source === "campeonato_chileno" ||
    tags.includes("futbol") ||
    /\banfp\b|campeonato chileno|primera division|\bvs\.?\b.*\b(colo|universidad|palestino|huachipato|nublense|everton|coquimbo|ohiggins|wanderers)/.test(
      text,
    ) ||
    (/\bvs\.?\b/.test(text) &&
      /colo|universidad|palestino|huachipato|audax|union espanola|magallanes|river|boca/.test(
        text,
      ));

  if (isFootball && (signal.kind === "sport" || /\bvs\.?\b/.test(text))) {
    return "partido_futbol";
  }

  const isFederation =
    signal.source === "fedachi" ||
    signal.source === "fehoch_tournaments" ||
    signal.source === "fevochi" ||
    signal.source === "ind_cl" ||
    signal.source === "club_atletico_santiago" ||
    tags.includes("federaciones") ||
    /fedachi|fehoch|fevochi|copa davis|chile open|panamericano|interescolar|atletismo|hockey|ciclismo|voleibol|mundial u\d+|qualifiers|ironman/.test(
      text,
    );

  if (isFederation || signal.kind === "sport") {
    return "deporte_competencia";
  }

  if (
    isCongressOrFairSignal(signal) ||
    isCongressOrFairEvent(text) ||
    tags.some((t) => t.includes("congreso") || t.includes("mice"))
  ) {
    return "congreso_feria";
  }

  if (isTheaterOrCulturalEvent(text) || tags.includes("teatro")) {
    return "otro_evento";
  }

  if (
    isMusicConcertEvent(text) ||
    tags.includes("conciertos") ||
    /concierto|tour|live in|festival|lollapalooza|standup|stand-up/.test(text)
  ) {
    return "concierto";
  }

  if (signal.kind === "event") {
    return "otro_evento";
  }

  if (
    signal.kind === "tourism_flow" ||
    signal.kind === "seasonality" ||
    tags.includes("turismo") ||
    tags.includes("brasil")
  ) {
    return "turismo_general";
  }

  return "otro_evento";
}

/** Extrae par local-visita para deduplicar el mismo partido desde varias fuentes. */
export function extractFootballPair(title: string): string | null {
  const n = normalize(title)
    .replace(/\(.*?\)/g, " ")
    .replace(/clasico\s*[·\-]?\s*/g, " ")
    .replace(
      /estadio nacional|nu[nñ]oa|futbol|liga de primera|mercado libre|fecha\s*\d+/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

  const m = n.match(/([a-z0-9][a-z0-9 ]{2,40}?)\s+vs\.?\s+([a-z0-9][a-z0-9 ]{2,40}?)(?:\s|$)/);
  if (!m) return null;
  const home = slugPart(m[1]);
  const away = slugPart(m[2]);
  if (!home || !away) return null;
  return `${home}-vs-${away}`;
}

/**
 * Clave de agrupación: solo señales del mismo interés (y mismo evento) se juntan.
 * Nunca mezcla nieve con un partido ni un concierto con una competencia.
 */
export function campaignGroupKey(
  signal: DemandSignal,
  rangeStart: string,
  rangeEnd: string,
): string {
  const interest = classifyInterest(signal);

  if (interest === "nieve") {
    // Una campaña de nieve por mes del rango (no por partido del fds)
    const monthKey = rangeStart.slice(0, 7);
    return `nieve:${monthKey}`;
  }

  if (interest === "vacaciones_familias") {
    return `vacaciones:${signal.startsOn}:${signal.endsOn}`;
  }

  if (interest === "feriado_puente") {
    return `feriado:${signal.startsOn}:${slugPart(signal.title).slice(0, 32)}`;
  }

  if (interest === "partido_futbol") {
    const pair = extractFootballPair(signal.title);
    return `futbol:${signal.startsOn}:${pair ?? slugPart(signal.title)}`;
  }

  if (interest === "deporte_competencia") {
    const hockeyKey = hockeyCampaignGroupKey(signal);
    if (hockeyKey) return hockeyKey;
    const competitionKey = competitionCampaignGroupKey(signal);
    if (competitionKey) return competitionKey;
    return `comp:${signal.startsOn}:${slugPart(signal.title).slice(0, 40)}`;
  }

  if (interest === "concierto") {
    return showCampaignGroupKey(signal);
  }

  if (interest === "congreso_feria") {
    return `mice:${signal.startsOn}:${slugPart(signal.title).slice(0, 40)}`;
  }

  if (interest === "turismo_general") {
    const monthKey = rangeStart.slice(0, 7);
    return `turismo:${monthKey}:${slugPart(signal.title).slice(0, 24)}`;
  }

  return `otro:${signal.startsOn}:${slugPart(signal.title).slice(0, 40)}:${rangeEnd.slice(0, 7)}`;
}

export function intentionSlugForInterest(
  interest: CampaignInterest,
  signals: DemandSignal[],
): string {
  const lead = signals[0];
  const pois = signals.flatMap((s) => s.poiIds);

  switch (interest) {
    case "nieve":
      return "nieve-santiago-hub";
    case "vacaciones_familias":
      return pois.includes("poi-fantasilandia")
        ? "fantasilandia-familias"
        : "santiago-familias";
    case "feriado_puente":
      return "puente-santiago";
    case "partido_futbol": {
      const pair = lead ? extractFootballPair(lead.title) : null;
      return pair ? `futbol-${pair}` : "estadio-nacional";
    }
    case "deporte_competencia":
      if (lead && isHockeySignal(lead)) {
        const key = hockeyCampaignGroupKey(lead);
        if (key) return key.replace(/:/g, "-");
      }
      if (pois.includes("poi-estadio")) return "competencia-estadio";
      return `competencia-${slugPart(lead?.title ?? "santiago").slice(0, 28)}`;
    case "concierto":
      if (pois.includes("poi-movistar")) return "movistar-arena";
      if (pois.includes("poi-estadio")) return "estadio-nacional";
      return `show-${slugPart(lead?.title ?? "santiago").slice(0, 28)}`;
    case "congreso_feria":
      if (pois.includes("poi-metropolitan")) return "metropolitan-santiago";
      if (pois.includes("poi-espacio-riesco")) return "espacio-riesco";
      if (pois.includes("poi-centro-parque")) return "centro-parque";
      if (pois.includes("poi-costanera")) return "congresos-oriente";
      return `congreso-${slugPart(lead?.title ?? "santiago").slice(0, 28)}`;
    case "turismo_general":
      return "turismo-santiago";
    default:
      return "barrio-italia";
  }
}

export function clipSignalToRange(
  signal: DemandSignal,
  rangeStart: string,
  rangeEnd: string,
): { startsOn: string; endsOn: string } | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(signal.startsOn) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(signal.endsOn)
  ) {
    return null;
  }
  // Rechaza placeholders tipo 9999-99-99
  if (Number.isNaN(Date.parse(`${signal.startsOn}T12:00:00Z`))) return null;
  if (Number.isNaN(Date.parse(`${signal.endsOn}T12:00:00Z`))) {
    const start = signal.startsOn > rangeStart ? signal.startsOn : rangeStart;
    const end = rangeEnd;
    if (start > end) return null;
    return { startsOn: start, endsOn: end };
  }
  const start = signal.startsOn > rangeStart ? signal.startsOn : rangeStart;
  const end = signal.endsOn < rangeEnd ? signal.endsOn : rangeEnd;
  if (start > end) return null;
  return { startsOn: start, endsOn: end };
}
