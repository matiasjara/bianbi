import Link from "next/link";
import { BianbiLogo } from "@/components/brand/BianbiLogo";

export function PublicSiteFooter({
  note,
  tone = "dark",
  showLogin = false,
}: {
  note?: string;
  tone?: "dark" | "light";
  /** Solo el home debe mostrar el acceso privado */
  showLogin?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <footer
      className={
        dark
          ? "border-t border-white/10 bg-[var(--brand-ink,#1c1c1c)] px-5 py-10 text-center text-xs leading-relaxed text-white/40"
          : "border-t border-[var(--ms-line,#cfc9c0)] bg-transparent px-5 py-10 text-center text-xs leading-relaxed text-[var(--ms-muted,#6a6560)]"
      }
    >
      <div className="flex justify-center opacity-95">
        <BianbiLogo
          variant="logo"
          href="/"
          tone={dark ? "onDark" : "onLight"}
        />
      </div>
      {note ? <p className="mx-auto mt-5 max-w-2xl">{note}</p> : null}
      {showLogin ? (
        <p className="mt-6">
          <Link
            href="/login"
            className={
              dark
                ? "text-[10px] tracking-wide text-white/25 transition hover:text-white/45"
                : "text-[10px] tracking-wide text-[var(--ms-muted)]/50 transition hover:text-[var(--ms-muted)]"
            }
          >
            Entrar
          </Link>
        </p>
      ) : null}
    </footer>
  );
}
