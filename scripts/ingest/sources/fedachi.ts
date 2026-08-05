/**
 * FEDACHI — calendario oficial de atletismo.
 * API: https://fedachi-web-backend-production.up.railway.app/api/calendar?limit=1000
 * UI: https://fedachi.cl/calendar
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import {
  guessPropertyCodes,
  slugify,
  type SourceResult,
} from "../lib/signal-utils";

const API =
  "https://fedachi-web-backend-production.up.railway.app/api/calendar?limit=1000";
const SOURCE_URL = "https://fedachi.cl/calendar";

type FedachiEvent = {
  _id?: string;
  name: string;
  date: string;
  location?: string;
  type?: string;
  description?: string;
  registrationUrl?: string;
};

function isSantiago(location: string): boolean {
  return /santiago/i.test(location);
}

function toDate(iso: string): string {
  return iso.slice(0, 10);
}

type FedachiEnrichment = {
  endsOn?: string;
  description?: string;
  url?: string;
  poiIds?: string[];
};

const FEDACHI_ENRICHMENTS: Array<{ match: RegExp; enrich: FedachiEnrichment }> =
  [
    {
      match: /campeonato nacional u16/i,
      enrich: {
        description:
          "Campeonato Nacional U16 FEDACHI · 12 sep 2026 · Santiago, Chile. Sede por confirmar.",
        poiIds: [],
      },
    },
    {
      match: /campeonato nacional u18/i,
      enrich: {
        endsOn: "2026-09-06",
        description:
          "Campeonato Nacional U18 FEDACHI · 5–6 sep 2026 · Estadio Atlético Mario Recordón, Parque Estadio Nacional. Inscripciones vía asociaciones regionales.",
        url: "https://www.instagram.com/p/Danr5lvkV4S",
      },
    },
    {
      match: /sudamericano marat[oó]n fedachi marathon/i,
      enrich: {
        description:
          "FEDACHI Marathon Sudamericano 2026 · 15 nov, 06:30 · Estadio Nacional · distancias 5K, 10K, 21K y 42K (Campeonato Sudamericano). Inscripción en fedachimarathon.cl.",
        url: "https://fedachimarathon.cl/",
      },
    },
  ];

function applyFedachiEnrichment(
  ev: FedachiEvent,
  signal: DemandSignal,
): DemandSignal {
  for (const { match, enrich } of FEDACHI_ENRICHMENTS) {
    if (match.test(ev.name)) {
      return {
        ...signal,
        endsOn: enrich.endsOn ?? signal.endsOn,
        description: enrich.description ?? signal.description,
        url: enrich.url ?? signal.url,
        poiIds: enrich.poiIds ?? signal.poiIds,
        propertyCodesPreferred:
          enrich.poiIds !== undefined
            ? guessPropertyCodes(enrich.poiIds, signal.title)
            : signal.propertyCodesPreferred,
      };
    }
  }
  return signal;
}

function toSignal(ev: FedachiEvent): DemandSignal {
  const date = toDate(ev.date);
  const blob = `${ev.name} ${ev.location ?? ""} atletismo fedachi nacional`;
  const potential = scoreEventPotential(ev.name, blob);
  const poiIds = ["poi-estadio"];
  const tags = [
    "deportes",
    "atletismo",
    "fedachi",
    "federaciones",
    "mailing",
    "regiones",
    ...(ev.type ? [ev.type.toLowerCase()] : []),
  ];

  const rawName = ev.name.replace(/\s+/g, " ").trim();
  const title = /atletismo/i.test(rawName)
    ? rawName.slice(0, 140)
    : `Atletismo · ${rawName}`.slice(0, 140);

  const signal: DemandSignal = {
    id: `fedachi-${slugify(`${ev.name}-${date}`)}`,
    kind: "sport",
    source: "fedachi",
    title,
    description:
      ev.description?.trim() ||
      `Atletismo FEDACHI ${ev.type ?? "competencia"} · ${ev.location ?? "Santiago"}. Asociaciones regionales → mailing.`,
    startsOn: date,
    endsOn: date,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    poiIds,
    audienceTags: tags,
    propertyCodesPreferred: guessPropertyCodes(poiIds, blob),
    url: ev.registrationUrl || SOURCE_URL,
    scrapedAt: new Date().toISOString(),
  };
  return applyFedachiEnrichment(ev, signal);
}

export async function scrapeFedachi(): Promise<SourceResult> {
  const name = "fedachi";
  try {
    const res = await fetch(API, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      return { name, ok: false, signals: [], error: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { events?: FedachiEvent[] };
    const events = data.events ?? [];
    const signals = events
      .filter((e) => e?.name && e?.date && isSantiago(e.location ?? ""))
      .map(toSignal);

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
