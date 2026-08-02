import Image from "next/image";
import Link from "next/link";

type Props = {
  /** logo = wordmark completo; mark = isotipo pin */
  variant?: "logo" | "mark";
  href?: string | null;
  className?: string;
  /**
   * onLight — fondos crema / claros
   * onDark — fondos carbón / oscuros sólidos (footer)
   */
  tone?: "onLight" | "onDark";
  priority?: boolean;
};

const ASSETS = {
  logo: {
    onLight: { src: "/brand/logo-dark.png", w: 1024, h: 682 },
    onDark: { src: "/brand/logo.png", w: 1024, h: 682 },
  },
  mark: {
    onLight: { src: "/brand/iso.png", w: 377, h: 377 },
    onDark: { src: "/brand/iso-light.png", w: 377, h: 377 },
  },
} as const;

/**
 * Logo Crambie según manual:
 * - no rotar / no distorsionar
 * - ancho mínimo digital 120px (versión logo)
 * - fondo limpio (crema o carbón sólido)
 */
export function BianbiLogo({
  variant = "logo",
  href = "/",
  className = "",
  tone = "onLight",
  priority = false,
}: Props) {
  const asset = ASSETS[variant][tone];

  const img = (
    <Image
      src={asset.src}
      alt="Crambie"
      width={asset.w}
      height={asset.h}
      priority={priority}
      className={`h-auto w-auto max-w-full object-contain object-left ${className}`}
      style={{
        width: "auto",
        height: "auto",
        maxHeight: variant === "logo" ? "2.75rem" : "2.5rem",
        maxWidth: variant === "logo" ? "11rem" : "2.5rem",
      }}
    />
  );

  const wrapClass = "ms-logo-safe inline-flex items-center leading-none";

  if (href === null) {
    return <span className={wrapClass}>{img}</span>;
  }

  return (
    <Link href={href} className={wrapClass} aria-label="Crambie">
      {img}
    </Link>
  );
}

export function BianbiMark({
  className = "",
  tone = "onLight",
}: {
  className?: string;
  tone?: "onLight" | "onDark";
}) {
  return (
    <BianbiLogo variant="mark" href={null} tone={tone} className={className} />
  );
}
