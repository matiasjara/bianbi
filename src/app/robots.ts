import type { MetadataRoute } from "next";
import { ROBOTS_ALLOW, ROBOTS_DISALLOW } from "@/lib/site/indexing";
import { SITE_URL } from "@/lib/site/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [...ROBOTS_ALLOW],
      disallow: [...ROBOTS_DISALLOW],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
