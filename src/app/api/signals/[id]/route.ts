import { NextResponse } from "next/server";
import {
  saveSignalOverride,
  suppressSignal,
  type SignalOverride,
} from "@/lib/demand/signal-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function parsePatch(body: Record<string, unknown>): SignalOverride | null {
  const patch: SignalOverride = {};
  if (typeof body.title === "string" && body.title.trim()) {
    patch.title = body.title.trim();
  }
  if (typeof body.description === "string") {
    patch.description = body.description.trim();
  }
  if (typeof body.startsOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.startsOn)) {
    patch.startsOn = body.startsOn;
  }
  if (typeof body.endsOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.endsOn)) {
    patch.endsOn = body.endsOn;
  }
  if (typeof body.url === "string") {
    patch.url = body.url.trim() || undefined;
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID requerido." }, { status: 400 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const patch = parsePatch(body);
    if (!patch) {
      return NextResponse.json(
        { ok: false, error: "Sin cambios válidos." },
        { status: 400 },
      );
    }
    if (patch.startsOn && patch.endsOn && patch.endsOn < patch.startsOn) {
      return NextResponse.json(
        { ok: false, error: "La fecha de término debe ser posterior al inicio." },
        { status: 400 },
      );
    }
    const state = await saveSignalOverride(id, patch);
    return NextResponse.json({
      ok: true,
      suppressed: [...state.suppressed],
      overrides: Object.keys(state.overrides),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID requerido." }, { status: 400 });
    }
    const state = await suppressSignal(id);
    return NextResponse.json({
      ok: true,
      suppressed: [...state.suppressed],
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
