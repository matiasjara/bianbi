import type { DemandSignal } from "./types";

/**
 * Reglas de estacionalidad / flujos turísticos de Santiago y Chile.
 * No son scrapes: conocimiento operativo recurrente (repetible cada año).
 * Los robots pueden sobreescribir intensidades con datos reales más adelante.
 */
type SeasonRule = {
  id: string;
  title: string;
  description: string;
  /** Mes 1-12 inclusive */
  monthStart: number;
  monthEnd: number;
  /** Día del mes inicio (opcional, default 1) */
  dayStart?: number;
  /** Día del mes fin (opcional, default fin de mes) */
  dayEnd?: number;
  intensity: number;
  audienceTags: string[];
  poiIds: string[];
  propertyCodesPreferred?: string[];
  kind: DemandSignal["kind"];
};

const RULES: SeasonRule[] = [
  {
    id: "season-nieve-br",
    title: "Temporada de nieve — turismo brasileño",
    description:
      "Jun–Ago: flujo fuerte de brasileños hacia centros de ski (Valle Nevado, Farellones, Portillo). Santiago es hub de llegada/salida y noches puente.",
    monthStart: 6,
    monthEnd: 8,
    intensity: 7,
    audienceTags: ["turismo", "brasil", "nieve"],
    poiIds: ["poi-santiago-hub", "poi-italia", "poi-lastarria"],
    propertyCodesPreferred: ["E801", "E214", "T112"],
    kind: "tourism_flow",
  },
  {
    id: "season-vacaciones-invierno",
    title: "Vacaciones de invierno escolares",
    description:
      "Dos semanas típicas en julio: familias locales + turismo corto. Sube Fantasilandia y escapadas urbanas.",
    monthStart: 7,
    monthEnd: 7,
    dayStart: 11,
    dayEnd: 26,
    intensity: 6,
    audienceTags: ["familias", "turismo"],
    poiIds: ["poi-fantasilandia"],
    propertyCodesPreferred: ["T112", "Z114", "Z107"],
    kind: "school_break",
  },
  {
    id: "season-fiestas-patrias",
    title: "Fiestas Patrias — puente nacional",
    description:
      "18–19 sep (+puente): máxima demanda doméstica. Fondas, viajes internos, noches caras.",
    monthStart: 9,
    monthEnd: 9,
    dayStart: 17,
    dayEnd: 21,
    intensity: 9,
    audienceTags: ["turismo", "familias", "nacional"],
    poiIds: ["poi-fantasilandia", "poi-lastarria", "poi-italia"],
    kind: "seasonality",
  },
  {
    id: "season-verano",
    title: "Verano Santiago — turismo + eventos",
    description:
      "Dic–Feb: hoteles llenos, festivales, visitas familiares. Buena base orgánica; conviene remarketing.",
    monthStart: 12,
    monthEnd: 2,
    intensity: 6,
    audienceTags: ["turismo", "familias"],
    poiIds: ["poi-lastarria", "poi-italia", "poi-costanera", "poi-fantasilandia"],
    kind: "seasonality",
  },
  {
    id: "season-ano-nuevo",
    title: "Año Nuevo — llegada anticipada",
    description:
      "28 dic–2 ene: peak de llegadas internacionales y nacionales.",
    monthStart: 12,
    monthEnd: 12,
    dayStart: 28,
    dayEnd: 31,
    intensity: 8,
    audienceTags: ["turismo"],
    poiIds: ["poi-lastarria", "poi-costanera"],
    kind: "seasonality",
  },
  {
    id: "season-ano-nuevo-ene",
    title: "Año Nuevo — salida / puente enero",
    description: "1–3 ene: extensión del peak de Año Nuevo.",
    monthStart: 1,
    monthEnd: 1,
    dayStart: 1,
    dayEnd: 3,
    intensity: 8,
    audienceTags: ["turismo"],
    poiIds: ["poi-lastarria", "poi-costanera"],
    kind: "seasonality",
  },
  {
    id: "season-semana-santa",
    title: "Semana Santa — puente corto",
    description:
      "Jueves/viernes santo: escapadas urbanas y turismo doméstico (fechas exactas vienen de feriados).",
    monthStart: 3,
    monthEnd: 4,
    intensity: 4,
    audienceTags: ["turismo", "familias"],
    poiIds: ["poi-lastarria", "poi-italia"],
    kind: "seasonality",
  },
  {
    id: "season-congresos-otoño",
    title: "Temporada de congresos / negocios",
    description:
      "Mar–May y Sep–Nov: mayor actividad de congresos y viajes corporativos en Santiago.",
    monthStart: 3,
    monthEnd: 5,
    intensity: 4,
    audienceTags: ["negocios", "workation"],
    poiIds: ["poi-lastarria", "poi-costanera"],
    propertyCodesPreferred: ["E801", "E214", "T112"],
    kind: "seasonality",
  },
  {
    id: "season-congresos-primavera",
    title: "Congresos primavera",
    description: "Sep–Nov: segunda ventana fuerte de viajes de negocios.",
    monthStart: 9,
    monthEnd: 11,
    intensity: 4,
    audienceTags: ["negocios", "workation"],
    poiIds: ["poi-lastarria", "poi-costanera"],
    propertyCodesPreferred: ["E801", "E214", "T112"],
    kind: "seasonality",
  },
  {
    id: "season-halloween-festivales",
    title: "Halloween / primavera eventos",
    description:
      "Fin de oct: fiestas, shows y turismo corto de fin de semana.",
    monthStart: 10,
    monthEnd: 10,
    dayStart: 25,
    dayEnd: 31,
    intensity: 5,
    audienceTags: ["turismo", "conciertos"],
    poiIds: ["poi-movistar", "poi-italia"],
    kind: "seasonality",
  },
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function overlapsMonth(
  rule: SeasonRule,
  year: number,
  month: number,
): { start: string; end: string } | null {
  // summer wraps dec-feb
  if (rule.monthStart > rule.monthEnd) {
    if (month < rule.monthStart && month > rule.monthEnd) return null;
  } else if (month < rule.monthStart || month > rule.monthEnd) {
    return null;
  }

  const startDay =
    month === rule.monthStart ? (rule.dayStart ?? 1) : 1;
  const endDay =
    month === rule.monthEnd
      ? (rule.dayEnd ?? daysInMonth(year, month))
      : daysInMonth(year, month);

  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    start: `${year}-${pad(month)}-${pad(startDay)}`,
    end: `${year}-${pad(month)}-${pad(endDay)}`,
  };
}

