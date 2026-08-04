import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import type { LocalizedMicrosite } from "@/lib/i18n/microsite";
import type { Locale } from "@/lib/i18n/locale";
import {
  matchFlagship,
  type FlagshipBrand,
} from "@/lib/demand/flagship-events";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";
import {
  formatVenueMetroSnapshot,
  nearestMetroStations,
} from "@/lib/demand/venue-metro";
import { CRAMBIE_LOGO } from "@/lib/brand/logos";
import { SITE_HOST } from "@/lib/site/url";

export const SHARE_STORY = { width: 1080, height: 1920 } as const;
export const SHARE_OG = { width: 1200, height: 630 } as const;

const PAPER = "#F4F0E8";
const PANEL = "#FAF7F2";
const LINE = "#D9D4CA";
const INK = "#161A22";
const MUTED = "#6B675F";
const OLIVE = "#7B8B3E";
const TERRACOTTA = "#D96A4B";
const TEAL = "#7FB7C5";
const MUSTARD = "#E1B53A";
const CORAL = "#EF7A82";
const MAP_PARK = "#C5D4A8";
const MAP_ROAD = "#E8C89A";

const BRAND_ACCENTS = [OLIVE, TERRACOTTA, TEAL] as const;

const FLEX = { display: "flex" } as const;

