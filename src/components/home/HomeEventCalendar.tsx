"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  buildMonthGrid,
  clampToCurrentOrFutureMonth,
  eventsActiveOnDay,
  isUpcomingCalendarEvent,
  isoToday,
  weekdayLabelsEs,
  type CalendarEvent,
  type RangeBandRole,
} from "@/lib/demand/event-calendar";
import {
  availableEventTypes,
  eventTypeLabel,
  type EventTypeId,
} from "@/lib/demand/event-type";
import { mediaSrc } from "@/lib/demand/guide-images";
import { micrositePath } from "@/lib/demand/travel-brief";
import type { CityId } from "@/lib/demand/types";
import { cityCalendarHref } from "@/components/home/HomeCitySelector";
import { HorizontalScrollRow } from "@/components/home/HorizontalScrollRow";
import { formatDayHeadingCL } from "@/lib/demand/dates";
import { MONTH_NAMES_ES } from "@/lib/demand/month-range";

type Props = {
  city: CityId;
  year: number;
  monthIndex: number;
  /** Eventos del mes visible (calendario). */
  events: CalendarEvent[];
  /** Próximos eventos (desde hoy) — define opciones de tipo y lista filtrada. */
  upcomingEvents: CalendarEvent[];
  tipo: EventTypeId | null;
};

function monthHref(
  city: CityId,
  year: number,
  monthIndex: number,
  tipo: EventTypeId | null,
) {
  return cityCalendarHref(city, year, monthIndex, tipo);
}

function bandRadiusClass(role: RangeBandRole): string {
  switch (role) {
    case "start":
      return "rounded-l-md";
    case "end":
      return "rounded-r-md";
    case "middle":
      return "rounded-none";
    default:
      return "rounded-md";
  }
}

