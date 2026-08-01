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
  const kind = guideKind(pack.interest);
  const t = pack.eventTitle;
  switch (kind) {
    case "concierto":
      return `Guía para el concierto: ${t}`;
    case "partido":
      return `Guía para el partido: ${t}`;
    case "deporte":
      return `Guía de viaje: ${t}`;
    case "nieve":
      return `Guía de viaje nieve: Santiago como base`;
    case "turismo":
      return `Guía de viaje: ${t} en Santiago`;
    default:
      return `Travel Brief: ${t}`;
  }
}

function monthClimate(isoDate: string): { summary: string; tip: string } {
  const m = Number(isoDate.slice(5, 7));
  if (m >= 12 || m <= 2) {
    return {
      summary: "Verano en Santiago: días calurosos y noches templadas.",
      tip: "Lleva ropa fresca y una capa liviana para la noche al salir del venue.",
    };
  }
  if (m >= 3 && m <= 5) {
    return {
      summary: "Otoño: temperaturas agradables, posibles tardes frescas.",
      tip: "Una chaqueta liviana alcanza para el trayecto de vuelta.",
    };
  }
  if (m >= 6 && m <= 8) {
    return {
      summary: "Invierno: mañanas frías; en cordillera puede haber nieve.",
      tip: "Abrigo y calzado cerrado. Si vienes por nieve, Santiago es tu base cómoda.",
    };
  }
  return {
    summary: "Primavera: clima variable, agradable para caminar.",
    tip: "Ideal para combinar evento + barrio a pie o en metro.",
  };
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

  const objections = [
    "¿Es seguro el barrio de noche?",
    "¿Queda muy lejos del venue?",
    mins > 25
      ? "¿Conviene taxi o se puede ir a pie / metro?"
      : "¿Puedo volver caminando después del evento?",
    "¿Hay check-in flexible si llego tarde?",
    pack.properties.some((p) =>
      p.amenities.some((a) => /estacionamiento/i.test(a)),
    )
      ? "¿Hay estacionamiento?"
      : "¿Puedo moverme sin auto?",
    "¿Qué pasa si cancelo?",
  ];

  const trustProof = [
    `Mapa con tiempo a pie (~${mins} min al venue)`,
    "Fotos reales del departamento (no stock)",
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
          ? "Santiago como hub: depto full equipado, metro cerca, sales a la cordillera cuando quieras."
          : `A ~${mins} min de ${venue}, en barrio seguro y con reserva directa en Airbnb.`;

  return { problem, objections, trustProof, winningMessage };
}

function faqs(pack: PackCore): Array<{ q: string; a: string }> {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const venue = pack.venueName;
  const metro = pack.properties[0]?.metroStations[0];
  return [
    {
      q: `¿Qué tan cerca quedan los departamentos de ${venue}?`,
      a: `Las opciones destacadas están desde ~${mins} minutos a pie (según depto). En el mapa ves la distancia real antes de reservar.`,
    },
    {
      q: "¿Es seguro el barrio?",
      a: "Trabajamos barrios residenciales bien conectados (Ñuñoa, Barrio Italia, Santiago Centro). Metro cerca y vida de barrio; igual aplica sentido común de cualquier ciudad grande.",
    },
    {
      q: "¿Cómo llego desde el aeropuerto?",
      a: metro
        ? `Desde el aeropuerto: transfer o taxi/Uber al depto. Después te mueves fácil por Metro ${metro} y alrededores.`
        : "Desde el aeropuerto: transfer o taxi/Uber directo al departamento. Luego te mueves en metro, a pie o rideshare.",
    },
    {
      q: "¿Puedo hacer check-in tarde?",
      a: "La mayoría de nuestros deptos tienen cerradura digital / check-in autónomo. Confirmas detalles con el anfitrión en Airbnb al reservar.",
    },
    {
      q: "¿Dónde reservo y pago?",
      a: "Solo en Airbnb, en el link de cada departamento. Ahí está el pago protegido, la cancelación según política del anuncio y el chat con el anfitrión.",
    },
    {
      q: "¿Bianbi es parte de Airbnb?",
      a: "No. Bianbi te muestra opciones y la guía del evento; la reserva y el pago son siempre en el anuncio oficial de Airbnb.",
    },
  ];
}

function recommendations(pack: PackCore): string[] {
  const venue = pack.venueName;
  const base = [
    `Llega con margen: calcula ~${pack.properties[0]?.walkingMinutes ?? 15} min a pie hasta ${venue}.`,
    "Guarda el pin del departamento y el del venue en tu mapa offline.",
    "Coordina check-in en Airbnb el mismo día que reserves.",
  ];
  if (pack.interest === "concierto") {
    return [
      ...base,
      "Come cerca del barrio antes del show; vuelve después con rideshare si es muy tarde.",
      "No dejes mochilas de valor en el venue: viaja liviano.",
    ];
  }
  if (pack.interest === "partido_futbol") {
    return [
      ...base,
      "Si hay hinchada visitante, muévete en grupo y usa rutas iluminadas / metro.",
      "Evita manejar si piensas celebrar: deja el auto o usa rideshare.",
    ];
  }
  if (pack.interest === "nieve") {
    return [
      "Usa Santiago como base: duermes bien y sales temprano a la cordillera.",
      "Revisa el parte de nieve y el clima del valle el día anterior.",
      "Metro y barrio seguro para las noches en la ciudad.",
    ];
  }
  return [
    ...base,
    "Combina el evento con un paseo por el barrio (cafés, plazas, miradores).",
    "Si viajas en pareja, elige depto con cama matrimonial y sofá-cama por si llega alguien más.",
  ];
}

function transport(pack: PackCore): string[] {
  const metros = [
    ...new Set(pack.properties.flatMap((p) => p.metroStations)),
  ];
  return [
    metros.length
      ? `Metro cercano: ${metros.slice(0, 3).join(", ")}.`
      : "Buena conexión a transporte público de Santiago.",
    "A pie al venue cuando la distancia es corta; rideshare de noche si prefieres.",
    "Desde regiones: bus a terminales + metro/Uber al departamento.",
    "Aeropuerto SCL: transfer oficial, taxi o Uber hasta el check-in.",
  ];
}

function eventSummary(pack: PackCore): string {
  return `${pack.eventTitle} en ${pack.venueName}. ${pack.eventDates}. Todo lo esencial para tu visita a Santiago.`;
}

function mustKnow(pack: PackCore): string[] {
  const mins = pack.properties[0]?.walkingMinutes ?? 15;
  const tips = [
    `Fecha: ${pack.eventDates}.`,
    `Lugar: ${pack.venueName}, Santiago.`,
    `Llega con tiempo: desde los deptos recomendados son ~${mins} min a pie.`,
    "Guarda esta guía y compártela con quien va contigo.",
  ];
  if (pack.interest === "concierto") {
    tips.push(
      "Entra con margen: colas, control de acceso y merch suelen demorar.",
      "Planifica la vuelta de noche: metro, rideshare o caminata corta según horario.",
    );
  } else if (pack.interest === "partido_futbol") {
    tips.push(
      "Revisa horarios de acceso al estadio y posibles cortes de calle.",
      "Si la hinchada es visitante, muévete en grupo por rutas iluminadas.",
    );
  } else if (pack.interest === "nieve") {
    tips.push(
      "Santiago es tu base: duermes en la ciudad y sales temprano a la cordillera.",
      "Revisa el parte de nieve el día anterior.",
    );
  } else if (pack.interest === "deporte_competencia") {
    tips.push(
      "Confirma horarios de competencia y acreditaciones si vas como staff o familia.",
      "Descansa cerca del venue: el día es largo.",
    );
  }
  return tips;
}

function news(pack: PackCore): string[] {
  const items = [
    `${pack.eventTitle} se realiza en ${pack.venueName} (${pack.eventDates}).`,
    "Si aún no tienes alojamiento, reserva pronto: las fechas de evento se llenan cerca del venue.",
  ];
  if (pack.interest === "concierto") {
    items.push(
      "Revisa la app o el mail del ticket por cambios de puerta o horarios de apertura.",
    );
  }
  if (pack.interest === "partido_futbol") {
    items.push(
      "Sigue a tu club y a la ANFP por posibles cambios de horario o sede.",
    );
  }
  if (pack.interest === "nieve") {
    items.push(
      "Condiciones de nieve cambian rápido: confirma centros y caminos el mismo día.",
    );
  }
  items.push(
    "Tips locales: metro + barrio seguro + departamento full equipado para llegar y descansar.",
  );
  return items;
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
  const climate = monthClimate(pack.eventStartsOn);
  const kind = guideKind(pack.interest);
  const title = guideTitle(pack);
  const slug = pack.slug;
  const summary = eventSummary(pack);

  return {
    slug,
    guideTitle: title,
    guideKind: kind,
    productLabel: "Travel Brief",
    productLabelEs: "Guía del evento",
    eventSummary: summary,
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
    seoTitle: `${title} · ${pack.venueName}`,
    seoDescription: `${title}. Fechas, mapa, tips, clima, transporte, FAQ y alojamiento cerca de ${pack.venueName} en Santiago.`,
    properties: pack.properties,
    interest: pack.interest,
    interestLabel: pack.interestLabel,
    shareText: `${title} — ${pack.eventDates} en ${pack.venueName}. Lo esencial para tu visita:`,
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
