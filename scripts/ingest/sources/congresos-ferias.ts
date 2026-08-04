/**
 * Congresos y ferias sectoriales en Santiago RM — catálogo curado.
 * Fuentes: Revista Eventos, Espacio Riesco, calendarios MICE sectoriales.
 * Fechas sujetas a confirmación oficial del organizador.
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import {
  guessPoi,
  guessPropertyCodes,
  slugify,
  type SourceResult,
} from "../lib/signal-utils";

type CuratedCongressFair = {
  title: string;
  description: string;
  startsOn: string;
  endsOn: string;
  venue: string;
  audienceTags: string[];
  url?: string;
  intensity?: number;
};

/** Solo eventos en Santiago / RM con draw de pernocta corporativa o sectorial. */
const CURATED_SANTIAGO_2026: CuratedCongressFair[] = [
  {
    title: "ICPC Championship Latam",
    description:
      "Competencia latinoamericana de programación (ICPC). Delegaciones universitarias de la región → pernocta en Santiago.",
    startsOn: "2026-03-02",
    endsOn: "2026-03-07",
    venue: "Santiago",
    audienceTags: ["congresos", "ferias", "tecnologia", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Congreso ACADES",
    description:
      "Congreso nacional de administración de empresas. Asistentes de regiones y sector corporativo en Metropolitan Santiago.",
    startsOn: "2026-03-17",
    endsOn: "2026-03-19",
    venue: "Metropolitan Santiago Convention & Event Center, Las Condes",
    audienceTags: ["congresos", "negocios", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Congreso Latinoamericano de Imagen 360",
    description:
      "5° edición del congreso latinoamericano de imagen y comunicación visual. Público profesional regional.",
    startsOn: "2026-03-26",
    endsOn: "2026-03-29",
    venue: "Santiago",
    audienceTags: ["congresos", "mice", "internacional", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "FIDAE — Feria Internacional del Aire y del Espacio",
    description:
      "Mayor feria aeroespacial y defensa de Latinoamérica. Expositores y delegaciones internacionales en Santiago.",
    startsOn: "2026-04-07",
    endsOn: "2026-04-12",
    venue: "Base Aérea Pudahuel / recintos FIDAE, Santiago",
    audienceTags: ["ferias", "congresos", "internacional", "mice", "defensa"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
    intensity: 9,
  },
  {
    title: "Congreso América Digital",
    description:
      "Cumbre de tecnología y negocios digitales en Cono Sur. Ejecutivos y equipos de transformación digital.",
    startsOn: "2026-04-08",
    endsOn: "2026-04-09",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["congresos", "tecnologia", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "World Copper Conference",
    description:
      "Conferencia internacional del cobre. Minería, energía y delegaciones globales en Santiago.",
    startsOn: "2026-04-13",
    endsOn: "2026-04-15",
    venue: "Santiago",
    audienceTags: ["congresos", "mineria", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Circlepack by Cenem",
    description:
      "Expo-congreso de packaging y envases. Industria alimentaria y retail — asistentes de todo Chile.",
    startsOn: "2026-04-14",
    endsOn: "2026-04-16",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "congresos", "industria", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "ExpoDent",
    description:
      "Exposición y congreso de odontología. Profesionales de salud dental de regiones y Latinoamérica.",
    startsOn: "2026-04-24",
    endsOn: "2026-04-25",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "congresos", "salud", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Chile Fintech Forum",
    description:
      "Foro fintech con startups, bancos e inversores. Viajes corporativos y pernocta de equipos regionales.",
    startsOn: "2026-05-04",
    endsOn: "2026-05-06",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["congresos", "ferias", "tecnologia", "negocios", "mice"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "ExpoBebé",
    description:
      "Feria de puericultura y familia. Expositores nacionales y visitantes de regiones en Metropolitan.",
    startsOn: "2026-05-29",
    endsOn: "2026-05-31",
    venue: "Metropolitan Santiago, Las Condes",
    audienceTags: ["ferias", "familias", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Expo Vivienda",
    description:
      "Feria inmobiliaria y hogar en Estación Mapocho. Compradores y expositores de fuera de Santiago.",
    startsOn: "2026-05-29",
    endsOn: "2026-05-31",
    venue: "Centro Cultural Estación Mapocho, Santiago",
    audienceTags: ["ferias", "negocios", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Motortec",
    description:
      "Feria de autopartes, lubricantes y servicios automotrices. Distribuidores y talleres de regiones.",
    startsOn: "2026-06-18",
    endsOn: "2026-06-20",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "industria", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Smart City Expo Santiago",
    description:
      "Cumbre de ciudades inteligentes, movilidad y sostenibilidad urbana. Delegaciones público-privadas.",
    startsOn: "2026-07-08",
    endsOn: "2026-07-10",
    venue: "Santiago",
    audienceTags: ["congresos", "tecnologia", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Money Expo Global",
    description:
      "Expo de servicios financieros, trading e inversiones. Asistentes nacionales e internacionales.",
    startsOn: "2026-07-24",
    endsOn: "2026-07-26",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "congresos", "negocios", "mice"],
    url: "https://www.nferias.com/espacio-riesco/",
  },
  {
    title: "Business Travel Expo BTE",
    description:
      "Encuentro de viajes corporativos y turismo de negocios (MICE). Compradores y proveedores de la región.",
    startsOn: "2026-08-13",
    endsOn: "2026-08-13",
    venue: "Metropolitan Santiago, Las Condes",
    audienceTags: ["congresos", "negocios", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Expo Salud",
    description:
      "Principal feria-congreso de salud en Chile. Directivos, clínicas y proveedores médicos de todo el país.",
    startsOn: "2026-09-02",
    endsOn: "2026-09-04",
    venue: "Metropolitan Santiago, Las Condes",
    audienceTags: ["ferias", "congresos", "salud", "mice", "internacional", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
    intensity: 8,
  },
  {
    title: "InsurteChile / EILA",
    description:
      "Congreso-feria de seguros y latinoamerica insurance. Ejecutivos del sector en Centro Parque.",
    startsOn: "2026-09-03",
    endsOn: "2026-09-04",
    venue: "Centro Parque, Providencia",
    audienceTags: ["congresos", "ferias", "negocios", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Hyvolution Chile",
    description:
      "Expo y congreso del hidrógeno verde. Energía, minería y delegaciones internacionales.",
    startsOn: "2026-09-08",
    endsOn: "2026-09-10",
    venue: "Metropolitan Santiago, Las Condes",
    audienceTags: ["congresos", "ferias", "energia", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Expo Mercado Público",
    description:
      "Mayor encuentro de compras públicas del país. Proveedores y servicios de regiones en Espacio Riesco.",
    startsOn: "2026-09-09",
    endsOn: "2026-09-10",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "congresos", "negocios", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Seguridad Expo",
    description:
      "Feria de seguridad, emergencias y ciberseguridad. Integradores y empresas de todo Chile.",
    startsOn: "2026-09-23",
    endsOn: "2026-09-25",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "congresos", "industria", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Congreso Mundial de Medicina del Deporte",
    description:
      "Congreso mundial con médicos del deporte y federaciones. Delegaciones internacionales en Santiago.",
    startsOn: "2026-09-24",
    endsOn: "2026-09-27",
    venue: "Santiago",
    audienceTags: ["congresos", "salud", "deportes", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
    intensity: 8,
  },
  {
    title: "Espacio Food & Service",
    description:
      "Mayor feria de industria alimentaria en Chile (+25.000 profesionales). Horeca y retail de regiones.",
    startsOn: "2026-09-29",
    endsOn: "2026-10-01",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "gastronomia", "mice", "regiones", "internacional"],
    url: "https://www.espacioriesco.cl/",
    intensity: 9,
  },
  {
    title: "Congreso Chileno de Radiología",
    description:
      "Congreso nacional de radiología e imagenología. Médicos especialistas de regiones.",
    startsOn: "2026-10-08",
    endsOn: "2026-10-10",
    venue: "Santiago",
    audienceTags: ["congresos", "salud", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Congreso Internacional de Medicina Estética y Regenerativa",
    description:
      "Congreso médico-estético con participantes latinoamericanos. Pernocta de delegaciones.",
    startsOn: "2026-10-08",
    endsOn: "2026-10-10",
    venue: "Santiago",
    audienceTags: ["congresos", "salud", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Edifica",
    description:
      "Feria de construcción más relevante de Latinoamérica. Expositores, arquitectos y constructoras regionales.",
    startsOn: "2026-10-20",
    endsOn: "2026-10-22",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "construccion", "mice", "internacional", "regiones"],
    url: "https://www.espacioriesco.cl/",
    intensity: 9,
  },
  {
    title: "Feria VYVA",
    description:
      "Feria de vinos, vitivinicultura y bebidas. Productores y compradores nacionales.",
    startsOn: "2026-10-23",
    endsOn: "2026-10-25",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "gastronomia", "mice", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "Experiencia E",
    description:
      "Feria de eventos, producción y experiencias. Industria MICE y marketing en Espacio Riesco.",
    startsOn: "2026-11-05",
    endsOn: "2026-11-08",
    venue: "Espacio Riesco, Huechuraba",
    audienceTags: ["ferias", "congresos", "mice", "negocios", "regiones"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
  },
  {
    title: "EHA — European Hematology Association",
    description:
      "Congreso europeo de hematología en Santiago. Delegaciones médicas internacionales.",
    startsOn: "2026-11-05",
    endsOn: "2026-11-06",
    venue: "Santiago",
    audienceTags: ["congresos", "salud", "mice", "internacional"],
    url: "https://revistaeventos.cl/chile-congresos-y-ferias-2026/",
    intensity: 8,
  },
];

function toCongressSignal(ev: CuratedCongressFair): DemandSignal {
  const blob = `${ev.title} ${ev.description} ${ev.venue}`;
  const poiIds = guessPoi(blob);
  const resolvedPois =
    poiIds.length > 0
      ? poiIds
      : /espacio riesco|huechuraba/i.test(blob)
        ? ["poi-espacio-riesco"]
        : /metropolitan/i.test(blob)
          ? ["poi-metropolitan"]
          : /centro parque/i.test(blob)
            ? ["poi-centro-parque"]
            : /las condes|vitacura/i.test(blob)
              ? ["poi-metropolitan"]
              : ["poi-lastarria"];
  const potential = scoreEventPotential(ev.title, blob);

  return {
    id: `congresos_ferias_cl-${slugify(`${ev.title}-${ev.startsOn}`)}`,
    kind: "event",
    source: "congresos_ferias_cl",
    title: ev.title,
    description: ev.description,
    startsOn: ev.startsOn,
    endsOn: ev.endsOn,
    intensity: ev.intensity ?? potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    poiIds: resolvedPois,
    audienceTags: ev.audienceTags,
    propertyCodesPreferred: guessPropertyCodes(resolvedPois, blob),
    url: ev.url,
    scrapedAt: new Date().toISOString(),
    city: "santiago",
  };
}

export async function scrapeCongresosFerias(): Promise<SourceResult> {
  const name = "congresos_ferias_cl";
  try {
    const signals = CURATED_SANTIAGO_2026.map(toCongressSignal);
    return { name, ok: true, signals };
  } catch (e) {
    return {
      name,
      ok: false,
      signals: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
