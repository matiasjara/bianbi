/** Nombres semánticos de iconos usados en la UI pública. */
export const BRAND_ICON_NAMES = [
  "pin",
  "music",
  "soccer",
  "medal",
  "snowflake",
  "luggage",
  "camera",
  "bed",
  "calendar",
  "sunrise",
  "star",
  "megaphone",
  "route",
  "train",
  "info",
] as const;

export type BrandIconName = (typeof BRAND_ICON_NAMES)[number];
