"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  METRO_LOGO_SRC,
  resolveCustomVenuePin,
} from "@/lib/demand/santiago-map-pois";
import {
  layoutMapMarkers,
  type MapMarker,
} from "@/lib/demand/map-marker-layout";

export type { MapMarker };

type Props = {
  markers: MapMarker[];
  className?: string;
  /** Suma niveles de zoom tras encuadrar marcadores (p. ej. 2 ≈ dos clics en +). */
  initialZoomBoost?: number;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LABEL_STYLE =
  "background:#fff;color:#161A22;font:600 10px/1.25 system-ui,sans-serif;padding:4px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 6px rgba(0,0,0,.18);max-width:148px;overflow:hidden;text-overflow:ellipsis";

const DARK_LABEL_STYLE =
  "background:#222222;color:#fff;font:600 10px/1.25 system-ui,sans-serif;padding:4px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25);max-width:128px;overflow:hidden;text-overflow:ellipsis";

const METRO_ICON_PX = 22;
const VENUE_ICON_PX = 28;
const METRO_PIN_W = 188;
const VENUE_PIN_W = 168;
const VENUE_PIN_H = 36;
const VENUE_ICON_GAP = 6;

/** Venue con icono custom: icono a la izquierda, nombre a la derecha (fondo negro, texto blanco). */
function customVenuePinHtml(iconSrc: string, displayLabel: string, label: string) {
  const text = escapeHtml(displayLabel);
  return `<div style="position:relative;width:${VENUE_PIN_W}px;height:${VENUE_PIN_H}px">
    <div style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:${VENUE_ICON_PX}px;height:${VENUE_ICON_PX}px;filter:drop-shadow(0 1px 4px rgba(0,0,0,.2))">
      <img src="${iconSrc}" alt="" width="${VENUE_ICON_PX}" height="${VENUE_ICON_PX}" style="display:block;width:100%;height:100%;object-fit:contain" />
    </div>
    <div style="position:absolute;left:${VENUE_ICON_PX + VENUE_ICON_GAP}px;top:50%;transform:translateY(-50%);${DARK_LABEL_STYLE}">${text}</div>
    <span style="position:absolute;width:1px;height:1px;overflow:hidden">${escapeHtml(label)}</span>
  </div>`;
}

/** Metro: globo a la izquierda, icono anclado al punto real (derecha del pin). */
function metroPinHtml(label: string) {
  const text = escapeHtml(label.startsWith("Metro ") ? label : `Metro ${label}`);
  const w = METRO_PIN_W;
  const h = 32;
  const gap = 4;
  return `<div style="position:relative;width:${w}px;height:${h}px">
    <div style="position:absolute;right:${METRO_ICON_PX + gap}px;top:50%;transform:translateY(-50%);${LABEL_STYLE}">${text}</div>
    <div style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:${METRO_ICON_PX}px;height:${METRO_ICON_PX}px;border-radius:50%;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.22);border:1.5px solid #fff;background:#c8102e">
      <img src="${METRO_LOGO_SRC}" alt="" width="${METRO_ICON_PX}" height="${METRO_ICON_PX}" style="display:block;width:100%;height:100%;object-fit:cover" />
    </div>
    <span style="position:absolute;width:1px;height:1px;overflow:hidden">${escapeHtml(label)}</span>
  </div>`;
}

/** Alojamiento: solo etiqueta «Alojamiento» centrada en el punto. */
function propertyPinHtml(label: string) {
  const bg = "#FF5A5F";
  return `<div style="display:flex;flex-direction:column;align-items:center;width:96px;transform:translateY(-4px)">
    <div style="background:${bg};color:#fff;font:600 11px/1.2 system-ui,sans-serif;padding:6px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25)">Alojamiento</div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${bg}"></div>
    <span style="position:absolute;width:1px;height:1px;overflow:hidden">${escapeHtml(label)}</span>
  </div>`;
}

/** Evento / POI: globo centrado sobre el punto. */
function centerPinHtml(marker: MapMarker) {
  const label = escapeHtml(marker.label);
  const bg = "#222222";
  const title =
    marker.kind === "landmark"
      ? label.length > 18
        ? `${label.slice(0, 16)}…`
        : label
      : "Evento";
  return `<div style="display:flex;flex-direction:column;align-items:center;width:144px;transform:translateY(-4px)">
    <div style="background:${bg};color:#fff;font:600 11px/1.2 system-ui,sans-serif;padding:6px 10px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25);max-width:140px;overflow:hidden;text-overflow:ellipsis">${title}</div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${bg}"></div>
    <span style="position:absolute;width:1px;height:1px;overflow:hidden">${label}</span>
  </div>`;
}

function pinHtml(marker: MapMarker) {
  if (marker.kind === "metro") return metroPinHtml(marker.label);
  if (marker.kind === "property") return propertyPinHtml(marker.label);
  const customVenue = resolveCustomVenuePin(marker.label);
  if (customVenue) {
    return customVenuePinHtml(
      customVenue.iconSrc,
      customVenue.displayLabel,
      marker.label,
    );
  }
  return centerPinHtml(marker);
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
  if (marker.kind === "metro") return [METRO_PIN_W, 32];
  if (marker.kind === "property") return [96, 40];
  if (resolveCustomVenuePin(marker.label)) return [VENUE_PIN_W, VENUE_PIN_H];
  return [144, 44];
}

/** Ancla = coordenada geográfica exacta del marcador. */
function iconAnchor(marker: MapMarker): [number, number] {
  if (marker.kind === "metro") return [METRO_PIN_W - 11, 16];
  if (marker.kind === "property") return [48, 40];
  if (resolveCustomVenuePin(marker.label)) return [14, 18];
  return [72, 44];
}

function popupOptions(marker: MapMarker) {
  if (marker.kind === "metro") {
    return { direction: "left" as const, offset: [0, -8] as [number, number] };
  }
  if (resolveCustomVenuePin(marker.label)) {
    return { direction: "right" as const, offset: [0, -8] as [number, number] };
  }
  if (marker.kind === "property") {
    return { direction: "top" as const, offset: [0, -4] as [number, number] };
  }
  return { direction: "top" as const, offset: [0, -4] as [number, number] };
}

export function LandingMap({ markers, className, initialZoomBoost = 0 }: Props) {
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
          .bindPopup(popupHtml(m), popupOptions(m));
        bounds.extend([m.lat, m.lng]);
      }

      if (placed.length === 1) {
        map.setView([placed[0].lat, placed[0].lng], 15 + initialZoomBoost);
      } else {
        map.fitBounds(bounds.pad(0.18));
        if (initialZoomBoost > 0) {
          map.setZoom(
            Math.min(map.getZoom() + initialZoomBoost, map.getMaxZoom()),
          );
        }
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
  }, [markers, initialZoomBoost]);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-80 w-full"}
      role="img"
      aria-label="Mapa con alojamientos, puntos de interés y estaciones de metro"
    />
  );
}
