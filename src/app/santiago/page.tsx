import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeStayList } from "@/components/campaigns/MicrositeStayList";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { mediaSrc } from "@/lib/demand/guide-images";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";
import {
  getCatalogAttractions,
  getCatalogStayProperties,
  getCatalogUi,
  getCatalogWhyPoints,
} from "@/lib/i18n/catalog";
import { getMicrositeUi } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

const HERO_COLLAGE = [
  "/guides/barrios/barrio-italia.png",
  "/guides/santiago/centro-historico.jpg",
  "/guides/gastronomia/terraza.png",
] as const;

async function resolveCatalogLocale(searchLang?: string) {
  const hdrs = await headers();
  const jar = await cookies();
  return resolveLocale({
    searchLang: searchLang ?? null,
    cookieLang: jar.get(LANG_COOKIE)?.value ?? null,
    acceptLanguage: hdrs.get("accept-language"),
  });
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = await resolveCatalogLocale(sp.lang);
  const ui = getCatalogUi(locale);
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: {
      languages: {
        es: "/santiago?lang=es",
        en: "/santiago?lang=en",
        pt: "/santiago?lang=pt",
      },
    },
  };
}

function SectionIntro({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
        {kicker}
      </p>
      <h2 className="ms-editorial mt-2 text-2xl md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ms-muted)]">
        {body}
      </p>
    </>
  );
}

export default async function CatalogStayPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = await resolveCatalogLocale(sp.lang);
  const ui = getCatalogUi(locale);
  const stayUi = getMicrositeUi(locale);
  const why = getCatalogWhyPoints(locale);
  const attractions = getCatalogAttractions(locale);
  const stayProperties = getCatalogStayProperties(locale);
  const mapProperties = uniquePropertyLocations(stayProperties);

  const mapMarkers = mapProperties.map((p) => ({
    lat: p.lat,
    lng: p.lng,
    label: p.buildingName ?? p.neighborhood,
    kind: "property" as const,
  }));

  return (
    <div lang={locale} className="ms-root min-h-screen overflow-x-hidden">
      <header className="relative border-b border-[var(--ms-line)]/70">
        <LandingLangSwitch basePath="/santiago" locale={locale} theme="light" />
        <div
          className="ms-stroke right-[-3rem] top-8 h-24 w-40 rotate-[-8deg] bg-[var(--ms-teal)]/20 md:right-10"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 pb-14 pt-12 md:grid-cols-[1.05fr_0.95fr] md:pb-16 md:pt-14">
          <div className="relative z-10">
            <BianbiLogo variant="logo" href="/" />
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
              {ui.eyebrow}
            </p>
            <h1 className="ms-editorial mt-2 max-w-lg text-3xl leading-tight md:text-[2.35rem]">
              {ui.headline}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--ms-muted)]">
              {ui.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#deptos"
                className="inline-flex items-center rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-95"
              >
                {ui.ctaSee}
              </a>
              <Link
                href="/"
                className="inline-flex items-center rounded-lg border border-[var(--ms-line)] bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white"
              >
                Ver guías de eventos
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[320px] w-full max-w-md md:h-[400px] md:max-w-none">
            {HERO_COLLAGE.map((src, i) => {
              const poses = [
                "left-0 top-2 w-[58%] rotate-[-4deg] z-10",
                "right-0 top-14 w-[54%] rotate-[5deg] z-20",
                "left-[16%] bottom-0 w-[56%] rotate-[-2deg] z-30",
              ];
              return (
                <div
                  key={src}
                  className={`ms-polaroid absolute ${poses[i]}`}
                >
                  <span
                    className={`ms-tape ${
                      i === 0
                        ? "ms-tape-coral"
                        : i === 1
                          ? "ms-tape-olive"
                          : "ms-tape-terracotta"
                    } -top-2 left-1/3`}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaSrc(src, 720)}
                    alt=""
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <section className="border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <SectionIntro
            kicker="Alojamiento"
            title={ui.whyTitle}
            body={ui.whyBody}
          />
          <ol className="mt-8 space-y-5">
            {why.map((point, i) => (
              <li key={`${locale}-why-${i}`} className="flex gap-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ms-olive)] text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[var(--ms-ink)]">
                  {point}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionIntro
            kicker="Santiago"
            title={ui.attractionsTitle}
            body={ui.attractionsBody}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {attractions.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-[var(--ms-line)] bg-white/80 p-5 shadow-[0_8px_24px_rgba(22,26,34,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ms-line)] bg-[var(--ms-panel)]">
                    <BrandIcon name="pin" size={22} />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ms-ink)]">
                      {a.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--ms-muted)]">
                      {a.blurb}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="deptos" className="scroll-mt-20 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionIntro
            kicker="Alojamientos"
            title={ui.unitsTitle}
            body={ui.unitsBody}
          />

          <MicrositeStayList
            variant="landing"
            properties={stayProperties}
            ui={{
              minWalk: stayUi.minWalk,
              ctaAirbnb: ui.ctaBook,
              locale,
            }}
          />
          <p className="mt-6 text-xs text-[var(--ms-muted)]">{ui.paySafe}</p>
        </div>
      </section>

      <section id="mapa" className="border-t border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/40 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionIntro kicker="Mapa" title={ui.mapTitle} body={ui.mapBody} />
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--ms-line)] shadow-[0_8px_30px_rgba(22,26,34,0.06)]">
            <LandingMap markers={mapMarkers} className="h-96 w-full" />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--ms-line)] bg-[var(--ms-ink)] text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            {ui.closeTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            {ui.closeBody}
          </p>
          <a
            href="#deptos"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            {ui.ctaSee}
          </a>
        </div>
      </section>

      <PublicSiteFooter
        tone="light"
        note={`${ui.footerStay} ${ui.footerDisclaimer}`}
      />
    </div>
  );
}
