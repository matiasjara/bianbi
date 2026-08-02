/**
 * Contactos de outreach fuera del núcleo deportivo (clubes / federaciones / asociaciones).
 *
 * Criterio: solo organizaciones con gente afiliada o cercana que pueda ser
 * arrendataria potencial. No ticketeras, productoras, venues, ni agencias
 * estatales / gremios empresariales de turismo.
 */
import type { OutreachOrganization, OutreachSource } from "@/lib/types";

export const outreachSources: OutreachSource[] = [
  {
    id: "manual_outreach",
    name: "Curaduría Crambie",
    url: "/base-datos",
  },
];

export const nonSportsOrganizations: OutreachOrganization[] = [
  {
    id: "out-fedeski",
    name: "Federación de Ski y Snowboard de Chile",
    category: "nieve_turismo",
    orgType: "federacion",
    segment: "Ski / snowboard",
    region: "Nacional",
    emails: ["fedeski@fedeskichile.cl"],
    phones: ["+56 2 2825 6189"],
    address: "Av. Ramón Cruz 1176, Of. 510, Ñuñoa",
    source: "manual_outreach",
    sourceUrl: "https://fedeskichile.cl/",
    website: "https://fedeskichile.cl/",
    mailingReady: true,
    campaignInterests: ["nieve"],
  },
];
