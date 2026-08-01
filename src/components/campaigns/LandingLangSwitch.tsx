"use client";

import Link from "next/link";
import {
  LANG_COOKIE,
  LOCALE_LABELS,
  LOCALES,
  type Locale,
} from "@/lib/i18n/locale";

export function LandingLangSwitch({
  locale,
  basePath,
  theme = "dark",
}: {
  locale: Locale;
  /** Ruta pública, p.ej. `/c/mi-slug`, `/santiago` o `/g/mi-slug` */
  basePath: string;
  /** dark = overlay sobre foto; light = micrositios claros */
  theme?: "dark" | "light";
}) {
  const shell =
    theme === "light"
      ? "absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-[var(--ms-line,#b8c8d4)] bg-white/80 p-1 backdrop-blur-sm sm:right-6 sm:top-6"
      : "absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-black/35 p-1 backdrop-blur-sm sm:right-6 sm:top-6";

  return (
    <div className={shell} role="navigation" aria-label="Language">
      {LOCALES.map((code) => {
        const active = code === locale;
        const activeCls =
          theme === "light"
            ? "bg-[var(--ms-ink,#101820)] text-white"
            : "bg-white text-[#222]";
        const idleCls =
          theme === "light"
            ? "text-[var(--ms-muted,#5c6b78)] hover:bg-black/5 hover:text-[var(--ms-ink,#101820)]"
            : "text-white/80 hover:bg-white/15 hover:text-white";
        return (
          <Link
            key={code}
            href={`${basePath}?lang=${code}`}
            hrefLang={code}
            prefetch={false}
            onClick={() => {
              document.cookie = `${LANG_COOKIE}=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
            }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition ${
              active ? activeCls : idleCls
            }`}
          >
            {LOCALE_LABELS[code]}
          </Link>
        );
      })}
    </div>
  );
}