function truncate(s: string | undefined | null, n: number) {
  const t = (s ?? "").trim();
  if (!t) return "";
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1).trimEnd()}…`;
}

async function loadGoogleFont(
  family: string,
  weight: 600 | 700,
  style: "normal" | "italic" = "normal",
) {
  const name = family.replace(/ /g, "+");
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${name}:wght@${weight}${style === "italic" ? "&ital=1" : ""}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const match = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  );
  if (!match?.[1]) throw new Error(`Font ${family} ${weight} not found`);
  const data = await fetch(match[1]).then((r) => r.arrayBuffer());
  return { name: family, data, weight, style };
}

let fontsCache: Promise<
  Awaited<ReturnType<typeof loadGoogleFont>>[]
> | null = null;

function getFonts() {
  if (!fontsCache) {
    fontsCache = Promise.all([
      loadGoogleFont("Fraunces", 700),
      loadGoogleFont("Manrope", 600),
      loadGoogleFont("Manrope", 700),
    ]);
  }
  return fontsCache;
}

async function logoDataUri(tone: "onLight" | "onDark" = "onLight") {
  const file = await readFile(
    path.join(process.cwd(), CRAMBIE_LOGO[tone].path),
  );
  return `data:image/png;base64,${file.toString("base64")}`;
}

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

async function publicImageDataUri(relFromPublic: string) {
  const file = await readFile(path.join(process.cwd(), "public", relFromPublic));
  const ext = path.extname(relFromPublic).toLowerCase();
  const mimeFromExt =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";
  // Sniff bytes: algunos assets llegan como .png siendo JPEG (rompe Satori).
  const mime = sniffImageMime(file) ?? mimeFromExt;
  return `data:${mime};base64,${file.toString("base64")}`;
}

function FlagshipStoryCard({
  L,
  logoSrc,
  coverSrc,
  pageLabel,
  copy,
}: {
  L: LocalizedMicrosite;
  logoSrc: string;
  coverSrc: string;
  pageLabel: string;
  copy: FlagshipBrand;
}) {
  const dates = truncate(L.content.eventDates, 36);

  return (
    <div
      style={{
        ...FLEX,
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: INK,
        position: "relative",
      }}
    >
      {/* Hero overlay — foto + gradiente + textos (como /g/) */}
      <div
        style={{
          ...FLEX,
          flexDirection: "column",
          width: "100%",
          height: 1280,
          overflow: "hidden",
          backgroundColor: INK,
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverSrc}
          alt=""
          width={1080}
          height={1280}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1280,
            objectFit: "cover",
            objectPosition: "center 28%",
          }}
        />
        <div
          style={{
            ...FLEX,
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1280,
            backgroundImage:
              "linear-gradient(180deg, rgba(22,26,34,0.28) 0%, rgba(22,26,34,0.52) 40%, rgba(22,26,34,0.96) 100%)",
          }}
        />

        <div
          style={{
            ...FLEX,
            position: "relative",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
            padding: "48px 48px 40px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Crambie"
            width={180}
            height={36}
            style={{ objectFit: "contain", objectPosition: "left" }}
          />

          <div
            style={{
              ...FLEX,
              marginTop: 36,
              alignSelf: "flex-start",
              backgroundColor: TERRACOTTA,
              color: "#FFFFFF",
              fontSize: 18,
              fontFamily: "Manrope",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "12px 18px",
              borderRadius: 8,
            }}
          >
            {copy.badge}
          </div>

          <div
            style={{
              ...FLEX,
              marginTop: 22,
              fontSize: 78,
              fontFamily: "Fraunces",
              fontWeight: 700,
              lineHeight: 0.96,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {copy.title}
          </div>

          <div
            style={{
              ...FLEX,
              marginTop: 20,
              fontSize: 32,
              fontFamily: "Manrope",
              fontWeight: 600,
              lineHeight: 1.28,
              color: "rgba(255,255,255,0.92)",
              maxWidth: 960,
            }}
          >
            {copy.subtitle}
          </div>

          <div
            style={{
              ...FLEX,
              marginTop: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              fontSize: 28,
              fontFamily: "Manrope",
              fontWeight: 700,
            }}
          >
            <span style={{ color: MUSTARD }}>{dates}</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.88)" }}>
              {copy.venueLine}
            </span>
          </div>

          <div
            style={{
              ...FLEX,
              flexDirection: "row",
              width: "100%",
              gap: 12,
              marginTop: 32,
            }}
          >
            {copy.stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  ...FLEX,
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "22px 10px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    ...FLEX,
                    fontSize: 52,
                    fontFamily: "Fraunces",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: MUSTARD,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    ...FLEX,
                    marginTop: 10,
                    fontSize: 15,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.78)",
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pie compacto: tips + estadía */}
      <div
        style={{
          ...FLEX,
          flexDirection: "column",
          flex: 1,
          width: "100%",
          padding: "28px 44px 32px",
          backgroundColor: PAPER,
          gap: 14,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            ...FLEX,
            flexDirection: "column",
            width: "100%",
            gap: 12,
          }}
        >
          {copy.tips.map((tip, i) => (
            <div
              key={tip}
              style={{
                ...FLEX,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                width: "100%",
                padding: "16px 20px",
                backgroundColor: i === 0 ? INK : "#FFFFFF",
                borderRadius: 16,
                border: i === 0 ? "none" : `2px solid ${LINE}`,
              }}
            >
              <div
                style={{
                  ...FLEX,
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  backgroundColor: i === 0 ? TERRACOTTA : OLIVE,
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  ...FLEX,
                  flex: 1,
                  fontSize: 26,
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: i === 0 ? "#FFFFFF" : INK,
                }}
              >
                {tip}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            ...FLEX,
            flexDirection: "column",
            width: "100%",
            padding: "24px 26px",
            backgroundColor: INK,
            borderRadius: 18,
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...FLEX,
              fontSize: 15,
              fontFamily: "Manrope",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(244,240,232,0.65)",
            }}
          >
            {copy.ctaLabel}
          </div>
          <div
            style={{
              ...FLEX,
              fontSize: 32,
              fontFamily: "Fraunces",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFFFFF",
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            {copy.cta}
          </div>
        </div>

        <div
          style={{
            ...FLEX,
            width: "100%",
            justifyContent: "center",
            fontSize: 20,
            fontFamily: "Manrope",
            fontWeight: 600,
            color: MUTED,
          }}
        >
          {pageLabel}
        </div>
      </div>
    </div>
  );
}

function mapLabels(locale: Locale) {
  if (locale === "en") return { event: "Event", stay: "Apt" };
  if (locale === "pt") return { event: "Evento", stay: "Apto" };
  return { event: "Evento", stay: "Alojamiento" };
}

function whereLabel(m: LocalizedMicrosite["content"]) {
  if (m.interest === "nieve") {
    return "Santiago — hub cordillera";
  }
  return m.venueName;
}

function IconCalendar({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke={INK}
        strokeWidth="1.8"
      />
      <path d="M3 9h18M8 3v4M16 3v4" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}

function IconPin({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        stroke={INK}
        strokeWidth="1.8"
      />
      <circle cx="12" cy="11" r="2.2" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}

function IconSun({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.5" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}

function IconBed({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M4 11v6h16v-6M4 17v2M20 17v2M7 11V9"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const GRID_BG = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M28 0H0V28" fill="none" stroke="#D9D4CA" stroke-width="0.55" opacity="0.45"/></svg>',
)}")`;

