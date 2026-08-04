/**
 * Plan listo para publicar: audiencia, creatividades, fechas, budget y resultados esperados.
 * Sin conexión real a Meta/Google todavía — el usuario decide; la API viene después.
 */
import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  organizationsForCampaignInterest,
  outreachOrganizations,
} from "@/lib/data/outreach";
import { localizedAdCreatives } from "@/lib/i18n/landing";
import { LOCALES } from "@/lib/i18n/locale";
import type {
  AdCreativeVariant,
  AdPlatform,
  AdPublishPlan,
  CampaignPack,
  CampaignPlaybook,
  DemandDimension,
  ExpectedAdResults,
  MailingTargetSuggestion,
} from "./types";

function flightDays(start: string, end: string): number {
  try {
    const d = differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;
    return Math.max(1, Math.min(45, d));
  } catch {
    return 7;
  }
}

function ctrRange(playbook: CampaignPlaybook): [number, number] {
  if (playbook === "mailing_first") return [0.008, 0.018];
  if (playbook === "ads_heavy") return [0.01, 0.025];
  return [0.009, 0.02];
}

function cpmClp(playbook: CampaignPlaybook): number {
  if (playbook === "ads_heavy") return 3500;
  if (playbook === "mailing_first") return 2800;
  return 3200;
}

function confidenceFor(
  dimension: DemandDimension,
  geoCount: number,
): ExpectedAdResults["confidence"] {
  if (dimension === "mega" || dimension === "grande") return "media";
  if (geoCount > 0) return "media";
  return "baja";
}

type PackForPlan = Omit<
  CampaignPack,
  "publishPlan" | "travelBrief" | "microsite"
>;

function buildExpected(pack: PackForPlan, days: number): ExpectedAdResults {
  const daily = pack.dailyBudgetClp;
  const total = daily * days;
  const cpm = cpmClp(pack.playbook);
  const [ctrLo, ctrHi] = ctrRange(pack.playbook);

  const impMid = (total / cpm) * 1000;
  const impressionsLow = Math.round(impMid * 0.7);
  const impressionsHigh = Math.round(impMid * 1.35);

  const clicksLow = Math.max(1, Math.round(impressionsLow * ctrLo));
  const clicksHigh = Math.max(2, Math.round(impressionsHigh * ctrHi));

  const landingVisitsLow = Math.round(clicksLow * 0.7);
  const landingVisitsHigh = Math.round(clicksHigh * 0.9);

  const airbnbActionsLow = Math.max(0, Math.round(landingVisitsLow * 0.08));
  const airbnbActionsHigh = Math.max(1, Math.round(landingVisitsHigh * 0.18));

  const overnightShare =
    pack.demandDimension === "mega"
      ? 0.00008
      : pack.demandDimension === "grande"
        ? 0.00012
        : pack.demandDimension === "media"
          ? 0.0002
          : 0.00035;
  const fromDemand = Math.round(pack.estimatedOvernight * overnightShare);
  const nightsLow = Math.max(0, Math.min(airbnbActionsLow, fromDemand || 0));
  const nightsHigh = Math.max(
    nightsLow + 1,
    Math.round(airbnbActionsHigh * 0.55) + fromDemand,
  );

  return {
    disclaimer:
      "Estimación proxy para decidir, no es promesa de reservas. Depende de creatividades, puja y competencia.",
    days,
    totalBudgetClp: total,
    impressionsLow,
    impressionsHigh,
    clicksLow,
    clicksHigh,
    landingVisitsLow,
    landingVisitsHigh,
    airbnbActionsLow,
    airbnbActionsHigh,
    nightsLow,
    nightsHigh,
    confidence: confidenceFor(
      pack.demandDimension,
      pack.audience.geoTargets.length,
    ),
  };
}

