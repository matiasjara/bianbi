import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function guessPoi(text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes("movistar arena") || t.includes("movistar-arena"))
    return ["poi-movistar"];
  if (
    t.includes("estadio nacional") ||
    t.includes("julio martínez") ||
    t.includes("court central") ||
    t.includes("claudia schüler") ||
    t.includes("claudia schuler") ||
    t.includes("hockey césped") ||
    t.includes("hockey cesped") ||
    t.includes("velódromo") ||
    t.includes("velodromo") ||
    t.includes("peñalolén") ||
    t.includes("penalolen") ||
    t.includes("mario recordón") ||
    t.includes("mario recordon") ||
    t.includes("pista atlética") ||
    t.includes("pista atletica")
  )
    return ["poi-estadio"];
  if (t.includes("fantasilandia")) return ["poi-fantasilandia"];
  if (
    t.includes("o'higgins") ||
    t.includes("ohiggins") ||
    t.includes("parque o higgins") ||
    t.includes("parque o'higgins")
  )
    return ["poi-movistar", "poi-ohiggins"];
  if (t.includes("lastarria")) return ["poi-lastarria"];
  if (t.includes("barrio italia") || t.includes("italia")) return ["poi-italia"];
  if (t.includes("costanera")) return ["poi-costanera"];
  if (
    t.includes("caupolicán") ||
    t.includes("caupolican") ||
    t.includes("metropolitan") ||
    t.includes("teatro coliseo") ||
    t.includes("estación mapocho") ||
    t.includes("mapocho") ||
    t.includes("club hípico") ||
    t.includes("club hipico")
  )
    return ["poi-movistar", "poi-lastarria"];
  return [];
}

export function guessPropertyCodes(poiIds: string[], text = ""): string[] {
  const t = text.toLowerCase();
  if (poiIds.includes("poi-estadio") || poiIds.includes("poi-movistar")) {
    return ["Z114", "Z107", "E801", "E214", "T112"];
  }
  if (poiIds.includes("poi-fantasilandia")) {
    return ["T112"];
  }
  if (poiIds.includes("poi-italia") || poiIds.includes("poi-lastarria")) {
    return ["E801", "E214", "T112"];
  }
  return ["E801", "E214", "Z114", "Z107", "T112"];
}

export function isSantiagoRelevant(text: string): boolean {
  const t = text.toLowerCase();
  const exclude =
    /antofagasta|concepci[oó]n|valpara[ií]so|vi[nñ]a del mar|la serena|temuco|puerto montt|iquique|rancagua|talca|punta arenas|copiap[oó]|arica|chill[aá]n|osorno/;
  if (
    exclude.test(t) &&
    !/santiago|movistar|ñu[nñ]oa|nunoa|nacional|o'?higgins|mapocho|caupolic/.test(
      t,
    )
  ) {
    return false;
  }
  return /santiago|chile|movistar|estadio|arena|ñu[nñ]oa|nunoa|o'?higgins|mapocho|caupolic|metropolitan|coliseo|bicentenario|providencia|las condes|maip[uú]|la florida|macul|san miguel|estacion central/.test(
    t,
  );
}

const MONTHS_ES: Record<string, string> = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dic: "12",
};

export function parseLooseDate(
  raw: string,
  fallbackYear: number,
): string | null {
  const esFull = raw.match(
    /(\d{1,2})(?:\s*,\s*\d{1,2})*(?:\s*y\s*\d{1,2})?\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})/i,
  );
  if (esFull) {
    return `${esFull[3]}-${MONTHS_ES[esFull[2].toLowerCase()]}-${esFull[1].padStart(2, "0")}`;
  }

  const esNoYear = raw.match(
    /(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/i,
  );
  if (esNoYear) {
    return `${fallbackYear}-${MONTHS_ES[esNoYear[2].toLowerCase()]}-${esNoYear[1].padStart(2, "0")}`;
  }

  const iso = raw.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];

  const dmy = raw.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
    return `${year}-${month}-${day}`;
  }

  const slug = raw.match(
    /\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*-(\d{4})\b/i,
  );
  if (slug) {
    const month = MONTHS_ES[slug[1].toLowerCase().slice(0, 3)];
    return `${slug[2]}-${month}-15`;
  }

  return null;
}

export function toSignal(input: {
  source: DemandSignal["source"];
  title: string;
  date: string;
  description?: string;
  url?: string;
  intensity?: number;
  textForPoi?: string;
}): DemandSignal {
  const blob = `${input.title} ${input.textForPoi ?? ""} ${input.description ?? ""}`;
  const poiIds = guessPoi(blob);
  const potential = scoreEventPotential(input.title, blob);

  return {
    id: `${input.source}-${slugify(`${input.title}-${input.date}`)}`,
    kind: "event",
    source: input.source,
    title: input.title.slice(0, 140),
    description:
      input.description ??
      `Evento detectado desde ${input.source}. Verificar fecha/venue.`,
    startsOn: input.date,
    endsOn: input.date,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    audienceTags: ["eventos", "conciertos"],
    poiIds: poiIds.length ? poiIds : ["poi-movistar"],
    propertyCodesPreferred: guessPropertyCodes(poiIds, blob),
    url: input.url,
    scrapedAt: new Date().toISOString(),
  };
}

export type SourceResult = {
  name: string;
  ok: boolean;
  signals: DemandSignal[];
  error?: string;
};
