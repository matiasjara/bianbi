"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const rootRef = useRef<HTMLDivElement>(null);

  const focusRoot = useCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

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

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta;
        if (next < 0) return slides.length - 1;
        if (next >= slides.length) return 0;
        return next;
      });
    },
    [slides.length],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (slides.length <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    },
    [go, slides.length],
  );

  if (slides.length === 0) {
    return <div className={`bg-[#eee] ${className ?? ""}`} />;
  }

  const current = slides[Math.min(index, slides.length - 1)];

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
      onKeyDown={onKeyDown}
      className={`relative isolate overflow-hidden bg-[#111] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35 ${className ?? ""}`}
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

      {/* Zonas de tap (sin foco: la navegación por teclado va en el contenedor) */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => {
          go(-1);
          focusRoot();
        }}
        onMouseDown={(e) => e.preventDefault()}
        className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-pointer border-0 bg-transparent p-0 outline-none"
      />
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => {
          go(1);
          focusRoot();
        }}
        onMouseDown={(e) => e.preventDefault()}
        className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-pointer border-0 bg-transparent p-0 outline-none"
      />

      {caption ? (
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
          <p className="text-base font-semibold text-white drop-shadow sm:text-lg">
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
