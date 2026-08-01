import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { LocalizedMicrosite } from "@/lib/i18n/microsite";

export const SHARE_STORY = { width: 1080, height: 1920 } as const;
export const SHARE_OG = { width: 1200, height: 630 } as const;

/** Paleta oficial manual Bianbi */
const PAPER = "#F4F0E8";
const INK = "#161A22";
const MUTED = "#6B675F";
const OLIVE = "#7B8B3E";
const TERRACOTTA = "#D96A4B";
const TEAL = "#7FB7C5";
const MUSTARD = "#E1B53A";

const FLEX = { display: "flex" } as const;

function truncate(s: string, n: number) {
  const t = s.trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1).trimEnd()}…`;
}

async function logoDataUri() {
  const file = await readFile(
    path.join(process.cwd(), "public/brand/logo-dark.png"),
  );
  return `data:image/png;base64,${file.toString("base64")}`;
}

export async function renderShareCard(
  L: LocalizedMicrosite,
  opts: { format: "story" | "og"; pagePath: string },
) {
  const size = opts.format === "og" ? SHARE_OG : SHARE_STORY;
  const m = L.content;
  const ui = L.ui;
  const nearest = L.properties[0];
  const tips = m.mustKnow.slice(0, opts.format === "og" ? 2 : 4);
  const isStory = opts.format === "story";
  const logoSrc = await logoDataUri();

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
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* acentos decorativos */}
        <div
          style={{
            ...FLEX,
            position: "absolute",
            top: 40,
            right: -40,
            width: 280,
            height: 90,
            backgroundColor: TEAL,
            opacity: 0.22,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            ...FLEX,
            position: "absolute",
            bottom: isStory ? 220 : 40,
            left: -50,
            width: 180,
            height: 180,
            backgroundColor: TERRACOTTA,
            opacity: 0.12,
            borderRadius: 999,
          }}
        />

        <div
          style={{
            ...FLEX,
            flexDirection: "column",
            flex: 1,
            padding: isStory ? "72px 64px" : "48px 56px",
          }}
        >
          <div
            style={{
              ...FLEX,
              flexDirection: "column",
              gap: 10,
              marginBottom: isStory ? 36 : 20,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Bianbi"
              width={isStory ? 360 : 280}
              height={isStory ? 72 : 56}
              style={{ objectFit: "contain", objectPosition: "left" }}
            />
            <div
              style={{
                ...FLEX,
                fontSize: 18,
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
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: TERRACOTTA,
              marginBottom: 16,
            }}
          >
            {m.interestLabel} · {m.eventDates}
          </div>

          <div
            style={{
              ...FLEX,
              fontSize: isStory ? 64 : 48,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: 20,
              maxWidth: isStory ? 920 : 1000,
            }}
          >
            {truncate(m.guideTitle, isStory ? 72 : 64)}
          </div>

          <div
            style={{
              ...FLEX,
              alignItems: "center",
              gap: 10,
              fontSize: isStory ? 30 : 26,
              color: MUTED,
              marginBottom: isStory ? 40 : 24,
            }}
          >
            <span style={{ color: OLIVE, fontWeight: 700 }}>●</span>
            <span>{m.venueName}</span>
          </div>

          <div
            style={{
              ...FLEX,
              flexDirection: "column",
              gap: isStory ? 18 : 12,
              flex: 1,
            }}
          >
            {tips.map((tip, i) => (
              <div
                key={tip}
                style={{
                  ...FLEX,
                  gap: 16,
                  alignItems: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.55)",
                  borderRadius: 18,
                  padding: isStory ? "18px 20px" : "12px 16px",
                  border: "1px solid rgba(28,28,28,0.08)",
                }}
              >
                <div
                  style={{
                    ...FLEX,
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: `2px solid ${INK}`,
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    ...FLEX,
                    fontSize: isStory ? 28 : 22,
                    lineHeight: 1.3,
                    paddingTop: 4,
                    flex: 1,
                  }}
                >
                  {truncate(tip, isStory ? 90 : 70)}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              ...FLEX,
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: isStory ? 36 : 20,
              gap: 24,
            }}
          >
            <div
              style={{
                ...FLEX,
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  ...FLEX,
                  fontSize: 18,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                {ui.nearest}
              </div>
              <div
                style={{
                  ...FLEX,
                  fontSize: isStory ? 44 : 36,
                  fontWeight: 800,
                  color: OLIVE,
                }}
              >
                {nearest
                  ? `${nearest.walkingMinutes} ${ui.minWalk}`
                  : ui.nearbyOptions}
              </div>
              {nearest ? (
                <div style={{ ...FLEX, fontSize: 22, color: MUTED }}>
                  {nearest.neighborhood}
                </div>
              ) : null}
            </div>

            <div
              style={{
                ...FLEX,
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              <div
                style={{
                  ...FLEX,
                  backgroundColor: MUSTARD,
                  color: INK,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "10px 16px",
                  borderRadius: 999,
                }}
              >
                {ui.ctaStay}
              </div>
              <div
                style={{
                  ...FLEX,
                  fontSize: 20,
                  color: MUTED,
                  maxWidth: 420,
                  textAlign: "right",
                }}
              >
                bianbi.cl{opts.pagePath}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
