import { addDays, format } from "date-fns";
import {
  detectCampaignOpportunities,
  suggestCampaignsFromPeaks,
} from "./calendar";
import { buildCampaignPacks, findPackBySlug } from "./campaign-pack";
import { loadAllSignals } from "./load-signals";
import { monthRange } from "./month-range";
import type { CampaignPack } from "./types";

export type LoadCampaignPacksOptions = {
  /** Límite de packs (por score). Default 16. */
  limit?: number;
  /** Año calendario (si se omite, ventana rolling 120 días). */
  year?: number;
  /** Mes 0–11 (requiere year). */
  monthIndex?: number;
};

export async function loadAllCampaignPacks(
  options: number | LoadCampaignPacksOptions = 16,
): Promise<CampaignPack[]> {
  const opts: LoadCampaignPacksOptions =
    typeof options === "number" ? { limit: options } : options;
  const limit = opts.limit ?? 16;

  const { signals } = await loadAllSignals();

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

  // Una oportunidad = un interés (nieve, partido, concierto, competencia…)
  const opportunities = detectCampaignOpportunities(signals, start, end, 24);
  const suggestions = suggestCampaignsFromPeaks(opportunities, limit);
  return buildCampaignPacks(suggestions, opportunities);
}

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

export async function loadCampaignPackBySlug(
  slug: string,
): Promise<CampaignPack | null> {
  // 1) Primero el mes del slug (links desde /campanas?year=&month=)
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

  // 2) Ventana rolling
  const rolling = await loadAllCampaignPacks({ limit: 80 });
  const fromRolling = findPackBySlug(rolling, slug);
  if (fromRolling) return fromRolling;

  // 3) Ventana amplia de respaldo
  const { signals } = await loadAllSignals();
  const start = format(addDays(new Date(), -60), "yyyy-MM-dd");
  const end = format(addDays(new Date(), 220), "yyyy-MM-dd");
  const opportunities = detectCampaignOpportunities(signals, start, end, 18);
  const suggestions = suggestCampaignsFromPeaks(opportunities, 120);
  return (
    findPackBySlug(buildCampaignPacks(suggestions, opportunities), slug) ?? null
  );
}
