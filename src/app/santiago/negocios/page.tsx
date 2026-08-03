import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeStayList } from "@/components/campaigns/MicrositeStayList";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";
import { santiagoCatalogMapMarkers } from "@/lib/demand/santiago-map-pois";
import { micrositePath } from "@/lib/demand/travel-brief";
import { getCatalogStayProperties } from "@/lib/i18n/catalog";
import {
  getBusinessTravelUi,
  getBusinessTripTypes,
  getBusinessZones,
} from "@/lib/i18n/business-travel";
import { getMicrositeUi } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

async function resolveLocaleFromRequest(searchLang?: string) {
  const hdrs = await headers();
  const jar = await cookies();
  return resolveLocale({
    searchLang: searchLang ?? null,
    cookieLang: jar.get(LANG_COOKIE)?.value ?? null,
    acceptLanguage: hdrs.get("accept-language"),
  });
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const locale = await resolveLocaleFromRequest(sp.lang);
  const ui = getBusinessTravelUi(locale);
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: {
      languages: {
        es: "/santiago/negocios?lang=es",
        en: "/santiago/negocios?lang=en",
        pt: "/santiago/negocios?lang=pt",
      },
    },
  };
}

export default async function BusinessTravelPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = await resolveLocaleFromRequest(sp.lang);
  const ui = getBusinessTravelUi(locale);
  const stayUi = getMicrositeUi(locale);
  const zones = getBusinessZones(locale);
  const trips = getBusinessTripTypes(locale);
  const stayProperties = getCatalogStayProperties(locale);
  const mapProperties = uniquePropertyLocations(stayProperties);

  const today = new Date().toISOString().slice(0, 10);
  const packs = await loadAllCampaignPacks({ limit: 80 });
  const congressPacks = packs
    .filter(
      (p) =>
        p.interest === "congreso_feria" &&
        p.microsite &&
        p.eventEndsOn >= today,
    )
    .slice(0, 6);

  const mapMarkers = [
    ...santiagoCatalogMapMarkers(),
    ...mapProperties.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.buildingName ?? p.neighborhood,
      kind: "property" as const,
    })),
  ];

  return (
    <div lang={locale} className="ms-root min-h-screen overflow-x-hidden">
      <header className="relative border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/30">
        <LandingLangSwitch
          basePath="/santiago/negocios"
          locale={locale}
          theme="light"
        />
        <div className="mx-auto max-w-5xl px-5 pb-14 pt-12 md:pb-16 md:pt-14">
          <BianbiLogo variant="logo" href="/" tone="onLight" />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            {ui.eyebrow}
          </p>
          <h1 className="ms-editorial mt-2 max-w-2xl text-3xl leading-tight md:text-[2.35rem]">
            {ui.headline}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ms-muted)]">
            {ui.subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#deptos"
              className="inline-flex items-center rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              {ui.ctaStay}
            </a>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-[var(--ms-line)] bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white"
            >
              {ui.ctaEvents}
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-[var(--ms-line)]/70">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            {ui.modelTitle}
          </p>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ms-muted)]">
            {ui.modelBody}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[var(--ms-line)] bg-white/90 p-6 shadow-[0_8px_24px_rgba(22,26,34,0.04)]">
              <BrandIcon name="calendar" size={24} className="text-[var(--ms-teal)]" />
              <h2 className="ms-editorial mt-4 text-xl">{ui.modelEventTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ms-muted)]">
                {ui.modelEventBody}
              </p>
            </article>
            <article className="rounded-2xl border-2 border-[var(--ms-teal)]/30 bg-[var(--ms-teal)]/5 p-6">
              <BrandIcon name="route" size={24} className="text-[var(--ms-teal)]" />
              <h2 className="ms-editorial mt-4 text-xl">{ui.modelEvergreenTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ms-muted)]">
                {ui.modelEvergreenBody}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/40 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.zonesTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ms-muted)]">
            {ui.zonesBody}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {zones.map((z) => (
              <li
                key={z.id}
                className="rounded-2xl border border-[var(--ms-line)] bg-white/80 p-5"
              >
                <p className="font-[family-name:var(--font-display)] text-lg">
                  {z.name}
                </p>
                <p className="mt-1 text-sm text-[var(--ms-muted)]">{z.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {z.goodFor.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-[var(--ms-panel)] px-2.5 py-0.5 text-xs text-[var(--ms-ink)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.tripsTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--ms-muted)]">
            {ui.tripsBody}
          </p>
          <ol className="mt-8 space-y-5">
            {trips.map((t, i) => (
              <li key={t.id} className="flex gap-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ms-ink)] text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[var(--ms-ink)]">{t.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ms-muted)]">
                    {t.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {congressPacks.length > 0 ? (
        <section className="border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/30 px-5 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="ms-editorial text-2xl md:text-3xl">{ui.congressTitle}</h2>
            <p className="mt-2 max-w-2xl text-[15px] text-[var(--ms-muted)]">
              {ui.congressBody}
            </p>
            <ul className="mt-6 divide-y divide-[var(--ms-line)] rounded-2xl border border-[var(--ms-line)] bg-white/80">
              {congressPacks.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={micrositePath(p.slug)}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--ms-panel)]/50"
                  >
                    <div>
                      <p className="font-medium text-[var(--ms-ink)]">
                        {p.eventTitle}
                      </p>
                      <p className="text-xs text-[var(--ms-muted)]">
                        {p.eventDates}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--ms-teal)]">
                      {ui.congressCta} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="deptos" className="scroll-mt-20 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.stayTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--ms-muted)]">
            {ui.stayBody}
          </p>
          <MicrositeStayList
            variant="landing"
            properties={stayProperties}
            ui={{
              minWalk: stayUi.minWalk,
              ctaAirbnb: stayUi.ctaAirbnb,
              locale,
            }}
          />
        </div>
      </section>

      <section className="border-t border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/40 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl">{ui.mapTitle}</h2>
          <p className="mt-2 text-sm text-[var(--ms-muted)]">{ui.mapBody}</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--ms-line)]">
            <LandingMap markers={mapMarkers} className="h-96 w-full" initialZoomBoost={2} />
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
            className="mt-8 inline-flex rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-6 py-3.5 text-base font-semibold text-white"
          >
            {ui.ctaStay}
          </a>
        </div>
      </section>

      <PublicSiteFooter tone="light" note={ui.footerNote} />
    </div>
  );
}
