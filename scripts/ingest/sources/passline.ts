/**
 * Passline — a menudo detrás de Cloudflare.
 * Intentamos; si bloquea, el pipeline sigue con las demás fuentes.
 */
import type { Page } from "playwright";
import {
  isSantiagoRelevant,
  parseLooseDate,
  toSignal,
  type SourceResult,
} from "../lib/signal-utils";

export async function scrapePassline(page: Page): Promise<SourceResult> {
  const name = "passline";
  const urls = [
    "https://www.passline.com/eventos?pais=chile",
    "https://www.passline.com/eventos",
  ];

  try {
    let htmlOk = false;
    for (const url of urls) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(2500);
      const title = await page.title();
      if (/just a moment|cloudflare|attention required/i.test(title)) {
        continue;
      }
      htmlOk = true;

      const cards = await page.evaluate(() => {
        const anchors = Array.from(
          document.querySelectorAll("a[href*='event'], a[href*='ticket']"),
        ) as HTMLAnchorElement[];
        return anchors.slice(0, 80).map((a) => ({
          href: a.href,
          text: (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 220),
        }));
      });

      const year = new Date().getFullYear();
      const seen = new Set<string>();
      const signals = [];
      for (const card of cards) {
        if (!card.text || card.text.length < 8) continue;
        if (!isSantiagoRelevant(card.text)) continue;
        const date = parseLooseDate(card.text, year);
        if (!date) continue;
        const key = `${card.text}-${date}`;
        if (seen.has(key)) continue;
        seen.add(key);
        signals.push(
          toSignal({
            source: "passline",
            title: card.text,
            date,
            url: card.href,
            textForPoi: card.text,
          }),
        );
      }
      return { name, ok: true, signals };
    }

    return {
      name,
      ok: false,
      signals: [],
      error: htmlOk
        ? "Sin eventos parseables"
        : "Cloudflare / bot wall (Passline bloqueó el scrape)",
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
