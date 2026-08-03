/** Señales de demanda: eventos scrapeados + estacionalidad + feriados. */

export type SignalKind =
  | "event"
  | "sport"
  | "holiday"
  | "seasonality"
  | "tourism_flow"
  | "school_break";

export type SignalSource =
  | "nager_holidays"
  | "seasonality_rules"
  | "ticketmaster_cl"
  | "puntoticket"
  | "ticketplus_cl"
  | "tocador"
  | "passline"
  | "campeonato_chileno"
  | "ind_cl"
  | "club_atletico_santiago"
  | "fedachi"
  | "fehoch_tournaments"
  | "fevochi"
  | "discovery_web"
  | "playwright_scrape"
  | "manual"
  | "seed";

export type CampaignPlaybook = "ads_heavy" | "mailing_first" | "hybrid";

/** Ciudad donde ocurre el evento / guía. */
export type CityId = "santiago" | "concepcion";

export type CampaignInterest =
  | "nieve"
  | "concierto"
  | "partido_futbol"
  | "deporte_competencia"
  | "feriado_puente"
  | "vacaciones_familias"
  | "turismo_general"
  | "otro_evento";

export type AudienceGeoType = "city" | "region" | "country";

export interface AudienceGeoTarget {
  label: string;
  area: string;
  type: AudienceGeoType;
  origin?: string;
  adHint: string;
}

/** Público objetivo + explicación de por qué se apunta ahí. */
export interface CampaignAudience {
  segments: string[];
  geoTargets: AudienceGeoTarget[];
  rationale: string;
  stayOffer: string;
}

export interface DemandSignal {
  id: string;
  kind: SignalKind;
  source: SignalSource;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  startsOn: string;
  /** YYYY-MM-DD inclusive */
  endsOn: string;
  /** 1–10 — derivado del potencial */
  intensity: number;
  /**
   * Potencial de demanda hotelera 0–100 (BTS ≈ 95, teatro chico ≈ 25).
   * Si falta, se recalcula al cargar.
   */
  potentialScore?: number;
  potentialTier?: "mega" | "alta" | "media" | "baja";
  potentialFactors?: string[];
  /**
   * Estimación aproximada de asistentes (punto medio).
   * Proxy para comparar dimensión; no es aforo oficial.
   */
  estimatedAttendance?: number;
  estimatedAttendanceLow?: number;
  estimatedAttendanceHigh?: number;
  /** Visitantes con alta probabilidad de pernocta en Santiago */
  estimatedOvernight?: number;
  estimatedOvernightLow?: number;
  estimatedOvernightHigh?: number;
  /** Dimensión relativa de la demanda */
  demandDimension?: "mega" | "grande" | "media" | "chica";
  attendanceMethod?: string;
  attendanceConfidence?: "alta" | "media" | "baja";
  venueCapacity?: number;
  /** Ciudad sede del evento (inferida o explícita). */
  city?: CityId;
  poiIds: string[];
  audienceTags: string[];
  propertyCodesPreferred?: string[];
  url?: string;
  scrapedAt?: string;
}

export interface DayDemandPoint {
  date: string;
  weekday: number;
  label: string;
  score: number;
  eventScore: number;
  seasonalityScore: number;
  holidayScore: number;
  signals: DemandSignal[];
  isWeekend: boolean;
}

export interface DemandPeak {
  id: string;
  /** Fecha ancla (inicio del evento / interés) */
  anchorDate: string;
  rangeStart: string;
  rangeEnd: string;
  score: number;
  title: string;
  drivers: string[];
  signals: DemandSignal[];
  propertyCodes: string[];
  /** Interés único de esta oportunidad (no mezclar nieve + fútbol, etc.) */
  interest: CampaignInterest;
  interestLabel: string;
  /** Asistentes agregados del peak (proxy) */
  estimatedAttendance: number;
  /** Pernocta agregada del peak (proxy clave para campañas) */
  estimatedOvernight: number;
  demandDimension: "mega" | "grande" | "media" | "chica";
}

export interface SuggestedCampaign {
  id: string;
  peakId: string;
  name: string;
  reason: string;
  /** Estrategia: deporte/regiones → mailing; mega shows → ads. */
  playbook: CampaignPlaybook;
  channels: Array<
    | "google_search"
    | "google_pmax"
    | "meta"
    | "tiktok"
    | "seo"
    | "remarketing"
    | "mailing"
  >;
  intentionSlug: string;
  propertyCodes: string[];
  windowStart: string;
  windowEnd: string;
  dailyBudgetClp: number;
  priority: number;
  status: "suggested" | "approved" | "rejected";
  audience: CampaignAudience;
  interest: CampaignInterest;
  interestLabel: string;
  estimatedAttendance: number;
  estimatedOvernight: number;
  demandDimension: "mega" | "grande" | "media" | "chica";
}

/** Pack convertidor: copy + landing + mapa + props (sin códigos internos en público). */
export interface CampaignPackProperty {
  code: string;
  name: string;
  slug: string;
  /** Primera foto (hero / compat) */
  photo: string;
  /** Galería completa del anuncio Airbnb */
  photos: string[];
  capacity: number;
  bedrooms: number;
  neighborhood: string;
  /** Agrupa unidades en el mismo edificio (UI compacta). */
  buildingName?: string;
  address: string;
  amenities: string[];
  distanceKm: number;
  walkingMinutes: number;
  airbnbUrl: string;
  lat: number;
  lng: number;
  metroStations: string[];
  rating?: number;
  reviewCount?: number;
  isSuperhost?: boolean;
  /** Frase corta vendedora para la ficha */
  pitch: string;
  /** Bullets de ubicación (catálogo /santiago sin evento ancla) */
  locationHighlights?: string[];
}

