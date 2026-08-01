"use client";

import { useEffect, useState } from "react";

export function MicrositeShareBar({
  title,
  shareText,
  path,
  theme = "dark",
  shareLabel = "Compartir",
  copiedLabel = "Link copiado",
  copyLabel = "Copiar link",
}: {
  title: string;
  shareText: string;
  path: string;
  theme?: "dark" | "light";
  shareLabel?: string;
  copiedLabel?: string;
  copyLabel?: string;
}) {
  const [pageUrl, setPageUrl] = useState(path);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(`${window.location.origin}${path}`);
  }, [path]);

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: pageUrl });
        return;
      } catch {
        /* cancelado */
      }
    }
    await copyLink();
  }

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(`${shareText}\n${pageUrl}`);
  const btn =
    theme === "light"
      ? "rounded-md border border-[var(--ms-line)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--ms-ink)] transition hover:border-[var(--ms-accent)] hover:text-[var(--ms-accent)]"
      : "rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/18";
  const label =
    theme === "light" ? "text-[var(--ms-muted)]" : "text-white/45";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span
        className={`mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${label}`}
      >
        {shareLabel}
      </span>
      <a
        className={btn}
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <a
        className={btn}
        href={`https://twitter.com/intent/tweet?text=${encodedText}`}
        target="_blank"
        rel="noreferrer"
      >
        X
      </a>
      <a
        className={btn}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        Facebook
      </a>
      <button type="button" className={btn} onClick={nativeShare}>
        {shareLabel}
      </button>
      <button type="button" className={btn} onClick={copyLink}>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
