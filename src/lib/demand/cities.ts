/**
 * Ciudades operativas de Crambie.
 * Guías públicas por ciudad; inventario actual solo Santiago RM.
 */
import type { CityId, DemandSignal } from "./types";

/** Ciudad inferida del evento; `other` = fuera del catálogo activo. */
export type EventCity = CityId | "other";

export type { CityId };

export type CityOption = {
  id: CityId;
  label: string;
  /** ¿Hay guías + inventario activos? */
  active: boolean;
};

export const CITY_OPTIONS: CityOption[] = [
  { id: "santiago", label: "Santiago", active: true },
  { id: "concepcion", label: "Concepción", active: false },
];

export function cityLabel(city: CityId): string {
  return CITY_OPTIONS.find((c) => c.id === city)?.label ?? city;
}

export function parseCityParam(raw?: string | null): CityId {
  if (raw === "concepcion") return "concepcion";
  return "santiago";
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Venues / barrios RM — evento ocurre aquí. */
const SANTIAGO_VENUE =
  /movistar arena|estadio nacional|julio mart[ií]nez|barrio italia|teatro caupolic[aá]n|teatro coliseo|estaci[oó]n mapocho|club h[ií]pico|parque o['']?higgins|estadio monumental|david arellano|fantasilandia|beaucheff|grecia 2001|marathon 5300|ñu[nñ]oa|nunoa|providencia|las condes|maip[uú]|la florida|macul|san miguel|estaci[oó]n central|lastarria|costanera|mapocho|caupolic[aá]n|coliseo|bicentenario de la florida/i;

/** Sedes Concepción (futuro hub). */
const CONCEPCION_VENUE =
  /teatro universidad de concepci[oó]n|estadio el t[ií]tulo|estadio municipal de chiguayante|galer[ií]a de la concepci[oó]n|biob[ií]o|coronel.*(teatro|estadio)|talcahuano.*(teatro|estadio)/i;

/** Eventos claramente fuera de RM (excluir de Santiago). */
const OTHER_CITY_VENUE =
  /gran arena monticello|mostazal|monticello|estadio la portada|la serena|teatro municipal de valpara[ií]so|teatro municipal.*vi[nñ]a|municipal de vi[nñ]a|valpara[ií]so(?!.*santiago)|vi[nñ]a del mar(?!.*santiago)|antofagasta|temuco|puerto montt|iquique|rancagua|talca|punta arenas|copiap[oó]|arica|osorno|valdivia|calama|coquimbo|curic[oó]|linares|puerto varas/i;

/** Partido en Santiago con rival regional en el título. */
const SANTIAGO_SPORT_HOME =
  /estadio nacional|campeonato chileno|vs\.|visita desde|hinchada|fehoch|fedachi|ind_cl|club atletico santiago|estadio monumental/i;

export function inferEventCity(text: string): EventCity {
  const t = normalize(text);

  if (SANTIAGO_VENUE.test(t)) return "santiago";
  if (CONCEPCION_VENUE.test(t)) return "concepcion";

  if (OTHER_CITY_VENUE.test(t)) {
    if (/concepci[oó]n|talcahuano|chill[aá]n|biob[ií]o/.test(t)) return "concepcion";
    return "other";
  }

  if (SANTIAGO_SPORT_HOME.test(t)) return "santiago";

  if (/\bsantiago\b/.test(t)) return "santiago";

  if (/concepci[oó]n/.test(t)) {
    if (/vs\.?|universidad de concepci[oó]n.*vs|visita/i.test(t)) return "santiago";
    if (/teatro|estadio|arena|municipal/.test(t)) return "concepcion";
    return "other";
  }

  if (/feriado|fiestas patrias|vacaciones de invierno|temporada de nieve|nieve.*santiago/i.test(t)) {
    return "santiago";
  }

  return "other";
}

const SANTIAGO_BY_SOURCE = new Set<DemandSignal["source"]>([
  "campeonato_chileno",
  "fehoch_tournaments",
  "fedachi",
  "ind_cl",
  "club_atletico_santiago",
  "fevochi",
  "nager_holidays",
  "seasonality_rules",
]);

export function resolveSignalCity(signal: DemandSignal): EventCity {
  if (signal.city === "santiago" || signal.city === "concepcion") {
    return signal.city;
  }
  if (SANTIAGO_BY_SOURCE.has(signal.source)) return "santiago";

  const blob = `${signal.title} ${signal.description} ${signal.url ?? ""}`;
  const fromText = inferEventCity(blob);

  if (fromText !== "other") return fromText;

  if (
    signal.poiIds.some((id) =>
      /poi-(movistar|estadio|italia|lastarria|ohiggins|fantasilandia|costanera|club-hipico)/.test(
        id,
      ),
    )
  ) {
    return "santiago";
  }

  return "other";
}

export function signalMatchesCity(signal: DemandSignal, city: CityId): boolean {
  return resolveSignalCity(signal) === city;
}

export function enrichSignalCity(signal: DemandSignal): DemandSignal {
  const resolved = resolveSignalCity(signal);
  if (resolved === "other") return signal;
  if (signal.city === resolved) return signal;
  return { ...signal, city: resolved };
}

/** Para scrapers: ¿incluir en inventario Santiago? */
export function isSantiagoMetroEvent(text: string): boolean {
  return inferEventCity(text) === "santiago";
}

/** Compat con scrapers existentes. */
export function isSantiagoRelevant(text: string): boolean {
  return isSantiagoMetroEvent(text);
}

export function homeQueryString(params: {
  city?: CityId;
  year?: number;
  monthIndex?: number;
  tipo?: string | null;
  hash?: string;
}): string {
  const q = new URLSearchParams();
  if (params.city && params.city !== "santiago") {
    q.set("city", params.city);
  }
  if (params.year != null && params.monthIndex != null) {
    q.set("year", String(params.year));
    q.set("month", String(params.monthIndex + 1));
  }
  if (params.tipo) {
    q.set("tipo", params.tipo);
  }
  const base = q.toString();
  const hash = params.hash ? `#${params.hash}` : "";
  return (base ? `?${base}` : "") + hash;
}
