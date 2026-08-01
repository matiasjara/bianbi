import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { localizeLanding } from "@/lib/i18n/landing";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";
import { loadCampaignPackBySlug } from "@/lib/demand/load-campaign-packs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

/** Color de acento Airbnb (Rausch) — solo color, sin logo. */
const AIRBNB_BTN =
  "inline-flex items-center justify-center rounded-lg bg-[#FF5A5F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E0484D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]";

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

  const propertyPins = new Map<
    string,
    { lat: number; lng: number; label: string; kind: "property" }
  >();
  for (const p of L.properties) {
    const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
    if (!propertyPins.has(key)) {
      propertyPins.set(key, {
        lat: p.lat,
        lng: p.lng,
        label: p.neighborhood,
        kind: "property",
      });
    }
  }
  const mapMarkers = [
    {
      lat: pack.venueLat,
      lng: pack.venueLng,
      label: pack.venueName,
      kind: "venue" as const,
    },
    ...propertyPins.values(),
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

        <div className="mt-10 space-y-8">
          {L.properties.map((prop, idx) => (
            <article
              key={prop.slug}
              className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:grid md:grid-cols-[320px_1fr]"
            >
              <PhotoStoryCarousel
                photos={
                  prop.photos.length ? prop.photos : [prop.photo].filter(Boolean)
                }
                alt={prop.name}
                caption={prop.neighborhood}
                className="h-72 w-full md:h-full md:min-h-[360px]"
              />
              <div className="flex flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a6a6a]">
                  {ui.option(idx + 1, prop.walkingMinutes, prop.distanceKm)}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug">
                  {prop.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#484848]">
                  {prop.pitchLocalized}
                </p>

                <ul className="mt-4 grid gap-2 text-sm text-[#222] sm:grid-cols-2">
                  <li>
                    <span className="text-[#6a6a6a]">{ui.barrio}:</span>{" "}
                    {prop.neighborhood}
                  </li>
                  {prop.metroStations.length > 0 ? (
                    <li>
                      <span className="text-[#6a6a6a]">{ui.metro}:</span>{" "}
                      {prop.metroStations.join(", ")}
                    </li>
                  ) : null}
                  <li>
                    <span className="text-[#6a6a6a]">{ui.beds}:</span>{" "}
                    {ui.bedsValue}
                  </li>
                  <li>
                    <span className="text-[#6a6a6a]">
                      {locale === "en"
                        ? "Capacity"
                        : locale === "pt"
                          ? "Capacidade"
                          : "Capacidad"}
                      :
                    </span>{" "}
                    {ui.capacity(prop.capacity, prop.bedrooms)}
                  </li>
                  {prop.rating != null && prop.reviewCount != null ? (
                    <li>
                      <span className="text-[#6a6a6a]">Airbnb:</span>{" "}
                      {ui.airbnbRating(
                        prop.rating.toFixed(1),
                        prop.reviewCount,
                        Boolean(prop.isSuperhost),
                      )}
                    </li>
                  ) : null}
                </ul>

                <ul className="mt-4 flex flex-wrap gap-2 text-xs text-[#6a6a6a]">
                  {prop.amenitiesLocalized.map((a) => (
                    <li
                      key={a}
                      className="rounded-md bg-[#f7f4f0] px-2.5 py-1"
                    >
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={prop.airbnbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={AIRBNB_BTN}
                  >
                    {ui.ctaBook}
                  </a>
                  <span className="text-xs text-[#6a6a6a]">{ui.paySafe}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
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
