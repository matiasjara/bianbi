import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import type { LocalizedMicrosite } from "@/lib/i18n/microsite";
import type { Locale } from "@/lib/i18n/locale";
import { uniquePropertyLocations } from "@/lib/demand/property-groups";

export const SHARE_STORY = { width: 1080, height: 1920 } as const;
export const SHARE_OG = { width: 1200, height: 630 } as const;

const PAPER = "#F4F0E8";
const PANEL = "#FAF7F2";
const LINE = "#E8E2D8";
const INK = "#161A22";
const MUTED = "#6B675F";
const OLIVE = "#7B8B3E";
const TERRACOTTA = "#D96A4B";
const TEAL = "#7FB7C5";
const MUSTARD = "#E1B53A";
const CORAL = "#EF7A82";
const MAP_PARK = "#C5D4A8";
const MAP_ROAD = "#E8C89A";

const FLEX = { display: "flex" } as const;

function truncate(s: string, n: number) {
  const t = s.trim();
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

async function logoDataUri() {
  const file = await readFile(
    path.join(process.cwd(), "public/brand/logo-dark.png"),
  );
  return `data:image/png;base64,${file.toString("base64")}`;
}

function mapLabels(locale: Locale) {
  if (locale === "en") return { event: "Event", stay: "Apt" };
  if (locale === "pt") return { event: "Evento", stay: "Apto" };
  return { event: "Evento", stay: "Depto" };
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

function SnapshotCard({
  label,
  value,
  sub,
  color,
  icon,
  compact,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: ReactElement;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        ...FLEX,
        flexDirection: "column",
        flex: 1,
        backgroundColor: PANEL,
        borderRadius: compact ? 16 : 20,
        border: `1px solid ${LINE}`,
        padding: compact ? "14px 14px" : "18px 18px",
        minWidth: 0,
      }}
    >
      <div style={{ ...FLEX, marginBottom: compact ? 8 : 10 }}>{icon}</div>
      <div
        style={{
          ...FLEX,
          fontSize: compact ? 9 : 10,
          fontFamily: "Manrope",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...FLEX,
          marginTop: compact ? 4 : 6,
          fontSize: compact ? 22 : 28,
          fontFamily: "Fraunces",
          fontWeight: 700,
          lineHeight: 1.15,
          color,
        }}
      >
        {value}
      </div>
      {sub ? (
        <div
          style={{
            ...FLEX,
            marginTop: 4,
            fontSize: compact ? 12 : 14,
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
          fontSize: 15,
          padding: "8px 14px",
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
    ...stays.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      label: labels.stay,
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

  const toXY = (lat: number, lng: number) => ({
    x:
      inset +
      ((lng - minLng) / (maxLng - minLng || 1)) * (w - inset * 2),
    y:
      inset +
      ((maxLat - lat) / (maxLat - minLat || 1)) * (h - inset * 2),
  });

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

      {points.map((p, i) => {
        const { x, y } = toXY(p.lat, p.lng);
        return (
          <MapPin key={i} x={x} y={y} label={p.label} bg={p.bg} />
        );
      })}
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
  const logoSrc = await logoDataUri();
  const fonts = await getFonts();
  const tip = truncate(m.mustKnow[0] ?? "", isStory ? 88 : 64);
  const weatherShort = truncate(
    m.weather.summary.replace(/^[^:]+:\s*/, ""),
    isStory ? 42 : 32,
  );

  const snapshotRow = (compact: boolean) => (
    <div
      style={{
        ...FLEX,
        flexDirection: "row",
        gap: compact ? 10 : 14,
        width: "100%",
      }}
    >
      <SnapshotCard
        compact={compact}
        label={ui.when}
        value={truncate(m.eventDates, compact ? 28 : 36)}
        color={OLIVE}
        icon={<IconCalendar size={compact ? 22 : 28} />}
      />
      <SnapshotCard
        compact={compact}
        label={ui.where}
        value={truncate(whereLabel(m), compact ? 22 : 30)}
        color={TERRACOTTA}
        icon={<IconPin size={compact ? 22 : 28} />}
      />
    </div>
  );

  const snapshotRow2 = (compact: boolean) => (
    <div
      style={{
        ...FLEX,
        flexDirection: "row",
        gap: compact ? 10 : 14,
        width: "100%",
        marginTop: compact ? 10 : 14,
      }}
    >
      <SnapshotCard
        compact={compact}
        label={ui.weather}
        value={weatherShort}
        color={MUSTARD}
        icon={<IconSun size={compact ? 22 : 28} />}
      />
      <SnapshotCard
        compact={compact}
        label={ui.nearest}
        value={
          nearest
            ? `${nearest.walkingMinutes} ${ui.minWalk}`
            : ui.nearbyOptions
        }
        sub={nearest?.neighborhood}
        color={INK}
        icon={<IconBed size={compact ? 22 : 28} />}
      />
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          ...FLEX,
          width: "100%",
          height: "100%",
          flexDirection: "column",
          backgroundColor: PAPER,
          color: INK,
          fontFamily: "Manrope",
          position: "relative",
        }}
      >
        <div
          style={{
            ...FLEX,
            position: "absolute",
            top: 32,
            right: -48,
            width: 260,
            height: 80,
            backgroundColor: TEAL,
            opacity: 0.2,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            ...FLEX,
            position: "absolute",
            bottom: isStory ? 180 : 24,
            left: -40,
            width: 160,
            height: 160,
            backgroundColor: TERRACOTTA,
            opacity: 0.1,
            borderRadius: 999,
          }}
        />

        {isStory ? (
          <div
            style={{
              ...FLEX,
              flexDirection: "column",
              flex: 1,
              padding: "56px 52px 48px",
            }}
          >
            <div style={{ ...FLEX, flexDirection: "column", gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="Bianbi"
                width={300}
                height={60}
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
              <div
                style={{
                  ...FLEX,
                  fontSize: 14,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                {ui.productLabel}
              </div>
            </div>

            <div
              style={{
                ...FLEX,
                marginTop: 28,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: TERRACOTTA,
              }}
            >
              {m.interestLabel} · {truncate(m.eventDates, 28)}
            </div>

            <div
              style={{
                ...FLEX,
                marginTop: 12,
                fontSize: 52,
                fontFamily: "Fraunces",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                maxWidth: 960,
              }}
            >
              {truncate(m.guideTitle, 64)}
            </div>

            <div style={{ ...FLEX, marginTop: 28, flexDirection: "column" }}>
              {snapshotRow(false)}
              {snapshotRow2(false)}
            </div>

            <div style={{ ...FLEX, marginTop: 22, width: "100%" }}>
              <ReferentialMap
                venueLat={m.venueLat}
                venueLng={m.venueLng}
                properties={L.properties}
                locale={L.locale}
                width={976}
                height={340}
              />
            </div>

            {tip ? (
              <div
                style={{
                  ...FLEX,
                  marginTop: 18,
                  padding: "14px 18px",
                  borderRadius: 16,
                  border: `1px solid ${LINE}`,
                  backgroundColor: "rgba(255,255,255,0.55)",
                  fontSize: 20,
                  lineHeight: 1.35,
                  color: INK,
                }}
              >
                {tip}
              </div>
            ) : null}

            <div
              style={{
                ...FLEX,
                marginTop: "auto",
                paddingTop: 24,
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  ...FLEX,
                  backgroundColor: MUSTARD,
                  color: INK,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "10px 18px",
                  borderRadius: 999,
                }}
              >
                {ui.ctaStay}
              </div>
              <div
                style={{
                  ...FLEX,
                  fontSize: 18,
                  color: MUTED,
                }}
              >
                bianbi.cl{opts.pagePath}
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
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="Bianbi"
                width={220}
                height={44}
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
              <div
                style={{
                  ...FLEX,
                  marginTop: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: TERRACOTTA,
                }}
              >
                {m.interestLabel}
              </div>
              <div
                style={{
                  ...FLEX,
                  marginTop: 8,
                  fontSize: 34,
                  fontFamily: "Fraunces",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {truncate(m.guideTitle, 48)}
              </div>
              <div style={{ ...FLEX, marginTop: 16, flexDirection: "column" }}>
                {snapshotRow(true)}
                {snapshotRow2(true)}
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
