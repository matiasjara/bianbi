/**
 * Monitoreo de campañas: semáforo por canal + KPIs.
 * Pensado para enchufar Meta/Google API después; hoy admite demo / manual.
 */
import type {
  AdPlatform,
  CampaignPack,
  CampaignPlaybook,
} from "./types";

export type TrafficLight = "green" | "yellow" | "red" | "gray";

export type MonitorChannelId = AdPlatform | "mailing";

export type MetricsSource =
  | "none"
  | "demo"
  | "manual"
  | "meta_api"
  | "google_api";

/** KPIs crudos por canal (lo que vendría de la API). */
export interface ChannelMetrics {
  channel: MonitorChannelId;
  spendClp: number;
  impressions: number;
  clicks: number;
  landingVisits: number;
  /** Clics al anuncio Airbnb desde la landing (UTM) */
  airbnbClicks: number;
  /** Reservas / noches atribuidas (manual o futuro) */
  nightsBooked?: number;
  updatedAt: string;
}

export interface ChannelTargets {
  ctrGreen: number;
  ctrYellow: number;
  cpcGreenMaxClp: number;
  cpcYellowMaxClp: number;
  /** Airbnb clicks / landing visits */
  airbnbRateGreen: number;
  airbnbRateYellow: number;
}

export interface ChannelHealth {
  channel: MonitorChannelId;
  channelLabel: string;
  light: TrafficLight;
  label: string;
  score: number;
  reasons: string[];
  metrics: ChannelMetrics | null;
  derived: {
    ctr: number | null;
    cpcClp: number | null;
    airbnbRate: number | null;
    costPerAirbnbClickClp: number | null;
  };
  targets: ChannelTargets;
}

export type CampaignVerdict = "buena" | "regular" | "mala" | "sin_datos";

export interface CampaignMonitor {
  campaignId: string;
  slug: string;
  source: MetricsSource;
  updatedAt: string | null;
  overallLight: TrafficLight;
  verdict: CampaignVerdict;
  verdictNote: string;
  channels: ChannelHealth[];
  /** Qué mirar para decidir si mejorar copy, geo o pausar */
  recommendations: string[];
  kpiGuide: Array<{ kpi: string; meaning: string; goodIf: string }>;
}

const CHANNEL_LABEL: Record<MonitorChannelId, string> = {
  meta: "Meta",
  google: "Google",
  mailing: "Mailing",
};

function targetsFor(playbook: CampaignPlaybook): ChannelTargets {
  // Umbrales proxy Chile / tráfico a landing de alojamiento
  if (playbook === "ads_heavy") {
    return {
      ctrGreen: 0.012,
      ctrYellow: 0.006,
      cpcGreenMaxClp: 450,
      cpcYellowMaxClp: 900,
      airbnbRateGreen: 0.12,
      airbnbRateYellow: 0.06,
    };
  }
  if (playbook === "mailing_first") {
    return {
      ctrGreen: 0.01,
      ctrYellow: 0.005,
      cpcGreenMaxClp: 350,
      cpcYellowMaxClp: 700,
      airbnbRateGreen: 0.1,
      airbnbRateYellow: 0.05,
    };
  }
  return {
    ctrGreen: 0.011,
    ctrYellow: 0.0055,
    cpcGreenMaxClp: 400,
    cpcYellowMaxClp: 800,
    airbnbRateGreen: 0.11,
    airbnbRateYellow: 0.055,
  };
}

function lightLabel(light: TrafficLight): string {
  if (light === "green") return "Anda bien";
  if (light === "yellow") return "Ojo";
  if (light === "red") return "Mal";
  return "Sin datos";
}

function worstLight(lights: TrafficLight[]): TrafficLight {
  if (lights.includes("red")) return "red";
  if (lights.includes("yellow")) return "yellow";
  if (lights.includes("green")) return "green";
  return "gray";
}

