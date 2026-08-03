"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  buildMonthGrid,
  eventsActiveOnDay,
  firstActiveDayInMonth,
  isoToday,
  weekdayLabelsEs,
  type RangeBandRole,
} from "@/lib/demand/event-calendar";
import type { AdminCalendarEvent } from "@/lib/demand/admin-calendar";
import {
  MONTH_NAMES_ES,
  defaultPlanningMonth,
  monthRange,
} from "@/lib/demand/month-range";
import { formatDayHeadingCL } from "@/lib/demand/dates";
import { StatusPill } from "@/components/ui";

type Props = {
  events: AdminCalendarEvent[];
  overriddenIds: string[];
  ingestedAt: string | null;
};

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

function AdminEventRow({
  ev,
  onEdit,
  onDelete,
  busy,
}: {
  ev: AdminCalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <article className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="accent">{ev.interestLabel}</StatusPill>
            {ev.hasOverride ? (
              <StatusPill tone="warn">Editado</StatusPill>
            ) : null}
            {ev.potentialTier ? (
              <StatusPill tone="neutral">
                {ev.potentialTier}
                {ev.potentialScore != null ? ` · ${ev.potentialScore}` : ""}
              </StatusPill>
            ) : null}
          </div>
          <h3 className="mt-2 font-medium leading-snug">{ev.title}</h3>
          {ev.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
              {ev.description}
            </p>
          ) : null}
          <dl className="mt-2 space-y-1 text-xs text-[var(--muted)]">
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              <dt className="sr-only">Fuente</dt>
              <dd>
                <span className="font-medium text-[var(--ink)]">Fuente:</span>{" "}
                {ev.sourceLabel}{" "}
                <span className="text-[var(--muted)]">({ev.source})</span>
              </dd>
            </div>
            <div>
              <span className="font-medium text-[var(--ink)]">Origen datos:</span>{" "}
              {ev.originHint}
            </div>
            <div>
              <span className="font-medium text-[var(--ink)]">ID:</span>{" "}
              <code className="text-[10px]">{ev.id}</code>
            </div>
            {ev.scrapedAt ? (
              <div>
                <span className="font-medium text-[var(--ink)]">Scrapeado:</span>{" "}
                {new Date(ev.scrapedAt).toLocaleString("es-CL")}
              </div>
            ) : null}
          </dl>
          {ev.url ? (
            <a
              href={ev.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-medium text-[var(--accent-ink)] underline-offset-2 hover:underline"
            >
              Ver en fuente original
            </a>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            className="rounded-md border border-[var(--line)] px-2.5 py-1.5 text-xs font-medium transition hover:border-[var(--accent)] disabled:opacity-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-md border border-[var(--line)] px-2.5 py-1.5 text-xs font-medium text-[var(--warn)] transition hover:border-[var(--warn)] disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

function EditModal({
  ev,
  onClose,
  onSaved,
}: {
  ev: AdminCalendarEvent;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(ev.title);
  const [description, setDescription] = useState(ev.description);
  const [startsOn, setStartsOn] = useState(ev.start);
  const [endsOn, setEndsOn] = useState(ev.end);
  const [url, setUrl] = useState(ev.url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/signals/${encodeURIComponent(ev.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, startsOn, endsOn, url }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "No se pudo guardar.");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSave}
        className="w-full max-w-lg rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-xl"
      >
        <h3 className="font-[family-name:var(--font-display)] text-xl">
          Editar evento
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Fuente: {ev.sourceLabel} · {ev.originHint}
        </p>

        <div className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Título
            </span>
            <input
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Descripción
            </span>
            <textarea
              className="min-h-[4rem] w-full rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Inicio
              </span>
              <input
                type="date"
                className="w-full rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={startsOn}
                onChange={(e) => setStartsOn(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Término
              </span>
              <input
                type="date"
                className="w-full rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={endsOn}
                onChange={(e) => setEndsOn(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              URL fuente
            </span>
            <input
              type="url"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-[var(--warn)]">{error}</p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--panel-2)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--panel)] disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminEventCalendar({
  events,
  overriddenIds,
  ingestedAt,
}: Props) {
  const router = useRouter();
  const today = isoToday();
  const initial = defaultPlanningMonth();
  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [editing, setEditing] = useState<AdminCalendarEvent | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const monthEvents = useMemo(() => {
    const { start, end } = monthRange(year, monthIndex);
    return events.filter((ev) => ev.end >= start && ev.start <= end);
  }, [events, year, monthIndex]);

  const defaultDay = useMemo(() => {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}-`;
    if (today.startsWith(prefix)) {
      const active = eventsActiveOnDay(monthEvents, today);
      if (active.length > 0) return today;
    }
    return firstActiveDayInMonth(monthEvents, year, monthIndex);
  }, [year, monthIndex, today, monthEvents]);

  const [selectedDay, setSelectedDay] = useState<string | null>(defaultDay);

  useEffect(() => {
    setSelectedDay(defaultDay);
  }, [defaultDay]);

  const grid = useMemo(
    () => buildMonthGrid(year, monthIndex, monthEvents, today),
    [year, monthIndex, monthEvents, today],
  );

  const dayEvents = selectedDay
    ? (eventsActiveOnDay(monthEvents, selectedDay) as AdminCalendarEvent[])
    : [];

  const years = useMemo(() => {
    const base = defaultPlanningMonth().year;
    return [base - 1, base, base + 1, base + 2];
  }, []);

  async function handleDelete(ev: AdminCalendarEvent) {
    if (
      !window.confirm(
        `¿Eliminar "${ev.title}" del calendario?\n\nSe ocultará en todo el sistema. La ingesta original no se modifica.`,
      )
    ) {
      return;
    }
    setBusyId(ev.id);
    try {
      const res = await fetch(`/api/signals/${encodeURIComponent(ev.id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "No se pudo eliminar.");
      }
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Error al eliminar.");
    } finally {
      setBusyId(null);
    }
  }

  function shiftMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--muted)]">
            Última ingesta:{" "}
            {ingestedAt
              ? new Date(ingestedAt).toLocaleString("es-CL")
              : "aún no corrida"}
            {overriddenIds.length > 0
              ? ` · ${overriddenIds.length} editado(s) manualmente`
              : ""}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Eliminar oculta el evento sin tocar el JSON de ingesta. Editar guarda
            overrides locales.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-base transition hover:border-[var(--accent)]"
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <select
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-1.5 text-xs font-medium"
            value={monthIndex}
            onChange={(e) => setMonthIndex(Number(e.target.value))}
          >
            {MONTH_NAMES_ES.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-1.5 text-xs font-medium"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
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
            className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-base transition hover:border-[var(--accent)]"
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className="surface rounded-xl p-5 md:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          {MONTH_NAMES_ES[monthIndex]} {year}
        </h2>

        <div className="mt-5 md:flex md:items-start md:gap-10">
          <div className="mx-auto w-full max-w-[17.5rem] shrink-0 md:mx-0">
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-[var(--muted)]">
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
                          ? "rounded-md font-semibold text-[var(--good)] ring-1 ring-[var(--good)]/40"
                          : "text-[var(--muted)]/80"
                      }`}
                    >
                      {cell.day}
                    </div>
                  );
                }

                const bandClass = inBand
                  ? `${bandRadiusClass(cell.bandRole)} bg-[var(--good-soft)]`
                  : "rounded-md";

                return (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => setSelectedDay(cell.iso)}
                    className={`relative flex h-8 flex-col items-center justify-center text-[11px] font-medium transition ${bandClass} ${
                      selected
                        ? "z-[1] bg-[var(--accent-soft)] text-[var(--ink)] ring-2 ring-[var(--accent)]"
                        : hasStart
                          ? "text-[var(--ink)] hover:bg-[var(--good-soft)]"
                          : "text-[var(--muted)] hover:bg-[var(--panel-2)]"
                    }`}
                    aria-pressed={selected}
                  >
                    <span className={hasStart ? "font-semibold" : ""}>
                      {cell.day}
                    </span>
                    {hasStart ? (
                      <span
                        className={`mt-0.5 block h-1 w-1 rounded-full ${
                          selected ? "bg-[var(--accent)]" : "bg-[var(--warn)]"
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {formatDayHeadingCL(selectedDay)}
                  {dayEvents.length > 1
                    ? ` · ${dayEvents.length} eventos`
                    : ""}
                </p>
                <ul className="mt-3 space-y-2">
                  {dayEvents.map((ev) => (
                    <li key={ev.id}>
                      <AdminEventRow
                        ev={ev}
                        busy={busyId === ev.id}
                        onEdit={() => setEditing(ev)}
                        onDelete={() => void handleDelete(ev)}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)] md:pt-6">
                {monthEvents.length === 0
                  ? "No hay eventos en este mes."
                  : "Elige un día marcado para administrar eventos."}
              </p>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <EditModal
          ev={editing}
          onClose={() => setEditing(null)}
          onSaved={() => router.refresh()}
        />
      ) : null}
    </div>
  );
}
