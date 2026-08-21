import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeStayList } from "@/components/campaigns/MicrositeStayList";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { getAllStayBuildingSlugs } from "@/lib/data/stay-buildings";
import { mediaSrc } from "@/lib/demand/guide-images";
import { buildStayBuildingMapMarkers } from "@/lib/demand/stay-building-map";
import { stayBuildingPublicPath } from "@/lib/demand/stay-building-path";
import {
  getBuildingPageAttractions,
  getBuildingPageCopy,
  getBuildingPublicLocation,
  getBuildingStayProperties,
  resolveBuildingPage,
} from "@/lib/i18n/building-pages";
import { getCatalogUi } from "@/lib/i18n/catalog";
import { getMicrositeUi } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

async function resolveCatalogLocale(searchLang?: string) {
  const hdrs = await headers();
  const jar = await cookies();
  return resolveLocale({
    searchLang: searchLang ?? null,
    cookieLang: jar.get(LANG_COOKIE)?.value ?? null,
    acceptLanguage: hdrs.get("accept-language"),
  });
}

export function generateStaticParams() {
  return getAllStayBuildingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const building = resolveBuildingPage(slug);
  if (!building) return {};

  const locale = await resolveCatalogLocale(sp.lang);
  const copy = getBuildingPageCopy(building.buildingId, locale);
  if (!copy) return {};

  const path = stayBuildingPublicPath(building.buildingId);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      languages: {
        es: `${path}?lang=es`,
        en: `${path}?lang=en`,
        pt: `${path}?lang=pt`,
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

export default async function StayBuildingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const building = resolveBuildingPage(slug);
  if (!building) notFound();

  const locale = await resolveCatalogLocale(sp.lang);
  const copy = getBuildingPageCopy(building.buildingId, locale);
  if (!copy) notFound();

  const catalogUi = getCatalogUi(locale);
  const stayUi = getMicrositeUi(locale);
  const stayProperties = getBuildingStayProperties(building.buildingId, locale);
  const attractions = getBuildingPageAttractions(building, locale);
  const basePath = stayBuildingPublicPath(building.buildingId);

  const mapMarkers = buildStayBuildingMapMarkers(building);

  const [heroMetaPrimary, heroMetaSecondary] = copy.heroMeta.split(" · ");

  return (
    <div lang={locale} className="ms-root min-h-screen overflow-x-hidden">
      <header className="relative overflow-hidden">
        <LandingLangSwitch basePath={basePath} locale={locale} theme="dark" />
        <div
          className="relative flex min-h-[88svh] flex-col justify-end"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(22,26,34,0.25) 0%, rgba(22,26,34,0.55) 45%, rgba(22,26,34,0.96) 100%), url(${mediaSrc(building.heroImage, 1440)})`,
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
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                {copy.eyebrow}
              </span>
            </div>

            <div className="ms-rise mt-8 max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                {copy.eyebrow} · Alojamiento
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
                {copy.headline}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/80 sm:text-base">
                {copy.subhead}
              </p>
              <p className="mt-4 text-sm font-medium text-white/70">
                <span className="text-white">{heroMetaPrimary}</span>
                {heroMetaSecondary ? (
                  <>
                    <span aria-hidden> · </span>
                    {heroMetaSecondary}
                  </>
                ) : null}
              </p>
              <p className="mt-2 text-sm text-white/60">
                {getBuildingPublicLocation(building)}
              </p>
            </div>

            <div className="ms-rise mt-8 flex flex-wrap gap-3">
              <a
                href="#deptos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ms-airbnb,#FF5A5F)] px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:brightness-95"
              >
                {copy.ctaSee}
              </a>
              <a
                href="#mapa"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-bold text-[var(--ms-ink)] transition hover:bg-white/90"
              >
                <BrandIcon name="pin" size={24} />
                {copy.ctaMap}
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <SectionIntro
            kicker="Alojamiento"
            title={copy.whyTitle}
            body={copy.subhead}
          />
          <ol className="mt-8 space-y-5">
            {copy.whyPoints.map((point, i) => (
              <li key={`${building.buildingId}-why-${i}`} className="flex gap-4">
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

      {attractions.length > 0 ? (
        <section className="border-b border-[var(--ms-line)]/70 px-5 py-14">
          <div className="mx-auto max-w-5xl">
            <SectionIntro
              kicker="Santiago"
              title={copy.attractionsTitle}
              body={copy.attractionsBody}
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
      ) : null}

      <section id="deptos" className="scroll-mt-20 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionIntro
            kicker="Unidades"
            title={copy.unitsTitle}
            body={copy.unitsBody(building.unitCount)}
          />

          <MicrositeStayList
            variant="landing"
            properties={stayProperties}
            ui={{
              minWalk: stayUi.minWalk,
              ctaAirbnb: catalogUi.ctaBook,
              locale,
            }}
          />
          <p className="mt-6 text-xs text-[var(--ms-muted)]">{copy.paySafe}</p>
        </div>
      </section>

      <section
        id="mapa"
        className="border-t border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/40 px-5 py-14"
      >
        <div className="mx-auto max-w-5xl">
          <SectionIntro kicker="Mapa" title={copy.mapTitle} body={copy.mapBody} />
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--ms-line)] shadow-[0_8px_30px_rgba(22,26,34,0.06)]">
            <LandingMap
              markers={mapMarkers}
              className="h-96 w-full"
              centerOnKind="property"
              centerZoom={14}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--ms-line)] bg-[var(--ms-ink)] text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center">
          <a
            href={`/santiago?lang=${locale}`}
            className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            {copy.seeAllBuildings}
          </a>
          <div className="mt-8">
            <a
              href="#deptos"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              {copy.ctaSee}
            </a>
          </div>
        </div>
      </section>

      <PublicSiteFooter
        tone="light"
        note={`${copy.footerStay} ${copy.footerDisclaimer}`}
      />
    </div>
  );
}
