/**
 * Títulos legibles para eventos: demanda interna y guías públicas.
 * Evita venue/fechas/CTA de ticketing en el H1.
 */
import type { DemandSignal, SignalSource } from "./types";

const MONTHS_ES =
  "enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre";

const VENUE_PREFIX =
  /^(?:teatro|c[uú]pula|la c[uú]pula|parque|estadio|arena|movistar|aut[oó]dromo|centro|club)\b/i;

const VENUE_SUFFIX =
  /\s+(?:parque o'?higgins|estadio bicentenario(?:\s+la\s+florida)?|movistar arena|estadio nacional|santiago centro|lo barnechea|la florida)\s*(?:comprar(?:\s+tickets?)?)?\s*$/i;

const DATE_SINGLE = new RegExp(
  `\\s+\\d{1,2}\\s+de\\s+(?:${MONTHS_ES})(?:\\s+de)?\\s+\\d{4}`,
  "gi",
);

const DATE_MULTI = new RegExp(
  `\\s+\\d{1,2}(?:\\s*,\\s*\\d{1,2})*(?:\\s+y\\s+\\d{1,2})?\\s+de\\s+(?:${MONTHS_ES})(?:\\s+de)?\\s+\\d{4}`,
  "gi",
);

const SOURCE_SPORT: Partial<Record<SignalSource, string>> = {
  fehoch_tournaments: "Hockey césped",
  fedachi: "Atletismo",
  fevochi: "Voleibol",
  club_atletico_santiago: "Atletismo",
  campeonato_chileno: "Fútbol",
};

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripAudienceAndCta(text: string): string {
  return collapseWhitespace(
    text
      .replace(/\s*\(\s*visita desde regiones\s*\)\s*/gi, " ")
      .replace(/\bvisita desde regiones\b/gi, " ")
      .replace(/\bcomprar(?:\s+tickets?)?\b/gi, " ")
      .replace(/\bentradas?\s+a\s+la\s+venta\b/gi, " "),
  );
}

function stripVenuePrefix(text: string): string {
  const slash = text.indexOf(" / ");
  if (slash === -1) return text;
  const prefix = text.slice(0, slash).trim();
  if (VENUE_PREFIX.test(prefix) || /\s-\s[\p{L}\s'.]+$/u.test(prefix)) {
    return text.slice(slash + 3).trim();
  }
  return text;
}

function stripDates(text: string): string {
  let t = text;
  let prev = "";
  while (t !== prev) {
    prev = t;
    t = collapseWhitespace(
      t
        .replace(DATE_MULTI, " ")
        .replace(DATE_SINGLE, " ")
        .replace(
          /\s*-\s*\d{1,2}\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)[^.]*$/gi,
          "",
        ),
    );
  }

  if (!/\b(?:tour|temporada|festival|lollapalooza)\s+20\d{2}\s*$/i.test(t)) {
    t = t.replace(/\s+20\d{2}\s*$/i, "");
  }
  return t.trim();
}

function stripVenueSuffix(text: string): string {
  return collapseWhitespace(text.replace(VENUE_SUFFIX, " "));
}

function stripGenreNoise(text: string): string {
  return collapseWhitespace(
    text
      .replace(/^rock alternativo\s+/i, "")
      .replace(/^rock chileno\s+/i, "")
      .replace(/^música\s+(?=temporada)/i, "")
      .replace(/^charlas\s+/i, "")
      .replace(/^fiesta\s+/i, "")
      .replace(/\s+-\s+en vivo\s*$/i, "")
      .replace(/\s+en vivo\s*$/i, "")
      .replace(/\s+-\s+en lanzamiento\s+en vivo\s*/i, " "),
  );
}

function dedupeAdjacentWords(text: string): string {
  return text.replace(/\b(\w+)\s+\1\b/gi, "$1");
}

function stripWorkshopMeta(text: string): string {
  if (!/^(taller|ciclo|temporada)\b/i.test(text)) return text;
  return text.replace(/\s+-\s+dirigido por\s+.+$/i, "").trim();
}

function stripSeasonalRuleNoise(text: string): string {
  return collapseWhitespace(
    text
      .replace(/\s*\(20\d{2}\)\s*$/i, "")
      .replace(/\s*[-–—]\s*puente (corto|nacional)\s*$/i, "")
      .replace(/\s*[-–—]\s*turismo \+ eventos\s*$/i, "")
      .replace(/\s*\/\s*negocios\s*$/i, ""),
  );
}

function trimPublicLength(text: string, max = 88): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" - ", max);
  if (cut >= 36) return `${text.slice(0, cut).trim()}…`;
  return `${text.slice(0, max - 1).trim()}…`;
}

