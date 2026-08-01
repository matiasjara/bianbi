"use client";

import { useState } from "react";
import type { CampaignPack } from "@/lib/demand/types";
import { StatusPill, formatClp } from "@/components/ui";
import { DemandSizeBlock } from "@/components/demand/DemandSizeBadge";
import { dimensionLabel, formatPeople } from "@/lib/demand/attendance";
import { AdPublishPanel } from "@/components/campaigns/AdPublishPanel";
import { AdMonitorPanel } from "@/components/campaigns/AdMonitorPanel";
import type {
  ChannelMetrics,
  MetricsSource,
} from "@/lib/demand/ad-monitoring";

export function CampaignPackCard({
  pack,
  approved,
  initialMetrics,
  initialMetricsSource,
}: {
  pack: CampaignPack;
  approved: boolean;
  initialMetrics?: ChannelMetrics[];
  initialMetricsSource?: MetricsSource;
}) {
  const [isApproved, setIsApproved] = useState(approved);
  const [copied, setCopied] = useState<string | null>(null);
  const landingPath = `/c/${pack.slug}`;
  const guidePath = `/g/${pack.slug}`;

  function absoluteLandingUrl() {
    return `${window.location.origin}${landingPath}`;
  }

  function absoluteGuideUrl() {
    return `${window.location.origin}${guidePath}`;
  }

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
  }

  async function approve() {
    const res = await fetch("/api/campaigns/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId: pack.campaignId,
        slug: pack.slug,
      }),
    });
    if (res.ok) setIsApproved(true);
  }

  const dimTone =
    pack.demandDimension === "mega"
      ? "accent"
      : pack.demandDimension === "grande"
        ? "good"
        : pack.demandDimension === "media"
          ? "warn"
          : "neutral";

  return (
    <article className="surface rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <StatusPill tone="accent">#{pack.priority}</StatusPill>
            <StatusPill tone={dimTone}>
              {pack.interestLabel}
            </StatusPill>
            <StatusPill tone={dimTone}>
              {dimensionLabel(pack.demandDimension)} · ~
              {formatPeople(pack.estimatedOvernight)} pernocta
            </StatusPill>
            <StatusPill>
              ~{formatPeople(pack.estimatedAttendance)} asistentes
            </StatusPill>
            <StatusPill
              tone={
                pack.playbook === "mailing_first"
                  ? "good"
                  : pack.playbook === "ads_heavy"
                    ? "accent"
                    : "warn"
              }
            >
              {pack.playbook === "mailing_first"
                ? "mailing primero"
                : pack.playbook === "ads_heavy"
                  ? "ads heavy"
                  : "híbrido"}
            </StatusPill>
            <StatusPill tone={isApproved ? "good" : "warn"}>
              {isApproved ? "lista para publicar" : "sugerida"}
            </StatusPill>
            <StatusPill>potencial {pack.score}</StatusPill>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            {pack.eventTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {pack.eventDates} · {pack.venueName}
          </p>
        </div>
        <p className="text-right text-sm">
          <span className="block text-[var(--muted)]">Budget sugerido/día</span>
          <span className="font-medium tabular-nums">
            {formatClp(pack.dailyBudgetClp)}
          </span>
          <span className="mt-0.5 block text-[10px] text-[var(--muted)]">
            punto de partida · ajustable
          </span>
        </p>
      </div>

      {pack.microsite ? (
        <div className="mt-5 rounded-lg border border-[var(--line)] bg-[var(--panel-2)]/60 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Micrositio
          </p>
          <p className="mt-1 text-sm font-medium">
            {pack.microsite.guideTitle}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={guidePath}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--panel)]"
            >
              Abrir guía
            </a>
            <button
              type="button"
              onClick={() => copy("guía", absoluteGuideUrl())}
              className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--ink)]"
            >
              {copied === "guía" ? "URL copiada" : "Copiar URL"}
            </button>
            <a
              href={landingPath}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--ink)]"
            >
              Landing corta
            </a>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <DemandSizeBlock
            dimension={pack.demandDimension}
            attendees={pack.estimatedAttendance}
            overnight={pack.estimatedOvernight}
            method={pack.attendanceMethod}
          />

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Por qué esta campaña
            </p>
            <p className="mt-1 text-sm leading-relaxed">{pack.reason}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Público objetivo
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              {pack.audience.rationale}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {pack.audience.stayOffer}
            </p>
            {pack.audience.geoTargets.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {pack.audience.geoTargets.map((g) => (
                  <li
                    key={`${g.type}-${g.label}`}
                    className="rounded-md bg-[var(--panel-2)] px-3 py-2 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{g.label}</span>
                      <StatusPill tone="accent">{g.area}</StatusPill>
                      {g.origin ? <StatusPill>{g.origin}</StatusPill> : null}
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {g.adHint}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
            {pack.audience.segments.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pack.audience.segments.map((s, i) => (
                  <StatusPill key={`${s}-${i}`}>{s}</StatusPill>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Mapa · {pack.venueName}
          </p>
          <div className="mt-2 overflow-hidden rounded-lg border border-[var(--line)]">
            <iframe
              title={pack.venueName}
              src={pack.mapEmbedUrl}
              className="h-40 w-full"
              loading="lazy"
            />
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {pack.properties.map((p) => (
              <li key={p.slug} className="flex justify-between gap-2">
                <span>
                  <span className="text-[var(--muted)]">{p.code}</span> ·{" "}
                  {p.name}
                </span>
                <span className="tabular-nums text-[var(--muted)]">
                  {p.walkingMinutes} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-[var(--line)] pt-4 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Headline landing
          </p>
          <p className="mt-1 font-medium">{pack.headline}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{pack.subhead}</p>

          <div className="mt-4 space-y-2 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Asunto mailing
              </p>
              <p className="mt-1">{pack.mailingSubject}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Ads
              </p>
              <p className="mt-1">
                <span className="font-medium">{pack.adHeadline}</span>
                <span className="text-[var(--muted)]">
                  {" "}
                  — {pack.adPrimaryText}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={landingPath}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm text-[var(--panel)]"
        >
          Abrir landing
        </a>
        <button
          type="button"
          onClick={() => void copy("landing", absoluteLandingUrl())}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          {copied === "landing" ? "Copiado" : "Copiar URL landing"}
        </button>
        <button
          type="button"
          onClick={() => {
            const body = pack.mailingBody
              .split("{{LANDING_URL}}")
              .join(absoluteLandingUrl());
            void copy("mail", `${pack.mailingSubject}\n\n${body}`);
          }}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          {copied === "mail" ? "Copiado" : "Copiar mailing"}
        </button>
        <button
          type="button"
          onClick={() =>
            void copy("ads", `${pack.adHeadline}\n${pack.adPrimaryText}`)
          }
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          {copied === "ads" ? "Copiado" : "Copiar ads"}
        </button>
      </div>

      <AdPublishPanel
        pack={pack}
        landingUrl={absoluteLandingUrl()}
        markedReady={isApproved}
        onMarkReady={approve}
      />

      <AdMonitorPanel
        pack={pack}
        initialMetrics={initialMetrics}
        initialSource={initialMetricsSource}
      />

      <div className="mt-4 flex flex-wrap gap-1.5">
        {pack.drivers.map((d) => (
          <StatusPill key={d}>{d}</StatusPill>
        ))}
        <StatusPill>
          {pack.windowStart} → {pack.windowEnd}
        </StatusPill>
        <StatusPill>{pack.channels.join(", ")}</StatusPill>
      </div>
    </article>
  );
}
