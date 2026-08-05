/**
 * Estimación aproximada de público (asistentes) y pernocta hotelera.
 * No es aforo oficial: es un proxy para comparar dimensión de campañas.
 */
import type { DemandSignal, SignalKind } from "./types";
import type { DemandTier } from "./potential";

export type DemandDimension = "mega" | "grande" | "media" | "chica";

export type AttendanceConfidence = "alta" | "media" | "baja";

export interface AttendanceEstimate {
  /** Punto medio de asistentes / público expuesto al evento */
  attendees: number;
  attendeesLow: number;
  attendeesHigh: number;
  /** Visitantes con alta chance de necesitar alojamiento en Santiago */
  overnight: number;
  overnightLow: number;
  overnightHigh: number;
  /** Aforo del venue si se pudo inferir */
  venueCapacity: number | null;
  dimension: DemandDimension;
  confidence: AttendanceConfidence;
  /** Cómo se armó la estimación */
  method: string;
}

type VenueCap = {
  re: RegExp;
  capacity: number;
  label: string;
};

const VENUE_CAPS: VenueCap[] = [
  {
    re: /estadio nacional|nacional julio/i,
    capacity: 48_000,
    label: "Estadio Nacional (~48k)",
  },
  {
    re: /monumental|estadio colo-?colo/i,
    capacity: 47_000,
    label: "Monumental (~47k)",
  },
  {
    re: /bicentenario la florida|estadio bicentenario/i,
    capacity: 12_000,
    label: "Bicentenario La Florida (~12k)",
  },
  {
    re: /parque o'?higgins|lollapalooza|creamfields|fauna/i,
    capacity: 100_000,
    label: "parque / festival (~100k/día)",
  },
  {
    re: /movistar arena/i,
    capacity: 15_000,
    label: "Movistar Arena (~15k)",
  },
  {
    re: /gran arena monticello|arena monticello/i,
    capacity: 10_000,
    label: "Arena Monticello (~10k)",
  },
  {
    re: /teatro caupolic[aá]n|caupolican/i,
    capacity: 4_500,
    label: "Teatro Caupolicán (~4.5k)",
  },
  {
    re: /club h[ií]pico|estaci[oó]n mapocho|mapocho|metropolitan/i,
    capacity: 3_500,
    label: "venue mid (~3.5k)",
  },
  {
    re: /teatro coliseo|teatro nescaf[eé]|teatro mori|teatro universitario|sala metr[oó]nomo|club chocolate|teatro cariola|teatro zoco/i,
    capacity: 1_800,
    label: "teatro/club (~1.8k)",
  },
  {
    re: /vel[oó]dromo|pe[nñ]alol[eé]n|claudia sch|orlando guaita/i,
    capacity: 8_000,
    label: "complejo deportivo (~8k)",
  },
];

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function roundNice(n: number): number {
  if (n >= 50_000) return Math.round(n / 5000) * 5000;
  if (n >= 10_000) return Math.round(n / 1000) * 1000;
  if (n >= 1000) return Math.round(n / 100) * 100;
  if (n >= 100) return Math.round(n / 25) * 25;
  return Math.round(n);
}

function dimensionFrom(attendees: number, overnight: number): DemandDimension {
  if (attendees >= 50_000 || overnight >= 6_000) return "mega";
  if (attendees >= 15_000 || overnight >= 1_500) return "grande";
  if (attendees >= 4_000 || overnight >= 400) return "media";
  return "chica";
}

function resolveVenue(text: string): { capacity: number; label: string } | null {
  for (const v of VENUE_CAPS) {
    if (v.re.test(text)) return { capacity: v.capacity, label: v.label };
  }
  return null;
}

function fillRange(
  mid: number,
  spread = 0.28,
): { low: number; mid: number; high: number } {
  const low = roundNice(mid * (1 - spread));
  const high = roundNice(mid * (1 + spread));
  return { low, mid: roundNice(mid), high };
}

