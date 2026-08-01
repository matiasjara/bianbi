import type { CampaignInterest } from "@/lib/demand/types";

/**
 * Imágenes editoriales en /public/guides/
 * Preferir portada editorial por interés/sede; fotos Airbnb siguen en “dónde alojarte”.
 */

const NIEVE = [
  "/guides/nieve/ski.png",
  "/guides/nieve/ski-1.png",
  "/guides/nieve/ski-2.png",
] as const;

const CONCIERTOS = [
  "/guides/conciertos/movistar-arena.png",
  "/guides/conciertos/movistar.png",
  "/guides/conciertos/concierto.png",
] as const;

const FUTBOL = [
  "/guides/deportes/futbol.png",
  "/guides/deportes/estadio-nacional.png",
] as const;

const HOCKEY = [
  "/guides/deportes/hockey.png",
  "/guides/deportes/hockey-1.png",
  "/guides/deportes/hockey-3.png",
  "/guides/deportes/hockey-4.png",
  "/guides/deportes/hockey-5.png",
  "/guides/deportes/hockey-6.png",
  "/guides/deportes/hockey-7.png",
  "/guides/deportes/hockey-8.png",
] as const;

const ATLETISMO = [
  "/guides/deportes/atletismo.png",
  "/guides/deportes/atletismo-1.png",
  "/guides/deportes/atletismo-2.png",
  "/guides/deportes/atletismo-3.png",
  "/guides/deportes/atletismo-4.png",
  "/guides/deportes/atletismo-5.png",
] as const;

const DEPORTES = [
  ...ATLETISMO,
  ...HOCKEY,
  "/guides/deportes/rugby.png",
  "/guides/deportes/volleyball.png",
  "/guides/deportes/futbol.png",
  "/guides/deportes/estadio-nacional.png",
] as const;

const GASTRONOMIA = [
  "/guides/gastronomia/mesa.jpg",
  "/guides/gastronomia/platos.jpg",
  "/guides/gastronomia/cocina.png",
  "/guides/gastronomia/terraza.png",
  "/guides/gastronomia/pastel-de-choclo.png",
] as const;

const BARRIOS = [
  "/guides/barrios/barrio-italia.png",
  "/guides/santiago/centro-historico.jpg",
] as const;

const VIAJE = [
  "/guides/santiago/centro-historico.jpg",
  "/guides/barrios/barrio-italia.png",
  ...GASTRONOMIA,
] as const;

export type GuideImageSet = {
  /** Portada principal de la guía */
  cover: string | null;
  /** Apoyo para collage / polaroid secundaria */
  support: string[];
};

function hashPick(seed: string, n: number): number {
  if (n <= 0) return 0;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % n;
}

function pickOne(pool: readonly string[], seed: string): string | null {
  if (!pool.length) return null;
  return pool[hashPick(seed, pool.length)] ?? pool[0] ?? null;
}

function pickMany(
  pool: readonly string[],
  seed: string,
  count: number,
  exclude: string[] = [],
): string[] {
  const ex = new Set(exclude);
  const available = pool.filter((p) => !ex.has(p));
  if (!available.length) return [];
  const start = hashPick(seed, available.length);
  const out: string[] = [];
  for (let i = 0; i < Math.min(count, available.length); i += 1) {
    out.push(available[(start + i) % available.length]!);
  }
  return out;
}

function sportPool(title: string, venue = ""): readonly string[] | null {
  const t = `${title} ${venue}`.toLowerCase();
  if (/hockey|fehoch|pat[ií]n/.test(t)) return HOCKEY;
  if (/rugby/.test(t)) return ["/guides/deportes/rugby.png"];
  if (/volley|vóleibol|voleibol/.test(t))
    return ["/guides/deportes/volleyball.png"];
  if (/atletismo|marat[oó]n|running|track|media marat[oó]n|10k|21k|42k/.test(t))
    return ATLETISMO;
  if (/f[uú]tbol|soccer|clasico|clásico|udechile|colo-colo|uc\b/.test(t))
    return FUTBOL;
  return null;
}

function venuePool(venue: string, title: string): readonly string[] | null {
  const hay = `${venue} ${title}`.toLowerCase();
  if (/hockey|fehoch/.test(hay)) return HOCKEY;
  if (/atletismo|marat[oó]n|estadio nacional.*atlet|track/.test(hay))
    return ATLETISMO;
  if (/movistar/.test(hay)) return CONCIERTOS;
  if (/estadio nacional|nacional de chile/.test(hay)) return FUTBOL;
  if (/arena|teatro|movistar|caupolic[aá]n|espacio riesco/.test(hay) &&
      /concierto|show|tour|festival|m[uú]sica/.test(hay)) {
    return CONCIERTOS;
  }
  return null;
}

function interestPool(interest: CampaignInterest): readonly string[] {
  switch (interest) {
    case "nieve":
      return NIEVE;
    case "concierto":
      return CONCIERTOS;
    case "partido_futbol":
      return FUTBOL;
    case "deporte_competencia":
      return DEPORTES;
    case "feriado_puente":
    case "vacaciones_familias":
    case "turismo_general":
      return VIAJE;
    case "otro_evento":
    default:
      return [...BARRIOS, ...GASTRONOMIA];
  }
}

export function resolveGuideImages(input: {
  interest: CampaignInterest;
  venueName?: string;
  eventTitle?: string;
  slug?: string;
}): GuideImageSet {
  const seed = input.slug || input.eventTitle || input.venueName || input.interest;
  const title = input.eventTitle || "";
  const venue = input.venueName || "";

  const venueSpecific = venuePool(venue, title);
  const sportSpecific =
    input.interest === "deporte_competencia" ||
    input.interest === "partido_futbol" ||
    /hockey|fehoch|rugby|volley|atletismo|marat[oó]n|running|track/i.test(
      `${title} ${venue}`,
    )
      ? sportPool(title, venue)
      : null;

  const pool =
    venueSpecific || sportSpecific || interestPool(input.interest);

  const cover = pickOne(pool, seed);
  const localFlavor = [...BARRIOS, ...GASTRONOMIA];
  const support = [
    ...pickMany(pool, `${seed}-b`, 2, cover ? [cover] : []),
    ...pickMany(localFlavor, `${seed}-c`, 2, cover ? [cover] : []),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  return { cover, support };
}

/** Cover para cards: editorial primero, luego foto de propiedad. */
export function guideCoverUrl(
  input: {
    interest: CampaignInterest;
    venueName?: string;
    eventTitle?: string;
    slug?: string;
  },
  propertyPhoto?: string | null,
): string | null {
  return resolveGuideImages(input).cover || propertyPhoto || null;
}

/**
 * Src listo para <img>: no agrega ?im_w= a assets locales.
 * Airbnb/muscache sí reciben im_w.
 */
export function mediaSrc(url: string, width?: number): string {
  if (!url) return url;
  if (url.startsWith("/")) return url;
  if (!width) return url;
  if (/[?&]im_w=/.test(url)) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}im_w=${width}`;
}

/** Imagen de categoría del home (por id de categoría). */
export function categoryCover(categoryId: string): string | null {
  switch (categoryId) {
    case "conciertos":
      return CONCIERTOS[0];
    case "futbol":
      return FUTBOL[0];
    case "deporte":
      return DEPORTES[0];
    case "nieve":
      return NIEVE[0];
    case "viaje":
      return VIAJE[0];
    case "otros":
      return GASTRONOMIA[0];
    default:
      return null;
  }
}
