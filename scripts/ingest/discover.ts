/**
 * Discovery de demanda futura (web/RSS).
 *
 * No reemplaza scrapers: produce candidatos en data/ingested/discovery.json
 * para revisar y promover a señales/campañas.
 *
 * Uso: npm run ingest:discover
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEMAND_SOURCE_CATALOG } from "../../src/lib/demand/source-catalog";
import { parseLooseDate } from "./lib/signal-utils";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");

export type DiscoveryCandidate = {
  id: string;
  title: string;
  summary: string;
  url: string;
  sourceFeed: string;
  detectedAt: string;
  startsOn: string | null;
  santiagoHint: boolean;
  disciplineGuess: string;
  keywordsMatched: string[];
  action: "review" | "promote_sport" | "ignore_likely";
};

const RSS_FEEDS = [
  { id: "ind", url: "https://ind.cl/feed/" },
  { id: "fevochi", url: "https://www.fevochi.cl/feed/" },
];

const SEARCH_QUERIES = [
  "interescolar atletismo Estadio Nacional Santiago 2026",
  "torneo nacional hockey césped Santiago 2026",
  "campeonato voleibol Santiago Estadio Nacional 2026",
  "LNB Super 8 Santiago 2026",
  "torneo federado regiones Santiago 2026",
];

const SPORT_HINTS: Array<{ re: RegExp; discipline: string }> = [
  { re: /atletismo|interescolar|fedachi|record[oó]n/i, discipline: "atletismo" },
  { re: /hockey|fehoch|diablas|diablos/i, discipline: "hockey" },
  { re: /voleibol|v[oó]leibol|fevochi|fivb/i, discipline: "voleibol" },
  { re: /b[aá]squet|lnb|basket/i, discipline: "basquetbol" },
  { re: /tenis|copa davis|chile open/i, discipline: "tenis" },
  { re: /f[uú]tbol|anfp|campeonato chileno/i, discipline: "futbol" },
];

function stripTags(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 70);
}

function parseRss(xml: string) {
  return xml
    .split(/<item>/i)
    .slice(1)
    .map((block) => ({
      title: stripTags(block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
      link: stripTags(block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? ""),
      description: stripTags(
        block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "",
      ),
    }))
    .filter((i) => i.title);
}

function guessDiscipline(text: string): string {
  for (const h of SPORT_HINTS) {
    if (h.re.test(text)) return h.discipline;
  }
  return "multisport";
}

function matchedKeywords(text: string): string[] {
  const pool = DEMAND_SOURCE_CATALOG.flatMap((s) => s.keywords);
  const lower = text.toLowerCase();
  return [...new Set(pool.filter((k) => lower.includes(k.toLowerCase())))].slice(
    0,
    8,
  );
}

function classify(text: string, santiagoHint: boolean): DiscoveryCandidate["action"] {
  if (/curso|diplomado|capacitaci[oó]n|arbitro|árbitro|entrenador/i.test(text)) {
    return "ignore_likely";
  }
  if (
    santiagoHint &&
    /torneo|campeonato|mundial|final|interescolar|qualifier|copa|liga|nacional/i.test(
      text,
    )
  ) {
    return "promote_sport";
  }
  return "review";
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "text/html,application/rss+xml,application/xml",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** DuckDuckGo HTML (sin API key) — resultados ruidosos pero útiles como radar. */
async function searchDuckDuckGo(query: string): Promise<
  Array<{ title: string; url: string; snippet: string }>
> {
  const q = encodeURIComponent(query);
  const html = await fetchText(`https://html.duckduckgo.com/html/?q=${q}`);
  const results: Array<{ title: string; url: string; snippet: string }> = [];
  const blocks = html.split(/class="result__a"/i).slice(1);
  for (const block of blocks.slice(0, 6)) {
    const href = block.match(/href="([^"]+)"/i)?.[1] ?? "";
    const title = stripTags(block.match(/>([\s\S]*?)<\/a>/i)?.[1] ?? "");
    const snippet = stripTags(
      block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i)?.[1] ??
        block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\//i)?.[1] ??
        "",
    );
    if (title && href) results.push({ title, url: href, snippet });
  }
  return results;
}

