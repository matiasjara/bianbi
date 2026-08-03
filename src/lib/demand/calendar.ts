import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
import {
  aggregatePeakAttendance,
  applyAttendanceToSignal,
  formatAttendanceShort,
  formatPeople,
} from "./attendance";
import { deriveAudienceFromSignals } from "./audience";
import {
  groupedHockeyTitle,
  isHockeySignal,
  spanSignalDates,
} from "./hockey-group";
import { formatDateCL } from "./dates";
import {
  campaignGroupKey,
  classifyInterest,
  clipSignalToRange,
  intentionSlugForInterest,
  interestLabel,
} from "./interest";
import { polishEventTitle } from "./event-title";
import {
  aggregateEventPotentials,
  scoreEventPotential,
} from "./potential";
import type {
  CampaignInterest,
  DayDemandPoint,
  DemandPeak,
  DemandSignal,
  SuggestedCampaign,
} from "./types";

function signalActiveOn(signal: DemandSignal, date: string): boolean {
  return date >= signal.startsOn && date <= signal.endsOn;
}

function eventWeight(s: DemandSignal): number {
  if (typeof s.potentialScore === "number") return s.potentialScore;
  if (s.kind === "event" || s.kind === "sport") {
    return scoreEventPotential(s.title, s.description).score;
  }
  // feriados / estacionalidad: intensity 1–10 → ~10–100
  return Math.min(100, s.intensity * 10);
}

/** Enriquece potencial + estimación de gente (asistentes / pernocta). */
export function enrichSignalPotentials(
  signals: DemandSignal[],
): DemandSignal[] {
  return signals.map((s) => {
    const polishedTitle = polishEventTitle(s);
    let next: DemandSignal =
      polishedTitle !== s.title ? { ...s, title: polishedTitle } : s;
    if (
      (next.kind === "event" || next.kind === "sport") &&
      (next.potentialScore == null || !next.potentialTier)
    ) {
      const p = scoreEventPotential(next.title, next.description);
      next = {
        ...next,
        intensity: p.intensity,
        potentialScore: p.score,
        potentialTier: p.tier,
        potentialFactors: p.factors,
      };
    }
    return applyAttendanceToSignal(next);
  });
}

export function buildDemandTimeline(
  signals: DemandSignal[],
  rangeStart: string,
  rangeEnd: string,
): DayDemandPoint[] {
  const enriched = enrichSignalPotentials(signals);
  const days = eachDayOfInterval({
    start: parseISO(rangeStart),
    end: parseISO(rangeEnd),
  });

  return days.map((day) => {
    const date = format(day, "yyyy-MM-dd");
    const weekday = getDay(day);
    const active = enriched.filter((s) => signalActiveOn(s, date));

    const eventWeights = active
      .filter((s) => s.kind === "event" || s.kind === "sport")
      .map((s) => eventWeight(s));
    const holidayWeights = active
      .filter((s) => s.kind === "holiday")
      .map((s) => eventWeight(s));
    const seasonWeights = active
      .filter(
        (s) =>
          s.kind === "seasonality" ||
          s.kind === "tourism_flow" ||
          s.kind === "school_break",
      )
      .map((s) => eventWeight(s));

    // Eventos: NO sumar cantidad — dominante + aportes menores
    const eventScore = aggregateEventPotentials(eventWeights);
    const holidayScore = aggregateEventPotentials(holidayWeights);
    // Estacionalidad: promedio ponderado suave (no explotar por muchas reglas)
    const seasonalityScore =
      seasonWeights.length === 0
        ? 0
        : Math.min(
            70,
            Math.round(
              Math.max(...seasonWeights) * 0.75 +
                seasonWeights.reduce((a, b) => a + b, 0) /
                  seasonWeights.length *
                  0.2,
            ),
          );

    const weekendBoost =
      weekday === 5 || weekday === 6 || weekday === 0 ? 1.08 : 1;

    // Eventos mandan; feriado/estacionalidad suman con techo
    const score = Math.min(
      100,
      Math.round(
        (eventScore * 0.7 +
          holidayScore * 0.15 +
          seasonalityScore * 0.15) *
          weekendBoost,
      ),
    );

    return {
      date,
      weekday,
      label: formatDateCL(date),
      score,
      eventScore,
      seasonalityScore,
      holidayScore,
      signals: active.sort(
        (a, b) => eventWeight(b) - eventWeight(a),
      ),
      isWeekend: weekday === 0 || weekday === 5 || weekday === 6,
    };
  });
}

