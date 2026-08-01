"use client";

import { useEffect, useState } from "react";

type Props = {
  photos: string[];
  alt: string;
  caption?: string;
  className?: string;
};

/** Carrusel estilo stories: barras de progreso + tap izquierda/derecha. */
export function PhotoStoryCarousel({
  photos,
  alt,
  caption,
  className,
}: Props) {
  const slides = photos.length > 0 ? photos : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides.join("|")]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [slides.length, index]);

  if (slides.length === 0) {
    return <div className={`bg-[#eee] ${className ?? ""}`} />;
  }

  const current = slides[Math.min(index, slides.length - 1)];

  function go(delta: number) {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  }

  return (
    <div
      className={`relative isolate overflow-hidden bg-[#111] ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${current}?im_w=1200`}
        alt={`${alt} — foto ${index + 1} de ${slides.length}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35" />

      {/* Barras tipo stories */}
      <div className="absolute inset-x-0 top-0 z-10 flex gap-1 px-3 pt-3">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35"
          >
            <div
              key={i === index ? `active-${index}` : `seg-${i}`}
              className={`h-full rounded-full bg-white ${
                i < index
                  ? "w-full"
                  : i === index
                    ? "animate-story-fill"
                    : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Zonas de tap */}
      <button
        type="button"
        aria-label="Foto anterior"
        onClick={() => go(-1)}
        className="absolute inset-y-0 left-0 z-10 w-1/3"
      />
      <button
        type="button"
        aria-label="Foto siguiente"
        onClick={() => go(1)}
        className="absolute inset-y-0 right-0 z-10 w-2/3"
      />

      {caption ? (
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
          <p className="text-lg font-semibold text-white drop-shadow">
            {caption}
          </p>
          <p className="mt-0.5 text-xs text-white/80">
            {index + 1} / {slides.length}
          </p>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
          <p className="text-xs font-medium text-white/85">
            {index + 1} / {slides.length} · desliza o toca
          </p>
        </div>
      )}

    </div>
  );
}
