/**
 * Travel Brief (= guía de viaje del evento) + micrositio SEO.
 * Responde las 5 preguntas estratégicas antes de armar landing/ads.
 * Hoy: generación heurística; después: IA sobre el mismo contrato.
 */
import type {
  CampaignInterest,
  CampaignPack,
  CampaignPackProperty,
  MicrositeContent,
  TravelBrief,
} from "./types";
import { cleanPublicEventTitle } from "./guide-eligibility";
import { climateForCampaign } from "./climate-copy";
import { buildMicrositeEventCopy } from "./microsite-event-copy";

type PackCore = Omit<CampaignPack, "publishPlan" | "travelBrief" | "microsite">;

function guideKind(interest: CampaignInterest): MicrositeContent["guideKind"] {
  if (interest === "concierto") return "concierto";
  if (interest === "partido_futbol") return "partido";
  if (interest === "deporte_competencia") return "deporte";
  if (interest === "nieve") return "nieve";
  if (
    interest === "feriado_puente" ||
    interest === "vacaciones_familias" ||
    interest === "turismo_general"
  ) {
    return "turismo";
  }
  return "evento";
}

function guideTitle(pack: PackCore): string {
  const raw = cleanPublicEventTitle(pack.eventTitle);
  switch (pack.interest) {
    case "concierto":
      return raw.startsWith("Guía") ? raw : `Guía del concierto: ${raw}`;
    case "partido_futbol":
      return raw.startsWith("Guía") ? raw : `Guía del partido: ${raw}`;
    case "deporte_competencia":
      return raw.startsWith("Guía") ? raw : `Guía: ${raw}`;
    case "congreso_feria":
      return raw.startsWith("Guía") ? raw : `Guía del congreso: ${raw}`;
    case "nieve":
      return "Guía de nieve: Santiago como base hacia la cordillera";
    case "feriado_puente":
      return `Guía ${raw} en Santiago`;
    case "vacaciones_familias":
      return `Guía ${raw} en Santiago`;
    case "turismo_general":
      return `Guía ${raw} en Santiago`;
    default:
      return `Guía ${raw} en Santiago`;
  }
}

function monthClimate(isoDate: string, interest: CampaignInterest) {
  return climateForCampaign(isoDate, interest, "es");
}

function persona(pack: PackCore): TravelBrief["persona"] {
  const origins = pack.audience.geoTargets.map((g) => g.label).slice(0, 4);
  const segs = pack.audience.segments.join(" ").toLowerCase();
  const alone =
    /solo|individual|workation/.test(segs)
      ? "viaja solo o en pareja"
      : pack.interest === "partido_futbol"
        ? "viaja en pareja o con amigos hinchas"
        : pack.interest === "concierto"
          ? "viaja en pareja o con amigos"
          : "viaja en pareja o en grupo pequeño";

  const age =
    pack.interest === "concierto"
      ? "25–45 años"
      : pack.interest === "partido_futbol"
        ? "22–50 años"
        : pack.interest === "deporte_competencia"
          ? "deportistas, staff y familias (18–50)"
          : "25–55 años";

  const budget =
    pack.demandDimension === "mega" || pack.demandDimension === "grande"
      ? "medio-alto: prioriza cercanía y comodidad sobre el precio mínimo"
      : "medio: busca buen barrio y metro sin pagar hotel premium";

  const nights =
    pack.eventStartsOn !== pack.eventEndsOn
      ? "2–3 noches (llegada anticipada + día del evento)"
      : pack.interest === "nieve"
        ? "3–5 noches como hub hacia la cordillera"
        : "1–2 noches alrededor del evento";

  return {
    who: `${age}; ${alone}. Motivo: ${pack.interestLabel.toLowerCase()}.`,
    origins:
      origins.length > 0
        ? origins
        : pack.interest === "nieve"
          ? ["Brasil", "regiones de Chile"]
          : ["regiones de Chile", "Santiago (último minuto)"],
    tripStyle: alone,
    budgetBand: budget,
    stayNights: nights,
  };
}

