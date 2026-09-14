import Link from "next/link";
import { SectionTitle, StatusPill } from "@/components/ui";
import { clientRecordCounts, getClients } from "@/lib/data/clients";
import type { ClientStatus } from "@/lib/types";

export const metadata = { title: "Clientes" };

const STATUS_LABEL: Record<ClientStatus, string> = {
  active: "activo",
  paused: "pausado",
  prospect: "prospecto",
};

const STATUS_TONE: Record<ClientStatus, "good" | "warn" | "accent"> = {
  active: "good",
  paused: "warn",
  prospect: "accent",
};

export default function ClientesPage() {
  const clients = getClients();

  return (
    <div>
      <SectionTitle
        title="Clientes"
        subtitle="Fichas internas para guardar contactos, notas, archivos y trabajos de cada cliente."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {clients.map((client) => {
          const counts = clientRecordCounts(client);
          const saved =
            counts.contacts +
            counts.notes +
            counts.links +
            counts.assets +
            counts.work +
            counts.proposals;

          return (
            <article
              key={client.id}
              className="surface overflow-hidden rounded-xl"
            >
              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusPill tone={STATUS_TONE[client.status]}>
                    {STATUS_LABEL[client.status]}
                  </StatusPill>
                  {client.industry ? (
                    <StatusPill>{client.industry}</StatusPill>
                  ) : null}
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">
                  {client.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {client.summary ??
                    (saved === 0
                      ? "Ficha vacía, lista para completar."
                      : `${saved} registro${saved === 1 ? "" : "s"} guardado${saved === 1 ? "" : "s"}.`)}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-[var(--muted)]">Contactos</dt>
                    <dd className="tabular-nums">{counts.contacts}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-[var(--muted)]">Notas</dt>
                    <dd className="tabular-nums">{counts.notes}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-[var(--muted)]">Enlaces</dt>
                    <dd className="tabular-nums">{counts.links}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-[var(--muted)]">Archivos</dt>
                    <dd className="tabular-nums">{counts.assets}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-[var(--muted)]">Trabajos</dt>
                    <dd className="tabular-nums">{counts.work}</dd>
                  </div>
                  <div className="flex justify-between gap-3 sm:block">
                    <dt className="text-[var(--muted)]">Propuestas</dt>
                    <dd className="tabular-nums">{counts.proposals}</dd>
                  </div>
                </dl>

                <Link
                  href={`/clientes/${client.slug}`}
                  className="mt-5 inline-block text-sm text-[var(--accent-ink)] hover:underline"
                >
                  Abrir ficha →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
