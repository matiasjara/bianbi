import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import type { BrandIconName } from "@/lib/brand/icons";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeStayList } from "@/components/campaigns/MicrositeStayList";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import {
  eventsOverlapBridge,
  formatBridgeRange,
  upcomingHolidayBridges,
} from "@/lib/demand/holiday-bridges";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { loadAllSignals } from "@/lib/demand/load-signals";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";
import { santiagoCatalogMapMarkers } from "@/lib/demand/santiago-map-pois";
import { micrositePath } from "@/lib/demand/travel-brief";
import { getCatalogStayProperties } from "@/lib/i18n/catalog";
import {
  getHolidayWeekendUi,
  getSantiagoHolidayPlans,
} from "@/lib/i18n/holiday-weekend";
import { getMicrositeUi } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";
import type { Locale } from "@/lib/i18n/locale";

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
  const ui = getHolidayWeekendUi(locale);
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: {
      languages: {
        es: "/santiago/feriados?lang=es",
        en: "/santiago/feriados?lang=en",
        pt: "/santiago/feriados?lang=pt",
      },
    },
  };
}

function planIcon(name: BrandIconName) {
  return name;
}

export default async function HolidayWeekendPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = await resolveLocaleFromRequest(sp.lang);
  const ui = getHolidayWeekendUi(locale);
  const stayUi = getMicrositeUi(locale);
  const plans = getSantiagoHolidayPlans(locale);
  const stayProperties = getCatalogStayProperties(locale);
  const mapProperties = uniquePropertyLocations(stayProperties);

  const today = new Date().toISOString().slice(0, 10);
  const { signals } = await loadAllSignals({ city: "santiago" });
  const holidays = signals.filter((s) => s.kind === "holiday");
  const bridges = upcomingHolidayBridges(holidays, today, 8);
  const nextBridge = bridges[0] ?? null;

  const packs = await loadAllCampaignPacks({ limit: 80 });
  const eventPacks = packs
    .filter(
      (p) =>
        p.microsite &&
        p.eventEndsOn >= today &&
        p.interest !== "turismo_general" &&
        (!nextBridge ||
          eventsOverlapBridge(
            p.eventStartsOn,
            p.eventEndsOn,
            nextBridge,
          )),
    )
    .slice(0, 8);

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
      <header className="relative border-b border-[var(--ms-line)]/70 bg-gradient-to-b from-[var(--ms-coral)]/8 to-transparent">
        <LandingLangSwitch
          basePath="/santiago/feriados"
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
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.audienceTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ms-muted)]">
            {ui.audienceBody}
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/40 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.bridgesTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--ms-muted)]">
            {ui.bridgesBody}
          </p>
          {bridges.length > 0 ? (
            <ul className="mt-8 space-y-3">
              {bridges.map((b, i) => (
                <li
                  key={b.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 ${
                    i === 0
                      ? "border-[var(--ms-coral)]/40 bg-[var(--ms-coral)]/5"
                      : "border-[var(--ms-line)] bg-white/80"
                  }`}
                >
                  <div>
                    <p className="font-medium text-[var(--ms-ink)]">{b.title}</p>
                    <p className="text-sm text-[var(--ms-muted)]">
                      {formatBridgeRange(b, locale as Locale)} ·{" "}
                      {ui.bridgesDays(b.days)}
                      {b.holidayNames.length > 0
                        ? ` · ${b.holidayNames.join(", ")}`
                        : ""}
                    </p>
                  </div>
                  {b.major ? (
                    <span className="rounded-full bg-[var(--ms-coral)]/15 px-3 py-1 text-xs font-semibold text-[var(--ms-coral)]">
                      Alta demanda
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.plansTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--ms-muted)]">
            {ui.plansBody}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="rounded-2xl border border-[var(--ms-line)] bg-white/80 p-5"
              >
                <BrandIcon name={planIcon(plan.icon)} size={24} />
                <p className="mt-3 font-[family-name:var(--font-display)] text-lg">
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-[var(--ms-muted)]">{plan.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 bg-[var(--ms-panel)]/30 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl md:text-3xl">{ui.eventsTitle}</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--ms-muted)]">
            {nextBridge
              ? `${ui.eventsBody} (${formatBridgeRange(nextBridge, locale as Locale)})`
              : ui.eventsBody}
          </p>
          {eventPacks.length > 0 ? (
            <ul className="mt-6 divide-y divide-[var(--ms-line)] rounded-2xl border border-[var(--ms-line)] bg-white/80">
              {eventPacks.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={micrositePath(p.slug)}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--ms-panel)]/50"
                  >
                    <div>
                      <p className="font-medium">{p.eventTitle}</p>
                      <p className="text-xs text-[var(--ms-muted)]">
                        {p.interestLabel} · {p.eventDates}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--ms-teal)]">
                      {ui.eventsCta} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[var(--ms-muted)]">{ui.eventsEmpty}</p>
          )}
        </div>
      </section>

      <section className="border-b border-[var(--ms-line)]/70 px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="ms-editorial text-2xl">{ui.tipsTitle}</h2>
          <ul className="mt-6 space-y-3">
            {ui.tips.map((tip) => (
              <li
                key={tip.slice(0, 40)}
                className="flex gap-3 text-[15px] leading-relaxed text-[var(--ms-ink)]"
              >
                <span className="text-[var(--ms-coral)]">·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#deptos"
              className="inline-flex rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-6 py-3.5 text-base font-semibold text-white"
            >
              {ui.ctaStay}
            </a>
            <Link
              href="/santiago/negocios"
              className="inline-flex rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white/90"
            >
              Viaje de trabajo
            </Link>
          </div>
        </div>
      </section>

      <PublicSiteFooter tone="light" note={ui.footerNote} />
    </div>
  );
}
