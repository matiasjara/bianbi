export type PoiCategory =
  | "venue"
  | "barrio"
  | "atraccion"
  | "salud"
  | "transporte"
  | "gastronomia"
  | "cultura";

export type CampaignChannel =
  | "google_search"
  | "google_pmax"
  | "meta"
  | "tiktok"
  | "seo"
  | "remarketing"
  | "mailing";

export type PropertyAudience =
  | "parejas"
  | "turismo"
  | "gastronomia"
  | "cultura"
  | "conciertos"
  | "deportes"
  | "workation"
  | "familias";

export interface Property {
  id: string;
  /**
   * Código interno operativo (E801, E214, Z114…).
   * Solo para dashboard/ops — nunca en landings ni copy público.
   */
  code: string;
  buildingId?: string;
  buildingName?: string;
  isReal: boolean;
  airbnbId?: string;
  /** Nombre público (sin códigos internos) */
  name: string;
  slug: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
  airbnbUrl: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  isSuperhost?: boolean;
  audiences: PropertyAudience[];
  occupancyNext30: number | null;
  availableNightsNext30: number | null;
  metroStations: string[];
  nearbyPoiIds: string[];
}

export interface Poi {
  id: string;
  name: string;
  slug: string;
  category: PoiCategory;
  lat: number;
  lng: number;
  influenceRadiusKm: number;
  seasonality: string;
  description: string;
}

/** Organización / contacto para mailing / outreach. */
export type OutreachCategory =
  | "deporte"
  | "nieve_turismo"
  | "conciertos_shows"
  | "familias_atracciones"
  | "turismo_general"
  | "cultura_eventos";

export type OutreachOrgType =
  | "federacion"
  | "asociacion"
  | "club"
  | "operador"
  | "productora"
  | "agencia"
  | "venue"
  | "institucion"
  | "otro";

export type OutreachSourceId =
  | "tabla_asociaciones"
  | "registro_fdn"
  | "fehoch"
  | "fevochi_asociaciones"
  | "fedetenis_cl"
  | "manual_outreach"
  | "sernatur"
  | "ski_resorts"
  | "promotoras";

export interface OutreachSource {
  id: OutreachSourceId;
  name: string;
  url: string;
}

export interface OutreachOrganization {
  id: string;
  name: string;
  /** Categoría de demanda / mailing (deporte, nieve, conciertos…). */
  category: OutreachCategory;
  orgType: OutreachOrgType;
  /**
   * Segmento fino: deporte (fútbol, hockey…) o disciplina
   * (ski, etc.). Solo orgTypes con gente afiliada.
   */
  segment: string | null;
  /** @deprecated usar segment — alias para compat deporte */
  sport?: string | null;
  region: string | null;
  emails: string[];
  phones: string[];
  address: string | null;
  source: OutreachSourceId;
  sourceUrl: string;
  website?: string;
  mailingReady: boolean;
  /** Intereses de campaña a los que aplica este contacto. */
  campaignInterests?: Array<
    | "nieve"
    | "concierto"
    | "partido_futbol"
    | "deporte_competencia"
    | "feriado_puente"
    | "vacaciones_familias"
    | "turismo_general"
    | "congreso_feria"
    | "otro_evento"
  >;
}

/** @deprecated alias — preferir OutreachOrganization */
export type SportsOrgType = OutreachOrgType;
/** @deprecated alias */
export type SportsOrgSourceId = OutreachSourceId;
/** @deprecated alias */
export type SportsOrgSource = OutreachSource;
/** @deprecated alias — orgs deportivas siguen usando sport + category deporte */
export type SportsOrganization = Omit<OutreachOrganization, "category" | "segment"> & {
  category?: OutreachCategory;
  segment?: string | null;
  sport: string | null;
};
