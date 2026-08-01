/**
 * Manual de marca Bianbi — tokens oficiales.
 * Fuente: Sistema visual (paleta + tipografía + reglas de logo).
 */
export const BRAND = {
  colors: {
    carbon: "#161A22",
    crema: "#F4F0E8",
    arena: "#D9D4CA",
    terracota: "#D96A4B",
    oliva: "#7B8B3E",
    azulAgua: "#7FB7C5",
    mostaza: "#E1B53A",
    coral: "#EF7A82",
  },
  logo: {
    /** Ancho mínimo digital (px) */
    minWidthPx: 120,
    /** No rotar, no distorsionar, no sobre fotos ocupadas */
    rules: [
      "no-stretch",
      "no-rotate",
      "no-recolor-proportions",
      "clean-background",
    ] as const,
  },
  fonts: {
    primary: "geometric-sans", // Syne / Manrope — logo, nav, datos
    secondary: "editorial-serif", // Fraunces — titulares y relatos
  },
} as const;

export type BrandColor = keyof typeof BRAND.colors;