function mailingTargetsFor(pack: PackForPlan): MailingTargetSuggestion[] {
  const byInterest = organizationsForCampaignInterest(pack.interest);
  const sportHint = pack.eventTitle.toLowerCase();
  return (byInterest.length ? byInterest : outreachOrganizations)
    .filter((o) => o.mailingReady && o.emails.length > 0)
    .map((o) => {
      const seg = (o.segment ?? o.sport ?? "").toLowerCase();
      let score = 1;
      if (/hockey/.test(sportHint) && /hockey/.test(seg)) score += 5;
      if (/atletismo/.test(sportHint) && /atletismo/.test(seg)) score += 5;
      if (/voleibol|volley/.test(sportHint) && /voleibol|volley/.test(seg))
        score += 5;
      if (/tenis|tennis|davis/.test(sportHint) && /tenis|tennis/.test(seg))
        score += 5;
      if (/fútbol|futbol/.test(sportHint) && /futbol|fútbol/.test(seg))
        score += 5;
      if (/nieve|ski/.test(sportHint) && /ski|nieve/.test(seg)) score += 5;
      if (o.orgType === "federacion") score += 2;
      if (o.orgType === "asociacion") score += 1;
      return { o, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ o }) => ({
      id: o.id,
      name: o.name,
      orgType: o.orgType,
      emails: o.emails.slice(0, 2),
      segment: o.segment ?? o.sport ?? null,
    }));
}

function creativesFor(pack: PackForPlan): AdCreativeVariant[] {
  // ES / EN / PT — eliges en Meta/Google el idioma del anuncio
  return LOCALES.flatMap((locale) =>
    localizedAdCreatives(pack as CampaignPack, locale).map((c) => ({
      id: c.id,
      label: c.label,
      imageUrl: c.imageUrl,
      headline: c.headline,
      primaryText: c.primaryText,
      description: c.description,
      cta: c.cta,
    })),
  );
}

function preferredAdLocales(pack: PackForPlan): string[] {
  const blob = [
    pack.interest,
    ...pack.audience.segments,
    ...pack.audience.geoTargets.map((g) => `${g.label} ${g.area} ${g.origin ?? ""}`),
  ]
    .join(" ")
    .toLowerCase();
  const langs = new Set<string>(["español"]);
  if (/brasil|brazil|portugu/.test(blob) || pack.interest === "nieve") {
    langs.add("portugués");
  }
  if (/e\.?e\.?u\.?u|usa|united|ingl[eé]s|english|europa|uk|canada/.test(blob)) {
    langs.add("inglés");
  }
  // Turistas mixtos: siempre ofrecer los 3 en el brief
  langs.add("inglés");
  langs.add("portugués");
  return [...langs];
}

export function buildAdPublishPlan(pack: PackForPlan): AdPublishPlan {
  const days = flightDays(pack.windowStart, pack.windowEnd);
  const totalBudgetClp = pack.dailyBudgetClp * days;
  const geos = pack.audience.geoTargets;
  const creatives = creativesFor(pack);
  const mailingTargets = mailingTargetsFor(pack);
  const expected = buildExpected(pack, days);

  const platforms: AdPlatform[] = ["meta", "google"];

  const geoLines = geos.map(
    (g) => `${g.label} (${g.area})${g.origin ? ` · ${g.origin}` : ""}`,
  );
  const interestLines = [
    ...new Set([pack.interestLabel, ...pack.audience.segments.slice(0, 4)]),
  ];

  const adLangs = preferredAdLocales(pack);

  const metaTargetingNotes = [
    geos.length
      ? `Geo: ${geos.map((g) => g.label).join(", ")} + radio ciudades`
      : "Geo: Chile (ampliar a regiones si el mailing no alcanza)",
    `Intereses / comportamientos: ${pack.interestLabel.toLowerCase()}, viajes, alojamiento`,
    pack.playbook === "mailing_first"
      ? "Presupuesto ads bajo; prioriza mailing a clubes/federaciones"
      : "Advantage+ o intereses estrechos + lookalike cuando tengas tráfico",
    `Edad 22–55 · idiomas: ${adLangs.join(", ")}`,
    "Landing autotraduce por idioma del navegador (?lang=es|en|pt). En ads usa la creatividad del mismo idioma y URL con ?lang=",
  ];

  const googleTargetingNotes = [
    pack.playbook === "ads_heavy" || pack.interest === "concierto"
      ? "Search: nombre del evento + “alojamiento Santiago” / “apartment Santiago” / “apartamento Santiago”"
      : "Search: deporte + “Santiago alojamiento” / “Santiago apartment” / sede del evento",
    "PMax o Display con creatividades del pack (foto depto) en ES/EN/PT",
    geos[0]
      ? `Ubicación: ${geos[0].label} (+ exclusiones Santiago si el público es visitante)`
      : "Ubicación: Chile priorizando orígenes visitantes",
    `Idioma de anuncio: ${adLangs.join(", ")} · final URL con ?lang= coincidente`,
  ];

  const checklist: AdPublishPlan["checklist"] = [
    {
      id: "landing",
      label: "Landing revisada y CTA a Airbnb OK",
      done: Boolean(pack.slug && pack.properties.length),
    },
    {
      id: "audience",
      label: "Audiencia geo / segmentos definidos",
      done: geos.length > 0 || pack.audience.segments.length > 0,
    },
    {
      id: "creative",
      label: "Al menos 1 creatividad con foto real",
      done: creatives.length > 0,
    },
    {
      id: "budget",
      label: "Fechas y presupuesto diario definidos",
      done: pack.dailyBudgetClp > 0 && days > 0,
    },
    {
      id: "mailing",
      label:
        pack.playbook === "ads_heavy"
          ? "Mailing opcional (ads heavy)"
          : "Contactos de mailing sugeridos listos",
      done: pack.playbook === "ads_heavy" || mailingTargets.length > 0,
    },
  ];

  const allDone = checklist.every((c) => c.done);

  return {
    status: allDone ? "ready" : "draft",
    platforms,
    playbook: pack.playbook,
    flightStart: pack.windowStart,
    flightEnd: pack.windowEnd,
    dailyBudgetClp: pack.dailyBudgetClp,
    totalBudgetClp,
    objective: "Tráfico a landing → reserva Airbnb",
    audienceSummary: pack.audience.rationale,
    geoLines,
    interestLines,
    metaTargetingNotes,
    googleTargetingNotes,
    creatives,
    expected,
    mailingTargets,
    checklist,
    publishBlockedReason:
      "La publicación real a Meta/Google se conectará cuando tengas cuenta de anunciante. Por ahora marca el pack como listo y copia el brief.",
  };
}

