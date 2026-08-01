import type { ReactNode } from "react";
import Link from "next/link";
import { LandingLangSwitch } from "@/components/campaigns/LandingLangSwitch";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { MicrositeShareBar } from "@/components/campaigns/MicrositeShareBar";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import {
  IconBolt,
  IconCalendar,
  IconHelp,
  IconHome,
  IconPin,
  IconSpark,
  IconSun,
  IconTip,
  IconTrain,
  IconWalk,
} from "@/components/campaigns/MicrositeIcons";
import { PublicSiteFooter } from "@/components/site/PublicSiteFooter";
import type { LocalizedMicrosite } from "@/lib/i18n/microsite";

const AIRBNB_BTN =
  "inline-flex items-center justify-center rounded-lg bg-[var(--ms-airbnb)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95";

function IconBadge({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "signal" | "warm" | "ink";
}) {
  const tones = {
    accent: "bg-[var(--ms-accent)] text-white",
    signal: "bg-[var(--ms-accent-2)] text-white",
    warm: "bg-[var(--ms-warm)] text-white",
    ink: "bg-[var(--ms-ink)] text-white",
  };
  return (
    <span
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
    >
      <span className="size-5 [&_svg]:size-5">{children}</span>
    </span>
  );
}

function FlowNode({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "accent" | "signal" | "warm" | "ink";
}) {
  return (
    <div className="ms-node relative flex min-w-0 flex-1 flex-col items-center text-center">
      <IconBadge tone={tone}>{icon}</IconBadge>
      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-muted)]">
        {label}
      </p>
      <p className="mt-1 max-w-[11rem] text-sm font-semibold leading-snug text-[var(--ms-ink)]">
        {value}
      </p>
    </div>
  );
}

function SectionHead({
  id,
  icon,
  kicker,
  title,
  tone = "accent",
}: {
  id: string;
  icon: ReactNode;
  kicker: string;
  title: string;
  tone?: "accent" | "signal" | "warm" | "ink";
}) {
  return (
    <div id={id} className="flex items-start gap-3 scroll-mt-24">
      <IconBadge tone={tone}>{icon}</IconBadge>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
          {kicker}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl leading-tight md:text-[1.75rem]">
          {title}
        </h2>
      </div>
    </div>
  );
}

function ConnectorSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        className="ms-connector ms-connector-live"
        d="M0 20 C120 20 140 8 260 8 S420 32 540 32 660 12 800 20"
      />
      <circle cx="260" cy="8" r="3.5" fill="var(--ms-accent)" opacity="0.7" />
      <circle cx="540" cy="32" r="3.5" fill="var(--ms-accent-2)" opacity="0.7" />
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
    shareLabel: ui.shareLabel,
    copyLabel: ui.copyLabel,
    copiedLabel: ui.copiedLabel,
  };

  return (
    <div lang={locale} className="ms-root min-h-screen">
      <header className="relative overflow-hidden border-b border-[var(--ms-line)]/70">
        <LandingLangSwitch
          basePath={`/g/${slug}`}
          locale={locale}
          theme="light"
        />
        <div className="ms-dotgrid pointer-events-none absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(11,110,79,0.45), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(27,77,137,0.4), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-10 md:pb-14 md:pt-14">
          <div className="ms-rise flex items-center justify-between gap-4 pr-28">
            <Link
              href={`/?lang=${locale}`}
              className="font-[family-name:var(--font-display)] text-lg font-bold tracking-[0.08em] text-[var(--ms-ink)] md:text-xl"
            >
              Bianbi
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ms-muted)]">
              {ui.productLabel}
            </p>
          </div>

          <div className="ms-rise ms-rise-d1 mt-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ms-accent)]">
              {m.interestLabel} · {m.eventDates}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[2rem] leading-[1.1] tracking-tight md:text-5xl">
              {m.guideTitle}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ms-muted)]">
              {m.eventSummary}
            </p>
          </div>

          <div className="ms-rise ms-rise-d2 mt-8 flex flex-wrap gap-2">
            <a
              href="#alojar"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--ms-ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              <IconHome className="size-4" />
              {ui.ctaStay}
            </a>
            <a
              href="#must"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--ms-line)] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[var(--ms-ink)] backdrop-blur transition hover:bg-white"
            >
              {ui.ctaEssentials}
            </a>
          </div>

          <MicrositeShareBar {...shareProps} theme="light" />
        </div>

        <ConnectorSvg className="relative mx-auto block h-8 w-full max-w-4xl px-5 opacity-80" />
      </header>

      <section className="relative mx-auto max-w-4xl px-5 py-10 md:py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ms-muted)]">
              {ui.snapshotKicker}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl md:text-2xl">
              {ui.snapshotTitle}
            </h2>
          </div>
        </div>

        <div className="relative rounded-[1.75rem] border border-[var(--ms-line)]/80 bg-[var(--ms-panel)]/90 px-3 py-7 shadow-[0_20px_50px_-36px_rgba(16,24,32,0.45)] backdrop-blur md:px-6">
          <div className="pointer-events-none absolute inset-x-10 top-[3.15rem] hidden h-px bg-gradient-to-r from-transparent via-[var(--ms-accent)]/35 to-transparent md:block" />
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-2">
            <FlowNode
              icon={<IconCalendar />}
              label={ui.when}
              value={m.eventDates}
              tone="accent"
            />
            <FlowNode
              icon={<IconPin />}
              label={ui.where}
              value={m.venueName}
              tone="signal"
            />
            <FlowNode
              icon={<IconSun />}
              label={ui.weather}
              value={m.weather.summary.replace(/^[^:]+:\s*/, "").slice(0, 48)}
              tone="warm"
            />
            <FlowNode
              icon={<IconWalk />}
              label={ui.nearest}
              value={
                nearest
                  ? `${nearest.neighborhood} · ${nearest.walkingMinutes} ${ui.minWalk}`
                  : ui.nearbyOptions
              }
              tone="ink"
            />
          </div>
        </div>

        <nav className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-[var(--ms-muted)]">
          {nav.map(([id, label], i) => (
            <span key={id} className="inline-flex items-center gap-3">
              {i > 0 ? (
                <span className="text-[var(--ms-line)]" aria-hidden>
                  /
                </span>
              ) : null}
              <a
                href={`#${id}`}
                className="text-[var(--ms-ink)]/80 underline-offset-4 transition hover:text-[var(--ms-accent)] hover:underline"
              >
                {label}
              </a>
            </span>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-4xl space-y-14 px-5 pb-16 md:space-y-16">
        <section className="ms-rise">
          <SectionHead
            id="must"
            icon={<IconBolt />}
            kicker={ui.kickerMust}
            title={ui.titleMust}
          />
          <ol className="ms-rail mt-8 space-y-0 pl-0">
            {m.mustKnow.map((tip, i) => (
              <li key={tip} className="relative flex gap-4 py-3.5 pl-1">
                <span className="relative z-10 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ms-accent)] bg-[var(--ms-paper)] font-[family-name:var(--font-display)] text-sm font-bold text-[var(--ms-accent)]">
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
            icon={<IconSpark />}
            kicker={ui.kickerNews}
            title={ui.titleNews}
            tone="signal"
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {m.news.map((item, i) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-2xl border border-[var(--ms-line)]/70 bg-white/55 px-4 py-4"
              >
                <span
                  className="absolute left-0 top-0 h-full w-1"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--ms-accent)" : "var(--ms-accent-2)",
                  }}
                />
                <p className="pl-2 text-[14px] leading-relaxed text-[var(--ms-ink)]/90">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="ms-rise">
          <SectionHead
            id="mapa"
            icon={<IconPin />}
            kicker={ui.kickerMap}
            title={ui.titleMap}
            tone="signal"
          />
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
            {ui.mapBody(m.venueName)}
          </p>
          <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--ms-line)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[var(--ms-paper)]/40 to-transparent" />
            <LandingMap
              markers={mapMarkers}
              className="h-[22rem] w-full md:h-96"
            />
          </div>
        </section>

        <section className="ms-rise">
          <SectionHead
            id="tips"
            icon={<IconTip />}
            kicker={ui.kickerTips}
            title={ui.titleTips}
            tone="warm"
          />
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {m.recommendations.map((r, i) => (
              <li key={r} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--ms-warm)]/15 font-[family-name:var(--font-display)] text-xs font-bold text-[var(--ms-warm)]">
                  {i + 1}
                </span>
                <p className="text-[14px] leading-relaxed text-[var(--ms-ink)]/90">
                  {r}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          <section className="ms-rise">
            <SectionHead
              id="clima"
              icon={<IconSun />}
              kicker={ui.kickerWeather}
              title={ui.titleWeather}
              tone="warm"
            />
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--ms-warm)]/40 bg-[var(--ms-warm)]/[0.06] px-5 py-5">
              <p className="text-[15px] font-medium leading-relaxed text-[var(--ms-ink)]">
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
              icon={<IconTrain />}
              kicker={ui.kickerTransport}
              title={ui.titleTransport}
              tone="signal"
            />
            <ol className="mt-6 space-y-4">
              {m.transport.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="relative mt-1 flex flex-col items-center">
                    <span className="size-2.5 rounded-full bg-[var(--ms-accent-2)] ring-4 ring-[var(--ms-accent-2)]/15" />
                    {i < m.transport.length - 1 ? (
                      <span className="mt-1 min-h-[1.5rem] w-px flex-1 bg-[var(--ms-line)]" />
                    ) : null}
                  </span>
                  <p className="pb-1 text-[14px] leading-relaxed text-[var(--ms-ink)]/90">
                    {t}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="ms-rise">
          <SectionHead
            id="faq"
            icon={<IconHelp />}
            kicker={ui.kickerFaq}
            title={ui.titleFaq}
            tone="ink"
          />
          <div className="mt-7 divide-y divide-[var(--ms-line)]/80 border-y border-[var(--ms-line)]/80">
            {m.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-[var(--ms-ink)] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <span className="mt-0.5 text-[var(--ms-muted)] transition group-open:rotate-45">
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
            icon={<IconHome />}
            kicker={ui.kickerStay}
            title={ui.titleStay}
            tone="accent"
          />
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ms-muted)]">
            {ui.stayBody(m.venueName)}
          </p>

          <div className="mt-8 space-y-6">
            {props.map((prop, idx) => (
              <article
                key={prop.slug}
                className="overflow-hidden rounded-[1.35rem] border border-[var(--ms-line)] bg-white/70 md:grid md:grid-cols-[260px_1fr]"
              >
                <div className="relative">
                  <PhotoStoryCarousel
                    photos={
                      prop.photos.length
                        ? prop.photos
                        : [prop.photo].filter(Boolean)
                    }
                    alt={prop.name}
                    caption={prop.neighborhood}
                    className="h-56 w-full md:h-full md:min-h-[280px]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--ms-ink)]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    #{idx + 1}
                  </span>
                </div>
                <div className="flex flex-col p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ms-muted)]">
                    <span className="inline-flex items-center gap-1 text-[var(--ms-accent)]">
                      <IconWalk className="size-3.5" />
                      {prop.walkingMinutes} {ui.minWalk}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{prop.distanceKm} km</span>
                    <span aria-hidden>·</span>
                    <span>{prop.neighborhood}</span>
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug">
                    {prop.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ms-muted)]">
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
        <div className="mx-auto max-w-4xl px-5 pt-10 text-center">
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
