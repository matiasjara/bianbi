import { cache } from "react";
import { addDays, format } from "date-fns";
import { unstable_cache } from "next/cache";
import {
  detectCampaignOpportunities,
  suggestCampaignsFromPeaks,
} from "./calendar";
import { buildCampaignPacks, findPackBySlug } from "./campaign-pack";
import {
  filterCampaignPacksFromCache,
  readCampaignPacksCache,
  type LoadCampaignPacksOptions,
} from "./campaign-packs-cache";
import { isPublishableGuidePeak } from "./guide-eligibility";
import { loadAllSignals } from "./load-signals";
import { monthRange } from "./month-range";
import {
  getIngestCacheVersion,
  INGEST_DATA_REVALIDATE_SEC,
} from "./ingest-cache";
import type { CampaignPack, DemandPeak } from "./types";

export type { LoadCampaignPacksOptions } from "./campaign-packs-cache";

/** Mezcla intereses; reserva cupo para congresos/ferias (alto valor MICE). */
function pickDiversePeaks(peaks: DemandPeak[], limit: number): DemandPeak[] {
  const sorted = [...peaks].sort(
    (a, b) =>
      b.estimatedOvernight - a.estimatedOvernight ||
      b.score - a.score ||
      a.anchorDate.localeCompare(b.anchorDate),
  );
  const picked: DemandPeak[] = [];
  const pickedIds = new Set<string>();

  const push = (p: DemandPeak) => {
    if (pickedIds.has(p.id) || picked.length >= limit) return;
    picked.push(p);
    pickedIds.add(p.id);
  };

  for (const p of sorted.filter((x) => x.interest === "congreso_feria").slice(0, 5)) {
    push(p);
  }

  for (const p of sorted) {
    if (picked.length >= limit) break;
    if (pickedIds.has(p.id)) continue;
    if (picked.some((x) => x.interest === p.interest)) continue;
    push(p);
  }

  for (const p of sorted) {
    if (picked.length >= limit) break;
    if (pickedIds.has(p.id)) continue;
    push(p);
  }

  return picked;
}

function normalizeOptions(
  options: number | LoadCampaignPacksOptions,
): LoadCampaignPacksOptions {
  return typeof options === "number" ? { limit: options } : options;
}

function serializeOptsForCache(opts: LoadCampaignPacksOptions): string {
  return JSON.stringify({
    limit: opts.limit ?? 16,
    includeGeneric: opts.includeGeneric ?? false,
    city: opts.city ?? "santiago",
    year: opts.year,
    monthIndex: opts.monthIndex,
    rollingDay:
      opts.year == null || opts.monthIndex == null
        ? format(new Date(), "yyyy-MM-dd")
        : undefined,
  });
}

async function loadAllCampaignPacksCompute(
  opts: LoadCampaignPacksOptions,
): Promise<CampaignPack[]> {
  const limit = opts.limit ?? 16;
  const includeGeneric = opts.includeGeneric ?? false;
  const city = opts.city ?? "santiago";

  const { signals } = await loadAllSignals({ city });

  let start: string;
  let end: string;

  if (opts.year != null && opts.monthIndex != null) {
    const range = monthRange(opts.year, opts.monthIndex);
    start = range.start;
    end = range.end;
  } else {
    start = format(new Date(), "yyyy-MM-dd");
    end = format(addDays(new Date(), 120), "yyyy-MM-dd");
  }

  const opportunities = detectCampaignOpportunities(signals, start, end, 24);
  const eligible = includeGeneric
    ? opportunities
    : opportunities.filter(isPublishableGuidePeak);
  const diverse = pickDiversePeaks(eligible, limit);
  const suggestions = suggestCampaignsFromPeaks(diverse, limit);
  return buildCampaignPacks(suggestions, eligible);
}

async function loadAllCampaignPacksImpl(
  opts: LoadCampaignPacksOptions,
): Promise<CampaignPack[]> {
  const cache = await readCampaignPacksCache();
  if (cache) {
    return filterCampaignPacksFromCache(cache, opts);
  }
  return loadAllCampaignPacksCompute(opts);
}

const loadAllCampaignPacksCached = unstable_cache(
  async (ingestVersion: string, optsKey: string) => {
    void ingestVersion;
    const { rollingDay: _, ...opts } = JSON.parse(optsKey) as LoadCampaignPacksOptions & {
      rollingDay?: string;
    };
    return loadAllCampaignPacksImpl(opts);
  },
  ["load-all-campaign-packs"],
  { revalidate: INGEST_DATA_REVALIDATE_SEC, tags: ["ingest-data"] },
);

export async function loadAllCampaignPacks(
  options: number | LoadCampaignPacksOptions = 16,
): Promise<CampaignPack[]> {
  const opts = normalizeOptions(options);
  const version = await getIngestCacheVersion();
  return loadAllCampaignPacksCached(version, serializeOptsForCache(opts));
}

async function loadWideFallbackPacksImpl(): Promise<CampaignPack[]> {
  const cache = await readCampaignPacksCache();
  if (cache?.publishable.length) {
    return cache.publishable;
  }
  const { signals } = await loadAllSignals();
  const start = format(addDays(new Date(), -60), "yyyy-MM-dd");
  const end = format(addDays(new Date(), 220), "yyyy-MM-dd");
  const opportunities = detectCampaignOpportunities(signals, start, end, 18);
  const eligible = opportunities.filter(isPublishableGuidePeak);
  const suggestions = suggestCampaignsFromPeaks(eligible, 120);
  return buildCampaignPacks(suggestions, eligible);
}

const loadWideFallbackPacksCached = unstable_cache(
  async (ingestVersion: string) => {
    void ingestVersion;
    return loadWideFallbackPacksImpl();
  },
  ["load-campaign-packs-wide-fallback"],
  { revalidate: INGEST_DATA_REVALIDATE_SEC, tags: ["ingest-data"] },
);

function monthsAroundSlug(slug: string): Array<{ year: number; monthIndex: number }> {
  const full = slug.match(/(\d{4})-(\d{2})-(\d{2})/);
  const ym = slug.match(/(\d{4})-(\d{2})(?!-\d)/);
  const m = full ?? ym;
  if (!m) return [];

  const year = Number(m[1]);
  const monthIndex = Number(m[2]) - 1;
  if (!Number.isFinite(year) || monthIndex < 0 || monthIndex > 11) return [];

  const out: Array<{ year: number; monthIndex: number }> = [];
  for (const delta of [-1, 0, 1]) {
    const d = new Date(year, monthIndex + delta, 1);
    out.push({ year: d.getFullYear(), monthIndex: d.getMonth() });
  }
  return out;
}

async function loadCampaignPackBySlugImpl(
  slug: string,
): Promise<CampaignPack | null> {
  const months = monthsAroundSlug(slug);
  if (months.length > 0) {
    const bySlug = new Map<string, CampaignPack>();
    for (const { year, monthIndex } of months) {
      const packs = await loadAllCampaignPacks({ year, monthIndex, limit: 80 });
      for (const p of packs) bySlug.set(p.slug, p);
    }
    const fromMonths = findPackBySlug([...bySlug.values()], slug);
    if (fromMonths) return fromMonths;
  }

  const rolling = await loadAllCampaignPacks({ limit: 80 });
  const fromRolling = findPackBySlug(rolling, slug);
  if (fromRolling) return fromRolling;

  const version = await getIngestCacheVersion();
  const wide = await loadWideFallbackPacksCached(version);
  return findPackBySlug(wide, slug) ?? null;
}

/** Dedupe metadata + page en el mismo request. */
export const loadCampaignPackBySlug = cache(loadCampaignPackBySlugImpl);
