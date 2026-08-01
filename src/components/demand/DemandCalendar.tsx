"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildDemandTimeline,
  detectCampaignOpportunities,
  suggestCampaignsFromPeaks,
} from "@/lib/demand/calendar";
import { formatAttendanceShort } from "@/lib/demand/attendance";
import {
  MONTH_NAMES_ES,
  defaultPlanningMonth,
  monthRange,
} from "@/lib/demand/month-range";
import type { DemandSignal } from "@/lib/demand/types";
import { StatusPill, formatClp } from "@/components/ui";
import {
  DemandSizeBadge,
  DemandSizeBlock,
} from "@/components/demand/DemandSizeBadge";

const MONTHS = [...MONTH_NAMES_ES];

export function DemandCalendar({
  signals,
  ingestedAt,
  sourceCounts,
}: {
  signals: DemandSignal[];
  ingestedAt: string | null;
  sourceCounts: Record<string, number>;
}) {
  const initial = defaultPlanningMonth();
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.monthIndex);
  const [selectedPeakId, setSelectedPeakId] = useState<string | null>(null);

  const { start, end } = monthRange(year, month);

  const timeline = useMemo(
    () => buildDemandTimeline(signals, start, end),
    [signals, start, end],
  );
  const peaks = useMemo(
    () => detectCampaignOpportunities(signals, start, end, 22),
    [signals, start, end],
  );
  const suggestions = useMemo(
    () => suggestCampaignsFromPeaks(peaks, 12),
    [peaks],
  );

  const selectedPeak =
    peaks.find((p) => p.id === selectedPeakId) ?? peaks[0] ?? null;
  const selectedSuggestion = suggestions.find(
    (s) => s.peakId === selectedPeak?.id,
  );

  const chartData = timeline.map((d) => ({
    ...d,
    name: d.label,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">
            El gráfico muestra la intensidad del mes. Abajo, cada campaña es un
            interés puro (nieve, partido, concierto, competencia…), sin mezclar.
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Última ingesta:{" "}
            {ingestedAt
              ? new Date(ingestedAt).toLocaleString("es-CL")
              : "aún no corrida"}
            {" · "}
            {Object.entries(sourceCounts)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            El score no cuenta eventos: un headliner mega pesa más que diez shows
            chicos. Además estimamos asistentes y pernocta para comparar dimensión.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[initial.year, initial.year + 1, initial.year - 1]
              .filter((y, i, arr) => arr.indexOf(y) === i)
              .sort()
              .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="surface rounded-xl p-4 md:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl">
          Intensidad de demanda — {MONTHS[month]} {year}
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar
                dataKey="holidayScore"
                stackId="a"
                fill="#1b4d89"
                name="Feriados"
              />
              <Bar
                dataKey="eventScore"
                stackId="a"
                fill="#0b6e4f"
                name="Eventos"
              />
              <Bar
                dataKey="seasonalityScore"
                stackId="a"
                fill="#8a5a10"
                name="Estacionalidad"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#15202b"
                strokeWidth={2}
                dot={false}
                name="Score total"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Campañas por interés
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Cada ítem es una campaña distinta: no se mezcla nieve con un partido
            ni un concierto con una competencia.
          </p>
          <ul className="mt-4 space-y-3">
            {peaks.length === 0 ? (
              <li className="text-sm text-[var(--muted)]">
                Sin oportunidades relevantes en este mes. Prueba otro mes o
                corre la ingesta.
              </li>
            ) : (
              peaks.map((peak) => {
                const active = selectedPeak?.id === peak.id;
                return (
                  <li key={peak.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedPeakId(peak.id)}
                      className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{peak.title}</p>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            <StatusPill tone="accent">
                              {peak.interestLabel}
                            </StatusPill>{" "}
                            {peak.rangeStart} → {peak.rangeEnd}
                          </p>
                          <div className="mt-2">
                            <DemandSizeBadge
                              dimension={peak.demandDimension}
                              attendees={peak.estimatedAttendance}
                              overnight={peak.estimatedOvernight}
                            />
                          </div>
                        </div>
                        <StatusPill tone="accent">score {peak.score}</StatusPill>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        <section className="surface rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Campaña sugerida
          </h2>
          {!selectedPeak || !selectedSuggestion ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Selecciona un peak para generar la sugerencia.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  Peak
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl">
                  {selectedPeak.title}
                </p>
                <p className="mt-2">
                  <StatusPill tone="accent">
                    {selectedPeak.interestLabel}
                  </StatusPill>
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {selectedSuggestion.reason}
                </p>
              </div>

              <DemandSizeBlock
                dimension={selectedSuggestion.demandDimension}
                attendees={selectedSuggestion.estimatedAttendance}
                overnight={selectedSuggestion.estimatedOvernight}
                method={selectedPeak.signals[0]?.attendanceMethod}
                confidence={selectedPeak.signals[0]?.attendanceConfidence}
              />

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  Público objetivo
                </p>
                <p className="mt-1 text-sm">
                  {selectedSuggestion.audience.rationale}
                </p>
                {selectedSuggestion.audience.geoTargets.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {selectedSuggestion.audience.geoTargets.map((g) => (
                      <li
                        key={`${g.type}-${g.label}`}
                        className="rounded-md bg-[var(--panel-2)] px-3 py-2 text-sm"
                      >
                        <span className="font-medium">{g.label}</span>
                        <span className="text-[var(--muted)]">
                          {" "}
                          · {g.area}
                        </span>
                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                          {g.adHint}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {selectedSuggestion.audience.segments.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedSuggestion.audience.segments.map((s, i) => (
                      <StatusPill key={`${s}-${i}`}>{s}</StatusPill>
                    ))}
                  </div>
                ) : null}
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                  <dt className="text-[var(--muted)]">Ventana ads</dt>
                  <dd>
                    {selectedSuggestion.windowStart} →{" "}
                    {selectedSuggestion.windowEnd}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                  <dt className="text-[var(--muted)]">Budget / día</dt>
                  <dd>{formatClp(selectedSuggestion.dailyBudgetClp)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                  <dt className="text-[var(--muted)]">Intención</dt>
                  <dd>/{selectedSuggestion.intentionSlug}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                  <dt className="text-[var(--muted)]">Unidades</dt>
                  <dd>{selectedSuggestion.propertyCodes.join(", ")}</dd>
                </div>
                  <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                  <dt className="text-[var(--muted)]">Playbook</dt>
                  <dd>{selectedSuggestion.playbook}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                  <dt className="text-[var(--muted)]">Canales</dt>
                  <dd>{selectedSuggestion.channels.join(", ")}</dd>
                </div>
              </dl>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  Señales del peak
                </p>
                <ul className="mt-2 space-y-2">
                  {selectedPeak.signals.slice(0, 8).map((s) => {
                    const pot = s.potentialScore ?? s.intensity * 10;
                    const tier = s.potentialTier ?? "media";
                    const dim = s.demandDimension ?? "media";
                    const tone =
                      dim === "mega" || tier === "mega"
                        ? "accent"
                        : dim === "grande" || tier === "alta"
                          ? "good"
                          : dim === "chica" || tier === "baja"
                            ? "neutral"
                            : "warn";
                    return (
                      <li
                        key={s.id}
                        className="rounded-md bg-[var(--panel-2)] px-3 py-2 text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">{s.title}</span>
                          <StatusPill tone={tone}>
                            {tier} · {pot}
                          </StatusPill>
                        </div>
                        {s.estimatedAttendance != null &&
                        s.estimatedOvernight != null ? (
                          <p className="mt-1.5 text-xs font-medium text-[var(--ink)]">
                            {formatAttendanceShort(
                              s.estimatedAttendance,
                              s.estimatedOvernight,
                            )}
                            {s.demandDimension
                              ? ` · dimensión ${s.demandDimension}`
                              : ""}
                          </p>
                        ) : null}
                        {s.attendanceMethod ? (
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {s.attendanceMethod}
                          </p>
                        ) : s.potentialFactors &&
                          s.potentialFactors.length > 0 ? (
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {s.potentialFactors.slice(0, 3).join(" · ")}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
