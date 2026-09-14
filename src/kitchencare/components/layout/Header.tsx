"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DEMO_BASE, NAV_LINKS, SITE } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { cn } from "@/kitchencare/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <Link href={DEMO_BASE} className="flex shrink-0 flex-col items-start gap-1">
          <span className="relative block h-8 w-[5.5rem] sm:h-9 sm:w-[6.125rem]">
            <Image
              src="/kitchencare-demo/images/logo-white.png"
              alt={SITE.name}
              fill
              sizes="98px"
              className="object-contain object-left"
              priority
            />
          </span>
          <span className="hidden text-[0.55rem] font-medium uppercase tracking-[0.28em] text-white/40 sm:block">
            Cuidado experto para tu cocina
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="/p/kitchencare/demo/agendar" size="sm" className="hidden sm:inline-flex">
            Agendar servicio
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Menú</span>
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-white/10 bg-black lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto max-w-7xl px-5 py-4 sm:px-6" aria-label="Menú móvil">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-base text-white/75 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button href="/p/kitchencare/demo/agendar" className="w-full">
                Agendar servicio
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
