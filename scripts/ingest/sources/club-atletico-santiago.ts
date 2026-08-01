/**
 * Torneos Club Atlético Santiago.
 * https://clubatleticosantiago.cl/torneos/
 *
 * Solo sedes RM / Estadio Nacional (el resto es mailing potencial
 * para colegios de regiones, pero no mueve noches en Santiago).
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import {
  guessPoi,
  guessPropertyCodes,
  slugify,
  type SourceResult,
} from "../lib/signal-utils";

const SOURCE_URL = "https://clubatleticosantiago.cl/torneos/";
const CONTACT = "secretaria@clubatleticosantiago.cl";

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  setiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function iso(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Parsea rangos tipo "8 a 10 de mayo de 2026" / "30 de octubre a 1 de noviembre de 2026". */
function parseSpanishRange(
  raw: string,
): { startsOn: string; endsOn: string } | null {
  const text = raw
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // "30 de octubre a 1 de noviembre de 2026"
  const cross = text.match(
    /(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+a\s+(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})/,
  );
  if (cross) {
    const y = Number(cross[5]);
    return {
      startsOn: iso(y, MONTHS[cross[2]], Number(cross[1])),
      endsOn: iso(y, MONTHS[cross[4]], Number(cross[3])),
    };
  }

  // "11 y 12 de abril de 2026" / "24 a 26 de abril de 2026"
  const sameMonth = text.match(
    /(\d{1,2})(?:\s*(?:y|a|,)\s*(\d{1,2}))?\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})/,
  );
  if (sameMonth) {
    const y = Number(sameMonth[4]);
    const m = MONTHS[sameMonth[3]];
    const d1 = Number(sameMonth[1]);
    const d2 = sameMonth[2] ? Number(sameMonth[2]) : d1;
    return { startsOn: iso(y, m, d1), endsOn: iso(y, m, d2) };
  }

  // "17 y 18 de octubre 2026" (sin "de" antes del año)
  const noDe = text.match(
    /(\d{1,2})(?:\s*(?:y|a)\s*(\d{1,2}))?\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+(\d{4})/,
  );
  if (noDe) {
    const y = Number(noDe[4]);
    const m = MONTHS[noDe[3]];
    const d1 = Number(noDe[1]);
    const d2 = noDe[2] ? Number(noDe[2]) : d1;
    return { startsOn: iso(y, m, d1), endsOn: iso(y, m, d2) };
  }

  return null;
}

function isSantiagoVenue(lugar: string, title: string): boolean {
  const t = `${lugar} ${title}`.toLowerCase();
  if (
    /osorno|temuco|iquique|valdivia|puerto montt|los [aá]ngeles|antofagasta|concepci[oó]n|la serena|rancagua/.test(
      t,
    )
  ) {
    return false;
  }
  return /santiago|estadio nacional|mario record[oó]n|escuela militar|pe[nñ]alol[eé]n|ñu[nñ]oa|recoleta|providencia/.test(
    t,
  );
}

type ParsedTournament = {
  title: string;
  lugar: string;
  fechaRaw: string;
};

function parseTournaments(html: string): ParsedTournament[] {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  // Emparejar cada bloque con título (h2/h3/h4) + Lugar + Fecha
  const chunks = clean.split(/<(?:h2|h3|h4)[^>]*>/i).slice(1);
  const out: ParsedTournament[] = [];

  for (const chunk of chunks) {
    const titleMatch = chunk.match(/^([\s\S]*?)<\/(?:h2|h3|h4)>/i);
    if (!titleMatch) continue;
    const title = titleMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    if (!/torneo|campeonato|interescolar|posta|atletismo/i.test(title)) {
      continue;
    }

    const body = chunk.slice(titleMatch[0].length);
    const lugar =
      body.match(/Lugar:\s*<\/strong>\s*([^<]+)/i)?.[1]?.trim() ??
      body.match(/Lugar:\s*([^<\n]+)/i)?.[1]?.trim() ??
      "";
    const fechaRaw =
      body.match(/Fecha:\s*<\/strong>\s*([^<]+)/i)?.[1]?.trim() ??
      body.match(/Fecha:\s*([^<\n]+)/i)?.[1]?.trim() ??
      "";

    if (!fechaRaw) continue;
    out.push({
      title,
      lugar: lugar
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .trim(),
      fechaRaw: fechaRaw.replace(/\s+/g, " ").trim(),
    });
  }

  return out;
}

function toSignal(t: ParsedTournament): DemandSignal | null {
  const range = parseSpanishRange(t.fechaRaw);
  if (!range) return null;
  if (!isSantiagoVenue(t.lugar, t.title)) return null;

  const blob = `${t.title} ${t.lugar} atletismo interescolar federado`;
  const poiIds = guessPoi(blob);
  const resolved =
    poiIds.length > 0
      ? poiIds
      : /escuela militar/i.test(t.lugar)
        ? ["poi-lastarria"]
        : ["poi-estadio"];
  const potential = scoreEventPotential(t.title, blob);
  const isInterescolar = /interescolar/i.test(t.title);
  const tags = [
    "deportes",
    "atletismo",
    "club_atletico_santiago",
    "federaciones",
    "mailing",
    ...(isInterescolar ? ["interescolar", "colegios", "regiones", "familias"] : []),
    ...(/master/i.test(t.title) ? ["master"] : []),
  ];

  return {
    id: `club_atletico_santiago-${slugify(`${t.title}-${range.startsOn}`)}`,
    kind: "sport",
    source: "club_atletico_santiago",
    title: t.title.slice(0, 140),
    description: `Torneo CAS · ${t.lugar}. Fecha: ${t.fechaRaw}. Contacto mailing: ${CONTACT}`,
    startsOn: range.startsOn,
    endsOn: range.endsOn,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    poiIds: resolved,
    audienceTags: tags,
    propertyCodesPreferred: guessPropertyCodes(resolved, blob).length
      ? guessPropertyCodes(resolved, blob)
      : ["Z114", "Z107", "E801", "E214"],
    url: SOURCE_URL,
    scrapedAt: new Date().toISOString(),
  };
}

export async function scrapeClubAtleticoSantiago(): Promise<SourceResult> {
  const name = "club_atletico_santiago";
  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      return {
        name,
        ok: false,
        signals: [],
        error: `HTTP ${res.status}`,
      };
    }
    const html = await res.text();
    const parsed = parseTournaments(html);
    const signals = parsed
      .map(toSignal)
      .filter((s): s is DemandSignal => Boolean(s));

    return {
      name,
      ok: true,
      signals,
      error:
        parsed.length === 0
          ? "No se parsearon torneos del HTML"
          : undefined,
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
