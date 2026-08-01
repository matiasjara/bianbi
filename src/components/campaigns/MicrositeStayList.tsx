import { BrandIcon } from "@/components/brand/BrandIcon";
import {
  groupPropertiesByLocation,
  type PropertyStayGroup,
} from "@/lib/demand/property-groups";
import type { CampaignPackProperty } from "@/lib/demand/types";

const AIRBNB_BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--ms-airbnb)] px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-95 sm:px-4 sm:text-sm";

const AIRBNB_BTN_ALT =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--ms-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ms-ink)] transition hover:border-[var(--ms-airbnb)] hover:text-[var(--ms-airbnb)] sm:px-4 sm:text-sm";

type StayUi = {
  minWalk: string;
  ctaAirbnb: string;
  stayUnitOption: (n: number) => string;
  stayReviews: (n: number) => string;
};

function StayGroupCard({
  group,
  rank,
  ui,
}: {
  group: PropertyStayGroup;
  rank: number;
  ui: StayUi;
}) {
  const title = group.buildingName ?? group.neighborhood;

  return (
    <article className="rounded-2xl border border-[var(--ms-line)] bg-[var(--ms-panel)]/80 p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-[var(--ms-line)] sm:h-24 sm:w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={group.photo}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute left-2 top-2 rounded-full bg-[var(--ms-ink)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
            #{rank}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
            <span className="inline-flex items-center gap-1 text-[var(--ms-olive)]">
              <BrandIcon name="pin" size={14} />
              {group.walkingMinutes} {ui.minWalk}
            </span>
            <span aria-hidden>·</span>
            <span>{group.distanceKm} km</span>
          </div>

          <h3 className="ms-editorial mt-1 text-lg leading-snug sm:text-xl">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-[var(--ms-muted)] sm:text-sm">
            {group.address}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {group.units.map((unit, unitIdx) => {
              const label =
                group.units.length > 1
                  ? ui.stayUnitOption(unitIdx + 1)
                  : ui.ctaAirbnb;
              const meta =
                unit.reviewCount != null
                  ? ui.stayReviews(unit.reviewCount)
                  : null;

              return (
                <a
                  key={unit.slug}
                  href={unit.airbnbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    group.units.length === 1 ? AIRBNB_BTN : AIRBNB_BTN_ALT
                  }
                  title={unit.name}
                >
                  <span>{label}</span>
                  {meta ? (
                    <span className="font-normal opacity-80">· {meta}</span>
                  ) : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

export function MicrositeStayList({
  properties,
  ui,
  variant = "microsite",
}: {
  properties: CampaignPackProperty[];
  ui: StayUi;
  variant?: "microsite" | "landing";
}) {
  const groups = groupPropertiesByLocation(properties);
  let unitRank = 0;

  if (variant === "landing") {
    return (
      <div className="mt-10 space-y-3">
        {groups.map((group) => {
          unitRank += 1;
          return (
            <LandingStayGroupCard
              key={group.key}
              group={group}
              rank={unitRank}
              ui={ui}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {groups.map((group) => {
        unitRank += 1;
        return (
          <StayGroupCard key={group.key} group={group} rank={unitRank} ui={ui} />
        );
      })}
    </div>
  );
}

function LandingStayGroupCard({
  group,
  rank,
  ui,
}: {
  group: PropertyStayGroup;
  rank: number;
  ui: StayUi;
}) {
  const title = group.buildingName ?? group.neighborhood;

  return (
    <article className="rounded-2xl border border-black/8 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:p-5">
      <div className="flex gap-4">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={group.photo}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute left-2 top-2 rounded-full bg-[#222] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
            #{rank}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6a6a6a]">
            <span className="text-[#484848]">
              {group.walkingMinutes} {ui.minWalk}
            </span>
            <span aria-hidden>·</span>
            <span>{group.distanceKm} km</span>
          </div>

          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg leading-snug sm:text-xl">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-[#6a6a6a] sm:text-sm">
            {group.address}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {group.units.map((unit, unitIdx) => {
              const label =
                group.units.length > 1
                  ? ui.stayUnitOption(unitIdx + 1)
                  : ui.ctaAirbnb;
              const meta =
                unit.reviewCount != null
                  ? ui.stayReviews(unit.reviewCount)
                  : null;

              return (
                <a
                  key={unit.slug}
                  href={unit.airbnbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5A5F] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#E0484D] sm:px-4 sm:text-sm"
                  title={unit.name}
                >
                  <span>{label}</span>
                  {meta ? (
                    <span className="font-normal opacity-90">· {meta}</span>
                  ) : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
