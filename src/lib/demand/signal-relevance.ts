/**
 * Relevancia para Crambie: eventos con demanda de pernocta de visitantes
 * de otras ciudades. Excluye fiestas locales, series de club y noches
 * recurrentes sin draw turístico (ej. "Martes se sale" en Subterráneo).
 */
import { isTheaterOrCulturalEvent } from "./interest";
import { isHockeySignal, isRelevantHockeySignal } from "./hockey-group";
import type { DemandSignal } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function relevanceText(signal: DemandSignal): string {
  return normalize(`${signal.title} ${signal.description} ${signal.url ?? ""}`);
}

/** Actos con convocatoria fuera de la ciudad aunque el venue sea chico. */
const TOURING_DRAW =
  /\b(the cat empire|cat empire|jamiroquai|gorillaz|massive attack|portishead|moby|underworld|prodigy)\b/;

const MEGA_VENUE =
  /\b(movistar arena|estadio nacional|parque o'?higgins|gran arena monticello|estadio monumental|estadio bicentenario)\b/;

/** Señales fuertes de demanda de viaje (gira, fest, mega venue, etc.) */
export function hasTravelDemandOverride(text: string): boolean {
  const t = normalize(text);
  if (TOURING_DRAW.test(t)) return true;
  if (MEGA_VENUE.test(t)) return true;
  if (
    /\b(gira|world tour|tour mundial|latin america tour|stadium tour|en chile|live in santiago)\b/.test(
      t,
    )
  ) {
    return true;
  }
  if (
    /\b(lollapalooza|creamfields|fauna primavera|tomorrowland|cirque du soleil|disney on ice)\b/.test(
      t,
    )
  ) {
    return true;
  }
  if (/\bfest\b/.test(t) || /\bfestival\b/.test(t)) return true;
  if (/\b(copa am[eé]rica|mundial|olympi|supercopa|libertadores)\b/.test(t)) {
    return true;
  }
  if (/\b(sold out|agotad|[uú]ltimas entradas|last tickets)\b/.test(t)) {
    return true;
  }
  if (
    /\b(congreso|convencion|convención|feria|expo\b|summit|forum|mice|fidae|edifica|expo salud|espacio food)\b/.test(
      t,
    ) &&
    /\b(espacio riesco|metropolitan|centro parque|santiago|internacional|mice)\b/.test(
      t,
    )
  ) {
    return true;
  }
  return false;
}

const LOCAL_NIGHTLIFE_SERIES =
  /\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\s+se\s+(sale|baila|vive|rumbea)\b/;

const ULTRABAILABLE =
  /\bultrabailable\b|\bfull ultrabailable\b|\bweeknd'?dance\b|\bportofino\s+full\b|\brumba\s+full\b/;

const JAZZ_CLUB_WEEKLY = /\bjazz club\b/;

const RECURRING_PARTY_BRANDS =
  /\b(martes se sale|miercoles se baila|leyendas del free|mtv hitz)\b/;

/** TicketPlus: día de semana + número de día en título de club chico. */
const TICKETPLUS_WEEKDAY_DATE =
  /\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\s+\d{1,2}\b/;

const SMALL_CLUB_VENUE =
  /\bclub subterraneo\b|\bblondie\b|\bclub chocolate\b|\bsala amarilla\b|\bbar comedy\b/;

const AGE_GATED_CLUB = /\(\+21\)|\(\+23\)|\+21m|\s\+21\b|\(\+21m/;

export function isLocalNightlifeOrClubSeries(text: string): boolean {
  const t = normalize(text);
  if (LOCAL_NIGHTLIFE_SERIES.test(t)) return true;
  if (ULTRABAILABLE.test(t)) return true;
  if (JAZZ_CLUB_WEEKLY.test(t)) return true;
  if (RECURRING_PARTY_BRANDS.test(t)) return true;
  if (
    AGE_GATED_CLUB.test(t) &&
    SMALL_CLUB_VENUE.test(t) &&
    TICKETPLUS_WEEKDAY_DATE.test(t)
  ) {
    return true;
  }
  return false;
}

/** Show en club chico sin gira/fest ni formato teatral → público local. */
export function isSmallClubShowWithoutDraw(signal: DemandSignal): boolean {
  const text = relevanceText(signal);
  if (hasTravelDemandOverride(text)) return false;
  if (isTheaterOrCulturalEvent(text)) return false;

  const t = normalize(text);
  if (!SMALL_CLUB_VENUE.test(t)) return false;

  if (TICKETPLUS_WEEKDAY_DATE.test(t) && SMALL_CLUB_VENUE.test(t)) {
    return true;
  }

  const score = signal.potentialScore ?? signal.intensity * 10;
  if (score < 48 && (AGE_GATED_CLUB.test(t) || ULTRABAILABLE.test(t))) {
    return true;
  }

  return false;
}

export function isRelevantDemandSignal(signal: DemandSignal): boolean {
  if (
    signal.kind === "holiday" ||
    signal.kind === "seasonality" ||
    signal.kind === "school_break" ||
    signal.kind === "tourism_flow"
  ) {
    return true;
  }

  if (signal.kind === "sport") {
    if (isHockeySignal(signal) && !isRelevantHockeySignal(signal)) {
      return false;
    }
    return true;
  }

  const text = relevanceText(signal);

  if (hasTravelDemandOverride(text)) return true;
  if (isTheaterOrCulturalEvent(text)) return true;
  if (isLocalNightlifeOrClubSeries(text)) return false;
  if (isSmallClubShowWithoutDraw(signal)) return false;

  return true;
}

/** Para ingest antes de construir DemandSignal completo. */
export function shouldIngestScrapedEvent(input: {
  title: string;
  description?: string;
  url?: string;
  kind?: DemandSignal["kind"];
  potentialScore?: number;
  intensity?: number;
}): boolean {
  const signal: DemandSignal = {
    id: "probe",
    kind: input.kind ?? "event",
    source: "ticketplus_cl",
    title: input.title,
    description: input.description ?? "",
    startsOn: "2099-01-01",
    endsOn: "2099-01-01",
    intensity: input.intensity ?? 5,
    potentialScore: input.potentialScore,
    audienceTags: [],
    poiIds: [],
    propertyCodesPreferred: [],
    scrapedAt: "",
  };
  return isRelevantDemandSignal(signal);
}
