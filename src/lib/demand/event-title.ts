/**
 * Títulos legibles y vendedores para eventos deportivos.
 * Evita "2026 Clausura - Intermedia Damas A Torneo Nacional" sin deporte.
 */
import type { DemandSignal, SignalSource } from "./types";

const SOURCE_SPORT: Partial<Record<SignalSource, string>> = {
  fehoch_tournaments: "Hockey césped",
  fedachi: "Atletismo",
  fevochi: "Voleibol",
  club_atletico_santiago: "Atletismo",
  campeonato_chileno: "Fútbol",
};

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
  if (signal.source === "campeonato_chileno") {
    const sport = "Fútbol";
    const detail = cleanSportDetail(signal.title);
    if (alreadyHasSport(detail, sport) || alreadyHasSport(signal.title, sport)) {
      return detail.slice(0, 140);
    }
    return `${sport} · ${detail}`.slice(0, 140);
  }

  if (signal.kind !== "sport") return signal.title;

  const sport = sportLabelForSignal(signal);
  if (!sport) return signal.title;

  const detail = cleanSportDetail(signal.title);
  if (alreadyHasSport(detail, sport) || alreadyHasSport(signal.title, sport)) {
    // Si el crudo ya tenía el deporte, igual limpiamos año/ruido
    const cleaned = cleanSportDetail(signal.title);
    if (alreadyHasSport(cleaned, sport)) return cleaned.slice(0, 140);
    return `${sport} · ${cleaned}`.slice(0, 140);
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
    ? cleanSportDetail(signal.title)
    : signal.title.trim();
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
    return `${detail}: depto a ${mins} min de ${venue}`;
  }
  return `Competencia en Santiago: depto a ${mins} min de ${venue}`;
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
