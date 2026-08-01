"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  shareText: string;
  path: string;
  slug: string;
  locale: string;
  theme?: "dark" | "light";
  shareLabel?: string;
  copiedLabel?: string;
  copyLabel?: string;
  shareImageLabel?: string;
  downloadImageLabel?: string;
  sharingLabel?: string;
  shareHint?: string;
};

function IconShare({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="18" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.3 13.1 15.6 17.2M15.6 6.8 8.3 10.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.96.52 3.86 1.52 5.54L2 22l4.78-1.55a9.9 9.9 0 0 0 5.26 1.48h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.74 13.98c-.24.68-1.4 1.24-1.93 1.32-.49.07-1.12.1-1.81-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.21-4.97-4.41-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.05.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.2-.14.32-.28.5-.14.17-.3.38-.42.51-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.27.14.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.61-.13.25.09 1.58.75 1.85.88.27.14.45.2.52.31.07.11.07.64-.17 1.32z" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4v11M7.5 11.5 12 16l4.5-4.5M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07L13 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicrositeShareBar({
  title,
  shareText,
  path,
  slug,
  locale,
  theme = "dark",
  shareLabel = "Compartir",
  copiedLabel = "Link copiado",
  copyLabel = "Copiar link",
  shareImageLabel = "Compartir guía",
  downloadImageLabel = "Guardar imagen",
  sharingLabel = "Preparando…",
  shareHint = "Se comparte una mini-infografía + el link",
}: Props) {
  const [pageUrl, setPageUrl] = useState(path);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const cardUrl = `/api/share-card/${encodeURIComponent(slug)}?lang=${locale}&format=story`;

  useEffect(() => {
    setPageUrl(`${window.location.origin}${path}`);
  }, [path]);

  useEffect(() => {
    setPreviewUrl(cardUrl);
  }, [cardUrl]);

  async function fetchCardFile() {
    const res = await fetch(cardUrl);
    if (!res.ok) throw new Error("No se pudo generar la imagen");
    const blob = await res.blob();
    const file = new File([blob], `bianbi-${slug}.png`, { type: "image/png" });
    return { blob, file };
  }

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function shareGuide() {
    setBusy(true);
    try {
      const { file } = await fetchCardFile();
      const text = `${shareText}\n${pageUrl}`;
      const canFiles =
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canFiles) {
        await navigator.share({
          files: [file],
          title,
          text,
          url: pageUrl,
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({ title, text, url: pageUrl });
        return;
      }

      // Desktop fallback: descarga imagen + copia link
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
      await copyLink();
    } catch {
      /* cancelado o error */
    } finally {
      setBusy(false);
    }
  }

  async function downloadImage() {
    setBusy(true);
    try {
      const { file } = await fetchCardFile();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  const light = theme === "light";
  const shell = light
    ? "rounded-2xl border border-[var(--ms-line)] bg-white/75 p-3 backdrop-blur"
    : "rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur";
  const muted = light ? "text-[var(--ms-muted)]" : "text-white/50";
  const ink = light ? "text-[var(--ms-ink)]" : "text-white";
  const circle =
    light
      ? "inline-flex size-11 items-center justify-center rounded-full border border-[var(--ms-line)] bg-[var(--ms-paper)] text-[var(--ms-ink)] transition hover:border-[var(--ms-olive)] hover:text-[var(--ms-olive)] disabled:opacity-50"
      : "inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50";
  const primary =
    "inline-flex items-center gap-2 rounded-full bg-[var(--ms-olive,#7d8b4e)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";

  return (
    <div className={`mt-6 ${shell}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt=""
            className="h-28 w-[63px] shrink-0 rounded-lg border border-black/10 object-cover shadow-sm sm:h-32 sm:w-[72px]"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}
          >
            {shareLabel}
          </p>
          <p className={`mt-1 text-sm ${ink}`}>{shareHint}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={primary}
              onClick={shareGuide}
              disabled={busy}
            >
              <IconShare className="size-4" />
              {busy ? sharingLabel : shareImageLabel}
            </button>

            <button
              type="button"
              className={circle}
              onClick={shareGuide}
              disabled={busy}
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <IconWhatsApp className="size-5" />
            </button>

            <button
              type="button"
              className={circle}
              onClick={downloadImage}
              disabled={busy}
              aria-label={downloadImageLabel}
              title={downloadImageLabel}
            >
              <IconDownload className="size-5" />
            </button>

            <button
              type="button"
              className={circle}
              onClick={copyLink}
              aria-label={copied ? copiedLabel : copyLabel}
              title={copied ? copiedLabel : copyLabel}
            >
              <IconLink className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
