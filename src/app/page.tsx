import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { HomeCitySelector } from "@/components/home/HomeCitySelector";
import { HomeEventCalendar } from "@/components/home/HomeEventCalendar";
import { HomeHeroBackdrop } from "@/components/home/HomeHeroBackdrop";
import { HorizontalScrollRow } from "@/components/home/HorizontalScrollRow";
import type { BrandIconName } from "@/lib/brand/icons";
import { properties } from "@/lib/data/seed";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { cityLabel, parseCityParam } from "@/lib/demand/cities";
import type { CalendarEvent } from "@/lib/demand/event-calendar";
import { clampToCurrentOrFutureMonth } from "@/lib/demand/event-calendar";
import {
  classifyEventType,
  eventTypeLabel,
  parseEventTypeParam,
} from "@/lib/demand/event-type";
import { parseMonthParam } from "@/lib/demand/month-range";
import { micrositePath } from "@/lib/demand/travel-brief";
import { SITE_URL } from "@/lib/site/url";
import {
  buildRotatingSequenceMap,
  categoryCover,
  guideCoverUrl,
  mediaSrc,
} from "@/lib/demand/guide-images";
import type { CampaignInterest, CampaignPack } from "@/lib/demand/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Crambie — Guías de eventos y alojamiento en Santiago",
  },
  description:
    "Guías concretas de conciertos, partidos y eventos en Santiago: fechas, mapa, tips, transporte y dónde alojarte cerca. Actualizadas constantemente.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Crambie — Guías de eventos y alojamiento en Santiago",
    description:
      "Lo esencial de cada evento en Santiago: fechas, venue, tips y alojamiento cerca. Guías que se actualizan con la cartelera.",
    type: "website",
    url: "/",
  },
  robots: { index: true, follow: true },
};

type Category = {
  id: string;
  interests: CampaignInterest[];
  label: string;
  icon: BrandIconName;
};

const CATEGORIES: Category[] = [
  {
    id: "conciertos",
    interests: ["concierto"],
    label: "Conciertos",
    icon: "music",
  },
  {
    id: "futbol",
    interests: ["partido_futbol"],
    label: "Fútbol",
    icon: "soccer",
  },
  {
    id: "deporte",
    interests: ["deporte_competencia"],
    label: "Deporte",
    icon: "medal",
  },
  {
    id: "nieve",
    interests: ["nieve"],
    label: "Nieve",
    icon: "snowflake",
  },
  {
    id: "viaje",
    interests: ["feriado_puente", "vacaciones_familias", "turismo_general"],
    label: "Viaje",
    icon: "luggage",
  },
  {
    id: "congresos",
    interests: ["congreso_feria"],
    label: "Congresos / ferias",
    icon: "megaphone",
  },
  {
    id: "otros",
    interests: ["otro_evento"],
    label: "Teatro / cultura",
    icon: "camera",
  },
];

function sortUpcoming(packs: CampaignPack[]): CampaignPack[] {
  const today = new Date().toISOString().slice(0, 10);
  return [...packs]
    .filter((p) => p.microsite && p.eventEndsOn >= today)
    .sort((a, b) => {
      if (a.eventStartsOn !== b.eventStartsOn) {
        return a.eventStartsOn.localeCompare(b.eventStartsOn);
      }
      return b.score - a.score;
    });
}

function coverFor(
  pack: CampaignPack,
  sequenceMap: Map<string, number>,
): string | null {
  const propertyPhoto =
    pack.properties[0]?.photos?.[0] || pack.properties[0]?.photo || null;
  return guideCoverUrl(
    {
      interest: pack.interest,
      venueName: pack.venueName,
      eventTitle: pack.eventTitle,
      slug: pack.slug,
      sequenceIndex: sequenceMap.get(pack.slug),
    },
    propertyPhoto,
  );
}

function GuideCard({
  pack,
  tilt,
  sequenceMap,
}: {
  pack: CampaignPack;
  tilt?: "l" | "r";
  sequenceMap: Map<string, number>;
}) {
  const cover = coverFor(pack, sequenceMap);
  const mins = pack.properties[0]?.walkingMinutes;
  return (
    <Link
      href={micrositePath(pack.slug)}
      className={`group relative block ${
        tilt === "l" ? "md:-rotate-1" : tilt === "r" ? "md:rotate-1" : ""
      }`}
    >
      <article className="overflow-hidden rounded-[1.25rem] border border-[var(--ms-line)] bg-[var(--ms-panel)] transition group-hover:-translate-y-0.5 group-hover:border-[var(--ms-olive)]/50">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ms-mist,#cfc9c0)]/40">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc(cover, 720)}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center opacity-40">
              <BrandIcon name="pin" size={40} />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-[var(--ms-paper)]/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-ink)]">
            {pack.interestLabel}
          </span>
        </div>
        <div className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
            {pack.eventDates}
            {mins != null ? ` · ${mins} min` : ""}
          </p>
          <h3 className="ms-editorial mt-1.5 line-clamp-2 text-lg leading-snug">
            {pack.eventTitle}
          </h3>
          <p className="mt-1 truncate text-sm text-[var(--ms-muted)]">
            {pack.venueName}
          </p>
        </div>
      </article>
    </Link>
  );
}

