import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";
import { Header } from "@/kitchencare/components/layout/Header";
import { Footer } from "@/kitchencare/components/layout/Footer";
import { DemoBanner } from "@/kitchencare/components/layout/DemoBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KitchenCare — Demo",
    template: "%s | KitchenCare",
  },
  robots: PRIVATE_ROBOTS,
};

export default function KitchenCareDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${playfair.variable} kc-demo flex min-h-screen flex-col`}
    >
      <DemoBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
