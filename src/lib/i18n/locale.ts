export const LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && (LOCALES as readonly string[]).includes(value));
}

/** Prioridad: ?lang → cookie → Accept-Language → es */
export function resolveLocale(input: {
  searchLang?: string | null;
  cookieLang?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(input.searchLang)) return input.searchLang;
  if (isLocale(input.cookieLang)) return input.cookieLang;

  const header = input.acceptLanguage?.toLowerCase() ?? "";
  if (!header) return "es";

  const parts = header.split(",").map((p) => {
    const [tag, qPart] = p.trim().split(";");
    const q = qPart?.includes("q=")
      ? Number(qPart.split("q=")[1]) || 0
      : 1;
    return { tag: (tag ?? "").trim(), q };
  });
  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    if (tag.startsWith("pt")) return "pt";
    if (tag.startsWith("en")) return "en";
    if (tag.startsWith("es")) return "es";
  }
  return "es";
}

export const LANG_COOKIE = "bianbi_lang";
