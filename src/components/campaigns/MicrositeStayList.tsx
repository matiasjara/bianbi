"use client";

import { BrandIcon } from "@/components/brand/BrandIcon";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import {
  groupPropertiesByLocation,
  type PropertyStayGroup,
} from "@/lib/demand/property-groups";
import type { CampaignPackProperty } from "@/lib/demand/types";

const AIRBNB_BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95";

const AIRBNB_BTN_LANDING =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FF5A5F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E0484D]";

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
  variant,
}: {
  group: PropertyStayGroup;
  rank: number;
  ui: StayUi;
  variant: "microsite" | "landing";
}) {
  const title = group.buildingName ?? group.neighborhood;
  const photos =
    group.photos.length > 0 ? group.photos : [group.photo].filter(Boolean);
  const btnClass = variant === "landing" ? AIRBNB_BTN_LANDING : AIRBNB_BTN;
  const tiltEven = rank % 2 === 0;

  return (
    <article
      className={`relative md:grid md:items-start md:gap-8 ${
        variant === "landing"
          ? "md:grid-cols-[minmax(220px,300px)_1fr]"
          : `md:grid-cols-[minmax(220px,280px)_1fr] ${
              tiltEven ? "" : "md:grid-cols-[1fr_minmax(220px,280px)]"
            }`
      }`}
    >
      <div
        className={`ms-polaroid relative ${
          tiltEven ? "ms-tilt-l md:order-1" : "ms-tilt-r md:order-2"
        }`}
      >
        <span
          className={`ms-tape ${
            tiltEven ? "ms-tape-coral" : "ms-tape-olive"
          } -top-2 left-8`}
        />
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white ${
            variant === "landing" ? "bg-[#222]" : "bg-[var(--ms-ink)]"
          }`}
        >
          #{rank}
        </span>
        <PhotoStoryCarousel
          photos={photos}
          alt={title}
          caption={group.neighborhood}
          className="h-60 w-full md:h-72"
        />
      </div>

      <div
        className={`pt-3 md:pt-2 ${tiltEven ? "md:order-2" : "md:order-1"}`}
      >
        <div
          className={`flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] ${
            variant === "landing" ? "text-[#6a6a6a]" : "text-[var(--ms-muted)]"
          }`}
        >
          <span
            className={`inline-flex items-center gap-1 ${
              variant === "landing" ? "text-[#484848]" : "text-[var(--ms-olive)]"
            }`}
          >
            <BrandIcon name="pin" size={18} />
            {group.walkingMinutes} {ui.minWalk}
          </span>
          <span aria-hidden>·</span>
          <span>{group.distanceKm} km</span>
          <span aria-hidden>·</span>
          <span>{group.neighborhood}</span>
        </div>

        <h3
          className={`mt-2 text-2xl leading-snug ${
            variant === "landing"
              ? "font-[family-name:var(--font-display)]"
              : "ms-editorial"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-1 text-sm leading-relaxed ${
            variant === "landing" ? "text-[#6a6a6a]" : "text-[var(--ms-muted)]"
          }`}
        >
          {group.address}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
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
                className={btnClass}
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

  return (
    <div className={`${variant === "landing" ? "mt-10" : "mt-10"} space-y-10`}>
      {groups.map((group) => {
        unitRank += 1;
        return (
          <StayGroupCard
            key={group.key}
            group={group}
            rank={unitRank}
            ui={ui}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