export function detectWeekendPeaks(
  timeline: DayDemandPoint[],
  minScore = 32,
): DemandPeak[] {
  const byWeekend = new Map<string, DayDemandPoint[]>();

  for (const day of timeline) {
    const friday = startOfWeek(parseISO(day.date), { weekStartsOn: 5 });
    const key = format(friday, "yyyy-MM-dd");
    const bucket = byWeekend.get(key) ?? [];
    bucket.push(day);
    byWeekend.set(key, bucket);
  }

  const peaks: DemandPeak[] = [];

  for (const [anchor, days] of byWeekend) {
    const score = Math.max(...days.map((d) => d.score));
    if (score < minScore) continue;

    const signalMap = new Map<string, DemandSignal>();
    for (const d of days) {
      for (const s of d.signals) signalMap.set(s.id, s);
    }
    const signals = [...signalMap.values()].sort(
      (a, b) => eventWeight(b) - eventWeight(a),
    );
    // Peak de calendario (intensidad del fds). Las campañas usan
    // detectCampaignOpportunities, que no mezcla intereses.
    const lead = signals[0];
    const interest = lead ? classifyInterest(lead) : ("otro_evento" as const);
    const drivers = signals.slice(0, 4).map((s) => {
      const tier = s.potentialTier ?? s.demandDimension ?? "media";
      const pot = s.potentialScore ?? eventWeight(s);
      const crowd =
        s.estimatedAttendance != null && s.estimatedOvernight != null
          ? ` · ${formatAttendanceShort(s.estimatedAttendance, s.estimatedOvernight)}`
          : "";
      return `${s.title} (${tier} · ${pot}${crowd})`;
    });

    const propertyCodes = [
      ...new Set(signals.flatMap((s) => s.propertyCodesPreferred ?? [])),
    ];

    const rangeStart = days[0].date;
    const rangeEnd = days[days.length - 1].date;
    const crowd = aggregatePeakAttendance(signals);

    peaks.push({
      id: `peak-${anchor}`,
      anchorDate: anchor,
      rangeStart,
      rangeEnd,
      score,
      title:
        lead != null
          ? `FDS ${formatDateCL(anchor)} — ${lead.title}`
          : `FDS ${formatDateCL(anchor)}`,
      drivers,
      signals,
      propertyCodes,
      interest,
      interestLabel: interestLabel(interest),
      estimatedAttendance: crowd.attendees,
      estimatedOvernight: crowd.overnight,
      demandDimension: crowd.dimension,
    });
  }

  return peaks.sort(
    (a, b) =>
      b.estimatedOvernight - a.estimatedOvernight ||
      b.score - a.score ||
      a.anchorDate.localeCompare(b.anchorDate),
  );
}

/**
 * Oportunidades de campaña por interés puro.
 * Un partido, un concierto, la nieve o una competencia = packs distintos.
 * Nunca mezcla "nieve + fútbol" en la misma campaña.
 */
export function detectCampaignOpportunities(
  signals: DemandSignal[],
  rangeStart: string,
  rangeEnd: string,
  minScore = 28,
): DemandPeak[] {
  const enriched = enrichSignalPotentials(signals);
  const overlapping = enriched.filter((s) => {
    return clipSignalToRange(s, rangeStart, rangeEnd) != null;
  });

  const groups = new Map<string, DemandSignal[]>();
  for (const s of overlapping) {
    const key = campaignGroupKey(s, rangeStart, rangeEnd);
    const bucket = groups.get(key) ?? [];
    bucket.push(s);
    groups.set(key, bucket);
  }

  const peaks: DemandPeak[] = [];

  for (const [groupKey, groupSignals] of groups) {
    const interest = classifyInterest(groupSignals[0]!);
    // Seguridad: si por bug entró otra clase, descartar
    const pure = groupSignals.filter((s) => classifyInterest(s) === interest);
    if (pure.length === 0) continue;

    const ranked = [...pure].sort((a, b) => eventWeight(b) - eventWeight(a));
    const lead = ranked[0]!;
    const score = eventWeight(lead);
    if (score < minScore && interest !== "nieve" && interest !== "feriado_puente") {
      // Flujos estacionales con intensity media igual importan
      if (score < 22) continue;
    }

    const clipped = clipSignalToRange(lead, rangeStart, rangeEnd);
    if (!clipped) continue;

    const span =
      ranked.length > 1
        ? spanSignalDates(ranked, rangeStart, rangeEnd)
        : null;

    // Para flujos largos (nieve), la ventana es el mes/rango pedido
    const opStart =
      interest === "nieve" || interest === "turismo_general"
        ? rangeStart
        : (span?.startsOn ?? clipped.startsOn);
    const opEnd =
      interest === "nieve" || interest === "turismo_general"
        ? rangeEnd
        : (span?.endsOn ?? clipped.endsOn);

    const crowd = aggregatePeakAttendance(ranked);
    const drivers =
      isHockeySignal(lead) && ranked.length > 1
        ? ranked.slice(0, 6).map((s) => {
            const pot = s.potentialScore ?? eventWeight(s);
            const cat = s.title
              .replace(/^Hockey c[eé]sped\s*[·\-]\s*/i, "")
              .trim();
            return `${cat} (${pot})`;
          })
        : ranked.slice(0, 3).map((s) => {
            const pot = s.potentialScore ?? eventWeight(s);
            const crowdLine =
              s.estimatedAttendance != null && s.estimatedOvernight != null
                ? ` · ${formatAttendanceShort(s.estimatedAttendance, s.estimatedOvernight)}`
                : "";
            return `${s.title} (${pot}${crowdLine})`;
          });

    const propertyCodes = [
      ...new Set(ranked.flatMap((s) => s.propertyCodesPreferred ?? [])),
    ];

    const label = interestLabel(interest);
    const title =
      interest === "nieve"
        ? `${label} — hub Santiago`
        : interest === "vacaciones_familias" || interest === "feriado_puente"
          ? lead.title
          : isHockeySignal(lead) && ranked.length > 1
            ? groupedHockeyTitle(ranked)
            : lead.title;

    peaks.push({
      id: `opp-${groupKey}`,
      anchorDate: opStart,
      rangeStart: opStart,
      rangeEnd: opEnd,
      score: Math.round(score),
      title,
      drivers,
      signals: ranked,
      propertyCodes,
      interest,
      interestLabel: label,
      estimatedAttendance: crowd.attendees,
      estimatedOvernight: crowd.overnight,
      demandDimension: crowd.dimension,
    });
  }

  return peaks.sort(
    (a, b) =>
      b.estimatedOvernight - a.estimatedOvernight ||
      b.score - a.score ||
      a.anchorDate.localeCompare(b.anchorDate),
  );
}

