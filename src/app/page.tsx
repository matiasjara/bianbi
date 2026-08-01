import type { Metadata } from "next";
import Link from "next/link";
import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import type { BrandIconName } from "@/lib/brand/icons";
import { properties } from "@/lib/data/seed";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { micrositePath } from "@/lib/demand/travel-brief";
import type { CampaignInterest, CampaignPack } from "@/lib/demand/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Bianbi — Guías de eventos y alojamiento en Santiago",
  },
  description:
    "Guías concretas de conciertos, partidos y eventos en Santiago: fechas, mapa, tips, transporte y dónde alojarte cerca. Actualizadas constantemente.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bianbi — Guías de eventos y alojamiento en Santiago",
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
    id: "otros",
    interests: ["otro_evento"],
    label: "Otros",
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

function coverFor(pack: CampaignPack): string | null {
  const photo = pack.properties[0]?.photos?.[0] || pack.properties[0]?.photo;
  return photo || null;
}

function GuideCard({
  pack,
  tilt,
}: {
  pack: CampaignPack;
  tilt?: "l" | "r";
}) {
  const cover = coverFor(pack);
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
              src={`${cover}?im_w=720`}
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

export default async function HomePage() {
  const packs = sortUpcoming(await loadAllCampaignPacks(28));
  const featured = packs.slice(0, 6);
  const stayPhotos = properties
    .filter((p) => p.isReal && p.photos[0])
    .slice(0, 4);

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    packs: packs.filter((p) => cat.interests.includes(p.interest)),
  })).filter((c) => c.packs.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bianbi",
    url: "https://bianbi.cl/",
    description:
      "Guías de eventos en Santiago y alojamiento cerca del venue.",
  };

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Próximas guías de eventos en Santiago",
    itemListElement: featured.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://bianbi.cl${micrositePath(p.slug)}`,
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

      {/* HERO — marca + una frase + collage */}
      <header className="relative border-b border-[var(--ms-line)]/70">
        <div
          className="ms-stroke right-[-4rem] top-10 h-28 w-[18rem] -rotate-6 bg-[var(--ms-teal)]/25 md:right-8"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-14 md:grid-cols-[1.05fr_0.95fr] md:min-h-[78vh] md:pb-16 md:pt-16">
          <div className="relative z-10">
            <div className="ms-rise">
              <BianbiLogo variant="logo" href={null} priority />
            </div>
            <h1 className="ms-rise ms-rise-d1 ms-editorial mt-8 max-w-md text-2xl leading-tight md:text-[2.6rem]">
              Guías que inspiran viajes con sentido
            </h1>
            <p className="ms-rise ms-rise-d2 mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--ms-muted)]">
              Santiago, evento a evento: lo esencial y dónde quedarte cerca.
            </p>
            <div className="ms-rise ms-rise-d3 mt-8 flex flex-wrap gap-3">
              <a
                href="#destacadas"
                className="inline-flex items-center rounded-lg bg-[var(--ms-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Ver guías
              </a>
              <Link
                href="/santiago"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--ms-line)] bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white"
              >
                <BrandIcon name="bed" size={18} />
                Alojamientos
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[340px] w-full max-w-md md:h-[420px] md:max-w-none">
            {stayPhotos.slice(0, 3).map((p, i) => {
              const poses = [
                "left-2 top-4 w-[58%] rotate-[-4deg] z-10",
                "right-0 top-16 w-[52%] rotate-[5deg] z-20",
                "left-[18%] bottom-0 w-[56%] rotate-[-2deg] z-30",
              ];
              return (
                <div
                  key={p.id}
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
                    src={`${p.photos[0]}?im_w=720`}
                    alt=""
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </header>

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
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--ms-line)] bg-[var(--ms-panel)]/80 px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-[var(--ms-olive)]/45"
              >
                <BrandIcon name={cat.icon} size={34} />
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className="text-[11px] text-[var(--ms-muted)]">
                  {cat.packs.length}{" "}
                  {cat.packs.length === 1 ? "guía" : "guías"}
                </span>
              </a>
            ))}
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
              Pronto hay nuevas guías. Mientras, mira{" "}
              <Link href="/santiago" className="underline underline-offset-4">
                alojamientos en Santiago
              </Link>
              .
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((pack, i) => (
                <GuideCard
                  key={pack.slug}
                  pack={pack}
                  tilt={i % 2 === 0 ? "l" : "r"}
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
                <BrandIcon name={cat.icon} size={32} />
                <h2 className="ms-editorial text-2xl md:text-3xl">
                  {cat.label}
                </h2>
                <span className="text-sm text-[var(--ms-muted)]">
                  {cat.packs.length}
                </span>
              </div>
              <div className="mt-7 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {cat.packs.slice(0, 8).map((pack) => (
                  <div key={pack.slug} className="w-[260px] shrink-0 sm:w-[280px]">
                    <GuideCard pack={pack} />
                  </div>
                ))}
              </div>
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
                  src={`${p.photos[0]}?im_w=720`}
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