function shareHeadline(m: LocalizedMicrosite["content"]) {
  return (m.eventTitle || m.guideTitle)
    .replace(/^Guía del (?:concierto|partido|evento):\s*/i, "")
    .replace(/^Guia do (?:show|jogo|evento):\s*/i, "")
    .replace(/^(?:Concert|Match|Event|Travel) guide:\s*/i, "")
    .replace(/^Guía:\s*/i, "")
    .trim();
}

function SnapshotCard({
  label,
  value,
  sub,
  color,
  icon,
  compact,
  story,
  fullWidth,
  tilt = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: ReactElement;
  compact?: boolean;
  story?: boolean;
  fullWidth?: boolean;
  tilt?: number;
}) {
  return (
    <div
      style={{
        ...FLEX,
        flexDirection: "column",
        ...(fullWidth ? { width: "100%" } : { flex: 1 }),
        backgroundColor: story ? "#FFFFFF" : "rgba(250,247,242,0.96)",
        borderRadius: story ? 22 : compact ? 14 : 18,
        border: `1.5px solid ${LINE}`,
        padding: story ? "20px 22px" : compact ? "12px 10px" : "16px 14px",
        minWidth: 0,
        boxShadow: "0 10px 28px rgba(22,26,34,0.07)",
        ...(tilt ? { transform: `rotate(${tilt}deg)` } : {}),
      }}
    >
      <div style={{ ...FLEX, marginBottom: story ? 10 : compact ? 6 : 8 }}>
        {icon}
      </div>
      <div
        style={{
          ...FLEX,
          fontSize: story ? 10 : compact ? 8 : 9,
          fontFamily: "Manrope",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...FLEX,
          marginTop: story ? 6 : compact ? 3 : 5,
          fontSize: story ? 26 : compact ? 17 : 20,
          fontFamily: "Fraunces",
          fontWeight: 700,
          lineHeight: 1.12,
          color,
          overflow: "hidden",
          maxHeight: story ? 88 : compact ? 48 : 68,
        }}
      >
        {value}
      </div>
      {sub ? (
        <div
          style={{
            ...FLEX,
            marginTop: story ? 5 : 3,
            fontSize: story ? 13 : compact ? 10 : 11,
            fontFamily: "Manrope",
            color: MUTED,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

function SnapshotGrid({
  ui,
  m,
  nearest,
  compact,
  variant = "row",
}: {
  ui: LocalizedMicrosite["ui"];
  m: LocalizedMicrosite["content"];
  nearest: LocalizedMicrosite["properties"][number] | undefined;
  compact?: boolean;
  variant?: "row" | "story";
}) {
  const isStory = variant === "story";
  const items = [
    {
      label: ui.when,
      value: truncate(m.eventDates, isStory ? 22 : compact ? 16 : 20),
      color: OLIVE,
      icon: <IconCalendar size={isStory ? 32 : compact ? 24 : 30} />,
      tilt: isStory ? 0 : -1.2,
    },
    {
      label: ui.where,
      value: truncate(whereLabel(m), isStory ? 20 : compact ? 14 : 18),
      color: TERRACOTTA,
      icon: <IconPin size={isStory ? 32 : compact ? 24 : 30} />,
      tilt: isStory ? 0 : 1.1,
    },
    {
      label: ui.weather,
      value: truncate(
        m.weather.summary.replace(/^[^:]+:\s*/, ""),
        isStory ? 42 : compact ? 22 : 28,
      ),
      color: MUSTARD,
      icon: <IconSun size={isStory ? 32 : compact ? 24 : 30} />,
      tilt: isStory ? 0 : -0.8,
    },
    {
      label: ui.nearest,
      value: nearest
        ? `${nearest.walkingMinutes} ${ui.minWalk}`
        : ui.nearbyOptions,
      sub: nearest?.neighborhood,
      color: INK,
      icon: <IconBed size={isStory ? 32 : compact ? 24 : 30} />,
      tilt: isStory ? 0 : 1.3,
    },
  ];

  const cardGrid = isStory ? (
    <div
      style={{
        ...FLEX,
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      <SnapshotCard
        story
        fullWidth
        label={items[0]!.label}
        value={items[0]!.value}
        color={items[0]!.color}
        icon={items[0]!.icon}
      />
      <SnapshotCard
        story
        fullWidth
        label={items[1]!.label}
        value={items[1]!.value}
        color={items[1]!.color}
        icon={items[1]!.icon}
      />
      <div
        style={{
          ...FLEX,
          flexDirection: "row",
          gap: 12,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <SnapshotCard
          story
          label={items[2]!.label}
          value={items[2]!.value}
          color={items[2]!.color}
          icon={items[2]!.icon}
        />
        <SnapshotCard
          story
          label={items[3]!.label}
          value={items[3]!.value}
          sub={items[3]!.sub}
          color={items[3]!.color}
          icon={items[3]!.icon}
        />
      </div>
    </div>
  ) : (
    <div
      style={{
        ...FLEX,
        flexDirection: "row",
        gap: compact ? 8 : 12,
        width: "100%",
        alignItems: "stretch",
      }}
    >
      {items.map((item) => (
        <SnapshotCard
          key={item.label}
          compact={compact}
          label={item.label}
          value={item.value}
          sub={"sub" in item ? item.sub : undefined}
          color={item.color}
          icon={item.icon}
          tilt={item.tilt}
        />
      ))}
    </div>
  );

  return (
    <div style={{ ...FLEX, flexDirection: "column", width: "100%" }}>
      {!isStory ? (
        <div
          style={{
            ...FLEX,
            flexDirection: "column",
            marginBottom: compact ? 12 : 18,
          }}
        >
          <div
            style={{
              ...FLEX,
              fontSize: compact ? 8 : 10,
              fontFamily: "Manrope",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {ui.snapshotKicker}
          </div>
          <div
            style={{
              ...FLEX,
              marginTop: 4,
              fontSize: compact ? 24 : 34,
              fontFamily: "Fraunces",
              fontWeight: 700,
              lineHeight: 1.08,
              color: INK,
            }}
          >
            {ui.snapshotTitle}
          </div>
        </div>
      ) : null}

      {cardGrid}
    </div>
  );
}

function MapPin({
  x,
  y,
  label,
  bg,
}: {
  x: number;
  y: number;
  label: string;
  bg: string;
}) {
  return (
    <div
      style={{
        ...FLEX,
        position: "absolute",
        left: x,
        top: y,
        flexDirection: "column",
        alignItems: "center",
        transform: "translate(-50%, -100%)",
      }}
    >
      <div
        style={{
          ...FLEX,
          backgroundColor: bg,
          color: "#FFFFFF",
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: label.length > 6 ? 13 : 15,
          padding: label.length > 6 ? "7px 10px" : "8px 14px",
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(22,26,34,0.18)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...FLEX,
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: `9px solid ${bg}`,
          marginTop: -1,
        }}
      />
    </div>
  );
}

function layoutMapPins(
  points: Array<{ lat: number; lng: number; label: string; bg: string }>,
  w: number,
  h: number,
  inset: number,
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  },
) {
  const toXY = (lat: number, lng: number) => ({
    x:
      inset +
      ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) *
        (w - inset * 2),
    y:
      inset +
      ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat || 1)) *
        (h - inset * 2),
  });

  const placed = points.map((p) => ({ ...p, ...toXY(p.lat, p.lng) }));
  const minDist = 78;
  const maxX = w - inset;
  const maxY = h - inset;
  const minX = inset;
  const minY = inset + 28;

  for (let i = 0; i < placed.length; i++) {
    for (let j = 0; j < i; j++) {
      const dx = placed[i].x - placed[j].x;
      const dy = placed[i].y - placed[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist >= minDist) continue;

      const angle = dist > 0.1 ? Math.atan2(dy, dx) : -Math.PI / 2 - i * 0.7;
      placed[i].x = placed[j].x + Math.cos(angle) * minDist;
      placed[i].y = placed[j].y + Math.sin(angle) * minDist;
    }

    placed[i].x = Math.min(maxX, Math.max(minX, placed[i].x));
    placed[i].y = Math.min(maxY, Math.max(minY, placed[i].y));
  }

  return placed;
}

function StoryFactStrip({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      style={{
        ...FLEX,
        flexDirection: "column",
        width: "100%",
        padding: "22px 24px",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        border: `2px solid ${LINE}`,
        borderLeft: `7px solid ${accent}`,
        boxShadow: "0 8px 24px rgba(22,26,34,0.06)",
      }}
    >
      <div
        style={{
          ...FLEX,
          fontSize: 15,
          fontFamily: "Manrope",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...FLEX,
          marginTop: 8,
          fontSize: 34,
          fontFamily: "Fraunces",
          fontWeight: 700,
          lineHeight: 1.1,
          color: INK,
        }}
      >
        {value}
      </div>
      {sub ? (
        <div
          style={{
            ...FLEX,
            marginTop: 6,
            fontSize: 22,
            fontFamily: "Manrope",
            fontWeight: 600,
            lineHeight: 1.28,
            color: MUTED,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

function StoryTipBanner({ index, text }: { index: number; text: string }) {
  const accent = BRAND_ACCENTS[index % BRAND_ACCENTS.length]!;
  return (
    <div
      style={{
        ...FLEX,
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
        width: "100%",
        padding: "20px 24px",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        border: `2px solid ${LINE}`,
        boxShadow: "0 6px 18px rgba(22,26,34,0.05)",
      }}
    >
      <div
        style={{
          ...FLEX,
          width: 48,
          height: 48,
          borderRadius: 999,
          backgroundColor: accent,
          color: "#FFFFFF",
          fontSize: 22,
          fontFamily: "Manrope",
          fontWeight: 700,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          ...FLEX,
          fontSize: 28,
          fontFamily: "Manrope",
          fontWeight: 700,
          lineHeight: 1.28,
          color: INK,
          flex: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function ReferentialMap({
  venueLat,
  venueLng,
  properties,
  locale,
  width,
  height,
}: {
  venueLat: number;
  venueLng: number;
  properties: LocalizedMicrosite["properties"];
  locale: Locale;
  width: number;
  height: number;
}) {
  const labels = mapLabels(locale);
  const stays = uniquePropertyLocations(properties);
  const points = [
    { lat: venueLat, lng: venueLng, label: labels.event, bg: INK },
    ...stays.map((p, i) => ({
      lat: p.lat,
      lng: p.lng,
      label: stays.length > 1 ? `${labels.stay} ${i + 1}` : labels.stay,
      bg: CORAL,
    })),
  ];

  const pad = 0.004;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;

  const w = width;
  const h = height;
  const inset = Math.round(Math.min(w, h) * 0.1);

  return (
    <div
      style={{
        ...FLEX,
        position: "relative",
        width: "100%",
        height,
        borderRadius: 24,
        border: `1px solid ${LINE}`,
        backgroundColor: "#F3EBDD",
        overflow: "hidden",
      }}
    >
      {/* parque referencial */}
      <div
        style={{
          ...FLEX,
          position: "absolute",
          left: "18%",
          top: "22%",
          width: "38%",
          height: "42%",
          borderRadius: 999,
          backgroundColor: MAP_PARK,
          opacity: 0.85,
        }}
      />
      {/* calles */}
      <div
        style={{
          ...FLEX,
          position: "absolute",
          left: "-5%",
          top: "48%",
          width: "110%",
          height: 22,
          borderRadius: 999,
          backgroundColor: MAP_ROAD,
          transform: "rotate(-8deg)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          ...FLEX,
          position: "absolute",
          left: "34%",
          top: "-8%",
          width: 20,
          height: "116%",
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.55)",
        }}
      />
      <div
        style={{
          ...FLEX,
          position: "absolute",
          left: "62%",
          top: "10%",
          width: 16,
          height: "80%",
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.4)",
        }}
      />

      {layoutMapPins(points, w, h, inset, {
        minLat,
        maxLat,
        minLng,
        maxLng,
      }).map((p, i) => (
        <MapPin key={i} x={p.x} y={p.y} label={p.label} bg={p.bg} />
      ))}
    </div>
  );
}

export async function renderShareCard(
  L: LocalizedMicrosite,
  opts: { format: "story" | "og"; pagePath: string },
) {
  const size = opts.format === "og" ? SHARE_OG : SHARE_STORY;
  const m = L.content;
  const ui = L.ui;
  const nearest = L.properties[0];
  const isStory = opts.format === "story";
  const flagship = matchFlagship(m.eventTitle);
  const isFlagshipStory = Boolean(isStory && flagship);
  const logoSrc = await logoDataUri(
    isFlagshipStory || isStory ? "onDark" : "onLight",
  );
  const flagshipCover =
    isFlagshipStory && flagship
      ? await publicImageDataUri(flagship.coverRel)
      : null;
  const fonts = await getFonts();
  const pageLabel = SITE_HOST;
  const storyMapHeight = 360;
  const venueMetros =
    m.interest === "concierto"
      ? nearestMetroStations(m.venueLat, m.venueLng)
      : [];
  const eventLine = truncate(
    m.interest === "nieve"
      ? `${m.interestLabel} · Santiago hub cordillera`
      : `${m.interestLabel} · ${m.venueName}`,
    isStory ? 44 : 36,
  );

  const headline = shareHeadline(m);
  const heroMeta = `${truncate(m.eventDates, 28)} · ${truncate(whereLabel(m), 28)}`;

  if (isFlagshipStory && flagship && flagshipCover) {
    return new ImageResponse(
      <FlagshipStoryCard
        L={L}
        logoSrc={logoSrc}
        coverSrc={flagshipCover}
        pageLabel={pageLabel}
        copy={flagship.brand(L.locale)}
      />,
      {
        ...size,
        fonts,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          ...FLEX,
          width: "100%",
          height: "100%",
          flexDirection: "column",
          backgroundColor: PAPER,
          backgroundImage: GRID_BG,
          backgroundSize: "28px 28px",
          color: INK,
          fontFamily: "Manrope",
          position: "relative",
        }}
      >
        {!isStory ? (
          <div
            style={{
              ...FLEX,
              position: "absolute",
              top: 28,
              right: -56,
              width: 280,
              height: 88,
              backgroundColor: TEAL,
              opacity: 0.18,
              borderRadius: 999,
              transform: "rotate(-8deg)",
            }}
          />
        ) : null}
        {!isStory ? (
          <div
            style={{
              ...FLEX,
              position: "absolute",
              bottom: 420,
              left: -48,
              width: 180,
              height: 180,
              backgroundColor: CORAL,
              opacity: 0.1,
              borderRadius: 999,
            }}
          />
        ) : null}

        {isStory ? (
          <div
            style={{
              ...FLEX,
              flexDirection: "column",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Hero editorial — tipografía pensada para portrait móvil */}
            <div
              style={{
                ...FLEX,
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                padding: "52px 52px 44px",
                backgroundColor: INK,
                backgroundImage:
                  "linear-gradient(155deg, rgba(217,106,75,0.28) 0%, rgba(22,26,34,0) 48%), linear-gradient(225deg, rgba(123,139,62,0.22) 0%, rgba(22,26,34,0) 52%)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="Crambie"
                width={200}
                height={40}
                style={{ objectFit: "contain" }}
              />
              <div
                style={{
                  ...FLEX,
                  marginTop: 28,
                  backgroundColor: TERRACOTTA,
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "12px 20px",
                  borderRadius: 10,
                }}
              >
                {truncate(m.interestLabel, 22)}
              </div>
              <div
                style={{
                  ...FLEX,
                  marginTop: 24,
                  fontSize: 64,
                  fontFamily: "Fraunces",
                  fontWeight: 700,
                  lineHeight: 1.02,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  maxWidth: 960,
                }}
              >
                {truncate(headline, 52)}
              </div>
              <div
                style={{
                  ...FLEX,
                  marginTop: 18,
                  fontSize: 28,
                  fontWeight: 700,
                  color: MUSTARD,
                }}
              >
                {heroMeta}
              </div>
            </div>

            <div
              style={{
                ...FLEX,
                flexDirection: "column",
                flex: 1,
                gap: 16,
                padding: "32px 48px 40px",
                backgroundColor: PAPER,
              }}
            >
              <div
                style={{
                  ...FLEX,
                  flexDirection: "row",
                  gap: 14,
                  width: "100%",
                  alignItems: "stretch",
                }}
              >
                <StoryFactStrip
                  label={ui.weather}
                  value={truncate(
                    m.weather.summary.replace(/^[^:]+:\s*/, ""),
                    28,
                  )}
                  sub={truncate(m.weather.tip, 42)}
                  accent={MUSTARD}
                />
                <StoryFactStrip
                  label={ui.nearest}
                  value={
                    nearest
                      ? `${nearest.walkingMinutes} ${ui.minWalk}`
                      : ui.nearbyOptions
                  }
                  sub={nearest?.neighborhood}
                  accent={OLIVE}
                />
              </div>

              {m.interest === "concierto" && venueMetros.length ? (
                <StoryFactStrip
                  label={ui.titleTransport}
                  value={formatVenueMetroSnapshot(venueMetros, L.locale)}
                  accent={TEAL}
                />
              ) : null}

              {m.mustKnow.length > 0 ? (
                <div
                  style={{
                    ...FLEX,
                    flexDirection: "column",
                    gap: 14,
                    width: "100%",
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      ...FLEX,
                      fontSize: 36,
                      fontFamily: "Fraunces",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: INK,
                    }}
                  >
                    {ui.titleMust}
                  </div>
                  {m.mustKnow.slice(0, 3).map((tip, i) => (
                    <StoryTipBanner
                      key={tip}
                      index={i}
                      text={truncate(tip, 72)}
                    />
                  ))}
                </div>
              ) : null}

              <div
                style={{
                  ...FLEX,
                  marginTop: 4,
                  width: "100%",
                  height: storyMapHeight,
                  borderRadius: 20,
                  overflow: "hidden",
                  border: `2px solid ${LINE}`,
                  boxShadow: "0 10px 28px rgba(22,26,34,0.08)",
                }}
              >
                <ReferentialMap
                  venueLat={m.venueLat}
                  venueLng={m.venueLng}
                  properties={L.properties}
                  locale={L.locale}
                  width={984}
                  height={storyMapHeight}
                />
              </div>

              <div
                style={{
                  ...FLEX,
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    ...FLEX,
                    backgroundColor: OLIVE,
                    color: "#FFFFFF",
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    padding: "20px 40px",
                    borderRadius: 16,
                    boxShadow: "0 8px 24px rgba(22,26,34,0.12)",
                  }}
                >
                  {ui.ctaStay}
                </div>
                <div
                  style={{
                    ...FLEX,
                    fontSize: 24,
                    fontWeight: 600,
                    color: MUTED,
                  }}
                >
                  {pageLabel}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              ...FLEX,
              flex: 1,
              flexDirection: "row",
              padding: "36px 40px",
              gap: 28,
            }}
          >
            <div
              style={{
                ...FLEX,
                flexDirection: "column",
                flex: 1,
                minWidth: 0,
                justifyContent: "space-between",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="Crambie"
                width={200}
                height={40}
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
              <SnapshotGrid ui={ui} m={m} nearest={nearest} compact />
              <div
                style={{
                  ...FLEX,
                  fontSize: 12,
                  fontWeight: 600,
                  color: TERRACOTTA,
                }}
              >
                {eventLine}
              </div>
            </div>
            <div style={{ ...FLEX, width: 420, flexShrink: 0 }}>
              <ReferentialMap
                venueLat={m.venueLat}
                venueLng={m.venueLng}
                properties={L.properties}
                locale={L.locale}
                width={420}
                height={520}
              />
            </div>
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