function channelsForInterest(
  interest: CampaignInterest,
  signals: DemandSignal[],
): SuggestedCampaign["channels"] {
  const top = Math.max(...signals.map(eventWeight), 0);
  const clasico = signals.some(
    (s) =>
      s.audienceTags.includes("clasico") ||
      /cl[aá]sico|final|libertadores/i.test(s.title),
  );

  if (interest === "partido_futbol" && !clasico) return ["mailing", "seo"];
  if (interest === "partido_futbol" && clasico)
    return ["mailing", "google_search", "meta"];
  if (interest === "deporte_competencia") return ["mailing", "seo", "meta"];
  if (interest === "nieve") return ["google_search", "meta", "seo"];
  if (interest === "vacaciones_familias" || interest === "feriado_puente")
    return ["google_search", "meta", "seo"];
  if (interest === "concierto" && top >= 85)
    return ["google_search", "google_pmax", "meta", "remarketing"];
  if (interest === "concierto") return ["google_search", "meta", "remarketing"];
  return ["google_search", "meta"];
}

function playbookForInterest(
  interest: CampaignInterest,
  signals: DemandSignal[],
): SuggestedCampaign["playbook"] {
  const top = Math.max(...signals.map(eventWeight), 0);
  const clasico = signals.some(
    (s) =>
      s.audienceTags.includes("clasico") || /cl[aá]sico|final/i.test(s.title),
  );

  if (interest === "partido_futbol" && !clasico) return "mailing_first";
  if (interest === "deporte_competencia") return "mailing_first";
  if (interest === "partido_futbol" && clasico) return "hybrid";
  if (interest === "nieve") return "ads_heavy";
  if (interest === "concierto" && top >= 75) return "ads_heavy";
  return "hybrid";
}

function reasonForInterest(peak: DemandPeak, audienceRationale: string): string {
  const crowd = `Dimensión ${peak.demandDimension}: ~${formatPeople(peak.estimatedAttendance)} asistentes, ~${formatPeople(peak.estimatedOvernight)} con chance de pernocta.`;

  switch (peak.interest) {
    case "nieve":
      return [
        crowd,
        "Campaña solo nieve/ski: gente que busca ir a la cordillera.",
        "Ofrecemos depto en Santiago como hub de llegada/salida (Valle Nevado, Farellones, etc.).",
        "No se mezcla con partidos ni conciertos del mismo mes.",
        audienceRationale,
      ].join(" ");
    case "concierto":
      return [
        crowd,
        "Campaña solo concierto/show: gente con intención de ir a este evento.",
        "Ads y landing enfocados en alojarse cerca del venue.",
        audienceRationale,
      ].join(" ");
    case "partido_futbol":
      return [
        crowd,
        "Campaña solo este partido: hinchada del rival / origen geográfico.",
        "Mailing y geo-ads hacia esa localidad; depto cerca del estadio.",
        audienceRationale,
      ].join(" ");
    case "deporte_competencia":
      return [
        crowd,
        "Campaña solo esta competencia: deportistas, staff y familias viajeras.",
        "Mailing a federaciones/clubes de la localidad de origen.",
        audienceRationale,
      ].join(" ");
    case "feriado_puente":
      return [
        crowd,
        "Campaña de feriado/puente: turismo doméstico y escapadas a Santiago.",
        audienceRationale,
      ].join(" ");
    case "vacaciones_familias":
      return [
        crowd,
        "Campaña familias en vacaciones escolares: escapadas urbanas / atracciones.",
        audienceRationale,
      ].join(" ");
    default:
      return [crowd, audienceRationale].join(" ");
  }
}

