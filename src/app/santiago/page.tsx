import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeStayList } from "@/components/campaigns/MicrositeStayList";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { mediaSrc } from "@/lib/demand/guide-images";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";
import { santiagoCatalogMapMarkers } from "@/lib/demand/santiago-map-pois";
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

const HERO_BG = "/guides/deportes/estadio-nacional.png";

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

  const mapMarkers = [
    ...santiagoCatalogMapMarkers(),
    ...mapProperties.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.buildingName ?? p.neighborhood,
      kind: "property" as const,
    })),
  ];

  const [heroMetaPrimary, heroMetaSecondary] = ui.heroMeta.split(" · ");

  return (
    <div lang={locale} className="ms-root min-h-screen overflow-x-hidden">
      <header className="relative overflow-hidden">
        <LandingLangSwitch
          basePath="/santiago"
          locale={locale}
          theme="dark"
        />
        <div
          className="relative flex min-h-[92svh] flex-col justify-end"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(22,26,34,0.25) 0%, rgba(22,26,34,0.55) 45%, rgba(22,26,34,0.96) 100%), url(${mediaSrc(HERO_BG, 1440)})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        >
          <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-20 sm:px-5 sm:pb-12">
            <div className="ms-rise flex items-center gap-3 pr-20">
              <BianbiLogo
                href={`/?lang=${locale}`}
                variant="logo"
                tone="onDark"
                size="sm"
              />
            </div>

            <p className="ms-rise ms-rise-d1 mt-8 inline-flex rounded-md bg-[var(--ms-terracotta)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white sm:text-xs">
              {ui.heroBadge}
            </p>

            <h1 className="ms-rise ms-rise-d1 ms-editorial mt-4 max-w-[16ch] text-[2.65rem] leading-[0.98] tracking-[-0.02em] text-white sm:text-5xl md:max-w-none md:text-6xl lg:text-7xl">
              {ui.headline}
            </h1>

            <p className="ms-rise ms-rise-d2 mt-4 max-w-xl text-lg font-semibold leading-snug text-white/90 sm:text-xl md:text-2xl">
              {ui.subhead.map((part, i) =>
                part.bold ? (
                  <strong key={i} className="font-bold text-white">
                    {part.text}
                  </strong>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </p>

            <p className="ms-rise ms-rise-d2 mt-3 text-base font-bold tracking-wide text-[var(--ms-gold)] sm:text-lg">
              {heroMetaPrimary}
              {heroMetaSecondary ? (
                <>
                  <span className="mx-2 text-white/40">·</span>
                  <span className="text-white/85">{heroMetaSecondary}</span>
                </>
              ) : null}
            </p>

            <div className="ms-rise ms-rise-d3 mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {ui.heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm sm:px-3 sm:py-4"
                >
                  <p className="ms-editorial text-[1.75rem] leading-none text-[var(--ms-gold)] sm:text-4xl md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/75 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="ms-rise ms-rise-d3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#deptos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ms-airbnb,#FF5A5F)] px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:brightness-95"
              >
                <BrandIcon name="bed" size={24} tone="onDark" />
                {ui.ctaSee}
              </a>
              <a
                href="#mapa"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-bold text-[var(--ms-ink)] transition hover:bg-white/90"
              >
                <BrandIcon name="pin" size={24} />
                {ui.ctaMap}
              </a>
            </div>
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
            <LandingMap
              markers={mapMarkers}
              className="h-96 w-full"
              initialZoomBoost={2}
            />
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
