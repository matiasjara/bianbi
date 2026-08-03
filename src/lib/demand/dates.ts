import type { DemandSignal } from "./types";

/** Formato estándar de visualización en Crambie. */
export const DISPLAY_DATE_FORMAT = "dd-mm-yyyy";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTHS_ES: Record<string, string> = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dic: "12",
};

const WEEKDAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
] as const;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  return !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

/** ISO yyyy-mm-dd → dd-mm-yyyy */
export function formatDateCL(iso: string): string {
  const m = iso.match(ISO_DATE);
  if (!m) return iso;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** Rango en dd-mm-yyyy (o dd-mm-yyyy – dd-mm-yyyy). */
export function formatDateRangeCL(start: string, end?: string | null): string {
  if (!isIsoDate(start)) return start;
  const safeEnd = end && isIsoDate(end) ? end : start;
  if (safeEnd === start) return formatDateCL(start);
  return `${formatDateCL(start)} – ${formatDateCL(safeEnd)}`;
}

const MONTH_SHORT: Record<"es" | "en" | "pt", string[]> = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
};

function dayOf(iso: string): number {
  return Number.parseInt(iso.slice(8, 10), 10);
}

function monthIndex(iso: string): number {
  return Number.parseInt(iso.slice(5, 7), 10) - 1;
}

function yearOf(iso: string): string {
  return iso.slice(0, 4);
}

/** Rango en prosa (es): «6 al 16 de agosto de 2026». */
export function formatDateRangeLongEs(start: string, end?: string | null): string {
  if (!isIsoDate(start)) return start;
  const safeEnd = end && isIsoDate(end) ? end : start;
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const month = months[monthIndex(start)] ?? start.slice(5, 7);
  const year = yearOf(start);
  if (safeEnd === start) return `${dayOf(start)} de ${month} de ${year}`;
  if (start.slice(0, 7) === safeEnd.slice(0, 7)) {
    return `${dayOf(start)} al ${dayOf(safeEnd)} de ${month} de ${year}`;
  }
  const monthEnd = months[monthIndex(safeEnd)] ?? safeEnd.slice(5, 7);
  return `${dayOf(start)} de ${month} al ${dayOf(safeEnd)} de ${monthEnd} de ${year}`;
}

/** Fecha legible para landings: «6 ago 2026». */
export function formatDateHuman(
  iso: string,
  locale: "es" | "en" | "pt" = "es",
): string {
  if (!isIsoDate(iso)) return iso;
  const month = MONTH_SHORT[locale][monthIndex(iso)] ?? iso.slice(5, 7);
  return `${dayOf(iso)} ${month} ${yearOf(iso)}`;
}

/** Rango legible: «6–16 ago 2026» o «28 ago – 2 sep 2026». */
export function formatDateRangeHuman(
  start: string,
  end?: string | null,
  locale: "es" | "en" | "pt" = "es",
): string {
  if (!isIsoDate(start)) return start;
  const safeEnd = end && isIsoDate(end) ? end : start;
  if (safeEnd === start) return formatDateHuman(start, locale);

  const sameMonth =
    start.slice(0, 7) === safeEnd.slice(0, 7) &&
    yearOf(start) === yearOf(safeEnd);
  if (sameMonth) {
    const month = MONTH_SHORT[locale][monthIndex(start)] ?? start.slice(5, 7);
    return `${dayOf(start)}–${dayOf(safeEnd)} ${month} ${yearOf(start)}`;
  }

  return `${formatDateHuman(start, locale)} – ${formatDateHuman(safeEnd, locale)}`;
}

/** Encabezado de día en calendario: «sábado 14-08-2026». */
export function formatDayHeadingCL(iso: string): string {
  if (!isIsoDate(iso)) return iso;
  const weekday = WEEKDAYS_ES[new Date(`${iso}T12:00:00`).getDay()];
  return `${weekday} ${formatDateCL(iso)}`;
}

