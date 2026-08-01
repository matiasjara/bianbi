import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeStayList } from "@/components/campaigns/MicrositeStayList";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";
import { localizeLanding } from "@/lib/i18n/landing";
import { getMicrositeUi } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";
import { loadCampaignPackBySlug } from "@/lib/demand/load-campaign-packs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

/** Color de acento Airbnb (Rausch) — solo color, sin logo. */
const AIRBNB_BTN_LG =
  "inline-flex items-center justify-center rounded-lg bg-[#FF5A5F] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#E0484D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]";

async function resolveLandingLocale(searchLang?: string) {
  const hdrs = await headers();
  const jar = await cookies();
  return resolveLocale({
    searchLang: searchLang ?? null,
    cookieLang: jar.get(LANG_COOKIE)?.value ?? null,
    acceptLanguage: hdrs.get("accept-language"),
  });
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack) return { title: "Bianbi" };
  const locale = await resolveLandingLocale(sp.lang);
  const L = localizeLanding(pack, locale);
  return {
    title: L.headline,
    description: L.subhead,
    alternates: {
      languages: {
        es: `/c/${slug}?lang=es`,
        en: `/c/${slug}?lang=en`,
        pt: `/c/${slug}?lang=pt`,
      },
    },
  };
}

export default async function CampaignLandingPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack) notFound();

  const locale = await resolveLandingLocale(sp.lang);
  const L = localizeLanding(pack, locale);
  const { ui } = L;

  const lead = L.properties[0];
  const stayUi = getMicrositeUi(locale);

  const mapMarkers = [
    {
      lat: pack.venueLat,
      lng: pack.venueLng,
      label: pack.venueName,
      kind: "venue" as const,
    },
    ...uniquePropertyLocations(L.properties).map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.buildingName ?? p.neighborhood,
      kind: "property" as const,
    })),
  ];

  return (
    <div lang={locale} className="min-h-screen bg-[#f7f4f0] text-[#222222]">
      <div
        className="relative min-h-[78vh] overflow-hidden"
        style={{
          backgroundImage: lead?.photo
            ? `linear-gradient(180deg, rgba(34,34,34,0.25) 0%, rgba(34,34,34,0.72) 55%, rgba(34,34,34,0.92) 100%), url(${lead.photo}?im_w=1440)`
            : "linear-gradient(160deg, #2b2b2b, #111)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <LandingLangSwitch basePath={`/c/${slug}`} locale={locale} />
        <div className="mx-auto flex min-h-[78vh] max-w-4xl flex-col justify-end px-5 pb-14 pt-24">
          <div className="animate-rise mb-4 inline-flex rounded-xl bg-[var(--brand-crema,#F4F0E8)]/95 shadow-sm">
            <BianbiLogo variant="logo" href="/" />
          </div>
          <p className="animate-rise mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
            {pack.venueName} · {pack.eventDates}
          </p>
          <h1 className="animate-rise max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-white md:text-5xl">
            {L.headline}
          </h1>
          <p className="animate-rise-delay mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            {L.subhead}
          </p>

          <p className="animate-rise-delay mt-5 max-w-2xl text-sm text-white/80">
            {L.heroLine}
          </p>

          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            {lead ? (
              <a
                href={lead.airbnbUrl}
                target="_blank"
                rel="noreferrer"
                className={AIRBNB_BTN_LG}
              >
                {ui.ctaAirbnb}
              </a>
            ) : null}
            <a
              href="#deptos"
              className="inline-flex items-center justify-center rounded-lg border border-white/55 bg-white/10 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {ui.ctaSeeUnits}
            </a>
          </div>
        </div>
      </div>

      <section className="border-b border-black/8 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            {ui.whyTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6a6a6a]">
            {ui.whyBody(pack.venueName)}
          </p>
          <ol className="mt-8 space-y-5">
            {L.trustPoints.map((point, i) => (
              <li key={`${locale}-${i}`} className="flex gap-4">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#222] text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[#222]">
                  {point}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="deptos" className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
          {ui.unitsTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6a6a6a]">
          {ui.unitsBody(pack.venueName)}
        </p>

        <MicrositeStayList
          variant="landing"
          properties={L.properties}
          ui={{
            minWalk: stayUi.minWalk,
            ctaAirbnb: ui.ctaBook,
            stayUnitOption: stayUi.stayUnitOption,
            stayReviews: stayUi.stayReviews,
          }}
        />
        <p className="mt-6 text-xs text-[#6a6a6a]">{ui.paySafe}</p>
      </section>

      <section id="mapa" className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            {ui.mapTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6a6a6a]">
            {ui.mapBody(pack.venueName)}
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-black/8">
            <LandingMap markers={mapMarkers} className="h-96 w-full" />
          </div>
        </div>
      </section>

      <section className="border-t border-black/8 bg-[#222] text-white">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            {ui.closeTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            {ui.closeBody(pack.eventDates, pack.venueName)}
          </p>
          {lead ? (
            <a
              href={lead.airbnbUrl}
              target="_blank"
              rel="noreferrer"
              className={`${AIRBNB_BTN_LG} mt-8`}
            >
              {ui.ctaGoAirbnb}
            </a>
          ) : null}
        </div>
      </section>

      <PublicSiteFooter
        note={`${ui.footerStay(pack.eventDates)} ${ui.footerDisclaimer}`}
      />
    </div>
  );
}
