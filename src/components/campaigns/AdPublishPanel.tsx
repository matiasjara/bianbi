"use client";

import { useState } from "react";
import type { AdCreativeVariant, CampaignPack } from "@/lib/demand/types";
import { formatAdBriefText } from "@/lib/demand/ad-brief";
import { StatusPill, formatClp } from "@/components/ui";

function MetaAdPreview({
  creative,
  pageName,
}: {
  creative: AdCreativeVariant;
  pageName: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="size-8 rounded-full bg-[#FF5A5F]/90" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#050505]">
            {pageName}
          </p>
          <p className="text-[10px] text-[#65676b]">Patrocinado · Vista previa</p>
        </div>
      </div>
      <p className="px-3 pb-2 text-[13px] leading-snug text-[#050505]">
        {creative.primaryText}
      </p>
      <div className="relative aspect-[1.91/1] bg-[#eee]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${creative.imageUrl}?im_w=720`}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10">
          <p className="text-sm font-semibold text-white drop-shadow">
            {creative.headline}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 bg-[#f0f2f5] px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-wide text-[#65676b]">
            demandengine.local
          </p>
          <p className="truncate text-xs font-semibold text-[#050505]">
            {creative.description}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-[#e4e6eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#050505]">
          {creative.cta}
        </span>
      </div>
    </div>
  );
}

function GoogleAdPreview({ creative }: { creative: AdCreativeVariant }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <p className="text-[11px] text-[#70757a]">Anuncio · demandengine.local</p>
      <p className="mt-1 text-lg text-[#1a0dab] hover:underline">
        {creative.headline}
      </p>
      <p className="mt-1 text-sm leading-snug text-[#4d5156]">
        {creative.primaryText}
      </p>
    </div>
  );
}

export function AdPublishPanel({
  pack,
  landingUrl,
  markedReady,
  onMarkReady,
}: {
  pack: CampaignPack;
  landingUrl: string;
  markedReady: boolean;
  onMarkReady: () => Promise<void>;
}) {
  const plan = pack.publishPlan;
  const [creativeIdx, setCreativeIdx] = useState(0);
  const [preview, setPreview] = useState<"meta" | "google">("meta");
  const [copied, setCopied] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);

  const creative = plan.creatives[creativeIdx] ?? plan.creatives[0];
  const e = plan.expected;

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
  }

  async function markReady() {
    setMarking(true);
    try {
      await onMarkReady();
    } finally {
      setMarking(false);
    }
  }

  function tryPublish() {
    setPublishMsg(plan.publishBlockedReason);
  }

  return (
    <div className="mt-5 border-t border-[var(--line)] pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Listo para publicar
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg">
            Audiencia, creatividades y resultados esperados
          </h3>
        </div>
        <StatusPill tone={markedReady || plan.status === "ready" ? "good" : "warn"}>
          {markedReady
            ? "marcado listo"
            : plan.status === "ready"
              ? "pack completo"
              : "borrador"}
        </StatusPill>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Brief operativo */}
        <div className="space-y-4">
          <div className="rounded-lg bg-[var(--panel-2)] px-3 py-3 text-sm">
            <p className="font-medium">{plan.objective}</p>
            <p className="mt-2 text-[var(--muted)]">
              Pauta {plan.flightStart} → {plan.flightEnd} · sugerido{" "}
              {formatClp(plan.dailyBudgetClp)}/día · total ~
              {formatClp(plan.totalBudgetClp)} ({e.days} días)
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Es un piso para aprender (CTR/CPC/%→Airbnb), no un gasto fijo. Si
              el semáforo sale rojo a los 2–3 días, pausa o baja; si sale verde,
              puedes subir.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Audiencia
            </p>
            <p className="mt-1 text-sm leading-relaxed">{plan.audienceSummary}</p>
            {plan.geoLines.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm">
                {plan.geoLines.map((g) => (
                  <li key={g} className="text-[var(--muted)]">
                    · {g}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {plan.interestLines.map((s, i) => (
                <StatusPill key={`${s}-${i}`}>{s}</StatusPill>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Meta
              </p>
              <ul className="mt-1 space-y-1 text-xs text-[var(--muted)]">
                {plan.metaTargetingNotes.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Google
              </p>
              <ul className="mt-1 space-y-1 text-xs text-[var(--muted)]">
                {plan.googleTargetingNotes.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Resultados esperados
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Confianza {e.confidence} · proxy
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <Metric
                label="Impresiones"
                value={`${fmt(e.impressionsLow)}–${fmt(e.impressionsHigh)}`}
              />
              <Metric
                label="Clics"
                value={`${fmt(e.clicksLow)}–${fmt(e.clicksHigh)}`}
              />
              <Metric
                label="Visitas landing"
                value={`${fmt(e.landingVisitsLow)}–${fmt(e.landingVisitsHigh)}`}
              />
              <Metric
                label="Acciones Airbnb"
                value={`${fmt(e.airbnbActionsLow)}–${fmt(e.airbnbActionsHigh)}`}
              />
              <Metric
                label="Noches pot."
                value={`${fmt(e.nightsLow)}–${fmt(e.nightsHigh)}`}
              />
              <Metric label="Budget total" value={formatClp(e.totalBudgetClp)} />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{e.disclaimer}</p>
          </div>

          {plan.mailingTargets.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Mailing sugerido (tu base)
              </p>
              <ul className="mt-2 max-h-40 space-y-1.5 overflow-y-auto text-sm">
                {plan.mailingTargets.map((t) => (
                  <li key={t.id} className="rounded-md bg-[var(--panel-2)] px-2 py-1.5">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-[var(--muted)]">
                      {" "}
                      · {t.emails[0]}
                      {t.segment ? ` · ${t.segment}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Checklist
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {plan.checklist.map((c) => (
                <li key={c.id} className="flex items-center gap-2">
                  <span
                    className={
                      c.done ? "text-[var(--good)]" : "text-[var(--warn)]"
                    }
                  >
                    {c.done ? "✓" : "○"}
                  </span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Previews */}
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreview("meta")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                preview === "meta"
                  ? "bg-[var(--accent)] text-[var(--panel)]"
                  : "border border-[var(--line)]"
              }`}
            >
              Preview Meta
            </button>
            <button
              type="button"
              onClick={() => setPreview("google")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                preview === "google"
                  ? "bg-[var(--accent)] text-[var(--panel)]"
                  : "border border-[var(--line)]"
              }`}
            >
              Preview Google
            </button>
          </div>

          {plan.creatives.length > 1 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {plan.creatives.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCreativeIdx(i)}
                  className={`rounded-md px-2.5 py-1 text-xs ${
                    creativeIdx === i
                      ? "bg-[var(--ink)] text-white"
                      : "border border-[var(--line)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : null}

          {creative ? (
            preview === "meta" ? (
              <MetaAdPreview
                creative={creative}
                pageName="Alojamiento Santiago"
              />
            ) : (
              <GoogleAdPreview creative={creative} />
            )
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Sin creatividades (faltan fotos de depto).
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                void copy(
                  "brief",
                  formatAdBriefText(pack, plan, landingUrl),
                )
              }
              className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm text-[var(--panel)]"
            >
              {copied === "brief" ? "Brief copiado" : "Copiar brief completo"}
            </button>
            <button
              type="button"
              disabled={markedReady || marking}
              onClick={() => void markReady()}
              className="rounded-md border border-[var(--line)] px-3 py-2 text-sm disabled:opacity-45"
            >
              {markedReady
                ? "Listo para publicar"
                : marking
                  ? "Guardando…"
                  : "Marcar listo para publicar"}
            </button>
            <button
              type="button"
              onClick={tryPublish}
              className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
            >
              Publicar (próximo: API)
            </button>
          </div>
          {publishMsg ? (
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              {publishMsg}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--line)] px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-0.5 font-medium tabular-nums">{value}</p>
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL").format(n);
}
