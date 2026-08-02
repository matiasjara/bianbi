import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { MicrositeInfographic } from "@/components/campaigns/MicrositeInfographic";
import { buildRotatingSequenceMap } from "@/lib/demand/guide-images";
import {
  loadAllCampaignPacks,
  loadCampaignPackBySlug,
} from "@/lib/demand/load-campaign-packs";
import { localizeMicrosite } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

async function resolveMicrositeLocale(searchLang?: string) {
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
  if (!pack?.microsite) return { title: "Guía · Crambie" };
  const locale = await resolveMicrositeLocale(sp.lang);
  const L = localizeMicrosite(pack, locale);
  const m = L.content;
  const ogImage = `/api/share-card/${encodeURIComponent(slug)}?lang=${locale}&format=og`;

  return {
    title: m.seoTitle,
    description: m.seoDescription,
    openGraph: {
      title: m.seoTitle,
      description: m.seoDescription,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: m.guideTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.seoTitle,
      description: m.seoDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `/g/${slug}`,
      languages: {
        es: `/g/${slug}?lang=es`,
        en: `/g/${slug}?lang=en`,
        pt: `/g/${slug}?lang=pt`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function MicrositeGuidePage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack?.microsite) notFound();

  const locale = await resolveMicrositeLocale(sp.lang);
  const L = localizeMicrosite(pack, locale);
  const m = L.content;

  const allPacks = await loadAllCampaignPacks(28);
  const photoSequence = buildRotatingSequenceMap(allPacks);
  const photoSequenceIndex = photoSequence.get(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale,
    headline: m.guideTitle,
    description: m.seoDescription,
    datePublished: pack.eventStartsOn,
    author: { "@type": "Organization", name: "Crambie" },
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MicrositeInfographic
        slug={slug}
        L={L}
        photoSequenceIndex={photoSequenceIndex}
      />
    </>
  );
}
