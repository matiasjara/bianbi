import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Fraunces, Manrope, Syne } from "next/font/google";
import { SITE_URL } from "@/lib/site/url";
import "./globals.css";

/** Tipografía principal — geométrica (logo, nav, datos) */
const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

/** Tipografía secundaria — editorial serif (titulares, relatos) */
const editorial = Fraunces({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Crambie — Guías de eventos y alojamiento en Santiago",
    template: "%s · Crambie",
  },
  description:
    "Guías concretas de conciertos, partidos y eventos en Santiago: fechas, tips, transporte y dónde alojarte cerca.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Crambie",
  appleWebApp: {
    capable: true,
    title: "Crambie",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

const GTM_ID = "GTM-MGG27CP6";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${editorial.variable} ${body.variable} h-full`}
    >
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
