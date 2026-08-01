"use client";

import { useEffect, useState } from "react";

export function MicrositeShareBar({
  title,
  shareText,
  path,
}: {
  title: string;
  shareText: string;
  path: string;
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
    "rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-medium text-white/90 transition hover:bg-white/20";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs uppercase tracking-[0.14em] text-white/50">
        Compartir
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
        Compartir
      </button>
      <button type="button" className={btn} onClick={copyLink}>
        {copied ? "Link copiado" : "Copiar link"}
      </button>
    </div>
  );
}
