import type { CampaignPack, DemandSignal } from "./types";
import type { ConfidenceLevel } from "./types";

const TRUSTED_SOURCES = new Set([
  "ticketmaster_cl",
  "puntoticket",
  "fedachi",
  "fehoch_tournaments",
  "fevochi",
  "campeonato_chileno",
  "ind_cl",
  "congresos_ferias_cl",
]);

export function sourceConfidenceLevel(source: DemandSignal["source"]): ConfidenceLevel {
  if (TRUSTED_SOURCES.has(source)) return "HIGH";
  if (source === "tocador" || source === "ticketplus_cl") return "MEDIUM";
  return "LOW";
}

export function scoreContentQuality(pack: CampaignPack): number {
  let score = 0;
  const m = pack.microsite;
  if (!m) return 0;

  if (pack.eventTitle.trim().length >= 8) score += 12;
  if ((pack.eventDescription || m.eventDescription).trim().length >= 40) score += 15;
  if (pack.venueName.trim()) score += 10;
  if (pack.eventUrl?.startsWith("http")) score += 10;
  if (m.transport.length >= 2) score += 12;
  if (m.mustKnow.length >= 2) score += 10;
  if (m.faqs.length >= 2) score += 10;
  if (m.recommendations.length >= 2) score += 8;
  if (pack.properties.length > 0) score += 8;
  if ((pack.score ?? 0) >= 70) score += 10;
  if (m.seoDescription.length >= 80) score += 5;

  return Math.min(100, score);
}

export function dataConfidenceLevel(
  pack: CampaignPack,
  contentQuality: number,
): ConfidenceLevel {
  if (contentQuality >= 70 && pack.venuePoiId) return "HIGH";
  if (contentQuality >= 50) return "MEDIUM";
  return "LOW";
}

export const MIN_INDEXABLE_QUALITY = 55;
