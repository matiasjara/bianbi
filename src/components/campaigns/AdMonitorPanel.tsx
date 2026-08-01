"use client";

import { useMemo, useState } from "react";
import type { CampaignPack } from "@/lib/demand/types";
import {
  buildCampaignMonitor,
  type CampaignMonitor,
  type ChannelHealth,
  type ChannelMetrics,
  type MetricsSource,
  type TrafficLight,
} from "@/lib/demand/ad-monitoring";
import { StatusPill, formatClp } from "@/components/ui";

const LIGHT_STYLES: Record<
  TrafficLight,
  { dot: string; bg: string; text: string }
> = {
  green: {
    dot: "bg-[#1f6b45]",
    bg: "bg-[#d7ecdf]",
    text: "text-[#1f6b45]",
  },
  yellow: {
    dot: "bg-[#8a5a10]",
    bg: "bg-[#f3e7c8]",
    text: "text-[#8a5a10]",
  },
  red: {
    dot: "bg-[#9b1c1c]",
    bg: "bg-[#f5d0d0]",
    text: "text-[#9b1c1c]",
  },
  gray: {
    dot: "bg-[#8a93a0]",
    bg: "bg-[var(--panel-2)]",
    text: "text-[var(--muted)]",
  },
};

function TrafficDot({ light }: { light: TrafficLight }) {
  const s = LIGHT_STYLES[light];
  return (
    <span
      className={`inline-block size-3 rounded-full ${s.dot}`}
      aria-label={light}
    />
  );
}

function ChannelCard({ ch }: { ch: ChannelHealth }) {
  const s = LIGHT_STYLES[ch.light];
  return (
    <div className={`rounded-xl border border-[var(--line)] p-3 ${s.bg}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrafficDot light={ch.light} />
          <p className="font-medium">{ch.channelLabel}</p>
        </div>
        <span className={`text-xs font-semibold ${s.text}`}>{ch.label}</span>
      </div>

      {ch.metrics ? (
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-[var(--muted)]">Spend</dt>
            <dd className="font-medium tabular-nums">
              {formatClp(ch.metrics.spendClp)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">CTR</dt>
            <dd className="font-medium tabular-nums">
              {ch.derived.ctr != null
                ? `${(ch.derived.ctr * 100).toFixed(2)}%`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">CPC</dt>
            <dd className="font-medium tabular-nums">
              {ch.derived.cpcClp != null
                ? formatClp(Math.round(ch.derived.cpcClp))
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">% → Airbnb</dt>
            <dd className="font-medium tabular-nums">
              {ch.derived.airbnbRate != null
                ? `${(ch.derived.airbnbRate * 100).toFixed(1)}%`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Clics</dt>
            <dd className="font-medium tabular-nums">
              {ch.metrics.clicks.toLocaleString("es-CL")}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Landing</dt>
            <dd className="font-medium tabular-nums">
              {ch.metrics.landingVisits.toLocaleString("es-CL")}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 text-xs text-[var(--muted)]">Sin métricas</p>
      )}

      <ul className="mt-3 space-y-1 text-xs leading-snug text-[var(--ink)]">
        {ch.reasons.map((r) => (
          <li key={r}>· {r}</li>
        ))}
      </ul>
    </div>
  );
}

export function AdMonitorPanel({
  pack,
  initialMetrics,
  initialSource,
}: {
  pack: CampaignPack;
  initialMetrics?: ChannelMetrics[];
  initialSource?: MetricsSource;
}) {
  const [metrics, setMetrics] = useState<ChannelMetrics[]>(
    initialMetrics ?? [],
  );
  const [source, setSource] = useState<MetricsSource>(initialSource ?? "none");
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const monitor: CampaignMonitor = useMemo(
    () => buildCampaignMonitor(pack, metrics, source),
    [pack, metrics, source],
  );

  const overall = LIGHT_STYLES[monitor.overallLight];

  async function loadDemo() {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: pack.campaignId,
          slug: pack.slug,
          mode: "demo",
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        item?: { channels: ChannelMetrics[]; source: MetricsSource };
      };
      if (data.ok && data.item) {
        setMetrics(data.item.channels);
        setSource(data.item.source);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 border-t border-[var(--line)] pt-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Monitoreo
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg">
            Semáforo por canal y KPIs
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Cuando conectemos Meta/Google API, estos números se actualizarán
            solos. Hoy puedes cargar una demo para ver cómo se lee.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${overall.bg}`}
        >
          <TrafficDot light={monitor.overallLight} />
          <span className={`text-sm font-semibold ${overall.text}`}>
            {monitor.verdict === "sin_datos"
              ? "Sin datos"
              : monitor.verdict === "buena"
                ? "Campaña buena"
                : monitor.verdict === "regular"
                  ? "Campaña regular"
                  : "Campaña mala"}
          </span>
        </div>
      </div>

      <p className="mb-3 text-sm">{monitor.verdictNote}</p>

      <div className="mb-3 flex flex-wrap gap-2">
        <StatusPill>
          Fuente:{" "}
          {source === "none"
            ? "ninguna"
            : source === "demo"
              ? "demo"
              : source}
        </StatusPill>
        {monitor.updatedAt ? (
          <StatusPill>
            Act. {new Date(monitor.updatedAt).toLocaleString("es-CL")}
          </StatusPill>
        ) : null}
        <button
          type="button"
          onClick={() => void loadDemo()}
          disabled={loading}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs disabled:opacity-45"
        >
          {loading ? "Cargando…" : "Cargar métricas demo"}
        </button>
        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          className="rounded-md border border-[var(--line)] px-3 py-1.5 text-xs"
        >
          {showGuide ? "Ocultar guía KPI" : "Qué mirar (KPIs)"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {monitor.channels.map((ch) => (
          <ChannelCard key={ch.channel} ch={ch} />
        ))}
      </div>

      {monitor.recommendations.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Cómo mejorar
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {monitor.recommendations.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showGuide ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--line)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--panel-2)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2">KPI</th>
                <th className="px-3 py-2">Qué mide</th>
                <th className="px-3 py-2">Bien si…</th>
              </tr>
            </thead>
            <tbody>
              {monitor.kpiGuide.map((row) => (
                <tr
                  key={row.kpi}
                  className="border-t border-[var(--line)]/70"
                >
                  <td className="px-3 py-2 font-medium">{row.kpi}</td>
                  <td className="px-3 py-2 text-[var(--muted)]">
                    {row.meaning}
                  </td>
                  <td className="px-3 py-2 text-[var(--muted)]">{row.goodIf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
