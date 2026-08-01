import Link from "next/link";

export function PublicSiteFooter({
  note,
  tone = "dark",
}: {
  note?: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <footer
      className={
        dark
          ? "border-t border-white/10 bg-[#101820] px-5 py-10 text-center text-xs leading-relaxed text-white/40"
          : "border-t border-[var(--ms-line,#b8c8d4)] bg-transparent px-5 py-10 text-center text-xs leading-relaxed text-[var(--ms-muted,#5c6b78)]"
      }
    >
      <p
        className={
          dark
            ? "font-[family-name:var(--font-display)] text-[11px] font-semibold tracking-[0.28em] text-white/30"
            : "font-[family-name:var(--font-display)] text-[11px] font-semibold tracking-[0.28em] text-[var(--ms-ink,#101820)]/35"
        }
      >
        BIANBI
      </p>
      {note ? <p className="mx-auto mt-5 max-w-2xl">{note}</p> : null}
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
    </footer>
  );
}
