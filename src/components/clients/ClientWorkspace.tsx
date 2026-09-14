import Link from "next/link";
import { StatusPill } from "@/components/ui";
import { clientRecordCounts } from "@/lib/data/clients";
import type {
  Client,
  ClientAsset,
  ClientContact,
  ClientLink,
  ClientNote,
  ClientProposal,
  ClientStatus,
  ClientWorkItem,
} from "@/lib/types";
import { ProposalShareCard } from "@/components/clients/ProposalShareCard";

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

const WORK_KIND_LABEL: Record<ClientWorkItem["kind"], string> = {
  campaña: "Campaña",
  entrega: "Entrega",
  otro: "Otro",
};

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--muted)]">{children}</p>;
}

function SectionCard({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="surface rounded-xl p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          {title}
        </h2>
        <span className="text-xs tabular-nums text-[var(--muted)]">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function ContactList({ contacts }: { contacts: ClientContact[] }) {
  if (contacts.length === 0) {
    return (
      <EmptyHint>
        Todavía no hay contactos. Cuando los tengas, los guardamos acá.
      </EmptyHint>
    );
  }

  return (
    <ul className="space-y-4">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <p className="font-medium">{contact.name}</p>
          {contact.role ? (
            <p className="text-sm text-[var(--muted)]">{contact.role}</p>
          ) : null}
          <div className="mt-1 space-y-0.5 text-sm">
            {contact.email ? (
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[var(--accent-ink)] hover:underline"
                >
                  {contact.email}
                </a>
              </p>
            ) : null}
            {contact.phone ? (
              <p className="tabular-nums text-[var(--muted)]">{contact.phone}</p>
            ) : null}
            {contact.notes ? (
              <p className="text-[var(--muted)]">{contact.notes}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function NoteList({ notes }: { notes: ClientNote[] }) {
  if (notes.length === 0) {
    return (
      <EmptyHint>
        Espacio para brief, acuerdos y contexto del cliente.
      </EmptyHint>
    );
  }

  return (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li key={note.id}>
          <p className="font-medium">{note.title}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--muted)]">
            {note.body}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {new Date(note.updatedAt).toLocaleDateString("es-CL")}
          </p>
        </li>
      ))}
    </ul>
  );
}

function LinkList({ links }: { links: ClientLink[] }) {
  if (links.length === 0) {
    return (
      <EmptyHint>
        Sitio, drive, redes u otros enlaces útiles del cliente.
      </EmptyHint>
    );
  }

  return (
    <ul className="space-y-2 text-sm">
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent-ink)] hover:underline"
          >
            {link.label} →
          </a>
        </li>
      ))}
    </ul>
  );
}

function AssetList({ assets }: { assets: ClientAsset[] }) {
  if (assets.length === 0) {
    return (
      <EmptyHint>
        Logos, briefings, contratos y demás archivos del cliente.
      </EmptyHint>
    );
  }

  return (
    <ul className="space-y-3">
      {assets.map((asset) => (
        <li key={asset.id}>
          <a
            href={asset.href}
            className="font-medium text-[var(--accent-ink)] hover:underline"
          >
            {asset.title}
          </a>
          {asset.description ? (
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {asset.description}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function WorkList({ work }: { work: ClientWorkItem[] }) {
  if (work.length === 0) {
    return (
      <EmptyHint>
        Campañas, entregas y trabajos asociados a este cliente.
      </EmptyHint>
    );
  }

  return (
    <ul className="space-y-4">
      {work.map((item) => (
        <li key={item.id}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{item.title}</p>
            <StatusPill>{WORK_KIND_LABEL[item.kind]}</StatusPill>
            {item.status ? <StatusPill tone="accent">{item.status}</StatusPill> : null}
          </div>
          {item.notes ? (
            <p className="mt-1 text-sm text-[var(--muted)]">{item.notes}</p>
          ) : null}
          {item.href ? (
            <a
              href={item.href}
              className="mt-1 inline-block text-sm text-[var(--accent-ink)] hover:underline"
            >
              Abrir →
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ClientWorkspace({
  client,
  sharePassword,
}: {
  client: Client;
  sharePassword?: string;
}) {
  const counts = clientRecordCounts(client);
  const facts = [
    client.industry ? ["Rubro", client.industry] : null,
    client.location ? ["Ubicación", client.location] : null,
    client.website
      ? [
          "Sitio",
          <a
            key="website"
            href={client.website}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent-ink)] hover:underline"
          >
            {client.website.replace(/^https?:\/\//, "")}
          </a>,
        ]
      : null,
  ].filter(Boolean) as Array<[string, React.ReactNode]>;

  return (
    <div>
      <p className="mb-6 text-sm">
        <Link
          href="/clientes"
          className="text-[var(--muted)] hover:text-[var(--ink)] hover:underline"
        >
          ← Clientes
        </Link>
      </p>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusPill tone={STATUS_TONE[client.status]}>
            {STATUS_LABEL[client.status]}
          </StatusPill>
          {client.industry ? <StatusPill>{client.industry}</StatusPill> : null}
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
          {client.name}
        </h1>
        {client.summary ? (
          <p className="mt-2 max-w-2xl text-[var(--muted)]">{client.summary}</p>
        ) : (
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            Ficha lista para ir guardando contactos, notas, enlaces, archivos y
            trabajos de este cliente.
          </p>
        )}
      </div>

      {facts.length > 0 ? (
        <dl className="surface mb-5 grid gap-4 rounded-xl p-5 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                {label}
              </dt>
              <dd className="mt-1 text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {client.proposals && client.proposals.length > 0 ? (
        <div className="mb-5 space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-lg">
            Propuestas
          </h2>
          {client.proposals.map((proposal: ClientProposal) => (
            <ProposalShareCard
              key={proposal.id}
              proposal={proposal}
              sharePassword={sharePassword}
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Contactos" count={counts.contacts}>
          <ContactList contacts={client.contacts} />
        </SectionCard>
        <SectionCard title="Notas" count={counts.notes}>
          <NoteList notes={client.notes} />
        </SectionCard>
        <SectionCard title="Enlaces" count={counts.links}>
          <LinkList links={client.links} />
        </SectionCard>
        <SectionCard title="Archivos" count={counts.assets}>
          <AssetList assets={client.assets} />
        </SectionCard>
        <div className="lg:col-span-2">
          <SectionCard title="Trabajos" count={counts.work}>
            <WorkList work={client.work} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
