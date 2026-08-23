import { loadCampaignPackBySlug } from "@/lib/demand/load-campaign-packs";
import { localizeMicrosite } from "@/lib/i18n/microsite";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import { renderShareCard } from "@/lib/share/share-card";

export const runtime = "nodejs";
export const revalidate = 86400;

const SHARE_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;
  const url = new URL(request.url);
  const langParam = url.searchParams.get("lang");
  const locale: Locale = isLocale(langParam) ? langParam : "es";
  const format =
    url.searchParams.get("format") === "og" ? ("og" as const) : ("story" as const);

  const pack = await loadCampaignPackBySlug(slug);
  if (!pack?.microsite) {
    return new Response("No encontrado", { status: 404 });
  }

  const L = localizeMicrosite(pack, locale);
  try {
    const image = await renderShareCard(L, {
      format,
      pagePath: `/g/${slug}`,
    });
    image.headers.set("Cache-Control", SHARE_CACHE_CONTROL);
    return image;
  } catch (err) {
    console.error("[share-card]", slug, err);
    return new Response("Error al generar imagen", { status: 500 });
  }
}
