/** Utilidades para calendario público de eventos. */

export type CalendarEvent = {
  slug: string;
  title: string;
  start: string;
  end: string;
  interestLabel: string;
  venueName?: string;
  eventDates?: string;
  coverUrl?: string | null;
};

export type RangeBandRole = "none" | "start" | "middle" | "end";

export function weekdayLabelsEs(): readonly string[] {
  return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
}

export function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function expandIsoRange(start: string, end: string): string[] {
  const out: string[] = [];
  const cur = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  if (Number.isNaN(cur.getTime()) || Number.isNaN(last.getTime())) return out;
  while (cur <= last) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function isMultiDayEvent(ev: CalendarEvent): boolean {
  return ev.start !== ev.end;
}

/** Días del mes donde arranca al menos un evento. */
export function eventStartDaysInMonth(
  events: CalendarEvent[],
  year: number,
  monthIndex: number,
): Set<string> {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}-`;
  const set = new Set<string>();
  for (const ev of events) {
    if (ev.start.startsWith(prefix)) set.add(ev.start);
  }
  return set;
}

/** Días del mes cubiertos por eventos de más de un día (para la banda). */
export function multiDayBandDaysInMonth(
  events: CalendarEvent[],
  year: number,
  monthIndex: number,
): Set<string> {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}-`;
  const set = new Set<string>();
  for (const ev of events) {
    if (!isMultiDayEvent(ev)) continue;
    for (const day of expandIsoRange(ev.start, ev.end)) {
      if (day.startsWith(prefix)) set.add(day);
    }
  }
  return set;
}

export function eventsStartingOnDay(
  events: CalendarEvent[],
  iso: string,
): CalendarEvent[] {
  return events.filter((ev) => ev.start === iso);
}

/** Eventos activos en un día (incluye rangos multi-día). */
export function eventsActiveOnDay(
  events: CalendarEvent[],
  iso: string,
): CalendarEvent[] {
  return events.filter((ev) => iso >= ev.start && iso <= ev.end);
}

export function eventsOnDay(
  events: CalendarEvent[],
  iso: string,
): CalendarEvent[] {
  return eventsActiveOnDay(events, iso);
}

function bandRoleForDay(
  iso: string,
  events: CalendarEvent[],
  col: number,
): RangeBandRole {
  let role: RangeBandRole = "none";
  for (const ev of events) {
    if (!isMultiDayEvent(ev)) continue;
    if (iso < ev.start || iso > ev.end) continue;

    let evRole: RangeBandRole;
    if (iso === ev.start && iso === ev.end) continue;
    if (iso === ev.start) evRole = "start";
    else if (iso === ev.end) evRole = "end";
    else evRole = "middle";

    if (col === 0 && evRole === "middle") evRole = "start";
    if (col === 0 && evRole === "end") evRole = "start";
    if (col === 6 && evRole === "middle") evRole = "end";
    if (col === 6 && evRole === "start") evRole = "end";

    if (evRole === "middle") return "middle";
    if (evRole === "start" && role !== "middle") role = "start";
    if (evRole === "end" && role !== "middle" && role !== "start") role = "end";
    if (evRole === "start" && role === "end") role = "middle";
  }
  return role;
}

export type CalendarCell =
  | { kind: "empty" }
  | {
      kind: "day";
      iso: string;
      day: number;
      startsCount: number;
      inMultiDayBand: boolean;
      bandRole: RangeBandRole;
      isToday: boolean;
    };

/** Grilla Lun–Dom del mes (celdas vacías al inicio). */
export function buildMonthGrid(
  year: number,
  monthIndex: number,
  events: CalendarEvent[],
  today = isoToday(),
): CalendarCell[] {
  const startDays = eventStartDaysInMonth(events, year, monthIndex);
  const bandDays = multiDayBandDaysInMonth(events, year, monthIndex);
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startPad = (first.getDay() + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let i = 0; i < startPad; i++) cells.push({ kind: "empty" });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const col = (startPad + d - 1) % 7;
    const inBand = bandDays.has(iso);
    cells.push({
      kind: "day",
      iso,
      day: d,
      startsCount: startDays.has(iso)
        ? eventsStartingOnDay(events, iso).length
        : 0,
      inMultiDayBand: inBand,
      bandRole: inBand ? bandRoleForDay(iso, events, col) : "none",
      isToday: iso === today,
    });
  }
  return cells;
}

/** Primer día del mes con actividad (inicio o banda). */
export function firstActiveDayInMonth(
  events: CalendarEvent[],
  year: number,
  monthIndex: number,
): string | null {
  const starts = [...eventStartDaysInMonth(events, year, monthIndex)].sort();
  if (starts[0]) return starts[0];
  const bands = [...multiDayBandDaysInMonth(events, year, monthIndex)].sort();
  return bands[0] ?? null;
}
