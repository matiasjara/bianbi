"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MONTH_NAMES_ES, defaultPlanningMonth } from "@/lib/demand/month-range";

export function CampaignMonthNav({
  year,
  monthIndex,
}: {
  year: number;
  monthIndex: number;
}) {
  const router = useRouter();
  const years = [year - 1, year, year + 1, year + 2].filter(
    (y, i, arr) => arr.indexOf(y) === i && y >= 2024,
  );

  function hrefFor(y: number, m: number) {
    const params = new URLSearchParams();
    params.set("year", String(y));
    params.set("month", String(m + 1));
    return `/campanas?${params.toString()}`;
  }

  function shift(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    router.push(hrefFor(d.getFullYear(), d.getMonth()));
  }

  const def = defaultPlanningMonth();

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          Mes de campaña
        </span>
        <select
          className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
          value={monthIndex}
          onChange={(e) => {
            router.push(hrefFor(year, Number(e.target.value)));
          }}
        >
          {MONTH_NAMES_ES.map((name, i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          Año
        </span>
        <select
          className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
          value={year}
          onChange={(e) => {
            router.push(hrefFor(Number(e.target.value), monthIndex));
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2 pb-0.5">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          ← Mes anterior
        </button>
        <button
          type="button"
          onClick={() => shift(1)}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          Mes siguiente →
        </button>
        <Link
          href={hrefFor(def.year, def.monthIndex)}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          Mes actual
        </Link>
      </div>
    </div>
  );
}
