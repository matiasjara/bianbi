/**
 * Congresos, convenciones y ferias sectoriales con demanda de pernocta
 * (delegaciones, expositores y asistentes de otras ciudades/países).
 */
import type { DemandSignal } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const CONGRESS_FAIR_KEYWORDS =
  /\b(congreso|convencion|convención|simposio|summit|cumbre|forum|foro|expo\b|feria|trade show|conference|convenciones|mice|congress|symposium|jornadas)\b/;

const LOCAL_FAIR_NOISE =
  /\bferia libre\b|\bferia vecinal\b|\bferia navide[nñ]a\b|\bferia de pulgas\b|\bferia artesanal\b|\bferia escolar\b/;

const MAJOR_VENUE =
  /\bespacio riesco|metropolitan santiago|centro parque|estacion mapocho|mapocho|casapiedra|casa piedra|hotel intercontinental|w hotel|monticello centro|huechuraba|vitacura|las condes\b/;

/** Título o descripción sugiere congreso/feria profesional (no feria barrial). */
export function isCongressOrFairEvent(text: string): boolean {
  const t = normalize(text);
  if (LOCAL_FAIR_NOISE.test(t)) return false;
  if (/\bferia del libro\b|\bfil\b.*\bsantiago\b|\bexpo salud\b|\bexpo hospital\b|\bedifica\b|\bfidae\b|\bexpomin\b/.test(t)) {
    return true;
  }
  if (!CONGRESS_FAIR_KEYWORDS.test(t)) return false;
  if (/\bexposici[oó]n\b/.test(t) && !/\bferia\b|\bexpo\b|\bcongreso\b/.test(t)) {
    return false;
  }
  return true;
}

export function isCongressOrFairSignal(signal: DemandSignal): boolean {
  if (signal.source === "congresos_ferias_cl") return true;
  const tags = signal.audienceTags.map(normalize);
  if (tags.some((t) => t.includes("congreso") || t.includes("feria") || t.includes("mice"))) {
    return true;
  }
  return isCongressOrFairEvent(`${signal.title} ${signal.description}`);
}

export function congressVenueHint(text: string): string | null {
  const t = normalize(text);
  if (t.includes("espacio riesco") || t.includes("huechuraba")) {
    return "Espacio Riesco, Huechuraba";
  }
  if (t.includes("metropolitan")) return "Metropolitan Santiago, Las Condes";
  if (t.includes("centro parque")) return "Centro Parque, Providencia";
  if (t.includes("mapocho")) return "Centro Cultural Estación Mapocho";
  if (MAJOR_VENUE.test(t)) return "Santiago";
  return null;
}
