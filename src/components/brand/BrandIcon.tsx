import Image from "next/image";
import {
  brandIconSrc,
  type BrandIconId,
  type BrandIconName,
} from "@/lib/brand/icons";

type Props = {
  name: BrandIconName | BrandIconId;
  /** Tamaño en px (cuadrado). Default 36 — iconos ya normalizados ópticamente */
  size?: number;
  /**
   * onLight — trazo carbón (fondos crema / botones claros)
   * onDark — trazo blanco (botones/fondos oscuros)
   */
  tone?: "onLight" | "onDark";
  className?: string;
  alt?: string;
};

/** Icono de marca desde el sprite Bianbi (PNG transparente, recortado al contenido). */
export function BrandIcon({
  name,
  size = 36,
  tone = "onLight",
  className = "",
  alt = "",
}: Props) {
  const invert = tone === "onDark" ? "brightness-0 invert" : "";
  return (
    <Image
      src={brandIconSrc(name)}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block object-contain ${invert} ${className}`}
      aria-hidden={alt ? undefined : true}
    />
  );
}
