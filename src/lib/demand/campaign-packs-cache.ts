import { addDays, format } from "date-fns";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  detectCampaignOpportunities,
  suggestCampaignsFromPeaks,
} from "./calendar";
import { buildCampaignPacks } from "./campaign-pack";
import { isPublishableGuidePeak } from "./guide-eligibility";
import { loadIngestedSignals } from "./load-signals";
import { monthRange } from "./month-range";
import type { CampaignPack, CityId } from "./types";

const OUT_DIR = path.join(process.cwd(), "data", "ingested");
export const CAMPAIGN_PACKS_CACHE_FILE = path.join(
  OUT_DIR,
  "campaign-packs-cache.json",
);

export type LoadCampaignPacksOptions = {
  /** Límite de packs (por score). Default 16. */
  limit?: number;
  /** Año calendario (si se omite, ventana rolling 120 días). */
  year?: number;
  /** Mes 0–11 (requiere year). */
  monthIndex?: number;
  /** Incluye guías genéricas de estacionalidad (congresos, verano…). Default false. */
  includeGeneric?: boolean;
  /** Ciudad sede. Default Santiago. */
  city?: CityId;
};

export type CampaignPacksCache = {
  builtAt: string;
  windowStart: string;
  windowEnd: string;
  /** Packs de picos publicables (sin estacionalidad genérica). */
  publishable: CampaignPack[];
  /** Incluye guías genéricas de estacionalidad. */
  all: CampaignPack[];
};

function packOverlapsWindow(
  pack: CampaignPack,
  start: string,
  end: string,
): boolean {
  return pack.eventStartsOn <= end && pack.eventEndsOn >= start;
}

/** Mezcla intereses; reserva cupo para congresos/ferias (alto valor MICE). */
export function pickDiversePacks(
  packs: CampaignPack[],
  limit: number,
): CampaignPack[] {
  const sorted = [...packs].sort(
    (a, b) =>
      b.estimatedOvernight - a.estimatedOvernight ||
      b.score - a.score ||
      a.eventStartsOn.localeCompare(b.eventStartsOn),
  );
  const picked: CampaignPack[] = [];
  const pickedIds = new Set<string>();

  const push = (p: CampaignPack) => {
    if (pickedIds.has(p.peakId) || picked.length >= limit) return;
    picked.push(p);
    pickedIds.add(p.peakId);
  };

  for (const p of sorted.filter((x) => x.interest === "congreso_feria").slice(0, 5)) {
    push(p);
  }

  for (const p of sorted) {
    if (picked.length >= limit) break;
    if (pickedIds.has(p.peakId)) continue;
    if (picked.some((x) => x.interest === p.interest)) continue;
    push(p);
  }

  for (const p of sorted) {
    if (picked.length >= limit) break;
    if (pickedIds.has(p.peakId)) continue;
    push(p);
  }

  return picked;
}

function resolveWindow(opts: LoadCampaignPacksOptions): { start: string; end: string } {
  if (opts.year != null && opts.monthIndex != null) {
    return monthRange(opts.year, opts.monthIndex);
  }
  return {
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(addDays(new Date(), 120), "yyyy-MM-dd"),
  };
}

export function filterCampaignPacksFromCache(
  cache: CampaignPacksCache,
  opts: LoadCampaignPacksOptions,
): CampaignPack[] {
  const limit = opts.limit ?? 16;
  const includeGeneric = opts.includeGeneric ?? false;
  const city = opts.city ?? "santiago";
  const { start, end } = resolveWindow(opts);
  const source = includeGeneric ? cache.all : cache.publishable;

  const inWindow = source.filter(
    (p) => p.city === city && packOverlapsWindow(p, start, end),
  );

  return pickDiversePacks(inWindow, limit);
}

export async function readCampaignPacksCache(): Promise<CampaignPacksCache | null> {
  try {
    const raw = await readFile(CAMPAIGN_PACKS_CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as CampaignPacksCache;
    if (!parsed.publishable?.length && !parsed.all?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function buildCampaignPacksCache(): Promise<CampaignPacksCache> {
  const { signals } = await loadIngestedSignals();
  const windowStart = format(addDays(new Date(), -60), "yyyy-MM-dd");
  const windowEnd = format(addDays(new Date(), 220), "yyyy-MM-dd");

  const opportunities = detectCampaignOpportunities(
    signals,
    windowStart,
    windowEnd,
    18,
  );
  const publishablePeaks = opportunities.filter(isPublishableGuidePeak);
  const publishableSuggestions = suggestCampaignsFromPeaks(
    publishablePeaks,
    150,
  );
  const publishable = buildCampaignPacks(
    publishableSuggestions,
    publishablePeaks,
  );

  const allSuggestions = suggestCampaignsFromPeaks(opportunities, 150);
  const all = buildCampaignPacks(allSuggestions, opportunities);

  return {
    builtAt: new Date().toISOString(),
    windowStart,
    windowEnd,
    publishable,
    all,
  };
}

export async function buildAndWriteCampaignPacksCache(): Promise<CampaignPacksCache> {
  await mkdir(OUT_DIR, { recursive: true });
  const cache = await buildCampaignPacksCache();
  await writeFile(
    CAMPAIGN_PACKS_CACHE_FILE,
    JSON.stringify(cache, null, 2),
  );
  return cache;
}
