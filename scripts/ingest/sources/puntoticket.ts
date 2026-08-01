import type { Page } from "playwright";
import {
  isSantiagoRelevant,
  parseLooseDate,
  toSignal,
  type SourceResult,
} from "../lib/signal-utils";

export async function scrapePuntoTicket(page: Page): Promise<SourceResult> {
  const name = "puntoticket";
  try {
    await page.goto("https://www.puntoticket.com/todos", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(2500);

    // Scroll para cargar más items lazy
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 1800);
      await page.waitForTimeout(400);
    }

    const cards = await page.evaluate(() => {
      const anchors = Array.from(
        document.querySelectorAll('a[href*="/evento/"]'),
      ) as HTMLAnchorElement[];
      return anchors.map((a) => {
        const href = a.href;
        const text = (a.textContent ?? "").replace(/\s+/g, " ").trim();
        const parentText = (a.closest("article, li, div")?.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 320);
        return { href, text: text.slice(0, 160), parentText };
      });
    });

    const year = new Date().getFullYear();
    const seen = new Set<string>();
    const signals = [];

    for (const card of cards) {
      const blob = `${card.text} ${card.parentText} ${card.href}`;
      if (!isSantiagoRelevant(blob) && !/movistar|santiago|caupolic|mapocho|coliseo|h[ií]pico|nacional/i.test(blob)) {
        // muchos eventos PT son RM; si el slug no tipa ciudad, igual incluimos venues conocidos
        if (!/movistar|caupolic|mapocho|coliseo|estadio|arena|santiago|teatro/i.test(card.href)) {
          continue;
        }
      }

      const date =
        parseLooseDate(blob, year) ||
        parseLooseDate(card.href, year);
      if (!date) continue;

      const title =
        card.text ||
        decodeURIComponent(card.href.split("/evento/")[1] ?? "evento")
          .replace(/-/g, " ")
          .slice(0, 120);
      if (title.length < 4) continue;

      const key = `${title}-${date}`;
      if (seen.has(key)) continue;
      seen.add(key);

      signals.push(
        toSignal({
          source: "puntoticket",
          title,
          date,
          url: card.href,
          textForPoi: blob,
          intensity: /movistar|estadio nacional|fauna|creamfields|karol|rosal/i.test(
            blob,
          )
            ? 8
            : 6,
          description: "Evento desde calendario PuntoTicket.",
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
