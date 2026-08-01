import { NextResponse } from "next/server";
import {
  buildDemoChannelMetrics,
} from "@/lib/demand/ad-monitoring";
import { saveCampaignMetrics } from "@/lib/demand/ad-metrics-store";
import { loadCampaignPackBySlug } from "@/lib/demand/load-campaign-packs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Carga métricas demo para un pack (hasta conectar Meta/Google API). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      campaignId?: string;
      slug?: string;
      mode?: "demo";
    };
    if (!body.campaignId || !body.slug) {
      return NextResponse.json(
        { ok: false, error: "Faltan campaignId o slug." },
        { status: 400 },
      );
    }

    const pack = await loadCampaignPackBySlug(body.slug);
    if (!pack || pack.campaignId !== body.campaignId) {
      return NextResponse.json(
        { ok: false, error: "Pack no encontrado." },
        { status: 404 },
      );
    }

    const channels = buildDemoChannelMetrics(pack);
    const entry = {
      campaignId: pack.campaignId,
      slug: pack.slug,
      source: "demo" as const,
      channels,
      updatedAt: new Date().toISOString(),
    };
    await saveCampaignMetrics(entry);

    return NextResponse.json({ ok: true, item: entry });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
