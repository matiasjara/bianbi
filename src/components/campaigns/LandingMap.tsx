"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { METRO_LOGO_SRC } from "@/lib/demand/santiago-map-pois";
import {
  layoutMapMarkers,
  type MapMarker,
} from "@/lib/demand/map-marker-layout";

export type { MapMarker };

type Props = {
  markers: MapMarker[];
  className?: string;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pinHtml(marker: MapMarker) {
  const label = escapeHtml(marker.label);

  if (marker.kind === "metro") {
    return `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-4px)">
      <div style="width:34px;height:34px;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.28);border:2px solid #fff;background:#c8102e">
        <img src="${METRO_LOGO_SRC}" alt="" width="34" height="34" style="display:block;width:100%;height:100%;object-fit:cover" />
      </div>
      <div style="margin-top:4px;background:#fff;color:#161A22;font:600 10px/1.2 system-ui,sans-serif;padding:3px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 6px rgba(0,0,0,.18);max-width:120px;overflow:hidden;text-overflow:ellipsis">${label.replace(/^Metro /, "")}</div>
      <span style="position:absolute;width:1px;height:1px;overflow:hidden">${label}</span>
    </div>`;
  }

  const bg = marker.kind === "property" ? "#FF5A5F" : "#222222";
  const title =
    marker.kind === "property"
      ? "Alojamiento"
      : marker.kind === "landmark"
        ? label.length > 18
          ? `${label.slice(0, 16)}…`
          : label
        : "Evento";

  return `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-4px)">
    <div style="background:${bg};color:#fff;font:600 11px/1.2 system-ui,sans-serif;padding:6px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25);max-width:140px;overflow:hidden;text-overflow:ellipsis">${title}</div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${bg}"></div>
    <span style="position:absolute;width:1px;height:1px;overflow:hidden">${label}</span>
  </div>`;
}

function popupHtml(marker: MapMarker) {
  const label = escapeHtml(marker.label);
  if (marker.kind === "metro") {
    return `<strong>Metro</strong><br/>${label}`;
  }
  if (marker.kind === "landmark") {
    return `<strong>Punto de interés</strong><br/>${label}`;
  }
  if (marker.kind === "venue") {
    return `<strong>Evento</strong><br/>${label}`;
  }
  return `<strong>Alojamiento</strong><br/>${label}`;
}

function iconSize(marker: MapMarker): [number, number] {
  if (marker.kind === "metro") return [120, 56];
  if (marker.kind === "landmark") return [140, 44];
  return [88, 40];
}

function iconAnchor(marker: MapMarker): [number, number] {
  const [w, h] = iconSize(marker);
  return [w / 2, h];
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

      const placed = layoutMapMarkers(markers);
      const bounds = L.latLngBounds([]);
      for (const m of placed) {
        const icon = L.divIcon({
          className: "",
          html: pinHtml(m),
          iconSize: iconSize(m),
          iconAnchor: iconAnchor(m),
        });
        L.marker([m.lat, m.lng], {
          icon,
          zIndexOffset:
            m.kind === "property" ? 200 : m.kind === "metro" ? 100 : 50,
        })
          .addTo(map)
          .bindPopup(popupHtml(m));
        bounds.extend([m.lat, m.lng]);
      }

      if (placed.length === 1) {
        map.setView([placed[0].lat, placed[0].lng], 15);
      } else {
        map.fitBounds(bounds.pad(0.18));
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
      aria-label="Mapa con alojamientos, puntos de interés y estaciones de metro"
    />
  );
}
