import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/santiago", "/g/", "/c/"],
      disallow: [
        "/login",
        "/propiedades",
        "/demanda",
        "/campanas",
        "/base-datos",
        "/fuentes",
        "/api/",
      ],
    },
    sitemap: "https://bianbi.cl/sitemap.xml",
  };
}
