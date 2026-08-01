/**
 * Tocador.es / tocador.cl — agenda editorial de conciertos Chile.
 * HTML estable (tablas). No requiere Playwright.
 */
import {
  isSantiagoRelevant,
  parseLooseDate,
  toSignal,
  type SourceResult,
} from "../lib/signal-utils";

export async function scrapeTocador(): Promise<SourceResult> {
  const name = "tocador";
  try {
    const res = await fetch("https://tocador.cl/conciertos-chile/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DemandEngineBot/0.1; +local)",
        "Accept-Language": "es-CL,es;q=0.9",
      },
    });
    if (!res.ok) {
      return { name, ok: false, signals: [], error: `HTTP ${res.status}` };
    }
    const html = await res.text();

    const yearMatch = html.match(/Conciertos Chile\s+(\d{4})/i);
    const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();

    const rowRe =
      /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;
    const strip = (s: string) =>
      s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

    const seen = new Set<string>();
    const signals = [];
    let m: RegExpExecArray | null;
    while ((m = rowRe.exec(html))) {
      const artist = strip(m[1]);
      const dateRaw = strip(m[2]);
      const venue = strip(m[3]);
      const ticketera = strip(m[4]);
      if (!artist || artist.toLowerCase() === "artista o evento") continue;

      const blob = `${artist} ${dateRaw} ${venue} ${ticketera}`;
      if (!isSantiagoRelevant(blob) && !/movistar|santiago|arena|caupolic|coliseo|h[ií]pico|mapocho|nacional|metr[oó]nomo/i.test(venue)) {
        continue;
      }

      const date = parseLooseDate(`${dateRaw} ${year}`, year);
      if (!date) continue;

      const title = `${artist} — ${venue}`;
      const key = `${title}-${date}`;
      if (seen.has(key)) continue;
      seen.add(key);

      signals.push(
        toSignal({
          source: "tocador",
          title,
          date,
          textForPoi: blob,
          intensity: /movistar arena|estadio nacional/i.test(venue) ? 8 : 6,
          description: `Agenda Tocador · ticketera: ${ticketera}`,
          url: "https://tocador.cl/conciertos-chile/",
        }),
      );
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
