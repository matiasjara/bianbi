import type { MetadataRoute } from "next";

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
    sitemap: "https://bianbi.cl/sitemap.xml",
  };
}