function toCandidate(input: {
  title: string;
  summary: string;
  url: string;
  sourceFeed: string;
}): DiscoveryCandidate {
  const text = `${input.title} ${input.summary}`;
  const year = new Date().getFullYear();
  const startsOn =
    parseLooseDate(text, year) || parseLooseDate(text, year + 1);
  const santiagoHint =
    /santiago|ñu[nñ]oa|nunoa|estadio nacional|pe[nñ]alol|metropolitana|recoleta|providencia|las condes/i.test(
      text,
    );
  const keywordsMatched = matchedKeywords(text);
  return {
    id: `disc-${slug(`${input.sourceFeed}-${input.title}`)}`,
    title: input.title.slice(0, 160),
    summary: input.summary.slice(0, 320),
    url: input.url,
    sourceFeed: input.sourceFeed,
    detectedAt: new Date().toISOString(),
    startsOn,
    santiagoHint,
    disciplineGuess: guessDiscipline(text),
    keywordsMatched,
    action: classify(text, santiagoHint),
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const candidates: DiscoveryCandidate[] = [];
  const errors: string[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const xml = await fetchText(feed.url);
      for (const item of parseRss(xml)) {
        candidates.push(
          toCandidate({
            title: item.title,
            summary: item.description,
            url: item.link || feed.url,
            sourceFeed: `rss:${feed.id}`,
          }),
        );
      }
      console.log(`RSS ${feed.id}: ok`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`rss:${feed.id} — ${msg}`);
      console.log(`RSS ${feed.id}: fail — ${msg}`);
    }
  }

  for (const query of SEARCH_QUERIES) {
    try {
      const hits = await searchDuckDuckGo(query);
      for (const hit of hits) {
        candidates.push(
          toCandidate({
            title: hit.title,
            summary: `${hit.snippet} · query: ${query}`,
            url: hit.url,
            sourceFeed: "web:duckduckgo",
          }),
        );
      }
      console.log(`Search "${query.slice(0, 40)}…": ${hits.length} hits`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`search — ${msg}`);
      console.log(`Search fail — ${msg}`);
    }
  }

  // dedupe por título normalizado
  const byKey = new Map<string, DiscoveryCandidate>();
  for (const c of candidates) {
    const key = c.title.toLowerCase().slice(0, 90);
    const prev = byKey.get(key);
    if (!prev || (c.santiagoHint && !prev.santiagoHint)) byKey.set(key, c);
  }

  const list = [...byKey.values()].sort((a, b) => {
    const rank = (x: DiscoveryCandidate) =>
      x.action === "promote_sport" ? 0 : x.action === "review" ? 1 : 2;
    return rank(a) - rank(b) || (b.startsOn ?? "").localeCompare(a.startsOn ?? "");
  });

  const out = {
    ranAt: new Date().toISOString(),
    method:
      "RSS federaciones/IND + búsquedas DuckDuckGo HTML con queries de demanda regional→Santiago",
    counts: {
      total: list.length,
      promote_sport: list.filter((c) => c.action === "promote_sport").length,
      review: list.filter((c) => c.action === "review").length,
      ignore_likely: list.filter((c) => c.action === "ignore_likely").length,
    },
    catalogWatch: DEMAND_SOURCE_CATALOG.filter((s) => s.status !== "active").map(
      (s) => ({ id: s.id, name: s.name, status: s.status, url: s.url }),
    ),
    errors,
    candidates: list,
  };

  const outPath = path.join(OUT_DIR, "discovery.json");
  await writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(
    `\nDiscovery: ${list.length} candidatos → ${outPath} (promote ${out.counts.promote_sport})`,
  );
}

main();