export interface CampaignPack {
  slug: string;
  /** Ciudad de la guía (sede del evento). */
  city: CityId;
  campaignId: string;
  peakId: string;
  playbook: CampaignPlaybook;
  channels: SuggestedCampaign["channels"];
  eventTitle: string;
  eventDates: string;
  eventStartsOn: string;
  eventEndsOn: string;
  venueName: string;
  venuePoiId: string;
  venueLat: number;
  venueLng: number;
  mapEmbedUrl: string;
  mapLinkUrl: string;
  headline: string;
  subhead: string;
  /** Razones de compra para la landing (metro, barrio, Airbnb…). */
  trustPoints: string[];
  mailingSubject: string;
  mailingBody: string;
  adHeadline: string;
  adPrimaryText: string;
  properties: CampaignPackProperty[];
  windowStart: string;
  windowEnd: string;
  dailyBudgetClp: number;
  priority: number;
  utmCampaign: string;
  drivers: string[];
  score: number;
  /** Por qué se sugiere esta campaña (score, drivers, playbook). */
  reason: string;
  /** Dónde está el público y por qué apuntamos ahí. */
  audience: CampaignAudience;
  interest: CampaignInterest;
  interestLabel: string;
  estimatedAttendance: number;
  estimatedOvernight: number;
  demandDimension: DemandDimension;
  attendanceMethod?: string;
  /** Plan de ads/mailing listo para decidir publicar (sin API aún). */
  publishPlan: AdPublishPlan;
  /** Preguntas estratégicas respondidas antes de creatividades. */
  travelBrief: TravelBrief;
  /** Micrositio / guía pública SEO del evento. */
  microsite: MicrositeContent;
}

export type DemandDimension = "mega" | "grande" | "media" | "chica";

export type AdPlatform = "meta" | "google";

export interface AdCreativeVariant {
  id: string;
  label: string;
  imageUrl: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

export interface ExpectedAdResults {
  disclaimer: string;
  days: number;
  totalBudgetClp: number;
  impressionsLow: number;
  impressionsHigh: number;
  clicksLow: number;
  clicksHigh: number;
  landingVisitsLow: number;
  landingVisitsHigh: number;
  airbnbActionsLow: number;
  airbnbActionsHigh: number;
  nightsLow: number;
  nightsHigh: number;
  confidence: "baja" | "media" | "alta";
}

export interface MailingTargetSuggestion {
  id: string;
  name: string;
  orgType: string;
  emails: string[];
  segment: string | null;
}

/** Todo lo necesario para publicar: tú solo decides el OK final. */
export interface AdPublishPlan {
  status: "draft" | "ready";
  platforms: AdPlatform[];
  playbook: CampaignPlaybook;
  flightStart: string;
  flightEnd: string;
  dailyBudgetClp: number;
  totalBudgetClp: number;
  objective: string;
  audienceSummary: string;
  geoLines: string[];
  interestLines: string[];
  metaTargetingNotes: string[];
  googleTargetingNotes: string[];
  creatives: AdCreativeVariant[];
  expected: ExpectedAdResults;
  mailingTargets: MailingTargetSuggestion[];
  checklist: Array<{ id: string; label: string; done: boolean }>;
  publishBlockedReason: string;
}

/**
 * Travel Brief: respuestas estratégicas antes de crear landing/ads/micrositio.
 * "Travel Brief" (EN) ≈ guía de viaje / brief del viajero (ES).
 */
export interface TravelBrief {
  status: "draft" | "ready";
  generatedAt: string;
  persona: {
    who: string;
    origins: string[];
    tripStyle: string;
    budgetBand: string;
    stayNights: string;
  };
  strategy: {
    problem: string;
    objections: string[];
    trustProof: string[];
    winningMessage: string;
  };
  checklistAnswered: {
    who: boolean;
    problem: boolean;
    objections: boolean;
    trustProof: boolean;
    winningMessage: boolean;
  };
}

export type MicrositeGuideKind =
  | "concierto"
  | "partido"
  | "deporte"
  | "nieve"
  | "turismo"
  | "evento";

/** Micrositio público SEO por evento (guía / Travel Brief). */
export interface MicrositeContent {
  slug: string;
  guideTitle: string;
  guideKind: MicrositeGuideKind;
  productLabel: string;
  productLabelEs: string;
  eventSummary: string;
  eventTitle: string;
  eventDates: string;
  venueName: string;
  venueLat: number;
  venueLng: number;
  /** Lo esencial del evento (must-know) */
  mustKnow: string[];
  recommendations: string[];
  news: string[];
  weather: { summary: string; tip: string };
  transport: string[];
  faqs: Array<{ q: string; a: string }>;
  seoTitle: string;
  seoDescription: string;
  properties: CampaignPackProperty[];
  interest: CampaignInterest;
  interestLabel: string;
  shareText: string;
}

export interface IngestManifest {
  ranAt: string;
  sources: Array<{
    name: string;
    ok: boolean;
    count: number;
    error?: string;
  }>;
}