function estimateSport(text: string): AttendanceEstimate {
  if (/fedachi marathon|fedachimarathon|sudamericano marat[oó]n fedachi/i.test(text)) {
    const a = fillRange(12_000, 0.12);
    const o = fillRange(4_200, 0.3);
    return {
      attendees: a.mid,
      attendeesLow: a.low,
      attendeesHigh: a.high,
      overnight: o.mid,
      overnightLow: o.low,
      overnightHigh: o.high,
      venueCapacity: 12_000,
      dimension: dimensionFrom(a.mid, o.mid),
      confidence: "alta",
      method:
        "~12.000 corredores inscritos (evento masivo) · meta 42K en Estadio Nacional · fedachimarathon.cl",
    };
  }

  const venue = resolveVenue(text);
  const capacity = venue?.capacity ?? 35_000; // estadio típico Santiago

  let fill = 0.55;
  let overnightShare = 0.04;
  const notes: string[] = [];

  if (/cl[aá]sico|colo-colo.*universidad de chile|universidad de chile.*colo-colo/i.test(text)) {
    fill = 0.92;
    overnightShare = 0.06;
    notes.push("clásico (casi lleno)");
  } else if (/final|semifinal|liguilla|playoff/i.test(text)) {
    fill = 0.85;
    overnightShare = 0.1;
    notes.push("instancia decisiva");
  } else if (/libertadores|sudamericana|recopa/i.test(text)) {
    fill = 0.78;
    overnightShare = 0.18;
    notes.push("copa continental → más visita");
  } else if (/visita desde regiones|regiones|hinchada/i.test(text)) {
    fill = 0.62;
    overnightShare = 0.12;
    notes.push("rival de regiones → hinchada viajera");
  } else if (
    /argentin|river|boca|racing|brasil|flamengo|uruguay|pe[nñ]arol|per[uú]/i.test(
      text,
    )
  ) {
    fill = 0.75;
    overnightShare = 0.22;
    notes.push("rival internacional → pernocta alta");
  } else if (
    /copa davis|chile open|panamericano|mundial|fih|fedachi|fehoch|fevochi|interescolar|atletismo/i.test(
      text,
    )
  ) {
    fill = venue ? 0.7 : 0.5;
    overnightShare = 0.25;
    notes.push("evento federado / multi-día");
  } else if (/universidad de chile|colo-?colo|universidad cat[oó]lica/i.test(text)) {
    fill = 0.68;
    overnightShare = 0.05;
    notes.push("grande de Santiago de local");
  } else {
    notes.push("partido de liga (baseline)");
  }

  const attendeesMid = capacity * fill;
  const overnightMid = attendeesMid * overnightShare;
  const a = fillRange(attendeesMid, 0.22);
  const o = fillRange(overnightMid, 0.35);

  return {
    attendees: a.mid,
    attendeesLow: a.low,
    attendeesHigh: a.high,
    overnight: o.mid,
    overnightLow: o.low,
    overnightHigh: o.high,
    venueCapacity: venue?.capacity ?? capacity,
    dimension: dimensionFrom(a.mid, o.mid),
    confidence: venue ? "media" : "baja",
    method: [
      venue?.label ?? "aforo estadio típico (~35k)",
      `ocupación ~${Math.round(fill * 100)}%`,
      `pernocta ~${Math.round(overnightShare * 100)}% del público`,
      ...notes,
    ].join(" · "),
  };
}

function estimateShow(
  text: string,
  potentialScore: number,
): AttendanceEstimate {
  const venue = resolveVenue(text);
  let capacity = venue?.capacity ?? 8_000;
  let fill = clamp(potentialScore / 110, 0.35, 0.98);
  let overnightShare = 0.08;
  const notes: string[] = [];

  if (/lollapalooza|creamfields|fauna|festival/i.test(text)) {
    capacity = venue?.capacity ?? 100_000;
    fill = 0.85;
    overnightShare = 0.2;
    notes.push("festival multi-día");
  } else if (potentialScore >= 85) {
    overnightShare = 0.22;
    notes.push("headliner mega → turismo");
  } else if (potentialScore >= 65) {
    overnightShare = 0.12;
    notes.push("artista alta demanda");
  } else if (potentialScore < 40) {
    overnightShare = 0.03;
    notes.push("show local / teatro");
  }

  if (/world tour|tour mundial|latin america/i.test(text)) {
    overnightShare = Math.max(overnightShare, 0.18);
    notes.push("world tour");
  }

  const attendeesMid = capacity * fill;
  const overnightMid = attendeesMid * overnightShare;
  const a = fillRange(attendeesMid, 0.25);
  const o = fillRange(overnightMid, 0.4);

  return {
    attendees: a.mid,
    attendeesLow: a.low,
    attendeesHigh: a.high,
    overnight: o.mid,
    overnightLow: o.low,
    overnightHigh: o.high,
    venueCapacity: venue?.capacity ?? null,
    dimension: dimensionFrom(a.mid, o.mid),
    confidence: venue ? "media" : "baja",
    method: [
      venue?.label ?? "venue inferido por potencial",
      `ocupación ~${Math.round(fill * 100)}%`,
      `pernocta ~${Math.round(overnightShare * 100)}%`,
      ...notes,
    ].join(" · "),
  };
}

function estimateFlow(
  kind: SignalKind,
  title: string,
  intensity: number,
): AttendanceEstimate {
  // Flujos turísticos / feriados: "público expuesto" ≈ visitantes extra en la ciudad
  let overnightMid = intensity * 800;
  const notes: string[] = [];

  if (/fiestas patrias|dieciocho|18\s*sep/i.test(title)) {
    overnightMid = 45_000;
    notes.push("Fiestas Patrias (peak nacional)");
  } else if (/nieve|brasil|ski|valle nevado|farellones/i.test(title)) {
    overnightMid = intensity * 1_200;
    notes.push("flujo nieve / Brasil");
  } else if (/vacaciones de invierno|winter break/i.test(title)) {
    overnightMid = 12_000;
    notes.push("vacaciones de invierno");
  } else if (kind === "holiday") {
    overnightMid = intensity * 600;
    notes.push("feriado / puente");
  } else if (kind === "school_break") {
    overnightMid = intensity * 900;
    notes.push("receso escolar");
  } else {
    notes.push("flujo estacional");
  }

  const attendeesMid = overnightMid * 2.2; // más gente en la calle/atracciones que pernocta
  const a = fillRange(attendeesMid, 0.35);
  const o = fillRange(overnightMid, 0.4);

  return {
    attendees: a.mid,
    attendeesLow: a.low,
    attendeesHigh: a.high,
    overnight: o.mid,
    overnightLow: o.low,
    overnightHigh: o.high,
    venueCapacity: null,
    dimension: dimensionFrom(a.mid, o.mid),
    confidence: "baja",
    method: [
      "proxy de flujo turístico (no aforo de venue)",
      ...notes,
    ].join(" · "),
  };
}

