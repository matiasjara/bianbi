import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { EventPageAnalytics } from "@/components/analytics/EventPageAnalytics";
import { MicrositeInfographic } from "@/components/campaigns/MicrositeInfographic";
import { buildRotatingSequenceMap } from "@/lib/demand/guide-images";
import {
  buildEventBreadcrumbJsonLd,
  buildEventJsonLd,
} from "@/lib/demand/event-schema";
import { loadCampaignPackBySlug, loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { loadEventRecordBySlug } from "@/lib/demand/load-event-records";
import { localizeMicrosite } from "@/lib/i18n/microsite";
import { LANG_COOKIE, resolveLocale } from "@/lib/i18n/locale";
import { SITE_URL } from "@/lib/site/url";

export const revalidate = 3600;

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
  const record = await loadEventRecordBySlug(slug);
  if (!record?.indexable) return { title: "Evento · Crambie", robots: { index: false } };

  const pack = await loadCampaignPackBySlug(record.guideSlug);
  if (!pack?.microsite) return { title: "Evento · Crambie" };

  const locale = await resolveMicrositeLocale(sp.lang);
  const L = localizeMicrosite(pack, locale);
  const m = L.content;
  const canonical = `/eventos/${slug}`;
  const ogImage = `/api/share-card/${encodeURIComponent(record.guideSlug)}?lang=${locale}&format=og`;

  return {
    title: `${record.name} en Santiago | Crambie`,
    description: m.seoDescription,
    openGraph: {
      title: `${record.name} en Santiago | Crambie`,
      description: m.seoDescription,
      type: "website",
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: m.guideTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${record.name} en Santiago | Crambie`,
      description: m.seoDescription,
      images: [ogImage],
    },
    alternates: {
      canonical,
      languages: {
        es: `${canonical}?lang=es`,
        en: `${canonical}?lang=en`,
        pt: `${canonical}?lang=pt`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicEventPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const record = await loadEventRecordBySlug(slug);
  if (!record?.indexable) notFound();

  const pack = await loadCampaignPackBySlug(record.guideSlug);
  if (!pack?.microsite) notFound();

  const locale = await resolveMicrositeLocale(sp.lang);
  const L = localizeMicrosite(pack, locale);
  const m = L.content;

  const allPacks = await loadAllCampaignPacks(28);
  const photoSequence = buildRotatingSequenceMap(allPacks);
  const photoSequenceIndex = photoSequence.get(record.guideSlug);

  const eventLd = buildEventJsonLd({
    locale,
    pack,
    record,
    seoTitle: m.seoTitle,
    seoDescription: m.seoDescription,
    guideTitle: m.guideTitle,
    eventTitle: m.eventTitle,
    venueName: m.venueName,
    siteUrl: SITE_URL,
  });

  const breadcrumbLd = buildEventBreadcrumbJsonLd({
    siteUrl: SITE_URL,
    record,
    eventTitle: m.eventTitle,
  });

  return (
    <>
      <EventPageAnalytics slug={slug} name={record.name} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MicrositeInfographic
        slug={record.guideSlug}
        L={L}
        photoSequenceIndex={photoSequenceIndex}
        basePath={`/eventos/${slug}`}
      />
    </>
  );
}
