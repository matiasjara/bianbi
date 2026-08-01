import { DEMAND_SOURCE_CATALOG } from "./source-catalog";
import type { CalendarEvent } from "./event-calendar";
import type { DemandSignal, SignalKind, SignalSource } from "./types";

export type AdminCalendarEvent = CalendarEvent & {
  id: string;
  kind: SignalKind;
  source: SignalSource;
  sourceLabel: string;
  originHint: string;
  description: string;
  url?: string;
  scrapedAt?: string;
  potentialScore?: number;
  potentialTier?: string;
  hasOverride?: boolean;
};

const KIND_LABELS: Record<SignalKind, string> = {
  event: "Evento",
  sport: "Deporte",
  holiday: "Feriado",
  seasonality: "Estacionalidad",
  tourism_flow: "Turismo",
  school_break: "Vacaciones",
};

const EVENTS_SOURCES = new Set<SignalSource>([
  "ticketmaster_cl",
  "puntoticket",
  "ticketplus_cl",
  "tocador",
  "passline",
  "campeonato_chileno",
  "ind_cl",
  "club_atletico_santiago",
  "fedachi",
  "fehoch_tournaments",
  "fevochi",
  "discovery_web",
  "playwright_scrape",
  "manual",
]);

export function sourceLabel(source: SignalSource): string {
  const entry = DEMAND_SOURCE_CATALOG.find((e) => e.id === source);
  if (entry) return entry.name;
  return source.replace(/_/g, " ");
}

export function signalOriginHint(signal: DemandSignal): string {
  if (signal.source === "nager_holidays") return "feriados.json";
  if (signal.source === "seasonality_rules") return "seasonality (código)";
  if (EVENTS_SOURCES.has(signal.source)) return "events.json";
  return "signals.json";
}

export function kindLabel(kind: SignalKind): string {
  return KIND_LABELS[kind] ?? kind;
}

function formatRange(start: string, end: string): string {
  if (start === end) {
    return new Date(`${start}T12:00:00`).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    });
  }
  const a = new Date(`${start}T12:00:00`).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
  const b = new Date(`${end}T12:00:00`).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
  return `${a} – ${b}`;
}

export function signalsToAdminCalendarEvents(
  signals: DemandSignal[],
  overriddenIds: Set<string> = new Set(),
): AdminCalendarEvent[] {
  return signals.map((s) => ({
    id: s.id,
    slug: s.id,
    title: s.title,
    start: s.startsOn,
    end: s.endsOn,
    interestLabel: kindLabel(s.kind),
    eventDates: formatRange(s.startsOn, s.endsOn),
    kind: s.kind,
    source: s.source,
    sourceLabel: sourceLabel(s.source),
    originHint: signalOriginHint(s),
    description: s.description,
    url: s.url,
    scrapedAt: s.scrapedAt,
    potentialScore: s.potentialScore,
    potentialTier: s.potentialTier,
    hasOverride: overriddenIds.has(s.id),
  }));
}
