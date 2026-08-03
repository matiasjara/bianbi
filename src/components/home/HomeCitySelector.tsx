"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  CITY_OPTIONS,
  type CityId,
  homeQueryString,
} from "@/lib/demand/cities";

type Props = {
  city: CityId;
  year?: number;
  monthIndex?: number;
};

export function HomeCitySelector({ city, year, monthIndex }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(next: CityId) {
    if (next === city) return;
    const q = new URLSearchParams(searchParams.toString());
    if (next === "santiago") q.delete("city");
    else q.set("city", next);
    const qs = q.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  return (
    <div
      className="inline-flex rounded-lg border border-[var(--ms-line)] bg-white/80 p-1 shadow-sm"
      role="tablist"
      aria-label="Ciudad"
    >
      {CITY_OPTIONS.map((opt) => {
        const selected = opt.id === city;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => select(opt.id)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              selected
                ? "bg-[var(--ms-ink)] text-white"
                : "text-[var(--ms-muted)] hover:bg-[var(--ms-paper)] hover:text-[var(--ms-ink)]"
            }`}
          >
            {opt.label}
            {!opt.active ? (
              <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide opacity-70">
                pronto
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function cityCalendarHref(
  city: CityId,
  year: number,
  monthIndex: number,
): string {
  return homeQueryString({ city, year, monthIndex, hash: "calendario" });
}
