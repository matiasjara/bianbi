"use client";

import { useMemo, useState } from "react";
import type {
  OutreachCategory,
  OutreachOrganization,
  OutreachSource,
} from "@/lib/types";
import {
  OUTREACH_CATEGORY_LABEL,
  OUTREACH_ORG_TYPE_LABEL,
} from "@/lib/data/outreach";
import { Metric, StatusPill } from "@/components/ui";

const SOURCE_LABEL: Record<OutreachOrganization["source"], string> = {
  tabla_asociaciones: "Tabla / IND",
  registro_fdn: "Registro FDN",
  fehoch: "FEHOCH",
  manual_outreach: "Curaduría",
  sernatur: "Sernatur",
  ski_resorts: "Centros de ski",
  promotoras: "Productoras / venues",
};

const MAILING_ORG_TYPES = new Set(["federacion", "asociacion", "club"]);

export function OutreachDatabase({
  organizations,
  sources,
}: {
  organizations: OutreachOrganization[];
  sources: OutreachSource[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [segment, setSegment] = useState("all");
  const [region, setRegion] = useState("all");
  const [orgType, setOrgType] = useState("all");
  const [source, setSource] = useState("all");
  const [mailingOnly, setMailingOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  /** Categorías colapsadas (cerradas). Por defecto todas abiertas. */
  const [collapsed, setCollapsed] = useState<Set<OutreachCategory>>(
    () => new Set(),
  );

  const categories = useMemo(() => {
    const counts = new Map<OutreachOrganization["category"], number>();
    for (const o of organizations) {
      counts.set(o.category, (counts.get(o.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) =>
      OUTREACH_CATEGORY_LABEL[a[0]].localeCompare(
        OUTREACH_CATEGORY_LABEL[b[0]],
        "es",
      ),
    );
  }, [organizations]);

  const segments = useMemo(
    () =>
      Array.from(
        new Set(
          organizations
            .filter((o) => category === "all" || o.category === category)
            .map((o) => o.segment)
            .filter(Boolean) as string[],
        ),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [organizations, category],
  );

  const regions = useMemo(
    () =>
      Array.from(
        new Set(
          organizations.map((o) => o.region).filter(Boolean) as string[],
        ),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [organizations],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return organizations.filter((o) => {
      if (mailingOnly && !o.mailingReady) return false;
      if (category !== "all" && o.category !== category) return false;
      if (segment !== "all" && o.segment !== segment) return false;
      if (region !== "all" && o.region !== region) return false;
      if (orgType !== "all" && o.orgType !== orgType) return false;
      if (source !== "all" && o.source !== source) return false;
      if (!query) return true;
      const hay = [
        o.name,
        o.segment ?? "",
        o.sport ?? "",
        OUTREACH_CATEGORY_LABEL[o.category],
        o.region ?? "",
        o.emails.join(" "),
        o.phones.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [
    organizations,
    q,
    category,
    segment,
    region,
    orgType,
    source,
    mailingOnly,
  ]);

  const grouped = useMemo(() => {
    const map = new Map<OutreachCategory, OutreachOrganization[]>();
    for (const o of filtered) {
      const bucket = map.get(o.category) ?? [];
      bucket.push(o);
      map.set(o.category, bucket);
    }
    return [...map.entries()].sort((a, b) =>
      OUTREACH_CATEGORY_LABEL[a[0]].localeCompare(
        OUTREACH_CATEGORY_LABEL[b[0]],
        "es",
      ),
    );
  }, [filtered]);

  const mailingCount = organizations.filter((o) => o.mailingReady).length;
  const emailPool = useMemo(() => {
    const emails = new Set<string>();
    for (const o of filtered) {
      for (const e of o.emails) emails.add(e.toLowerCase());
    }
    return Array.from(emails).sort();
  }, [filtered]);

  const selectedEmails = useMemo(() => {
    const emails = new Set<string>();
    for (const o of filtered) {
      if (!selected.has(o.id)) continue;
      for (const e of o.emails) emails.add(e);
    }
    return Array.from(emails);
  }, [filtered, selected]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCategory(id: OutreachCategory) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setCollapsed(new Set());
  }

  function collapseAll() {
    setCollapsed(new Set(grouped.map(([id]) => id)));
  }

  function selectMailingVisible() {
    setSelected(
      new Set(filtered.filter((o) => o.mailingReady).map((o) => o.id)),
    );
  }

  async function copyEmails(list: string[]) {
    if (list.length === 0) return;
    await navigator.clipboard.writeText(list.join(", "));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Contactos" value={String(organizations.length)} />
        <Metric
          label="Listos para mailing"
          value={String(mailingCount)}
          hint="Con al menos un correo"
        />
        <Metric
          label="Filtrados"
          value={String(filtered.length)}
          hint={`${emailPool.length} correos únicos`}
        />
        <Metric
          label="Seleccionados"
          value={String(selected.size)}
          hint={`${selectedEmails.length} correos`}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            setSegment("all");
          }}
          className={`rounded-md px-3 py-1.5 text-sm ${
            category === "all"
              ? "bg-[var(--accent)] text-[var(--panel)]"
              : "border border-[var(--line)]"
          }`}
        >
          Todas ({organizations.length})
        </button>
        {categories.map(([id, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setCategory(id);
              setSegment("all");
              setCollapsed((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }}
            className={`rounded-md px-3 py-1.5 text-sm ${
              category === id
                ? "bg-[var(--accent)] text-[var(--panel)]"
                : "border border-[var(--line)]"
            }`}
          >
            {OUTREACH_CATEGORY_LABEL[id]} ({count})
          </button>
        ))}
      </div>

      <div className="surface rounded-xl p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          Fuentes
        </p>
        <ul className="flex flex-wrap gap-3 text-sm">
          {sources.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent-ink)] hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface rounded-xl p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm md:col-span-2 lg:col-span-1">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Buscar
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, segmento, correo…"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <FilterSelect
            label="Segmento"
            value={segment}
            onChange={setSegment}
            options={segments}
          />
          <FilterSelect
            label="Región"
            value={region}
            onChange={setRegion}
            options={regions}
          />
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Tipo
            </span>
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
            >
              <option value="all">Todos</option>
              {Object.entries(OUTREACH_ORG_TYPE_LABEL)
                .filter(([id]) => MAILING_ORG_TYPES.has(id))
                .map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Fuente
            </span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
            >
              <option value="all">Todas</option>
              {Object.entries(SOURCE_LABEL).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={mailingOnly}
              onChange={(e) => setMailingOnly(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Solo con correo (mailing)
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={selectMailingVisible}
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm text-[var(--panel)]"
          >
            Seleccionar con correo
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
          >
            Limpiar selección
          </button>
          <button
            type="button"
            onClick={() => void copyEmails(selectedEmails)}
            disabled={selectedEmails.length === 0}
            className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Copiar correos seleccionados
          </button>
          <button
            type="button"
            onClick={() => void copyEmails(emailPool)}
            disabled={emailPool.length === 0}
            className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Copiar todos los filtrados
          </button>
          <button
            type="button"
            onClick={expandAll}
            className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
          >
            Expandir categorías
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
          >
            Colapsar categorías
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface rounded-xl px-3 py-8 text-center text-sm text-[var(--muted)]">
          No hay contactos con esos filtros.
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([catId, rows]) => {
            const open = !collapsed.has(catId);
            const mailingInGroup = rows.filter((o) => o.mailingReady).length;
            return (
              <div
                key={catId}
                className="surface overflow-hidden rounded-xl"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(catId)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 border-b border-[var(--line)] bg-[var(--panel-2)]/60 px-4 py-3 text-left transition-colors hover:bg-[var(--panel-2)]"
                >
                  <span
                    className={`inline-block text-[var(--muted)] transition-transform ${
                      open ? "rotate-90" : ""
                    }`}
                    aria-hidden
                  >
                    ▸
                  </span>
                  <span className="flex-1 font-medium text-[var(--ink)]">
                    {OUTREACH_CATEGORY_LABEL[catId]}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {rows.length} contacto{rows.length === 1 ? "" : "s"}
                    {mailingInGroup > 0
                      ? ` · ${mailingInGroup} con correo`
                      : ""}
                  </span>
                </button>

                {open ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-[var(--line)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                        <tr>
                          <th className="px-3 py-3 font-medium" />
                          <th className="px-3 py-3 font-medium">
                            Organización
                          </th>
                          <th className="px-3 py-3 font-medium">Segmento</th>
                          <th className="px-3 py-3 font-medium">Región</th>
                          <th className="px-3 py-3 font-medium">Contacto</th>
                          <th className="px-3 py-3 font-medium">Fuente</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((o) => (
                          <tr
                            key={o.id}
                            className="border-b border-[var(--line)]/70 last:border-0"
                          >
                            <td className="px-3 py-3 align-top">
                              <input
                                type="checkbox"
                                checked={selected.has(o.id)}
                                onChange={() => toggle(o.id)}
                                disabled={!o.mailingReady}
                                className="size-4 accent-[var(--accent)] disabled:opacity-30"
                                aria-label={`Seleccionar ${o.name}`}
                              />
                            </td>
                            <td className="px-3 py-3 align-top">
                              <p className="font-medium text-[var(--ink)]">
                                {o.name}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                <StatusPill>
                                  {OUTREACH_ORG_TYPE_LABEL[o.orgType]}
                                </StatusPill>
                                {o.mailingReady ? (
                                  <StatusPill tone="good">mailing</StatusPill>
                                ) : (
                                  <StatusPill tone="warn">
                                    sin correo
                                  </StatusPill>
                                )}
                              </div>
                              {o.address ? (
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                  {o.address}
                                </p>
                              ) : null}
                            </td>
                            <td className="px-3 py-3 align-top text-[var(--muted)]">
                              {o.segment ?? o.sport ?? "—"}
                            </td>
                            <td className="px-3 py-3 align-top text-[var(--muted)]">
                              {o.region ?? "—"}
                            </td>
                            <td className="px-3 py-3 align-top">
                              {o.emails.length > 0 ? (
                                <ul className="space-y-0.5">
                                  {o.emails.map((e) => (
                                    <li key={e}>
                                      <a
                                        href={`mailto:${e}`}
                                        className="text-[var(--accent-ink)] hover:underline"
                                      >
                                        {e}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-[var(--muted)]">—</span>
                              )}
                              {o.phones.length > 0 ? (
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                  {o.phones.join(" · ")}
                                </p>
                              ) : null}
                            </td>
                            <td className="px-3 py-3 align-top">
                              <a
                                href={o.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--accent-ink)] hover:underline"
                              >
                                {SOURCE_LABEL[o.source]}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
      >
        <option value="all">Todos</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

/** @deprecated usar OutreachDatabase */
export { OutreachDatabase as SportsOrgDatabase };
