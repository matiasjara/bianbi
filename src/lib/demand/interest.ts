/**
 * Intereses de campaña: marketing dirigido = una intención por pack.
 * Nieve ≠ concierto ≠ partido ≠ competencia federada.
 */
import type { CampaignInterest, DemandSignal } from "./types";
import {
  hockeyCampaignGroupKey,
  isHockeySignal,
} from "./hockey-group";

export type { CampaignInterest };

const INTEREST_LABELS: Record<CampaignInterest, string> = {
  nieve: "Nieve / ski",
  concierto: "Concierto / show",
  partido_futbol: "Partido de fútbol",
  deporte_competencia: "Competencia deportiva",
  feriado_puente: "Feriado / puente",
  vacaciones_familias: "Vacaciones familias",
  turismo_general: "Turismo estacional",
  otro_evento: "Otro evento",
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
    signal.kind === "event" ||
    /concierto|tour|live in|movistar arena|teatro|festival|lollapalooza|standup|stand-up/.test(
      text,
    )
  ) {
    return "concierto";
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
    return `comp:${signal.startsOn}:${slugPart(signal.title).slice(0, 40)}`;
  }

  if (interest === "concierto") {
    return `show:${signal.startsOn}:${slugPart(signal.title).slice(0, 40)}`;
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
