import { NextResponse } from "next/server";
import { approveCampaign } from "@/lib/demand/approved-campaigns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      campaignId?: string;
      slug?: string;
    };
    if (!body.campaignId || !body.slug) {
      return NextResponse.json(
        { ok: false, error: "Faltan campaignId o slug." },
        { status: 400 },
      );
    }
    const items = await approveCampaign(body.campaignId, body.slug);
    return NextResponse.json({ ok: true, items });
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
