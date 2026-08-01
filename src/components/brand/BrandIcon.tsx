import Image from "next/image";
import {
  brandIconSrc,
  type BrandIconId,
  type BrandIconName,
} from "@/lib/brand/icons";

type Props = {
  name: BrandIconName | BrandIconId;
  /** Tamaño en px (cuadrado). Default 28 */
  size?: number;
  className?: string;
  alt?: string;
};

/** Icono de marca desde el sprite Bianbi (PNG transparente). */
export function BrandIcon({
  name,
  size = 28,
  className = "",
  alt = "",
}: Props) {
  return (
    <Image
      src={brandIconSrc(name)}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block object-contain ${className}`}
      aria-hidden={alt ? undefined : true}
    />
  );
}
