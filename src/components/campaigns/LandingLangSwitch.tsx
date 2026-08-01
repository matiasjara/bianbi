"use client";

import Link from "next/link";
import { LANG_COOKIE, LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/locale";

export function LandingLangSwitch({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  return (
    <div
      className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-black/35 p-1 backdrop-blur-sm sm:right-6 sm:top-6"
      role="navigation"
      aria-label="Language"
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/c/${slug}?lang=${code}`}
            hrefLang={code}
            prefetch={false}
            onClick={() => {
              document.cookie = `${LANG_COOKIE}=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
            }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition ${
              active
                ? "bg-white text-[#222]"
                : "text-white/80 hover:bg-white/15 hover:text-white"
            }`}
          >
            {LOCALE_LABELS[code]}
          </Link>
        );
      })}
    </div>
  );
}