function chunkEvents<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function EventMiniCard({ ev }: { ev: CalendarEvent }) {
  return (
    <Link
      href={micrositePath(ev.slug)}
      className="group flex gap-3 rounded-xl border border-[var(--ms-line)] bg-white/90 p-2.5 transition hover:border-[var(--ms-olive)]"
    >
      <div className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-[var(--ms-mist,#cfc9c0)]/40">
        {ev.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc(ev.coverUrl, 240)}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-[var(--ms-muted)]">
            Guía
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-terracotta)]">
          {ev.interestLabel}
        </span>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-[var(--ms-ink)] group-hover:text-[var(--ms-olive)]">
          {ev.title}
        </p>
        {ev.eventDates ? (
          <p className="mt-0.5 truncate text-[11px] text-[var(--ms-muted)]">
            {ev.eventDates}
            {ev.venueName ? ` · ${ev.venueName}` : ""}
          </p>
        ) : ev.venueName ? (
          <p className="mt-0.5 truncate text-[11px] text-[var(--ms-muted)]">
            {ev.venueName}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function HomeEventCalendar({
  city,
  year,
  monthIndex,
  events,
  upcomingEvents,
  tipo,
}: Props) {
  const router = useRouter();
  const today = isoToday();

  const typeOptions = useMemo(
    () => availableEventTypes(upcomingEvents, (ev) => ev.eventType),
    [upcomingEvents],
  );

  const typedUpcoming = useMemo(() => {
    if (!tipo) return [];
    return upcomingEvents
      .filter((ev) => ev.eventType === tipo && isUpcomingCalendarEvent(ev, today))
      .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title));
  }, [upcomingEvents, tipo, today]);

  const monthEvents = useMemo(() => {
    const live = events.filter((ev) => isUpcomingCalendarEvent(ev, today));
    if (!tipo) return live;
    return live.filter((ev) => ev.eventType === tipo);
  }, [events, tipo, today]);

  const minMonth = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  }, []);

  const years = useMemo(() => {
    const y = minMonth.year;
    return [y, y + 1];
  }, [minMonth.year]);

  const monthSelectOptions = useMemo(() => {
    return MONTH_NAMES_ES.map((label, i) => ({ label, value: i })).filter(
      (opt) =>
        !(year === minMonth.year && opt.value < minMonth.monthIndex),
    );
  }, [year, minMonth]);

  function shiftMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    const next = clampToCurrentOrFutureMonth(d.getFullYear(), d.getMonth());
    router.push(monthHref(city, next.year, next.monthIndex, tipo));
  }

  function setTipo(next: EventTypeId | null) {
    router.push(monthHref(city, year, monthIndex, next));
  }

  const canGoPrevMonth =
    year > minMonth.year ||
    (year === minMonth.year && monthIndex > minMonth.monthIndex);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDay(null);
  }, [year, monthIndex, city, tipo]);

  const grid = useMemo(
    () => buildMonthGrid(year, monthIndex, monthEvents, today),
    [year, monthIndex, monthEvents, today],
  );

  const monthListEvents = useMemo(() => {
    return [...monthEvents].sort(
      (a, b) =>
        a.start.localeCompare(b.start) || a.title.localeCompare(b.title),
    );
  }, [monthEvents]);

  const listEvents = selectedDay
    ? eventsActiveOnDay(monthEvents, selectedDay)
    : monthListEvents;

  const listColumns = useMemo(
    () => chunkEvents(listEvents, 4),
    [listEvents],
  );

  function selectDay(iso: string) {
    setSelectedDay((prev) => (prev === iso ? null : iso));
  }

  function clearDaySelection() {
    setSelectedDay(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            Cartelera
          </p>
          <h2 className="ms-editorial mt-1 text-xl md:text-2xl">
            {tipo
              ? `${eventTypeLabel(tipo)} · próximos`
              : `${MONTH_NAMES_ES[monthIndex]} ${year}`}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {typeOptions.length > 0 ? (
            <select
              className="rounded-md border border-[var(--ms-line)] bg-white/90 px-2 py-1.5 text-xs font-medium text-[var(--ms-ink)]"
              value={tipo ?? "all"}
              onChange={(e) => {
                const v = e.target.value;
                setTipo(v === "all" ? null : (v as EventTypeId));
              }}
              aria-label="Filtrar por tipo"
            >
              <option value="all">Todos los tipos</option>
              {typeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} ({opt.count})
                </option>
              ))}
            </select>
          ) : null}
          {!tipo ? (
            <>
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!canGoPrevMonth}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--ms-line)] bg-white/80 text-base transition hover:border-[var(--ms-olive)] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Mes anterior"
              >
                ‹
              </button>
              <select
                className="rounded-md border border-[var(--ms-line)] bg-white/90 px-2 py-1.5 text-xs font-medium text-[var(--ms-ink)]"
                value={monthIndex}
                onChange={(e) => {
                  const next = clampToCurrentOrFutureMonth(
                    year,
                    Number(e.target.value),
                  );
                  router.push(
                    monthHref(city, next.year, next.monthIndex, tipo),
                  );
                }}
              >
                {monthSelectOptions.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                className="rounded-md border border-[var(--ms-line)] bg-white/90 px-2 py-1.5 text-xs font-medium text-[var(--ms-ink)]"
                value={year}
                onChange={(e) => {
                  const nextYear = Number(e.target.value);
                  const next = clampToCurrentOrFutureMonth(nextYear, monthIndex);
                  router.push(
                    monthHref(city, next.year, next.monthIndex, tipo),
                  );
                }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--ms-line)] bg-white/80 text-base transition hover:border-[var(--ms-olive)]"
                aria-label="Mes siguiente"
              >
                ›
              </button>
            </>
          ) : null}
        </div>
      </div>

      {tipo ? (
        <div className="mt-5 md:mt-6">
          {typedUpcoming.length > 0 ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
                Desde hoy · {typedUpcoming.length}{" "}
                {typedUpcoming.length === 1 ? "guía" : "guías"}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {typedUpcoming.map((ev) => (
                  <li key={ev.slug}>
                    <EventMiniCard ev={ev} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-[var(--ms-muted)]">
              No hay guías próximas de este tipo.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-5 md:mt-6">
          <div className="mx-auto w-full max-w-[17.5rem] md:mx-0">
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-[var(--ms-muted)]">
              {weekdayLabelsEs().map((wd) => (
                <div key={wd} className="py-0.5">
                  {wd}
                </div>
              ))}
            </div>

            <div className="mt-0.5 grid grid-cols-7 gap-y-1 gap-x-0">
              {grid.map((cell, i) => {
                if (cell.kind === "empty") {
                  return <div key={`e-${i}`} className="h-8" aria-hidden />;
                }

                const hasStart = cell.startsCount > 0;
                const inBand = cell.inMultiDayBand;
                const interactive = hasStart || inBand;
                const selected = selectedDay === cell.iso;

                if (!interactive) {
                  return (
                    <div
                      key={cell.iso}
                      className={`flex h-8 items-center justify-center text-[11px] ${
                        cell.isToday
                          ? "rounded-md font-semibold text-[var(--ms-olive)] ring-1 ring-[var(--ms-olive)]/40"
                          : "text-[var(--ms-muted)]/80"
                      }`}
                    >
                      {cell.day}
                    </div>
                  );
                }

                const bandClass = inBand
                  ? `${bandRadiusClass(cell.bandRole)} bg-[var(--ms-olive)]/10`
                  : "rounded-md";

                return (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => selectDay(cell.iso)}
                    className={`relative flex h-8 flex-col items-center justify-center text-[11px] font-medium transition ${bandClass} ${
                      selected
                        ? "z-[1] bg-[var(--ms-olive)]/20 text-[var(--ms-ink)] ring-2 ring-[var(--ms-olive)]"
                        : hasStart
                          ? "text-[var(--ms-ink)] hover:bg-[var(--ms-olive)]/16"
                          : "text-[var(--ms-muted)] hover:bg-[var(--ms-olive)]/14"
                    }`}
                    aria-label={`${cell.day}${hasStart ? `, ${cell.startsCount} inicio(s)` : ""}${inBand ? ", evento en curso" : ""}${selected ? ", clic para ver mes completo" : ""}`}
                    aria-pressed={selected}
                  >
                    <span className={hasStart ? "font-semibold" : ""}>
                      {cell.day}
                    </span>
                    {hasStart ? (
                      <span
                        className={`mt-0.5 block h-1 w-1 rounded-full ${
                          selected
                            ? "bg-[var(--ms-olive)]"
                            : "bg-[var(--ms-terracotta)]"
                        }`}
                        aria-hidden
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            {listEvents.length > 0 ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
                    {selectedDay
                      ? formatDayHeadingCL(selectedDay)
                      : `${MONTH_NAMES_ES[monthIndex]} · mes completo`}
                    {listEvents.length > 1
                      ? ` · ${listEvents.length} guías`
                      : listEvents.length === 1
                        ? " · 1 guía"
                        : ""}
                  </p>
                  {selectedDay ? (
                    <button
                      type="button"
                      onClick={clearDaySelection}
                      className="text-[11px] font-semibold text-[var(--ms-olive)] underline-offset-2 hover:underline"
                    >
                      Ver mes completo
                    </button>
                  ) : null}
                </div>
                <HorizontalScrollRow className="mt-3" step={292}>
                  {listColumns.map((column, colIdx) => (
                    <div
                      key={`col-${colIdx}-${column[0]?.slug ?? colIdx}`}
                      className="flex w-[260px] shrink-0 flex-col gap-2 sm:w-[280px]"
                    >
                      {column.map((ev) => (
                        <EventMiniCard key={ev.slug} ev={ev} />
                      ))}
                    </div>
                  ))}
                </HorizontalScrollRow>
              </>
            ) : (
              <p className="text-sm text-[var(--ms-muted)]">
                {monthEvents.length === 0
                  ? "No hay guías publicadas en este mes."
                  : selectedDay
                    ? "No hay guías en este día. Elige otro o vuelve al mes completo."
                    : "No hay guías en este mes."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
