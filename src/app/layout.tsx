import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bianbi — Guías de eventos y alojamiento en Santiago",
    template: "%s · Bianbi",
  },
  description:
    "Guías concretas de conciertos, partidos y eventos en Santiago: fechas, tips, transporte y dónde alojarte cerca.",
  metadataBase: new URL("https://bianbi.cl"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
