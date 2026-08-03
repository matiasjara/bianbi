import type { Page } from "playwright";
import type { DemandSignal } from "../../../src/lib/demand/types";
import { parseLooseDate, toSignal, type SourceResult } from "../lib/signal-utils";
import {
  matchNearbyVenue,
  puntoticketVenuePages,
  type NearbyVenue,
} from "../lib/nearby-venues";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseVenueDate(dateText: string, fallbackYear: number): string | null {
  const normalized = dateText.replace(/\s+/g, " ").trim();
  const whole = parseLooseDate(normalized, fallbackYear);
  if (!/\s+y\s+\d{1,2}\s+de\s+|-\s*\d{1,2}\s+de\s+/i.test(normalized)) {
    return whole;
  }

  const firstSegment = normalized.split(/\s+-\s+|\s+y\s+/i)[0]?.trim();
  if (!firstSegment) return whole;

  return (
    parseLooseDate(`${firstSegment} ${fallbackYear}`, fallbackYear) ??
    parseLooseDate(firstSegment, fallbackYear) ??
    whole
  );
}

function isValidEventTitle(title: string) {
  if (title.length < 3) return false;
  return !/¿cómo llegar|estacionamientos|revisa nuestra cartelera|entérate primero|punto ticket/i.test(
    title,
  );
}

function parseBlockTitleAndDate(block: string): {
  title: string;
  dateText: string;
} {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const dateLine =
    [...lines]
      .reverse()
      .find((l) =>
        /\d{1,2}\s+de\s+[a-záéíóú]+(\s+\d{4})?|\d{4}-\d{2}-\d{2}/i.test(l),
      ) ?? "";
  const titleLines = lines.filter((l) => l !== dateLine && !/^COMPRAR/i.test(l));
  return {
    title: titleLines.join(" - ").slice(0, 140),
    dateText: dateLine,
  };
}

function megaShowIntensity(title: string) {
  const blob = title.toLowerCase();
  if (/morat|ozuna|arc[aá]ngel|aespa|5 seconds|wwe|disney on ice|paulo londra|rawayana/i.test(blob)) {
    return 9;
  }
  if (/world tour|gira|festival/i.test(blob)) return 8;
  return 7;
}

function signalFromCard(
  input: {
    title: string;
    date: string;
    url: string;
    venue: NearbyVenue;
    dateText: string;
  },
  minDate: string,
): DemandSignal | null {
  if (input.date < minDate) return null;

  const blob = `${input.title} ${input.dateText} ${input.venue.label} puntoticket santiago`;
  const signal = toSignal({
    source: "puntoticket",
    title: input.title,
    date: input.date,
    url: input.url,
    textForPoi: blob,
    intensity: megaShowIntensity(input.title),
    description: `${input.venue.label}. ${input.dateText}. Fuente: PuntoTicket.`,
  });

  signal.audienceTags = ["eventos", "conciertos", ...input.venue.tags];
  signal.poiIds = input.venue.poiIds;
  signal.propertyCodesPreferred = input.venue.propertyCodes;

  return signal;
}

async function loadMoreEvents(page: Page) {
  for (let i = 0; i < 6; i++) {
    const btn = page.getByText("CARGAR MÁS", { exact: true }).first();
    if (!(await btn.isVisible().catch(() => false))) break;
    await btn.click().catch(() => undefined);
    await page.waitForTimeout(900);
  }
}

async function scrapeVenuePage(
  page: Page,
  venue: NearbyVenue,
  path: string,
  minDate: string,
): Promise<DemandSignal[]> {
  await page.goto(`https://www.puntoticket.com/${path}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(2000);
  await loadMoreEvents(page);

  const pairs = await page.evaluate(() => {
    const links = [...document.querySelectorAll("a")].filter(
      (a) => a.textContent?.trim().toUpperCase() === "COMPRAR TICKETS",
    );
    return links.map((a) => {
      let node: HTMLElement | null = a.parentElement;
      let block = "";
      for (let depth = 0; depth < 8 && node; depth++) {
        const t = node.innerText?.trim() ?? "";
        if (
          t.length > 8 &&
          t.length < 350 &&
          /\d{1,2}\s+DE\s+[A-ZÁÉÍÓÚ]+/i.test(t) &&
          !/REVISA NUESTRA CARTELERA/i.test(t)
        ) {
          block = t;
          break;
        }
        node = node.parentElement;
      }
      return { href: a.href, block };
    });
  });

  const year = new Date().getFullYear();
  const seen = new Set<string>();
  const signals: DemandSignal[] = [];

  for (const pair of pairs) {
    if (!pair.href || pair.href.includes(`/${path}`)) continue;

    const { title, dateText } = parseBlockTitleAndDate(pair.block);
    if (!isValidEventTitle(title)) continue;

    const date = parseVenueDate(dateText, year);
    if (!date) continue;

    const signal = signalFromCard(
      { title, date, url: pair.href, venue, dateText },
      minDate,
    );
    if (!signal) continue;

    const key = `${signal.startsOn}|${signal.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    signals.push(signal);
  }

  return signals;
}

async function scrapeTodos(page: Page, minDate: string): Promise<DemandSignal[]> {
  await page.goto("https://www.puntoticket.com/todos", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(2500);

  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(400);
  }

  const cards = await page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll('a[href*="/evento/"], a[href*="puntoticket.com/"]'),
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
  const signals: DemandSignal[] = [];

  for (const card of cards) {
    const blob = `${card.text} ${card.parentText} ${card.href}`;
    const venue = matchNearbyVenue(blob);
    if (!venue) continue;

    const date =
      parseVenueDate(blob, year) || parseVenueDate(card.href, year);
    if (!date || date < minDate) continue;

    const title =
      card.text ||
      decodeURIComponent(card.href.split("/").pop() ?? "evento")
        .replace(/-/g, " ")
        .slice(0, 120);
    if (title.length < 4) continue;

    const key = `${title}-${date}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const signal = signalFromCard(
      {
        title,
        date,
        url: card.href,
        venue,
        dateText: blob.slice(0, 80),
      },
      minDate,
    );
    if (signal) signals.push(signal);
  }

  return signals;
}

function mergeSignals(lists: DemandSignal[][]): DemandSignal[] {
  const merged = new Map<string, DemandSignal>();
  for (const list of lists) {
    for (const s of list) {
      const key = `${s.startsOn}|${s.title.toLowerCase().slice(0, 80)}`;
      const prev = merged.get(key);
      if (!prev || s.intensity > prev.intensity) merged.set(key, s);
    }
  }
  return [...merged.values()];
}

export async function scrapePuntoTicket(page: Page): Promise<SourceResult> {
  const name = "puntoticket";
  const minDate = todayIso();

  try {
    const venuePages = puntoticketVenuePages();
    const venueSignals: DemandSignal[][] = [];

    for (const { path, venue } of venuePages) {
      venueSignals.push(await scrapeVenuePage(page, venue, path, minDate));
    }

    const todosSignals = await scrapeTodos(page, minDate);

    return {
      name,
      ok: true,
      signals: mergeSignals([...venueSignals, todosSignals]),
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
