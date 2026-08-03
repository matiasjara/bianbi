import type { MetadataRoute } from "next";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { micrositePath } from "@/lib/demand/travel-brief";

import { SITE_URL } from "@/lib/site/url";

const SITE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().slice(0, 10);
  const packs = (await loadAllCampaignPacks(40)).filter(
    (p) => p.microsite && p.eventEndsOn >= today,
  );

  const guides: MetadataRoute.Sitemap = packs.map((p) => ({
    url: `${SITE}${micrositePath(p.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
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
    ...guides,
  ];
}
