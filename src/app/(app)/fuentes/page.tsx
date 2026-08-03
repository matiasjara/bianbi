import { readFile } from "node:fs/promises";
import path from "node:path";
import { SectionTitle, StatusPill, Metric } from "@/components/ui";
import { RobotsRunner } from "@/components/sources/RobotsRunner";
import {
  DEMAND_SOURCE_CATALOG,
  type DemandSourceEntry,
} from "@/lib/demand/source-catalog";
import { loadDiscovery } from "@/lib/demand/load-discovery";
import { formatDateCL } from "@/lib/demand/dates";
import { readRobotsStatus } from "@/lib/demand/robots-status";

export const metadata = { title: "Fuentes" };
export const dynamic = "force-dynamic";

const STATUS_TONE: Record<
  DemandSourceEntry["status"],
  "good" | "warn" | "accent" | "neutral"
> = {
  active: "good",
  candidate: "accent",
  watch: "warn",
};

const STATUS_LABEL: Record<DemandSourceEntry["status"], string> = {
  active: "activa",
  candidate: "candidata",
  watch: "observación",
};

async function loadManifestSources(): Promise<
  Array<{ name: string; ok: boolean; count: number; error?: string }>
> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "ingested", "manifest-events.json"),
      "utf8",
    );
    const data = JSON.parse(raw) as {
      sources?: Array<{
        name: string;
        ok: boolean;
        count: number;
        error?: string;
      }>;
    };
    return data.sources ?? [];
  } catch {
    return [];
  }
}

export default async function FuentesPage() {
  const catalog = DEMAND_SOURCE_CATALOG;
  const active = catalog.filter((s) => s.status === "active");
  const candidates = catalog.filter((s) => s.status === "candidate");
  const watch = catalog.filter((s) => s.status === "watch");
  const manifest = await loadManifestSources();
  const byName = new Map(manifest.map((s) => [s.name, s]));
  const discovery = await loadDiscovery();
  const robotsStatus = await readRobotsStatus();
  const promote =
    discovery?.candidates.filter((c) => c.action === "promote_sport") ?? [];
  const review =
    discovery?.candidates.filter((c) => c.action === "review").slice(0, 12) ??
    [];

  return (
    <div>
      <SectionTitle
        title="Fuentes"
        subtitle="Mapa de orígenes de demanda deportiva y cultural. Activas se scrapean en cada ingest; candidatas están listas para cablear; discovery rastrea web/RSS para lo que aún no está en el calendario."
      />

      <RobotsRunner initialStatus={robotsStatus} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Activas" value={String(active.length)} />
        <Metric label="Candidatas" value={String(candidates.length)} />
        <Metric label="Observación" value={String(watch.length)} />
        <Metric
          label="Discovery promover"
          value={String(discovery?.counts?.promote_sport ?? 0)}
          hint={
            discovery?.ranAt
              ? `Última corrida ${new Date(discovery.ranAt).toLocaleString("es-CL")}`
              : "Ejecuta npm run ingest:discover"
          }
        />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl">
          Catálogo
        </h2>
        <div className="space-y-3">
          {catalog.map((source) => {
            const last = byName.get(source.id);
            return (
              <article key={source.id} className="surface rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <StatusPill tone={STATUS_TONE[source.status]}>
                        {STATUS_LABEL[source.status]}
                      </StatusPill>
                      <StatusPill>{source.discipline}</StatusPill>
                      <StatusPill>{source.mode}</StatusPill>
                      <StatusPill tone="accent">
                        {source.playbookHint.replace("_", " ")}
                      </StatusPill>
                      {last ? (
                        <StatusPill tone={last.ok ? "good" : "warn"}>
                          última ingesta {last.ok ? "ok" : "fail"} ·{" "}
                          {last.count}
                        </StatusPill>
                      ) : null}
                    </div>
                    <h3 className="text-lg font-medium">{source.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {source.why}
                    </p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {source.scrapeNotes}
                    </p>
                  </div>
                  <a
                    href={
                      source.url.startsWith("http")
                        ? source.url
                        : undefined
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[var(--accent-ink)] hover:underline"
                  >
                    {source.url.startsWith("http") ? "Abrir fuente" : source.url}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl">
          Discovery reciente
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          {discovery?.method ??
            "Aún no hay discovery.json. Ejecuta el radar para llenar candidatos."}
        </p>

        {promote.length > 0 ? (
          <div className="mb-6">
            <h3 className="mb-3 text-sm uppercase tracking-[0.14em] text-[var(--muted)]">
              Prioridad: promover a señal
            </h3>
            <div className="space-y-2">
              {promote.slice(0, 15).map((c) => (
                <article key={c.id} className="surface rounded-xl p-4">
                  <div className="mb-1 flex flex-wrap gap-2">
                    <StatusPill tone="good">promover</StatusPill>
                    <StatusPill>{c.disciplineGuess}</StatusPill>
                    {c.startsOn ? (
                      <StatusPill tone="accent">
                        {formatDateCL(c.startsOn)}
                      </StatusPill>
                    ) : null}
                    <StatusPill>{c.sourceFeed}</StatusPill>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--accent-ink)] hover:underline"
                  >
                    {c.title}
                  </a>
                  <p className="mt-1 text-sm text-[var(--muted)]">{c.summary}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {review.length > 0 ? (
          <div>
            <h3 className="mb-3 text-sm uppercase tracking-[0.14em] text-[var(--muted)]">
              Revisar
            </h3>
            <div className="space-y-2">
              {review.map((c) => (
                <article key={c.id} className="surface rounded-xl p-4">
                  <div className="mb-1 flex flex-wrap gap-2">
                    <StatusPill tone="warn">revisar</StatusPill>
                    <StatusPill>{c.disciplineGuess}</StatusPill>
                    <StatusPill>{c.sourceFeed}</StatusPill>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--accent-ink)] hover:underline"
                  >
                    {c.title}
                  </a>
                  <p className="mt-1 text-sm text-[var(--muted)]">{c.summary}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {!discovery ? (
          <div className="surface rounded-xl p-6 text-[var(--muted)]">
            Sin archivo de discovery. Corre{" "}
            <code className="text-[var(--ink)]">npm run ingest:discover</code>.
          </div>
        ) : null}
      </section>
    </div>
  );
}
