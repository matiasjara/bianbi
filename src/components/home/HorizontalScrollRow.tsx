"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Distancia en px al pulsar una flecha. */
  step?: number;
};

export function HorizontalScrollRow({
  children,
  className,
  step = 300,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useLayoutEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  function scrollBy(delta: number) {
    ref.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  const scrollable = canLeft || canRight;

  return (
    <div className={`relative ${className ?? ""}`}>
      {scrollable && canLeft ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[var(--ms-paper,#faf8f5)] to-transparent"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => scrollBy(-step)}
            className="absolute left-1 top-1/2 z-[2] inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ms-line)] bg-white/95 text-lg shadow-sm transition hover:border-[var(--ms-olive)] hover:text-[var(--ms-olive)]"
            aria-label="Ver anteriores"
          >
            ‹
          </button>
        </>
      ) : null}

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {scrollable && canRight ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-12 bg-gradient-to-l from-[var(--ms-paper,#faf8f5)] to-transparent"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => scrollBy(step)}
            className="absolute right-1 top-1/2 z-[2] inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ms-line)] bg-white/95 text-lg shadow-sm transition hover:border-[var(--ms-olive)] hover:text-[var(--ms-olive)]"
            aria-label="Ver más"
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  );
}
