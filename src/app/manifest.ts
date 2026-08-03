import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crambie",
    short_name: "Crambie",
    description:
      "Guías de eventos y alojamiento en Santiago: fechas, tips, transporte y dónde quedarte cerca.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F0E8",
    theme_color: "#161A22",
    lang: "es",
    icons: [
      {
        src: "/brand/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/pwa-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
