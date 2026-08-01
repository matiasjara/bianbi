"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { RobotJob, RobotsStatus } from "@/lib/demand/robots-status";
import { StatusPill } from "@/components/ui";

const JOBS: Array<{ id: RobotJob; label: string; hint: string }> = [
  {
    id: "discover",
    label: "Buscar novedades",
    hint: "Radar RSS + web (~30s)",
  },
  {
    id: "events",
    label: "Actualizar calendarios",
    hint: "Scrapers activos (~1–2 min)",
  },
  {
    id: "full",
    label: "Correr todo",
    hint: "Radar + scrapers + fusión",
  },
];

export function RobotsRunner({
  initialStatus,
}: {
  initialStatus: RobotsStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<RobotsStatus>(initialStatus);
  const [busy, setBusy] = useState(initialStatus.status === "running");
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    const res = await fetch("/api/robots/status", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as RobotsStatus;
    setStatus(data);
    setBusy(data.status === "running");
    if (data.status === "ok" || data.status === "error") {
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => {
      void refreshStatus();
    }, 2500);
    return () => clearInterval(id);
  }, [busy, refreshStatus]);

  async function run(job: RobotJob) {
    setError(null);
    setBusy(true);
    setStatus((s) => ({
      ...s,
      status: "running",
      job,
      message: "Encolando robots…",
    }));
    try {
      const res = await fetch("/api/robots/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo iniciar el job.");
        setBusy(false);
        await refreshStatus();
        return;
      }
      await refreshStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  const tone =
    status.status === "running"
      ? "accent"
      : status.status === "ok"
        ? "good"
        : status.status === "error"
          ? "warn"
          : "neutral";

  return (
    <div className="surface mb-8 rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Robots
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Ejecuta scrapers y el radar de novedades sin salir de la app.
          </p>
        </div>
        <StatusPill tone={tone}>
          {status.status === "running"
            ? "en curso"
            : status.status === "ok"
              ? "listo"
              : status.status === "error"
                ? "error"
                : "en espera"}
        </StatusPill>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {JOBS.map((j) => (
          <button
            key={j.id}
            type="button"
            disabled={busy}
            onClick={() => void run(j.id)}
            title={j.hint}
            className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm text-[var(--panel)] disabled:opacity-45"
          >
            {j.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">
        {busy && status.job
          ? `${JOBS.find((j) => j.id === status.job)?.label ?? status.job}: ${status.message}`
          : status.message}
        {status.finishedAt
          ? ` · ${new Date(status.finishedAt).toLocaleString("es-CL")}`
          : null}
      </p>
      {error ? (
        <p className="mt-2 text-sm text-[var(--warn)]">{error}</p>
      ) : null}

      {status.logTail ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
            Log
          </summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-[var(--panel-2)] p-3 text-xs whitespace-pre-wrap text-[var(--ink)]">
            {status.logTail}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
