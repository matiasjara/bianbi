"use client";

import { BrandIcon } from "@/components/brand/BrandIcon";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import {
  groupPropertiesByLocation,
  type PropertyStayGroup,
} from "@/lib/demand/property-groups";
import type { CampaignPackProperty } from "@/lib/demand/types";
import { publicPropertyLocation } from "@/lib/demand/public-location";
import {
  formatParkingIncluded,
  formatStayReviews,
  formatStayUnitOption,
  STAY_RATING,
  type StayListUi,
} from "@/lib/i18n/stay-labels";

const AIRBNB_BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--ms-airbnb,#FF5A5F)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95";

const AIRBNB_BTN_LANDING =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FF5A5F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E0484D]";

function SuperhostBadge({ variant }: { variant: "microsite" | "landing" }) {
  const badgeBg =
    variant === "landing" ? "bg-[#FF5A5F]/10" : "bg-[var(--ms-coral)]/12";
  const badgeText =
    variant === "landing" ? "text-[#E0484D]" : "text-[var(--ms-coral,#E0484D)]";

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${badgeBg} ${badgeText}`}
    >
      Superhost
    </span>
  );
}

function ParkingBadge({
  variant,
  label,
}: {
  variant: "microsite" | "landing";
  label: string;
}) {
  const badgeBg =
    variant === "landing" ? "bg-[#222]/8" : "bg-[var(--ms-gold)]/18";
  const badgeText =
    variant === "landing" ? "text-[#222]" : "text-[var(--ms-ink)]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${badgeBg} ${badgeText}`}
    >
      <span aria-hidden>🅿️</span>
      {label}
    </span>
  );
}

function StayUnitCta({
  href,
  label,
  title,
  locale,
  reviewCount,
  variant,
}: {
  href: string;
  label: string;
  title: string;
  locale: StayListUi["locale"];
  reviewCount?: number;
  variant: "microsite" | "landing";
}) {
  const btnClass = variant === "landing" ? AIRBNB_BTN_LANDING : AIRBNB_BTN;
  const flapBg =
    variant === "landing"
      ? "border-black/10 bg-white text-[#484848]"
      : "border-[var(--ms-line)] bg-[var(--ms-paper,#fff)] text-[var(--ms-muted)]";
  const flapAccent =
    variant === "landing" ? "text-[#222]" : "text-[var(--ms-ink)]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex flex-col items-stretch"
      title={title}
    >
      <span
        className={`mb-[-1px] ml-3 inline-flex w-fit items-center gap-1 rounded-t-md border border-b-0 px-2.5 py-1 text-[10px] font-medium leading-none shadow-sm transition group-hover:brightness-[0.98] ${flapBg}`}
      >
        <span className={`inline-flex items-center gap-0.5 font-semibold ${flapAccent}`}>
          {STAY_RATING.toFixed(1)}
          <span className="text-[#FFB400]" aria-hidden>
            ★
          </span>
        </span>
        {reviewCount != null ? (
          <>
            <span aria-hidden className="opacity-40">
              ·
            </span>
            <span>{formatStayReviews(locale, reviewCount)}</span>
          </>
        ) : null}
      </span>
      <span className={`${btnClass} min-w-[9.5rem]`}>{label}</span>
    </a>
  );
}

function LocationHighlights({
  items,
  variant,
}: {
  items: string[];
  variant: "microsite" | "landing";
}) {
  const text =
    variant === "landing" ? "text-[#484848]" : "text-[var(--ms-ink)]/90";
  const icon =
    variant === "landing" ? "text-[#7B8B3E]" : "text-[var(--ms-olive)]";

  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className={`flex gap-2.5 text-sm leading-snug ${text}`}>
          <span
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--ms-olive)]/12 ${icon}`}
            aria-hidden
          >
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function StayGroupCard({
  group,
  rank,
  ui,
  variant,
}: {
  group: PropertyStayGroup;
  rank: number;
  ui: StayListUi;
  variant: "microsite" | "landing";
}) {
  const title = group.buildingName ?? group.neighborhood;
  const photos =
    group.photos.length > 0 ? group.photos : [group.photo].filter(Boolean);
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
        {variant === "landing" && group.locationHighlights?.length ? (
          <>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                variant === "landing"
                  ? "text-[#6a6a6a]"
                  : "text-[var(--ms-muted)]"
              }`}
            >
              {group.neighborhood}
            </p>
            <LocationHighlights
              items={group.locationHighlights}
              variant={variant}
            />
          </>
        ) : (
          <div
            className={`flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              variant === "landing" ? "text-[#6a6a6a]" : "text-[var(--ms-muted)]"
            }`}
          >
            <span
              className={`inline-flex items-center gap-1 ${
                variant === "landing"
                  ? "text-[#484848]"
                  : "text-[var(--ms-olive)]"
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
        )}

        <h3
          className={`mt-2 text-2xl leading-snug ${
            variant === "landing"
              ? "font-[family-name:var(--font-display)]"
              : "ms-editorial"
          }`}
        >
          {title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SuperhostBadge variant={variant} />
          {group.hasParking ? (
            <ParkingBadge
              variant={variant}
              label={formatParkingIncluded(ui.locale)}
            />
          ) : null}
        </div>
        <p
          className={`mt-1 text-sm leading-relaxed ${
            variant === "landing" ? "text-[#6a6a6a]" : "text-[var(--ms-muted)]"
          }`}
        >
          {publicPropertyLocation(group.neighborhood, group.address)}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-4">
          {group.units.map((unit, unitIdx) => {
            const label =
              group.units.length > 1
                ? formatStayUnitOption(ui.locale, unitIdx + 1)
                : ui.ctaAirbnb;

            return (
              <StayUnitCta
                key={unit.slug}
                href={unit.airbnbUrl}
                label={label}
                title={unit.name}
                locale={ui.locale}
                reviewCount={unit.reviewCount}
                variant={variant}
              />
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
  ui: StayListUi;
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
