import { addDays, format } from "date-fns";
import {
  detectCampaignOpportunities,
  suggestCampaignsFromPeaks,
} from "./calendar";
import { buildCampaignPacks, findPackBySlug } from "./campaign-pack";
import { parseCityParam } from "./cities";
import type { CityId } from "./types";
import { isPublishableGuidePeak } from "./guide-eligibility";
import { loadAllSignals } from "./load-signals";
import { monthRange } from "./month-range";
import type { CampaignPack, DemandPeak } from "./types";

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

export async function loadAllCampaignPacks(
  options: number | LoadCampaignPacksOptions = 16,
): Promise<CampaignPack[]> {
  const opts: LoadCampaignPacksOptions =
    typeof options === "number" ? { limit: options } : options;
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

  // Una oportunidad = un interés (nieve, partido, concierto, competencia…)
  const opportunities = detectCampaignOpportunities(signals, start, end, 24);
  const eligible = includeGeneric
    ? opportunities
    : opportunities.filter(isPublishableGuidePeak);
  const diverse = pickDiversePeaks(eligible, limit);
  const suggestions = suggestCampaignsFromPeaks(diverse, limit);
  return buildCampaignPacks(suggestions, eligible);
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
  const eligible = opportunities.filter(isPublishableGuidePeak);
  const suggestions = suggestCampaignsFromPeaks(eligible, 120);
  return (
    findPackBySlug(buildCampaignPacks(suggestions, eligible), slug) ?? null
  );
}
