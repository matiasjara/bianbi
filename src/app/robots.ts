import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/santiago", "/g/", "/c/", "/api/share-card/"],
      disallow: [
        "/login",
        "/propiedades",
        "/demanda",
        "/campanas",
        "/base-datos",
        "/fuentes",
        "/api/robots/",
        "/api/campaigns/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
