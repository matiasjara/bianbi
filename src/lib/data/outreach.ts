import type { OutreachOrganization, OutreachSource } from "@/lib/types";
import {
  nonSportsOrganizations,
  outreachSources as nonSportsSources,
} from "./outreach-contacts";
import {
  sportsOrganizations as rawSports,
  sportsOrgSources,
} from "./sports-organizations";

/** Etiquetas UI de categoría de outreach. */
export const OUTREACH_CATEGORY_LABEL: Record<
  OutreachOrganization["category"],
  string
> = {
  deporte: "Deporte",
  nieve_turismo: "Nieve / ski",
  conciertos_shows: "Conciertos / shows",
  familias_atracciones: "Familias / atracciones",
  turismo_general: "Turismo general",
  cultura_eventos: "Cultura / eventos",
};

export const OUTREACH_ORG_TYPE_LABEL: Record<
  OutreachOrganization["orgType"],
  string
> = {
  federacion: "Federación",
  asociacion: "Asociación",
  club: "Club",
  operador: "Operador",
  productora: "Productora",
  agencia: "Agencia",
  venue: "Venue",
  institucion: "Institución",
  otro: "Otro",
};

/** Tipos útiles para mailing a posibles arrendatarios (gente afiliada). */
export const OUTREACH_MAILING_ORG_TYPES: OutreachOrganization["orgType"][] = [
  "federacion",
  "asociacion",
  "club",
];

/** Deportivas tipadas como outreach (categoría deporte). */
const sportsAsOutreach: OutreachOrganization[] = rawSports.map((o) => ({
  id: o.id,
  name: o.name,
  category: "deporte" as const,
  orgType: o.orgType as OutreachOrganization["orgType"],
  segment: o.sport,
  sport: o.sport,
  region: o.region,
  emails: o.emails,
  phones: o.phones,
  address: o.address,
  source: o.source,
  sourceUrl: o.sourceUrl,
  website: o.website,
  mailingReady: o.mailingReady,
  campaignInterests: ["partido_futbol", "deporte_competencia"],
}));

export const outreachSources: OutreachSource[] = [
  ...sportsOrgSources,
  ...nonSportsSources,
];

/** Base unificada: clubes / federaciones / asociaciones (+ Fedeski). */
export const outreachOrganizations: OutreachOrganization[] = [
  ...sportsAsOutreach,
  ...nonSportsOrganizations,
].filter((o) =>
  OUTREACH_MAILING_ORG_TYPES.includes(o.orgType),
);

export function organizationsByCategory(category: OutreachOrganization["category"]) {
  return outreachOrganizations.filter((o) => o.category === category);
}

export function organizationsForCampaignInterest(
  interest: NonNullable<OutreachOrganization["campaignInterests"]>[number],
) {
  return outreachOrganizations.filter((o) =>
    o.campaignInterests?.includes(interest),
  );
}
