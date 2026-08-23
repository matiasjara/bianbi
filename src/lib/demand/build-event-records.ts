import { addDays, format } from "date-fns";
import { classifyEventType } from "./event-type";
import { cleanPublicEventTitle } from "./guide-eligibility";
import { resolveEventLifecycle } from "./event-lifecycle";
import {
  dataConfidenceLevel,
  MIN_INDEXABLE_QUALITY,
  scoreContentQuality,
  sourceConfidenceLevel,
} from "./event-quality";
import {
  dedupeKeyForEvent,
  publicEventSlug,
  slugifyEventText,
} from "./event-slug";
import { isPublishableGuidePeak } from "./guide-eligibility";
import {
  detectCampaignOpportunities,
  suggestCampaignsFromPeaks,
} from "./calendar";
import { buildCampaignPacks } from "./campaign-pack";
import { loadIngestedSignals } from "./load-signals";
import type {
  CampaignPack,
  DemandSignal,
  EventCanonicalManifest,
  EventPipelineStatus,
  EventRecord,
} from "./types";

function uniqueSlug(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  const slug = `${base}-${n}`;
  used.add(slug);
  return slug;
}

function pipelineStatusFor(
  indexable: boolean,
  lifecycle: EventRecord["lifecycleStatus"],
  contentQuality: number,
): EventPipelineStatus {
  if (lifecycle === "COMPLETED") return "COMPLETED";
  if (!indexable && contentQuality < MIN_INDEXABLE_QUALITY) return "NEEDS_REVIEW";
  if (indexable) return "PUBLISHED";
  return "READY";
}

function packToEventRecord(
  pack: CampaignPack,
  usedSlugs: Set<string>,
  leadSignal?: DemandSignal,
): EventRecord {
  const contentQuality = scoreContentQuality(pack);
  const lifecycle = resolveEventLifecycle(pack.eventStartsOn, pack.eventEndsOn);
  const signalSource = leadSignal?.source ?? "manual";

  const name = cleanPublicEventTitle(pack.eventTitle);
  const slugBase = publicEventSlug(name, pack.eventStartsOn);
  const slug = uniqueSlug(slugBase, usedSlugs);
  const eventType = classifyEventType({
    title: pack.eventTitle,
    description: pack.eventDescription,
    venueName: pack.venueName,
    interest: pack.interest,
  });

  const sourceConf = sourceConfidenceLevel(signalSource);
  const dataConf = dataConfidenceLevel(pack, contentQuality);
  const indexable =
    contentQuality >= MIN_INDEXABLE_QUALITY &&
    lifecycle !== "CANCELLED" &&
    Boolean(pack.microsite);

  const shortDescription =
    pack.microsite?.eventSummary?.slice(0, 220) ||
    pack.eventDescription.slice(0, 220);

  return {
    id: slugifyEventText(`${pack.peakId}-${pack.eventStartsOn}`),
    slug,
    guideSlug: pack.slug,
    name,
    shortDescription,
    description: pack.eventDescription || pack.microsite?.eventDescription || "",
    eventType,
    interest: pack.interest,
    startDate: pack.eventStartsOn,
    endDate: pack.eventEndsOn,
    venueId: pack.venuePoiId,
    venueName: pack.venueName,
    city: pack.city,
    officialUrl: pack.eventUrl,
    ticketUrl: pack.eventUrl,
    source: signalSource,
    sourceUrl: leadSignal?.url ?? pack.eventUrl,
    sourceUpdatedAt: new Date().toISOString(),
    pipelineStatus: pipelineStatusFor(indexable, lifecycle, contentQuality),
    lifecycleStatus: lifecycle,
    sourceConfidence: sourceConf,
    dataConfidence: dataConf,
    contentQualityScore: contentQuality,
    indexable,
    lastVerifiedAt: new Date().toISOString(),
    signalIds: leadSignal ? [leadSignal.id] : [pack.peakId],
    potentialScore: pack.score,
    potentialTier:
      pack.demandDimension === "mega"
        ? "mega"
        : pack.demandDimension === "grande"
          ? "alta"
          : pack.demandDimension === "media"
            ? "media"
            : "baja",
  };
}

export async function buildEventRecordsFromPacks(
  limit = 200,
): Promise<EventRecord[]> {
  const { signals } = await loadIngestedSignals();
  const start = format(new Date(), "yyyy-MM-dd");
  const end = format(addDays(new Date(), 365), "yyyy-MM-dd");
  const opportunities = detectCampaignOpportunities(signals, start, end, 48);
  const eligible = opportunities.filter(isPublishableGuidePeak);
  const suggestions = suggestCampaignsFromPeaks(eligible, limit);
  const packs = buildCampaignPacks(suggestions, eligible).filter((p) => p.microsite);

  const byKey = new Map<string, { pack: CampaignPack; signalIds: string[] }>();
  for (const pack of packs) {
    const key = dedupeKeyForEvent(
      pack.eventTitle,
      pack.eventStartsOn,
      pack.venuePoiId,
    );
    const existing = byKey.get(key);
    if (!existing || pack.score > existing.pack.score) {
      byKey.set(key, {
        pack,
        signalIds: existing?.signalIds ?? [pack.peakId],
      });
    } else if (existing) {
      existing.signalIds.push(pack.peakId);
    }
  }

  const peakById = new Map(eligible.map((p) => [p.id, p]));
  const usedSlugs = new Set<string>();
  const records: EventRecord[] = [];
  for (const { pack, signalIds } of byKey.values()) {
    const peak = peakById.get(pack.peakId);
    const leadSignal = peak?.signals[0];
    const record = packToEventRecord(pack, usedSlugs, leadSignal);
    record.signalIds = [...new Set([...(leadSignal ? [leadSignal.id] : []), ...signalIds])];
    records.push(record);
  }

  return records.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function eventCanonicalManifest(records: EventRecord[]): EventCanonicalManifest {
  return {
    builtAt: new Date().toISOString(),
    total: records.length,
    indexable: records.filter((r) => r.indexable).length,
    needsReview: records.filter((r) => r.pipelineStatus === "NEEDS_REVIEW").length,
  };
}
