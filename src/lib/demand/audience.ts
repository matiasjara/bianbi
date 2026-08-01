/**
 * Deriva público objetivo geográfico desde señales (rivales, tags, país).
 * Ej.: Huachipato → Gran Concepción; River Plate → Argentina.
 */
import type {
  AudienceGeoTarget,
  AudienceGeoType,
  CampaignAudience,
  DemandSignal,
} from "./types";

export type { AudienceGeoTarget, AudienceGeoType, CampaignAudience };

type ClubOrigin = {
  match: RegExp;
  label: string;
  area: string;
  type: AudienceGeoType;
  origin: string;
  adHint: string;
};

const CLUB_ORIGINS: ClubOrigin[] = [
  {
    match: /huachipato|deportes?\s*concepci[oó]n|\bconcepci[oó]n\b/i,
    label: "Gran Concepción",
    area: "Biobío",
    type: "city",
    origin: "Huachipato / Concepción",
    adHint: "Meta/Google: Concepción, Talcahuano, San Pedro, Chiguayante",
  },
  {
    match: /nublense|ñublense|\bchill[aá]n\b/i,
    label: "Chillán",
    area: "Ñuble",
    type: "city",
    origin: "Ñublense",
    adHint: "Meta/Google: Chillán + Ñuble",
  },
  {
    match: /coquimbo\s*unido|coquimbo/i,
    label: "Coquimbo",
    area: "Coquimbo",
    type: "city",
    origin: "Coquimbo Unido",
    adHint: "Meta/Google: Coquimbo + La Serena",
  },
  {
    match: /la\s*serena/i,
    label: "La Serena",
    area: "Coquimbo",
    type: "city",
    origin: "Deportes La Serena",
    adHint: "Meta/Google: La Serena + Coquimbo",
  },
  {
    match: /\beverton\b/i,
    label: "Viña del Mar / Valparaíso",
    area: "Valparaíso",
    type: "region",
    origin: "Everton",
    adHint: "Meta/Google: Viña del Mar, Valparaíso, Quilpué",
  },
  {
    match: /o'?higgins|rancagua/i,
    label: "Rancagua",
    area: "O'Higgins",
    type: "city",
    origin: "O'Higgins",
    adHint: "Meta/Google: Rancagua + O'Higgins",
  },
  {
    match: /cobresal|el\s*salvador/i,
    label: "El Salvador / Atacama",
    area: "Atacama",
    type: "region",
    origin: "Cobresal",
    adHint: "Meta/Google: Copiapó, El Salvador, Atacama",
  },
  {
    match: /uni[oó]n\s*la\s*calera|la\s*calera|\bcalera\b/i,
    label: "La Calera",
    area: "Valparaíso",
    type: "city",
    origin: "Unión La Calera",
    adHint: "Meta/Google: La Calera, Quillota, Los Andes",
  },
  {
    match: /deportes?\s*limache|\blimache\b/i,
    label: "Limache",
    area: "Valparaíso",
    type: "city",
    origin: "Deportes Limache",
    adHint: "Meta/Google: Limache, Quillota, Villa Alemana",
  },
  {
    match: /antofagasta/i,
    label: "Antofagasta",
    area: "Antofagasta",
    type: "city",
    origin: "Deportes Antofagasta",
    adHint: "Meta/Google: Antofagasta",
  },
  {
    match: /iquique|deportes?\s*iquique/i,
    label: "Iquique",
    area: "Tarapacá",
    type: "city",
    origin: "Deportes Iquique",
    adHint: "Meta/Google: Iquique + Alto Hospicio",
  },
  {
    match: /copiap[oó]/i,
    label: "Copiapó",
    area: "Atacama",
    type: "city",
    origin: "Deportes Copiapó",
    adHint: "Meta/Google: Copiapó",
  },
  {
    match: /temuco|araucan[ií]a/i,
    label: "Temuco",
    area: "Araucanía",
    type: "city",
    origin: "Temuco / Araucanía",
    adHint: "Meta/Google: Temuco + Araucanía",
  },
  {
    match: /santiago\s*wanderers|wanderers/i,
    label: "Valparaíso",
    area: "Valparaíso",
    type: "city",
    origin: "Santiago Wanderers",
    adHint: "Meta/Google: Valparaíso + Viña del Mar",
  },
];