function evaluateChannel(
  channel: MonitorChannelId,
  metrics: ChannelMetrics | null,
  playbook: CampaignPlaybook,
): ChannelHealth {
  const targets = targetsFor(playbook);
  if (!metrics || metrics.impressions <= 0) {
    return {
      channel,
      channelLabel: CHANNEL_LABEL[channel],
      light: "gray",
      label: lightLabel("gray"),
      score: 0,
      reasons: ["Aún no hay métricas de este canal (conecta API o carga demo)."],
      metrics: null,
      derived: {
        ctr: null,
        cpcClp: null,
        airbnbRate: null,
        costPerAirbnbClickClp: null,
      },
      targets,
    };
  }

  const ctr =
    metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0;
  const cpcClp = metrics.clicks > 0 ? metrics.spendClp / metrics.clicks : 0;
  const airbnbRate =
    metrics.landingVisits > 0
      ? metrics.airbnbClicks / metrics.landingVisits
      : 0;
  const costPerAirbnbClickClp =
    metrics.airbnbClicks > 0
      ? metrics.spendClp / metrics.airbnbClicks
      : null;

  const reasons: string[] = [];
  let score = 70;

  // CTR
  let ctrLight: TrafficLight = "green";
  if (ctr >= targets.ctrGreen) {
    score += 10;
    reasons.push(`CTR ${(ctr * 100).toFixed(2)}% — buen interés en el anuncio`);
  } else if (ctr >= targets.ctrYellow) {
    ctrLight = "yellow";
    score -= 10;
    reasons.push(
      `CTR ${(ctr * 100).toFixed(2)}% — flojo; prueba otro copy o creativo`,
    );
  } else {
    ctrLight = "red";
    score -= 25;
    reasons.push(
      `CTR ${(ctr * 100).toFixed(2)}% — muy bajo; revisa audiencia o imagen`,
    );
  }

  // CPC
  let cpcLight: TrafficLight = "green";
  if (metrics.clicks === 0) {
    cpcLight = "red";
    score -= 20;
    reasons.push("Sin clics todavía");
  } else if (cpcClp <= targets.cpcGreenMaxClp) {
    score += 8;
    reasons.push(`CPC ~${Math.round(cpcClp)} CLP — eficiente`);
  } else if (cpcClp <= targets.cpcYellowMaxClp) {
    cpcLight = "yellow";
    score -= 8;
    reasons.push(`CPC ~${Math.round(cpcClp)} CLP — caro; aprieta geo o puja`);
  } else {
    cpcLight = "red";
    score -= 20;
    reasons.push(`CPC ~${Math.round(cpcClp)} CLP — demasiado alto para el ROI`);
  }

  // Landing → Airbnb
  let convLight: TrafficLight = "green";
  if (metrics.landingVisits < 5) {
    convLight = "yellow";
    score -= 5;
    reasons.push("Pocas visitas a landing para juzgar conversión");
  } else if (airbnbRate >= targets.airbnbRateGreen) {
    score += 12;
    reasons.push(
      `${(airbnbRate * 100).toFixed(1)}% van a Airbnb — landing convence`,
    );
  } else if (airbnbRate >= targets.airbnbRateYellow) {
    convLight = "yellow";
    score -= 10;
    reasons.push(
      `${(airbnbRate * 100).toFixed(1)}% a Airbnb — mejora CTA / trust en landing`,
    );
  } else {
    convLight = "red";
    score -= 22;
    reasons.push(
      `${(airbnbRate * 100).toFixed(1)}% a Airbnb — la landing no está cerrando`,
    );
  }

  // Mailing: interpret spend as "sends" proxy if channel mailing — keep same KPIs loosely
  if (channel === "mailing" && metrics.clicks === 0 && metrics.impressions > 0) {
    reasons.push("Mailing: impresiones ≈ envíos; clics = aperturas/links");
  }

  const light = worstLight([ctrLight, cpcLight, convLight]);
  score = Math.max(0, Math.min(100, score));

  return {
    channel,
    channelLabel: CHANNEL_LABEL[channel],
    light,
    label: lightLabel(light),
    score,
    reasons: reasons.slice(0, 4),
    metrics,
    derived: {
      ctr,
      cpcClp: metrics.clicks > 0 ? cpcClp : null,
      airbnbRate: metrics.landingVisits > 0 ? airbnbRate : null,
      costPerAirbnbClickClp,
    },
    targets,
  };
}