export function parseLooseDate(
  raw: string,
  fallbackYear: number,
): string | null {
  const esFull = raw.match(
    /(\d{1,2})(?:\s*,\s*\d{1,2})*(?:\s*y\s*\d{1,2})?\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})/i,
  );
  if (esFull) {
    return `${esFull[3]}-${MONTHS_ES[esFull[2].toLowerCase()]}-${esFull[1].padStart(2, "0")}`;
  }

  const esNoYear = raw.match(
    /(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/i,
  );
  if (esNoYear) {
    return `${fallbackYear}-${MONTHS_ES[esNoYear[2].toLowerCase()]}-${esNoYear[1].padStart(2, "0")}`;
  }

  const iso = raw.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];

  const dmy = raw.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
    return `${year}-${month}-${day}`;
  }

  const slug = raw.match(
    /\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*-(\d{4})\b/i,
  );
  if (slug) {
    const month = MONTHS_ES[slug[1].toLowerCase().slice(0, 3)];
    return `${slug[2]}-${month}-15`;
  }

  return null;
}

const SPANISH_DATE_NO_DE =
  /\b(\d{1,2})\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})\b/gi;

const SPANISH_DATE =
  /\b(\d{1,2})(?:\s*,\s*\d{1,2})*(?:\s*y\s*\d{1,2})?\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})\b/gi;

const SPANISH_RANGE =
  /\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(\d{4})\s*[-–]\s*(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(\d{4})\b/gi;

function isoFromSpanish(day: string, month: string, year: string) {
  const m = MONTHS_ES[month.toLowerCase()];
  if (!m) return null;
  return `${year}-${m}-${day.padStart(2, "0")}`;
}

/** Normaliza fechas sueltas dentro de un texto libre. */
export function standardizeDatesInText(
  text: string,
  fallbackYear = new Date().getFullYear(),
): string {
  let out = text.replace(SPANISH_RANGE, (_match, d1, m1, y1, d2, m2, y2) => {
    const start = isoFromSpanish(d1, m1, y1);
    const end = isoFromSpanish(d2, m2, y2);
    if (!start || !end) return _match;
    return formatDateRangeCL(start, end);
  });

  out = out.replace(SPANISH_DATE, (match) => {
    const iso = parseLooseDate(match, fallbackYear);
    return iso ? formatDateCL(iso) : match;
  });

  out = out.replace(SPANISH_DATE_NO_DE, (match) => {
    const iso = parseLooseDate(match, fallbackYear);
    return iso ? formatDateCL(iso) : match;
  });

  out = out.replace(/\b(\d{1,2})[\/](\d{1,2})[\/](\d{4})\b/g, (match) => {
    const iso = parseLooseDate(match, fallbackYear);
    return iso ? formatDateCL(iso) : match;
  });

  out = out.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (match) =>
    isIsoDate(match) ? formatDateCL(match) : match,
  );

  return out.replace(/\s{2,}/g, " ").trim();
}

export function normalizeSignalDescription(
  description: string,
  startsOn: string,
  endsOn: string,
): string {
  const canonical = formatDateRangeCL(startsOn, endsOn);
  let text = standardizeDatesInText(description);

  if (!text.includes(canonical)) {
    text = text.replace(/\.\s*Fecha:.*$/i, "").trim();
    text = text.replace(/\.\s*\d{2}-\d{2}-\d{4}.*$/i, "").trim();
    text = `${text.replace(/\.$/, "")}. Fecha: ${canonical}.`;
  }

  return text;
}

export function normalizeSignal<T extends DemandSignal>(signal: T): T {
  if (!isIsoDate(signal.startsOn)) return signal;

  const endsOn =
    isIsoDate(signal.endsOn) && signal.endsOn >= signal.startsOn
      ? signal.endsOn
      : signal.startsOn;

  return {
    ...signal,
    endsOn,
    description: normalizeSignalDescription(
      signal.description,
      signal.startsOn,
      endsOn,
    ),
  };
}

export function normalizeSignals<T extends DemandSignal>(signals: T[]): T[] {
  return signals.map((s) => normalizeSignal(s));
}
