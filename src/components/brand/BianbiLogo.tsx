import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand/tokens";

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
    onLight: { src: "/brand/logo-dark.png", w: 830, h: 135 },
    onDark: { src: "/brand/logo.png", w: 830, h: 135 },
  },
  mark: {
    onLight: { src: "/brand/iso.png", w: 377, h: 377 },
    onDark: { src: "/brand/iso-light.png", w: 377, h: 377 },
  },
} as const;

/**
 * Logo Bianbi según manual:
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
  const minW =
    variant === "logo" ? BRAND.logo.minWidthPx : Math.round(BRAND.logo.minWidthPx * 0.45);

  const img = (
    <Image
      src={asset.src}
      alt="Bianbi"
      width={asset.w}
      height={asset.h}
      priority={priority}
      className={`h-auto w-auto max-w-full object-contain object-left ${className}`}
      style={{
        minWidth: minW,
        width: "auto",
        height: "auto",
        maxHeight: variant === "logo" ? "3.25rem" : "2.5rem",
      }}
    />
  );

  const wrapClass = "ms-logo-safe inline-flex items-center leading-none";

  if (href === null) {
    return <span className={wrapClass}>{img}</span>;
  }

  return (
    <Link href={href} className={wrapClass} aria-label="Bianbi">
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