function verdictFrom(overall: TrafficLight, hasData: boolean): {
  verdict: CampaignVerdict;
  note: string;
} {
  if (!hasData || overall === "gray") {
    return {
      verdict: "sin_datos",
      note: "Sin métricas aún. Cuando publiques, aquí verás el semáforo en vivo.",
    };
  }
  if (overall === "green") {
    return {
      verdict: "buena",
      note: "La campaña está rindiendo: mantén o sube un poco el budget.",
    };
  }
  if (overall === "yellow") {
    return {
      verdict: "regular",
      note: "Hay fricción: ajusta creativo, geo o landing antes de gastar más.",
    };
  }
  return {
    verdict: "mala",
    note: "Pausa o reformula: CTR/CPC/conversión no justifican seguir igual.",
  };
}

function recommendationsFrom(channels: ChannelHealth[]): string[] {
  const recs: string[] = [];
  for (const ch of channels) {
    if (ch.light === "gray") continue;
    if (ch.light === "red" && ch.derived.ctr != null && ch.derived.ctr < 0.006) {
      recs.push(
        `${ch.channelLabel}: cambia imagen/headline — el anuncio no frena el scroll`,
      );
    }
    if (
      ch.light !== "green" &&
      ch.derived.airbnbRate != null &&
      ch.derived.airbnbRate < 0.08
    ) {
      recs.push(
        `${ch.channelLabel}: refuerza en landing metro + barrio seguro + CTA Airbnb`,
      );
    }
    if (
      ch.derived.cpcClp != null &&
      ch.derived.cpcClp > ch.targets.cpcYellowMaxClp
    ) {
      recs.push(
        `${ch.channelLabel}: baja CPC acotando geo o excluyendo Santiago si el público es visitante`,
      );
    }
  }
  if (recs.length === 0 && channels.some((c) => c.light === "green")) {
    recs.push("Duplica la variante creativa ganadora y pausa la peor");
  }
  if (recs.length === 0) {
    recs.push("Publica y deja 48–72h de aprendizaje antes de juzgar");
  }
  return recs.slice(0, 5);
}

export const KPI_GUIDE: CampaignMonitor["kpiGuide"] = [
  {
    kpi: "CTR",
    meaning: "% de gente que ve el anuncio y hace clic",
    goodIf: "Meta/Google ≈ ≥1–1.2% en este nicho",
  },
  {
    kpi: "CPC",
    meaning: "Cuánto pagas por cada clic a la landing",
    goodIf: "Bajo el umbral del playbook (cientos de CLP, no miles)",
  },
  {
    kpi: "Visitas landing",
    meaning: "Tráfico real a tu /c/…",
    goodIf: "Crece con el spend sin caer la calidad",
  },
  {
    kpi: "% a Airbnb",
    meaning: "De quienes llegan a la landing, cuántos van a reservar",
    goodIf: "≈ ≥10–12% — mide si el copy de la página vende",
  },
  {
    kpi: "Costo por clic Airbnb",
    meaning: "Inversión / clics al anuncio Airbnb",
    goodIf: "Bajo y estable; si sube, revisa landing o audiencia",
  },
  {
    kpi: "Noches",
    meaning: "Reservas atribuibles (manual o futuro tracking)",
    goodIf: "ROI positivo vs budget del flight",
  },
];

