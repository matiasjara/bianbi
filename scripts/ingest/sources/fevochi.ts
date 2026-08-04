/**
 * FEVOCHI — voleibol Chile.
 * - Catálogo: Mundial Femenino U17 Chile 2026 (Ñuñoa / Estadio Nacional)
 * - RSS noticias: https://www.fevochi.cl/feed/
 */
import type { DemandSignal } from "../../../src/lib/demand/types";
import { scoreEventPotential } from "../../../src/lib/demand/potential";
import {
  guessPropertyCodes,
  parseLooseDate,
  slugify,
  type SourceResult,
} from "../lib/signal-utils";

const FEED = "https://www.fevochi.cl/feed/";
const HOME = "https://www.fevochi.cl/";

const CURATED: Array<{
  title: string;
  description: string;
  startsOn: string;
  endsOn: string;
  url: string;
}> = [
  {
    title: "Mundial Femenino U17 de Voleibol Chile 2026",
    description:
      "Hito histórico: Chile organiza por primera vez un Mundial de vóleibol. Campeonato Mundial Femenino Sub-17 FIVB (6–16 ago 2026). Las Guerreras: 9 de 14 jugadoras de regiones. Debut 6 ago 20:00 vs República Checa. 24 selecciones. Sedes: Parque Estadio Nacional (Ñuñoa), San Felipe y Los Andes. Entradas Ticketpro desde $3.800.",
    startsOn: "2026-08-06",
    endsOn: "2026-08-16",
    url: "https://www.ticketpro.cl/evento/4526/campeonato-mundial-de-voleibol-femenino-sub17-de-chile--santiago-gim-deportes-colectivos",
  },
];

function stripTags(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml: string): Array<{
  title: string;
  link: string;
  description: string;
}> {
  const items: Array<{ title: string; link: string; description: string }> = [];
  const blocks = xml.split(/<item>/i).slice(1);
  for (const block of blocks) {
    const title = stripTags(
      block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "",
    );
    const link = stripTags(
      block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? "",
    );
    const description = stripTags(
      block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "",
    );
    if (title) items.push({ title, link, description });
  }
  return items;
}

function isCompetitionNews(title: string, description: string): boolean {
  const t = `${title} ${description}`.toLowerCase();
  if (/curso|arbitro|árbitro|entrenador|mini v[oó]ley|inscripciones para el curso/i.test(t)) {
    return false;
  }
  return /mundial|campeonato|circuito|cnvp|liga|liname|final|clasificatorio|sede|santiago|ñu[nñ]oa|estadio nacional/i.test(
    t,
  );
}

function toCuratedSignal(c: (typeof CURATED)[number]): DemandSignal {
  const blob = `${c.title} ${c.description}`;
  const potential = scoreEventPotential(c.title, blob);
  const poiIds = ["poi-estadio"];
  return {
    id: `fevochi-${slugify(`${c.title}-${c.startsOn}`)}`,
    kind: "sport",
    source: "fevochi",
    title: c.title,
    description: c.description,
    startsOn: c.startsOn,
    endsOn: c.endsOn,
    intensity: potential.intensity,
    potentialScore: potential.score,
    potentialTier: potential.tier,
    potentialFactors: potential.factors,
    poiIds,
    audienceTags: [
      "deportes",
      "voleibol",
      "fevochi",
      "internacional",
      "federaciones",
      "mailing",
      "mundial",
    ],
    propertyCodesPreferred: guessPropertyCodes(poiIds, blob),
    url: c.url,
    scrapedAt: new Date().toISOString(),
  };
}

function rssToSignal(item: {
  title: string;
  link: string;
  description: string;
}): DemandSignal | null {
  const year = new Date().getFullYear();
  const date =
    parseLooseDate(`${item.title} ${item.description}`, year) ||
    parseLooseDate(item.description, year + 1);
  if (!date) return null;

  // Solo si menciona Santiago / Nacional / Ñuñoa o es mundial Chile
  const blob = `${item.title} ${item.description}`;
  if (
    !/santiago|ñu[nñ]oa|nunoa|estadio nacional|chile 2026|mundial/i.test(blob)
  ) {
    return null;
  }

  const potential = scoreEventPotential(item.title, blob);
  const poiIds = /estadio|ñu[nñ]oa|nacional/i.test(blob)
    ? ["poi-estadio"]
    : ["poi-lastarria"];

  return {
    id: `fevochi-${slugify(`${item.title}-${date}`)}`,
    kind: "sport",
    source: "fevochi",
    title: item.title.slice(0, 140),
    description: item.description.slice(0, 280) || "Noticia FEVOCHI con potencial de demanda.",
    startsOn: date,
    endsOn: date,
    intensity: Math.max(3, potential.intensity - 1),
    potentialScore: Math.max(30, (potential.score ?? 40) - 10),
    potentialTier: potential.tier,
    potentialFactors: [
      ...(potential.factors ?? []),
      "detectado vía RSS FEVOCHI",
    ],
    poiIds,
    audienceTags: [
      "deportes",
      "voleibol",
      "fevochi",
      "federaciones",
      "mailing",
      "rss",
    ],
    propertyCodesPreferred: guessPropertyCodes(poiIds, blob),
    url: item.link || HOME,
    scrapedAt: new Date().toISOString(),
  };
}

export async function scrapeFevochi(): Promise<SourceResult> {
  const name = "fevochi";
  try {
    const signals = CURATED.map(toCuratedSignal);

    try {
      const res = await fetch(FEED, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const xml = await res.text();
        for (const item of parseRssItems(xml)) {
          if (!isCompetitionNews(item.title, item.description)) continue;
          const s = rssToSignal(item);
          if (s) signals.push(s);
        }
      }
    } catch {
      // RSS opcional
    }

    // dedupe por id
    const byId = new Map(signals.map((s) => [s.id, s]));
    return { name, ok: true, signals: [...byId.values()] };
  } catch (e) {
    return {
      name,
      ok: false,
      signals: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
