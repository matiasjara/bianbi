import type { Page } from "playwright";
import {
  isSantiagoRelevant,
  parseLooseDate,
  toSignal,
  type SourceResult,
} from "../lib/signal-utils";

export async function scrapeTicketmaster(page: Page): Promise<SourceResult> {
  const name = "ticketmaster_cl";
  try {
    await page.goto("https://www.ticketmaster.cl/search?q=Santiago", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(3000);

    const cards = await page.evaluate(() => {
      const nodes = Array.from(
        document.querySelectorAll(
          "a[href*='/event'], a[href*='/artist'], [data-testid='event-list-item'], li",
        ),
      );
      return nodes.slice(0, 100).map((el) => {
        const a =
          (el.closest("a") as HTMLAnchorElement | null) ??
          (el.querySelector("a") as HTMLAnchorElement | null);
        const href = a?.href ?? "";
        const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
        return { href, text: text.slice(0, 280) };
      });
    });

    const year = new Date().getFullYear();
    const seen = new Set<string>();
    const signals = [];

    for (const card of cards) {
      if (!card.text || card.text.length < 12) continue;
      if (!isSantiagoRelevant(card.text)) continue;
      const date = parseLooseDate(card.text, year);
      if (!date) continue;
      const title = card.text.slice(0, 120);
      const key = `${title}-${date}`;
      if (seen.has(key)) continue;
      seen.add(key);
      signals.push(
        toSignal({
          source: "ticketmaster_cl",
          title,
          date,
          url: card.href || undefined,
          textForPoi: card.text,
          intensity: /movistar|estadio nacional|lolla|coldplay|parque o/i.test(
            card.text,
          )
            ? 8
            : 6,
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
