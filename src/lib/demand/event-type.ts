/**
 * Tipo fino de evento para filtros de cartelera (hockey, atletismo, concierto…).
 * Más específico que CampaignInterest: distingue deportes bajo deporte_competencia.
 */
import type { CampaignInterest, SignalSource } from "./types";

export type EventTypeId =
  | "hockey"
  | "atletismo"
  | "voleibol"
  | "futbol"
  | "concierto"
  | "teatro"
  | "nieve"
  | "congreso"
  | "feriado"
  | "deporte"
  | "otro";

export type EventTypeOption = {
  id: EventTypeId;
  label: string;
  count: number;
};

const EVENT_TYPE_LABELS: Record<EventTypeId, string> = {
  hockey: "Hockey",
  atletismo: "Atletismo",
  voleibol: "Vóleibol",
  futbol: "Fútbol",
  concierto: "Concierto",
  teatro: "Teatro / cultura",
  nieve: "Nieve",
  congreso: "Congreso / feria",
  feriado: "Feriado / vacaciones",
  deporte: "Deporte",
  otro: "Otros",
};

/** Orden de aparición en selects (más específicos primero). */
const EVENT_TYPE_ORDER: EventTypeId[] = [
  "concierto",
  "futbol",
  "hockey",
  "atletismo",
  "voleibol",
  "deporte",
  "nieve",
  "congreso",
  "teatro",
  "feriado",
  "otro",
];

export function eventTypeLabel(id: EventTypeId): string {
  return EVENT_TYPE_LABELS[id];
}

export function parseEventTypeParam(raw?: string | null): EventTypeId | null {
  if (!raw) return null;
  return (EVENT_TYPE_ORDER as string[]).includes(raw)
    ? (raw as EventTypeId)
    : null;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export type EventTypeInput = {
  title: string;
  description?: string;
  venueName?: string;
  interest?: CampaignInterest;
  source?: SignalSource;
  audienceTags?: string[];
};

/** Clasifica un evento/guía en un tipo de filtro mutuamente excluyente. */
export function classifyEventType(input: EventTypeInput): EventTypeId {
  const tags = (input.audienceTags ?? []).map(normalize);
  const text = normalize(
    `${input.title} ${input.description ?? ""} ${input.venueName ?? ""}`,
  );
  const interest = input.interest;
  const source = input.source;

  if (
    interest === "nieve" ||
    tags.includes("nieve") ||
    /\bnieve\b|ski|valle nevado|farellones|portillo|la parva|el colorado/.test(
      text,
    )
  ) {
    return "nieve";
  }

  if (
    interest === "feriado_puente" ||
    interest === "vacaciones_familias" ||
    /\bferiado\b|fiestas patrias|puente nacional|vacaciones de invierno|receso escolar/.test(
      text,
    )
  ) {
    return "feriado";
  }

  if (
    interest === "congreso_feria" ||
    tags.some((t) => t.includes("congreso") || t.includes("mice")) ||
    /\bcongreso\b|\bferia\b|\bexpo\b|\bseminar/.test(text)
  ) {
    return "congreso";
  }

  const isHockey =
    source === "fehoch_tournaments" ||
    tags.some((t) => t.includes("hockey")) ||
    /\bhockey\b|fehoch|\bfih\b/.test(text);
  if (isHockey && !/hielo|ice\s*hockey/.test(text)) {
    return "hockey";
  }

  const isAtletismo =
    source === "fedachi" ||
    source === "club_atletico_santiago" ||
    tags.some((t) => t.includes("atletismo")) ||
    /\batletismo\b|fedachi|interescolar|marat[oó]n|media marat[oó]n|\b10k\b|\b21k\b|\b42k\b|running|track|cross country/.test(
      text,
    );
  if (isAtletismo) {
    return "atletismo";
  }

  const isVoleibol =
    source === "fevochi" ||
    tags.some((t) => t.includes("voleibol") || t.includes("volley")) ||
    /\bvoleibol\b|\bvolley\b|\bvoley\b/.test(text);
  if (isVoleibol) {
    return "voleibol";
  }

  if (
    interest === "partido_futbol" ||
    source === "campeonato_chileno" ||
    tags.includes("futbol") ||
    /\bfutbol\b|\banfp\b|campeonato chileno|colo-colo|universidad de chile|\budechile\b/.test(
      text,
    )
  ) {
    return "futbol";
  }

  if (
    interest === "concierto" ||
    tags.includes("conciertos") ||
    /\bconcierto\b|\btour\b|\blive in\b|\bfestival\b|\blollapalooza\b|standup|stand-up/.test(
      text,
    )
  ) {
    return "concierto";
  }

  if (
    interest === "otro_evento" ||
    tags.includes("teatro") ||
    tags.includes("cultura") ||
    /\bteatro\b|\bobra\b|\bdanza\b|\bballet\b/.test(text)
  ) {
    return "teatro";
  }

  if (
    interest === "deporte_competencia" ||
    source === "ind_cl" ||
    /\bcampeonato\b|\btorneo\b|\bcopa\b|\bmundial\b/.test(text)
  ) {
    return "deporte";
  }

  return "otro";
}

/**
 * Opciones de filtro con al menos un ítem.
 * Usar con eventos futuros (sin acotar al mes seleccionado).
 */
export function availableEventTypes<T>(
  items: T[],
  getType: (item: T) => EventTypeId,
): EventTypeOption[] {
  const counts = new Map<EventTypeId, number>();
  for (const item of items) {
    const id = getType(item);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return EVENT_TYPE_ORDER.filter((id) => (counts.get(id) ?? 0) > 0).map(
    (id) => ({
      id,
      label: EVENT_TYPE_LABELS[id],
      count: counts.get(id)!,
    }),
  );
}