function packToCalendarEvent(
  pack: CampaignPack,
  sequenceMap: Map<string, number>,
): CalendarEvent | null {
  if (!pack.microsite) return null;
  const eventType = classifyEventType({
    title: pack.eventTitle,
    venueName: pack.venueName,
    interest: pack.interest,
  });
  return {
    slug: pack.slug,
    title: pack.microsite.guideTitle,
    start: pack.eventStartsOn,
    end: pack.eventEndsOn,
    interestLabel: eventTypeLabel(eventType),
    eventType,
    venueName: pack.venueName,
    eventDates: pack.eventDates,
    coverUrl: coverFor(pack, sequenceMap),
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    year?: string;
    month?: string;
    city?: string;
    tipo?: string;
  }>;
}) {
  const params = await searchParams;
  const city = parseCityParam(params.city);
  const requested = parseMonthParam(params.year, params.month);
  const { year, monthIndex } = clampToCurrentOrFutureMonth(
    requested.year,
    requested.monthIndex,
  );
  const tipo = parseEventTypeParam(params.tipo);

  const [packs, monthPacks] = await Promise.all([
    loadAllCampaignPacks({ limit: 80, city }),
    loadAllCampaignPacks({ year, monthIndex, limit: 80, city }),
  ]);

  const sortedPacks = sortUpcoming(packs);
  const photoSequence = buildRotatingSequenceMap(sortedPacks);
  const monthPhotoSequence = buildRotatingSequenceMap(monthPacks);
  const today = new Date().toISOString().slice(0, 10);

  const calendarEvents: CalendarEvent[] = monthPacks
    .map((p) => packToCalendarEvent(p, monthPhotoSequence))
    .filter((e): e is CalendarEvent => e != null && e.end >= today);

  const upcomingCalendarEvents: CalendarEvent[] = sortedPacks
    .map((p) => packToCalendarEvent(p, photoSequence))
    .filter((e): e is CalendarEvent => e != null);
  const featured = sortedPacks.slice(0, 6);
  const realProperties = properties.filter((p) => p.isReal && p.photos[0]);
  const stayPhotos = (
    ["prop-e801", "prop-z114", "prop-t112", "prop-z107"] as const
  )
    .map((id) => realProperties.find((p) => p.id === id))
    .filter(Boolean) as typeof realProperties;

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    packs: sortedPacks.filter((p) => cat.interests.includes(p.interest)),
  })).filter((c) => c.packs.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Crambie",
    url: `${SITE_URL}/`,
    description:
      "Guías de eventos en Santiago y alojamiento cerca del venue.",
  };

  const cityName = cityLabel(city);
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Próximas guías de eventos en ${cityName}`,
    itemListElement: featured.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${micrositePath(p.slug)}`,
      name: p.microsite.guideTitle,
    })),
  };

  return (
    <div className="ms-root min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />

      {/* HERO — full-bleed + marca + CTA */}
      <header className="relative overflow-hidden">
        <div className="relative flex min-h-[88svh] flex-col justify-end md:min-h-[92svh]">
          <HomeHeroBackdrop />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-12 pt-16 md:pb-16 md:pt-20">
            <div className="ms-rise">
              <BianbiLogo
                variant="logo"
                href={null}
                tone="onDark"
                size="lg"
                priority
              />
            </div>
            <div className="ms-rise ms-rise-d1 mt-6">
              <Suspense
                fallback={
                  <div className="h-10 w-48 animate-pulse rounded-lg bg-white/15" />
                }
              >
                <HomeCitySelector
                  city={city}
                  year={year}
                  monthIndex={monthIndex}
                  theme="dark"
                />
              </Suspense>
            </div>
            <h1 className="ms-rise ms-rise-d1 ms-editorial mt-8 max-w-xl text-[2.35rem] leading-[0.98] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
              Todo lo que necesitas para tu viaje
            </h1>
            <p className="ms-rise ms-rise-d2 mt-4 max-w-lg text-lg font-semibold leading-snug text-white/90 sm:text-xl">
              {cityName}, evento a evento: guías esenciales y dónde quedarte cerca
              del venue.
            </p>
            <div className="ms-rise ms-rise-d3 mt-8 flex flex-wrap gap-3">
              <a
                href="#calendario"
                className="inline-flex items-center rounded-xl bg-[var(--ms-airbnb,#FF5A5F)] px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:brightness-95"
              >
                Ver calendario
              </a>
              <Link
                href="/santiago"
                className="inline-flex items-center rounded-xl bg-white px-5 py-3.5 text-base font-bold text-[var(--ms-ink)] transition hover:bg-white/90"
              >
                Alojamientos
              </Link>
              <Link
                href="/santiago/feriados"
                className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Feriado en Santiago
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* CALENDARIO */}
      <section
        id="calendario"
        className="scroll-mt-8 border-b border-[var(--ms-line)]/70 px-5 py-8 md:py-10"
      >
        <div className="mx-auto max-w-6xl">
          <HomeEventCalendar
            city={city}
            year={year}
            monthIndex={monthIndex}
            events={calendarEvents}
            upcomingEvents={upcomingCalendarEvents}
            tipo={tipo}
          />
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="border-b border-[var(--ms-line)]/70 px-5 py-12 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            Explorar
          </p>
          <h2 className="ms-editorial mt-2 text-2xl md:text-3xl">
            Por categoría
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const thumb = categoryCover(cat.id);
              return (
                <a
                  key={cat.id}
                  href={`#cat-${cat.id}`}
                  className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-[var(--ms-line)] bg-[var(--ms-panel)]/80 px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-[var(--ms-olive)]/45"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14] transition duration-500 group-hover:scale-105 group-hover:opacity-20"
                    />
                  ) : null}
                  <BrandIcon name={cat.icon} size={48} className="relative" />
                  <span className="relative text-sm font-semibold">
                    {cat.label}
                  </span>
                  <span className="relative text-[11px] text-[var(--ms-muted)]">
                    {cat.packs.length}{" "}
                    {cat.packs.length === 1 ? "guía" : "guías"}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTACADAS */}
      <section id="destacadas" className="scroll-mt-8 px-5 py-14 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
                Cartelera
              </p>
              <h2 className="ms-editorial mt-2 text-2xl md:text-3xl">
                Próximas guías
              </h2>
            </div>
            <a
              href="#categorias-lista"
              className="hidden text-sm font-semibold text-[var(--ms-olive)] underline-offset-4 hover:underline sm:inline"
            >
              Ver por categoría
            </a>
          </div>

          {featured.length === 0 ? (
            <p className="mt-10 text-sm text-[var(--ms-muted)]">
              {city === "concepcion" ? (
                <>
                  Pronto habrá guías de eventos en Concepción. Por ahora explora{" "}
                  <Link href="/" className="underline underline-offset-4">
                    Santiago
                  </Link>
                  .
                </>
              ) : (
                <>
                  Pronto hay nuevas guías. Mientras, mira{" "}
                  <Link href="/santiago" className="underline underline-offset-4">
                    alojamientos en Santiago
                  </Link>
                  .
                </>
              )}
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((pack, i) => (
                <GuideCard
                  key={pack.campaignId}
                  pack={pack}
                  tilt={i % 2 === 0 ? "l" : "r"}
                  sequenceMap={photoSequence}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LISTA POR CATEGORÍA */}
      <div id="categorias-lista" className="space-y-4 px-5 pb-6">
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="scroll-mt-10 border-t border-[var(--ms-line)]/70 py-12 md:py-14"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3">
                <BrandIcon name={cat.icon} size={44} />
                <h2 className="ms-editorial text-2xl md:text-3xl">
                  {cat.label}
                </h2>
                <span className="text-sm text-[var(--ms-muted)]">
                  {cat.packs.length}
                </span>
              </div>
              <HorizontalScrollRow className="mt-7">
                {cat.packs.slice(0, 8).map((pack) => (
                  <div
                    key={pack.campaignId}
                    className="w-[260px] shrink-0 sm:w-[280px]"
                  >
                    <GuideCard pack={pack} sequenceMap={photoSequence} />
                  </div>
                ))}
              </HorizontalScrollRow>
            </div>
          </section>
        ))}
      </div>

      {/* ALOJAMIENTOS */}
      <section className="border-t border-[var(--ms-line)]/70 px-5 py-14 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
                Quedarte
              </p>
              <h2 className="ms-editorial mt-2 text-2xl md:text-3xl">
                Alojamientos en Santiago
              </h2>
            </div>
            <Link
              href="/santiago"
              className="inline-flex items-center rounded-lg bg-[var(--ms-olive)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Ver todos
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {stayPhotos.map((p, i) => (
              <Link
                key={p.id}
                href="/santiago"
                className={`group relative overflow-hidden rounded-2xl border border-[var(--ms-line)] ${
                  i === 0 ? "md:-rotate-1" : i === 2 ? "md:rotate-1" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaSrc(p.photos[0], 720)}
                  alt={p.name}
                  className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-xs font-semibold text-white">
                  {p.neighborhood || p.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicSiteFooter
        showLogin
        note="Guías de eventos y alojamiento en Santiago."
      />
    </div>
  );
}
