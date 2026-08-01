import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  getPoi,
  getPropertyByCode,
  properties as allProperties,
} from "@/lib/data/seed";
import { buildAdPublishPlan } from "./ad-brief";
import { attachTravelBriefAndMicrosite } from "./travel-brief";
import type { CampaignAudience } from "./types";
import {
  sportCopyParts,
  sportLandingHeadline,
  sportLandingSubhead,
} from "./event-title";
import {
  distanceKm,
  osmEmbedUrl,
  osmLinkMulti,
  walkingMinutes,
} from "./geo";
import type {
  CampaignPack,
  CampaignPackProperty,
  DemandPeak,
  DemandSignal,
  SuggestedCampaign,
} from "./types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

function safeParseIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = parseISO(value);
  return isValid(d) ? d : null;
}

function formatRange(start: string, end: string): string {
  const a = safeParseIso(start);
  const b = safeParseIso(end) ?? a;
  if (!a) return start === end ? start : `${start} – ${end}`;
  if (!b || start === end || a.getTime() === b.getTime()) {
    return format(a, "d 'de' MMMM yyyy", { locale: es });
  }
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${format(a, "d", { locale: es })}–${format(b, "d 'de' MMMM yyyy", { locale: es })}`;
  }
  return `${format(a, "d MMM", { locale: es })} – ${format(b, "d MMM yyyy", { locale: es })}`;
}

function withUtm(url: string, campaign: string, content: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "demand_engine");
  u.searchParams.set("utm_medium", "landing");
  u.searchParams.set("utm_campaign", campaign.slice(0, 80));
  u.searchParams.set("utm_content", content.slice(0, 40));
  return u.toString();
}

function resolveAnchorPoi(peak: DemandPeak, intentionSlug: string) {
  const fromSignals = peak.signals.flatMap((s) => s.poiIds);

  if (peak.interest === "nieve" || intentionSlug.includes("nieve")) {
    const hub =
      getPoi("poi-santiago-hub") ??
      getPoi(
        fromSignals.find((id) => id === "poi-italia" || id === "poi-lastarria") ??
          "poi-italia",
      );
    if (hub) return hub;
  }

  if (
    peak.interest === "vacaciones_familias" ||
    intentionSlug.includes("fantasilandia")
  ) {
    const poi =
      getPoi(
        fromSignals.find((id) => id === "poi-fantasilandia") ??
          "poi-fantasilandia",
      ) ?? getPoi("poi-lastarria");
    if (poi) return poi;
  }

  // Orden por interés: no mezclar Estadio (fútbol) con Movistar (conciertos)
  const preferredOrder =
    peak.interest === "concierto"
      ? ["poi-movistar", "poi-ohiggins", "poi-fantasilandia", "poi-estadio"]
      : peak.interest === "partido_futbol"
        ? ["poi-estadio", "poi-movistar", "poi-italia"]
        : peak.interest === "deporte_competencia"
          ? ["poi-estadio", "poi-movistar", "poi-italia"]
          : [
              "poi-movistar",
              "poi-estadio",
              "poi-fantasilandia",
              "poi-ohiggins",
              "poi-italia",
              "poi-lastarria",
            ];

  for (const id of preferredOrder) {
    if (fromSignals.includes(id) || intentionSlug.includes(id.replace("poi-", ""))) {
      const poi = getPoi(id);
      if (poi) return poi;
    }
  }

  const fromAny = fromSignals
    .map((id) => getPoi(id))
    .find((p): p is NonNullable<typeof p> => Boolean(p));
  if (fromAny) return fromAny;

  if (intentionSlug.includes("estadio") || peak.interest === "partido_futbol") {
    const p = getPoi("poi-estadio");
    if (p) return p;
  }
  if (
    intentionSlug.includes("movistar") ||
    peak.interest === "concierto"
  ) {
    const p = getPoi("poi-movistar");
    if (p) return p;
  }

  const fallback =
    peak.interest === "concierto"
      ? (getPoi("poi-movistar") ?? getPoi("poi-lastarria"))
      : peak.interest === "partido_futbol"
        ? (getPoi("poi-estadio") ?? getPoi("poi-lastarria"))
        : (getPoi("poi-lastarria") ?? getPoi("poi-estadio"));
  if (!fallback) {
    throw new Error("No hay POIs en seed para anclar la campaña.");
  }
  return fallback;
}

function pickProperties(
  codes: string[],
  poiLat: number,
  poiLng: number,
  interest?: SuggestedCampaign["interest"],
): CampaignPackProperty[] {
  const isSnow = interest === "nieve";
  const preferred = new Set(
    codes
      .map((c) => getPropertyByCode(c)?.code)
      .filter((c): c is string => Boolean(c)),
  );
  const pool = allProperties.filter((p) => p.isReal);

  const ranked = pool
    .map((p) => {
      const km = distanceKm(p.lat, p.lng, poiLat, poiLng);
      const mins = walkingMinutes(km);
      const boost = preferred.has(p.code) ? (isSnow ? -1.2 : -0.15) : 0;
      return { p, km, mins, sortKey: km + boost };
    })
    .sort((a, b) => a.sortKey - b.sortKey || a.km - b.km);

  return ranked.map(({ p, km, mins }) => {
    const metro =
      p.metroStations.length > 0
        ? `Metro ${p.metroStations.slice(0, 2).join(" / ")}`
        : null;
    const pitchParts = isSnow
      ? [
          `Base en ${p.neighborhood}: duermes en Santiago y sales a la cordillera`,
          metro,
          `${p.neighborhood}: barrio residencial, metro cerca y bien conectado`,
          p.isSuperhost ? "Anfitrión Superhost en Airbnb" : "Reserva directa en Airbnb",
        ]
      : [
          `${mins} min a pie del punto del evento`,
          metro,
          `${p.neighborhood}: barrio residencial y bien conectado en Santiago`,
          p.isSuperhost ? "Anfitrión Superhost en Airbnb" : "Reserva directa en Airbnb",
        ];
    const pitch = pitchParts.filter(Boolean) as string[];

    return {
      code: p.code,
      name: p.name,
      slug: p.slug,
      photo: p.photos[0] ?? "",
      photos: p.photos,
      capacity: p.capacity,
      bedrooms: p.bedrooms,
      neighborhood: p.neighborhood,
      buildingName: p.buildingName,
      address: p.address,
      amenities: [
        "Cama matrimonial",
        "Sofá-cama",
        ...p.amenities.filter(
          (a) =>
            !/cama matrimonial|sof[aá]-?cama|^2 camas$/i.test(a),
        ),
      ].slice(0, 6),
      distanceKm: Math.round(km * 100) / 100,
      walkingMinutes: mins,
      airbnbUrl: p.airbnbUrl,
      lat: p.lat,
      lng: p.lng,
      metroStations: p.metroStations,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isSuperhost: p.isSuperhost,
      pitch: pitch.join(" · "),
    };
  });
}

function buildTrustPoints(input: {
  venueName: string;
  nearestMins: number;
  properties: CampaignPackProperty[];
  interest: SuggestedCampaign["interest"];
}): string[] {
  const metros = [
    ...new Set(input.properties.flatMap((p) => p.metroStations)),
  ];
  const neighborhoods = [
    ...new Set(input.properties.map((p) => p.neighborhood)),
  ];
  const barrio =
    neighborhoods.find((n) => /ñuñoa|italia|centro/i.test(n)) ??
    neighborhoods[0] ??
    "Santiago";

  const points = [
    input.interest === "nieve"
      ? "Base en Santiago: llegas, descansas y sales a la cordillera sin perder el día"
      : `A ~${input.nearestMins} min a pie de ${input.venueName}: llegas, te duchas y sales al evento`,
    metros.length > 0
      ? `Metro cerca (${metros.slice(0, 3).join(", ")}): te mueves por Santiago sin auto`
      : "Bien conectado al transporte de Santiago",
    `${barrio}: barrio residencial, seguro y cómodo para dormir después del evento`,
    "Arriendas directo en Airbnb: pago protegido, mensajería y reseñas reales",
    "Check-in autónomo y departamento completo: tu espacio, sin hotel genérico",
  ];
  return points;
}

function buildCopy(input: {
  playbook: SuggestedCampaign["playbook"];
  interest: SuggestedCampaign["interest"];
  eventTitle: string;
  eventDates: string;
  venueName: string;
  nearestMins: number;
  stayHint: string;
  audience: CampaignAudience;
  leadSignal?: DemandSignal;
}): Pick<
  CampaignPack,
  | "headline"
  | "subhead"
  | "mailingSubject"
  | "mailingBody"
  | "adHeadline"
  | "adPrimaryText"
> {
  const {
    playbook,
    interest,
    eventTitle,
    eventDates,
    venueName,
    nearestMins,
    stayHint,
    audience,
    leadSignal,
  } = input;

  const geo = audience.geoTargets[0];
  const fromLabel = geo?.label;
  const placeHook =
    "Metro cerca, barrio seguro en Santiago y reserva protegida en Airbnb";

  if (interest === "nieve") {
    return {
      headline: `Nieve: duerme en Santiago y sal a la cordillera`,
      subhead: `${eventDates}. Depto completo como base: bien ubicado, metro a mano y arriendo seguro en Airbnb. ${stayHint}`,
      mailingSubject: fromLabel
        ? `[Santiago] Desde ${fromLabel}: depto hub para ski · ${eventDates}`
        : `[Santiago] Depto hub para temporada de nieve · ${eventDates}`,
      mailingBody: [
        `Hola,`,
        ``,
        `Si vienes por la nieve (${eventDates}), tienes departamentos en Santiago como base: llegas, descansas y sales a la cordillera.`,
        `Barrio seguro, metro cerca y reserva directa en Airbnb (pago protegido).`,
        audience.stayOffer,
        ``,
        `Revisa disponibilidad:`,
        `{{LANDING_URL}}`,
      ].join("\n"),
      adHeadline: fromLabel
        ? `Ski Chile · hub Santiago`
        : `Temporada de nieve · Santiago`,
      adPrimaryText: `Depto en Santiago para tu viaje a la nieve. ${placeHook}. ${eventDates}.`,
    };
  }

  if (interest === "deporte_competencia") {
    const { sport, detail, displayTitle } = sportCopyParts(leadSignal);
    const sportName = sport && sport !== "Deporte" ? sport : "Competencia";
    const headline = sportLandingHeadline({
      signal: leadSignal,
      venueName,
      nearestMins,
    });
    const subhead = sportLandingSubhead({
      signal: leadSignal,
      eventDates,
      venueName,
      nearestMins,
      placeHook,
      stayHint,
    });
    return {
      headline,
      subhead,
      mailingSubject: `[Santiago] ${sportName}: depto cerca de ${venueName} · ${eventDates}`,
      mailingBody: [
        `Hola,`,
        ``,
        `Por ${displayTitle} (${eventDates}) tenemos departamentos a ~${nearestMins} min de ${venueName}.`,
        `Ideal si vienen a competir o acompañar: barrio seguro, metro cerca y reserva directa en Airbnb.`,
        audience.stayOffer,
        ``,
        `{{LANDING_URL}}`,
      ].join("\n"),
      adHeadline: `${sportName} · a ${nearestMins} min de ${venueName}`,
      adPrimaryText: `${detail} · ${eventDates} · metro + barrio seguro · Airbnb`,
    };
  }

  const fromPhrase = fromLabel
    ? `Ideal si vienen desde ${fromLabel}${geo.area && geo.type !== "country" ? ` (${geo.area})` : ""}`
    : "Ideal si vienen desde regiones";

  const headline = `${eventTitle}: duerme a ${nearestMins} min de ${venueName}`;
  const subhead = `${eventDates}. En Santiago, cerca del metro, en barrio seguro. Reserva directo en Airbnb. ${stayHint}`;

  if (playbook === "mailing_first" || interest === "partido_futbol") {
    return {
      headline,
      subhead,
      mailingSubject: fromLabel
        ? `[Santiago] Desde ${fromLabel}: depto cerca de ${venueName} · ${eventDates}`
        : `[Santiago] Depto cerca de ${venueName} · ${eventDates}`,
      mailingBody: [
        `Hola,`,
        ``,
        `Por ${eventTitle} (${eventDates}) tenemos departamentos a ~${nearestMins} min de ${venueName}.`,
        ``,
        `${fromPhrase}: llegas a Santiago, duermes en un barrio seguro (Ñuñoa / zona metro) y caminas al recinto.`,
        `La reserva es directa en Airbnb: pago protegido y anfitrión verificado.`,
        audience.stayOffer,
        ``,
        `Elige tu depto aquí:`,
        `{{LANDING_URL}}`,
        ``,
        `Cualquier duda por este mismo correo.`,
      ].join("\n"),
      adHeadline: fromLabel
        ? `Desde ${fromLabel} → depto en Santiago`
        : `A ${nearestMins} min de ${venueName}`,
      adPrimaryText: `${eventTitle} · metro cerca · barrio seguro · reserva en Airbnb · ${eventDates}`,
    };
  }

  if (playbook === "ads_heavy" || interest === "concierto") {
    return {
      headline: `${eventTitle}: quédate cerca y olvídate del traslado`,
      subhead: `A ~${nearestMins} min de ${venueName}. ${placeHook}. ${eventDates}.`,
      mailingSubject: `${eventTitle}: deptos cerca del venue en Santiago`,
      mailingBody: [
        `Para ${eventTitle} (${eventDates}) armamos opciones a poca distancia de ${venueName}.`,
        `Metro cerca, barrio seguro y reserva protegida en Airbnb.`,
        ``,
        `{{LANDING_URL}}`,
      ].join("\n"),
      adHeadline: `${eventTitle} · a ${nearestMins} min`,
      adPrimaryText: `Depto cerca de ${venueName}. Metro + barrio seguro + Airbnb. ${eventDates}.`,
    };
  }

  return {
    headline,
    subhead,
    mailingSubject: fromLabel
      ? `${eventTitle}: ven desde ${fromLabel} y quédate cerca de ${venueName}`
      : `${eventTitle} en Santiago · depto cerca de ${venueName}`,
    mailingBody: [
      `Hola,`,
      ``,
      `${eventTitle} se viene (${eventDates}).`,
      `Tenemos deptos desde ~${nearestMins} min de ${venueName}, en Santiago: metro cerca, barrio seguro y arriendo en Airbnb.`,
      fromLabel ? `Pensado para quienes viajan desde ${fromLabel}.` : "",
      ``,
      `{{LANDING_URL}}`,
    ]
      .filter((line) => line !== undefined)
      .join("\n"),
    adHeadline: `${venueName} · ${nearestMins} min`,
    adPrimaryText: `${eventTitle} · ${eventDates} · metro cerca · Airbnb seguro`,
  };
}

export function buildCampaignPack(
  campaign: SuggestedCampaign,
  peak: DemandPeak,
): CampaignPack {
  const lead = peak.signals[0];
  const eventTitle =
    peak.interest === "nieve"
      ? "Temporada de nieve — hub Santiago"
      : (lead?.title ?? peak.title);
  const rawStart =
    peak.interest === "nieve" || peak.interest === "turismo_general"
      ? peak.rangeStart
      : (lead?.startsOn ?? peak.rangeStart);
  const rawEnd =
    peak.interest === "nieve" || peak.interest === "turismo_general"
      ? peak.rangeEnd
      : (lead?.endsOn ?? peak.rangeEnd);
  const eventStart = safeParseIso(rawStart)
    ? rawStart > peak.rangeStart
      ? rawStart
      : peak.rangeStart
    : peak.rangeStart;
  const eventEnd = safeParseIso(rawEnd)
    ? rawEnd < peak.rangeEnd
      ? rawEnd
      : peak.rangeEnd
    : peak.rangeEnd;
  const eventDates = formatRange(eventStart, eventEnd);
  const poi = resolveAnchorPoi(peak, campaign.intentionSlug);
  const props = pickProperties(
    campaign.propertyCodes,
    poi.lat,
    poi.lng,
    campaign.interest,
  ).map(
    (p) => ({
      ...p,
      airbnbUrl: withUtm(p.airbnbUrl, slugify(eventTitle), p.slug),
    }),
  );
  const nearestMins = props[0]?.walkingMinutes ?? 15;
  const nightsHint =
    peak.interest === "nieve"
      ? "Llega a Santiago y usa el depto como base para la cordillera."
      : eventStart !== eventEnd
        ? "Llega un día antes y quédate hasta el cierre."
        : "Bloquea la noche del evento con margen de llegada.";

  const copy = buildCopy({
    playbook: campaign.playbook,
    interest: campaign.interest,
    eventTitle,
    eventDates,
    venueName: poi.name,
    nearestMins,
    stayHint: nightsHint,
    audience: campaign.audience,
    leadSignal: lead,
  });
  const trustPoints = buildTrustPoints({
    venueName: poi.name,
    nearestMins,
    properties: props,
    interest: campaign.interest,
  });

  // Fecha estable en el slug: mes para flujos largos (nieve), día del evento para el resto.
  // Evita que /c/... se rompa al regenerar packs con otra ventana (hoy vs mes de campañas).
  const slugDate =
    campaign.interest === "nieve" || campaign.interest === "turismo_general"
      ? eventStart.slice(0, 7)
      : eventStart;
  const slug = slugify(
    `${campaign.interest}-${campaign.intentionSlug}-${slugDate}-${eventTitle}`,
  );
  const utmCampaign = slugify(`${campaign.interest}-${eventTitle}`).slice(0, 60);

  const base = {
    slug,
    campaignId: campaign.id,
    peakId: peak.id,
    playbook: campaign.playbook,
    channels: campaign.channels,
    eventTitle,
    eventDates,
    eventStartsOn: eventStart,
    eventEndsOn: eventEnd,
    venueName: poi.name,
    venuePoiId: poi.id,
    venueLat: poi.lat,
    venueLng: poi.lng,
    mapEmbedUrl: osmEmbedUrl(poi.lat, poi.lng),
    mapLinkUrl: osmLinkMulti([
      { lat: poi.lat, lng: poi.lng },
      ...props.map((p) => ({ lat: p.lat, lng: p.lng })),
    ]),
    ...copy,
    trustPoints,
    properties: props,
    windowStart: campaign.windowStart,
    windowEnd: campaign.windowEnd,
    dailyBudgetClp: campaign.dailyBudgetClp,
    priority: campaign.priority,
    utmCampaign,
    drivers: peak.drivers.slice(0, 4),
    score: peak.score,
    reason: campaign.reason,
    audience: campaign.audience,
    interest: campaign.interest,
    interestLabel: campaign.interestLabel,
    estimatedAttendance: campaign.estimatedAttendance,
    estimatedOvernight: campaign.estimatedOvernight,
    demandDimension: campaign.demandDimension,
    attendanceMethod: peak.signals[0]?.attendanceMethod,
  };

  const withBrief = attachTravelBriefAndMicrosite(base);
  return {
    ...withBrief,
    publishPlan: buildAdPublishPlan(base),
  };
}

export function buildCampaignPacks(
  campaigns: SuggestedCampaign[],
  peaks: DemandPeak[],
): CampaignPack[] {
  const byPeak = new Map(peaks.map((p) => [p.id, p]));
  return campaigns
    .map((c) => {
      const peak = byPeak.get(c.peakId);
      if (!peak) return null;
      return buildCampaignPack(c, peak);
    })
    .filter((p): p is CampaignPack => Boolean(p));
}

/** Normaliza slugs viejos/nuevos: ignora fechas ISO y separadores repetidos. */
function normalizePackSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/\d{4}-\d{2}-\d{2}/g, "")
    .replace(/\d{4}-\d{2}/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findPackBySlug(
  packs: CampaignPack[],
  slug: string,
): CampaignPack | undefined {
  const exact = packs.find((p) => p.slug === slug);
  if (exact) return exact;

  const target = normalizePackSlug(slug);
  if (!target) return undefined;

  const fuzzy = packs.filter((p) => normalizePackSlug(p.slug) === target);
  if (fuzzy.length === 1) return fuzzy[0];
  if (fuzzy.length > 1) {
    // Preferir el pack cuya fecha de evento aparece en el slug pedido
    const dated = slug.match(/(\d{4}-\d{2}(?:-\d{2})?)/)?.[1];
    if (dated) {
      const hit = fuzzy.find(
        (p) =>
          p.slug.includes(dated) ||
          p.eventStartsOn.startsWith(dated) ||
          p.windowStart.startsWith(dated),
      );
      if (hit) return hit;
    }
    return fuzzy[0];
  }
  return undefined;
}
