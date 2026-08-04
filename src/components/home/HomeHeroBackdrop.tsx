"use client";

import { useEffect, useState } from "react";
import { mediaSrc } from "@/lib/demand/guide-images";

/** Fondos full-bleed del home: venues y atmósfera de Santiago. */
export const HOME_HERO_BACKDROPS = [
  "/guides/nieve/ski.png",
  "/guides/deportes/estadio-nacional.png",
  "/guides/conciertos/movistar-arena.png",
  "/guides/santiago/centro-historico.jpg",
  "/guides/barrios/barrio-italia.png",
  "/guides/deportes/hockey.png",
  "/guides/nieve/ski-1.png",
  "/guides/conciertos/movistar.png",
] as const;

const INTERVAL_MS = 6500;

type Props = {
  images?: readonly string[];
  intervalMs?: number;
};

export function HomeHeroBackdrop({
  images = HOME_HERO_BACKDROPS,
  intervalMs = INTERVAL_MS,
}: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images, intervalMs]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {images.map((src, i) => {
        const on = i === active;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={mediaSrc(src, 1600)}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
              on ? "opacity-100" : "opacity-0"
            } ${on ? "ms-hero-kenburns" : ""}`}
            style={{ objectPosition: "center 32%" }}
          />
        );
      })}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(22,26,34,0.28) 0%, rgba(22,26,34,0.52) 42%, rgba(22,26,34,0.94) 100%)",
        }}
      />
    </div>
  );
}
