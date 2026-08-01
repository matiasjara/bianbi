/**
 * Grandes eventos deportivos IND Chile 2026.
 * Fuente editorial: https://ind.cl/noticias/grandes-eventos-que-marcan-el-2026/
 *
 * Prioriza sedes en Santiago (Estadio Nacional, Peñalolén, etc.).
 * Ironman Pucón y eventos fuera de la RM se omiten para el inventario actual.
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import {
  guessPoi,
  guessPropertyCodes,
  slugify,
  type SourceResult,
} from "../lib/signal-utils";

const SOURCE_URL =
  "https://ind.cl/noticias/grandes-eventos-que-marcan-el-2026/";

type CuratedIndEvent = {
  title: string;
  description: string;
  startsOn: string;
  endsOn: string;
  venue: string;
  audienceTags: string[];
  /** Preferencias de inventorio si el venue no mapea a POI. */
  propertyCodesPreferred?: string[];
};

/** Catálogo curado desde la nota IND + fechas públicas confirmadas. */
const CURATED_SANTIAGO_2026: CuratedIndEvent[] = [
  {
    title: "Copa Davis · Chile vs Serbia",
    description:
      "IND 2026: serie Copa Davis en el Court Central del Parque Estadio Nacional. Atrae público nacional e hinchada viajera.",
    startsOn: "2026-02-06",
    endsOn: "2026-02-07",
    venue: "Court Central, Parque Estadio Nacional, Ñuñoa",
    audienceTags: [
      "deportes",
      "tenis",
      "copa_davis",
      "internacional",
      "federaciones",
      "mailing",
    ],
    propertyCodesPreferred: ["Z114", "Z107", "E801", "E214"],
  },
  {
    title: "Panamericano de Ciclismo en Pista",
    description:
      "IND 2026: Panamericano de ciclismo en pista en el Velódromo de Peñalolén. Delegaciones del continente → pernocta en Santiago.",
    startsOn: "2026-02-16",
    endsOn: "2026-02-22",
    venue: "Velódromo de Peñalolén, Santiago",
    audienceTags: [
      "deportes",
      "ciclismo",
      "panamericano",
      "internacional",
      "federaciones",
      "regiones",
      "mailing",
    ],
    propertyCodesPreferred: ["Z114", "Z107", "E801", "E214", "T112"],
  },
  {
    title: "Chile Open (ATP)",
    description:
      "IND 2026: Chile Open entre fines de febrero e inicios de marzo. Turismo deportivo y público ATP en Santiago.",
    startsOn: "2026-02-23",
    endsOn: "2026-03-01",
    venue: "Santiago (circuito ATP Chile Open)",
    audienceTags: [
      "deportes",
      "tenis",
      "chile_open",
      "internacional",
      "turismo",
      "mailing",
    ],
    propertyCodesPreferred: ["E801", "E214", "Z114", "Z107", "T112"],
  },
  {
    title: "FIH World Cup Qualifiers Santiago 2026",
    description:
      "IND 2026: clasificatorio mundial de hockey césped en el Centro Claudia Schüler (Parque Estadio Nacional). Diablas/Diablos de local + selecciones visitantes. Ideal mailing a federaciones/clubes FEHOCH.",
    startsOn: "2026-03-01",
    endsOn: "2026-03-08",
    venue:
      "Centro Deportivo de Hockey Césped Claudia Schüler, Parque Estadio Nacional",
    audienceTags: [
      "deportes",
      "hockey",
      "fih",
      "internacional",
      "federaciones",
      "regiones",
      "mailing",
    ],
    propertyCodesPreferred: ["Z114", "Z107", "E801", "E214"],
  },
];

function toIndSignal(ev: CuratedIndEvent): DemandSignal {
  const blob = `${ev.title} ${ev.description} ${ev.venue}`;
  const poiIds = guessPoi(blob);
  const resolvedPois =
    poiIds.length > 0
      ? poiIds
      : /estadio nacional|ñuñoa|nunoa|hockey/i.test(blob)
        ? ["poi-estadio"]
        : ["poi-lastarria"];
  const potential = scoreEventPotential(ev.title, blob);

  return {
    id: `ind_cl-${slugify(`${ev.title}-${ev.startsOn}`)}`,
    kind: "sport",
    source: "ind_cl",
    title: ev.title,
    description: ev.description,
    startsOn: ev.startsOn,
    endsOn: ev.endsOn,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    poiIds: resolvedPois,
    audienceTags: ev.audienceTags,
    propertyCodesPreferred:
      ev.propertyCodesPreferred ?? guessPropertyCodes(resolvedPois, blob),
    url: SOURCE_URL,
    scrapedAt: new Date().toISOString(),
  };
}

export async function scrapeIndGrandesEventos(): Promise<SourceResult> {
  const name = "ind_cl";
  try {
    // Validar que la nota IND sigue online (no bloquea si falla: usamos catálogo).
    let live = false;
    try {
      const res = await fetch(SOURCE_URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const html = await res.text();
        live =
          /copa davis|ciclismo en pista|chile open|fih|hockey/i.test(html) &&
          /2026/.test(html);
      }
    } catch {
      live = false;
    }

    const signals = CURATED_SANTIAGO_2026.map(toIndSignal);
    return {
      name,
      ok: true,
      signals,
      error: live
        ? undefined
        : "Nota IND no verificada en vivo; se usó catálogo curado 2026",
    };
  } catch (e) {
    return {
      name,
      ok: false,
      signals: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
