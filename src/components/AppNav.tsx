"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";

const links = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/demanda", label: "Demanda" },
  { href: "/campanas", label: "Campañas" },
  { href: "/base-datos", label: "Base de datos" },
  { href: "/fuentes", label: "Fuentes" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--line)] bg-[var(--panel)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/propiedades" className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ink)]">
            Bianbi
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
            más noches
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-1.5 transition ${
                  active
                    ? "bg-[var(--accent)] text-[var(--panel)]"
                    : "text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <form action={logoutAction} className="ml-1">
            <button
              type="submit"
              className="rounded-md px-2.5 py-1.5 text-[var(--muted)] transition hover:bg-[var(--panel-2)] hover:text-[var(--ink)]"
            >
              Salir
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
