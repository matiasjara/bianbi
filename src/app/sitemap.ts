import type { MetadataRoute } from "next";
import { eventPublicPath } from "@/lib/demand/event-path";
import { stayBuildingPublicPath } from "@/lib/demand/stay-building-path";
import { loadIndexableEventRecords } from "@/lib/demand/load-event-records";
import { getAllStayBuildingSlugs } from "@/lib/data/stay-buildings";

import { SITE_URL } from "@/lib/site/url";

export const revalidate = 3600;

const SITE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const records = await loadIndexableEventRecords();

  const events: MetadataRoute.Sitemap = records.map((r) => ({
    url: `${SITE}${eventPublicPath(r)}`,
    lastModified: new Date(r.lastVerifiedAt),
    changeFrequency: "weekly",
    priority: r.potentialTier === "mega" ? 0.9 : 0.8,
  }));

  const buildings: MetadataRoute.Sitemap = getAllStayBuildingSlugs().map(
    (slug) => ({
      url: `${SITE}${stayBuildingPublicPath(slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    }),
  );

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
    ...buildings,
    ...events,
  ];
}
