/**
 * Agrupa feriados oficiales en ventanas de puente / fin de semana largo
 * para landings de turismo doméstico (regiones → Santiago).
 */
import type { DemandSignal } from "./types";

export type HolidayBridge = {
  id: string;
  title: string;
  startsOn: string;
  endsOn: string;
  /** Días corridos del escape (inclusive) */
  days: number;
  /** Nombres de feriados incluidos */
  holidayNames: string[];
  /** Puente con alta demanda turística (18, Semana Santa, Año Nuevo…) */
  major: boolean;
};

function parseDay(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

function formatIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, n: number): string {
  const d = parseDay(iso);
  d.setDate(d.getDate() + n);
  return formatIso(d);
}

function dayDiff(a: string, b: string): number {
  return Math.round(
    (parseDay(b).getTime() - parseDay(a).getTime()) / 86400000,
  );
}

function isMajorBridge(names: string[], start: string): boolean {
  const blob = `${names.join(" ")} ${start}`.toLowerCase();
  return (
    /fiestas patrias|18 de septiembre|día nacional|año nuevo|navidad|viernes santo|sábado santo|sabado santo/i.test(
      blob,
    )
  );
}

function bridgeTitle(names: string[], start: string, end: string): string {
  const blob = names.join(" ").toLowerCase();
  if (/fiestas patrias|18 de septiembre|día nacional/i.test(blob)) {
    return "Fiestas Patrias — puente en Santiago";
  }
  if (/año nuevo|navidad/i.test(blob)) {
    return "Año Nuevo — fin de semana en Santiago";
  }
  if (/viernes santo|sábado santo|sabado santo|jueves santo/i.test(blob)) {
    return "Semana Santa — escapada a Santiago";
  }
  if (names.length === 1) {
    return `Puente ${names[0]} — Santiago`;
  }
  return `Fin de semana largo — ${names[0]}`;
}

/** Extiende ventana al sábado/domingo adyacente si el feriado cae jueves o lunes. */
function expandToWeekend(start: string, end: string): { start: string; end: string } {
  let s = start;
  let e = end;
  const startDow = parseDay(start).getDay();
  const endDow = parseDay(end).getDay();

  if (startDow === 4) s = addDays(start, -1);
  if (startDow === 1) s = addDays(start, -2);
  if (endDow === 5) e = addDays(end, 2);
  if (endDow === 4) e = addDays(end, 1);
  if (endDow === 6) e = addDays(end, 1);

  return { start: s, end: e };
}

function mergeHolidayGroup(group: DemandSignal[]): HolidayBridge {
  const sorted = [...group].sort((a, b) => a.startsOn.localeCompare(b.startsOn));
  let start = sorted[0]!.startsOn;
  let end = sorted[sorted.length - 1]!.endsOn;
  const names = sorted.map((h) =>
    h.title.replace(/\s*\(\d{4}\)\s*$/, "").trim(),
  );
  const expanded = expandToWeekend(start, end);
  start = expanded.start;
  end = expanded.end;
  const days = dayDiff(start, end) + 1;

  return {
    id: `puente-${start}`,
    title: bridgeTitle(names, start, end),
    startsOn: start,
    endsOn: end,
    days,
    holidayNames: names,
    major: isMajorBridge(names, start),
  };
}

/** Agrupa feriados a ≤2 días de distancia en un mismo puente. */
export function buildHolidayBridges(holidays: DemandSignal[]): HolidayBridge[] {
  const official = holidays
    .filter((h) => h.kind === "holiday" && h.source === "nager_holidays")
    .sort((a, b) => a.startsOn.localeCompare(b.startsOn));

  if (official.length === 0) return [];

  const groups: DemandSignal[][] = [];
  let current: DemandSignal[] = [official[0]!];

  for (let i = 1; i < official.length; i++) {
    const prev = current[current.length - 1]!;
    const next = official[i]!;
    const gap = dayDiff(prev.startsOn, next.startsOn);
    if (gap <= 3) {
      current.push(next);
    } else {
      groups.push(current);
      current = [next];
    }
  }
  groups.push(current);

  return groups.map(mergeHolidayGroup);
}

export function upcomingHolidayBridges(
  holidays: DemandSignal[],
  fromDate = new Date().toISOString().slice(0, 10),
  limit = 6,
): HolidayBridge[] {
  return buildHolidayBridges(holidays)
    .filter((b) => b.endsOn >= fromDate)
    .slice(0, limit);
}

export function eventsOverlapBridge(
  startsOn: string,
  endsOn: string,
  bridge: HolidayBridge,
): boolean {
  return startsOn <= bridge.endsOn && endsOn >= bridge.startsOn;
}

export function formatBridgeRange(
  bridge: HolidayBridge,
  locale: "es" | "en" | "pt" = "es",
): string {
  const fmt = (iso: string) => {
    const d = parseDay(iso);
    return d.toLocaleDateString(
      locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-CL",
      { day: "numeric", month: "short" },
    );
  };
  if (bridge.startsOn === bridge.endsOn) return fmt(bridge.startsOn);
  return `${fmt(bridge.startsOn)} – ${fmt(bridge.endsOn)}`;
}
