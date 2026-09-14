/** Encabezado para rutas que no deben aparecer en buscadores. */
export const NOINDEX_ROBOTS_TAG =
  "noindex, nofollow, noarchive, noimageindex";

/**
 * Contenido público que sí puede indexarse.
 * Todo lo demás (dashboard, login, propuestas con clave, APIs, demos) no.
 */
export function isSearchIndexablePath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/santiago" || pathname.startsWith("/santiago/")) return true;
  if (pathname === "/c" || pathname.startsWith("/c/")) return true;
  if (pathname === "/g" || pathname.startsWith("/g/")) return true;
  if (pathname.startsWith("/eventos/")) return true;
  if (pathname.startsWith("/alojamiento/")) return true;
  if (pathname.startsWith("/api/share-card/")) return true;
  if (pathname === "/llms.txt") return true;
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return true;
  return false;
}

export const ROBOTS_ALLOW = [
  "/",
  "/santiago",
  "/g/",
  "/c/",
  "/eventos/",
  "/alojamiento/",
  "/api/share-card/",
] as const;

export const ROBOTS_DISALLOW = [
  "/login",
  "/propiedades",
  "/clientes",
  "/demanda",
  "/campanas",
  "/base-datos",
  "/fuentes",
  "/event-intelligence",
  "/eventos$",
  "/p/",
  "/api/",
  "/kitchencare-demo/",
  "/campaigns/",
] as const;

export const PRIVATE_ROBOTS = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    noarchive: true,
  },
} as const;

export function applyIndexingHeaders<
  T extends { headers: { set: (name: string, value: string) => void } },
>(response: T, pathname: string): T {
  if (!isSearchIndexablePath(pathname)) {
    response.headers.set("X-Robots-Tag", NOINDEX_ROBOTS_TAG);
  }
  return response;
}
