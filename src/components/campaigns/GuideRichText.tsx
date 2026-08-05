/** Enlaces http(s) y correos clickeables en copy de guías. */
const LINK_PATTERN =
  /(https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function trimTrailingPunctuation(value: string): string {
  return value.replace(/[.,;:!?)]+$/, "");
}

function linkLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const linkClassName =
  "font-medium text-[var(--ms-ink)] underline underline-offset-2 hover:text-[var(--ms-terracotta)]";

export function GuideRichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(LINK_PATTERN);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const href = trimTrailingPunctuation(part);
          return (
            <a
              key={`${i}-${href}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={linkClassName}
            >
              {linkLabel(href)}
            </a>
          );
        }
        if (EMAIL_PATTERN.test(part)) {
          return (
            <a
              key={`${i}-${part}`}
              href={`mailto:${part}`}
              className={linkClassName}
            >
              {part}
            </a>
          );
        }
        return <span key={`${i}-${part.slice(0, 12)}`}>{part}</span>;
      })}
    </span>
  );
}