const INTERNATIONAL_ORIGINS: ClubOrigin[] = [
  {
    match:
      /\bargentin|river\s*plate|\bboca\b|racing\s*club|independiente|san\s*lorenzo|v[eé]lez|estudiantes|newell'?s|rosario\s*central|talleres|belgrano|hurac[aá]n|banfield|gimnasia|lan[uú]s|defensa\s*y\s*justicia|godoy\s*cruz|atl[eé]tico\s*tucum[aá]n|uni[oó]n\s*santa\s*fe|colonia\s*de\s*santa\s*fe/i,
    label: "Argentina",
    area: "Argentina",
    type: "country",
    origin: "público argentino / club argentino",
    adHint: "Meta/Google: Argentina (CABA + GBA + Mendoza + Córdoba) · interés fútbol",
  },
  {
    match:
      /\bbrasil|flamengo|palmeiras|corinthians|s[aã]o\s*paulo|santos|gr[eê]mio|internacional|fluminense|atl[eé]tico\s*mineiro|botafogo|cruzeiro/i,
    label: "Brasil",
    area: "Brasil",
    type: "country",
    origin: "público brasileño / club brasileño",
    adHint: "Meta/Google: Brasil · interés fútbol / turismo Chile",
  },
  {
    match: /\buruguay|pe[nñ]arol|nacional\s*\(u\)|montevideo/i,
    label: "Uruguay",
    area: "Uruguay",
    type: "country",
    origin: "público uruguayo",
    adHint: "Meta/Google: Uruguay · Montevideo",
  },
  {
    match: /\bper[uú]|alianza\s*lima|universitario\s*de\s*deportes|sporting\s*cristal/i,
    label: "Perú",
    area: "Perú",
    type: "country",
    origin: "público peruano",
    adHint: "Meta/Google: Perú · Lima",
  },
];

