"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  kind: "venue" | "property";
};

type Props = {
  markers: MapMarker[];
  className?: string;
};

function pinHtml(kind: MapMarker["kind"], label: string) {
  const bg = kind === "venue" ? "#222222" : "#FF5A5F";
  const title = kind === "venue" ? "Evento" : "Alojamiento";
  return `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-4px)">
    <div style="background:${bg};color:#fff;font:600 11px/1.2 system-ui,sans-serif;padding:6px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25)">${title}</div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${bg}"></div>
    <span style="position:absolute;width:1px;height:1px;overflow:hidden">${label}</span>
  </div>`;
}

export function LandingMap({ markers, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || markers.length === 0) return;
    let cancelled = false;

    async function init() {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      for (const m of markers) {
        const icon = L.divIcon({
          className: "",
          html: pinHtml(m.kind, m.label),
          iconSize: [88, 40],
          iconAnchor: [44, 40],
        });
        const popup =
          m.kind === "venue"
            ? `<strong>Evento</strong><br/>${m.label}`
            : `<strong>Alojamiento</strong><br/>${m.label}`;
        L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popup);
        bounds.extend([m.lat, m.lng]);
      }

      if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lng], 15);
      } else {
        map.fitBounds(bounds.pad(0.22));
      }
    }

    void init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-80 w-full"}
      role="img"
      aria-label="Mapa con evento y alojamientos"
    />
  );
}
