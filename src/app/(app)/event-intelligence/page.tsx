import Link from "next/link";
import {
  getEventCanonicalManifest,
  loadAllEventRecords,
} from "@/lib/demand/load-event-records";
import { eventTypeLabel } from "@/lib/demand/event-type";
import type { EventTypeId } from "@/lib/demand/event-type";

export const dynamic = "force-dynamic";

export default async function EventIntelligencePage() {
  const [records, manifest] = await Promise.all([
    loadAllEventRecords(),
    getEventCanonicalManifest(),
  ]);

  const published = records.filter((r) => r.indexable);
  const needsReview = records.filter((r) => r.pipelineStatus === "NEEDS_REVIEW");
  const upcoming = records.filter((r) => r.lifecycleStatus === "UPCOMING");
  const completed = records.filter((r) => r.lifecycleStatus === "COMPLETED");

  const byType = new Map<EventTypeId, number>();
  for (const r of published) {
    const t = r.eventType as EventTypeId;
    byType.set(t, (byType.get(t) ?? 0) + 1);
  }

  const topPublished = [...published]
    .sort((a, b) => (b.potentialScore ?? 0) - (a.potentialScore ?? 0))
    .slice(0, 12);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Event Intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Pipeline canónico de eventos para SEO en{" "}
          <code className="text-xs">/eventos/[slug]</code>. Última build:{" "}
          {manifest.builtAt
            ? new Date(manifest.builtAt).toLocaleString("es-CL")
            : "—"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total canónico", value: manifest.total },
          { label: "Indexables", value: manifest.indexable },
          { label: "Needs review", value: manifest.needsReview },
          { label: "Próximos", value: upcoming.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4"
          >
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/eventos"
          className="rounded-lg border border-[var(--line)] px-3 py-2 hover:bg-[var(--panel-2)]"
        >
          Calendario admin →
        </Link>
        <Link
          href="/fuentes"
          className="rounded-lg border border-[var(--line)] px-3 py-2 hover:bg-[var(--panel-2)]"
        >
          Fuentes / robots →
        </Link>
      </div>

      {byType.size > 0 ? (
        <section>
          <h2 className="text-lg font-semibold">Publicados por disciplina</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[...byType.entries()].map(([type, count]) => (
              <li
                key={type}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-sm"
              >
                {eventTypeLabel(type)} · {count}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold">Top publicados</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--line)]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--panel-2)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">URL</th>
              </tr>
            </thead>
            <tbody>
              {topPublished.map((r) => (
                <tr key={r.id} className="border-b border-[var(--line)]/60">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 tabular-nums">{r.startDate}</td>
                  <td className="px-4 py-3">{r.venueName}</td>
                  <td className="px-4 py-3 tabular-nums">{r.contentQualityScore}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/eventos/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--accent)] underline-offset-2 hover:underline"
                    >
                      /eventos/{r.slug}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {needsReview.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold">Needs review ({needsReview.length})</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {needsReview.slice(0, 8).map((r) => (
              <li key={r.id} className="rounded-lg border border-[var(--line)] px-3 py-2">
                {r.name} · calidad {r.contentQualityScore}/100 · {r.startDate}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {completed.length > 0 ? (
        <p className="text-sm text-[var(--muted)]">
          {completed.length} eventos completados conservados en el índice canónico (post-event).
        </p>
      ) : null}
    </div>
  );
}
