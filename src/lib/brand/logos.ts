/** Wordmarks Crambie — única fuente de verdad para rutas y dimensiones */
export const CRAMBIE_LOGO = {
  /** Navy / carbón — fondos crema y claros */
  onLight: {
    src: "/brand/logo-dark.png",
    path: "public/brand/logo-dark.png",
    w: 743,
    h: 108,
  },
  /** Blanco — fondos carbón y oscuros */
  onDark: {
    src: "/brand/logo.png",
    path: "public/brand/logo.png",
    w: 767,
    h: 109,
  },
} as const;

export type CrambieLogoTone = keyof typeof CRAMBIE_LOGO;