/** Estima demanda de gente para una señal (evento, deporte, feriado, etc.). */
export function estimateAttendance(input: {
  title: string;
  description?: string;
  kind: SignalKind;
  intensity?: number;
  potentialScore?: number;
}): AttendanceEstimate {
  const text = `${input.title} ${input.description ?? ""}`;
  const intensity = input.intensity ?? 5;
  const pot = input.potentialScore ?? intensity * 10;

  const isSport =
    input.kind === "sport" ||
    /\bvs\.?\b|campeonato|anfp|cl[aá]sico|copa davis|fedachi|fehoch|fevochi|partido/i.test(
      text,
    );

  if (isSport) return estimateSport(text);

  if (input.kind === "event") return estimateShow(text, pot);

  if (
    input.kind === "holiday" ||
    input.kind === "seasonality" ||
    input.kind === "tourism_flow" ||
    input.kind === "school_break"
  ) {
    return estimateFlow(input.kind, input.title, intensity);
  }

  return estimateShow(text, pot);
}

export function applyAttendanceToSignal(
  signal: DemandSignal,
): DemandSignal {
  const est = estimateAttendance({
    title: signal.title,
    description: signal.description,
    kind: signal.kind,
    intensity: signal.intensity,
    potentialScore: signal.potentialScore,
  });

  return {
    ...signal,
    estimatedAttendance: est.attendees,
    estimatedAttendanceLow: est.attendeesLow,
    estimatedAttendanceHigh: est.attendeesHigh,
    estimatedOvernight: est.overnight,
    estimatedOvernightLow: est.overnightLow,
    estimatedOvernightHigh: est.overnightHigh,
    demandDimension: est.dimension,
    attendanceMethod: est.method,
    attendanceConfidence: est.confidence,
    venueCapacity: est.venueCapacity ?? undefined,
  };
}

/** Agrega dimensión de un peak: dominante + aportes menores (como potencial). */
export function aggregatePeakAttendance(signals: DemandSignal[]): {
  attendees: number;
  overnight: number;
  dimension: DemandDimension;
} {
  const scored = signals
    .filter((s) => typeof s.estimatedAttendance === "number")
    .map((s) => ({
      attendees: s.estimatedAttendance ?? 0,
      overnight: s.estimatedOvernight ?? 0,
    }))
    .sort((a, b) => b.overnight - a.overnight || b.attendees - a.attendees);

  if (scored.length === 0) {
    return { attendees: 0, overnight: 0, dimension: "chica" };
  }

  const overnight =
    (scored[0]?.overnight ?? 0) +
    (scored[1]?.overnight ?? 0) * 0.45 +
    (scored[2]?.overnight ?? 0) * 0.25 +
    scored.slice(3).reduce((a, b) => a + b.overnight, 0) * 0.08;

  const attendees =
    (scored[0]?.attendees ?? 0) +
    (scored[1]?.attendees ?? 0) * 0.35 +
    (scored[2]?.attendees ?? 0) * 0.2 +
    scored.slice(3).reduce((a, b) => a + b.attendees, 0) * 0.05;

  const a = roundNice(attendees);
  const o = roundNice(overnight);
  return { attendees: a, overnight: o, dimension: dimensionFrom(a, o) };
}

export function formatPeople(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const s =
      k >= 10
        ? String(Math.round(k))
        : k >= 1
          ? k.toFixed(k % 1 === 0 ? 0 : 1).replace(".", ",")
          : String(n);
    return `${s} mil`;
  }
  return new Intl.NumberFormat("es-CL").format(n);
}

export function formatAttendanceShort(
  attendees: number,
  overnight: number,
): string {
  return `~${formatPeople(attendees)} asist. · ~${formatPeople(overnight)} pernocta`;
}

export function formatAttendanceRange(
  low: number,
  mid: number,
  high: number,
): string {
  return `~${formatPeople(mid)} (${formatPeople(low)}–${formatPeople(high)})`;
}

export function dimensionLabel(d: DemandDimension): string {
  return {
    mega: "Mega",
    grande: "Grande",
    media: "Media",
    chica: "Chica",
  }[d];
}

export function dimensionFromTier(tier: DemandTier): DemandDimension {
  if (tier === "mega") return "mega";
  if (tier === "alta") return "grande";
  if (tier === "media") return "media";
  return "chica";
}