export function formatAdBriefText(
  pack: CampaignPack,
  plan: AdPublishPlan,
  landingUrl: string,
): string {
  const creatives = plan.creatives
    .map(
      (c, i) =>
        `Creatividad ${i + 1} (${c.label})\n- Headline: ${c.headline}\n- Texto: ${c.primaryText}\n- CTA: ${c.cta}\n- Imagen: ${c.imageUrl}`,
    )
    .join("\n\n");

  return [
    `BRIEF LISTO PARA PUBLICAR — ${pack.eventTitle}`,
    `Interés: ${pack.interestLabel}`,
    `Landing: ${landingUrl} (auto ES/EN/PT; ads → ?lang=es|en|pt)`,
    ``,
    `OBJETIVO: ${plan.objective}`,
    `FECHAS PAUTA: ${plan.flightStart} → ${plan.flightEnd} (${plan.expected.days} días)`,
    `BUDGET: ${plan.dailyBudgetClp} CLP/día · total ~${plan.totalBudgetClp} CLP`,
    ``,
    `AUDIENCIA`,
    plan.audienceSummary,
    plan.geoLines.length
      ? `Geo: ${plan.geoLines.join(" | ")}`
      : "Geo: (ver notas)",
    `Segmentos: ${plan.interestLines.join(", ")}`,
    ``,
    `META`,
    ...plan.metaTargetingNotes.map((n) => `- ${n}`),
    ``,
    `GOOGLE`,
    ...plan.googleTargetingNotes.map((n) => `- ${n}`),
    ``,
    `COPY ADS`,
    `Headline: ${pack.adHeadline}`,
    `Primary: ${pack.adPrimaryText}`,
    ``,
    creatives,
    ``,
    `RESULTADOS ESPERADOS (proxy, confianza ${plan.expected.confidence})`,
    `Impresiones: ${plan.expected.impressionsLow}–${plan.expected.impressionsHigh}`,
    `Clics: ${plan.expected.clicksLow}–${plan.expected.clicksHigh}`,
    `Visitas landing: ${plan.expected.landingVisitsLow}–${plan.expected.landingVisitsHigh}`,
    `Acciones Airbnb: ${plan.expected.airbnbActionsLow}–${plan.expected.airbnbActionsHigh}`,
    `Noches pot.: ${plan.expected.nightsLow}–${plan.expected.nightsHigh}`,
    plan.expected.disclaimer,
    ``,
    plan.publishBlockedReason,
  ].join("\n");
}
