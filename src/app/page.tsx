import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { micrositePath } from "@/lib/demand/travel-brief";
import type { CampaignPack } from "@/lib/demand/types";

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

export default async function HomePage() {
  const packs = sortUpcoming(await loadAllCampaignPacks(24)).slice(0, 18);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bianbi",
    url: "https://bianbi.cl/",
    description:
      "Guías de eventos en Santiago y alojamiento cerca del venue.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bianbi.cl/g/{slug}",
      "query-input": "required name=slug",
    },
  };

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Próximas guías de eventos en Santiago",
    itemListElement: packs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://bianbi.cl${micrositePath(p.slug)}`,
      name: p.microsite.guideTitle,
    })),
  };

  return (
    <div className="ms-root min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />

      <header className="relative overflow-hidden border-b border-[var(--ms-line)]/70">
        <div className="ms-dotgrid pointer-events-none absolute inset-0 opacity-55" />
        <div
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(11,110,79,0.45), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(27,77,137,0.4), transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[72vh] max-w-4xl flex-col justify-end px-5 pb-14 pt-20 md:min-h-[78vh] md:pb-16">
          <p className="ms-rise font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ms-ink)] md:text-6xl">
            Bianbi
          </p>
          <h1 className="ms-rise ms-rise-d1 mt-5 max-w-2xl font-[family-name:var(--font-display)] text-2xl leading-tight tracking-tight text-[var(--ms-ink)] md:text-4xl">
            Guías concretas para vivir Santiago en evento
          </h1>
          <p className="ms-rise ms-rise-d2 mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ms-muted)] md:text-base">
            Fechas, venue, tips, transporte y dónde alojarte cerca. Una página
            clara por evento, actualizada con la cartelera.
          </p>
          <div className="ms-rise ms-rise-d3 mt-8 flex flex-wrap gap-3">
            <a
              href="#guias"
              className="inline-flex items-center rounded-lg bg-[var(--ms-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Ver próximas guías
            </a>
            <Link
              href="/santiago"
              className="inline-flex items-center rounded-lg border border-[var(--ms-line)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--ms-ink)] backdrop-blur transition hover:bg-white"
            >
              Alojamientos en Santiago
            </Link>
          </div>
        </div>
      </header>

      <section id="guias" className="scroll-mt-8 px-5 py-14 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            Cartelera viva
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Próximas guías
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
            Cada guía resume lo esencial del evento y opciones para quedarte
            cerca.
          </p>

          {packs.length === 0 ? (
            <p className="mt-10 text-sm text-[var(--ms-muted)]">
              Pronto publicamos nuevas guías. Mientras tanto, revisa{" "}
              <Link href="/santiago" className="underline underline-offset-4">
                alojamientos en Santiago
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-10 divide-y divide-[var(--ms-line)]/80 border-y border-[var(--ms-line)]/80">
              {packs.map((pack, i) => (
                <li key={pack.slug}>
                  <Link
                    href={micrositePath(pack.slug)}
                    className="group flex flex-col gap-2 py-5 transition md:flex-row md:items-baseline md:justify-between md:gap-8"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ms-accent)]">
                        {pack.interestLabel}
                        <span className="mx-2 text-[var(--ms-line)]">·</span>
                        <span className="text-[var(--ms-muted)]">
                          {pack.eventDates}
                        </span>
                      </p>
                      <p className="mt-1.5 font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--ms-ink)] transition group-hover:text-[var(--ms-accent)] md:text-xl">
                        {pack.microsite.guideTitle}
                      </p>
                      <p className="mt-1 text-sm text-[var(--ms-muted)]">
                        {pack.venueName}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[var(--ms-ink)]/50 transition group-hover:text-[var(--ms-accent)]">
                      Abrir guía {String(i + 1).padStart(2, "0")} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="border-t border-[var(--ms-line)]/70 px-5 py-14 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            Sin evento fijo
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Quedarte en Santiago
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
            Departamentos full equipados, modernos, con cerradura digital. Cerca
            de venues, metro y barrios con vida.
          </p>
          <Link
            href="/santiago"
            className="mt-7 inline-flex items-center rounded-lg bg-[var(--ms-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Ver alojamientos
          </Link>
        </div>
      </section>

      <PublicSiteFooter note="Guías de eventos y alojamiento en Santiago. Reserva en Airbnb." />
    </div>
  );
}
