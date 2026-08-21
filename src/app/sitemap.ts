import type { MetadataRoute } from "next";
import { eventPublicPath } from "@/lib/demand/event-path";
import { loadIndexableEventRecords } from "@/lib/demand/load-event-records";

import { SITE_URL } from "@/lib/site/url";

const SITE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const records = await loadIndexableEventRecords();

  const events: MetadataRoute.Sitemap = records.map((r) => ({
    url: `${SITE}${eventPublicPath(r)}`,
    lastModified: new Date(r.lastVerifiedAt),
    changeFrequency: "weekly",
    priority: r.potentialTier === "mega" ? 0.9 : 0.8,
  }));

  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE}/santiago`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE}/santiago/negocios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE}/santiago/feriados`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...events,
  ];
}