/** Construye el monitor a partir de métricas reales/demo. */
export function buildCampaignMonitor(
  pack: CampaignPack,
  channelMetrics: ChannelMetrics[],
  source: MetricsSource,
): CampaignMonitor {
  const channelsToShow: MonitorChannelId[] =
    pack.playbook === "mailing_first"
      ? ["mailing", "meta", "google"]
      : ["meta", "google", "mailing"];

  const byChannel = new Map(channelMetrics.map((m) => [m.channel, m]));
  const channels = channelsToShow.map((ch) =>
    evaluateChannel(ch, byChannel.get(ch) ?? null, pack.playbook),
  );

  const liveLights = channels
    .filter((c) => c.light !== "gray")
    .map((c) => c.light);
  const overallLight = worstLight(
    liveLights.length ? liveLights : (["gray"] as TrafficLight[]),
  );
  const hasData = liveLights.length > 0;
  const { verdict, note } = verdictFrom(overallLight, hasData);

  const updatedAt =
    channelMetrics
      .map((m) => m.updatedAt)
      .sort()
      .at(-1) ?? null;

  return {
    campaignId: pack.campaignId,
    slug: pack.slug,
    source,
    updatedAt,
    overallLight,
    verdict,
    verdictNote: note,
    channels,
    recommendations: recommendationsFrom(channels),
    kpiGuide: KPI_GUIDE,
  };
}

/**
 * Demo determinística para visualizar el semáforo antes de la API.
 * Solo para packs marcados listos / exploración de UI.
 */
export function buildDemoChannelMetrics(pack: CampaignPack): ChannelMetrics[] {
  const exp = pack.publishPlan.expected;
  const now = new Date().toISOString();
  // Usa el score del pack para variar calidad demo
  const quality =
    pack.score >= 70 ? 1.15 : pack.score >= 45 ? 0.85 : 0.55;

  const metaImpr = Math.round(exp.impressionsLow * 0.55 * quality);
  const metaClicks = Math.round(exp.clicksLow * 0.55 * quality);
  const metaLand = Math.round(exp.landingVisitsLow * 0.55 * quality);
  const metaAir = Math.round(exp.airbnbActionsLow * 0.55 * quality);

  const googImpr = Math.round(exp.impressionsLow * 0.35 * quality);
  const googClicks = Math.round(exp.clicksLow * 0.4 * quality);
  const googLand = Math.round(exp.landingVisitsLow * 0.4 * quality);
  const googAir = Math.round(exp.airbnbActionsLow * 0.35 * quality);

  const daysElapsed = Math.max(1, Math.round(exp.days * 0.4));
  const metaSpend = Math.round(pack.dailyBudgetClp * 0.55 * daysElapsed);
  const googSpend = Math.round(pack.dailyBudgetClp * 0.35 * daysElapsed);

  const out: ChannelMetrics[] = [
    {
      channel: "meta",
      spendClp: metaSpend,
      impressions: Math.max(100, metaImpr),
      clicks: Math.max(1, metaClicks),
      landingVisits: Math.max(1, metaLand),
      airbnbClicks: Math.max(0, metaAir),
      updatedAt: now,
    },
    {
      channel: "google",
      spendClp: googSpend,
      impressions: Math.max(80, googImpr),
      clicks: Math.max(1, googClicks),
      landingVisits: Math.max(1, googLand),
      airbnbClicks: Math.max(0, googAir),
      updatedAt: now,
    },
  ];

  if (pack.playbook === "mailing_first" || pack.playbook === "hybrid") {
    out.push({
      channel: "mailing",
      spendClp: 0,
      impressions: Math.max(40, pack.publishPlan.mailingTargets.length * 25),
      clicks: Math.max(2, Math.round(pack.publishPlan.mailingTargets.length * 3 * quality)),
      landingVisits: Math.max(
        1,
        Math.round(pack.publishPlan.mailingTargets.length * 2 * quality),
      ),
      airbnbClicks: Math.max(
        0,
        Math.round(pack.publishPlan.mailingTargets.length * quality),
      ),
      updatedAt: now,
    });
  }

  return out;
}
