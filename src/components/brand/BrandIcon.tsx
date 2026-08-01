import type { ComponentType } from "react";
import {
  Bed,
  Calendar,
  Camera,
  Info,
  MapPin,
  Medal,
  Megaphone,
  MusicNotes,
  Path,
  Snowflake,
  SoccerBall,
  Star,
  Suitcase,
  SunHorizon,
  Train,
} from "@phosphor-icons/react/dist/ssr";
import type { BrandIconName } from "@/lib/brand/icons";

type PhosphorIcon = ComponentType<{
  size?: number | string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}>;

type Props = {
  name: BrandIconName;
  /** Tamaño en px. Default 36 */
  size?: number;
  /**
   * onLight — trazo carbón (fondos crema)
   * onDark — trazo blanco (botones/fondos oscuros)
   */
  tone?: "onLight" | "onDark";
  className?: string;
  alt?: string;
};

const ICONS: Record<BrandIconName, PhosphorIcon> = {
  pin: MapPin,
  music: MusicNotes,
  soccer: SoccerBall,
  medal: Medal,
  snowflake: Snowflake,
  luggage: Suitcase,
  camera: Camera,
  bed: Bed,
  calendar: Calendar,
  sunrise: SunHorizon,
  star: Star,
  megaphone: Megaphone,
  route: Path,
  train: Train,
  info: Info,
};

/** Icono de marca — Phosphor Regular, alineado al trazo editorial Bianbi. */
export function BrandIcon({
  name,
  size = 36,
  tone = "onLight",
  className = "",
  alt,
}: Props) {
  const Icon = ICONS[name];
  const color =
    tone === "onDark" ? "text-white" : "text-[var(--ms-ink,#161A22)]";

  return (
    <Icon
      size={size}
      weight="regular"
      className={`shrink-0 ${color} ${className}`}
      aria-hidden={alt ? undefined : true}
      aria-label={alt}
    />
  );
}
