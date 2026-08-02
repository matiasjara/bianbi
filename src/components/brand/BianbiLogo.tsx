import Image from "next/image";
import Link from "next/link";
import { CRAMBIE_LOGO } from "@/lib/brand/logos";

type Props = {
  /** logo = wordmark completo; mark = isotipo pin */
  variant?: "logo" | "mark";
  href?: string | null;
  className?: string;
  /** sm = nav; md = default; lg = hero / portada */
  size?: "sm" | "md" | "lg";
  /**
   * onLight — fondos crema / claros
   * onDark — fondos carbón / oscuros sólidos (footer)
   */
  tone?: "onLight" | "onDark";
  priority?: boolean;
};

const LOGO_SIZE_CLASS = {
  sm: "max-h-10 max-w-[14rem]",
  md: "max-h-[3.75rem] max-w-[22rem]",
  lg: "max-h-20 max-w-[28rem]",
} as const;

const ASSETS = {
  logo: CRAMBIE_LOGO,
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
  size = "md",
  tone = "onLight",
  priority = false,
}: Props) {
  const asset = ASSETS[variant][tone];
  const sizeClass =
    variant === "logo" ? LOGO_SIZE_CLASS[size] : "max-h-10 max-w-10";

  const img = (
    <Image
      src={asset.src}
      alt="Crambie"
      width={asset.w}
      height={asset.h}
      priority={priority}
      className={`h-auto w-auto object-contain object-left ${sizeClass} ${className}`}
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
