/**
 * Agrupa torneos FEHOCH / hockey en una guía por fin de semana + serie
 * (Nacional, Apertura, Clausura…), en vez de una guía por categoría.
 */
import { cleanSportDetail } from "./event-title";
import type { DemandSignal } from "./types";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Viernes de la semana del evento (ancla de fin de semana). */
export function weekendFriday(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const dow = d.getDay();
  const daysFromFriday = (dow + 2) % 7;
  d.setDate(d.getDate() - daysFromFriday);
  return d.toISOString().slice(0, 10);
}

export function isHockeySignal(signal: DemandSignal): boolean {
  if (signal.source === "fehoch_tournaments") return true;
  const tags = signal.audienceTags.map(normalize);
  if (tags.some((t) => t.includes("hockey"))) return true;
  const text = normalize(`${signal.title} ${signal.description}`);
  return (
    signal.source === "ind_cl" && /\bhockey\b|fih|qualifiers/.test(text)
  );
}

/** Regiones fuera de RM: no son inventario Santiago. */
const NON_RM_HOCKEY_REGION =
  /\baraucania\b|\bvalparaiso\b|\bvalpo\b|\bbio\s*bio\b|\bbiobio\b|\bmaule\b|\blos\s*lagos\b|\bantofagasta\b|\btarapaca\b|\baysen\b|\bmagallanes\b|\bohiggins\b|\bnuble\b|\bcoquimbo\b|\batacama\b/;

/** Categorías formativas / ligas locales sin pernocta de regiones. */
const YOUTH_HOCKEY_CATEGORY =
  /\bsub\s*1[24689]\b|\bsub\s*12\b|\bsub\s*14\b|\bsub\s*16\b|\bsub\s*19\b|\binfantil\b|\bmini\b|\bescolar\b|\bpre\s*infantil\b/;

/** Liga H5 / torneos zonal FEHOCH (mayoría clubes RM). */
const H5_OR_ZONAL_HOCKEY = /\bh5\b|\btorneo\s+zonal\b|\bliga\s+zonal\b/;

function hockeyBlob(signal: DemandSignal): string {
  return normalize(`${signal.title} ${signal.description}`);
}

/** Evalúa nombre crudo del torneo FEHOCH (antes de crear señal). */
export function isRelevantFehochTournamentName(name: string): boolean {
  const t = normalize(name);
  if (/\bfih\b|qualifier/.test(t)) return true;
  if (NON_RM_HOCKEY_REGION.test(t)) return false;
  if (YOUTH_HOCKEY_CATEGORY.test(t)) return false;
  if (/\bintermedia\b/.test(t)) return false;
  if (H5_OR_ZONAL_HOCKEY.test(t)) return false;
  if (/\bnacional\s+primera\b/.test(t)) return true;
  if (/\bprimera\s+(varones|damas)\b/.test(t)) return true;
  return false;
}

/**
 * Hockey con demanda de pernocta: selecciones/FIH y Primera adulta nacional.
 * Excluye Sub 12–19, Intermedia, H5 y torneos regionales fuera de RM.
 */
export function isRelevantHockeySignal(signal: DemandSignal): boolean {
  if (!isHockeySignal(signal)) return true;

  const t = hockeyBlob(signal);

  if (/\bfih\b|world cup|qualifiers|mundial|internacional/.test(t)) {
    return true;
  }
  if (signal.source === "ind_cl") return true;

  if (NON_RM_HOCKEY_REGION.test(t)) return false;
  if (YOUTH_HOCKEY_CATEGORY.test(t)) return false;
  if (/\bintermedia\b/.test(t)) return false;
  if (H5_OR_ZONAL_HOCKEY.test(t)) return false;

  if (/\bnacional\s+primera\b/.test(t)) return true;
  if (/\bprimera\s+(varones|damas)\b/.test(t)) return true;

  if (signal.source === "fehoch_tournaments") return false;

  return true;
}

/** Serie del torneo: nacional, apertura, clausura, fih… */
export function extractFehochSeries(title: string): string | null {
  const stripped = title
    .replace(/^Hockey c[eé]sped\s*[·\-]\s*/i, "")
    .trim();
  const detail = cleanSportDetail(stripped);

  const fromStart = detail.match(
    /^(nacional|apertura|clausura|intermedia|qualifier|qualifiers|fih)\b/i,
  );
  if (fromStart) return fromStart[1].toLowerCase().replace(/s$/, "");

  const anywhere = detail.match(
    /\b(nacional|apertura|clausura|intermedia)\b/i,
  );
  if (anywhere) return anywhere[1].toLowerCase();

  if (/\bfih\b|qualifiers/i.test(detail)) return "fih";
  return null;
}

/** Clave de campaña compartida por categorías del mismo fin de semana. */
export function hockeyCampaignGroupKey(signal: DemandSignal): string | null {
  if (!isHockeySignal(signal)) return null;
  const series =
    extractFehochSeries(signal.title) ??
    (signal.source === "ind_cl" ? "fih" : "torneo");
  const weekend = weekendFriday(signal.startsOn);
  return `hockey:${weekend}:${series}`;
}

const SERIES_LABEL: Record<string, string> = {
  nacional: "Nacional",
  apertura: "Apertura",
  clausura: "Clausura",
  intermedia: "Intermedia",
  qualifier: "Qualifiers",
  fih: "FIH Qualifiers",
  torneo: "Torneo",
};

export function seriesLabel(series: string): string {
  return SERIES_LABEL[series] ?? series.charAt(0).toUpperCase() + series.slice(1);
}

/** Título de guía cuando varias categorías comparten fin de semana. */
export function groupedHockeyTitle(signals: DemandSignal[]): string {
  const lead = signals[0]!;
  if (signals.length === 1) return lead.title;

  const series =
    extractFehochSeries(lead.title) ??
    (lead.source === "ind_cl" ? "fih" : "torneo");
  const label = seriesLabel(series);

  if (signals.length === 2) {
    const cats = signals
      .map((s) =>
        cleanSportDetail(
          s.title.replace(/^Hockey c[eé]sped\s*[·\-]\s*/i, ""),
        ),
      )
      .map((c) => c.replace(/^(Nacional|Apertura|Clausura|Intermedia)\s+/i, ""))
      .join(" y ");
    return `Hockey césped · ${label} — ${cats}`.slice(0, 140);
  }

  return `Hockey césped · ${label} (${signals.length} categorías)`.slice(
    0,
    140,
  );
}

/** Categorías incluidas (para copy / drivers). */
export function hockeyCategoryLabels(signals: DemandSignal[]): string[] {
  return signals.map((s) =>
    cleanSportDetail(
      s.title.replace(/^Hockey c[eé]sped\s*[·\-]\s*/i, ""),
    ),
  );
}

export function spanSignalDates(
  signals: DemandSignal[],
  rangeStart: string,
  rangeEnd: string,
): { startsOn: string; endsOn: string } | null {
  let start: string | null = null;
  let end: string | null = null;

  for (const s of signals) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.startsOn)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.endsOn)) continue;
    const sStart = s.startsOn > rangeStart ? s.startsOn : rangeStart;
    const sEnd = s.endsOn < rangeEnd ? s.endsOn : rangeEnd;
    if (sStart > sEnd) continue;
    if (!start || sStart < start) start = sStart;
    if (!end || sEnd > end) end = sEnd;
  }

  if (!start || !end) return null;
  return { startsOn: start, endsOn: end };
}