const SEGMENT_LABELS: Record<string, string> = {
  regiones: "hinchada desde regiones",
  hinchada_viajera: "hinchada viajera (pernocta)",
  federaciones: "federaciones / clubes",
  mailing: "base mailing / WhatsApp",
  clasico: "afición de clásico",
  deportes: "deportes",
  futbol: "fútbol",
  brasil: "turismo Brasil",
  familias: "familias",
  alta_demanda: "alta demanda",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseAwayFromTitle(title: string): string | null {
  const m = title.match(/\bvs\.?\s+(.+?)(?:\s*\(|$)/i);
  if (!m) return null;
  return m[1].trim();
}

function matchOrigins(text: string): AudienceGeoTarget[] {
  const found: AudienceGeoTarget[] = [];
  const seen = new Set<string>();

  for (const row of [...CLUB_ORIGINS, ...INTERNATIONAL_ORIGINS]) {
    if (!row.match.test(text)) continue;
    const key = `${row.type}:${row.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push({
      label: row.label,
      area: row.area,
      type: row.type,
      origin: row.origin,
      adHint: row.adHint,
    });
  }
  return found;
}

function buildRationale(
  signals: DemandSignal[],
  geoTargets: AudienceGeoTarget[],
  segments: string[],
): { rationale: string; stayOffer: string } {
  const lead = [...signals].sort(
    (a, b) => (b.potentialScore ?? b.intensity * 10) - (a.potentialScore ?? a.intensity * 10),
  )[0];
  const title = lead?.title ?? "este evento";
  const away = lead ? parseAwayFromTitle(lead.title) : null;
  const factors = lead?.potentialFactors?.slice(0, 2) ?? [];

  const primary = geoTargets[0];
  const stayOffer =
    "En Santiago hay alojamientos verificados cerca del recinto: llegar, descansar y caminar al partido/evento sin perder tiempo en traslados.";

  if (primary?.type === "country") {
    return {
      rationale: [
        `${title} mueve público desde ${primary.label}${away ? ` (rival / origen: ${away})` : ""}.`,
        `Conviene apuntar ads y mensajes hacia ${primary.label} para invitarlos a quedarse en Santiago los días del evento.`,
        factors.length > 0 ? `Señales: ${factors.join("; ")}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      stayOffer,
    };
  }

  if (primary) {
    const others =
      geoTargets.length > 1
        ? ` También cubre ${geoTargets
            .slice(1)
            .map((g) => g.label)
            .join(", ")}.`
        : "";
    return {
      rationale: [
        `${title}: el rival/origen está en ${primary.label} (${primary.area}).`,
        `La hinchada viaja a Santiago → targeting en ${primary.label} y alrededores para ofrecer pernocta cerca del venue.${others}`,
        factors.length > 0 ? `Factores: ${factors.join("; ")}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      stayOffer,
    };
  }

  if (
    segments.includes("hinchada desde regiones") ||
    segments.includes("hinchada viajera (pernocta)") ||
    /visita desde regiones|regiones/i.test(title)
  ) {
    return {
      rationale: `${title} trae visita desde regiones. Priorizar mailing a clubes/federaciones y ads geo en regiones fuera de la RM.`,
      stayOffer,
    };
  }

  if (segments.includes("federaciones / clubes")) {
    return {
      rationale: `${title}: evento federado. Público = deportistas, staff y familias que vienen de fuera y necesitan alojamiento en Santiago.`,
      stayOffer,
    };
  }

  if (lead?.kind === "seasonality" || lead?.kind === "tourism_flow") {
    return {
      rationale: `${title}: flujo estacional/turístico. Apuntar a orígenes típicos del flujo (p. ej. Brasil en temporada de nieve) con oferta de alojamiento en Santiago.`,
      stayOffer:
        "Alojamientos en barrios bien conectados, pensados para estadías de varios días.",
    };
  }

  return {
    rationale: `${title}: demanda concentrada en Santiago. Ads y remarketing locales + visitantes que buscan alojamiento cerca del venue.`,
    stayOffer,
  };
}

/** Infiera audiencia geo y explicación operativa desde las señales del peak. */
export function deriveAudienceFromSignals(
  signals: DemandSignal[],
): CampaignAudience {
  const blob = signals
    .map((s) => `${s.title} ${s.description} ${s.audienceTags.join(" ")}`)
    .join(" | ");

  const geoTargets = matchOrigins(blob);

  // Fallback regional genérico si hay tags pero no club mapeado
  if (
    geoTargets.length === 0 &&
    signals.some(
      (s) =>
        s.audienceTags.includes("regiones") ||
        s.audienceTags.includes("hinchada_viajera") ||
        /visita desde regiones/i.test(s.title),
    )
  ) {
    const away = signals.map((s) => parseAwayFromTitle(s.title)).find(Boolean);
    geoTargets.push({
      label: away ? `Origen de ${away}` : "Regiones (fuera RM)",
      area: "Chile (fuera RM)",
      type: "region",
      origin: away ?? "rival de regiones",
      adHint: "Meta/Google: excluir RM o priorizar regiones; mailing a clubes",
    });
  }

  if (
    geoTargets.length === 0 &&
    signals.some((s) => s.audienceTags.includes("brasil") || /brasil|nieve/i.test(s.title))
  ) {
    geoTargets.push({
      label: "Brasil",
      area: "Brasil",
      type: "country",
      origin: "turismo Brasil",
      adHint: "Meta/Google: Brasil · intereses ski / Chile / Santiago",
    });
  }

  const segmentSet = new Set<string>();
  for (const s of signals) {
    for (const tag of s.audienceTags) {
      segmentSet.add(SEGMENT_LABELS[tag] ?? tag);
    }
  }
  if (geoTargets.some((g) => g.type === "country")) {
    segmentSet.add("visitantes internacionales");
  }
  if (geoTargets.some((g) => g.type === "city" || g.type === "region")) {
    segmentSet.add("hinchada viajera (pernocta)");
  }

  const segments = [...segmentSet].slice(0, 8);
  const { rationale, stayOffer } = buildRationale(signals, geoTargets, segments);

  return { segments, geoTargets, rationale, stayOffer };
}

export function audienceSummaryLine(audience: CampaignAudience): string {
  if (audience.geoTargets.length === 0) {
    return audience.segments.slice(0, 3).join(" · ") || "Audiencia local Santiago";
  }
  return audience.geoTargets.map((g) => g.label).join(" · ");
}

/** Util interno para tests / ingest: normaliza texto de club. */
export function normalizeAudienceText(s: string) {
  return normalize(s);
}
