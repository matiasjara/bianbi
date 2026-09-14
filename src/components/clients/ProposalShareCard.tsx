"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/ui";
import type { ClientProposal } from "@/lib/types";

export function ProposalShareCard({
  proposal,
  sharePassword,
}: {
  proposal: ClientProposal;
  sharePassword?: string;
}) {
  const [copied, setCopied] = useState<"url" | "password" | null>(null);

  async function copy(kind: "url" | "password", value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  const publicUrl =
    typeof window === "undefined"
      ? proposal.webHref
      : `${window.location.origin}${proposal.webHref}`;

  return (
    <article className="surface rounded-xl p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusPill tone="accent">#{proposal.number}</StatusPill>
        <StatusPill tone="good">{proposal.status}</StatusPill>
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl">
        {proposal.title}
      </h3>
      {proposal.summary ? (
        <p className="mt-1 text-sm text-[var(--muted)]">{proposal.summary}</p>
      ) : null}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-[var(--muted)]">Link para el cliente</dt>
          <dd className="flex items-center gap-2">
            <Link
              href={proposal.webHref}
              className="text-[var(--accent-ink)] hover:underline"
            >
              Abrir web →
            </Link>
            <button
              type="button"
              onClick={() => copy("url", publicUrl)}
              className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
            >
              {copied === "url" ? "Copiado" : "Copiar link"}
            </button>
          </dd>
        </div>
        {sharePassword ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="text-[var(--muted)]">Clave de acceso</dt>
            <dd className="flex items-center gap-2">
              <code className="rounded bg-[var(--panel-2)] px-2 py-0.5 text-xs">
                {sharePassword}
              </code>
              <button
                type="button"
                onClick={() => copy("password", sharePassword)}
                className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                {copied === "password" ? "Copiada" : "Copiar clave"}
              </button>
            </dd>
          </div>
        ) : (
          <p className="text-xs text-[var(--warn)]">
            Falta KITCHENCARE_SHARE_PASSWORD en el entorno.
          </p>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {proposal.demoHref ? (
          <Link
            href={proposal.demoHref}
            className="text-[var(--accent-ink)] hover:underline"
          >
            Ver demo →
          </Link>
        ) : null}
        {proposal.downloadHref ? (
          <a
            href={proposal.downloadHref}
            className="text-[var(--accent-ink)] hover:underline"
          >
            Descargar PDF →
          </a>
        ) : null}
      </div>
    </article>
  );
}