/** Título corto para guías públicas, cards y señales ingestadas. */
export function normalizePublicEventTitle(raw: string): string {
  let t = collapseWhitespace(raw);
  if (!t) return raw.trim();

  t = stripAudienceAndCta(t);
  t = stripVenuePrefix(t);
  t = stripDates(t);
  t = stripVenueSuffix(t);
  t = stripAudienceAndCta(t);
  t = stripGenreNoise(t);
  t = dedupeAdjacentWords(t);
  t = stripWorkshopMeta(t);
  t = stripSeasonalRuleNoise(t);
  t = t.replace(/\s*[-–—/]\s*$/g, "").trim();

  if (!t) return collapseWhitespace(raw);
  return trimPublicLength(t);
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Deporte legible desde fuente, tags o texto. */
export function sportLabelForSignal(signal: DemandSignal): string | null {
  const fromSource = SOURCE_SPORT[signal.source];
  if (fromSource) return fromSource;

  const tags = signal.audienceTags.map(normalize);
  if (tags.includes("hockey") || tags.some((t) => t.includes("hockey")))
    return "Hockey césped";
  if (tags.includes("atletismo")) return "Atletismo";
  if (tags.includes("voleibol") || tags.includes("volley")) return "Voleibol";
  if (tags.includes("futbol") || tags.includes("fútbol")) return "Fútbol";
  if (tags.includes("basquet") || tags.includes("basquetbol"))
    return "Básquetbol";
  if (tags.includes("tenis")) return "Tenis";
  if (tags.includes("ciclismo")) return "Ciclismo";

  const text = normalize(`${signal.title} ${signal.description}`);
  if (/\bhockey\b|fehoch|cesped|césped/.test(text)) return "Hockey césped";
  if (/\batletismo\b|fedachi|pista|marcha|lanzamiento/.test(text))
    return "Atletismo";
  if (/\bvoleibol\b|volleyball|fevochi|fivb/.test(text)) return "Voleibol";
  if (/\bfutbol\b|anfp|campeonato chileno/.test(text)) return "Fútbol";
  if (/\btenis\b|copa davis|chile open|atp/.test(text)) return "Tenis";
  if (/\bciclismo\b|bmx|ruta|pista cicl/.test(text)) return "Ciclismo";
  if (/\bbasquet|baloncesto|lnb\b/.test(text)) return "Básquetbol";
  if (/\bironman\b|triatlon|triatlón/.test(text)) return "Triatlón";

  if (signal.kind === "sport") return "Deporte";
  return null;
}

/**
 * Limpia títulos federados crudos (FEHOCH, etc.):
 * "2026 Nacional - Sub 19 Damas A Torneo Nacional" → "Nacional Sub 19 Damas A"
 */
export function cleanSportDetail(raw: string): string {
  let t = raw.replace(/\s+/g, " ").trim();

  // Año inicial
  t = t.replace(/^20\d{2}\s*[-–:]?\s*/i, "");

  // "Torneo Nacional" redundante (al final o pegado)
  t = t.replace(/\s*[-–]?\s*Torneo\s+Nacional\s*$/i, "");
  t = t.replace(/\bTorneo\s+Nacional\b/gi, "").replace(/\s+/g, " ").trim();

  // Guiones raros
  t = t.replace(/\s*[-–]\s*/g, " ").replace(/\s+/g, " ").trim();

  // Capitalizar suave si viene todo en mayúsculas cortas
  if (t.length > 0 && t === t.toUpperCase() && t.length < 80) {
    t = t
      .toLowerCase()
      .replace(/(^|\s)([a-záéíóúñ])/g, (_, a, b) => a + b.toUpperCase());
  }

  return t || raw.trim();
}

function alreadyHasSport(title: string, sport: string): boolean {
  const n = normalize(title);
  const sportKey = normalize(sport).split(/\s+/)[0] ?? "";
  return sportKey.length > 2 && n.includes(sportKey);
}

/** Título para demanda / listados: siempre con deporte visible. */
export function polishEventTitle(signal: DemandSignal): string {
  const baseTitle = normalizePublicEventTitle(signal.title);

  if (signal.source === "campeonato_chileno") {
    const sport = "Fútbol";
    const detail = cleanSportDetail(baseTitle);
    if (alreadyHasSport(detail, sport)) {
      return detail.slice(0, 140);
    }
    return `${sport} · ${detail}`.slice(0, 140);
  }

  if (signal.kind !== "sport") {
    return baseTitle.slice(0, 140);
  }

  const sport = sportLabelForSignal(signal);
  if (!sport) return baseTitle.slice(0, 140);

  const detail = cleanSportDetail(baseTitle);
  if (alreadyHasSport(detail, sport)) {
    return detail.slice(0, 140);
  }

  return `${sport} · ${detail}`.slice(0, 140);
}

/** Partes para copy de campaña / landing. */
export function sportCopyParts(signal: DemandSignal | undefined): {
  sport: string | null;
  detail: string;
  displayTitle: string;
} {
  if (!signal) {
    return { sport: null, detail: "el evento", displayTitle: "Evento en Santiago" };
  }
  const sport = sportLabelForSignal(signal);
  const displayTitle = polishEventTitle(signal);
  const detail = sport
    ? cleanSportDetail(normalizePublicEventTitle(signal.title))
    : normalizePublicEventTitle(signal.title);
  return { sport, detail, displayTitle };
}

/** Headline vendedor (no arrastra el código del torneo al H1). */
export function sportLandingHeadline(input: {
  signal?: DemandSignal;
  venueName: string;
  nearestMins: number;
}): string {
  const { sport, detail } = sportCopyParts(input.signal);
  const venue = input.venueName;
  const mins = input.nearestMins;

  if (sport && sport !== "Deporte") {
    return `${sport} en Santiago: duerme a ${mins} min de ${venue}`;
  }
  if (detail.length <= 48) {
    return `${detail}: alojamiento a ${mins} min de ${venue}`;
  }
  return `Competencia en Santiago: alojamiento a ${mins} min de ${venue}`;
}

export function sportLandingSubhead(input: {
  signal?: DemandSignal;
  eventDates: string;
  venueName: string;
  nearestMins: number;
  placeHook: string;
  stayHint: string;
}): string {
  const { sport, detail } = sportCopyParts(input.signal);
  const what =
    sport && sport !== "Deporte"
      ? `${sport}: ${detail}`
      : detail;
  return `${what}. ${input.eventDates}. A ~${input.nearestMins} min de ${input.venueName}. Pensado para deportistas, staff y familias que viajan. ${input.placeHook}. ${input.stayHint}`;
}
