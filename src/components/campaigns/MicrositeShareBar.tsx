"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { buildSharePageUrl } from "@/lib/share/share-url";

type Props = {
  title: string;
  shareText: string;
  path: string;
  slug: string;
  locale: string;
  theme?: "dark" | "light";
  variant?: "inline" | "featured" | "footer";
  shareHeadline?: string;
  shareBody?: string;
  shareHighlights?: string[];
  shareHighlightsTitle?: string;
  shareLabel?: string;
  copiedLabel?: string;
  copyLabel?: string;
  shareImageLabel?: string;
  downloadImageLabel?: string;
  sharingLabel?: string;
  previewTitle?: string;
  previewCloseLabel?: string;
  previewLoadingLabel?: string;
  whatsAppLabel?: string;
  /** CTA centrado al pie del recuadro featured (ej. ir a la guía /g/). */
  guideHref?: string;
  guideLinkLabel?: string;
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

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-25"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function isShareCancelled(err: unknown): boolean {
  return (
    (err instanceof DOMException || err instanceof Error) &&
    err.name === "AbortError"
  );
}

function PreviewModal({
  open,
  onClose,
  title,
  cardBlobUrl,
  loadingPreview,
  error,
  previewLoadingLabel,
  previewCloseLabel,
  previewTitle,
  busy,
  downloading,
  copied,
  shareImageLabel,
  downloadImageLabel,
  copyLabel,
  copiedLabel,
  sharingLabel,
  onShare,
  onDownload,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  cardBlobUrl: string | null;
  loadingPreview: boolean;
  error: string | null;
  previewLoadingLabel: string;
  previewCloseLabel: string;
  previewTitle: string;
  busy: boolean;
  downloading: boolean;
  copied: boolean;
  shareImageLabel: string;
  downloadImageLabel: string;
  copyLabel: string;
  copiedLabel: string;
  sharingLabel: string;
  onShare: () => void;
  onDownload: () => void;
  onCopy: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const primary =
    "inline-flex items-center gap-2 rounded-full bg-[var(--ms-olive,#7d8b4e)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="ms-share-preview fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-preview-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--brand-carbon)]/40 backdrop-blur-[3px]"
        aria-label={previewCloseLabel}
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full max-w-[min(100%,22rem)] flex-col overflow-hidden rounded-2xl border border-[var(--ms-line)] bg-[var(--ms-paper)] shadow-2xl sm:max-w-sm">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--ms-line)] bg-[var(--ms-paper)] px-4 py-3">
          <p
            id="share-preview-title"
            className="text-sm font-semibold text-[var(--ms-ink)]"
          >
            {previewTitle}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-[var(--ms-muted)] transition hover:bg-[var(--ms-line)]/30 hover:text-[var(--ms-ink)]"
          >
            {previewCloseLabel}
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain bg-[var(--ms-panel)] px-3 py-4 sm:px-4">
          {loadingPreview && !cardBlobUrl ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <IconSpinner className="size-8 animate-spin text-[var(--ms-olive)]" />
              <p className="text-sm text-[var(--ms-muted)]">
                {previewLoadingLabel}
              </p>
            </div>
          ) : cardBlobUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cardBlobUrl}
              alt={title}
              className="mx-auto block max-h-[min(calc(100vh-15rem),520px)] w-auto max-w-full rounded-xl object-contain shadow-lg"
            />
          ) : (
            <p className="py-12 text-center text-sm text-[var(--ms-terracotta)]">
              {error ?? previewLoadingLabel}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 border-t border-[var(--ms-line)] bg-[var(--ms-panel)] p-4">
          <button
            type="button"
            className={`${primary} w-full justify-center`}
            disabled={busy || !cardBlobUrl}
            onClick={onShare}
          >
            <IconShare className="size-4" />
            {busy ? sharingLabel : shareImageLabel}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--ms-line)] bg-[var(--ms-paper)] px-3 py-2.5 text-sm font-semibold text-[var(--ms-ink)] transition hover:border-[var(--ms-olive)] disabled:opacity-50"
              disabled={downloading || busy || !cardBlobUrl}
              onClick={onDownload}
            >
              {downloading ? (
                <IconSpinner className="size-4 shrink-0 animate-spin" />
              ) : (
                <IconDownload className="size-4 shrink-0" />
              )}
              <span className="truncate">
                {downloading ? sharingLabel : downloadImageLabel}
              </span>
            </button>
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-sm font-semibold transition ${
                copied
                  ? "border-[var(--ms-olive)] bg-[var(--ms-olive)]/10 text-[var(--ms-olive)]"
                  : "border-[var(--ms-line)] bg-[var(--ms-paper)] text-[var(--ms-ink)] hover:border-[var(--ms-olive)]"
              }`}
              onClick={onCopy}
            >
              {copied ? (
                <IconCheck className="size-4 shrink-0" />
              ) : (
                <IconLink className="size-4 shrink-0" />
              )}
              <span className="truncate">{copied ? copiedLabel : copyLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PreviewPhone({
  cardBlobUrl,
  loadingPreview,
  previewTitle,
  onClick,
}: {
  cardBlobUrl: string | null;
  loadingPreview: boolean;
  previewTitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mx-auto block w-full max-w-[11.5rem] transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-olive)] sm:max-w-[15rem] md:max-w-[17rem]"
      aria-label={previewTitle}
    >
      <div className="rounded-[2rem] border-[6px] border-[var(--ms-ink)] bg-[var(--ms-ink)] p-2 shadow-2xl shadow-[var(--ms-ink)]/20">
        <div className="overflow-hidden rounded-[1.35rem] bg-[var(--ms-paper)]">
          {cardBlobUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cardBlobUrl}
              alt=""
              className="aspect-[9/16] w-full object-cover object-top"
            />
          ) : (
            <div className="flex aspect-[9/16] items-center justify-center bg-[var(--ms-mist)]/30">
              {loadingPreview ? (
                <IconSpinner className="size-8 animate-spin text-[var(--ms-olive)]" />
              ) : (
                <span className="text-xs text-[var(--ms-muted)]">PNG</span>
              )}
            </div>
          )}
        </div>
      </div>
      <span className="mt-3 block text-center text-xs font-semibold text-[var(--ms-olive)] opacity-0 transition group-hover:opacity-100">
        {previewTitle}
      </span>
    </button>
  );
}

export function MicrositeShareBar({
  title,
  shareText,
  path,
  slug,
  locale,
  theme = "dark",
  variant = "inline",
  shareHeadline,
  shareBody,
  shareHighlights = [],
  shareHighlightsTitle,
  shareLabel = "Compartir",
  copiedLabel = "Link copiado",
  copyLabel = "Copiar link",
  shareImageLabel = "Compartir guía",
  downloadImageLabel = "Guardar imagen",
  sharingLabel = "Preparando…",
  previewTitle = "Vista previa",
  previewCloseLabel = "Cerrar",
  previewLoadingLabel = "Generando imagen…",
  whatsAppLabel = "Enviar por WhatsApp",
  guideHref,
  guideLinkLabel,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cardBlobUrl, setCardBlobUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardUrl = `/api/share-card/${encodeURIComponent(slug)}?lang=${locale}&format=story`;

  useEffect(() => {
    return () => {
      if (cardBlobUrl) URL.revokeObjectURL(cardBlobUrl);
    };
  }, [cardBlobUrl]);

  const fetchCardFile = useCallback(async () => {
    const res = await fetch(cardUrl);
    if (!res.ok) throw new Error("No se pudo generar la imagen");
    const blob = await res.blob();
    if (!blob.type.startsWith("image/")) {
      throw new Error("Respuesta inválida del servidor");
    }
    const file = new File([blob], `crambie-${slug}.png`, { type: "image/png" });
    return { blob, file };
  }, [cardUrl, slug]);

  async function ensurePreviewImage() {
    if (cardBlobUrl) return cardBlobUrl;
    setLoadingPreview(true);
    setError(null);
    try {
      const { blob } = await fetchCardFile();
      const url = URL.createObjectURL(blob);
      setCardBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      return url;
    } catch {
      setError("No pudimos generar la mini-infografía. Intenta de nuevo.");
      return null;
    } finally {
      setLoadingPreview(false);
    }
  }

  async function openPreview() {
    setPreviewOpen(true);
    await ensurePreviewImage();
  }

  async function copyLink(medium: "copy" | "whatsapp" | "native" = "copy") {
    const url = buildSharePageUrl(
      window.location.origin,
      path,
      locale,
      medium,
    );
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError("No pudimos copiar el link. Intenta de nuevo.");
    }
  }

  async function shareFromPreview(
    file: File,
    medium: "native" | "whatsapp" = "native",
  ) {
    const url = buildSharePageUrl(
      window.location.origin,
      path,
      locale,
      medium,
    );
    const text = `${shareText}\n${url}`;

    try {
      const canFiles =
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canFiles) {
        await navigator.share({
          files: [file],
          title,
          text,
          url,
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch (err) {
      if (isShareCancelled(err)) return;
      throw err;
    }

    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
    await copyLink(medium);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { blob } = await fetchCardFile();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setCardBlobUrl((prev) => prev ?? url);
      } catch {
        /* thumbnail opcional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchCardFile]);

  async function downloadImage() {
    setDownloading(true);
    setError(null);
    try {
      const { file } = await fetchCardFile();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("No pudimos descargar la imagen. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  }

  async function shareWhatsApp() {
    setBusy(true);
    setError(null);
    try {
      const { file } = await fetchCardFile();
      await shareFromPreview(file, "whatsapp");
    } catch {
      const url = buildSharePageUrl(
        window.location.origin,
        path,
        locale,
        "whatsapp",
      );
      const text = encodeURIComponent(`${shareText}\n${url}`);
      window.open(
        `https://wa.me/?text=${text}`,
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      setBusy(false);
    }
  }

  const light = theme === "light";
  const shell =
    variant === "featured"
      ? "rounded-3xl border border-[var(--ms-line)] bg-gradient-to-br from-white via-[var(--ms-panel)] to-[var(--ms-gold)]/10 p-4 shadow-lg shadow-[var(--ms-ink)]/5 sm:p-5 md:p-8"
      : light
        ? "rounded-2xl border border-[var(--ms-line)] bg-white/75 p-3 backdrop-blur"
        : "rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur";
  const muted = light ? "text-[var(--ms-muted)]" : "text-white/50";
  const circle = light
    ? "inline-flex size-11 items-center justify-center rounded-full border border-[var(--ms-line)] bg-[var(--ms-paper)] text-[var(--ms-ink)] transition hover:border-[var(--ms-olive)] hover:text-[var(--ms-olive)] disabled:opacity-50"
    : "inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50";
  const whatsAppBtn =
    "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/25 transition hover:brightness-105 disabled:opacity-60 sm:w-auto";
  const primary =
    "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ms-olive,#7d8b4e)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto";
  const circleCopied = copied
    ? light
      ? "inline-flex size-11 items-center justify-center rounded-full border-2 border-[var(--ms-olive)] bg-[var(--ms-olive)]/10 text-[var(--ms-olive)] transition"
      : "inline-flex size-11 items-center justify-center rounded-full border-2 border-emerald-300/90 bg-emerald-400/15 text-emerald-200 transition"
    : circle;

  const actionRow = (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : downloading ? sharingLabel : ""}
      </span>
      <button
        type="button"
        className={whatsAppBtn}
        onClick={shareWhatsApp}
        disabled={busy || loadingPreview}
      >
        <IconWhatsApp className="size-5" />
        {busy || loadingPreview ? sharingLabel : whatsAppLabel}
      </button>
      <button
        type="button"
        className={primary}
        onClick={openPreview}
        disabled={busy || loadingPreview}
      >
        <IconShare className="size-4" />
        {busy || loadingPreview ? sharingLabel : shareImageLabel}
      </button>
      <div className="flex gap-2 sm:contents">
        <button
          type="button"
          className={circle}
          onClick={downloadImage}
          disabled={downloading || busy}
          aria-label={downloading ? sharingLabel : downloadImageLabel}
          title={downloading ? sharingLabel : downloadImageLabel}
        >
          {downloading ? (
            <IconSpinner className="size-5 animate-spin" />
          ) : (
            <IconDownload className="size-5" />
          )}
        </button>
        <button
          type="button"
          className={circleCopied}
          onClick={() => copyLink("copy")}
          aria-label={copied ? copiedLabel : copyLabel}
          title={copied ? copiedLabel : copyLabel}
        >
          {copied ? <IconCheck className="size-5" /> : <IconLink className="size-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className={variant === "featured" ? "" : `mt-6 ${shell}`}>
        {variant === "featured" ? (
          <div className={shell}>
            <div className="grid items-center gap-6 sm:gap-8 md:grid-cols-[1.05fr_0.95fr]">
              <div className="min-w-0">
                {shareHeadline ? (
                  <h2 className="ms-editorial text-xl leading-tight text-[var(--ms-ink)] sm:text-2xl md:text-[2rem]">
                    {shareHeadline}
                  </h2>
                ) : null}
                {shareBody ? (
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--ms-muted)]">
                    {shareBody}
                  </p>
                ) : null}
                {shareHighlights.length > 0 ? (
                  <div className="mt-5">
                    {shareHighlightsTitle ? (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                        {shareHighlightsTitle}
                      </p>
                    ) : null}
                    <ul className="mt-3 space-y-2.5">
                      {shareHighlights.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-[14px] leading-snug text-[var(--ms-ink)]/90"
                        >
                          <span
                            className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--ms-olive)]"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-6">{actionRow}</div>
                {error ? (
                  <p className="mt-3 text-sm text-[var(--ms-terracotta,#D96A4B)]">
                    {error}
                  </p>
                ) : null}
                {copied ? (
                  <p className="mt-2 text-xs font-semibold text-[var(--ms-olive)]">
                    {copiedLabel}
                  </p>
                ) : null}
              </div>
              <PreviewPhone
                cardBlobUrl={cardBlobUrl}
                loadingPreview={loadingPreview}
                previewTitle={previewTitle}
                onClick={openPreview}
              />
            </div>
            {guideHref && guideLinkLabel ? (
              <div className="mt-7 flex justify-center border-t border-black/8 pt-6">
                <a
                  href={guideHref}
                  className="inline-flex items-center justify-center rounded-lg bg-[#222222] px-6 py-3.5 text-center text-base font-semibold text-white transition hover:bg-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222]"
                >
                  {guideLinkLabel}
                </a>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={openPreview}
              disabled={loadingPreview}
              className="group relative shrink-0 overflow-hidden rounded-lg border border-black/10 shadow-sm transition hover:ring-2 hover:ring-[var(--ms-olive)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-olive)]"
              aria-label={previewTitle}
            >
              {cardBlobUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cardBlobUrl}
                  alt=""
                  className="h-28 w-[63px] object-contain object-top sm:h-32 sm:w-[72px]"
                />
              ) : (
                <div className="flex h-28 w-[63px] items-center justify-center bg-[var(--ms-mist,#cfc9c0)]/30 sm:h-32 sm:w-[72px]">
                  <span className={`text-[10px] ${muted}`}>
                    {loadingPreview ? "…" : "PNG"}
                  </span>
                </div>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent py-1 text-[9px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                {previewTitle}
              </span>
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}
              >
                {shareLabel}
              </p>
              {error ? (
                <p className="mt-2 text-sm text-[var(--ms-terracotta,#D96A4B)]">
                  {error}
                </p>
              ) : null}
              <div className="mt-3">{actionRow}</div>
              {copied ? (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    light ? "text-[var(--ms-olive)]" : "text-emerald-200"
                  }`}
                >
                  {copiedLabel}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        cardBlobUrl={cardBlobUrl}
        loadingPreview={loadingPreview}
        error={error}
        previewLoadingLabel={previewLoadingLabel}
        previewCloseLabel={previewCloseLabel}
        previewTitle={previewTitle}
        busy={busy}
        downloading={downloading}
        copied={copied}
        shareImageLabel={shareImageLabel}
        downloadImageLabel={downloadImageLabel}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        sharingLabel={sharingLabel}
        onShare={async () => {
          setBusy(true);
          try {
            const { file } = await fetchCardFile();
            await shareFromPreview(file, "native");
          } catch {
            /* sin mensaje: el usuario puede reintentar */
          } finally {
            setBusy(false);
          }
        }}
        onDownload={downloadImage}
        onCopy={() => copyLink("copy")}
      />
    </>
  );
}

/** Barra fija en mobile para compartir sin scroll */
export function MicrositeShareSticky({
  slug,
  locale,
  path,
  shareText,
  title,
  whatsAppLabel = "WhatsApp",
  shareImageLabel = "Compartir",
  sharingLabel = "Preparando…",
}: {
  slug: string;
  locale: string;
  path: string;
  shareText: string;
  title: string;
  whatsAppLabel?: string;
  shareImageLabel?: string;
  sharingLabel?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const cardUrl = `/api/share-card/${encodeURIComponent(slug)}?lang=${locale}&format=story`;

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function shareWhatsApp() {
    setBusy(true);
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const file = new File([blob], `crambie-${slug}.png`, { type: "image/png" });
      const url = buildSharePageUrl(
        window.location.origin,
        path,
        locale,
        "whatsapp",
      );
      const text = `${shareText}\n${url}`;
      if (
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], title, text, url });
        return;
      }
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--ms-line)] bg-[var(--ms-paper)]/95 p-3 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <button
          type="button"
          onClick={shareWhatsApp}
          disabled={busy}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white"
        >
          <IconWhatsApp className="size-5" />
          {busy ? sharingLabel : whatsAppLabel}
        </button>
        <a
          href="#compartir"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--ms-line)] bg-white py-3 text-sm font-semibold text-[var(--ms-ink)]"
        >
          <IconShare className="size-4" />
          {shareImageLabel}
        </a>
      </div>
    </div>
  );
}