export function suggestCampaignsFromPeaks(
  peaks: DemandPeak[],
  limit = 8,
): SuggestedCampaign[] {
  return peaks.slice(0, limit).map((peak, index) => {
    const lead = peak.signals[0];
    const leadPot = lead ? eventWeight(lead) : peak.score;
    const interest = peak.interest;
    const intentionSlug = intentionSlugForInterest(interest, peak.signals);
    const playbook = playbookForInterest(interest, peak.signals);

    /**
     * Budget sugerido/día (CLP) — punto de partida para aprender, no obligación.
     * Regla práctica renta corta Chile:
     * - mailing_first: ads mínimos o $0 (el canal fuerte es correo)
     * - hybrid: prueba chica
     * - ads_heavy: test serio según tamaño del peak
     */
    const dailyBudgetClp = (() => {
      if (playbook === "mailing_first") {
        // Solo boost liviano si quieres rematar; el mailing es el motor
        return peak.demandDimension === "grande" ||
          peak.demandDimension === "mega"
          ? 8000
          : 5000;
      }
      if (playbook === "hybrid") {
        if (peak.demandDimension === "mega") return 25_000;
        if (peak.demandDimension === "grande") return 18_000;
        if (peak.demandDimension === "media") return 12_000;
        return 8_000;
      }
      // ads_heavy
      if (peak.demandDimension === "mega") return 45_000;
      if (peak.demandDimension === "grande") return 30_000;
      if (peak.demandDimension === "media") return 18_000;
      return 10_000;
    })();

    const windowEnd = peak.rangeEnd;
    const daysBefore =
      interest === "nieve"
        ? 14
        : playbook === "mailing_first"
          ? 7
          : leadPot >= 85
            ? 21
            : leadPot >= 65
              ? 14
              : 10;
    const windowStart = format(
      addDays(parseISO(peak.rangeStart), -daysBefore),
      "yyyy-MM-dd",
    );

    const audienceBase = deriveAudienceFromSignals(peak.signals);
    const audience =
      interest === "nieve"
        ? {
            segments: [
              ...new Set([
                "turismo Brasil",
                "nieve / ski",
                ...audienceBase.segments.filter(
                  (s) => !/hinchada|fútbol|partido/i.test(s),
                ),
              ]),
            ].slice(0, 6),
            geoTargets:
              audienceBase.geoTargets.length > 0
                ? audienceBase.geoTargets.filter((g) => g.type === "country")
                : [
                    {
                      label: "Brasil",
                      area: "Brasil",
                      type: "country" as const,
                      origin: "turismo nieve",
                      adHint:
                        "Meta/Google: Brasil · ski / Valle Nevado / Santiago",
                    },
                  ],
            rationale:
              "Temporada de nieve: apuntar a quienes buscan ski en Chile (flujo Brasil). Santiago es hub de pernocta puente — campaña separada de partidos y conciertos.",
            stayOffer:
              "Alojamientos en Santiago como base cómoda para ir a la cordillera y volver.",
          }
        : audienceBase;

    return {
      id: `camp-sug-${peak.id}`,
      peakId: peak.id,
      name: `${peak.interestLabel} · ${peak.title}`,
      reason: reasonForInterest(peak, audience.rationale),
      playbook,
      channels: channelsForInterest(interest, peak.signals),
      intentionSlug,
      propertyCodes:
        peak.propertyCodes.length > 0
          ? peak.propertyCodes
          : interest === "nieve"
            ? ["E801", "E214", "T112"]
            : ["E801", "E214", "Z114", "Z107", "T112"],
      windowStart,
      windowEnd,
      dailyBudgetClp,
      priority: index + 1,
      status: "suggested",
      audience,
      interest,
      interestLabel: peak.interestLabel,
      estimatedAttendance: peak.estimatedAttendance,
      estimatedOvernight: peak.estimatedOvernight,
      demandDimension: peak.demandDimension,
    };
  });
}

export function filterSignalsInRange(
  signals: DemandSignal[],
  rangeStart: string,
  rangeEnd: string,
): DemandSignal[] {
  const start = parseISO(rangeStart);
  const end = parseISO(rangeEnd);
  return signals.filter((s) => {
    const sStart = parseISO(s.startsOn);
    const sEnd = parseISO(s.endsOn);
    return (
      isWithinInterval(sStart, { start, end }) ||
      isWithinInterval(sEnd, { start, end }) ||
      (sStart <= start && sEnd >= end)
    );
  });
}
