"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  buildMonthGrid,
  eventsActiveOnDay,
  firstActiveDayInMonth,
  isoToday,
  weekdayLabelsEs,
  type CalendarEvent,
  type RangeBandRole,
} from "@/lib/demand/event-calendar";
import { mediaSrc } from "@/lib/demand/guide-images";
import { micrositePath } from "@/lib/demand/travel-brief";
import type { CityId } from "@/lib/demand/types";
import { cityCalendarHref } from "@/components/home/HomeCitySelector";
import { formatDayHeadingCL } from "@/lib/demand/dates";
import {
  MONTH_NAMES_ES,
  defaultPlanningMonth,
} from "@/lib/demand/month-range";

type Props = {
  city: CityId;
  year: number;
  monthIndex: number;
  events: CalendarEvent[];
};

function monthHref(city: CityId, year: number, monthIndex: number) {
  return cityCalendarHref(city, year, monthIndex);
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

export function HomeEventCalendar({ city, year, monthIndex, events }: Props) {
  const router = useRouter();
  const today = isoToday();

  const defaultDay = useMemo(() => {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}-`;
    if (today.startsWith(prefix)) {
      const active = eventsActiveOnDay(events, today);
      if (active.length > 0) return today;
    }
    return firstActiveDayInMonth(events, year, monthIndex);
  }, [year, monthIndex, today, events]);

  const [selectedDay, setSelectedDay] = useState<string | null>(defaultDay);

  useEffect(() => {
    setSelectedDay(defaultDay);
  }, [defaultDay]);

  const grid = useMemo(
    () => buildMonthGrid(year, monthIndex, events, today),
    [year, monthIndex, events, today],
  );

  const dayEvents = selectedDay
    ? eventsActiveOnDay(events, selectedDay)
    : [];

  function shiftMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    router.push(monthHref(city, d.getFullYear(), d.getMonth()));
  }

  const years = useMemo(() => {
    const base = defaultPlanningMonth().year;
    return [base - 1, base, base + 1];
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            Cartelera
          </p>
          <h2 className="ms-editorial mt-1 text-xl md:text-2xl">
            {MONTH_NAMES_ES[monthIndex]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--ms-line)] bg-white/80 text-base transition hover:border-[var(--ms-olive)]"
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <select
            className="rounded-md border border-[var(--ms-line)] bg-white/90 px-2 py-1.5 text-xs font-medium text-[var(--ms-ink)]"
            value={monthIndex}
            onChange={(e) => {
              router.push(monthHref(city, year, Number(e.target.value)));
            }}
          >
            {MONTH_NAMES_ES.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-[var(--ms-line)] bg-white/90 px-2 py-1.5 text-xs font-medium text-[var(--ms-ink)]"
            value={year}
            onChange={(e) => {
              router.push(monthHref(city, Number(e.target.value), monthIndex));
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
        </div>
      </div>

      <div className="mt-5 md:mt-6 md:flex md:items-start md:gap-10">
        <div className="mx-auto w-full max-w-[17.5rem] shrink-0 md:mx-0">
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
                  onClick={() => setSelectedDay(cell.iso)}
                  className={`relative flex h-8 flex-col items-center justify-center text-[11px] font-medium transition ${bandClass} ${
                    selected
                      ? "z-[1] bg-[var(--ms-olive)]/20 text-[var(--ms-ink)] ring-2 ring-[var(--ms-olive)]"
                      : hasStart
                        ? "text-[var(--ms-ink)] hover:bg-[var(--ms-olive)]/16"
                        : "text-[var(--ms-muted)] hover:bg-[var(--ms-olive)]/14"
                  }`}
                  aria-label={`${cell.day}${hasStart ? `, ${cell.startsCount} inicio(s)` : ""}${inBand ? ", evento en curso" : ""}`}
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

        <div className="mt-6 min-h-[5rem] flex-1 md:mt-0">
          {selectedDay && dayEvents.length > 0 ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
                {formatDayHeadingCL(selectedDay)}
                {dayEvents.length > 1
                  ? ` · ${dayEvents.length} guías`
                  : ""}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {dayEvents.map((ev) => (
                  <li key={ev.slug}>
                    <EventMiniCard ev={ev} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-[var(--ms-muted)] md:pt-6">
              {events.length === 0
                ? "No hay guías publicadas en este mes."
                : "Elige un día marcado para ver las guías."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