function strategy(pack: PackCore): TravelBrief["strategy"] {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;

  const problem =
    pack.interest === "nieve"
      ? "Necesita una base cómoda en Santiago para ir y volver de la cordillera sin complicarse."
      : pack.interest === "concierto"
        ? `Quiere llegar al show en ${venue} sin estrés y volver de noche con seguridad.`
        : pack.interest === "partido_futbol"
          ? `Quiere estar cerca de ${venue}, evitar traslados largos post-partido y dormir bien.`
          : `Quiere alojarse cerca de ${venue}, moverse fácil y no improvisar a último minuto.`;

  const objections =
    pack.interest === "nieve"
      ? [
          "¿Queda muy lejos de los centros de ski?",
          "¿Cómo llego a Valle Nevado o Farellones desde el alojamiento?",
          "¿Conviene van, tour o auto propio?",
          "¿Hay check-in flexible si llego tarde del aeropuerto?",
          "¿Qué pasa si cancelo por mal clima en la cordillera?",
        ]
      : [
          "¿Es seguro el barrio de noche?",
          "¿Queda muy lejos del venue?",
          mins > 25
            ? "¿Conviene taxi o metro para el traslado?"
            : "¿Hay metro cerca para volver después del evento?",
          "¿Hay check-in flexible si llego tarde?",
          pack.properties.some((p) =>
            p.amenities.some((a) => /estacionamiento/i.test(a)),
          )
            ? "¿Hay estacionamiento?"
            : "¿Puedo moverme sin auto?",
          "¿Qué pasa si cancelo?",
        ];

  const trustProof =
    pack.interest === "nieve"
      ? [
          "Alojamientos hub en barrios bien conectados (Italia, Centro, Ñuñoa)",
          "Fotos reales del alojamiento (no stock)",
          pack.properties.some((p) => p.isSuperhost)
            ? "Anfitrión Superhost en Airbnb"
            : "Reserva protegida en Airbnb",
          "Metro cerca para moverte en Santiago entre días de ski",
          "Ideal para combinar noches en ciudad + salidas temprano a la cordillera",
        ]
      : [
          `Mapa con tiempo estimado (~${mins} min al venue)`,
          "Fotos reales del alojamiento (no stock)",
          pack.properties.some((p) => p.isSuperhost)
            ? "Anfitrión Superhost en Airbnb"
            : "Reserva protegida en Airbnb",
          pack.properties.some((p) => p.rating != null)
            ? "Reseñas reales visibles en el anuncio"
            : "Pago y mensajería seguros en Airbnb",
          "Metro cercano en barrios residenciales",
        ];

  const winningMessage =
    pack.interest === "concierto"
      ? `Duerme a ~${mins} min de ${venue}: llegas al show sin apuro y vuelves tranquilo.`
      : pack.interest === "partido_futbol"
        ? `Base en barrio seguro a ~${mins} min de ${venue}. Llegas, ves el partido y duermes cerca.`
        : pack.interest === "nieve"
          ? "Santiago como hub: alojamiento full equipado, metro cerca, sales a la cordillera cuando quieras."
          : `A ~${mins} min de ${venue}, en barrio seguro y con reserva directa en Airbnb.`;

  return { problem, objections, trustProof, winningMessage };
}

function faqs(pack: PackCore): Array<{ q: string; a: string }> {
  return buildMicrositeEventCopy(pack, "es").faqs;
}

function recommendations(pack: PackCore): string[] {
  return buildMicrositeEventCopy(pack, "es").recommendations;
}

function transport(pack: PackCore): string[] {
  return buildMicrositeEventCopy(pack, "es").transport;
}

function eventSummary(pack: PackCore): string {
  return buildMicrositeEventCopy(pack, "es").eventSummary;
}

function mustKnow(pack: PackCore): string[] {
  return buildMicrositeEventCopy(pack, "es").mustKnow;
}

function news(pack: PackCore): string[] {
  return buildMicrositeEventCopy(pack, "es").news;
}

export function buildTravelBrief(pack: PackCore): TravelBrief {
  const p = persona(pack);
  const s = strategy(pack);
  return {
    status: "ready",
    generatedAt: new Date().toISOString(),
    persona: p,
    strategy: s,
    checklistAnswered: {
      who: Boolean(p.who),
      problem: Boolean(s.problem),
      objections: s.objections.length >= 3,
      trustProof: s.trustProof.length >= 3,
      winningMessage: Boolean(s.winningMessage),
    },
  };
}

export function buildMicrosite(pack: PackCore): MicrositeContent {
  const climate = monthClimate(pack.eventStartsOn, pack.interest);
  const kind = guideKind(pack.interest);
  const title = guideTitle(pack);
  const slug = pack.slug;
  const summary = eventSummary(pack);

  return {
    slug,
    guideTitle: title,
    guideKind: kind,
    productLabel: "Event guide",
    productLabelEs: "Guía del evento",
    eventSummary: summary,
    eventDescription: pack.eventDescription,
    eventTitle: pack.eventTitle,
    eventDates: pack.eventDates,
    venueName: pack.venueName,
    venueLat: pack.venueLat,
    venueLng: pack.venueLng,
    mustKnow: mustKnow(pack),
    recommendations: recommendations(pack),
    news: news(pack),
    weather: climate,
    transport: transport(pack),
    faqs: faqs(pack),
    seoTitle:
      pack.interest === "nieve"
        ? `${title} · Santiago hub cordillera`
        : `${title} · ${pack.venueName}`,
    seoDescription:
      pack.interest === "nieve"
        ? `${title}. Fechas, tips, clima, traslados a centros de ski, FAQ y alojamiento hub en Santiago.`
        : `${pack.eventDescription} Mapa, tips, clima, transporte, FAQ y alojamiento cerca de ${pack.venueName}.`,
    properties: pack.properties,
    interest: pack.interest,
    interestLabel: pack.interestLabel,
    shareText:
      pack.interest === "nieve"
        ? `🎿 ${pack.eventTitle} · ${pack.eventDates}. Tips, clima y dónde quedarte en Santiago:`
        : `📍 ${pack.eventTitle} · ${pack.venueName} (${pack.eventDates}). Mapa, tips y alojamiento:`,
  };
}

export function attachTravelBriefAndMicrosite<T extends PackCore>(
  pack: T,
): T & { travelBrief: TravelBrief; microsite: MicrositeContent } {
  const travelBrief = buildTravelBrief(pack);
  const microsite = buildMicrosite(pack);
  return { ...pack, travelBrief, microsite };
}

export function micrositePath(slug: string): string {
  return `/g/${slug}`;
}

export function propertiesForMicrosite(
  props: CampaignPackProperty[],
): CampaignPackProperty[] {
  return props.map((p) => ({
    ...p,
    amenities: p.amenities.filter((a) => !/mascota/i.test(a)),
  }));
}
