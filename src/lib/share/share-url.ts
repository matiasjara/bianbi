export type ShareMedium =
  | "whatsapp"
  | "native"
  | "copy"
  | "download"
  | "preview";

/** URL pública de la guía con locale y UTM para atribución de shares */
export function buildSharePageUrl(
  origin: string,
  path: string,
  locale: string,
  medium: ShareMedium,
): string {
  const url = new URL(path, origin);
  url.searchParams.set("lang", locale);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "microsite-guide");
  return url.toString();
}
