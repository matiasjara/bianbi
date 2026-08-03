/**
 * FEHOCH — torneos nacionales de hockey césped.
 * https://atn.fehoch.cl/es/tournaments
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import {
  guessPropertyCodes,
  slugify,
  type SourceResult,
} from "../lib/signal-utils";
import { isRelevantFehochTournamentName } from "../../../src/lib/demand/hockey-group";

const LIST_URL = "https://atn.fehoch.cl/es/tournaments";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type Row = { id: string; name: string };

function parseRows(html: string): Row[] {
  const rows: Row[] = [];
  const re =
    /\/es\/tournament\/(\d+)\/summary[\s\S]{0,900}?colstyle-nombre[^>]*>\s*([^<]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const id = m[1];
    const name = m[2].replace(/\s+/g, " ").trim();
    if (name.length > 4) rows.push({ id, name });
  }
  // dedupe
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

function isValidIsoDate(s: string): boolean {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(s)) return false;
  const ms = Date.parse(`${s}T12:00:00Z`);
  if (Number.isNaN(ms)) return false;
  return new Date(ms).toISOString().slice(0, 10) === s;
}

function extractDates(html: string): string[] {
  return [
    ...new Set(
      (html.match(/\d{4}-\d{2}-\d{2}/g) ?? []).filter(isValidIsoDate),
    ),
  ].sort();
}

function looksNationalSantiago(name: string, html: string): boolean {
  const blob = `${name} ${html}`.toLowerCase();
  // Torneos nacionales FEHOCH suelen jugarse en recintos IND / Nacional
  if (!/nacional|clausura|apertura|intermedia|primera|juvenil|infantil|qualifier|fih/i.test(name)) {
    return false;
  }
  return /nacional|santiago|ñuñoa|nunoa|estadio|claudia sch/i.test(blob);
}

function formatFehochTitle(raw: string): string {
  let detail = raw.replace(/\s+/g, " ").trim();
  detail = detail.replace(/^20\d{2}\s*[-–:]?\s*/i, "");
  detail = detail.replace(/\s*Torneo\s+Nacional\s*$/i, "");
  detail = detail.replace(/\bTorneo\s+Nacional\b/gi, "");
  detail = detail.replace(/\s*[-–]\s*/g, " ").replace(/\s+/g, " ").trim();
  return `Hockey césped · ${detail}`.slice(0, 140);
}

function toSignal(row: Row, dates: string[]): DemandSignal | null {
  if (dates.length === 0) return null;
  const startsOn = dates[0];
  const endsOn = dates[dates.length - 1];
  const startMs = Date.parse(startsOn);
  const endMs = Date.parse(endsOn);
  const days = (endMs - startMs) / 86400000;

  const title = formatFehochTitle(row.name);
  const blob = `${title} hockey césped fehoch estadio nacional`;
  const potential = scoreEventPotential(title, blob);
  const poiIds = ["poi-estadio"];

  return {
    id: `fehoch_tournaments-${slugify(`${row.name}-${startsOn}`)}`,
    kind: "sport",
    source: "fehoch_tournaments",
    title,
    description: `Hockey césped FEHOCH · ${startsOn} → ${endsOn}${days > 45 ? " (temporada larga)" : ""}. Sedes típicas Parque Estadio Nacional. Mailing a clubes/federación.`,
    startsOn,
    endsOn,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    poiIds,
    audienceTags: [
      "deportes",
      "hockey",
      "fehoch",
      "federaciones",
      "regiones",
      "mailing",
      "torneo_nacional",
    ],
    propertyCodesPreferred: guessPropertyCodes(poiIds, blob),
    url: `https://atn.fehoch.cl/es/tournament/${row.id}/summary`,
    scrapedAt: new Date().toISOString(),
  };
}

export async function scrapeFehochTournaments(): Promise<SourceResult> {
  const name = "fehoch_tournaments";
  try {
    const listHtml = await fetchText(LIST_URL);
    const rows = parseRows(listHtml).slice(0, 40);
    const signals: DemandSignal[] = [];

    for (const row of rows) {
      try {
        if (!isRelevantFehochTournamentName(row.name)) continue;
        const detail = await fetchText(
          `https://atn.fehoch.cl/es/tournament/${row.id}/summary`,
        );
        if (!looksNationalSantiago(row.name, detail)) continue;
        const dates = extractDates(detail);
        const signal = toSignal(row, dates);
        if (signal) signals.push(signal);
      } catch {
        // seguir con el siguiente torneo
      }
    }

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
