import type { CampaignInterest, DemandSignal } from "./types";

const INGEST_NOISE = [
  /\baudiencia objetivo:.*?(?=\.|$)/gi,
  /\bpernocta\s*\+\s*mailing\b/gi,
  /\bfuente:\s*[^.]+\.?/gi,
  /\bevento detectado desde[^.]+\.?/gi,
  /\bverificar fecha\/venue\.?/gi,
  /\bevento ticketplus\s*·\s*[^.]+\.\s*/gi,
  /\bticketplus\s*·\s*[^.]+\.\s*/gi,
  /\bfecha:\s*[\d\-–—/,\s]+(?:\.|$)/gi,
  /\b\d{2}-\d{2}-\d{4}(?:\s*[–—-]\s*\d{2}-\d{2}-\d{4})?\.?\s*$/i,
];

const GENERIC_DESCRIPTION =
  /^(evento detectado|partido anfp en|m[uú]sica en|feriado oficial|temporada de)/i;

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\.\.+/g, ".").trim();
}

function extractVenueAddress(raw: string): string | null {
  const m = raw.match(
    /(?:Av\.|Avda\.|Avenida|Calle|Parque|Estadio)[^.]*(?:Chile|Santiago|RM|Providencia|Ñuñoa|Ñuble|Macul|Peñalolén)[^.]*/i,
  );
  if (!m) return null;
  const addr = collapse(m[0].replace(/\.\s*$/, ""));
  return addr.length >= 12 ? addr : null;
}

function cleanRawDescription(raw: string): string {
  let t = collapse(raw);
  for (const re of INGEST_NOISE) {
    t = collapse(t.replace(re, " "));
  }
  t = t.replace(/^partido en santiago rm:\s*/i, "Partido del Campeonato Chileno: ");
  t = t.replace(/^partido anfp en\s+/i, "Partido del Campeonato Chileno en ");
  t = t.replace(/^m[uú]sica en\s+/i, "Concierto en ");
  t = t.replace(/^evento ticketplus\s*·\s*/i, "");
  t = t.replace(/^ticketplus\s*·\s*/i, "");
  t = t.replace(/^agenda tocador\s*·\s*ticketera:\s*\w+\.\s*/i, "");
  return collapse(t);
}

function fallbackDescription(input: {
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
}): string {
  const { eventTitle, venueName, interest, eventDates } = input;
  switch (interest) {
    case "concierto":
      return `${eventTitle} en ${venueName}, Santiago. ${eventDates}.`;
    case "partido_futbol":
      return `Partido de fútbol en ${venueName}: ${eventTitle}. ${eventDates}.`;
    case "deporte_competencia":
      return `${eventTitle} — competencia en ${venueName}, Santiago. ${eventDates}.`;
    case "congreso_feria":
      return `${eventTitle} en ${venueName}, Santiago. Congreso/feria con asistentes de regiones e internacionales. ${eventDates}.`;
    case "nieve":
      return `Temporada de nieve en Chile (${eventDates}). Santiago como base para Valle Nevado, Farellones y Portillo.`;
    case "feriado_puente":
    case "vacaciones_familias":
    case "turismo_general":
      return `${eventTitle} en Santiago (${eventDates}). Guía de alojamiento y movilidad en la ciudad.`;
    default:
      return `${eventTitle} en ${venueName}, Santiago. ${eventDates}.`;
  }
}

function isUsefulDescription(text: string): boolean {
  if (text.length < 24) return false;
  if (GENERIC_DESCRIPTION.test(text) && text.length < 80) return false;
  if (/^feriado oficial chile/i.test(text)) return false;
  return true;
}

/** Texto público sobre el evento (sin ruido de ingest ni audiencia interna). */
export function publicEventDescription(input: {
  signal?: DemandSignal;
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
}): string {
  const raw = input.signal?.description?.trim() ?? "";
  const cleaned = raw ? cleanRawDescription(raw) : "";
  const address = raw ? extractVenueAddress(raw) : null;
  let text = isUsefulDescription(cleaned)
    ? cleaned
    : fallbackDescription(input);

  if (
    address &&
    !text.toLowerCase().includes(address.slice(0, 10).toLowerCase())
  ) {
    text = `${text.replace(/\.$/, "")}. Ubicación: ${address}.`;
  }

  const withPeriod = text.endsWith(".") ? text : `${text}.`;
  return withPeriod.length > 320 ? `${withPeriod.slice(0, 317).trimEnd()}…` : withPeriod;
}

export function publicEventDescriptionEn(input: {
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
}): string {
  const { eventTitle, venueName, interest, eventDates } = input;
  switch (interest) {
    case "concierto":
      return `${eventTitle} at ${venueName}, Santiago. ${eventDates}.`;
    case "partido_futbol":
      return `Football match at ${venueName}: ${eventTitle}. ${eventDates}.`;
    case "deporte_competencia":
      return `${eventTitle} — competition at ${venueName}, Santiago. ${eventDates}.`;
    case "nieve":
      return `Chile snow season (${eventDates}). Santiago as your base for Valle Nevado, Farellones and Portillo.`;
    default:
      return `${eventTitle} at ${venueName}, Santiago. ${eventDates}.`;
  }
}

export function publicEventDescriptionPt(input: {
  eventTitle: string;
  venueName: string;
  interest: CampaignInterest;
  eventDates: string;
}): string {
  const { eventTitle, venueName, interest, eventDates } = input;
  switch (interest) {
    case "concierto":
      return `${eventTitle} em ${venueName}, Santiago. ${eventDates}.`;
    case "partido_futbol":
      return `Jogo de futebol em ${venueName}: ${eventTitle}. ${eventDates}.`;
    case "deporte_competencia":
      return `${eventTitle} — competição em ${venueName}, Santiago. ${eventDates}.`;
    case "nieve":
      return `Temporada de neve no Chile (${eventDates}). Santiago como base para Valle Nevado, Farellones e Portillo.`;
    default:
      return `${eventTitle} em ${venueName}, Santiago. ${eventDates}.`;
  }
}
