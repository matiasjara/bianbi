import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeShareBar } from "@/components/campaigns/MicrositeShareBar";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import { loadCampaignPackBySlug } from "@/lib/demand/load-campaign-packs";
import { propertiesForMicrosite } from "@/lib/demand/travel-brief";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const AIRBNB_BTN =
  "inline-flex items-center justify-center rounded-lg bg-[#FF5A5F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E0484D]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack?.microsite) return { title: "Guía · Bianbi" };
  const m = pack.microsite;
  return {
    title: m.seoTitle,
    description: m.seoDescription,
    openGraph: {
      title: m.seoTitle,
      description: m.seoDescription,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: m.seoTitle,
      description: m.seoDescription,
    },
    alternates: { canonical: `/g/${slug}` },
    robots: { index: true, follow: true },
  };
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-black/8 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

export default async function MicrositeGuidePage({ params }: Props) {
  const { slug } = await params;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack?.microsite) notFound();

  const m = pack.microsite;
  const props = propertiesForMicrosite(m.properties);

  const mapMarkers = [
    {
      lat: m.venueLat,
      lng: m.venueLng,
      label: m.venueName,
      kind: "venue" as const,
    },
    ...props.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.neighborhood,
      kind: "property" as const,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: m.guideTitle,
    description: m.seoDescription,
    datePublished: pack.eventStartsOn,
    author: { "@type": "Organization", name: "Bianbi" },
    about: {
      "@type": "Event",
      name: m.eventTitle,
      startDate: pack.eventStartsOn,
      endDate: pack.eventEndsOn,
      location: {
        "@type": "Place",
        name: m.venueName,
        address: "Santiago, Chile",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#f7f4f0] text-[#222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-black/8 bg-[#1a1a1a] text-white">
        <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
            Bianbi
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/55">
            {m.interestLabel} · {m.eventDates}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight md:text-4xl">
            {m.guideTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            {m.eventSummary}
          </p>
          <MicrositeShareBar
            title={m.guideTitle}
            shareText={m.shareText}
            path={`/g/${slug}`}
          />
          <nav className="mt-8 flex flex-wrap gap-2 text-xs">
            {[
              ["must", "Lo esencial"],
              ["novedades", "Novedades"],
              ["mapa", "Mapa"],
              ["tips", "Tips"],
              ["clima", "Clima"],
              ["transporte", "Transporte"],
              ["faq", "FAQ"],
              ["alojar", "Dónde alojar"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-white/20 px-3 py-1.5 text-white/80 transition hover:bg-white/10"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <Section id="must" title="Lo esencial">
        <ul className="space-y-3 text-[15px] leading-relaxed text-[#484848]">
          {m.mustKnow.map((tip) => (
            <li key={tip} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#222]" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="novedades" title="Novedades">
        <ul className="space-y-3 text-[15px] leading-relaxed text-[#484848]">
          {m.news.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5A5F]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mapa" title="Mapa">
        <p className="text-[15px] leading-relaxed text-[#6a6a6a]">
          {m.venueName} y opciones para quedarte cerca.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-black/8">
          <LandingMap markers={mapMarkers} className="h-96 w-full" />
        </div>
      </Section>

      <Section id="tips" title="Tips y recomendaciones">
        <ul className="space-y-3 text-[15px] leading-relaxed text-[#484848]">
          {m.recommendations.map((r) => (
            <li key={r} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5A5F]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="clima" title="Clima">
        <p className="text-[15px] leading-relaxed text-[#222]">
          {m.weather.summary}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6a6a6a]">
          {m.weather.tip}
        </p>
      </Section>

      <Section id="transporte" title="Transporte">
        <ul className="space-y-3 text-[15px] leading-relaxed text-[#484848]">
          {m.transport.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#222]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="Preguntas frecuentes">
        <div className="space-y-6">
          {m.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-medium text-[#222]">{f.q}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#484848]">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <section id="alojar" className="border-t border-black/8 bg-[#f7f4f0]">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Dónde alojar
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#6a6a6a]">
            Departamentos cerca de {m.venueName}. Reserva en Airbnb.
          </p>
          <div className="mt-8 space-y-8">
            {props.map((prop, idx) => (
              <article
                key={prop.slug}
                className="overflow-hidden rounded-2xl border border-black/8 bg-white md:grid md:grid-cols-[280px_1fr]"
              >
                <PhotoStoryCarousel
                  photos={
                    prop.photos.length
                      ? prop.photos
                      : [prop.photo].filter(Boolean)
                  }
                  alt={prop.name}
                  caption={prop.neighborhood}
                  className="h-64 w-full md:h-full md:min-h-[300px]"
                />
                <div className="flex flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a6a6a]">
                    Opción {idx + 1} · {prop.walkingMinutes} min a pie ·{" "}
                    {prop.distanceKm} km
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl">
                    {prop.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#484848]">
                    {prop.pitch}
                  </p>
                  <div className="mt-5">
                    <a
                      href={prop.airbnbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={AIRBNB_BTN}
                    >
                      Reservar en Airbnb
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] px-5 py-10 text-center text-xs leading-relaxed text-white/45">
        <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold tracking-[0.28em] text-white/30">
          BIANBI
        </p>
        <div className="mx-auto mt-5 flex justify-center">
          <MicrositeShareBar
            title={m.guideTitle}
            shareText={m.shareText}
            path={`/g/${slug}`}
          />
        </div>
        <p className="mx-auto mt-6 max-w-2xl">
          Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. La
          reserva y el pago se hacen en el anuncio oficial.
        </p>
      </footer>
    </div>
  );
}
