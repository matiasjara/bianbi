import { BianbiLogo } from "@/components/brand/BianbiLogo";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeShareBar } from "@/components/campaigns/MicrositeShareBar";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import type { BrandIconName } from "@/lib/brand/icons";
import type { LocalizedMicrosite } from "@/lib/i18n/microsite";

const AIRBNB_BTN =
  "inline-flex items-center justify-center rounded-lg bg-[var(--ms-airbnb)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95";

function IconBadge({ name }: { name: BrandIconName }) {
  return (
    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--ms-line)] bg-white/80">
      <BrandIcon name={name} size={26} />
    </span>
  );
}

function SectionHead({
  id,
  icon,
  kicker,
  title,
}: {
  id: string;
  icon: BrandIconName;
  kicker: string;
  title: string;
  tone?: string;
}) {
  return (
    <div id={id} className="flex items-start gap-3 scroll-mt-24">
      <IconBadge name={icon} />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
          {kicker}
        </p>
        <h2 className="ms-editorial mt-1 text-2xl leading-tight md:text-[1.85rem]">
          {title}
        </h2>
      </div>
    </div>
  );
}

function DoodleStars({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 60"
      fill="none"
      aria-hidden
    >
      <path
        d="M18 22l2.2 6.2H27l-5.2 3.8 2 6.2-5.8-4.2-5.8 4.2 2-6.2L9 28.2h6.8L18 22z"
        fill="currentColor"
      />
      <path
        d="M58 10l1.6 4.4H64l-3.7 2.7 1.4 4.4-3.7-2.9-3.7 2.9 1.4-4.4-3.7-2.7h4.4L58 10z"
        fill="currentColor"
      />
      <path
        d="M96 28l2 5.4h5.8l-4.7 3.4 1.8 5.4-4.9-3.6-4.9 3.6 1.8-5.4-4.7-3.4H94l2-5.4z"
        fill="currentColor"
      />
      <circle cx="40" cy="40" r="2" fill="currentColor" />
      <circle cx="78" cy="42" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DoodlePath({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 48"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        className="ms-connector ms-connector-live"
        d="M8 28 C90 8 160 40 260 18 S420 8 520 30 660 44 792 16"
      />
      <circle cx="260" cy="18" r="4" fill="var(--ms-terracotta)" opacity="0.85" />
      <circle cx="520" cy="30" r="4" fill="var(--ms-olive)" opacity="0.85" />
    </svg>
  );
}

export function MicrositeInfographic({
  slug,
  L,
}: {
  slug: string;
  L: LocalizedMicrosite;
}) {
  const { ui, content: m, properties: props, locale } = L;

  const mapMarkers = [
    {
      lat: m.venueLat,
      lng: m.venueLng,
      label: m.venueName,
      kind: "venue" as const,
    },
    ...props.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: p.neighborhood,
      kind: "property" as const,
    })),
  ];

  const nearest = props[0];
  const heroPhoto =
    nearest?.photos?.[0] || nearest?.photo || props[1]?.photo || "";
  const sidePhoto = props[1]?.photos?.[0] || props[1]?.photo || heroPhoto;

  const nav = [
    ["must", ui.navMust],
    ["novedades", ui.navNews],
    ["mapa", ui.navMap],
    ["tips", ui.navTips],
    ["clima", ui.navWeather],
    ["transporte", ui.navTransport],
    ["faq", ui.navFaq],
    ["alojar", ui.navStay],
  ] as const;

  const shareProps = {
    title: m.guideTitle,
    shareText: m.shareText,
    path: `/g/${slug}`,
    slug,
    locale,
    shareLabel: ui.shareLabel,
    copyLabel: ui.copyLabel,
    copiedLabel: ui.copiedLabel,
    shareImageLabel: ui.shareImageLabel,
    downloadImageLabel: ui.downloadImageLabel,
    sharingLabel: ui.sharingLabel,
    shareHint: ui.shareHint,
  };

  return (
    <div lang={locale} className="ms-root min-h-screen overflow-x-hidden">
      <header className="relative border-b border-[var(--ms-line)]/80">
        <LandingLangSwitch
          basePath={`/g/${slug}`}
          locale={locale}
          theme="light"
        />

        <div
          className="ms-stroke right-[-4rem] top-8 h-28 w-[18rem] -rotate-6 bg-[var(--ms-teal)]/25 md:right-8 md:w-[22rem]"
          aria-hidden
        />
        <DoodleStars className="pointer-events-none absolute right-6 top-10 hidden w-28 text-[var(--ms-olive)]/50 md:block" />

        <div className="relative mx-auto grid max-w-5xl gap-8 px-5 pb-12 pt-12 md:grid-cols-[1.15fr_0.85fr] md:items-end md:pb-16 md:pt-16">
          <div>
            <div className="ms-rise flex flex-wrap items-center gap-3 pr-28">
              <BianbiLogo href={`/?lang=${locale}`} variant="logo" />
              <span className="font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ms-muted)]">
                {ui.productLabel}
              </span>
            </div>

            <p className="ms-rise ms-rise-d1 mt-7 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-terracotta)]">
              {m.interestLabel} · {m.eventDates}
            </p>

            <h1 className="ms-rise ms-rise-d1 ms-editorial mt-3 max-w-xl text-[2.15rem] leading-[1.1] md:text-5xl">
              {m.guideTitle}
            </h1>

            <p className="ms-rise ms-rise-d2 mt-4 max-w-md text-[15px] leading-relaxed text-[var(--ms-muted)]">
              {m.eventSummary}
            </p>

            <div className="ms-rise ms-rise-d3 mt-7 flex flex-wrap gap-2">
              <a
                href="#alojar"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--ms-ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                <BrandIcon name="bed" size={16} />
                {ui.ctaStay}
              </a>
              <a
                href="#must"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--ms-ink)]/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[var(--ms-ink)] transition hover:bg-white"
              >
                {ui.ctaEssentials}
              </a>
            </div>

            <MicrositeShareBar {...shareProps} theme="light" />
          </div>

          <div className="relative mx-auto w-full max-w-sm md:mx-0 md:justify-self-end">
            <div
              className="ms-stroke -left-6 top-10 h-24 w-24 rounded-full bg-[var(--ms-pink)]/25"
              aria-hidden
            />
            {heroPhoto ? (
              <div className="ms-polaroid ms-tilt-r relative">
                <span className="ms-tape ms-tape-coral -top-2 left-6" />
                <span className="ms-tape ms-tape-olive -top-1 right-8" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${heroPhoto}?im_w=720`}
                  alt={nearest?.neighborhood ?? m.venueName}
                  className="aspect-[4/5] w-full object-cover"
                />
                <p className="mt-2 px-1 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ms-muted)]">
                  {nearest
                    ? `${nearest.neighborhood} · ${nearest.walkingMinutes} ${ui.minWalk}`
                    : m.venueName}
                </p>
              </div>
            ) : null}

            {sidePhoto && sidePhoto !== heroPhoto ? (
              <div className="ms-polaroid ms-tilt-l absolute -bottom-8 -left-4 hidden w-36 sm:block md:-left-10 md:w-40">
                <span className="ms-tape ms-tape-terracotta -top-2 left-8" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${sidePhoto}?im_w=480`}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <DoodlePath className="relative mx-auto mt-4 block h-10 w-full max-w-5xl px-5 opacity-80" />
      </header>

      {/* Snapshot con números grandes */}
      <section className="relative mx-auto max-w-5xl px-5 py-12 md:py-14">
        <div className="mb-8 max-w-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
            {ui.snapshotKicker}
          </p>
          <h2 className="ms-editorial mt-1 text-2xl md:text-3xl">
            {ui.snapshotTitle}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: ui.when,
              value: m.eventDates,
              tone: "text-[var(--ms-olive)]",
              icon: "calendar" as const,
            },
            {
              label: ui.where,
              value: m.venueName,
              tone: "text-[var(--ms-terracotta)]",
              icon: "pin" as const,
            },
            {
              label: ui.weather,
              value: m.weather.summary.replace(/^[^:]+:\s*/, "").slice(0, 42),
              tone: "text-[var(--ms-gold)]",
              icon: "sunrise" as const,
            },
            {
              label: ui.nearest,
              value: nearest
                ? `${nearest.walkingMinutes} ${ui.minWalk}`
                : ui.nearbyOptions,
              sub: nearest?.neighborhood,
              tone: "text-[var(--ms-ink)]",
              icon: "bed" as const,
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`ms-node relative rounded-2xl border border-[var(--ms-line)] bg-[var(--ms-panel)]/90 px-4 py-5 ${
                i % 2 === 0 ? "md:-rotate-1" : "md:rotate-1"
              }`}
            >
              <BrandIcon name={item.icon} size={26} />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                {item.label}
              </p>
              <p
                className={`ms-editorial mt-1 text-2xl leading-tight ${item.tone}`}
              >
                {item.value}
              </p>
              {"sub" in item && item.sub ? (
                <p className="mt-1 text-xs text-[var(--ms-muted)]">{item.sub}</p>
              ) : null}
            </div>
          ))}
        </div>

        <nav className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-[var(--ms-muted)]">
          {nav.map(([id, label], i) => (
            <span key={id} className="inline-flex items-center gap-3">
              {i > 0 ? (
                <span className="text-[var(--ms-line)]" aria-hidden>
                  /
                </span>
              ) : null}
              <a
                href={`#${id}`}
                className="text-[var(--ms-ink)]/80 underline-offset-4 transition hover:text-[var(--ms-terracotta)] hover:underline"
              >
                {label}
              </a>
            </span>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-5 pb-16 md:space-y-20">
        <section className="ms-rise">
          <SectionHead
            id="must"
            icon="star"
            kicker={ui.kickerMust}
            title={ui.titleMust}
          />
          <ol className="ms-rail mt-8 space-y-0">
            {m.mustKnow.map((tip, i) => (
              <li key={tip} className="relative flex gap-4 py-3.5">
                <span className="ms-editorial relative z-10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ms-ink)] bg-[var(--ms-paper)] text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pt-2 text-[15px] leading-relaxed text-[var(--ms-ink)]/90">
                  {tip}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ms-rise">
          <SectionHead
            id="novedades"
            icon="megaphone"
            kicker={ui.kickerNews}
            title={ui.titleNews}
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {m.news.map((item, i) => (
              <div
                key={item}
                className={`relative overflow-hidden rounded-2xl border border-[var(--ms-line)] bg-white/70 px-4 py-4 ${
                  i % 2 === 0 ? "md:-rotate-1" : "md:rotate-1"
                }`}
              >
                <span
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--ms-olive)" : "var(--ms-terracotta)",
                  }}
                />
                <p className="pl-2 text-[14px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ms-rise">
          <SectionHead
            id="mapa"
            icon="route"
            kicker={ui.kickerMap}
            title={ui.titleMap}
          />
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
            {ui.mapBody(m.venueName)}
          </p>
          <div className="ms-polaroid ms-tilt-l relative mt-6 max-w-3xl">
            <span className="ms-tape ms-tape-olive -top-2 left-10" />
            <span className="ms-tape ms-tape-coral -top-1 right-16" />
            <LandingMap
              markers={mapMarkers}
              className="h-[22rem] w-full md:h-96"
            />
          </div>
        </section>

        <section className="ms-rise">
          <SectionHead
            id="tips"
            icon="camera"
            kicker={ui.kickerTips}
            title={ui.titleTips}
          />
          <ul className="mt-7 grid gap-5 sm:grid-cols-2">
            {m.recommendations.map((r, i) => (
              <li key={r} className="flex gap-3">
                <span className="ms-editorial mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--ms-gold)]/20 text-xs font-bold text-[var(--ms-gold)]">
                  {i + 1}
                </span>
                <p className="text-[14px] leading-relaxed text-[var(--ms-ink)]/90">
                  {r}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          <section className="ms-rise">
            <SectionHead
              id="clima"
              icon="sunrise"
              kicker={ui.kickerWeather}
              title={ui.titleWeather}
            />
            <div className="relative mt-6 rounded-2xl border border-dashed border-[var(--ms-gold)]/50 bg-[var(--ms-gold)]/[0.08] px-5 py-5 md:-rotate-1">
              <p className="text-[15px] font-medium leading-relaxed">
                {m.weather.summary}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ms-muted)]">
                {m.weather.tip}
              </p>
            </div>
          </section>

          <section className="ms-rise">
            <SectionHead
              id="transporte"
              icon="train"
              kicker={ui.kickerTransport}
              title={ui.titleTransport}
            />
            <ol className="mt-6 space-y-4">
              {m.transport.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="relative mt-1 flex flex-col items-center">
                    <span className="size-2.5 rounded-full bg-[var(--ms-olive)] ring-4 ring-[var(--ms-olive)]/15" />
                    {i < m.transport.length - 1 ? (
                      <span className="mt-1 min-h-[1.5rem] w-px flex-1 border-l border-dashed border-[var(--ms-line)]" />
                    ) : null}
                  </span>
                  <p className="pb-1 text-[14px] leading-relaxed">{t}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="ms-rise">
          <SectionHead
            id="faq"
            icon="info"
            kicker={ui.kickerFaq}
            title={ui.titleFaq}
          />
          <div className="mt-7 divide-y divide-[var(--ms-line)] border-y border-[var(--ms-line)]">
            {m.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <span className="mt-0.5 text-[var(--ms-terracotta)] transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[var(--ms-muted)]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="ms-rise">
          <SectionHead
            id="alojar"
            icon="bed"
            kicker={ui.kickerStay}
            title={ui.titleStay}
          />
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
            {ui.stayBody(m.venueName)}
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-1">
            {props.map((prop, idx) => (
              <article
                key={prop.slug}
                className={`relative md:grid md:grid-cols-[280px_1fr] md:items-start md:gap-8 ${
                  idx % 2 === 0 ? "" : "md:grid-cols-[1fr_280px]"
                }`}
              >
                <div
                  className={`ms-polaroid relative ${
                    idx % 2 === 0 ? "ms-tilt-l md:order-1" : "ms-tilt-r md:order-2"
                  }`}
                >
                  <span
                    className={`ms-tape ${
                      idx % 2 === 0 ? "ms-tape-coral" : "ms-tape-olive"
                    } -top-2 left-8`}
                  />
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--ms-ink)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    #{idx + 1}
                  </span>
                  <PhotoStoryCarousel
                    photos={
                      prop.photos.length
                        ? prop.photos
                        : [prop.photo].filter(Boolean)
                    }
                    alt={prop.name}
                    caption={prop.neighborhood}
                    className="h-56 w-full md:h-64"
                  />
                </div>

                <div
                  className={`pt-2 ${idx % 2 === 0 ? "md:order-2" : "md:order-1"}`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
                    <span className="inline-flex items-center gap-1 text-[var(--ms-olive)]">
                      <BrandIcon name="pin" size={14} />
                      {prop.walkingMinutes} {ui.minWalk}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{prop.distanceKm} km</span>
                    <span aria-hidden>·</span>
                    <span>{prop.neighborhood}</span>
                  </div>
                  <h3 className="ms-editorial mt-2 text-2xl leading-snug">
                    {prop.name}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
                    {prop.pitchLocalized}
                  </p>
                  <div className="mt-5">
                    <a
                      href={prop.airbnbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={AIRBNB_BTN}
                    >
                      {ui.ctaAirbnb}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-[var(--ms-line)] bg-[var(--ms-ink)]">
        <div className="mx-auto max-w-5xl px-5 pt-10 text-center">
          <p className="text-sm text-white/55">{ui.footerShare}</p>
          <div className="flex justify-center">
            <MicrositeShareBar {...shareProps} theme="dark" />
          </div>
        </div>
        <PublicSiteFooter note={ui.footerNote} />
      </div>
    </div>
  );
}
