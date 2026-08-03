import type { Page } from "playwright";
import type { DemandSignal } from "../../../src/lib/demand/types";
import { parseLooseDate, toSignal, type SourceResult } from "../lib/signal-utils";
import {
  matchTicketmasterVenue,
  TICKETMASTER_CATEGORY_PAGES,
  venuePageUrls,
  type TicketmasterVenue,
} from "./ticketmaster-venues";

const SEARCH_URL = "https://www.ticketmaster.cl/search?q=Santiago";

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept-Language": "es-CL,es;q=0.9",
  Accept: "text/html",
};

type VenueCard = {
  title: string;
  dateText: string;
  venueText: string;
  href: string;
};

function parseVenueDate(dateText: string, fallbackYear: number): string | null {
  const whole = parseLooseDate(dateText, fallbackYear);
  if (!/\s+y\s+\d{1,2}\s+de\s+/i.test(dateText)) return whole;

  const firstSegment = dateText.split(/\s+y\s+/i)[0]?.trim();
  if (!firstSegment) return whole;

  const first =
    parseLooseDate(`${firstSegment} ${fallbackYear}`, fallbackYear) ??
    parseLooseDate(firstSegment, fallbackYear);

  return first ?? whole;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeHref(href: string) {
  if (href.startsWith("http")) return href;
  if (href.startsWith("../")) {
    return `https://www.ticketmaster.cl/${href.replace(/^\.\.\//, "")}`;
  }
  if (href.startsWith("/")) return `https://www.ticketmaster.cl${href}`;
  return `https://www.ticketmaster.cl/${href}`;
}

function extractVenueCards(html: string): VenueCard[] {
  const cards: VenueCard[] = [];
  const re =
    /"title":"((?:\\.|[^"\\])*)","line1":"((?:\\.|[^"\\])*)","line2":"((?:\\.|[^"\\])*)","label":"[^"]*","buttonText":[^,]*,"link":"((?:\\.|[^"\\])*)"/g;

  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    cards.push({
      title: m[1].replace(/\\"/g, '"'),
      dateText: m[2].replace(/\\"/g, '"'),
      venueText: m[3].replace(/\\"/g, '"'),
      href: m[4].replace(/\\"/g, '"'),
    });
  }

  const blockRe =
    /href=['"]\.\.\/event\/([^'"]+)['"][\s\S]*?item_title">([^<]+)<\/div>[\s\S]*?<strong>([^<]+)<\/strong>/gi;
  while ((m = blockRe.exec(html))) {
    cards.push({
      href: `../event/${m[1]}`,
      title: m[2].trim(),
      dateText: m[3].trim(),
      venueText: "",
    });
  }

  return cards;
}

/** Tarjetas "Eventos recomendados" (description + label como venue). */
function extractRecommendedCards(html: string): VenueCard[] {
  const cards: VenueCard[] = [];
  const re =
    /"title":"((?:\\.|[^"\\])*)","description":"((?:\\.|[^"\\])*)","label":"((?:\\.|[^"\\])*)","buttonText":[^,]*,"link":"((?:\\.|[^"\\])*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const title = m[1].replace(/\\"/g, '"');
    if (/eventos recomendados|música|deportes|artes/i.test(title)) continue;
    cards.push({
      title,
      dateText: m[2].replace(/\\"/g, '"'),
      venueText: m[3].replace(/\\"/g, '"'),
      href: m[4].replace(/\\"/g, '"'),
    });
  }
  return cards;
}

function dedupeCards(cards: VenueCard[]): VenueCard[] {
  const byHref = new Map<string, VenueCard>();
  for (const card of cards) {
    const key = normalizeHref(card.href);
    const prev = byHref.get(key);
    if (!prev || card.dateText.length > prev.dateText.length) {
      byHref.set(key, card);
    }
  }
  return [...byHref.values()];
}

/** Tarjetas mínimas (ej. "Eventos recomendados" sin line2 en el listado). */
function extractMinimalCards(html: string): VenueCard[] {
  const cards: VenueCard[] = [];
  const re = /"title":"((?:\\.|[^"\\])*)","link":"((?:\\.|[^"\\])*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const title = m[1].replace(/\\"/g, '"');
    if (/eventos recomendados|música|deportes|artes/i.test(title)) continue;
    cards.push({
      title,
      dateText: "",
      venueText: "",
      href: m[2].replace(/\\"/g, '"'),
    });
  }
  return cards;
}

const eventVenueCache = new Map<string, string>();
const eventDateCache = new Map<string, string>();

type EventPageMeta = { venue: string | null; date: string | null };

async function metaFromEventPage(eventUrl: string): Promise<EventPageMeta> {
  const cachedVenue = eventVenueCache.get(eventUrl);
  const cachedDate = eventDateCache.get(eventUrl);
  if (cachedVenue !== undefined && cachedDate !== undefined) {
    return { venue: cachedVenue || null, date: cachedDate || null };
  }

  try {
    const html = await fetchHtml(eventUrl);
    const venue =
      html.match(/"@type":"Place","name":"([^"]+)"/)?.[1] ??
      html.match(
        /Teatro Caupolic[aá]n|Movistar Arena|Parque O'Higgins|Estadio Nacional|Club H[ií]pico|Estaci[oó]n Mapocho|Teatro Coliseo|Estadio Monumental/i,
      )?.[0] ??
      null;
    const date =
      html.match(/startDate":"(\d{4}-\d{2}-\d{2})/)?.[1] ??
      null;
    eventVenueCache.set(eventUrl, venue ?? "");
    eventDateCache.set(eventUrl, date ?? "");
    return { venue, date };
  } catch {
    eventVenueCache.set(eventUrl, "");
    eventDateCache.set(eventUrl, "");
    return { venue: null, date: null };
  }
}

async function venueTextFromEventPage(eventUrl: string): Promise<string | null> {
  const { venue } = await metaFromEventPage(eventUrl);
  return venue;
}

function megaShowIntensity(title: string, venueText: string) {
  const blob = `${title} ${venueText}`.toLowerCase();
  if (/bts|iron maiden|coldplay|taylor swift|bad bunny|ed sheeran|lollapalooza|metallica|shakira|dua lipa|harry styles|rosalia/i.test(blob)) {
    return 10;
  }
  if (/world tour|gira|festival|música|musica/i.test(blob)) return 9;
  return 8;
}

function resolveVenue(
  card: VenueCard,
  pageVenue?: TicketmasterVenue,
): TicketmasterVenue | null {
  if (pageVenue) return pageVenue;
  const blob = `${card.title} ${card.venueText} ${card.href} ${card.dateText}`;
  return matchTicketmasterVenue(blob);
}

async function resolveVenueAsync(
  card: VenueCard,
  pageVenue?: TicketmasterVenue,
): Promise<TicketmasterVenue | null> {
  const direct = resolveVenue(card, pageVenue);
  if (direct) return direct;

  if (!card.href.includes("/event/")) return null;
  const venueText = await venueTextFromEventPage(normalizeHref(card.href));
  if (!venueText) return null;

  return matchTicketmasterVenue(
    `${card.title} ${venueText} ${card.href} ${card.dateText}`,
  );
}

function signalFromVenueCard(
  card: VenueCard,
  venue: TicketmasterVenue,
  minDate: string,
): DemandSignal | null {
  const year = new Date().getFullYear();
  const date = parseVenueDate(card.dateText, year);
  if (!date || date < minDate) return null;

  const url = normalizeHref(card.href);
  const category = card.venueText || venue.label;
  const blob = `${card.title} ${card.dateText} ${venue.label} ${category} ticketmaster santiago`;
  const intensity = megaShowIntensity(card.title, category);

  const signal = toSignal({
    source: "ticketmaster_cl",
    title: card.title,
    date,
    url,
    textForPoi: blob,
    intensity,
    description: `${category} en ${venue.label}. ${card.dateText}. Fuente: Ticketmaster.`,
  });

  signal.audienceTags = [
    "eventos",
    "conciertos",
    ...venue.tags,
    ...(intensity >= 9 ? ["alta_demanda", "mega_show"] : []),
  ];
  signal.poiIds = venue.poiIds;
  signal.propertyCodesPreferred = venue.propertyCodes;

  return signal;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function scrapeVenuePages(minDate: string): Promise<DemandSignal[]> {
  const signals: DemandSignal[] = [];
  const seen = new Set<string>();

  for (const { url, venue } of venuePageUrls()) {
    let html: string;
    try {
      html = await fetchHtml(url);
    } catch {
      continue;
    }

    for (const card of extractVenueCards(html)) {
      const resolved = resolveVenue(card, venue);
      if (!resolved) continue;

      const signal = signalFromVenueCard(card, resolved, minDate);
      if (!signal) continue;

      const key = `${signal.startsOn}|${signal.title.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      signals.push(signal);
    }
  }

  return signals;
}

async function scrapeCategoryPages(minDate: string): Promise<DemandSignal[]> {
  const signals: DemandSignal[] = [];
  const seen = new Set<string>();

  for (const slug of TICKETMASTER_CATEGORY_PAGES) {
    let html: string;
    try {
      html = await fetchHtml(`https://www.ticketmaster.cl/page/${slug}`);
    } catch {
      continue;
    }

    for (const card of extractVenueCards(html)) {
      const venue = resolveVenue(card);
      if (!venue) continue;

      const signal = signalFromVenueCard(card, venue, minDate);
      if (!signal) continue;

      const key = `${signal.startsOn}|${signal.title.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      signals.push(signal);
    }
  }

  return signals;
}

async function scrapeFetchSearch(minDate: string): Promise<DemandSignal[]> {
  const signals: DemandSignal[] = [];
  const seen = new Set<string>();

  let html: string;
  try {
    html = await fetchHtml(SEARCH_URL);
  } catch {
    return signals;
  }

  const cards = dedupeCards([
    ...extractVenueCards(html),
    ...extractRecommendedCards(html),
    ...extractMinimalCards(html),
  ]);

  for (const card of cards) {
    const eventUrl = card.href.includes("/event/")
      ? normalizeHref(card.href)
      : null;
    let meta: EventPageMeta | null = null;
    if (eventUrl && (!card.dateText || !card.venueText)) {
      meta = await metaFromEventPage(eventUrl);
    }

    const enrichedCard: VenueCard = {
      ...card,
      venueText: card.venueText || meta?.venue || "",
      dateText: card.dateText || meta?.date || "",
    };

    const venue = await resolveVenueAsync(enrichedCard);
    if (!venue) continue;

    const year = new Date().getFullYear();
    const date =
      parseVenueDate(enrichedCard.dateText, year) ??
      parseVenueDate(card.title, year);
    if (!date || date < minDate) continue;

    const signal = signalFromVenueCard(
      {
        ...enrichedCard,
        venueText: enrichedCard.venueText || venue.label,
        dateText: date,
      },
      venue,
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

async function scrapePlaywrightSearch(
  page: Page,
  minDate: string,
): Promise<DemandSignal[]> {
  await page.goto(SEARCH_URL, {
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
    return nodes.slice(0, 120).map((el) => {
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
  const signals: DemandSignal[] = [];

  for (const card of cards) {
    if (!card.text || card.text.length < 12) continue;

    const venue = matchTicketmasterVenue(`${card.text} ${card.href}`);
    if (!venue) continue;

    const date = parseVenueDate(card.text, year);
    if (!date || date < minDate) continue;

    const title = card.text.slice(0, 120);
    const key = `${title}-${date}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const signal = toSignal({
      source: "ticketmaster_cl",
      title,
      date,
      url: card.href || undefined,
      textForPoi: `${card.text} ${venue.label}`,
      intensity: megaShowIntensity(title, venue.label),
      description: `Evento en ${venue.label}. Fuente: Ticketmaster.`,
    });

    signal.audienceTags = ["eventos", "conciertos", ...venue.tags];
    signal.poiIds = venue.poiIds;
    signal.propertyCodesPreferred = venue.propertyCodes;
    signals.push(signal);
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

export async function scrapeTicketmaster(page: Page): Promise<SourceResult> {
  const name = "ticketmaster_cl";
  const minDate = todayIso();

  try {
    const [venueSignals, categorySignals, fetchSearchSignals, playwrightSignals] =
      await Promise.all([
        scrapeVenuePages(minDate),
        scrapeCategoryPages(minDate),
        scrapeFetchSearch(minDate),
        scrapePlaywrightSearch(page, minDate).catch(() => [] as DemandSignal[]),
      ]);

    return {
      name,
      ok: true,
      signals: mergeSignals([
        venueSignals,
        categorySignals,
        fetchSearchSignals,
        playwrightSignals,
      ]),
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
