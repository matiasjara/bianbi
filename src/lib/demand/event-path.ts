import type { EventRecord } from "./types";

export function eventPublicPath(record: Pick<EventRecord, "slug">): string {
  return `/eventos/${record.slug}`;
}

export function guideLegacyPath(guideSlug: string): string {
  return `/g/${guideSlug}`;
}

/** Ruta pública preferida: /eventos si hay slug canónico indexable. */
export function resolveEventHref(
  guideSlug: string,
  pathMap?: Map<string, string>,
): string {
  const publicSlug = pathMap?.get(guideSlug);
  if (publicSlug) return `/eventos/${publicSlug}`;
  return `/g/${guideSlug}`;
}

export async function resolveEventHrefAsync(guideSlug: string): Promise<string> {
  const { loadEventRecordByGuideSlug } = await import("./load-event-records");
  const record = await loadEventRecordByGuideSlug(guideSlug);
  if (record?.indexable) return eventPublicPath(record);
  return guideLegacyPath(guideSlug);
}
