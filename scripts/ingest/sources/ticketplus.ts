/**
 * TicketPlus CL — ticketera con API pública de búsqueda.
 * https://ticketplus.cl/events/search.json?q=…&searching=true
 */
import { shouldIngestScrapedEvent } from "../../../src/lib/demand/signal-relevance";
import {
  isSantiagoRelevant,
  parseLooseDate,
  toSignal,
  type SourceResult,
} from "../lib/signal-utils";

const SEARCH_URL = "https://ticketplus.cl/events/search.json";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const QUERIES = [
  "santiago",
  "providencia",
  "ñuñoa",
  "nunoa",
  "las condes",
  "movistar",
  "mapocho",
  "matucana",
  "estadio nacional",
  "parque o'higgins",
  "congreso santiago",
  "feria santiago",
  "expo santiago",
  "summit santiago",
  "espacio riesco",
  "metropolitan santiago",
];

type TpResult = {
  title?: string;
  location?: string | null;
  date?: string;
  url?: string;
  category?: string;
  event_id?: number;
  id?: string;
};

function isRmLocation(location: string): boolean {
  const t = location.toLowerCase();
  // "Santiago Trigo, Coquimbo" no es RM
  if (
    /coquimbo|valpara[ií]so|vi[nñ]a del mar|concepci[oó]n|la serena|temuco|antofagasta|iquique|rancagua|talca|chill[aá]n|osorno|puerto montt|arica|copiap|quillota|biob[ií]o|maule|araucan/i.test(
      t,
    )
  ) {
    return false;
  }
  return /santiago|regi[oó]n metropolitana|providencia|ñu[nñ]oa|nunoa|las condes|vitacura|lo barnechea|la reina|macul|pe[nñ]alol[eé]n|la florida|maip[uú]|san miguel|estacion central|estación central|independencia|recoleta|quilicura|huechuraba|pudahuel|cerrillos|el bosque|la cisterna|san joaqu[ií]n|la granja|pedro aguirre|cerro navia|lo prado|renca|conchal[ií]|lo espejo|san bernardo|puente alto|matucana|mapocho|movistar|nacional|o'?higgins/i.test(
    t,
  );
}

function shouldSkipTitle(title: string): boolean {
  if (/^(tienda|mercato|socio\b|abonado|escuela\b|merch|merchandise)\b/i.test(
    title.trim(),
  )) {
    return true;
  }
  return false;
}

function isCongressFairTitle(title: string, blob: string): boolean {
  return /\b(congreso|convencion|convención|simposio|summit|forum|foro|expo\b|feria|symposium|conference)\b/i.test(
    `${title} ${blob}`,
  );
}

async function search(q: string): Promise<TpResult[]> {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(q)}&searching=true`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const data = (await res.json()) as { results?: TpResult[] };
  return data.results ?? [];
}

export async function scrapeTicketPlus(): Promise<SourceResult> {
  const name = "ticketplus_cl";
  try {
    const year = new Date().getFullYear();
    const today = new Date().toISOString().slice(0, 10);
    const seen = new Set<string>();
    const signals = [];

    for (const q of QUERIES) {
      let results: TpResult[] = [];
      try {
        results = await search(q);
      } catch {
        continue;
      }

      for (const row of results) {
        const title = (row.title ?? "").replace(/\s+/g, " ").trim();
        if (title.length < 4 || shouldSkipTitle(title)) continue;

        const location = (row.location ?? "").trim();
        const blob = `${title} ${location} ${row.category ?? ""}`;
        if (location) {
          if (!isRmLocation(location)) continue;
        } else if (!isSantiagoRelevant(blob)) {
          continue;
        }

        const date = parseLooseDate(row.date ?? "", year);
        if (!date || date < today) continue;

        const key = `${row.event_id ?? row.id ?? title}-${date}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const description = `Evento TicketPlus${row.category ? ` · ${row.category}` : ""}${location ? ` · ${location}` : ""}.`;
        if (
          !shouldIngestScrapedEvent({
            title,
            description: `${description} ${blob}`,
            url: row.url,
          })
        ) {
          continue;
        }

        signals.push(
          toSignal({
            source: "ticketplus_cl",
            title,
            date,
            url: row.url,
            textForPoi: blob,
            description,
            intensity: /movistar|estadio nacional|mapocho|parque o'?higgins|lolla|creamfields/i.test(
              blob,
            )
              ? 8
              : isCongressFairTitle(title, blob)
                ? 7
                : 6,
          }),
        );
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