/** Expande reglas a señales concretas para un rango de años. */
export function buildSeasonalitySignals(
  fromYear: number,
  toYear: number,
): DemandSignal[] {
  const signals: DemandSignal[] = [];
  const pad = (n: number) => String(n).padStart(2, "0");

  for (let year = fromYear; year <= toYear; year++) {
    for (const rule of RULES) {
      if (rule.monthStart > rule.monthEnd) {
        // Ej. dic→feb: señal A dic(year), señal B ene–feb(year+1) si year+1 en rango
        const startA = `${year}-${pad(rule.monthStart)}-${pad(rule.dayStart ?? 1)}`;
        const endA = `${year}-12-${pad(daysInMonth(year, 12))}`;
        signals.push({
          id: `${rule.id}-${year}-a`,
          kind: rule.kind,
          source: "seasonality_rules",
          title: `${rule.title} (${year})`,
          description: rule.description,
          startsOn: startA,
          endsOn: endA,
          intensity: rule.intensity,
          audienceTags: rule.audienceTags,
          poiIds: rule.poiIds,
          propertyCodesPreferred: rule.propertyCodesPreferred,
        });

        if (year + 1 <= toYear || year === toYear) {
          const y2 = year + 1;
          const startB = `${y2}-01-01`;
          const endB = `${y2}-${pad(rule.monthEnd)}-${pad(rule.dayEnd ?? daysInMonth(y2, rule.monthEnd))}`;
          signals.push({
            id: `${rule.id}-${y2}-b`,
            kind: rule.kind,
            source: "seasonality_rules",
            title: `${rule.title} (${y2})`,
            description: rule.description,
            startsOn: startB,
            endsOn: endB,
            intensity: rule.intensity,
            audienceTags: rule.audienceTags,
            poiIds: rule.poiIds,
            propertyCodesPreferred: rule.propertyCodesPreferred,
          });
        }
        continue;
      }

      const months: number[] = [];
      for (let m = rule.monthStart; m <= rule.monthEnd; m++) months.push(m);

      const ranges = months
        .map((m) => overlapsMonth(rule, year, m))
        .filter((r): r is { start: string; end: string } => Boolean(r));

      if (ranges.length === 0) continue;

      signals.push({
        id: `${rule.id}-${year}`,
        kind: rule.kind,
        source: "seasonality_rules",
        title: `${rule.title} (${year})`,
        description: rule.description,
        startsOn: ranges[0].start,
        endsOn: ranges[ranges.length - 1].end,
        intensity: rule.intensity,
        audienceTags: rule.audienceTags,
        poiIds: rule.poiIds,
        propertyCodesPreferred: rule.propertyCodesPreferred,
      });
    }
  }

  // Dedup ids
  const byId = new Map(signals.map((s) => [s.id, s]));
  return [...byId.values()];
}
