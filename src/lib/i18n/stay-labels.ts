import type { Locale } from "@/lib/i18n/locale";

/** Props serializables para MicrositeStayList (Client Component). */
export type StayListUi = {
  minWalk: string;
  ctaAirbnb: string;
  locale: Locale;
};

export const STAY_RATING = 5;

export function formatStayUnitOption(locale: Locale, n: number): string {
  switch (locale) {
    case "en":
      return `Unit ${n}`;
    case "pt":
      return `Unidade ${n}`;
    default:
      return `Unidad ${n}`;
  }
}

export function formatStayReviews(locale: Locale, n: number): string {
  switch (locale) {
    case "en":
      return `${n} review${n === 1 ? "" : "s"}`;
    case "pt":
      return `${n} avaliaç${n === 1 ? "ão" : "ões"}`;
    default:
      return `${n} reseña${n === 1 ? "" : "s"}`;
  }
}

/** Rating + reseñas de una unidad (no del edificio). */
export function formatStayUnitTrust(
  locale: Locale,
  reviewCount?: number,
): string {
  const rating = `${STAY_RATING.toFixed(1)} ★`;
  if (reviewCount == null) return rating;
  return `${rating} · ${formatStayReviews(locale, reviewCount)}`;
}
